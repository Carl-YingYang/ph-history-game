## RPGCamera.gd — professional 2D RPG camera.
##
## Features: smooth follow with configurable lag, deadzone (player can move
## slightly inside the frame without camera follow), hard camera limits, zoom,
## screen shake (trauma-based), and a cutscene mode that disables follow and
## lets the world script drive the camera.
extends Camera2D

@export var follow_target: NodePath = ""
@export var smoothing: float = 8.0
@export var deadzone_radius: float = 12.0
@export var default_zoom: Vector2 = Vector2(GameConstants.CAMERA_ZOOM, GameConstants.CAMERA_ZOOM)
@export var shake_decay: float = 3.5
@export var shake_max_offset: float = 8.0

var target: Node2D = null
var trauma: float = 0.0
var cutscene: bool = false
var _noise_x: float = 0.0
var _noise_y: float = 31.0


func _ready() -> void:
	zoom = default_zoom
	if follow_target != "":
		target = get_node_or_null(follow_target)
		if target:
			global_position = target.global_position
	# Pixel-perfect: round the camera position.
	position_smoothing_enabled = false  # we do custom smoothing for deadzone


func set_target(t: Node2D) -> void:
	target = t


func set_limits(rect: Rect2) -> void:
	limit_left = int(rect.position.x)
	limit_top = int(rect.position.y)
	limit_right = int(rect.position.x + rect.size.x)
	limit_bottom = int(rect.position.y + rect.size.y)


func add_shake(amount: float) -> void:
	trauma = clamp(trauma + amount, 0.0, 1.0)


func _process(delta: float) -> void:
	if target and not cutscene:
		var desired := target.global_position
		var delta_pos := desired - global_position
		# Deadzone: only move camera if player is outside the radius.
		if delta_pos.length() > deadzone_radius:
			var beyond := delta_pos.length() - deadzone_radius
			var dir := delta_pos.normalized()
			global_position += dir * beyond
		# Smooth follow toward the (deadzone-adjusted) target.
		global_position = global_position.lerp(desired, 1.0 - exp(-smoothing * delta))

	# Screen shake (trauma^2 for nicer falloff).
	if trauma > 0.0:
		trauma = max(0.0, trauma - shake_decay * delta)
		var shake := trauma * trauma
		_noise_x += delta * 30.0
		_noise_y += delta * 30.0
		var ox := (sin(_noise_x * 1.7) + cos(_noise_x * 2.3)) * 0.5 * shake * shake_max_offset
		var oy := (cos(_noise_y * 1.3) + sin(_noise_y * 2.1)) * 0.5 * shake * shake_max_offset
		offset = Vector2(ox, oy)
	else:
		offset = offset.lerp(Vector2.ZERO, 1.0 - exp(-10.0 * delta))

	# Pixel-snap the final position.
	global_position = global_position.round()
