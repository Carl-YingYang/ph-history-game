import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

/**
 * TitleScene — Classic "Press Start" screen like Pokémon.
 */
export class TitleScene extends Phaser.Scene {
  private startEnabled = false;

  constructor() {
    super('TitleScene');
  }

  create() {
    // Dark background
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e);

    // Title
    const titleY = GAME_HEIGHT * 0.28;
    this.add.text(GAME_WIDTH / 2, titleY, 'PROJECT NOOR', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#f8f8f8',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, titleY + 14, 'Noli Me Tangere', {
      fontFamily: 'monospace',
      fontSize: '5px',
      color: '#888888',
    }).setOrigin(0.5);

    // Decorative line
    this.add.rectangle(GAME_WIDTH / 2, titleY + 24, 60, 1, 0x444444);

    // Blinking "Press Start" prompt
    const promptText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.7, 'Press ENTER', {
      fontFamily: 'monospace',
      fontSize: '5px',
      color: '#f8f8f8',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: promptText,
      alpha: 0.2,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.time.delayedCall(500, () => {
      this.startEnabled = true;
    });

    const startGame = () => {
      if (!this.startEnabled) return;
      this.startEnabled = false;
      this.cameras.main.fadeOut(800, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('SanDiegoScene');
      });
    };

    this.input.keyboard!.on('keydown-ENTER', startGame);
    this.input.keyboard!.on('keydown-SPACE', startGame);
    this.input.on('pointerdown', startGame);
  }
}
