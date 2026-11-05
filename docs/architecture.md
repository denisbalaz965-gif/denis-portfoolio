# Architektúra portfólia

`src/main.js` zostavuje navigáciu, kontakt, vstupné animácie a dve scrollové kapitoly. Každá funkcia vracia cleanup pre HMR.

## Obsah a pohyb

Celý obsah je v `index.html`. Päť krokov webovej tvorby a štyri kroky grantového projektu zostávajú v prirodzenom poradí aj bez JavaScriptu. Kotvy vedú priamo na obsah. Vizuálne makety sú označené `aria-hidden`, pretože význam vysvetľuje priľahlý text; nepoužívajú zákaznícke údaje ani živé API.

`scroll-stories.js` vytvára jednu GSAP timeline a jeden ScrollTrigger na kapitolu. Časová os vlastní všetky transformácie jej objektov; CSS vlastní kompozíciu a sticky scénu. Začiatok a koniec vychádzajú z polohy skutočného textu. Spätné posúvanie vracia tú istú časovú os. Mobil má samostatné pomery, rozmery a textové pásmo pod scénou. GSAP matchMedia obnovuje kontext pri zmene rozmerov alebo systémového nastavenia pohybu.

Pri reduced motion je scéna statická a textové kroky nemajú vynútenú výšku. Len vývojový build podporuje `?motion=full` pre prehliadačové QA. Žiadny prepínač animácií ani serverová integrácia nie sú súčasťou produktu.

`animations.js` obsluhuje vstup, hero parallax a about. `navigation.js` mobilné menu a aktuálnu kapitolu. `contact.js` kopírovanie s fallbackom.

## Overenie a publikovanie

Vitest používa skutočné HTML a preveruje menu, kontakt a konečné/stredné/spätné stavy oboch scén. jsdom nenahrádza vizuálnu a scrollovú kontrolu v prehliadači. `npm run build` vytvorí ignorované `dist/`. Sites publikuje tento výstup z konkrétneho pushed commitu podľa `.openai/hosting.json`. Staršie modálne príbehy a filter kariet nahradila súvislá hlavná stránka; ich predchádzajúca verzia zostáva v Gite.
