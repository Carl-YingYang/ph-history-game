'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStory } from '@/story/StoryProvider';
import { useAudio } from '@/components/audio/AudioManager';

const introText = [
  'In the year 1887, a book was published in Berlin that would change a nation forever.',
  'Its author, a young Filipino doctor named José Rizal, had written it in exile — a novel that held a mirror up to the cruelty of Spanish colonial rule.',
  'He called it Noli Me Tangere — "Touch Me Not."',
  'The book was banned. Its author was hunted. And on a December morning in 1896, Rizal was executed by firing squad on the fields of Bagumbayan.',
  'But the words could not be killed. They lit a fire that became a revolution.',
  'This is the story of that book. Walk with us through its pages.',
];

export function Intro() {
  const { selectChapter, save, returnToMenu } = useStory();
  const { playMusic, playSfx } = useAudio();
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    playMusic('nostalgic');
  }, [playMusic]);

  const advance = () => {
    if (index < introText.length - 1) {
      setIndex((i) => i + 1);
      playSfx('page-turn');
    } else {
      setDone(true);
      playSfx('scene-transition');
      setTimeout(() => {
        selectChapter('ch1-pagbabalik');
      }, 1200);
    }
  };

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        advance();
      }
      if (e.code === 'Escape') {
        returnToMenu();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      onClick={advance}
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-stone-950 to-amber-950/20" />

      {/* Floating embers */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-300/50"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-10px',
            width: 2 + Math.random() * 2,
            height: 2 + Math.random() * 2,
          }}
          animate={{
            y: [0, -window.innerHeight - 50],
            x: [0, (Math.random() - 0.5) * 60],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 8,
            delay: Math.random() * 8,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Text */}
      <div className="relative z-10 max-w-2xl px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <p className="font-serif text-xl sm:text-2xl md:text-3xl text-amber-50/95 leading-relaxed italic">
              {introText[index]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex gap-2 justify-center mt-12">
          {introText.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index
                  ? 'w-8 bg-amber-300'
                  : i < index
                    ? 'w-2 bg-amber-500/60'
                    : 'w-2 bg-stone-700'
              }`}
            />
          ))}
        </div>

        {/* Continue hint */}
        <motion.div
          className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 text-amber-300/40 text-sm font-serif"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {index < introText.length - 1 ? 'Click / Space to continue' : 'Click to begin →'}
        </motion.div>
      </div>

      {/* Skip button */}
      <button
        className="absolute top-4 right-4 z-20 text-stone-500 hover:text-amber-200 text-xs uppercase tracking-widest font-serif transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          playSfx('ui-click');
          selectChapter('ch1-pagbabalik');
        }}
      >
        Skip Intro →
      </button>

      {/* Fade to black when done */}
      <AnimatePresence>
        {done && (
          <motion.div
            className="absolute inset-0 z-50 bg-black pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
