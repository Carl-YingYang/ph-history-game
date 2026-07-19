## PlayerStateWalk — normal-speed 4-direction movement.
extends State
class_name PlayerStateWalk


func enter(_ctx: Dictionary = {}) -> void:
	actor.play_anim("walk")


func physics_process(delta: float) -> void:
	actor.apply_movement(delta, actor.walk_speed)
	var mv := actor.get_move_vector()
	if mv == Vector2.ZERO:
		transition("idle")
	elif Input.is_action_pressed("run"):
		transition("run")
