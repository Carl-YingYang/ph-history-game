'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '@/game/config';

export default function PhaserGame() {
  const gameParentRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameParentRef.current || gameRef.current) return;

    const game = new Phaser.Game(createGameConfig(gameParentRef.current));
    gameRef.current = game;

    // Disable image smoothing on the canvas context for pixel-perfect rendering
    game.events.on('ready', () => {
      const canvas = game.canvas;
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
    });

    return () => {
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
