# Denis Baláž — portfólio

Osobné portfólio spájajúce weby, digitálne produkty a pracovné postupy s AI so skúsenosťou z prípravy a implementácie grantových projektov.

Portfólio „Na konci internetu“ tvorí jeden fosforovo zelený WebGL priestor s krištalickými dátovými úlomkami, hologramami projektov a článkami nad rovnakým pozadím. [Otvoriť portfólio](https://denis-balaz-portfolio.denis-balaz567.chatgpt.site/).

## Pracovná činnosť

Úvod oddeľuje meno Denis Baláž vľavo hore, zachovaný kryštál pod ním a pracovné zameranie vpravo: „Weby. AI. Projektová práca.“ Popis výslovne uvádza podporu AI; tlačidlo „Objaviť projekty“ vstupuje do existujúceho letu. Mobil skladá identitu, kryštál a pracovný blok zvislo.

Na začiatku je jeden členitý šesťboký kryštál zložený zo šiestich uzavretých nepravidelných projektových dielov. Prvý scroll ho rozdelí na projekty; spätný scroll ich spojí. Ďalej scroll ovláda let kamery cez šesť projektov: Štýlový chlpáč, Zákazko.sk, Corinex, Autokemping Tornaľa, Knižnica Horná Kráľová a Eurofondová agenda. Jeden projekt je hlavný, ostatné zostávajú menšie v hĺbke. Dráha má 420svh na počítači a 390svh na mobile. Malý index presúva kameru na projekt alebo záverečný kontakt; osobné predstavenie sa rozbaľuje pri kontakte.

Myšou sa hologram odhalí pri priblížení k projektu, klávesnicou fokusom a na dotykovom zariadení prvým ťuknutím. Odkaz „Otvoriť príbeh“ nechá vybraný úlomok počas 560ms pokojne sa otvoriť a rozvinúť a potom otvorí príbeh. Escape alebo natívne Späť v prehliadači zruší čakajúci vstup. Priamy projektový odkaz sa otvorí okamžite; pri strate WebGL sa vstup dokončí cez fallback. Väčšia neviditeľná plocha cieľa a mostík k panelu udržujú náhľad pri presune kurzora. Odhalenie zastaví aj prebiehajúci plynulý posun. Počas hologramu a príbehu stojí hlavný let. Príbeh má vlastný pohyb kamery medzi kapitolami.

Každá skutočná časť článku dostane vlastný 3D úlomok: úvod, jednotlivé kroky a sekcia dôkazov, ak existuje. Scroll presúva kameru medzi zastávkami a ponecháva interval na čítanie stabilného HTML panelu. Dlhšie texty a podklady sa dajú posúvať aj vnútri panelu. Číslovaný index natívnych tlačidiel prepína kapitoly; počet vychádza z obsahu, pri salóne je ich sedem. Šípky hornej lišty, klávesy vľavo/vpravo a vodorovné gesto naďalej prepínajú všetkých šesť projektov. Zatvorenie obnoví presnú uloženú polohu hlavného letu a fokus odkazu.

- **Štýlový chlpáč:** päť krokov od zadania po spustenie; odkaz na [živý web](https://stylovychlpac.sk/). Verejné online rezervácie čakajú na doplnenie kalendára salónom. Príbeh obsahuje autentické zábery verejného webu a administrácie z oddeleného prostredia s modelovými údajmi, zjednodušenú schému katalógu a doložené výsledky testov súbehu.
- **[Zákazko.sk](https://zakazko.sk/):** tri kroky vlastného produktu a ilustrované prepojenie troch dokumentov.
- **Corinex, Autokemping Tornaľa a Knižnica Horná Kráľová:** samostatné referencie s konkrétnou úlohou a doloženým stavom podpory.
- **Eurofondová agenda:** pôvodný štvorkrokový postup od zámeru po implementáciu.

Každý príbeh má adresu `#projekt/<id>`, dostupný návrat, prepínanie na ďalší projekt a zatvorenie klávesom Escape. Späť/vpred v prehliadači funguje aj pri otvorenom príbehu. Pôvodné odkazy ako `#web-system` sa prenesú na príslušný príbeh.

Grantové referencie opisujú moju úlohu v tímovej práci. Sumy podpory patria prijímateľom; schválenie a zmluva sa odlišujú od dokončenej realizácie. Súkromné projektové dokumenty a e-maily v repozitári nie sú.

## Spustenie

Potrebuješ Node.js 24.15 alebo novší a npm.

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

HTML, modulárny JavaScript, CSS, Three.js 0.182.0, GSAP a Vite. Three.js vykresľuje nepravidelné brúsené fragmenty, 920 častíc, 100 priestorových vláken a procedurálnu zelenú hmlu s kontúrami. Vlastný obsidiánovo-fosforový shader vytvára odlesky a povrchové pásy bez cudzieho modelu či environment mapy. Model letu prevádza scroll na kameru a projekciu natívnych HTML cieľov. Hologramy a články zostávajú v HTML. Pri nedostupnosti WebGL alebo strate kontextu sa zobrazia bežné HTML súhrny a odkazy. Čítačka rozdelí pôvodný úplný článok na reálne obsahové kapitoly a cez udalosti ovláda rovnaký Three.js renderer. Pri strate WebGL obnoví klon pôvodného článku s jeho pôvodnými GSAP scénami. WebGL sa inicializuje pred prehliadačom článkov, aby aj priamy projektový odkaz správne vybral čítačku. Funkcie vracajú cleanup pre opätovné spustenie pri vývoji.

```text
index.html                 Obsah a sémantická štruktúra
src/main.js                Zostavenie jednotlivých funkcií
src/data/                  Register projektov a overené texty referencií
src/features/              Let, WebGL, hologramy, kurzor, index a príbehy
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

Vykresľovanie obmedzuje počet pixelov scény podľa veľkosti okna a hustoty displeja. Náročná procedurálna hmla sa počíta do menšieho priebežne obnovovaného zásobníka; HTML text zostáva ostrý. Projektové prvky sa presúvajú transformáciami s uloženými odkazmi na DOM.

## Overovanie

`npm run check` spúšťa formátovanie, ESLint, Vitest/jsdom testy a produkčný build. Testy pokrývajú aj model letu, polohu hologramov, navigáciu, kontakt, adresy projektov, históriu a čítanie príbehov. jsdom neoveruje výsledný WebGL obraz ani fyzický pohyb myši a dotyku. Hologramy, presun kurzora cez mostík, gestá, návrat na uložený scroll a mobilné rozloženie sa kontrolujú v skutočnom prehliadači. Výsledok konkrétneho behu testov, CI a nasadenia sú samostatné stavy.

Na výslovné zadanie majiteľa zostáva pohyb aktívny aj pri systémovom obmedzení pohybu. „Pozastaviť pozadie“ zastaví samostatný časový posun sveta; scroll stále ovláda let. Otvorený hologram alebo príbeh zastaví interpoláciu hlavného letu; kamera čítačky sa riadi samostatným kapitolovým scrollom. Ovládač nie je globálny vypínač animácií článkov a nemení nastavenia počítača.

GitHub Actions pri pushi a pull requeste spúšťajú `npm run check`.

## Vizuál, AI a licencie

Zelený priestor vytvára shader hmly, vrstvy svetla, krištalická geometria a jemná vertikálna os. Úlomky predstavujú projektové dáta. Hlavný let nepoužíva farebné klientské náhľady ani ich CSS filtrované karty. Štyri zelené rohy vlastného kurzora sa zobrazujú iba pri myši s presným ukazovateľom; mobil používa prirodzené dotykové ovládanie.

`world-finish.css` zjednocuje väčšiu typografiu, hologramy, otvorené čítacie plochy, číslovanie kapitol a kontakt. Posledný import `intro.css` určuje novú kompozíciu úvodu a jej mobilné aj nízke varianty. Každá kapitolová zastávka má objemový brúsený objekt. Pri kontakte posledný projektový ukazovateľ plynulo zmizne.

Hologram je natívny HTML panel s jemne priehľadným zeleným povrchom. Príbeh používa transparentný celoplošný dialóg a pokojné čítacie panely vedľa vlastných 3D úlomkov. Hlavná navigácia a informačné prvky letu sú počas čítania skryté. Dôkazy, obrazovky, prepínanie ukážok a zdrojové odkazy zostávajú zachované; existujúce obrazovky používajú pôvodný zelený prezentačný filter. Prezentácia nemení pôvodné súbory, faktické stavy ani rozlíšenie medzi autentickým záberom, ilustráciou a modelovými údajmi.

Na návrhu, textoch, implementácii a overovaní spolupracujem s AI. Pôvodný ostrov vznikol pomocou OpenAI image_gen a zostáva medzi zdrojovými assetmi. Let, rozpad kryštálu, pokojné otvorenie projektu aj kapitolové úlomky vykresľuje rovnaký Three.js/WebGL renderer; CSS vlastní čítacie panely a GSAP pôvodné fallback príbehy. Otvorenie projektu nepoužíva video službu ani zvuk. Pri skrytej karte sa priebežné kreslenie zastaví. WebGL fallback zachováva natívne HTML súhrny a odkazy aj úplný pôvodný článok.

Historickou inšpiráciou pôvodného hravého priestoru bol Tatrascool; jeho logo, maskot ani assety sa nepoužívajú. Súčasný smer vychádza z potvrdeného zadania majiteľa. Príbeh Štýlového chlpáča zachováva autentické zábery verejného webu a administráciu s modelovými údajmi; nejde o živú administráciu ani zákaznícke údaje.

Instrument Sans používa SIL Open Font License; znenie je v `public/licenses/InstrumentSans-OFL.txt`. Three.js používa licenciu MIT. GSAP a ScrollTrigger používajú [vlastnú licenciu](https://gsap.com/standard-license/). Licencie knižníc sa nemenia. Pôvod assetov je v `ASSET-SOURCES.json`.

## Kontakt

Denis Baláž · denisbalaz965@gmail.com · +421 948 835 138

Práca na diaľku · pracovná zmluva alebo dohoda. Denis nemá firmu ani živnosť; portfólio nie je ponuka fakturačných služieb agentúry. Záujem o pracovný rozhovor nie je prísľub zamestnania ani doložený výsledok náboru.
