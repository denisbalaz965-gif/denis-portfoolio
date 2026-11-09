# Tímový povrch — Denis · Martin · Miroš

Stav: 9. 11. 2026. Lokálne rozšírenie existujúceho sveta „Na konci internetu“ pre klientsku ponuku troch spolupracovníkov. Potvrdené fakty a hranice vlastní `PRODUCT.md`; tento dokument opisuje aktuálne rozhranie. Režim úvodu je Persuade, objavovanie prác Experience a články Read.

## Zachovaný svet a miestny rozsah

`DESIGN.md` a `.impeccable/design.json` zostávajú incumbent globálnym vizuálnym systémom: zeleno-čierny priestor, fosfor, jedna os, reverzibilný šesťdielny kryštál, rôzne oblúkové dráhy, natívne hologramy a články nad tým istým svetom. Tímové zadanie mení účel, text a miestne komponenty. Nezavádza nový globálny vizuálny systém, laser, zvuk, ďalší renderer ani novú závislosť.

`src/styles/team.css` sa importuje po `intro.css`. Jeho hodnoty sú miestne roly pre tímový obsah, nie náhrada globálnych tokenov. Oproti pôvodnému osobnému úvodu zmenšuje display a servisný text pre dlhšiu tímovú vetu, pridáva profily a služby do existujúceho kontaktu a dôkazy webov do existujúceho článku. Pôvodná globálna dokumentácia preto stále opisuje osobnú identitu a staršie veľkosti; tento dokument zaznamenáva zámerné lokálne rozdiely. Neopravuje nesúvisiaci starší drift.

## Prvý viewport a postup čítania

Desktop zachováva asymetriu: „Nápad máte. My tvoríme.“ vľavo hore, kryštál nižšie a konkrétne služby vpravo. Mená odkazujú na tím, akcia „Pozrieť naše práce“ na prvú zastávku. Hlavička d/m/m a „Digitálny tím“ používa dočasné iniciály do výberu názvu, bez tvrdenia o existujúcej firme.

Mobil skladá identitu, kryštál a servisný blok zvislo; nízky landscape drží texty vedľa seba. Scroll rozdelí rovnaký kryštál na šesť vybraných prác. Hologram vedie do článku s kapitolami a dôkazmi. Samotný let nepoužíva obrázkové klientské náhľady. Päť ďalších Denisových príbehov má samostatný cyklus a zostáva dostupných cez tímové predstavenie a pôvodné adresy.

Odkazy `#o-mne` z mien a indexu otvoria existujúci natívny `details` pri kontakte a posunú vnútorný obsah kontaktu k tímu. `#kontakt` ukáže jeho začiatok. Profily sú vecné texty a odkazy na skutočný príspevok; nemajú vymyslené portréty, priezviská ani výlučné pracovné funkcie. Denisov e-mail a telefón sú označené ako prvý kontakt s tímom.

## Miestne typografické a rozlohové roly

Všetky roly používajú existujúci Instrument Sans (`Instrument`, Arial, sans-serif) a fosforovú paletu.

| Rola                     | Aktuálna miestna hodnota                 | Použitie                                       |
| ------------------------ | ---------------------------------------- | ---------------------------------------------- |
| Tímový display           | `clamp(52px, 6.4vw, 88px)`               | Dvojriadkový úvod; druhý riadok je blok        |
| Servisný display         | `clamp(30px, 3.5vw, 54px)`               | Weby, reklamy, automatizácie                   |
| Mobilný display do 760px | `clamp(34px, 10vw, 54px)`                | Identita v 16 % výšky                          |
| Mobilné služby           | `clamp(25px, 6.7vw, 34px)`               | Prvý výraz samostatne, blok v 60 % výšky       |
| Malý nízky viewport      | display `34px`, služby `23px`            | Do 599px šírky a 679px výšky; služby v 55 %    |
| Nízky landscape          | display `40px`, služby `26px`            | Od 600px šírky a do 600px výšky; služby v 25 % |
| Názvy častí tímu         | `clamp(24px, 2.8vw, 36px)`, riadok `1.1` | Tím a služby v rozbalenom obsahu               |
| Mená členov              | `24px`, váha `700`                       | Tri profily                                    |
| Atribúcia projektu       | `13px`, riadok `1.6`                     | Konkrétny príspevok pri článku                 |

Profily majú tri rovnaké stĺpce s medzerou 32px; do 760px jeden stĺpec s medzerou 24px. Služby používajú definície v pomere `35% / 1fr`, na mobile jeden stĺpec. Kontaktná plocha je v existujúcom svete posúvateľná, s limitom `calc(78svh - 85px)`, na mobile `calc(80svh - 75px)`; vnútorný overscroll sa nešíri ďalej. Index má vlastný limit výšky a zvislý overflow.

## Články a podklady

Päť nových webových referencií má úvod, dve obsahové kapitoly a dôkazový blok. JPEG (960 × 800) sú skutočné zábery prvého viewportu verejných webov z 9. 11. 2026; pôvod a URL uchováva `public/images/team-work/provenance.json`. CSS používa `grayscale(1) sepia(0.45) hue-rotate(75deg) saturate(0.65) brightness(0.8)`. Filter zjednocuje prezentáciu, nemení uložený obrázok a nepreukazuje autorstvo ani výsledky. Každý dôkaz odkazuje na pôvodný web.

Martinovo autorstvo celých piatich webov a Mirošovu spoluprácu pri Attila Park Caravans dodal Denis. Tatra Scool je konkrétny vzdelávací web, bez nároku na bankovú aplikáciu alebo celý web banky. Denisove grantové skúsenosti zostávajú pripísané práci v CASSIS Consult.

Čítačka zachováva stabilný HTML text, natívne kapitoly a návrat na uložený hlavný scroll. Pri zlyhaní WebGL sa obnoví úplný článok. Nové screenshotové články nemajú GSAP ilustračnú stage; fallback ich číta prirodzene s nadpisom pred metadátami. Staršie scénické príbehy si ponechávajú vlastnú GSAP animáciu.

## Rozsah overenia

Pre túto adaptáciu boli v skutočnom prehliadači kontrolované viewporty 1280 × 900, 390 × 844 a 844 × 390; článkové rozhranie aj pri šírke 921px. Kontrola zahŕňala úvod, tímový kontakt, články a fallback. Ide o rozsah lokálneho overenia, nie dôkaz testu na fyzickom telefóne, nameraných FPS, obchodného výsledku alebo publikovania. Tento dokumentačný krok nevykonal nové prehliadačové testovanie.
