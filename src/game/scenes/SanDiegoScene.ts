import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE } from '../config';

// ─── MAP DATA ────────────────────────────────────────────────────────
// 0=grass, 1=path, 2=water, 3=wall, 4=tree, 5=door, 6=fence, 7=bridge, 8=stone, 9=flower
const MAP_W = 40;
const MAP_H = 30;

const MAP_DATA: number[][] = [
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,4,0,0,0,3,3,3,3,3,3,3,3,3,4,4,0,0,0,0,3,3,3,3,3,3,3,0,0,0,4,4,4,4,4],
  [4,4,4,4,4,0,0,0,0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,4,4,4,4],
  [4,4,4,0,0,0,0,0,0,0,3,3,5,3,3,5,3,3,3,0,0,0,9,0,0,3,3,3,5,3,3,3,0,0,0,0,0,4,4,4],
  [4,4,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0,0,4,4],
  [4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,4],
  [4,4,0,0,0,0,0,1,1,8,8,8,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,8,8,8,1,1,1,0,0,0,0,4,4,4],
  [4,4,0,0,0,0,0,1,1,8,8,8,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,8,8,8,1,1,1,0,0,0,0,4,4,4],
  [4,4,0,0,9,0,0,1,1,8,8,8,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,8,8,8,1,1,1,0,0,9,0,0,4,4],
  [4,4,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,4,4],
  [4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,4],
  [6,6,6,6,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,6,6,6,6],
  [4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,4],
  [4,0,0,0,9,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,9,0,0,0,4],
  [4,4,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,4,4,4],
  [4,4,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,4,4,4],
  [4,4,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,4,4,4],
  [4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,4],
  [4,4,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,4,4,4,4],
  [4,4,0,0,0,0,0,0,0,0,2,2,2,2,2,7,7,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,4,4,4,4,4],
  [4,4,4,0,0,0,0,0,0,0,2,2,2,2,2,7,7,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,4,4,4,4,4,4],
  [4,4,4,4,0,0,0,0,0,2,2,2,2,2,2,7,7,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,4,4,4,4,4,4,4],
  [4,4,4,4,4,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
];

// Tiles that block movement
const BLOCKED_TILES = new Set([2, 3, 4, 6]); // water, wall, tree, fence

// ─── DIALOGUE TYPES ──────────────────────────────────────────────────
interface DialogueLine {
  speaker: string;
  text: string;
  choices?: { label: string; value: string }[];
}

// ─── QUEST ITEM DEFINITIONS ──────────────────────────────────────────
interface QuestItem {
  key: string;
  label: string;
  tileX: number;
  tileY: number;
  textureKey: string;
  description: string;
}

const QUEST_ITEMS: QuestItem[] = [
  {
    key: 'estate_ledger',
    label: 'Estate Ledger',
    tileX: 10,
    tileY: 3,
    textureKey: 'item_book',
    description: "Don Rafael's estate ledger — shows he funded the school and paid parish taxes in full.",
  },
  {
    key: 'tax_records',
    label: 'Tax Records',
    tileX: 30,
    tileY: 9,
    textureKey: 'item_scroll',
    description: 'Tax records confirm Don Rafael was one of the largest contributors to the town.',
  },
  {
    key: 'witness_letter',
    label: 'Witness Letter',
    tileX: 15,
    tileY: 20,
    textureKey: 'item_letter',
    description: "A witness affidavit — Padre Dámaso publicly denounced Don Rafael before any trial.",
  },
];

// ─── NPC DEFINITION ──────────────────────────────────────────────────
interface NPCDef {
  key: string;
  name: string;
  tileX: number;
  tileY: number;
  spriteKey: string;  // Texture key for the NPC sprite
  facing: 'down' | 'up' | 'left' | 'right';
}

// ─── GAME PHASE ──────────────────────────────────────────────────────
type GamePhase = 'intro' | 'explore' | 'dialogue' | 'quest_active' | 'chapter_end';

export class SanDiegoScene extends Phaser.Scene {
  // Map
  private mapTiles: Phaser.GameObjects.Image[][] = [];
  private collisionMap: boolean[][] = [];

  // Player
  private player!: Phaser.GameObjects.Container;
  private playerSprite!: Phaser.GameObjects.Image;
  private playerDir: 'down' | 'up' | 'left' | 'right' = 'down';
  private playerSpeed = 120;
  private isMoving = false;
  private walkFrame = 0;
  private walkTimer = 0;

  // NPCs
  private npcSprites: Map<string, Phaser.GameObjects.Container> = new Map();
  private npcs: NPCDef[] = [];

  // Quest items
  private questItemSprites: Map<string, Phaser.GameObjects.Container> = new Map();
  private collectedItems = new Set<string>();

  // Game state
  private phase: GamePhase = 'intro';
  private currentObjective = '';

  // Dialogue
  private dialogueContainer?: Phaser.GameObjects.Container;
  private dialogueLines: DialogueLine[] = [];
  private dialogueIndex = 0;
  private dialogueText?: Phaser.GameObjects.Text;
  private dialogueSpeaker?: Phaser.GameObjects.Text;
  private dialoguePrompt?: Phaser.GameObjects.Text;
  private textTimer?: Phaser.Time.TimerEvent;
  private displayedText = '';
  private fullText = '';
  private charIndex = 0;
  private isTyping = false;
  private currentDialogueNpcKey = '';

  // HUD
  private objectiveText?: Phaser.GameObjects.Text;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private interactKey!: Phaser.Input.Keyboard.Key;

  // Quest flow
  private talkedToMangTenyo = false;
  private questAccepted = false;
  private allItemsCollected = false;
  private returnedToMangTenyo = false;
  private nearNpcKey = '';

  // Interact indicator
  private interactBubble?: Phaser.GameObjects.Container;

  constructor() {
    super('SanDiegoScene');
  }

  create() {
    this.buildMap();
    this.buildCollisionMap();
    this.createPlayer();
    this.setupNPCs();
    this.createNPCs();
    this.setupCamera();
    this.createHUD();
    this.createDialogueSystem();
    this.createInteractBubble();

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Start intro
    this.startIntro();
  }

  update(_time: number, delta: number) {
    if (this.phase === 'dialogue') {
      this.handleDialogueInput();
      return;
    }

    if (this.phase === 'chapter_end' || this.phase === 'intro') {
      return;
    }

    this.handlePlayerMovement(delta);
    this.checkNPCProximity();
    this.checkItemCollection();
  }

  // ────────────────────────────────────────────────────────────────
  // MAP
  // ────────────────────────────────────────────────────────────────

  private buildMap() {
    const tileKeys: Record<number, string> = {
      0: 'tile_grass',
      1: 'tile_path',
      2: 'tile_water_wave',
      3: 'tile_wall',
      4: 'tile_tree_base',
      5: 'tile_door',
      6: 'tile_fence',
      7: 'tile_bridge',
      8: 'tile_stone',
      9: 'tile_flower',
    };

    for (let y = 0; y < MAP_H; y++) {
      this.mapTiles[y] = [];
      for (let x = 0; x < MAP_W; x++) {
        const tileType = MAP_DATA[y][x];
        const tileKey = tileKeys[tileType] || 'tile_grass';
        const tile = this.add.image(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, tileKey);
        tile.setOrigin(0.5);
        this.mapTiles[y][x] = tile;

        // Add tree tops on top of tree bases
        if (tileType === 4) {
          const treeTop = this.add.image(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, 'tile_tree_top');
          treeTop.setOrigin(0.5);
          treeTop.setDepth(1);
        }
      }
    }

    // Building labels
    this.add.text(14 * TILE_SIZE, 2.5 * TILE_SIZE, 'CHURCH', {
      fontFamily: 'monospace', fontSize: '7px', color: '#f8f8f8', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(10);

    this.add.text(28 * TILE_SIZE, 2.5 * TILE_SIZE, 'LIBRARY', {
      fontFamily: 'monospace', fontSize: '7px', color: '#f8f8f8', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(10);

    this.add.text(20 * TILE_SIZE, 8 * TILE_SIZE, 'PLAZA', {
      fontFamily: 'monospace', fontSize: '6px', color: '#888888',
    }).setOrigin(0.5).setDepth(10);

    this.add.text(19 * TILE_SIZE, 25 * TILE_SIZE, '~ RIVER ~', {
      fontFamily: 'monospace', fontSize: '6px', color: '#88bbff',
    }).setOrigin(0.5).setDepth(10);

    // Door indicators
    const doors = [[12, 3], [15, 3], [28, 3]]; // Church door, Church door 2, Library door
    for (const [dx, dy] of doors) {
      this.add.text(dx * TILE_SIZE + TILE_SIZE / 2, dy * TILE_SIZE + TILE_SIZE - 4, '▲', {
        fontFamily: 'monospace', fontSize: '8px', color: '#ffd60a',
      }).setOrigin(0.5).setDepth(10);
    }
  }

  private buildCollisionMap() {
    for (let y = 0; y < MAP_H; y++) {
      this.collisionMap[y] = [];
      for (let x = 0; x < MAP_W; x++) {
        this.collisionMap[y][x] = BLOCKED_TILES.has(MAP_DATA[y][x]);
      }
    }
  }

  // ────────────────────────────────────────────────────────────────
  // PLAYER
  // ────────────────────────────────────────────────────────────────

  private createPlayer() {
    const startTileX = 20;
    const startTileY = 12;

    const spriteKey = this.textures.exists('player_idle_0') ? 'player_idle_0' : 'npc_placeholder';
    this.playerSprite = this.add.image(0, 0, spriteKey);
    this.playerSprite.setScale(0.55);
    this.playerSprite.setOrigin(0.5, 0.7);

    this.player = this.add.container(
      startTileX * TILE_SIZE + TILE_SIZE / 2,
      startTileY * TILE_SIZE + TILE_SIZE / 2,
      [this.playerSprite]
    );
    this.player.setDepth(5);
  }

  private handlePlayerMovement(delta: number) {
    let dx = 0;
    let dy = 0;

    if (this.cursors.left?.isDown) {
      dx = -1;
      this.playerDir = 'left';
    } else if (this.cursors.right?.isDown) {
      dx = 1;
      this.playerDir = 'right';
    }

    if (this.cursors.up?.isDown) {
      dy = -1;
      this.playerDir = 'up';
    } else if (this.cursors.down?.isDown) {
      dy = 1;
      this.playerDir = 'down';
    }

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    const isMovingNow = dx !== 0 || dy !== 0;

    if (isMovingNow) {
      const moveX = dx * this.playerSpeed * (delta / 1000);
      const moveY = dy * this.playerSpeed * (delta / 1000);
      const newX = this.player.x + moveX;
      const newY = this.player.y + moveY;

      // Check X movement
      const tileXNew = Math.floor(newX / TILE_SIZE);
      const tileYCur = Math.floor(this.player.y / TILE_SIZE);
      if (!this.isBlocked(tileXNew, tileYCur)) {
        this.player.x = newX;
      }

      // Check Y movement
      const tileXCur = Math.floor(this.player.x / TILE_SIZE);
      const tileYNew = Math.floor(newY / TILE_SIZE);
      if (!this.isBlocked(tileXCur, tileYNew)) {
        this.player.y = newY;
      }

      // Walk animation
      this.walkTimer += delta;
      if (this.walkTimer > 100) {
        this.walkTimer = 0;
        this.walkFrame = (this.walkFrame + 1) % 10;
        const frameKey = `player_walk_${this.walkFrame}`;
        if (this.textures.exists(frameKey)) {
          this.playerSprite.setTexture(frameKey);
        }
      }

      // Flip sprite for direction
      if (this.playerDir === 'left') {
        this.playerSprite.setFlipX(true);
      } else {
        this.playerSprite.setFlipX(false);
      }

      this.isMoving = true;
    } else {
      if (this.isMoving) {
        const idleKey = 'player_idle_0';
        if (this.textures.exists(idleKey)) {
          this.playerSprite.setTexture(idleKey);
        }
        this.isMoving = false;
        this.walkFrame = 0;
      }
    }

    // Y-sorting depth
    this.player.setDepth(5 + this.player.y / 1000);
  }

  private isBlocked(tileX: number, tileY: number): boolean {
    if (tileX < 0 || tileX >= MAP_W || tileY < 0 || tileY >= MAP_H) return true;
    return this.collisionMap[tileY][tileX];
  }

  // ────────────────────────────────────────────────────────────────
  // NPCs
  // ────────────────────────────────────────────────────────────────

  private setupNPCs() {
    this.npcs = [
      {
        key: 'mang_tenyo',
        name: 'Mang Tenyo',
        tileX: 14,
        tileY: 9,
        spriteKey: 'npc_misc_idle_0',
        facing: 'down',
      },
      {
        key: 'guevara',
        name: 'Lt. Guevara',
        tileX: 10,
        tileY: 8,
        spriteKey: 'npc_spanish_idle_0',
        facing: 'right',
      },
      {
        key: 'old_woman',
        name: 'Old Woman',
        tileX: 7,
        tileY: 16,
        spriteKey: 'npc_villager_idle_0',
        facing: 'right',
      },
      {
        key: 'vendor',
        name: 'Vendor',
        tileX: 25,
        tileY: 11,
        spriteKey: 'npc_religious_idle_0',
        facing: 'left',
      },
    ];
  }

  private createNPCs() {
    for (const npcDef of this.npcs) {
      const spriteKey = this.textures.exists(npcDef.spriteKey) ? npcDef.spriteKey : 'npc_placeholder';
      const npcSprite = this.add.image(0, 0, spriteKey);
      npcSprite.setScale(0.5);
      npcSprite.setOrigin(0.5, 0.7);

      if (npcDef.facing === 'left') {
        npcSprite.setFlipX(true);
      }

      // NPC name label
      const nameLabel = this.add.text(0, -20, npcDef.name, {
        fontFamily: 'monospace',
        fontSize: '5px',
        color: '#f8f8f8',
        backgroundColor: '#000000aa',
        padding: { x: 2, y: 1 },
      }).setOrigin(0.5);

      const container = this.add.container(
        npcDef.tileX * TILE_SIZE + TILE_SIZE / 2,
        npcDef.tileY * TILE_SIZE + TILE_SIZE / 2,
        [npcSprite, nameLabel]
      );
      container.setDepth(5 + container.y / 1000);
      container.setSize(TILE_SIZE, TILE_SIZE);

      this.npcSprites.set(npcDef.key, container);

      // Mark NPC tile as blocked
      this.collisionMap[npcDef.tileY][npcDef.tileX] = true;
    }
  }

  private checkNPCProximity() {
    const playerTileX = Math.floor(this.player.x / TILE_SIZE);
    const playerTileY = Math.floor(this.player.y / TILE_SIZE);

    let closestNpc = '';
    let closestDist = Infinity;

    for (const npcDef of this.npcs) {
      const dist = Math.abs(playerTileX - npcDef.tileX) + Math.abs(playerTileY - npcDef.tileY);
      if (dist <= 2 && dist < closestDist) {
        closestDist = dist;
        closestNpc = npcDef.key;
      }
    }

    this.nearNpcKey = closestNpc;

    // Show/hide interact bubble
    if (closestNpc && this.interactBubble) {
      const npcContainer = this.npcSprites.get(closestNpc);
      if (npcContainer) {
        this.interactBubble.setPosition(npcContainer.x, npcContainer.y - 30);
        this.interactBubble.setVisible(true);
      }
    } else {
      this.interactBubble?.setVisible(false);
    }

    // Interact on Z key
    if (closestNpc && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.interactWithNPC(closestNpc);
    }
  }

  private interactWithNPC(npcKey: string) {
    if (this.phase === 'dialogue') return;

    const npcDef = this.npcs.find(n => n.key === npcKey);
    if (!npcDef) return;

    let lines: DialogueLine[] = [];

    if (npcKey === 'mang_tenyo') {
      if (!this.talkedToMangTenyo) {
        lines = [
          {
            speaker: 'Mang Tenyo',
            text: "You're not from around here, iho. Best not to mention the Ibarra name too loudly tonight.",
          },
          {
            speaker: 'Mang Tenyo',
            text: "Something happened at the reception. Padre Dámaso spoke against your father's name in front of everyone.",
          },
          {
            speaker: 'Mang Tenyo',
            text: "If you want to clear Don Rafael's name, you need evidence. Look around the town for records.",
          },
          {
            speaker: 'Mang Tenyo',
            text: "Find the Estate Ledger, the Tax Records, and a Witness Letter. Bring them back to me.",
          },
        ];
      } else if (this.questAccepted && !this.allItemsCollected) {
        const remaining = QUEST_ITEMS.filter(i => !this.collectedItems.has(i.key));
        lines = [
          {
            speaker: 'Mang Tenyo',
            text: `Still looking? You need: ${remaining.map(i => i.label).join(', ')}.`,
          },
        ];
      } else if (this.allItemsCollected && !this.returnedToMangTenyo) {
        lines = [
          {
            speaker: 'Mang Tenyo',
            text: "You found everything! The Estate Ledger, the Tax Records, and the Witness Letter...",
          },
          {
            speaker: 'Mang Tenyo',
            text: "This is proof that Don Rafael was falsely accused. The truth of San Diego must be known.",
          },
          {
            speaker: 'Mang Tenyo',
            text: "You've done well, Ibarra. Your father would be proud.",
          },
        ];
      } else {
        lines = [
          {
            speaker: 'Mang Tenyo',
            text: "The truth will set San Diego free, iho.",
          },
        ];
      }
    } else if (npcKey === 'guevara') {
      lines = [
        {
          speaker: 'Lt. Guevara',
          text: "Ibarra... you should know the truth about your father. Dámaso slandered him before the whole town.",
        },
        {
          speaker: 'Lt. Guevara',
          text: "Don Rafael was arrested on charges of heresy. He died in that cell. They wouldn't even let him rest in consecrated ground.",
        },
      ];
    } else if (npcKey === 'old_woman') {
      lines = [
        {
          speaker: 'Old Woman',
          text: "The river remembers everything, child. Even the things we try to forget.",
        },
      ];
    } else if (npcKey === 'vendor') {
      lines = [
        {
          speaker: 'Vendor',
          text: "Fresh produce! Though business has been slow since the Guardia Civil started patrolling...",
        },
      ];
    }

    if (lines.length > 0) {
      this.currentDialogueNpcKey = npcKey;
      this.showDialogue(lines);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // QUEST ITEMS
  // ────────────────────────────────────────────────────────────────

  private spawnQuestItems() {
    for (const item of QUEST_ITEMS) {
      const textureKey = this.textures.exists(item.textureKey) ? item.textureKey : 'item_placeholder';
      const itemSprite = this.add.image(0, -4, textureKey);
      itemSprite.setScale(0.3);
      itemSprite.setOrigin(0.5);

      // Glow effect
      const glow = this.add.circle(0, -4, 12, 0xffd60a, 0.15);

      // Pulsing animation
      this.tweens.add({
        targets: [itemSprite, glow],
        scaleX: itemSprite.scaleX * 1.15,
        scaleY: itemSprite.scaleY * 1.15,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // Item label
      const label = this.add.text(0, 8, item.label, {
        fontFamily: 'monospace',
        fontSize: '5px',
        color: '#ffd60a',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      const container = this.add.container(
        item.tileX * TILE_SIZE + TILE_SIZE / 2,
        item.tileY * TILE_SIZE + TILE_SIZE / 2,
        [glow, itemSprite, label]
      );
      container.setDepth(6);

      this.questItemSprites.set(item.key, container);
    }
  }

  private checkItemCollection() {
    if (this.phase !== 'quest_active') return;
    if (this.phase === 'dialogue') return;

    const playerTileX = Math.floor(this.player.x / TILE_SIZE);
    const playerTileY = Math.floor(this.player.y / TILE_SIZE);

    for (const item of QUEST_ITEMS) {
      if (this.collectedItems.has(item.key)) continue;

      const dist = Math.abs(playerTileX - item.tileX) + Math.abs(playerTileY - item.tileY);
      if (dist <= 1) {
        this.collectItem(item);
        return; // Only collect one item per frame
      }
    }
  }

  private collectItem(item: QuestItem) {
    this.collectedItems.add(item.key);

    // Remove item sprite with pickup effect
    const sprite = this.questItemSprites.get(item.key);
    if (sprite) {
      this.tweens.add({
        targets: sprite,
        y: sprite.y - 20,
        alpha: 0,
        scaleX: 0.5,
        scaleY: 0.5,
        duration: 400,
        ease: 'Back.easeIn',
        onComplete: () => sprite.destroy(),
      });
    }

    // Show item description as dialogue
    this.showDialogue([
      {
        speaker: item.label,
        text: item.description,
      },
    ]);

    // Check if all items collected
    if (this.collectedItems.size >= QUEST_ITEMS.length) {
      this.allItemsCollected = true;
      // setObjective will be called after dialogue ends
    } else {
      const remaining = QUEST_ITEMS.length - this.collectedItems.size;
      this.setObjective(`Find evidence (${remaining} remaining)`);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // CAMERA
  // ────────────────────────────────────────────────────────────────

  private setupCamera() {
    this.cameras.main.setBounds(0, 0, MAP_W * TILE_SIZE, MAP_H * TILE_SIZE);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  // ────────────────────────────────────────────────────────────────
  // HUD (minimal - just objective)
  // ────────────────────────────────────────────────────────────────

  private createHUD() {
    // Small objective bar at top center
    const bg = this.add.rectangle(GAME_WIDTH / 2, 10, 0, 14, 0x000000, 0.5)
      .setScrollFactor(0)
      .setDepth(100);

    this.objectiveText = this.add.text(GAME_WIDTH / 2, 10, '', {
      fontFamily: 'monospace',
      fontSize: '6px',
      color: '#f8f8f8',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

    // Store bg ref for resizing
    this.events.on('update', () => {
      if (this.objectiveText) {
        const text = this.objectiveText.text;
        bg.width = text.length * 4 + 16;
      }
    });
  }

  private setObjective(text: string) {
    this.currentObjective = text;
    if (this.objectiveText) {
      this.objectiveText.setText(text);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // INTERACT BUBBLE
  // ────────────────────────────────────────────────────────────────

  private createInteractBubble() {
    const bubble = this.add.text(0, 0, 'Z', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#ffd60a',
      backgroundColor: '#000000cc',
      padding: { x: 3, y: 2 },
    }).setOrigin(0.5).setDepth(50).setVisible(false);

    // Blink
    this.tweens.add({
      targets: bubble,
      alpha: 0.3,
      duration: 400,
      yoyo: true,
      repeat: -1,
    });

    this.interactBubble = this.add.container(0, 0, [bubble]);
    this.interactBubble.setDepth(50).setVisible(false);
  }

  // ────────────────────────────────────────────────────────────────
  // DIALOGUE SYSTEM (Pokémon-style)
  // ────────────────────────────────────────────────────────────────

  private createDialogueSystem() {
    const boxW = GAME_WIDTH - 8;
    const boxH = 56;
    const boxX = GAME_WIDTH / 2;
    const boxY = GAME_HEIGHT - boxH / 2 - 4;

    // White box with black border
    const border = this.add.rectangle(boxX, boxY, boxW + 4, boxH + 4, 0x000000)
      .setScrollFactor(0).setDepth(200);
    const bg = this.add.rectangle(boxX, boxY, boxW, boxH, 0xf8f8f8)
      .setScrollFactor(0).setDepth(201);

    // Speaker name
    this.dialogueSpeaker = this.add.text(boxX - boxW / 2 + 8, boxY - boxH / 2 + 4, '', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#f8f8f8',
      backgroundColor: '#333333',
      padding: { x: 3, y: 1 },
    }).setScrollFactor(0).setDepth(202);

    // Dialogue text
    this.dialogueText = this.add.text(boxX - boxW / 2 + 8, boxY - boxH / 2 + 16, '', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#222222',
      wordWrap: { width: boxW - 20 },
      lineSpacing: 2,
    }).setScrollFactor(0).setDepth(202);

    // Continue prompt
    this.dialoguePrompt = this.add.text(boxX + boxW / 2 - 12, boxY + boxH / 2 - 10, '▼', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#333333',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(203);

    // Blink the prompt
    this.tweens.add({
      targets: this.dialoguePrompt,
      alpha: 0.2,
      duration: 400,
      yoyo: true,
      repeat: -1,
    });

    this.dialogueContainer = this.add.container(0, 0, [border, bg, this.dialogueSpeaker, this.dialogueText, this.dialoguePrompt]);
    this.dialogueContainer.setDepth(200).setVisible(false);
  }

  private showDialogue(lines: DialogueLine[]) {
    this.dialogueLines = lines;
    this.dialogueIndex = 0;
    this.phase = 'dialogue';

    this.dialogueContainer?.setVisible(true);
    this.dialoguePrompt?.setVisible(false);

    this.displayLine();
  }

  private displayLine() {
    if (this.dialogueIndex >= this.dialogueLines.length) {
      this.hideDialogue();
      return;
    }

    const line = this.dialogueLines[this.dialogueIndex];

    if (this.dialogueSpeaker) {
      this.dialogueSpeaker.setText(line.speaker);
    }

    // Typewriter effect
    this.fullText = line.text;
    this.displayedText = '';
    this.charIndex = 0;
    this.isTyping = true;

    if (this.dialogueText) {
      this.dialogueText.setText('');
    }

    this.dialoguePrompt?.setVisible(false);

    if (this.textTimer) {
      this.textTimer.remove();
    }

    this.textTimer = this.time.addEvent({
      delay: 22,
      callback: () => {
        if (this.charIndex < this.fullText.length) {
          this.displayedText += this.fullText[this.charIndex];
          this.charIndex++;
          if (this.dialogueText) {
            this.dialogueText.setText(this.displayedText);
          }
        } else {
          this.isTyping = false;
          this.textTimer?.remove();
          this.onLineComplete();
        }
      },
      loop: true,
    });
  }

  private onLineComplete() {
    const line = this.dialogueLines[this.dialogueIndex];

    if (line.choices && line.choices.length > 0) {
      // Auto-accept for vertical slice
      this.time.delayedCall(300, () => {
        this.handleDialogueChoice(line.choices![0].value);
      });
    } else {
      this.dialoguePrompt?.setVisible(true);
    }
  }

  private handleDialogueChoice(value: string) {
    if (value === 'accept') {
      this.talkedToMangTenyo = true;
      this.questAccepted = true;
      this.phase = 'quest_active';
      this.setObjective('Find evidence (3 remaining)');
      this.spawnQuestItems();
      this.hideDialogue();
    } else if (value === 'more') {
      this.dialogueLines = [
        {
          speaker: 'Mang Tenyo',
          text: "Don Rafael was accused of heresy. The Estate Ledger shows his financial records, the Tax Records prove he paid everything, and a Witness Letter confirms Dámaso's slander.",
        },
        {
          speaker: 'Mang Tenyo',
          text: "Find the Estate Ledger, the Tax Records, and a Witness Letter. Bring them back to me.",
          choices: [{ label: "I'll do it", value: 'accept' }],
        },
      ];
      this.dialogueIndex = 0;
      this.displayLine();
    }
  }

  private handleDialogueInput() {
    const pressed = Phaser.Input.Keyboard.JustDown(this.interactKey) ||
      Phaser.Input.Keyboard.JustDown(this.cursors?.space as Phaser.Input.Keyboard.Key) ||
      Phaser.Input.Keyboard.JustDown(this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER));

    if (!pressed) return;

    if (this.isTyping) {
      // Skip to end of line
      this.isTyping = false;
      this.textTimer?.remove();
      this.displayedText = this.fullText;
      if (this.dialogueText) {
        this.dialogueText.setText(this.displayedText);
      }
      this.onLineComplete();
    } else {
      // Next line
      this.dialogueIndex++;
      if (this.dialogueIndex >= this.dialogueLines.length) {
        this.hideDialogue();
      } else {
        this.displayLine();
      }
    }
  }

  private hideDialogue() {
    this.dialogueContainer?.setVisible(false);
    this.isTyping = false;
    this.textTimer?.remove();

    // Handle post-dialogue state
    if (this.allItemsCollected && !this.returnedToMangTenyo && this.currentDialogueNpcKey === 'mang_tenyo') {
      this.returnedToMangTenyo = true;
      this.phase = 'chapter_end';
      this.setObjective('Chapter 1 Complete!');
      this.startChapterEnd();
      return;
    }

    if (this.allItemsCollected && this.phase !== 'chapter_end') {
      this.setObjective('Return to Mang Tenyo');
    }

    if (this.phase === 'dialogue') {
      this.phase = this.questAccepted ? 'quest_active' : 'explore';
    }
  }

  // ────────────────────────────────────────────────────────────────
  // INTRO
  // ────────────────────────────────────────────────────────────────

  private startIntro() {
    this.phase = 'intro';

    const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85)
      .setScrollFactor(0)
      .setDepth(50);

    const introText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, '', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#f8f8f8',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 60 },
      lineSpacing: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(51);

    const fullIntroText = [
      "San Diego, 1887",
      "",
      "A young man returns to his hometown",
      "after seven years in Europe.",
      "",
      "His name is Crisóstomo Ibarra.",
      "",
      "He does not yet know what awaits him.",
    ].join('\n');

    let charIdx = 0;

    const typeTimer = this.time.addEvent({
      delay: 35,
      callback: () => {
        if (charIdx < fullIntroText.length) {
          charIdx++;
          introText.setText(fullIntroText.substring(0, charIdx));
        } else {
          typeTimer.remove();
          this.time.delayedCall(2000, () => {
            this.tweens.add({
              targets: [overlay, introText],
              alpha: 0,
              duration: 800,
              onComplete: () => {
                overlay.destroy();
                introText.destroy();
                this.phase = 'explore';
                this.setObjective('Talk to Mang Tenyo');
                this.showLocationText('San Diego — Town Plaza');
              },
            });
          });
        }
      },
      loop: true,
    });

    // Skip intro with any key
    const skipHandler = () => {
      if (this.phase === 'intro') {
        typeTimer.remove();
        if (overlay.active) overlay.destroy();
        if (introText.active) introText.destroy();
        this.phase = 'explore';
        this.setObjective('Talk to Mang Tenyo');
        this.showLocationText('San Diego — Town Plaza');
      }
    };

    this.input.keyboard!.on('keydown-ENTER', skipHandler);
    this.input.keyboard!.on('keydown-SPACE', skipHandler);
    this.input.keyboard!.on('keydown-Z', skipHandler);
  }

  private showLocationText(text: string) {
    const locText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, text, {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#f8f8f8',
      fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(50).setAlpha(0);

    this.tweens.add({
      targets: locText,
      alpha: 1,
      duration: 500,
      hold: 1500,
      yoyo: true,
      onComplete: () => locText.destroy(),
    });
  }

  // ────────────────────────────────────────────────────────────────
  // CHAPTER END
  // ────────────────────────────────────────────────────────────────

  private startChapterEnd() {
    this.time.delayedCall(1000, () => {
      this.cameras.main.fadeOut(2000, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000)
          .setScrollFactor(0).setDepth(300);
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 'CHAPTER 1', {
          fontFamily: 'monospace', fontSize: '16px', color: '#ffd60a', fontStyle: 'bold',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(301);
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 5, 'COMPLETE', {
          fontFamily: 'monospace', fontSize: '11px', color: '#f8f8f8',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(301);
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, 'The truth of San Diego will be known.', {
          fontFamily: 'monospace', fontSize: '6px', color: '#888888',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(301);
      });
    });
  }
}
