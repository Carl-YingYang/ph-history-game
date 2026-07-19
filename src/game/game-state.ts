/**
 * game-state.ts — persistent game state with autosave to localStorage.
 *
 * Tracks: player character, health, max health, XP, level, collected items,
 * defeated enemies, NPCs spoken to, quest stage. Provides a tiny pub/sub so
 * the React HUD can react to changes without polling.
 *
 * Save format is a single JSON blob under key 'noli_save_v1'. The Phaser
 * scenes read/write via GameState; React subscribes via onState.
 */

export type ItemId = 'relic_crucifix' | 'relic_letter' | 'relic_ring' | 'relic_book' | 'relic_potion' | 'relic_coin';

export interface ItemDef {
  id: ItemId;
  name: string;
  desc: string;
  color: string;
  atlasKey: string;      // which environment atlas holds the sprite
  framePrefix: string;   // frame name pattern (we use first matching frame)
}

export const ITEM_DEFS: ItemDef[] = [
  { id: 'relic_crucifix', name: 'Wooden Crucifix', desc: 'A simple cross worn smooth by prayer.', color: '#c9a04a', atlasKey: 'collectible-assets', framePrefix: 'collectible-assets_r' },
  { id: 'relic_letter',   name: "Father's Letter",  desc: 'Sealed and stained — the truth of your lineage.', color: '#e8d5a8', atlasKey: 'collectible-assets', framePrefix: 'collectible-assets_r' },
  { id: 'relic_ring',     name: 'Clara’s Ring',     desc: 'A band of promise, given in the convent garden.', color: '#f4c8d8', atlasKey: 'collectible-assets', framePrefix: 'collectible-assets_r' },
  { id: 'relic_book',     name: 'Forbidden Tome',   desc: 'Banned by the friars — its pages whisper of reform.', color: '#bfe3c0', atlasKey: 'collectible-assets', framePrefix: 'collectible-assets_r' },
  { id: 'relic_potion',   name: 'Herbal Remedy',    desc: 'Sisa’s brew — restores vitality in dark hours.', color: '#8be3a8', atlasKey: 'collectible-assets', framePrefix: 'collectible-assets_r' },
  { id: 'relic_coin',     name: 'Doubloon',         desc: 'Cap. Tiago’s gold — heavy with compromise.', color: '#ffd966', atlasKey: 'collectible-assets', framePrefix: 'collectible-assets_r' },
];

export type QuestStage = 'intro' | 'gather' | 'return' | 'complete';

export interface SaveState {
  version: 1;
  playerChar: string;
  health: number;
  maxHealth: number;
  xp: number;
  level: number;
  inventory: ItemId[];
  defeated: string[];
  spokenTo: string[];
  questStage: QuestStage;
  playTimeMs: number;
  updatedAt: number;
}

const SAVE_KEY = 'noli_save_v1';
const DEFAULT_STATE: SaveState = {
  version: 1,
  playerChar: 'rizal',
  health: 100,
  maxHealth: 100,
  xp: 0,
  level: 1,
  inventory: [],
  defeated: [],
  spokenTo: [],
  questStage: 'intro',
  playTimeMs: 0,
  updatedAt: 0,
};

type Listener = (s: SaveState) => void;

class GameStateStore {
  private state: SaveState;
  private listeners = new Set<Listener>();
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.state = this.load();
  }

  private load(): SaveState {
    if (typeof window === 'undefined') return { ...DEFAULT_STATE };
    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) return { ...DEFAULT_STATE };
      const parsed = JSON.parse(raw) as Partial<SaveState>;
      return { ...DEFAULT_STATE, ...parsed, version: 1 };
    } catch {
      return { ...DEFAULT_STATE };
    }
  }

  private scheduleSave() {
    if (typeof window === 'undefined') return;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      try {
        const toWrite = { ...this.state, updatedAt: Date.now() };
        window.localStorage.setItem(SAVE_KEY, JSON.stringify(toWrite));
      } catch {
        /* quota / disabled storage — ignore */
      }
    }, 400);
  }

  private emit() {
    const snapshot = { ...this.state };
    for (const l of this.listeners) l(snapshot);
  }

  get(): SaveState {
    return { ...this.state };
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.get());
    return () => this.listeners.delete(fn);
  }

  /** Patch partial state, persist, and notify. */
  update(patch: Partial<SaveState>) {
    this.state = { ...this.state, ...patch };
    this.scheduleSave();
    this.emit();
  }

  addItem(id: ItemId): boolean {
    if (this.state.inventory.includes(id)) return false;
    this.update({ inventory: [...this.state.inventory, id] });
    return true;
  }

  removeItem(id: ItemId) {
    this.update({ inventory: this.state.inventory.filter(i => i !== id) });
  }

  hasItem(id: ItemId): boolean {
    return this.state.inventory.includes(id);
  }

  markSpoken(npcKey: string) {
    if (this.state.spokenTo.includes(npcKey)) return;
    this.update({ spokenTo: [...this.state.spokenTo, npcKey] });
  }

  markDefeated(enemyId: string) {
    if (this.state.defeated.includes(enemyId)) return;
    this.update({
      defeated: [...this.state.defeated, enemyId],
      xp: this.state.xp + 25,
    });
    // level up every 100 xp
    if (this.state.xp >= this.state.level * 100) {
      this.update({
        level: this.state.level + 1,
        maxHealth: this.state.maxHealth + 20,
        health: this.state.maxHealth + 20,
      });
    }
  }

  damage(amount: number) {
    const h = Math.max(0, this.state.health - amount);
    this.update({ health: h });
    return h;
  }

  heal(amount: number) {
    const h = Math.min(this.state.maxHealth, this.state.health + amount);
    this.update({ health: h });
    return h;
  }

  setQuestStage(stage: QuestStage) {
    if (this.state.questStage === stage) return;
    this.update({ questStage: stage });
  }

  setPlayerChar(key: string) {
    this.update({ playerChar: key });
  }

  reset() {
    this.state = { ...DEFAULT_STATE };
    this.scheduleSave();
    this.emit();
  }

  hasSave(): boolean {
    if (typeof window === 'undefined') return false;
    return !!window.localStorage.getItem(SAVE_KEY);
  }
}

export const gameState = new GameStateStore();
