'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStory } from '@/story/StoryProvider';
import { useAudio } from '@/components/audio/AudioManager';

export function SettingsPanel() {
  const { toggleSettings, muted, toggleMute, autoMode, toggleAutoMode } = useStory();
  const { playSfx } = useAudio();
  const [textSpeed, setTextSpeed] = useState(28); // ms per char
  const [volume, setVolume] = useState(70); // 0-100

  const handleTextSpeed = (val: 'slow' | 'normal' | 'fast') => {
    const speeds: Record<string, number> = { slow: 45, normal: 28, fast: 12 };
    setTextSpeed(speeds[val]);
    playSfx('ui-click');
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('noor_text_speed', String(speeds[val]));
    }
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    // Store for AudioManager
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('noor_volume', String(v));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          playSfx('ui-click');
          toggleSettings();
        }}
      >
        <motion.div
          className="relative w-full max-w-lg rounded-2xl border border-amber-200/20 backdrop-blur-xl shadow-2xl overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(30,22,15,0.97) 0%, rgba(20,14,10,0.99) 100%)',
          }}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 22 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar */}
          <div className="h-1 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-amber-300/60 text-xs uppercase tracking-[0.3em] font-serif">
                  ⚙️ Mga Kagamitan
                </div>
                <h3 className="font-serif text-2xl text-amber-50 font-semibold">
                  Settings
                </h3>
              </div>
              <button
                className="text-stone-400 hover:text-amber-200 text-2xl leading-none transition-colors"
                onClick={() => {
                  playSfx('ui-click');
                  toggleSettings();
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Settings sections */}
            <div className="space-y-6">
              {/* Text Speed */}
              <div>
                <label className="block text-amber-200/80 text-sm uppercase tracking-widest font-serif mb-3">
                  Text Speed
                </label>
                <div className="flex gap-2">
                  {[
                    { key: 'slow', label: 'Mabagal', emoji: '🐢' },
                    { key: 'normal', label: 'Katamtaman', emoji: '📖' },
                    { key: 'fast', label: 'Mabilis', emoji: '⚡' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      className={`flex-1 px-3 py-3 rounded-xl border font-serif text-sm transition-all ${
                        (opt.key === 'slow' && textSpeed === 45) || (opt.key === 'normal' && textSpeed === 28) || (opt.key === 'fast' && textSpeed === 12)
                          ? 'border-amber-300/60 bg-amber-800/40 text-amber-50'
                          : 'border-stone-600/40 bg-stone-950/40 text-stone-300 hover:bg-stone-800/50'
                      }`}
                      onClick={() => handleTextSpeed(opt.key as 'slow' | 'normal' | 'fast')}
                    >
                      <div className="text-lg mb-1">{opt.emoji}</div>
                      <div>{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume */}
              <div>
                <label className="block text-amber-200/80 text-sm uppercase tracking-widest font-serif mb-3">
                  Volume · {volume}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => handleVolume(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgba(217,119,6,0.7) 0%, rgba(217,119,6,0.7) ${volume}%, rgba(41,37,36,0.6) ${volume}%, rgba(41,37,36,0.6) 100%)`,
                  }}
                />
                <div className="flex justify-between text-stone-500 text-xs mt-1 font-serif">
                  <span>🔇 Hina</span>
                  <span>Lakas 🔊</span>
                </div>
              </div>

              {/* Auto Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-amber-200/80 text-sm uppercase tracking-widest font-serif">
                    Auto-Advance
                  </div>
                  <div className="text-stone-400 text-xs font-serif mt-0.5">
                    Automatically advance dialogue
                  </div>
                </div>
                <button
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    autoMode ? 'bg-amber-600' : 'bg-stone-700'
                  }`}
                  onClick={() => {
                    playSfx('ui-click');
                    toggleAutoMode();
                  }}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                    animate={{ left: autoMode ? '30px' : '4px' }}
                    transition={{ type: 'spring', damping: 20 }}
                  />
                </button>
              </div>

              {/* Mute */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-amber-200/80 text-sm uppercase tracking-widest font-serif">
                    Mute All Audio
                  </div>
                  <div className="text-stone-400 text-xs font-serif mt-0.5">
                    Silence music, ambient, and SFX
                  </div>
                </div>
                <button
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    muted ? 'bg-amber-600' : 'bg-stone-700'
                  }`}
                  onClick={() => {
                    playSfx('ui-click');
                    toggleMute();
                  }}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                    animate={{ left: muted ? '30px' : '4px' }}
                    transition={{ type: 'spring', damping: 20 }}
                  />
                </button>
              </div>

              {/* Keyboard shortcuts */}
              <div className="pt-4 border-t border-amber-300/10">
                <div className="text-amber-300/60 text-xs uppercase tracking-widest font-serif mb-3">
                  ⌨️ Keyboard Shortcuts
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    ['Space / Enter', 'Advance dialogue'],
                    ['M', 'Toggle mute'],
                    ['A', 'Toggle auto-mode'],
                    ['H', 'Toggle history'],
                    ['Esc', 'Return to menu'],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex items-center gap-2">
                      <kbd className="px-2 py-1 rounded bg-stone-800 border border-stone-600/50 text-amber-200 text-xs font-mono">
                        {key}
                      </kbd>
                      <span className="text-stone-400 text-xs font-serif">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
