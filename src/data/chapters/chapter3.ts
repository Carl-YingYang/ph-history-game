// Chapter 3: Ang Paaralan (The School) — hope, resistance, and the schoolmaster's story
import { Chapter } from '@/story/types';

export const chapter3: Chapter = {
  id: 'ch3-paaralan',
  number: 3,
  title: 'Ang Paaralan',
  subtitle: 'The School',
  scenes: [
    // ===== Scene 1: San Diego town plaza =====
    {
      id: 'ch3-s1',
      title: 'San Diego',
      background: {
        id: 'town-plaza',
        effect: 'fade',
        kenBurns: 'right',
      },
      music: 'hopeful',
      ambient: 'town-bells',
      letterbox: true,
      characters: [
        { id: 'ibarra', expression: 'happy', position: 'center', animation: 'idle' },
      ],
      dialogue: [
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'Ibarra travels south to San Diego, the town of his father. The plaza is quiet in the morning mist; the church bell tower looms over the rooftops.',
        },
        {
          speaker: 'ibarra',
          expression: 'happy',
          voice: 'male',
          text: 'San Diego. Even the name sounds like home. And there — the spot where my father wanted to build the school.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'A young man approaches hesitantly. His clothes are simple, his face lined with premature worry.',
        },
        {
          speaker: 'schoolmaster',
          expression: 'thinking',
          name: 'The Schoolmaster',
          voice: 'male',
          text: 'Señor Ibarra? I... I heard you were coming. I am the schoolmaster here. Or what remains of one.',
        },
        {
          speaker: 'ibarra',
          expression: 'surprised',
          voice: 'male',
          text: 'What remains? What do you mean?',
        },
        {
          speaker: 'schoolmaster',
          expression: 'sad',
          voice: 'male',
          text: 'Come. Walk with me. I will show you what it means to teach in San Diego.',
        },
      ],
      historicalNote: {
        id: 'ch3-n1',
        type: 'context',
        title: 'Historical Context — Education in 19th-Century Philippines',
        body: 'Under Spanish rule, education in the Philippines was controlled by religious orders. Schools taught religion and basic literacy, but higher learning — especially science, history, and Spanish itself — was often withheld from Filipinos. A teacher who tried to teach Spanish to Filipino children risked punishment. This system kept the majority of Filipinos dependent on the friars for knowledge and status.',
      },
    },

    // ===== Scene 2: The schoolhouse =====
    {
      id: 'ch3-s2',
      title: 'The Lesson Unlearned',
      background: {
        id: 'schoolhouse',
        effect: 'fade',
        kenBurns: 'in',
      },
      music: 'melancholy',
      ambient: 'quiet-room',
      letterbox: true,
      characters: [
        { id: 'schoolmaster', expression: 'sad', position: 'center', animation: 'idle' },
      ],
      dialogue: [
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'The schoolhouse is small and bare. A handful of desks, a cracked chalkboard, sunlight slanting through slatted windows.',
        },
        {
          speaker: 'schoolmaster',
          expression: 'sad',
          voice: 'male',
          text: 'I was young once, Señor. Full of hope. I thought — if I teach the children Spanish, they can read, they can write, they can become anything.',
        },
        {
          speaker: 'schoolmaster',
          expression: 'sad',
          voice: 'male',
          text: 'The friar found out. He had me beaten. He said I was plotting against the Church. That teaching Spanish was a crime against God.',
        },
        {
          speaker: 'ibarra',
          expression: 'angry',
          voice: 'male',
          text: 'A crime. To teach a language.',
        },
        {
          speaker: 'schoolmaster',
          expression: 'thinking',
          voice: 'male',
          text: 'They keep us ignorant, Señor. An ignorant people cannot question. An ignorant people cannot resist.',
        },
        {
          speaker: 'ibarra',
          expression: 'serious',
          voice: 'male',
          text: 'Then we will build a new school. A real one. Where children learn to think — not just to obey.',
        },
        {
          speaker: 'schoolmaster',
          expression: 'surprised',
          voice: 'male',
          text: 'You would do that? Here? Knowing what they did to your father for the same dream?',
        },
        {
          speaker: 'ibarra',
          expression: 'serious',
          voice: 'male',
          text: 'Especially knowing what they did to my father. I will not let his dream die in that cell with him.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'The schoolmaster’s eyes fill. For the first time in years, he allows himself to hope.',
        },
      ],
      miniInteraction: {
        type: 'inspect',
        prompt: 'Look around the old schoolhouse. Click on the objects to learn what they reveal about teaching under Spanish rule.',
        hotspots: [
          {
            x: 22,
            y: 60,
            label: 'The Chalkboard',
            reveal:
              'The chalkboard is cracked down the middle. Only religious lessons are written on it — the Lord\'s Prayer, the Hail Mary. Secular subjects are forbidden.',
          },
          {
            x: 70,
            y: 45,
            label: 'The Empty Shelves',
            reveal:
              'The shelves should hold books — geography, history, science. Instead they hold only catechisms. Knowledge is rationed by the friars.',
          },
          {
            x: 48,
            y: 75,
            label: 'The Broken Desk',
            reveal:
              'This desk belonged to a boy who was flogged for speaking Spanish in class. He never returned. No one speaks of him.',
          },
        ],
        completeText: 'You have seen enough. The school Ibarra dreams of will be everything this one is not.',
      },
      historicalNote: {
        id: 'ch3-n2',
        type: 'did-you-know',
        title: 'Did You Know? — The Forbidden Language',
        body: 'For much of the Spanish colonial period, the Spanish language was deliberately kept from ordinary Filipinos. The friars preferred to preach in local languages, which allowed them to control religious instruction without empowering Filipinos to read secular or political texts. By the time Rizal wrote Noli Me Tangere, fewer than 5% of Filipinos could speak Spanish — even though it was the official language.',
      },
    },

    // ===== Scene 3: The river — Elías appears =====
    {
      id: 'ch3-s3',
      title: 'A Stranger on the River',
      background: {
        id: 'river-night',
        effect: 'fade',
        kenBurns: 'in',
      },
      music: 'mysterious',
      ambient: 'river-night',
      letterbox: true,
      characters: [
        { id: 'elias', expression: 'serious', position: 'center', animation: 'idle' },
      ],
      dialogue: [
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'That night, walking alone along the Pasig, Ibarra hears the dip of a paddle. A banca glides out of the reeds.',
        },
        {
          speaker: 'elias',
          expression: 'serious',
          name: 'Elías',
          voice: 'male',
          text: 'Señor Ibarra. Do not be alarmed. I come as a friend — though we have never met.',
        },
        {
          speaker: 'ibarra',
          expression: 'surprised',
          voice: 'male',
          text: 'Who are you? How do you know my name?',
        },
        {
          speaker: 'elias',
          expression: 'serious',
          voice: 'male',
          text: 'My name is Elías. I am a boatman. And I know your name because all of San Diego speaks of the man who would build a school.',
        },
        {
          speaker: 'ibarra',
          expression: 'thinking',
          voice: 'male',
          text: 'Then you also know what happened to the last man who tried.',
        },
        {
          speaker: 'elias',
          expression: 'sad',
          voice: 'male',
          text: 'I know. I know more than you think. The friars are already moving against you. They whisper that your school is a plot. That you are a heretic, like your father.',
        },
        {
          speaker: 'ibarra',
          expression: 'angry',
          voice: 'male',
          text: 'Let them whisper. I will not be turned aside.',
        },
        {
          speaker: 'elias',
          expression: 'serious',
          voice: 'male',
          text: 'Then you will need friends, Señor. Men who know the rivers, the back paths, the secrets of this land. Men who have nothing left to lose.',
        },
        {
          speaker: 'ibarra',
          expression: 'serious',
          voice: 'male',
          text: 'And you are such a man?',
        },
        {
          speaker: 'elias',
          expression: 'serious',
          voice: 'male',
          text: 'I am. My family was destroyed by the same system that destroyed yours. I have no name, no fortune, no future — only my strength, and my hatred of injustice.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'A silence falls between them, broken only by the lap of water against the bank. Then Ibarra extends his hand.',
        },
        {
          speaker: 'ibarra',
          expression: 'serious',
          voice: 'male',
          text: 'Then stand with me, Elías. Whatever comes.',
        },
        {
          speaker: 'elias',
          expression: 'serious',
          voice: 'male',
          text: 'I will stand with you, Señor Ibarra. Until the end.',
        },
      ],
      historicalNote: {
        id: 'ch3-n3',
        type: 'biography',
        title: 'Character Biography — Elías',
        body: 'Elías is one of the most complex characters in Noli Me Tangere. Born into a wealthy family ruined by a false accusation, he becomes an outlaw and boatman — a man with nothing to lose. He represents the suffering of the common Filipino and the possibility of violent resistance, in contrast to Ibarra’s path of peaceful reform. Rizal would later contrast these two paths even more sharply in El Filibusterismo.',
      },
    },

    // ===== Scene 4: The shadow of what is to come =====
    {
      id: 'ch3-s4',
      title: 'The Bell Tolls',
      background: {
        id: 'church',
        effect: 'fade',
        kenBurns: 'in',
      },
      music: 'tension',
      ambient: 'church-ambient',
      letterbox: true,
      characters: [],
      dialogue: [
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'Sunday. The church is full. Ibarra sits in the Ibarra pew — the one his father once occupied. The air is thick with incense and silence.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'Fray Dámaso ascends the pulpit. His eyes find Ibarra in the crowd. He begins to speak.',
        },
        {
          speaker: 'damaso',
          expression: 'angry',
          voice: 'male',
          text: 'There are those among us — yes, even in this holy place — who believe they are above the Church. Who believe that a few years in foreign lands give them the right to lead our children astray.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'The congregation holds its breath. No one looks at Ibarra. Everyone looks at Ibarra.',
        },
        {
          speaker: 'damaso',
          expression: 'angry',
          voice: 'male',
          text: 'They build schools. They speak of progress. But what is progress without God? What is a school without the Church? It is a den of heresy. A seed of damnation.',
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
          text: 'Ibarra grips the edge of the pew. The wood creaks. Beside him, Elías places a steady hand on his arm.',
        },
        {
          speaker: 'elias',
          expression: 'serious',
          voice: 'male',
          text: 'Not here, Señor. Not now. They are waiting for you to strike. Do not give them what they want.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'The sermon ends. The bell tolls. Ibarra walks out into the blinding sunlight, and the shadow of what is to come falls long across the plaza.',
        },
      ],
      choices: [
        {
          id: 'ch3-choice-press-on',
          text: 'Press on. The school will be built.',
          setFlag: 'press_on',
        },
        {
          id: 'ch3-choice-caution',
          text: 'Heed Elías. Move carefully, but do not stop.',
          setFlag: 'caution',
        },
      ],
      historicalNote: {
        id: 'ch3-n4',
        type: 'timeline',
        title: 'Historical Timeline — The Road to 1896',
        body:
          '1887 — Noli Me Tangere published in Berlin.\n' +
          '1891 — El Filibusterismo published in Ghent.\n' +
          '1892 — Rizal returns to the Philippines; exiled to Dapitan.\n' +
          '1896 — The Philippine Revolution begins. Rizal is arrested and executed by firing squad on December 30, at age 35.\n' +
          'His death ignites a nation. The school he dreamed of became, in time, a country.',
      },
    },
  ],

  summary: {
    summary:
      'Ibarra arrives in San Diego and meets the broken schoolmaster, learning how the friars strangled education. He vows to build a new school in his father’s name. On the river, the mysterious Elías offers his allegiance. But on Sunday, Fray Dámaso preaches against Ibarra from the pulpit itself — the battle lines are drawn. The dream of the school now walks a razor’s edge between hope and catastrophe.',
    importantCharacters: [
      { name: 'The Schoolmaster', role: 'A teacher broken by the friar’s cruelty' },
      { name: 'Elías', role: 'The mysterious ally who knows the land\'s secrets' },
      { name: 'Fray Dámaso', role: 'The friar who openly preaches against Ibarra' },
    ],
    historicalEvents: [
      'Education was withheld from Filipinos to maintain friar control',
      'Teaching Spanish to Filipinos was treated as a subversive act',
      'Rizal’s novels were banned but circulated secretly',
      'The execution of Rizal in 1896 helped ignite the Philippine Revolution',
    ],
    lessonsLearned: [
      'Education is the first target of every oppressive system',
      'Reform and revolution are two answers to the same injustice',
      'Hope, once planted, is hard to kill — even in those who have lost everything',
    ],
    vocabulary: [
      { term: 'Catechism', definition: 'A summary of religious doctrine, often the only text allowed in colonial schools' },
      { term: 'Pulpit', definition: 'The raised platform from which a priest preaches — a platform of great power' },
      { term: 'Banca', definition: 'A traditional Philippine outrigger canoe, used for river and coastal travel' },
    ],
  },

  quiz: [
    {
      id: 'ch3-q1',
      type: 'multiple-choice',
      question: 'What happened to the schoolmaster when he tried to teach Spanish?',
      options: ['He was promoted', 'He was beaten', 'He was exiled', 'Nothing'],
      correctIndex: 1,
      explanation:
        'The schoolmaster was beaten by the friar for teaching Spanish to Filipino children, which was treated as a subversive act.',
    },
    {
      id: 'ch3-q2',
      type: 'multiple-choice',
      question: 'Who offers to help Ibarra on the river at night?',
      options: ['Lt. Guevarra', 'Capitan Tiago', 'Elías', 'Sisa'],
      correctIndex: 2,
      explanation:
        'Elías, a mysterious boatman whose family was destroyed by the friars, offers Ibarra his allegiance.',
    },
    {
      id: 'ch3-q3',
      type: 'multiple-choice',
      question: 'What does Fray Dámaso do from the pulpit on Sunday?',
      options: [
        'Blesses Ibarra',
        'Announces the school',
        'Preaches against Ibarra',
        'Apologizes to Ibarra',
      ],
      correctIndex: 2,
      explanation:
        'Fray Dámaso uses his sermon to publicly condemn Ibarra and his school project.',
    },
    {
      id: 'ch3-q4',
      type: 'true-false',
      question: 'In the 19th-century Philippines, Spanish was widely taught to Filipino children.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation:
        'False. Spanish was deliberately kept from ordinary Filipinos; fewer than 5% could speak it by Rizal’s time.',
    },
    {
      id: 'ch3-q5',
      type: 'multiple-choice',
      question: 'In what year was José Rizal executed by firing squad?',
      options: ['1887', '1892', '1896', '1901'],
      correctIndex: 2,
      explanation:
        'Rizal was executed on December 30, 1896, at the age of 35. His death helped ignite the Philippine Revolution.',
    },
    {
      id: 'ch3-q6',
      type: 'multiple-choice',
      question: 'What does the schoolmaster say keeps a people obedient?',
      options: ['Fear of God', 'Ignorance', 'Poverty', 'Tradition'],
      correctIndex: 1,
      explanation:
        'The schoolmaster explains that ignorance is the tool the friars use to keep Filipinos from questioning or resisting.',
    },
  ],
};
