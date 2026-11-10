---
name: d/m/m — Na konci internetu
description: A reversible crystal fracture, six project holograms and fragment-based reading.
colors:
  world-rule: '#74c5984d'
  world-copy: '#bfd6c6'
  world-ink: '#020a07'
  phosphor-white: '#e6ffe8'
  phosphor: '#b6ff7c'
  signal-green: '#a4ff61'
  signal-text: '#e0f3d4'
  signal-muted: '#a7bea0'
  signal-edge: '#35552d'
  world-ground: '#030804'
  flight-ground: '#031008'
  shard-edge: '#99ffba'
  hologram-light: '#103c26f2'
  hologram-dark: '#061a10f5'
  hologram-edge: '#70d99d99'
  hologram-title: '#e1ffe7'
  hologram-body: '#c5ddcb'
  hologram-kind: '#9ddab2'
  article-ground: '#071009ed'
  article-text: '#dcecd5'
  article-muted: '#b2c5a7'
  article-toolbar: '#0a170cef'
  button-fill: '#b6ff9e'
  button-ink: '#092315'
  index-panel: '#081108f5'
  index-hover: '#10220d'
  index-edge: '#63914c'
  cursor-edge: '#b7ffc5'
  reader-panel-light: '#03110bd6'
  reader-panel-dark: '#04140ee8'
  reader-text: '#e0f5e2'
  reader-body: '#bcd3c4'
  reader-toolbar: '#03100bd9'
  reader-index-active: '#d6ffc5'
  reader-index-ink: '#205e3533'
typography:
  display:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: 'clamp(60px, 8vw, 96px)'
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: '-0.04em'
  intro-services:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: 'clamp(40px, 5vw, 68px)'
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: '-0.035em'
  headline:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: 'clamp(50px, 6.3vw, 88px)'
    fontWeight: 700
    lineHeight: 1
    letterSpacing: '-0.04em'
  title:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: '30px'
    fontWeight: 700
    lineHeight: 1
    letterSpacing: '-0.03em'
  body:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: '14px'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: '10px'
    lineHeight: 1.65
  coordinate:
    fontFamily: 'monospace'
    fontSize: '10px'
    letterSpacing: '0.12em'
  reader-heading:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: 'clamp(48px, 4.9vw, 88px)'
    fontWeight: 700
    lineHeight: 0.98
  reader-title:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: 'clamp(37px, 3.8vw, 66px)'
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: '-0.03em'
  reader-body:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: '18px'
    fontWeight: 400
    lineHeight: 1.7
rounded:
  control: '0'
spacing:
  gutter: 'clamp(24px, 5vw, 90px)'
  index-trigger: '13px 16px'
  hologram: '32px 27px 24px'
  hologram-mobile: '31px 24px 22px'
  story-link: '14px 0'
  contact-button: '12px 18px'
  reader-panel: '24px 34px 36px'
  reader-panel-mobile: '23px 0 24px'
components:
  index-trigger:
    backgroundColor: '#081108d9'
    textColor: '#c7efb6'
    rounded: '{rounded.control}'
    padding: '{spacing.index-trigger}'
    width: '145px'
  index-panel:
    backgroundColor: '{colors.index-panel}'
    rounded: '{rounded.control}'
    padding: '5px 12px 12px'
    width: '280px'
  index-link:
    textColor: '#d1e9c6'
    padding: '13px 4px'
  index-link-hover:
    backgroundColor: '{colors.index-hover}'
    textColor: '{colors.signal-green}'
  beacon:
    backgroundColor: 'transparent'
    textColor: '#c2f9a5'
    width: '130px'
    height: '140px'
  beacon-distant:
    width: '54px'
    height: '54px'
  hologram:
    textColor: '#dcffe2'
    padding: '{spacing.hologram}'
    rounded: '{rounded.control}'
  story-link:
    textColor: '#caffad'
    padding: '{spacing.story-link}'
  article-fallback:
    backgroundColor: '{colors.article-ground}'
    textColor: '{colors.article-text}'
    rounded: '{rounded.control}'
    width: '90vw'
    height: 'calc(100svh - 68px)'
  reader:
    backgroundColor: 'transparent'
    width: '100%'
    height: '100svh'
    rounded: '{rounded.control}'
  reader-panel:
    textColor: '{colors.reader-text}'
    padding: '{spacing.reader-panel}'
    width: 'min(760px, 46%)'
    rounded: '{rounded.control}'
  reader-toolbar:
    backgroundColor: '{colors.reader-toolbar}'
    height: '80px'
  reader-index:
    backgroundColor: 'transparent'
    textColor: '#98bca4'
    width: '48px'
    height: '48px'
  reader-index-current:
    backgroundColor: '{colors.reader-index-ink}'
    textColor: '{colors.reader-index-active}'
  article-toolbar:
    backgroundColor: '{colors.article-toolbar}'
    textColor: '#c9edb6'
    height: '76px'
  evidence-choice:
    textColor: '#c7e7b6'
    rounded: '{rounded.control}'
    padding: '11px 20px'
  evidence-choice-selected:
    backgroundColor: '{colors.signal-green}'
    textColor: '#071009'
  contact-button:
    backgroundColor: '{colors.button-fill}'
    textColor: '{colors.button-ink}'
    rounded: '{rounded.control}'
    padding: '{spacing.contact-button}'
---

# Design System: d/m/m — Na konci internetu

## Overview

**Creative North Star: "Na konci internetu"**

“Na konci internetu” begins with one large crystal assembled from the six actual project pieces. First scroll fractures it into those six projects; reverse scroll reassembles it. A compact green camera flight then makes one project primary while smaller pieces establish depth. An upper-left identity, lower-left crystal and right-hand work statement give the opening its asymmetric composition. Procedural fog, a faint axis and sparse debris connect the whole journey.

Native HTML holograms make the 3D projects readable. The story action gently opens and expands its selected fragment over 560ms, then enters a chapter journey over the same world. Each real content section has its own 3D fragment and stable reading panel. Source text, evidence captures and links stay in HTML rather than being replaced by decorative chapter summaries.

**Key Characteristics:**

- One large crystal reversibly separates into the six actual project pieces.
- A primary project, smaller surrounding fragments and readable HTML holograms.
- A calm fragment opening and expansion connects a project to its story.
- Real article sections become fragment stops with stable, scrollable reading panels.
- Native chapter buttons, toolbar project switching and exact main-position return.
- One green world, the fine-pointer target cursor and original-content fallback.

## Colors

The world uses green-black, phosphor actions and a procedural obsidian surface. `world-finish.css`, imported after `fragment-reader.css`, owns the holograms, reading panels and contact. The final import, `intro.css`, owns the opening composition and its responsive typography. The earlier styles retain the native fallback. The colours in the frontmatter are CSS values; the material shader derives reflections and facets procedurally rather than using one flat body colour.

### Primary

- **Phosphor Green** (`signal-green`): emphasis, focus and article-control states.
- **Crystal Edge Green** (`shard-edge`): fine edges of project geometry.
- **Soft Phosphor** (`button-fill`): filled actions, with dark `button-ink` text.
- **Hologram Green** (`hologram-light`, `hologram-dark`, `hologram-edge`): translucent panel material, with separate title, body and category values.

### Neutral

- **World Ground / Flight Ground** (`world-ground`, `flight-ground`): the page and WebGL-ready ground.
- **Crystal material:** the procedural shader supplies the dark body, directional reflections and rim colour; these are not a single flat CSS token.
- **Signal Text / Muted / Edge** (`signal-text`, `signal-muted`, `signal-edge`): content and boundaries.
- **Article Ground / Text / Muted / Toolbar** (`article-ground`, `article-text`, `article-muted`, `article-toolbar`): calm reading surfaces.
- **Index Panel / Hover / Edge** (`index-panel`, `index-hover`, `index-edge`): dropdown navigation.
- **Cursor Green** (`cursor-edge`): four fine-pointer targeting corners.
- **Reader Panel / Border / Text** (`reader-panel-light`, `reader-panel-dark`, `reader-text`, `reader-body`): stable chapter-reading material.
- **Reader Toolbar / Current Index** (`reader-toolbar`, `reader-index-active`, `reader-index-ink`): chapter mode chrome and current-step state.

**The Continuous World Rule.** Keep the flight, hologram and article within one green atmosphere; preserve the world behind the reading surface.

The fog shader builds continuously varying green from noise rather than a static colour ramp. Eight-step sidecar ramps are preview metadata; they are not additional implementation tokens or a replacement for the shader.

## Typography

**Display Font:** Instrument Sans, registered as `Instrument`, with Arial and sans-serif fallbacks; self-hosted weights (400) and (700).
**Body Font:** the same family. **Label/Mono Font:** generic monospace remains for the coordinate and depth readout; hologram and project beacon labels use Instrument.

### Hierarchy

- **Display:** the opening identity uses the normative display role above; mobile `clamp(43px, 13vw, 64px)`.
- **Intro services:** the separate work statement uses the normative intro-services role above; mobile `clamp(27px, 7.2vw, 36px)` with line-height (1.05). Supporting copy is (16px / 1.65), (18px) above (1500px), and (13px / 1.5) on mobile.
- **Contact:** `clamp(50px, 6.3vw, 88px)`; mobile `clamp(40px, 10vw, 64px)`.
- **Hologram:** (30px) title / (14px, 1.6) summary / (11px) category; mobile title (29px).
- **Reader introduction:** `clamp(48px, 4.9vw, 88px)`; mobile `clamp(37px, 10vw, 56px)`.
- **Reader chapter:** `clamp(37px, 3.8vw, 66px)`; mobile `clamp(31px, 8.1vw, 42px)`.
- **Reader text:** (18px / 1.7), mobile (16px / 1.65), low landscape (14px). Titles precede sequence metadata. Actual body/evidence text is preserved.
- **Navigation:** chapter segments (12px), location (11px); mobile (11px / 10px). Decorative large chapter numerals carry no independent factual claim.

**The HTML Evidence Rule.** Keep project names, summaries, article links, states and evidence in semantic HTML independently of the WebGL geometry.

## Layout

With WebGL ready, the flight track is (420svh) high on desktop and (390svh) at widths at or below (760px). A viewport stage and fixed projected content replace the former long succession of DOM sections. Scroll progress drives camera depth through six projects, then reaches contact. The faint axis remains at (50%) viewport width. The fixed header contains brand, a compact native dropdown index and contact access.

The primary beacon uses a generous invisible hit area (130 × 140px); distant hit areas shrink to (54 × 54px). Projection positions native HTML controls beside their geometry and preserves the invisible pointer bridge. The current main-flight override in `flight-presentation.css` leads with the studio service opposite a smaller supporting project and review, alternating sides across the axis; narrow screens and DOM reading order lead with service then proof. The original logo is a small signature beside the project title. Cached copy/caption measurements determine logo height so the scope and article action fit the viewport without inner scrolling. Logos use contain, at most (340px) wide and (220px) high, or (170px) high in the narrow layout, with further fitting on low landscape. The [local surface brief](docs/team-surface.md) owns the current opening composition and main-flight typography/layout overrides; older baseline opening values below do not supersede it.

The opening identity sits at (8%) left / (14%) top. Its crystal is centred at normalized screen coordinates (.32, .59), scale (2.05), while the work statement sits at (61%) left / (29%) top, width (32%); above (1500px), it moves to (32%) top and (28%) width. Mobile places the identity at (26px) / (17%), crystal at (.55, .435), scale (1.05), and work at (26px) / (61%). Below (680px) height, the mobile crystal moves to (.55, .39), scale (.8); below (600px) width and (680px) height, work starts at (55%). Short landscape separates identity on the left and work on the right. Contact uses (18%) / (22%) desktop and (26px) / (20%) mobile. The contact headline, mail and copy action share the phosphor palette. The project HUD fades with contact progression, preventing a stale project name from colliding with the return link.

The WebGL story reader occupies the full viewport, with the main flight DOM hidden/inert and the shared canvas retained. Its toolbar and sticky-stage offset are (80px) desktop and (64px) mobile. Desktop text starts at (49%) left / (6svh) stage top, width `min(760px, 46%)`, max-height `calc(100svh - 200px)`, padding (24px 34px 36px). Above (1500px), it starts at (50%) / (9svh), padding (30px 42px 44px). Mobile uses (24px) left, (23svh) stage top, width `calc(100% - 48px)`, max-height `calc(77svh - 182px)`, padding (23px 0 24px). Long evidence remains internally scrollable. Low landscape uses (43%) left, (53%) width and a viewport-bound height.

Native chapter buttons use thin segment lines instead of boxed tiles: (48px) square on desktop, (40px × 44px) mobile, and an active phosphor top rule. They sit at (7%) left / (73px) bottom desktop and (24px) left / (49px) bottom mobile. The dynamic number follows real content. The scroll unit remains `max(230px, 55% of viewport height)`; its initial half is stable reading time, followed by travel. After (240ms) quiet, movement lands in the last user direction. A decorative numeral and project name identify the current chapter without replacing native controls.

Closing restores the exact main scroll position. Toolbar arrows, left/right keyboard controls and horizontal gestures still switch the six projects. The original inset article layout remains available as the fallback when WebGL is absent or lost.

Without WebGL, the ready-state layout is absent: native HTML summaries and links form a normal readable project list. Preserve that fallback rather than leaving invisible projected controls.

## Elevation & Depth

Six watertight irregular wedges share an internal axis and assemble one faceted hexagonal crystal. Each exterior face is cut into three facets; the original six solid pieces separate into the six project positions. `crystal-material.js` provides the authored obsidian/phosphor shader with rim response, directional light strips, fine bands and a seam. Main shards retain small octahedral satellites. Each article stop uses a volumetric outer hull from `makeChapterShard`, plus three small satellite wedges, so it stays dimensional at every angle. The background layers a stronger procedural fog, rift contours, 920 dust points, 100 spatial filament segments and 34 debris meshes. No external environment map, stock model or video is needed.

The current main-flight identity floats directly in the existing world: its wrapper is fully transparent, with no panel, frame, shadow, backdrop blur or clipping. The studio offer leads the composition with a large service heading, useful lead, three concrete deliverables linked through an open faceted diagram and a native contact action. A smaller supporting surface carries the exact project name, concrete summary, concise factual scope and explicit story link. A labelled synthetic review demo sits below the story link; its five smaller faceted SVG stars and quiet text support the proof rather than outranking the offer. The original brand mark supports the project title on the same side; the opposite surface explains the matching studio service. No website preview appears here. Green treatment is CSS only. Reading panels retain their quiet green-black gradient and toolbar blur (14px); full-article evidence and the original inset fallback keep their separate treatments. Earlier framed hologram tokens and sidecar examples remain the preserved baseline, not the current main-flight component prescription; see the [local surface brief](docs/team-surface.md).

### Shadow Vocabulary

- **Article separation:** `0 0 100px #02060399`.
- **Index separation:** `0 20px 70px #000a`.
- **Cursor halo:** `drop-shadow(0 0 3px #51de79)`.

**The Reading Lock Rule.** Freeze main-flight interpolation and ambient drift while a project is held by hover/focus, entering a story or reading it; an automatic presentation alone does not lock flight. Within a story, move only its chapter camera from chapter scroll and keep the current reading panel stable during the reading interval.

## Shapes

Square controls, thin cut edges and irregular volumetric geometry form the world. The main crystal is built from six real wedges rather than a box. Chapter objects use the faceted outer hull. Main-flight identities have no enclosing shape or frame; their compact story links are transparent with a fine lower rule. Filled controls elsewhere retain soft green. The chapter text sits on a quiet borderless surface with one short top rule, rather than a small outlined card. A decorative chapter numeral and project name balance the left-hand object; both are aria-hidden because the native chapter index and live location already convey the state.

## Components

### Project beacon and hologram

Native HTML buttons are projected from WebGL project positions; the mesh itself is not the navigation control. Each stop leads with the studio service, useful deliverables and contact action; its supporting proof presents the exact project name, concise description, factual scope and native “Pozrieť príbeh projektu” link. A smaller original logo or brand symbol supports its title; the matching studio service appears across the axis. The explicitly labelled review demo below the link is illustrative content, not a client endorsement. The logo is a second ordinary story link. All six sourced marks and retrieval dates are recorded in `public/images/brand-marks/provenance.json`; the bank symbol from the Tatra Scool website is explicitly paired with Tatra Scool and that specific educational-web scope. Website captures stay inside the deferred full articles.

The automatic `is-presented` state keeps flight available. Hover or keyboard focus on the text or brand surface, or a tap on the beacon, holds the identity as `is-revealed`, updates accessible state and stops any smooth travel at its current position; main interpolation and ambient drift then freeze. Continued scroll releases the hold. Escape or dismiss suppresses the automatic presentation until the next stop, and the beacon can reopen it. The invisible bridge supports pointer travel; hidden content is inert. The current wrapper reveals through opacity and a small translate/scale, without a panel, frame, blur or clip-path. See the [local surface brief](docs/team-surface.md) for measured responsive fitting and component roles. Native fallback exposes the same identities, summaries and article links without a reveal requirement.

Project yaw makes one clamped full turn from normalized scroll via `scrollTurn()`; tilt also follows progress. Reverse travel reverses the turn, and settled scroll stops it. Reader geometry uses the same helper normalized to its actual chapter count. Ambient time remains for the world atmosphere, not project yaw.

### Dropdown index

Native `details`/`summary` lists the six project anchors plus personal/contact destinations. It keeps the established square green border and translucent dark fill. Selecting a destination or clicking outside closes it; Escape restores focus to its summary. Flight routing maps those anchors to camera travel positions; personal text opens at contact.

### Fragment entry

The native story link dispatches the cancelable `portfolio:project-entry` request. The shared renderer gently separates and rotates the selected fragment’s pieces over (560ms), then opens the story. `portfolio-entering` disables pointer interaction with the main flight stage and header during this transition. Escape or native browser Back dispatches `portfolio:cancel-entry` to cancel a pending entry. Direct article routes open immediately; WebGL loss completes entry through the fallback. The transition uses no video service or audio.

### Fragment reader and evidence

One project remains mounted at a time. Its original full article DOM is divided into an introduction, each actual story step and an evidence section when present. Each section pairs with a 3D fragment; the camera moves between these from the reader's scroll progress. The current HTML panel remains readable and allows internal overflow for long evidence. Other panels are inert. A native numbered-button index uses `aria-controls` and `aria-current="step"`; a live location label names the current section.

The toolbar still closes the story and switches previous/next projects. Chapter numbers move within the current story. The main flight remains at its saved position while the reader moves its own camera. Main navigation, depth, coordinate, pause and flight hints are hidden in reader mode so only the chapter controls remain. Final-panel links supply next-project and return actions.

Evidence captures, screenshot selection, model-data labels, technical results and public source links remain in their actual content sections. The existing green image treatment remains presentation-only. If WebGL fails or loses context, the reader restores its cloned original full article and mounts the original GSAP scroll-story behavior; no content replacement is needed.

### Actions and evidence choices

Square filled actions use soft green with dark text. The contact copy control uses padding (12px 18px) and font size (12px), with minimum height (48px) desktop and (44px) mobile. Evidence selectors retain explicit `aria-pressed` states. Focus uses the shared (2px) green outline, offset (6px).

### Target cursor

Four green corners track mouse movement only under `(hover: hover) and (pointer: fine)`. They tighten near interactive elements and shrink on press. The element ignores pointer events, disappears on keyboard interaction or leaving the window, and does not replace the natural coarse-pointer mobile interaction.

### Background, pause and fallback

Three.js (0.182.0) uses `scenePixelRatio()` to cap the scene at (1,000,000 pixels / .9 pixel ratio) on desktop and (550,000 pixels / 1 pixel ratio) on mobile, also respecting device pixel ratio. Procedural fog is cached in a render target with maximum dimension (448px), refreshed about every (50ms) or sooner during faster travel; its composite uses the actual scene buffer resolution. Project controls move with transforms, use cached references and skip hidden DOM work. Pause freezes autonomous drift while scroll travel remains available. Interaction-held project/story locks stop main-flight interpolation and ambient drift; automatic presentation alone does not. The story camera separately interpolates its chapter progress, so scrolling still moves between story fragments. Rendering stops while the page is hidden. On renderer creation failure or context loss, the native HTML project list and the restored original article remain accessible; no publication or device-performance result follows from having that fallback in source.

The intro uses a clean two-tone identity, a separate services statement, AI-assisted description and “Objaviť projekty” action. GSAP animates the identity and work children over (.6s) with (.1s) stagger; the renderer alone owns the outer wrapper’s scroll transform and opacity. Motion is locally active even when the system requests reduced motion; the pause control is not a global article-animation toggle.

## Do's and Don'ts

### Do:

- **Do** build the opening crystal from the six actual project pieces and keep fracture reversible.
- **Do** keep the native hologram link as the explicit trigger for calm fragment entry.
- **Do** derive chapter stops from the full original content and retain evidence and source links.
- **Do** keep a stable reading interval, internal overflow and native chapter buttons.
- **Do** preserve exact main-flight return and original-content WebGL fallback.

### Don't:

- **Don't** replace real article sections with decorative one-line summaries.
- **Don't** confuse chapter navigation with toolbar switching between projects.
- **Don't** make the main flight drift while a project is interaction-held or a story is open.
- **Don't** add a video-service or audio dependency to the fragment-entry interaction.
- **Don't** remove the fallback article or the original evidence distinctions.

## Druhá strana (O nás)

O nás je druhá strana toho istého sveta a horná časť toho istého posunu. Z úvodného kryštálu vedie posun hore k ľuďom a posun dole k ponuke a formuláru; nápoveď „↑ O nás“ to pri kryštáli hovorí.

- **Otočka.** Prvé okno posunu hore obehne kamera kryštál o 180°. Je vratná ako rozpad kryštálu: posun späť ju vráti. Hmla sa posunie do strany a zredne na jeden vzdialený oblak mimo textu, objavia sa ostré hviezdy.
- **Tretiny.** Kryštál sa rozdelí na tri tretiny, jednu na člena. Aktívna príde dopredu, dve ustúpia do hĺbky a stmavnú. Na najvyššej zastávke sa spoja do pôvodného kryštálu.
- **Zastávky.** Príchod, pri každom členovi „kto“ a „čo“, navrchu „spolu“. Kým člen nedodá úplný profil, má jednu zastávku: nadpisom je jeho meno, pod ním doložené práce a poznámka o predchádzajúcich prácach; bez portrétu a bez úlomkov schopností. Každá zastávka je jedna obrazovka; text stojí, mení sa prelnutím. Panel, ktorý sa nezmestí, sa posúva vnútri seba a má mäkký spodný okraj.
- **Úlomky schopností.** Na zastávke „čo“ vyletia z tretiny vždy tri malé úlomky, jeden za každú hlavnú schopnosť. Počet nezávisí od počtu prác.
- **Navigácia logom.** `d / m / m / spolu`; aktívne písmeno sa rozvinie na meno. Na úzkom okne je dole pri palci a nesie tmavý prechod.
- **Portréty.** Obyčajné obrázky v HTML so zeleným tónovaním (`mix-blend-mode: luminosity` na zelenom podklade) a výrezom v tvare fazety.
- **Typografia.** Nič pod 13 px, čítací text 17–18 px, dotykové ciele aspoň 48 px.
- **Don't** robiť z O nás samostatný režim, podstránku alebo krok v histórii.
- **Don't** hýbať textom spolu s úlomkami ani viazať čitateľnosť na animáciu.
- **Don't** stavať rozloženie profilu na počte doložených prác.
