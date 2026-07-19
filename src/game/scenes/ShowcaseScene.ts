import Phaser from 'phaser';
import { ASSET_SHEETS, CHARACTER_SHEETS, ANIM_ORDER, ANIM_DEFAULTS } from '../assetRegistry';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

/**
 * ShowcaseScene — asset-integration verification.
 *
 * Spawns a character at centre and plays its animations. Exposes public
 * methods so the React control panel can switch character / animation.
 * Also renders a strip of environment tiles to verify they load.
 *
 * This is NOT gameplay — it proves every sprite sheet is sliced correctly
 * and every animation is ready to use.
 */
export class ShowcaseScene extends Phaser.Scene {
  private charSprite!: Phaser.GameObjects.Sprite;
  private charLabel!: Phaser.GameObjects.Text;
  private animLabel!: Phaser.GameObjects.Text;
  private infoText!: Phaser.GameObjects.Text;
  private tileStrip: Phaser.GameObjects.Container[] = [];
  private currentChar = 'rizal';
  private currentAnim = 'idle';

  constructor() {
    super('ShowcaseScene');
  }

  create() {
    // ── Pixel-perfect: disable smoothing on the canvas context ──
    const ctx = this.game.canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      // @ts-expect-error vendor prefixes
      ctx.webkitImageSmoothingEnabled = false;
      // @ts-expect-error vendor prefixes
      ctx.mozImageSmoothingEnabled = false;
      // @ts-expect-error vendor prefixes
      ctx.msImageSmoothingEnabled = false;
    }
    this.cameras.main.roundPixels = true;

    // ── Checkerboard backdrop so transparency is visible ──
    this.drawCheckerboard();

    // ── Character pedestal ──
    const pedestalY = GAME_HEIGHT / 2 + 8;
    this.add.line(GAME_WIDTH / 2, pedestalY, -GAME_WIDTH / 2, 0, GAME_WIDTH / 2, 0, 0x3a2f4a, 1);
    this.add.text(GAME_WIDTH / 2, pedestalY + 12, '— character showcase —', {
      fontFamily: 'monospace', fontSize: '7px', color: '#6a5a7a',
    }).setOrigin(0.5);

    // ── Character sprite (origin bottom-centre so feet stay on pedestal) ──
    this.charSprite = this.add.sprite(GAME_WIDTH / 2, pedestalY - 2, this.currentChar, `${this.currentChar}_idle_0`);
    this.charSprite.setOrigin(0.5, 1);
    this.charSprite.setScale(3);

    // ── Labels ──
    this.charLabel = this.add.text(GAME_WIDTH / 2, 14, this.currentChar, {
      fontFamily: 'monospace', fontSize: '12px', color: '#f5e9c8', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.animLabel = this.add.text(GAME_WIDTH / 2, 30, `anim: ${this.currentAnim}`, {
      fontFamily: 'monospace', fontSize: '8px', color: '#a89cf0',
    }).setOrigin(0.5);

    this.infoText = this.add.text(8, GAME_HEIGHT - 34, '', {
      fontFamily: 'monospace', fontSize: '7px', color: '#6a5a7a',
    });

    // ── Environment tile strip (bottom) ──
    this.buildTileStrip();

    // play default animation
    this.playAnim('idle');

    // ── Keyboard shortcuts for quick verification ──
    const keyMap: Record<string, string> = {
      '1': 'idle', '2': 'walk', '3': 'run', '4': 'jump',
      '5': 'attack', '6': 'hurt', '7': 'dead', '8': 'fall',
      '9': 'climb', '0': 'jumpattack',
    };
    for (const [k, anim] of Object.entries(keyMap)) {
      this.input.keyboard?.on(`keydown-${k}`, () => this.playAnim(anim));
    }
    // left/right arrows cycle characters
    this.input.keyboard?.on('keydown-LEFT', () => this.cycleCharacter(-1));
    this.input.keyboard?.on('keydown-RIGHT', () => this.cycleCharacter(1));
    // space = replay current anim
    this.input.keyboard?.on('keydown-SPACE', () => this.playAnim(this.currentAnim));

    this.updateInfo();
  }

  private drawCheckerboard() {
    const g = this.add.graphics();
    const cell = 8;
    const cols = Math.ceil(GAME_WIDTH / cell);
    const rows = Math.ceil(GAME_HEIGHT / cell);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const dark = (r + c) % 2 === 0;
        g.fillStyle(dark ? 0x1a1422 : 0x211a2e, 1);
        g.fillRect(c * cell, r * cell, cell, cell);
      }
    }
    g.setDepth(-10);
  }

  private buildTileStrip() {
    // destroy old
    for (const c of this.tileStrip) c.destroy();
    this.tileStrip = [];

    // pick a sample of frames from a few environment sheets
    const envKeys = ASSET_SHEETS.filter(s => !s.isCharacter).map(s => s.key);
    const samples: { key: string; frame: string }[] = [];
    for (const k of envKeys.slice(0, 5)) {
      const tex = this.textures.get(k);
      const names = tex.getFrameNames().slice(0, 8);
      for (const n of names) samples.push({ key: k, frame: n });
    }
    // lay them out in a row at the bottom
    const startY = GAME_HEIGHT - 22;
    const stride = 16;
    let x = 8;
    for (const s of samples) {
      const img = this.add.image(x, startY, s.key, s.frame);
      img.setOrigin(0, 1);
      img.setScale(1);
      this.tileStrip.push(img as unknown as Phaser.GameObjects.Container);
      x += stride;
      if (x > GAME_WIDTH - 20) break;
    }
  }

  // ── Public API (called from React) ──
  setCharacter(charKey: string) {
    if (!CHARACTER_SHEETS.includes(charKey)) return;
    this.currentChar = charKey;
    this.charSprite.setTexture(charKey, `${charKey}_idle_0`);
    this.charLabel.setText(charKey);
    this.playAnim('idle');
    this.updateInfo();
  }

  playAnim(animName: string) {
    if (!ANIM_ORDER.includes(animName as typeof ANIM_ORDER[number])) return;
    const animKey = `${this.currentChar}_${animName}`;
    if (!this.anims.exists(animKey)) {
      this.animLabel.setText(`anim: ${animName} (none)`);
      // show a static frame if possible
      const tex = this.textures.get(this.currentChar);
      const first = tex.getFrameNames().find(n => n.startsWith(`${this.currentChar}_${animName}_`));
      if (first) this.charSprite.setFrame(first);
      return;
    }
    this.currentAnim = animName;
    this.charSprite.play(animKey);
    this.animLabel.setText(`anim: ${animName}`);
    // when a non-looping anim finishes, fall back to idle
    if (ANIM_DEFAULTS[animName]?.repeat === 0) {
      this.charSprite.once('animationcomplete', () => {
        this.playAnim('idle');
      });
    }
  }

  cycleCharacter(dir: number) {
    const idx = CHARACTER_SHEETS.indexOf(this.currentChar);
    const next = (idx + dir + CHARACTER_SHEETS.length) % CHARACTER_SHEETS.length;
    this.setCharacter(CHARACTER_SHEETS[next]);
  }

  private updateInfo() {
    const tex = this.textures.get(this.currentChar);
    const total = tex.getFrameNames().length;
    const animCount = ANIM_ORDER.filter(a => this.anims.exists(`${this.currentChar}_${a}`)).length;
    this.infoText.setText(
      `frames: ${total}   anims: ${animCount}/10   ←/→ char   1-0 anim   SPACE replay`,
    );
  }
}
