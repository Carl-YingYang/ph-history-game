'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStory } from '@/story/StoryProvider';
import { useAudio } from '@/components/audio/AudioManager';

interface Props {
  chapterTitle: string;
  chapterNumber: number;
  sceneIndex: number;
  totalScenes: number;
  hasNote: boolean;
  onOpenNote: () => void;
}

export function SceneHUD({
  chapterTitle,
  chapterNumber,
  sceneIndex,
  totalScenes,
  hasNote,
  onOpenNote,
}: Props) {
  const {
    returnToMenu,
    toggleHistory,
    showHistory,
    toggleMute,
    muted,
    toggleAutoMode,
    autoMode,
    save,
    toggleSettings,
  } = useStory();

  // Global keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key.toLowerCase()) {
        case 'm': toggleMute(); break;
        case 'a': toggleAutoMode(); break;
        case 'h': toggleHistory(); break;
        case 'escape': returnToMenu(); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleMute, toggleAutoMode, toggleHistory, returnToMenu]);
  const { playSfx, stopMusic, stopAmbient } = useAudio();

  const handleMenu = () => {
    playSfx('ui-click');
    stopMusic();
    stopAmbient();
    returnToMenu();
  };

  return (
    <>
      {/* Top-left: chapter + scene info */}
      <motion.div
        className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 pointer-events-none"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-amber-200/10">
          <div className="text-amber-300/70 text-[10px] uppercase tracking-widest font-serif">
            Kabanata {chapterNumber}
          </div>
          <div className="text-amber-50/90 text-sm font-serif font-semibold">
            {chapterTitle}
          </div>
          {/* Scene progress dots */}
          <div className="flex gap-1 mt-1">
            {Array.from({ length: totalScenes }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === sceneIndex
                    ? 'w-4 bg-amber-300'
                    : i < sceneIndex
                      ? 'w-1.5 bg-amber-500/60'
                      : 'w-1.5 bg-stone-600/50'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top-right: controls */}
      <motion.div
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-1.5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Historical note button */}
        {hasNote && (
          <HudButton
            label="Note"
            icon="📜"
            active={false}
            pulse
            onClick={() => {
              playSfx('ui-click');
              onOpenNote();
            }}
          />
        )}
        {/* History */}
        <HudButton
          label="History"
          icon="💬"
          active={showHistory}
          onClick={() => {
            playSfx('ui-click');
            toggleHistory();
          }}
        />
        {/* Auto mode */}
        <HudButton
          label="Auto"
          icon="⏩"
          active={autoMode}
          onClick={() => {
            playSfx('ui-click');
            toggleAutoMode();
          }}
        />
        {/* Mute */}
        <HudButton
          label={muted ? 'Unmute' : 'Mute'}
          icon={muted ? '🔇' : '🔊'}
          active={false}
          onClick={() => {
            playSfx('ui-click');
            toggleMute();
          }}
        />
        {/* Settings */}
        <HudButton
          label="Settings"
          icon="⚙"
          active={false}
          onClick={() => {
            playSfx('ui-click');
            toggleSettings();
          }}
        />
        {/* Menu */}
        <HudButton
          label="Menu"
          icon="⌂"
          active={false}
          onClick={handleMenu}
        />
      </motion.div>

      {/* Player name (bottom-left, subtle) */}
      <motion.div
        className="absolute bottom-3 left-3 z-20 text-stone-400/60 text-xs font-serif pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {save.playerName}
      </motion.div>
    </>
  );
}

function HudButton({
  label,
  icon,
  active,
  pulse,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  pulse?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      className={`relative px-2.5 py-2 rounded-lg backdrop-blur-sm border transition-all ${
        active
          ? 'bg-amber-700/60 border-amber-300/50 text-amber-50'
          : 'bg-black/40 border-amber-200/10 text-stone-300 hover:bg-black/60 hover:text-amber-100'
      }`}
      whileTap={{ scale: 0.92 }}
      onMouseEnter={() => {}}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      <span className="text-sm">{icon}</span>
      <span className="hidden sm:inline ml-1.5 text-xs font-serif">{label}</span>
      {pulse && (
        <motion.span
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
