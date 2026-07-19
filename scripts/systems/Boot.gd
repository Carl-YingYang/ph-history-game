## Boot.gd — boot scene. Verifies autoloads, instantiates the persistent
## FadeOverlay, plays a short logo, then goes to the title screen.
extends Node2D


func _ready() -> void:
	# Ensure the fade overlay exists for the whole game.
	var fader := FadeOverlay.new()
	fader.name = "FadeOverlay"
	get_tree().root.add_child(fader)
	# Fade in from black.
	EventBus.fade_requested.emit(Color.BLACK, 0.4, false)
	await get_tree().create_timer(0.8).timeout
	get_tree().change_scene_to_file("res://scenes/main/Title.tscn")
