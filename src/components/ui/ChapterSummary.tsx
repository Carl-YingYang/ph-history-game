'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStory } from '@/story/StoryProvider';
import { useAudio } from '@/components/audio/AudioManager';

export function ChapterSummary() {
  const { activeChapter, goToQuiz, returnToMenu } = useStory();
  const { playSfx, playMusic } = useAudio();

  React.useEffect(() => {
    playMusic('warm');
  }, [playMusic]);

  if (!activeChapter) return null;
  const s = activeChapter.summary;

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center overflow-y-auto">
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/30" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 20%, rgba(217,119,6,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(120,53,15,0.2) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 w-full max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-amber-300/60 text-xs uppercase tracking-[0.4em] font-serif mb-2">
            Kabanata {activeChapter.number} · Tapos na
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-amber-50 font-bold">
            {activeChapter.title}
          </h2>
          <p className="text-stone-400 italic mt-1 font-serif">{activeChapter.subtitle}</p>
          <motion.div
            className="mt-4 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent w-48 mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </motion.div>

        {/* Summary */}
        <motion.div
          className="rounded-2xl border border-amber-200/20 bg-stone-900/60 backdrop-blur-md p-6 sm:p-8 mb-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-serif text-amber-300/80 text-sm uppercase tracking-widest mb-3">
            📜 Buod · Summary
          </h3>
          <p className="text-amber-50/90 font-serif text-base sm:text-lg leading-relaxed">
            {s.summary}
          </p>
        </motion.div>

        {/* Two-column grid */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Important characters */}
          <motion.div
            className="rounded-2xl border border-amber-200/15 bg-stone-950/50 backdrop-blur-sm p-5 sm:p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-serif text-rose-300/80 text-sm uppercase tracking-widest mb-3">
              🎭 Mga Tauhan · Characters
            </h3>
            <ul className="space-y-3">
              {s.importantCharacters.map((c, i) => (
                <li key={i}>
                  <div className="text-amber-50 font-serif font-semibold text-sm">
                    {c.name}
                  </div>
                  <div className="text-stone-400 text-xs font-serif italic">
                    {c.role}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Historical events */}
          <motion.div
            className="rounded-2xl border border-amber-200/15 bg-stone-950/50 backdrop-blur-sm p-5 sm:p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-serif text-sky-300/80 text-sm uppercase tracking-widest mb-3">
              ⏳ Pangyayari · Historical Events
            </h3>
            <ul className="space-y-2">
              {s.historicalEvents.map((e, i) => (
                <li key={i} className="text-amber-50/85 text-sm font-serif flex gap-2">
                  <span className="text-amber-400/60">•</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Lessons learned */}
          <motion.div
            className="rounded-2xl border border-amber-200/15 bg-stone-950/50 backdrop-blur-sm p-5 sm:p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-serif text-emerald-300/80 text-sm uppercase tracking-widest mb-3">
              ✨ Aral · Lessons
            </h3>
            <ul className="space-y-2">
              {s.lessonsLearned.map((l, i) => (
                <li key={i} className="text-amber-50/85 text-sm font-serif flex gap-2">
                  <span className="text-emerald-400/60">✓</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Vocabulary */}
          <motion.div
            className="rounded-2xl border border-amber-200/15 bg-stone-950/50 backdrop-blur-sm p-5 sm:p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-serif text-violet-300/80 text-sm uppercase tracking-widest mb-3">
              📖 Talasalitaan · Vocabulary
            </h3>
            <ul className="space-y-3">
              {s.vocabulary.map((v, i) => (
                <li key={i}>
                  <div className="text-amber-200 font-serif font-semibold text-sm">
                    {v.term}
                  </div>
                  <div className="text-stone-400 text-xs font-serif">
                    {v.definition}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Continue */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            className="px-6 py-3 rounded-xl border border-stone-600 text-stone-300 hover:bg-stone-800/50 transition-colors font-serif"
            onClick={() => {
              playSfx('ui-click');
              returnToMenu();
            }}
          >
            ← Menu
          </button>
          <button
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 text-amber-50 font-serif font-semibold text-lg hover:from-amber-600 hover:to-amber-500 transition-all shadow-lg"
            onClick={() => {
              playSfx('scene-transition');
              goToQuiz();
            }}
          >
            Take the Quiz →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
