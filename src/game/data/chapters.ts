// Gameplay chapter definitions. See Master Prompt Section 8.

export type Arc = 'prologue' | 'noli' | 'interstitial' | 'fili' | 'epilogue';

export interface Chapter {
  id: string;
  arc: Arc;
  order: number;
  title: string;
  novelEventsSummary: string;
  medalName: string;
  sceneKey: string;
}

export const chapters: Chapter[] = [
  {
    id: 'prologue',
    arc: 'prologue',
    order: 0,
    title: 'The Letter',
    novelEventsSummary: 'Frame story: a 2026 student finds a letter inside a copy of Noli Me Tangere and is pulled into 1887.',
    medalName: '',
    sceneKey: 'PrologueScene',
  },
  {
    id: 'ch1',
    arc: 'noli',
    order: 1,
    title: 'A Stranger in San Diego',
    novelEventsSummary:
      "Arrival in San Diego; the player pieces together Ibarra's homecoming from servant gossip rather than attending the reception directly.",
    medalName: 'Listener',
    sceneKey: 'SanDiegoTownScene',
  },
  {
    id: 'ch2',
    arc: 'noli',
    order: 2,
    title: 'The Fair-Weather Friend',
    novelEventsSummary: "Lt. Guevara reveals the truth of Don Rafael Ibarra's slander, imprisonment, and death.",
    medalName: 'The Ledger',
    sceneKey: 'SanDiegoTownScene',
  },
  {
    id: 'ch3',
    arc: 'noli',
    order: 3,
    title: 'The School on the Hill',
    novelEventsSummary:
      "Ibarra's school project, Pilosopo Tasyo, the Laguna de Bay picnic and crocodile attack, and Elias's rescue.",
    medalName: 'The Cornerstone',
    sceneKey: 'LagunaDeBayScene',
  },
  {
    id: 'ch4',
    arc: 'noli',
    order: 4,
    title: 'The Derrick and the Feast',
    novelEventsSummary: "The cornerstone-laying assassination attempt, Dámaso's tirade, and Ibarra's public breakdown.",
    medalName: 'The Broken Toast',
    sceneKey: 'SanDiegoTownScene',
  },
  {
    id: 'ch5',
    arc: 'noli',
    order: 5,
    title: "Sisa's Song",
    novelEventsSummary: "Crispin and Basilio's persecution, and Sisa's arrest and descent into madness.",
    medalName: 'The Empty Chair',
    sceneKey: 'ForestPathScene',
  },
  {
    id: 'ch6',
    arc: 'noli',
    order: 6,
    title: 'The Uprising That Wasn\u2019t',
    novelEventsSummary: "Salví's staged rebellion, Ibarra's arrest, and Maria Clara's coerced betrayal.",
    medalName: 'The Forged Signature',
    sceneKey: 'SanDiegoTownScene',
  },
  {
    id: 'ch7',
    arc: 'noli',
    order: 7,
    title: 'Across the Lake',
    novelEventsSummary: "Elias's jailbreak of Ibarra, the boat chase, Elias's death, and Sisa's death.",
    medalName: 'The Unfinished Dawn',
    sceneKey: 'LagunaDeBayScene',
  },
  {
    id: 'interstitial',
    arc: 'interstitial',
    order: 8,
    title: 'Thirteen Years',
    novelEventsSummary: 'Time-skip back to the 2026 library frame, then forward onto the steamship Tabo.',
    medalName: 'The Long Silence',
    sceneKey: 'SteamshipScene',
  },
  {
    id: 'ch8',
    arc: 'fili',
    order: 9,
    title: 'Upper Deck, Lower Deck',
    novelEventsSummary: "The steamship's class divide, meeting Simoun, and Cabesang Tales' backstory in flashback.",
    medalName: 'The Dividing Line',
    sceneKey: 'SteamshipScene',
  },
  {
    id: 'ch9',
    arc: 'fili',
    order: 10,
    title: 'The Academy and the Sphinx',
    novelEventsSummary: 'The student petition, UST classroom humiliation, the Quiapo Fair Sphinx, and Basilio\u2019s imprisonment.',
    medalName: 'The Silenced Press',
    sceneKey: 'ManilaScene',
  },
  {
    id: 'ch10',
    arc: 'fili',
    order: 11,
    title: 'The Lamp',
    novelEventsSummary: "Cabesang Tales' tragedy, the wedding-reception bomb plot, and Isagani's last-second save.",
    medalName: 'The Pomegranate Lamp',
    sceneKey: 'ManilaScene',
  },
  {
    id: 'ch11',
    arc: 'fili',
    order: 12,
    title: "Padre Florentino's Shore",
    novelEventsSummary: "Simoun's confession and Padre Florentino's rebuttal on civic virtue over violence.",
    medalName: 'The Sea That Keeps Them',
    sceneKey: 'FlorentinoShoreScene',
  },
  {
    id: 'epilogue',
    arc: 'epilogue',
    order: 13,
    title: 'Bagumbayan',
    novelEventsSummary: "Rizal's real execution, framed through the 2026 student finishing the book.",
    medalName: 'The Illustrado',
    sceneKey: 'EpilogueScene',
  },
];

export function getChapterById(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}
