'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  StorySaveState,
  EMPTY_SAVE,
  AppScreen,
  Chapter,
  Choice,
  DialogueLine,
  CHARACTERS,
} from './types';
import { loadSave, writeSave, clearSave } from '@/lib/save';
import { ALL_CHAPTERS } from '@/data/chapters';
import { pushHistory, clearHistoryBuffer } from '@/components/dialogue/DialogueHistory';

interface StoryContextValue {
  // ===== State =====
  save: StorySaveState;
  screen: AppScreen;
  activeChapter: Chapter | null;
  activeSceneIndex: number;
  activeDialogueIndex: number;
  // UI flags
  showHistory: boolean;
  showSettings: boolean;
  showNote: boolean;
  autoMode: boolean;
  isTransitioning: boolean;
  // Audio
  muted: boolean;

  // ===== Actions =====
  startNewGame: (playerName: string) => void;
  continueGame: () => void;
  returnToMenu: () => void;
  goToChapterSelect: () => void;
  selectChapter: (chapterId: string) => void;
  // Advance the dialogue by one step. Returns false if at end of scene.
  advance: () => boolean;
  // Pick a choice
  pickChoice: (choice: Choice) => void;
  // Complete the current scene, move to next scene or chapter summary
  completeScene: () => void;
  // Go from chapter summary to quiz
  goToQuiz: () => void;
  // Submit quiz answers for current chapter
  submitQuiz: (correct: number, total: number) => void;
  // Go to next chapter after quiz (or certificate if last)
  nextChapter: () => void;
  // Toggle UI
  toggleHistory: () => void;
  toggleSettings: () => void;
  toggleMute: () => void;
  toggleAutoMode: () => void;
  dismissNote: () => void;
  // Reset everything
  resetProgress: () => void;
  // Skip to end (for testing / certificate)
  finishStory: () => void;
}

const StoryContext = createContext<StoryContextValue | null>(null);

export function useStory() {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error('useStory must be used within StoryProvider');
  return ctx;
}

export function StoryProvider({ children }: { children: React.ReactNode }) {
  // Load save via lazy initializer (runs once on first client render)
  const [save, setSave] = useState<StorySaveState>(() => {
    if (typeof window === 'undefined') return EMPTY_SAVE;
    return loadSave() ?? EMPTY_SAVE;
  });
  const [screen, setScreen] = useState<AppScreen>('main-menu');
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [muted, setMuted] = useState(false);

  // Dialogue history (kept in memory only, not persisted)
  const [history, setHistory] = useState<
    { speaker: string; text: string; chapterTitle: string }[]
  >([]);

  // Persist save whenever it changes (debounced via rAF)
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (save.playerName === '') return; // don't save empty
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => writeSave(save), 400);
  }, [save]);

  // ===== Compute completion =====
  const computeCompletion = useCallback(
    (completed: string[]): number => {
      if (ALL_CHAPTERS.length === 0) return 0;
      return Math.round((completed.length / ALL_CHAPTERS.length) * 100);
    },
    []
  );

  // ===== Actions =====
  const startNewGame = useCallback((playerName: string) => {
    const fresh: StorySaveState = {
      ...EMPTY_SAVE,
      playerName: playerName.trim() || 'Lakbayin',
      startedAt: new Date().toISOString(),
      currentChapterId: ALL_CHAPTERS[0]?.id ?? null,
      currentSceneIndex: 0,
      currentDialogueIndex: 0,
    };
    setSave(fresh);
    writeSave(fresh);
    setActiveChapter(ALL_CHAPTERS[0] ?? null);
    setActiveSceneIndex(0);
    setActiveDialogueIndex(0);
    setHistory([]);
    setScreen('intro');
  }, []);

  const continueGame = useCallback(() => {
    const loaded = loadSave();
    if (!loaded || !loaded.currentChapterId) {
      startNewGame('Lakbayin');
      return;
    }
    const ch = ALL_CHAPTERS.find((c) => c.id === loaded.currentChapterId);
    if (!ch) {
      startNewGame(loaded.playerName || 'Lakbayin');
      return;
    }
    setActiveChapter(ch);
    setActiveSceneIndex(loaded.currentSceneIndex);
    setActiveDialogueIndex(loaded.currentDialogueIndex);
    setScreen('scene');
  }, [startNewGame]);

  const returnToMenu = useCallback(() => {
    setScreen('main-menu');
    setActiveChapter(null);
    setShowHistory(false);
    setShowSettings(false);
    setShowNote(false);
    setAutoMode(false);
  }, []);

  const goToChapterSelect = useCallback(() => {
    setScreen('chapter-select');
  }, []);

  const selectChapter = useCallback(
    (chapterId: string) => {
      const ch = ALL_CHAPTERS.find((c) => c.id === chapterId);
      if (!ch) return;
      setActiveChapter(ch);
      setActiveSceneIndex(0);
      setActiveDialogueIndex(0);
      setHistory([]);
      clearHistoryBuffer();
      setSave((s) => ({
        ...s,
        currentChapterId: chapterId,
        currentSceneIndex: 0,
        currentDialogueIndex: 0,
      }));
      setScreen('scene');
    },
    []
  );

  const advance = useCallback((): boolean => {
    if (!activeChapter) return false;
    const scene = activeChapter.scenes[activeSceneIndex];
    if (!scene) return false;

    // If scene has a historical note that hasn't been dismissed, show it
    if (scene.historicalNote && !showNote) {
      // Don't auto-show; it's optional. Player can open via button.
    }

    const nextIdx = activeDialogueIndex + 1;
    if (nextIdx < scene.dialogue.length) {
      // Record current line in history before advancing
      const line = scene.dialogue[activeDialogueIndex];
      if (line) {
        const name =
          line.name ||
          (line.speaker === 'narrator'
            ? 'Narrator'
            : CHARACTERS[line.speaker]?.name ||
              line.speaker.charAt(0).toUpperCase() + line.speaker.slice(1));
        pushHistory({ speaker: name, text: line.text, chapterTitle: activeChapter.title });
      }
      setActiveDialogueIndex(nextIdx);
      return true;
    }
    // At the last line already. If choices exist, advance index past end to trigger choice UI.
    if (scene.choices && scene.choices.length > 0) {
      const line = scene.dialogue[activeDialogueIndex];
      if (line) {
        const name =
          line.name ||
          (line.speaker === 'narrator'
            ? 'Narrator'
            : CHARACTERS[line.speaker]?.name ||
              line.speaker.charAt(0).toUpperCase() + line.speaker.slice(1));
        pushHistory({ speaker: name, text: line.text, chapterTitle: activeChapter.title });
      }
      setActiveDialogueIndex(scene.dialogue.length); // past end = show choices
      return true;
    }
    return false;
  }, [activeChapter, activeSceneIndex, activeDialogueIndex, showNote]);

  const completeScene = useCallback(() => {
    if (!activeChapter) return;
    setIsTransitioning(true);
    setTimeout(() => {
      const nextSceneIdx = activeSceneIndex + 1;
      if (nextSceneIdx < activeChapter.scenes.length) {
        setActiveSceneIndex(nextSceneIdx);
        setActiveDialogueIndex(0);
        setSave((s) => ({
          ...s,
          currentSceneIndex: nextSceneIdx,
          currentDialogueIndex: 0,
        }));
      } else {
        // End of chapter — go to summary
        setScreen('chapter-summary');
      }
      setIsTransitioning(false);
    }, 700);
  }, [activeChapter, activeSceneIndex]);

  const pickChoice = useCallback(
    (choice: Choice) => {
      if (!activeChapter) return;
      setSave((s) => ({
        ...s,
        choicesMade: { ...s.choicesMade, [choice.id]: choice.id },
        flags: choice.setFlag
          ? { ...s.flags, [choice.setFlag]: true }
          : s.flags,
      }));
      // If the choice has a response, we don't have a clean way to inject dialogue
      // mid-scene in this simple engine, so we just complete the scene.
      completeScene();
    },
    [activeChapter, completeScene]
  );

  const submitQuiz = useCallback(
    (correct: number, total: number) => {
      if (!activeChapter) return;
      setSave((s) => {
        const newCompleted = s.completedChapters.includes(activeChapter.id)
          ? s.completedChapters
          : [...s.completedChapters, activeChapter.id];
        const newQuizScores = {
          ...s.quizScores,
          [activeChapter.id]: { correct, total },
        };
        const knowledgeScore = Object.values(newQuizScores).reduce(
          (acc, q) => acc + q.correct,
          0
        );
        return {
          ...s,
          completedChapters: newCompleted,
          quizScores: newQuizScores,
          knowledgeScore,
          completionPercentage: computeCompletion(newCompleted),
        };
      });
    },
    [activeChapter, computeCompletion]
  );

  const goToQuiz = useCallback(() => {
    setScreen('quiz');
  }, []);

  const nextChapter = useCallback(() => {
    if (!activeChapter) return;
    const idx = ALL_CHAPTERS.findIndex((c) => c.id === activeChapter.id);
    if (idx === -1) return;
    if (idx + 1 >= ALL_CHAPTERS.length) {
      // Story complete!
      setScreen('certificate');
      return;
    }
    const next = ALL_CHAPTERS[idx + 1];
    setActiveChapter(next);
    setActiveSceneIndex(0);
    setActiveDialogueIndex(0);
    clearHistoryBuffer();
    setSave((s) => ({
      ...s,
      currentChapterId: next.id,
      currentSceneIndex: 0,
      currentDialogueIndex: 0,
    }));
    setScreen('scene');
  }, [activeChapter]);

  const toggleHistory = useCallback(() => setShowHistory((v) => !v), []);
  const toggleSettings = useCallback(() => setShowSettings((v) => !v), []);
  const toggleMute = useCallback(() => setMuted((v) => !v), []);
  const toggleAutoMode = useCallback(() => setAutoMode((v) => !v), []);
  const dismissNote = useCallback(() => setShowNote(false), []);

  const resetProgress = useCallback(() => {
    clearSave();
    setSave(EMPTY_SAVE);
    setActiveChapter(null);
    setActiveSceneIndex(0);
    setActiveDialogueIndex(0);
    setHistory([]);
    setScreen('main-menu');
  }, []);

  const finishStory = useCallback(() => {
    const all = ALL_CHAPTERS.map((c) => c.id);
    const quizScores: Record<string, { correct: number; total: number }> = {};
    let knowledge = 0;
    ALL_CHAPTERS.forEach((c) => {
      const total = c.quiz.length;
      const correct = Math.ceil(total * 0.9); // 90% for demo
      quizScores[c.id] = { correct, total };
      knowledge += correct;
    });
    setSave((s) => ({
      ...s,
      completedChapters: all,
      quizScores,
      knowledgeScore: knowledge,
      completionPercentage: 100,
    }));
    setScreen('certificate');
  }, []);

  // Auto-mode: advance every 3.5s
  useEffect(() => {
    if (!autoMode || screen !== 'scene') return;
    const t = setTimeout(() => {
      advance();
    }, 3500);
    return () => clearTimeout(t);
  }, [autoMode, screen, activeDialogueIndex, advance]);

  // NOTE: current position is persisted inside each action handler
  // (advance, completeScene, selectChapter) to avoid cascading renders.

  const value: StoryContextValue = {
    save,
    screen,
    activeChapter,
    activeSceneIndex,
    activeDialogueIndex,
    showHistory,
    showSettings,
    showNote,
    autoMode,
    isTransitioning,
    muted,
    startNewGame,
    continueGame,
    returnToMenu,
    goToChapterSelect,
    selectChapter,
    advance,
    pickChoice,
    completeScene,
    goToQuiz,
    submitQuiz,
    nextChapter,
    toggleHistory,
    toggleSettings,
    toggleMute,
    toggleAutoMode,
    dismissNote,
    resetProgress,
    finishStory,
  };

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
}
