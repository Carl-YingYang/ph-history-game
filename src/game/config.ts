import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { SanDiegoScene } from './scenes/SanDiegoScene';

// Game resolution - classic Pokémon-like aspect ratio
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 320;

// Tile size
export const TILE_SIZE = 32;

// Scale factor for crisp pixel art
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
