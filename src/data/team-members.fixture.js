// Placeholder content for the dev server and tests. It must never reach the
// production bundle; scripts/validate-worker.mjs checks for the sentinel.
export const FIXTURE_SENTINEL = 'ZASTUPNY-OBSAH-DMM';

const member = (id, letter, name, works) => ({
  id,
  letter,
  name,
  portrait: { src: '/favicon.svg', alt: `Zástupný portrét · ${name}`, width: 416, height: 512 },
  sentence: `Zástupná veta o tom, ako ${name} premýšľa nad prácou.`,
  about: [`Zástupný text · krátke predstavenie dodá ${name}.`],
  skills: ['Zástupná schopnosť 1', 'Zástupná schopnosť 2', 'Zástupná schopnosť 3'],
  works,
});
const whole = (project) => ({ project, note: 'Celý web.' });

export const fixtureMembers = [
  member('denis', 'd', 'Denis', [
    {
      project: 'stylovy-chlpac',
      note: 'Web, rezervácie a správa prevádzky; realizácia s podporou AI.',
    },
    { project: 'zakazko', note: 'Vlastný produkt; realizácia s podporou AI.' },
    {
      project: 'eurofondova-agenda',
      note: 'Skúsenosti z tímu CASSIS Consult; nie sú zákazkami d/m/m.',
    },
  ]),
  member(
    'martin',
    'm',
    'Martin',
    ['attilapark', 'previa', 'phlaboratories', 'newera', 'tatrascool'].map(whole),
  ),
  member('miros', 'm', 'Miroš', [{ project: 'attilapark', note: 'Spolupráca na webe.' }]),
];

export const fixtureStory = {
  title: `Zástupný príbeh · ${FIXTURE_SENTINEL}`,
  paragraphs: [
    'Zástupný text · čo tím spojilo, prečo vzniklo d/m/m a čo chce tvoriť, dodá majiteľ.',
  ],
};
