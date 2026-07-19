import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { CHARACTER_SHEETS, ANIM_DEFAULTS } from '../assetRegistry';
import { gameState, ITEM_DEFS, ItemId, QuestStage } from '../game-state';

// Collectible relics placed around the world. The player gathers these to
// advance the quest and hand them to María Clara.
interface CollectibleDef { id: ItemId; tileX: number; tileY: number; }
const COLLECTIBLES: CollectibleDef[] = [
  { id: 'relic_crucifix', tileX: 6,  tileY: 6  },
  { id: 'relic_letter',   tileX: 54, tileY: 40 },
  { id: 'relic_ring',     tileX: 50, tileY: 6  },
  { id: 'relic_book',     tileX: 8,  tileY: 40 },
  { id: 'relic_potion',   tileX: 30, tileY: 4  },
  { id: 'relic_coin',     tileX: 30, tileY: 42 },
];

// Enemy guards (spanish-npc) that patrol near the relics. Combat is simple:
// player attack (J / left-click) within range triggers enemy hurt -> dead.
interface EnemyDef { id: string; tileX: number; tileY: number; patrolRange: number; }
const ENEMIES: EnemyDef[] = [
  { id: 'guard_1', tileX: 10, tileY: 8,  patrolRange: 24 },
  { id: 'guard_2', tileX: 52, tileY: 10, patrolRange: 24 },
  { id: 'guard_3', tileX: 12, tileY: 36, patrolRange: 24 },
  { id: 'guard_4', tileX: 48, tileY: 38, patrolRange: 24 },
];

// Quest-aware NPC dialogue. Each NPC has intro lines and quest-stage lines.
interface NpcDefQuest extends NpcDef {
  questLines?: Partial<Record<QuestStage, string[]>>;
  givesItem?: { stage: QuestStage; item: ItemId };
}

/**
 * WorldScene — explorable RPG layer over the integrated sprite atlases.
 *
 * The town of San Diego: a procedurally-textured ground (grass / path / water)
 * with real building + nature sprites placed from the environment atlases. The
 * player (Crisóstomo Ibarra by default) walks with WASD / arrows, the camera
 * follows, and NPCs (clara, elias, damaso, tiago, sisa) idle around town.
 * Press E / Space near an NPC to open a typewriter dialogue box with Noli Me
 * Tangere-themed lines. Press Esc to return to the title.
 *
 * No placeholder character art — every sprite is a real sliced atlas frame.
 * Ground tiles are procedurally textured (standard for a tile layer) and are
 * never used as character stand-ins.
 */

const TILE = 16;
const WORLD_W = 60;   // tiles
const WORLD_H = 45;   // tiles
const PLAYER_SPEED = 70;   // px/sec
const RUN_SPEED = 120;

// NPC definitions: { key, tileX, tileY, name, color, lines }
interface NpcDef {
  key: string; tileX: number; tileY: number;
  name: string; color: string; lines: string[];
}
const NPCS: NpcDefQuest[] = [
  {
    key: 'clara', tileX: 30, tileY: 12, name: 'María Clara', color: '#f4c8d8',
    lines: [
      'Crisóstomo… you have returned at last.',
      'The years apart felt like a single endless prayer.',
      'Walk with me — San Diego has changed, and not for the better.',
    ],
    questLines: {
      gather: [
        'The friars hid our relics across the town.',
        'Recover them — the crucifix, the letter, my ring…',
        'Beware the Guardia Civil. They patrol the roads at night.',
      ],
      return: [
        'You carry the relics! I knew you would not fail us.',
        'Bring them all to me, and our story may yet end in light.',
      ],
      complete: [
        'It is done. San Diego will remember this day.',
        'Whatever comes next, we face it together, my Crisóstomo.',
      ],
    },
  },
  {
    key: 'elias', tileX: 12, tileY: 30, name: 'Elías', color: '#bfe3c0',
    lines: [
      'Keep your voice down, señor. The walls of this town have ears.',
      'I am Elías. I owe you a debt I may never repay.',
      'When you are ready to know the truth of your father, find me by the lake.',
    ],
    givesItem: { stage: 'gather', item: 'relic_letter' },
  },
  {
    key: 'damaso', tileX: 48, tileY: 14, name: 'Fr. Dámaso', color: '#e8b878',
    lines: [
      'So the son returns, bold as his dead father!',
      'Beware, boy — San Diego bends to my word, not yours.',
      'Go on, walk your little paths. We shall see who has the last laugh.',
    ],
  },
  {
    key: 'tiago', tileX: 42, tileY: 32, name: 'Cap. Tiago', color: '#d8c898',
    lines: [
      'Ah, my dear Crisóstomo! Welcome home!',
      'Clara has missed you terribly — do visit the house.',
      'Business calls me to Manila, but tonight we feast!',
    ],
    givesItem: { stage: 'gather', item: 'relic_coin' },
  },
  {
    key: 'sisa', tileX: 18, tileY: 8, name: 'Sisa', color: '#c8c0e8',
    lines: [
      'My boys… have you seen my boys? Basilio? Crispín?',
      'They took them into the convent and they will not give them back…',
      'Forgive me — I must keep looking. The bell tolls, it always tolls.',
    ],
    givesItem: { stage: 'gather', item: 'relic_potion' },
  },
];

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerCharKey = 'rizal';
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private runKey!: Phaser.Input.Keyboard.Key;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private escKey!: Phaser.Input.Keyboard.Key;
  private npcs: Phaser.Physics.Arcade.Sprite[] = [];
  private npcDefs = NPCS;
  private activeNpc: NpcDef | null = null;
  private dialogBox!: Phaser.GameObjects.Container;
  private dialogText!: Phaser.GameObjects.Text;
  private dialogName!: Phaser.GameObjects.Text;
  private dialogIndicator!: Phaser.GameObjects.Text;
  private typing = false;
  private typeTimer?: Phaser.Time.TimerEvent;
  private fullLine = '';
  private shownChars = 0;
  private dialogQueue: string[] = [];
  private proximityHint!: Phaser.GameObjects.Container;
  private hudObjective!: Phaser.GameObjects.Text;
  private hudName!: Phaser.GameObjects.Text;
  private interacted = new Set<string>();
  private muted = false;
  private groundLayer!: Phaser.GameObjects.Graphics;
  private objectLayer!: Phaser.GameObjects.Container;
  private collectibles: Phaser.GameObjects.Sprite[] = [];
  private collectibleDefs = COLLECTIBLES;
  private enemies: Phaser.Physics.Arcade.Sprite[] = [];
  private enemyDefs = ENEMIES;
  private enemyStates: { id: string; alive: boolean; homeX: number; homeY: number; dir: number; hp: number; }[] = [];
  private attackKey!: Phaser.Input.Keyboard.Key;
  private attackHitbox!: Phaser.GameObjects.Arc;
  private isAttacking = false;
  private healthBar!: Phaser.GameObjects.Graphics;
  private xpBar!: Phaser.GameObjects.Graphics;
  private toastText!: Phaser.GameObjects.Text;
  private toastTimer?: Phaser.Time.TimerEvent;
  private invulnUntil = 0;

  constructor() {
    super('WorldScene');
  }

  create() {
    const ctx = this.game.canvas.getContext('2d');
    if (ctx) ctx.imageSmoothingEnabled = false;
    this.cameras.main.roundPixels = true;

    // ── Build ground texture ──
    this.buildGroundTexture();

    // ── Draw ground tiles ──
    this.drawGround();

    // ── Place buildings + nature from real atlas sprites ──
    this.objectLayer = this.add.container(0, 0);
    this.placeEnvironment();

    // ── Player ──
    this.playerCharKey = gameState.get().playerChar || (this.registry.get('playerChar') as string) || 'rizal';
    const px = WORLD_W * TILE / 2;
    const py = WORLD_H * TILE / 2 + 8;
    this.player = this.physics.add.sprite(px, py, this.playerCharKey, `${this.playerCharKey}_idle_0`);
    this.player.setOrigin(0.5, 0.8);
    this.player.setScale(2);
    this.player.setSize(10, 8);
    this.player.setOffset(this.player.width / 2 - 5, this.player.height - 8);
    this.player.setCollideWorldBounds(true);
    this.player.play(`${this.playerCharKey}_idle`);

    // ── NPCs ──
    for (const def of this.npcDefs) {
      const s = this.physics.add.sprite(def.tileX * TILE + TILE / 2, def.tileY * TILE + TILE / 2, def.key, `${def.key}_idle_0`);
      s.setOrigin(0.5, 0.8);
      s.setScale(2);
      s.setSize(10, 8);
      s.setOffset(s.width / 2 - 5, s.height - 8);
      s.setImmovable(true);
      const animKey = `${def.key}_idle`;
      if (this.anims.exists(animKey)) s.play(animKey);
      // gentle idle bob
      this.tweens.add({ targets: s, y: s.y - 1, duration: 1400, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      this.npcs.push(s);
      this.objectLayer.add(s);
    }
    this.physics.add.collider(this.player, this.npcs);

    // ── World bounds + camera ──
    this.physics.world.setBounds(0, 0, WORLD_W * TILE, WORLD_H * TILE);
    this.cameras.main.setBounds(0, 0, WORLD_W * TILE, WORLD_H * TILE);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(2);

    // ── Input ──
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<string, Phaser.Input.Keyboard.Key>;
    this.runKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.input.keyboard!.on('keydown-E', () => this.onInteract());
    this.input.keyboard!.on('keydown-SPACE', () => this.onInteract());
    this.input.keyboard!.on('keydown-ESC', () => {
      if (this.dialogBox.visible) this.closeDialog();
      else this.scene.switch('TitleScene');
    });
    this.input.keyboard!.on('keydown-M', () => { this.muted = !this.muted; });
    this.attackKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.input.keyboard!.on('keydown-J', () => this.doPlayerAttack());
    this.input.on('pointerdown', (_p: Phaser.Input.Pointer, targets: Phaser.GameObjects.GameObject[]) => {
      // left-click also attacks
      this.doPlayerAttack();
    });

    // ── Collectibles (real sliced frames from collectible-assets atlas) ──
    this.spawnCollectibles();

    // ── Enemies (spanish-npc sprites, real atlas) ──
    this.spawnEnemies();

    // ── Attack hitbox (follows player, used for overlap detection) ──
    this.attackHitbox = this.add.circle(this.player.x, this.player.y, 20, 0xffe066, 0.0)
      .setVisible(false) as unknown as Phaser.GameObjects.Arc;
    this.physics.add.existing(this.attackHitbox);
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // ── HUD (fixed to camera) ──
    this.buildHud();
    this.buildStatusBar();
    this.buildToast();

    // ── Dialogue box (hidden) ──
    this.buildDialog();

    // ── Proximity hint (hidden) ──
    this.buildProximityHint();

    // ── Fade in ──
    this.cameras.main.fadeIn(500, 15, 10, 20);

    // ── Restore quest state from save ──
    this.applySaveState();

    // ── First-time objective ──
    this.refreshObjective();
  }

  // ───────────────────────────────────────────────────────────────
  //  Ground
  // ───────────────────────────────────────────────────────────────
  private buildGroundTexture() {
    if (this.textures.exists('tile_grass')) return;
    const mk = (key: string, base: number, variants: number[]) => {
      const g = this.add.graphics();
      // base
      g.fillStyle(base, 1); g.fillRect(0, 0, TILE, TILE);
      // noise speckles
      for (const v of variants) {
        g.fillStyle(v, 0.5);
        for (let i = 0; i < 6; i++) {
          const x = Phaser.Math.Between(0, TILE - 1);
          const y = Phaser.Math.Between(0, TILE - 1);
          g.fillRect(x, y, 1, 1);
        }
      }
      g.generateTexture(key, TILE, TILE);
      g.destroy();
    };
    mk('tile_grass', 0x3a5a32, [0x2f4a28, 0x456a3c, 0x344f2c]);
    mk('tile_grass2', 0x345028, [0x2a4020, 0x3f5a30, 0x304a26]);
    mk('tile_path', 0x8a6a3a, [0x7a5a2a, 0x9a7a4a, 0x6a4a22]);
    mk('tile_path2', 0x7a5a30, [0x6a4a22, 0x8a6a3a, 0x5a3a18]);
    mk('tile_water', 0x2a4a6a, [0x244060, 0x3a5a7a, 0x1e3850]);
    mk('tile_flower', 0x3a5a32, [0x2f4a28, 0x456a3c, 0xc9a04a, 0x8b2c2c]);
  }

  private drawGround() {
    this.groundLayer = this.add.graphics();
    const cx = Math.floor(WORLD_W / 2);
    const cy = Math.floor(WORLD_H / 2);
    for (let ty = 0; ty < WORLD_H; ty++) {
      for (let tx = 0; tx < WORLD_W; tx++) {
        const isPath = this.isPath(tx, ty, cx, cy);
        const isWater = this.isWater(tx, ty);
        let key = ((tx + ty) % 2 === 0) ? 'tile_grass' : 'tile_grass2';
        if (isPath) key = ((tx + ty) % 2 === 0) ? 'tile_path' : 'tile_path2';
        if (isWater) key = 'tile_water';
        if (!isPath && !isWater && ((tx * 7 + ty * 13) % 23 === 0)) key = 'tile_flower';
        this.add.image(tx * TILE + TILE / 2, ty * TILE + TILE / 2, key).setDepth(-100);
      }
    }
  }

  private isPath(tx: number, ty: number, cx: number, cy: number): boolean {
    // main horizontal avenue
    if (ty === cy || ty === cy - 1) return tx > 2 && tx < WORLD_W - 3;
    // main vertical avenue
    if (tx === cx || tx === cx - 1) return ty > 2 && ty < WORLD_H - 3;
    // side paths to npc clusters
    if (ty === 12 && tx >= cx - 1 && tx <= 32) return true;
    if (ty === 30 && tx >= 10 && tx <= 14) return true;
    return false;
  }

  private isWater(tx: number, ty: number): boolean {
    // lake in the bottom-left
    const lx = 6, ly = 38, r = 5;
    const dx = tx - lx, dy = ty - ly;
    return dx * dx + dy * dy < r * r;
  }

  // ───────────────────────────────────────────────────────────────
  //  Environment (real atlas sprites)
  // ───────────────────────────────────────────────────────────────
  private placeEnvironment() {
    const envKey = 'building-assets';
    const natureKey = 'nature-assets';
    const bTex = this.textures.get(envKey);
    const nTex = this.textures.get(natureKey);
    const bFrames = bTex.getFrameNames();
    const nFrames = nTex.getFrameNames();
    if (bFrames.length === 0 || nFrames.length === 0) return;

    // Buildings: place 3 large sprites as town landmarks
    const buildings = [
      { f: bFrames[0], x: 44 * TILE, y: 12 * TILE, s: 3 }, // church area
      { f: bFrames[1] ?? bFrames[0], x: 8 * TILE, y: 14 * TILE, s: 3 },
      { f: bFrames[2] ?? bFrames[0], x: 30 * TILE, y: 30 * TILE, s: 3 },
    ];
    for (const b of buildings) {
      const img = this.add.image(b.x, b.y, envKey, b.f).setOrigin(0.5, 1).setScale(b.s).setDepth(b.y);
      this.objectLayer.add(img);
      // make building solid (add a physics body)
      this.physics.add.existing(img, true);
      (img.body as Phaser.Physics.Arcade.Body).setSize(img.displayWidth * 0.7, img.displayHeight * 0.3);
      (img.body as Phaser.Physics.Arcade.Body).setOffset(img.width * 0.15, img.height * 0.7);
      this.physics.add.collider(this.player, img);
    }

    // Nature: scatter trees + bushes around the map edges
    const treeFrames = nFrames.slice(0, Math.min(8, nFrames.length));
    const placed = new Set<string>();
    for (let i = 0; i < 60; i++) {
      const tx = Phaser.Math.Between(1, WORLD_W - 2);
      const ty = Phaser.Math.Between(1, WORLD_H - 2);
      const key = `${tx},${ty}`;
      if (placed.has(key)) continue;
      if (this.isPath(tx, ty, Math.floor(WORLD_W / 2), Math.floor(WORLD_H / 2))) continue;
      if (this.isWater(tx, ty)) continue;
      placed.add(key);
      const f = treeFrames[i % treeFrames.length];
      const img = this.add.image(tx * TILE + TILE / 2, ty * TILE + TILE, natureKey, f)
        .setOrigin(0.5, 1).setScale(2).setDepth(ty * TILE + TILE);
      this.objectLayer.add(img);
      // solid trunk
      this.physics.add.existing(img, true);
      (img.body as Phaser.Physics.Arcade.Body).setSize(8, 6);
      (img.body as Phaser.Physics.Arcade.Body).setOffset(img.width / 2 - 4, img.height - 6);
      this.physics.add.collider(this.player, img);
    }
  }

  // ───────────────────────────────────────────────────────────────
  //  HUD
  // ───────────────────────────────────────────────────────────────
  private buildHud() {
    const W = GAME_WIDTH;
    // objective bar (top)
    const bar = this.add.graphics().setScrollFactor(0).setDepth(1000);
    bar.fillStyle(0x0a0610, 0.7); bar.fillRect(0, 0, W, 14);
    bar.lineStyle(1, 0xc9a04a, 0.5); bar.lineBetween(0, 14, W, 14);

    const nameLabel = this.add.text(4, 3, 'Ibarra', {
      fontFamily: 'monospace', fontSize: '8px', color: '#c9a04a', fontStyle: 'bold',
    }).setScrollFactor(0).setDepth(1001);

    this.hudName = nameLabel;
    this.hudObjective = this.add.text(W / 2, 7, '', {
      fontFamily: 'monospace', fontSize: '7px', color: '#e8d5a8',
    }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(1001);

    // controls hint (bottom)
    const hint = this.add.text(W / 2, GAME_HEIGHT - 6, 'WASD move · ⇧ run · E talk · J attack · Esc menu', {
      fontFamily: 'monospace', fontSize: '6px', color: '#8a7556',
    }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(1000);
    hint.setShadow(0, 0, '#000', 1);
  }

  // ───────────────────────────────────────────────────────────────
  //  Proximity hint
  // ───────────────────────────────────────────────────────────────
  private buildProximityHint() {
    this.proximityHint = this.add.container(0, 0).setDepth(1100).setScrollFactor(0);
    const bg = this.add.graphics();
    bg.fillStyle(0x1a1208, 0.85); bg.fillRoundedRect(-22, -10, 44, 16, 2);
    bg.lineStyle(1, 0xc9a04a, 0.8); bg.strokeRoundedRect(-22, -10, 44, 16, 2);
    const t = this.add.text(0, -2, 'Press E', {
      fontFamily: 'monospace', fontSize: '8px', color: '#e8d5a8', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.proximityHint.add([bg, t]);
    this.proximityHint.setVisible(false);
  }

  // ───────────────────────────────────────────────────────────────
  //  Dialogue
  // ───────────────────────────────────────────────────────────────
  private buildDialog() {
    const W = GAME_WIDTH, H = GAME_HEIGHT;
    this.dialogBox = this.add.container(0, 0).setDepth(1200).setScrollFactor(0);
    const boxY = H - 56;
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0610, 0.92); bg.fillRoundedRect(6, boxY, W - 12, 50, 3);
    bg.lineStyle(1, 0xc9a04a, 0.9); bg.strokeRoundedRect(6, boxY, W - 12, 50, 3);
    bg.lineStyle(1, 0x6b4423, 0.6); bg.strokeRoundedRect(8, boxY + 2, W - 16, 46, 2);

    this.dialogName = this.add.text(14, boxY + 5, '', {
      fontFamily: 'monospace', fontSize: '9px', color: '#c9a04a', fontStyle: 'bold',
    });

    this.dialogText = this.add.text(14, boxY + 18, '', {
      fontFamily: 'monospace', fontSize: '8px', color: '#e8d5a8', wordWrap: { width: W - 28 },
      lineSpacing: 2,
    });

    this.dialogIndicator = this.add.text(W - 16, boxY + 40, '▼', {
      fontFamily: 'monospace', fontSize: '8px', color: '#c9a04a',
    }).setOrigin(1, 0.5);

    this.dialogBox.add([bg, this.dialogName, this.dialogText, this.dialogIndicator]);
    this.dialogBox.setVisible(false);

    // blink indicator
    this.time.addEvent({
      delay: 500, loop: true, callback: () => {
        this.dialogIndicator.setAlpha(this.dialogIndicator.alpha > 0.5 ? 0.2 : 1);
      },
    });
  }

  private startLine(line: string) {
    this.fullLine = line;
    this.shownChars = 0;
    this.dialogText.setText('');
    this.typing = true;
    this.typeTimer = this.time.addEvent({
      delay: 28,
      repeat: line.length - 1,
      callback: () => {
        if (!this.typing) return;
        this.shownChars++;
        this.dialogText.setText(line.substring(0, this.shownChars));
        if (this.shownChars >= line.length) {
          this.typing = false;
        }
      },
    });
  }

  // ───────────────────────────────────────────────────────────────
  //  Update loop
  // ───────────────────────────────────────────────────────────────
  update() {
    if (!this.player) return;
    let vx = 0, vy = 0;
    if (this.dialogBox.visible) {
      // freeze movement during dialog
      this.player.setVelocity(0, 0);
      this.ensureAnim('idle');
      return;
    }
    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -1;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -1;
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = 1;

    const running = this.runKey.isDown && (vx !== 0 || vy !== 0);
    const speed = running ? RUN_SPEED : PLAYER_SPEED;

    if (vx !== 0 || vy !== 0) {
      // normalise diagonal
      const len = Math.sqrt(vx * vx + vy * vy);
      this.player.setVelocity((vx / len) * speed, (vy / len) * speed);
      this.ensureAnim(running ? 'run' : 'walk');
      // face direction (flip horizontally)
      if (vx < 0) this.player.setFlipX(true);
      else if (vx > 0) this.player.setFlipX(false);
    } else {
      this.player.setVelocity(0, 0);
      this.ensureAnim('idle');
    }

    // depth-sort player by y
    this.player.setDepth(this.player.y);

    // proximity check
    this.activeNpc = null;
    let bestDist = 28;
    for (let i = 0; i < this.npcs.length; i++) {
      const s = this.npcs[i];
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
      if (d < bestDist) {
        bestDist = d;
        this.activeNpc = this.npcDefs[i];
      }
    }
    if (this.activeNpc) {
      this.proximityHint.setVisible(true);
      // position hint at top-center of screen
      this.proximityHint.setPosition(GAME_WIDTH / 2, 26);
    } else {
      this.proximityHint.setVisible(false);
    }

    // ── Enemy patrol + collision ──
    this.updateEnemies();

    // ── Attack hitbox follows player (in front, based on facing) ──
    if (this.attackHitbox) {
      const fx = this.player.flipX ? -1 : 1;
      this.attackHitbox.setPosition(this.player.x + fx * 8, this.player.y - 4);
    }

    // ── Pick up collectibles by walking over them ──
    this.checkCollectiblePickup();

    // ── Enemy touch damage ──
    this.checkEnemyContact();

    // ── Refresh status bars ──
    this.drawStatusBar();
  }

  // ───────────────────────────────────────────────────────────────
  //  Collectibles
  // ───────────────────────────────────────────────────────────────
  private spawnCollectibles() {
    const tex = this.textures.get('collectible-assets');
    const frames = tex.getFrameNames();
    if (frames.length === 0) return;
    // map each relic to a distinct frame
    for (let i = 0; i < this.collectibleDefs.length; i++) {
      const def = this.collectibleDefs[i];
      if (gameState.hasItem(def.id)) continue; // already collected
      const frameName = frames[(i * 5) % frames.length];
      const sx = def.tileX * TILE + TILE / 2;
      const sy = def.tileY * TILE + TILE / 2;
      const s = this.add.sprite(sx, sy, 'collectible-assets', frameName);
      s.setOrigin(0.5, 0.5);
      s.setScale(1.5);
      s.setDepth(sy);
      // gentle float
      this.tweens.add({
        targets: s, y: sy - 3, duration: 1200, yoyo: true, repeat: -1, ease: 'sine.inOut',
      });
      // glow ring
      const ring = this.add.graphics();
      ring.lineStyle(1, 0xc9a04a, 0.5);
      ring.strokeCircle(sx, sy, 9);
      this.tweens.add({ targets: ring, alpha: 0.1, duration: 800, yoyo: true, repeat: -1 });
      this.objectLayer.add(s);
      this.objectLayer.add(ring);
      this.collectibles.push(s);
    }
  }

  private checkCollectiblePickup() {
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const s = this.collectibles[i];
      if (!s.active) continue;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
      if (d < 14) {
        const def = this.collectibleDefs[i];
        gameState.addItem(def.id);
        const def_meta = ITEM_DEFS.find(m => m.id === def.id);
        this.showToast(`+ ${def_meta?.name ?? def.id}`);
        // pickup burst
        const burst = this.add.image(s.x, s.y, '__WHITE').setTint(0xc9a04a).setScale(2);
        this.tweens.add({ targets: burst, scaleX: 4, scaleY: 4, alpha: 0, duration: 400, onComplete: () => burst.destroy() });
        s.destroy();
        this.collectibles.splice(i, 1);
        this.refreshObjective();
        this.checkQuestProgress();
      }
    }
  }

  // ───────────────────────────────────────────────────────────────
  //  Enemies + combat
  // ───────────────────────────────────────────────────────────────
  private spawnEnemies() {
    for (const def of this.enemyDefs) {
      if (gameState.get().defeated.includes(def.id)) continue;
      const x = def.tileX * TILE + TILE / 2;
      const y = def.tileY * TILE + TILE / 2;
      const s = this.physics.add.sprite(x, y, 'spanish-npc', 'spanish-npc_idle_0');
      s.setOrigin(0.5, 0.8);
      s.setScale(2);
      s.setSize(10, 8);
      s.setOffset(s.width / 2 - 5, s.height - 8);
      s.setCollideWorldBounds(true);
      if (this.anims.exists('spanish-npc_idle')) s.play('spanish-npc_idle');
      this.objectLayer.add(s);
      this.enemies.push(s);
      this.enemyStates.push({ id: def.id, alive: true, homeX: x, homeY: y, dir: 1, hp: 3 });
      this.physics.add.collider(this.player, s);
    }
  }

  private updateEnemies() {
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      const st = this.enemyStates[i];
      if (!st.alive) continue;
      // patrol horizontally around home
      const dist = e.x - st.homeX;
      if (Math.abs(dist) > 18) st.dir = dist > 0 ? -1 : 1;
      e.setVelocityX(st.dir * 22);
      e.setFlipX(st.dir < 0);
      e.setDepth(e.y);
      // chase player if within 48px
      const dp = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
      if (dp < 48) {
        const cx = this.player.x - e.x;
        e.setVelocityX(Math.sign(cx) * 36);
        e.setFlipX(cx < 0);
      }
    }
  }

  private doPlayerAttack() {
    if (this.dialogBox.visible || this.isAttacking) return;
    this.isAttacking = true;
    this.ensureAnim('attack');
    const animKey = `${this.playerCharKey}_attack`;
    if (this.anims.exists(animKey)) {
      this.player.play(animKey, true);
      this.player.once('animationcomplete', () => {
        this.isAttacking = false;
        this.ensureAnim('idle');
      });
    } else {
      this.time.delayedCall(400, () => { this.isAttacking = false; this.ensureAnim('idle'); });
    }
    // check enemies in hitbox
    const fx = this.player.flipX ? -1 : 1;
    const hx = this.player.x + fx * 10;
    const hy = this.player.y - 4;
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      const st = this.enemyStates[i];
      if (!st.alive) continue;
      const d = Phaser.Math.Distance.Between(hx, hy, e.x, e.y);
      if (d < 22) {
        st.hp--;
        // knockback + hurt anim
        e.setVelocityX(fx * 120);
        if (this.anims.exists('spanish-npc_hurt')) e.play('spanish-npc_hurt', true);
        this.showToast(st.hp > 0 ? 'Hit!' : 'Guardia down!');
        if (st.hp <= 0) {
          st.alive = false;
          gameState.markDefeated(st.id);
          if (this.anims.exists('spanish-npc_dead')) {
            e.play('spanish-npc_dead');
            e.once('animationcomplete', () => {
              this.tweens.add({ targets: e, alpha: 0, duration: 600, delay: 400, onComplete: () => e.destroy() });
            });
          } else {
            this.tweens.add({ targets: e, alpha: 0, duration: 400, onComplete: () => e.destroy() });
          }
          this.refreshObjective();
        } else {
          // recover from hurt
          this.time.delayedCall(250, () => {
            if (st.alive && this.anims.exists('spanish-npc_idle')) e.play('spanish-npc_idle');
          });
        }
      }
    }
  }

  private checkEnemyContact() {
    if (this.time.now < this.invulnUntil) return;
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      const st = this.enemyStates[i];
      if (!st.alive) continue;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
      if (d < 12) {
        const dmg = 8;
        const h = gameState.damage(dmg);
        this.invulnUntil = this.time.now + 800;
        // knockback player
        const fx = this.player.x < e.x ? -1 : 1;
        this.player.setVelocityX(fx * 120);
        // flash red
        this.player.setTint(0xff4444);
        this.time.delayedCall(200, () => this.player.clearTint());
        this.showToast(`-${dmg} HP`);
        if (h <= 0) {
          // respawn (revive) — keep the game forgiving
          this.time.delayedCall(800, () => {
            gameState.update({ health: gameState.get().maxHealth });
            this.player.setPosition(WORLD_W * TILE / 2, WORLD_H * TILE / 2 + 8);
            this.showToast('You fell… but the story must go on.');
          });
        }
        break;
      }
    }
  }

  // ───────────────────────────────────────────────────────────────
  //  Status bars (health + XP) + toast
  // ───────────────────────────────────────────────────────────────
  private buildStatusBar() {
    this.healthBar = this.add.graphics().setScrollFactor(0).setDepth(1001);
    this.xpBar = this.add.graphics().setScrollFactor(0).setDepth(1001);
    // labels
    this.add.text(4, 17, 'HP', { fontFamily: 'monospace', fontSize: '7px', color: '#ff8888', fontStyle: 'bold' })
      .setScrollFactor(0).setDepth(1001);
    this.add.text(4, 26, 'XP', { fontFamily: 'monospace', fontSize: '7px', color: '#88ccff', fontStyle: 'bold' })
      .setScrollFactor(0).setDepth(1001);
    this.add.text(GAME_WIDTH - 4, 17, 'Lv', { fontFamily: 'monospace', fontSize: '7px', color: '#c9a04a', fontStyle: 'bold' })
      .setOrigin(1, 0).setScrollFactor(0).setDepth(1001);
    this.levelLabel = this.add.text(GAME_WIDTH - 4, 26, '1', { fontFamily: 'monospace', fontSize: '8px', color: '#e8d5a8', fontStyle: 'bold' })
      .setOrigin(1, 0).setScrollFactor(0).setDepth(1001);
    this.drawStatusBar();
  }

  private levelLabel!: Phaser.GameObjects.Text;

  private drawStatusBar() {
    const s = gameState.get();
    const barX = 20, barW = GAME_WIDTH - 60, hpH = 5, xpH = 3;
    // HP bar
    this.healthBar.clear();
    this.healthBar.fillStyle(0x1a1208, 0.8); this.healthBar.fillRect(barX, 18, barW, hpH);
    const hpPct = s.health / s.maxHealth;
    const hpCol = hpPct > 0.5 ? 0x4caa4c : hpPct > 0.25 ? 0xc9a04a : 0xb83a3a;
    this.healthBar.fillStyle(hpCol, 1); this.healthBar.fillRect(barX, 18, barW * hpPct, hpH);
    this.healthBar.lineStyle(1, 0x6b4423, 0.6); this.healthBar.strokeRect(barX, 18, barW, hpH);
    // XP bar
    this.xpBar.clear();
    this.xpBar.fillStyle(0x1a1208, 0.8); this.xpBar.fillRect(barX, 27, barW, xpH);
    const xpForNext = s.level * 100;
    const xpPct = Math.min(1, s.xp / xpForNext);
    this.xpBar.fillStyle(0x5a8acc, 1); this.xpBar.fillRect(barX, 27, barW * xpPct, xpH);
    this.levelLabel.setText(String(s.level));
  }

  private buildToast() {
    this.toastText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 60, '', {
      fontFamily: 'monospace', fontSize: '9px', color: '#e8d5a8', fontStyle: 'bold',
      backgroundColor: '#1a1208cc', padding: { x: 6, y: 3 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1100).setAlpha(0);
  }

  private showToast(msg: string) {
    this.toastText.setText(msg);
    this.toastText.setAlpha(1);
    if (this.toastTimer) this.toastTimer.remove();
    this.toastTimer = this.time.delayedCall(1400, () => {
      this.tweens.add({ targets: this.toastText, alpha: 0, duration: 300 });
    });
  }

  // ───────────────────────────────────────────────────────────────
  //  Quest + save integration
  // ───────────────────────────────────────────────────────────────
  private applySaveState() {
    const s = gameState.get();
    this.interacted = new Set(s.spokenTo);
    // hide already-collected relics (already filtered in spawnCollectibles)
    // hide already-defeated enemies (already filtered in spawnEnemies)
  }

  private refreshObjective() {
    const s = gameState.get();
    const totalNpc = this.npcDefs.length;
    const spoken = s.spokenTo.length;
    const collected = s.inventory.length;
    const totalRelics = this.collectibleDefs.length;
    const defeated = s.defeated.length;
    const totalEnemies = this.enemyDefs.length;

    let obj: string;
    if (spoken < totalNpc) {
      obj = `Speak with the people (${spoken}/${totalNpc})`;
    } else if (s.questStage === 'intro') {
      // first NPC spoken to starts the gather stage
      gameState.setQuestStage('gather');
      obj = `Gather the relics (${collected}/${totalRelics})`;
    } else if (collected < totalRelics) {
      obj = `Gather the relics (${collected}/${totalRelics})`;
    } else if (s.questStage === 'gather') {
      gameState.setQuestStage('return');
      obj = 'Return to María Clara';
    } else if (s.questStage === 'return') {
      obj = 'Return to María Clara';
    } else {
      obj = `Chapter complete · guards felled ${defeated}/${totalEnemies}`;
    }
    this.setObjective(obj);
  }

  private checkQuestProgress() {
    const s = gameState.get();
    const totalRelics = this.collectibleDefs.length;
    if (s.inventory.length >= totalRelics && s.questStage === 'gather') {
      gameState.setQuestStage('return');
      this.refreshObjective();
      this.showToast('All relics gathered! Return to María Clara.');
    }
  }

  private onInteract() {
    if (this.dialogBox.visible) {
      // advance dialog
      if (this.typing) {
        // skip typing -> show full line
        this.typing = false;
        if (this.typeTimer) this.typeTimer.remove();
        this.dialogText.setText(this.fullLine);
        this.shownChars = this.fullLine.length;
        return;
      }
      // next line or close
      if (this.dialogQueue.length > 0) {
        this.startLine(this.dialogQueue.shift()!);
      } else {
        this.closeDialog();
      }
      return;
    }
    // open dialog with nearest NPC
    if (this.activeNpc) {
      const def = this.npcDefs.find(n => n.key === this.activeNpc!.key) as NpcDefQuest | undefined;
      // pick dialogue based on quest stage
      const stage = gameState.get().questStage;
      let lines = def?.lines ?? [];
      if (def?.questLines && def.questLines[stage] && def.questLines[stage]!.length > 0) {
        lines = def.questLines[stage]!;
      }
      this.dialogQueue = [...lines];
      this.dialogName.setText(this.activeNpc.name);
      this.dialogName.setColor(this.activeNpc.color);
      this.dialogBox.setVisible(true);
      this.startLine(this.dialogQueue.shift()!);
      this.interacted.add(this.activeNpc.key);
      gameState.markSpoken(this.activeNpc.key);

      // NPC gives item (Elías, Tiago, Sisa) during gather stage
      if (def?.givesItem && def.givesItem.stage === stage && !gameState.hasItem(def.givesItem.item)) {
        // grant after dialog closes
        this.once('dialogclosed', () => {
          gameState.addItem(def.givesItem!.item);
          const meta = ITEM_DEFS.find(m => m.id === def.givesItem!.item);
          this.showToast(`Received: ${meta?.name ?? def.givesItem!.item}`);
          this.refreshObjective();
          this.checkQuestProgress();
        });
      }

      // Clara completes the quest when player returns with all relics
      if (this.activeNpc.key === 'clara' && stage === 'return') {
        gameState.setQuestStage('complete');
        this.once('dialogclosed', () => {
          this.refreshObjective();
          this.showToast('Chapter complete — San Diego remembers.');
        });
      }

      this.refreshObjective();
    }
  }

  private closeDialog() {
    this.dialogBox.setVisible(false);
    this.dialogQueue = [];
    this.typing = false;
    if (this.typeTimer) this.typeTimer.remove();
    this.emit('dialogclosed');
    this.removeAllListeners('dialogclosed');
  }

  private setObjective(text: string) {
    if (this.hudObjective) this.hudObjective.setText(`◆ ${text}`);
  }

  // ── public API for React ──
  resetGame() {
    gameState.reset();
    this.scene.restart();
  }

  private currentAnim = '';
  private ensureAnim(name: string) {
    const key = `${this.playerCharKey}_${name}`;
    if (this.currentAnim === key) return;
    if (this.anims.exists(key)) {
      this.player.play(key, true);
      this.currentAnim = key;
    }
  }

  // ── public API for React ──
  setPlayerChar(key: string) {
    if (!CHARACTER_SHEETS.includes(key)) return;
    this.playerCharKey = key;
    this.registry.set('playerChar', key);
    gameState.setPlayerChar(key);
    const frame = `${key}_idle_0`;
    this.player.setTexture(key, frame);
    this.player.setSize(10, 8);
    this.player.setOffset(this.player.width / 2 - 5, this.player.height - 8);
    this.hudName?.setText(this.displayName(key));
    this.currentAnim = '';
    this.ensureAnim('idle');
  }

  private displayName(key: string): string {
    const names: Record<string, string> = {
      rizal: 'Ibarra', ibara: 'Ibarra', clara: 'Clara', damaso: 'Dámaso',
      simoun: 'Simoun', salve: 'Salvi', elias: 'Elías', sisa: 'Sisa',
      basilio: 'Basilio', tiago: 'Tiago',
      'student-npc': 'Student', 'villager-npc': 'Villager',
      'religious-npc': 'Friar', 'spanish-npc': 'Spaniard',
      'misc-npc': 'Townsfolk', 'animals-assets': 'Beast',
    };
    return names[key] ?? key;
  }
}
