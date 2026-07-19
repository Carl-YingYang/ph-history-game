'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStory } from '@/story/StoryProvider';
import { useAudio } from '@/components/audio/AudioManager';
import { CHARACTERS, CharacterId } from '@/story/types';

const CHARACTER_ORDER: CharacterId[] = [
  'ibarra', 'maria-clara', 'damaso', 'tiago', 'elias', 'sisa',
];

export function CharacterGallery() {
  const { returnToMenu, save } = useStory();
  const { playSfx } = useAudio();
  const [selected, setSelected] = useState<CharacterId | null>(null);

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/30" />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 20%, rgba(217,119,6,0.15) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col px-4 sm:px-6 py-8 sm:py-12 max-w-5xl mx-auto w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-amber-300/60 text-xs uppercase tracking-[0.4em] font-serif mb-2">
            Mga Tauhan
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-amber-50 font-bold">
            Character Gallery
          </h2>
          <p className="text-stone-400 mt-2 font-serif italic">
            The souls of Noli Me Tangere
          </p>
          <motion.div
            className="mt-4 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent w-48 mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </motion.div>

        {/* Character grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {CHARACTER_ORDER.map((id, i) => {
            const meta = CHARACTERS[id];
            if (!meta || !meta.portrait) return null;
            const isSelected = selected === id;
            return (
              <motion.button
                key={id}
                className={`relative rounded-2xl border overflow-hidden transition-all text-left group ${
                  isSelected
                    ? 'border-amber-300/60 ring-2 ring-amber-400/40'
                    : 'border-amber-200/15 hover:border-amber-300/40'
                }`}
                style={{
                  background:
                    'linear-gradient(180deg, rgba(30,22,15,0.7) 0%, rgba(15,10,20,0.9) 100%)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => {
                  playSfx('ui-click');
                  setSelected(isSelected ? null : id);
                }}
              >
                {/* Portrait */}
                <div className="relative h-40 sm:h-52 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={meta.portrait}
                    alt={meta.name}
                    className="w-full h-full object-cover object-top transition-transform group-hover:scale-105"
                    style={{
                      maskImage: 'linear-gradient(180deg, black 50%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(180deg, black 50%, transparent 100%)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent" />
                </div>

                {/* Name */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-serif text-amber-50 font-semibold text-sm sm:text-base">
                    {meta.name}
                  </h3>
                  <div className="text-amber-300/50 text-xs font-serif mt-0.5">
                    {meta.voice === 'female' ? 'Babae · Female' : 'Lalaki · Male'}
                  </div>
                </div>

                {/* Expand indicator */}
                <motion.div
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-amber-300/70 text-xs"
                  animate={{ rotate: isSelected ? 45 : 0 }}
                >
                  +
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected character detail */}
        <AnimatePresence>
          {selected && CHARACTERS[selected] && (
            <motion.div
              key={selected}
              className="rounded-2xl border border-amber-200/20 backdrop-blur-md bg-stone-900/70 overflow-hidden shadow-2xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Large portrait */}
                <div className="sm:w-48 h-56 sm:h-auto flex-shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={CHARACTERS[selected].portrait}
                    alt={CHARACTERS[selected].name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 p-5 sm:p-6">
                  <div className="text-amber-300/60 text-xs uppercase tracking-widest font-serif mb-1">
                    Character Profile
                  </div>
                  <h3 className="font-serif text-2xl text-amber-50 font-bold mb-3">
                    {CHARACTERS[selected].name}
                  </h3>
                  <div className="h-px bg-gradient-to-r from-amber-300/30 to-transparent mb-4" />
                  <p className="text-amber-50/85 font-serif text-base leading-relaxed">
                    {CHARACTERS[selected].bio}
                  </p>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 rounded-full bg-amber-800/30 border border-amber-300/20 text-amber-200 text-xs font-serif">
                      {CHARACTERS[selected].voice === 'female' ? 'Babae' : 'Lalaki'}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-stone-800/50 border border-stone-600/30 text-stone-300 text-xs font-serif">
                      {CHARACTERS[selected].defaultExpression}
                    </span>
                    {save.completedChapters.length > 0 && (
                      <span className="px-3 py-1 rounded-full bg-emerald-800/30 border border-emerald-300/20 text-emerald-200 text-xs font-serif">
                        ✓ Discovered
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back button */}
        <div className="mt-6 text-center">
          <button
            className="px-6 py-3 rounded-xl border border-stone-600 text-stone-300 hover:bg-stone-800/50 transition-colors font-serif"
            onClick={() => {
              playSfx('ui-click');
              returnToMenu();
            }}
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
