// Chapter 1: Ang Pagbabalik (The Return)
// Crisóstomo Ibarra returns to Manila after seven years in Europe.
import { Chapter } from '@/story/types';

export const chapter1: Chapter = {
  id: 'ch1-pagbabalik',
  number: 1,
  title: 'Ang Pagbabalik',
  subtitle: 'The Return',
  scenes: [
    // ===== Scene 1: Manila Bay =====
    {
      id: 'ch1-s1',
      title: 'Manila Bay',
      background: {
        id: 'manila-bay',
        effect: 'fade',
        kenBurns: 'in',
      },
      music: 'nostalgic',
      ambient: 'ocean-waves',
      letterbox: true,
      characters: [],
      dialogue: [
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'The year is 1887. The steamship Tabo cuts slowly across Manila Bay, its smoke trailing into a sky burning gold with sunset.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'Aboard her, a young man leans against the railing, watching the walled city of Intramuros rise from the water like a memory.',
        },
        {
          speaker: 'ibarra',
          expression: 'thinking',
          name: 'Crisóstomo Ibarra',
          voice: 'male',
          text: 'Seven years... Seven years since I left these shores. And now, the air smells the same — of salt, of smoke, of home.',
        },
        {
          speaker: 'ibarra',
          expression: 'neutral',
          voice: 'male',
          text: 'I have seen the great cities of Europe. Madrid. Paris. Berlin. And yet none of them called me back as loudly as this bay.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'A passing sailor tips his cap. "We dock within the hour, señor." Ibarra nods, but his eyes remain on the horizon.',
        },
        {
          speaker: 'ibarra',
          expression: 'serious',
          voice: 'male',
          text: 'Father... I have returned. And I will finish what you began.',
        },
      ],
      historicalNote: {
        id: 'ch1-n1',
        type: 'context',
        title: 'Historical Context — Manila, 1887',
        body: 'In 1887, the Philippines had been under Spanish colonial rule for over 300 years. Manila was a bustling port city where East met West — Chinese merchants, Spanish friars, Filipino locals, and European travelers all crossed paths. José Rizal himself returned from Europe this year, carrying the manuscript of Noli Me Tangere, which would be published in Berlin that same year.',
      },
    },

    // ===== Scene 2: Binondo Street =====
    {
      id: 'ch1-s2',
      title: 'The Streets of Binondo',
      background: {
        id: 'binondo-street',
        effect: 'crossfade',
        kenBurns: 'right',
      },
      music: 'melancholy',
      ambient: 'street-ambient',
      letterbox: true,
      characters: [{ id: 'ibarra', expression: 'thinking', position: 'center', animation: 'idle' }],
      dialogue: [
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'Ibarra walks the narrow streets of Binondo, past shop houses with capiz-shell windows glowing in the dusk.',
        },
        {
          speaker: 'ibarra',
          expression: 'thinking',
          voice: 'male',
          text: 'The lanterns are lit. The people move as they always have — hurried, quiet, watchful.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'A carriage clatters past. Inside, a friar glances out — then the curtain falls shut.',
        },
        {
          speaker: 'ibarra',
          expression: 'serious',
          voice: 'male',
          text: 'They watch us. They have always watched us. But I have not come back to be watched.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'He pauses before a modest house. A plaque reads: "Don Rafael Ibarra — In Memoriam."',
        },
        {
          speaker: 'ibarra',
          expression: 'sad',
          voice: 'male',
          text: 'Father... they say you died in prison. They say you died before I could reach you.',
        },
        {
          speaker: 'ibarra',
          expression: 'angry',
          voice: 'male',
          text: 'I will learn the truth. All of it. And I will build the school you always dreamed of — in your name.',
        },
      ],
      historicalNote: {
        id: 'ch1-n2',
        type: 'biography',
        title: 'Character Biography — Don Rafael Ibarra',
        body: 'Don Rafael Ibarra is Crisóstomo’s father — a wealthy and respected Filipino landowner in San Diego. In the novel, he is falsely accused of heresy and subversion by Fray Dámaso after a dispute. He is imprisoned, loses his fortune, and dies in prison before his son returns. His fate is the engine that drives Ibarra’s story.',
      },
    },

    // ===== Scene 3: Capitan Tiago's House =====
    {
      id: 'ch1-s3',
      title: 'A Welcome Home',
      background: {
        id: 'dining-room',
        effect: 'fade',
        kenBurns: 'in',
      },
      music: 'warm',
      ambient: 'dinner-murmur',
      letterbox: true,
      characters: [
        { id: 'tiago', expression: 'happy', position: 'left', animation: 'idle' },
        { id: 'maria-clara', expression: 'happy', position: 'right', animation: 'idle' },
      ],
      dialogue: [
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'Capitan Tiago’s house is ablaze with light. A feast has been prepared. The whole of Manila society seems to have gathered.',
        },
        {
          speaker: 'tiago',
          expression: 'happy',
          voice: 'male',
          text: 'Crisóstomo! My boy! Come, come — let me look at you. Seven years in Europe and you have become a man!',
        },
        {
          speaker: 'ibarra',
          expression: 'happy',
          voice: 'male',
          text: 'Capitan Tiago. You have not changed at all. And this house... it is more splendid than I remembered.',
        },
        {
          speaker: 'tiago',
          expression: 'happy',
          voice: 'male',
          text: 'Splendid because you have returned to it! And look — there is someone who has waited for you longer than any of us.',
        },
        {
          speaker: 'maria-clara',
          expression: 'happy',
          voice: 'female',
          text: 'Crisóstomo... you came back.',
        },
        {
          speaker: 'ibarra',
          expression: 'happy',
          voice: 'male',
          text: 'María Clara. Did you doubt I would? I promised you. Seven years ago, on this very porch, I promised.',
        },
        {
          speaker: 'maria-clara',
          expression: 'sad',
          voice: 'female',
          text: 'I kept your promise in my heart. But seven years is a long time, Crisóstomo. The world changes.',
        },
        {
          speaker: 'ibarra',
          expression: 'serious',
          voice: 'male',
          text: 'Some things do not change. And some things — I have returned to set right.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'Across the room, a heavy figure in a brown habit watches them. His eyes narrow. Fray Dámaso has also returned to Manila this evening.',
        },
      ],
      historicalNote: {
        id: 'ch1-n3',
        type: 'did-you-know',
        title: 'Did You Know? — Capiz Shell Windows',
        body: 'The capiz shell windows seen in old Philippine houses were made from the shells of windowpane oysters (Placuna placenta). They let in soft, diffused light while allowing air to circulate — a beautiful and practical adaptation to the tropical climate unique to Spanish-colonial Filipino architecture.',
      },
    },

    // ===== Scene 4: Confrontation foreshadow =====
    {
      id: 'ch1-s4',
      title: 'The Friar\'s Gaze',
      background: {
        id: 'dining-room',
        effect: 'zoom-in',
        kenBurns: 'in',
      },
      music: 'tension',
      ambient: 'dinner-murmur',
      letterbox: true,
      cameraShake: { intensity: 2, duration: 300 },
      characters: [
        { id: 'damaso', expression: 'angry', position: 'center', animation: 'idle' },
      ],
      dialogue: [
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'Fray Dámaso rises heavily from his chair. The murmur of the dinner fades. Every eye turns.',
        },
        {
          speaker: 'damaso',
          expression: 'angry',
          voice: 'male',
          text: 'So. The son returns. Tell me, boy — did they teach you in Europe to forget the respect due to the Church?',
        },
        {
          speaker: 'ibarra',
          expression: 'surprised',
          voice: 'male',
          text: 'Padre... I have only just arrived. I meant no disrespect.',
        },
        {
          speaker: 'damaso',
          expression: 'angry',
          voice: 'male',
          text: 'No disrespect? Your father said the same. Look where it brought him.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'A stunned silence. Ibarra’s hands clench. Capitan Tiago hurries forward, laughing nervously.',
        },
        {
          speaker: 'tiago',
          expression: 'thinking',
          voice: 'male',
          text: 'Padre Dámaso, please — it is a night for celebration! Let us not speak of old matters.',
        },
        {
          speaker: 'damaso',
          expression: 'angry',
          voice: 'male',
          text: 'Old matters. Yes. Some matters are best left buried... like the dead.',
        },
        {
          speaker: 'ibarra',
          expression: 'angry',
          voice: 'male',
          text: '...',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'Ibarra swallows the words burning in his throat. He will not strike a friar. Not tonight. Not yet.',
        },
      ],
      choices: [
        {
          id: 'ch1-choice-stay-calm',
          text: 'Stay silent. Bide your time.',
          setFlag: 'restraint',
          response: [
            {
              speaker: 'ibarra',
              expression: 'serious',
              voice: 'male',
              text: 'I will not give him the satisfaction. Not yet. There are other ways to honor my father.',
            },
          ],
        },
        {
          id: 'ch1-choice-question',
          text: 'Calmly ask what he meant about your father.',
          setFlag: 'confrontation',
          response: [
            {
              speaker: 'ibarra',
              expression: 'serious',
              voice: 'male',
              text: 'Padre... what do you mean, "like the dead"? What do you know of my father\'s end?',
            },
            {
              speaker: 'damaso',
              expression: 'surprised',
              voice: 'male',
              text: 'Ask the lieutenant. He was there. Ask him — if you dare hear the answer.',
            },
          ],
        },
      ],
      historicalNote: {
        id: 'ch1-n4',
        type: 'context',
        title: 'Historical Context — The Power of the Friars',
        body: 'In 19th-century Philippines, Spanish friars held enormous power — often more than civil officials. They controlled education, land, and the spiritual life of every town. To challenge a friar was to risk social ruin, imprisonment, or worse. Rizal’s novel was a direct attack on this system, and it made him a target.',
      },
    },
  ],

  summary: {
    summary:
      'Crisóstomo Ibarra returns to the Philippines after seven years in Europe. He is welcomed by Capitan Tiago and reunited with María Clara — but the night turns bitter when Fray Dámaso, the friar who once persecuted his father, openly insults the Ibarra name. Ibarra chooses restraint, but the shadow of his father’s death hangs over everything.',
    importantCharacters: [
      { name: 'Crisóstomo Ibarra', role: 'The returning son, carrying dreams of reform' },
      { name: 'María Clara', role: 'Ibarra’s betrothed, bound by love and duty' },
      { name: 'Capitan Tiago', role: 'Wealthy host, father of María Clara' },
      { name: 'Fray Dámaso', role: 'The cruel friar, Ibarra’s adversary' },
    ],
    historicalEvents: [
      '1887 — José Rizal returns from Europe; Noli Me Tangere is published in Berlin',
      'Spanish friars dominate Philippine civil and religious life',
      'Filipino ilustrados (educated class) begin to question colonial rule',
    ],
    lessonsLearned: [
      'The desire for reform often meets the wall of entrenched power',
      'Personal grief can become the seed of public purpose',
      'Restraint in the face of provocation is itself a form of strength',
    ],
    vocabulary: [
      { term: 'Ilustrado', definition: 'The educated Filipino class exposed to European liberal ideas' },
      { term: 'Fraile', definition: 'Spanish for friar — the religious orders that governed colonial parishes' },
      { term: 'Capiz', definition: 'Translucent shell used in traditional Philippine windows' },
    ],
  },

  quiz: [
    {
      id: 'ch1-q1',
      type: 'multiple-choice',
      question: 'How many years did Crisóstomo Ibarra spend studying in Europe?',
      options: ['Five years', 'Seven years', 'Ten years', 'Three years'],
      correctIndex: 1,
      explanation:
        'Ibarra studied in Europe for seven years before returning to the Philippines, a period that shaped his progressive ideals.',
    },
    {
      id: 'ch1-q2',
      type: 'multiple-choice',
      question: 'Who openly insults Ibarra at the welcome dinner?',
      options: ['Capitan Tiago', 'Lt. Guevarra', 'Fray Dámaso', 'Elías'],
      correctIndex: 2,
      explanation:
        'Fray Dámaso, the former parish priest of San Diego, publicly mocks Ibarra and his late father at the dinner.',
    },
    {
      id: 'ch1-q3',
      type: 'true-false',
      question: 'Ibarra’s father, Don Rafael, died peacefully at home surrounded by family.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation:
        'False. Don Rafael Ibarra was imprisoned on false charges and died in prison before his son could return.',
    },
    {
      id: 'ch1-q4',
      type: 'multiple-choice',
      question: 'What does Ibarra vow to build in honor of his father?',
      options: ['A church', 'A school', 'A hospital', 'A mansion'],
      correctIndex: 1,
      explanation:
        'Ibarra dreams of building a school in San Diego — a symbol of progress and a tribute to his father’s vision.',
    },
    {
      id: 'ch1-q5',
      type: 'multiple-choice',
      question: 'In what year is the Noli Me Tangere set (and published)?',
      options: ['1872', '1887', '1896', '1901'],
      correctIndex: 1,
      explanation:
        'The novel is set in the 1880s and was published in 1887 in Berlin by José Rizal.',
    },
  ],
};
