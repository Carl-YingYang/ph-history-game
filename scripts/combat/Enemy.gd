## Enemy.gd — Guardia Civil patrol enemy.
##
## Ported from Phaser WorldScene enemy logic. CharacterBody2D with a simple
## patrol state machine (idle/walk back and forth), HP, hurtbox (receives player
## attacks), hit flash, knockback, death animation, and XP grant on defeat.
extends CharacterBody2D

@export var enemy_id: String = "guard_1"
@export var patrol_range: float = 24.0  # px from home
@export var patrol_speed: float = 22.0
@export var hp: int = GameConstants.ENEMY_HP
@export var sprite_key: String = "spanish-npc"

var sprite: AnimatedSprite2D
var home_pos: Vector2
var patrol_dir: int = 1
var hurtbox: Area2D
var hit_flash_timer: float = 0.0
var dead: bool = false
var hurt_stagger: float = 0.0


func _ready() -> void:
	sprite = AnimatedSprite2D.new()
	sprite.sprite_frames = load("res://resources/sprite_frames/%s.tres" % sprite_key)
	sprite.scale = Vector2(2, 2)
	sprite.position = Vector2(0, -2)
	sprite.play("idle")
	add_child(sprite)

	var mat := ShaderMaterial.new()
	mat.shader = preload("res://assets/shaders/hit_flash.gdshader")
	sprite.material = mat

	# Collision body (immovable-ish; we move manually).
	var col := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = Vector2(10, 8)
	col.shape = rect
	col.position = Vector2(0, 14)
	add_child(col)

	# Hurtbox — receives player attack hitbox (layer 3 = enemy, mask 6 = player_hitbox).
	hurtbox = Area2D.new()
	hurtbox.collision_layer = 4
	hurtbox.collision_mask = 32
	var hs := CollisionShape2D.new()
	var hr := RectangleShape2D.new()
	hr.size = Vector2(12, 18)
	hs.shape = hr
	hurtbox.add_child(hs)
	hurtbox.position = Vector2(0, 8)
	add_child(hurtbox)

	# Attack hitbox — damages the player on contact (layer 7 = enemy_hitbox, mask 1 = player).
	var ahh := Area2D.new()
	ahh.collision_layer = 64
	ahh.collision_mask = 1
	var ahs := CollisionShape2D.new()
	var ahr := RectangleShape2D.new()
	ahr.size = Vector2(12, 16)
	ahs.shape = ahr
	ahh.add_child(ahs)
	ahh.position = Vector2(0, 8)
	add_child(ahh)
	ahh.body_entered.connect(_on_hit_player)

	home_pos = global_position


func _physics_process(delta: float) -> void:
	if dead: return
	# Hit flash decay.
	if hit_flash_timer > 0:
		hit_flash_timer -= delta
		if hit_flash_timer <= 0 and sprite.material is ShaderMaterial:
			(sprite.material as ShaderMaterial).set_shader_parameter("flash_amount", 0.0)

	if hurt_stagger > 0:
		hurt_stagger -= delta
		velocity = velocity.move_toward(Vector2.ZERO, GameConstants.FRICTION * delta)
		move_and_slide()
		return

	# Patrol back and forth horizontally.
	velocity.x = patrol_dir * patrol_speed
	velocity.y = 0
	sprite.flip_h = patrol_dir < 0
	if abs(global_position.x - home_pos.x) > patrol_range:
		patrol_dir *= -1
	# Face direction for the walk anim.
	if velocity.length() > 1.0:
		if sprite.animation != "walk": sprite.play("walk")
	else:
		if sprite.animation != "idle": sprite.play("idle")
	move_and_slide()


func take_damage(amount: int, from_dir: Vector2) -> void:
	if dead: return
	hp -= amount
	hit_flash_timer = 0.18
	if sprite.material is ShaderMaterial:
		(sprite.material as ShaderMaterial).set_shader_parameter("flash_amount", 1.0)
	# Knockback.
	velocity = from_dir.normalized() * (GameConstants.KNOCKBACK_FORCE * 0.6)
	hurt_stagger = 0.22
	AudioManager.play_sfx("enemy_hurt")
	if hp <= 0:
		die()
	else:
		sprite.play("hurt")


func die() -> void:
	dead = true
	sprite.play("dead")
	velocity = Vector2.ZERO
	AudioManager.play_sfx("enemy_dead")
	EventBus.enemy_defeated.emit(enemy_id, GameConstants.XP_PER_ENEMY)
	EventBus.screen_shake_requested.emit(0.35, 0.2)
	# Disable collision + hurtbox.
	hurtbox.set_deferred("monitorable", false)
	hurtbox.set_deferred("monitoring", false)
	await get_tree().create_timer(1.2).timeout
	queue_free()


func _on_hit_player(body: Node) -> void:
	if body.has_method("take_damage") and not dead:
		var dir := (body.global_position - global_position).normalized()
		body.take_damage(GameConstants.ATTACK_DAMAGE, dir)
