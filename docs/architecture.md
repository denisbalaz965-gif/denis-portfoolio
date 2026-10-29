# Architektúra portfólia

## Rozdelenie zodpovedností

`src/main.js` načíta štýly a inicializuje jednotlivé funkcie. Funkcie pracujú s existujúcim HTML, nepotrebujú globálne pomocné premenné a vracajú funkciu na odstránenie listenerov alebo observerov. HMR ju zavolá pred nahradením modulu.

- `navigation.js`: mobilné menu, Escape, prechod na desktop a označenie aktuálnej sekcie.
- `project-filter.js`: viditeľné karty a stav tlačidiel; zmenu oznamuje callbackom.
- `project-dialog.js`: obsah natívneho dialógu, zatvorenie, zámok posúvania a návrat fokusu.
- `workflow-demo.js`: aktuálny krok, obsah a stav jeho ovládania.
- `contact.js`: adresa vychádza z kontaktného odkazu; kopírovanie má textový fallback.
- `animations.js`: GSAP, ScrollTrigger a pohyb podľa rozmerov a typu ukazovateľa. Ostatné moduly nepotrebujú poznať GSAP.

Dlhšie projektové texty a kroky sú v `src/data/`. Renderujú sa cez textové uzly; zalomenie titulku kroku je explicitné pole riadkov. Obsah nie je interpretovaný ako HTML.

Prvý krok ukážky je aj v statickom HTML. Návštevník ho vidí pred načítaním JavaScriptu; pri inicializácii sa zosúladí s dátami.

## Štýly a vizuálne správanie

Importy v `src/styles/main.css` zachovávajú pôvodné poradie kaskády. Responzívne pravidlá sú na konci. Premenné farieb, písma a rozostupov zostávajú v `foundations.css`.

Vstupné animácie a scrollové efekty majú samostatné GSAP kontexty. `matchMedia` vytvorí desktopové efekty po prekročení breakpointu a odstráni ich pri návrate na mobil. Pohyb myšou používa znovupoužiteľné `quickTo` animácie; pri deaktivácii sa listenery odstránia. Štítky v úvode sa neposúvajú spolu s ilustráciou.

## Testy

Testy používajú skutočné `index.html` ako fixture, takže overujú aj prepojenie značiek a funkcií. Simulované sú len rozhrania, ktoré jsdom nemá: layout observer, media query a natívne otvorenie dialógu. Rozloženie, natívna práca s fokusom a animácie sa kontrolujú samostatne v prehliadači.

## Build a publikovanie

`npm ci` používa lockfile. Vite vytvorí `dist/`; zdrojové súbory ani testy sa do verejného webu nekopírujú. Relatívny base umožňuje nasadenie v koreňovej adrese aj podpriečinku. Hosting sa riadi `.openai/hosting.json` a publikuje build z konkrétneho zdrojového commitu.

História pred refaktorom zostáva v Gite. Návrat je možný k predchádzajúcemu commitu bez prepisovania jeho histórie.
