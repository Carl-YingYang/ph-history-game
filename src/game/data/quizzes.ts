export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  footnote: string;
}

export interface ChapterQuiz {
  chapterId: string;
  questions: QuizQuestion[];
}

export const chapterQuizzes: ChapterQuiz[] = [
  {
    chapterId: 'ch1',
    questions: [
      {
        question: 'Why was Ibarra\u2019s arrival in San Diego met with social tension?',
        options: [
          'He brought foreign reformist ideas from Europe',
          'He was wanted by the Guardia Civil',
          'He had no money and was looking for work',
          'He was secretly a Spanish spy',
        ],
        correctIndex: 0,
        footnote: 'Ilustrados like Ibarra (and Rizal himself) returned from European study to a colonial society deeply suspicious of the reformist ideas they brought back.',
      },
      {
        question: 'What did Padre D\u00e1maso do at the welcome dinner for Ibarra?',
        options: [
          'He welcomed Ibarra warmly',
          'He insulted Ibarra and his late father',
          'He announced Maria Clara\u2019s engagement',
          'He left the dinner early without speaking',
        ],
        correctIndex: 1,
        footnote: 'D\u00e1maso publicly humiliated Ibarra by speaking ill of his recently deceased father \u2014 a violation of Filipino hospitality norms that shocked the dinner guests.',
      },
      {
        question: 'What is the social role of Capit\u00e1n Tiago in San Diego?',
        options: [
          'He is a revolutionary leader',
          'He is a wealthy elite who caters to Spanish clergy',
          'He is a poor farmer fighting for land rights',
          'He is the town parish priest',
        ],
        correctIndex: 1,
        footnote: 'Capit\u00e1n Tiago represents the principal\u00eda \u2014 the local land-owning elite under Spanish colonial administration who survived by accommodating friar and civil authority.',
      },
    ],
  },
  {
    chapterId: 'ch2',
    questions: [
      {
        question: 'What happened to Don Rafael Ibarra according to Lt. Guevara?',
        options: [
          'He moved to Spain and lived comfortably',
          'He was slandered by Padre D\u00e1maso, imprisoned, and died in jail',
          'He escaped to the mountains and became a bandit',
          'He renounced his faith and was excommunicated',
        ],
        correctIndex: 1,
        footnote: 'Don Rafael was falsely accused of heresy and subversion by Padre D\u00e1maso. After his death in prison, the Church ordered his body exhumed from consecrated ground and reburied in the Chinese cemetery.',
      },
      {
        question: 'Why was Don Rafael\u2019s body moved from the Catholic cemetery?',
        options: [
          'The cemetery was full and needed space',
          'His family requested the move',
          'The Church ordered his exhumation as punishment for alleged heresy',
          'Flooding damaged the burial site',
        ],
        correctIndex: 2,
        footnote: 'The Church\u2019s control over burial rights was a powerful social weapon in colonial Philippines. Denying consecrated burial was one of the harshest penalties the friarocracy could impose.',
      },
      {
        question: 'What does the Ibarra estate ledger reveal?',
        options: [
          'That Don Rafael was secretly wealthy',
          'That Don Rafael was a fair landlord, contradicting the friars\u2019 claims',
          'That Don Rafael owed money to the Church',
          'That the estate was built on stolen indigenous land',
        ],
        correctIndex: 1,
        footnote: 'The ledger serves as documentary evidence against the friars\u2019 narrative. In real colonial Philippines, written records like these were often "lost" or destroyed when they proved inconvenient to Church authorities.',
      },
    ],
  },
  {
    chapterId: 'ch3',
    questions: [
      {
        question: 'What is Ibarra\u2019s plan for the school on the hill?',
        options: [
          'A military training ground for revolutionaries',
          'A school to educate Filipino children, believing education is the path to reform',
          'A church to rival the parish priest\u2019s influence',
          'A business venture to generate income',
        ],
        correctIndex: 1,
        footnote: 'Ibarra\u2019s school project reflects Rizal\u2019s own belief that education \u2014 not armed revolution \u2014 was the path to Philippine progress.',
      },
      {
        question: 'What does Pilosopo Tasyo warn Ibarra about the school?',
        options: [
          'That the school will be too expensive to build',
          'That the government will not allow it',
          'That \u201cthey will burn it down\u201d \u2014 foreshadowing violence',
          'That nobody will send their children to it',
        ],
        correctIndex: 2,
        footnote: 'Tasyo\u2019s warning foreshadows the later destruction of the school and the failure of Ibarra\u2019s reformist project.',
      },
      {
        question: 'Who saves the capsized boater during the crocodile attack on Laguna de Bay?',
        options: [
          'Ibarra dives in and saves him alone',
          'Lt. Guevara and the Guardia Civil arrive in time',
          'Elias \u2014 the mysterious boatman \u2014 pulls both Ibarra and the boy to safety',
          'The crocodile is scared off by the crowd\u2019s shouts',
        ],
        correctIndex: 2,
        footnote: 'Elias\u2019s rescue cements his role as Ibarra\u2019s protector \u2014 a bond forged through action rather than words.',
      },
    ],
  },
];

export function getQuizForChapter(chapterId: string): ChapterQuiz | undefined {
  return chapterQuizzes.find((q) => q.chapterId === chapterId);
}
