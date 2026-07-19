## NPC.gd — base RPG NPC with a StateMachine.
##
## Ported from the Phaser WorldScene NPC logic (idle bob, look-at-player,
## dialogue trigger, quest giver). States live as inner classes for compactness.
## The NPC loads its SpriteFrames from res://resources/sprite_frames/<key>.tres,
## bobs gently, faces the player when nearby, and starts its dialogue when the
## player interacts.
extends CharacterBody2D

@export var npc_key: String = "clara"
@export var display_name: String = "NPC"
@export var name_color: Color = Color.WHITE
@export var dialogue_path: String = "res://dialogues/clara.json"
@export var gives_item_stage: String = ""
@export var gives_item: String = ""

var sprite: AnimatedSprite2D
var state_machine: StateMachine
var player_ref: Node2D = null
var interactable: Interactable
var detection_area: Area2D
var idle_bob_active: bool = true


func _ready() -> void:
	sprite = AnimatedSprite2D.new()
	sprite.sprite_frames = load("res://resources/sprite_frames/%s.tres" % npc_key)
	sprite.scale = Vector2(2, 2)
	sprite.position = Vector2(0, -2)
	sprite.play("idle")
	add_child(sprite)

	# Hit flash material.
	var mat := ShaderMaterial.new()
	mat.shader = preload("res://assets/shaders/hit_flash.gdshader")
	sprite.material = mat

	# Collision (immovable, layer 2 = npc).
	var col := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = Vector2(10, 8)
	col.shape = rect
	col.position = Vector2(0, 14)
	add_child(col)

	# Detection area — senses the player for look-at + proximity hint.
	detection_area = Area2D.new()
	detection_area.collision_layer = 4    # layer 3 = enemy-ish; harmless here
	detection_area.collision_mask = 1     # mask 1 = player
	var ds := CollisionShape2D.new()
	var circ := CircleShape2D.new()
	circ.radius = 40.0
	ds.shape = circ
	detection_area.add_child(ds)
	add_child(detection_area)
	detection_area.body_entered.connect(_on_body_entered)
	detection_area.body_exited.connect(_on_body_exited)

	# Interaction trigger — the player's InteractionArea overlaps this.
	var trig := Area2D.new()
	trig.collision_layer = 256  # layer 9 = trigger
	trig.collision_mask = 1     # mask 1 = player (we let player area mask this)
	var ts := CollisionShape2D.new()
	var tr := RectangleShape2D.new()
	tr.size = Vector2(20, 20)
	ts.shape = tr
	trig.add_child(ts)
	add_child(trig)

	# Interactable component.
	interactable = Interactable.new()
	interactable.dialogue_path = dialogue_path
	add_child(interactable)

	# State machine.
	state_machine = StateMachine.new()
	state_machine.name = "StateMachine"
	add_child(state_machine)
	var idle := NPCStateIdle.new()
	idle.name = "idle"
	var look := NPCStateLook.new()
	look.name = "look"
	var talk := NPCStateTalk.new()
	talk.name = "talk"
	state_machine.add_child(idle)
	state_machine.add_child(look)
	state_machine.add_child(talk)

	# Gentle idle bob tween.
	var tw := create_tween()
	tw.set_loops()
	tw.tween_property(sprite, "position:y", -3.0, 1.4).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
	tw.tween_property(sprite, "position:y", -2.0, 1.4).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)


func _on_body_entered(body: Node) -> void:
	if body is CharacterBody2D and body.has_method("get_move_vector"):
		player_ref = body
		EventBus.npc_approached.emit(npc_key)


func _on_body_exited(body: Node) -> void:
	if body == player_ref:
		player_ref = null
		EventBus.npc_left.emit(npc_key)


func interact(_by: Node) -> void:
	interactable.interact(_by)
	# Face the player.
	if player_ref:
		var dx := player_ref.global_position.x - global_position.x
		sprite.flip_h = dx < 0
	# Quest item grant handled by dialogue on_finish, but keep fallback.
	if gives_item_stage != "" and gives_item != "" and GameManager.quest_stage == gives_item_stage:
		if not InventoryManager.has_item(gives_item):
			EventBus.item_collected.emit(gives_item)


# ── NPC states ────────────────────────────────────────────────────
class NPCStateIdle extends State:
	func enter(_ctx: Dictionary = {}) -> void:
		actor.sprite.play("idle")
	func process(_delta: float) -> void:
		if actor.player_ref != null:
			transition("look")

class NPCStateLook extends State:
	func enter(_ctx: Dictionary = {}) -> void:
		actor.sprite.play("idle")
	func process(_delta: float) -> void:
		if actor.player_ref == null:
			transition("idle")
			return
		var dx := actor.player_ref.global_position.x - actor.global_position.x
		actor.sprite.flip_h = dx < 0

class NPCStateTalk extends State:
	func enter(_ctx: Dictionary = {}) -> void:
		actor.sprite.play("idle")
