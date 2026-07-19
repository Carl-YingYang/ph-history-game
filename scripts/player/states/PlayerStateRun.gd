## PlayerStateRun — faster movement while Shift held.
extends State
class_name PlayerStateRun


func enter(_ctx: Dictionary = {}) -> void:
	actor.play_anim("run")


func physics_process(delta: float) -> void:
	actor.apply_movement(delta, actor.run_speed)
	var mv := actor.get_move_vector()
	if mv == Vector2.ZERO:
		transition("idle")
	elif not Input.is_action_pressed("run"):
		transition("walk")
