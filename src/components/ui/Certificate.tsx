'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStory } from '@/story/StoryProvider';
import { useAudio } from '@/components/audio/AudioManager';
import { generateCertificateId } from '@/lib/save';
import { ALL_CHAPTERS } from '@/data/chapters';

export function Certificate() {
  const { save, returnToMenu, selectChapter } = useStory();
  const { playMusic, playSfx } = useAudio();

  React.useEffect(() => {
    playMusic('hopeful');
  }, [playMusic]);

  const certId = useMemo(
    () => generateCertificateId(save.playerName || 'Traveler'),
    [save.playerName]
  );
  const completedDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const totalQuestions = ALL_CHAPTERS.reduce((acc, c) => acc + c.quiz.length, 0);
  const pct = totalQuestions > 0 ? Math.round((save.knowledgeScore / totalQuestions) * 100) : 0;

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/40" />
      {/* Floating celebration particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-300/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            delay: Math.random() * 4,
            repeat: Infinity,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 w-full max-w-3xl my-8"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Certificate card */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background:
              'linear-gradient(135deg, #1a1410 0%, #2d2218 30%, #3d2e1f 70%, #1a1410 100%)',
            border: '2px solid rgba(217,119,6,0.4)',
            boxShadow:
              '0 0 60px rgba(217,119,6,0.2), inset 0 0 40px rgba(0,0,0,0.4)',
          }}
        >
          {/* Ornate border */}
          <div className="absolute inset-2 rounded-xl border border-amber-300/30 pointer-events-none" />
          <div className="absolute inset-3 rounded-lg border border-amber-300/15 pointer-events-none" />

          {/* Corner flourishes */}
          {[
            'top-2 left-2',
            'top-2 right-2 rotate-90',
            'bottom-2 left-2 -rotate-90',
            'bottom-2 right-2 rotate-180',
          ].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-amber-400/40 text-2xl font-serif`}>
              ❦
            </div>
          ))}

          <div className="relative p-6 sm:p-12 text-center">
            {/* Top emblem */}
            <motion.div
              className="text-5xl sm:text-6xl mb-2"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: 'spring', damping: 10 }}
            >
              ✦
            </motion.div>

            <div className="text-amber-300/60 text-xs sm:text-sm uppercase tracking-[0.5em] font-serif mb-2">
              Sertipiko ng Pagtatapos
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent mb-1">
              Certificate of Completion
            </h1>
            <div className="text-stone-400 italic font-serif text-sm sm:text-base mb-8">
              Project NOOR · Noli Me Tangere
            </div>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300/50" />
              <span className="text-amber-300/60 text-xs">❦</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300/50" />
            </div>

            {/* Presented to */}
            <div className="text-stone-400 font-serif text-sm uppercase tracking-widest mb-2">
              Ipinagkakaloob kay
            </div>
            <motion.div
              className="font-serif text-3xl sm:text-5xl text-amber-50 font-bold mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {save.playerName || 'Lakbayin'}
            </motion.div>
            <div className="text-stone-500 italic font-serif text-xs sm:text-sm mb-8">
              for completing the interactive cinematic experience
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 max-w-xl mx-auto">
              <Stat label="Completion" value={`${save.completionPercentage}%`} icon="📚" />
              <Stat label="Knowledge Score" value={`${save.knowledgeScore}/${totalQuestions}`} icon="✦" />
              <Stat label="Mastery" value={`${pct}%`} icon="🌟" />
            </div>

            {/* Date + ID */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-8 pt-6 border-t border-amber-300/15">
              <div className="text-center sm:text-left">
                <div className="text-stone-400 text-xs uppercase tracking-widest font-serif">
                  Petsa ng Pagtatapos
                </div>
                <div className="text-amber-100 font-serif text-sm">{completedDate}</div>
              </div>
              <div className="text-center">
                <div className="text-stone-400 text-xs uppercase tracking-widest font-serif">
                  Sertipiko ID
                </div>
                <div className="text-amber-300 font-mono text-xs tracking-wider">{certId}</div>
              </div>
            </div>

            {/* Quote */}
            <div className="px-6 py-4 rounded-xl bg-stone-950/40 border border-amber-300/10 mb-6">
              <p className="text-amber-100/80 font-serif italic text-sm sm:text-base">
                "Ang hindi marunong lumingon sa pinanggalingan ay hindi makararating sa paroroonan."
              </p>
              <p className="text-stone-400 font-serif text-xs mt-1">
                — He who does not look back to where he came from will not reach his destination.
              </p>
            </div>

            {/* Signature */}
            <div className="flex justify-between items-end max-w-md mx-auto">
              <div className="text-center">
                <div className="font-serif text-amber-200/80 text-lg italic" style={{ fontFamily: 'cursive' }}>
                  Project NOOR
                </div>
                <div className="h-px bg-amber-300/40 w-32 mt-1" />
                <div className="text-stone-400 text-xs font-serif mt-1">Program</div>
              </div>
              <div className="text-center">
                <div className="text-amber-300/80 text-2xl">✦</div>
                <div className="h-px bg-amber-300/40 w-24 mt-3" />
                <div className="text-stone-400 text-xs font-serif mt-1">Seal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            className="px-6 py-3 rounded-xl border border-stone-600 text-stone-300 hover:bg-stone-800/50 transition-colors font-serif"
            onClick={() => {
              playSfx('ui-click');
              returnToMenu();
            }}
          >
            ← Back to Menu
          </button>
          <button
            className="px-6 py-3 rounded-xl border border-amber-300/40 bg-amber-900/30 text-amber-100 hover:bg-amber-800/40 transition-colors font-serif"
            onClick={() => {
              playSfx('ui-click');
              window.print();
            }}
          >
            🖨️ Print / Save as PDF
          </button>
          <button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 text-amber-50 font-serif font-semibold hover:from-amber-600 hover:to-amber-500 transition-all shadow-lg"
            onClick={() => {
              playSfx('scene-transition');
              selectChapter(ALL_CHAPTERS[0].id);
            }}
          >
            Replay from Start →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl bg-stone-950/40 border border-amber-300/15 p-3 sm:p-4">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-amber-50 font-serif font-bold text-lg sm:text-2xl">{value}</div>
      <div className="text-stone-400 text-[10px] sm:text-xs uppercase tracking-widest font-serif">
        {label}
      </div>
    </div>
  );
}
