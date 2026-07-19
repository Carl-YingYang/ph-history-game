'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { CHARACTER_SHEETS, ANIM_ORDER } from '@/game/assetRegistry';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

/**
 * PH-History-Game — "Noli Me Tangere: San Diego"
 *
 * Three game modes share one Phaser instance:
 *   • Title    — pixel-art title screen (rotating cast portraits)
 *   • Explore  — walk around San Diego, talk to NPCs (the RPG)
 *   • Studio   — sprite showcase: pick any character + animation
 *
 * The Phaser game is created once and scenes are switched via React.
 */

type SceneHandle = {
  setCharacter: (c: string) => void;
  playAnim: (a: string) => void;
  setPlayerChar: (c: string) => void;
  sys: { isActive: () => boolean };
};
type GameHandle = {
  destroy: (remove: boolean) => void;
  scene: {
    getScene: (k: string) => SceneHandle;
    switch: (k: string) => void;
    start: (k: string) => void;
  };
};

type Mode = 'title' | 'explore' | 'studio';

const ANIM_LABELS: Record<string, string> = {
  idle: 'Idle', walk: 'Walk', run: 'Run', jump: 'Jump', attack: 'Attack',
  hurt: 'Hurt', dead: 'Dead', fall: 'Fall', climb: 'Climb', jumpattack: 'Jump Atk',
};
const ANIM_KEYS: Record<string, string> = {
  idle: '1', walk: '2', run: '3', jump: '4', attack: '5',
  hurt: '6', dead: '7', fall: '8', climb: '9', jumpattack: '0',
};

const CHAR_DISPLAY: Record<string, string> = {
  rizal: 'Crisóstomo Ibarra', ibara: 'Ibarra (alt)', clara: 'María Clara',
  damaso: 'Fr. Dámaso', simoun: 'Simoun', salve: 'Salvi', elias: 'Elías',
  sisa: 'Sisa', basilio: 'Basilio', tiago: 'Cap. Tiago',
  'student-npc': 'A Student', 'villager-npc': 'A Villager',
  'religious-npc': 'A Friar', 'spanish-npc': 'A Spaniard',
  'misc-npc': 'A Townsperson', 'animals-assets': 'Beasts',
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<GameHandle | null>(null);
  const [mode, setMode] = useState<Mode>('title');
  const [currentChar, setCurrentChar] = useState('rizal');
  const [currentAnim, setCurrentAnim] = useState('idle');
  const [playerChar, setPlayerChar] = useState('rizal');
  const [ready, setReady] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    let destroyed = false;
    let pollTimer: ReturnType<typeof setTimeout>;

    (async () => {
      const PhaserMod = await import('phaser');
      const Phaser = PhaserMod.default;
      const { createGameConfig } = await import('@/game/config');
      if (destroyed || !containerRef.current) return;
      const game = new Phaser.Game(createGameConfig(containerRef.current));
      gameRef.current = game as unknown as GameHandle;

      const checkReady = () => {
        const scene = game.scene.getScene('TitleScene') as SceneHandle | undefined;
        if (scene && scene.sys.isActive()) {
          if (!destroyed) setReady(true);
        } else {
          pollTimer = setTimeout(checkReady, 100);
        }
      };
      pollTimer = setTimeout(checkReady, 400);
    })();

    return () => {
      destroyed = true;
      clearTimeout(pollTimer);
      const g = gameRef.current;
      if (g) { g.destroy(true); gameRef.current = null; }
    };
  }, []);

  const getScene = useCallback((name: string): SceneHandle | null => {
    const g = gameRef.current;
    if (!g) return null;
    return g.scene.getScene(name) ?? null;
  }, []);

  const switchMode = useCallback((m: Mode) => {
    const g = gameRef.current;
    if (!g) return;
    setMode(m);
    if (m === 'title') g.scene.switch('TitleScene');
    if (m === 'explore') g.scene.switch('WorldScene');
    if (m === 'studio') g.scene.switch('ShowcaseScene');
  }, []);

  const selectChar = useCallback((c: string) => {
    setCurrentChar(c);
    getScene('ShowcaseScene')?.setCharacter(c);
  }, [getScene]);

  const selectAnim = useCallback((a: string) => {
    setCurrentAnim(a);
    getScene('ShowcaseScene')?.playAnim(a);
  }, [getScene]);

  const selectPlayerChar = useCallback((c: string) => {
    setPlayerChar(c);
    getScene('WorldScene')?.setPlayerChar(c);
  }, [getScene]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0710] text-zinc-200 font-mono selection:bg-amber-500/30">
      {/* ── Header ── */}
      <header className="border-b border-[#2a1d10] bg-gradient-to-r from-[#16101a] via-[#1a1320] to-[#1f1612] px-4 py-2.5 flex items-center justify-between flex-wrap gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#c9a04a] to-[#8b2c2c] flex items-center justify-center text-[12px] font-black text-[#1a1208] shadow-md shadow-black/40">
            N
          </div>
          <div>
            <h1 className="text-[13px] font-bold tracking-[0.18em] text-amber-200 leading-none">
              NOLI ME TANGERE
            </h1>
            <p className="text-[9px] text-zinc-500 mt-1 tracking-wide">
              San Diego · pixel chronicle
            </p>
          </div>
        </div>

        {/* Mode switcher */}
        <nav className="flex items-center gap-1 p-1 rounded-md bg-[#0f0a14] border border-[#2a1d10]">
          {(['title', 'explore', 'studio'] as Mode[]).map(m => {
            const labels = { title: 'Title', explore: 'Explore', studio: 'Studio' };
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-all ${
                  active
                    ? 'bg-gradient-to-b from-[#c9a04a] to-[#a07c2a] text-[#1a1208] shadow-sm shadow-amber-900/50'
                    : 'text-zinc-400 hover:text-amber-200 hover:bg-[#1c1528]'
                }`}
              >
                {labels[m]}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelp(s => !s)}
            className="px-2.5 py-1.5 rounded text-[10px] text-zinc-400 hover:text-amber-200 hover:bg-[#1c1528] border border-[#2a1d10] transition-colors"
            aria-label="Help"
          >
            ?
          </button>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#0f0a14] text-emerald-300/80 border border-emerald-900/40 text-[9px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            24 atlases · 157 anims
          </span>
        </div>
      </header>

      {/* ── Help overlay ── */}
      {showHelp && (
        <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowHelp(false)}>
          <div className="max-w-md w-full bg-[#16101a] border border-[#c9a04a]/40 rounded-lg p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-amber-200 text-sm font-bold tracking-wider mb-3">HOW TO PLAY</h2>
            <div className="space-y-2 text-[11px] text-zinc-300 leading-relaxed">
              <p><span className="text-amber-300 font-bold">Title</span> — press Enter/Space or click to begin. Watch the cast rotate.</p>
              <p><span className="text-amber-300 font-bold">Explore</span> — walk with <kbd className="px-1 bg-[#0f0a14] border border-[#2a1d10] rounded text-[9px]">WASD</kbd>/<kbd className="px-1 bg-[#0f0a14] border border-[#2a1d10] rounded text-[9px]">arrows</kbd>, hold <kbd className="px-1 bg-[#0f0a14] border border-[#2a1d10] rounded text-[9px]">Shift</kbd> to run, press <kbd className="px-1 bg-[#0f0a14] border border-[#2a1d10] rounded text-[9px]">E</kbd>/Space near an NPC to talk.</p>
              <p><span className="text-amber-300 font-bold">Studio</span> — pick any character + animation to inspect the sliced frames.</p>
              <p className="text-zinc-500 pt-1">Every sprite is a real frame sliced from the original PNG atlases — no placeholders.</p>
            </div>
            <button onClick={() => setShowHelp(false)} className="mt-4 w-full py-2 rounded bg-amber-500/20 border border-amber-500 text-amber-200 text-[11px] font-bold hover:bg-amber-500/30 transition-colors">
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Canvas */}
        <section className="flex-1 flex items-center justify-center p-3 sm:p-5 min-h-[340px] relative">
          <div className="relative w-full max-w-[820px] aspect-[3/2]">
            {/* Decorative frame */}
            <div className="absolute -inset-1.5 bg-gradient-to-br from-[#c9a04a]/30 via-transparent to-[#8b2c2c]/20 rounded-md blur-[2px]" />
            <div className="absolute -inset-0.5 border border-[#c9a04a]/40 rounded-md" />
            <div
              ref={containerRef}
              className="relative w-full h-full bg-[#0f0a14] border border-[#2a1d10] rounded-md overflow-hidden"
              style={{ imageRendering: 'pixelated' }}
            />
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center text-[11px] text-amber-200/70 pointer-events-none bg-[#0b0710]/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-400 animate-pulse" />
                  slicing sprite sheets…
                </div>
              </div>
            )}
            {/* Mode badge */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[8px] text-amber-200/80 border border-amber-900/40 backdrop-blur-sm tracking-widest uppercase">
              {mode}
            </div>
            {/* Resolution badge */}
            <div className="absolute bottom-2 right-2 text-[8px] text-zinc-600 pointer-events-none tracking-wider">
              480×320 · pixel-perfect
            </div>
          </div>
        </section>

        {/* Side panel */}
        <aside className="w-full lg:w-[320px] border-t lg:border-t-0 lg:border-l border-[#2a1d10] bg-[#0f0a14] flex flex-col">
          <ScrollArea className="flex-1 max-h-[50vh] lg:max-h-[calc(100vh-160px)]">
            <div className="p-4 space-y-4">
              {mode === 'title' && <TitlePanel />}
              {mode === 'explore' && (
                <ExplorePanel
                  playerChar={playerChar}
                  onSelectPlayerChar={selectPlayerChar}
                />
              )}
              {mode === 'studio' && (
                <StudioPanel
                  currentChar={currentChar}
                  currentAnim={currentAnim}
                  onSelectChar={selectChar}
                  onSelectAnim={selectAnim}
                />
              )}
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-[#2a1d10] bg-gradient-to-b from-transparent to-[#16101a] text-[9px] text-zinc-600 leading-relaxed">
            {mode === 'explore'
              ? 'WASD move · Shift run · E talk · Esc title'
              : mode === 'studio'
              ? '←/→ character · 1–0 animation · Space replay'
              : 'Enter / click to begin · S for studio'}
          </div>
        </aside>
      </main>

      {/* ── Sticky footer ── */}
      <footer className="mt-auto border-t border-[#2a1d10] bg-[#16101a] px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        <span className="text-[9px] text-zinc-600 tracking-wide">
          src/app/assets · 24 sprite sheets · texture-atlas hash · phaser 4
        </span>
        <span className="text-[9px] text-zinc-600">
          based on José Rizal's <span className="text-amber-700/70">Noli Me Tangere</span>
        </span>
      </footer>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  Panels                                                          */
/* ──────────────────────────────────────────────────────────────── */

function PanelHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/80">{title}</h2>
      {hint && <span className="text-[9px] text-zinc-600">{hint}</span>}
    </div>
  );
}

function TitlePanel() {
  const cast = CHARACTER_SHEETS.slice(0, 10);
  return (
    <>
      <div className="text-center py-2">
        <div className="text-[11px] text-amber-200 font-bold tracking-[0.25em] mb-1"> dramatis personae </div>
        <div className="text-[9px] text-zinc-500 leading-relaxed">
          The town of San Diego awaits. Speak with its people to uncover the truths buried beneath its soil.
        </div>
      </div>
      <Separator className="bg-[#2a1d10]" />
      <div>
        <PanelHeader title="Cast" />
        <div className="grid grid-cols-1 gap-1">
          {cast.map(c => (
            <div key={c} className="flex items-center justify-between px-2 py-1.5 rounded bg-[#1c1528] border border-[#2a1d10]">
              <span className="text-[10px] text-zinc-300">{CHAR_DISPLAY[c] ?? c}</span>
              <span className="text-[8px] text-zinc-600 italic">{c}.png</span>
            </div>
          ))}
        </div>
      </div>
      <Separator className="bg-[#2a1d10]" />
      <div className="text-[9px] text-zinc-600 leading-relaxed">
        Press <kbd className="px-1 bg-[#0f0a14] border border-[#2a1d10] rounded text-amber-300">Enter</kbd> on the
        title screen, or switch to <span className="text-amber-300/80">Explore</span> to begin.
      </div>
    </>
  );
}

function ExplorePanel({
  playerChar, onSelectPlayerChar,
}: {
  playerChar: string; onSelectPlayerChar: (c: string) => void;
}) {
  const playable = CHARACTER_SHEETS.filter(c => c !== 'animals-assets');
  return (
    <>
      <div className="text-center py-1">
        <div className="text-[11px] text-fuchsia-200 font-bold tracking-[0.2em] mb-1"> SAN DIEGO </div>
        <div className="text-[9px] text-zinc-500 leading-relaxed">
          Choose your avatar, then walk the town. Talk to five townsfolk to complete the chapter.
        </div>
      </div>
      <Separator className="bg-[#2a1d10]" />
      <div>
        <PanelHeader title="Play as" hint="hero" />
        <div className="grid grid-cols-2 gap-1.5">
          {playable.map(c => (
            <button
              key={c}
              onClick={() => onSelectPlayerChar(c)}
              className={`px-2 py-2 rounded text-left transition-all border ${
                playerChar === c
                  ? 'bg-amber-500/15 border-amber-500 text-amber-100 shadow-sm shadow-amber-900/30'
                  : 'bg-[#1c1528] border-[#2a1d10] text-zinc-400 hover:border-amber-700/50 hover:text-amber-200'
              }`}
            >
              <div className="text-[10px] font-bold">{CHAR_DISPLAY[c] ?? c}</div>
              <div className="text-[8px] text-zinc-600 mt-0.5">{c}</div>
            </button>
          ))}
        </div>
      </div>
      <Separator className="bg-[#2a1d10]" />
      <div>
        <PanelHeader title="Controls" />
        <div className="space-y-1 text-[10px]">
          {[
            ['Move', 'W A S D / ←↑↓→'],
            ['Run', 'Hold Shift'],
            ['Talk', 'E or Space'],
            ['Menu', 'Esc'],
            ['Mute', 'M'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center px-2 py-1 rounded bg-[#0f0a14] border border-[#2a1d10]/50">
              <span className="text-zinc-500">{k}</span>
              <span className="text-amber-200/90 font-bold text-[9px]">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <Separator className="bg-[#2a1d10]" />
      <div>
        <PanelHeader title="Townsfolk" />
        <div className="space-y-1">
          {[
            ['María Clara', 'clara', '#f4c8d8'],
            ['Elías', 'elias', '#bfe3c0'],
            ['Fr. Dámaso', 'damaso', '#e8b878'],
            ['Cap. Tiago', 'tiago', '#d8c898'],
            ['Sisa', 'sisa', '#c8c0e8'],
          ].map(([name, key, color]) => (
            <div key={key} className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#0f0a14] border border-[#2a1d10]/50">
              <span className="w-2 h-2 rounded-full" style={{ background: color as string }} />
              <span className="text-[10px] text-zinc-300">{name}</span>
              <span className="ml-auto text-[8px] text-zinc-600">find in town</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function StudioPanel({
  currentChar, currentAnim, onSelectChar, onSelectAnim,
}: {
  currentChar: string;
  currentAnim: string;
  onSelectChar: (c: string) => void;
  onSelectAnim: (a: string) => void;
}) {
  return (
    <>
      <div className="text-center py-1">
        <div className="text-[11px] text-emerald-200 font-bold tracking-[0.2em] mb-1"> SPRITE STUDIO </div>
        <div className="text-[9px] text-zinc-500 leading-relaxed">
          Inspect every sliced frame. Pick a character and play any animation.
        </div>
      </div>
      <Separator className="bg-[#2a1d10]" />
      <div>
        <PanelHeader title="Character" hint="← / →" />
        <div className="grid grid-cols-2 gap-1.5">
          {CHARACTER_SHEETS.map(c => (
            <button
              key={c}
              onClick={() => onSelectChar(c)}
              className={`px-2 py-1.5 rounded text-[10px] text-left transition-all border ${
                currentChar === c
                  ? 'bg-amber-500/15 border-amber-500 text-amber-200'
                  : 'bg-[#1c1528] border-[#2a1d10] text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <Separator className="bg-[#2a1d10]" />
      <div>
        <PanelHeader title="Animation" hint="1 – 0" />
        <div className="grid grid-cols-2 gap-1.5">
          {ANIM_ORDER.map(a => (
            <button
              key={a}
              onClick={() => onSelectAnim(a)}
              className={`px-2 py-1.5 rounded text-[10px] text-left transition-all border flex items-center justify-between ${
                currentAnim === a
                  ? 'bg-fuchsia-500/15 border-fuchsia-500 text-fuchsia-200'
                  : 'bg-[#1c1528] border-[#2a1d10] text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              }`}
            >
              <span>{ANIM_LABELS[a]}</span>
              <span className="text-[8px] text-zinc-600">{ANIM_KEYS[a]}</span>
            </button>
          ))}
        </div>
        <p className="text-[9px] text-zinc-600 mt-2 leading-relaxed">
          Non-looping anims auto-return to idle.
        </p>
      </div>
      <Separator className="bg-[#2a1d10]" />
      <div className="space-y-1.5 text-[10px]">
        <div className="flex justify-between">
          <span className="text-zinc-500">character</span>
          <span className="text-amber-200">{CHAR_DISPLAY[currentChar] ?? currentChar}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">animation</span>
          <span className="text-fuchsia-300">{ANIM_LABELS[currentAnim]}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">sheets loaded</span>
          <span className="text-zinc-300">24</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">total frames</span>
          <span className="text-zinc-300">2,554</span>
        </div>
      </div>
    </>
  );
}
