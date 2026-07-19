## Interactable.gd — optional component marking a node as interactable by the
## player. The player's InteractionArea detects this. Override interact() or
## set the dialogue_path to auto-run a dialogue file.
extends Node
class_name Interactable

signal interacted(by: Node)

@export var dialogue_path: String = ""
@export var one_shot: bool = false
var _interacted_count: int = 0


func can_interact() -> bool:
	return true


func interact(by: Node) -> void:
	_interacted_count += 1
	interacted.emit(by)
	if dialogue_path != "":
		DialogueManager.start_dialogue_file(dialogue_path)
