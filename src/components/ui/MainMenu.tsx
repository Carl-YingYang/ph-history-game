'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStory } from '@/story/StoryProvider';
import { useAudio } from '@/components/audio/AudioManager';
import { hasSave } from '@/lib/save';
import { ALL_CHAPTERS } from '@/data/chapters';

export function MainMenu() {
  const { startNewGame, continueGame, goToChapterSelect, save, resetProgress, finishStory } = useStory();
  const { playMusic, playSfx } = useAudio();
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState('');
  const [hasExistingSave, setHasExistingSave] = useState(false);

  React.useEffect(() => {
    setHasExistingSave(hasSave());
    playMusic('menu');
  }, [playMusic]);

  const handleNewGame = () => {
    playSfx('ui-click');
    setShowNameInput(true);
  };

  const handleStart = () => {
    playSfx('scene-transition');
    startNewGame(name);
  };

  const handleContinue = () => {
    playSfx('ui-click');
    continueGame();
  };

  const handleChapters = () => {
    playSfx('ui-click');
    goToChapterSelect();
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Atmospheric layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/40" />

      {/* Floating embers */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-300/40"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-10px',
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, (Math.random() - 0.5) * 80],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            delay: Math.random() * 8,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Title decoration */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <motion.div
          className="text-amber-300/60 text-xs sm:text-sm uppercase tracking-[0.5em] mb-4 font-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          José Rizal · 1887
        </motion.div>
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-amber-50 mb-3 tracking-wide">
          Noli Me
          <span className="block bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent">
            Tangere
          </span>
        </h1>
        <motion.p
          className="text-amber-200/70 text-base sm:text-lg font-serif italic mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          "The novel that cost a man his life, and gave a nation its soul."
        </motion.p>
        <motion.div
          className="text-stone-400/60 text-xs sm:text-sm uppercase tracking-[0.3em] mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          An Interactive Cinematic Experience
        </motion.div>
      </motion.div>

      {/* Menu buttons */}
      <AnimatePresence mode="wait">
        {!showNameInput ? (
          <motion.div
            key="menu"
            className="relative z-10 mt-12 flex flex-col gap-3 w-full max-w-xs px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            <MenuButton
              label={hasExistingSave ? 'New Journey' : 'Begin'}
              sublabel={hasExistingSave ? 'Start a fresh playthrough' : 'Start the story'}
              onClick={handleNewGame}
              primary
            />
            {hasExistingSave && (
              <MenuButton
                label="Continue"
                sublabel={`Chapter ${(save.completionPercentage).toFixed(0)}% complete`}
                onClick={handleContinue}
              />
            )}
            <MenuButton
              label="Chapter Select"
              sublabel={`${ALL_CHAPTERS.length} chapters available`}
              onClick={handleChapters}
            />
            {save.completionPercentage > 0 && (
              <MenuButton
                label="View Certificate"
                sublabel="See your achievement"
                onClick={() => {
                  playSfx('ui-click');
                  finishStory();
                }}
              />
            )}
            {hasExistingSave && (
              <button
                className="mt-4 text-stone-500 hover:text-red-400 text-xs uppercase tracking-widest transition-colors"
                onClick={() => {
                  if (confirm('Erase all progress? This cannot be undone.')) {
                    resetProgress();
                    setHasExistingSave(false);
                  }
                }}
              >
                Reset Progress
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="name-input"
            className="relative z-10 mt-12 w-full max-w-md px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <label className="block text-amber-200/80 font-serif text-sm uppercase tracking-widest mb-3 text-center">
              What is your name, traveler?
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) handleStart();
              }}
              placeholder="Enter your name..."
              maxLength={24}
              className="w-full px-5 py-4 rounded-xl bg-stone-900/80 border border-amber-300/30 text-amber-50 font-serif text-lg text-center focus:outline-none focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/20 transition-all"
            />
            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 px-5 py-3 rounded-xl border border-stone-600 text-stone-300 hover:bg-stone-800/50 transition-colors font-serif"
                onClick={() => {
                  playSfx('ui-click');
                  setShowNameInput(false);
                }}
              >
                Back
              </button>
              <button
                className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 text-amber-50 font-serif font-semibold hover:from-amber-600 hover:to-amber-500 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!name.trim()}
                onClick={handleStart}
              >
                Begin →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer credit */}
      <div className="absolute bottom-3 left-0 right-0 text-center text-stone-500/60 text-xs font-serif">
        A Project NOOR experience · Built with Next.js + Framer Motion
      </div>
    </div>
  );
}

function MenuButton({
  label,
  sublabel,
  onClick,
  primary,
}: {
  label: string;
  sublabel: string;
  onClick: () => void;
  primary?: boolean;
}) {
  const { playSfx } = useAudio();
  return (
    <motion.button
      className={`relative w-full px-6 py-4 rounded-xl border backdrop-blur-md overflow-hidden group ${
        primary
          ? 'border-amber-300/40 bg-gradient-to-r from-amber-800/40 to-amber-700/30 hover:from-amber-700/50 hover:to-amber-600/40'
          : 'border-stone-600/40 bg-stone-900/50 hover:bg-stone-800/60 hover:border-amber-300/30'
      } transition-all`}
      onMouseEnter={() => playSfx('ui-hover')}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative z-10 text-left">
        <div
          className={`font-serif text-lg sm:text-xl ${
            primary ? 'text-amber-50' : 'text-stone-100'
          }`}
        >
          {label}
        </div>
        <div className="text-stone-400 text-xs sm:text-sm">{sublabel}</div>
      </div>
      {/* Shine sweep */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"
        whileHover={{ translateX: '100%' }}
        transition={{ duration: 0.8 }}
      />
    </motion.button>
  );
}
