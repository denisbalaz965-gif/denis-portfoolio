# Architektúra portfólia

`src/main.js` skladá navigáciu, kontakt, vstupnú animáciu, články, WebGL let, hologramy a kurzor. Každý modul vracia cleanup pre HMR. Obsah projektov zostáva v `index.html` a `src/data/portfolio-projects.js`.

## Let a vykresľovanie

`flight-model.js` obsahuje čistý prevod scrollu na priebeh letu, výber hlavného projektu, spätné určenie scrollu projektu a ohraničenie polohy hologramu. Šesť zastávok používa priebeh do `FLIGHT_END = 7.25`.

`signal.js` vlastní Three.js 0.182.0 renderer, perspektívnu kameru, shader zelenej hmly, šesť skupín krištalických fragmentov, svetlá, prach a geometrické úlomky. Kamera interpoluje scrollový cieľ; projekcia 3D pozícií nastavuje polohy natívnych HTML tlačidiel. Jeden projekt je hlavný a ostatné zostávajú menšie v hĺbke. Pixel ratio je obmedzené na 1.25 na počítači a 1 na mobile.

`flight.css`, načítaný po `signal.css`, definuje dráhu 420svh, respektíve 390svh do šírky 760px. Obsah je v režime pripraveného WebGL pevný vo viewporte. Indexové kotvy sa prevádzajú na polohy kamery. Kontakt je na konci dráhy a „O mne“ je natívny rozbaľovací obsah pri kontakte.

Pri odhalenom holograme alebo otvorenom článku sa zastaví interpolácia kamery a samostatný pohyb sveta. Pauza samostatne zastaví časový pohyb, no scroll zostáva funkčný. Skrytá karta nevytvára pokračujúce snímky. Cleanup obnoví pôvodný `history.scrollRestoration`, odstráni udalosti a uvoľní geometrie, materiály a renderer.

Zlyhanie vytvorenia WebGL alebo strata kontextu odstránia režim `flight-ready`. Bežný HTML zoznam zobrazuje názvy, súhrny a odkazy na články; nevyžaduje 3D zásah ani hover.

## Hologramy a vstupy

`holograms.js` vlastní jediný odhalený panel. Odhalí ho mouse pointerenter, fokus tlačidla alebo prvé kliknutie/ťuknutie. Pred otvorením zastaví rozbehnutý smooth scroll na aktuálnej polohe. Odkaz v paneli samostatne otvorí článok. `aria-expanded` a `inert` držia prístupnosť ovládania v súlade s odhaleným stavom.

Primárna neviditeľná plocha tlačidla má 130 × 140px; vzdialené ciele majú 54 × 54px. Dynamický neviditeľný mostík spája cieľ s panelom. Hologram sa ohraničuje vo viewporte. Escape, zatváranie, kliknutie mimo alebo pokračovanie scrollu panel skryjú. Udalosť `portfolio:hologram` prebudí vykresľovanie a čítací zámok.

`cursor.js` používa štyri zelené rohy a stredový bod. Aktivuje sa iba pre `(hover: hover) and (pointer: fine)`, ignoruje zásahy a nepreberá dotykové ovládanie. `navigation.js` zatvára natívny index pri výbere, kliknutí mimo alebo Escape. `contact.js` kopíruje e-mail s fallbackom.

## Články, história a dôkazy

`project-browser.js` pripája iba jeden príbeh do natívneho dialógu s vlastným `.case-scroll`. Pred výmenou zruší starý GSAP kontext. Všetkých šesť projektov sa prepína v jednom cykle šípkami, klávesnicou a horizontálnym gestom; zvislé čítanie zostáva natívne.

`#projekt/<id>` umožňuje priamy odkaz. Otvorenie pridá záznam histórie, prepínanie ho nahrádza. Pri otvorení sa uloží scroll a zamkne posúvanie body aj koreňového dokumentu. Zatvorenie obnoví pôvodné hodnoty, presný uložený scroll a fokus otváracieho odkazu. Návrat histórie a prípadné nové otvorenie sa koordinujú, aby oneskorená udalosť nezavrela nový článok.

`scroll-stories.js` riadi jednu GSAP časovú os na otvorenú kapitolu, s jej vlastným scrollerom a cleanupom. Hlavný let už nepoužíva DOM časové osi priblíženia jednotlivých kariet. `animations.js` obsluhuje krátky vstup úvodu.

HTML a dátový register odlišujú Denisovu konkrétnu úlohu, tím CASSIS Consult, stav podpory a dôkazy. Sumy podpory patria prijímateľom; schválenie a zmluvný limit nie sú vyplatenie ani dokončená realizácia. Zachytená administrácia používa modelové údaje. Výsledky testov rezervácií sú technické skúšky, nie štatistika zákazníkov. Zelený filter starších článkov mení iba prezentáciu; hlavný WebGL let nepoužíva obrázkové klientské náhľady.

## Overenie a zostavenie

`npm run check` skladá formátovanie, ESLint, Vitest a build. Čistý model letu a natívne DOM interakcie sa dajú kontrolovať bez WebGL. Render, fyzický hover cez mostík, dotykové sekvencie, čitateľnosť a návrat kamery vyžadujú aj kontrolu v skutočnom prehliadači; samotný počet unit testov ich nepotvrdzuje. `dist/` je generovaný výstup Vite. Lokálny build, CI a publikovanie sú samostatné výsledky.

Na miestny pokyn majiteľa je pohyb aktívny aj pri systémovom reduced-motion. Pauza pozadia nemení nastavenia systému ani nenahrádza ovládanie príbehov.
