## Collectible.gd — a relic pickup.
##
## Ported from Phaser WorldScene collectible logic. An Area2D with an
## AnimatedSprite2D (gentle bob + sparkle). When the player overlaps and
## presses interact (or just walks over — mirrors the source which used
## physics.overlap), the relic is collected via EventBus.item_collected.
extends Area2D

@export var item_id: String = "relic_crucifix"
@export var atlas_key: String = "collectible-assets"
@export var frame_index: int = 0

var sprite: AnimatedSprite2D
var collected: bool = false


func _ready() -> void:
	# Build a tiny one-frame AnimatedSprite2D from the environment atlas's
	# "default" animation at frame_index.
	sprite = AnimatedSprite2D.new()
	var sf: SpriteFrames = load("res://resources/sprite_frames/%s.tres" % atlas_key)
	sprite.sprite_frames = sf
	if sf and sf.has_animation("default") and sf.get_frame_count("default") > frame_index:
		# SpriteFrames can't easily play a single frame; we set the frame directly.
		sprite.animation = "default"
		sprite.frame = frame_index
		sprite.autoplay = ""
		sprite.stop()
	sprite.scale = Vector2(2, 2)
	sprite.offset = Vector2(0, -4)
	add_child(sprite)

	collision_layer = 8   # layer 4 = collectible
	collision_mask = 1    # mask 1 = player

	var col := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = Vector2(14, 14)
	col.shape = rect
	add_child(col)

	body_entered.connect(_on_body_entered)

	# Gentle bob + sparkle.
	var tw := create_tween()
	tw.set_loops()
	tw.tween_property(sprite, "position:y", -3.0, 0.9).set_trans(Tween.TRANS_SINE)
	tw.tween_property(sprite, "position:y", 0.0, 0.9).set_trans(Tween.TRANS_SINE)


func _on_body_entered(body: Node) -> void:
	if collected: return
	if body.has_method("get_move_vector"):  # is player
		collect(body)


func collect(_by: Node) -> void:
	if collected: return
	collected = true
	EventBus.item_collected.emit(item_id)
	AudioManager.play_sfx("pickup")
	EventBus.screen_shake_requested.emit(0.12, 0.08)
	# Shrink + fade pop.
	var tw := create_tween()
	tw.set_parallel(true)
	tw.tween_property(sprite, "scale", Vector2(4, 4), 0.2)
	tw.tween_property(sprite, "modulate:a", 0.0, 0.25)
	tw.chain().tween_callback(queue_free)
