// Quest definitions. See Master Prompt Section 10.

export type QuestType = 'main' | 'side' | 'knowledge' | 'collectible';

export interface Quest {
  id: string;
  type: QuestType;
  chapterId: string;
  title: string;
  storyPurpose: string;
  learningObjective: string;
  npcIds: string[];
  objectives: string[];
  rewardXp: number;
  codexUnlockIds: string[];
  historicalExplanation: string;
}

export const quests: Quest[] = [
  {
    id: 'mq.ch1.arrival',
    type: 'main',
    chapterId: 'ch1',
    title: "A Stranger's Welcome",
    storyPurpose: "Establish the player's cover identity and introduce San Diego.",
    learningObjective: "Ibarra's homecoming after seven years studying in Europe, and the social tension it creates.",
    npcIds: ['mang-tenyo', 'char.tiago'],
    objectives: [
      'Follow Mang Tenyo into town',
      'Overhear the reception gossip from the kitchen staff',
      'Meet Ibarra briefly in the plaza the next morning',
    ],
    rewardXp: 60,
    codexUnlockIds: ['char.ibarra', 'char.tiago', 'char.damaso'],
    historicalExplanation:
      'Ilustrados like Ibarra (and Rizal himself) often returned from European study to a colonial society deeply suspicious of the reformist ideas they brought back.',
  },
  {
    id: 'sq.ch3.tasyo-library',
    type: 'side',
    chapterId: 'ch3',
    title: "What Tasyo Reads at Night",
    storyPurpose: 'Deepen understanding of why Pilosopo Tasyo is dismissed as "loco" by San Diego.',
    learningObjective:
      "19th-century ilustrados' access to banned Enlightenment texts, and the social cost of intellectualism under friar-controlled information.",
    npcIds: ['char.tasyo'],
    objectives: [
      'Overhear two vendors gossiping about "the old fool\'s books"',
      "Visit Tasyo's hut and ask about his library",
      'Choose a follow-up question (cosmetic branching only)',
    ],
    rewardXp: 40,
    codexUnlockIds: ['char.tasyo'],
    historicalExplanation:
      'Owning certain banned books was itself politically dangerous in colonial Philippines — a risk real Propaganda Movement figures took.',
  },
  {
    id: 'kq.ch1.codex-intro',
    type: 'knowledge',
    chapterId: 'ch1',
    title: 'Your First Entry',
    storyPurpose: 'Onboard the player to the Codex/Journal systems.',
    learningObjective: 'How the Rizal Codex is organized (Characters, Locations, Terms, etc.)',
    npcIds: [],
    objectives: ['Open the Codex from the pause menu', 'Read your first unlocked entry'],
    rewardXp: 20,
    codexUnlockIds: [],
    historicalExplanation: '',
  },
  {
    id: 'cq.ch3.pressed-flower',
    type: 'collectible',
    chapterId: 'ch3',
    title: 'A Pressed Sampaguita',
    storyPurpose: "A small keepsake tying the player to Maria Clara's garden.",
    learningObjective: 'Sampaguita as a recurring national/cultural symbol in Filipino literature.',
    npcIds: [],
    objectives: ['Find the pressed flower hidden near the garden trellis'],
    rewardXp: 15,
    codexUnlockIds: [],
    historicalExplanation: 'The sampaguita later became the Philippines\u2019 national flower (declared in 1934).',
  },
  {
    id: 'mq.ch2.guevara',
    type: 'main',
    chapterId: 'ch2',
    title: 'The Fair-Weather Friend',
    storyPurpose:
      "Reveal the truth of Don Rafael Ibarra's slander, imprisonment, and death through Lt. Guevara's testimony and estate records.",
    learningObjective:
      "The friarocracy's power to destroy lives through false accusations, and how even sympathetic Spanish officials were constrained by the system.",
    npcIds: ['char.guevara', 'char.don-rafael'],
    objectives: [
      'Find Lt. Guevara near the Guardia Civil outpost',
      "Listen to Guevara's account of Don Rafael's persecution",
      'Investigate the old Ibarra estate records (Historical Investigation Encounter)',
      'Piece together the sequence: slander → imprisonment → death → exhumation',
    ],
    rewardXp: 80,
    codexUnlockIds: [
      'char.guevara',
      'char.don-rafael',
      'event.don-rafael-persecution',
      'term.guardia-civil',
      'artifact.ibarra-ledger',
    ],
    historicalExplanation:
      "Rizal modeled Don Rafael's persecution on real cases of Filipino landowners targeted by friars. The exhumation detail mirrors actual colonial practices where the Church controlled burial rights as a weapon of social control.",
  },
  {
    id: 'kq.ch2.estate-records',
    type: 'knowledge',
    chapterId: 'ch2',
    title: 'Reading the Ledger',
    storyPurpose:
      "Deepen understanding of how estate records tell the story of colonial exploitation.",
    learningObjective:
      'How documentary evidence (ledgers, tax records) reveals patterns of colonial abuse that oral testimony alone might not capture.',
    npcIds: ['char.guevara'],
    objectives: [
      'Examine the estate ledger for discrepancies between reported and actual taxes',
      "Cross-reference the ledger entries with Guevara's testimony",
    ],
    rewardXp: 30,
    codexUnlockIds: ['artifact.ibarra-ledger'],
    historicalExplanation:
      'In real colonial Philippines, land disputes between Filipino owners and friar estates were documented in exactly this kind of ledger — and these records were often "lost" when they proved inconvenient to the Church.',
  },
  {
    id: 'mq.ch3.school-on-hill',
    type: 'main',
    chapterId: 'ch3',
    title: 'The School on the Hill',
    storyPurpose:
      "Ibarra's school project, Pilosopo Tasyo's counsel, the Laguna de Bay picnic and crocodile attack, and Elias's rescue.",
    learningObjective:
      "Education as reform — Ibarra believes a school can change San Diego; Tasyo warns it may be burned down. The crocodile attack introduces Elias as a protector figure.",
    npcIds: ['char.tasyo', 'char.elias', 'char.ibarra'],
    objectives: [
      "Visit Tasyo's hut and ask about the school plan",
      'Travel to Laguna de Bay for the picnic gathering',
      'Survive the crocodile/net-tangle mini-game',
      "Witness Elias's rescue of the capsized boater",
    ],
    rewardXp: 100,
    codexUnlockIds: [
      'char.elias',
      'char.tasyo',
      'loc.tasyo-hut',
      'loc.laguna-picnic',
      'event.crocodile-attack',
    ],
    historicalExplanation:
      "Ibarra's school represents Rizal's own belief that education was the path to reform. Tasyo's warning that \"they will burn it down\" foreshadows the novel's later violence — and reflects real historical tensions around Filipino education under Spanish rule.",
  },
  {
    id: 'cq.ch2.old-coin',
    type: 'collectible',
    chapterId: 'ch2',
    title: 'A Colonial Coin',
    storyPurpose:
      'A small artifact connecting the player to the economic systems of colonial Philippines.',
    learningObjective:
      'Spanish colonial coinage as a tangible reminder of the economic control Spain exercised over the Philippines.',
    npcIds: [],
    objectives: ['Find the old coin hidden near the Guardia Civil outpost'],
    rewardXp: 15,
    codexUnlockIds: [],
    historicalExplanation:
      'Spanish colonial coins from the Manila mint (the first in the Americas/Asia) circulated throughout the Pacific, a physical token of the global economic system Spain controlled.',
  },
];

export function getQuestsForChapter(chapterId: string): Quest[] {
  return quests.filter((q) => q.chapterId === chapterId);
}
