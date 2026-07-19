import Phaser from 'phaser';
import { GameEvents } from '../config';

export class PrologueScene extends Phaser.Scene {
  private step = 0;
  private promptText?: Phaser.GameObjects.Text;

  constructor() {
    super('PrologueScene');
  }

  create() {
    this.add.image(400, 300, 'floor-library');
    const book = this.add.image(400, 320, 'book').setInteractive({ useHandCursor: true });

    this.add
      .text(400, 60, 'University Library — Present Day', {
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        color: '#f2e8d5',
      })
      .setOrigin(0.5);

    this.promptText = this.add
      .text(400, 520, 'Click the book on the shelf to return it.', {
        fontFamily: 'Georgia, serif',
        fontSize: '16px',
        color: '#cfcfcf',
      })
      .setOrigin(0.5);

    book.on('pointerdown', () => this.onBookClicked());
  }

  private onBookClicked() {
    if (this.step !== 0) return;
    this.step = 1;

    this.game.events.emit(GameEvents.JournalEntry, {
      text: 'I found an old letter tucked inside my copy of Noli Me Tangere...',
    });

    const letter = this.add.image(400, 300, 'letter').setAlpha(0).setScale(0.1);
    this.promptText?.setText('A letter fell out. Click it to read.');

    this.tweens.add({
      targets: letter,
      alpha: 1,
      scale: 1,
      duration: 600,
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

    this.time.delayedCall(1400, () => this.beginTimeFall());
  }

  private beginTimeFall() {
    this.step = 3;
    const flash = this.add.rectangle(400, 300, 800, 600, 0xffffff, 0).setDepth(10);

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
}
