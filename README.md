# Denis Baláž — portfólio

Weby, digitálne produkty a pracovné postupy s AI. Skúsenosti s prípravou a implementáciou grantových projektov v CASSIS Consult.

## Vybraná práca

- **Eurofondy s podporou AI:** používaný postup spracovania projektových podkladov, úloh a čakaní. Interaktívny príklad obsahuje modelové údaje.
- **Štýlový chlpáč:** návrh a realizácia webu pre psí salón, služby, cenník a rezervačný postup. Pripravuje sa na zverejnenie.
- **[Zákazko.sk](https://zakazko.sk/):** vlastný produkt pre cenové ponuky, zákazkové listy a preberacie protokoly.

Grantové referencie opisujú moju úlohu v tímovej práci. Uvedené sumy podpory patria prijímateľom projektov; stav schválenia a zmluvy odlišujem od dokončenej realizácie. Súkromné projektové dokumenty a e-maily v repozitári nie sú.

## Spustenie

Statický web bez závislosti na balíčkovacom systéme. Z koreňa repozitára:

```sh
python3 -m http.server 8793 --bind 127.0.0.1 --directory dist
```

Potom otvor http://127.0.0.1:8793/.

## Súbory

- `dist/index.html` — štruktúra, obsah, kontakty a referencie.
- `dist/style.css` — vzhľad a responzívne rozloženie.
- `dist/app.js` — animácie, filtre, detaily a interaktívny postup.
- `dist/assets/` — obrázky, fonty a animačné knižnice.
- `.openai/hosting.json` — konfigurácia hostingu Sites.

## Vizuál a licencie

Vlastný ilustračný ostrov vznikol s OpenAI image_gen. Pohyb zabezpečuje CSS a GSAP. Inšpiráciou pre hravý priestor a farebnosť bol Tatrascool; jeho logo, maskot ani assety sa nepoužívajú. Screenshot Štýlového chlpáča pochádza z vývojovej verzie projektu.

Instrument Sans používa SIL Open Font License; plné znenie je v `dist/licenses/InstrumentSans-OFL.txt`. GSAP a ScrollTrigger používajú vlastnú licenciu: https://gsap.com/standard-license/ . Autorské hlavičky sú zachované. Pôvod assetov je uvedený v `ASSET-SOURCES.json`.

## Kontakt

Denis Baláž · denisbalaz965@gmail.com · +421948835138
