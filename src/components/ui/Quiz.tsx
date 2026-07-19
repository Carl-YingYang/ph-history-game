'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStory } from '@/story/StoryProvider';
import { useAudio } from '@/components/audio/AudioManager';
import { Chapter, QuizQuestion } from '@/story/types';

export function Quiz() {
  const { activeChapter, submitQuiz, nextChapter, returnToMenu } = useStory();
  const { playSfx, stopMusic, playMusic } = useAudio();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);

  React.useEffect(() => {
    playMusic('tension');
    if (activeChapter) {
      setAnswers(new Array(activeChapter.quiz.length).fill(null));
    }
  }, [activeChapter, playMusic]);

  if (!activeChapter) return null;

  const question: QuizQuestion | undefined = activeChapter.quiz[currentQ];
  if (!question) return null;

  const handleAnswer = (idx: number) => {
    if (showFeedback) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
    setShowFeedback(true);
    if (idx === question.correctIndex) {
      playSfx('quiz-correct');
    } else {
      playSfx('quiz-wrong');
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= activeChapter.quiz.length) {
      // Finish
      const correct = answers.reduce(
        (acc, a, i) => acc + (a === activeChapter.quiz[i].correctIndex ? 1 : 0),
        0
      );
      submitQuiz(correct, activeChapter.quiz.length);
      setFinished(true);
      playMusic('warm');
    } else {
      setCurrentQ((q) => q + 1);
      setShowFeedback(false);
      playSfx('page-turn');
    }
  };

  if (finished) {
    const correct = answers.reduce(
      (acc, a, i) => acc + (a === activeChapter.quiz[i].correctIndex ? 1 : 0),
      0
    );
    const pct = Math.round((correct / activeChapter.quiz.length) * 100);
    return (
      <QuizResult
        correct={correct}
        total={activeChapter.quiz.length}
        pct={pct}
        onNext={nextChapter}
        onMenu={() => {
          stopMusic();
          returnToMenu();
        }}
      />
    );
  }

  const selectedAnswer = answers[currentQ];
  const isCorrect = selectedAnswer === question.correctIndex;

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/30" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(217,119,6,0.2) 0%, transparent 60%)',
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-2xl"
        key={currentQ}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-amber-300/60 text-xs uppercase tracking-[0.4em] font-serif">
            {activeChapter.title} · Pagsusulit
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-amber-50 font-bold mt-1">
            Quiz
          </h2>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {activeChapter.quiz.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentQ
                    ? 'w-6 bg-amber-300'
                    : i < currentQ
                      ? 'w-1.5 bg-amber-500/70'
                      : 'w-1.5 bg-stone-600/50'
                }`}
              />
            ))}
          </div>
          <div className="text-stone-400 text-sm mt-2 font-serif">
            Question {currentQ + 1} of {activeChapter.quiz.length}
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-2xl border border-amber-200/20 bg-stone-900/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
          <div className="mb-4">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-serif bg-amber-800/40 text-amber-200 border border-amber-300/20">
              {question.type === 'multiple-choice' ? 'Multiple Choice' : 'True or False'}
            </span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl text-amber-50 leading-relaxed mb-6">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrectAnswer = i === question.correctIndex;
              let stateClass = 'border-stone-600/40 bg-stone-950/40 hover:bg-stone-800/50 hover:border-amber-300/30';
              if (showFeedback) {
                if (isCorrectAnswer) {
                  stateClass = 'border-emerald-400/60 bg-emerald-900/30';
                } else if (isSelected) {
                  stateClass = 'border-red-400/60 bg-red-900/30';
                } else {
                  stateClass = 'border-stone-700/30 bg-stone-950/30 opacity-60';
                }
              }
              return (
                <motion.button
                  key={i}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${stateClass} ${
                    !showFeedback ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  whileTap={!showFeedback ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(i)}
                  disabled={showFeedback}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-serif font-semibold ${
                      showFeedback && isCorrectAnswer
                        ? 'bg-emerald-400 text-emerald-950'
                        : showFeedback && isSelected
                          ? 'bg-red-400 text-red-950'
                          : 'bg-stone-700 text-amber-100'
                    }`}>
                      {showFeedback && isCorrectAnswer ? '✓' : showFeedback && isSelected ? '✗' : String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-serif text-amber-50/95 text-base sm:text-lg">
                      {opt}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                className={`mt-5 p-4 rounded-xl border ${
                  isCorrect
                    ? 'border-emerald-400/30 bg-emerald-950/40'
                    : 'border-amber-400/30 bg-amber-950/30'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={`font-serif font-semibold mb-1 ${
                  isCorrect ? 'text-emerald-300' : 'text-amber-300'
                }`}>
                  {isCorrect ? '✓ Tama! Correct.' : '✗ Not quite.'}
                </div>
                <p className="text-amber-50/85 text-sm font-serif leading-relaxed">
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          <AnimatePresence>
            {showFeedback && (
              <motion.button
                className="w-full mt-5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 text-amber-50 font-serif font-semibold text-lg hover:from-amber-600 hover:to-amber-500 transition-all shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                onClick={handleNext}
              >
                {currentQ + 1 >= activeChapter.quiz.length ? 'See Results →' : 'Next Question →'}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function QuizResult({
  correct,
  total,
  pct,
  onNext,
  onMenu,
}: {
  correct: number;
  total: number;
  pct: number;
  onNext: () => void;
  onMenu: () => void;
}) {
  const { activeChapter } = useStory();
  const isLast = activeChapter?.number === 3; // ALL_CHAPTERS.length
  const message =
    pct === 100 ? 'Perfect! You have truly absorbed the story.' :
    pct >= 80 ? 'Excellent! Your understanding runs deep.' :
    pct >= 60 ? 'Well done. The lessons have taken root.' :
    pct >= 40 ? 'A good beginning. The story invites re-reading.' :
                'The path of learning continues. Revisit the chapter when ready.';

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/40" />
      <motion.div
        className="relative z-10 text-center max-w-xl px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-7xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 12 }}
        >
          {pct >= 80 ? '🌟' : pct >= 60 ? '✨' : '📖'}
        </motion.div>
        <h2 className="font-serif text-4xl sm:text-5xl text-amber-50 font-bold mb-2">
          {correct} / {total}
        </h2>
        <div className="text-amber-300/70 text-lg font-serif mb-1">{pct}%</div>
        <p className="text-amber-100/80 font-serif italic mt-4 mb-8">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="px-6 py-3 rounded-xl border border-stone-600 text-stone-300 hover:bg-stone-800/50 transition-colors font-serif"
            onClick={onMenu}
          >
            ← Menu
          </button>
          <button
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 text-amber-50 font-serif font-semibold hover:from-amber-600 hover:to-amber-500 transition-all shadow-lg"
            onClick={onNext}
          >
            {isLast ? 'View Certificate →' : 'Next Chapter →'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
