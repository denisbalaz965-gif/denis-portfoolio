# Architektúra d/m/m — aktuálna orientácia

Stav zdroja verejnej v28,10.11.2026. Vrstva „O nás“ (druhá strana) je postavená so zatvorenou bránou zverejnenia; opisuje ju časť [Druhá strana](#druhá-strana-o-nás) a [návrh](superpowers/specs/2026-11-10-o-nas-druha-strana-design.md).

## Vstup a vlastníctvo pohybu

`src/main.js` skladá navigáciu, kontakt, animácie, `initSignal()`, prehliadač článkov, hologramy a kurzor. WebGL sa inicializuje pred prehliadačom článkov, aby aj priamy projektový odkaz vedel vybrať čítačku. Moduly vracajú cleanup pre HMR.

`signal.js` vlastní jeden Three.js renderer, kameru, pozadie, pôvodné projektové kliny a scény čítačky. `flight-model.js` prevádza natívny scroll na priebeh. Súčasné hranice sú `FLIGHT_STOPS=6`, `CONTACT_STOP=8.25`, `FLIGHT_END=9.65`. Aktuálne hodnoty vždy čítaj zo zdroja. CSS `opening-and-footer.css` v poslednom importe nastavuje track535svh. Priame projektové kotvy, kontakt a firemný koniec sa prevádzajú na príslušný bod tej istej dráhy.

`fragment-paths.js` určuje rôzne príchody a odchody z rohov a strán, vrátane mobilných polôh. `fracture-geometry.js` vytvára šesť klinov spoločného kryštálu aj objemové čítačkové úlomky. `crystal-material.js` vytvára procedurálny povrch. `scrollTurn()` viaže otáčanie na scroll; časová fáza vlastní atmosféru. Držanie hologramu, vstup do článku a otvorený príbeh zastavia interpoláciu hlavného letu. Automatický náhľad sám let nezamyká.

Druhá strana používa tú istú kameru a ten istý cyklus snímok; `signal.js` zostáva ich vlastníkom. Podrobnosti sú v časti Druhá strana.

## Ostrosť a obnova

`render-policy.js` oddeľuje rozpočet foreground scény od drahého shaderového pozadia. Desktop má strop8.5MP a ratio1.5; mobil1.4MP a ratio2. Dlhšia hrana shaderového targetu je960px, na mobile640px. Hmla sa obnovuje približne každých50ms, alebo skôr pri výraznejšom presune. Kontúry majú derivative vyhladenie. HTML text je natívny DOM.

Pri skrytej karte sa snímky zastavia. Pause ovládač zastavuje samostatnú časovú fázu; scroll zostáva funkčný. Pri chybe alebo strate WebGL `restoreFlightFallback()` obnoví čitateľný HTML úvod, projekty, kontakt aj footer. Rozpočty a kreslenie nie sú dôkazom nameranej plynulosti.

## Ponuka, dôkazy a články

`index.html` obsahuje hlavné dvojice služby a realizácie. `flight-presentation.js` určuje aktívnu zastávku a rozloženie z meraných rozmerov. Meranie prebieha pri inicializácii/resize; renderer používa uložené referencie. `holograms.js` riadi automatickú prezentáciu a manuálne podržanie. Ponuka služby zostáva primárna; projekt a modelová recenzia sú dôkazová plocha.

`project-browser.js` spravuje odkazy `#projekt/<id>`, skupiny, dialóg, históriu a návrat. `portfolio-projects.js` skladá register z pôvodných, tímových a demo podkladov. Kapitolová čítačka používa rovnaký renderer cez udalosti. Zachováva pôvodný celý obsah ako fallback. Pri otvorenom článku je nový firemný footer skrytý. `demos.js` obsluhuje lokálne modelové ukážky; nie sú živým rezervačným alebo reklamno-platobným systémom.

Štýly sa vrství podľa skutočného zoznamu v `src/styles/main.css`. V28 končí lokálnymi `flight-presentation.css`, `service-offer.css`, `contact-finale.css` a `opening-and-footer.css`. Staršie pravidlá v základných súboroch nie sú samy osebe autoritou nad neskoršou kompozíciou. Globálny systém je v DESIGN.md, dátované lokálne rozhodnutia v team-surface.md.

## Záverečná scéna a adresy

`finaleAt()` oddeľuje spojenie, presun kryštálu, kontakt a príchod footeru. Rovnakých šesť klinov sa spojí do spoločného objektu. Kontakt má samostatnú stabilnú zastávku; návštevník môže pokračovať ďalej do firemného konca.

- `#svet`: začiatok hlavnej cesty.
- `#stop-<id>`: konkrétna projektová zastávka.
- `#projekt/<id>`: článok alebo demonštrácia.
- `#kontakt`: formulár, nie úplný koniec dokumentu.
- `#firemne-udaje`: samostatný firemný footer.
- `#o-mne`: otvorí pôvodný `details` so službami vo footeri. Nie je to O nás a nemení sa.
- `#o-nas`, `#o-nas/<id>`, `#o-nas/spolu`: druhá strana; platia len pri otvorenej bráne, inak sa správajú ako úvod.

Na nízkom alebo úzkom okne má kontakt/footer vlastný prirodzený scroll. Na jeho okraji `overscroll-behavior-y:auto` odovzdá posun dokumentu. Nízky footer má rezervovaný spodný priestor pre pevný pause ovládač. Čítanie, kontakty a návraty majú zostať dostupné.

## Server a build

Vite slúži vývoju a bundlovaniu. `server/contact.js` poskytuje `/api/contact`, vo vývoji cez middleware vo `vite.config.js`. `scripts/build-worker.mjs` po Vite builde vloží všetky verejné aktíva do jedného Worker ESM so zachovanými URL. Výsledok je `dist/server/index.js` a `dist/.openai/hosting.json`. `.openai/hosting.json` neobsahuje statický hosting; logické D1/R2 väzby sú nepoužité. `preview-worker.mjs` obsluhuje tento výsledok lokálne, `validate-worker.mjs` kontroluje vstup, aktíva, odmietnutie súkromných súborov a nepripojený kontakt.

Bez serverovej konfigurácie kontakt vracia `ready:false` a neposiela e-mail. Zapnutie vyžaduje podmienky v resend-setup.md. Príjemca je pevný, vstup sa validuje, provider dostáva text a idempotency key. Per-isolate obmedzenie nie je distribuovaná kvóta. Prijatie providerom nie je dôkaz doručenia.

Verejný web je v Sites, GitHub slúži odovzdaniu zdroja. Samotný GitHub push nenasadzuje overenú novú Sites verziu. Zachovaj odlíšenie lokálneho výstupu, odoslaného commitu a skutočne publikovanej verzie.

## Druhá strana (O nás)

O nás je horná časť tej istej posuvnej dráhy. Stránka sa otvára na kryštáli; posun hore otočí priestor o 180° a ukáže ľudí za prácou, posun dole je doterajší let k formuláru. Nie je to samostatný režim ani podstránka.

**Súbory**

- `src/data/team-members.js`: zverejnený obsah: krstné mená, písmená, doložené práce a spoločný text. Úplné profily sa doplnia, keď ich členovia dodajú.
- `src/data/team-members.fixture.js`: zástupné úplné profily pre testy; `src/main.js` ho načíta na vývojovom serveri, len ak skutočné dáta neprejdú bránou. Do produkčného balíka sa nedostane.
- `src/features/about-model.js`: čisté funkcie bez DOM a WebGL: brána `aboutReady`, zastávky, adresy, prevod posunu (`aboutAt`, `aboutSpan`, `aboutUpFor`, `stepAbout`), otočka (`orbitOffset`, `turnPhases`), rozloženie (`aboutLayout`, `aboutNarrow`).
- `src/features/about-gate.js`: jediné pravidlo „vrstvu možno ukázať“ pre stránku, vstup aplikácie aj kontrolu balíka.
- `src/features/about.js`: vykreslí vrstvu z dát do `#o-nas` v `.flight-stage`, predĺži dráhu, vytvorí vstupy a prevádza posun na cieľ.
- `src/styles/about-side.css`: štýly vrstvy, importované posledné.

**Jedna dráha**

`about.js` nastaví na `.flight-track` premennú `--about-span` (dnes 820svh pri ôsmich zastávkach) a dráha má výšku `535svh + --about-span`. Javisko `.flight-stage` je pripnuté cez celú dráhu. `signal.js` posunie začiatok letu o `about.span()` pixelov, takže `flightAt()` a všetky kotvy fungujú ako doteraz. Pri načítaní bez adresy skočí na kryštál (`#svet`), nie na vrch dokumentu.

Vzdialenosť nad začiatkom v jednotkách okna je `up`. `aboutAt(up)` z nej určí otočku (prvé okno), rozdelenie kryštálu (ďalších 0,4 okna) a zastávky po 0,9 okna s držaním a prechodom ako v čítačke. `about.js` pri posune zapisuje `state.targetUp`; `signal.js` v každej snímke volá `stepAbout()`, ktorý kreslenú polohu vyhladí rovnako ako let, a potom `frame(view)` s priemetmi tretín a úlomkov schopností.

**Scéna**

Osou otočky je kryštál v úvodnej polohe. Šesť klinov sa preskupí do troch tretín (dvojice 0–1, 2–3, 4–5), jedna na člena; na poslednej zastávke sa spoja. Hmlový shader má navyše `pan`, `space` a `nebula`; hviezdy sú body v ostrom prednom prechode.

**Adresy a skoky**

`#o-nas`, `#o-nas/<id>` a `#o-nas/spolu` sú miesta na tej istej stránke, rovnako ako `#kontakt`. Odkazy a prepínač `d / m / m / spolu` na ne plynulo posunú; priama adresa skočí okamžite. Článok otvorený z profilu používa nezmenenú čítačku a jej presný návrat; počas čítania má `<html>` triedu `about-reading`.

**Brána zverejnenia a dve úrovne profilu**

Vrstva sa vykreslí, keď `aboutContentReady()` potvrdí troch členov s menom, písmenom a aspoň jednou doloženou prácou a spoločný text. Úplný profil (portrét, veta, predstavenie, presne tri schopnosti) je voliteľný a celý naraz; neúplný profil bránu zavrie. `aboutStops()` dáva členovi s profilom zastávky „kto“ a „čo“ s úlomkami schopností, ostatným jednu zastávku „čo“ s menom a prácami, bez úlomkov. Adresa `#o-nas/<id>` vedie na prvú zastávku člena. `scripts/validate-worker.mjs` beží v `npm run check` a kontroluje, že balík neobsahuje zástupný obsah ani zástupné formulácie a že neplatné dáta nevydajú mená.

**Fallback**

Na udalosť `portfolio:flight-fallback` sa vrstva zmení na bežnú čitateľnú sekciu, dráha sa vráti na pôvodnú výšku a adresa O nás privedie na svoju sekciu.
