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
    const barW = 200;
    const barH = 8;
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

    // Grass tile
    this.createTile('tile_grass', T, 0x2d5a27, 0x3a7a30);
    // Path tile
    this.createTile('tile_path', T, 0xc4a35a, 0xb89845);
    // Water tile
    this.createTile('tile_water', T, 0x2a6ab5, 0x3478c6);
    // Tree base (dark green)
    this.createTile('tile_tree_base', T, 0x1a3a15, 0x2d5a27);
    // Building wall
    this.createTile('tile_wall', T, 0x8b7355, 0x7a6348);
    // Building door
    this.createTile('tile_door', T, 0x6b4226, 0x5a3520);
    // Roof
    this.createTile('tile_roof', T, 0x8b2500, 0x7a2000);
    // Fence
    this.createTile('tile_fence', T, 0x8b6914, 0x7a5c10);
    // Bridge
    this.createTile('tile_bridge', T, 0x9c7c4a, 0x8a6c3a);
    // Flower grass
    this.createTile('tile_flower', T, 0x2d5a27, 0xff6b9d, true);
    // Plaza stone
    this.createTile('tile_stone', T, 0x9a9a9a, 0x888888);

    // Generate tree top (circle on top of tree base)
    const treeG = this.make.graphics({ x: 0, y: 0 });
    treeG.fillStyle(0x1a5a15, 1);
    treeG.fillCircle(T / 2, T / 2 - 4, T / 2 - 2);
    treeG.fillStyle(0x2d7a27, 0.6);
    treeG.fillCircle(T / 2 - 3, T / 2 - 6, T / 4);
    treeG.generateTexture('tile_tree_top', T, T);
    treeG.destroy();

    // Generate roof tile (triangular)
    const roofG = this.make.graphics({ x: 0, y: 0 });
    roofG.fillStyle(0x8b2500, 1);
    roofG.fillRect(0, T / 2, T, T / 2);
    roofG.fillStyle(0x7a2000, 1);
    roofG.fillRect(0, T / 2, T, 4);
    roofG.fillStyle(0x9b3510, 0.5);
    roofG.fillRect(2, T / 2 + 4, T - 4, T / 2 - 4);
    roofG.generateTexture('tile_roof_fill', T, T);
    roofG.destroy();

    // Generate water with wave animation hint
    const waterG = this.make.graphics({ x: 0, y: 0 });
    waterG.fillStyle(0x2a6ab5, 1);
    waterG.fillRect(0, 0, T, T);
    waterG.lineStyle(1, 0x5a9ae5, 0.4);
    for (let wy = 4; wy < T; wy += 8) {
      waterG.beginPath();
      waterG.moveTo(0, wy);
      for (let wx = 0; wx < T; wx += 4) {
        waterG.lineTo(wx, wy + Math.sin(wx * 0.3) * 2);
      }
      waterG.strokePath();
    }
    waterG.generateTexture('tile_water_wave', T, T);
    waterG.destroy();

    // Placeholder NPC sprite (fallback)
    const npcG = this.make.graphics({ x: 0, y: 0 });
    npcG.fillStyle(0xff6b9d, 1);
    npcG.fillRect(4, 0, 24, 32);
    npcG.fillStyle(0xffcc99, 1);
    npcG.fillCircle(16, 8, 7);
    npcG.lineStyle(1, 0x000000, 0.5);
    npcG.strokeRect(4, 0, 24, 32);
    npcG.generateTexture('npc_placeholder', 32, 32);
    npcG.destroy();

    // Placeholder item sprite (fallback)
    const itemG = this.make.graphics({ x: 0, y: 0 });
    itemG.fillStyle(0xffd60a, 1);
    itemG.fillCircle(12, 12, 10);
    itemG.lineStyle(2, 0x000000, 1);
    itemG.strokeCircle(12, 12, 10);
    itemG.generateTexture('item_placeholder', 24, 24);
    itemG.destroy();
  }

  private createTile(key: string, size: number, color1: number, color2: number, hasFlower = false) {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(color1, 1);
    g.fillRect(0, 0, size, size);

    // Subtle texture variation
    g.fillStyle(color2, 0.3);
    for (let px = 0; px < size; px += 4) {
      for (let py = 0; py < size; py += 4) {
        if ((px + py) % 8 === 0) {
          g.fillRect(px, py, 2, 2);
        }
      }
    }

    // Subtle grid line
    g.lineStyle(0.5, 0x000000, 0.08);
    g.strokeRect(0, 0, size, size);

    if (hasFlower) {
      g.fillStyle(0xff6b9d, 1);
      g.fillCircle(8, 8, 2);
      g.fillCircle(24, 16, 2);
      g.fillStyle(0xffd60a, 1);
      g.fillCircle(16, 24, 2);
    }

    g.generateTexture(key, size, size);
    g.destroy();
  }
}
