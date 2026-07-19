import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

/**
 * BootScene — Load all game assets.
 * Minimal. No fancy UI. Just loads data and moves on.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // ── Loading bar ─────────────────────────────────────────────
    const barW = 160;
    const barH = 6;
    const barX = (GAME_WIDTH - barW) / 2;
    const barY = GAME_HEIGHT / 2;

    this.add.rectangle(GAME_WIDTH / 2, barY, barW + 4, barH + 4, 0x000000);
    const bar = this.add.rectangle(barX, barY, 0, barH, 0xf8f8f8).setOrigin(0, 0.5);

    this.load.on('progress', (value: number) => {
      bar.width = barW * value;
    });

    // ── Player sprites (Ibarra - the main character) ────────────
    for (let i = 0; i < 10; i++) {
      this.load.image(`player_walk_${i}`, `/assets/chars/ibarra_walk_${i}.png`);
    }
    for (let i = 0; i < 11; i++) {
      this.load.image(`player_idle_${i}`, `/assets/chars/ibarra_idle_${i}.png`);
    }

    // ── NPC sprites (use idle frames from extracted sheets) ─────
    // Mang Tenyo - use misc-npc idle frame
    for (let i = 0; i < 12; i++) {
      this.load.image(`npc_misc_idle_${i}`, `/assets/chars/misc-npc_idle_${i}.png`);
    }
    // Spanish NPC (Lt. Guevara, Civil Guard)
    for (let i = 0; i < 11; i++) {
      this.load.image(`npc_spanish_idle_${i}`, `/assets/chars/spanish-npc_idle_${i}.png`);
    }
    // Villager NPC (Old Woman, Vendor)
    for (let i = 0; i < 10; i++) {
      this.load.image(`npc_villager_idle_${i}`, `/assets/chars/villager-npc_idle_${i}.png`);
    }
    // Religious NPC (Friar, Priest)
    for (let i = 0; i < 11; i++) {
      this.load.image(`npc_religious_idle_${i}`, `/assets/chars/religious-npc_idle_${i}.png`);
    }

    // ── Items (quest collectibles) ──────────────────────────────
    this.load.image('item_book', '/assets/items/book.png');
    this.load.image('item_letter', '/assets/items/letter.png');
    this.load.image('item_scroll', '/assets/items/scroll.png');

    // ── Background images for building facades ──────────────────
    this.load.image('bg_church', '/assets/backgrounds/church.png');
    this.load.image('bg_town', '/assets/backgrounds/town.png');

    // ── Generate tile textures after load completes ──────────────
    this.load.on('complete', () => {
      this.generateTileTextures();
    });
  }

  create() {
    this.scene.start('TitleScene');
  }

  private generateTileTextures() {
    const T = 32;

    // ── Ground tiles ─────────────────────────────────────────────
    // Grass tile — lush green with subtle variation
    this.createTile('tile_grass', T, 0x2d5a27, 0x3a7a30);
    // Path tile — warm sandy
    this.createTile('tile_path', T, 0xc4a35a, 0xb89845);
    // Water tile — animated wave hint
    this.createWaterTile('tile_water_wave', T);
    // Plaza stone — gray cobblestone
    this.createTile('tile_stone', T, 0x9a9a9a, 0x888888);
    // Flower grass — grass with colored dots
    this.createTile('tile_flower', T, 0x2d5a27, 0x3a7a30, [
      { x: 8, y: 8, color: 0xff6b9d },
      { x: 24, y: 16, color: 0xff6b9d },
      { x: 16, y: 24, color: 0xffd60a },
    ]);

    // ── Building tiles ───────────────────────────────────────────
    // Wall — adobe/stone
    this.createTile('tile_wall', T, 0x8b7355, 0x7a6348);
    // Door — dark wood
    this.createTile('tile_door', T, 0x6b4226, 0x5a3520, [
      { x: 14, y: 10, color: 0xffd60a }, // Door handle
    ]);
    // Roof — red clay
    this.createTile('tile_roof', T, 0x8b2500, 0x7a2000);

    // ── Nature tiles ─────────────────────────────────────────────
    // Tree base — dark trunk
    this.createTile('tile_tree_base', T, 0x1a3a15, 0x2d5a27);
    // Bush — round green
    this.createTile('tile_bush', T, 0x1a5a15, 0x2d7a27);
    // Fence — wooden
    this.createTile('tile_fence', T, 0x8b6914, 0x7a5c10);
    // Bridge — wooden planks
    this.createTile('tile_bridge', T, 0x9c7c4a, 0x8a6c3a);

    // ── Decorative tiles ─────────────────────────────────────────
    // Sign — wooden post with board
    this.createSignTile('tile_sign', T);
    // Crate — wooden box
    this.createCrateTile('tile_crate', T);

    // ── Complex multi-layer tiles ────────────────────────────────
    // Tree top (foliage above trunk)
    this.createTreeTopTile('tile_tree_top', T);
    // Roof fill (triangular roof section)
    this.createRoofFillTile('tile_roof_fill', T);

    // ── Placeholder fallbacks ────────────────────────────────────
    // NPC placeholder (pink rectangle — should never be visible)
    this.createPlaceholderNPC('npc_placeholder', T);
    // Item placeholder (yellow circle)
    this.createPlaceholderItem('item_placeholder', 24);
  }

  // ── Basic tile with color + texture variation ──────────────────
  private createTile(
    key: string, size: number, color1: number, color2: number,
    dots?: { x: number; y: number; color: number }[]
  ) {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(color1, 1);
    g.fillRect(0, 0, size, size);

    // Subtle pixel texture variation
    g.fillStyle(color2, 0.3);
    for (let px = 0; px < size; px += 4) {
      for (let py = 0; py < size; py += 4) {
        if ((px + py) % 8 === 0) {
          g.fillRect(px, py, 2, 2);
        }
      }
    }

    // Faint grid line
    g.lineStyle(0.5, 0x000000, 0.06);
    g.strokeRect(0, 0, size, size);

    // Optional dots (flowers, door handles, etc.)
    if (dots) {
      for (const dot of dots) {
        g.fillStyle(dot.color, 1);
        g.fillCircle(dot.x, dot.y, 2);
      }
    }

    g.generateTexture(key, size, size);
    g.destroy();
  }

  // ── Water with wave lines ──────────────────────────────────────
  private createWaterTile(key: string, size: number) {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0x2a6ab5, 1);
    g.fillRect(0, 0, size, size);
    g.lineStyle(1, 0x5a9ae5, 0.4);
    for (let wy = 4; wy < size; wy += 8) {
      g.beginPath();
      g.moveTo(0, wy);
      for (let wx = 0; wx < size; wx += 4) {
        g.lineTo(wx, wy + Math.sin(wx * 0.3) * 2);
      }
      g.strokePath();
    }
    g.generateTexture(key, size, size);
    g.destroy();
  }

  // ── Sign tile (wooden post with board) ─────────────────────────
  private createSignTile(key: string, size: number) {
    const g = this.make.graphics({ x: 0, y: 0 });
    // Grass base
    g.fillStyle(0x2d5a27, 1);
    g.fillRect(0, 0, size, size);
    // Post
    g.fillStyle(0x6b4226, 1);
    g.fillRect(size / 2 - 2, size / 2, 4, size / 2);
    // Board
    g.fillStyle(0x8b6914, 1);
    g.fillRect(size / 2 - 10, size / 2 - 4, 20, 10);
    g.lineStyle(1, 0x5a3520, 1);
    g.strokeRect(size / 2 - 10, size / 2 - 4, 20, 10);
    // Arrow on board
    g.fillStyle(0x222222, 1);
    g.fillRect(size / 2 - 4, size / 2 - 1, 8, 2);
    g.generateTexture(key, size, size);
    g.destroy();
  }

  // ── Crate tile (wooden box) ────────────────────────────────────
  private createCrateTile(key: string, size: number) {
    const g = this.make.graphics({ x: 0, y: 0 });
    // Ground shadow
    g.fillStyle(0x2d5a27, 1);
    g.fillRect(0, 0, size, size);
    // Crate body
    g.fillStyle(0x8b6914, 1);
    g.fillRect(4, 6, size - 8, size - 10);
    // Cross planks
    g.lineStyle(2, 0x6b4226, 1);
    g.beginPath();
    g.moveTo(4, 6);
    g.lineTo(size - 4, size - 4);
    g.moveTo(size - 4, 6);
    g.lineTo(4, size - 4);
    g.strokePath();
    // Border
    g.lineStyle(1, 0x5a3520, 1);
    g.strokeRect(4, 6, size - 8, size - 10);
    g.generateTexture(key, size, size);
    g.destroy();
  }

  // ── Tree top (round foliage) ───────────────────────────────────
  private createTreeTopTile(key: string, size: number) {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0x1a5a15, 1);
    g.fillCircle(size / 2, size / 2 - 4, size / 2 - 2);
    g.fillStyle(0x2d7a27, 0.6);
    g.fillCircle(size / 2 - 3, size / 2 - 6, size / 4);
    g.generateTexture(key, size, size);
    g.destroy();
  }

  // ── Roof fill (triangular) ─────────────────────────────────────
  private createRoofFillTile(key: string, size: number) {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0x8b2500, 1);
    g.fillRect(0, size / 2, size, size / 2);
    g.fillStyle(0x7a2000, 1);
    g.fillRect(0, size / 2, size, 4);
    g.fillStyle(0x9b3510, 0.5);
    g.fillRect(2, size / 2 + 4, size - 4, size / 2 - 4);
    g.generateTexture(key, size, size);
    g.destroy();
  }

  // ── NPC placeholder (pink — should never appear) ───────────────
  private createPlaceholderNPC(key: string, size: number) {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xff6b9d, 1);
    g.fillRect(4, 0, 24, 32);
    g.fillStyle(0xffcc99, 1);
    g.fillCircle(16, 8, 7);
    g.lineStyle(1, 0x000000, 0.5);
    g.strokeRect(4, 0, 24, 32);
    g.generateTexture(key, size, size);
    g.destroy();
  }

  // ── Item placeholder (yellow circle) ───────────────────────────
  private createPlaceholderItem(key: string, size: number) {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xffd60a, 1);
    g.fillCircle(size / 2, size / 2, size / 2 - 2);
    g.lineStyle(2, 0x000000, 1);
    g.strokeCircle(size / 2, size / 2, size / 2 - 2);
    g.generateTexture(key, size, size);
    g.destroy();
  }
}
