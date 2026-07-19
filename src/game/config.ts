import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { SanDiegoScene } from './scenes/SanDiegoScene';

// ─── Internal game resolution ─────────────────────────────────────
// Pokémon FireRed shows ~15×10 tiles. Our sprites are ~48px on 32px tiles.
// At 480×360: player is 48/480 ≈ 10% of screen width — Pokémon feel.
// At 640×480: player is 48/640 ≈ 7.5% — more zoomed out.
// 480×360 gives the closest feel to Pokémon FireRed.
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 360;

// Tile size in world pixels
export const TILE_SIZE = 32;

/**
 * Calculate the largest integer zoom that fits the given viewport.
 * Ensures pixel-perfect rendering — every game pixel = exactly N screen pixels.
 */
export function calculateIntegerZoom(viewW: number, viewH: number): number {
  const zoomX = Math.floor(viewW / GAME_WIDTH);
  const zoomY = Math.floor(viewH / GAME_HEIGHT);
  const zoom = Math.max(1, Math.min(zoomX, zoomY));
  return zoom;
}

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  // Calculate integer zoom from the parent container size
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
      mode: Phaser.Scale.NONE,     // We control the size manually
      autoCenter: Phaser.Scale.CENTER_BOTH,
      zoom,                         // Integer zoom factor (1, 2, 3, etc.)
    },
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    scene: [BootScene, TitleScene, SanDiegoScene],
  };
}
