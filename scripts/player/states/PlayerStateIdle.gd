## PlayerStateIdle — standing still. Plays idle anim. Transitions to walk/run/attack.
extends State
class_name PlayerStateIdle


func enter(_ctx: Dictionary = {}) -> void:
	actor.play_anim("idle")
	actor.velocity = Vector2.ZERO


func process(_delta: float) -> void:
	var mv := actor.get_move_vector()
	if mv != Vector2.ZERO:
		if Input.is_action_pressed("run"):
			transition("run")
		else:
			transition("walk")
		return
	# Attack is handled in Player._unhandled_input via transition("attack").
