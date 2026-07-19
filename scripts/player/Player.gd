## Player.gd — CharacterBody2D player controller.
##
## Ported from src/game/scenes/WorldScene.ts (Phaser) player logic, rebuilt as a
## proper Godot CharacterBody2D with a StateMachine. States: idle, walk, run,
## attack, hurt, dead, interact. Handles 4-direction movement, acceleration &
## friction, run toggle, attack hitbox, knockback, i-frames, footstep SFX, and
## facing direction (flip_h on the AnimatedSprite2D).
extends CharacterBody2D

@export var char_key: String = "rizal"      # which SpriteFrames resource to use
@export var walk_speed: float = GameConstants.WALK_SPEED
@export var run_speed: float = GameConstants.RUN_SPEED

var sprite: AnimatedSprite2D
var state_machine: StateMachine
var facing: Vector2 = Vector2.DOWN          # last non-zero movement direction
var invuln_until: float = 0.0               # Time.get_ticks_msec()
var is_attacking: bool = false
var attack_hitbox: Area2D
var hurtbox: Area2D
var interaction_area: Area2D
var current_interactable: Node = null
var hit_flash_timer: float = 0.0

# Footstep cadence
var _step_distance_accum: float = 0.0
const STEP_THRESHOLD_WALK := 14.0
const STEP_THRESHOLD_RUN := 18.0


func _ready() -> void:
	# Build the visual + collision hierarchy programmatically (so the scene
	# file stays tiny and the player is data-driven).
	sprite = AnimatedSprite2D.new()
	sprite.sprite_frames = load("res://resources/sprite_frames/%s.tres" % char_key)
	sprite.scale = Vector2(2, 2)
	sprite.position = Vector2(0, -2)
	sprite.play("idle")
	add_child(sprite)

	# Hit flash shader material (white pulse on hurt).
	var mat := ShaderMaterial.new()
	mat.shader = preload("res://assets/shaders/hit_flash.gdshader")
	sprite.material = mat

	# Collision shape (feet box, mirrors Phaser setSize(10,8)).
	var col := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = Vector2(10, 8)
	col.shape = rect
	col.position = Vector2(0, 14)
	add_child(col)

	# Attack hitbox — a small Area2D in front of the player.
	attack_hitbox = Area2D.new()
	attack_hitbox.name = "AttackHitbox"
	attack_hitbox.collision_layer = 32   # layer 6 = player_hitbox
	attack_hitbox.collision_mask = 4    # mask 3 = enemy
	var ahs := CollisionShape2D.new()
	var ah_rect := RectangleShape2D.new()
	ah_rect.size = Vector2(28, 20)
	ahs.shape = ah_rect
	attack_hitbox.add_child(ahs)
	attack_hitbox.position = Vector2(0, 8)
	add_child(attack_hitbox)
	attack_hitbox.visible = false

	# Hurtbox — receives enemy attacks.
	hurtbox = Area2D.new()
	hurtbox.name = "Hurtbox"
	hurtbox.collision_layer = 1     # layer 1 = player
	hurtbox.collision_mask = 64     # mask 7 = enemy_hitbox
	var hs := CollisionShape2D.new()
	var h_rect := RectangleShape2D.new()
	h_rect.size = Vector2(10, 14)
	hs.shape = h_rect
	hurtbox.add_child(hs)
	hurtbox.position = Vector2(0, 8)
	add_child(hurtbox)

	# Interaction area — detects NPCs / collectibles in front.
	interaction_area = Area2D.new()
	interaction_area.name = "InteractionArea"
	interaction_area.collision_layer = 256  # layer 9 = trigger
	interaction_area.collision_mask = 16 | 8  # environment + collectible
	var ish := CollisionShape2D.new()
	var ir := CircleShape2D.new()
	ir.radius = 22.0
	ish.shape = ir
	interaction_area.add_child(ish)
	add_child(interaction_area)
	interaction_area.area_entered.connect(_on_interact_area_entered)
	interaction_area.area_exited.connect(_on_interact_area_exited)
	interaction_area.body_entered.connect(_on_interact_body_entered)
	interaction_area.body_exited.connect(_on_interact_body_exited)

	# State machine (child states).
	state_machine = StateMachine.new()
	state_machine.name = "StateMachine"
	add_child(state_machine)
	_add_state("idle",     PlayerStateIdle.new())
	_add_state("walk",     PlayerStateWalk.new())
	_add_state("run",      PlayerStateRun.new())
	_add_state("attack",   PlayerStateAttack.new())
	_add_state("hurt",     PlayerStateHurt.new())
	_add_state("dead",     PlayerStateDead.new())
	_add_state("interact", PlayerStateInteract.new())

	# Wire input.
	set_process_unhandled_input(true)

	# Hook signals.
	EventBus.player_respawned.connect(_on_respawn)
	sprite.animation_finished.connect(_on_anim_finished)

	# Apply saved state.
	_apply_saved_state()


func _add_state(state_name: String, s: State) -> void:
	s.name = state_name
	state_machine.add_child(s)


func _apply_saved_state() -> void:
	# If a spawn_key was set, the world scene positions us; else center.
	pass


# ── Movement helpers used by states ───────────────────────────────
func get_move_vector() -> Vector2:
	var v := Input.get_vector("move_left", "move_right", "move_up", "move_down")
	return v


func apply_movement(delta: float, speed: float) -> void:
	var input_vec := get_move_vector()
	if input_vec != Vector2.ZERO:
		facing = input_vec.round() if input_vec.length() > 0.1 else facing
		# Accelerate toward target velocity.
		velocity = velocity.move_toward(input_vec * speed, GameConstants.ACCEL * delta)
		# Footsteps.
		_step_distance_accum += velocity.length() * delta
		var thresh := STEP_THRESHOLD_RUN if Input.is_action_pressed("run") else STEP_THRESHOLD_WALK
		if _step_distance_accum >= thresh:
			_step_distance_accum = 0.0
			AudioManager.play_sfx("footstep")
	else:
		velocity = velocity.move_toward(Vector2.ZERO, GameConstants.FRICTION * delta)
	move_and_slide()
	# Flip sprite horizontally for left/right facing.
	if abs(facing.x) > abs(facing.y):
		sprite.flip_h = facing.x < 0
	# Position the attack hitbox in the facing direction.
	var hb_offset := Vector2(facing.x, facing.y) * 12.0
	attack_hitbox.position = Vector2(hb_offset.x, 8 + hb_offset.y * 0.5)


func play_anim(anim_name: String) -> void:
	if sprite.sprite_frames and sprite.sprite_frames.has_animation(anim_name):
		if sprite.animation != anim_name:
			sprite.play(anim_name)


# ── Attack ────────────────────────────────────────────────────────
func start_attack() -> void:
	if is_attacking or GameManager.cutscene_locked: return
	state_machine.transition_to("attack")


func _on_attack_hit() -> void:
	# Called by the attack state when the strike frame is active.
	attack_hitbox.visible = false  # keep invisible (debug-only)
	var bodies := attack_hitbox.get_overlapping_bodies()
	for b in bodies:
		if b.has_method("take_damage"):
			b.take_damage(GameConstants.ATTACK_DAMAGE, facing)
			AudioManager.play_sfx("hit")


# ── Damage reception ──────────────────────────────────────────────
func take_damage(amount: int, from_dir: Vector2) -> void:
	if state_machine.current.name.to_lower() == "dead": return
	if Time.get_ticks_msec() < invuln_until: return
	invuln_until = Time.get_ticks_msec() + GameConstants.INVULN_TIME * 1000.0
	# Knockback.
	velocity = from_dir.normalized() * GameConstants.KNOCKBACK_FORCE
	# Hit flash.
	_hit_flash()
	AudioManager.play_sfx("hit")
	EventBus.player_hit.emit(amount)
	GameManager.damage(amount)
	if GameManager.health > 0:
		state_machine.transition_to("hurt", {"dir": from_dir})


func _hit_flash() -> void:
	hit_flash_timer = 0.18
	if sprite.material is ShaderMaterial:
		(sprite.material as ShaderMaterial).set_shader_parameter("flash_amount", 1.0)


func _process(_delta: float) -> void:
	if hit_flash_timer > 0:
		hit_flash_timer -= _delta
		if hit_flash_timer <= 0 and sprite.material is ShaderMaterial:
			(sprite.material as ShaderMaterial).set_shader_parameter("flash_amount", 0.0)


# ── Interaction ───────────────────────────────────────────────────
func _on_interact_area_entered(area: Area2D) -> void:
	if area.get_parent().has_method("can_interact") and area.get_parent().can_interact():
		current_interactable = area.get_parent()
		EventBus.npc_approached.emit(_interactable_key())


func _on_interact_area_exited(area: Area2D) -> void:
	if current_interactable == area.get_parent():
		current_interactable = null
		EventBus.npc_left.emit(_interactable_key())


func _on_interact_body_entered(body: Node) -> void:
	if body.has_method("can_interact") and body.can_interact():
		current_interactable = body
		EventBus.npc_approached.emit(_interactable_key())


func _on_interact_body_exited(body: Node) -> void:
	if current_interactable == body:
		current_interactable = null
		EventBus.npc_left.emit(_interactable_key())


func _interactable_key() -> String:
	if current_interactable and ("npc_key" in current_interactable):
		return current_interactable.npc_key
	return ""


func try_interact() -> void:
	if current_interactable and current_interactable.has_method("interact"):
		current_interactable.interact(self)


# ── Input ─────────────────────────────────────────────────────────
func _unhandled_input(event: InputEvent) -> void:
	if GameManager.cutscene_locked: return
	if event.is_action_pressed("attack"):
		start_attack()
	elif event.is_action_pressed("interact"):
		try_interact()


func _on_anim_finished() -> void:
	# Let the current state react to animation completion (attack, hurt, dead).
	if state_machine.current.has_method("on_anim_finished"):
		state_machine.current.on_anim_finished(sprite.animation)


func _on_respawn() -> void:
	state_machine.transition_to("idle")
	invuln_until = 0.0
	_hit_flash()


# ── Character swap (rare) ─────────────────────────────────────────
func set_char_key(new_key: String) -> void:
	char_key = new_key
	sprite.sprite_frames = load("res://resources/sprite_frames/%s.tres" % char_key)
	sprite.play("idle")
