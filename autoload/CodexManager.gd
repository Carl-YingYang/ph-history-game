## CodexManager.gd  (autoload: CodexManager)
##
## Codex + Journal. The Codex is an encyclopedia of unlocked entries (items,
## characters, places, historical notes). The Journal is the player's personal
## log of events. Both are data-driven from res://data/codex_entries.json and
## res://data/journal_entries.json; entries unlock as the player progresses.
extends Node

var unlocked_entries: Array[String] = []
var journal_entries: Array[String] = []
var codex_db: Dictionary = {}
var journal_db: Dictionary = {}


func _ready() -> void:
	_load_db("res://data/codex_entries.json", codex_db)
	_load_db("res://data/journal_entries.json", journal_db)
	EventBus.codex_entry_unlocked.connect(_on_codex_unlocked)
	EventBus.journal_entry_added.connect(_on_journal_added)


func _load_db(path: String, store: Dictionary) -> void:
	var f := FileAccess.open(path, FileAccess.READ)
	if not f: return
	var data = JSON.parse_string(f.get_as_text())
	if typeof(data) != TYPE_ARRAY: return
	for entry in data:
		if typeof(entry) == TYPE_DICTIONARY and entry.has("id"):
			store[entry["id"]] = entry


func _on_codex_unlocked(entry_id: String) -> void:
	if unlocked_entries.has(entry_id): return
	unlocked_entries.append(entry_id)
	if codex_db.has(entry_id):
		var e: Dictionary = codex_db[entry_id]
		EventBus.toast_requested.emit("Codex: %s" % e.get("title", entry_id), Color(0.75, 0.89, 0.75))


func _on_journal_added(entry_id: String) -> void:
	if journal_entries.has(entry_id): return
	journal_entries.append(entry_id)


func get_codex_entries() -> Array:
	var out: Array = []
	for eid in unlocked_entries:
		if codex_db.has(eid):
			out.append(codex_db[eid])
	return out


func get_journal_entries() -> Array:
	var out: Array = []
	for eid in journal_entries:
		if journal_db.has(eid):
			out.append(journal_db[eid])
	return out


func is_unlocked(entry_id: String) -> bool:
	return unlocked_entries.has(entry_id)
