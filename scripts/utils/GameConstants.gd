## GameConstants.gd  — shared constants & data tables for Project NOOR.
##
## Mirrors src/game/config.ts and src/game/game-state.ts from the Phaser source.
## Kept as a plain class (not autoload) of static constants + item/character
## definitions so any script can reference GameConstants.TILE etc.
class_name GameConstants

# ── World / rendering ─────────────────────────────────────────────
const TILE: int = 16
const WORLD_W: int = 60            # tiles (San Diego)
const WORLD_H: int = 45
const VIEW_W: int = 480            # internal resolution
const VIEW_H: int = 320
const CAMERA_ZOOM: float = 2.0
const BG_COLOR: Color = Color(0.078, 0.063, 0.11, 1.0)

# ── Player movement ───────────────────────────────────────────────
const WALK_SPEED: float = 70.0     # px/sec
const RUN_SPEED: float = 120.0
const ACCEL: float = 800.0
const FRICTION: float = 900.0
const KNOCKBACK_FORCE: float = 140.0
const INVULN_TIME: float = 0.6

# ── Stats / progression ───────────────────────────────────────────
const START_HEALTH: int = 100
const START_MAX_HEALTH: int = 100
const START_XP: int = 0
const START_LEVEL: int = 1
const XP_PER_LEVEL_BASE: int = 100
const HEALTH_PER_LEVEL: int = 20
const XP_PER_ENEMY: int = 25
const ENEMY_HP: int = 30
const ATTACK_DAMAGE: int = 15

# ── Save ──────────────────────────────────────────────────────────
const SAVE_DIR: String = "user://save_slots/"
const SAVE_VERSION: int = 1
const MAX_SAVE_SLOTS: int = 3
const AUTOSAVE_INTERVAL: float = 60.0  # seconds

# ── Character roster (mirrors assetRegistry CHARACTER_SHEETS) ─────
const PLAYABLE_CHARS: Array[String] = ["rizal", "ibara"]
const NPC_CHARS: Array[String] = [
	"clara", "elias", "damaso", "tiago", "sisa", "simoun", "salve", "basilio"
]
const ALL_CHAR_SHEETS: Array[String] = [
	"rizal", "ibara", "clara", "damaso", "simoun", "salve", "elias", "sisa",
	"basilio", "tiago", "student-npc", "villager-npc", "religious-npc",
	"spanish-npc", "misc-npc", "animals-assets"
]
const ENVIRONMENT_SHEETS: Array[String] = [
	"building-assets", "nature-assets", "interior-assets", "furniture-assets",
	"collectible-assets", "icons-assets", "ui-assets", "gamedev-assets"
]

# ── Animation order (mirrors assetRegistry ANIM_ORDER) ────────────
const ANIM_ORDER: Array[String] = [
	"idle", "walk", "run", "jump", "attack",
	"hurt", "dead", "fall", "climb", "jumpattack"
]

# ── Quest stages (mirrors game-state QuestStage) ──────────────────
const QUEST_STAGES: Array[String] = ["intro", "gather", "return", "complete"]

# ── Item definitions (mirrors game-state ITEM_DEFS) ───────────────
class ItemDef:
	var id: String
	var name: String
	var desc: String
	var color: Color
	var atlas_key: String       # which environment atlas holds the sprite
	var frame_index: int        # index into the "default" anim of that atlas
	func _init(i: String, n: String, d: String, c: Color, ak: String, fi: int) -> void:
		id = i; name = n; desc = d; color = c; atlas_key = ak; frame_index = fi

const ITEM_DEFS_RAW: Array = [
	["relic_crucifix", "Wooden Crucifix", "A simple cross worn smooth by prayer.",      Color(0.79, 0.63, 0.29), "collectible-assets", 0],
	["relic_letter",   "Father's Letter",  "Sealed and stained — the truth of your lineage.", Color(0.91, 0.84, 0.66), "collectible-assets", 1],
	["relic_ring",     "Clara's Ring",     "A band of promise, given in the convent garden.", Color(0.96, 0.78, 0.85), "collectible-assets", 2],
	["relic_book",     "Forbidden Tome",   "Banned by the friars — its pages whisper of reform.", Color(0.75, 0.89, 0.75), "collectible-assets", 3],
	["relic_potion",   "Herbal Remedy",    "Sisa's brew — restores vitality in dark hours.", Color(0.55, 0.89, 0.66), "collectible-assets", 4],
	["relic_coin",     "Doubloon",         "Cap. Tiago's gold — heavy with compromise.", Color(1.0, 0.85, 0.40), "collectible-assets", 5],
]

static func get_item_defs() -> Array[ItemDef]:
	var out: Array[ItemDef] = []
	for raw in ITEM_DEFS_RAW:
		out.append(ItemDef.new(raw[0], raw[1], raw[2], raw[3], raw[4], raw[5]))
	return out

static func get_item_def(item_id: String) -> ItemDef:
	for raw in ITEM_DEFS_RAW:
		if raw[0] == item_id:
			return ItemDef.new(raw[0], raw[1], raw[2], raw[3], raw[4], raw[5])
	return null

# ── NPC roster (mirrors WorldScene NPCS) ──────────────────────────
class NpcDef:
	var key: String
	var tile_x: int
	var tile_y: int
	var display_name: String
	var color: Color
	var lines: Array[String]
	var quest_lines: Dictionary  # stage -> Array[String]
	var gives_item_stage: String
	var gives_item: String
	func _init(k: String, tx: int, ty: int, n: String, c: Color) -> void:
		key = k; tile_x = tx; tile_y = ty; display_name = n; color = c
		lines = []; quest_lines = {}

const NPC_DEFS_RAW: Array = [
	{
		"key": "clara", "tile_x": 30, "tile_y": 12,
		"name": "María Clara", "color": Color(0.96, 0.78, 0.85),
		"lines": [
			"Crisóstomo… you have returned at last.",
			"The years apart felt like a single endless prayer.",
			"Walk with me — San Diego has changed, and not for the better."
		],
		"quest_lines": {
			"gather": [
				"The friars hid our relics across the town.",
				"Recover them — the crucifix, the letter, my ring…",
				"Beware the Guardia Civil. They patrol the roads at night."
			],
			"return": [
				"You carry the relics! I knew you would not fail us.",
				"Bring them all to me, and our story may yet end in light."
			],
			"complete": [
				"It is done. San Diego will remember this day.",
				"Whatever comes next, we face it together, my Crisóstomo."
			]
		}
	},
	{
		"key": "elias", "tile_x": 12, "tile_y": 30,
		"name": "Elías", "color": Color(0.75, 0.89, 0.75),
		"lines": [
			"Keep your voice down, señor. The walls of this town have ears.",
			"I am Elías. I owe you a debt I may never repay.",
			"When you are ready to know the truth of your father, find me by the lake."
		],
		"gives_item_stage": "gather", "gives_item": "relic_letter"
	},
	{
		"key": "damaso", "tile_x": 48, "tile_y": 14,
		"name": "Fr. Dámaso", "color": Color(0.91, 0.72, 0.47),
		"lines": [
			"So the son returns, bold as his dead father!",
			"Beware, boy — San Diego bends to my word, not yours.",
			"Go on, walk your little paths. We shall see who has the last laugh."
		]
	},
	{
		"key": "tiago", "tile_x": 42, "tile_y": 32,
		"name": "Cap. Tiago", "color": Color(0.85, 0.78, 0.60),
		"lines": [
			"Ah, my dear Crisóstomo! Welcome home!",
			"Clara has missed you terribly — do visit the house.",
			"Business calls me to Manila, but tonight we feast!"
		],
		"gives_item_stage": "gather", "gives_item": "relic_coin"
	},
	{
		"key": "sisa", "tile_x": 18, "tile_y": 8,
		"name": "Sisa", "color": Color(0.78, 0.75, 0.91),
		"lines": [
			"My boys… have you seen my boys? Basilio? Crispín?",
			"They took them into the convent and they will not give them back…",
			"Forgive me — I must keep looking. The bell tolls, it always tolls."
		],
		"gives_item_stage": "gather", "gives_item": "relic_potion"
	}
]

static func get_npc_defs() -> Array:
	var out: Array = []
	for raw in NPC_DEFS_RAW:
		var d = NpcDef.new(raw["key"], int(raw["tile_x"]), int(raw["tile_y"]), raw["name"], raw["color"])
		d.lines = raw.get("lines", [])
		d.quest_lines = raw.get("quest_lines", {})
		d.gives_item_stage = raw.get("gives_item_stage", "")
		d.gives_item = raw.get("gives_item", "")
		out.append(d)
	return out

static func get_npc_def(npc_key: String) -> NpcDef:
	for d in get_npc_defs():
		if d.key == npc_key: return d
	return null

# ── Collectibles (mirrors WorldScene COLLECTIBLES) ────────────────
const COLLECTIBLES_RAW: Array = [
	["relic_crucifix", 6,  6],
	["relic_letter",   54, 40],
	["relic_ring",     50, 6],
	["relic_book",     8,  40],
	["relic_potion",   30, 4],
	["relic_coin",     30, 42],
]

# ── Enemies / Guardia Civil (mirrors WorldScene ENEMIES) ──────────
const ENEMIES_RAW: Array = [
	["guard_1", 10, 8,  24],
	["guard_2", 52, 10, 24],
	["guard_3", 12, 36, 24],
	["guard_4", 48, 38, 24],
]
