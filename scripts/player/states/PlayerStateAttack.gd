## PlayerStateAttack — single swing. Locks movement briefly, activates the
## attack hitbox on the mid-frame, returns to idle when the anim finishes.
extends State
class_name PlayerStateAttack

var _hit_done: bool = false


func enter(_ctx: Dictionary = {}) -> void:
	_hit_done = false
	actor.is_attacking = true
	actor.velocity = Vector2.ZERO
	actor.play_anim("attack")
	# Trigger the hit slightly into the animation.
	await actor.get_tree().create_timer(0.10).timeout
	if actor and is_instance_valid(actor) and actor.state_machine.current == self:
		actor._on_attack_hit()
		_hit_done = true


func physics_process(_delta: float) -> void:
	actor.velocity = actor.velocity.move_toward(Vector2.ZERO, GameConstants.FRICTION * _delta)
	actor.move_and_slide()


func on_anim_finished(anim_name: String) -> void:
	if anim_name == "attack":
		actor.is_attacking = false
		transition("idle")
