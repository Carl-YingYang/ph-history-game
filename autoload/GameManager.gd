## GameManager.gd  (autoload: GameManager)
##
## Central runtime state holder. Mirrors src/game/game-state.ts from the Phaser
## source: player character, health, max health, XP, level, quest stage, play
## time, plus references to the other systems. All mutations emit EventBus
## signals so the HUD reacts without polling.
extends Node

# ── Runtime state ─────────────────────────────────────────────────
var player_char: String = "rizal"
var health: int = GameConstants.START_HEALTH
var max_health: int = GameConstants.START_MAX_HEALTH
var xp: int = GameConstants.START_XP
var level: int = GameConstants.START_LEVEL
var quest_stage: String = "intro"
var defeated: Array[String] = []
var spoken_to: Array[String] = []
var play_time: float = 0.0          # seconds
var muted: bool = false
var paused: bool = false

# ── Run flags ─────────────────────────────────────────────────────
var current_scene_path: String = ""
var spawn_key: String = ""          # for world transitions
var cutscene_locked: bool = false   # disables player input during cutscenes
var hud_layer: CanvasLayer = null   # set by HUD on ready

signal state_changed


func _ready() -> void:
	EventBus.player_died.connect(_on_player_died)
	EventBus.scene_change_requested.connect(_on_scene_change_requested)
	EventBus.mute_toggled.connect(_on_mute_toggled)
	EventBus.enemy_defeated.connect(_on_enemy_defeated)
	EventBus.npc_spoken.connect(_on_npc_spoken)
	EventBus.quest_stage_changed.connect(_on_quest_stage_changed)


func _process(delta: float) -> void:
	if not paused:
		play_time += delta


# ── Public mutation API ───────────────────────────────────────────
func set_player_char(key: String) -> void:
	player_char = key
	EventBus.player_char_changed.emit(key)
	_save_async()
	state_changed.emit()


func damage(amount: int) -> int:
	health = maxi(0, health - amount)
	EventBus.player_health_changed.emit(health, max_health)
	EventBus.player_hit.emit(amount)
	if health <= 0:
		EventBus.player_died.emit()
	_save_async()
	state_changed.emit()
	return health


func heal(amount: int) -> int:
	health = mini(max_health, health + amount)
	EventBus.player_health_changed.emit(health, max_health)
	_save_async()
	state_changed.emit()
	return health


func add_xp(amount: int) -> void:
	xp += amount
	var threshold := level * GameConstants.XP_PER_LEVEL_BASE
	EventBus.player_xp_changed.emit(xp, threshold)
	while xp >= threshold:
		xp -= threshold
		level += 1
		max_health += GameConstants.HEALTH_PER_LEVEL
		health = max_health
		threshold = level * GameConstants.XP_PER_LEVEL_BASE
		EventBus.player_level_changed.emit(level)
		EventBus.player_health_changed.emit(health, max_health)
		EventBus.toast_requested.emit("Level %d!" % level, Color(1.0, 0.85, 0.4))
	EventBus.player_xp_changed.emit(xp, threshold)
	_save_async()
	state_changed.emit()


func mark_defeated(enemy_id: String) -> void:
	if defeated.has(enemy_id): return
	defeated.append(enemy_id)
	add_xp(GameConstants.XP_PER_ENEMY)
	_save_async()
	state_changed.emit()


func mark_spoken(npc_key: String) -> void:
	if spoken_to.has(npc_key): return
	spoken_to.append(npc_key)
	_save_async()
	state_changed.emit()


func set_quest_stage(stage: String) -> void:
	if quest_stage == stage: return
	quest_stage = stage
	EventBus.quest_stage_changed.emit("main", stage)
	_refresh_objective(stage)
	_save_async()
	state_changed.emit()


func _refresh_objective(stage: String) -> void:
	var obj := ""
	match stage:
		"intro":    obj = "Speak with María Clara in the plaza."
		"gather":   obj = "Recover the 6 hidden relics across San Diego."
		"return":   obj = "Return the relics to María Clara."
		"complete": obj = "The quest is complete. Explore San Diego."
		_:          obj = ""
	EventBus.quest_objective_updated.emit(obj)


func full_heal() -> void:
	health = max_health
	EventBus.player_health_changed.emit(health, max_health)
	state_changed.emit()


func reset_run() -> void:
	health = GameConstants.START_HEALTH
	max_health = GameConstants.START_MAX_HEALTH
	xp = GameConstants.START_XP
	level = GameConstants.START_LEVEL
	quest_stage = "intro"
	defeated.clear()
	spoken_to.clear()
	play_time = 0.0
	EventBus.player_health_changed.emit(health, max_health)
	EventBus.player_xp_changed.emit(xp, level * GameConstants.XP_PER_LEVEL_BASE)
	EventBus.player_level_changed.emit(level)
	_refresh_objective("intro")
	state_changed.emit()


# ── Signal handlers ───────────────────────────────────────────────
func _on_player_died() -> void:
	# Respawn after a beat (mirrors arcade-style soft respawn).
	await get_tree().create_timer(1.5).timeout
	health = max_health
	EventBus.player_health_changed.emit(health, max_health)
	EventBus.player_respawned.emit()
	# Warp to town centre.
	EventBus.scene_change_requested.emit("res://scenes/maps/SanDiego.tscn", "spawn_center")


func _on_scene_change_requested(scene_path: String, sk: String) -> void:
	spawn_key = sk
	current_scene_path = scene_path
	# Fade out, swap, fade in.
	EventBus.fade_requested.emit(Color.BLACK, 0.4, true)
	await get_tree().create_timer(0.45).timeout
	get_tree().change_scene_to_file(scene_path)
	EventBus.fade_requested.emit(Color.BLACK, 0.4, false)


func _on_mute_toggled(m: bool) -> void:
	muted = m
	_save_async()


func _on_enemy_defeated(enemy_id: String, _xp: int) -> void:
	mark_defeated(enemy_id)


func _on_npc_spoken(npc_key: String) -> void:
	mark_spoken(npc_key)


func _on_quest_stage_changed(_q: String, stage: String) -> void:
	if stage != quest_stage:
		set_quest_stage(stage)


# ── Save bridge (debounced) ──────────────────────────────────────
var _save_queued: bool = false
func _save_async() -> void:
	if _save_queued: return
	_save_queued = true
	await get_tree().create_timer(0.5).timeout
	_save_queued = false
	SaveManager.autosave()
