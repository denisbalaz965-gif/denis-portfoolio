---
name: Denis Baláž — Na konci internetu
description: One phosphor-green WebGL flight with project holograms and readable stories.
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
rounded:
  control: '0'
spacing:
  gutter: 'clamp(24px, 5vw, 90px)'
  index-trigger: '13px 16px'
  hologram: '25px 25px 20px'
  hologram-mobile: '24px 21px 18px'
  story-link: '14px 0'
  contact-button: '12px 18px'
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
  article:
    backgroundColor: '{colors.article-ground}'
    textColor: '{colors.article-text}'
    rounded: '{rounded.control}'
    width: '90vw'
    height: 'calc(100svh - 68px)'
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

“Na konci internetu” is one phosphor-green world experienced through a compact WebGL camera flight. Abstract crystalline data shards carry the six projects. A single primary project is legible at a time; smaller surrounding fragments establish depth. Green procedural fog, a faint vertical axis and sparse debris connect the introduction, projects and contact.

The project preview is an HTML hologram anchored beside the projected geometry. Revealing it freezes the world so the visitor can read and choose the article link. The article then opens as a calm inset surface over the same background. Client screenshots belong to the detailed evidence inside articles, not to the main flight's shard surfaces.

**Key Characteristics:**

- One green WebGL atmosphere with procedural fog and crystalline data shards.
- A primary project surrounded by smaller fragments in depth.
- Projected native HTML buttons and a separate readable hologram reveal.
- A frozen world while a hologram or article is open.
- Square controls, self-hosted Instrument Sans and a fine-pointer target cursor.
- Native HTML project summaries and links when WebGL is unavailable.

## Colors

The world uses deep green-black, brighter green fog and luminous green edges. The frontmatter records reusable source values. `flight.css`, imported after `signal.css`, owns flight-specific overrides; the article retains the shared green system.

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

The article retains its established larger responsive story headings. Keep a clear distinction between the short hologram summary and detailed article evidence.

**The HTML Evidence Rule.** Keep project names, summaries, article links, states and evidence in semantic HTML independently of the WebGL geometry.

## Layout

With WebGL ready, the flight track is (420svh) high on desktop and (390svh) at widths at or below (760px). A viewport stage and fixed projected content replace the former long succession of DOM sections. Scroll progress drives camera depth through six projects, then reaches contact. The faint axis remains at (50%) viewport width. The fixed header contains brand, a compact native dropdown index and contact access.

The primary beacon uses a generous invisible hit area (130 × 140px). Distant project hit areas shrink to (54 × 54px). Projection positions the HTML controls beside their geometry. A hologram is at most (320px) wide, constrained to viewport width minus (40px), and clamped away from screen edges. Its invisible bridge spans the gap between target and panel so pointer travel does not close the reveal.

The intro sits at (8%) from the left and (29%) from the top; contact sits at (15%) / (18%). Mobile uses left offsets around (32–34px), a narrower content width and smaller type. Short viewports allow the contact area and hologram to scroll internally. The contact area's native details element contains the personal introduction and GitHub link.

Articles remain inset (34px 5vw), width (90vw), height `calc(100svh - 68px)`, with a mobile inset (9px). They scroll independently beneath a sticky toolbar. Closing returns to the saved main scroll position; left/right controls, keyboard arrows and horizontal gestures traverse all six articles with wraparound.

Without WebGL, the ready-state layout is absent: native HTML summaries and links form a normal readable project list. Preserve that fallback rather than leaving invisible projected controls.

## Elevation & Depth

Three.js draws faceted clusters from octahedral geometry, fine edge lines, sparse particles and small geometric debris. A fullscreen procedural shader supplies greener fog behind the geometry. Depth uses the camera's perspective, fog, smaller distant fragments and one primary project. The main flight has no client-image thumbnails, CSS-filter preview cards or DOM approach/hold/depart timelines.

The hologram combines a green translucent gradient, a fine border, offset frame lines and backdrop blur (12px). It reveals from a slight perspective turn and scale. The article uses the existing dark translucent reading surface and backdrop blur (4px).

### Shadow Vocabulary

- **Article separation:** `0 0 100px #02060399`.
- **Index separation:** `0 20px 70px #000a`.
- **Cursor halo:** `drop-shadow(0 0 3px #51de79)`.

**The Reading Lock Rule.** Freeze autonomous world motion and camera interpolation while a hologram or article is open. Resume travel when reading closes or the visitor scrolls onward.

## Shapes

Square control corners, thin frames and sharp faceted geometry form the world. Each project is a cluster of five crystalline shards with luminous edge geometry and a sparse orbit line. The hologram is a rectangular HTML surface with offset frame details. The custom mouse cursor consists of four separate green corners around a small center point. Article illustrations retain their contained object shapes.

## Components

### Project beacon and hologram

Native HTML buttons are projected from the WebGL project positions; the mesh itself is not the navigation control. Mouse hover, keyboard focus or first tap on the beacon reveals the hologram and updates `aria-expanded`. A separate “Otvoriť príbeh” link opens the article. The reveal stops any in-progress smooth scroll at its current position. The background's autonomous motion and camera interpolation freeze while it remains open.

The bridge covers target-to-panel pointer travel. Escape, the dismiss control, an outside pointer action, wheel/touch movement or leaving the project without retained focus closes it. Only one hologram is open. Hidden hologram content is inert. The panel opacity transition is (0.18s), transform (0.3s), and visibility (0.2s). The fallback exposes the same summaries and article links without a reveal requirement.

### Dropdown index

Native `details`/`summary` lists the six project anchors plus personal/contact destinations. It keeps the established square green border and translucent dark fill. Selecting a destination or clicking outside closes it; Escape restores focus to its summary. Flight routing maps those anchors to camera travel positions; personal text opens at contact.

### Article viewer and evidence

One article is mounted at a time. Its toolbar supplies close, project name, counter and previous/next controls. Articles keep their existing routes, history, native vertical reading, horizontal project switching and focus return. The world remains behind the article and freezes for reading.

Existing illustrative article scenes and captures retain their green presentation filter: `grayscale(1) sepia(1) hue-rotate(42deg) saturate(2.2) brightness(0.72)`. The main flight has no such image previews. Underlying files, source captions, model-data labels and factual project states remain distinct from the presentation treatment.

### Actions and evidence choices

Square filled actions use soft green with dark text. The contact copy control uses padding (12px 18px) and font size (12px), with minimum height (48px) desktop and (44px) mobile. Evidence selectors retain explicit `aria-pressed` states. Focus uses the shared (2px) green outline, offset (6px).

### Target cursor

Four green corners track mouse movement only under `(hover: hover) and (pointer: fine)`. They tighten near interactive elements and shrink on press. The element ignores pointer events, disappears on keyboard interaction or leaving the window, and does not replace the natural coarse-pointer mobile interaction.

### Background, pause and fallback

Three.js (0.182.0) renders the field with a capped pixel ratio (1.25 desktop / 1 mobile). Pause freezes autonomous drift while scroll travel remains available. Hologram/article locks also stop camera interpolation and world motion. Rendering stops while the page is hidden. On renderer creation failure or context loss, the native HTML project list stays accessible; no publication or device-performance result follows from having that fallback in source.

The intro retains its static offset title slice. Motion is locally active even when the system requests reduced motion; the pause control is not a global article-animation toggle.

## Do's and Don'ts

### Do:

- **Do** keep one primary project and use smaller distant shards to establish depth.
- **Do** reveal the HTML hologram on mouse hover, keyboard focus or first tap before the story link opens the article.
- **Do** preserve a generous invisible hit area and a continuous pointer bridge to the panel.
- **Do** keep native links available when WebGL fails or loses its context.
- **Do** preserve the exact saved flight scroll position when the article closes.

### Don't:

- **Don't** place client-image previews or CSS-tinted screenshot cards in the main flight.
- **Don't** turn the abstract crystalline data shards into literal meteorites.
- **Don't** move the camera or ambient world while a hologram is being read.
- **Don't** show the custom mouse cursor on coarse-pointer mobile devices.
- **Don't** imply that pause disables scrolling or all article animation.
