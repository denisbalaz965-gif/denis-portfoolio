# Architektúra portfólia

`src/main.js` skladá navigáciu, kontakt, vstupnú animáciu, WebGL let, články, hologramy a kurzor. `initSignal()` beží pred prehliadačom článkov, aby priamy projektový odkaz už poznal dostupnosť WebGL čítačky. Každý modul vracia cleanup pre HMR. Obsah projektov zostáva v `index.html` a `src/data/portfolio-projects.js`.

## Let a vykresľovanie

`flight-model.js` obsahuje čistý prevod scrollu na priebeh letu, výber hlavného projektu, spätné určenie scrollu projektu a ohraničenie polohy hologramu. Šesť zastávok používa priebeh do `FLIGHT_END = 7.25`. `introFracture()` určuje reverzibilný rozpad úvodu; `chapterProgress()` ponechá prvú polovicu kapitolového intervalu stabilnú a potom plynulo presunie kameru k ďalšej zastávke.

`signal.js` vlastní Three.js 0.182.0 renderer, perspektívnu kameru, shader zelenej hmly, šesť skupín krištalických fragmentov, svetlá, prach a geometrické úlomky. Kamera interpoluje scrollový cieľ; projekcia 3D pozícií nastavuje polohy natívnych HTML tlačidiel. Jeden projekt je hlavný a ostatné zostávajú menšie v hĺbke. `fracture-geometry.js` vytvára šesť uzavretých pyramíd od spoločného stredu ku šiestim stenám kocky. V úvode rekonštruujú jeden kryštál; scroll presunie tie isté diely do pozícií projektov a spätný scroll ich opäť spojí. Pixel ratio je obmedzené na 1.25 na počítači a 1 na mobile.

`flight.css`, načítaný po `signal.css`, definuje dráhu 420svh, respektíve 390svh do šírky 760px. Obsah je v režime pripraveného WebGL pevný vo viewporte. Indexové kotvy sa prevádzajú na polohy kamery. Kontakt je na konci dráhy a „O mne“ je natívny rozbaľovací obsah pri kontakte.

Pri odhalenom holograme, laserovom vstupe alebo otvorenom príbehu sa zastaví interpolácia hlavného letu a samostatný pohyb sveta. Aktívna čítačka má vlastný kamerový priebeh, zdieľa však ten istý renderer a zelený svet. Pauza samostatne zastaví časový pohyb, no scroll zostáva funkčný. Skrytá karta nevytvára pokračujúce snímky. Cleanup obnoví pôvodný `history.scrollRestoration`, odstráni udalosti a uvoľní geometrie, materiály a renderer.

Zlyhanie vytvorenia WebGL alebo strata kontextu odstránia režim `flight-ready`. Bežný HTML zoznam zobrazuje názvy, súhrny a odkazy na články; nevyžaduje 3D zásah ani hover.

## Hologramy a vstupy

`holograms.js` vlastní jediný odhalený panel. Odhalí ho mouse pointerenter, fokus tlačidla alebo prvé kliknutie/ťuknutie. Pred otvorením zastaví rozbehnutý smooth scroll na aktuálnej polohe. Odkaz v paneli vyvolá cancelable `portfolio:shoot`. Renderer počas 900ms kreslí laser, zásah, shaderový záblesk a rozlet častí, potom callback otvorí príbeh. Escape zruší čakajúci vstup; priamy odkaz a režim bez WebGL nevyžadujú efekt. Pri strate kontextu sa čakajúci prechod dokončí cez fallback. Interakcia nepoužíva video službu ani zvuk. `aria-expanded` a `inert` držia prístupnosť ovládania v súlade s odhaleným stavom.

Primárna neviditeľná plocha tlačidla má 130 × 140px; vzdialené ciele majú 54 × 54px. Dynamický neviditeľný mostík spája cieľ s panelom. Hologram sa ohraničuje vo viewporte. Escape, zatváranie, kliknutie mimo alebo pokračovanie scrollu panel skryjú. Udalosť `portfolio:hologram` prebudí vykresľovanie a čítací zámok.

`cursor.js` používa štyri zelené rohy a stredový bod. Aktivuje sa iba pre `(hover: hover) and (pointer: fine)`, ignoruje zásahy a nepreberá dotykové ovládanie. `navigation.js` zatvára natívny index pri výbere, kliknutí mimo alebo Escape. `contact.js` kopíruje e-mail s fallbackom.

## Články, história a dôkazy

`project-browser.js` pripája jeden príbeh do natívneho dialógu s vlastným `.case-scroll`. Ak je WebGL pripravené, pripojí `fragment-reader.js`; inak pôvodný GSAP príbeh. Pred výmenou zruší predchádzajúcu čítačku alebo GSAP kontext. Všetkých šesť projektov sa prepína v jednom cykle šípkami, klávesnicou a horizontálnym gestom; zvislé čítanie zostáva natívne.

`#projekt/<id>` umožňuje priamy odkaz. Otvorenie pridá záznam histórie, prepínanie ho nahrádza. Pri otvorení sa uloží scroll a zamkne posúvanie body aj koreňového dokumentu. Zatvorenie obnoví pôvodné hodnoty, presný uložený scroll a fokus otváracieho odkazu. Návrat histórie a prípadné nové otvorenie sa koordinujú, aby oneskorená udalosť nezavrela nový článok.

`fragment-reader.js` si najprv uloží klon úplného pôvodného článku. Z aktuálneho DOM vyberie úvod, skutočné `.story-step` časti a existujúce dôkazové bloky. Vytvorí z nich panely, natívny číslovaný index s `aria-current="step"` a živý ukazovateľ polohy. Počet kapitol je odvodený od obsahu, nie pevne vymyslený; salón má sedem. Dlhšie dôkazy sa posúvajú vo vnútri stabilného panelu.

Každá kapitola má vlastný 3D fragment vytvorený cez `portfolio:reader` v spoločnom rendereri. Kapitolový scroll určuje kameru, jednotka je `max(230px, 0.55 × výška viewportu)` a po 240ms pokoja sa scroll dorovná na nasledujúcu alebo predchádzajúcu zastávku podľa posledného smeru používateľa; programové presuny sa sledujú osobitne. Neaktuálne panely sú inertné. `fragment-reader.css` určuje celoplošný transparentný dialóg, čítacie panely a mobilné/nízke pomery. `reader-world` skryje a zneaktívni celý DOM hlavného letu vrátane úvodu, hologramov a kontaktu; spoločný canvas a horná lišta projektu zostávajú.

Pri `portfolio:flight-fallback` sa čítačka zruší, obnoví uložený klon úplného článku a zavolá `mountFallback`, ktorý pripojí pôvodný `scroll-stories.js`. Ten vlastní jednu GSAP časovú os na kapitolu s vlastným scrollerom a cleanupom. `animations.js` obsluhuje krátky vstup úvodu. WebGL fallback hlavného letu obnovuje `flight-fallback.js`.

HTML a dátový register odlišujú Denisovu konkrétnu úlohu, tím CASSIS Consult, stav podpory a dôkazy. Sumy podpory patria prijímateľom; schválenie a zmluvný limit nie sú vyplatenie ani dokončená realizácia. Zachytená administrácia používa modelové údaje. Výsledky testov rezervácií sú technické skúšky, nie štatistika zákazníkov. Zelený filter starších článkov mení iba prezentáciu; hlavný WebGL let nepoužíva obrázkové klientské náhľady.

## Overenie a zostavenie

`npm run check` skladá formátovanie, ESLint, Vitest a build. Čistý model letu a natívne DOM interakcie sa dajú kontrolovať bez WebGL. Rekonštrukcia kryštálu, laser, prechod čítačky, vnútorné posúvanie dôkazov, fyzický hover cez mostík, dotykové sekvencie a presný návrat kamery vyžadujú aj kontrolu v skutočnom prehliadači; samotný počet unit testov ich nepotvrdzuje. `dist/` je generovaný výstup Vite. Lokálny build, CI a publikovanie sú samostatné výsledky.

Na miestny pokyn majiteľa je pohyb aktívny aj pri systémovom reduced-motion. Pauza pozadia nemení nastavenia systému ani nenahrádza ovládanie príbehov.
