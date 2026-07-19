import Phaser from 'phaser';
import { GameEvents } from '../config';

/**
 * LagunaDeBayScene — The Picnic, Chapter 3
 * Features: Tasyo dialogue, crocodile encounter mini-game, Elias rescue
 */
export class LagunaDeBayScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private flowerSprite!: Phaser.Physics.Arcade.Sprite;

  private talkedToTasyo = false;
  private miniGameStarted = false;
  private miniGameComplete = false;
  private nextKnotIndex = 0;
  private chapterComplete = false;
  private flowerCollected = false;

  private knots: Phaser.Physics.Arcade.Sprite[] = [];
  private knotOriginalPositions: { x: number; y: number }[] = [];
  private knotLabels: Phaser.GameObjects.Text[] = [];
  private knotStatusTexts: Phaser.GameObjects.Text[] = [];
  private knotOverlapCooldowns: boolean[] = [];
  private crocodile!: Phaser.GameObjects.Sprite;
  private miniGamePrompt!: Phaser.GameObjects.Text;

  private dialogueInProgress = false;

  constructor() {
    super('LagunaDeBayScene');
  }

  init(_data: { chapterId?: string }) {
    this.talkedToTasyo = false;
    this.miniGameStarted = false;
    this.miniGameComplete = false;
    this.nextKnotIndex = 0;
    this.chapterComplete = false;
    this.flowerCollected = false;
    this.dialogueInProgress = false;
    this.knots = [];
    this.knotOriginalPositions = [];
    this.knotLabels = [];
    this.knotStatusTexts = [];
    this.knotOverlapCooldowns = [];
  }

  create() {
    // ── Background ───────────────────────────────────────────────
    const bgKey = this.textures.exists('bg-lake') ? 'bg-lake' : null;
    if (bgKey) {
      this.add.image(400, 300, bgKey).setDisplaySize(800, 600);
    } else {
      this.add.rectangle(400, 300, 800, 600, 0xFFF8E7);
    }

    // ── Scene Title ──────────────────────────────────────────────
    this.createLabel(400, 28, 'Laguna de Bay \u2014 The Picnic, 1887', 0x00C853, 18);

    // ── Zone 1: Tasyo's Hut ─────────────────────────────────────
    if (this.textures.exists('bg-bahay-nbato')) {
      this.add.image(400, 120, 'bg-bahay-nbato').setDisplaySize(120, 80).setAlpha(0.9);
    } else {
      this.add.rectangle(400, 120, 100, 70, 0xFFD60A).setStrokeStyle(3, 0x000000);
    }

    // Tasyo NPC
    const tasyoKey = this.textures.exists('char-friar') ? 'char-friar' : 'npc-fallback';
    const tasyo = this.physics.add.sprite(440, 160, tasyoKey);
    tasyo.setImmovable(true);
    if (this.textures.exists('char-friar')) {
      tasyo.setScale(0.25);
    }

    this.createLabel(440, 125, 'Pilosopo Tasyo', 0xFF9100, 12);

    if (this.textures.exists('portrait-friar')) {
      this.add.image(510, 140, 'portrait-friar').setDisplaySize(35, 35).setDepth(5);
    }

    // ── Zone 2: Picnic Guests ────────────────────────────────────
    const guestPositions = [
      { x: 200, y: 260, key: 'char-young-farmer', label: 'Farmer' },
      { x: 320, y: 310, key: 'char-old-farmer', label: 'Elder' },
      { x: 500, y: 280, key: 'char-civil-guard', label: 'Guard' },
      { x: 680, y: 340, key: 'char-friar', label: 'Priest' },
    ];
    for (const pos of guestPositions) {
      const spriteKey = this.textures.exists(pos.key) ? pos.key : 'npc-fallback';
      const guest = this.physics.add.sprite(pos.x, pos.y, spriteKey);
      guest.setImmovable(true);
      if (this.textures.exists(pos.key)) {
        guest.setScale(0.2);
      }
      this.add
        .text(pos.x, pos.y - 25, pos.label, {
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#000000',
          backgroundColor: '#FFF8E7',
          padding: { x: 2, y: 1 },
        })
        .setOrigin(0.5);
    }

    // ── Crocodile (hidden until mini-game) ───────────────────────
    const crocKey = this.textures.exists('char-crocodile') ? 'char-crocodile' : 'npc-fallback';
    this.crocodile = this.add.sprite(400, 650, crocKey).setAlpha(0);
    if (this.textures.exists('char-crocodile')) {
      this.crocodile.setScale(0.3);
    }

    this.miniGamePrompt = this.add
      .text(400, 560, '', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#FF3D00',
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5)
      .setDepth(5);

    // ── Collectible: Pressed Sampaguita ──────────────────────────
    const flowerKey = this.textures.exists('item-medal') ? 'item-medal' : 'item-fallback';
    this.flowerSprite = this.physics.add.sprite(120, 450, flowerKey);
    this.flowerSprite.setImmovable(true);
    if (this.textures.exists('item-medal')) {
      this.flowerSprite.setScale(0.4);
    }

    // Flower label
    this.add
      .text(120, 425, 'Sampaguita', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#000000',
        backgroundColor: '#FF6B9D',
        padding: { x: 2, y: 1 },
      })
      .setOrigin(0.5);

    // ── Player (Ibarra) ──────────────────────────────────────────
    const playerKey = this.textures.exists('char-ibarra') ? 'char-ibarra' : 'player-fallback';
    this.player = this.physics.add.sprite(400, 500, playerKey);
    if (this.textures.exists('char-ibarra')) {
      this.player.setScale(0.25);
    }
    this.player.setCollideWorldBounds(true);

    // Overlap detectors
    this.physics.add.overlap(this.player, tasyo, () => this.onTasyoOverlap());
    this.physics.add.overlap(this.player, this.flowerSprite, () => this.onFlowerOverlap());

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.game.events.once('quiz:completed', this.onCh3QuizCompleted, this);
  }

  update() {
    if (this.dialogueInProgress || this.chapterComplete) {
      this.player.setVelocity(0);
      return;
    }

    const speed = 160;
    this.player.setVelocity(0);

    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(speed);
    }

    if (this.cursors.up?.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down?.isDown) {
      this.player.setVelocityY(speed);
    }
  }

  // ── Zone 1 — Tasyo Dialogue ────────────────────────────────────
  private onTasyoOverlap() {
    if (this.talkedToTasyo) return;
    this.talkedToTasyo = true;
    this.dialogueInProgress = true;

    this.game.events.emit(GameEvents.DialogueLine, {
      speaker: 'Pilosopo Tasyo',
      line: 'So you want to build a school? They will burn it down, Ibarra. Mark my words.',
    });

    this.time.delayedCall(3500, () => {
      this.game.events.emit(GameEvents.DialogueLine, {
        speaker: 'Pilosopo Tasyo',
        line: 'Knowledge is the only weapon they fear \u2014 and the only one they cannot confiscate.',
      });

      this.game.events.emit(GameEvents.CodexUnlock, { id: 'char.tasyo' });
      this.game.events.emit(GameEvents.JournalEntry, {
        text: 'Tasyo warned that the school will be burned. He believes knowledge is the weapon they fear most.',
      });
      this.game.events.emit(GameEvents.KnowledgeXp, { amount: 40, reason: 'sq.ch3.tasyo-library' });

      this.time.delayedCall(3000, () => {
        this.dialogueInProgress = false;
        this.startCrocodileEncounter();
      });
    });
  }

  // ── Zone 3 — Crocodile Encounter ────────────────────────────────
  private startCrocodileEncounter() {
    if (this.miniGameStarted) return;
    this.miniGameStarted = true;

    this.tweens.add({
      targets: this.crocodile,
      y: 420,
      alpha: 1,
      duration: 1200,
      ease: 'Power2',
    });

    this.miniGamePrompt.setText('A crocodile! Untangle the net to save the boy!');

    this.time.delayedCall(1400, () => this.spawnNetKnots());
  }

  private spawnNetKnots() {
    const knotData = [
      { x: 220, y: 350, label: '1' },
      { x: 480, y: 300, label: '2' },
      { x: 650, y: 380, label: '3' },
    ];

    const knotFeedback = [
      'Untangling the net\u2026',
      'The net loosens\u2026',
      'Free!',
    ];

    for (let i = 0; i < knotData.length; i++) {
      const kd = knotData[i];

      // Use scroll as net visual
      const knotKey = this.textures.exists('item-scroll') ? 'item-scroll' : 'item-fallback';
      const knot = this.physics.add.sprite(kd.x, kd.y, knotKey);
      knot.setImmovable(true);
      if (this.textures.exists('item-scroll')) {
        knot.setScale(0.5);
      }
      this.knots.push(knot);
      this.knotOriginalPositions.push({ x: kd.x, y: kd.y });
      this.knotOverlapCooldowns.push(false);

      const label = this.add
        .text(kd.x, kd.y - 20, kd.label, {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#000000',
          backgroundColor: '#FFD60A',
          padding: { x: 6, y: 2 },
        })
        .setOrigin(0.5)
        .setDepth(4);
      this.knotLabels.push(label);

      const status = this.add
        .text(kd.x, kd.y + 25, knotFeedback[i], {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#000000',
          backgroundColor: '#00C853',
          padding: { x: 4, y: 2 },
        })
        .setOrigin(0.5)
        .setAlpha(0)
        .setDepth(4);
      this.knotStatusTexts.push(status);

      const knotIndex = i;
      this.physics.add.overlap(this.player, knot, () => {
        this.onKnotOverlap(knotIndex);
      });
    }
  }

  private onKnotOverlap(index: number) {
    if (this.miniGameComplete) return;
    if (this.knotOverlapCooldowns[index]) return;

    if (index === this.nextKnotIndex) {
      this.knotOverlapCooldowns[index] = true;
      this.nextKnotIndex++;

      const status = this.knotStatusTexts[index];
      this.tweens.add({ targets: status, alpha: 1, duration: 300 });

      this.tweens.add({
        targets: [this.knots[index], this.knotLabels[index]],
        alpha: 0.3,
        duration: 400,
      });

      if (this.nextKnotIndex >= 3) {
        this.completeMiniGame();
      }
    } else {
      this.knotOverlapCooldowns[index] = true;
      this.shakeKnot(index);
      this.resetKnotProgress();

      this.time.delayedCall(800, () => {
        this.knotOverlapCooldowns[index] = false;
      });
    }
  }

  private shakeKnot(index: number) {
    const knot = this.knots[index];
    if (!knot) return;
    const origX = this.knotOriginalPositions[index].x;

    this.tweens.add({
      targets: knot,
      x: origX - 6,
      duration: 60,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        knot.setX(origX);
      },
    });
  }

  private resetKnotProgress() {
    this.nextKnotIndex = 0;

    for (let i = 0; i < this.knots.length; i++) {
      this.knotOverlapCooldowns[i] = false;

      this.tweens.add({
        targets: [this.knots[i], this.knotLabels[i]],
        alpha: 1,
        duration: 300,
      });
      this.tweens.add({
        targets: this.knotStatusTexts[i],
        alpha: 0,
        duration: 200,
      });
    }

    this.miniGamePrompt.setText('Wrong knot! Try again in order: 1 \u2192 2 \u2192 3');
  }

  private completeMiniGame() {
    this.miniGameComplete = true;
    this.miniGamePrompt.setText('');

    this.tweens.add({
      targets: this.crocodile,
      y: 650,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
    });

    for (let i = 0; i < this.knots.length; i++) {
      this.tweens.add({
        targets: [this.knots[i], this.knotLabels[i], this.knotStatusTexts[i]],
        alpha: 0,
        duration: 600,
      });
    }

    this.time.delayedCall(1500, () => this.showRescueDialogue());
  }

  private showRescueDialogue() {
    this.dialogueInProgress = true;

    this.game.events.emit(GameEvents.DialogueLine, {
      speaker: 'Narrator',
      line: 'Elias hauls the trapped boy from the water. Ibarra tried to help, but it was the boatman who saved them both.',
    });

    this.time.delayedCall(4000, () => {
      this.game.events.emit(GameEvents.CodexUnlock, { id: 'char.elias' });
      this.game.events.emit(GameEvents.CodexUnlock, { id: 'event.crocodile-attack' });
      this.game.events.emit(GameEvents.CodexUnlock, { id: 'loc.laguna-picnic' });
      this.game.events.emit(GameEvents.KnowledgeXp, { amount: 100, reason: 'mq.ch3.school-on-hill' });
      this.game.events.emit(GameEvents.JournalEntry, {
        text: 'Elias rescued the boy from the crocodile. Ibarra witnessed the boatman\u2019s bravery firsthand.',
      });
      this.game.events.emit(GameEvents.ChapterMedal, { chapterId: 'ch3' });
      this.game.events.emit(GameEvents.QuizRequested, { chapterId: 'ch3' });

      this.chapterComplete = true;
      this.dialogueInProgress = false;
    });
  }

  // ── Collectible — Pressed Sampaguita ────────────────────────────
  private onFlowerOverlap() {
    if (this.flowerCollected) return;
    this.flowerCollected = true;

    this.game.events.emit(GameEvents.KnowledgeXp, { amount: 15, reason: 'cq.ch3.pressed-flower' });
    this.game.events.emit(GameEvents.JournalEntry, {
      text: 'Found a pressed sampaguita near the shore \u2014 a delicate reminder of Maria Clara\u2019s garden.',
    });

    this.tweens.add({
      targets: this.flowerSprite,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        this.flowerSprite.destroy();
      },
    });
  }

  // ── Quiz Completion — Chapter 3 End ─────────────────────────────
  private ch3QuizDone = false;

  private onCh3QuizCompleted() {
    if (this.ch3QuizDone) return;
    this.ch3QuizDone = true;

    this.miniGamePrompt.setText('Chapter 3 complete! The story continues...');

    this.time.delayedCall(2000, () => {
      this.game.events.emit(GameEvents.ChapterTransition, {
        chapterId: 'ch3',
        sceneKey: 'SanDiegoTownScene',
      });
    });
  }

  /** Create a neo-brutalism styled label */
  private createLabel(x: number, y: number, text: string, bgColor: number, fontSize: number) {
    const label = this.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: `${fontSize}px`,
      color: '#000000',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(5);

    const bounds = label.getBounds();
    const padding = 6;

    // Shadow
    this.add.rectangle(
      bounds.centerX + 3, bounds.centerY + 3,
      bounds.width + padding * 2, bounds.height + padding,
      0x000000
    ).setDepth(3);

    // Background
    this.add.rectangle(
      bounds.centerX, bounds.centerY,
      bounds.width + padding * 2, bounds.height + padding,
      bgColor
    ).setDepth(4).setStrokeStyle(3, 0x000000);
  }
}
