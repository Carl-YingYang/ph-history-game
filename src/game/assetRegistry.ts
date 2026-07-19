// Asset registry — every sprite sheet loaded by Phaser.
//
// Source PNGs + atlas JSON live in src/app/assets/ (the project's canonical
// asset location). A build-time copy is placed in public/assets/ so Next.js
// can serve them at /assets/<name>.png and /assets/<name>.json. Phaser loads
// each sheet with `load.atlas(key, pngUrl, jsonUrl)` — standard texture-atlas
// loading. The atlas JSON is in Phaser "JSON Hash" format with one rectangle
// per detected frame (per-frame slicing, no stretching, no full-PNG display).

export interface AssetSheet {
  key: string;          // Phaser texture key
  pngUrl: string;       // served PNG url
  atlasUrl: string;     // served atlas JSON url
  isCharacter: boolean; // character sheets have animations; env sheets are tile collections
}

const URL = (k: string) => ({
  pngUrl: `/assets/${k}.png`,
  atlasUrl: `/assets/${k}.json`,
});

// ── Character sheets (have idle/walk/run/jump/attack/hurt/dead/fall/climb/jumpattack) ──
export const CHARACTER_SHEETS: string[] = [
  'rizal', 'ibara', 'clara', 'damaso', 'simoun', 'salve', 'elias',
  'sisa', 'basilio', 'tiago',
  'student-npc', 'villager-npc', 'religious-npc', 'spanish-npc', 'misc-npc',
  'animals-assets',
];

// ── Environment / object sheets (static tile collections) ──
export const ENVIRONMENT_SHEETS: string[] = [
  'building-assets', 'nature-assets', 'interior-assets', 'furniture-assets',
  'collectible-assets', 'icons-assets', 'ui-assets', 'gamedev-assets',
];

export const ALL_SHEETS: string[] = [...CHARACTER_SHEETS, ...ENVIRONMENT_SHEETS];

export const ASSET_SHEETS: AssetSheet[] = ALL_SHEETS.map(k => ({
  key: k,
  ...URL(k),
  isCharacter: CHARACTER_SHEETS.includes(k),
}));

// ── Character animation metadata (frame rates + repeat) ──
// repeat: -1 = loop, 0 = play once
export interface AnimConfig { frameRate: number; repeat: number; }
export const ANIM_DEFAULTS: Record<string, AnimConfig> = {
  idle:       { frameRate: 8,  repeat: -1 },
  walk:       { frameRate: 10, repeat: -1 },
  run:        { frameRate: 13, repeat: -1 },
  jump:       { frameRate: 8,  repeat: 0  },
  attack:     { frameRate: 14, repeat: 0  },
  hurt:       { frameRate: 10, repeat: 0  },
  dead:       { frameRate: 8,  repeat: 0  },
  fall:       { frameRate: 10, repeat: 0  },
  climb:      { frameRate: 8,  repeat: -1 },
  jumpattack: { frameRate: 14, repeat: 0  },
};

// Standard animation order for character sheets
export const ANIM_ORDER = [
  'idle', 'walk', 'run', 'jump', 'attack',
  'hurt', 'dead', 'fall', 'climb', 'jumpattack',
] as const;
