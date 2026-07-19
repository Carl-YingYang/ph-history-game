// Project NOOR — Visual Novel Story Engine Types
// Cinematic, scene-based interactive story experience.

// ====== CHARACTERS ======
export type CharacterId =
  | 'ibarra'
  | 'maria-clara'
  | 'damaso'
  | 'tiago'
  | 'elias'
  | 'sisa'
  | 'narrator'
  | 'ltenuyarte' // Lt. Guevarra
  | 'schoolmaster';

export type CharacterExpression =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'thinking'
  | 'angry'
  | 'surprised'
  | 'crying'
  | 'serious';

export interface CharacterSprite {
  id: CharacterId;
  expression: CharacterExpression;
  position: 'left' | 'center' | 'right';
  // Framer-motion animation variant name
  animation?: 'idle' | 'enter' | 'exit' | 'shake' | 'nod';
}

// ====== BACKGROUNDS ======
export type BackgroundId =
  | 'manila-bay'
  | 'binondo-street'
  | 'dining-room'
  | 'schoolhouse'
  | 'town-plaza'
  | 'church'
  | 'forest'
  | 'prison'
  | 'river-night'
  | 'library';

export type BackgroundEffect =
  | 'fade'
  | 'zoom-in'
  | 'zoom-out'
  | 'pan-left'
  | 'pan-right'
  | 'blur-in'
  | 'brighten';

// ====== DIALOGUE ======
export interface DialogueLine {
  speaker: CharacterId;
  // Display name override (defaults to character's name)
  name?: string;
  // Portrait expression for this line
  expression?: CharacterExpression;
  text: string;
  // Optional voice blip pitch/tone
  voice?: 'male' | 'female' | 'narrator';
}

// ====== CHOICES ======
export interface Choice {
  id: string;
  text: string;
  // Optional flag set when this choice is picked
  setFlag?: string;
  // Optional response dialogue shown immediately after picking
  response?: DialogueLine[];
}

// ====== HISTORICAL NOTES ======
export type NoteType =
  | 'context'
  | 'did-you-know'
  | 'vocabulary'
  | 'biography'
  | 'timeline';

export interface HistoricalNote {
  id: string;
  type: NoteType;
  title: string;
  body: string;
}

// ====== MINI INTERACTIONS ======
export type MiniInteractionType =
  | 'inspect' // click an object to reveal text
  | 'reveal'; // click to reveal hidden text/notes

export interface MiniInteraction {
  type: MiniInteractionType;
  prompt: string;
  // For 'inspect': hotspots on the background
  hotspots?: {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    label: string;
    reveal: string;
  }[];
  // For 'reveal': text segments to progressively reveal
  segments?: string[];
  completeText: string;
}

// ====== SCENES ======
export interface Scene {
  id: string;
  // Cinematic title shown briefly (optional)
  title?: string;
  background: {
    id: BackgroundId;
    effect?: BackgroundEffect;
    // Optional slow pan/zoom during the scene
    kenBurns?: 'in' | 'out' | 'left' | 'right';
  };
  // Background music track
  music?: string;
  // Ambient sound loop
  ambient?: string;
  // Letterbox bars (cinematic mode)
  letterbox?: boolean;
  // Characters visible in this scene
  characters: CharacterSprite[];
  // Dialogue sequence
  dialogue: DialogueLine[];
  // Branching choice at the end (optional)
  choices?: Choice[];
  // Historical note shown after the scene (optional, expandable)
  historicalNote?: HistoricalNote;
  // Mini interaction replacing standard dialogue progression (optional)
  miniInteraction?: MiniInteraction;
  // Camera shake moment (optional, for dramatic scenes)
  cameraShake?: { intensity: number; duration: number };
  // Flash effect (optional)
  flash?: boolean;
}

// ====== CHAPTERS ======
export interface ChapterSummary {
  summary: string;
  importantCharacters: { name: string; role: string }[];
  historicalEvents: string[];
  lessonsLearned: string[];
  vocabulary: { term: string; definition: string }[];
}

export type QuestionType = 'multiple-choice' | 'true-false';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  scenes: Scene[];
  summary: ChapterSummary;
  quiz: QuizQuestion[];
}

// ====== SAVE STATE ======
export interface StorySaveState {
  playerName: string;
  currentChapterId: string | null;
  currentSceneIndex: number;
  currentDialogueIndex: number;
  completedChapters: string[];
  // Flags set by choices (e.g. 'asked_about_father')
  flags: Record<string, boolean>;
  // Quiz scores per chapter: { chapterId: { correct, total } }
  quizScores: Record<string, { correct: number; total: number }>;
  // Choices made (for certificate / analytics)
  choicesMade: Record<string, string>;
  completionPercentage: number;
  // Total knowledge score across all quizzes
  knowledgeScore: number;
  lastUpdated: string; // ISO date
  startedAt: string; // ISO date
}

export const EMPTY_SAVE: StorySaveState = {
  playerName: '',
  currentChapterId: null,
  currentSceneIndex: 0,
  currentDialogueIndex: 0,
  completedChapters: [],
  flags: {},
  quizScores: {},
  choicesMade: {},
  completionPercentage: 0,
  knowledgeScore: 0,
  lastUpdated: new Date().toISOString(),
  startedAt: new Date().toISOString(),
};

// ====== APP SCREENS ======
export type AppScreen =
  | 'main-menu'
  | 'intro'
  | 'chapter-select'
  | 'scene' // playing a scene
  | 'chapter-summary'
  | 'quiz'
  | 'certificate'
  | 'settings';

// ====== CHARACTER METADATA ======
export interface CharacterMeta {
  id: CharacterId;
  name: string;
  portrait: string; // image path
  defaultExpression: CharacterExpression;
  voice: 'male' | 'female' | 'narrator';
  // Bio for codex/certificate
  bio: string;
}

export const CHARACTERS: Record<CharacterId, CharacterMeta> = {
  ibarra: {
    id: 'ibarra',
    name: 'Crisóstomo Ibarra',
    portrait: '/story/characters/ibarra.png',
    defaultExpression: 'neutral',
    voice: 'male',
    bio: 'A young Filipino who studied seven years in Europe. Returns to the Philippines carrying dreams of progress and the memory of his father.',
  },
  'maria-clara': {
    id: 'maria-clara',
    name: 'María Clara',
    portrait: '/story/characters/maria-clara.png',
    defaultExpression: 'happy',
    voice: 'female',
    bio: 'Ibarra’s betrothed, daughter of Capitan Tiago. Beautiful, devout, and gentle — a symbol of the Filipina of her time.',
  },
  damaso: {
    id: 'damaso',
    name: 'Fray Dámaso',
    portrait: '/story/characters/damaso.png',
    defaultExpression: 'angry',
    voice: 'male',
    bio: 'A Spanish Franciscan friar, former parish priest of San Diego. Arrogant, cruel, and powerful — a representation of abusive clerical authority.',
  },
  tiago: {
    id: 'tiago',
    name: 'Capitan Tiago',
    portrait: '/story/characters/tiago.png',
    defaultExpression: 'happy',
    voice: 'male',
    bio: 'A wealthy Filipino businessman, father of María Clara. Sociable and accommodating, he navigates colonial society with pragmatism.',
  },
  elias: {
    id: 'elias',
    name: 'Elías',
    portrait: '/story/characters/elias.png',
    defaultExpression: 'serious',
    voice: 'male',
    bio: 'A mysterious boatman with a tragic past. Strong, principled, and hunted — he becomes Ibarra’s unlikely ally.',
  },
  sisa: {
    id: 'sisa',
    name: 'Sisa',
    portrait: '/story/characters/sisa.png',
    defaultExpression: 'sad',
    voice: 'female',
    bio: 'A mother driven to madness by the loss of her sons to friar cruelty. Her tragedy embodies the suffering of the Filipino people.',
  },
  narrator: {
    id: 'narrator',
    name: 'Narrator',
    portrait: '',
    defaultExpression: 'neutral',
    voice: 'narrator',
    bio: 'The voice that carries us through the story of Noli Me Tangere.',
  },
  ltenuyarte: {
    id: 'ltenuyarte',
    name: 'Lt. Guevarra',
    portrait: '/story/characters/tiago.png',
    defaultExpression: 'serious',
    voice: 'male',
    bio: 'A Spanish lieutenant of the Guardia Civil. A man of conscience who reveals to Ibarra the truth of his father’s fate.',
  },
  schoolmaster: {
    id: 'schoolmaster',
    name: 'The Schoolmaster',
    portrait: '/story/characters/tiago.png',
    defaultExpression: 'thinking',
    voice: 'male',
    bio: 'A young man who once tried to teach Spanish to Filipino children — and was punished for it by the friars.',
  },
};

// ====== BACKGROUND METADATA ======
export const BACKGROUNDS: Record<BackgroundId, string> = {
  'manila-bay': '/story/backgrounds/manila-bay.png',
  'binondo-street': '/story/backgrounds/binondo-street.png',
  'dining-room': '/story/backgrounds/dining-room.png',
  schoolhouse: '/story/backgrounds/schoolhouse.png',
  'town-plaza': '/story/backgrounds/town-plaza.png',
  church: '/story/backgrounds/church.png',
  forest: '/story/backgrounds/forest.png',
  prison: '/story/backgrounds/prison.png',
  'river-night': '/story/backgrounds/river-night.png',
  library: '/story/backgrounds/library.png',
};
