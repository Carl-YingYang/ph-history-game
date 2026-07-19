## PlayerStateHurt — brief stagger on taking damage. Applies knockback decay.
extends State
class_name PlayerStateHurt

var _timer: float = 0.0
const DURATION := 0.28


func enter(ctx: Dictionary = {}) -> void:
	_timer = 0.0
	actor.play_anim("hurt")


func physics_process(delta: float) -> void:
	_timer += delta
	# Decay knockback.
	actor.velocity = actor.velocity.move_toward(Vector2.ZERO, GameConstants.FRICTION * 1.5 * delta)
	actor.move_and_slide()
	if _timer >= DURATION:
		transition("idle")
