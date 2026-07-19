'use client';

import dynamic from 'next/dynamic';

// Dynamic import for PhaserGame — no SSR (Phaser needs window/DOM)
const PhaserGame = dynamic(() => import('@/components/game/PhaserGame'), { ssr: false });

export default function Home() {
  return (
    <main className="game-fullscreen">
      <PhaserGame />
    </main>
  );
}
