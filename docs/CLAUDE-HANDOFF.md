# Odovzdanie d/m/m pre Claudea

Stav k10.11.2026. Toto je kontext a tvorivé zadanie, nie predpísaný plán implementácie.

## Zámer

Tím troch ľudí chce vlastných klientov na digitálnu prácu. Značka je **d/m/m**. Verejná stránka ponúka weby a aplikácie, reklamy, obsah, automatizácie a AI; konkrétne referencie a funkčné demonštrácie majú ukazovať schopnosti. Hlavná ponuka je dominantná, konkrétny projekt je jej dôkaz. Nejde o náborovú stránku hľadajúcu zamestnanie.

Majiteľ chce, aby si sám navrhol ďalší smer rozpracovania, s rešpektom k schválenej identite. Neodovzdávame ti detailný layout alebo návod na každý efekt. Nové **O nás** je opísané v [ABOUT-DIRECTION.md](ABOUT-DIRECTION.md).

## Čo už existuje

[Verejná verzia v28](https://denis-balaz-portfolio.denis-balaz567.chatgpt.site/) zodpovedá zdrojovému commitu `fcc931bc17e18cb7c30adf0e0957a6ea2fad0498`. Neskorší dokumentačný commit pre toto odovzdanie sám nemení nasadený web.

Prvý pohľad vedie zostavený zelený kryštál. Pri posune sa rozpadá a objaví sa „Nápad máte. My tvoríme.“. Šesť hlavných zastávok páruje ponuku služby s realizáciou: Attila Park Caravans, PREVIA, PH Laboratories, New Era Barbers, Tatra Scool a Štýlový chlpáč. Článok sa otvára explicitným kliknutím; pri čítaní má stabilný text a vlastné úlomky. Index sprístupňuje aj historické eurofondové skúsenosti a dve funkčné lokálne demonštrácie.

Na konci sa pôvodných šesť dielov spojí, kryštál sa odsunie a objaví sa formulár. Ďalším posúvaním návštevník príde do samostatného footeru. Obsahuje Pixelmind s. r. o., IČO55940552, sídlo a odkaz na register. Údaje boli overené priamo v ORSR10.11.2026. Existujúci e-mail a telefón sú kontaktmi štúdia. Aktuálne „Čo pre vás spravíme“ je ešte jednoduchý rozbalený obsah vo footeri, nie budúci vesmír O nás.

Grafika má zvýšené rozlíšenie. Na konkrétnom širokom okne bol pôvodný canvas1405×711 na CSS1933×984; verejná v28 mala2916×1476 na rovnakom CSS. To je dôkaz rozlíšenia, nie FPS benchmark. Pohyb možno pozastaviť existujúcim ovládačom. Na výslovnú staršiu požiadavku majiteľa zostáva scrollový zážitok aktívny aj pri systémovom obmedzení pohybu.

## Fakty a otvorené podklady

Doterajšia verejná prezentácia nepoužíva osobné mená alebo osobné profily. Nové zadanie už žiada predstaviť každého zvlášť a potom spoločný tím; finálne verejné označenia, portréty a obsah profilov ešte nie sú dohodnuté. Interný kontext tímu je Denis, Martin a Miroš. Nevytváraj z toho vymyslené životopisy alebo osobnú históriu.

Majiteľ uviedol, že Martin robil celé weby Attila Park, PREVIA, PH Laboratories, New Era Barbers a Tatra Scool; pri karavanoch pracoval aj Miroš. Ďalšie Mirošove realizácie zatiaľ neboli doložené. Podrobnosti a finálne články potrebujú podklady. Predchádzajúca práca členov tímu automaticky neznamená zákazku zrealizovanú pod novou značkou d/m/m.

Eurofondové články Corinex, Tornaľa, Horná Kráľová a širšia agenda sú predchádzajúce skúsenosti v tíme **CASSIS Consult**. Ich atribúcia musí zostať. Finančný rámec projektu nie je výsledok získaný štúdiom ani jeho obrat.

Recenzie v hlavnej ceste sú výslovne označené modelové texty. Skutočné referencie sa majú riešiť naposledy. Overené reklamné KPI ešte neboli dodané. Rezervačná a reklamná demonštrácia sú lokálne modelové scenáre; reklamná ukážka je deterministická a nespúšťa platenú reklamu ani pripojený jazykový model.

Existujúce články chce majiteľ neskôr obsahovo dopracovať. Ďalší rozvoj ukážok, skutočné referencie, reklamné dôkazy a obsah profilov sú témy na návrh/doplnenie; nie automaticky odsúhlasený balík na okamžitú realizáciu.

## Kontakt a nasadenie

Resend endpoint a formulárové stavy sú pripravené, ale odosielanie je **vypnuté**. Nie je vytvorený účet, overená odosielacia doména ani vložený serverový kľúč. Web to návštevníkovi hovorí a ponúka e-mail/telefón. V testoch sa nič skutočne neposiela. [resend-setup.md](resend-setup.md) obsahuje aktuálne podmienky aktivácie a obmedzenie ochrany na jeden Worker isolate; nejde o distribuovaný limit pre väčšiu kampaň.

GitHub je pracovný zdroj pre toto pokračovanie. Verejný web je hostovaný v Sites; push na GitHub sám nepotvrdzuje jeho nasadenie. Hostingový manifest a pôvodné aktíva zachovaj, kým nie je dohodnutá zmena hostingu. Pri neskoršom publikovaní musia zdroj, build a nasadená verzia zodpovedať sebe navzájom. Žiadne tajomstvá nepatria do repozitára alebo klientskeho balíka.

## Doterajšie overenie

Zdroj v28 prešiel formátovaním, lintom,87testami, buildom a kontrolou Worker výstupu. Kontrolované boli široké okno,1440×900,390×844,320×740 a844×390, návraty z článkov a pokračovanie scrollu cez formulár do footeru. V nízkom footeri bol opravený presah pevného pause ovládača; následná kontrola označila tento nález za vyriešený. Nejde o meranie FPS, test fyzického mobilu alebo meranie konverzií.

## Ako s tým pokračovať

Pozri verejný web a zdroj, odlíš obsahové medzery od vizuálnych a technických možností. Potom prines vlastný návrh: ako využiť druhý svet pre ľudí, ich skúsenosti a spoločnú myšlienku. Povedz aj to, čo by si zo súčasného riešenia zachoval a čo by si posunul. Majiteľ chce tvoj úsudok, nie mechanické vykonanie cudzieho storyboardu.
