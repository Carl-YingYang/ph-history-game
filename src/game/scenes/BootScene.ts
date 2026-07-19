import Phaser from 'phaser';

/**
 * BootScene — loads ALL real game assets from the /public/assets/ directory.
 *
 * Asset structure:
 *   /assets/chars/       — Extracted character sprites (ibarra.png, damaso.png, etc.)
 *   /assets/portraits/   — Character portrait images
 *   /assets/backgrounds/ — Scene backgrounds (library.png, town.png, lake.png, etc.)
 *   /assets/items/       — Collectible items (book.png, letter.png, etc.)
 *   /assets/sprites/     — Full sprite sheets (for reference/cropping at runtime)
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // ── Show loading bar ──────────────────────────────────────────
    const barW = 500;
    const barH = 24;
    const barX = (800 - barW) / 2;
    const barY = 300 - barH / 2;

    const bg = this.add.rectangle(400, 300, barW + 12, barH + 12, 0x000000);
    const bar = this.add.rectangle(barX, barY, 0, barH, 0xFFD60A).setOrigin(0, 0);

    this.load.on('progress', (value: number) => {
      bar.width = barW * value;
    });

    // ── Character Sprites (individual extracted frames) ────────────
    const characterNames = [
      'ibarra', 'elias', 'damaso', 'clara', 'sisa',
      'salvi', 'simoun', 'basilio', 'tiago', 'rizal',
    ];
    for (const name of characterNames) {
      this.load.image(`char-${name}`, `/assets/chars/${name}.png`);
    }

    // NPC sprites
    const npcNames = [
      'mang-tenyo', 'doctor', 'teacher', 'boatman', 'blacksmith', 'vendor',
      'civil-guard', 'spanish-soldier', 'spanish-officer', 'wealthy-spaniard',
      'friar', 'nun', 'altar-boy', 'church-worker',
      'young-farmer', 'old-farmer', 'female-farmer',
    ];
    for (const name of npcNames) {
      this.load.image(`char-${name}`, `/assets/chars/${name}.png`);
    }

    // ── Portraits ──────────────────────────────────────────────────
    const portraitNames = [
      'ibarra', 'elias', 'damaso', 'clara', 'sisa', 'sisa_healthy', 'sisa_mad',
      'salvi', 'simoun', 'basilio', 'tiago', 'rizal',
      'mang-tenyo', 'doctor', 'teacher', 'boatman',
      'civil-guard', 'spanish-soldier', 'friar', 'nun',
    ];
    for (const name of portraitNames) {
      this.load.image(`portrait-${name}`, `/assets/portraits/${name}.png`);
    }

    // ── Backgrounds ────────────────────────────────────────────────
    this.load.image('bg-library', '/assets/backgrounds/library.png');
    this.load.image('bg-town', '/assets/backgrounds/town.png');
    this.load.image('bg-lake', '/assets/backgrounds/lake.png');
    this.load.image('bg-church', '/assets/backgrounds/church.png');
    this.load.image('bg-bahay-nbato', '/assets/backgrounds/bahay-nbato.png');

    // ── Items ──────────────────────────────────────────────────────
    const itemNames = ['book', 'letter', 'scroll', 'key', 'coin', 'medal'];
    for (const name of itemNames) {
      this.load.image(`item-${name}`, `/assets/items/${name}.png`);
    }

    // ── Animals ────────────────────────────────────────────────────
    this.load.image('char-crocodile', '/assets/chars/crocodile.png');
    this.load.image('char-carabao', '/assets/chars/carabao.png');

    // ── Full sprite sheets (for runtime cropping if needed) ────────
    this.load.image('sheet-ibarra', '/assets/sprites/ibara.jpg');
    this.load.image('sheet-damaso', '/assets/sprites/damaso.jpg');
    this.load.image('sheet-elias', '/assets/sprites/elias.jpg');
    this.load.image('sheet-clara', '/assets/sprites/clara.jpg');
    this.load.image('sheet-buildings', '/assets/sprites/building-assets.jpg');
    this.load.image('sheet-nature', '/assets/sprites/nature-assets.jpg');
    this.load.image('sheet-interior', '/assets/sprites/interior-assets.jpg');
    this.load.image('sheet-animals', '/assets/sprites/animals-assets.jpg');

    // ── Fallback: generate minimal placeholder textures ────────────
    // Only used if real assets fail to load
    this.makePlaceholder('player-fallback', 0xFFD60A, 32, 48);
    this.makePlaceholder('npc-fallback', 0xFF6B9D, 32, 48);
    this.makePlaceholder('item-fallback', 0x00C853, 24, 24);
  }

  create() {
    // Clean up loading bar
    this.children.removeAll();

    // Start the game!
    this.scene.start('PrologueScene');
  }

  private makePlaceholder(key: string, color: number, w: number, h: number) {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(color, 1);
    g.fillRect(0, 0, w, h);
    g.lineStyle(3, 0x000000, 1);
    g.strokeRect(0, 0, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}
