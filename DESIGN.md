---
name: Denis Baláž — Na konci internetu
description: One continuous phosphor-green world of digital work and grant-project stories.
colors:
  signal-green: '#a4ff61'
  signal-text: '#e0f3d4'
  signal-muted: '#a7bea0'
  signal-edge: '#35552d'
  world-ground: '#030804'
  world-center: '#173313'
  world-middle: '#071409'
  world-outer: '#020503'
  fragment-title: '#c7ffab'
  fragment-meta: '#96d079'
  fragment-body: '#b1c4a9'
  article-ground: '#071009ed'
  article-text: '#dcecd5'
  article-muted: '#b2c5a7'
  article-toolbar: '#0a170cef'
  button-fill: '#9fee64'
  button-ink: '#051005'
  index-panel: '#081108f5'
  index-hover: '#10220d'
  index-edge: '#63914c'
typography:
  display:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: 'clamp(70px, 10vw, 160px)'
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: '-0.065em'
  headline:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: 'clamp(48px, 7vw, 100px)'
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: '-0.045em'
  title:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: 'clamp(38px, 5vw, 72px)'
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: '-0.045em'
  body:
    fontFamily: 'Instrument, Arial, sans-serif'
    fontSize: '15px'
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: 'monospace'
    fontSize: '10px'
    lineHeight: 1.7
    letterSpacing: '0.03em'
rounded:
  control: '0'
spacing:
  gutter: 'clamp(24px, 5vw, 90px)'
  journey-node: '130px max(8vw, 24px)'
  journey-node-mobile: '110px 37px 110px 48px'
  index-trigger: '13px 16px'
  fragment-link: '12px 0'
  contact-button: '12px 19px'
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
  fragment-link:
    textColor: '{colors.signal-green}'
    padding: '{spacing.fragment-link}'
  fragment-plane:
    backgroundColor: '#0e210e77'
    rounded: '{rounded.control}'
    height: 'clamp(240px, 29vw, 420px)'
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

“Na konci internetu” is the owner-confirmed replacement world: one continuous phosphor-green space with a persistent vertical axis, sparse geometric data planes and six ordered fragments that approach and depart as the visitor scrolls. The background remains present from the opening sentence through the project archive and contact.

Depth comes from perspective, scale, sparse linework and controlled glow. The fragments are pieces of a digital archive, not literal meteorites or a collection of separate card sections. Opening a project places a calmer reading surface over the same world; it does not replace that world with a different page identity.

**Key Characteristics:**

- A fixed green field and vertical axis persist through the whole journey.
- Six project fragments alternate their desktop alignment and move through scroll-owned depth.
- Large Instrument Sans headings pair with small monospace coordinates and category text.
- Clipped planes, square controls and restrained phosphor glow replace rounded gallery cards.
- An inset article surface preserves the surrounding space and factual project evidence.

## Colors

Bright phosphor green sits inside a deep green-black world. The frontmatter captures reusable values; `src/styles/signal.css`, imported last by `main.css`, records the current overrides on inherited styles.

### Primary

- **Phosphor Green** (`signal-green`): emphasis, focus outlines, navigation response, article controls and the persistent axis.
- **Soft Phosphor** (`button-fill`): filled contact and story actions, with `button-ink` for contrast.
- **Luminous Title Green** (`fragment-title`): linked project titles and the axis core.

### Neutral

- **World Ground** (`world-ground`): the page ground behind the fixed field.
- **World Center / Middle / Outer** (`world-center`, `world-middle`, `world-outer`): the radial backdrop, brightest around the depth origin.
- **Signal Text / Muted / Edge** (`signal-text`, `signal-muted`, `signal-edge`): overall content hierarchy and structural boundaries.
- **Fragment Metadata / Body** (`fragment-meta`, `fragment-body`): category and summary text beneath each project title.
- **Article Ground / Text / Muted / Toolbar** (`article-ground`, `article-text`, `article-muted`, `article-toolbar`): the calmer reading layer.
- **Index Panel / Hover / Edge** (`index-panel`, `index-hover`, `index-edge`): the compact dropdown and its states.

**The Continuous World Rule.** Keep the field and axis present across intro, project fragments, personal text and contact; do not introduce unrelated section backgrounds.

## Typography

**Display Font:** Instrument Sans, registered locally as `Instrument`, with Arial and sans-serif fallbacks. Local weights are regular (400) and bold (700).
**Body Font:** the same family.
**Label/Mono Font:** the generic `monospace` stack for coordinates, serials, category labels and depth indicators.

### Hierarchy

- **Display:** the frontmatter role sets the opening statement. On mobile it changes to `clamp(54px, 14.5vw, 100px)` and line-height (0.96).
- **Headline:** personal and contact headings use the headline role; mobile uses `clamp(39px, 10vw, 70px)`.
- **Title:** project fragments use the title role and a maximum width (13ch); mobile uses `clamp(34px, 9vw, 58px)`.
- **Body:** fragment summaries use the body role and a maximum width (43ch). Intro copy uses line-height (1.7); personal text uses (17px / 1.75) on desktop and (15px) on mobile.
- **Label:** fragment category text uses the mono label role. Serial labels are (9px) with tracking (0.12em); these support the title rather than precede it as a redundant promotional heading.

Detailed article headings retain their existing responsive story hierarchy. The source has role-specific sizes, not a single mathematical type scale. The decorative intro seal has its own literal font stack in the stylesheet; it does not introduce a second bundled font.

**The Evidence Rule.** Keep project status, Denis’s contribution and source captions readable inside the article; atmospheric treatment must not strengthen the underlying claims.

## Layout

The fixed backdrop fills the viewport. The desktop vertical axis sits at (56%) of viewport width; on mobile it moves to (20px) from the left. The top navigation stays fixed and contains the monogram/name, a centered dropdown index and a contact link. A small fixed depth readout and background-pause button remain separate from document content.

Each project occupies a scroll stop with a minimum height (120svh), producing a paced vertical journey. Its fragment has width `min(760px, 68vw)`. Alternate stops align right with right padding (12vw); copy sits below and slightly overlaps the clipped preview. These are six ordered stops, not one carousel or two category galleries. Personal and contact text continue the same scroll world.

At widths at or below (760px), project fragments use the available width inside padding (110px 37px 110px 48px). Each node has minimum height (110svh), with the intro kept at (100svh). Preview planes are (235px) high. The index moves to the upper-right corner; the brand name and separate top contact link are hidden. At viewport heights at or below (600px), when width is at least (600px), journey nodes grow to (160svh) and the intro to (130svh).

Articles open in a dialog inset (34px 5vw), with width (90vw) and height `calc(100svh - 68px)`. On mobile the inset becomes (9px). The article scrolls independently; its toolbar is sticky and uses the inherited heights (76px) desktop and (64px) mobile. The saved page scroll position is restored on closing. Switching articles traverses all six projects in order, wrapping at either end.

## Elevation & Depth

The persistent field uses a radial green glow, faint scanlines and a luminous vertical axis. Canvas 2D draws sparse broken perspective planes and small data fragments. It is geometry rather than a star-field photograph or a meteor simulation. Content planes use a slight alternating tilt, clipped corners and a faint halo. Article depth comes from a translucent dark surface, border, surrounding shadow and backdrop blur (4px).

### Shadow Vocabulary

- **Axis halo:** `0 0 22px #6cff5455`.
- **Fragment halo:** `0 0 70px #3d9a1e12`.
- **Article separation:** `0 0 100px #02060399`.
- **Index separation:** `0 20px 70px #000a`.

**The Reading Interval Rule.** Give each approaching fragment a stable, fully visible reading interval before it departs.

## Shapes

Primary world controls and the article use square corners. Project preview planes have a clipped hexagonal silhouette with unequal opposing corner cuts, a fine border and rotation (−4deg) on left stops or (4deg) on right stops. The axis contains a small square rotated (45deg). Inherited illustrations and evidence images may retain their own object geometry; their shapes are not a new global control language.

## Components

### Project fragment

A clipped preview plane, linked heading, monospace category, short summary, underlined story link and large faint index number form one fragment. The preview is decorative; the heading and story link are the semantic entry points. GSAP owns approach, reading interval and departure as one scroll timeline: scale (0.55) through (1) to (1.12), with opacity and vertical offset changes. The scrub response is (0.45). Keyboard focus brings a project to the stable reading interval.

### Dropdown index

The native `details`/`summary` index lists six projects plus personal and contact anchors. Its closed trigger is (145px) wide on desktop and (140px) on mobile; the open panel is (280px), constrained to the viewport on mobile. Square edges, a fine green border and a dark translucent fill define it. Selecting a destination or clicking outside closes it. Escape closes it and restores focus to the summary.

### Article viewer

One project is mounted at a time. The sticky toolbar supplies close, project name, counter and previous/next controls. Project content reads vertically; sufficiently horizontal non-control gestures and left/right arrow keys switch projects across the full six-item sequence. Keep links, buttons, focus return and history routing functional. The opening transition is horizontal (0.6s); changing projects uses (0.45s), with `power3.out` easing.

The article retains original stories, status wording, model-data labels and source links. Current presentation filters preview scenes and captured article images into green monochrome using `grayscale(1) sepia(1) hue-rotate(42deg) saturate(2.2) brightness(0.72)`. This changes their presentation, not the underlying files or evidence classification.

### Evidence choices and actions

Screenshot-selection buttons remain outlined square controls with `aria-pressed` state. The selected control uses bright green and dark text. Contact copy and story actions use a soft green fill and dark text. General filled actions use minimum height (48px); the more-specific inherited contact action rule remains (43px), with padding (12px 19px). Preserve the existing focus outline (2px), offset (6px).

### Background and pause

The canvas is a fixed decorative field, behind semantic content. Autonomous drift combines with scroll-owned depth and the displayed depth value. Pause freezes autonomous drift but redraws when scrolling; it does not pause the project scroll timeline. Rendering stops while the tab is hidden. If canvas is unavailable, the CSS gradient, axis, text and project links remain; there is no torus or monogram fallback in this implementation.

The heading's glitch is a static narrow offset slice, not the former timed hover animation. The current journey and background do not automatically disable themselves for system reduced-motion preferences; retain the local pause control and do not describe it as a global motion toggle.

## Do's and Don'ts

### Do:

- **Do** preserve one continuous background and the ordered six-project sequence.
- **Do** keep the small index, readable titles, visible focus outlines and explicit close control.
- **Do** treat horizontal gestures as project switching and vertical gestures as article reading.
- **Do** preserve the saved journey scroll position when the article closes.
- **Do** distinguish presentation filters, illustrations, model data and authentic captures in the project evidence.

### Don't:

- **Don't** describe the geometric planes as literal meteorites or add unrelated space imagery.
- **Don't** rebuild the former separate web/grant galleries or rounded navigation pill.
- **Don't** make pause imply that all scroll-linked movement stops.
- **Don't** promote grant approval or a contractual funding limit into payment or completed delivery.
