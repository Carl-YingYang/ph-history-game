'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { CHARACTER_SHEETS, ANIM_ORDER } from '@/game/assetRegistry';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// ShowcaseScene type — only the public API we call from React.
type ShowcaseHandle = {
  setCharacter: (c: string) => void;
  playAnim: (a: string) => void;
  sys: { isActive: () => boolean };
};

const ANIM_LABELS: Record<string, string> = {
  idle: 'Idle', walk: 'Walk', run: 'Run', jump: 'Jump', attack: 'Attack',
  hurt: 'Hurt', dead: 'Dead', fall: 'Fall', climb: 'Climb', jumpattack: 'Jump Atk',
};
const ANIM_KEYS: Record<string, string> = {
  idle: '1', walk: '2', run: '3', jump: '4', attack: '5',
  hurt: '6', dead: '7', fall: '8', climb: '9', jumpattack: '0',
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<{ destroy: (remove: boolean) => void; scene: { getScene: (k: string) => ShowcaseHandle } } | null>(null);
  const [currentChar, setCurrentChar] = useState('rizal');
  const [currentAnim, setCurrentAnim] = useState('idle');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let destroyed = false;
    let pollTimer: ReturnType<typeof setTimeout>;

    (async () => {
      // Dynamic import so Phaser (which references `window`) only loads in the browser.
      const PhaserMod = await import('phaser');
      const Phaser = PhaserMod.default;
      const { createGameConfig } = await import('@/game/config');
      if (destroyed || !containerRef.current) return;
      const game = new Phaser.Game(createGameConfig(containerRef.current));
      gameRef.current = game as unknown as typeof gameRef.current;

      const checkReady = () => {
        const scene = game.scene.getScene('ShowcaseScene') as ShowcaseHandle | undefined;
        if (scene && scene.sys.isActive()) {
          if (!destroyed) setReady(true);
        } else {
          pollTimer = setTimeout(checkReady, 100);
        }
      };
      pollTimer = setTimeout(checkReady, 300);
    })();

    return () => {
      destroyed = true;
      clearTimeout(pollTimer);
      const g = gameRef.current;
      if (g) {
        g.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const getScene = useCallback((): ShowcaseHandle | null => {
    const g = gameRef.current;
    if (!g) return null;
    return g.scene.getScene('ShowcaseScene') ?? null;
  }, []);

  const selectChar = useCallback((c: string) => {
    setCurrentChar(c);
    getScene()?.setCharacter(c);
  }, [getScene]);

  const selectAnim = useCallback((a: string) => {
    setCurrentAnim(a);
    getScene()?.playAnim(a);
  }, [getScene]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0a14] text-zinc-200 font-mono">
      <header className="border-b border-[#2a2036] bg-[#16101f] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-sm font-bold tracking-wider text-amber-200">
            PH-HISTORY-GAME · ASSET INTEGRATION
          </h1>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Every PNG sprite sheet sliced &amp; every animation registered — pixel-perfect
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="px-2 py-1 rounded bg-[#221a2e] text-emerald-300 border border-emerald-900">
            pixelArt · roundPixels · antialias:false
          </span>
          <span className="px-2 py-1 rounded bg-[#221a2e] text-fuchsia-300 border border-fuchsia-900">
            {CHARACTER_SHEETS.length} characters · 24 sheets
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row min-h-0">
        <section className="flex-1 flex items-center justify-center p-4 min-h-[320px] relative">
          <div
            ref={containerRef}
            className="w-full max-w-[760px] aspect-[3/2] bg-[#14101c] border border-[#2a2036] rounded-md overflow-hidden"
            style={{ imageRendering: 'pixelated' }}
          />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center text-[11px] text-zinc-500 pointer-events-none">
              slicing sprite sheets…
            </div>
          )}
          <div className="absolute bottom-6 left-6 text-[9px] text-zinc-600 pointer-events-none">
            canvas: 480×320 · nearest-neighbour
          </div>
        </section>

        <aside className="w-full lg:w-[300px] border-t lg:border-t-0 lg:border-l border-[#2a2036] bg-[#120c1a] flex flex-col">
          <ScrollArea className="flex-1 max-h-[60vh] lg:max-h-none">
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Character</h2>
                  <span className="text-[9px] text-zinc-600">← / →</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {CHARACTER_SHEETS.map(c => (
                    <button
                      key={c}
                      onClick={() => selectChar(c)}
                      className={`px-2 py-1.5 rounded text-[10px] text-left transition-colors border ${
                        currentChar === c
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                          : 'bg-[#1c1528] border-[#2a2036] text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-[#2a2036]" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Animation</h2>
                  <span className="text-[9px] text-zinc-600">1–0</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {ANIM_ORDER.map(a => (
                    <button
                      key={a}
                      onClick={() => selectAnim(a)}
                      className={`px-2 py-1.5 rounded text-[10px] text-left transition-colors border flex items-center justify-between ${
                        currentAnim === a
                          ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-200'
                          : 'bg-[#1c1528] border-[#2a2036] text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                      }`}
                    >
                      <span>{ANIM_LABELS[a]}</span>
                      <span className="text-[8px] text-zinc-600">{ANIM_KEYS[a]}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-zinc-600 mt-2 leading-relaxed">
                  Non-looping anims (jump/attack/hurt/dead/fall/jump-atk) auto-return to idle.
                </p>
              </div>

              <Separator className="bg-[#2a2036]" />

              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500">character</span>
                  <span className="text-amber-200">{currentChar}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">animation</span>
                  <span className="text-fuchsia-300">{currentAnim}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">sheets loaded</span>
                  <span className="text-zinc-300">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">total frames</span>
                  <span className="text-zinc-300">~2,400+</span>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-[#2a2036] text-[9px] text-zinc-600 leading-relaxed">
            Asset integration phase · sprites sliced via texture atlas (per-frame
            rectangles). No placeholder images, no stretching, no full-PNG display.
          </div>
        </aside>
      </main>

      <footer className="mt-auto border-t border-[#2a2036] bg-[#16101f] px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        <span className="text-[9px] text-zinc-600">
          src/app/assets/*.png · 24 sprite sheets · texture-atlas hash format
        </span>
        <span className="text-[9px] text-zinc-600">
          SPACE = replay · ←/→ = character · 1–0 = animation
        </span>
      </footer>
    </div>
  );
}
