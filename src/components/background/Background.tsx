'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundId, BackgroundEffect } from '@/story/types';
import { BACKGROUNDS } from '@/story/types';
import { BackgroundEffects } from './BackgroundEffects';

interface BackgroundProps {
  id: BackgroundId;
  effect?: BackgroundEffect;
  kenBurns?: 'in' | 'out' | 'left' | 'right';
  ambient?: string; // for weather effects
}

export function Background({ id, effect = 'fade', kenBurns, ambient }: BackgroundProps) {
  const src = BACKGROUNDS[id];
  const [loaded, setLoaded] = useState(false);

  // Ken Burns animation variants
  const kenBurnsVariants = {
    hidden: { scale: 1.0, x: 0, y: 0 },
    'in': { scale: 1.12, x: 0, y: 0 },
    'out': { scale: 1.0, x: 0, y: 0 },
    'left': { scale: 1.1, x: '-3%', y: 0 },
    'right': { scale: 1.1, x: '3%', y: 0 },
  };

  // Entrance animation by effect
  const entranceVariants: Record<string, { opacity: number; scale: number; filter: string }> = {
    fade: { opacity: 0, scale: 1, filter: 'brightness(1)' },
    'zoom-in': { opacity: 0, scale: 1.2, filter: 'brightness(1)' },
    'zoom-out': { opacity: 0, scale: 0.9, filter: 'brightness(1)' },
    'pan-left': { opacity: 0, scale: 1.05, filter: 'brightness(1)' },
    'pan-right': { opacity: 0, scale: 1.05, filter: 'brightness(1)' },
    'blur-in': { opacity: 0, scale: 1, filter: 'blur(20px) brightness(0.5)' },
    brighten: { opacity: 0, scale: 1, filter: 'brightness(0.2)' },
    crossfade: { opacity: 0, scale: 1, filter: 'brightness(1)' },
  };

  const visibleVariant = {
    opacity: 1,
    scale: kenBurns === 'in' ? 1.12 : kenBurns === 'out' ? 1.0 : 1.05,
    filter: 'brightness(1)',
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          className="absolute inset-0"
          initial={entranceVariants[effect] || entranceVariants.fade}
          animate={visibleVariant}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          transition={{
            opacity: { duration: 1.2, ease: 'easeInOut' },
            scale: { duration: kenBurns ? 18 : 1.2, ease: 'easeOut' },
            x: { duration: 18, ease: 'linear' },
            filter: { duration: 1.5, ease: 'easeOut' },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ imageRendering: 'auto' }}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
          {/* Subtle vignette for cinematic depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
            }}
          />
          {/* Color grade overlay */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-40"
            style={{
              background:
                'linear-gradient(180deg, rgba(40,30,60,0.3) 0%, rgba(20,15,30,0.2) 50%, rgba(60,40,20,0.3) 100%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Weather / particle effects layer */}
      <BackgroundEffects ambient={ambient} />
    </div>
  );
}
