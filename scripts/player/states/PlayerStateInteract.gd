## PlayerStateInteract — momentary pause while interacting with an NPC/object.
## Currently a thin state; the dialogue system handles the actual lock via
## GameManager.cutscene_locked.
extends State
class_name PlayerStateInteract

var _timer: float = 0.0


func enter(_ctx: Dictionary = {}) -> void:
	_timer = 0.0
	actor.play_anim("idle")


func process(delta: float) -> void:
	_timer += delta
	if _timer > 0.15:
		transition("idle")
