## SaveManager.gd  (autoload: SaveManager)
##
## Native Godot save system (replaces localStorage from the Phaser source).
## JSON-serialized save slots in user://save_slots/. Supports:
##   - autosave()            : silent write to slot "auto"
##   - save_slot(slot)       : manual write to slot 0..MAX-1
##   - load_slot(slot)       : restore GameManager state
##   - has_save(slot)        : existence check
##   - list_slots()          : metadata for the load menu
##   - delete_slot(slot)
##
## Save schema (version 1):
##   { version, player_char, health, max_health, xp, level, inventory[],
##     defeated[], spoken_to[], quest_stage, play_time, scene_path, spawn_key,
##     codex_unlocked[], journal_entries[], saved_at }
extends Node

const AUTOSLOT := "auto"


func _ready() -> void:
	DirAccess.make_dir_recursive_absolute(GameConstants.SAVE_DIR)
	# Periodic autosave every AUTOSAVE_INTERVAL.
	var t := Timer.new()
	t.name = "AutosaveTimer"
	t.wait_time = GameConstants.AUTOSAVE_INTERVAL
	t.autostart = true
	t.timeout.connect(autosave)
	add_child(t)


func _slot_path(slot: String) -> String:
	return GameConstants.SAVE_DIR + "save_%s.json" % slot


func has_save(slot: String = AUTOSLOT) -> bool:
	return FileAccess.file_exists(_slot_path(slot))


func list_slots() -> Array:
	var out: Array = []
	for i in range(GameConstants.MAX_SAVE_SLOTS):
		var s := str(i)
		if has_save(s):
			out.append({"slot": s, "meta": _read_meta(s)})
		else:
			out.append({"slot": s, "meta": null})
	if has_save(AUTOSLOT):
		out.append({"slot": AUTOSLOT, "meta": _read_meta(AUTOSLOT)})
	return out


func _read_meta(slot: String) -> Dictionary:
	var f := FileAccess.open(_slot_path(slot), FileAccess.READ)
	if not f: return {}
	var data = JSON.parse_string(f.get_as_text())
	if typeof(data) != TYPE_DICTIONARY: return {}
	return {
		"player_char": data.get("player_char", "rizal"),
		"level": data.get("level", 1),
		"quest_stage": data.get("quest_stage", "intro"),
		"play_time": data.get("play_time", 0.0),
		"saved_at": data.get("saved_at", 0),
	}


func _build_save_data() -> Dictionary:
	return {
		"version": GameConstants.SAVE_VERSION,
		"player_char": GameManager.player_char,
		"health": GameManager.health,
		"max_health": GameManager.max_health,
		"xp": GameManager.xp,
		"level": GameManager.level,
		"inventory": InventoryManager.inventory.duplicate(),
		"defeated": GameManager.defeated.duplicate(),
		"spoken_to": GameManager.spoken_to.duplicate(),
		"quest_stage": GameManager.quest_stage,
		"play_time": GameManager.play_time,
		"scene_path": GameManager.current_scene_path,
		"spawn_key": GameManager.spawn_key,
		"codex_unlocked": CodexManager.unlocked_entries.duplicate(),
		"journal_entries": CodexManager.journal_entries.duplicate(),
		"muted": GameManager.muted,
		"saved_at": Time.get_unix_time_from_system(),
	}


func _write(slot: String) -> bool:
	var data := _build_save_data()
	var f := FileAccess.open(_slot_path(slot), FileAccess.WRITE)
	if not f:
		push_warning("SaveManager: cannot open %s" % _slot_path(slot))
		return false
	f.store_string(JSON.stringify(data, "  "))
	f.close()
	return true


func autosave() -> void:
	if GameManager.current_scene_path == "": return  # nothing to save yet
	_write(AUTOSLOT)


func save_slot(slot: String) -> bool:
	return _write(slot)


func load_slot(slot: String) -> bool:
	var f := FileAccess.open(_slot_path(slot), FileAccess.READ)
	if not f: return false
	var data = JSON.parse_string(f.get_as_text())
	if typeof(data) != TYPE_DICTIONARY: return false

	GameManager.player_char = data.get("player_char", "rizal")
	GameManager.health = int(data.get("health", GameConstants.START_HEALTH))
	GameManager.max_health = int(data.get("max_health", GameConstants.START_MAX_HEALTH))
	GameManager.xp = int(data.get("xp", GameConstants.START_XP))
	GameManager.level = int(data.get("level", GameConstants.START_LEVEL))
	GameManager.defeated.assign(data.get("defeated", []))
	GameManager.spoken_to.assign(data.get("spoken_to", []))
	GameManager.quest_stage = data.get("quest_stage", "intro")
	GameManager.play_time = float(data.get("play_time", 0.0))
	GameManager.muted = bool(data.get("muted", false))
	GameManager.current_scene_path = data.get("scene_path", "")
	GameManager.spawn_key = data.get("spawn_key", "")

	InventoryManager.inventory.assign(data.get("inventory", []))
	CodexManager.unlocked_entries.assign(data.get("codex_unlocked", []))
	CodexManager.journal_entries.assign(data.get("journal_entries", []))

	# Emit refresh signals so HUD/UI catch up.
	EventBus.player_health_changed.emit(GameManager.health, GameManager.max_health)
	EventBus.player_xp_changed.emit(GameManager.xp, GameManager.level * GameConstants.XP_PER_LEVEL_BASE)
	EventBus.player_level_changed.emit(GameManager.level)
	EventBus.player_char_changed.emit(GameManager.player_char)
	EventBus.quest_stage_changed.emit("main", GameManager.quest_stage)
	EventBus.hud_refresh_requested.emit()
	GameManager.state_changed.emit()
	return true


func delete_slot(slot: String) -> void:
	var path := _slot_path(slot)
	if FileAccess.file_exists(path):
		DirAccess.remove_absolute(path)
