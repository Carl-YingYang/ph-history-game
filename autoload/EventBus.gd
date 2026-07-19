## EventBus.gd  (autoload: EventBus)
## Global signal bus. Every decoupled system posts/listens here so scenes never
## hold hard references to each other. This is the single source of truth for
## cross-system events in the Project NOOR RPG engine.
extends Node

# ── Player / stats ────────────────────────────────────────────────
signal player_health_changed(current: int, maximum: int)
signal player_xp_changed(current: int, threshold: int)
signal player_level_changed(level: int)
signal player_died
signal player_respawned
signal player_char_changed(char_key: String)

# ── Inventory / collectibles ──────────────────────────────────────
signal item_collected(item_id: String)
signal item_removed(item_id: String)
signal inventory_opened
signal inventory_closed

# ── Quests ────────────────────────────────────────────────────────
signal quest_stage_changed(quest_id: String, stage: String)
signal quest_objective_updated(objective_text: String)
signal quest_completed(quest_id: String)

# ── Dialogue ──────────────────────────────────────────────────────
signal dialogue_started(speaker: String)
signal dialogue_finished(speaker: String)
signal dialogue_line_shown(speaker: String, text: String)
signal choice_presented(choices: Array)
signal choice_made(index: int)

# ── Combat ────────────────────────────────────────────────────────
signal enemy_hit(enemy_id: String, damage: int)
signal enemy_defeated(enemy_id: String, xp: int)
signal player_hit(damage: int)
signal attack_triggered

# ── NPC ───────────────────────────────────────────────────────────
signal npc_spoken(npc_key: String)
signal npc_approached(npc_key: String)
signal npc_left(npc_key: String)

# ── UI / system ───────────────────────────────────────────────────
signal toast_requested(text: String, color: Color)
signal notification_requested(title: String, body: String)
signal hud_refresh_requested
signal pause_toggled(paused: bool)
signal scene_change_requested(scene_path: String, spawn_key: String)
signal fade_requested(color: Color, duration: float, fade_out: bool)
signal screen_shake_requested(amount: float, duration: float)

# ── Audio ─────────────────────────────────────────────────────────
signal music_changed(track_key: String)
signal sfx_requested(sfx_key: String)
signal mute_toggled(muted: bool)

# ── Codex / journal ───────────────────────────────────────────────
signal codex_entry_unlocked(entry_id: String)
signal journal_entry_added(entry_id: String)
