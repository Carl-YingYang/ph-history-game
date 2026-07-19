## PlayerStateDead — plays death anim, then waits for respawn (handled by
## GameManager via EventBus.player_died -> _on_player_died respawn after 1.5s).
extends State
class_name PlayerStateDead


func enter(_ctx: Dictionary = {}) -> void:
	actor.play_anim("dead")
	actor.velocity = Vector2.ZERO


func physics_process(_delta: float) -> void:
	actor.velocity = actor.velocity.move_toward(Vector2.ZERO, GameConstants.FRICTION * _delta)
	actor.move_and_slide()
