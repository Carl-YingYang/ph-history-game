import Phaser from 'phaser';
import { GameEvents } from '../config';
import { getQuestsForChapter } from '../data/quests';

interface SceneInitData {
  chapterId: string;
}

interface ClueDef {
  key: string;
  texture: string;
  label: string;
  description: string;
  x: number;
  y: number;
}

const GUEVARA_DIALOGUE = [
  'Ibarra... you should know the truth about your father. Dámaso slandered him before the whole town.',
  'Don Rafael was arrested on charges of heresy. He died in that cell, and they would not even let him rest in consecrated ground.',
  'They exhumed his body from the church cemetery and threw it into the Chinese burial ground. I saw it with my own eyes.',
];

const CLUE_DEFS: ClueDef[] = [
  {
    key: 'ledger',
    texture: 'item-book',
    label: 'Estate Ledger',
    description: 'Don Rafael\u2019s estate ledger shows he funded the schoolhouse and paid the parish taxes in full \u2014 no hint of heresy.',
    x: 650,
    y: 150,
  },
  {
    key: 'tax',
    texture: 'item-scroll',
    label: 'Tax Records',
    description: 'Tax records confirm Don Rafael was one of the largest contributors to the town \u2014 contradicting the charge of subversion.',
    x: 180,
    y: 400,
  },
  {
    key: 'witness',
    texture: 'item-letter',
    label: 'Witness Statement',
    description: 'A witness affidavit states that Padre Dámaso publicly denounced Don Rafael from the pulpit before any trial took place.',
    x: 620,
    y: 430,
  },
  {
    key: 'burial',
    texture: 'item-scroll',
    label: 'Burial Order',
    description: 'The burial order, signed by the parish priest, ordered the exhumation and removal of Don Rafael\u2019s remains to the Chinese cemetery.',
    x: 130,
    y: 170,
  },
];

export class SanDiegoTownScene extends Phaser.Scene {
  private chapterId = 'ch1';
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  /* ch1 state */
  private ch1Npc!: Phaser.Physics.Arcade.Sprite;
  private ch1HasTalked = false;

  /* ch2 state */
  private guevaraNpc!: Phaser.Physics.Arcade.Sprite;
  private guevaraDialogueStep = 0;
  private guevaraDialogueDone = false;
  private clueObjects: Phaser.GameObjects.Sprite[] = [];
  private foundClues = new Set<string>();
  private encounterResolved = false;
  private ch2QuizDone = false;

  private hintText?: Phaser.GameObjects.Text;

  constructor() {
    super('SanDiegoTownScene');
  }

  init(data: SceneInitData) {
    this.chapterId = data.chapterId ?? 'ch1';
    this.ch1HasTalked = false;
    this.guevaraDialogueStep = 0;
    this.guevaraDialogueDone = false;
    this.foundClues = new Set<string>();
    this.encounterResolved = false;
    this.ch2QuizDone = false;
    this.clueObjects = [];
  }

  create() {
    // ── Background ───────────────────────────────────────────────
    const bgKey = this.textures.exists('bg-town') ? 'bg-town' : null;
    if (bgKey) {
      this.add.image(400, 300, bgKey).setDisplaySize(800, 600);
    } else {
      this.add.rectangle(400, 300, 800, 600, 0xFFF8E7);
    }

    // ── Decorative buildings ─────────────────────────────────────
    if (this.textures.exists('bg-church')) {
      this.add.image(700, 150, 'bg-church').setDisplaySize(160, 100).setAlpha(0.9).setDepth(1);
    }
    if (this.textures.exists('bg-bahay-nbato')) {
      this.add.image(150, 180, 'bg-bahay-nbato').setDisplaySize(140, 90).setAlpha(0.9).setDepth(1);
    }

    // ── Scene Title ──────────────────────────────────────────────
    const titleY = 30;
    if (this.chapterId === 'ch1') {
      this.createLabel(400, titleY, 'San Diego \u2014 Town Plaza, 1887', 0xFFD60A, 18);
      this.setupCh1();
    } else if (this.chapterId === 'ch2') {
      this.createLabel(400, titleY, 'San Diego \u2014 The Lieutenant\u2019s Warning', 0x2979FF, 18);
      this.setupCh2();
    }

    // ── Player (Ibarra) ──────────────────────────────────────────
    const playerKey = this.textures.exists('char-ibarra') ? 'char-ibarra' : 'player-fallback';
    this.player = this.physics.add.sprite(400, 450, playerKey);
    if (this.textures.exists('char-ibarra')) {
      this.player.setScale(0.25);
    }
    this.player.setCollideWorldBounds(true);

    if (this.chapterId === 'ch1') {
      this.physics.add.overlap(this.player, this.ch1Npc, () => this.talkToMangTenyo());
    } else if (this.chapterId === 'ch2') {
      this.physics.add.overlap(this.player, this.guevaraNpc, () => this.talkToGuevara());
    }

    this.cursors = this.input.keyboard!.createCursorKeys();

    // ── Hint Text ────────────────────────────────────────────────
    this.hintText = this.add
      .text(400, 575, '', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#000000',
        backgroundColor: '#FFD60A',
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5)
      .setDepth(5);

    // ── Quest indicator ──────────────────────────────────────────
    const questsHere = getQuestsForChapter(this.chapterId);
    this.add
      .text(20, 560, `Quests: ${questsHere.length}`, {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#000000',
        backgroundColor: '#00C853',
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0)
      .setDepth(5);

    if (this.chapterId === 'ch1') {
      this.game.events.once('quiz:completed', this.onCh1QuizCompleted, this);
    } else if (this.chapterId === 'ch2') {
      this.game.events.once('quiz:completed', this.onCh2QuizCompleted, this);
    }
  }

  update() {
    const speed = 160;
    this.player.setVelocity(0);
    if (this.cursors.left?.isDown) this.player.setVelocityX(-speed);
    else if (this.cursors.right?.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up?.isDown) this.player.setVelocityY(-speed);
    else if (this.cursors.down?.isDown) this.player.setVelocityY(speed);
  }

  private setupCh1() {
    // ── Mang Tenyo NPC ───────────────────────────────────────────
    const npcKey = this.textures.exists('char-mang-tenyo') ? 'char-mang-tenyo' : 'npc-fallback';
    this.ch1Npc = this.physics.add.sprite(400, 250, npcKey);
    if (this.textures.exists('char-mang-tenyo')) {
      this.ch1Npc.setScale(0.25);
    }
    this.ch1Npc.setImmovable(true);

    // NPC label
    this.createLabel(400, 210, 'Mang Tenyo', 0xFF6B9D, 13);

    // Portrait
    if (this.textures.exists('portrait-mang-tenyo')) {
      this.add.image(480, 230, 'portrait-mang-tenyo').setDisplaySize(40, 40).setDepth(5);
    }
  }

  private talkToMangTenyo() {
    if (this.ch1HasTalked) return;
    this.ch1HasTalked = true;

    this.game.events.emit(GameEvents.DialogueLine, {
      speaker: 'Mang Tenyo',
      line: "You're not from around here, iho \u2014 best not to mention the Ibarra name too loudly tonight.",
    });

    this.game.events.emit(GameEvents.JournalEntry, {
      text: 'Mang Tenyo warned me not to mention the Ibarra name loudly. Something happened at last night\u2019s reception.',
    });

    this.game.events.emit(GameEvents.CodexUnlock, { id: 'char.ibarra' });
    this.game.events.emit(GameEvents.CodexUnlock, { id: 'char.tiago' });
    this.game.events.emit(GameEvents.CodexUnlock, { id: 'char.damaso' });
    this.game.events.emit(GameEvents.KnowledgeXp, { amount: 60, reason: 'mq.ch1.arrival' });

    this.time.delayedCall(1500, () => {
      this.game.events.emit(GameEvents.JournalEntry, {
        text: 'The reception is over. Tomorrow, I should ask around the Guardia Civil outpost for news about the Ibarra family.',
      });
      this.game.events.emit(GameEvents.ChapterMedal, { chapterId: 'ch1' });
      this.game.events.emit(GameEvents.QuizRequested, { chapterId: 'ch1' });
    });
  }

  private setupCh2() {
    // ── Lt. Guevara NPC ──────────────────────────────────────────
    const guevaraKey = this.textures.exists('char-civil-guard') ? 'char-civil-guard' : 'npc-fallback';
    this.guevaraNpc = this.physics.add.sprite(150, 120, guevaraKey);
    if (this.textures.exists('char-civil-guard')) {
      this.guevaraNpc.setScale(0.25);
    }
    this.guevaraNpc.setImmovable(true);

    this.createLabel(150, 80, 'Lt. Guevara', 0x2979FF, 13);

    if (this.textures.exists('portrait-civil-guard')) {
      this.add.image(230, 100, 'portrait-civil-guard').setDisplaySize(40, 40).setDepth(5);
    }
  }

  private talkToGuevara() {
    if (this.guevaraDialogueDone) return;

    if (this.guevaraDialogueStep >= GUEVARA_DIALOGUE.length) {
      this.guevaraDialogueDone = true;
      this.onGuevaraDialogueComplete();
      return;
    }

    this.game.events.emit(GameEvents.DialogueLine, {
      speaker: 'Lt. Guevara',
      line: GUEVARA_DIALOGUE[this.guevaraDialogueStep],
    });

    this.guevaraDialogueStep++;

    if (this.guevaraDialogueStep >= GUEVARA_DIALOGUE.length) {
      this.guevaraDialogueDone = true;
      this.time.delayedCall(1200, () => this.onGuevaraDialogueComplete());
    }
  }

  private onGuevaraDialogueComplete() {
    this.game.events.emit(GameEvents.JournalEntry, {
      text: 'Lt. Guevara revealed the truth about Don Rafael\u2019s death and the desecration of his grave. I must investigate the records myself.',
    });

    this.game.events.emit(GameEvents.CodexUnlock, { id: 'char.guevara' });

    this.spawnClues();
  }

  private spawnClues() {
    if (this.clueObjects.length > 0) return;

    this.hintText?.setText('Investigate the evidence scattered around the plaza. Click on each clue.');

    for (const def of CLUE_DEFS) {
      const textureKey = this.textures.exists(def.texture) ? def.texture : 'item-fallback';
      const sprite = this.add.sprite(def.x, def.y, textureKey).setInteractive({ useHandCursor: true });
      sprite.setDepth(5);
      if (this.textures.exists(def.texture)) {
        sprite.setScale(0.5);
      }

      // Pulsing glow on clues
      this.tweens.add({
        targets: sprite,
        scaleX: sprite.scaleX * 1.15,
        scaleY: sprite.scaleY * 1.15,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.add
        .text(def.x, def.y - 25, def.label, {
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#000000',
          backgroundColor: '#FF6B9D',
          padding: { x: 3, y: 1 },
        })
        .setOrigin(0.5)
        .setDepth(6);

      sprite.on('pointerdown', () => this.examineClue(def));
      this.clueObjects.push(sprite);
    }
  }

  private examineClue(def: ClueDef) {
    if (this.foundClues.has(def.key)) return;
    this.foundClues.add(def.key);

    this.game.events.emit(GameEvents.DialogueLine, {
      speaker: def.label,
      line: def.description,
    });

    this.game.events.emit(GameEvents.JournalEntry, {
      text: `[Investigation] ${def.label}: ${def.description}`,
    });

    const idx = CLUE_DEFS.findIndex((c) => c.key === def.key);
    if (idx >= 0 && this.clueObjects[idx]) {
      this.clueObjects[idx].setTint(0x00ff00);
      this.tweens.killTweensOf(this.clueObjects[idx]);
    }

    this.hintText?.setText(`Clues found: ${this.foundClues.size} / ${CLUE_DEFS.length}`);

    if (this.foundClues.size >= CLUE_DEFS.length) {
      this.time.delayedCall(800, () => this.resolveEncounter());
    }
  }

  private resolveEncounter() {
    if (this.encounterResolved) return;
    this.encounterResolved = true;

    this.game.events.emit(GameEvents.CodexUnlock, { id: 'char.don-rafael' });
    this.game.events.emit(GameEvents.CodexUnlock, { id: 'event.don-rafael-persecution' });
    this.game.events.emit(GameEvents.CodexUnlock, { id: 'term.guardia-civil' });
    this.game.events.emit(GameEvents.CodexUnlock, { id: 'artifact.ibarra-ledger' });
    this.game.events.emit(GameEvents.CodexUnlock, { id: 'loc.ibarra-estate' });

    this.game.events.emit(GameEvents.KnowledgeXp, { amount: 80, reason: 'mq.ch2.investigation' });

    this.game.events.emit(GameEvents.JournalEntry, {
      text: 'The evidence is overwhelming. Don Rafael was falsely accused, and the Church desecrated his remains. The truth of San Diego must be known.',
    });

    this.game.events.emit(GameEvents.ChapterMedal, { chapterId: 'ch2' });

    this.hintText?.setText('Investigation complete! Preparing the chapter quiz...');

    this.time.delayedCall(1500, () => {
      this.game.events.emit(GameEvents.QuizRequested, { chapterId: 'ch2' });
    });
  }

  private ch1QuizDone = false;

  private onCh1QuizCompleted() {
    if (this.ch1QuizDone) return;
    this.ch1QuizDone = true;

    this.hintText?.setText('Quiz complete! The next morning...');

    this.time.delayedCall(1200, () => {
      this.game.events.emit(GameEvents.ChapterTransition, {
        chapterId: 'ch1',
        sceneKey: 'SanDiegoTownScene',
      });
      this.scene.start('SanDiegoTownScene', { chapterId: 'ch2' });
    });
  }

  private onCh2QuizCompleted() {
    if (this.ch2QuizDone) return;
    this.ch2QuizDone = true;

    this.hintText?.setText('Quiz complete! Traveling to Laguna de Bay...');

    this.time.delayedCall(1200, () => {
      this.game.events.emit(GameEvents.ChapterTransition, {
        chapterId: 'ch2',
        sceneKey: 'LagunaDeBayScene',
      });
      this.scene.start('LagunaDeBayScene');
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

    this.add.rectangle(
      bounds.centerX + 3, bounds.centerY + 3,
      bounds.width + padding * 2, bounds.height + padding,
      0x000000
    ).setDepth(3);

    this.add.rectangle(
      bounds.centerX, bounds.centerY,
      bounds.width + padding * 2, bounds.height + padding,
      bgColor
    ).setDepth(4).setStrokeStyle(3, 0x000000);
  }
}
