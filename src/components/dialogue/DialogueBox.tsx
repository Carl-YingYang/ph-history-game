'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DialogueLine, CHARACTERS } from '@/story/types';
import { useAudio } from '@/components/audio/AudioManager';

interface DialogueBoxProps {
  line: DialogueLine;
  onComplete: () => void; // called when typewriter finishes
  onAdvance: () => void; // called when user clicks to advance
  isLastLine: boolean;
  hasChoices: boolean;
}

export function DialogueBox({ line, onComplete, onAdvance, isLastLine, hasChoices }: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const { playSfx, isMuted } = useAudio();
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const meta = CHARACTERS[line.speaker];
  const displayName = line.name || meta?.name || 'Narrator';
  const isNarrator = line.speaker === 'narrator';

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    setShowFull(false);
    indexRef.current = 0;

    const fullText = line.text;
    const speed = isNarrator ? 22 : 28; // ms per char

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      const next = fullText.slice(0, indexRef.current);
      setDisplayedText(next);

      // Voice blip every 2 chars
      if (indexRef.current % 2 === 0 && indexRef.current <= fullText.length) {
        const voice = line.voice || meta?.voice || 'narrator';
        if (!isMuted) {
          playSfx(voice === 'female' ? 'blip-female' : voice === 'male' ? 'blip-male' : 'blip-narrator');
        }
      }

      if (indexRef.current >= fullText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsComplete(true);
        onComplete();
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line.text]);

  // Click handler: if not complete, skip to full; if complete, advance
  const handleClick = useCallback(() => {
    if (!isComplete) {
      // Skip typewriter
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayedText(line.text);
      setIsComplete(true);
      onComplete();
      setShowFull(true);
    } else {
      // Advance
      onAdvance();
    }
  }, [isComplete, line.text, onComplete, onAdvance]);

  // Keyboard: Space / Enter
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleClick();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClick]);

  const portraitSrc = meta?.portrait;

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pb-4 sm:pb-6 cursor-pointer"
      onClick={handleClick}
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="relative w-full max-w-4xl">
        {/* Portrait — floats above the box, left side */}
        {!isNarrator && portraitSrc && (
          <motion.div
            className="absolute -top-24 left-2 sm:-top-32 sm:left-6 z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
          >
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-amber-200/80 shadow-2xl ring-2 ring-amber-500/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={portraitSrc}
                alt={displayName}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
            </div>
          </motion.div>
        )}

        {/* Name plate */}
        <div className="relative">
          <motion.div
            className="inline-block absolute -top-4 left-4 sm:left-32 z-20 px-4 py-1.5 rounded-t-lg bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 shadow-lg border border-amber-300/30"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <span className="text-amber-50 font-serif text-sm sm:text-base tracking-wide font-semibold">
              {displayName}
            </span>
          </motion.div>

          {/* Dialogue box */}
          <div
            className="relative px-5 pt-6 pb-8 sm:px-8 sm:pt-7 sm:pb-10 rounded-2xl border border-amber-200/15 backdrop-blur-md shadow-2xl"
            style={{
              background:
                isNarrator
                  ? 'linear-gradient(180deg, rgba(20,15,30,0.85) 0%, rgba(15,10,25,0.92) 100%)'
                  : 'linear-gradient(180deg, rgba(30,22,15,0.85) 0%, rgba(20,14,10,0.92) 100%)',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,150,0.1)',
            }}
          >
            {/* Top decorative line */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />

            {/* Text */}
            <div
              className={`min-h-[4.5rem] sm:min-h-[5rem] font-serif text-base sm:text-lg leading-relaxed ${
                isNarrator ? 'text-violet-100/90 italic' : 'text-amber-50/95'
              }`}
            >
              {displayedText}
              {!isComplete && (
                <motion.span
                  className="inline-block w-2 h-4 sm:h-5 ml-0.5 bg-amber-300/80 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              )}
            </div>

            {/* Continue indicator */}
            {isComplete && !hasChoices && (
              <motion.div
                className="absolute bottom-2 right-4 flex items-center gap-1.5 text-amber-300/70 text-xs sm:text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="hidden sm:inline">{isLastLine ? 'Tap to continue' : 'Space / Click'}</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  ▶
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
