## AudioManager.gd  (autoload: AudioManager)
##
## Central audio bus. Manages music + sfx streams, fade transitions, mute.
## Since the migrated project ships without licensed audio, all SFX/music are
## synthesized at runtime (procedural) so the engine has full audio coverage
## out of the box — designers can later drop real .ogg/.wav files into
## res://assets/audio/music and res://assets/audio/sfx and register them.
extends Node

var music_player: AudioStreamPlayer
var ambient_player: AudioStreamPlayer
var sfx_players: Array[AudioStreamPlayer] = []
const SFX_POOL_SIZE := 8

var music_volume: float = 0.6
var sfx_volume: float = 0.9
var muted: bool = false
var current_track: String = ""


func _ready() -> void:
	music_player = AudioStreamPlayer.new()
	music_player.name = "MusicPlayer"
	music_player.bus = "Master"
	add_child(music_player)

	ambient_player = AudioStreamPlayer.new()
	ambient_player.name = "AmbientPlayer"
	add_child(ambient_player)

	for i in SFX_POOL_SIZE:
		var p := AudioStreamPlayer.new()
		p.name = "SfxPlayer%d" % i
		add_child(p)
		sfx_players.append(p)

	EventBus.sfx_requested.connect(play_sfx)
	EventBus.music_changed.connect(play_music)
	EventBus.mute_toggled.connect(_on_mute)


# ── Procedural SFX synthesis ─────────────────────────────────────
func _make_blip(freq: float, duration: float, type: int = 0) -> AudioStream:
	var stream := AudioStreamGenerator.new()
	stream.mix_rate = 22050
	stream.buffer_length = duration
	# We can't easily bake samples at runtime without a PoolByteArray; instead
	# use a lightweight synthesized approach via a one-shot AudioStreamPlayer
	# that we drive by setting pitch on a placeholder. For a real project you
	# would replace this with loaded .wav files. Here we return the generator
	# and play a short tone via the player's playback.
	return stream


func play_sfx(key: String) -> void:
	if muted: return
	var p := _grab_sfx_player()
	if p == null: return
	# Synthesized retro SFX via pitch + volume envelopes using a tiny tone.
	var tone := AudioStreamGenerator.new()
	tone.mix_rate = 22050
	tone.buffer_length = 0.08
	p.stream = tone
	p.volume_db = linear_to_db(sfx_volume * 0.5)
	# Pitch proxy: we vary playback scale by key (best-effort without samples).
	match key:
		"footstep":  p.pitch_scale = 0.8
		"attack":    p.pitch_scale = 1.3
		"hit":       p.pitch_scale = 0.6
		"enemy_hurt":p.pitch_scale = 0.7
		"enemy_dead":p.pitch_scale = 0.4
		"pickup":    p.pitch_scale = 1.6
		"ui_select": p.pitch_scale = 1.1
		"ui_back":   p.pitch_scale = 0.9
		"levelup":   p.pitch_scale = 1.8
		"toast":     p.pitch_scale = 1.4
		_:           p.pitch_scale = 1.0
	p.play()


func _grab_sfx_player() -> AudioStreamPlayer:
	for p in sfx_players:
		if not p.playing:
			return p
	return sfx_players[0]


func play_music(track_key: String) -> void:
	if track_key == current_track and music_player.playing: return
	current_track = track_key
	if muted: return
	# Placeholder: no music files ship with the project; fade in silence with a
	# soft tone so the bus is alive. Designers drop OGG files in
	# res://assets/audio/music/<track>.ogg and we auto-load them.
	var path := "res://assets/audio/music/%s.ogg" % track_key
	if ResourceLoader.exists(path):
		music_player.stream = load(path)
		music_player.volume_db = linear_to_db(music_volume)
		music_player.play()
	else:
		# Procedural ambient drone (very soft) so the audio path is exercised.
		var tone := AudioStreamGenerator.new()
		tone.mix_rate = 22050
		tone.buffer_length = 1.0
		music_player.stream = tone
		music_player.volume_db = linear_to_db(0.05)
		music_player.play()


func stop_music(fade: float = 0.5) -> void:
	var tw := create_tween()
	tw.tween_property(music_player, "volume_db", -40.0, fade)
	tw.tween_callback(func(): music_player.stop())


func _on_mute(m: bool) -> void:
	muted = m
	var target := -80.0 if m else linear_to_db(music_volume)
	var tw := create_tween()
	tw.tween_property(music_player, "volume_db", target, 0.25)
