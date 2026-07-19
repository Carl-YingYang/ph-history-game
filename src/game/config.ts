import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { ShowcaseScene } from './scenes/ShowcaseScene';

// ─── Pixel-perfect rendering ──────────────────────────────────────
// Every smoothing option is disabled. Nearest-neighbour sampling keeps
// every sprite pixel crisp. roundPixels snaps positions to integers so
// sub-pixel movement never blurs the art.
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 320;

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#14101c',
    // ── Pixel-perfect pipeline ──
    pixelArt: true,       // nearest-neighbour texture sampling
    antialias: false,     // no canvas antialiasing
    roundPixels: true,    // snap all positions to integer pixels
    disableContextMenu: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    render: {
      antialias: false,
      pixelArt: true,
      roundPixels: true,
    },
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    scene: [BootScene, ShowcaseScene],
  };
}
