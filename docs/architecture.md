# Architektúra d/m/m — aktuálna orientácia

Stav zdroja verejnej v28,10.11.2026. Nový vesmír „O nás“ je zatiaľ [tvorivý smer](ABOUT-DIRECTION.md), nie existujúci modul alebo predpísané budúce riešenie.

## Vstup a vlastníctvo pohybu

`src/main.js` skladá navigáciu, kontakt, animácie, `initSignal()`, prehliadač článkov, hologramy a kurzor. WebGL sa inicializuje pred prehliadačom článkov, aby aj priamy projektový odkaz vedel vybrať čítačku. Moduly vracajú cleanup pre HMR.

`signal.js` vlastní jeden Three.js renderer, kameru, pozadie, pôvodné projektové kliny a scény čítačky. `flight-model.js` prevádza natívny scroll na priebeh. Súčasné hranice sú `FLIGHT_STOPS=6`, `CONTACT_STOP=8.25`, `FLIGHT_END=9.65`. Aktuálne hodnoty vždy čítaj zo zdroja. CSS `opening-and-footer.css` v poslednom importe nastavuje track535svh. Priame projektové kotvy, kontakt a firemný koniec sa prevádzajú na príslušný bod tej istej dráhy.

`fragment-paths.js` určuje rôzne príchody a odchody z rohov a strán, vrátane mobilných polôh. `fracture-geometry.js` vytvára šesť klinov spoločného kryštálu aj objemové čítačkové úlomky. `crystal-material.js` vytvára procedurálny povrch. `scrollTurn()` viaže otáčanie na scroll; časová fáza vlastní atmosféru. Držanie hologramu, vstup do článku a otvorený príbeh zastavia interpoláciu hlavného letu. Automatický náhľad sám let nezamyká.

Budúci prechod O nás bude musieť rešpektovať existujúce vlastníctvo kamery a životný cyklus. Táto poznámka opisuje väzby, neurčuje spôsob realizácie; navrhni ho podľa vlastného úsudku.

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
- `#o-mne`: otvorí pôvodný `details` so službami vo footeri. Toto zatiaľ nie je nový vesmír O nás.

Na nízkom alebo úzkom okne má kontakt/footer vlastný prirodzený scroll. Na jeho okraji `overscroll-behavior-y:auto` odovzdá posun dokumentu. Nízky footer má rezervovaný spodný priestor pre pevný pause ovládač. Čítanie, kontakty a návraty majú zostať dostupné.

## Server a build

Vite slúži vývoju a bundlovaniu. `server/contact.js` poskytuje `/api/contact`, vo vývoji cez middleware vo `vite.config.js`. `scripts/build-worker.mjs` po Vite builde vloží všetky verejné aktíva do jedného Worker ESM so zachovanými URL. Výsledok je `dist/server/index.js` a `dist/.openai/hosting.json`. `.openai/hosting.json` neobsahuje statický hosting; logické D1/R2 väzby sú nepoužité. `preview-worker.mjs` obsluhuje tento výsledok lokálne, `validate-worker.mjs` kontroluje vstup, aktíva, odmietnutie súkromných súborov a nepripojený kontakt.

Bez serverovej konfigurácie kontakt vracia `ready:false` a neposiela e-mail. Zapnutie vyžaduje podmienky v resend-setup.md. Príjemca je pevný, vstup sa validuje, provider dostáva text a idempotency key. Per-isolate obmedzenie nie je distribuovaná kvóta. Prijatie providerom nie je dôkaz doručenia.

Verejný web je v Sites, GitHub slúži odovzdaniu zdroja. Samotný GitHub push nenasadzuje overenú novú Sites verziu. Zachovaj odlíšenie lokálneho výstupu, odoslaného commitu a skutočne publikovanej verzie.
