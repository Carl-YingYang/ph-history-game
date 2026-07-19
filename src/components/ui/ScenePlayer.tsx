'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStory } from '@/story/StoryProvider';
import { useAudio } from '@/components/audio/AudioManager';
import { Background } from '@/components/background/Background';
import { CharacterStage } from '@/components/character/CharacterLayer';
import { DialogueBox } from '@/components/dialogue/DialogueBox';
import { ChoicePicker } from '@/components/dialogue/ChoicePicker';
import { Letterbox, SceneFade, FlashEffect, CameraShake } from '@/components/cinematic/Cinematic';
import { HistoricalNoteCard } from '@/components/ui/HistoricalNote';
import { MiniInteractionPanel } from '@/components/ui/MiniInteraction';
import { SceneHUD } from '@/components/ui/SceneHUD';
import { DialogueHistoryPanel } from '@/components/dialogue/DialogueHistory';

export function ScenePlayer() {
  const {
    activeChapter,
    activeSceneIndex,
    activeDialogueIndex,
    advance,
    pickChoice,
    completeScene,
    isTransitioning,
  } = useStory();
  const { playMusic, playAmbient, stopMusic, stopAmbient, playSfx } = useAudio();

  const [showNote, setShowNote] = useState(false);
  const [showMini, setShowMini] = useState(false);
  const [flashTrigger, setFlashTrigger] = useState(0);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [sceneTitleVisible, setSceneTitleVisible] = useState(false);
  const prevSceneId = useRef<string | null>(null);

  const scene = activeChapter?.scenes[activeSceneIndex];
  const line = scene?.dialogue[activeDialogueIndex];
  const isLastLine = scene ? activeDialogueIndex >= scene.dialogue.length - 1 : false;
  const hasChoices = !!scene?.choices && isLastLine;
  const showChoices = hasChoices && activeDialogueIndex >= scene!.dialogue.length;

  // Track scene changes for effects + audio
  useEffect(() => {
    if (!scene) return;
    if (prevSceneId.current !== scene.id) {
      prevSceneId.current = scene.id;
      // Scene title flash
      if (scene.title) {
        setSceneTitleVisible(true);
        const t = setTimeout(() => setSceneTitleVisible(false), 2500);
        return () => clearTimeout(t);
      }
      // Music + ambient
      if (scene.music) {
        playMusic(scene.music as any);
      } else {
        stopMusic();
      }
      if (scene.ambient) {
        playAmbient(scene.ambient as any);
      } else {
        stopAmbient();
      }
      // Camera shake / flash
      if (scene.cameraShake) {
        setShakeTrigger((t) => t + 1);
      }
      if (scene.flash) {
        setFlashTrigger((t) => t + 1);
      }
      // Mini interaction auto-show if present and dialogue exhausted
      if (scene.miniInteraction && scene.dialogue.length === 0) {
        setShowMini(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene?.id]);

  // Reset show flags when scene changes
  useEffect(() => {
    setShowNote(false);
    setShowMini(false);
  }, [activeSceneIndex]);

  // Determine active speaker for character highlighting
  const activeSpeaker = line?.speaker ?? null;

  // Case 1: choices are showing (dialogue exhausted + scene has choices)
  if (scene && showChoices && scene.choices) {
    return (
      <SceneShell
        scene={scene}
        activeSpeaker={null}
        sceneTitleVisible={sceneTitleVisible}
        showNote={showNote}
        setShowNote={setShowNote}
        showMini={showMini}
        setShowMini={setShowMini}
        shakeTrigger={shakeTrigger}
        flashTrigger={flashTrigger}
        isTransitioning={isTransitioning}
      >
        <ChoicePicker choices={scene.choices} onPick={pickChoice} />
      </SceneShell>
    );
  }

  // Case 2: dialogue exhausted, no choices — show continue prompt or mini interaction
  if (scene && !line) {
    return (
      <SceneShell
        scene={scene}
        activeSpeaker={null}
        sceneTitleVisible={sceneTitleVisible}
        showNote={showNote}
        setShowNote={setShowNote}
        showMini={showMini}
        setShowMini={setShowMini}
        shakeTrigger={shakeTrigger}
        flashTrigger={flashTrigger}
        isTransitioning={isTransitioning}
      >
        {scene.miniInteraction && !showMini && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              className="px-8 py-4 rounded-xl bg-amber-800/60 border border-amber-300/40 text-amber-50 font-serif text-lg hover:bg-amber-700/60 transition-colors backdrop-blur-md"
              onClick={() => {
                playSfx('ui-click');
                setShowMini(true);
              }}
            >
              ✦ {scene.miniInteraction.prompt} ✦
            </button>
          </motion.div>
        )}
        {scene.miniInteraction && showMini && (
          <MiniInteractionPanel
            interaction={scene.miniInteraction}
            onComplete={() => {
              setShowMini(false);
              completeScene();
            }}
          />
        )}
        {!scene.miniInteraction && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pb-6"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <button
              className="w-full max-w-4xl px-8 py-6 rounded-2xl border border-amber-200/15 backdrop-blur-md bg-stone-900/80 text-amber-50 font-serif text-lg hover:bg-amber-900/30 transition-colors"
              onClick={() => {
                playSfx('scene-transition');
                completeScene();
              }}
            >
              Continue to the next scene →
            </button>
          </motion.div>
        )}
      </SceneShell>
    );
  }

  if (!scene || !line) return null;

  const handleAdvance = () => {
    const advanced = advance();
    if (!advanced && !hasChoices) {
      // End of scene, no choices — complete
      completeScene();
    }
  };

  return (
    <SceneShell
      scene={scene}
      activeSpeaker={activeSpeaker}
      sceneTitleVisible={sceneTitleVisible}
      showNote={showNote}
      setShowNote={setShowNote}
      showMini={showMini}
      setShowMini={setShowMini}
      shakeTrigger={shakeTrigger}
      flashTrigger={flashTrigger}
      isTransitioning={isTransitioning}
    >
      {/* Dialogue box */}
      {!showChoices && !showMini && (
        <DialogueBox
          line={line}
          isLastLine={isLastLine && !hasChoices}
          hasChoices={hasChoices && isLastLine}
          onComplete={() => {}}
          onAdvance={handleAdvance}
        />
      )}

      {/* Choices */}
      {showChoices && scene.choices && (
        <ChoicePicker choices={scene.choices} onPick={pickChoice} />
      )}
    </SceneShell>
  );
}

// ===== Shared scene shell (background + characters + effects + HUD) =====
function SceneShell({
  scene,
  activeSpeaker,
  sceneTitleVisible,
  showNote,
  setShowNote,
  showMini,
  setShowMini,
  shakeTrigger,
  flashTrigger,
  isTransitioning,
  children,
}: any) {
  const { activeChapter, activeSceneIndex, activeDialogueIndex } = useStory();
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      <CameraShake
        intensity={scene.cameraShake?.intensity || 0}
        duration={scene.cameraShake?.duration || 0}
        trigger={shakeTrigger}
      >
        {/* Background */}
        <Background
          id={scene.background.id}
          effect={scene.background.effect}
          kenBurns={scene.background.kenBurns}
          ambient={scene.ambient}
        />

        {/* Characters */}
        <CharacterStage sprites={scene.characters} activeSpeaker={activeSpeaker} />

        {/* Letterbox bars */}
        <Letterbox active={scene.letterbox !== false} />

        {/* Scene title card */}
        <AnimatePresence>
          {sceneTitleVisible && scene.title && (
            <motion.div
              className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="text-center px-8"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
              >
                <div className="text-amber-300/50 text-xs uppercase tracking-[0.4em] font-serif mb-2">
                  {activeChapter.title} · Scene {activeSceneIndex + 1}
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl text-amber-50 font-bold drop-shadow-lg">
                  {scene.title}
                </h2>
                <motion.div
                  className="mt-4 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent w-48 mx-auto"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD */}
        <SceneHUD
          chapterTitle={activeChapter.title}
          chapterNumber={activeChapter.number}
          sceneIndex={activeSceneIndex}
          totalScenes={activeChapter.scenes.length}
          hasNote={!!scene.historicalNote}
          onOpenNote={() => setShowNote(true)}
        />

        {/* Main content (dialogue / choices / mini interaction) */}
        {children}

        {/* Historical note panel */}
        <AnimatePresence>
          {showNote && scene.historicalNote && (
            <HistoricalNoteCard
              note={scene.historicalNote}
              onClose={() => setShowNote(false)}
            />
          )}
        </AnimatePresence>

        {/* Dialogue history */}
        <DialogueHistoryPanel />
      </CameraShake>

      {/* Flash effect (outside camera shake so it covers full screen) */}
      <FlashEffect trigger={flashTrigger} />

      {/* Scene transition fade */}
      <SceneFade active={isTransitioning} />
    </div>
  );
}
