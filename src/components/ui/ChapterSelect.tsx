'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStory } from '@/story/StoryProvider';
import { useAudio } from '@/components/audio/AudioManager';
import { ALL_CHAPTERS } from '@/data/chapters';

export function ChapterSelect() {
  const { selectChapter, returnToMenu, save } = useStory();
  const { playSfx, playMusic } = useAudio();

  React.useEffect(() => {
    playMusic('menu');
  }, [playMusic]);

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/30" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(217,119,6,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(120,53,15,0.2) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center px-6 py-10 sm:py-14">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-amber-300/60 text-xs uppercase tracking-[0.4em] mb-2 font-serif">
            The Story Unfolds
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-amber-50 font-bold">
            Chapters
          </h2>
          <p className="text-stone-400 mt-2 font-serif italic">
            Walk the path of Crisóstomo Ibarra
          </p>
        </motion.div>

        <div className="w-full max-w-4xl space-y-4">
          {ALL_CHAPTERS.map((ch, i) => {
            const isCompleted = save.completedChapters.includes(ch.id);
            const isUnlocked =
              i === 0 || save.completedChapters.includes(ALL_CHAPTERS[i - 1].id);
            const quizScore = save.quizScores[ch.id];

            return (
              <motion.button
                key={ch.id}
                disabled={!isUnlocked}
                className={`relative w-full text-left p-5 sm:p-6 rounded-2xl border backdrop-blur-md transition-all overflow-hidden ${
                  isUnlocked
                    ? 'border-amber-300/30 bg-stone-900/60 hover:bg-stone-800/70 hover:border-amber-300/50 cursor-pointer'
                    : 'border-stone-700/40 bg-stone-950/60 opacity-50 cursor-not-allowed'
                }`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => isUnlocked && playSfx('ui-hover')}
                onClick={() => {
                  if (!isUnlocked) return;
                  playSfx('scene-transition');
                  selectChapter(ch.id);
                }}
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  {/* Chapter number medallion */}
                  <div
                    className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold border-2 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 border-amber-200'
                        : isUnlocked
                          ? 'bg-stone-800 text-amber-200 border-amber-400/40'
                          : 'bg-stone-900 text-stone-600 border-stone-700'
                    }`}
                  >
                    {isCompleted ? '✓' : ch.number}
                  </div>

                  {/* Title + subtitle */}
                  <div className="flex-1 min-w-0">
                    <div className="text-amber-300/60 text-xs uppercase tracking-widest font-serif">
                      Kabanata {ch.number}
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl text-amber-50 font-semibold truncate">
                      {ch.title}
                    </h3>
                    <p className="text-stone-400 text-sm sm:text-base italic">
                      {ch.subtitle}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="text-stone-500">
                        {ch.scenes.length} scenes · {ch.quiz.length} questions
                      </span>
                      {quizScore && (
                        <span className="text-amber-400">
                          Score: {quizScore.correct}/{quizScore.total}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status / arrow */}
                  <div className="flex-shrink-0 self-center">
                    {isUnlocked ? (
                      <span className="text-amber-300/60 text-2xl">→</span>
                    ) : (
                      <span className="text-stone-600 text-xl">🔒</span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          className="mt-10 px-6 py-3 rounded-xl border border-stone-600 text-stone-300 hover:bg-stone-800/50 transition-colors font-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => {
            playSfx('ui-click');
            returnToMenu();
          }}
        >
          ← Back to Menu
        </motion.button>
      </div>
    </div>
  );
}
