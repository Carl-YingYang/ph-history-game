import Phaser from 'phaser';
import { ASSET_SHEETS, CHARACTER_SHEETS, ANIM_ORDER, ANIM_DEFAULTS } from '../assetRegistry';
import { GAME_WIDTH as GW, GAME_HEIGHT as GH } from '../config';

/**
 * BootScene — loads EVERY PNG sprite sheet as a Phaser texture atlas and
 * registers EVERY character animation (idle, walk, run, jump, attack, hurt,
 * dead, fall, climb, jumpattack) directly from the sliced atlas frames.
 *
 * No placeholder graphics. No full-PNG display. Each atlas is sliced per the
 * frame rectangles emitted by scripts/process_assets.py.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // ── Loading bar ──
    const barW = 240, barH = 8;
    const barX = (GW - barW) / 2;
    const barY = GH / 2;
    const border = this.add.rectangle(GW / 2, barY, barW + 6, barH + 6, 0x000000).setStrokeStyle(1, 0x555566);
    const bar = this.add.rectangle(barX, barY, 0, barH, 0xf5e9c8).setOrigin(0, 0.5);
    const loadText = this.add.text(GW / 2, barY - 18, 'Slicing sprite sheets…', {
      fontFamily: 'monospace', fontSize: '10px', color: '#c8b990',
    }).setOrigin(0.5);
    const countText = this.add.text(GW / 2, barY + 18, '', {
      fontFamily: 'monospace', fontSize: '8px', color: '#776655',
    }).setOrigin(0.5);

    let loaded = 0;
    const total = ASSET_SHEETS.length;
    this.load.on('progress', (v: number) => { bar.width = barW * v; });
    this.load.on('filecomplete', () => {
      loaded++;
      countText.setText(`${loaded} / ${total} sheets`);
    });

    // ── Load every PNG as a texture atlas ──
    // load.atlas(key, textureURL, atlasURL) — standard Phaser texture-atlas load.
    // The PNG is sliced per the frame rectangles in the JSON (JSON Hash format).
    for (const sheet of ASSET_SHEETS) {
      this.load.atlas(sheet.key, sheet.pngUrl, sheet.atlasUrl);
    }

    this.load.on('loaderror', (file: { key: string; url: unknown }) => {
      console.error(`[BootScene] Failed to load asset: ${file.key}`, file.url);
    });

    this.load.on('complete', () => {
      border.destroy(); bar.destroy(); loadText.destroy(); countText.destroy();
    });
  }

  create() {
    // ── Verify every atlas loaded + count frames ──
    let totalFrames = 0;
    let totalAnims = 0;
    for (const sheet of ASSET_SHEETS) {
      if (!this.textures.exists(sheet.key)) {
        console.error(`[BootScene] Missing texture: ${sheet.key}`);
        continue;
      }
      const tex = this.textures.get(sheet.key);
      const frameNames = tex.getFrameNames();
      totalFrames += frameNames.length;
    }
    console.log(`[BootScene] ${ASSET_SHEETS.length} atlases loaded, ${totalFrames} total frames`);

    // ── Register every character animation ──
    for (const charKey of CHARACTER_SHEETS) {
      if (!this.textures.exists(charKey)) continue;
      const tex = this.textures.get(charKey);
      for (const animName of ANIM_ORDER) {
        // collect frame names matching {charKey}_{anim}_{index}
        const pattern = new RegExp(`^${charKey}_${animName}_(\\d+)$`);
        const matching = tex.getFrameNames().filter(n => pattern.test(n));
        if (matching.length === 0) continue;
        // sort by numeric index
        matching.sort((a, b) => {
          const ia = parseInt(a.split('_').pop() as string, 10);
          const ib = parseInt(b.split('_').pop() as string, 10);
          return ia - ib;
        });
        const animKey = `${charKey}_${animName}`;
        const cfg = ANIM_DEFAULTS[animName] ?? { frameRate: 10, repeat: -1 };
        if (!this.anims.exists(animKey)) {
          this.anims.create({
            key: animKey,
            frames: matching.map(f => ({ key: charKey, frame: f })),
            frameRate: cfg.frameRate,
            repeat: cfg.repeat,
          });
          totalAnims++;
        }
      }
    }
    console.log(`[BootScene] ${totalAnims} animations registered`);

    this.scene.start('ShowcaseScene');
  }
}
