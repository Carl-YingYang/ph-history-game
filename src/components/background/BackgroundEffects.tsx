'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface BackgroundEffectsProps {
  ambient?: string;
}

// Ambient particle / weather overlays that add subtle motion to every scene.
export function BackgroundEffects({ ambient }: BackgroundEffectsProps) {
  // Stable random particles
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 14,
      drift: (Math.random() - 0.5) * 30,
    }));
  }, []);

  // Rain drops
  const rain = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 0.6,
      length: 12 + Math.random() * 18,
    }));
  }, []);

  // Fireflies
  const fireflies = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
    }));
  }, []);

  // Determine which effects to show based on ambient id
  const isNight = ambient === 'night-crickets' || ambient === 'river-night';
  const isWater = ambient === 'ocean-waves' || ambient === 'river-night';
  const isChurch = ambient === 'church-ambient' || ambient === 'town-bells';
  const showFireflies = ambient === 'river-night';
  const showDust = ambient === 'quiet-room' || ambient === 'soft-piano' || ambient === 'church-ambient';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating dust motes — always present, very subtle */}
      {(showDust || true) && particles.map((p) => (
        <motion.div
          key={`dust-${p.id}`}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: isNight ? 'rgba(180,200,255,0.4)' : 'rgba(255,240,200,0.5)',
            boxShadow: `0 0 ${p.size * 2}px rgba(255,240,200,0.3)`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, p.drift, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Fireflies for river/forest night scenes */}
      {showFireflies && fireflies.map((f) => (
        <motion.div
          key={`ff-${f.id}`}
          className="absolute rounded-full"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: 4,
            height: 4,
            background: 'rgba(255,240,150,0.9)',
            boxShadow: '0 0 8px rgba(255,240,150,0.8), 0 0 16px rgba(255,220,100,0.5)',
          }}
          animate={{
            opacity: [0, 1, 0.8, 0, 1, 0],
            scale: [0.5, 1.2, 0.8, 1, 0.6],
            x: [0, 20, -10, 15, 0],
            y: [0, -15, 10, -20, 0],
          }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Water shimmer for ocean/river */}
      {isWater && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/3"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(150,200,255,0.05) 50%, rgba(100,150,200,0.1) 100%)',
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Light rays for church/dawn scenes */}
      {isChurch && (
        <motion.div
          className="absolute top-0 left-1/4 w-1/2 h-full pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,240,200,0.12) 0%, transparent 70%)',
            transform: 'skewX(-12deg)',
            filter: 'blur(8px)',
          }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Night sky subtle twinkle */}
      {isNight && (
        <div className="absolute top-0 left-0 right-0 h-1/2">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: 1.5,
                height: 1.5,
              }}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{
                duration: 2 + Math.random() * 3,
                delay: Math.random() * 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
