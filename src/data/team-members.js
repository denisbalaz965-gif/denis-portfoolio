// What the About layer publishes. Only supplied facts belong here: the members'
// first names, the letters of d/m/m and the works the owner attributed to them.
// Notes repeat the attribution already used in the articles.
//
// A full profile (portrait, own sentence, short introduction and exactly three
// main skills) is added per member once that member supplies it, all four
// fields together; it then gets its own "who" stop and skill facets. Half a
// profile closes the layer and fails `npm run check`. See README.md.
const wholeWeb = (project) => ({ project, note: 'Celý web.' });

export const teamMembers = [
  {
    id: 'denis',
    letter: 'd',
    name: 'Denis',
    works: [
      {
        project: 'stylovy-chlpac',
        note: 'Web, rezervácie a správa prevádzky · realizácia s podporou AI.',
      },
      { project: 'zakazko', note: 'Vlastný produkt · realizácia s podporou AI.' },
      {
        project: 'eurofondova-agenda',
        note: 'Skúsenosti z tímu CASSIS Consult · nie sú zákazkami d/m/m.',
      },
    ],
  },
  {
    id: 'martin',
    letter: 'm',
    name: 'Martin',
    works: ['attilapark', 'previa', 'phlaboratories', 'newera', 'tatrascool'].map(wholeWeb),
  },
  {
    id: 'miros',
    letter: 'm',
    name: 'Miroš',
    works: [{ project: 'attilapark', note: 'Spolupráca na webe.' }],
  },
];

// The studio's shared idea, in the wording already published on the site.
export const teamStory = {
  title: 'Tri pohľady. Jedno spoločné riešenie.',
  paragraphs: [
    'Prepájame návrh, realizáciu a automatizácie. Vaše zadanie dostane spoločný smer a konkrétne riešenie.',
  ],
};
