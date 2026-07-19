import Phaser from 'phaser';
import { GameEvents } from '../config';

/**
 * PrologueScene — University Library, Present Day
 * Player finds an old copy of Noli Me Tangere with a hidden letter.
 */
export class PrologueScene extends Phaser.Scene {
  private step = 0;
  private promptText?: Phaser.GameObjects.Text;

  constructor() {
    super('PrologueScene');
  }

  create() {
    // ── Background ───────────────────────────────────────────────
    const bgKey = this.textures.exists('bg-library') ? 'bg-library' : null;
    if (bgKey) {
      this.add.image(400, 300, bgKey).setDisplaySize(800, 600);
    } else {
      this.add.rectangle(400, 300, 800, 600, 0xFFF8E7);
    }

    // ── Scene Title (neo-brutalism style) ────────────────────────
    this.createLabel(400, 40, 'University Library — Present Day', 0xFFD60A, 20);

    // ── Ibarra portrait in corner ────────────────────────────────
    if (this.textures.exists('portrait-ibarra')) {
      const portrait = this.add.image(740, 80, 'portrait-ibarra').setDisplaySize(48, 48).setDepth(5);
      this.add.rectangle(740, 80, 68, 68, 0x000000, 0).setDepth(4).setStrokeStyle(3, 0x000000);
    }

    // ── Book on shelf ────────────────────────────────────────────
    const bookKey = this.textures.exists('item-book') ? 'item-book' : 'item-fallback';
    const book = this.add.image(400, 320, bookKey).setInteractive({ useHandCursor: true });
    book.setScale(this.textures.exists('item-book') ? 0.5 : 2);
    book.setDepth(3);

    // Add a pulsing glow effect around the book
    this.tweens.add({
      targets: book,
      scaleX: book.scaleX * 1.1,
      scaleY: book.scaleY * 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // ── Prompt Text ──────────────────────────────────────────────
    this.promptText = this.add
      .text(400, 540, 'Click the book on the shelf to return it.', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#FFD60A',
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5)
      .setDepth(5);

    book.on('pointerdown', () => this.onBookClicked());
  }

  private onBookClicked() {
    if (this.step !== 0) return;
    this.step = 1;

    this.game.events.emit(GameEvents.JournalEntry, {
      text: 'I found an old letter tucked inside my copy of Noli Me Tangere...',
    });

    const letterKey = this.textures.exists('item-letter') ? 'item-letter' : 'item-fallback';
    const letter = this.add.image(400, 300, letterKey).setAlpha(0).setScale(0.1).setDepth(5);

    this.promptText?.setText('A letter fell out. Click it to read.');

    this.tweens.add({
      targets: letter,
      alpha: 1,
      scale: 0.5,
      duration: 600,
      ease: 'Back.easeOut',
      onComplete: () => {
        letter.setInteractive({ useHandCursor: true });
        letter.on('pointerdown', () => this.onLetterClicked());
      },
    });
  }

  private onLetterClicked() {
    if (this.step !== 1) return;
    this.step = 2;

    this.promptText?.setText('"To whoever still remembers —"');

    this.game.events.emit(GameEvents.DialogueLine, {
      speaker: 'The Letter',
      line: 'To whoever still remembers —',
    });

    this.game.events.emit(GameEvents.CodexUnlock, { id: 'char.ibarra' });

    this.time.delayedCall(1400, () => this.beginTimeFall());
  }

  private beginTimeFall() {
    this.step = 3;

    // Neo-brutalism flash: bright yellow overlay
    const flash = this.add.rectangle(400, 300, 800, 600, 0xFFD60A, 0).setDepth(10);

    this.tweens.add({
      targets: flash,
      alpha: 1,
      duration: 900,
      onComplete: () => {
        this.game.events.emit(GameEvents.ChapterMedal, { chapterId: 'prologue' });
        this.scene.start('SanDiegoTownScene', { chapterId: 'ch1' });
      },
    });
  }

  /** Create a neo-brutalism styled label */
  private createLabel(x: number, y: number, text: string, bgColor: number, fontSize: number) {
    // Background pill
    const label = this.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: `${fontSize}px`,
      color: '#000000',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(5);

    const bounds = label.getBounds();
    const padding = 8;

    const bg = this.add.rectangle(
      bounds.centerX, bounds.centerY,
      bounds.width + padding * 2, bounds.height + padding,
      bgColor
    ).setDepth(4).setStrokeStyle(3, 0x000000);

    // Hard shadow
    this.add.rectangle(
      bounds.centerX + 4, bounds.centerY + 4,
      bounds.width + padding * 2, bounds.height + padding,
      0x000000
    ).setDepth(3);
  }
}
