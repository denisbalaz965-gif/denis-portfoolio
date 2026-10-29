export const workflowSteps = [
  {
    icon: '↙',
    title: ['Pochopiť,', 'čo treba riešiť.'],
    description:
      'Z porady alebo správy vyberiem konkrétnu požiadavku. Rozlíšim, čo máme doplniť a ktoré informácie chýbajú.',
    label: 'ZADANIE',
    example: '„Fond žiada doplniť rozpočet. Posledná verzia ešte čaká na kontrolu.“',
    tags: ['Porada', 'Dokumenty', 'E-mail'],
    caption: 'Najprv si ujasním zadanie.',
  },
  {
    icon: '⌁',
    title: ['Spojiť zadanie', 's podkladmi.'],
    description:
      'Požiadavku priradím k projektu, dohľadám súvisiace dokumenty a zapíšem úlohu aj to, na čo čakáme.',
    label: 'PROJEKT A SÚVISLOSTI',
    example: 'Úloha: doplniť rozpočet. Podklad: posledná verzia. Čakáme: potvrdenie kontroly.',
    tags: ['Projekt', 'Podklady', 'Závislosti'],
    caption: 'Každá úloha má svoj kontext.',
  },
  {
    icon: '✓',
    title: ['Overiť verziu', 'aj skutočný stav.'],
    description:
      'Kontrolujem zdroj, údaje a verziu dokumentu. Rozlišujem hotový podklad od návrhu, ktorý ešte čaká na kontrolu.',
    label: 'KONTROLA PODKLADOV',
    example:
      'Rozpočet máme, kontrolu zatiaľ nie. Doplnenie preto ešte nie je pripravené na odoslanie.',
    tags: ['Zdroj', 'Verzia', 'Kontrola'],
    caption: 'Rozhodujem podľa overených podkladov.',
  },
  {
    icon: '↗',
    title: ['Pripraviť výstup', 'a ďalší krok.'],
    description:
      'Z podkladov pripravím návrh odpovede a určím, čo treba dokončiť. Pred odoslaním výstup skontrolujem.',
    label: 'PRACOVNÝ VÝSTUP',
    example: 'Vyžiadať potvrdenie kontroly rozpočtu, doplniť prílohy a pripraviť odpoveď fondu.',
    tags: ['Odpoveď', 'Prílohy', 'Ďalší krok'],
    caption: 'Je jasné, čo nasleduje.',
  },
];
