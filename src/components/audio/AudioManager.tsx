'use client';

import React, { createContext, useContext, useRef, useEffect, useState, useCallback } from 'react';
import { Howl, Howler } from 'howler';

// ====== Audio track IDs ======
export type MusicTrack =
  | 'nostalgic'
  | 'melancholy'
  | 'warm'
  | 'tension'
  | 'tender'
  | 'determined'
  | 'hopeful'
  | 'mysterious'
  | 'menu';

export type AmbientTrack =
  | 'ocean-waves'
  | 'street-ambient'
  | 'dinner-murmur'
  | 'night-crickets'
  | 'soft-piano'
  | 'quiet-room'
  | 'town-bells'
  | 'river-night'
  | 'church-ambient';

export type SfxType =
  | 'blip-male'
  | 'blip-female'
  | 'blip-narrator'
  | 'page-turn'
  | 'choice-select'
  | 'scene-transition'
  | 'note-appear'
  | 'quiz-correct'
  | 'quiz-wrong'
  | 'ui-hover'
  | 'ui-click';

interface AudioContextValue {
  playMusic: (track: MusicTrack) => void;
  stopMusic: () => void;
  playAmbient: (track: AmbientTrack) => void;
  stopAmbient: () => void;
  playSfx: (type: SfxType) => void;
  setMuted: (muted: boolean) => void;
  isMuted: boolean;
}

const Ctx = createContext<AudioContextValue | null>(null);

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}

// Procedural sound generation — we synthesize simple tones via Web Audio API
// instead of relying on audio files (no asset files needed).
function createBlipSound(ctx: AudioContext, freq: number, duration: number, type: OscillatorType = 'square') {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function createChimeSound(ctx: AudioContext, freqs: number[], duration: number) {
  freqs.forEach((f, i) => {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    }, i * 80);
  });
}

function createNoiseSound(ctx: AudioContext, duration: number, filterFreq: number) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = filterFreq;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + duration);
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicOscRef = useRef<{ osc: OscillatorNode[]; gain: GainNode } | null>(null);
  const ambientRef = useRef<{ source: AudioBufferSourceNode; gain: GainNode } | null>(null);
  const [isMuted, setIsMutedState] = useState(false);

  // Lazily create AudioContext on first user gesture
  const getCtx = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Mute master via Howler + our ctx
  useEffect(() => {
    Howler.mute(isMuted);
  }, [isMuted]);

  const setMuted = useCallback((m: boolean) => {
    setIsMutedState(m);
  }, []);

  // ====== Music: soft ambient pad synthesized from layered oscillators ======
  const stopMusic = useCallback(() => {
    if (musicOscRef.current) {
      const ctx = audioCtxRef.current;
      if (ctx) {
        musicOscRef.current.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      }
      setTimeout(() => {
        musicOscRef.current?.osc.forEach((o) => {
          try { o.stop(); } catch {}
        });
        musicOscRef.current = null;
      }, 600);
    }
  }, []);

  const playMusic = useCallback((track: MusicTrack) => {
    const ctx = getCtx();
    if (!ctx) return;
    stopMusic();

    // Each track = chord of 2-3 sustained oscillators with slow LFO
    const trackConfig: Record<MusicTrack, { freqs: number[]; type: OscillatorType }> = {
      nostalgic: { freqs: [196, 261.63, 329.63], type: 'sine' }, // G3 C4 E4
      melancholy: { freqs: [174.61, 220, 261.63], type: 'sine' }, // F3 A3 C4
      warm: { freqs: [261.63, 329.63, 392], type: 'triangle' }, // C4 E4 G4
      tension: { freqs: [110, 116.54, 164.81], type: 'sawtooth' }, // A2 Bb2 E3 dissonant
      tender: { freqs: [220, 277.18, 329.63], type: 'sine' }, // A3 C#4 E4
      determined: { freqs: [196, 246.94, 293.66], type: 'triangle' }, // G3 B3 D4
      hopeful: { freqs: [261.63, 329.63, 392, 523.25], type: 'sine' }, // C4 E4 G4 C5
      mysterious: { freqs: [146.83, 220, 277.18], type: 'sine' }, // D3 A3 C#4
      menu: { freqs: [196, 246.94, 293.66, 369.99], type: 'triangle' },
    };
    const cfg = trackConfig[track];
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 1.5);
    masterGain.connect(ctx.destination);

    const oscs: OscillatorNode[] = [];
    cfg.freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = cfg.type;
      osc.frequency.value = f;
      // Detune slightly for richness
      osc.detune.value = (i - cfg.freqs.length / 2) * 4;
      // Slow LFO on gain for breathing
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.1 + i * 0.03;
      lfoGain.gain.value = 0.02;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      const oscGain = ctx.createGain();
      oscGain.gain.value = 1 / cfg.freqs.length;
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      lfo.start();
      oscs.push(osc, lfo);
    });

    musicOscRef.current = { osc: oscs, gain: masterGain };
  }, [getCtx, stopMusic]);

  // ====== Ambient: looping filtered noise / tones ======
  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      const ctx = audioCtxRef.current;
      if (ctx) {
        ambientRef.current.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      }
      setTimeout(() => {
        try { ambientRef.current?.source.stop(); } catch {}
        ambientRef.current = null;
      }, 600);
    }
  }, []);

  const playAmbient = useCallback((track: AmbientTrack) => {
    const ctx = getCtx();
    if (!ctx) return;
    stopAmbient();

    // Generate a longer noise buffer with filtering appropriate to the ambient type
    const duration = 4; // seconds, will loop
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    const cfg: Record<AmbientTrack, { filter: BiquadFilterType; freq: number; q: number; gain: number; type?: OscillatorType }> = {
      'ocean-waves': { filter: 'lowpass', freq: 400, q: 0.5, gain: 0.12 },
      'street-ambient': { filter: 'bandpass', freq: 600, q: 0.7, gain: 0.08 },
      'dinner-murmur': { filter: 'bandpass', freq: 800, q: 0.5, gain: 0.06 },
      'night-crickets': { filter: 'bandpass', freq: 4500, q: 5, gain: 0.04 },
      'soft-piano': { filter: 'lowpass', freq: 1200, q: 1, gain: 0.05 },
      'quiet-room': { filter: 'lowpass', freq: 200, q: 0.5, gain: 0.03 },
      'town-bells': { filter: 'bandpass', freq: 800, q: 3, gain: 0.05 },
      'river-night': { filter: 'lowpass', freq: 300, q: 0.5, gain: 0.1 },
      'church-ambient': { filter: 'lowpass', freq: 500, q: 1, gain: 0.08 },
    };
    const c = cfg[track];

    // Generate noise with amplitude modulation for waves
    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      const mod = track === 'ocean-waves'
        ? 0.5 + 0.5 * Math.sin(t * 0.5) // slow wave swell
        : 1;
      data[i] = (Math.random() * 2 - 1) * mod;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = c.filter;
    filter.frequency.value = c.freq;
    filter.Q.value = c.q;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(c.gain, ctx.currentTime + 1.5);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    ambientRef.current = { source, gain };
  }, [getCtx, stopAmbient]);

  // ====== SFX ======
  const playSfx = useCallback((type: SfxType) => {
    const ctx = getCtx();
    if (!ctx) return;

    switch (type) {
      case 'blip-male':
        createBlipSound(ctx, 140 + Math.random() * 20, 0.05, 'square');
        break;
      case 'blip-female':
        createBlipSound(ctx, 260 + Math.random() * 30, 0.05, 'square');
        break;
      case 'blip-narrator':
        createBlipSound(ctx, 180 + Math.random() * 15, 0.06, 'sine');
        break;
      case 'page-turn':
        createNoiseSound(ctx, 0.3, 2000);
        break;
      case 'choice-select':
        createChimeSound(ctx, [523.25, 659.25], 0.15);
        break;
      case 'scene-transition':
        createNoiseSound(ctx, 0.5, 500);
        setTimeout(() => createChimeSound(ctx, [392, 523.25], 0.3), 100);
        break;
      case 'note-appear':
        createChimeSound(ctx, [659.25, 783.99, 987.77], 0.2);
        break;
      case 'quiz-correct':
        createChimeSound(ctx, [523.25, 659.25, 783.99], 0.25);
        break;
      case 'quiz-wrong':
        createBlipSound(ctx, 200, 0.15, 'sawtooth');
        setTimeout(() => createBlipSound(ctx, 150, 0.2, 'sawtooth'), 100);
        break;
      case 'ui-hover':
        createBlipSound(ctx, 800, 0.03, 'sine');
        break;
      case 'ui-click':
        createBlipSound(ctx, 600, 0.05, 'sine');
        break;
    }
  }, [getCtx]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMusic();
      stopAmbient();
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch {}
      }
    };
  }, [stopMusic, stopAmbient]);

  return (
    <Ctx.Provider value={{ playMusic, stopMusic, playAmbient, stopAmbient, playSfx, setMuted, isMuted }}>
      {children}
    </Ctx.Provider>
  );
}
