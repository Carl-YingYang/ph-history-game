import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.makePlaceholder('player', 0x8fd3ff, 32, 32);
    this.makePlaceholder('npc', 0xffd27a, 32, 32);
    this.makePlaceholder('floor-library', 0x2b2b3a, 800, 600);
    this.makePlaceholder('floor-town', 0x3a3222, 800, 600);
    this.makePlaceholder('book', 0x7a4a2b, 24, 32);
    this.makePlaceholder('letter', 0xf2e8d5, 28, 20);

    // Chapter 2 placeholders
    this.makePlaceholder('guevara-npc', 0x5a8a6a, 32, 32);
    this.makePlaceholder('clue-ledger', 0xc4956a, 28, 20);
    this.makePlaceholder('clue-tax', 0x8a6a4a, 28, 20);
    this.makePlaceholder('clue-witness', 0xd4c4a4, 28, 20);
    this.makePlaceholder('clue-burial', 0x6a6a7a, 28, 20);

    // Chapter 3 placeholders
    this.makePlaceholder('crocodile', 0x4a6a3a, 64, 24);
    this.makePlaceholder('boat', 0x8a5a2a, 48, 28);
    this.makePlaceholder('net', 0xaa9977, 36, 36);
    this.makePlaceholder('hut', 0x6a4a2a, 64, 48);
    this.makePlaceholder('flower', 0xffeedd, 16, 16);
    this.makePlaceholder('floor-lake', 0x2a4a5a, 800, 600);
  }

  create() {
    this.scene.start('PrologueScene');
  }

  private makePlaceholder(key: string, color: number, w: number, h: number) {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(color, 1);
    g.fillRect(0, 0, w, h);
    g.lineStyle(2, 0x000000, 0.35);
    g.strokeRect(0, 0, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}
