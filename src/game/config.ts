import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { SanDiegoScene } from './scenes/SanDiegoScene';

// ─── Internal game resolution ─────────────────────────────────────
// Pokémon FireRed GBA: 240×160, shows ~7.5×5 tiles at 32px
// We use 240×160 with zoom 2 = 480×320 display for Pokémon feel
// Player sprite ~48px on 240px width = 20% at 1x, 10% at 2x zoom
export const GAME_WIDTH = 240;
export const GAME_HEIGHT = 160;

// Tile size in world pixels
export const TILE_SIZE = 16;

// Camera zoom — Pokémon-style close-up
export const CAMERA_ZOOM = 2;

/**
 * Calculate the largest integer zoom that fits the given viewport.
 */
export function calculateIntegerZoom(viewW: number, viewH: number): number {
  const zoomX = Math.floor(viewW / GAME_WIDTH);
  const zoomY = Math.floor(viewH / GAME_HEIGHT);
  return Math.max(1, Math.min(zoomX, zoomY));
}

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  const zoom = calculateIntegerZoom(parent.clientWidth || 960, parent.clientHeight || 720);

  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#1a1a2e',
    // ─── Pixel-perfect rendering pipeline ──────────────────────
    pixelArt: true,        // Nearest-neighbor texture sampling
    antialias: false,      // No antialiasing on canvas
    roundPixels: true,     // Snap all positions to integer pixels
    // ─── Integer zoom — no fractional scaling ──────────────────
    scale: {
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      zoom,
    },
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    scene: [BootScene, TitleScene, SanDiegoScene],
  };
}
