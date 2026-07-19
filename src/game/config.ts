import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PrologueScene } from './scenes/PrologueScene';
import { SanDiegoTownScene } from './scenes/SanDiegoTownScene';
import { LagunaDeBayScene } from './scenes/LagunaDeBayScene';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#1a1410',
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, PrologueScene, SanDiegoTownScene, LagunaDeBayScene],
  };
}

export const GameEvents = {
  CodexUnlock: 'codex:unlock',
  JournalEntry: 'journal:entry',
  ChapterMedal: 'chapter:medal',
  QuizRequested: 'quiz:requested',
  DialogueLine: 'dialogue:line',
  KnowledgeXp: 'xp:gained',
  ChapterTransition: 'chapter:transition',
} as const;
