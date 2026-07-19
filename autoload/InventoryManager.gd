## InventoryManager.gd  (autoload: InventoryManager)
##
## Tracks collected relics. Mirrors the inventory[] portion of game-state.ts.
## Items are simple string IDs (relic_crucifix, relic_letter, …). Adding an
## item that is already present is a no-op (mirrors the Phaser addItem guard).
extends Node

var inventory: Array[String] = []


func _ready() -> void:
	EventBus.item_collected.connect(_on_item_collected)
	EventBus.item_removed.connect(_on_item_removed)


func add_item(item_id: String) -> bool:
	if inventory.has(item_id): return false
	inventory.append(item_id)
	var def := GameConstants.get_item_def(item_id)
	if def:
		EventBus.toast_requested.emit("Found: %s" % def.name, def.color)
		EventBus.codex_entry_unlocked.emit("item_" + item_id)
		EventBus.journal_entry_added.emit("item_" + item_id)
	EventBus.hud_refresh_requested.emit()
	GameManager._save_async()
	return true


func remove_item(item_id: String) -> void:
	inventory.erase(item_id)
	EventBus.hud_refresh_requested.emit()
	GameManager._save_async()


func has_item(item_id: String) -> bool:
	return inventory.has(item_id)


func count() -> int:
	return inventory.size()


func clear() -> void:
	inventory.clear()
	EventBus.hud_refresh_requested.emit()


func _on_item_collected(item_id: String) -> void:
	add_item(item_id)


func _on_item_removed(item_id: String) -> void:
	remove_item(item_id)
