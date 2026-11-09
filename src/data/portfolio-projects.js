import { teamProjects } from './team-projects.js';

export const portfolioProjects = [
  {
    id: 'stylovy-chlpac',
    featured: true,
    credit: 'Denis · návrh, texty a realizácia s podporou AI',
    group: 'webs',
    name: 'Štýlový chlpáč',
    title: ['Štýlový', 'chlpáč.'],
    kind: 'Web · rezervácie · administrácia',
    template: 'salon',
    cover: 'salon',
    status: 'Web online · objednanie telefonicky',
    summary:
      'Od rozhovoru v salóne po web, spoločný cenník, rezervačný systém a vlastnú správu prevádzky.',
    url: 'https://stylovychlpac.sk/',
    linkLabel: 'Navštíviť web',
  },
  {
    id: 'zakazko',
    group: 'webs',
    name: 'Zákazko.sk',
    title: ['Zákazko.sk'],
    kind: 'Vlastný produkt · dokumenty',
    template: 'quotes',
    cover: 'quotes',
    status: 'Zverejnený produkt',
    summary: 'Cenová ponuka, zákazkový list a preberací protokol zo spoločných údajov o zákazke.',
    url: 'https://zakazko.sk/',
    linkLabel: 'Vyskúšať produkt',
    steps: [
      {
        label: 'Potreba',
        title: ['Jedna zákazka.', 'Viac dokumentov.'],
        text: 'Pri zákazke na seba nadväzuje cenová ponuka, zákazkový list a preberací protokol. Zákazko.sk ich prepája cez spoločné údaje.',
        tags: ['Cenová ponuka', 'Zákazkový list', 'Protokol'],
      },
      {
        label: 'Riešenie',
        title: ['Údaje raz.', 'Dokumenty spolu.'],
        text: 'Údaje o zákazke tvoria spoločný základ pre jednotlivé dokumenty. Ide o vlastný digitálny produkt, na ktorom prepájam návrh používateľského postupu s realizáciou pomocou AI.',
        tags: ['Spoločné údaje', 'Nadväzujúce výstupy'],
      },
      {
        label: 'Výsledok',
        title: ['Produkt, ktorý', 'sa dá vyskúšať.'],
        text: 'Zákazko.sk je zverejnené na vlastnej doméne. Portfóliová scéna ukazuje princíp s modelovými údajmi; skutočný produkt si môžeš otvoriť cez odkaz.',
        tags: ['Zverejnený produkt'],
        action: true,
      },
    ],
  },
  {
    id: 'corinex',
    group: 'grants',
    name: 'Corinex',
    title: ['Corinex'],
    kind: 'Výskum a inovácie · CASSIS Consult',
    template: 'reference',
    cover: 'corinex',
    status: 'Maximálna dotácia podľa dodatku',
    amount: '482 293 €',
    evidence: 'Zmluva 261/2025 · dodatok č. 1',
    summary: 'Pracovné balíky, projektové podklady a anotácia projektu v rámci tímovej spolupráce.',
    url: 'https://crz.gov.sk/11775252-sk/1/',
    linkLabel: 'Dodatok č. 1 v CRZ',
    steps: [
      {
        label: 'Projekt',
        title: ['Výskum a inovácie.', 'Konkrétna skúsenosť.'],
        text: 'Corinex je jednou z firemných projektových referencií z mojej práce v tíme CASSIS Consult.',
        tags: ['Firemný projekt', 'Tímová spolupráca'],
      },
      {
        label: 'Moja úloha',
        title: ['Štruktúra projektu', 'a jeho podklady.'],
        text: 'Moja práca zahŕňala pracovné balíky, projektové podklady a anotáciu projektu. Táto referencia opisuje konkrétnu časť tímovej práce.',
        tags: ['Pracovné balíky', 'Anotácia', 'Podklady'],
      },
      {
        label: 'Doložený stav',
        title: ['Do 482 293 €', 'podľa dodatku.'],
        text: 'Maximálna dotácia podľa zmluvy 261/2025 v znení dodatku č. 1 predstavuje 482 293 €. Ide o zmluvný limit podpory, nie o doklad jej vyplatenia. Na projekte som sa podieľal v tíme CASSIS Consult.',
        tags: ['Zmluva 261/2025', 'Dodatok č. 1'],
        action: true,
      },
    ],
  },
  {
    id: 'tornala',
    group: 'grants',
    name: 'Autokemping Tornaľa',
    title: ['Autokemping', 'Tornaľa'],
    kind: 'Cestovný ruch · CASSIS Consult',
    template: 'reference',
    cover: 'camp',
    status: 'Príspevok podľa zmluvy',
    amount: '293 500 €',
    evidence: 'Zmluva FNPCR-2025-01-0262',
    summary: 'Podklady k žiadosti a projektová administratíva počas realizácie autokempingu.',
    url: 'https://crz.gov.sk/zmluva/11753202/',
    linkLabel: 'Verejný zdroj k projektu',
    steps: [
      {
        label: 'Projekt',
        title: ['Projekt pre', 'cestovný ruch.'],
        text: 'Autokemping Tornaľa je samosprávna projektová referencia z práce v tíme CASSIS Consult.',
        tags: ['Tornaľa', 'Cestovný ruch'],
      },
      {
        label: 'Moja úloha',
        title: ['Od podkladov', 'k administratíve.'],
        text: 'Na projekte som pracoval s podkladmi k žiadosti aj s projektovou administratívou počas realizácie.',
        tags: ['Podklady k žiadosti', 'Administratíva počas realizácie'],
      },
      {
        label: 'Doložený stav',
        title: ['293 500 €', 'podľa zmluvy.'],
        text: 'Príspevok podľa zmluvy FNPCR predstavuje 293 500 €. Moja referencia zahŕňa prípravu podkladov a projektovú administratívu počas realizácie.',
        tags: ['Príspevok FNPCR'],
        action: true,
      },
    ],
  },
  {
    id: 'horna-kralova',
    group: 'grants',
    name: 'Knižnica Horná Kráľová',
    title: ['Knižnica', 'Horná Kráľová'],
    kind: 'Obnova verejnej budovy · CASSIS Consult',
    template: 'reference',
    cover: 'library',
    status: 'Schválená podpora',
    amount: '867 180,67 €',
    evidence: 'Oznámenie Envirofondu · 28. 9. 2026',
    url: 'https://envirofond.sk/wp-content/uploads/2026/10/6_2026-Podporene_-na-web.pdf#page=13',
    linkLabel: 'Zoznam podporených projektov',
    sourceNote:
      'Verejný zoznam potvrdzuje podporenie projektu. Suma a dátum vychádzajú z oznámenia fondu.',
    budget: true,
    summary: 'Rozpočtové podklady, prílohy a koordinácia pred uzavretím zmluvy.',
    steps: [
      {
        label: 'Projekt',
        title: ['Obnova', 'obecnej knižnice.'],
        text: 'Knižnica v Hornej Kráľovej je projektová referencia z environmentálnej agendy samospráv, na ktorej pracujeme v CASSIS Consult.',
        tags: ['Horná Kráľová', 'Verejná budova'],
      },
      {
        label: 'Moja úloha',
        title: ['Podklady a koordinácia', 'pred zmluvou.'],
        text: 'Rozpočtové podklady, prílohy a koordinácia pred uzavretím zmluvy boli mojou časťou práce na projekte.',
        tags: ['Rozpočtové podklady', 'Prílohy', 'Koordinácia'],
      },
      {
        label: 'Doložený stav',
        title: ['867 180,67 €', 'schválenej podpory.'],
        text: 'V oznámení Environmentálneho fondu z 28. 9. 2026 bola projektu schválená podpora 867 180,67 € (MoF 6/2026).',
        tags: ['MoF 6/2026', 'Oznámenie 28. 9. 2026'],
      },
    ],
  },
  {
    id: 'eurofondova-agenda',
    group: 'grants',
    name: 'Eurofondová agenda',
    title: ['Od zámeru', 'po implementáciu.'],
    kind: 'Pracovný postup · CASSIS Consult',
    template: 'agenda',
    cover: 'agenda',
    status: 'Používam v práci',
    summary:
      'Ako prepájam prípravu žiadostí, rozpočty, zmeny, termíny a podklady počas implementácie.',
  },
];

portfolioProjects.push(...teamProjects);
export const featuredProjects = [...teamProjects, portfolioProjects[0]];
export const projectsForViewer = (project) =>
  project.featured ? featuredProjects : portfolioProjects.filter((item) => !item.featured);

export const findProject = (id) => portfolioProjects.find((project) => project.id === id);
export const projectsInGroup = (group) =>
  portfolioProjects.filter((project) => project.group === group);
