import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { SanDiegoScene } from './scenes/SanDiegoScene';

// Internal game resolution — smaller = more zoomed-in (Pokémon feel)
// Pokémon FireRed GBA: 240×160. We use 320×240 for a 4:3 ratio with slight zoom.
export const GAME_WIDTH = 320;
export const GAME_HEIGHT = 240;

// Tile size in world pixels
export const TILE_SIZE = 32;

// Integer zoom factor applied after internal rendering
export const PIXEL_SCALE = 2;

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#1a1a2e',
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, TitleScene, SanDiegoScene],
  };
}
