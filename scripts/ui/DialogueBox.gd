## DialogueBox.gd — professional RPG dialogue box.
##
## Ported from the Phaser WorldScene dialogue box. Renders a name plate, a
## portrait, typewriter text, a continue indicator, and optional choice buttons.
## Built programmatically (CanvasLayer-independent; spawned onto the HUD layer).
extends Control

var name_label: Label
var text_label: RichTextLabel
var portrait: TextureRect
var indicator: Label
var choices_container: VBoxContainer
var box_panel: Panel

var full_text: String = ""
var shown_chars: int = 0
var typing: bool = false
var type_speed: float = 30.0  # chars per second
var _type_accum: float = 0.0
var pending_choices: Array = []
var speaker_key: String = ""


func _ready() -> void:
	set_anchors_preset(Control.PRESET_BOTTOM_WIDE)
	position = Vector2(0, 320 - 96)
	size = Vector2(480, 96)
	mouse_filter = Control.MOUSE_FILTER_STOP
	_build()


func _build() -> void:
	box_panel = Panel.new()
	box_panel.set_anchors_preset(Control.PRESET_FULL_RECT)
	box_panel.add_theme_stylebox_override("panel", _box_style())
	add_child(box_panel)

	# Portrait (left).
	portrait = TextureRect.new()
	portrait.position = Vector2(8, 8)
	portrait.size = Vector2(64, 64)
	portrait.expand_mode = TextureRect.EXPAND_FIT_WIDTH_PROPORTIONAL
	portrait.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	add_child(portrait)

	# Name plate.
	name_label = Label.new()
	name_label.position = Vector2(80, 6)
	name_label.size = Vector2(300, 16)
	name_label.add_theme_font_size_override("font_size", 11)
	name_label.add_theme_color_override("font_color", Color(0.95, 0.88, 0.66))
	add_child(name_label)

	# Text.
	text_label = RichTextLabel.new()
	text_label.position = Vector2(80, 24)
	text_label.size = Vector2(390, 50)
	text_label.add_theme_font_size_override("normal_font_size", 10)
	text_label.add_theme_color_override("default_color", Color.WHITE)
	text_label.bbcode_enabled = true
	text_label.fit_content = false
	text_label.scroll_active = false
	text_label.text = ""
	add_child(text_label)

	# Continue indicator.
	indicator = Label.new()
	indicator.position = Vector2(450, 76)
	indicator.size = Vector2(24, 14)
	indicator.add_theme_font_size_override("font_size", 10)
	indicator.add_theme_color_override("font_color", Color(0.95, 0.88, 0.66))
	indicator.text = "▼"
	indicator.visible = false
	add_child(indicator)

	# Choices container.
	choices_container = VBoxContainer.new()
	choices_container.position = Vector2(300, 24)
	choices_container.size = Vector2(170, 60)
	choices_container.visible = false
	add_child(choices_container)

	set_process(true)
	set_process_unhandled_input(true)


func _box_style() -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = Color(0.05, 0.04, 0.08, 0.92)
	s.border_width_left = 3
	s.border_width_right = 3
	s.border_width_top = 3
	s.border_width_bottom = 3
	s.border_color = Color(0.85, 0.78, 0.5, 0.85)
	s.corner_radius_top_left = 3
	s.corner_radius_top_right = 3
	s.corner_radius_bottom_left = 3
	s.corner_radius_bottom_right = 3
	return s


func setup(data: Dictionary) -> void:
	speaker_key = data.get("speaker", "")
	name_label.text = data.get("name", speaker_key)
	name_label.add_theme_color_override("font_color", data.get("color", Color(0.95, 0.88, 0.66)))
	# Portrait from the speaker's SpriteFrames "portrait" anim, first frame.
	_set_portrait(speaker_key)


func _set_portrait(key: String) -> void:
	var path := "res://resources/sprite_frames/%s.tres" % key
	if not ResourceLoader.exists(path): return
	var sf: SpriteFrames = load(path)
	if sf and sf.has_animation("portrait") and sf.get_frame_count("portrait") > 0:
		portrait.texture = sf.get_frame_texture("portrait", 0)


func show_line(speaker: String, text: String, _portrait_anim: String, _speaker_key: String) -> void:
	full_text = text
	shown_chars = 0
	typing = true
	_type_accum = 0.0
	text_label.text = ""
	text_label.visible_characters = 0
	indicator.visible = false
	choices_container.visible = false


func _process(delta: float) -> void:
	if typing:
		_type_accum += delta
		var chars_to_show := int(_type_accum * type_speed)
		if chars_to_show > shown_chars:
			shown_chars = chars_to_show
			text_label.visible_characters = shown_chars
			if shown_chars % 2 == 0:
				AudioManager.play_sfx("ui_select")
		if shown_chars >= full_text.length():
			typing = false
			_on_typing_done()


func _on_typing_done() -> void:
	text_label.text = full_text
	text_label.visible_characters = -1
	indicator.visible = true


func is_typing() -> bool:
	return typing


func snap_to_full() -> void:
	typing = false
	text_label.text = full_text
	text_label.visible_characters = -1
	indicator.visible = true


func has_pending_choices() -> bool:
	return choices_container.visible


func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("advance_dialogue") or event.is_action_pressed("interact"):
		DialogueManager.advance()
		get_viewport().set_input_as_handled()
