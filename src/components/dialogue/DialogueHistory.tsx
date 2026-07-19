'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStory } from '@/story/StoryProvider';

// Simple in-memory dialogue history — kept in module scope so it persists across renders.
// The StoryProvider pushes to history via the advance() function (in-memory only).
// For this lightweight version we keep a buffer here that gets populated from a custom event.
const historyBuffer: { speaker: string; text: string; chapterTitle: string }[] = [];

export function pushHistory(line: { speaker: string; text: string; chapterTitle: string }) {
  historyBuffer.push(line);
  if (historyBuffer.length > 100) historyBuffer.shift();
  // Dispatch event to trigger re-render
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('noor-history-update'));
  }
}

export function clearHistoryBuffer() {
  historyBuffer.length = 0;
}

export function DialogueHistoryPanel() {
  const { showHistory, toggleHistory, activeChapter } = useStory();
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener('noor-history-update', handler);
    return () => window.removeEventListener('noor-history-update', handler);
  }, []);

  return (
    <AnimatePresence>
      {showHistory && (
        <motion.div
          className="absolute inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleHistory}
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[80vh] rounded-2xl border border-amber-200/20 backdrop-blur-xl bg-stone-950/95 shadow-2xl flex flex-col"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 rounded-t-2xl" />
            <div className="p-5 sm:p-6 flex items-center justify-between">
              <div>
                <div className="text-amber-300/60 text-xs uppercase tracking-widest font-serif">
                  Dialogue Log
                </div>
                <h3 className="font-serif text-xl text-amber-50 font-semibold">
                  {activeChapter?.title || 'Story'}
                </h3>
              </div>
              <button
                className="text-stone-400 hover:text-amber-200 text-2xl leading-none"
                onClick={toggleHistory}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 max-h-[60vh]">
              {historyBuffer.length === 0 ? (
                <p className="text-stone-500 italic text-center py-8 font-serif">
                  No dialogue yet. The story will begin to unfold...
                </p>
              ) : (
                historyBuffer.map((line, i) => (
                  <motion.div
                    key={i}
                    className="space-y-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  >
                    <div className="text-amber-300/80 text-xs font-serif uppercase tracking-wider">
                      {line.speaker}
                    </div>
                    <p className="text-amber-50/90 font-serif text-sm sm:text-base leading-relaxed">
                      {line.text}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
