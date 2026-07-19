## SanDiego.gd — the town of San Diego (main world map).
##
## Ported from src/game/scenes/WorldScene.ts. Rebuilt natively:
##   - TileMap-based ground (grass/path/water/flower) instead of Phaser Graphics
##   - Real atlas buildings + scattered nature sprites (physics bodies)
##   - Player (CharacterBody2D) + camera (RPGCamera)
##   - 5 quest-aware NPCs (clara, elias, damaso, tiago, sisa)
##   - 6 relic collectibles
##   - 4 Guardia Civil enemies
##   - HUD CanvasLayer
##
## The world is 60x45 tiles @ 16px. Player spawns at town centre.
extends Node2D

var tile_map: TileMapLayer
var player: CharacterBody2D
var camera: Camera2D
var hud: CanvasLayer
var buildings: Node2D
var nature: Node2D
var entities: Node2D


func _ready() -> void:
	buildings = Node2D.new(); buildings.name = "Buildings"; add_child(buildings)
	nature = Node2D.new(); nature.name = "Nature"; add_child(nature)
	entities = Node2D.new(); entities.name = "Entities"; add_child(entities)

	_build_ground()
	_place_environment()
	_spawn_player()
	_spawn_npcs()
	_spawn_collectibles()
	_spawn_enemies()
	_setup_camera()
	_spawn_hud()

	EventBus.quest_objective_updated.emit(QuestManager.get_objective())
	EventBus.fade_requested.emit(Color.BLACK, 0.5, false)
	AudioManager.play_music("san_diego")
	GameManager.current_scene_path = "res://scenes/maps/SanDiego.tscn"


# ── Ground (TileMapLayer with a generated TileSet) ────────────────
func _build_ground() -> void:
	var ts := TileSet.new()
	ts.tile_size = Vector2i(GameConstants.TILE, GameConstants.TILE)
	var img := Image.create(GameConstants.TILE, GameConstants.TILE * 6, false, Image.FORMAT_RGBA8)
	var cols := [Color(0.227, 0.353, 0.196),
				 Color(0.204, 0.314, 0.157),
				 Color(0.541, 0.416, 0.227),
				 Color(0.471, 0.353, 0.188),
				 Color(0.165, 0.290, 0.416),
				 Color(0.227, 0.353, 0.196)]
	for i in range(6):
		for y in range(GameConstants.TILE):
			for x in range(GameConstants.TILE):
				img.set_pixel(x, y + i * GameConstants.TILE, cols[i])
		for _s in range(20):
			var sx := randi() % GameConstants.TILE
			var sy := randi() % GameConstants.TILE
			var c := cols[i]
			img.set_pixel(sx, sy + i * GameConstants.TILE, c.lightened(0.1) if (sx + sy) % 2 == 0 else c.darkened(0.1))
	for _s in range(8):
		var fx := randi() % GameConstants.TILE
		var fy := (randi() % GameConstants.TILE) + 5 * GameConstants.TILE
		img.set_pixel(fx, fy, Color(0.79, 0.63, 0.29))
	var tex := ImageTexture.create_from_image(img)
	var src := TileSetAtlasSource.new()
	src.texture = tex
	src.texture_region_size = Vector2i(GameConstants.TILE, GameConstants.TILE)
	ts.add_source(src)
	for i in range(6):
		src.create_tile(Vector2i(0, i))

	tile_map = TileMapLayer.new()
	tile_map.name = "Ground"
	tile_map.tile_set = ts
	add_child(tile_map)
	move_child(tile_map, 0)

	var cx := GameConstants.WORLD_W / 2
	var cy := GameConstants.WORLD_H / 2
	for ty in range(GameConstants.WORLD_H):
		for tx in range(GameConstants.WORLD_W):
			var cell := Vector2i(tx, ty)
			var atlas := Vector2i(0, 0 if (tx + ty) % 2 == 0 else 1)
			if _is_path(tx, ty, cx, cy):
				atlas = Vector2i(0, 2 if (tx + ty) % 2 == 0 else 3)
			elif _is_water(tx, ty):
				atlas = Vector2i(0, 4)
			elif (tx * 7 + ty * 13) % 23 == 0:
				atlas = Vector2i(0, 5)
			tile_map.set_cell(cell, 0, atlas)


func _is_path(tx: int, ty: int, cx: int, cy: int) -> bool:
	if ty == cy or ty == cy - 1: return tx > 2 and tx < GameConstants.WORLD_W - 3
	if tx == cx or tx == cx - 1: return ty > 2 and ty < GameConstants.WORLD_H - 3
	if ty == 12 and tx >= cx - 1 and tx <= 32: return true
	if ty == 30 and tx >= 10 and tx <= 14: return true
	return false


func _is_water(tx: int, ty: int) -> bool:
	var lx := 6; var ly := 38; var r := 5
	var dx := tx - lx; var dy := ty - ly
	return dx * dx + dy * dy < r * r


# ── Environment (real atlas sprites) ──────────────────────────────
func _place_environment() -> void:
	var bsf: SpriteFrames = load("res://resources/sprite_frames/building-assets.tres")
	var nsf: SpriteFrames = load("res://resources/sprite_frames/nature-assets.tres")
	if bsf and bsf.has_animation("default") and bsf.get_frame_count("default") > 0:
		var b_positions := [Vector2(44, 12), Vector2(8, 14), Vector2(30, 30)]
		for i in range(3):
			var idx := mini(i, bsf.get_frame_count("default") - 1)
			var s := Sprite2D.new()
			s.texture = bsf.get_frame_texture("default", idx)
			s.scale = Vector2(3, 3)
			s.position = b_positions[i] * GameConstants.TILE
			s.centered = false
			s.offset = Vector2(-s.texture.get_width() / 2.0, -s.texture.get_height())
			s.z_index = int(b_positions[i].y)
			buildings.add_child(s)
			var body := StaticBody2D.new()
			body.position = s.position + Vector2(0, -8)
			var col := CollisionShape2D.new()
			var rect := RectangleShape2D.new()
			rect.size = Vector2(s.texture.get_width() * 1.5, 12)
			col.shape = rect
			body.add_child(col)
			buildings.add_child(body)

	if nsf and nsf.has_animation("default"):
		var count := nsf.get_frame_count("default")
		var placed := {}
		for i in range(60):
			var tx := randi_range(1, GameConstants.WORLD_W - 2)
			var ty := randi_range(1, GameConstants.WORLD_H - 2)
			var key := "%d,%d" % [tx, ty]
			if placed.has(key): continue
			if _is_path(tx, ty, GameConstants.WORLD_W / 2, GameConstants.WORLD_H / 2): continue
			if _is_water(tx, ty): continue
			placed[key] = true
			var idx := i % mini(8, count)
			var s := Sprite2D.new()
			s.texture = nsf.get_frame_texture("default", idx)
			s.scale = Vector2(2, 2)
			s.position = Vector2(tx * GameConstants.TILE + 8, ty * GameConstants.TILE + 16)
			s.centered = false
			s.offset = Vector2(-s.texture.get_width() / 2.0, -s.texture.get_height())
			s.z_index = ty * GameConstants.TILE + GameConstants.TILE
			nature.add_child(s)
			var body := StaticBody2D.new()
			body.position = s.position + Vector2(0, -2)
			var col := CollisionShape2D.new()
			var rect := RectangleShape2D.new()
			rect.size = Vector2(8, 6)
			col.shape = rect
			body.add_child(col)
			nature.add_child(body)


# ── Player ────────────────────────────────────────────────────────
func _spawn_player() -> void:
	player = preload("res://scripts/player/Player.gd").new()
	player.char_key = GameManager.player_char
	var px := GameConstants.WORLD_W * GameConstants.TILE / 2
	var py := GameConstants.WORLD_H * GameConstants.TILE / 2 + 8
	player.position = Vector2(px, py)
	entities.add_child(player)


# ── NPCs ──────────────────────────────────────────────────────────
func _spawn_npcs() -> void:
	for def in GameConstants.get_npc_defs():
		var npc := preload("res://scripts/npc/NPC.gd").new()
		npc.npc_key = def.key
		npc.display_name = def.display_name
		npc.name_color = def.color
		npc.dialogue_path = "res://dialogues/%s.json" % def.key
		npc.gives_item_stage = def.gives_item_stage
		npc.gives_item = def.gives_item
		npc.position = Vector2(def.tile_x * GameConstants.TILE + 8, def.tile_y * GameConstants.TILE + 8)
		entities.add_child(npc)


# ── Collectibles ──────────────────────────────────────────────────
func _spawn_collectibles() -> void:
	for raw in GameConstants.COLLECTIBLES_RAW:
		var item_id: String = raw[0]
		var tx: int = raw[1]
		var ty: int = raw[2]
		if InventoryManager.has_item(item_id): continue
		var c := preload("res://scripts/inventory/Collectible.gd").new()
		c.item_id = item_id
		c.atlas_key = "collectible-assets"
		c.frame_index = GameConstants.get_item_def(item_id).frame_index
		c.position = Vector2(tx * GameConstants.TILE + 8, ty * GameConstants.TILE + 8)
		entities.add_child(c)


# ── Enemies ───────────────────────────────────────────────────────
func _spawn_enemies() -> void:
	for raw in GameConstants.ENEMIES_RAW:
		var eid: String = raw[0]
		var tx: int = raw[1]
		var ty: int = raw[2]
		var pr: int = raw[3]
		if GameManager.defeated.has(eid): continue
		var e := preload("res://scripts/combat/Enemy.gd").new()
		e.enemy_id = eid
		e.patrol_range = pr
		e.position = Vector2(tx * GameConstants.TILE + 8, ty * GameConstants.TILE + 8)
		entities.add_child(e)


# ── Camera ────────────────────────────────────────────────────────
func _setup_camera() -> void:
	camera = Camera2D.new()
	camera.set_script(preload("res://scripts/camera/RPGCamera.gd"))
	camera.global_position = player.global_position
	camera.zoom = Vector2(GameConstants.CAMERA_ZOOM, GameConstants.CAMERA_ZOOM)
	camera.set_limits(Rect2(0, 0, GameConstants.WORLD_W * GameConstants.TILE, GameConstants.WORLD_H * GameConstants.TILE))
	add_child(camera)
	camera.set_target(player)
	EventBus.screen_shake_requested.connect(func(a, _d): camera.add_shake(a))


# ── HUD ───────────────────────────────────────────────────────────
func _spawn_hud() -> void:
	hud = CanvasLayer.new()
	hud.set_script(preload("res://scripts/ui/HUD.gd"))
	hud.name = "HUD"
	add_child(hud)
