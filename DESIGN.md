---
name: Denis Baláž — Na konci internetu
description: A reversible crystal fracture, six project holograms and fragment-based reading.
colors:
  signal-green: '#a4ff61'
  signal-text: '#e0f3d4'
  signal-muted: '#a7bea0'
  signal-edge: '#35552d'
  world-ground: '#030804'
  flight-ground: '#031008'
  shard-body: '#123c20'
  shard-emissive: '#1c5d29'
  shard-edge: '#a8ff7d'
  hologram-light: '#163e26e8'
  hologram-dark: '#071b12ed'
  hologram-edge: '#80fca28c'
  hologram-title: '#d6ffda'
  hologram-body: '#c0d9bf'
  hologram-kind: '#96dfaa'
  article-ground: '#071009ed'
  article-text: '#dcecd5'
  article-muted: '#b2c5a7'
  article-toolbar: '#0a170cef'
  button-fill: '#9fee64'
  button-ink: '#051005'
  index-panel: '#081108f5'
  index-hover: '#10220d'
  index-edge: '#63914c'
  cursor-edge: '#b7ffc5'
  reader-panel-light: '#0d281be8'
  reader-panel-dark: '#07160feb'
  reader-border: '#6cc78a77'
  reader-text: '#dcf5df'
  reader-body: '#bdd6bd'
  reader-toolbar: '#07140de8'
  reader-index-active: '#a4ffb9'
  reader-index-ink: '#06100a'
typography:
  display:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: 'clamp(56px, 7.3vw, 108px)'
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: 'clamp(40px, 6vw, 84px)'
    fontWeight: 700
    lineHeight: 1
    letterSpacing: '-0.04em'
  title:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: '28px'
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: '-0.03em'
  body:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: '13px'
    fontWeight: 400
    lineHeight: 1.65
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
    fontSize: 'clamp(38px, 4vw, 62px)'
    fontWeight: 700
    lineHeight: 1.02
  reader-title:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: 'clamp(30px, 3vw, 43px)'
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: '-0.03em'
  reader-body:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1.75
rounded:
  control: '0'
spacing:
  gutter: 'clamp(24px, 5vw, 90px)'
  index-trigger: '13px 16px'
  hologram: '25px 25px 20px'
  hologram-mobile: '24px 21px 18px'
  story-link: '14px 0'
  contact-button: '12px 18px'
  reader-panel: '30px 32px'
  reader-panel-mobile: '24px'
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
    width: 'min(590px, 43%)'
    rounded: '{rounded.control}'
  reader-toolbar:
    backgroundColor: '{colors.reader-toolbar}'
    height: '76px'
  reader-index:
    backgroundColor: '#0b2115b3'
    textColor: '#8fc39b'
    width: '36px'
    height: '40px'
  reader-index-current:
    backgroundColor: '{colors.reader-index-active}'
    textColor: '{colors.reader-index-ink}'
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

# Design System: Denis Baláž — Na konci internetu

## Overview

**Creative North Star: "Na konci internetu"**

“Na konci internetu” begins with one large crystal assembled from the six actual project pieces. First scroll fractures it into those six projects; reverse scroll reassembles it. A compact green camera flight then makes one project primary while smaller pieces establish depth. Procedural fog, a faint axis and sparse debris connect the whole journey.

Native HTML holograms make the 3D projects readable. The story action sends a brief laser into its project, produces an impact and burst, and enters a chapter journey over the same world. Each real content section has its own 3D fragment and stable reading panel. Source text, evidence captures and links stay in HTML rather than being replaced by decorative chapter summaries.

**Key Characteristics:**

- One large crystal reversibly separates into the six actual project pieces.
- A primary project, smaller surrounding fragments and readable HTML holograms.
- A brief laser, impact and fragment burst connects a project to its story.
- Real article sections become fragment stops with stable, scrollable reading panels.
- Native chapter buttons, toolbar project switching and exact main-position return.
- One green world, the fine-pointer target cursor and original-content fallback.

## Colors

The world uses deep green-black, brighter green fog and luminous green edges. The frontmatter records reusable source values. `flight.css`, imported after `signal.css`, owns flight-specific overrides; `fragment-reader.css`, imported last, owns the full-viewport chapter reader and its panels. The original article layout remains the WebGL fallback.

### Primary

- **Phosphor Green** (`signal-green`): emphasis, focus and article-control states.
- **Crystal Edge Green** (`shard-edge`): fine edges of project geometry.
- **Soft Phosphor** (`button-fill`): filled actions, with dark `button-ink` text.
- **Hologram Green** (`hologram-light`, `hologram-dark`, `hologram-edge`): translucent panel material, with separate title, body and category values.

### Neutral

- **World Ground / Flight Ground** (`world-ground`, `flight-ground`): the page and WebGL-ready ground.
- **Crystal Body / Emission** (`shard-body`, `shard-emissive`): faceted dark-green material and its low green emission.
- **Signal Text / Muted / Edge** (`signal-text`, `signal-muted`, `signal-edge`): content and boundaries.
- **Article Ground / Text / Muted / Toolbar** (`article-ground`, `article-text`, `article-muted`, `article-toolbar`): calm reading surfaces.
- **Index Panel / Hover / Edge** (`index-panel`, `index-hover`, `index-edge`): dropdown navigation.
- **Cursor Green** (`cursor-edge`): four fine-pointer targeting corners.
- **Reader Panel / Border / Text** (`reader-panel-light`, `reader-panel-dark`, `reader-border`, `reader-text`, `reader-body`): stable chapter-reading material.
- **Reader Toolbar / Current Index** (`reader-toolbar`, `reader-index-active`, `reader-index-ink`): chapter mode chrome and current-step state.

**The Continuous World Rule.** Keep the flight, hologram and article within one green atmosphere; preserve the world behind the reading surface.

The fog shader builds continuously varying green from noise rather than a static colour ramp. Eight-step sidecar ramps are preview metadata; they are not additional implementation tokens or a replacement for the shader.

## Typography

**Display Font:** Instrument Sans, registered as `Instrument`, with Arial and sans-serif fallbacks; self-hosted weights (400) and (700).
**Body Font:** the same family. **Label/Mono Font:** generic monospace remains for the coordinate and depth readout; hologram and project beacon labels use Instrument.

### Hierarchy

- **Display:** the opening statement uses the frontmatter display role. Mobile uses `clamp(46px, 13.6vw, 90px)`; at viewport heights at or below (600px), the short-screen override is (64px).
- **Headline:** contact uses the headline role, changing to `clamp(37px, 10vw, 65px)` on mobile and (38px) on short screens.
- **Title:** the ready-state hologram uses (28px), reducing to (25px) on mobile. The native fallback title is (32px).
- **Body:** the hologram uses (13px / 1.65); fallback summaries use (14px / 1.7). Contact text is (15px / 1.6), reducing to (13px) on mobile.
- **Label:** hologram categories use (10px); project beacons use (10px) and distant labels are hidden until their project is primary or revealed. Coordinate/depth text stays compact.

Reader intro headings, chapter titles and body text use the dedicated frontmatter roles. Mobile uses (36px) intro headings, (30px) chapter titles and (15px / 1.7) body text. Short landscape viewports use (34px), (29px) and (14px) respectively. The fallback retains its original story hierarchy. Keep the short hologram summary distinct from the full chapter evidence.

**The HTML Evidence Rule.** Keep project names, summaries, article links, states and evidence in semantic HTML independently of the WebGL geometry.

## Layout

With WebGL ready, the flight track is (420svh) high on desktop and (390svh) at widths at or below (760px). A viewport stage and fixed projected content replace the former long succession of DOM sections. Scroll progress drives camera depth through six projects, then reaches contact. The faint axis remains at (50%) viewport width. The fixed header contains brand, a compact native dropdown index and contact access.

The primary beacon uses a generous invisible hit area (130 × 140px). Distant project hit areas shrink to (54 × 54px). Projection positions the HTML controls beside their geometry. A hologram is at most (320px) wide, constrained to viewport width minus (40px), and clamped away from screen edges. Its invisible bridge spans the gap between target and panel so pointer travel does not close the reveal.

The intro sits at (8%) from the left and (29%) from the top; contact sits at (15%) / (18%). Mobile uses left offsets around (32–34px), a narrower content width and smaller type. Short viewports allow the contact area and hologram to scroll internally. The contact area's native details element contains the personal introduction and GitHub link.

The WebGL story reader occupies the full viewport with a transparent dialog, retaining the shared scene. Main flight DOM is hidden and inert throughout reading; only its shared canvas remains visible. Its sticky stage begins below the toolbar at (76px), or (64px) on mobile. Desktop reading panels sit at (52%) from the left, (8svh) from the stage top, with width `min(590px, 43%)`, maximum height (70svh), and internal vertical overflow. On mobile they sit at (20px) from the left and (32svh) from the top, with width `calc(100% - 40px)` and maximum height `calc(63svh - 72px)`.

Native chapter buttons sit beside the fragments on desktop and above the reading panel on mobile. The dynamic count follows actual content: introduction, story steps and an evidence section when present; the salon story has seven chapters. The scroll unit is `max(230px, 55% of viewport height)`. Its first half provides a stable reading interval; the latter part travels to the next fragment. After (240ms) of quiet, native movement settles to the next or previous stop in the last user scroll direction. Programmatic jumps are tracked separately so a small slow wheel movement can advance rather than snap backward.

Closing restores the exact main scroll position. Toolbar arrows, left/right keyboard controls and horizontal gestures still switch the six projects. The original inset article layout remains available as the fallback when WebGL is absent or lost.

Without WebGL, the ready-state layout is absent: native HTML summaries and links form a normal readable project list. Preserve that fallback rather than leaving invisible projected controls.

## Elevation & Depth

Six closed face-pyramid geometries share a core and reconstruct one cubic crystal. The same six actual pieces separate into project positions, with smaller octahedral satellite geometry, fine edge lines, sparse particles and small debris. A fullscreen procedural shader supplies greener fog behind the geometry. Depth uses the camera's perspective, fog, smaller distant fragments and one primary project. The main flight has no client-image thumbnails, CSS-filter preview cards or DOM approach/hold/depart timelines.

The hologram combines a green translucent gradient, a fine border, offset frame lines and backdrop blur (12px). It reveals from a slight perspective turn and scale. The chapter reader uses stable green-gradient HTML panels over its own scroll-driven fragment path. Its transparent full-screen dialog has a faint dark backdrop without blur; the toolbar uses blur (8px). The original inset fallback retains its own article shadow and backdrop treatment.

### Shadow Vocabulary

- **Article separation:** `0 0 100px #02060399`.
- **Index separation:** `0 20px 70px #000a`.
- **Cursor halo:** `drop-shadow(0 0 3px #51de79)`.

**The Reading Lock Rule.** Freeze the main flight while the hologram or story is open. Within a story, move only its chapter camera from chapter scroll and keep the current reading panel stable during the reading interval.

## Shapes

Square control corners, thin frames and sharp faceted geometry form the world. Each project uses one of the six closed crystal pieces, four smaller satellites, luminous edge geometry and a sparse orbit line. The opening merges the six core pieces before their scroll-controlled separation. Each story chapter receives another crystal piece as its stop marker. The hologram is a rectangular HTML surface with offset frame details. The custom mouse cursor consists of four separate green corners around a small center point. Article illustrations retain their contained object shapes.

## Components

### Project beacon and hologram

Native HTML buttons are projected from the WebGL project positions; the mesh itself is not the navigation control. Mouse hover, keyboard focus or first tap on the beacon reveals the hologram and updates `aria-expanded`. A separate “Otvoriť príbeh” link starts the laser entry and then opens the story. The reveal stops any in-progress smooth scroll at its current position. The background's autonomous motion and camera interpolation freeze while it remains open.

The bridge covers target-to-panel pointer travel. Escape, the dismiss control, an outside pointer action, wheel/touch movement or leaving the project without retained focus closes it. Only one hologram is open. Hidden hologram content is inert. The panel opacity transition is (0.18s), transform (0.3s), and visibility (0.2s). The fallback exposes the same summaries and article links without a reveal requirement.

### Dropdown index

Native `details`/`summary` lists the six project anchors plus personal/contact destinations. It keeps the established square green border and translucent dark fill. Selecting a destination or clicking outside closes it; Escape restores focus to its summary. Flight routing maps those anchors to camera travel positions; personal text opens at contact.

### Laser entry

The native story link dispatches a cancelable entry request. The shared renderer draws a laser line, impact wireframe, fog flash and project-fragment burst over (900ms), then opens the story. Pointer interaction with the main flight stage and header is disabled during the shot. Escape cancels a pending entry. Direct article routes and fallback mode enter without requiring that effect. This is a WebGL/CSS interaction with no video service or audio.

### Fragment reader and evidence

One project remains mounted at a time. Its original full article DOM is divided into an introduction, each actual story step and an evidence section when present. Each section pairs with a 3D fragment; the camera moves between these from the reader's scroll progress. The current HTML panel remains readable and allows internal overflow for long evidence. Other panels are inert. A native numbered-button index uses `aria-controls` and `aria-current="step"`; a live location label names the current section.

The toolbar still closes the story and switches previous/next projects. Chapter numbers move within the current story. The main flight remains at its saved position while the reader moves its own camera. Main navigation, depth, coordinate, pause and flight hints are hidden in reader mode so only the chapter controls remain. Final-panel links supply next-project and return actions.

Evidence captures, screenshot selection, model-data labels, technical results and public source links remain in their actual content sections. The existing green image treatment remains presentation-only. If WebGL fails or loses context, the reader restores its cloned original full article and mounts the original GSAP scroll-story behavior; no content replacement is needed.

### Actions and evidence choices

Square filled actions use soft green with dark text. The contact copy control uses padding (12px 18px) and font size (12px), with minimum height (48px) desktop and (44px) mobile. Evidence selectors retain explicit `aria-pressed` states. Focus uses the shared (2px) green outline, offset (6px).

### Target cursor

Four green corners track mouse movement only under `(hover: hover) and (pointer: fine)`. They tighten near interactive elements and shrink on press. The element ignores pointer events, disappears on keyboard interaction or leaving the window, and does not replace the natural coarse-pointer mobile interaction.

### Background, pause and fallback

Three.js (0.182.0) renders the field with a capped pixel ratio (1.25 desktop / 1 mobile). Pause freezes autonomous drift while scroll travel remains available. Hologram/story locks stop main-flight interpolation and ambient drift. The story camera separately interpolates its chapter progress, so scrolling still moves between story fragments. Rendering stops while the page is hidden. On renderer creation failure or context loss, the native HTML project list and the restored original article remain accessible; no publication or device-performance result follows from having that fallback in source.

The intro retains its static offset title slice. Motion is locally active even when the system requests reduced motion; the pause control is not a global article-animation toggle.

## Do's and Don'ts

### Do:

- **Do** build the opening crystal from the six actual project pieces and keep fracture reversible.
- **Do** keep the native hologram link as the explicit trigger for laser entry.
- **Do** derive chapter stops from the full original content and retain evidence and source links.
- **Do** keep a stable reading interval, internal overflow and native chapter buttons.
- **Do** preserve exact main-flight return and original-content WebGL fallback.

### Don't:

- **Don't** replace real article sections with decorative one-line summaries.
- **Don't** confuse chapter navigation with toolbar switching between projects.
- **Don't** make the main flight drift while a hologram or story is open.
- **Don't** add a video-service or audio dependency to the laser interaction.
- **Don't** remove the fallback article or the original evidence distinctions.
