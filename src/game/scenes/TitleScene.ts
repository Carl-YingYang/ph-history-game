import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { CHARACTER_SHEETS } from '../assetRegistry';

/**
 * TitleScene — polished pixel-art title screen for "Noli Me Tangere: San Diego".
 *
 * Shows the game title, a rotating cast of character portraits (sliced from the
 * real atlas portrait frames), and a "Press Start" prompt. Pressing Enter/Space
 * starts the WorldScene (explorable RPG). No placeholder art — every portrait is
 * the real sliced frame from a character atlas.
 */
export class TitleScene extends Phaser.Scene {
  private portrait!: Phaser.GameObjects.Image;
  private portraitFrame!: Phaser.GameObjects.Rectangle;
  private castIndex = 0;
  private castTimer = 0;
  private titleText!: Phaser.GameObjects.Text;
  private subtitleText!: Phaser.GameObjects.Text;
  private promptText!: Phaser.GameObjects.Text;
  private promptVisible = true;
  private vignette!: Phaser.GameObjects.Graphics;
  private started = false;

  constructor() {
    super('TitleScene');
  }

  create() {
    const ctx = this.game.canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
    }
    this.cameras.main.roundPixels = true;

    const W = GAME_WIDTH, H = GAME_HEIGHT;

    // ── Background gradient (deep night -> warm horizon) ──
    this.drawBackground();

    // ── Decorative top + bottom borders (parchment rule lines) ──
    const g = this.add.graphics();
    g.lineStyle(1, 0x6b4423, 0.8);
    g.lineBetween(8, 18, W - 8, 18);
    g.lineStyle(1, 0xc9a04a, 0.5);
    g.lineBetween(8, 21, W - 8, 21);
    g.lineStyle(1, 0x6b4423, 0.8);
    g.lineBetween(8, H - 18, W - 8, H - 18);
    g.lineStyle(1, 0xc9a04a, 0.5);
    g.lineBetween(8, H - 21, W - 8, H - 21);

    // ── Ornamental corner flourishes ──
    this.drawCorners();

    // ── Title ──
    this.titleText = this.add.text(W / 2, 56, 'NOLI ME TANGERE', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#e8d5a8',
      fontStyle: 'bold',
      stroke: '#1a1208',
      strokeThickness: 4,
    }).setOrigin(0.5).setLetterSpacing(2);

    this.subtitleText = this.add.text(W / 2, 78, '· San Diego ·', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#c9a04a',
      fontStyle: 'bold',
    }).setOrigin(0.5).setLetterSpacing(6);

    this.add.text(W / 2, 92, 'A Pixel Chronicle of José Rizal', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#8a7556',
    }).setOrigin(0.5);

    // ── Portrait frame (parchment with gold border) ──
    const pfW = 96, pfH = 96;
    const pfX = W / 2 - pfW / 2;
    const pfY = 108;
    this.add.rectangle(W / 2, pfY + pfH / 2, pfW + 6, pfH + 6, 0x1a1208).setStrokeStyle(1, 0xc9a04a);
    this.add.rectangle(W / 2, pfY + pfH / 2, pfW + 2, pfH + 2, 0x2a1d10).setStrokeStyle(1, 0x6b4423);
    this.portraitFrame = this.add.rectangle(W / 2, pfY + pfH / 2, pfW, pfH, 0x0f0a14);

    // ── Portrait image (real sliced frame from atlas) ──
    this.portrait = this.add.image(W / 2, pfY + pfH / 2, 'rizal', 'rizal_portrait');
    this.scalePortraitToFit(this.portrait, pfW - 6, pfH - 6);
    this.portrait.setAlpha(0.96);

    // ── Cast label (current character name) ──
    const castLabel = this.add.text(W / 2, pfY + pfH + 12, 'Crisóstomo Ibarra', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#e8d5a8',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.castLabel = castLabel;

    // ── "Press Start" prompt (blinking) ──
    this.promptText = this.add.text(W / 2, H - 40, '▶  PRESS  ENTER  TO  BEGIN  ◀', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#e8d5a8',
      fontStyle: 'bold',
    }).setOrigin(0.5).setLetterSpacing(1);

    this.add.text(W / 2, H - 28, 'S = Sprite Studio   ·   M = mute', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#6b5a3e',
    }).setOrigin(0.5);

    // ── Vignette ──
    this.vignette = this.add.graphics();
    this.drawVignette();
    this.vignette.setDepth(50);

    // ── Floating embers (atmosphere) ──
    this.spawnEmbers();

    // ── Input ──
    this.input.keyboard?.once('keydown-ENTER', () => this.startGame());
    this.input.keyboard?.once('keydown-SPACE', () => this.startGame());
    this.input.keyboard?.on('keydown-S', () => this.scene.switch('ShowcaseScene'));
    this.input.on('pointerdown', () => this.startGame());

    // fade in
    this.cameras.main.fadeIn(600, 15, 10, 20);
  }

  private castLabel!: Phaser.GameObjects.Text;

  private drawBackground() {
    const W = GAME_WIDTH, H = GAME_HEIGHT;
    const bg = this.add.graphics();
    // vertical gradient strips
    const stops = [
      { y: 0, c: 0x0a0610 },
      { y: H * 0.35, c: 0x14101c },
      { y: H * 0.6, c: 0x1f1626 },
      { y: H * 0.8, c: 0x2a1d22 },
      { y: H, c: 0x3a2418 },
    ];
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i], b = stops[i + 1];
      const steps = 8;
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const y = a.y + (b.y - a.y) * t;
        const h = (b.y - a.y) / steps + 1;
        const cR = this.lerpCol(a.c, b.c, t);
        bg.fillStyle(cR, 1);
        bg.fillRect(0, y, W, h);
      }
    }
    // distant horizon glow
    bg.fillStyle(0x8b2c2c, 0.06);
    bg.fillRect(0, H * 0.55, W, H * 0.15);
  }

  private lerpCol(a: number, b: number, t: number): number {
    const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff;
    const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff;
    const r = Math.round(ar + (br - ar) * t);
    const g = Math.round(ag + (bg - ag) * t);
    const bl = Math.round(ab + (bb - ab) * t);
    return (r << 16) | (g << 8) | bl;
  }

  private drawCorners() {
    const W = GAME_WIDTH, H = GAME_HEIGHT;
    const g = this.add.graphics();
    g.lineStyle(1, 0xc9a04a, 0.7);
    const corners = [
      [12, 12, 1, 1], [W - 12, 12, -1, 1],
      [12, H - 12, 1, -1], [W - 12, H - 12, -1, -1],
    ];
    for (const [x, y, sx, sy] of corners) {
      g.beginPath();
      g.moveTo(x, y + sy * 8);
      g.lineTo(x, y);
      g.lineTo(x + sx * 8, y);
      g.strokePath();
      g.fillStyle(0xc9a04a, 0.8);
      g.fillRect(x - 1, y - 1, 2, 2);
    }
  }

  private drawVignette() {
    const W = GAME_WIDTH, H = GAME_HEIGHT;
    const v = this.vignette;
    v.clear();
    // radial-ish vignette via stacked rects
    for (let i = 0; i < 6; i++) {
      const inset = i * 3;
      v.fillStyle(0x000000, 0.04 + i * 0.02);
      v.fillRect(0, 0, W, inset);
      v.fillRect(0, H - inset, W, inset);
      v.fillRect(0, 0, inset, H);
      v.fillRect(W - inset, 0, inset, H);
    }
  }

  private spawnEmbers() {
    for (let i = 0; i < 14; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(GAME_HEIGHT * 0.4, GAME_HEIGHT);
      const e = this.add.image(x, y, '__WHITE');
      e.setTint(0xc9a04a);
      e.setAlpha(Phaser.Math.Float(0.2, 0.6));
      e.setScale(Phaser.Math.Float(0.5, 1.2));
      e.setDepth(40);
      this.tweens.add({
        targets: e,
        y: y - Phaser.Math.Between(40, 90),
        x: x + Phaser.Math.Between(-12, 12),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        delay: Phaser.Math.Between(0, 3000),
        repeat: -1,
        onRepeat: () => {
          e.y = Phaser.Math.Between(GAME_HEIGHT * 0.4, GAME_HEIGHT);
          e.x = Phaser.Math.Between(0, GAME_WIDTH);
          e.alpha = Phaser.Math.Float(0.2, 0.6);
        },
      });
    }
  }

  private scalePortraitToFit(img: Phaser.GameObjects.Image, maxW: number, maxH: number) {
    const tex = this.textures.get(img.texture.key);
    const frame = tex.get(img.frame.name);
    const fw = frame.width, fh = frame.height;
    const s = Math.min(maxW / fw, maxH / fh);
    img.setScale(s);
  }

  update(_time: number, deltaMs: number) {
    // ── Blink the prompt ──
    this.castTimer += deltaMs;
    if (this.castTimer > 600) {
      this.promptVisible = !this.promptVisible;
      this.promptText.setAlpha(this.promptVisible ? 1 : 0.25);
      this.castTimer = 0;
    }

    // ── Rotate the cast portrait every 2.6s ──
    this.castRotTimer = (this.castRotTimer ?? 0) + deltaMs;
    if (this.castRotTimer > 2600) {
      this.castRotTimer = 0;
      this.castIndex = (this.castIndex + 1) % CHARACTER_SHEETS.length;
      const key = CHARACTER_SHEETS[this.castIndex];
      const frameName = `${key}_portrait`;
      if (this.textures.get(key).has(frameName)) {
        // cross-fade
        this.tweens.add({
          targets: this.portrait,
          alpha: 0,
          duration: 220,
          onComplete: () => {
            this.portrait.setTexture(key, frameName);
            this.scalePortraitToFit(this.portrait, 90, 90);
            this.tweens.add({ targets: this.portrait, alpha: 0.96, duration: 220 });
          },
        });
        this.castLabel.setText(this.displayName(key));
      }
    }
  }

  private castRotTimer = 0;

  private displayName(key: string): string {
    const names: Record<string, string> = {
      rizal: 'Crisóstomo Ibarra', ibara: 'Ibarra (alt)', clara: 'María Clara',
      damaso: 'Fr. Dámaso', simoun: 'Simoun', salve: 'Salvi', elias: 'Elías',
      sisa: 'Sisa', basilio: 'Basilio', tiago: 'Cap. Tiago',
      'student-npc': 'A Student', 'villager-npc': 'A Villager',
      'religious-npc': 'A Friar', 'spanish-npc': 'A Spaniard',
      'misc-npc': 'A Townsperson', 'animals-assets': 'Beasts of San Diego',
    };
    return names[key] ?? key;
  }

  private startGame() {
    if (this.started) return;
    this.started = true;
    this.cameras.main.fadeOut(500, 15, 10, 20);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('WorldScene');
    });
  }
}
