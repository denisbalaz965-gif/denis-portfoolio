# O nás — druhá strana: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Postaviť vrstvu O nás ako druhú stranu existujúceho sveta: otočka okolo kryštálu, tri tretiny ako traja členovia, profil v dvoch krokoch, spoločná časť a návrat ku kontaktu; so zatvorenou bránou zverejnenia, kým majiteľ nedodá podklady.

**Architecture:** Čistý model (`about-model.js`) drží stavový stroj, časovanie, rozloženie a adresy a je testovaný vo Vitest. DOM vrstva (`about.js`) vykreslí obsah z dát, riadi vstup, odchod, históriu, fokus a posun a zapisuje zámery do zdieľaného stavu. `signal.js` zostáva vlastníkom rendereru, kamery a snímok: v každej snímke stav posunie, nakreslí druhú stranu a zavolá späť DOM vrstvu.

**Tech Stack:** HTML, modulárny JavaScript, CSS, Three.js 0.182.0, Vite 8, Vitest 5 s jsdom. Žiadna nová závislosť.

**Spec:** [docs/superpowers/specs/2026-11-10-o-nas-druha-strana-design.md](../specs/2026-11-10-o-nas-druha-strana-design.md). Referencia pre pocit a východiskové hodnoty: `prototype/o-nas/main.js` (odstráni sa v Task 6).

> **Stav 10. 11. 2026:** Tasks 1–6 boli vykonané. Po zhliadnutí výsledku majiteľ zmenil spôsob vstupu (pozri „Zmena po prvej verzii“ v návrhu): O nás je horná časť tej istej posuvnej dráhy. Stavový stroj, vlastný posuvný kontajner a práca s históriou z Task 2, 4 a 5 boli nahradené prevodom posunu (`aboutAt`, `stepAbout`); obsahový model, brána, vykreslenie, rozloženie tretín a kontrola balíka zostali. Aktuálny stav opisuje `docs/architecture.md`.

## Global Constraints

- Jeden renderer, jedna kamera, žiadny nový renderovací prechod; rozpočty z `src/features/render-policy.js` sa nemenia.
- Všetok text je natívne HTML; nič pod 13 px, čítací text 17–18 px, dotykové ciele aspoň 48 px.
- Na verejnom webe ani v balíku nie je zástupný text ani meno člena, kým je brána zatvorená. `index.html` neobsahuje mená; `tests/team.test.js` sa nemení a prechádza.
- Produkčný `src/data/team-members.js` zostáva po tomto pláne prázdny; realizácia končí so zatvorenou bránou.
- Fakty podľa PRODUCT.md: eurofondy nesú atribúciu CASSIS Consult; žiadny vymyslený životopis, titul, citát ani príbeh.
- Časovanie: otočka 1,4 s, rozdelenie 0,9 s, spojenie pred návratom 0,45 s, prelnutie pri obmedzenom pohybe 0,6 s.
- Adresy: `#o-nas`, `#o-nas/<id>`, `#o-nas/spolu`. `#o-mne` sa nemení.
- Existujúce cesty fungujú ako dnes: články, presný návrat, kontakt, footer, pauza, fallback.
- Komentáre v kóde po anglicky ako v zdroji; texty rozhrania po slovensky.
- Po každej úlohe prechádza `npm run check`. Commity sú lokálne na aktuálnej vetve; žiadny push ani nasadenie.

## Review Focus

1. **Späť počas otočky:** tlačidlo Späť alebo Escape stlačené uprostred otočky ju obráti z aktuálneho bodu; stav nezostane visieť. Test v Task 2 a Task 4.
2. **Dvojité kliknutie na vstup alebo odchod:** druhá požiadavka počas prechodu nič nepokazí a nepridá záznam do histórie. Test v Task 2 a Task 4.
3. **Strata WebGL na druhej strane:** vrstva sa zmení na čitateľnú sekciu, stav sa vráti na `front`, posun dokumentu sa odomkne. Test v Task 3.
4. **Zmena veľkosti alebo otočenie zariadenia na druhej strane:** návštevník zostane na tej istej zastávke, nič sa neoreže. Test v Task 4, ručná kontrola v Task 6.
5. **Neznáma alebo poškodená adresa `#o-nas/…`:** otvorí príchod; pri zatvorenej bráne sa správa ako úvod. Test v Task 1 a Task 3.

---

## File Structure

| Súbor                              | Zodpovednosť                                                               |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `src/data/team-members.js`         | Skutočný obsah profilov a spoločnej časti. Dnes prázdny.                   |
| `src/data/team-members.fixture.js` | Zástupný obsah pre vývojový server a testy. Nikdy v produkčnom balíku.     |
| `src/features/about-model.js`      | Čisté funkcie: brána, zastávky, adresy, stavový stroj, otočka, rozloženie. |
| `src/features/about.js`            | DOM vrstva: vykreslenie, vstupy, režimy, história, fokus, posun, fallback. |
| `src/styles/about-side.css`        | Štýly druhej strany; importuje sa posledný v `src/styles/main.css`.        |
| `src/features/signal.js`           | Úprava: otočka, tretiny, hviezdy, hmla, spätné volanie do DOM vrstvy.      |
| `src/main.js`                      | Úprava: zloženie `initAbout` a `initSignal`, načítanie zástupného obsahu.  |
| `index.html`                       | Úprava: prázdna kostra vrstvy `#o-nas`.                                    |
| `scripts/validate-worker.mjs`      | Úprava: kontrola, že balík neobsahuje zástupný obsah.                      |
| `tests/about-model.test.js`        | Testy modelu.                                                              |
| `tests/about.test.js`              | Testy DOM vrstvy.                                                          |

---

### Task 1: Obsahový model, brána a adresy

**Files:**

- Create: `src/data/team-members.js`, `src/data/team-members.fixture.js`, `src/features/about-model.js`
- Test: `tests/about-model.test.js`

**Interfaces:**

- Produces:
  - `teamMembers: Member[]`, `teamStory: Story | null` z `team-members.js` (dnes `[]` a `null`).
  - `fixtureMembers: Member[]`, `fixtureStory: Story`, `FIXTURE_SENTINEL = 'ZASTUPNY-OBSAH-DMM'` z fixture.
  - `Member = { id, letter, name, portrait: { src, alt, width, height }, sentence, about: string[], skills: string[], moreSkills?: string[], works: { project, note }[], role?, links?: { label, href }[] }`
  - `Story = { title, paragraphs: string[], principles?: string[] }`
  - `aboutReady(members, story, hasProject = () => true): boolean`
  - `aboutStops(members): Stop[]`, `Stop = { kind: 'arrival' | 'who' | 'what' | 'together', member: number }` (`member` je `-1` pri príchode a spolu)
  - `aboutHash(index, stops, members): string`, `parseAboutHash(hash, stops, members): number | null`

- [ ] **Step 1: Napíš zlyhávajúce testy**

```js
import { describe, expect, it } from 'vitest';
import { teamMembers, teamStory } from '../src/data/team-members.js';
import {
  fixtureMembers,
  fixtureStory,
  FIXTURE_SENTINEL,
} from '../src/data/team-members.fixture.js';
import { findProject } from '../src/data/portfolio-projects.js';
import { aboutReady, aboutStops, aboutHash, parseAboutHash } from '../src/features/about-model.js';

const has = (id) => Boolean(findProject(id));

describe('About content gate', () => {
  it('ships closed: production data is empty', () => {
    expect(teamMembers).toEqual([]);
    expect(teamStory).toBeNull();
    expect(aboutReady(teamMembers, teamStory, has)).toBe(false);
  });
  it('opens only for three complete members and a story', () => {
    expect(aboutReady(fixtureMembers, fixtureStory, has)).toBe(true);
    expect(aboutReady(fixtureMembers.slice(0, 2), fixtureStory, has)).toBe(false);
    expect(aboutReady(fixtureMembers, null, has)).toBe(false);
    for (const field of ['name', 'sentence', 'portrait', 'about', 'skills', 'works']) {
      const broken = structuredClone(fixtureMembers);
      delete broken[1][field];
      expect(aboutReady(broken, fixtureStory, has)).toBe(false);
    }
    const four = structuredClone(fixtureMembers);
    four[0].skills.push('štvrtá');
    expect(aboutReady(four, fixtureStory, has)).toBe(false);
    const unknown = structuredClone(fixtureMembers);
    unknown[2].works[0].project = 'neexistuje';
    expect(aboutReady(unknown, fixtureStory, has)).toBe(false);
  });
  it('keeps the fixture truthful and marked', () => {
    expect(fixtureMembers.map((m) => m.letter)).toEqual(['d', 'm', 'm']);
    expect(fixtureStory.title).toContain(FIXTURE_SENTINEL);
    const works = (i) => fixtureMembers[i].works.map((w) => w.project);
    expect(works(0)).toEqual(['stylovy-chlpac', 'zakazko', 'eurofondova-agenda']);
    expect(works(1)).toEqual(['attilapark', 'previa', 'phlaboratories', 'newera', 'tatrascool']);
    expect(works(2)).toEqual(['attilapark']);
    expect(fixtureMembers[0].works[2].note).toMatch(/CASSIS Consult/);
  });
});

describe('About stops and addresses', () => {
  const stops = aboutStops(fixtureMembers);
  it('has arrival, two steps per member and the shared ending', () => {
    expect(stops.map((s) => s.kind)).toEqual([
      'arrival',
      'who',
      'what',
      'who',
      'what',
      'who',
      'what',
      'together',
    ]);
    expect(stops.map((s) => s.member)).toEqual([-1, 0, 0, 1, 1, 2, 2, -1]);
  });
  it('maps stops to addresses and back', () => {
    const id = fixtureMembers[1].id;
    expect(aboutHash(0, stops, fixtureMembers)).toBe('#o-nas');
    expect(aboutHash(3, stops, fixtureMembers)).toBe(`#o-nas/${id}`);
    expect(aboutHash(4, stops, fixtureMembers)).toBe(`#o-nas/${id}`);
    expect(aboutHash(7, stops, fixtureMembers)).toBe('#o-nas/spolu');
    expect(parseAboutHash(`#o-nas/${id}`, stops, fixtureMembers)).toBe(3);
    expect(parseAboutHash('#o-nas/spolu', stops, fixtureMembers)).toBe(7);
    expect(parseAboutHash('#o-nas', stops, fixtureMembers)).toBe(0);
  });
  it('treats unknown and malformed about addresses as arrival, others as not ours', () => {
    expect(parseAboutHash('#o-nas/nikto', stops, fixtureMembers)).toBe(0);
    expect(parseAboutHash('#o-nas/%E0%A4%A', stops, fixtureMembers)).toBe(0);
    expect(parseAboutHash('#o-mne', stops, fixtureMembers)).toBeNull();
    expect(parseAboutHash('#kontakt', stops, fixtureMembers)).toBeNull();
    expect(parseAboutHash('', stops, fixtureMembers)).toBeNull();
  });
});
```

- [ ] **Step 2: Over, že testy zlyhajú**

Run: `npx vitest run tests/about-model.test.js`
Expected: FAIL, moduly neexistujú.

- [ ] **Step 3: Vytvor dátové moduly**

`team-members.js` exportuje `teamMembers = []` a `teamStory = null` s komentárom, že sem patrí len dodaný obsah. Fixture má troch členov s id `denis`, `martin`, `miros`, práce presne podľa testu, vetu o príspevku pri každej práci (eurofondy: „Skúsenosti z tímu CASSIS Consult; nie sú zákazkami d/m/m.“), tri schopnosti, a všetky vlastné texty viditeľne zástupné („Zástupný text · dodá Denis“). Portréty ukazujú na `/favicon.svg` s rozmermi 416×512, aby fixture nepotreboval nové aktívum.

- [ ] **Step 4: Implementuj `aboutReady`, `aboutStops`, `aboutHash`, `parseAboutHash` v `about-model.js`**

`aboutReady` vyžaduje presne troch členov; pri každom neprázdne `id`, `letter`, `name`, `sentence`, `portrait.src`, `portrait.alt`, aspoň jeden odsek `about`, presne tri `skills`, aspoň jednu prácu s neprázdnym `note` a `hasProject(project) === true`; a príbeh s `title` a aspoň jedným odsekom. `parseAboutHash` dekóduje v `try`; chyba dekódovania pri adrese začínajúcej `#o-nas` vracia `0`.

- [ ] **Step 5: Over, že testy prechádzajú**

Run: `npx vitest run tests/about-model.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/team-members.js src/data/team-members.fixture.js src/features/about-model.js tests/about-model.test.js
git commit -m "feat: add About content model, publication gate and addresses"
```

---

### Task 2: Pohybový model

**Files:**

- Modify: `src/features/about-model.js`
- Test: `tests/about-model.test.js`

**Interfaces:**

- Consumes: `aboutStops`, `Stop` z Task 1.
- Produces:
  - `ABOUT_TURN_SECONDS = 1.4`, `ABOUT_SPLIT_SECONDS = 0.9`, `ABOUT_REJOIN_SECONDS = 0.45`, `ABOUT_FADE_SECONDS = 0.6`, `ABOUT_RESPECTS_REDUCED_MOTION = true`
  - `createAboutState(): AboutState`, kde `AboutState = { mode: 'front' | 'turning' | 'about' | 'returning', turn, split, fade, veil, progress, target, calm: boolean, destination: string | null }` (čísla 0..1 okrem `progress` a `target`, ktoré sú v zastávkach)
  - `requestEnter(state, { calm = false, instant = false } = {}): boolean`
  - `requestLeave(state, destination = null): boolean`
  - `stepAbout(state, dt): 'arrived' | 'landed' | null`
  - `turnEase(t): number`, `orbitOffset(turn): { x, y, z }`, `turnPhases(turn): { front, about, space, pan, gather }`
  - `thirdApart(split, index, join): number`, `stopWeight(progress, index): number`
  - `ABOUT_LAYOUT = { wide, narrow }`, `aboutLayout(progress, stops, narrow): { thirds: Pose[3], joinPose: Pose, join, facets: Pose[3], facetAmount, facetOwner, nebula: [number, number] }`, `Pose = { x, y, d, s, f }`
  - `sectionProgress(scrollTop, tops, viewport): number`

- [ ] **Step 1: Napíš zlyhávajúce testy**

```js
describe('About state machine', () => {
  const run = (state, seconds, dt = 0.05) => {
    const events = [];
    for (let t = 0; t < seconds; t += dt) {
      const e = stepAbout(state, dt);
      if (e) events.push(e);
    }
    return events;
  };
  it('turns for 1.4 s, arrives once, then splits for 0.9 s', () => {
    const s = createAboutState();
    expect(requestEnter(s)).toBe(true);
    expect(s.mode).toBe('turning');
    expect(run(s, 1.3)).toEqual([]);
    expect(run(s, 0.2)).toEqual(['arrived']);
    expect(s.mode).toBe('about');
    expect(s.turn).toBe(1);
    expect(s.split).toBeLessThan(1);
    run(s, 1);
    expect(s.split).toBe(1);
  });
  it('holds the first stop until the split has finished', () => {
    const s = createAboutState();
    requestEnter(s);
    run(s, 1.5);
    s.target = 3;
    stepAbout(s, 0.05);
    expect(s.progress).toBe(0);
    run(s, 2);
    expect(s.progress).toBeCloseTo(3, 2);
  });
  it('rejoins before turning back and reports the landing once', () => {
    const s = createAboutState();
    requestEnter(s);
    run(s, 3);
    expect(requestLeave(s, '#kontakt')).toBe(true);
    expect(s.destination).toBe('#kontakt');
    stepAbout(s, 0.05);
    expect(s.turn).toBe(1);
    expect(run(s, 0.45 + 1.4 + 0.1)).toEqual(['landed']);
    expect(s).toMatchObject({ mode: 'front', turn: 0, split: 0, progress: 0, target: 0 });
  });
  it('ignores repeated requests and reverses a turn in flight', () => {
    const s = createAboutState();
    requestEnter(s);
    expect(requestEnter(s)).toBe(false);
    run(s, 0.7);
    const mid = s.turn;
    expect(mid).toBeGreaterThan(0.3);
    expect(requestLeave(s)).toBe(true);
    expect(requestLeave(s)).toBe(false);
    stepAbout(s, 0.05);
    expect(s.turn).toBeLessThan(mid);
    expect(run(s, 1)).toEqual(['landed']);
    expect(requestLeave(s)).toBe(false);
  });
  it('re-enters from a returning turn without snapping', () => {
    const s = createAboutState();
    requestEnter(s);
    run(s, 3);
    requestLeave(s);
    run(s, 0.45 + 0.5);
    const mid = s.turn;
    expect(requestEnter(s)).toBe(true);
    stepAbout(s, 0.05);
    expect(s.turn).toBeGreaterThan(mid);
  });
  it('cross-fades instead of turning when calm', () => {
    const s = createAboutState();
    requestEnter(s, { calm: true });
    run(s, 0.2);
    expect(s.turn).toBe(0);
    expect(s.veil).toBeGreaterThan(0.5);
    expect(run(s, 0.5)).toEqual(['arrived']);
    expect(s.turn).toBe(1);
    expect(s.veil).toBe(0);
  });
  it('opens instantly for a direct address', () => {
    const s = createAboutState();
    requestEnter(s, { instant: true });
    expect(s).toMatchObject({ mode: 'about', turn: 1, split: 1 });
  });
});

describe('About turn and layout', () => {
  it('orbits half a circle at radius 7 with a swell and lift at the midpoint', () => {
    expect(orbitOffset(0)).toEqual({ x: 0, y: 0, z: 7 });
    const end = orbitOffset(1);
    expect(end.x).toBeCloseTo(0);
    expect(end.z).toBeCloseTo(-7);
    const mid = orbitOffset(0.5);
    expect(mid.x).toBeCloseTo(8.6);
    expect(mid.y).toBeCloseTo(0.45);
    expect(mid.z).toBeCloseTo(0);
  });
  it('hides front text in the first third and shows about text only at the end', () => {
    expect(turnPhases(0)).toEqual({ front: 1, about: 0, space: 0, pan: 0, gather: 0 });
    expect(turnPhases(0.3).front).toBe(0);
    expect(turnPhases(0.45).gather).toBe(1);
    expect(turnPhases(0.8).about).toBe(0);
    expect(turnPhases(1)).toEqual({ front: 0, about: 1, space: 1, pan: 2.4, gather: 1 });
  });
  it('lays the thirds out per stop and brings each member forward in turn', () => {
    const stops = aboutStops(fixtureMembers);
    const { wide } = ABOUT_LAYOUT;
    expect(aboutLayout(0, stops, false).thirds).toEqual(wide.row);
    const who1 = aboutLayout(3, stops, false);
    expect(who1.thirds[1]).toEqual(wide.who.active);
    expect(who1.thirds[1].f).toBe(0.6);
    expect(who1.thirds[0].f).toBe(-1.4);
    expect(who1.join).toBe(0);
    const what0 = aboutLayout(2, stops, false);
    expect(what0.facetAmount).toBe(1);
    expect(what0.facetOwner).toBe(0);
    expect(aboutLayout(1, stops, false).facetAmount).toBe(0);
    expect(aboutLayout(7, stops, false).join).toBe(1);
    const half = aboutLayout(0.5, stops, false).thirds[0];
    expect(half.x).toBeCloseTo((wide.row[0].x + wide.who.active.x) / 2);
    expect(aboutLayout(1, stops, true).thirds[0]).toEqual(ABOUT_LAYOUT.narrow.who.active);
  });
  it('keeps thirds together while joined and staggers the split', () => {
    expect(thirdApart(0, 0, 0)).toBe(0);
    expect(thirdApart(1, 2, 0)).toBe(1);
    expect(thirdApart(1, 0, 1)).toBe(0);
    expect(thirdApart(0.4, 0, 0)).toBeGreaterThan(thirdApart(0.4, 2, 0));
  });
  it('derives progress from section positions so long sections hold longer', () => {
    const tops = [0, 800, 2400, 3200];
    expect(sectionProgress(0, tops, 800)).toBe(0);
    expect(sectionProgress(400, tops, 800)).toBe(0);
    expect(sectionProgress(620, tops, 800)).toBeCloseTo(0.5);
    expect(sectionProgress(800, tops, 800)).toBe(1);
    expect(sectionProgress(2000, tops, 800)).toBe(1);
    expect(sectionProgress(2400, tops, 800)).toBe(2);
    expect(sectionProgress(9999, tops, 800)).toBe(3);
    expect(sectionProgress(-50, tops, 800)).toBe(0);
  });
  it('weights a stop fully at rest and not at all one stop away', () => {
    expect(stopWeight(2, 2)).toBe(1);
    expect(stopWeight(2.5, 2)).toBe(0);
    expect(stopWeight(3, 2)).toBe(0);
  });
});
```

- [ ] **Step 2: Over, že testy zlyhajú**

Run: `npx vitest run tests/about-model.test.js`
Expected: FAIL, nové exporty neexistujú.

- [ ] **Step 3: Implementuj stavový stroj**

`requestEnter` je povolený z `front` a `returning`; `requestLeave` z `about` a `turning`. `stepAbout`: v `turning` rastie `turn` o `dt / 1.4` (pri `calm` rastie `fade` o `dt / 0.6`, `veil = sin(π·fade)`, `turn` preskočí na 1 pri `fade ≥ 0.5`); v `about` rastie `split` o `dt / 0.9` a `progress` sa blíži k `target` rýchlosťou `1 − exp(−dt·10)`, pričom kým `split < 1`, cieľ je 0; v `returning` najprv klesá `split` o `dt / 0.45`, potom `turn`. Pri pristátí sa `progress`, `target`, `fade`, `veil` vynulujú; `destination` ponechaj, prečíta ho volajúci.

- [ ] **Step 4: Implementuj otočku a rozloženie**

`turnEase` je kubická in-out. `orbitOffset(turn)`: uhol `π·turnEase(turn)`, polomer `7 + 1.6·sin(uhol)`, `y = 0.45·sin(uhol)`. `turnPhases` z `e = turnEase(turn)`: `front = 1 − ramp(e, 0, 0.3)`, `about = ramp(e, 0.82, 1)`, `space = ramp(e, 0.2, 0.92)`, `pan = 2.4·e`, `gather = ramp(e, 0, 0.45)`, kde `ramp` je smoothstep. `thirdApart = smoothstep(split·1.3 − index·0.15)·(1 − join)`. `stopWeight = smoothstep(1 − |progress − index|·2.4)`.

`ABOUT_LAYOUT` preber z tabuliek `WIDE` a `NARROW` v `prototype/o-nas/main.js` v tvare `{ row: Pose[3], who: { active, away: Pose[2] }, what: { active, away: Pose[2] }, join, facets: Pose[3], nebula }`; `f` je 0 v rade, 0.6 pre aktívnu a −1.4 pre vzdialené. `aboutLayout` priradí každej zastávke rozloženie (aktívny člen dostane `active`, ostatní v poradí `away[0]`, `away[1]`; `together` použije rozloženie poslednej zastávky pred ňou) a lineárne interpoluje medzi susednými zastávkami. `join` je smoothstep posledného úseku. `facetAmount` rastie od zastávky `who` k `what` toho istého člena a klesá na 0 do 0,6 zastávky za ňou; `facetOwner` je člen najbližšej zastávky `what`.

`sectionProgress`: nájdi úsek `i` s `tops[i] ≤ scrollTop < tops[i+1]`; prechod prebieha na posledných `0.45·viewport` pixeloch úseku a je vyhladený smoothstepom; mimo rozsahu orež.

- [ ] **Step 5: Over, že testy prechádzajú**

Run: `npx vitest run tests/about-model.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/about-model.js tests/about-model.test.js
git commit -m "feat: add About motion model and state machine"
```

---

### Task 3: Vrstva v dokumente, brána a fallback

**Files:**

- Create: `src/features/about.js`, `src/styles/about-side.css`
- Modify: `index.html` (kostra za `</main>`, pred footerom), `src/styles/main.css` (posledný import), `src/main.js`
- Test: `tests/about.test.js`

**Interfaces:**

- Consumes: všetko z Task 1 a 2.
- Produces:
  - `initAbout({ root = document, members = teamMembers, story = teamStory } = {}): { dispose(): void, scene: AboutScene | null }`
  - `AboutScene = { state: AboutState, stops: Stop[], frame(view: AboutView): void }` (`frame` doplní Task 4; tu je prázdna funkcia)
  - Kostra v `index.html`: `<section id="o-nas" class="about-layer" aria-label="O nás" hidden></section>`
  - Vykreslená štruktúra: `.about-scroller > .about-section[data-stop]` (jedna na zastávku, vnútri `.about-panel`), `.about-names > button[data-member]`, `.about-facet-tags > li`, `nav.about-nav > button[data-goto]`, v hlavičke `a.about-entry[href="#o-nas"]` a `a.about-back[href="#svet"]`
  - Triedy na `<html>`: `about-ready` (brána otvorená), `about-open` (druhá strana aktívna), `about-fallback`

- [ ] **Step 1: Napíš zlyhávajúce testy**

Hlavička súboru načíta `index.html` do `document.body` ako `tests/team.test.js`, v `afterEach` volá `dispose` a odstráni triedy `about-*` z `<html>`. Importuje `initAbout`, `requestEnter`, `restoreFlightFallback`, `initProjectBrowser` a fixture.

```js
describe('About layer in the document', () => {
  it('renders nothing and behaves like the intro while the gate is closed', () => {
    window.history.replaceState(null, '', '#o-nas/denis');
    const about = initAbout();
    dispose = about.dispose;
    expect(about.scene).toBeNull();
    expect(document.querySelector('#o-nas').hidden).toBe(true);
    expect(document.querySelector('#o-nas').childElementCount).toBe(0);
    expect(document.querySelector('.about-entry')).toBeNull();
    expect(document.querySelector('.flight-intro a[href="#o-mne"]')).not.toBeNull();
    expect(window.location.hash).toBe('#svet');
    expect(document.documentElement.classList.contains('about-ready')).toBe(false);
  });
  it('renders three profiles, the shared part and every entry when content is complete', () => {
    const about = initAbout({ members: fixtureMembers, story: fixtureStory });
    dispose = about.dispose;
    const layer = document.querySelector('#o-nas');
    expect(layer.hidden).toBe(false);
    expect(layer.inert).toBe(true);
    expect(layer.querySelectorAll('.about-section')).toHaveLength(8);
    expect(layer.querySelectorAll('.about-section[data-kind="who"] img[alt]')).toHaveLength(3);
    expect(
      layer.querySelectorAll('.about-section[data-kind="what"] .about-skills li'),
    ).toHaveLength(9);
    expect(
      [...layer.querySelectorAll('.about-works a')].every((a) =>
        a.getAttribute('href').startsWith('#projekt/'),
      ),
    ).toBe(true);
    expect(layer.querySelector('.about-section[data-kind="together"] h2').textContent).toContain(
      fixtureStory.title,
    );
    expect(document.querySelectorAll('.about-entry')).toHaveLength(4);
    expect(document.querySelector('.flight-intro a[href="#o-nas"]')).not.toBeNull();
    const nav = [...layer.querySelectorAll('.about-nav button')];
    expect(nav.map((b) => b.getAttribute('aria-label'))).toEqual([
      ...fixtureMembers.map((m) => m.name),
      'Spolu',
    ]);
  });
  it('gives every profile the same structure whatever its number of works', () => {
    const about = initAbout({ members: fixtureMembers, story: fixtureStory });
    dispose = about.dispose;
    const shape = (el) => [...el.querySelector('.about-panel').children].map((c) => c.className);
    const what = [...document.querySelectorAll('.about-section[data-kind="what"]')];
    expect(shape(what[1])).toEqual(shape(what[0]));
    expect(shape(what[2])).toEqual(shape(what[0]));
    expect(document.querySelectorAll('.about-facet-tags li')).toHaveLength(3);
  });
  it('becomes a plain readable section when WebGL is unavailable or lost', () => {
    const about = initAbout({ members: fixtureMembers, story: fixtureStory });
    dispose = about.dispose;
    requestEnter(about.scene.state, { instant: true });
    document.documentElement.classList.add('about-open');
    restoreFlightFallback();
    const layer = document.querySelector('#o-nas');
    expect(document.documentElement.classList.contains('about-fallback')).toBe(true);
    expect(document.documentElement.classList.contains('about-open')).toBe(false);
    expect(about.scene.state.mode).toBe('front');
    expect(layer.inert).toBe(false);
    expect(layer.querySelector('.about-section').style.opacity).toBe('');
  });
});
```

- [ ] **Step 2: Over, že testy zlyhajú**

Run: `npx vitest run tests/about.test.js`
Expected: FAIL, `about.js` neexistuje.

- [ ] **Step 3: Pridaj kostru do `index.html` a import štýlov**

Kostra je prázdna sekcia podľa Interfaces. `about-side.css` sa importuje ako posledný riadok `src/styles/main.css`.

- [ ] **Step 4: Implementuj `initAbout` — vykreslenie a brána**

Pri zatvorenej bráne: nič nevykresli, adresu začínajúcu `#o-nas` nahraď cez `history.replaceState` za `#svet`, vráť `scene: null`. Pri otvorenej: vytvor obsah cez `textContent` a `createElement` (žiadne `innerHTML` s dátami), vstupy (odkaz v `.boundary-nav` pred `.boundary-contact`, položka v `.project-index nav` pred „Služby a prístup“, „Kto za tým stojí ↗“ v `.flight-contact` pri riadku „Radšej priamo?“, odkaz vo `.footer-studio`), zmeň `href` úvodného odkazu `.flight-intro a[href="#o-mne"]` na `#o-nas`, pridaj `a.about-back` s textom „← Späť k prácam“. Poradie sekcie „Čo“: `eyebrow`, `h2`, `.about-skills`, `.about-works`. Sekcia „Spolu“ končí odkazmi `a.about-cta[href="#kontakt"]` „Poďme na váš projekt ↗“ a `a.about-leave[href="#svet"]` „Späť k prácam“. Portréty majú `width`, `height`, `loading="lazy"`, `decoding="async"`. Počúvaj `portfolio:flight-fallback`: nastav `about-fallback`, zruš `about-open`, vráť stav na `createAboutState()`, zruš `inert` a všetky inline štýly.

- [ ] **Step 5: Napíš `about-side.css`**

Hodnoty farieb a typografie z DESIGN.md; kompozíciu preber z `prototype/o-nas/style.css`. Záväzné:

- `.about-layer` je `position: fixed; inset: 0`, viditeľná len s `html.about-open`; `.about-scroller` má `overflow-y: auto; overscroll-behavior: contain`.
- `.about-section { min-height: 185svh }`, posledná `100svh`; `.about-panel { position: sticky; top: calc(-1 * var(--about-overflow, 0px)); min-height: 100svh }`.
- Široké okno: text v pravej polovici od 54 %. Úzke (`max-width: 760px`): text od 39svh pod tretinou, `.about-nav` dole v strede, `.about-facet-tags` skryté. Nízke (`max-height: 560px` a `min-width: 600px`): bez portrétu.
- `html.about-open .project-index { display: none }`, `.about-back` viditeľný len s `about-open`, a to na každej šírke.
- `html.about-fallback .about-layer` je `position: static`, sekcie `min-height: 0`, všetko viditeľné.
- `html.about-open { overflow: hidden }`.
- Portrét: obal so zeleným pozadím, `img { mix-blend-mode: luminosity; filter: contrast(1.1) }`, výrez `clip-path: polygon(50% 0, 100% 36%, 78% 100%, 14% 92%, 0 30%)`.

- [ ] **Step 6: Zlož v `src/main.js`**

`initAbout` sa volá pred `initSignal`, aby jeho poslucháč kliknutí bežal skôr. Zástupný obsah sa načíta len na vývojovom serveri:

```js
let content = {};
if (import.meta.env.DEV && !aboutReady(teamMembers, teamStory)) {
  const fixture = await import('./data/team-members.fixture.js');
  content = { members: fixture.fixtureMembers, story: fixture.fixtureStory };
}
const about = initAbout(content);
```

`about.dispose` patrí do zoznamu `dispose`; `about.scene` sa odovzdá do `initSignal({ about: about.scene })` (parameter sa využije v Task 5).

- [ ] **Step 7: Over testy a celú kontrolu**

Run: `npx vitest run tests/about.test.js tests/team.test.js && npm run check`
Expected: PASS; `tests/team.test.js` bez zmeny.

- [ ] **Step 8: Commit**

```bash
git add index.html src/main.js src/features/about.js src/styles/about-side.css src/styles/main.css tests/about.test.js
git commit -m "feat: render the gated About layer with fallback"
```

---

### Task 4: Vstup, odchod, história a posun

**Files:**

- Modify: `src/features/about.js`
- Test: `tests/about.test.js`

**Interfaces:**

- Consumes: `AboutScene`, stavový stroj z Task 2.
- Produces:
  - `AboutView = { event: 'arrived' | 'landed' | null, width, height, names: { x, y }[3], facets: { x, y }[3] }` — parameter `scene.frame(view)`, súradnice v CSS pixeloch
  - Udalosť `portfolio:about` na `document` (bez detailu) pri každej zmene zámeru; `signal.js` ju v Task 5 použije na prebudenie snímok
  - Udalosť `portfolio:about-landed` na `document` s `detail: { destination: string | null }` po pristátí; pri pristátí s cieľom sa pred ňou nastaví adresa

- [ ] **Step 1: Napíš zlyhávajúce testy**

Pomocná funkcia `arrive(about, entry = document.querySelector('.about-entry'))` klikne na vstup, nastaví stav na `{ mode: 'about', turn: 1, split: 1 }` a zavolá `about.scene.frame({ event: 'arrived', width: 1440, height: 900, names: [], facets: [] })`; `land(about)` nastaví `mode: 'front'`, `turn: 0`, `split: 0` a zavolá `frame` s `'landed'`.

```js
describe('Entering and leaving the other side', () => {
  it('enters on click, pushes one history entry and locks the front', () => {
    const about = initAbout({ members: fixtureMembers, story: fixtureStory });
    dispose = about.dispose;
    const before = window.history.length;
    const woke = vi.fn();
    document.addEventListener('portfolio:about', woke);
    document.querySelector('.boundary-nav .about-entry').click();
    document.querySelector('.boundary-nav .about-entry').click();
    expect(about.scene.state.mode).toBe('turning');
    expect(window.history.length).toBe(before + 1);
    expect(window.location.hash).toBe('#o-nas');
    expect(woke).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.flight-stage').inert).toBe(true);
    expect(document.querySelector('#o-nas').inert).toBe(true);
  });
  it('opens the layer and moves focus when the turn arrives', () => {
    const about = initAbout({ members: fixtureMembers, story: fixtureStory });
    dispose = about.dispose;
    arrive(about);
    expect(document.documentElement.classList.contains('about-open')).toBe(true);
    expect(document.querySelector('#o-nas').inert).toBe(false);
    expect(document.activeElement).toBe(document.querySelector('.about-scroller'));
  });
  it('honours reduced motion with a cross-fade request', () => {
    window.matchMedia = vi.fn((media) => ({ media, matches: media.includes('reduce') }));
    const about = initAbout({ members: fixtureMembers, story: fixtureStory });
    dispose = about.dispose;
    document.querySelector('.about-entry').click();
    expect(about.scene.state.calm).toBe(true);
  });
  it('opens a direct address without a turn, at the right stop', () => {
    window.history.replaceState(null, '', `#o-nas/${fixtureMembers[2].id}`);
    const about = initAbout({ members: fixtureMembers, story: fixtureStory });
    dispose = about.dispose;
    expect(about.scene.state).toMatchObject({ mode: 'about', turn: 1, split: 1 });
    expect(document.documentElement.classList.contains('about-open')).toBe(true);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
  it('leaves to the origin on Back, Escape, the logo and the back link', () => {
    for (const leave of [
      () => window.dispatchEvent(new PopStateEvent('popstate')),
      () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })),
      () => document.querySelector('.boundary-nav .brand').click(),
      () => document.querySelector('.about-back').click(),
    ]) {
      const about = initAbout({ members: fixtureMembers, story: fixtureStory });
      arrive(about);
      window.history.replaceState(null, '', '#svet');
      leave();
      expect(about.scene.state.mode).toBe('returning');
      expect(about.scene.state.destination).toBeNull();
      expect(document.querySelector('#o-nas').inert).toBe(true);
      about.dispose();
    }
  });
  it('reverses a turn that is still in flight when Back is pressed', () => {
    const about = initAbout({ members: fixtureMembers, story: fixtureStory });
    dispose = about.dispose;
    document.querySelector('.about-entry').click();
    window.history.replaceState(null, '', '#svet');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(about.scene.state.mode).toBe('returning');
  });
  it('leaves to the contact from the final action and from the header', () => {
    for (const selector of [
      '.about-section[data-kind="together"] .about-cta',
      '.boundary-contact',
    ]) {
      const about = initAbout({ members: fixtureMembers, story: fixtureStory });
      arrive(about);
      const landed = vi.fn();
      document.addEventListener('portfolio:about-landed', landed, { once: true });
      document.querySelector(selector).click();
      expect(about.scene.state.destination).toBe('#kontakt');
      land(about);
      expect(landed.mock.calls[0][0].detail).toEqual({ destination: '#kontakt' });
      expect(window.location.hash).toBe('#kontakt');
      expect(document.documentElement.classList.contains('about-open')).toBe(false);
      expect(document.querySelector('.flight-stage').inert).toBe(false);
      about.dispose();
    }
  });
  it('returns focus to the entry it was opened from', () => {
    const about = initAbout({ members: fixtureMembers, story: fixtureStory });
    dispose = about.dispose;
    const entry = document.querySelector('.flight-contact .about-entry');
    entry.focus();
    arrive(about, entry);
    document.querySelector('.about-back').click();
    land(about);
    expect(document.activeElement).toBe(entry);
  });
  it('follows scroll, marks the current member and keeps one history entry', () => {
    const about = initAbout({ members: fixtureMembers, story: fixtureStory });
    dispose = about.dispose;
    arrive(about);
    const length = window.history.length;
    about.scene.state.progress = 3;
    about.scene.frame({ event: null, width: 1440, height: 900, names: [], facets: [] });
    const nav = [...document.querySelectorAll('.about-nav button')];
    expect(nav.map((b) => b.getAttribute('aria-current'))).toEqual([null, 'true', null, null]);
    expect(window.location.hash).toBe(`#o-nas/${fixtureMembers[1].id}`);
    expect(window.history.length).toBe(length);
    const sections = [...document.querySelectorAll('.about-section')];
    expect(sections[3].inert).toBe(false);
    expect(sections[0].inert).toBe(true);
  });
  it('stays on the same stop after a resize', () => {
    const about = initAbout({ members: fixtureMembers, story: fixtureStory });
    dispose = about.dispose;
    arrive(about);
    about.scene.state.progress = about.scene.state.target = 5;
    const scroller = document.querySelector('.about-scroller');
    const spy = vi.spyOn(scroller, 'scrollTo').mockImplementation(() => {});
    window.dispatchEvent(new Event('resize'));
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'instant' }));
    expect(about.scene.state.target).toBe(5);
  });
  it('leaves entries as plain anchors in the fallback', () => {
    const about = initAbout({ members: fixtureMembers, story: fixtureStory });
    dispose = about.dispose;
    restoreFlightFallback();
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    document.querySelector('.about-entry').dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
    expect(about.scene.state.mode).toBe('front');
  });
  it('returns to the same profile after an article opened from it is closed', () => {
    const about = initAbout({ members: fixtureMembers, story: fixtureStory });
    const browser = initProjectBrowser({ animate: false });
    dispose = () => (browser(), about.dispose());
    arrive(about);
    about.scene.state.progress = 2;
    about.scene.frame({ event: null, width: 1440, height: 900, names: [], facets: [] });
    document.querySelector('.about-section[data-stop="2"] .about-works a').click();
    expect(document.querySelector('#project-viewer').open).toBe(true);
    expect(window.history.state.portfolioReturnHash).toBe(`#o-nas/${fixtureMembers[0].id}`);
    document.querySelector('#project-viewer [data-case-close]').click();
    window.history.replaceState(null, '', `#o-nas/${fixtureMembers[0].id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(about.scene.state.mode).toBe('about');
    expect(document.documentElement.classList.contains('about-open')).toBe(true);
  });
});
```

- [ ] **Step 2: Over, že testy zlyhajú**

Run: `npx vitest run tests/about.test.js`
Expected: FAIL v novom bloku.

- [ ] **Step 3: Implementuj vstup, odchod a históriu**

- Kliknutie na `a[href="#o-nas"]` a `a[href^="#o-nas/"]`: `preventDefault`, zapamätaj prvok pre návrat fokusu, `requestEnter(state, { calm })`, kde `calm = ABOUT_RESPECTS_REDUCED_MOTION && matchMedia('(prefers-reduced-motion: reduce)').matches`. Len pri úspechu: `history.pushState({ aboutEntry: true }, '', hash)`, `.flight-stage.inert = true`, udalosť `portfolio:about`.
- V režime `about` alebo `turning` zachyť kliknutia na `a[href="#kontakt"]` (odchod s cieľom `#kontakt`) a `a[href="#svet"]` (odchod na pôvodné miesto) a zavolaj `preventDefault`, aby ich `signal.js` nespracoval.
- Odchod bez cieľa: ak `history.state?.aboutEntry`, zavolaj `history.back()` a stav zmeň až v `popstate`; inak `replaceState` na `#svet` a `requestLeave`. Odchod s cieľom: `requestLeave(state, '#kontakt')` hneď, adresa sa nastaví cez `replaceState` až pri pristátí.
- `popstate`: adresa mimo O nás v režime `about` alebo `turning` znamená `requestLeave`; adresa O nás v režime `front` alebo `returning` znamená `requestEnter`; adresa O nás v režime `about` len zosúladí zastávku.
- Escape odchádza len vtedy, keď nie je otvorený `dialog`.
- S triedou `about-fallback` sa kliknutia nezachytávajú; vstupy sú obyčajné kotvy na sekciu `#o-nas`.
- Pri štarte s adresou O nás: `requestEnter(state, { instant: true })`, nastav `about-open` a po prvom rozložení posuň na zastávku.

- [ ] **Step 4: Implementuj `scene.frame(view)` a posun**

- `event === 'arrived'`: `about-open`, `layer.inert = false`, `scroller.focus({ preventScroll: true })`, dekóduj portréty (`img.decode()` bez čakania).
- `event === 'landed'`: zruš `about-open`, `.flight-stage.inert = false`, pri cieli `replaceState` na cieľ, vyšli `portfolio:about-landed`, vráť fokus na zapamätaný prvok (pri cieli `#kontakt` na nadpis kontaktu).
- Každá snímka: z `turnPhases(state.turn)` nastav CSS premenné `--about-ui` a `--about-veil` na vrstve; každej sekcii `opacity` a `--shift` z `stopWeight`, `inert` pri váhe pod 0,6 (príchodová sekcia sa násobí `split`); mená a popisy schopností umiestni cez `transform` podľa `view.names` a `view.facets`; popisy schopností nesú text troch schopností člena `facetOwner`. Zápisy do DOM rob len pri zmene hodnoty.
- Aktuálna zastávka `round(progress)`: `aria-current` na tlačidle člena alebo „spolu“; aktívne písmeno zobrazí meno; adresa cez `history.replaceState(history.state, '', aboutHash(…))` len pri zmene zastávky.
- Posun: pri `scroll` nastav `state.target = sectionProgress(scroller.scrollTop, tops, viewport)` a vyšli `portfolio:about`. `tops` a `--about-overflow` každého panelu (`max(0, výška panelu − výška okna)`) prepočítaj pri `resize` a po `arrived`; po `resize` posuň `scroller.scrollTo({ top: tops[round(target)], behavior: 'instant' })`.
- Tlačidlá `data-goto` a `data-member` posúvajú na `tops[index]` (`smooth`, pri `calm` `instant`).
- Strih do článku a späť: na udalosť `portfolio:reader` v režime `about` pridaj na 300 ms triedu `about-cut` na `<html>`; CSS ňou na ten čas zatmaví závoj vrstvy (prechod priehľadnosti 150 ms).

- [ ] **Step 5: Over testy a celú kontrolu**

Run: `npx vitest run tests/about.test.js && npm run check`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/about.js tests/about.test.js
git commit -m "feat: add About entry, return, history and scrolling"
```

---

### Task 5: Scéna v `signal.js`

**Files:**

- Modify: `src/features/signal.js`
- Test: jsdom WebGL neoveruje; táto úloha sa overuje v prehliadači podľa Step 7

**Interfaces:**

- Consumes: `initSignal({ about } = {})`, kde `about: AboutScene | null`; `stepAbout`, `orbitOffset`, `turnPhases`, `aboutLayout`, `thirdApart` z modelu; udalosti `portfolio:about` a `portfolio:about-landed`.
- Produces: v každej snímke volá `about.frame(view)` s `AboutView` z Task 4.

Ak je `about` `null`, žiadna vetva tejto úlohy sa nevykoná a správanie je bajt po bajte dnešné.

- [ ] **Step 1: Hodiny a zámok**

V `draw` zavolaj `const aboutEvent = stepAbout(about.state, dt)`. Do `locked` pridaj `about.state.mode !== 'front'`. Do podmienky ďalšej snímky pridaj `mode !== 'front'` a rozdiel `target − progress` stavu. Na `portfolio:about` volaj `startDraw()`. Hodiny otočky pauza nezastavuje; `phase` áno, ako dnes.

- [ ] **Step 2: Kamera a os**

Os je `(0, introCrystalPose(width, height).y, camera.position.z − 7)` z polohy letovej kamery bez ukazovateľa. Pri `turn > 0` je kamera `os + orbitOffset(turn)` a `lookAt(os)`; ukazovateľ posúva uhol najviac o ±0,015 rad. Vetva čítačky (`reader`) má prednosť a zostáva nezmenená.

- [ ] **Step 3: Zbehnutie klinov a tretiny**

Po dnešnom výpočte transformácie každého klinu ju pri `turn > 0` zmiešaj s cieľom druhej strany váhou `turnPhases(turn).gather` (poloha a mierka lineárne, rotácia cez kvaternión). Cieľ klinu `i` je transformácia tretiny `floor(i / 2)`: zmes spojenej pózy (v osi, mierka `introCrystalPose`, v poslednom úseku `joinPose`) a pózy z `aboutLayout(…).thirds[k]` váhou `thirdApart(split, k, join)`. Polohu na obrazovke prepočítaj na svet z bázy kamery (vpravo, hore, dopredu) a vzdialenosti `d`. Pri oddelení posuň klin o záporné ťažisko tretiny v jej lokálnych súradniciach, aby sa otáčala okolo seba; ťažiská spočítaj raz z ohraničení dvojíc. Rotácia oddelenej tretiny: `(0.2 + sin(progress·0.6 + k)·0.12, k·0.8 + 2.8 + (progress − 1)·π + phase·0.06, (k − 1)·0.1)`. `focus` materiálu je `f` z rozloženia krát váha oddelenia. Malé sprievodné úlomky klinov sú pri `gather > 0` skryté; uzly `.flight-project` sú skryté ako pri záverečnom spojení.

- [ ] **Step 4: Schopnosti, hviezdy, hmla**

- Tri malé úlomky (`makeCrystalPiece`, materiál prvej tretiny vlastníka) a `LineSegments` so šiestimi vrcholmi: poloha je zmes polohy tretiny `facetOwner` a `aboutLayout(…).facets[j]` váhou `facetAmount`; pod 0,01 neviditeľné.
- Dve vrstvy bodov (1 500 a 170) na guli s polomerom 90–210 okolo osi, vlastný shader s mäkkým okrúhlym okrajom, veľkosť `1.7` a `2.7` krát pomer pixelov, priehľadnosť `space·0.8` a `space`. Preber z `prototype/o-nas/main.js`.
- Do `fogFragment` pridaj uniformy `space`, `pan`, `nebula` a vetvu `back` presne podľa prototypu; `nebula` z `aboutLayout`. Počas `turning` a `returning` prekresli hmlový cieľ každú snímku.
- Keď beží `reader`, hviezdy a úlomky schopností sú skryté a `space` je 0; po jeho skončení sa obnovia zo stavu.

- [ ] **Step 5: Predná strana a spätné volanie**

Priehľadnosť `.flight-intro`, `.flight-contact`, `.flight-footer`, `.flight-progress`, `.flight-instruction` a `.depth-readout` vynásob `turnPhases(turn).front`; pod 0,98 sú `inert`. Na konci snímky zavolaj `about.frame({ event: aboutEvent, width, height, names, facets })`, kde `names[k]` je priemet bodu `poloha tretiny − hore·mierka·0.92` a `facets[j]` priemet úlomku schopnosti.

- [ ] **Step 6: Cieľ návratu a článok z profilu**

- Keď stav prejde do `returning` s `destination === '#kontakt'`, zavolaj hneď `jump('contact', null, 'instant')` a `contact.scrollTop = 0`; os sa prepočíta z novej polohy a otočka späť pristane pri formulári.
- Poslucháč `portfolio:project-entry` nič nerobí (bez `preventDefault`), keď `about.state.mode !== 'front'`; článok sa otvorí hneď.
- Pri strate kontextu (`webglcontextlost`) platí dnešný postup; `restoreFlightFallback()` vyšle udalosť, ktorú DOM vrstva spracuje.

- [ ] **Step 7: Over v prehliadači**

Run: `npm run dev -- --port 8796`, otvor `http://127.0.0.1:8796/`.
Expected, na 1440×900 a 390×844:

- Otočka z úvodu, zo zastávky 03, z kontaktu a z footeru: kliny sa zbehnú, kryštál je počas celej otočky v strede, žiadny skok obrazu.
- Príchod: tri tretiny, mená pod nimi, nadpis až po rozdelení.
- Posun cez všetkých osem zastávok: aktívna tretina vpredu, ostatné v hĺbke; na zastávke „Čo“ tri úlomky s názvami schopností (na úzkom okne bez názvov).
- „Poďme na váš projekt“ pristane pri formulári; „Späť k prácam“ presne na pôvodnej zastávke.
- Článok z profilu sa otvorí a po zatvorení je druhá strana na tej istej zastávke.
- Hlavná cesta bez vstupu na druhú stranu vyzerá a správa sa ako pred zmenou.
- Konzola bez chýb.

Run: `npm run check`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/features/signal.js
git commit -m "feat: draw the other side in the shared scene"
```

---

### Task 6: Kontrola balíka, dokumentácia a záverečné overenie

**Files:**

- Modify: `scripts/validate-worker.mjs`, `docs/architecture.md`, `DESIGN.md`, `PRODUCT.md`, `README.md`
- Delete: `prototype/o-nas/`

**Interfaces:**

- Consumes: `FIXTURE_SENTINEL`, `aboutReady`, `teamMembers`, `teamStory`.

- [ ] **Step 1: Pridaj kontrolu balíka**

Worker vkladá aktíva ako base64, preto ich `validate-worker.mjs` pred kontrolou dekóduje:

```js
const source = await readFile('dist/server/index.js', 'utf8');
const shipped = [
  ...source.matchAll(/"data":"([A-Za-z0-9+/=]+)","type":"text\/(?:html|javascript|css)/g),
]
  .map((match) => Buffer.from(match[1], 'base64').toString('utf8'))
  .join('\n');
assert.ok(shipped.length > 1000, 'Embedded text assets were not found.');
assert.ok(!shipped.includes(FIXTURE_SENTINEL), 'Fixture content must not ship.');
if (!aboutReady(teamMembers, teamStory))
  assert.doesNotMatch(
    shipped,
    /Martin|Miroš/,
    'Member names must not ship while the gate is closed.',
  );
```

- [ ] **Step 2: Over, že kontrola zachytí únik**

Dočasne zmeň v `src/main.js` podmienku `import.meta.env.DEV` na `true`, spusti `npm run build && node scripts/validate-worker.mjs`.
Expected: FAIL s „Fixture content must not ship.“ Zmenu vráť a spusti znova.
Expected: PASS.

- [ ] **Step 3: Aktualizuj dokumentáciu**

- `docs/architecture.md`: nová časť o druhej strane (vlastníctvo stavu, `AboutScene`, udalosti, os otočky, brána, adresy); odstráň vetu, že O nás je len smer.
- `DESIGN.md`: krátka časť „Druhá strana“ (tmavší priestor, hviezdy, tretiny, navigácia logom, portréty).
- `PRODUCT.md`: dátovaná poznámka 10. 11. 2026, že vrstva O nás je postavená so zatvorenou bránou; pravidlo o verejných menách sa zmení až pri dodaní podkladov.
- `README.md`: riadky pre nové súbory v tabuľke orientácie; postup, ako vrstvu vidieť na vývojovom serveri a ako ju otvoriť doplnením `src/data/team-members.js`.

- [ ] **Step 4: Odstráň prototyp**

```bash
git rm -r --ignore-unmatch prototype/o-nas
rm -rf prototype
```

- [ ] **Step 5: Záverečné overenie v prehliadači**

Run: `npm run dev -- --port 8796`
Expected na širokom okne, 1440×900, 390×844, 320×740 a 844×390:

- Nič sa neorezáva; na 320×740 sa dlhší panel doposúva do konca a až potom pokračuje ďalšia zastávka.
- Otočenie okna na druhej strane ponechá tú istú zastávku.
- Klávesnica: Tab prejde vstupy, na druhej strane len jej prvky, Escape vracia; fokus sa vráti na vstup.
- Priame adresy `#o-nas`, `#o-nas/martin`, `#o-nas/spolu`, `#o-nas/nikto` otvoria správnu zastávku bez otočky.
- So zapnutým systémovým obmedzením pohybu nahradí otočku prelnutie; posun zostáva.
- „Pozastaviť pozadie“ zastaví samovoľný pohyb aj na druhej strane.

Run: `npm run build && npm run preview`, otvor `http://127.0.0.1:8794/`.
Expected: žiadny vstup O nás, `#o-nas` sa správa ako úvod, web je ako verejná v28.

Plynulosť otočky a dotykové ovládanie na reálnom telefóne sa týmto neoveruje; odovzdaj to majiteľovi ako otvorený bod.

- [ ] **Step 6: Celá kontrola**

Run: `npm run check && node scripts/validate-worker.mjs`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A scripts docs DESIGN.md PRODUCT.md README.md
git commit -m "docs: document the About layer and guard the bundle"
```
