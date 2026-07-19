# PROJECT NOOR — Godot 4.4 Native RPG Engine

A professional 2D pixel-art RPG engine, migrated from the original
**Next.js + Phaser** project ([ph-history-game](https://github.com/Carl-YingYang/ph-history-game))
into a native **Godot 4.4** project. Built around the educational story of
**Noli Me Tangere** and **El Filibusterismo** by Dr. José Rizal, with an
engine designed to be reused for *El Filibusterismo*, the *Philippine
Revolution*, and additional educational campaigns.

> ⚠️ This is a **complete engine migration**, not a wrapper. There is no Phaser,
> no React, no web view. Every system is rebuilt with native Godot nodes:
> `CharacterBody2D`, `TileMapLayer`, `AnimatedSprite2D`, `Area2D`, `CanvasLayer`,
> `AnimationPlayer`, native signals, and `AudioStreamPlayer`.

---

## 1. Open in Godot 4.4

1. Install **Godot 4.4** (stable) from <https://godotengine.org>.
2. Open Godot → **Import** → select this folder's `project.godot`.
3. On first open Godot imports all PNGs (nearest filter, no mipmap) and the
   generated `SpriteFrames` `.tres` resources. This takes a few seconds.
4. Press **F5** (or the ▶ button) to run. The main scene is
   `res://scenes/main/Boot.tscn`, which fades into the title screen.

The internal resolution is **480 × 320** (pixel-perfect, scaled ×2 by default
window). Stretch mode `viewport`, aspect `keep` — crisp integer scaling on any
display.

---

## 2. Project Structure

```
res://
├── project.godot              ← pixel-perfect config, autoloads, input map, physics layers
├── icon.svg
├── assets/
│   ├── characters/*.png       ← 16 character sprite sheets (copied from source)
│   ├── tilesets/*.png         ← 8 environment sheets
│   ├── shaders/hit_flash.gdshader
│   ├── audio/{music,sfx}/     ← drop real .ogg/.wav here to override procedural audio
│   └── fonts/
├── autoload/                  ← 8 global singletons (the engine core)
│   ├── EventBus.gd            ← decoupled signal bus
│   ├── GameManager.gd         ← runtime state: health/xp/level/quest/play-time
│   ├── SaveManager.gd         ← native JSON saves to user://save_slots/
│   ├── QuestManager.gd        ← data-driven quest evaluator (no hardcoded quests)
│   ├── InventoryManager.gd    ← relic inventory
│   ├── DialogueManager.gd     ← dialogue runner w/ typewriter + choices + hooks
│   ├── AudioManager.gd        ← music/sfx bus (procedural fallback)
│   └── CodexManager.gd        ← codex + journal databases
├── scripts/
│   ├── player/Player.gd + states/   ← CharacterBody2D + StateMachine (idle/walk/run/attack/hurt/dead/interact)
│   ├── npc/NPC.gd                   ← NPC base + state machine + dialogue
│   ├── combat/Enemy.gd              ← Guardia Civil (patrol, HP, knockback, death, XP)
│   ├── inventory/Collectible.gd     ← relic pickups
│   ├── camera/RPGCamera.gd          ← smooth follow, deadzone, limits, trauma shake, cutscene
│   ├── systems/{StateMachine,State,Interactable,FadeOverlay,Boot}.gd
│   ├── ui/{HUD,DialogueBox,TitleScreen}.gd
│   ├── maps/SanDiego.gd             ← world builder (TileMap + entities)
│   └── utils/GameConstants.gd       ← all data tables (items, NPCs, collectibles, enemies)
├── scenes/
│   ├── main/{Boot,Title}.tscn
│   ├── maps/SanDiego.tscn
│   └── ui/DialogueBox.tscn
├── resources/sprite_frames/*.tres   ← 24 generated SpriteFrames (AtlasTexture per frame)
├── quests/main.json                 ← the main quest (data-driven)
├── dialogues/*.json                 ← one dialogue file per NPC
└── data/{codex_entries,journal_entries}.json
```

---

## 3. Systems Ported (Phaser → Godot)

| Source (Phaser/React)         | Godot 4.4 native equivalent                          |
|-------------------------------|------------------------------------------------------|
| `Phaser.Scene`                | `PackedScene` (`Node2D`) + `SceneTree.change_scene`  |
| `Phaser.Physics.Arcade.Sprite`| `CharacterBody2D` / `StaticBody2D` + `CollisionShape2D` |
| `Phaser.GameObjects.Container`| `Node2D` parent                                      |
| Procedural `Graphics` ground  | `TileMapLayer` + generated `TileSet`                 |
| `Phaser.anims`                | `SpriteFrames` resource + `AnimatedSprite2D`         |
| Phaser texture atlas (hash)   | `AtlasTexture` regions inside `SpriteFrames` `.tres` |
| `localStorage` save           | `FileAccess` JSON → `user://save_slots/`             |
| React HUD overlay             | `CanvasLayer` + `Control` nodes (`HUD.gd`)           |
| Pub/sub state                 | Custom signals on autoload singletons (`EventBus`)   |
| `cameras.main.startFollow`    | `RPGCamera.gd` (smooth follow + deadzone + shake)    |

### Systems implemented
- **Player Controller** — `CharacterBody2D` + `StateMachine` with 7 states
  (idle/walk/run/attack/hurt/dead/interact), acceleration & friction, run
  toggle, 4-direction facing, attack hitbox, knockback, i-frames, footstep SFX,
  hit-flash shader.
- **Camera** — smooth follow, deadzone, hard limits, trauma-based screen shake,
  zoom, cutscene mode, pixel-snap.
- **NPC** — `StateMachine` (idle/look/talk), idle bob tween, faces the player,
  quest-aware dialogue via `DialogueManager`, optional item grants.
- **Dialogue** — portrait, typewriter (with SFX ticks), name plate, continue
  indicator, branching choices, `on_finish` hooks (`advance`, `grant_item`,
  `grant_xp`, `unlock_codex`, `heal`), camera lock.
- **Combat** — `Area2D` hitboxes/hurtboxes, damage, knockback, hit-flash, death
  animation, XP grant, i-frames.
- **Quest** — fully data-driven from `quests/*.json`. The `QuestManager`
  evaluates item/spoken requirements every state change and auto-advances. No
  quest logic is hardcoded.
- **Inventory** — relic collection, dedupe, codex+journal side-effects.
- **Save** — native Godot JSON to `user://save_slots/`. Autosave every 60s +
  on every state mutation (debounced). 3 manual slots + 1 autoslot. Schema
  versioned.
- **HUD** — objective tracker, health/XP bars, level, play-time clock, toast
  notifications, notifications, proximity hint, control hints. Toggles for
  inventory/journal/codex/pause.
- **Codex & Journal** — data-driven databases, unlock on item collect / quest
  complete.
- **Audio** — music + sfx bus with procedural fallback so the engine has full
  audio coverage out of the box; drop real `.ogg`/`.wav` files into
  `assets/audio/music/<track>.ogg` / `assets/audio/sfx/` and they auto-load.
- **Pixel-perfect** — `snap_2d_transforms_to_pixel`, `snap_2d_vertices_to_pixel`,
  `default_texture_filter = Nearest`, no mipmaps, integer scaling.

---

## 4. Controls

| Action            | Key              |
|-------------------|------------------|
| Move              | WASD / Arrows    |
| Run               | Shift            |
| Interact / Talk   | E / Space / Z    |
| Attack            | J / Left-click   |
| Inventory         | I                |
| Journal           | L                |
| Codex             | C                |
| Pause / Back      | Esc              |
| Mute              | M                |
| Advance dialogue  | E / Space / Z    |

All actions are mapped in `project.godot` under `[input]` and are rebindable
from **Project → Project Settings → Input Map**.

---

## 5. Adding new content (no code changes)

- **New NPC**: drop a `dialogues/<key>.json`, add an entry to
  `NPC_DEFS_RAW` in `scripts/utils/GameConstants.gd`. Done.
- **New quest**: drop a `quests/<id>.json`. Set `QuestManager.active_quest`.
- **New relic**: add to `ITEM_DEFS_RAW` + `COLLECTIBLES_RAW` in
  `GameConstants.gd`, add codex/journal entries.
- **New map**: create `scenes/maps/<name>.tscn` + a builder script (copy
  `SanDiego.gd`), add a transition trigger.

---

## 6. Asset pipeline (re-generation)

The 24 `SpriteFrames` `.tres` resources in `resources/sprite_frames/` were
generated from the Phaser atlas JSONs by:

```
bun run scripts/convert_assets.ts   # (in the migration Next.js host project)
```

To regenerate after editing the source atlas JSONs, re-run that script. It
reads `/tmp/ph-history-game/src/app/assets/*.json` + `*.png` and re-emits the
`.tres` + `.png` + `.png.import` files into this Godot project.

---

## 7. Migration source → this project

Migrated from <https://github.com/Carl-YingYang/ph-history-game>
(Next.js + Phaser) by the Project NOOR Lead Technical Director.
Every gameplay system, asset, NPC, collectible, enemy, and quest line is
preserved 1:1; only the engine changed.
