'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig, GameEvents } from '@/game/config';

interface PhaserGameProps {
  onKnowledgeXp: (amount: number) => void;
  onChapterMedal: (chapterId: string) => void;
  onCodexUnlock: (id: string) => void;
  onJournalEntry: (text: string) => void;
  onDialogueLine: (speaker: string, line: string) => void;
  onQuizRequested: (chapterId: string) => void;
  onChapterTransition: (chapterId: string, sceneKey: string) => void;
}

export default function PhaserGame({
  onKnowledgeXp,
  onChapterMedal,
  onCodexUnlock,
  onJournalEntry,
  onDialogueLine,
  onQuizRequested,
  onChapterTransition,
}: PhaserGameProps) {
  const gameParentRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameParentRef.current || gameRef.current) return;

    const game = new Phaser.Game(createGameConfig(gameParentRef.current));
    gameRef.current = game;

    game.events.on(GameEvents.KnowledgeXp, ({ amount }: { amount: number }) => {
      onKnowledgeXp(amount);
    });

    game.events.on(GameEvents.ChapterMedal, ({ chapterId }: { chapterId: string }) => {
      onChapterMedal(chapterId);
    });

    game.events.on(GameEvents.CodexUnlock, ({ id }: { id: string }) => {
      onCodexUnlock(id);
    });

    game.events.on(GameEvents.JournalEntry, ({ text }: { text: string }) => {
      onJournalEntry(text);
    });

    game.events.on(GameEvents.DialogueLine, (payload: { speaker: string; line: string }) => {
      onDialogueLine(payload.speaker, payload.line);
    });

    game.events.on(GameEvents.QuizRequested, ({ chapterId }: { chapterId: string }) => {
      onQuizRequested(chapterId);
    });

    game.events.on(GameEvents.ChapterTransition, ({ chapterId, sceneKey }: { chapterId: string; sceneKey: string }) => {
      onChapterTransition(chapterId, sceneKey);
    });

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  // Expose game instance for quiz completion signaling
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__phaserGame = gameRef.current;
  });

  return (
    <div
      ref={gameParentRef}
      className="w-full max-w-[800px] mx-auto"
      style={{ aspectRatio: '800/600' }}
    />
  );
}
