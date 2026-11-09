# Povrch d/m/m — štúdio, projektové náhľady a funkčné ukážky

Stav: 9. 11. 2026. Lokálne rozšírenie existujúceho sveta „Na konci internetu“ pre klientsku ponuku pod schváleným názvom d/m/m. Potvrdené fakty a hranice vlastní `PRODUCT.md`; tento dokument opisuje aktuálne rozhranie. Úvod prepája Experience s Persuade, projektové dvojice vysvetľujú ponuku a ukazujú prácu, články sú Read a formulárové ukážky Operate.

## Zachovaný svet a miestny rozsah

`DESIGN.md` a `.impeccable/design.json` zostávajú zachovaným globálnym vizuálnym systémom: zeleno-čierny priestor, fosfor, jedna os, reverzibilný šesťdielny kryštál, rôzne oblúkové dráhy, natívne hologramy a články nad tým istým svetom. Táto kompozičná iterácia ich nemení. Nezavádza nový globálny systém, laser, zvuk, renderer, render pass ani závislosť; rozpočty pixelov a hmly zostávajú.

Poradie miestnych importov je `intro.css`, `team.css`, `demos.css`, napokon `flight-presentation.css`. Posledný import upravuje úvod, servisný text a projektové náhľady. Jeho hodnoty sú miestne roly tejto plochy, nie náhrada globálnych tokenov. Staršie typografické hodnoty v `team.css` zostávajú základom mimo pripraveného letu alebo pre iné plochy; nepopisujú aktuálny prvý viewport. Nesúvisiaci starší drift sa tu neopravuje.

## Prvý viewport a postup čítania

Prvý viewport vedie zostaveným zeleným kryštálom uprostred. Okolo neho zostáva existujúca navigácia, tichá obslužná vrstva a pokyn „Posúvajte. Objavujte.“. Text „Tri pohľady. Jeden tím.“ a konkrétne služby „Weby. Reklamy. Automatizácie.“ sa objavia až pri scrolle počas reverzibilného rozpadu. Hlavička používa d/m/m a „Digitálne štúdio“; značka neustanovuje právnickú osobu.

Nasleduje šesť dvojíc služby a práce: Attila Park Caravans, PREVIA, PH Laboratories, New Era Barbers, Tatra Scool a Štýlový chlpáč. Fragment prichádza po oblúku, usadí sa na jednej strane osi a automaticky rozvinie stručný HTML náhľad. Náhľad zoskupuje názov, existujúci skutočný záber webu so zeleným filtrom, vecný rozsah a odkaz „Otvoriť príbeh“. Servisné tvrdenie je oproti; pri každej ďalšej dvojici sa strany vymenia. Názvy na pohyblivých beaconoch sú odstránené. Použitie obrázkov v hlavnom lete je nové výslovne potvrdené zadanie a nahrádza skorší miestny zákaz.

Automatický stav `is-presented` nezamyká scroll, interpoláciu ani samostatný pohyb sveta. Hover alebo fokus aktivuje `is-revealed` a podrží čítanie; pokračovanie scrollu podržanie uvoľní. Escape potlačí automatický náhľad do ďalšej zastávky, beacon umožní opätovné otvorenie. Celý článok stále vyžaduje explicitný odkaz. Prestavať celé články nie je súčasťou tejto iterácie.

Na úzkom viewporte sa servisný text a dôkaz skladajú zvislo, s menším fragmentom pri pravom okraji. Nízky landscape zachová protiľahlé plochy a náhľad má natívne vnútorné posúvanie. Posledná dvojica sprístupňuje funkčné ukážky; zostávajú dostupné aj z úvodu a indexu. Päť príbehov predchádzajúcich skúseností má vlastný cyklus a zostáva dostupných cez pôvodné adresy a odkazy na skúsenosti.

Historická kotva `#o-mne` otvára služby a prístup v natívnom `details` pri kontakte. `#kontakt` ukáže jeho začiatok. Osobné profily ani mená nie sú súčasťou verejného rozhrania, metadát, ARIA a kreditov. Akcia „Napíšte nám“ vedie na existujúcu kontaktnú adresu; nová firemná schránka nevznikla.

## Miestne typografické a rozlohové roly

Všetky roly používajú existujúci Instrument Sans (`Instrument`, Arial, sans-serif) a fosforovú paletu. `flight-presentation.css` používa pre pokojný podklad náhľadu `#04130ded` a pre vecný rozsah tlmenú zelenú `#a8cbb3`. Ide o miestne farby čítacej plochy a sekundárneho textu v existujúcom svete.

| Rola v pripravenom lete                  | Aktuálna miestna hodnota                                   | Použitie                                                                                 |
| ---------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Tímový display počas rozpadu             | `clamp(42px, 5.4vw, 76px)`                                 | „Tri pohľady. Jeden tím.“; do 760px `clamp(34px, 9vw, 48px)`                             |
| Úvodné služby                            | `clamp(30px, 3.5vw, 52px)`                                 | Do 760px `25px`; nie sú viditeľné v prvom viewporte                                      |
| Servisné tvrdenie pri projekte           | `clamp(38px, 4.9vw, 72px)`, riadok `1.04`                  | Vyvážený nadpis, fosforové zvýraznenie; do 760px `clamp(29px, 8vw, 38px)`, riadok `1.06` |
| Vysvetlenie služby                       | `clamp(15px, 1.35vw, 18px)`, riadok `1.65`, maximum `36ch` | Do 760px `14px`, riadok `1.5`, maximum `29ch`                                            |
| Názov projektu v náhľade                 | `clamp(24px, 2.5vw, 34px)`, riadok `1.06`                  | Do 760px `25px`                                                                          |
| Popis / vecný rozsah náhľadu             | `14px / 12px`, riadok `1.55 / 1.6`                         | Do 760px `13px / 11px`; rozsah má tlmenú zelenú                                          |
| Článková akcia                           | `13px`, minimum `44px`                                     | Transparentná akcia s fosforovým textom a spodnou linkou                                 |
| Nízky landscape od 761px, do výšky 620px | úvod `36px`, tvrdenie `32px`, vysvetlenie `13px`           | Zmenšenie miestnej hierarchie pri nízkej výške                                           |
| Nadpis služby bez WebGL                  | `36px`, riadok `1.06`                                      | Natívny zoznam; vysvetlenie `16px`, riadok `1.65`                                        |
| Názvy častí kontaktu                     | `clamp(24px, 2.8vw, 36px)`, riadok `1.1`                   | Tím a služby v rozbalenom obsahu                                                         |
| Atribúcia projektu v článku              | `13px`, riadok `1.6`                                       | Konkrétny príspevok pri článku                                                           |

`presentationLayout()` volí zvislé skladanie pod 761px okrem nízkeho landscape so šírkou aspoň 600px a výškou pod 600px. Úzky viewport má bočné okraje 24px; inak je okraj aspoň 40px alebo 7 % šírky. Široký náhľad má najviac 460px a 36 % šírky, úzky využije šírku mínus 48px. Tvrdenie a dôkaz zdieľajú scrollové okno, bez autoplay alebo samostatného scrollového riadenia. Rozdelený fragment používa pod 761px mierku `0.29`, inak `0.66`.

Náhľad má padding 24px, do 760px 18px. Obrázok je orezaný odhora na `clamp(100px, 16svh, 155px)`, do 760px na 105px a pri nízkom širokom landscape na 90px. Výška panelu je obmedzená podľa viewportu; `overflow-y: auto` a `overscroll-behavior-y: contain` sprístupnia spodnú akciu bez presunu stránky. Otvorenie používa rozvinutie cez `clip-path`, priehľadnosť a transformáciu; materiál zostáva natívny HTML panel.

Služby v kontakte používajú definície v pomere `35% / 1fr`, na mobile jeden stĺpec. Kontaktná plocha je posúvateľná s limitom `calc(78svh - 85px)`, na mobile `calc(80svh - 75px)`; vnútorný overscroll sa nešíri ďalej. Index má vlastný limit výšky a zvislý overflow.

## Články a podklady

Päť novších webových referencií má úvod, dve obsahové kapitoly a dôkazový blok. JPEG (960 × 800) sú skutočné zábery prvého viewportu verejných webov z 9. 11. 2026; pôvod a URL uchováva `public/images/team-work/provenance.json`. Náhľady používajú tie isté súbory; salón používa existujúci `chlpac-web-desktop.webp` so svojím pôvodným kontextom. V tejto iterácii nevznikli nové screenshoty ani artwork.

CSS používa `grayscale(1) sepia(0.45) hue-rotate(75deg) saturate(0.65) brightness(0.8)`. Filter zjednocuje prezentáciu, nemení uložený obrázok a nepreukazuje autorstvo ani výsledky. Článkové dôkazy odkazujú na pôvodný web. Internú atribúciu dodanú majiteľom zachováva `PRODUCT.md`; verejný povrch nepoužíva osobné mená. Tatra Scool je konkrétny vzdelávací web, bez nároku na bankovú aplikáciu alebo celý web banky. Grantové skúsenosti z CASSIS Consult sú predchádzajúca práca, nie zákazky d/m/m.

Čítačka zachováva stabilný HTML text, natívne kapitoly a návrat na uložený hlavný scroll. Pri zlyhaní WebGL sa obnoví úplný článok; hlavný zoznam sprístupní náhľady aj servisný text bez projekčných štýlov a inertnosti. Screenshotové články nemajú GSAP ilustračnú stage; fallback ich číta prirodzene s nadpisom pred metadátami. Staršie scénické príbehy si ponechávajú vlastnú GSAP animáciu. Ich obsah a viewer sa touto iteráciou neprestavujú.

## Funkčné ukážky

`demos.css` vlastní formulárovú plochu a je importovaný pred `flight-presentation.css`. `demo-mode` ponecháva zelený svet a spoločný dialóg, no používa stabilný formulár bez kapitolového letu. Pracovná plocha má maximum 1180px a padding 48px 45px 55px. Dva stĺpce `1fr / 1.15fr` sa do 760px zložia do jedného s paddingom 32px 24px 45px. Nadpis je `clamp(36px, 4.5vw, 58px)`, mobilne `clamp(31px, 8.5vw, 45px)`. Natívne polia majú hranaté okraje, minimum 48px a text 16px; termíny minimum 52px, hlavná akcia 50px. Vybraný termín používa `aria-pressed` a fosforovú výplň, stavové správy natívne `role="status"`.

Rezervácia overuje 30-/60-minútovú službu a prekryv s modelovým kalendárom; potvrdením vyradí kolidujúce rozsahy, reset obnoví stav. Reklamné zadanie zo vstupov skladá živý náhľad a stiahne TXT. Obe ukážky sú označené ako funkčné demonštrácie s modelovými údajmi. Nemajú backend, trvalé úložisko, skutočné rezervácie ani pripojenie k reklamnému účtu; textový náhľad je deterministický, bez AI odpovede.

Šesť vybraných prác, päť starších príbehov a dve ukážky tvoria tri oddelené cykly. Návrat obnovuje uloženú polohu hlavného sveta.

## Rozsah overenia

Záverečné lokálne overenie tejto kompozície pokrylo skutočný prehliadač pri 1280 × 900, 390 × 844 a 844 × 390: samostatný kryštál, rozpad, všetkých šesť automatických dvojíc naprieč desktopom a mobilom, článkový návrat a ukážky z poslednej scény. Nebol zaznamenaný horizontálny overflow ani chyba konzoly; odchýlka návratu z článku bola 0px. V nízkom landscape bola spodná článková akcia dostupná po vnútornom posune náhľadu o 116px, bez zmeny scrollu stránky. Formátovanie, lint, všetkých 70 testov a build prešli.

Vizuálna recenzia desiatich platných záberov má výsledok `ship`, bez potrebných materiálnych opráv. Mechanický detektor sa spustil raz: preskočený nadpis bol opravený na `h2`; hlásenie jednotnej 16px hierarchie bolo falošné kvôli načítaniu Vite CSS a odporovalo aktuálnym štýlom aj záberom. Miestne typografické a farebné roly sú zámerné. Dôkazy sú v `outputs/rozvinuty-svet/` nadradeného pracovného chatu z 9. 11. 2026.

Ide o lokálne overenie, nie dôkaz fyzického telefónu, nameraných FPS, obchodného výsledku alebo publikovania. Tento dokumentačný krok prehliadačové testovanie ani celú kontrolnú sadu neopakoval. Skoršie overenie zahŕňalo článkové rozhranie aj pri šírke 921px, fallback, formuláre a natívny download TXT; nejde o nové meranie tejto kompozície.
