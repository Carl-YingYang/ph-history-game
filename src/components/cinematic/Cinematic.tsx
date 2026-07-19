'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LetterboxProps {
  active: boolean;
}

// Cinematic letterbox bars (top + bottom) for widescreen feel.
export function Letterbox({ active }: LetterboxProps) {
  return (
    <AnimatePresence>
      {active && (
        <>
          <motion.div
            className="absolute top-0 left-0 right-0 z-20 bg-black pointer-events-none"
            initial={{ height: 0 }}
            animate={{ height: '8vh' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ maxHeight: '90px' }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-20 bg-black pointer-events-none"
            initial={{ height: 0 }}
            animate={{ height: '8vh' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ maxHeight: '90px' }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

// Full-screen black fade for scene transitions
export function SceneFade({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 z-[60] bg-black pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  );
}

// Flash effect (white) for dramatic moments
export function FlashEffect({ trigger }: { trigger: number }) {
  return (
    <AnimatePresence>
      {trigger > 0 && (
        <motion.div
          key={trigger}
          className="absolute inset-0 z-[55] bg-white pointer-events-none"
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}
    </AnimatePresence>
  );
}

// Camera shake wrapper — applies a brief translate animation to its children
export function CameraShake({
  children,
  intensity,
  duration,
  trigger,
}: {
  children: React.ReactNode;
  intensity: number;
  duration: number;
  trigger: number;
}) {
  return (
    <motion.div
      className="w-full h-full"
      key={trigger}
      initial={{}}
      animate={
        trigger > 0
          ? {
              x: [0, -intensity, intensity, -intensity * 0.7, intensity * 0.5, 0],
              y: [0, intensity * 0.5, -intensity * 0.5, intensity * 0.3, 0],
            }
          : {}
      }
      transition={{ duration: duration / 1000, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
