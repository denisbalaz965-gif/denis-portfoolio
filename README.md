# d/m/m — digitálne štúdio

[Živý web](https://denis-balaz-portfolio.denis-balaz567.chatgpt.site/) · [Kontext pre Claudea](docs/CLAUDE-HANDOFF.md) · [Smer O nás](docs/ABOUT-DIRECTION.md)

Portfólio trojčlenného digitálneho štúdia pre vlastných klientov. Jeden tmavý fosforovo zelený priestor, kryštál z pôvodných šiestich dielov, plynulá cesta cez ponuku a konkrétne realizácie, články, demonštrácie, záverečné spojenie, kontakt a samostatný firemný footer.

## Pokračovanie s Claudeom

Začni v [CLAUDE.md](CLAUDE.md). Vrstva „O nás“ je horná časť tej istej stránky: z úvodného kryštálu vedie posun hore k trom členom a spoločnej časti, posun dole k ponuke a formuláru. Jej [návrh](docs/superpowers/specs/2026-11-10-o-nas-druha-strana-design.md) a [plán](docs/superpowers/plans/2026-11-10-o-nas-druha-strana.md) sú v repozitári. Na verejnom webe je zatvorená, kým majiteľ nedodá profily a príbeh.

Verejná v28 vychádza z commitu `fcc931bc17e18cb7c30adf0e0957a6ea2fad0498`. Aktuálne dokumentačné odovzdanie pridáva kontext pre ďalší návrh. Push na GitHub a nasadenie verejného webu sú samostatné kroky.

## Lokálne spustenie

Potrebná verzia Node je uvedená v `package.json`; závislosti sú uzamknuté v `package-lock.json`.

```bash
npm ci
npm run dev -- --port 8796
```

Vývojový server je na `http://127.0.0.1:8796/`. Voľný port možno zmeniť; nesiahaj na server patriaci inému projektu.

```bash
npm run check
node scripts/validate-worker.mjs
npm run preview
```

`check` spustí formátovaciu kontrolu, lint, testy a build. `preview` obsluhuje hotový Worker na porte8794. Vite build sa pri balení vkladá spolu s aktívami do Worker ESM, nie do samostatného statického exportu. Generované `dist/` sa neverzuje.

## Orientácia v zdroji

| Miesto                            | Úloha                                                        |
| --------------------------------- | ------------------------------------------------------------ |
| `index.html`                      | Úvod, služby/dôkazy, kontakt, footer, pôvodný obsah          |
| `src/main.js`                     | Inicializácia a poradie funkcií                              |
| `src/features/signal.js`          | Spoločná Three.js scéna, projekcia, hlavný scroll a čítačka  |
| `src/features/flight-model.js`    | Čistý model letu, oddelený kontakt a koniec                  |
| `src/features/render-policy.js`   | Nezávislé rozpočty scény a shaderového pozadia               |
| `src/features/fragment-paths.js`  | Rôzne smery príchodu a odchodu úlomkov                       |
| `src/features/project-browser.js` | Články, adresy a história                                    |
| `src/features/contact.js`         | Stav formulára a kopírovanie kontaktu                        |
| `src/data/`                       | Realizácie, historické skúsenosti a modelové ukážky          |
| `src/data/team-members.js`        | Skutočný obsah O nás; prázdny, kým ho majiteľ nedodá         |
| `src/features/about-model.js`     | Čistý model druhej strany: brána, adresy, otočka, rozloženie |
| `src/features/about.js`           | DOM vrstva O nás: vstupy, história, posun, fallback          |
| `src/styles/main.css`             | Skutočné poradie CSS importov                                |
| `server/contact.js`               | Pripravené serverové napojenie Resend                        |
| `scripts/`                        | Balenie, lokálny Worker náhľad a kontrola artefaktu          |
| `tests/`                          | Vitest/jsdom a serverové testy s náhradou poskytovateľa      |
| `public/`                         | Logá, článkové zábery, fonty a licencie                      |

Podrobnosti: [architektúra](docs/architecture.md). Produktová pravda: [PRODUCT.md](PRODUCT.md). Vizuálny systém: [DESIGN.md](DESIGN.md) a `.impeccable/design.json`. Dátované lokálne úpravy: [team-surface.md](docs/team-surface.md); jeho neskoršie časti prevažujú nad historickými popismi.

## Dôležité hranice

Hlavná ponuka je dominantná, projekt je jej konkrétny dôkaz. Demo recenzie zostávajú označené. Reklamné KPI neboli dodané. Eurofondové príbehy zachovávajú atribúciu CASSIS Consult. Projektová alokácia nie je výsledok ani obrat d/m/m. Osobné profily a spoločný príbeh potrebujú autentické podklady.

Resend je pripravený, odosielanie vypnuté. Podmienky a limity sú v [resend-setup.md](docs/resend-setup.md). Repozitár obsahuje len prázdny vzor `.env.example`; skutočné kľúče patria do serverového prostredia. Demonštrácie neposielajú reálne rezervácie ani nespúšťajú platené reklamy.

Doterajšia v28 prešla87testami a kontrolou v prehliadači vo viacerých rozmeroch. jsdom neoveruje WebGL vzhľad, FPS ani fyzický dotyk. Nová zmena potrebuje vlastné primerané overenie.

## Pôvod aktív a licencie

[ASSET-SOURCES.json](ASSET-SOURCES.json) zaznamenáva historické aktíva; logá a článkové zábery majú vlastné `provenance.json` v príslušných priečinkoch `public/images/`. Instrument Sans používa SIL Open Font License (`public/licenses/InstrumentSans-OFL.txt`), Three.js MIT a GSAP vlastnú licenciu. Historické obrázky zostávajú zdrojovými aktívami; dnešný hlavný priestor kreslí Three.js.

## O nás — ako vrstvu vidieť a otvoriť

Na vývojovom serveri (`npm run dev`) sa vrstva zobrazí so zástupným obsahom z `src/data/team-members.fixture.js`: pri kryštáli posuňte hore, alebo kliknite na „O nás“. V produkčnom builde je jej kód a štýly, no žiadny obsah, vstup ani predĺženie stránky.

Verejne sa otvorí sama, keď `src/data/team-members.js` obsahuje troch úplných členov a spoločný príbeh: jedinečné id (malé písmená, číslice, pomlčka), meno, portrét s popisom, vlastnú vetu, krátke predstavenie, presne tri hlavné schopnosti a aspoň jednu prácu s vetou o príspevku. Portréty patria do `public/images/`. Dáta musia byť buď prázdne, alebo úplné; `npm run check` to stráži. Pri otvorení treba upraviť test „ships closed“ v `tests/about-model.test.js`, pravidlo o osobných menách v PRODUCT.md a test v `tests/team.test.js`, ak sa mená dostanú do článkov.
