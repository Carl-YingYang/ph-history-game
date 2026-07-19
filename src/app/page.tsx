'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HUD from '@/components/game/HUD';
import DialogueBox from '@/components/game/DialogueBox';
import CodexPanel from '@/components/game/CodexPanel';
import JournalPanel from '@/components/game/JournalPanel';
import QuizModal, { QuizQuestion } from '@/components/game/QuizModal';
import { getQuizForChapter } from '@/game/data/quizzes';

// Dynamic import for PhaserGame — no SSR (Phaser needs window/DOM)
const PhaserGame = dynamic(() => import('@/components/game/PhaserGame'), { ssr: false });

type PanelName = 'none' | 'codex' | 'journal';

const AUTO_SAVE_INTERVAL = 30_000;

export default function Home() {
  const [knowledgeXp, setKnowledgeXp] = useState(0);
  const [medalCount, setMedalCount] = useState(0);
  const [currentChapterId, setCurrentChapterId] = useState('prologue');
  const [unlockedCodexIds, setUnlockedCodexIds] = useState<Set<string>>(new Set());
  const [journalEntries, setJournalEntries] = useState<{ text: string; timestamp: number }[]>([]);
  const [dialogue, setDialogue] = useState<{ speaker: string; line: string } | null>(null);
  const [activePanel, setActivePanel] = useState<PanelName>('none');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizChapterId, setQuizChapterId] = useState<string | null>(null);

  const playtimeStartRef = useRef<number>(Date.now());
  const xpRef = useRef(knowledgeXp);
  const medalRef = useRef(medalCount);
  const chapterRef = useRef(currentChapterId);
  xpRef.current = knowledgeXp;
  medalRef.current = medalCount;
  chapterRef.current = currentChapterId;

  // Auto-save
  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - playtimeStartRef.current) / 1000);
      fetch(`/api/progress/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentChapterId: chapterRef.current,
          knowledgeXp: xpRef.current,
          medalCount: medalRef.current,
          playtimeSeconds: elapsed,
        }),
      }).catch(() => {});
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  // Load saved progress on mount
  useEffect(() => {
    fetch(`/api/progress/1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.save) {
          setKnowledgeXp(data.save.knowledgeXp);
          setMedalCount(data.save.medalCount);
          setCurrentChapterId(data.save.currentChapterId);
        }
      })
      .catch(() => {});
  }, []);

  const handleKnowledgeXp = useCallback((amount: number) => {
    setKnowledgeXp((xp) => xp + amount);
  }, []);

  const handleChapterMedal = useCallback((chapterId: string) => {
    setMedalCount((c) => c + 1);
    setCurrentChapterId(chapterId);

    const elapsed = Math.floor((Date.now() - playtimeStartRef.current) / 1000);
    fetch(`/api/progress/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentChapterId: chapterId,
        knowledgeXp: xpRef.current,
        medalCount: medalRef.current + 1,
        playtimeSeconds: elapsed,
      }),
    }).catch(() => {});
  }, []);

  const handleCodexUnlock = useCallback((id: string) => {
    setUnlockedCodexIds((prev) => new Set(prev).add(id));
    fetch(`/api/progress/codex`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codexEntryId: id, slot: 1 }),
    }).catch(() => {});
  }, []);

  const handleJournalEntry = useCallback((text: string) => {
    setJournalEntries((entries) => [...entries, { text, timestamp: Date.now() }]);
    fetch(`/api/progress/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId: chapterRef.current, text, slot: 1 }),
    }).catch(() => {});
  }, []);

  const handleDialogueLine = useCallback((speaker: string, line: string) => {
    setDialogue({ speaker, line });
    setTimeout(() => setDialogue(null), 4000);
  }, []);

  const handleQuizRequested = useCallback((chapterId: string) => {
    const quiz = getQuizForChapter(chapterId);
    if (quiz && quiz.questions.length > 0) {
      setQuizQuestions(quiz.questions);
      setQuizChapterId(chapterId);
    } else {
      // No quiz — signal completion directly
      const game = (window as unknown as Record<string, unknown>).__phaserGame as { events: { emit: (event: string) => void } } | undefined;
      if (game) {
        game.events.emit('quiz:completed');
      }
    }
  }, []);

  const handleChapterTransition = useCallback((chapterId: string, _sceneKey: string) => {
    setCurrentChapterId(chapterId);
  }, []);

  const handleQuizComplete = useCallback(() => {
    if (quizChapterId) {
      setKnowledgeXp((xp) => xp + 20);
    }
    setQuizQuestions(null);
    setQuizChapterId(null);

    // Signal Phaser scene
    const game = (window as unknown as Record<string, unknown>).__phaserGame as { events: { emit: (event: string) => void } } | undefined;
    if (game) {
      game.events.emit('quiz:completed');
    }
  }, [quizChapterId]);

  const rank =
    knowledgeXp >= 6000
      ? 'Illustrado'
      : knowledgeXp >= 3500
        ? 'Historian'
        : knowledgeXp >= 1500
          ? 'Scholar'
          : knowledgeXp >= 500
            ? 'Student'
            : 'Reader';

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#0b0b12] py-4 px-3">
      <HUD
        knowledgeXp={knowledgeXp}
        rank={rank}
        medalCount={medalCount}
        currentChapter={currentChapterId}
        onOpenJournal={() => setActivePanel('journal')}
        onOpenCodex={() => setActivePanel('codex')}
      />

      <div className="my-3 w-full max-w-[800px]">
        <PhaserGame
          onKnowledgeXp={handleKnowledgeXp}
          onChapterMedal={handleChapterMedal}
          onCodexUnlock={handleCodexUnlock}
          onJournalEntry={handleJournalEntry}
          onDialogueLine={handleDialogueLine}
          onQuizRequested={handleQuizRequested}
          onChapterTransition={handleChapterTransition}
        />
      </div>

      {dialogue && <DialogueBox speaker={dialogue.speaker} line={dialogue.line} />}

      {quizQuestions && (
        <QuizModal questions={quizQuestions} onComplete={handleQuizComplete} />
      )}

      {activePanel === 'codex' && (
        <CodexPanel unlockedIds={unlockedCodexIds} onClose={() => setActivePanel('none')} />
      )}
      {activePanel === 'journal' && (
        <JournalPanel entries={journalEntries} onClose={() => setActivePanel('none')} />
      )}

      <footer className="mt-auto pt-6 text-center text-xs text-gray-600">
        Project Noor — Rizal-Inspired Educational RPG &middot; Unified Next.js Build
      </footer>
    </div>
  );
}
