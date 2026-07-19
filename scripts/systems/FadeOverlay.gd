## FadeOverlay.gd — full-screen color fade for scene transitions & cutscenes.
## Instantiated by GameManager as a top-most CanvasLayer. Listens to
## EventBus.fade_requested.
extends CanvasLayer

var color_rect: ColorRect


func _ready() -> void:
	layer = 100
	color_rect = ColorRect.new()
	color_rect.color = Color(0, 0, 0, 0)
	color_rect.set_anchors_preset(Control.PRESET_FULL_RECT)
	color_rect.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(color_rect)
	EventBus.fade_requested.connect(_on_fade)


func _on_fade(color: Color, duration: float, fade_out: bool) -> void:
	color_rect.color = Color(color.r, color.g, color.b, 0.0 if fade_out else color.a)
	var tw := create_tween()
	var target_a := color.a if fade_out else 0.0
	tw.tween_property(color_rect, "color:a", target_a, duration)
