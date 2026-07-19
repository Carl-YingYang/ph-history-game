'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Choice } from '@/story/types';
import { useAudio } from '@/components/audio/AudioManager';

interface ChoicePickerProps {
  choices: Choice[];
  onPick: (choice: Choice) => void;
}

export function ChoicePicker({ choices, onPick }: ChoicePickerProps) {
  const { playSfx } = useAudio();

  return (
    <motion.div
      className="absolute inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-2xl px-6 space-y-3">
        <motion.div
          className="text-center text-amber-200/70 text-sm uppercase tracking-[0.3em] mb-4 font-serif"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          — Your Choice —
        </motion.div>
        {choices.map((c, i) => (
          <motion.button
            key={c.id}
            className="block w-full text-left px-6 py-4 rounded-xl border border-amber-200/20 backdrop-blur-md bg-stone-900/70 hover:bg-amber-900/30 hover:border-amber-300/50 transition-colors group"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease: 'backOut' }}
            onMouseEnter={() => playSfx('ui-hover')}
            onClick={() => {
              playSfx('choice-select');
              onPick(c);
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-amber-400/60 font-serif text-lg group-hover:text-amber-300 group-hover:translate-x-1 transition-transform">
                ❯
              </span>
              <span className="text-amber-50/95 font-serif text-base sm:text-lg">
                {c.text}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
