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

Po kliknutí na vstup kamera obehne kryštál o 180° a ukáže ľudí za prácou. Šesť klinov sa preskupí do troch tretín (dvojice 0–1, 2–3, 4–5), jedna na člena; na konci sa spoja.

**Súbory**

- `src/data/team-members.js`: skutočný obsah profilov a spoločnej časti. Dnes prázdny.
- `src/data/team-members.fixture.js`: zástupný obsah. `src/main.js` ho načíta len na vývojovom serveri; do produkčného balíka sa nedostane.
- `src/features/about-model.js`: čisté funkcie bez DOM a WebGL: brána `aboutReady`, zastávky, adresy, stavový stroj (`requestEnter`, `requestLeave`, `stepAbout`), otočka (`orbitOffset`, `turnPhases`), rozloženie (`aboutLayout`) a `sectionProgress`.
- `src/features/about.js`: vykreslí vrstvu z dát do `#o-nas`, vytvorí vstupy, riadi históriu, fokus, posun a fallback.
- `src/styles/about-side.css`: štýly vrstvy, importované posledné.

**Vlastníctvo a tok**

`initAbout()` vracia `scene = { state, stops, frame(view) }` a `main.js` ju odovzdá do `initSignal({ about })`. DOM vrstva do zdieľaného stavu len zapisuje zámery a prebúdza snímky udalosťou `portfolio:about`. `signal.js` v každej snímke zavolá `stepAbout(state, dt)`, nakreslí scénu a zavolá `frame(view)` s priemetmi tretín a úlomkov schopností; `view.event` nesie `arrived` alebo `landed`. Po pristátí vyšle DOM vrstva `portfolio:about-landed`. Kým režim nie je `front`, hlavný let je zamknutý.

Osou otočky je bod 7 jednotiek pred letovou kamerou v jej aktuálnej hĺbke. Pri vstupe odkiaľkoľvek sa kliny do osi najprv zbehnú (`turnPhases().gather`). Hmlový shader má navyše `pan`, `space` a `nebula`; hviezdy sú body v ostrom prednom prechode. Pri návrate s cieľom `#kontakt` sa let v polovici spätnej otočky presunie na kontaktnú zastávku.

**Brána zverejnenia**

Vrstva sa vykreslí len vtedy, keď `aboutReady()` potvrdí troch úplných členov a spoločný príbeh. Inak sa nevytvorí nič, vstupy neexistujú a adresy `#o-nas…` sa prepíšu na `#svet`. `scripts/validate-worker.mjs` kontroluje, že balík neobsahuje zástupný obsah a pri zatvorenej bráne ani mená.

**Posun a články**

Vrstva má vlastný posuvný kontajner. Každá zastávka je sekcia s pripnutým panelom a 85svh držania; priebeh sa odvodí z polohy sekcií, takže dlhší panel drží dlhšie. Článok otvorený z profilu používa nezmenenú čítačku; počas neho má `<html>` triedu `about-reading` a po zatvorení sa vráti ten istý profil.

**Obmedzený pohyb a fallback**

Pri systémovom obmedzení pohybu nahradí otočku prelnutie (`ABOUT_RESPECTS_REDUCED_MOTION` v modeli). Na udalosť `portfolio:flight-fallback` sa vrstva zmení na bežnú čitateľnú sekciu.
