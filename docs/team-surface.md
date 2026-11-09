# Povrch d/m/m — štúdio a funkčné ukážky

Stav: 9. 11. 2026. Lokálne rozšírenie existujúceho sveta „Na konci internetu“ pre klientsku ponuku pod schváleným názvom d/m/m. Potvrdené fakty a hranice vlastní `PRODUCT.md`; tento dokument opisuje aktuálne rozhranie. Režim úvodu je Persuade, objavovanie prác Experience články Read a formulárové ukážky Operate.

## Zachovaný svet a miestny rozsah

`DESIGN.md` a `.impeccable/design.json` zostávajú incumbent globálnym vizuálnym systémom: zeleno-čierny priestor, fosfor, jedna os, reverzibilný šesťdielny kryštál, rôzne oblúkové dráhy, natívne hologramy a články nad tým istým svetom. Tímové zadanie mení účel, text a miestne komponenty. Nezavádza nový globálny vizuálny systém, laser, zvuk, ďalší renderer ani novú závislosť.

`src/styles/team.css` sa importuje po `intro.css`. Jeho hodnoty sú miestne roly pre tímový obsah, nie náhrada globálnych tokenov. Oproti pôvodnému osobnému úvodu zmenšuje display a servisný text pre dlhšiu tímovú vetu, pridáva služby do existujúceho kontaktu a dôkazy webov do existujúceho článku. Globálny dokument a sidecar dostali iba názov d/m/m; miestne veľkosti a zmenený obsah zachytáva tento dokument. Neopravuje nesúvisiaci starší drift.

## Prvý viewport a postup čítania

Desktop zachováva asymetriu: „Nápad máte. My tvoríme.“ vľavo hore, kryštál nižšie a konkrétne služby vpravo. Označenie štúdia odkazuje na služby, akcia „Pozrieť naše práce“ na prvú zastávku. Hlavička používa schválený názov d/m/m a „Digitálne štúdio“. Verejné mená a profily sú odstránené; značka neustanovuje právnickú osobu. Úvod aj index vedú aj na funkčné ukážky.

Mobil skladá identitu, kryštál a servisný blok zvislo; nízky landscape drží texty vedľa seba. Scroll rozdelí rovnaký kryštál na šesť vybraných prác. Hologram vedie do článku s kapitolami a dôkazmi. Samotný let nepoužíva obrázkové klientské náhľady. Päť príbehov predchádzajúcich skúseností má samostatný cyklus a zostáva dostupných cez pôvodné adresy a odkazy na skúsenosti.

Historická kotva `#o-mne` otvára služby a prístup v natívnom `details` pri kontakte. `#kontakt` ukáže jeho začiatok. Osobné profily ani mená nie sú súčasťou verejného rozhrania, metadát, ARIA a kreditov. Akcia „Napíšte nám“ vedie na existujúcu kontaktnú adresu; nová firemná schránka nevznikla.

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
| Atribúcia projektu       | `13px`, riadok `1.6`                     | Konkrétny príspevok pri článku                 |

Služby používajú definície v pomere `35% / 1fr`, na mobile jeden stĺpec. Kontaktná plocha je v existujúcom svete posúvateľná, s limitom `calc(78svh - 85px)`, na mobile `calc(80svh - 75px)`; vnútorný overscroll sa nešíri ďalej. Index má vlastný limit výšky a zvislý overflow.

## Články a podklady

Päť nových webových referencií má úvod, dve obsahové kapitoly a dôkazový blok. JPEG (960 × 800) sú skutočné zábery prvého viewportu verejných webov z 9. 11. 2026; pôvod a URL uchováva `public/images/team-work/provenance.json`. CSS používa `grayscale(1) sepia(0.45) hue-rotate(75deg) saturate(0.65) brightness(0.8)`. Filter zjednocuje prezentáciu, nemení uložený obrázok a nepreukazuje autorstvo ani výsledky. Každý dôkaz odkazuje na pôvodný web.

Internú atribúciu dodanú majiteľom zachováva `PRODUCT.md`; verejný povrch nepoužíva osobné mená. Tatra Scool je konkrétny vzdelávací web, bez nároku na bankovú aplikáciu alebo celý web banky. Grantové skúsenosti z CASSIS Consult sú označené ako predchádzajúca práca, nie zákazky d/m/m.

Čítačka zachováva stabilný HTML text, natívne kapitoly a návrat na uložený hlavný scroll. Pri zlyhaní WebGL sa obnoví úplný článok. Nové screenshotové články nemajú GSAP ilustračnú stage; fallback ich číta prirodzene s nadpisom pred metadátami. Staršie scénické príbehy si ponechávajú vlastnú GSAP animáciu.

## Funkčné ukážky

`demos.css` je posledný lokálny import. `demo-mode` ponecháva zelený svet a spoločný dialóg, no používa stabilný formulár bez kapitolového letu. Pracovná plocha má maximum 1180px a padding 48px 45px 55px. Dva stĺpce `1fr / 1.15fr` sa do 760px zložia do jedného s paddingom 32px 24px 45px. Nadpis je `clamp(36px, 4.5vw, 58px)`, mobilne `clamp(31px, 8.5vw, 45px)`. Natívne polia majú hranaté okraje, minimum 48px a text 16px; termíny minimum 52px, hlavná akcia 50px. Vybraný termín používa `aria-pressed` a fosforovú výplň, stavové správy natívne `role="status"`.

Rezervácia overuje 30-/60-minútovú službu a prekryv s modelovým kalendárom; potvrdením vyradí kolidujúce rozsahy, reset obnoví stav. Reklamné zadanie zo vstupov skladá živý náhľad a stiahne TXT. Obe ukážky sú označené ako funkčné demonštrácie s modelovými údajmi. Nemajú backend, trvalé úložisko, skutočné rezervácie ani pripojenie k reklamnému účtu; textový náhľad je deterministický, bez AI odpovede.

Šesť vybraných prác, päť starších príbehov a dve ukážky tvoria tri oddelené cykly. Návrat obnovuje uloženú polohu hlavného sveta.

## Rozsah overenia

Pre túto adaptáciu boli v skutočnom prehliadači kontrolované viewporty 1280 × 900, 390 × 844 a 844 × 390; článkové rozhranie aj pri šírke 921px. Kontrola zahŕňala úvod, kontakt štúdia, články a fallback. Ide o rozsah lokálneho overenia, nie dôkaz testu na fyzickom telefóne, nameraných FPS, obchodného výsledku alebo publikovania. Tento dokumentačný krok nevykonal nové prehliadačové testovanie.

V nadväzujúcej korporátnej iterácii boli formuláre a návrat do hlavného sveta overené pri 1280 × 900 a 390 × 844, s odchýlkou návratu 0px. Natívny download bol overený a obsah TXT skontrolovaný. Kontroly formátovania, lint, 65 testov a build prešli; úzko zameraná následná recenzia po oprave troch starších osobných formulácií prešla. Tento dokumentačný krok tieto behy neopakoval.
