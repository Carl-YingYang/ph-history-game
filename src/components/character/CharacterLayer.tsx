'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterSprite, CHARACTERS } from '@/story/types';

interface CharacterLayerProps {
  sprite: CharacterSprite;
  isActive: boolean; // true if currently speaking
}

const positionClasses: Record<string, string> = {
  left: 'left-[15%]',
  center: 'left-1/2 -translate-x-1/2',
  right: 'right-[15%]',
};

export function CharacterLayer({ sprite, isActive }: CharacterLayerProps) {
  const meta = CHARACTERS[sprite.id];
  if (!meta || !meta.portrait) return null;

  return (
    <motion.div
      key={`${sprite.id}-${sprite.expression}`}
      className={`absolute bottom-[18%] ${positionClasses[sprite.position]} z-10 pointer-events-none`}
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      animate={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: isActive ? 1.02 : 1.0,
      }}
      exit={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        filter: isActive
          ? 'drop-shadow(0 0 20px rgba(255,220,150,0.4)) drop-shadow(0 10px 20px rgba(0,0,0,0.6))'
          : 'drop-shadow(0 10px 20px rgba(0,0,0,0.6)) brightness(0.8)',
      }}
    >
      {/* Breathing animation wrapper */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          scale: [1, 1.01, 1],
        }}
        transition={{
          duration: 4 + Math.random() * 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meta.portrait}
          alt={meta.name}
          className="h-[55vh] max-h-[640px] w-auto object-contain object-bottom"
          style={{
            imageRendering: 'auto',
            maskImage: 'linear-gradient(180deg, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(180deg, black 70%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* Speaking indicator — subtle glow at feet */}
      {isActive && (
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-3 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(255,220,150,0.4) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
}

interface CharacterStageProps {
  sprites: CharacterSprite[];
  activeSpeaker: string | null;
}

export function CharacterStage({ sprites, activeSpeaker }: CharacterStageProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {sprites.map((s) => (
          <CharacterLayer
            key={s.id}
            sprite={s}
            isActive={activeSpeaker === s.id}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
