# Architektúra portfólia

`src/main.js` zostavuje navigáciu, kontakt, vstupné animácie a dve scrollové kapitoly. Každá funkcia vracia cleanup pre HMR.

## Obsah a pohyb

Celý obsah je v `index.html`. Päť krokov webovej tvorby a štyri kroky grantového projektu zostávajú v prirodzenom poradí aj bez JavaScriptu. Kotvy vedú priamo na obsah. Vizuálne makety sú označené `aria-hidden`, pretože význam vysvetľuje priľahlý text; nepoužívajú zákaznícke údaje ani živé API.

`scroll-stories.js` vytvára jednu GSAP timeline a jeden ScrollTrigger na kapitolu. Časová os vlastní všetky transformácie jej objektov; CSS vlastní kompozíciu a sticky scénu. Začiatok a koniec vychádzajú z polohy skutočného textu. Spätné posúvanie vracia tú istú časovú os. Mobil má samostatné pomery, rozmery a textové pásmo pod scénou. GSAP matchMedia obnovuje kontext pri zmene rozmerov.

Na výslovný pokyn majiteľa z 5. 11. 2026 sú animácie na tejto stránke aktívne aj pri `prefers-reduced-motion: reduce`. Ide o konfiguráciu webu; nastavenia systému ani iných stránok sa nemenia. Vývojový parameter na vynútenie pohybu už nie je potrebný. Celý obsah zostáva v HTML aj bez JavaScriptu.

`animations.js` obsluhuje vstup, hero parallax a about. `navigation.js` mobilné menu a aktuálnu kapitolu. `contact.js` kopírovanie s fallbackom.

## Overenie a publikovanie

Vitest používa skutočné HTML a preveruje menu, kontakt a konečné/stredné/spätné stavy oboch scén. jsdom nenahrádza vizuálnu a scrollovú kontrolu v prehliadači. `npm run build` vytvorí ignorované `dist/`. Sites publikuje tento výstup z konkrétneho pushed commitu podľa `.openai/hosting.json`. Staršie modálne príbehy a filter kariet nahradila súvislá hlavná stránka; ich predchádzajúca verzia zostáva v Gite.

## Výber projektov a samostatné príbehy

Od tejto verzie hlavná stránka obsahuje dva krátke karusely. `portfolio-projects.js` je register stabilných ID, skupín, názvov, URL, konkrétnych úloh a doložených stavov. `project-browser.js` vykreslí jednu kartu v každej skupine a otvorí vybraný projekt do natívneho dialógu na celú obrazovku.

Dialóg má vlastný `.case-scroll`; ten sa odovzdáva ScrollTriggeru cez `scroller`. Neaktívne príbehy zostávajú v inertných šablónach. Pred každou výmenou sa zruší starý GSAP kontext a nový príbeh začína navrchu. Zvislé posúvanie zostáva natívne. Vodorovné gesto sa spracúva iba na vizuálnej ploche a vyžaduje dostatočnú vzdialenosť a prevahu vodorovného smeru.

URL `#projekt/<id>` sa dá otvoriť priamo. Otvorenie z prehľadu pridá jeden záznam histórie, striedanie projektov ho nahrádza. Zatvorenie obnoví prehľad a fokus. Nové otvorenie počas čakajúceho návratu histórie sa zaradí za návrat; oneskorená udalosť close nesmie zavrieť už znovu otvorený dialóg. Pri otvorení sa zamyká posúvanie koreňového dokumentu aj body, pôvodné hodnoty sa obnovia pri zatvorení.

Referencie majú konkrétne vlastné texty. Všeobecný proces implementácie je oddelený ako Eurofondová agenda; vrstva rozpočtu sa v referenčnej scéne zapína iba tam, kde je uvedená rozpočtová úloha. Žiadne zákaznícke údaje alebo súkromné grantové originály sa nepoužívajú.
