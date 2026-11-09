# Denis Baláž — portfólio

Osobné portfólio spájajúce weby, digitálne produkty a pracovné postupy s AI so skúsenosťou z prípravy a implementácie grantových projektov.

Portfólio „Na konci internetu“ tvorí jeden súvislý zelený priestor s projektmi, ktoré sa približujú pri posúvaní. [Otvoriť portfólio](https://denis-balaz-portfolio.denis-balaz567.chatgpt.site/).

## Pracovná činnosť

Jedna zvislá cesta vedie cez šesť projektov v poradí: Štýlový chlpáč, Zákazko.sk, Corinex, Autokemping Tornaľa, Knižnica Horná Kráľová a Eurofondová agenda. Fragmenty sa pri posúvaní približujú, zostávajú v čitateľnom intervale a vzďaľujú. Pozadie s vertikálnou osou pokračuje aj cez osobné predstavenie a kontakt. Malý rozbaľovací index presúva návštevníka na vybraný projekt alebo kontakt.

„Otvoriť celý príbeh“ otvorí článok nad tým istým pozadím. Číta sa zvislo; vodorovné potiahnutie, šípky na obrazovke alebo klávesy vľavo/vpravo prepínajú všetkých šesť projektov, vrátane prechodu medzi webmi a grantmi. Na konci sa poradie opakuje. Pripája sa vždy iba jeden príbeh. Zatvorenie obnoví uloženú polohu posúvania hlavnej cesty a fokus otváracieho odkazu. Ide o správanie implementované v zdroji, nie o samostatné potvrdenie výsledkov testovania.

- **Štýlový chlpáč:** päť krokov od zadania po spustenie; odkaz na [živý web](https://stylovychlpac.sk/). Verejné online rezervácie čakajú na doplnenie kalendára salónom. Príbeh obsahuje autentické zábery verejného webu a administrácie z oddeleného prostredia s modelovými údajmi, zjednodušenú schému katalógu a doložené výsledky testov súbehu.
- **[Zákazko.sk](https://zakazko.sk/):** tri kroky vlastného produktu a ilustrované prepojenie troch dokumentov.
- **Corinex, Autokemping Tornaľa a Knižnica Horná Kráľová:** samostatné referencie s konkrétnou úlohou a doloženým stavom podpory.
- **Eurofondová agenda:** pôvodný štvorkrokový postup od zámeru po implementáciu.

Každý príbeh má adresu `#projekt/<id>`, dostupný návrat, prepínanie na ďalší projekt a zatvorenie klávesom Escape. Späť/vpred v prehliadači funguje aj pri otvorenom príbehu. Pôvodné odkazy ako `#web-system` sa prenesú na príslušný príbeh.

Grantové referencie opisujú moju úlohu v tímovej práci. Sumy podpory patria prijímateľom; schválenie a zmluva sa odlišujú od dokončenej realizácie. Súkromné projektové dokumenty a e-maily v repozitári nie sú.

## Spustenie

Potrebuješ Node.js 24.15 alebo novší a npm. Nasledujúce príkazy opisujú postup spustenia a overenia; nie sú záznamom o tom, že aktuálna zmena už kontrolami prešla.

```sh
npm ci
npm run dev
```

Vývojový server: http://127.0.0.1:8793/.

```sh
npm run check
npm run preview
```

`check` spustí kontrolu formátovania, ESLint, testy a produkčný build. Náhľad výsledného buildu je na http://127.0.0.1:8794/.

## Architektúra

HTML a bežný JavaScript s modulmi, CSS, GSAP a Vite. Obsah zostáva v HTML a projektových dátach, nezávisle od dekoratívneho canvasu. Každý fragment má jednu scrollovú časovú os; otvorené príbehy používajú vlastné pôvodné GSAP scény. Canvas 2D kreslí pevné pozadie s geometrickými rovinami a dátovými úlomkami. Funkcie vracajú cleanup pre bezpečné opätovné spustenie pri vývoji.

```text
index.html                 Obsah a sémantická štruktúra
src/main.js                Zostavenie jednotlivých funkcií
src/data/                  Register projektov a overené texty referencií
src/features/              Index, kontakt, fragmenty, canvas a projektové príbehy
src/styles/                Základné, sekčné a responzívne štýly
public/                    Obrázky, fonty, favicon a licenčné oznámenia
tests/                     Funkčné testy v simulovanom DOM
docs/                      Architektúra a historický vizuálny náhľad
PRODUCT.md                 Potvrdené fakty a hranice portfólia
DESIGN.md                  Aktuálny vizuálny systém a normatívne tokeny
.impeccable/design.json     Rozšírenia tokenov a samostatné ukážky komponentov
.openai/hosting.json       Konfigurácia hostingu Sites
```

`dist/` je generovaný výstup príkazu `npm run build` a nie je verzovaný. Vite používa relatívne cesty, aby výsledok fungoval aj v podpriečinku. Podrobnosti sú v [architektúre](docs/architecture.md).

## Overovanie

Projekt obsahuje Vitest/jsdom testy navigácie, kontaktu, projektových odkazov, histórie, gest a príbehov. Aktuálny výsledok kontrol treba posudzovať podľa konkrétneho behu. Rozloženie, mobilnú kompozíciu, návrat na uloženú polohu a obojsmerný scroll je potrebné overovať aj v skutočnom prehliadači. Táto dokumentačná úprava sama žiadny taký výsledok nepotvrdzuje.

Na výslovné zadanie majiteľa zostáva pohyb aktívny aj pri systémovom obmedzení pohybu. „Pozastaviť pozadie“ zastaví samostatný časový posun canvasu; posúvanie naďalej mení hĺbku a polohu fragmentov. Nejde o globálny vypínač animácií. Nastavenia počítača sa nemenia.

GitHub Actions pri pushi a pull requeste spúšťajú `npm run check`. Výsledok lokálnych kontrol, CI a živého nasadenia sú samostatné stavy.

## Vizuál, AI a licencie

Aktuálny lokálny smer používa jeden fosforovo zelený priestor, pevnú vertikálnu os, jemné skenovacie linky a riedke geometrické dátové roviny. Nie sú to doslovné meteority. Úvodný nadpis má úzky statický posunutý výrez. Projekty sa vynárajú a odchádzajú podľa scrollu; nevytvárajú oddelené farebné sekcie.

Článok má pokojnejší tmavý povrch, jemný okraj a rozostrenie za sebou, takže okolitý priestor zostáva viditeľný. Náhľady scén a zachytené obrázky v článku používajú zelený monochromatický filter; pôvodné súbory ani rozlíšenie medzi autentickým záberom, ilustráciou a modelovými údajmi sa tým nemenia. Pôvodné faktické stavy a odkazy zostávajú v príbehoch.

Na návrhu, textoch, implementácii a overovaní spolupracujem s AI. Pôvodný ilustračný ostrov vznikol pomocou OpenAI image_gen a zostáva medzi zdrojovými assetmi. Aktuálne dátové pozadie kreslí Canvas 2D a pohyb príbehov riadia CSS a GSAP. Pri nedostupnosti canvasu zostávajú CSS pozadie, os, HTML obsah a odkazy; aktuálny návrh nemá náhradný torus ani monogram canvasu. Pri skrytej karte sa priebežné kreslenie zastaví.

Historickou inšpiráciou pôvodného hravého priestoru bol Tatrascool; jeho logo, maskot ani assety sa nepoužívajú. Aktuálne kontinuálne zelené prostredie vychádza z potvrdeného zadania majiteľa. Interaktívny príbeh Štýlového chlpáča obsahuje ilustráciu, autentické zábery verejného webu a administráciu s modelovými údajmi; nejde o živú administráciu ani zákaznícke údaje.

Instrument Sans používa SIL Open Font License; znenie je v `public/licenses/InstrumentSans-OFL.txt`. GSAP a ScrollTrigger používajú [vlastnú licenciu](https://gsap.com/standard-license/). Licencie knižníc sa nemenia. Pôvod assetov je v `ASSET-SOURCES.json`.

## Kontakt

Denis Baláž · denisbalaz965@gmail.com · +421 948 835 138

Práca na diaľku · pracovná zmluva alebo dohoda. Denis nemá firmu ani živnosť; portfólio nie je ponuka fakturačných služieb agentúry. Záujem o pracovný rozhovor nie je prísľub zamestnania ani doložený výsledok náboru.
