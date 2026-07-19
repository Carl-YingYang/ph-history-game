import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

// ─── ANIMATION DEFINITIONS ───────────────────────────────────────
// Each character's animation types and frame counts from sprite_map.json
interface AnimDef {
  name: string;
  frameCount: number;
  frameRate: number;
  repeat: number;
}

const CHAR_ANIMS: Record<string, AnimDef[]> = {
  ibarra: [
    { name: 'idle', frameCount: 11, frameRate: 8, repeat: -1 },
    { name: 'walk', frameCount: 11, frameRate: 10, repeat: -1 },
    { name: 'run', frameCount: 9, frameRate: 12, repeat: -1 },
    { name: 'jump', frameCount: 11, frameRate: 8, repeat: 0 },
    { name: 'attack', frameCount: 9, frameRate: 12, repeat: 0 },
    { name: 'hurt', frameCount: 11, frameRate: 10, repeat: 0 },
    { name: 'dead', frameCount: 11, frameRate: 8, repeat: 0 },
    { name: 'climb', frameCount: 11, frameRate: 8, repeat: -1 },
    { name: 'fall', frameCount: 9, frameRate: 10, repeat: 0 },
    { name: 'jumpattack', frameCount: 11, frameRate: 12, repeat: 0 },
  ],
  'misc-npc': [
    { name: 'idle', frameCount: 12, frameRate: 6, repeat: -1 },
    { name: 'walk', frameCount: 11, frameRate: 8, repeat: -1 },
  ],
  'spanish-npc': [
    { name: 'idle', frameCount: 11, frameRate: 6, repeat: -1 },
    { name: 'walk', frameCount: 12, frameRate: 8, repeat: -1 },
  ],
  'villager-npc': [
    { name: 'idle', frameCount: 10, frameRate: 6, repeat: -1 },
    { name: 'walk', frameCount: 11, frameRate: 8, repeat: -1 },
  ],
  'religious-npc': [
    { name: 'idle', frameCount: 11, frameRate: 6, repeat: -1 },
    { name: 'walk', frameCount: 11, frameRate: 8, repeat: -1 },
  ],
  'student-npc': [
    { name: 'idle', frameCount: 7, frameRate: 6, repeat: -1 },
    { name: 'walk', frameCount: 11, frameRate: 8, repeat: -1 },
  ],
};

// Character key used in sprite_map.json → folder name for extracted frames
const CHAR_KEY_MAP: Record<string, string> = {
  ibarra: 'ibarra',
  'misc-npc': 'misc-npc',
  'spanish-npc': 'spanish-npc',
  'villager-npc': 'villager-npc',
  'religious-npc': 'religious-npc',
  'student-npc': 'student-npc',
};

/**
 * BootScene — Load ALL game assets from the existing sprite frames.
 * No placeholder graphics. No generated textures.
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

    const border = this.add.rectangle(GAME_WIDTH / 2, barY, barW + 4, barH + 4, 0x000000);
    const bar = this.add.rectangle(barX, barY, 0, barH, 0xf8f8f8).setOrigin(0, 0.5);

    const loadText = this.add.text(GAME_WIDTH / 2, barY - 14, 'Loading...', {
      fontFamily: 'monospace', fontSize: '8px', color: '#888888',
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      bar.width = barW * value;
    });

    // ── CHARACTER SPRITE FRAMES ─────────────────────────────────
    // Load individual extracted frames for each character
    for (const [charKey, anims] of Object.entries(CHAR_ANIMS)) {
      for (const anim of anims) {
        for (let i = 0; i < anim.frameCount; i++) {
          const assetKey = `${charKey}_${anim.name}_${i}`;
          const folder = CHAR_KEY_MAP[charKey] || charKey;
          this.load.image(assetKey, `/assets/chars/${folder}_${anim.name}_${i}.png`);
        }
      }
    }

    // ── NATURE TILES ────────────────────────────────────────────
    // Load nature tile frames (rows 2-11 have individual tiles)
    // Row 0 and 1 are large composite images — skip those
    for (let row = 2; row <= 11; row++) {
      for (let frame = 0; frame <= 10; frame++) {
        const key = `nature_${row}_${frame}`;
        this.load.image(key, `/assets/nature/nature_r${row}_f${frame}.png`);
      }
    }

    // ── QUEST ITEMS ─────────────────────────────────────────────
    this.load.image('item_book', '/assets/items/book.png');
    this.load.image('item_letter', '/assets/items/letter.png');
    this.load.image('item_scroll', '/assets/items/scroll.png');
    this.load.image('item_coin', '/assets/items/coin.png');
    this.load.image('item_gem', '/assets/items/gem.png');
    this.load.image('item_potion', '/assets/items/potion.png');
    this.load.image('item_key', '/assets/items/key.png');

    // ── PORTRAITS ───────────────────────────────────────────────
    this.load.image('portrait_ibarra', '/assets/portraits/ibarra.png');
    this.load.image('portrait_misc', '/assets/portraits/misc-npc.png');
    this.load.image('portrait_spanish', '/assets/portraits/spanish-npc.png');
    this.load.image('portrait_villager', '/assets/portraits/villager-npc.png');
    this.load.image('portrait_religious', '/assets/portraits/religious-npc.png');

    // ── ERROR HANDLING ──────────────────────────────────────────
    this.load.on('loaderror', (file: { key: string; url: string }) => {
      console.warn(`Failed to load: ${file.key} from ${file.url}`);
    });

    this.load.on('complete', () => {
      border.destroy();
      bar.destroy();
      loadText.destroy();
    });
  }

  create() {
    // ── CREATE PHASER ANIMATIONS FROM LOADED FRAMES ─────────────
    this.createCharacterAnimations();

    // Start title scene
    this.scene.start('TitleScene');
  }

  private createCharacterAnimations() {
    for (const [charKey, anims] of Object.entries(CHAR_ANIMS)) {
      for (const anim of anims) {
        const frames: string[] = [];
        for (let i = 0; i < anim.frameCount; i++) {
          const frameKey = `${charKey}_${anim.name}_${i}`;
          if (this.textures.exists(frameKey)) {
            frames.push(frameKey);
          }
        }

        if (frames.length > 0) {
          const animKey = `${charKey}_${anim.name}`;
          // Check if animation already exists
          if (!this.anims.exists(animKey)) {
            this.anims.create({
              key: animKey,
              frames: frames.map(f => ({ key: f })),
              frameRate: anim.frameRate,
              repeat: anim.repeat,
            });
          }
        }
      }
    }
  }
}
