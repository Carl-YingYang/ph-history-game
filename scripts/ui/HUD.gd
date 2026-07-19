## HUD.gd — main heads-up display (CanvasLayer).
##
## Ported from Phaser WorldScene HUD + React overlay (page.tsx). Built
## programmatically so it's self-contained. Renders:
##   - top-left: objective tracker
##   - top-right: clock / play time
##   - bottom-left: health bar + XP bar + level
##   - bottom-center: toast notifications
##   - bottom-right: control hints
##   - proximity hint above player ("Press E to talk")
## Also routes inventory/journal/codex/pause toggles.
extends CanvasLayer

var objective_label: Label
var health_bar: ProgressBar
var health_label: Label
var xp_bar: ProgressBar
var level_label: Label
var toast_label: Label
var toast_timer: float = 0.0
var clock_label: Label
var hint_label: Label
var notification_panel: Panel
var notification_label: Label
var notification_timer: float = 0.0

var inventory_panel
var journal_panel
var codex_panel
var pause_menu
var any_panel_open: bool = false


func _ready() -> void:
	layer = 10
	GameManager.hud_layer = self
	_build_ui()
	_refresh()
	# Wire signals.
	EventBus.player_health_changed.connect(func(c, m): _set_health(c, m))
	EventBus.player_xp_changed.connect(func(c, t): _set_xp(c, t))
	EventBus.player_level_changed.connect(func(l): level_label.text = "Lv %d" % l)
	EventBus.quest_objective_updated.connect(func(t): objective_label.text = t)
	EventBus.toast_requested.connect(_show_toast)
	EventBus.notification_requested.connect(_show_notification)
	EventBus.npc_approached.connect(func(_k): hint_label.visible = true)
	EventBus.npc_left.connect(func(_k): hint_label.visible = false)
	EventBus.hud_refresh_requested.connect(_refresh)
	EventBus.screen_shake_requested.connect(func(a, _d): _shake(a))
	set_process_unhandled_input(true)


func _build_ui() -> void:
	# Root margin container so HUD scales with the viewport.
	var root := Control.new()
	root.name = "HUDRoot"
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(root)

	# ── Objective tracker (top-left) ──
	var obj_box := Panel.new()
	obj_box.name = "ObjectiveBox"
	obj_box.position = Vector2(8, 6)
	obj_box.size = Vector2(220, 28)
	obj_box.add_theme_stylebox_override("panel", _panel_style(Color(0.05, 0.04, 0.08, 0.7), 2))
	root.add_child(obj_box)
	objective_label = Label.new()
	objective_label.position = Vector2(8, 6)
	objective_label.size = Vector2(210, 18)
	objective_label.add_theme_font_size_override("font_size", 10)
	objective_label.add_theme_color_override("font_color", Color(0.95, 0.88, 0.66))
	objective_label.text = "Speak with María Clara."
	obj_box.add_child(objective_label)

	# ── Clock (top-right) ──
	clock_label = Label.new()
	clock_label.position = Vector2(380, 8)
	clock_label.size = Vector2(92, 16)
	clock_label.add_theme_font_size_override("font_size", 10)
	clock_label.add_theme_color_override("font_color", Color(0.7, 0.7, 0.78))
	clock_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	clock_label.text = "00:00"
	root.add_child(clock_label)

	# ── Health/XP bars (bottom-left) ──
	var stats := Panel.new()
	stats.position = Vector2(8, 280)
	stats.size = Vector2(180, 36)
	stats.add_theme_stylebox_override("panel", _panel_style(Color(0.05, 0.04, 0.08, 0.7), 2))
	root.add_child(stats)

	health_bar = ProgressBar.new()
	health_bar.position = Vector2(6, 4)
	health_bar.size = Vector2(168, 10)
	health_bar.min_value = 0
	health_bar.max_value = 100
	health_bar.value = 100
	health_bar.show_percentage = false
	health_bar.add_theme_stylebox_override("background", _bar_bg(Color(0.25, 0.08, 0.08)))
	health_bar.add_theme_stylebox_override("fill", _bar_fill(Color(0.85, 0.25, 0.25)))
	stats.add_child(health_bar)

	health_label = Label.new()
	health_label.position = Vector2(6, 3)
	health_label.size = Vector2(168, 10)
	health_label.add_theme_font_size_override("font_size", 8)
	health_label.add_theme_color_override("font_color", Color.WHITE)
	health_label.text = "100 / 100"
	stats.add_child(health_label)

	xp_bar = ProgressBar.new()
	xp_bar.position = Vector2(6, 18)
	xp_bar.size = Vector2(120, 8)
	xp_bar.min_value = 0
	xp_bar.max_value = 100
	xp_bar.value = 0
	xp_bar.show_percentage = false
	xp_bar.add_theme_stylebox_override("background", _bar_bg(Color(0.08, 0.08, 0.18)))
	xp_bar.add_theme_stylebox_override("fill", _bar_fill(Color(0.4, 0.78, 0.95)))
	stats.add_child(xp_bar)

	level_label = Label.new()
	level_label.position = Vector2(130, 17)
	level_label.size = Vector2(46, 10)
	level_label.add_theme_font_size_override("font_size", 9)
	level_label.add_theme_color_override("font_color", Color(0.85, 0.78, 0.5))
	level_label.text = "Lv 1"
	stats.add_child(level_label)

	# ── Toast (bottom-center) ──
	toast_label = Label.new()
	toast_label.position = Vector2(120, 250)
	toast_label.size = Vector2(240, 20)
	toast_label.add_theme_font_size_override("font_size", 11)
	toast_label.add_theme_color_override("font_color", Color.WHITE)
	toast_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	toast_label.text = ""
	toast_label.visible = false
	root.add_child(toast_label)

	# ── Proximity hint (center-bottom) ──
	hint_label = Label.new()
	hint_label.position = Vector2(160, 220)
	hint_label.size = Vector2(160, 16)
	hint_label.add_theme_font_size_override("font_size", 9)
	hint_label.add_theme_color_override("font_color", Color(0.95, 0.88, 0.66))
	hint_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hint_label.text = "[ E ] Talk"
	hint_label.visible = false
	root.add_child(hint_label)

	# ── Notification panel (center) ──
	notification_panel = Panel.new()
	notification_panel.position = Vector2(120, 120)
	notification_panel.size = Vector2(240, 60)
	notification_panel.add_theme_stylebox_override("panel", _panel_style(Color(0.05, 0.04, 0.08, 0.92), 3))
	notification_panel.visible = false
	root.add_child(notification_panel)
	notification_label = Label.new()
	notification_label.position = Vector2(8, 8)
	notification_label.size = Vector2(224, 44)
	notification_label.add_theme_font_size_override("font_size", 11)
	notification_label.add_theme_color_override("font_color", Color(0.95, 0.88, 0.66))
	notification_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	notification_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	notification_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	notification_panel.add_child(notification_label)

	# ── Control hints (bottom-right) ──
	var hints := Label.new()
	hints.position = Vector2(330, 282)
	hints.size = Vector2(144, 36)
	hints.add_theme_font_size_override("font_size", 7)
	hints.add_theme_color_override("font_color", Color(0.6, 0.6, 0.66))
	hints.text = "WASD move  Shift run\nJ/Click attack  E talk\nI inv  L journal  C codex  Esc pause"
	root.add_child(hints)


# ── Stylebox helpers ──────────────────────────────────────────────
func _panel_style(c: Color, border: int) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = c
	s.border_width_left = border
	s.border_width_right = border
	s.border_width_top = border
	s.border_width_bottom = border
	s.border_color = Color(0.85, 0.78, 0.5, 0.7)
	s.corner_radius_top_left = 2
	s.corner_radius_top_right = 2
	s.corner_radius_bottom_left = 2
	s.corner_radius_bottom_right = 2
	s.content_margin_left = 2
	s.content_margin_right = 2
	s.content_margin_top = 2
	s.content_margin_bottom = 2
	return s


func _bar_bg(c: Color) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = c
	s.corner_radius_top_left = 1
	s.corner_radius_top_right = 1
	s.corner_radius_bottom_left = 1
	s.corner_radius_bottom_right = 1
	return s


func _bar_fill(c: Color) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = c
	s.corner_radius_top_left = 1
	s.corner_radius_top_right = 1
	s.corner_radius_bottom_left = 1
	s.corner_radius_bottom_right = 1
	return s


# ── Refresh from GameManager ──────────────────────────────────────
func _refresh() -> void:
	_set_health(GameManager.health, GameManager.max_health)
	_set_xp(GameManager.xp, GameManager.level * GameConstants.XP_PER_LEVEL_BASE)
	level_label.text = "Lv %d" % GameManager.level
	objective_label.text = QuestManager.get_objective()


func _set_health(c: int, m: int) -> void:
	health_bar.max_value = m
	health_bar.value = c
	health_label.text = "%d / %d" % [c, m]


func _set_xp(c: int, t: int) -> void:
	xp_bar.max_value = max(1, t)
	xp_bar.value = c


func _process(delta: float) -> void:
	# Clock.
	var secs := int(GameManager.play_time)
	clock_label.text = "%02d:%02d" % [secs / 60, secs % 60]
	# Toast fade.
	if toast_timer > 0:
		toast_timer -= delta
		if toast_timer <= 0:
			toast_label.visible = false
	# Notification fade.
	if notification_timer > 0:
		notification_timer -= delta
		if notification_timer <= 0:
			notification_panel.visible = false


func _show_toast(text: String, color: Color) -> void:
	toast_label.text = text
	toast_label.add_theme_color_override("font_color", color)
	toast_label.visible = true
	toast_timer = 2.2
	AudioManager.play_sfx("toast")


func _show_notification(title: String, body: String) -> void:
	notification_label.text = "%s\n%s" % [title, body]
	notification_panel.visible = true
	notification_timer = 3.0


func _shake(amount: float) -> void:
	# Forward to the active camera.
	var cam := get_viewport().get_camera_2d()
	if cam and cam.has_method("add_shake"):
		cam.add_shake(amount)


# ── Panel toggles ─────────────────────────────────────────────────
func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("toggle_inventory"):
		_toggle_panel("inventory")
	elif event.is_action_pressed("toggle_journal"):
		_toggle_panel("journal")
	elif event.is_action_pressed("toggle_codex"):
		_toggle_panel("codex")
	elif event.is_action_pressed("pause"):
		_toggle_pause()


func _toggle_panel(which: String) -> void:
	any_panel_open = !any_panel_open
	GameManager.cutscene_locked = any_panel_open
	# Simple toast feedback; full panels wired in a later polish pass.
	_show_toast("%s %s" % [which.capitalize(), "open" if any_panel_open else "closed"], Color(0.85, 0.78, 0.5))


func _toggle_pause() -> void:
	GameManager.paused = !GameManager.paused
	get_tree().paused = GameManager.paused
	EventBus.pause_toggled.emit(GameManager.paused)
	_show_toast("Paused" if GameManager.paused else "Resumed", Color(0.85, 0.78, 0.5))
