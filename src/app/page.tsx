'use client';

import { StoryProvider, useStory } from '@/story/StoryProvider';
import { AudioProvider, useAudio } from '@/components/audio/AudioManager';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

function ScreenRouter() {
  const { screen, muted, toggleMute } = useStory();

  // Sync mute state with audio provider
  const audio = useAudio();
  useEffect(() => {
    audio.setMuted(muted);
  }, [muted, audio]);

  return (
    <main className="relative w-full min-h-screen bg-black text-amber-50 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          className="w-full min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {screen === 'main-menu' && <MainMenuLazy />}
          {screen === 'intro' && <IntroLazy />}
          {screen === 'chapter-select' && <ChapterSelectLazy />}
          {screen === 'scene' && <ScenePlayerLazy />}
          {screen === 'chapter-summary' && <ChapterSummaryLazy />}
          {screen === 'quiz' && <QuizLazy />}
          {screen === 'certificate' && <CertificateLazy />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

// Lazy-load screens (code-splitting for faster initial load)
import dynamic from 'next/dynamic';
const MainMenuLazy = dynamic(() => import('@/components/ui/MainMenu').then(m => ({ default: m.MainMenu })), { ssr: false });
const IntroLazy = dynamic(() => import('@/components/ui/Intro').then(m => ({ default: m.Intro })), { ssr: false });
const ChapterSelectLazy = dynamic(() => import('@/components/ui/ChapterSelect').then(m => ({ default: m.ChapterSelect })), { ssr: false });
const ScenePlayerLazy = dynamic(() => import('@/components/ui/ScenePlayer').then(m => ({ default: m.ScenePlayer })), { ssr: false });
const ChapterSummaryLazy = dynamic(() => import('@/components/ui/ChapterSummary').then(m => ({ default: m.ChapterSummary })), { ssr: false });
const QuizLazy = dynamic(() => import('@/components/ui/Quiz').then(m => ({ default: m.Quiz })), { ssr: false });
const CertificateLazy = dynamic(() => import('@/components/ui/Certificate').then(m => ({ default: m.Certificate })), { ssr: false });

export default function Home() {
  return (
    <AudioProvider>
      <StoryProvider>
        <ScreenRouter />
      </StoryProvider>
    </AudioProvider>
  );
}
