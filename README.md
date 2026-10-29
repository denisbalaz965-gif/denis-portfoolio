# Denis Baláž — osobné portfólio

Samostatná statická stránka: HTML, CSS, JavaScript a lokálne assety. Nie je potrebný balíčkovací systém ani API kľúč.

## Spustenie
V priečinku stránky spusti `python3 -m http.server 8793 --bind 127.0.0.1` a otvor http://127.0.0.1:8793/.

## Obsah a úpravy
- index.html: obsah, referencie, kontakty a štruktúra.
- style.css: vizuálny systém a mobilné rozloženie.
- app.js: animácie, filtre, detaily projektov, modelový pracovný postup a navigácia.
- assets/: lokálne obrázky, fonty a animačné knižnice.

## Pravdivosť prezentácie
Pracovný postup s AI odlišujeme od bezobslužnej integrácie. Štýlový chlpáč je lokálna verzia. Cenové ponuky sú vlastný produkt; výsledky predaja sa netvrdia. Grantové sumy patria prijímateľom a sú výsledkom tímovej spolupráce; zmluva alebo schválenie nie je dôkaz dokončenej realizácie. Súkromné e-maily a prílohy nie sú súčasťou stránky ani archívu.

## Assety a licencie
- Vlastný 3D ostrov: originál vytvorený pomocou OpenAI image_gen 29. 10. 2026. Ide o raster s animovanými vrstvami, nie živý 3D model.
- Inšpirácia: https://www.tatrabanka.sk/tatrascool/ — farebnosť, hravý priestor a pohyb. Bez prevzatia loga, maskota či assetov Tatra banky.
- Screenshot Štýlového chlpáča: Denisov lokálny návrh projektu.
- Instrument Sans: SIL Open Font License, plné znenie v licenses/InstrumentSans-OFL.txt; https://github.com/google/fonts/tree/main/ofl/instrumentsans .
- GSAP 3.15.0 / ScrollTrigger: zachované autorské hlavičky; https://gsap.com/standard-license/ . Knižnice majú vlastnú licenciu a nie sú prelicencované touto stránkou.

## Rozsah overenia
Lokálny prehliadač, desktop 1280 px; mobilné rozloženie v rámcoch 390 a 320 px. Filter, dialógy a Escape s návratom fokusu, modelový postup 1–4, mobilná navigácia, automatické spustenie pohybu. Nie je to test na fyzickom telefóne ani úplný audit prístupnosti. Bez formulára, trackingu, externých API či odosielania.

Aktualizácia29.10.: automatické animácie bez prepínača na výslovný pokyn Denisa, priamy odkaz na Zákazko.sk a telefonický kontakt. Štýlový chlpáč dostane verejný odkaz po zverejnení; víkend31.10.–1.11. je plán používateľa, nie dokončené nasadenie.

Stav: lokálna verzia na kontrolu textov. Nasadenie webu zabezpečuje Sites podľa `.openai/hosting.json`. Zdrojový repozitár: https://github.com/denisbalaz965-gif/denis-portfoolio.

## Štruktúra repozitára
Web je v priečinku `dist/`. Z koreňa repozitára spusti `python3 -m http.server 8793 --bind 127.0.0.1 --directory dist`.

## Hosting
Cieľová adresa: https://denis-balaz-portfolio.denis-balaz567.chatgpt.site . GitHub repozitár obsahuje zdrojové súbory portfólia.
