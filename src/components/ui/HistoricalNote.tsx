'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HistoricalNote, NoteType } from '@/story/types';
import { useAudio } from '@/components/audio/AudioManager';

interface Props {
  note: HistoricalNote;
  onClose: () => void;
}

const typeConfig: Record<NoteType, { icon: string; label: string; color: string }> = {
  context: { icon: '📜', label: 'Historical Context', color: 'amber' },
  'did-you-know': { icon: '✨', label: 'Did You Know?', color: 'violet' },
  vocabulary: { icon: '📖', label: 'Vocabulary', color: 'emerald' },
  biography: { icon: '🎭', label: 'Character Biography', color: 'rose' },
  timeline: { icon: '⏳', label: 'Historical Timeline', color: 'sky' },
};

export function HistoricalNoteCard({ note, onClose }: Props) {
  const { playSfx } = useAudio();
  const cfg = typeConfig[note.type];

  React.useEffect(() => {
    playSfx('note-appear');
  }, [playSfx]);

  return (
    <motion.div
      className="absolute inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-amber-200/20 backdrop-blur-xl shadow-2xl"
        style={{
          background:
            'linear-gradient(180deg, rgba(30,22,15,0.95) 0%, rgba(20,14,10,0.98) 100%)',
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top bar */}
        <div className="h-1 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 rounded-t-2xl" />

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{cfg.icon}</span>
              <div>
                <div className={`text-${cfg.color}-300 text-xs uppercase tracking-widest font-serif`}>
                  {cfg.label}
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-amber-50 font-semibold">
                  {note.title}
                </h3>
              </div>
            </div>
            <button
              className="text-stone-400 hover:text-amber-200 text-2xl leading-none"
              onClick={() => {
                playSfx('ui-click');
                onClose();
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent mb-5" />

          {/* Body */}
          <div className="prose prose-invert max-w-none">
            <p className="text-amber-50/90 font-serif text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {note.body}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-stone-500 text-xs italic font-serif">
              Tap anywhere to return to the story
            </div>
            <button
              className="px-5 py-2 rounded-lg bg-amber-800/60 border border-amber-300/30 text-amber-50 font-serif text-sm hover:bg-amber-700/60 transition-colors"
              onClick={() => {
                playSfx('ui-click');
                onClose();
              }}
            >
              Continue Story →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
