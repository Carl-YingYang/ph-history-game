## QuestManager.gd  (autoload: QuestManager)
##
## Data-driven quest system. Quests are defined in res://quests/*.json and
## loaded at runtime — NO hardcoded quest logic. A quest JSON looks like:
##
##   {
##     "id": "main",
##     "title": "Relics of San Diego",
##     "stages": {
##       "intro":   { "objective": "Speak with María Clara in the plaza.",
##                    "on_enter": [] },
##       "gather":  { "objective": "Recover the 6 hidden relics across San Diego.",
##                    "require_items": ["relic_crucifix","relic_letter","relic_ring",
##                                      "relic_book","relic_potion","relic_coin"],
##                    "next": "return" },
##       "return":  { "objective": "Return the relics to María Clara.",
##                    "require_spoken": ["clara"], "next": "complete" },
##       "complete":{ "objective": "The quest is complete. Explore San Diego.",
##                    "on_enter": ["grant_xp:100"] }
##     },
##     "initial_stage": "intro"
##   }
##
## The manager evaluates stage conditions every frame (cheaply) and advances
## automatically when requirements are met.
extends Node

var quests: Dictionary = {}          # id -> quest Dictionary
var active_quest: String = "main"


func _ready() -> void:
	_load_all_quests()
	EventBus.item_collected.connect(_on_state_change)
	EventBus.npc_spoken.connect(_on_state_change)
	EventBus.enemy_defeated.connect(_on_state_change)


func _load_all_quests() -> void:
	var dir := DirAccess.open("res://quests/")
	if dir == null: return
	dir.list_dir_begin()
	var fn := dir.get_next()
	while fn != "":
		if fn.ends_with(".json"):
			var path := "res://quests/" + fn
			var f := FileAccess.open(path, FileAccess.READ)
			if f:
				var data = JSON.parse_string(f.get_as_text())
				if typeof(data) == TYPE_DICTIONARY and data.has("id"):
					quests[data["id"]] = data
		fn = dir.get_next()


func get_quest(qid: String = active_quest) -> Dictionary:
	return quests.get(qid, {})


func get_objective(qid: String = active_quest) -> String:
	var q := get_quest(qid)
	if q.is_empty(): return ""
	var stages: Dictionary = q.get("stages", {})
	var st: Dictionary = stages.get(GameManager.quest_stage, {})
	return st.get("objective", "")


func _on_state_change(_v1 = null, _v2 = null) -> void:
	_evaluate_stage()


func _evaluate_stage() -> void:
	var q := get_quest()
	if q.is_empty(): return
	var stages: Dictionary = q.get("stages", {})
	var st: Dictionary = stages.get(GameManager.quest_stage, {})
	if st.is_empty(): return

	# Item requirements.
	var req_items: Array = st.get("require_items", [])
	if not req_items.is_empty():
		var ok := true
		for it in req_items:
			if not InventoryManager.has_item(it):
				ok = false; break
		if ok:
			_advance(st)
			return

	# Spoken-to requirements.
	var req_spoken: Array = st.get("require_spoken", [])
	if not req_spoken.is_empty():
		var ok := true
		for nk in req_spoken:
			if not GameManager.spoken_to.has(nk):
				ok = false; break
		if ok:
			_advance(st)
			return


func _advance(st: Dictionary) -> void:
	var next_stage: String = st.get("next", "")
	if next_stage == "": return
	# Run on_enter hooks.
	for hook in st.get("on_enter", []):
		_run_hook(hook)
	GameManager.set_quest_stage(next_stage)
	var q := get_quest()
	if next_stage == q.get("final_stage", ""):
		EventBus.quest_completed.emit(active_quest)
		EventBus.notification_requested.emit("Quest Complete", q.get("title", "Quest"))


func _run_hook(hook: String) -> void:
	var parts := hook.split(":")
	match parts[0]:
		"grant_xp":
			GameManager.add_xp(int(parts[1]))
		"grant_item":
			InventoryManager.add_item(parts[1])
		"unlock_codex":
			EventBus.codex_entry_unlocked.emit(parts[1])


func advance_to(stage: String) -> void:
	# Manual override (e.g. NPC triggers quest stage change).
	GameManager.set_quest_stage(stage)
