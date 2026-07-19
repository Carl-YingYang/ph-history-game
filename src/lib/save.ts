// Save system — browser Local Storage
import { StorySaveState, EMPTY_SAVE } from '@/story/types';

const SAVE_KEY = 'noor_save_v1';

export function loadSave(): StorySaveState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StorySaveState;
    // Merge with defaults to handle new fields added later
    return { ...EMPTY_SAVE, ...parsed };
  } catch {
    return null;
  }
}

export function writeSave(state: StorySaveState): void {
  if (typeof window === 'undefined') return;
  try {
    const toWrite = { ...state, lastUpdated: new Date().toISOString() };
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(toWrite));
  } catch (e) {
    console.error('Failed to write save:', e);
  }
}

export function clearSave(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SAVE_KEY);
}

export function hasSave(): boolean {
  if (typeof window === 'undefined') return false;
  return !!window.localStorage.getItem(SAVE_KEY);
}

// Certificate ID generator — deterministic-ish unique id
export function generateCertificateId(playerName: string): string {
  const seed = `${playerName}-${Date.now()}-${Math.random()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const c = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `NOOR-${hex}-${rand}`;
}
