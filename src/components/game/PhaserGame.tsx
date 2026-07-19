'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig, calculateIntegerZoom, GAME_WIDTH, GAME_HEIGHT } from '@/game/config';

export default function PhaserGame() {
  const gameParentRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameParentRef.current || gameRef.current) return;

    const parent = gameParentRef.current;
    const game = new Phaser.Game(createGameConfig(parent));
    gameRef.current = game;

    // Disable image smoothing on the canvas context for pixel-perfect rendering
    game.events.on('ready', () => {
      disableSmoothing(game.canvas);
    });

    // Re-calculate integer zoom on window resize
    const handleResize = () => {
      if (!gameRef.current || !parent) return;
      const zoom = calculateIntegerZoom(window.innerWidth, window.innerHeight);
      game.scale.setZoom(zoom);
      game.scale.resize(GAME_WIDTH, GAME_HEIGHT);
      disableSmoothing(game.canvas);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      ref={gameParentRef}
      className="w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

function disableSmoothing(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = false;
    // @ts-expect-error - vendor prefix
    ctx.webkitImageSmoothingEnabled = false;
    // @ts-expect-error - vendor prefix
    ctx.mozImageSmoothingEnabled = false;
    // @ts-expect-error - vendor prefix
    ctx.msImageSmoothingEnabled = false;
  }
}
