import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

/**
 * TitleScene — Classic "Press Start" screen like Pokémon.
 * Dark background, title text, blinking prompt.
 */
export class TitleScene extends Phaser.Scene {
  private promptText?: Phaser.GameObjects.Text;
  private startEnabled = false;

  constructor() {
    super('TitleScene');
  }

  create() {
    // Dark background
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e);

    // Title — scaled for 320×240 internal resolution
    const titleY = GAME_HEIGHT * 0.28;
    this.add.text(GAME_WIDTH / 2, titleY, 'PROJECT NOOR', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#f8f8f8',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, titleY + 20, 'Noli Me Tangere', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#888888',
    }).setOrigin(0.5);

    // Decorative line
    this.add.rectangle(GAME_WIDTH / 2, titleY + 35, 80, 1, 0x444444);

    // Blinking "Press Start" prompt
    this.promptText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.7, 'Press ENTER to Start', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#f8f8f8',
    }).setOrigin(0.5);

    // Blink effect
    this.tweens.add({
      targets: this.promptText,
      alpha: 0.2,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Wait a moment before allowing start
    this.time.delayedCall(500, () => {
      this.startEnabled = true;
    });

    // Input
    this.input.keyboard!.on('keydown-ENTER', () => {
      if (this.startEnabled) {
        this.startGame();
      }
    });

    this.input.keyboard!.on('keydown-SPACE', () => {
      if (this.startEnabled) {
        this.startGame();
      }
    });

    // Also allow click/tap
    this.input.on('pointerdown', () => {
      if (this.startEnabled) {
        this.startGame();
      }
    });
  }

  private startGame() {
    if (!this.startEnabled) return;
    this.startEnabled = false;

    // Fade to black, then start the game
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('SanDiegoScene');
    });
  }
}
