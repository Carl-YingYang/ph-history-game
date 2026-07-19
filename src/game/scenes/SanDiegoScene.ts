import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, CAMERA_ZOOM } from '../config';

// ─── MAP DATA ────────────────────────────────────────────────────────
// Tile types — each maps to a nature tile frame
// 0=grass, 1=path, 2=water, 3=wall, 4=tree, 5=door, 6=fence, 7=bridge, 8=stone, 9=flower
// 10=bush, 11=roof, 12=sign, 13=crate
const MAP_W = 50;
const MAP_H = 40;

const MAP_DATA: number[][] = [
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,11,3,3,3,3,3,3,3,3,3,11,0,0,0,4,4,0,0,0,0,11,3,3,3,3,3,3,3,11,0,0,0,4,4,4],
  [4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0,4,4,4],
  [4,4,4,4,4,0,0,0,0,9,0,0,0,0,0,3,3,5,3,3,5,3,3,5,3,3,0,0,0,9,0,0,0,0,3,3,3,5,3,3,3,5,3,0,0,0,0,0,4,4],
  [4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0,0,4,4,4],
  [4,4,0,0,0,0,10,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,10,0,0,0,1,1,1,1,1,1,1,1,1,0,0,10,0,4,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,9,0,0,0,0,1,1,8,8,8,1,1,1,1,1,1,1,1,8,1,0,0,0,9,0,0,0,1,1,8,8,8,1,1,1,1,1,0,0,0,0,4],
  [4,0,0,0,10,0,0,0,0,0,0,0,0,1,1,8,8,8,1,1,12,1,1,1,1,1,8,1,0,0,0,0,0,0,0,1,1,8,8,8,1,1,12,1,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,1,1,8,8,8,1,1,1,1,1,1,1,1,8,1,0,0,0,0,0,0,0,1,1,8,8,8,1,1,1,1,0,0,9,0,0,4],
  [4,0,0,9,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,4],
  [4,0,0,0,0,0,10,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,10,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,9,0,0,0,1,1,1,1,1,13,1,1,1,1,1,1,13,1,1,0,0,0,0,0,0,0,1,1,1,1,13,1,1,1,1,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,4,4],
  [6,6,6,6,6,6,6,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,6,6,6,6],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,4],
  [4,0,0,0,9,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,9,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,4],
  [4,0,0,0,0,0,10,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,4,4],
  [4,0,0,0,0,0,0,0,0,0,9,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,10,0,0,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,4,4,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,4,4,4],
  [4,0,0,0,9,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,9,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,4],
  [4,0,0,0,0,0,10,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,4,4],
  [4,0,0,0,0,0,0,0,9,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,4,4,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,4,4],
  [4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,2,7,7,2,2,0,0,4,4,4],
  [4,4,4,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,7,7,2,2,0,0,0,0,0,0,9,0,0,0,0,2,2,2,7,7,2,2,0,0,4,4,4],
  [4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,7,7,2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,2,7,7,2,2,0,4,4,4,4],
  [4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,4,4,4,4,4],
  [4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,4,4,4,4,4],
  [4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
];

// Tiles that block movement
const BLOCKED_TILES = new Set([2, 3, 4, 6, 10, 11, 12, 13]);

// ─── DIALOGUE ───────────────────────────────────────────────────────
interface DialogueLine {
  speaker: string;
  text: string;
  choices?: { label: string; value: string }[];
}

// ─── QUEST ITEMS ────────────────────────────────────────────────────
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
    tileX: 16,
    tileY: 3,
    textureKey: 'item_book',
    description: "Don Rafael's estate ledger — shows he funded the school and paid parish taxes in full.",
  },
  {
    key: 'tax_records',
    label: 'Tax Records',
    tileX: 38,
    tileY: 9,
    textureKey: 'item_scroll',
    description: 'Tax records confirm Don Rafael was one of the largest contributors to the town.',
  },
  {
    key: 'witness_letter',
    label: 'Witness Letter',
    tileX: 22,
    tileY: 30,
    textureKey: 'item_letter',
    description: "A witness affidavit — Padre Dámaso publicly denounced Don Rafael before any trial.",
  },
];

// ─── NPC DEFINITION ─────────────────────────────────────────────────
interface NPCDef {
  key: string;
  name: string;
  tileX: number;
  tileY: number;
  charKey: string;   // e.g. 'misc-npc' → loads ibarra_idle anim
  facing: 'down' | 'up' | 'left' | 'right';
}

// ─── GAME PHASE ─────────────────────────────────────────────────────
type GamePhase = 'intro' | 'explore' | 'dialogue' | 'quest_active' | 'chapter_end';

// ─── SPRITE SCALE ───────────────────────────────────────────────────
// Character frames are ~48px tall at native. At TILE_SIZE=16, a 48px sprite
// needs scale ~0.5 to fit roughly 1 tile width, but for Pokémon feel we want
// them larger. Scale 0.6 makes ~29px tall — good for 16px tiles.
const SPRITE_SCALE = 0.6;
const ITEM_SCALE = 0.15; // items are 96px → ~14px

export class SanDiegoScene extends Phaser.Scene {
  // Map
  private mapGroup!: Phaser.GameObjects.Group;
  private collisionMap: boolean[][] = [];
  private treeTops: Phaser.GameObjects.Image[] = [];

  // Player
  private player!: Phaser.GameObjects.Container;
  private playerSprite!: Phaser.GameObjects.Image;
  private playerDir: 'down' | 'up' | 'left' | 'right' = 'down';
  private playerSpeed = 60;
  private isMoving = false;
  private currentAnim = '';

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
  private objectiveBg?: Phaser.GameObjects.Rectangle;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private enterKey!: Phaser.Input.Keyboard.Key;

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
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.startIntro();
  }

  update(_time: number, delta: number) {
    if (this.phase === 'dialogue') {
      this.handleDialogueInput();
      return;
    }
    if (this.phase === 'chapter_end' || this.phase === 'intro') return;

    this.handlePlayerMovement(delta);
    this.checkNPCProximity();
    this.checkItemCollection();
  }

  // ────────────────────────────────────────────────────────────────
  // MAP — Built from nature tile frames, NOT placeholder graphics
  // ────────────────────────────────────────────────────────────────

  private buildMap() {
    this.mapGroup = this.add.group();

    // Color map for tile rendering — each tile type gets a colored rectangle
    // with nature tile images placed where available
    const tileColorMap: Record<number, number> = {
      0: 0x2d5a27,   // grass — green
      1: 0xc4a35a,   // path — sandy
      2: 0x2a6ab5,   // water — blue
      3: 0x8b7355,   // wall — adobe
      4: 0x1a3a15,   // tree trunk — dark green
      5: 0x6b4226,   // door — dark wood
      6: 0x8b6914,   // fence — wooden
      7: 0x9c7c4a,   // bridge — plank
      8: 0x9a9a9a,   // stone — gray
      9: 0x2d5a27,   // flower grass — green (flower added on top)
      10: 0x1a5a15,  // bush — round green
      11: 0x8b2500,  // roof — red clay
      12: 0x8b6914,  // sign — wooden
      13: 0x8b6914,  // crate — wooden
    };

    // Nature tile image mapping — which nature_rN_fM to use for each tile type
    // Based on analysis: row 2 = trees, row 3 = bushes, row 4 = flowers, row 5 = rocks
    // row 6 = fences, row 7 = water, row 8 = paths, row 9 = walls, row 10 = bridges, row 11 = buildings
    const tileNatureMap: Record<number, { row: number; frame: number } | null> = {
      0: null,                        // grass — solid color
      1: { row: 8, frame: 0 },        // path — nature path tile
      2: { row: 7, frame: 0 },        // water
      3: { row: 9, frame: 0 },        // wall
      4: { row: 2, frame: 0 },        // tree
      5: { row: 9, frame: 3 },        // door
      6: { row: 6, frame: 0 },        // fence
      7: { row: 10, frame: 0 },       // bridge
      8: { row: 5, frame: 0 },        // stone
      9: { row: 4, frame: 0 },        // flower
      10: { row: 3, frame: 0 },       // bush
      11: { row: 11, frame: 0 },      // roof
      12: { row: 6, frame: 3 },       // sign
      13: { row: 6, frame: 5 },       // crate
    };

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const tileType = MAP_DATA[y]?.[x] ?? 4;
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        // Try to use nature tile image first
        const natureTile = tileNatureMap[tileType];
        let usedImage = false;

        if (natureTile) {
          const imgKey = `nature_${natureTile.row}_${natureTile.frame}`;
          if (this.textures.exists(imgKey)) {
            const img = this.add.image(px + TILE_SIZE / 2, py + TILE_SIZE / 2, imgKey);
            img.setDisplaySize(TILE_SIZE, TILE_SIZE);
            img.setOrigin(0.5);
            img.setDepth(y);
            usedImage = true;
          }
        }

        // Fallback to colored rectangle if no image
        if (!usedImage) {
          const color = tileColorMap[tileType] || 0x2d5a27;
          const rect = this.add.rectangle(px + TILE_SIZE / 2, py + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE, color);
          rect.setOrigin(0.5);
          rect.setDepth(y);
        }

        // Add tree top overlay for tree tiles
        if (tileType === 4) {
          const topKey = 'nature_2_1';
          if (this.textures.exists(topKey)) {
            const treeTop = this.add.image(px + TILE_SIZE / 2, py, topKey);
            treeTop.setDisplaySize(TILE_SIZE, TILE_SIZE);
            treeTop.setOrigin(0.5, 1);
            treeTop.setDepth(y * 100 + 50);
            this.treeTops.push(treeTop);
          }
        }

        // Add flower dots on flower tiles
        if (tileType === 9) {
          // Small colored dots on grass
          const flowerKey = 'nature_4_1';
          if (this.textures.exists(flowerKey)) {
            const flower = this.add.image(px + TILE_SIZE / 2, py + TILE_SIZE / 2, flowerKey);
            flower.setDisplaySize(TILE_SIZE * 0.6, TILE_SIZE * 0.6);
            flower.setOrigin(0.5);
            flower.setDepth(y + 1);
          }
        }
      }
    }

    // Building labels
    this.add.text(19 * TILE_SIZE, 1 * TILE_SIZE, 'CHURCH', {
      fontFamily: 'monospace', fontSize: '4px', color: '#f8f8f8', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(10);

    this.add.text(40 * TILE_SIZE, 1 * TILE_SIZE, 'LIBRARY', {
      fontFamily: 'monospace', fontSize: '4px', color: '#f8f8f8', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(10);

    this.add.text(26 * TILE_SIZE, 5 * TILE_SIZE, 'PLAZA', {
      fontFamily: 'monospace', fontSize: '3px', color: '#888888',
    }).setOrigin(0.5).setDepth(10);

    this.add.text(25 * TILE_SIZE, 27 * TILE_SIZE, '~ RIVER ~', {
      fontFamily: 'monospace', fontSize: '3px', color: '#88bbff',
    }).setOrigin(0.5).setDepth(10);

    // Sign labels
    this.add.text(20 * TILE_SIZE, 7 * TILE_SIZE, 'Church', {
      fontFamily: 'monospace', fontSize: '3px', color: '#c4a35a',
    }).setOrigin(0.5).setDepth(10);

    this.add.text(39 * TILE_SIZE, 7 * TILE_SIZE, 'Library', {
      fontFamily: 'monospace', fontSize: '3px', color: '#c4a35a',
    }).setOrigin(0.5).setDepth(10);
  }

  private buildCollisionMap() {
    for (let y = 0; y < MAP_H; y++) {
      this.collisionMap[y] = [];
      for (let x = 0; x < MAP_W; x++) {
        const tile = MAP_DATA[y]?.[x] ?? 4;
        this.collisionMap[y][x] = BLOCKED_TILES.has(tile);
      }
    }
  }

  // ────────────────────────────────────────────────────────────────
  // PLAYER — Uses ibarra sprite with Phaser animations
  // ────────────────────────────────────────────────────────────────

  private createPlayer() {
    const startTileX = 20;
    const startTileY = 15;

    // Use the first idle frame as default
    const defaultFrame = this.textures.exists('ibarra_idle_0') ? 'ibarra_idle_0' : 'ibarra_walk_0';
    this.playerSprite = this.add.image(0, 0, defaultFrame);
    this.playerSprite.setScale(SPRITE_SCALE);
    this.playerSprite.setOrigin(0.5, 0.85); // Feet anchor

    this.player = this.add.container(
      startTileX * TILE_SIZE + TILE_SIZE / 2,
      startTileY * TILE_SIZE + TILE_SIZE / 2,
      [this.playerSprite]
    );
    this.player.setDepth(5);

    // Play idle animation
    this.playAnim('ibarra_idle');
  }

  private playAnim(animKey: string) {
    if (this.currentAnim === animKey) return;
    if (!this.anims.exists(animKey)) return;

    this.currentAnim = animKey;
    this.playerSprite.play(animKey);
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

      // Collision check with feet offset
      const feetOffsetY = 4;
      const tileXNew = Math.floor(newX / TILE_SIZE);
      const tileYCur = Math.floor((this.player.y + feetOffsetY) / TILE_SIZE);
      if (!this.isBlocked(tileXNew, tileYCur)) {
        this.player.x = newX;
      }

      const tileXCur = Math.floor(this.player.x / TILE_SIZE);
      const tileYNew = Math.floor((newY + feetOffsetY) / TILE_SIZE);
      if (!this.isBlocked(tileXCur, tileYNew)) {
        this.player.y = newY;
      }

      // Play walk animation
      this.playAnim('ibarra_walk');

      // Flip sprite for direction
      this.playerSprite.setFlipX(this.playerDir === 'left');

      this.isMoving = true;
    } else {
      if (this.isMoving) {
        this.isMoving = false;
        this.playAnim('ibarra_idle');
      }

      // Ensure idle is playing
      if (this.currentAnim !== 'ibarra_idle') {
        this.playAnim('ibarra_idle');
      }
    }

    // Y-sorting depth
    this.player.setDepth(Math.floor(this.player.y));
  }

  private isBlocked(tileX: number, tileY: number): boolean {
    if (tileX < 0 || tileX >= MAP_W || tileY < 0 || tileY >= MAP_H) return true;
    return this.collisionMap[tileY]?.[tileX] ?? true;
  }

  // ────────────────────────────────────────────────────────────────
  // NPCs — Real sprites from extracted frames
  // ────────────────────────────────────────────────────────────────

  private setupNPCs() {
    this.npcs = [
      {
        key: 'mang_tenyo',
        name: 'Mang Tenyo',
        tileX: 20,
        tileY: 9,
        charKey: 'misc-npc',
        facing: 'down',
      },
      {
        key: 'guevara',
        name: 'Lt. Guevara',
        tileX: 15,
        tileY: 8,
        charKey: 'spanish-npc',
        facing: 'right',
      },
      {
        key: 'old_woman',
        name: 'Old Woman',
        tileX: 7,
        tileY: 16,
        charKey: 'villager-npc',
        facing: 'right',
      },
      {
        key: 'vendor',
        name: 'Vendor',
        tileX: 30,
        tileY: 11,
        charKey: 'religious-npc',
        facing: 'left',
      },
      {
        key: 'guard',
        name: 'Guardia',
        tileX: 35,
        tileY: 16,
        charKey: 'spanish-npc',
        facing: 'down',
      },
      {
        key: 'child',
        name: 'Child',
        tileX: 10,
        tileY: 22,
        charKey: 'student-npc',
        facing: 'up',
      },
      {
        key: 'farmer',
        name: 'Farmer',
        tileX: 25,
        tileY: 24,
        charKey: 'villager-npc',
        facing: 'left',
      },
    ];
  }

  private createNPCs() {
    for (const npcDef of this.npcs) {
      // Use the first idle frame of the NPC character
      const idleFrameKey = `${npcDef.charKey}_idle_0`;
      const fallbackKey = 'ibarra_idle_0';
      const textureKey = this.textures.exists(idleFrameKey) ? idleFrameKey : fallbackKey;

      const npcSprite = this.add.image(0, 0, textureKey);
      npcSprite.setScale(SPRITE_SCALE);
      npcSprite.setOrigin(0.5, 0.85);

      if (npcDef.facing === 'left') {
        npcSprite.setFlipX(true);
      }

      // Play idle animation for this NPC
      const idleAnimKey = `${npcDef.charKey}_idle`;
      if (this.anims.exists(idleAnimKey)) {
        npcSprite.play(idleAnimKey);
      }

      // NPC name label
      const nameLabel = this.add.text(0, -12, npcDef.name, {
        fontFamily: 'monospace',
        fontSize: '3px',
        color: '#f8f8f8',
        backgroundColor: '#000000cc',
        padding: { x: 1, y: 0 },
      }).setOrigin(0.5);

      const container = this.add.container(
        npcDef.tileX * TILE_SIZE + TILE_SIZE / 2,
        npcDef.tileY * TILE_SIZE + TILE_SIZE / 2,
        [npcSprite, nameLabel]
      );
      container.setDepth(Math.floor(container.y));

      this.npcSprites.set(npcDef.key, container);

      // Mark NPC tile as blocked
      if (npcDef.tileY < MAP_H && npcDef.tileX < MAP_W) {
        this.collisionMap[npcDef.tileY][npcDef.tileX] = true;
      }
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
        this.interactBubble.setPosition(npcContainer.x, npcContainer.y - 16);
        this.interactBubble.setVisible(true);
      }
    } else {
      this.interactBubble?.setVisible(false);
    }

    if (closestNpc && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.interactWithNPC(closestNpc);
    }
  }

  private interactWithNPC(npcKey: string) {
    if (this.phase === 'dialogue') return;

    let lines: DialogueLine[] = [];

    if (npcKey === 'mang_tenyo') {
      if (!this.talkedToMangTenyo) {
        lines = [
          { speaker: 'Mang Tenyo', text: "You're not from around here, iho. Best not to mention the Ibarra name too loudly tonight." },
          { speaker: 'Mang Tenyo', text: "Something happened at the reception. Padre Dámaso spoke against your father's name in front of everyone." },
          { speaker: 'Mang Tenyo', text: "If you want to clear Don Rafael's name, you need evidence. Look around the town for records." },
          { speaker: 'Mang Tenyo', text: "Find the Estate Ledger, the Tax Records, and a Witness Letter. Bring them back to me.",
            choices: [{ label: "I'll do it", value: 'accept' }, { label: 'Tell me more', value: 'more' }] },
        ];
      } else if (this.questAccepted && !this.allItemsCollected) {
        const remaining = QUEST_ITEMS.filter(i => !this.collectedItems.has(i.key));
        lines = [{ speaker: 'Mang Tenyo', text: `Still looking? You need: ${remaining.map(i => i.label).join(', ')}.` }];
      } else if (this.allItemsCollected && !this.returnedToMangTenyo) {
        lines = [
          { speaker: 'Mang Tenyo', text: "You found everything! The Estate Ledger, the Tax Records, and the Witness Letter..." },
          { speaker: 'Mang Tenyo', text: "This is proof that Don Rafael was falsely accused. The truth of San Diego must be known." },
          { speaker: 'Mang Tenyo', text: "You've done well, Ibarra. Your father would be proud." },
        ];
      } else {
        lines = [{ speaker: 'Mang Tenyo', text: "The truth will set San Diego free, iho." }];
      }
    } else if (npcKey === 'guevara') {
      lines = [
        { speaker: 'Lt. Guevara', text: "Ibarra... you should know the truth about your father. Dámaso slandered him before the whole town." },
        { speaker: 'Lt. Guevara', text: "Don Rafael was arrested on charges of heresy. He died in that cell." },
      ];
    } else if (npcKey === 'old_woman') {
      lines = [{ speaker: 'Old Woman', text: "The river remembers everything, child. Even the things we try to forget." }];
    } else if (npcKey === 'vendor') {
      lines = [{ speaker: 'Vendor', text: "Fresh produce! Though business has been slow since the Guardia Civil started patrolling..." }];
    } else if (npcKey === 'guard') {
      lines = [{ speaker: 'Guardia', text: "Move along. The town is under civil guard jurisdiction." }];
    } else if (npcKey === 'child') {
      lines = [{ speaker: 'Child', text: "Are you the señor from Europe? My mother says your father was a good man." }];
    } else if (npcKey === 'farmer') {
      lines = [{ speaker: 'Farmer', text: "The harvest has been poor. The friars take more than their share from the fields." }];
    }

    if (lines.length > 0) {
      this.currentDialogueNpcKey = npcKey;
      this.showDialogue(lines);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // QUEST ITEMS — Using real item sprites
  // ────────────────────────────────────────────────────────────────

  private spawnQuestItems() {
    for (const item of QUEST_ITEMS) {
      const textureKey = this.textures.exists(item.textureKey) ? item.textureKey : 'item_coin';
      const itemSprite = this.add.image(0, -2, textureKey);
      itemSprite.setScale(ITEM_SCALE);
      itemSprite.setOrigin(0.5);

      // Glow effect
      const glow = this.add.circle(0, -2, 6, 0xffd60a, 0.2);

      // Pulsing animation
      this.tweens.add({
        targets: [itemSprite, glow],
        scaleX: ITEM_SCALE * 1.1,
        scaleY: ITEM_SCALE * 1.1,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // Item label
      const label = this.add.text(0, 6, item.label, {
        fontFamily: 'monospace',
        fontSize: '3px',
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
        return;
      }
    }
  }

  private collectItem(item: QuestItem) {
    this.collectedItems.add(item.key);

    const sprite = this.questItemSprites.get(item.key);
    if (sprite) {
      this.tweens.add({
        targets: sprite,
        y: sprite.y - 10,
        alpha: 0,
        duration: 400,
        ease: 'Back.easeIn',
        onComplete: () => sprite.destroy(),
      });
    }

    this.showDialogue([{ speaker: item.label, text: item.description }]);

    if (this.collectedItems.size >= QUEST_ITEMS.length) {
      this.allItemsCollected = true;
    } else {
      const remaining = QUEST_ITEMS.length - this.collectedItems.size;
      this.setObjective(`Find evidence (${remaining} remaining)`);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // CAMERA — Follows player, Pokémon-style with zoom
  // ────────────────────────────────────────────────────────────────

  private setupCamera() {
    this.cameras.main.setBounds(0, 0, MAP_W * TILE_SIZE, MAP_H * TILE_SIZE);
    this.cameras.main.setZoom(CAMERA_ZOOM);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.roundPixels = true;
  }

  // ────────────────────────────────────────────────────────────────
  // HUD — Minimal objective only
  // ────────────────────────────────────────────────────────────────

  private createHUD() {
    this.objectiveBg = this.add.rectangle(GAME_WIDTH / 2, 6, 0, 8, 0x000000, 0.7)
      .setScrollFactor(0)
      .setDepth(100);

    this.objectiveText = this.add.text(GAME_WIDTH / 2, 6, '', {
      fontFamily: 'monospace',
      fontSize: '4px',
      color: '#f8f8f8',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

    this.events.on('update', () => {
      if (this.objectiveText && this.objectiveBg) {
        const text = this.objectiveText.text;
        this.objectiveBg.width = text ? text.length * 2.5 + 8 : 0;
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
      fontSize: '4px',
      color: '#ffd60a',
      backgroundColor: '#000000cc',
      padding: { x: 2, y: 1 },
    }).setOrigin(0.5).setDepth(50).setVisible(false);

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
  // DIALOGUE SYSTEM — Pokémon-style text box
  // ────────────────────────────────────────────────────────────────

  private createDialogueSystem() {
    const boxW = GAME_WIDTH - 4;
    const boxH = 36;
    const boxX = GAME_WIDTH / 2;
    const boxY = GAME_HEIGHT - boxH / 2 - 2;

    const border = this.add.rectangle(boxX, boxY, boxW + 2, boxH + 2, 0x000000)
      .setScrollFactor(0).setDepth(200);
    const bg = this.add.rectangle(boxX, boxY, boxW, boxH, 0xf8f8f8)
      .setScrollFactor(0).setDepth(201);

    this.dialogueSpeaker = this.add.text(boxX - boxW / 2 + 4, boxY - boxH / 2 + 3, '', {
      fontFamily: 'monospace',
      fontSize: '4px',
      color: '#f8f8f8',
      backgroundColor: '#333333',
      padding: { x: 2, y: 1 },
    }).setScrollFactor(0).setDepth(202);

    this.dialogueText = this.add.text(boxX - boxW / 2 + 4, boxY - boxH / 2 + 10, '', {
      fontFamily: 'monospace',
      fontSize: '4px',
      color: '#222222',
      wordWrap: { width: boxW - 10 },
      lineSpacing: 2,
    }).setScrollFactor(0).setDepth(202);

    this.dialoguePrompt = this.add.text(boxX + boxW / 2 - 6, boxY + boxH / 2 - 5, '▼', {
      fontFamily: 'monospace',
      fontSize: '4px',
      color: '#333333',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(203);

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
    this.dialogueSpeaker?.setText(line.speaker);

    this.fullText = line.text;
    this.displayedText = '';
    this.charIndex = 0;
    this.isTyping = true;
    this.dialogueText?.setText('');
    this.dialoguePrompt?.setVisible(false);

    if (this.textTimer) this.textTimer.remove();

    this.textTimer = this.time.addEvent({
      delay: 25,
      callback: () => {
        if (this.charIndex < this.fullText.length) {
          this.displayedText += this.fullText[this.charIndex];
          this.charIndex++;
          this.dialogueText?.setText(this.displayedText);
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
        { speaker: 'Mang Tenyo', text: "Don Rafael was accused of heresy. The Ledger shows his finances, the Tax Records prove he paid everything, and a Witness Letter confirms Dámaso's slander." },
        { speaker: 'Mang Tenyo', text: "Find the Estate Ledger, the Tax Records, and a Witness Letter. Bring them back to me.",
          choices: [{ label: "I'll do it", value: 'accept' }] },
      ];
      this.dialogueIndex = 0;
      this.displayLine();
    }
  }

  private handleDialogueInput() {
    const pressed = Phaser.Input.Keyboard.JustDown(this.interactKey) ||
      Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
      Phaser.Input.Keyboard.JustDown(this.enterKey);

    if (!pressed) return;

    if (this.isTyping) {
      this.isTyping = false;
      this.textTimer?.remove();
      this.displayedText = this.fullText;
      this.dialogueText?.setText(this.displayedText);
      this.onLineComplete();
    } else {
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
      .setScrollFactor(0).setDepth(50);

    const introText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, '', {
      fontFamily: 'monospace',
      fontSize: '4px',
      color: '#f8f8f8',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 30 },
      lineSpacing: 2,
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
      fontSize: '5px',
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
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, 'CHAPTER 1', {
          fontFamily: 'monospace', fontSize: '8px', color: '#ffd60a', fontStyle: 'bold',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(301);
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 4, 'COMPLETE', {
          fontFamily: 'monospace', fontSize: '6px', color: '#f8f8f8',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(301);
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 16, 'The truth of San Diego will be known.', {
          fontFamily: 'monospace', fontSize: '4px', color: '#888888',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(301);
      });
    });
  }
}
