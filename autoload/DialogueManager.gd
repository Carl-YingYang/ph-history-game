## DialogueManager.gd  (autoload: DialogueManager)
##
## Professional RPG dialogue runner. Loads dialogue JSON files from
## res://dialogues/*.json and plays them through the DialogueBox UI scene.
## Supports: portrait, typewriter, branching choices, camera lock, quest
## hooks, item grants, and per-stage conditional lines.
##
## Dialogue JSON schema:
##   {
##     "speaker": "clara",
##     "name": "María Clara",
##     "portrait_anim": "portrait",
##     "lines": [ "line one", "line two" ],
##     "choices": [ { "text": "...", "next": "dialogue_id", "action": "advance:gather" } ],
##     "on_finish": [ "advance:gather", "grant_item:relic_letter" ]
##   }
extends Node

var dialogue_box_scene: PackedScene
var active_box: Control = null
var current_data: Dictionary = {}
var current_lines: Array[String] = []
var line_index: int = 0
var camera_locked: bool = false


func _ready() -> void:
	var p := "res://scenes/ui/DialogueBox.tscn"
	if ResourceLoader.exists(p):
		dialogue_box_scene = load(p)
	EventBus.choice_made.connect(_on_choice_made)


func is_active() -> bool:
	return active_box != null and is_instance_valid(active_box)


func start_dialogue_file(path: String) -> void:
	var f := FileAccess.open(path, FileAccess.READ)
	if not f:
		push_warning("DialogueManager: missing %s" % path)
		return
	var data = JSON.parse_string(f.get_as_text())
	if typeof(data) != TYPE_DICTIONARY: return
	start_dialogue(data)


func start_dialogue(data: Dictionary) -> void:
	if is_active(): return
	current_data = data
	# Resolve lines (may be stage-conditional via quest_lines).
	if data.has("quest_lines") and data["quest_lines"].has(GameManager.quest_stage):
		current_lines.assign(data["quest_lines"][GameManager.quest_stage])
	elif data.has("quest_lines") and not GameManager.spoken_to.has(data.get("speaker", "")):
		current_lines.assign(data.get("lines", []))
	else:
		# After first interaction, use main lines (mirrors Phaser behaviour).
		current_lines.assign(data.get("lines", []))
	line_index = 0

	# Spawn the dialogue box on the HUD layer.
	if dialogue_box_scene == null:
		var p := "res://scenes/ui/DialogueBox.tscn"
		if ResourceLoader.exists(p):
			dialogue_box_scene = load(p)
	if dialogue_box_scene and GameManager.hud_layer:
		active_box = dialogue_box_scene.instantiate()
		GameManager.hud_layer.add_child(active_box)
		active_box.setup(data)
	elif GameManager.hud_layer:
		# Fallback minimal box if scene missing.
		active_box = Control.new()
		GameManager.hud_layer.add_child(active_box)

	camera_locked = true
	GameManager.cutscene_locked = true
	EventBus.dialogue_started.emit(data.get("speaker", ""))
	_show_current_line()


func _show_current_line() -> void:
	if line_index >= current_lines.size():
		finish()
		return
	var line: String = current_lines[line_index]
	var speaker: String = current_data.get("name", current_data.get("speaker", ""))
	EventBus.dialogue_line_shown.emit(speaker, line)
	if active_box and active_box.has_method("show_line"):
		active_box.show_line(speaker, line, current_data.get("portrait_anim", "portrait"),
							  current_data.get("speaker", ""))


func advance() -> void:
	if not is_active(): return
	# If the box is still typing, snap to full line first.
	if active_box and active_box.has_method("is_typing") and active_box.is_typing():
		active_box.snap_to_full()
		return
	# If choices are pending, advance is ignored (player must pick).
	if active_box and active_box.has_method("has_pending_choices") and active_box.has_pending_choices():
		return
	line_index += 1
	_show_current_line()


func finish() -> void:
	# Run on_finish hooks.
	for hook in current_data.get("on_finish", []):
		_run_hook(hook)
	# Mark NPC spoken.
	var spk := current_data.get("speaker", "")
	if spk != "":
		EventBus.npc_spoken.emit(spk)
	# Auto-advance quest stage if requested.
	var adv := current_data.get("advance_quest_stage", "")
	if adv != "":
		QuestManager.advance_to(adv)
	var speaker: String = current_data.get("speaker", "")
	if active_box and is_instance_valid(active_box):
		active_box.queue_free()
	active_box = null
	camera_locked = false
	GameManager.cutscene_locked = false
	EventBus.dialogue_finished.emit(speaker)


func _on_choice_made(index: int) -> void:
	var choices: Array = current_data.get("choices", [])
	if index < 0 or index >= choices.size(): return
	var choice: Dictionary = choices[index]
	var action: String = choice.get("action", "")
	if action != "":
		_run_hook(action)
	var nxt: String = choice.get("next", "")
	if nxt != "":
		# Load the linked dialogue file and chain it.
		var path := "res://dialogues/%s.json" % nxt
		finish()
		start_dialogue_file(path)
	else:
		finish()


func _run_hook(hook: String) -> void:
	var parts := hook.split(":")
	match parts[0]:
		"advance":
			QuestManager.advance_to(parts[1])
		"grant_item":
			EventBus.item_collected.emit(parts[1])
		"grant_xp":
			GameManager.add_xp(int(parts[1]))
		"unlock_codex":
			EventBus.codex_entry_unlocked.emit(parts[1])
		"heal":
			GameManager.heal(int(parts[1]))
