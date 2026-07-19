## TitleScreen.gd — title menu.
##
## Ported from Phaser TitleScene. Shows the game logo, a pulsing subtitle,
## New Game / Continue buttons, and a character selector (Ibarra/Rizal). Loads
## save metadata via SaveManager.list_slots(). Built programmatically.
extends Node2D

var bg: ColorRect
var title_label: Label
var subtitle_label: Label
var menu_container: VBoxContainer
var char_buttons: Array = []
var selected_char: String = "rizal"


func _ready() -> void:
	_build()
	EventBus.fade_requested.emit(Color.BLACK, 0.4, false)
	AudioManager.play_music("title")
	set_process_unhandled_input(true)


func _build() -> void:
	bg = ColorRect.new()
	bg.color = GameConstants.BG_COLOR
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	# ColorRect needs a Control parent; use a CanvasLayer.
	var cl := CanvasLayer.new()
	cl.layer = -1
	add_child(cl)
	var root := Control.new()
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	cl.add_child(root)
	root.add_child(bg)

	# Decorative ground strip.
	var ground := ColorRect.new()
	ground.color = Color(0.23, 0.35, 0.20)
	ground.position = Vector2(0, 260)
	ground.size = Vector2(480, 60)
	root.add_child(ground)

	# Title.
	title_label = Label.new()
	title_label.position = Vector2(0, 70)
	title_label.size = Vector2(480, 48)
	title_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title_label.add_theme_font_size_override("font_size", 32)
	title_label.add_theme_color_override("font_color", Color(0.95, 0.88, 0.66))
	title_label.text = "PROJECT  NOOR"
	root.add_child(title_label)

	# Subtitle (pulsing).
	subtitle_label = Label.new()
	subtitle_label.position = Vector2(0, 120)
	subtitle_label.size = Vector2(480, 16)
	subtitle_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	subtitle_label.add_theme_font_size_override("font_size", 10)
	subtitle_label.add_theme_color_override("font_color", Color(0.75, 0.89, 0.75))
	subtitle_label.text = "A Noli Me Tangere RPG  ·  Godot 4.4 Engine"
	root.add_child(subtitle_label)

	# Character selector.
	var char_label := Label.new()
	char_label.position = Vector2(0, 160)
	char_label.size = Vector2(480, 14)
	char_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	char_label.add_theme_font_size_override("font_size", 9)
	char_label.add_theme_color_override("font_color", Color(0.7, 0.7, 0.78))
	char_label.text = "Choose your protagonist:"
	root.add_child(char_label)

	var char_row := HBoxContainer.new()
	char_row.position = Vector2(140, 178)
	char_row.size = Vector2(200, 24)
	char_row.alignment = BoxContainer.ALIGNMENT_CENTER
	root.add_child(char_row)
	for c in ["rizal", "ibara"]:
		var b := Button.new()
		b.text = "Crisóstomo Ibarra" if c == "rizal" else "Simoun"
		b.add_theme_font_size_override("font_size", 9)
		b.custom_minimum_size = Vector2(100, 24)
		b.toggle_mode = true
		b.button_pressed = (c == selected_char)
		b.pressed.connect(_on_char_pick.bind(c, b))
		char_buttons.append(b)
		char_row.add_child(b)

	# Menu buttons.
	menu_container = VBoxContainer.new()
	menu_container.position = Vector2(160, 220)
	menu_container.size = Vector2(160, 90)
	menu_container.alignment = BoxContainer.ALIGNMENT_CENTER
	menu_container.add_theme_constant_override("separation", 6)
	root.add_child(menu_container)

	var new_game := Button.new()
	new_game.text = "New Game"
	new_game.add_theme_font_size_override("font_size", 11)
	new_game.custom_minimum_size = Vector2(160, 28)
	new_game.pressed.connect(_on_new_game)
	menu_container.add_child(new_game)

	var continue_btn := Button.new()
	continue_btn.text = "Continue"
	continue_btn.add_theme_font_size_override("font_size", 11)
	continue_btn.custom_minimum_size = Vector2(160, 28)
	continue_btn.disabled = not SaveManager.has_save("auto")
	continue_btn.pressed.connect(_on_continue)
	menu_container.add_child(continue_btn)

	var quit_btn := Button.new()
	quit_btn.text = "Quit"
	quit_btn.add_theme_font_size_override("font_size", 11)
	quit_btn.custom_minimum_size = Vector2(160, 28)
	quit_btn.pressed.connect(_on_quit)
	menu_container.add_child(quit_btn)

	# Footer credits.
	var credits := Label.new()
	credits.position = Vector2(0, 300)
	credits.size = Vector2(480, 14)
	credits.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	credits.add_theme_font_size_override("font_size", 7)
	credits.add_theme_color_override("font_color", Color(0.5, 0.5, 0.55))
	credits.text = "Migrated from Next.js + Phaser  ·  Educational Philippine History RPG"
	root.add_child(credits)

	# Pulse the subtitle.
	var tw := create_tween()
	tw.set_loops()
	tw.tween_property(subtitle_label, "modulate:a", 0.4, 1.2)
	tw.tween_property(subtitle_label, "modulate:a", 1.0, 1.2)


func _on_char_pick(c: String, btn: Button) -> void:
	selected_char = c
	for b in char_buttons:
		b.button_pressed = (b == btn)
	AudioManager.play_sfx("ui_select")


func _on_new_game() -> void:
	AudioManager.play_sfx("ui_select")
	GameManager.reset_run()
	GameManager.set_player_char(selected_char)
	GameManager.current_scene_path = "res://scenes/maps/SanDiego.tscn"
	EventBus.scene_change_requested.emit("res://scenes/maps/SanDiego.tscn", "spawn_center")


func _on_continue() -> void:
	AudioManager.play_sfx("ui_select")
	if SaveManager.load_slot("auto"):
		var path := GameManager.current_scene_path
		if path == "": path = "res://scenes/maps/SanDiego.tscn"
		EventBus.scene_change_requested.emit(path, GameManager.spawn_key)
	else:
		_on_new_game()


func _on_quit() -> void:
	get_tree().quit()


func _process(_delta: float) -> void:
	pass


func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("back"):
		_on_quit()
