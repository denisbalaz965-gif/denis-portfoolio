# O nás — druhá strana sveta d/m/m

Návrh na realizáciu, stav k 10. 11. 2026. Vychádza zo smeru v [ABOUT-DIRECTION.md](../../ABOUT-DIRECTION.md), z rozhovoru s majiteľom a zo skúšobného prototypu v `prototype/o-nas/`, ktorého pocit z otočky a rozdelenie kryštálu na tretiny majiteľ odsúhlasil. Dokument opisuje, čo sa má postaviť a prečo. Rozpis krokov je vecou následného plánu.

Pri každom rozhodnutí je uvedené, čie je: **majiteľ** znamená, že to povedal alebo odsúhlasil majiteľ; **návrh** znamená, že ide o moje rozhodnutie, ktoré majiteľ videl v prototype alebo v texte, no môže ho zmeniť.

## 1. Zámer

Hlavná cesta webu ukazuje, čo d/m/m tvorí. Chýba odpoveď na otázku, ktorú si klient trojčlenného štúdia kladie tesne pred tým, než napíše: s kým budem hovoriť a kto mi prácu spraví.

Nová vrstva O nás je druhá strana toho istého sveta. Návštevník celý čas letí dopredu a pozerá na prácu; ľudia sú za jeho chrbtom. Po kliknutí sa priestor otočí o 180° a ukáže, kto za tým stojí. Otočka tak doslova zobrazuje slovné spojenie, ktoré vrstvu pomenúva.

Na druhej strane sa kryštál nerozpadne na šesť dielov podľa prác, ale na tri tretiny podľa ľudí. Každá tretina je jeden člen. Na konci sa tretiny spoja do pôvodného kryštálu a vedľa neho stojí spoločný príbeh. Web dnes hovorí „Tri pohľady. Jedno spoločné riešenie.“; táto vrstva to ukáže.

## 2. Ciele, ne-ciele, anti-ciele

**Ciele**

- Predstaviť každého z troch členov samostatne: kto je, ako premýšľa, čo vie a kde to vidno.
- Spojiť človeka s dôkazom: práce pri profile sú tie isté realizácie z hlavnej cesty a otvárajú existujúce články.
- Uzavrieť vrstvu spoločnou časťou a doviesť návštevníka rovno ku kontaktu.
- Udržať rozpoznateľný svet: tmavá zelená, kryštál, úlomky, jeden súvislý priestor.
- Čitateľný text, ostrá grafika, plynulý pohyb a pohodlné ovládanie na mobile.

**Ne-ciele**

- Prepis existujúcich článkov, ukážok ani hlavnej cesty.
- Skutočné referencie, reklamné KPI a osud demo recenzií. Odporúčam ich neskôr z hlavnej cesty nahradiť faktami, no do tohto rozsahu nepatria.
- Nový hosting, nová závislosť ani zmena kontaktného odosielania.
- Samostatná podstránka s vlastným načítaním. Vrstva žije v tom istom dokumente.

**Anti-ciele** — toto by bolo zlyhanie, aj keby to technicky fungovalo

- Vymyslený životopis, titul, citát, fotka alebo príbeh vzniku. Čo nie je dodané, na verejnom webe nie je.
- Profily, pri ktorých niekto pôsobí slabšie len preto, že má menej doložených prác.
- Text, ktorý sa hýbe s úlomkami alebo sa dá čítať len počas animácie.
- Otočka, po ktorej návštevník nevie, kde je a ako sa vrátiť.
- Zhoršenie dosiahnutej ostrosti alebo existujúcich ciest (články, návrat, kontakt, footer, fallback).

## 3. Obmedzenia

- **Fakty.** Platia hranice z [PRODUCT.md](../../../PRODUCT.md) a [CLAUDE-HANDOFF.md](../../CLAUDE-HANDOFF.md). Doložené je: Martin robil celé weby Attila Park Caravans, PREVIA, PH Laboratories, New Era Barbers a Tatra Scool; pri Attila Park spolupracoval Miroš; Denis má Štýlového chlpáča, Zákazko.sk a eurofondové skúsenosti z tímu CASSIS Consult. Ďalšie Mirošove práce doložené nie sú. Eurofondy si zachovávajú atribúciu CASSIS Consult a nie sú zákazkami d/m/m.
- **Podklady chýbajú.** Verejné podoby mien, portréty, vlastné vety, texty profilov a spoločný príbeh dodá majiteľ. Pozri časť 6 a 12.
- **Jeden renderer.** `src/features/signal.js` vlastní jediný Three.js renderer, kameru a životný cyklus. Nová vrstva ho používa, nevytvára druhý.
- **Ostrosť.** Platia rozpočty z `src/features/render-policy.js`. Žiadny nový renderovací prechod.
- **Text je natívne HTML.** Platí aj pre mená, popisy prác a navigáciu.
- **Dokumentácia.** PRODUCT.md dnes hovorí, že verejné rozhranie nemá osobné mená ani profily. Zverejnenie tejto vrstvy to mení; PRODUCT.md, DESIGN.md a architecture.md treba pri realizácii aktualizovať.
- **Nasadenie.** Zdroj, push a publikovanie sú oddelené kroky. Tento návrh končí overeným zdrojom.

## 4. Zážitok

### 4.1 Otočka — majiteľ (smer), návrh (uchopenie), odsúhlasené v prototype

Kamera neotáča hlavou na mieste; obehne kryštál po polkruhu. Kryštál zostáva v strede obrazu ako os, takže návštevník nestratí orientáciu a počas otočky vidí jeho zadnú stranu.

- Trvanie 1,4 s, plynulý nábeh aj dobeh. Prototyp ponúka na porovnanie 1,0 a 1,9 s; odsúhlasená je predvolená hodnota.
- Počas otočky sa hmla posúva do strany v smere pohybu, redne a zostane z nej jeden vzdialený zelený oblak. Objavia sa ostré hviezdy.
- Text hlavnej cesty zmizne v prvej tretine otočky. Text druhej strany sa objaví až po nej.
- Počas otočky je vstup zamknutý, rovnako ako pri dnešnom vstupe do článku.

Otočka sa dá spustiť odkiaľkoľvek, nielen z úvodu. Ak sú kliny práve rozptýlené po ceste, najprv sa zbehnú do kryštálu v strede (rovnaký princíp ako záverečné spojenie pred kontaktom) a zároveň sa začne otočka. Ak je kryštál už spojený pri kontakte alebo vo footeri, presunie sa do stredu. — **návrh**

### 4.2 Druhá strana: príchod

Tmavší a pokojnejší priestor než hmlová strana, aby sa dalo čítať. Kryštál sa po otočke rozdelí na tri tretiny v rade, pod každou je písmeno a meno. Nadpis „Druhá strana.“ sa objaví až s rozdelením, aby neprekrýval celý kryštál.

Návštevník môže posúvať, alebo ťuknúť rovno na člena.

### 4.3 Profil člena — dva kroky

Tretina vybraného člena príde dopredu na jednu stranu, ostatné dve ustúpia do hĺbky a stmavnú. Zostávajú viditeľné: člen je stále súčasťou troch.

1. **Kto.** Portrét, meno a jedna vlastná veta o tom, ako premýšľa nad prácou. Krátky odsek o tom, čo je zač a ako pristupuje k práci.
2. **Čo.** Schopnosti a práce. Z tretiny vyletia tri malé úlomky spojené tenkou linkou, jeden za každú z troch hlavných schopností člena; na širokom okne nesú ich názov. Je to ten istý prostriedok, akým dnešné zastávky spájajú tri fazety s tromi súčasťami ponuky. Práce sú v texte ako odkazy na existujúce články.

Profil stojí na myslení a schopnostiach, práce sú druhé. Rozloženie ani scéna nesmú závisieť od počtu prác: člen s jednou doloženou prácou má rovnako plný profil ako člen s piatimi. Preto sú úlomky v scéne vždy tri a patria schopnostiam, nie prácam. V prototype niesli názvy Denisových troch prác; pri piatich, troch a jednej práci by scéna pôsobila nerovno. — **návrh**

Úlomok sa otáča s posunom, text stojí. Poradie členov je d, m, m podľa loga.

### 4.4 Spolu

Tretiny sa spoja do pôvodného kryštálu. Vedľa neho je spoločná časť: čo tím spojilo, prečo vzniklo d/m/m, aká je jeho myšlienka a čo chce tvoriť. Text dodá majiteľ.

Časť končí dvoma akciami: hlavná „Poďme na váš projekt“ a vedľajšia „Späť k prácam“.

### 4.5 Návrat

- **Poďme na váš projekt** otočí priestor späť a pristane na kontaktnej zastávke (`#kontakt`), nie na začiatku webu. — **návrh**
- **Späť k prácam**, tlačidlo Späť v prehliadači a Escape vrátia návštevníka presne na miesto hlavnej cesty, odkiaľ prišiel.
- Pred spätnou otočkou sa tretiny spoja (asi 0,45 s), aby osou otočky bol opäť celý kryštál.
- Odchod má jeden mechanizmus s voliteľným cieľom: spätná otočka pristane buď na pôvodnom mieste, alebo na zadanej zastávke hlavnej cesty. Poloha letu sa na cieľ nastaví ešte na druhej strane, pod krytom otočky. Kontakt je len jeden z takých cieľov.

### 4.6 Orientácia

Navigáciou je samotné logo: **d / m / m / spolu**. Aktívna položka svieti. Keďže dve písmená sú rovnaké, aktívne písmeno sa rozvinie na meno a každé tlačidlo má meno v prístupnom názve. — **návrh**

Hlavička na druhej strane, na každej šírke okna — **návrh**

- Logo zostáva a vracia na pôvodné miesto hlavnej cesty.
- Index prác je skrytý. Na jeho mieste je trvalý odkaz „← Späť k prácam“, takže aj na úzkom okne a na dotyku je východ stále viditeľný.
- „Spojme sa“ zostáva tam, kde je dnes viditeľné, a robí to isté ako „Poďme na váš projekt“.

Z druhej strany sa teda dá odísť len na pôvodné miesto alebo na kontakt; ostatné ciele hlavnej cesty sú dostupné až po návrate.

## 5. Vstupy a adresy

**Vstupy** — návrh

- Hlavička: nový odkaz „O nás“ vedľa „Spojme sa“. Na úzkom okne, kde hlavička ukazuje len logo a Index prác, je položka „O nás“ v Indexe.
- Úvod: existujúci odkaz „d/m/m · Digitálne štúdio ↗“ povedie na O nás namiesto footeru.
- Kontakt: „Kto za tým stojí ↗“ pri formulári. Toto je najdôležitejší vstup, dôvera vzniká tesne pred odoslaním.
- Footer: odkaz pri vete „Tri pohľady. Jedno spoločné riešenie.“

**Adresy**

- `#o-nas` — príchod na druhú stranu.
- `#o-nas/<id-člena>` — profil člena.
- `#o-nas/spolu` — spoločná časť.
- `#o-mne` zostáva, ako je dnes: otvára rozbalený obsah služieb vo footeri. Nie je to O nás a nemení sa. — **návrh**

Priama návšteva adresy O nás otvorí druhú stranu bez prehrania otočky. Adresa sa pri posune aktualizuje tak, aby tlačidlo Späť viedlo z druhej strany von jedným krokom, nie cez každú zastávku.

**Články z profilu.** Odkaz na prácu otvorí existujúcu čítačku. Zatvorenie článku vráti návštevníka na ten istý profil, bez otočky. Dnešný mechanizmus presného návratu v `project-browser.js` pracuje s adresou, z ktorej sa článok otvoril; treba ho rozšíriť o adresy O nás.

Čítačka sa nemení. Pri otvorení z profilu sa režim druhej strany pozastaví, scéna čítačky vyzerá ako dnes a strih kryje krátke prelnutie. Animácia otvorenia klinu, ktorá patrí šiestim klinom hlavnej cesty, sa tu nepoužije. Po zatvorení sa druhá strana obnoví na tej istej zastávke. — **návrh**

## 6. Obsah

Obsah profilov a spoločnej časti je v dátovom module v `src/data/`, podobne ako články, a pri inicializácii sa z neho vytvorí natívne HTML. V `index.html` zostane len prázdna kostra vrstvy. Dôvod: do odoslaného dokumentu ani balíka sa nedostane nič, čo ešte nebolo dodané, a existujúci test v `tests/team.test.js`, ktorý stráži, že `index.html` neobsahuje mená členov, zostáva v platnosti. — **návrh**

**Člen**

| Pole             | Povinné | Poznámka                                                             |
| ---------------- | ------- | -------------------------------------------------------------------- |
| Písmeno a id     | áno     | d, m, m; id pre adresu                                               |
| Verejné meno     | áno     | Podoba podľa majiteľa (krstné meno alebo celé)                       |
| Portrét          | áno     | Skutočná fotka; popis v `alt`                                        |
| Vlastná veta     | áno     | V prvej osobe, jedna veta                                            |
| Kto som          | áno     | 2–4 vety                                                             |
| Schopnosti       | áno     | Tri hlavné (nesú ich úlomky), voliteľne ďalšie v texte               |
| Práce            | áno     | Odkazy na existujúce články s jednou vetou o vlastnom príspevku      |
| Rola alebo titul | nie     | Len ak ju člen dodá; PRODUCT.md dnes žiadne výlučné roly nestanovuje |
| Odkazy von       | nie     | Len ak ich člen dodá                                                 |

**Spoločná časť:** nadpis, príbeh v 2–4 odsekoch, voliteľne tri krátke zásady.

**Doložené práce k dnešnému dňu**

- Denis: Štýlový chlpáč, Zákazko.sk, eurofondové skúsenosti (CASSIS Consult, s atribúciou).
- Martin: Attila Park Caravans, PREVIA, PH Laboratories, New Era Barbers, Tatra Scool.
- Miroš: Attila Park Caravans (spolupráca).

**Portréty.** Obyčajné obrázky v HTML, nie textúry vo WebGL: sú ostré na každom displeji, majú popis a dajú sa načítať neskôr. Rovnaké zelené tónovanie pre všetkých a výrez v tvare fazety. Odporúčanie pre fotenie: jedno fotenie, rovnaké svetlo, tmavé pozadie. Pred vstupom na druhú stranu sa portréty dekódujú, aby nenaskakovali.

**Brána zverejnenia.** Na verejnom webe sa nesmie objaviť zástupný text ani neúplný profil, a to ani skrytý v zdroji stránky či v balíku. — **návrh**

- Produkčný dátový modul obsahuje len skutočne dodaný obsah. Dnes je prázdny.
- Brána nie je ručný prepínač: je otvorená práve vtedy, keď majú všetci traja členovia aj spoločná časť vyplnené všetky povinné polia.
- Kým je zatvorená, vstupy do O nás sa nevykreslia, adresy `#o-nas…` sa správajú ako úvod a úvodný odkaz „d/m/m · Digitálne štúdio“ vedie tam, kam dnes.
- Zástupný obsah na stavbu a overenie je v samostatnom súbore, ktorý sa načíta len na vývojovom serveri a v testoch a do produkčného balíka sa nedostane. Majiteľ si vrstvu pred dodaním podkladov pozrie na vývojovom serveri.
- Realizácia podľa tohto návrhu končí so zatvorenou bránou. Otvorí ju až doplnenie podkladov; vtedy sa upraví aj formulácia o osobných menách v PRODUCT.md.

## 7. Scéna a pohyb

Prototyp `prototype/o-nas/main.js` je referencia pre pocit, časovanie a východiskové hodnoty rozloženia (tabuľky `WIDE` a `NARROW`). Nie je základom produkčného kódu.

**Vlastníctvo**

- `signal.js` zostáva vlastníkom rendereru a kamery. Druhá strana je ďalší režim tej istej scény, podobne ako dnešná čítačka, ktorá scéne posiela stav udalosťou a počas ktorej je hlavný let zamknutý.
- Čistý model (priebeh otočky, váhy zastávok, interpolácia rozloženia, prevod adries) patrí do samostatného modulu bez DOM a WebGL, aby sa dal testovať vo Vitest rovnako ako `flight-model.js`.
- Hlavný posun dokumentu sa počas druhej strany nehýbe; uložená pozícia sa pri návrate obnoví.

**Os otočky**

Osou je kryštál vo vzdialenosti 7 pred kamerou letu v jej aktuálnej hĺbke, teda tam, kde sa kliny spájajú aj v dnešnom závere. Kamera obieha s polomerom 7; v strede otočky sa polomer mierne zväčší (asi o 1,6) a kamera sa zdvihne (asi o 0,45), aby pohyb pôsobil ako oblet, nie ako otočenie na mieste. Po otočke kamera hľadí smerom, odkiaľ návštevník prišiel.

**Tretiny**

Tretina je dvojica susedných klinov z `makeCrystalPiece`: (0, 1), (2, 3), (4, 5). Tri tretiny s rovnakou transformáciou tvoria celý kryštál, takže rozdelenie aj spojenie je plynulý prechod bez výmeny modelu. Pri oddelení sa ťažisko tretiny presunie do jej stredu, aby sa otáčala okolo seba, nie okolo osi kryštálu. Rozdelenie trvá asi 0,9 s s malým posunom medzi tretinami.

**Pozadie**

- Hmlový shader dostane dva parametre: bočný posun viazaný na otočku a prechod do „vesmíru“, v ktorom z hmly zostane jeden oblak mimo textu a zmiznú vrstevnice.
- Hviezdy sa kreslia v ostrom prednom prechode ako body s mäkkým okrajom, nie v hmlovom ciele s nízkym rozlíšením. Prototyp ich má asi 1 700.
- Počas otočky sa hmla prekresľuje každú snímku, inak v dnešnom intervale.

**Posun na druhej strane**

Druhá strana má vlastný posuvný kontajner. Zastávky majú čitateľné intervaly ako čítačka (`chapterProgress`): úlomok doletí, text stojí, potom sa pokračuje.

Prototyp používa pripnuté panely s pevnou výškou kroku. Pre skutočné texty rôznej dĺžky to nestačí. V produkcii je každá zastávka sekcia vysoká aspoň jedno okno a priebeh scény sa odvodí z polohy sekcií: dlhší profil jednoducho zaberie viac posunu, kým jeho tretina drží. — **návrh**

**Ovládač pozadia.** „Pozastaviť pozadie“ platí aj tu a zastaví samovoľný pohyb. Otočku ani posun nezastavuje.

## 8. Mobil a nízke okno

- **Úzke okno:** tretina je hore, text pod ňou sa posúva natívne. Prepínač d / m / m / spolu je dole pri palci, ciele majú aspoň 48 px. Popisy pri úlomkoch prác sa nezobrazujú; práce sú v zozname.
- **Nízke okno na šírku:** kompozícia ako na širokom okne, bez portrétu a s kratšími riadkami; nič sa neorezáva, dlhší obsah sa posúva.
- **Písmo:** na druhej strane nič pod 13 px, čítací text 17–18 px.
- **Gestá:** len zvislý posun a ťuknutie. Žiadne vodorovné potiahnutie medzi členmi.
- Rozpočet ostrosti pre mobil zostáva (1,4 MP, pomer 2).

## 9. Prístupnosť, obmedzený pohyb, fallback

- Vrstva, ktorá práve nie je aktívna, je `inert`. Po príchode dostane fokus druhá strana, po návrate prvok, z ktorého sa odchádzalo.
- Všetko je ovládateľné klávesnicou; Escape vracia späť.
- Portréty majú `alt`, navigácia má mená v prístupných názvoch, aktívna položka je označená.
- **Obmedzený pohyb.** Na staršiu výslovnú požiadavku majiteľa zostáva posuvný zážitok aktívny aj pri systémovom obmedzení pohybu. Otočka však nie je viazaná na posun, spúšťa ju klik a beží sama. Predvolené riešenie v tomto návrhu: pri systémovom obmedzení pohybu ju nahradí krátke prelnutie (asi 0,6 s), posun na druhej strane zostáva aktívny. Prototyp ukazuje obe verzie. Toto čaká na potvrdenie majiteľa, pozri časť 12.
- **Fallback.** Pri chybe alebo strate WebGL sa O nás zobrazí ako bežná čitateľná sekcia v dokumente a adresy `#o-nas…` na ňu vedú. Obsah vzniká z dát bez závislosti od WebGL. `restoreFlightFallback()` treba o túto vrstvu rozšíriť.

## 10. Zmeny na existujúcom webe

- Nové vstupy podľa časti 5.
- Úvodný odkaz „d/m/m · Digitálne štúdio“ zmení cieľ na O nás, až keď je brána otvorená.
- Footer a jeho rozbalený obsah služieb zostávajú; pribudne len odkaz.
- Presný návrat z článku sa naučí vrátiť na profil; čítačka samotná sa nemení.
- Nič iné v hlavnej ceste sa nemení.

## 11. Overenie

- **Testy modelu:** priebeh otočky, váhy zastávok, interpolácia rozloženia, prevod adries, brána zverejnenia.
- **Testy DOM:** `inert` a fokus pri vstupe a návrate, adresy a história, návrat z článku na profil, fallback.
- **Prehliadač:** široké okno, 1440×900, 390×844, 320×740 a 844×390; vstup z úvodu, zo stredu cesty, z kontaktu a z footeru; návrat tlačidlom, klávesom aj históriou; priama adresa profilu.
- **Reálny telefón:** plynulosť otočky a dotykové ovládanie. jsdom neoveruje WebGL obraz ani plynulosť a náhľad v nástroji nie je meranie; toto musí vidieť človek na zariadení.
- Existujúcich 87 testov a `npm run check` prechádzajú bez úprav, vrátane testu, že `index.html` neobsahuje mená členov.
- Kontrola produkčného balíka: pri zatvorenej bráne neobsahuje zástupný obsah ani mená.

## 12. Otvorené rozhodnutia a podklady od majiteľa

1. **Obmedzený pohyb:** potvrdiť prelnutie namiesto otočky, alebo otočku vždy.
2. **Verejné mená:** krstné mená, alebo celé mená.
3. **Poradie v logu:** ktoré „m“ je Martin a ktoré Miroš. Návrh predpokladá d = Denis, m = Martin, m = Miroš, a že d/m/m sú iniciály.
4. **Podklady:** portréty, vlastné vety, texty profilov, schopnosti, veta o príspevku ku každej práci a spoločný príbeh.

## 13. Čo ostáva na staviteľovi

- Rozdelenie na moduly a spôsob, akým režim druhej strany komunikuje so `signal.js`, pri dodržaní časti 7.
- Presné hodnoty rozloženia, časovania a krivky; prototyp je východisko, cieľom je pocit z neho.
- Spôsob odvodenia priebehu z polohy sekcií a správanie na okraji posunu.
- Technika tónovania portrétov a ich formát.
- Presný tvar aktualizácie adresy pri posune.
- Poradie prác a prípadné fázy v pláne.

## 14. Prototyp

`prototype/o-nas/` je skúšobná stránka mimo produkčného buildu. Zjednodušuje: jediný profil, pripnuté panely, štart len zo spojeného kryštálu v úvode, skopírovaný hmlový shader, žiadny návrat z článku, žiadny fallback. Má ladiace parametre `?freeze=` a `?stop=` a prepínač trvania. Po dokončení produkčnej vrstvy sa odstráni.
