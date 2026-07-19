// Chapter 2: Ang Hapunan (The Dinner) — continued confrontation + the truth about Don Rafael
import { Chapter } from '@/story/types';

export const chapter2: Chapter = {
  id: 'ch2-hapunan',
  number: 2,
  title: 'Ang Hapunan',
  subtitle: 'The Dinner',
  scenes: [
    // ===== Scene 1: After the dinner — the Lieutenant =====
    {
      id: 'ch2-s1',
      title: 'A Word in the Garden',
      background: {
        id: 'binondo-street',
        effect: 'crossfade',
        kenBurns: 'left',
      },
      music: 'melancholy',
      ambient: 'night-crickets',
      letterbox: true,
      characters: [
        { id: 'ltenuyarte', expression: 'serious', position: 'center', animation: 'idle' },
      ],
      dialogue: [
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'The dinner has ended. Ibarra steps into the garden, the night air cool against his face. A figure waits in the shadow of a lantern.',
        },
        {
          speaker: 'ltenuyarte',
          expression: 'serious',
          name: 'Lt. Guevarra',
          voice: 'male',
          text: 'Señor Ibarra. A moment, if you please.',
        },
        {
          speaker: 'ibarra',
          expression: 'surprised',
          voice: 'male',
          text: 'Lieutenant. You were at the dinner. You... you said nothing.',
        },
        {
          speaker: 'ltenuyarte',
          expression: 'sad',
          voice: 'male',
          text: 'There are things one does not say at a table full of friars. But here, in the dark, a man may speak the truth.',
        },
        {
          speaker: 'ibarra',
          expression: 'serious',
          voice: 'male',
          text: 'Then speak it, Lieutenant. Dámaso said my father "died like the dead." What did he mean?',
        },
        {
          speaker: 'ltenuyarte',
          expression: 'sad',
          voice: 'male',
          text: 'Your father, Don Rafael, was a good man. But he made an enemy of Fray Dámaso. And in San Diego, that enemy is a god.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'The lieutenant lights a cigar. The ember trembles slightly in his fingers.',
        },
        {
          speaker: 'ltenuyarte',
          expression: 'sad',
          voice: 'male',
          text: 'A dispute over a road. A boy who was flogged. A priest whose pride was wounded. That was all it took.',
        },
        {
          speaker: 'ltenuyarte',
          expression: 'serious',
          voice: 'male',
          text: 'Your father was accused of heresy — of refusing confession, of keeping forbidden books. He was imprisoned. He grew ill. And there, in that cell, he died.',
        },
        {
          speaker: 'ibarra',
          expression: 'angry',
          voice: 'male',
          text: 'A cell. My father died in a cell.',
        },
        {
          speaker: 'ltenuyarte',
          expression: 'sad',
          voice: 'male',
          text: 'I was the one who had to arrest him. I have carried that shame for seven years. Tonight, I give it to you.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'Ibarra’s face is unreadable. The lieutenant bows, and walks back into the light.',
        },
      ],
      historicalNote: {
        id: 'ch2-n1',
        type: 'context',
        title: 'Historical Context — Justice Under Spain',
        body: 'In Spanish-colonial Philippines, justice was heavily influenced by the friars. A priest’s accusation could lead to arrest, confiscation of property, and imprisonment without a fair trial. Civil officials like Lieutenant Guevarra were often caught between their conscience and the power of the Church. This system is one of the central targets of Rizal’s critique in Noli Me Tangere.',
      },
    },

    // ===== Scene 2: María Clara =====
    {
      id: 'ch2-s2',
      title: 'The Promise Kept',
      background: {
        id: 'dining-room',
        effect: 'fade',
        kenBurns: 'in',
      },
      music: 'tender',
      ambient: 'soft-piano',
      letterbox: true,
      characters: [
        { id: 'maria-clara', expression: 'happy', position: 'center', animation: 'idle' },
      ],
      dialogue: [
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'Later that night, María Clara finds Ibarra alone in the parlor. She carries a small wooden box.',
        },
        {
          speaker: 'maria-clara',
          expression: 'happy',
          voice: 'female',
          text: 'Crisóstomo. I kept something for you. All these years.',
        },
        {
          speaker: 'ibarra',
          expression: 'surprised',
          voice: 'male',
          text: 'What is it?',
        },
        {
          speaker: 'maria-clara',
          expression: 'happy',
          voice: 'female',
          text: 'Open it.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'Inside, wrapped in silk, is a letter — Ibarra’s own handwriting, from seven years ago, written the night he sailed for Spain.',
        },
        {
          speaker: 'ibarra',
          expression: 'happy',
          voice: 'male',
          text: 'You kept my letter. All this time.',
        },
        {
          speaker: 'maria-clara',
          expression: 'sad',
          voice: 'female',
          text: 'I read it every night you were gone. It was the only proof that you were real, and not a dream I had invented.',
        },
        {
          speaker: 'ibarra',
          expression: 'serious',
          voice: 'male',
          text: 'I am here now, María. And when this school is built — when my father\'s name is honored — we will be married. As I promised.',
        },
        {
          speaker: 'maria-clara',
          expression: 'happy',
          voice: 'female',
          text: 'I will hold you to that, Crisóstomo. Come back to me whole.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'She places her hand in his. For a moment, the weight of the night lifts. For a moment, they are simply two people in love.',
        },
      ],
      historicalNote: {
        id: 'ch2-n2',
        type: 'biography',
        title: 'Character Biography — María Clara',
        body: 'María Clara is the daughter of Capitan Tiago and (secretly) of Fray Dámaso. She is Ibarra’s betrothed and the novel’s symbol of ideal Filipina womanhood — beautiful, devout, and loyal. But her fate, revealed later in the novel, becomes one of Rizal’s most powerful indictments of the society that destroyed her. Her name later became a traditional Philippine dress style.',
      },
    },

    // ===== Scene 3: The decision — build the school =====
    {
      id: 'ch2-s3',
      title: 'A Vow in the Library',
      background: {
        id: 'library',
        effect: 'fade',
        kenBurns: 'in',
      },
      music: 'determined',
      ambient: 'quiet-room',
      letterbox: true,
      characters: [
        { id: 'ibarra', expression: 'serious', position: 'center', animation: 'idle' },
      ],
      dialogue: [
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'Alone in his father’s old study, surrounded by books that have gathered dust for seven years, Ibarra makes his decision.',
        },
        {
          speaker: 'ibarra',
          expression: 'thinking',
          voice: 'male',
          text: 'I could leave. Take María Clara. Sail back to Europe and forget all of this.',
        },
        {
          speaker: 'ibarra',
          expression: 'serious',
          voice: 'male',
          text: 'But my father died for wanting a school. For believing that Filipinos could be more than what the friars allowed.',
        },
        {
          speaker: 'ibarra',
          expression: 'serious',
          voice: 'male',
          text: 'I will not run. I will build that school. In San Diego. In my father\'s name.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'He opens a drawer. Inside, he finds his father’s old plans — sketches for a schoolhouse, drawn in a careful, hopeful hand.',
        },
        {
          speaker: 'ibarra',
          expression: 'sad',
          voice: 'male',
          text: 'You drew this, Father. Years ago. And no one would help you build it.',
        },
        {
          speaker: 'ibarra',
          expression: 'angry',
          voice: 'male',
          text: 'I will build it. Even if I must lay every stone myself.',
        },
        {
          speaker: 'narrator',
          voice: 'narrator',
          text: 'The candle flickers. Outside, a bell tolls — the church, calling the faithful to prayer. Ibarra does not move.',
        },
      ],
      choices: [
        {
          id: 'ch2-choice-build',
          text: 'Dedicate yourself fully to building the school.',
          setFlag: 'build_school',
        },
        {
          id: 'ch2-choice-investigate',
          text: 'Build the school — but also investigate your father\'s accusers.',
          setFlag: 'investigate',
        },
      ],
      historicalNote: {
        id: 'ch2-n3',
        type: 'did-you-know',
        title: 'Did You Know? — Rizal and Education',
        body: 'José Rizal believed that education was the key to the Philippines’ liberation. He himself was a polymath — speaking over ten languages, trained as an ophthalmologist, and accomplished in art, science, and literature. The school Ibarra dreams of building in Noli Me Tangere reflects Rizal’s real-life conviction that an educated people cannot be kept in subjection.',
      },
    },
  ],

  summary: {
    summary:
      'Lieutenant Guevarra reveals the full truth of Don Rafael Ibarra’s death — imprisoned on false charges by Fray Dámaso, he died in a cell. María Clara reaffirms her love, keeping Ibarra’s letter for seven years. Alone in his father’s study, Ibarra vows to build the school Don Rafael always dreamed of — a monument to his father’s vision and a challenge to the friars’ power.',
    importantCharacters: [
      { name: 'Lt. Guevarra', role: 'The conscience-stricken officer who reveals the truth' },
      { name: 'María Clara', role: 'Ibarra’s beloved, keeper of his promise' },
      { name: 'Don Rafael Ibarra', role: 'Ibarra’s late father — the unseen victim' },
    ],
    historicalEvents: [
      'Friars could accuse Filipinos of heresy without due process',
      'Education was tightly controlled by religious orders',
      'The ilustrado movement began promoting secular education',
    ],
    lessonsLearned: [
      'Knowledge of the truth, however painful, is the first step toward justice',
      'Love and duty can pull a person in opposite directions',
      'A single act of cruelty can echo through generations',
    ],
    vocabulary: [
      { term: 'Heresy', definition: 'A belief contrary to religious doctrine — often used as a political weapon' },
      { term: 'Confession', definition: 'A Catholic sacrament that friars could withhold as punishment' },
      { term: 'Guardia Civil', definition: 'The Spanish colonial police force in the Philippines' },
    ],
  },

  quiz: [
    {
      id: 'ch2-q1',
      type: 'multiple-choice',
      question: 'Who reveals the truth about Don Rafael Ibarra’s death?',
      options: ['Capitan Tiago', 'Lt. Guevarra', 'Fray Dámaso', 'Elías'],
      correctIndex: 1,
      explanation:
        'Lt. Guevarra, the officer who arrested Don Rafael, confesses the truth to Ibarra in the garden.',
    },
    {
      id: 'ch2-q2',
      type: 'multiple-choice',
      question: 'What did María Clara keep for seven years?',
      options: ['A ring', 'A letter from Ibarra', 'A portrait', 'A crucifix'],
      correctIndex: 1,
      explanation:
        'María Clara preserved Ibarra’s farewell letter, reading it every night he was away.',
    },
    {
      id: 'ch2-q3',
      type: 'multiple-choice',
      question: 'What does Ibarra vow to build in his father’s name?',
      options: ['A chapel', 'A school', 'A monument', 'A hospital'],
      correctIndex: 1,
      explanation:
        'Ibarra finds his father’s old plans for a schoolhouse and vows to build it in San Diego.',
    },
    {
      id: 'ch2-q4',
      type: 'true-false',
      question: 'Don Rafael Ibarra died peacefully at home.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'False. He died in prison after being falsely accused of heresy.',
    },
    {
      id: 'ch2-q5',
      type: 'multiple-choice',
      question: 'What was the original dispute that led to Don Rafael’s downfall?',
      options: [
        'A dispute over land',
        'A dispute over a road and a flogged boy',
        'A dispute over money',
        'A dispute over a sermon',
      ],
      correctIndex: 1,
      explanation:
        'A minor dispute over a road and a boy who was flogged escalated into a heresy accusation engineered by Fray Dámaso.',
    },
  ],
};
