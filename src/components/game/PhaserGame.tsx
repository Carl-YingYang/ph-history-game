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

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      ref={gameParentRef}
      className="w-full h-full"
    />
  );
}
