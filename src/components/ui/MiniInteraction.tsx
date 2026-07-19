'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MiniInteraction } from '@/story/types';
import { useAudio } from '@/components/audio/AudioManager';

interface Props {
  interaction: MiniInteraction;
  onComplete: () => void;
}

export function MiniInteractionPanel({ interaction, onComplete }: Props) {
  const { playSfx } = useAudio();
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [revealedSegments, setRevealedSegments] = useState(0);

  const allRevealed =
    interaction.type === 'inspect'
      ? interaction.hotspots?.every((_, i) => revealed.has(i))
      : interaction.segments
        ? revealedSegments >= interaction.segments.length
        : true;

  const handleHotspot = (i: number) => {
    if (revealed.has(i)) return;
    playSfx('note-appear');
    setRevealed((prev) => new Set([...prev, i]));
  };

  const handleRevealSegment = () => {
    if (!interaction.segments) return;
    playSfx('page-turn');
    setRevealedSegments((s) => Math.min(s + 1, interaction.segments!.length));
  };

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Prompt */}
      <motion.div
        className="mb-6 text-center max-w-xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="text-amber-300/60 text-xs uppercase tracking-[0.4em] font-serif mb-2">
          ✦ Explore ✦
        </div>
        <p className="text-amber-50/95 font-serif text-base sm:text-lg">
          {interaction.prompt}
        </p>
      </motion.div>

      {/* Inspect interaction — hotspots overlaid on background */}
      {interaction.type === 'inspect' && interaction.hotspots && (
        <div className="relative w-full max-w-4xl aspect-video rounded-xl border border-amber-300/20 bg-stone-950/50 backdrop-blur-sm overflow-hidden">
          {/* Hotspots */}
          {interaction.hotspots.map((h, i) => {
            const isRevealed = revealed.has(i);
            return (
              <button
                key={i}
                className="absolute group focus:outline-none"
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handleHotspot(i)}
              >
                {/* Pulsing ring */}
                {!isRevealed && (
                  <motion.span
                    className="absolute inset-0 -m-4 rounded-full border-2 border-amber-300/60"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <motion.span
                  className={`block w-6 h-6 rounded-full ${
                    isRevealed ? 'bg-emerald-400' : 'bg-amber-300'
                  } shadow-lg`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                />
                {/* Label on hover */}
                <span className="absolute left-1/2 -translate-x-1/2 top-8 whitespace-nowrap text-xs text-amber-100 bg-stone-900/90 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {isRevealed ? '✓ Inspected' : h.label}
                </span>
              </button>
            );
          })}

          {/* Revealed text */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <AnimatePresence>
              {interaction.hotspots.map((h, i) =>
                revealed.has(i) ? (
                  <motion.div
                    key={i}
                    className="bg-stone-900/85 backdrop-blur-sm rounded-lg p-3 border border-amber-300/20"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <div className="text-amber-300 text-xs uppercase tracking-widest font-serif mb-1">
                      {h.label}
                    </div>
                    <p className="text-amber-50/90 text-sm font-serif">{h.reveal}</p>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>

          {/* Progress */}
          <div className="absolute top-3 right-3 text-amber-200/60 text-xs font-serif">
            {revealed.size} / {interaction.hotspots.length}
          </div>
        </div>
      )}

      {/* Reveal interaction — progressive text */}
      {interaction.type === 'reveal' && interaction.segments && (
        <div className="w-full max-w-2xl">
          <div className="rounded-xl border border-amber-300/20 bg-stone-950/70 backdrop-blur-sm p-6 min-h-[200px]">
            <div className="prose prose-invert">
              {interaction.segments.slice(0, revealedSegments).map((seg, i) => (
                <motion.p
                  key={i}
                  className="text-amber-50/90 font-serif text-base sm:text-lg leading-relaxed mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {seg}
                </motion.p>
              ))}
              {revealedSegments === 0 && (
                <p className="text-stone-400 italic font-serif">
                  Click below to reveal the hidden notes...
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-3">
            {revealedSegments < interaction.segments.length ? (
              <button
                className="px-6 py-3 rounded-xl bg-amber-800/60 border border-amber-300/40 text-amber-50 font-serif hover:bg-amber-700/60 transition-colors"
                onClick={handleRevealSegment}
              >
                Reveal note ({revealedSegments}/{interaction.segments.length}) →
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Complete button */}
      {allRevealed && (
        <motion.button
          className="mt-6 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 text-amber-50 font-serif text-lg hover:from-amber-600 hover:to-amber-500 transition-all shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => {
            playSfx('scene-transition');
            onComplete();
          }}
        >
          {interaction.completeText} →
        </motion.button>
      )}
    </motion.div>
  );
}
