import Phaser from 'phaser';
import { GameEvents } from '../config';

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
    this.add.image(400, 300, 'floor-lake');

    this.add
      .text(400, 28, 'Laguna de Bay \u2014 The Picnic, 1887', {
        fontFamily: 'Georgia, serif',
        fontSize: '20px',
        color: '#f2e8d5',
      })
      .setOrigin(0.5);

    // Zone 1: Tasyo's Hut
    this.add.sprite(400, 120, 'hut');
    const tasyo = this.physics.add.sprite(440, 160, 'npc');
    tasyo.setImmovable(true);
    this.add
      .text(440, 130, 'Pilosopo Tasyo', {
        fontFamily: 'Georgia, serif',
        fontSize: '13px',
        color: '#ffd27a',
      })
      .setOrigin(0.5);

    // Zone 2: Picnic Grounds
    const guestPositions = [
      { x: 200, y: 260 },
      { x: 320, y: 310 },
      { x: 500, y: 280 },
      { x: 680, y: 340 },
    ];
    for (const pos of guestPositions) {
      const guest = this.physics.add.sprite(pos.x, pos.y, 'npc');
      guest.setImmovable(true);
      this.add
        .text(pos.x, pos.y - 22, 'Guest', {
          fontFamily: 'Georgia, serif',
          fontSize: '11px',
          color: '#bfae94',
        })
        .setOrigin(0.5);
    }

    this.add.sprite(600, 360, 'boat');

    // Zone 3: Crocodile (hidden)
    this.crocodile = this.add.sprite(400, 650, 'crocodile').setAlpha(0);
    this.miniGamePrompt = this.add
      .text(400, 560, '', {
        fontFamily: 'Georgia, serif',
        fontSize: '15px',
        color: '#ffd27a',
      })
      .setOrigin(0.5)
      .setDepth(5);

    // Collectible: Pressed Sampaguita
    this.flowerSprite = this.physics.add.sprite(120, 450, 'flower');
    this.flowerSprite.setImmovable(true);

    // Player
    this.player = this.physics.add.sprite(400, 500, 'player');
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

  // Zone 1 — Tasyo Dialogue
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

  // Zone 3 — Crocodile Encounter
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

      const knot = this.physics.add.sprite(kd.x, kd.y, 'net');
      knot.setImmovable(true);
      this.knots.push(knot);
      this.knotOriginalPositions.push({ x: kd.x, y: kd.y });
      this.knotOverlapCooldowns.push(false);

      const label = this.add
        .text(kd.x, kd.y - 20, kd.label, {
          fontFamily: 'Georgia, serif',
          fontSize: '16px',
          color: '#ffffff',
          backgroundColor: '#6b3a1f',
          padding: { x: 6, y: 2 },
        })
        .setOrigin(0.5)
        .setDepth(4);
      this.knotLabels.push(label);

      const status = this.add
        .text(kd.x, kd.y + 22, knotFeedback[i], {
          fontFamily: 'Georgia, serif',
          fontSize: '12px',
          color: '#ffd27a',
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

  // Collectible — Pressed Sampaguita
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

  // Quiz Completion — Chapter 3 End
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
}
