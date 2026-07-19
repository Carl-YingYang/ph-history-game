// Rizal Codex — seed data.

export type CodexCategory =
  | 'characters'
  | 'locations'
  | 'terms'
  | 'booksAndLetters'
  | 'events'
  | 'timeline'
  | 'artifacts'
  | 'vocabulary';

export interface CodexEntry {
  id: string;
  category: CodexCategory;
  name: string;
  kind: 'fictional' | 'historical';
  firstAvailableChapter: string;
  summary: string;
  relatedIds?: string[];
}

export const codexEntries: CodexEntry[] = [
  // ---- CHARACTERS ----
  {
    id: 'char.ibarra',
    category: 'characters',
    name: 'Crisóstomo Ibarra (later "Simoun")',
    kind: 'fictional',
    firstAvailableChapter: 'ch1',
    summary:
      'A young, European-educated mestizo who returns to San Diego hoping to reform his country through education. Years later he resurfaces in Manila as the wealthy, embittered jeweler Simoun.',
    relatedIds: ['char.maria-clara', 'char.elias', 'char.damaso'],
  },
  {
    id: 'char.maria-clara',
    category: 'characters',
    name: 'Maria Clara',
    kind: 'fictional',
    firstAvailableChapter: 'ch1',
    summary:
      "Ibarra's childhood sweetheart and Capitán Tiago's daughter, later revealed to be Padre Dámaso's biological child.",
    relatedIds: ['char.ibarra', 'char.damaso', 'char.tiago'],
  },
  {
    id: 'char.elias',
    category: 'characters',
    name: 'Elias',
    kind: 'fictional',
    firstAvailableChapter: 'ch3',
    summary:
      "A fugitive boatman whose family was destroyed generations earlier by Ibarra's own great-grandfather. Becomes Ibarra's protector despite this hidden blood feud.",
    relatedIds: ['char.ibarra', 'char.tasyo'],
  },
  {
    id: 'char.damaso',
    category: 'characters',
    name: 'Padre Dámaso',
    kind: 'fictional',
    firstAvailableChapter: 'ch1',
    summary:
      "An arrogant Franciscan friar and former San Diego parish priest whose slander led to Don Rafael Ibarra's death. Secretly Maria Clara's biological father.",
  },
  {
    id: 'char.salvi',
    category: 'characters',
    name: 'Padre Salví',
    kind: 'fictional',
    firstAvailableChapter: 'ch1',
    summary:
      "San Diego's cunning current parish priest, secretly obsessed with Maria Clara and the architect of the frame-up that destroys Ibarra.",
  },
  {
    id: 'char.tiago',
    category: 'characters',
    name: 'Capitán Tiago',
    kind: 'fictional',
    firstAvailableChapter: 'ch1',
    summary:
      "A wealthy, socially anxious Filipino elite, Maria Clara's legal father, later shown addicted to opium in El Filibusterismo.",
  },
  {
    id: 'char.sisa',
    category: 'characters',
    name: 'Sisa',
    kind: 'fictional',
    firstAvailableChapter: 'ch5',
    summary:
      'A poor, loving mother whose sons Crispin and Basilio are persecuted; the trauma of their disappearance drives her to madness.',
    relatedIds: ['char.basilio', 'char.crispin'],
  },
  {
    id: 'char.basilio',
    category: 'characters',
    name: 'Basilio',
    kind: 'fictional',
    firstAvailableChapter: 'ch5',
    summary:
      "Sisa's older son. Escapes as a child, later becomes a medical student in El Filibusterismo before being radicalized by loss.",
  },
  {
    id: 'char.crispin',
    category: 'characters',
    name: 'Crispin',
    kind: 'fictional',
    firstAvailableChapter: 'ch5',
    summary: "Sisa's younger son, falsely accused of theft and fatally beaten as a child.",
  },
  {
    id: 'char.tasyo',
    category: 'characters',
    name: 'Pilosopo Tasyo',
    kind: 'fictional',
    firstAvailableChapter: 'ch3',
    summary:
      "San Diego's resident intellectual, dismissed by townsfolk as a madman, whose books and advice quietly shape Ibarra's worldview.",
  },
  {
    id: 'char.simoun-reveal',
    category: 'characters',
    name: 'Simoun',
    kind: 'fictional',
    firstAvailableChapter: 'ch8',
    summary:
      'A wealthy, enigmatic jeweler with blue-tinted glasses and immense political influence in Manila — secretly Ibarra, returned to foment revolution.',
    relatedIds: ['char.ibarra'],
  },
  {
    id: 'char.cabesang-tales',
    category: 'characters',
    name: 'Cabesang Tales',
    kind: 'fictional',
    firstAvailableChapter: 'ch8',
    summary:
      'A hardworking farmer stripped of his cleared land by a friar estate; his slow radicalization into the bandit "Matanglawin" is the novel\u2019s clearest case study in how oppression breeds insurgency.',
  },
  {
    id: 'char.juli',
    category: 'characters',
    name: 'Juli',
    kind: 'fictional',
    firstAvailableChapter: 'ch9',
    summary: "Cabesang Tales' daughter and Basilio's sweetheart, forced into indentured servitude to fund her family's legal battle.",
  },
  {
    id: 'char.isagani',
    category: 'characters',
    name: 'Isagani',
    kind: 'fictional',
    firstAvailableChapter: 'ch9',
    summary:
      'An idealistic student and poet whose last-second act of conscience thwarts the wedding-reception bombing.',
  },
  {
    id: 'char.padre-florentino',
    category: 'characters',
    name: 'Padre Florentino',
    kind: 'fictional',
    firstAvailableChapter: 'ch11',
    summary:
      "A kind, scholarly Filipino secular priest who hears Simoun's dying confession and argues that freedom bought through violence and corruption cannot endure.",
  },
  {
    id: 'char.rizal',
    category: 'characters',
    name: 'Dr. José Rizal',
    kind: 'historical',
    firstAvailableChapter: 'epilogue',
    summary:
      'Author of both novels; a physician, writer, and reformist executed by Spanish colonial authorities on December 30, 1896, at Bagumbayan.',
  },

  // ---- LOCATIONS ----
  {
    id: 'loc.san-diego-plaza',
    category: 'locations',
    name: 'San Diego Town Plaza',
    kind: 'fictional',
    firstAvailableChapter: 'ch1',
    summary: 'The social and commercial heart of the fictional town of San Diego.',
  },
  {
    id: 'loc.san-diego-church',
    category: 'locations',
    name: 'San Diego Church & Convent',
    kind: 'fictional',
    firstAvailableChapter: 'ch1',
    summary: "Seat of the parish priest's authority over the town, and Crispin/Basilio's workplace as sextons.",
  },
  {
    id: 'loc.laguna-de-bay',
    category: 'locations',
    name: 'Laguna de Bay',
    kind: 'historical',
    firstAvailableChapter: 'ch3',
    summary: 'A real lake in the novel\u2019s setting, site of the picnic, crocodile scene, and the climactic boat chase.',
  },
  {
    id: 'loc.ust',
    category: 'locations',
    name: 'University of Santo Tomas',
    kind: 'historical',
    firstAvailableChapter: 'ch9',
    summary: "A real Manila university where El Filibusterismo's student characters face discrimination and petition for a Spanish-language academy.",
  },
  {
    id: 'loc.quiapo-fair',
    category: 'locations',
    name: 'Quiapo Fair',
    kind: 'fictional',
    firstAvailableChapter: 'ch9',
    summary: "Site of the talking Sphinx exhibit Simoun secretly commissions to unsettle Padre Salví.",
  },

  // ---- TERMS ----
  {
    id: 'term.ilustrado',
    category: 'terms',
    name: 'Ilustrado',
    kind: 'historical',
    firstAvailableChapter: 'ch1',
    summary: 'An educated, often Europe-trained Filipino elite of the late 19th century; Ibarra and Rizal himself are both ilustrados.',
  },
  {
    id: 'term.principalia',
    category: 'terms',
    name: 'Principalía',
    kind: 'historical',
    firstAvailableChapter: 'ch1',
    summary: 'The land-owning local elite class under Spanish colonial administration, to which Capitán Tiago belongs.',
  },
  {
    id: 'term.friarocracy',
    category: 'terms',
    name: 'Friarocracy',
    kind: 'historical',
    firstAvailableChapter: 'ch1',
    summary: "The de facto political control Spanish friars held over Philippine towns, dramatized through Dámaso and Salví.",
  },
  {
    id: 'term.propaganda-movement',
    category: 'terms',
    name: 'Propaganda Movement',
    kind: 'historical',
    firstAvailableChapter: 'epilogue',
    summary: 'A late-19th-century reform movement of Filipino expatriates in Europe (including Rizal) advocating for political rights via publications like La Solidaridad.',
  },

  // ---- EVENTS ----
  {
    id: 'event.derrick-collapse',
    category: 'events',
    name: 'The Cornerstone Ceremony',
    kind: 'fictional',
    firstAvailableChapter: 'ch4',
    summary: "An assassination attempt disguised as a construction accident during the school's cornerstone-laying.",
  },
  {
    id: 'timeline.rizal-birth',
    category: 'timeline',
    name: '1861 — Rizal is born in Calamba, Laguna',
    kind: 'historical',
    firstAvailableChapter: 'epilogue',
    summary: 'The real-world starting point of the biographical timeline that frames the whole game.',
  },
  {
    id: 'timeline.rizal-execution',
    category: 'timeline',
    name: 'December 30, 1896 — Rizal is executed at Bagumbayan',
    kind: 'historical',
    firstAvailableChapter: 'epilogue',
    summary: "Rizal's execution by firing squad, the historical event the game's Epilogue frames the entire journey around.",
  },
  {
    id: 'book.noli-me-tangere',
    category: 'booksAndLetters',
    name: 'Noli Me Tangere (1887)',
    kind: 'historical',
    firstAvailableChapter: 'ch1',
    summary: 'Rizal\u2019s first novel, published in Berlin, exposing clerical abuse and colonial corruption through Ibarra\u2019s story.',
  },
  {
    id: 'book.el-filibusterismo',
    category: 'booksAndLetters',
    name: 'El Filibusterismo (1891)',
    kind: 'historical',
    firstAvailableChapter: 'ch8',
    summary: 'Rizal\u2019s darker sequel, published in Ghent, following Simoun\u2019s plan for a violent uprising.',
  },

  // ---- CHAPTER 2-3 ADDITIONS ----
  {
    id: 'char.guevara',
    category: 'characters',
    name: 'Lt. Guevara',
    kind: 'fictional',
    firstAvailableChapter: 'ch2',
    summary:
      'A Spanish Guardia Civil lieutenant who privately tells Ibarra the truth about his father Don Rafael\'s death: slandered by Padre Dámaso, imprisoned, and died in jail. His character shows that not all Spanish officials were complicit in the friarocracy\'s abuses.',
    relatedIds: ['char.damaso', 'char.ibarra'],
  },
  {
    id: 'char.don-rafael',
    category: 'characters',
    name: 'Don Rafael Ibarra',
    kind: 'fictional',
    firstAvailableChapter: 'ch2',
    summary:
      "Crisóstomo Ibarra's father, a wealthy and respected Filipino landowner who was falsely accused of heresy by Padre Dámaso, imprisoned, and died in jail. His body was later exhumed from the Catholic cemetery and moved to a Chinese cemetery — a profound indignity that drives Ibarra's grief.",
    relatedIds: ['char.ibarra', 'char.damaso', 'char.guevara'],
  },
  {
    id: 'loc.ibarra-estate',
    category: 'locations',
    name: 'Ibarra Family Estate',
    kind: 'fictional',
    firstAvailableChapter: 'ch2',
    summary:
      "The ancestral home and lands of the Ibarra family in San Diego, now under dispute after Don Rafael's death. The estate records become key evidence in understanding the persecution Ibarra's father faced.",
  },
  {
    id: 'loc.tasyo-hut',
    category: 'locations',
    name: "Pilosopo Tasyo's Hut",
    kind: 'fictional',
    firstAvailableChapter: 'ch3',
    summary:
      "The modest dwelling of San Diego's resident philosopher, filled with banned books that the townsfolk dismiss as the ravings of a madman. A quiet symbol of intellectual resistance.",
  },
  {
    id: 'loc.laguna-picnic',
    category: 'locations',
    name: 'Laguna de Bay Picnic Grounds',
    kind: 'fictional',
    firstAvailableChapter: 'ch3',
    summary:
      "The lakeshore clearing where Ibarra's picnic gathering turns dangerous when a crocodile surfaces from the water, triggering Elias's heroic intervention.",
  },
  {
    id: 'event.don-rafael-persecution',
    category: 'events',
    name: 'The Persecution of Don Rafael',
    kind: 'fictional',
    firstAvailableChapter: 'ch2',
    summary:
      'Don Rafael Ibarra was slandered by Padre Dámaso, accused of heresy and subversion, imprisoned, and died in jail. His body was exhumed from consecrated ground and reburied in the Chinese cemetery — a deliberate posthumous humiliation.',
  },
  {
    id: 'event.crocodile-attack',
    category: 'events',
    name: 'The Crocodile Attack on Laguna de Bay',
    kind: 'fictional',
    firstAvailableChapter: 'ch3',
    summary:
      "During a lakeside picnic, a crocodile surfaces and capsizes a boat. Ibarra dives in to save the trapped boy, but it is Elias — the mysterious boatman — who ultimately pulls both to safety, cementing a bond that will shape the novel's climax.",
  },
  {
    id: 'term.guardia-civil',
    category: 'terms',
    name: 'Guardia Civil',
    kind: 'historical',
    firstAvailableChapter: 'ch2',
    summary:
      "The colonial military police force of Spanish Philippines, tasked with maintaining order but often used to enforce friar authority. Lt. Guevara's membership highlights that some officers privately sympathized with Filipino grievances.",
  },
  {
    id: 'artifact.ibarra-ledger',
    category: 'artifacts',
    name: "Don Rafael's Estate Ledger",
    kind: 'fictional',
    firstAvailableChapter: 'ch2',
    summary:
      "The financial records of the Ibarra estate, which Lt. Guevara uses to show that Don Rafael was a fair landlord — contradicting the friars' claims. A key piece of evidence in the Historical Investigation Encounter.",
  },
];

export function getCodexEntriesForChapter(chapterId: string): CodexEntry[] {
  return codexEntries.filter((e) => e.firstAvailableChapter === chapterId);
}
