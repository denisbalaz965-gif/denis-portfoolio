# Povrch d/m/m — štúdio, projektové náhľady a funkčné ukážky

Stav: 9. 11. 2026. Lokálne rozšírenie existujúceho sveta „Na konci internetu“ pre klientsku ponuku pod schváleným názvom d/m/m. Potvrdené fakty a hranice vlastní `PRODUCT.md`; tento dokument opisuje aktuálne rozhranie. Úvod prepája Experience s Persuade, projektové dvojice vysvetľujú ponuku a ukazujú prácu, články sú Read a formulárové ukážky Operate.

## Zachovaný svet a miestny rozsah

`DESIGN.md` a `.impeccable/design.json` zostávajú zachovaným globálnym vizuálnym systémom: zeleno-čierny priestor, fosfor, jedna os, reverzibilný šesťdielny kryštál, rôzne oblúkové dráhy, natívne hologramy a články nad tým istým svetom. Normatívne tokeny a sidecar sa nemenia; `DESIGN.md` dopĺňa iba aktuálnu lokálnu komponentovú výnimku. Nezavádza nový globálny systém, laser, zvuk, renderer, render pass ani závislosť; rozpočty pixelov a hmly zostávajú.

Poradie miestnych importov je `intro.css`, `team.css`, `demos.css`, napokon `flight-presentation.css`. Posledný import upravuje úvod, servisný text a projektové náhľady. Jeho hodnoty sú miestne roly tejto plochy, nie náhrada globálnych tokenov. Staršie typografické hodnoty v `team.css` zostávajú základom mimo pripraveného letu alebo pre iné plochy; nepopisujú aktuálny prvý viewport. Nesúvisiaci starší drift sa tu neopravuje.

## Prvý viewport a postup čítania

Prvý viewport vedie zostaveným zeleným kryštálom uprostred. Okolo neho zostáva existujúca navigácia, tichá obslužná vrstva a pokyn „Posúvajte. Objavujte.“. Text „Tri pohľady. Jeden tím.“ a konkrétne služby „Weby. Reklamy. Automatizácie.“ sa objavia až pri scrolle počas reverzibilného rozpadu. Hlavička používa d/m/m a „Digitálne štúdio“; značka neustanovuje právnickú osobu.

Nasleduje šesť dvojíc služby a práce: Attila Park Caravans, PREVIA, PH Laboratories, New Era Barbers, Tatra Scool a Štýlový chlpáč. Fragment prichádza po oblúku, usadí sa na jednej strane osi a automaticky rozvinie stručný HTML náhľad. Úplne transparentná kompozícia zoskupuje pôvodné logo alebo značku a pod ním presný názov, stručný vecný rozsah a odkaz „Otvoriť príbeh“. Logo je tiež natívny článkový odkaz. Wrapper nemá panel, rám, tieň, blur ani orezanie; existujúci zelený svet ostáva viditeľný. Servisné tvrdenie je oproti; pri každej ďalšej dvojici sa strany vymenia. Názvy na pohyblivých beaconoch sú odstránené. Najnovšia výslovná korekcia majiteľa nahrádza skorší screenshotový náhľad: v hlavnom lete sú len pôvodné značky, názov, rozsah a článková akcia. Zábery webov zostávajú v celých článkoch.

Automatický stav `is-presented` nezamyká scroll, interpoláciu ani samostatný pohyb sveta. Hover alebo fokus aktivuje `is-revealed` a podrží čítanie; pokračovanie scrollu podržanie uvoľní. Escape potlačí automatický náhľad do ďalšej zastávky, beacon umožní opätovné otvorenie. Celý článok stále vyžaduje explicitný odkaz. Prestavať celé články nie je súčasťou tejto iterácie.

Na úzkom viewporte sa servisný text a identita skladajú zvislo, s menším fragmentom pri pravom okraji. Nízky landscape zachová protiľahlé polohy; značka sa zmenší podľa dostupnej výšky, aby rozsah aj článková akcia zostali viditeľné bez vnútorného posúvania. Posledná dvojica sprístupňuje funkčné ukážky; zostávajú dostupné aj z úvodu a indexu. Päť príbehov predchádzajúcich skúseností má vlastný cyklus a zostáva dostupných cez pôvodné adresy a odkazy na skúsenosti.

Historická kotva `#o-mne` otvára služby a prístup v natívnom `details` pri kontakte. `#kontakt` ukáže jeho začiatok. Osobné profily ani mená nie sú súčasťou verejného rozhrania, metadát, ARIA a kreditov. Akcia „Napíšte nám“ vedie na existujúcu kontaktnú adresu; nová firemná schránka nevznikla.

## Miestne typografické a rozlohové roly

Všetky roly používajú existujúci Instrument Sans (`Instrument`, Arial, sans-serif) a fosforovú paletu. `flight-presentation.css` preberá fosfor, sekundárny text a jemnú spodnú linku zo zdedených premenných `--phosphor`, `--world-copy` a `--world-rule`. Projektová identita nemá vlastný podklad. Zelené zjednotenie originálnych log robí len CSS filter.

| Rola v pripravenom lete                  | Aktuálna miestna hodnota                                   | Použitie                                                                                 |
| ---------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Tímový display počas rozpadu             | `clamp(42px, 5.4vw, 76px)`                                 | „Tri pohľady. Jeden tím.“; do 760px `clamp(34px, 9vw, 48px)`                             |
| Úvodné služby                            | `clamp(30px, 3.5vw, 52px)`                                 | Do 760px `25px`; nie sú viditeľné v prvom viewporte                                      |
| Servisné tvrdenie pri projekte           | `clamp(38px, 4.9vw, 72px)`, riadok `1.04`                  | Vyvážený nadpis, fosforové zvýraznenie; do 760px `clamp(29px, 8vw, 38px)`, riadok `1.06` |
| Vysvetlenie služby                       | `clamp(15px, 1.35vw, 18px)`, riadok `1.65`, maximum `36ch` | Do 760px `14px`, riadok `1.5`, maximum `29ch`                                            |
| Názov projektu v náhľade                 | `clamp(24px, 2.3vw, 30px)`, riadok `1.12`                  | Do 760px `25px`                                                                          |
| Vecný rozsah pod názvom                  | `14px`, riadok `1.6`                                       | Do 760px `13px`, riadok `1.5`; zdedený sekundárny text                                   |
| Článková akcia                           | `13px`, minimum `44px`                                     | Transparentná akcia s fosforovým textom a spodnou linkou                                 |
| Nízky landscape od 761px, do výšky 620px | úvod `36px`, tvrdenie `32px`, vysvetlenie `13px`           | Zmenšenie miestnej hierarchie pri nízkej výške                                           |
| Nadpis služby bez WebGL                  | `36px`, riadok `1.06`                                      | Natívny zoznam; vysvetlenie `16px`, riadok `1.65`                                        |
| Názvy častí kontaktu                     | `clamp(24px, 2.8vw, 36px)`, riadok `1.1`                   | Tím a služby v rozbalenom obsahu                                                         |
| Atribúcia projektu v článku              | `13px`, riadok `1.6`                                       | Konkrétny príspevok pri článku                                                           |

`presentationLayout()` volí zvislé skladanie pod 761px okrem nízkeho landscape so šírkou aspoň 600px a výškou pod 600px. Úzky viewport má bočné okraje 24px; inak je okraj aspoň 40px alebo 7 % šírky. Široká identita má najviac 480px a 36 % šírky, úzka využije šírku mínus 48px. Služba a identita zdieľajú scrollové okno. Rozdelený fragment používa pod 761px mierku `0.29`, inak `0.66`.

`signal.js` pri inicializácii a resize raz zmeria servisný text a caption vrátane horného odstupu. Čistý layout používa uložené `copyHeight` a `captionHeight` a vracia aj `markHeight`; vykresľovacia slučka preto nečíta layout. Logo má maximum 340px na šírku a 220px na výšku, pri úzkom skladaní 170px; podľa dostupnej výšky sa zmenší aj v landscape. `object-fit: contain` neorezáva pôvodný znak. Caption je pod značkou s odstupom 20px, mobilne 16px a pri nízkom širokom landscape 12px. Wrapper má padding 0, `overflow: visible`, bez maximálnej výšky, rámu, blur, pozadia, tieňa alebo `clip-path`. Kompaktná transparentná článková akcia má minimum 44px, vlastnú spodnú linku a nevyplňuje šírku identity.

Projektový yaw a tilt vychádzajú z interpolovaného scrollového priebehu. `scrollTurn()` ohraničí hlavnú dráhu 0…7.25 na jednu plnú otáčku 0…2π; spätný scroll otáčanie obráti a ustálenie ho zastaví. Čítačka používa rovnaký helper normalizovaný podľa skutočného počtu kapitol. Časová fáza zostáva pre atmosféru a jemný samostatný pohyb sveta, nie yaw projektov.

Služby v kontakte používajú definície v pomere `35% / 1fr`, na mobile jeden stĺpec. Kontaktná plocha je posúvateľná s limitom `calc(78svh - 85px)`, na mobile `calc(80svh - 75px)`; vnútorný overscroll sa nešíri ďalej. Index má vlastný limit výšky a zvislý overflow.

## Články a podklady

Šesť skutočných značiek je v `public/images/brand-marks/`: Attila Park Caravans, PREVIA, PH Laboratories, New Era Barbers, Tatra Scool a Štýlový chlpáč. `provenance.json` uvádza oficiálne verejné zdroje a získanie 9. 11. 2026; štyri PNG majú vložené metadáta pôvodu. Attila PNG je pôvodný dekódovaný data-URI obrázok z hlavičky webu bez zmeny pixelov. Logá sa nevymýšľali ani negenerovali. Bankový symbol používaný na konkrétnom webe Tatra Scool sprevádza presný názov a obmedzený rozsah; neoznačuje prácu na celom webe banky ani priamy bankový kontrakt.

Päť novších webových článkov má úvod, dve obsahové kapitoly a dôkazový blok. JPEG (960 × 800) sú skutočné zábery prvého viewportu verejných webov z 9. 11. 2026; pôvod a URL uchováva `public/images/team-work/provenance.json`. Salón zachováva `chlpac-web-desktop.webp` so svojím pôvodným kontextom. Tieto screenshoty zostávajú iba v celých článkoch; ich prestavba je odložená.

CSS používa `grayscale(1) sepia(0.45) hue-rotate(75deg) saturate(0.65) brightness(0.8)`. Filter zjednocuje prezentáciu, nemení uložený obrázok a nepreukazuje autorstvo ani výsledky. Článkové dôkazy odkazujú na pôvodný web. Internú atribúciu dodanú majiteľom zachováva `PRODUCT.md`; verejný povrch nepoužíva osobné mená. Tatra Scool je konkrétny vzdelávací web, bez nároku na bankovú aplikáciu alebo celý web banky. Grantové skúsenosti z CASSIS Consult sú predchádzajúca práca, nie zákazky d/m/m.

Čítačka zachováva stabilný HTML text, natívne kapitoly a návrat na uložený hlavný scroll. Pri zlyhaní WebGL sa obnoví úplný článok; hlavný zoznam sprístupní náhľady aj servisný text bez projekčných štýlov a inertnosti. Screenshotové články nemajú GSAP ilustračnú stage; fallback ich číta prirodzene s nadpisom pred metadátami. Staršie scénické príbehy si ponechávajú vlastnú GSAP animáciu. Ich obsah a viewer sa touto iteráciou neprestavujú.

## Funkčné ukážky

`demos.css` vlastní formulárovú plochu a je importovaný pred `flight-presentation.css`. `demo-mode` ponecháva zelený svet a spoločný dialóg, no používa stabilný formulár bez kapitolového letu. Pracovná plocha má maximum 1180px a padding 48px 45px 55px. Dva stĺpce `1fr / 1.15fr` sa do 760px zložia do jedného s paddingom 32px 24px 45px. Nadpis je `clamp(36px, 4.5vw, 58px)`, mobilne `clamp(31px, 8.5vw, 45px)`. Natívne polia majú hranaté okraje, minimum 48px a text 16px; termíny minimum 52px, hlavná akcia 50px. Vybraný termín používa `aria-pressed` a fosforovú výplň, stavové správy natívne `role="status"`.

Rezervácia overuje 30-/60-minútovú službu a prekryv s modelovým kalendárom; potvrdením vyradí kolidujúce rozsahy, reset obnoví stav. Reklamné zadanie zo vstupov skladá živý náhľad a stiahne TXT. Obe ukážky sú označené ako funkčné demonštrácie s modelovými údajmi. Nemajú backend, trvalé úložisko, skutočné rezervácie ani pripojenie k reklamnému účtu; textový náhľad je deterministický, bez AI odpovede.

Šesť vybraných prác, päť starších príbehov a dve ukážky tvoria tri oddelené cykly. Návrat obnovuje uloženú polohu hlavného sveta.

## Rozsah overenia

Predchádzajúce lokálne overenie aktuálnej značkovej kompozície zahŕňalo formátovanie, lint, 73 testov a build. Desať platných záberov pokrýva všetkých šesť identít pri desktopovej šírke 1280px, dva mobilné stavy pri 390px, 320 × 740 a 844 × 390. Dodané merania potvrdili načítané značky, transparentný wrapper, neprítomnosť webových náhľadov, dostupnú článkovú akciu a neprítomnosť horizontálneho overflow. Otvorenie článku cez logo a návrat mali odchýlku 0px; záverečné znovunačítanie neprinieslo nové chyby konzoly.

Recenzia v `outputs/volne-nahlady/review.txt` nadradeného pracovného chatu prijala vizuálny rozsah; jej jediný nález bol zastaraný opis rámovaného panelu v `DESIGN.md`. Tento dokumentačný krok opravuje iba príslušnú prózu a sprievodnú dokumentáciu, zachováva frontmatter aj sidecar a neopakuje runtime kontrolu, build ani snímky. Skorší screenshotový stav bol medzičasom používateľom odmietnutý a nie je aktuálnym cieľom.

Ide o lokálne overenie, nie dôkaz fyzického telefónu, nameraných FPS, vnímanej kadencie, obchodného výsledku alebo publikovania. Statické zábery nepreukazujú plynulosť otáčania; deterministický uhol, ohraničenie, spätný smer a malé kroky dokladajú zdroj a testy.

## Priamy vstup do eurofondových príbehov

Štyri existujúce eurofondové príbehy sú dostupné priamo v indexe prác. Odkaz „Eurofondové projekty“ vedie z úvodného pracovného bloku aj z poslednej webovej zastávky na Corinex; článkové šípky sprístupnia ďalšie zachované skúsenosti. Na úzkom a nízkom viewporte sa odkazy na demo a eurofondy zoskupujú do krátkeho pružného radu s cieľmi minimálne 44px. Označenie práce v CASSIS Consult zostáva v článkoch, počet šiestich hlavných projektových úlomkov sa nemení.

## Aktuálna miestna kompozícia — 10. 11. 2026

Táto zmena nahrádza staršiu hierarchiu servisného sloganu a názvu pod logom. Presný názov projektu vedie na pôvodnej strane textu (`clamp(42px, 4.7vw, 68px)`, mobil 32–42px, nízky landscape 30px). Pod ním je stručný opis (18–24px, mobil 17px), rozsah (13px, mobil 12px) a explicitný natívny odkaz „Pozrieť príbeh projektu“ s minimálnou výškou 48px / 44px. Názov sa neduplikuje pod logom. Menší pôvodný znak na protiľahlej strane má maximum 240px, na mobile a nízkom landscape 160px, vždy contain. Odkaz loga ostáva druhým natívnym vstupom do rovnakého článku.

Recenzia je blízko pod článkovým odkazom s vlastným väčším odstupom (36px, mobil 24px, nízky landscape 12px). Päť rovnakou kresbou vytvorených SVG hviezd má brúsené plochy; nejde o štandardné znaky Unicode. Holografický účinok vytvára jemný lokálny svetelný závoj a textová žiara, bez blikania, ďalšej renderovacej slučky či WebGL vrstvy. Pri každom citáte sú naraz viditeľné „Demo recenzia“ aj vysvetlenie „Ilustračný text · nie je hodnotením klienta“. Nie je tu vymyslené meno, portrét, číselný súhrn ani skutočné hodnotenie.

`presentationLayout()` vertikálne centruje skutočne zmeraný text na desktope s hornou hranicou aspoň 88px. Mobil začína text od 96px alebo 12 percent výšky; logo nasleduje s medzerou aspoň 24px a má najviac 96px na výšku. Výška značky aj caption sa započítava do dostupného priestoru. Každý opis, odkaz a demo citát ostáva natívny HTML obsah aj pri výpadku WebGL. Hover alebo fokus na textovom povrchu podrží čítanie rovnako ako hover na značke; scroll podržanie uvoľní.

Zelený svet, šesť projektov, pomalá scrollová otáčka, úvod, priame eurofondové vstupy, funkčné ukážky a existujúce celé články zostávajú zachované. Ide o lokálne rozšírenie schváleného sveta, nie o zmenu globálnych tokenov v DESIGN.md alebo sidecare.

## Dvojica služby a realizácie — aktuálne spresnenie 10. 11. 2026

Každá zastávka spája konkrétnu službu s konkrétnou realizáciou na opačnej strane osi. Projektová plocha `.flight-copy` zachováva názov, stručný opis, rozsah, článkový odkaz a obidve viditeľné demo označenia recenzie. Logo sa presunulo priamo k názvu do `.project-identity`: má samostatný natívny článkový odkaz s pevným priestorom 80×64px, mobilne56×44px. Názov zostáva hlavný, logo menší podpis.

Protiľahlý `.hologram` už predstavuje zodpovedajúcu službu. `.service-offer h3` používa fosfor,32–52px a riadok1.05; sprievodný text15–18px/1.6, najviac34ch, odstup24px. Mobil používa25px nadpis,13px/1.5 text a odstup12px; nízky landscape29px nadpis a13px text. Obsah nemá box ani screenshot. Dismiss zostáva dostupný44×44px.

Na desktope sa obe skutočne zmerané plochy centrujú samostatne, servisná začína aspoň104px odhora. Na mobile je služba pod projektom s medzerou aspoň24px. Už sa nepočíta miesto pre veľké logo v holograme ani premenná mark-height; rozmery identity sú stabilné a zahrnuté v zmeranom projekte. Merania stále prebiehajú iba pri resize/inicializácii. Natívne článkové odkazy, držanie čítania, otočka úlomkov a celý svet zostávajú rovnaké.

Hlavná dráha nepridáva prázdny reklamný projekt alebo falošné KPI. Interný zoznam dopĺňania oddeľuje podklady k webom, reklamám, interakciám, eurofondovej práci v CASSIS a nakoniec skutočným referenciám. Táto lokálna zmena nemení globálne tokeny ani starší sidecar.

## Aktuálna autorita: ponuka je hlavná, projekt je dôkaz — 10. 11. 2026

Táto korekcia podľa používateľovej snímky prevažuje staršie miestne opisy projektovej dominancie. `service-offer.css` je posledný import po `flight-presentation.css`; je lokálnym kompozičným rozšírením existujúceho sveta. Globálne tokeny a sidecar sa nemenia. Ponuka služby vedie rozsahom aj mierkou: H2 60–88px/0.99, úvod18–22px/1.5, tri konkrétne súčasti dodávky15px/1.5 v otvorenom zozname s jemnými linkami a kontaktná akcia14px s výškou aspoň52px. Jedna doteraz generická veta nestačila, preto každá služba pomenúva čo dodáme a aký ďalší krok návštevník môže spraviť.

Dôkaz má užší stĺpec: projekt H3 28–38px/1.08, stručný opis16px, rozsah12px, vedľajší článkový odkaz13px, menšie pôvodné logo64×52px. Recenzia je pokojnejšia, bez svetelného závoja/žiarivého textu,14px a s hviezdami14×17px; oba demo štítky zostávajú. Hologram nemá vizuálne tlačidlo na zatvorenie primárnej ponuky. Zostávajú natívne článkové a kontaktné odkazy, existujúca klávesnicová cesta a fragmentové správanie.

Na širokom viewporte má ponuka39percent šírky (najviac600px), projekt30percent (najviac420px), strany sa striedajú pri zachovanej osi50percent. Ponuka začína vyššie, približne18percent výšky s ohraničením podľa svojho skutočného obsahu; dôkaz je pokojnejšie centrovaný. Na mobile je ponuka prvá v DOM aj vizuálne; H2 34–44px, úvod15px, konkrétne súčasti12px a akcia aspoň44px. Dôkaz je pod ňou s medzerou24px; názov23px, opis13px a kratší citát12px. Samostatná riadková scope informácia je na mobile nadbytočná, celý rozsah je v článku. Nevzniká vnútorný scroll ani požiadavka na ďalšie gesto.

`presentationLayout()` vracia rozdielne šírky ponuky a dôkazu, hlavný renderer iba projektuje uložené rozmery; meranie zostáva pri inicializácii/resize. V nízkom landscape sú menšie typografické roly a nepodstatný spodný HUD je skrytý, aby nekolidoval s kontaktnou akciou. WebGL rozpočty, scrollová otočka, kryštál, pozadie, index, články, staré grantové vstupy a atribúcie zostávajú. Požiadavka na rozšírenie ponuky neoprávňuje na vymyslené výsledky, skutočné recenzie ani klientské KPI.

Escape uvoľní manuálne podržanie čítania, ale aktuálnu automaticky zobrazenú ponuku neskryje ani nezneprístupní. Ponuka je obsah stránky, nie zatvárateľný projektový náhľad; pri ďalšej zastávke sa normálne vymení. Staršie manuálne fragmentové správanie bez automatickej zastávky zostáva zachované.

## Aktuálne rozloženie: otvorená schéma ponuky — 10. 11. 2026

Používateľ odmietol konvenčné skladanie nadpis → odsek → tri rovnaké linkované riadky → tlačidlo. Primárna ponuka zostáva, mení sa jej vnútorná topológia. `service-map` zaberá200px na výšku. Tri autorské geometrické facety (inlineSVG s presnými súradnicami) sa pripájajú ku konkrétnym trom natívnym položkám zoznamu. Popisy sú vľavo30/44/33percent a zhora4/40/76percent, s rozdielnou šírkou70/56/67percent. Spojnice končia pri svojom texte; geometria je aria-hidden, význam nesie natívny zoznam. Nenahrádza funkčnú ukážku webu ani reálny projekt a nezavádza obrázkovú ilustráciu.

Opis ponuky je odsadený12percent, kontaktná akcia má prirodzenú šírku a zakončuje dolný pravý okraj. Hlavný nadpis zostáva dominantný; projekt a modelová recenzia sú stále menší dôkaz na druhej strane osi. Sú tu otvorené plochy a vetvenie, nie ďalší panel alebo tri karty. Všetky faktické texty a článkové adresy ostávajú.

Na mobile má mapa124px, popisy13px/1.4 a opis sa zarovná späť k ľavému okraju; pri nízkom landscape má mapa90px a popisy11px. Kontaktné ciele ostávajú aspoň44px. Na mobiloch nižších než780px sa skryje nepodstatný spodný pokyn/koordináty, aby sa viac priestoru venovalo ponuke a dôkazu. Vizuálna geometria nemá vlastnú animovaciu slučku a zostáva stabilná pri čítaní. Pôvodný scroll, WebGL rozpočty, článkové návraty a Escape dostupnosť primárnej ponuky zostávajú. Globálne tokeny a starší sidecar sa nemenia.

V nízkom landscape sa kontaktná akcia zarovná na začiatok servisného stĺpca, aby sa neprekrývala s existujúcim ovládačom pozadia v pravom dolnom rohu. Desktop a portrét zachovávajú pravé zakončenie kompozície.

## Záverečné zloženie — 10. 11. 2026

Lokálne rozšírenie zachováva existujúci svet a globálne tokeny. Posledný import je teraz `contact-finale.css`; servisná kompozícia zostáva v `service-offer.css`. Na jednom scrollovom čase sú oddelené fázy gather6.32–7.22, slide7.25–7.82 a reveal7.66–8.1 s ustálením do8.35. Rovnakých šesť 3D klinov sa zbieha do spoločnej polohy, mierky a rotácie, drobné satelity ustúpia. Po zložení sa kryštál presunie na24.5percent šírky, mobil17percent/18.5percent výšky. Nie je pridaný renderer, laser ani nová geometria. Natívny scroll je vratný, priame #kontakt otvorí finálny stav.

Formulár je samostatná pokojná plocha napravo od osi; na mobile pod kryštálom. Pri nízkej výške alebo úzkom mobile sa posúva jeho obsah, aby dostupnosť polí a pôvodných kontaktov nezávisela od zmenšovania textu. Doručovacie stavy a serverové hranice sú v docs/resend-setup.md. Pri vypnutom napojení je tlačidlo nedostupné s vysvetlením a priamym e-mailom. Existujúce články, index, návraty, kopírovanie e-mailu a grantové atribúcie zostávajú.

## Aktuálny úvod, ostrosť a footer — 10. 11. 2026

Lokálne rozšírenie schváleného sveta; globálny DESIGN.md/sidecar ostávajú. Posledný import `opening-and-footer.css` upravuje len úvod, kontaktový prechod a footer. Úvodné H1 „Nápad máte. My tvoríme.“ má52–88px, ponuka28–42px a opis16–19px. Mobil vedie40–54px H1, ponukou23px a opisom13px. Pôvodný tichý štart, kryštál, rozpad aj vstupy do dôkazov ostávajú. Hlavná akcia má tmavý text na fosfore, s explicitným fallbackom k dokumentovanej farbe. Rovnaký fallback opravuje predpripravený aktívny stav formulára; nevytvára sa nový systém tokenov.

Foreground už nie je natiahnutý z podnatívneho rozlíšenia veľkého desktopu. Rozpočty sú8.5MP/1.5DPR desktop a1.4MP/2DPR mobil; drahý ambient shader má nezávisle960/640px dlhšiu hranu a stále20Hz aktualizáciu. Kontúry majú fwidth vyhladenie s nízkou intenzitou. Text zostáva natívny DOM. Pozastavenie a zastavenie pri neviditeľnom dokumente ostávajú. Renderová politika má test na podnatívny pôvodný prípad a bounded prácu; nejde o FPS benchmark.

Track535svh nesie koniec9.65. Kontakt má vlastný stabilný bod8.25, pričom footer prichádza8.95–9.4 a kontakt odchádza8.65–9.05. Žiadny wheel interceptor ani druhá scrollová slučka. Pri nedostatočnej výške sa najprv dočíta prirodzený vnútorný obsah a na jeho okraji sa scroll odovzdá dokumentu (`overscroll-behavior-y:auto`). Pôvodný contain zadržiaval pokračovanie za formulár; natívne pozorovanie túto chybu zachytilo a opakovanie po oprave odkrylo footer. Rýchly spätný posun môže normálne prejsť aj viacerými scénami.

Footer je mimo main ako vlastný obsahový záver, v režime WebGL sa premieta do posledného pohľadu. Vľavo je značka a spoločný princíp, vpravo údaje Pixelmind, register, kontakty a presunutý pôvodný obsah o službách. Mobil má jeden stĺpec a dostupný interný scroll. Na nízkom okne pri príchode footeru kryštál ustúpi, aby sa nemiešal s textom. Pri otvorenom článku je footer skrytý a inertný. #kontakt smeruje na formulár, #firemne-udaje na koniec a #o-mne na rozbalený obsah vo footeri. Pri výpadku WebGL sa obnoví aj footer. Staré články, demonštrácie, atribúcie a neposlané referencie ostávajú.

Záverečná kontrola vyžiadala oddelenie pevného pause ovládača od rozbaleného footeru v nízkom okne. Pri výške pod600px má footer top94px a max-height calc(100svh - 156px), takže končí62px nad spodkom. Pri844×390 bola zmeraná dolná hranica328px a horná hranica celého pause hitboxu334.95px; plochy sa neprekrývajú. Ide o miestnu opravu čítacej plochy, nie skrytie ovládača.

## Menej obslužnej vrstvy a plynulejšia scéna — 10. 11. 2026

Majiteľ požiadal odstrániť opakované pokyny a technické údaje. Pri úvodnom kryštáli zostáva jediná kreslená myš so zvýrazneným kolieskom, ktoré pomaly naznačuje oba smery. Pri posune mizne. Textové pokyny, hĺbka, spodné počítadlo aj samostatný pokyn O nás sú odstránené spolu s ich štýlmi a aktualizačným kódom. O nás zostáva v hlavičke a indexe; gate obsahu sa nemení. Pozastavenie pozadia zostáva dostupné ako malá ikona s natívnym popisom a klávesnicovým fokusom. Pozastaví aj koliesko.

34 drobných priestorových častíc používa dva instancované modely podľa materiálu. Pôvodné polohy, veľkosti a pomalé otáčanie zostávajú. Malé satelity projektov sa kreslia iba v blízkom priestore; hlavné úlomky zostávajú aj v hĺbke. Statické rozmery náhľadov sa pripravujú pri resize, nezmenené štýly sa počas snímok znovu nezapisujú. Po strate WebGL sa canvas skryje, aby prázdny buffer nezakryl zelené CSS pozadie a čitateľný dokument. Rozpočty rozlíšenia foregroundu aj hmly, jeden renderer, návraty z článkov a natívny scroll ostávajú.
