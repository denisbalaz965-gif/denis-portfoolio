import { teamMembers, teamStory } from '../data/team-members.js';
import { findProject } from '../data/portfolio-projects.js';
import {
  aboutAt,
  aboutSpan,
  aboutStops,
  aboutUpFor,
  createAboutState,
  parseAboutHash,
  stopWeight,
  turnPhases,
} from './about-model.js';
import { aboutContentReady } from './about-gate.js';

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const link = (className, href, text) => {
  const node = el('a', className, text);
  node.setAttribute('href', href);
  return node;
};

// Content is built with textContent only; nothing from the data is parsed as HTML.
function buildSection(stop, index, members, story) {
  const section = el('section', 'about-section');
  section.dataset.stop = String(index);
  section.dataset.kind = stop.kind;
  // Ids give the no-WebGL document real targets for the About addresses.
  const owner = members[stop.member]?.id;
  section.id =
    stop.kind === 'arrival'
      ? 'o-nas-prichod'
      : stop.kind === 'together'
        ? 'o-nas-spolu'
        : `o-nas-${owner}${stop.kind === 'what' ? '-praca' : ''}`;
  const panel = el('div', 'about-panel');
  section.append(panel);
  const member = members[stop.member];
  if (stop.kind === 'arrival') {
    panel.append(
      el('p', 'about-eyebrow', 'O nás'),
      el('h1', 'about-title', 'Druhá strana.'),
      el('p', 'about-lead', 'Tri pohľady. Jeden tím.'),
    );
  } else if (stop.kind === 'who') {
    section.dataset.member = String(stop.member);
    const portrait = el('div', 'about-portrait');
    const image = el('img');
    image.src = member.portrait.src;
    image.alt = member.portrait.alt;
    if (member.portrait.width) image.width = member.portrait.width;
    if (member.portrait.height) image.height = member.portrait.height;
    // Not lazy: the panel is on screen long before a lazy load would start.
    image.decoding = 'async';
    portrait.append(image);
    const bio = el('div', 'about-bio');
    if (member.role) bio.append(el('p', 'about-role', member.role));
    member.about.forEach((paragraph) => bio.append(el('p', '', paragraph)));
    panel.append(
      el('p', 'about-eyebrow', `${member.letter} / ${member.name}`),
      portrait,
      el('h2', 'about-sentence', `„${member.sentence}“`),
      bio,
    );
  } else if (stop.kind === 'what') {
    section.dataset.member = String(stop.member);
    const skills = el('ul', 'about-skills');
    skills.setAttribute('aria-label', 'Schopnosti');
    [...member.skills, ...(member.moreSkills ?? [])].forEach((skill) =>
      skills.append(el('li', '', skill)),
    );
    const works = el('ul', 'about-works');
    works.setAttribute('aria-label', 'Práce');
    member.works.forEach((work) => {
      const anchor = link('', `#projekt/${work.project}`);
      anchor.append(
        el('b', '', findProject(work.project)?.name ?? work.project),
        el('span', '', work.note),
      );
      const item = el('li');
      item.append(anchor);
      works.append(item);
    });
    panel.append(
      el('p', 'about-eyebrow', `${member.letter} / ${member.name}`),
      el('h2', 'about-heading', 'Čo prináša.'),
      skills,
      works,
    );
    if (member.links?.length) {
      const links = el('p', 'about-links');
      member.links.forEach((entry) => {
        const anchor = link('', entry.href, `${entry.label} ↗`);
        anchor.rel = 'noopener';
        links.append(anchor);
      });
      panel.append(links);
    }
  } else {
    const text = el('div', 'about-story');
    story.paragraphs.forEach((paragraph) => text.append(el('p', '', paragraph)));
    const actions = el('div', 'about-actions');
    actions.append(
      link('about-cta', '#kontakt', 'Poďme na váš projekt ↗'),
      link('about-leave', '#svet', 'Späť k prácam'),
    );
    panel.append(
      el('p', 'about-eyebrow', `${members.map((entry) => entry.letter).join(' / ')} · spolu`),
      el('h2', 'about-heading', story.title),
      text,
    );
    if (story.principles?.length) {
      const principles = el('ul', 'about-principles');
      story.principles.forEach((principle) => principles.append(el('li', '', principle)));
      panel.append(principles);
    }
    panel.append(actions);
  }
  return section;
}

export function initAbout({ root = document, members = teamMembers, story = teamStory } = {}) {
  const layer = root.querySelector('#o-nas');
  const track = root.querySelector('.flight-track');
  const html = root.documentElement;
  if (!layer || !track) return { dispose() {}, scene: null };
  if (!aboutContentReady(members, story)) {
    // Closed gate: nothing is rendered and our addresses behave like the intro.
    if (window.location.hash.startsWith('#o-nas')) window.history.replaceState(null, '', '#svet');
    return { dispose() {}, scene: null };
  }

  const controller = new AbortController();
  const options = { signal: controller.signal };
  const state = createAboutState();
  const stops = aboutStops(members);
  const span = aboutSpan(stops.length);
  const created = [];
  const make = (node) => (created.push(node), node);

  const sections = stops.map((stop, index) => buildSection(stop, index, members, story));
  const panels = sections.map((section) => section.firstElementChild);

  const names = el('div', 'about-names');
  members.forEach((member, index) => {
    const button = el('button');
    button.type = 'button';
    button.dataset.member = String(index);
    button.append(el('b', '', member.letter), el('span', '', member.name));
    names.append(button);
  });

  const facetTags = el('ul', 'about-facet-tags');
  facetTags.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 3; i++) facetTags.append(el('li'));

  const nav = el('nav', 'about-nav');
  nav.setAttribute('aria-label', 'Členovia tímu');
  members.forEach((member, index) => {
    const button = el('button');
    button.type = 'button';
    button.dataset.member = String(index);
    button.setAttribute('aria-label', member.name);
    button.append(el('b', '', member.letter), el('span', 'about-nav-name', member.name));
    nav.append(button, el('i', '', '/'));
  });
  const together = el('button', 'about-nav-together', 'spolu');
  together.type = 'button';
  together.dataset.goto = String(stops.length - 1);
  together.setAttribute('aria-label', 'Spolu');
  nav.append(together);
  nav.querySelectorAll('i').forEach((slash) => slash.setAttribute('aria-hidden', 'true'));

  layer.append(...sections, names, facetTags, nav);
  layer.hidden = false;
  layer.inert = true;
  html.classList.add('about-ready');

  // About is the upper part of the one scroll track. The marker turns its
  // height (in small-viewport units) into pixels for the scene and for jumps.
  track.style.setProperty('--about-span', `${Math.round(span * 100)}svh`);
  const marker = make(el('div', 'about-span'));
  marker.setAttribute('aria-hidden', 'true');
  track.append(marker);

  // Entries exist only while the gate is open, so a closed site has no dead links.
  const header = root.querySelector('.boundary-nav');
  const headerContact = header?.querySelector('.boundary-contact');
  if (headerContact)
    headerContact.before(make(link('about-entry boundary-about', '#o-nas', 'O nás ↗')));
  const services = root.querySelector('.project-index nav a[href="#o-mne"]');
  if (services) {
    const item = make(link('about-entry', '#o-nas'));
    item.append(el('span', '', '↗'), 'O nás');
    services.before(item);
  }
  const scrollCue = root.querySelector('.scroll-cue');
  scrollCue?.setAttribute('aria-label', 'Posúvajte hore k tímu alebo dole k našej práci');
  const alternatives = root.querySelector('.flight-contact .contact-alternatives');
  if (alternatives) {
    const line = make(el('p', 'about-entry-line'));
    line.append(link('about-entry', '#o-nas', 'Kto za tým stojí ↗'));
    alternatives.before(line);
  }
  root
    .querySelector('.footer-studio')
    ?.append(make(link('about-entry about-entry-footer', '#o-nas', 'Kto za tým stojí ↗')));
  const introLink = root.querySelector('.flight-intro a[href="#o-mne"]');
  introLink?.setAttribute('href', '#o-nas');

  const viewer = root.querySelector('#project-viewer');
  const nameButtons = [...names.children];
  const tagItems = [...facetTags.children];
  const navButtons = [...nav.querySelectorAll('button')];
  let currentStop = -1,
    tagOwner = -1,
    onSide = false;

  const fallback = () => html.classList.contains('about-fallback');
  const pixels = () => (fallback() ? 0 : marker.offsetHeight);
  const ease = (value) => value * value * (3 - 2 * value);
  // Style writes are skipped when the value has not changed since the last frame.
  const written = new WeakMap();
  const put = (node, key, value) => {
    let cache = written.get(node);
    if (!cache) written.set(node, (cache = {}));
    if (cache[key] === value) return;
    cache[key] = value;
    if (key.startsWith('--')) node.style.setProperty(key, value);
    else node.style[key] = value;
  };
  const setInert = (node, value) => {
    if (node.inert !== value) node.inert = value;
  };

  // Scroll position above the start of the flight, in viewports.
  let knownPixels = pixels();
  function sync() {
    const height = pixels();
    // The span changes only when the viewport itself does (rotation, window
    // size), never with the browser bars. Until the resize handler has put the
    // page back on its stop, the offset the browser reports is not a position.
    if (knownPixels === 0) knownPixels = height;
    if (height !== knownPixels) return;
    const unit = height / span;
    const start = track.offsetTop + height;
    const up = unit > 0 ? Math.max(0, Math.min(span, (start - window.scrollY) / unit)) : 0;
    if (up === state.targetUp) return;
    state.targetUp = up;
    root.dispatchEvent(new Event('portfolio:about'));
  }
  // A panel that cannot fit scrolls inside itself; the mark gives it a soft lower edge.
  function measure() {
    panels.forEach((panel) =>
      panel.classList.toggle('is-scrollable', panel.scrollHeight > panel.clientHeight + 1),
    );
  }
  function goTo(stop, behavior = 'smooth') {
    const height = pixels();
    window.scrollTo({
      top: track.offsetTop + height - aboutUpFor(stop) * (height / span),
      behavior,
    });
  }
  function markCurrent(stop) {
    currentStop = stop;
    const info = stops[stop];
    navButtons.forEach((button) => {
      const on =
        info &&
        (info.kind === 'together'
          ? button.dataset.goto !== undefined
          : Number(button.dataset.member) === info.member);
      if (on) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  }

  // Called by the scene once per frame with the projected positions.
  function frame(view) {
    if (fallback()) return;
    const ui = turnPhases(state.turn).about;
    put(layer, '--about-ui', ui.toFixed(3));
    setInert(layer, ui < 0.6);
    const side = state.turn > 0.5;
    if (side !== onSide) {
      onSide = side;
      html.classList.toggle('about-side', side);
    }
    if (ui <= 0) return;

    const split = ease(state.split);
    sections.forEach((section, index) => {
      const weight = stopWeight(state.progress, index) * (index === 0 ? split : 1) * ui;
      put(panels[index], 'opacity', weight.toFixed(3));
      put(panels[index], '--shift', `${((state.progress - index) * 46).toFixed(1)}px`);
      setInert(section, weight < 0.6);
    });
    const arrival = stopWeight(state.progress, 0) * split * ui;
    put(names, 'opacity', arrival.toFixed(3));
    setInert(names, arrival < 0.6);
    nameButtons.forEach((button, index) => {
      const point = view.names[index];
      if (point)
        put(
          button,
          'transform',
          `translate3d(${point.x.toFixed(1)}px,${point.y.toFixed(1)}px,0) translate(-50%,0)`,
        );
    });
    if (view.facetOwner !== tagOwner && members[view.facetOwner]) {
      tagOwner = view.facetOwner;
      tagItems.forEach((item, index) => {
        item.textContent = members[tagOwner].skills[index] ?? '';
      });
    }
    put(facetTags, 'opacity', (view.facetAmount * ui).toFixed(3));
    tagItems.forEach((item, index) => {
      const point = view.facets[index];
      if (point)
        put(
          item,
          'transform',
          `translate3d(${(point.x + 20).toFixed(1)}px,${(point.y - 10).toFixed(1)}px,0)`,
        );
    });
    const stop = state.split >= 1 ? Math.round(state.progress) : -1;
    if (stop !== currentStop) markCurrent(stop);
  }

  // Without WebGL there is no scroll mapping: the stops are plain sections.
  function show(stop, behavior = 'smooth') {
    if (!fallback()) goTo(stop, behavior);
    else
      (stop === 0 ? layer : sections[stop]).scrollIntoView({
        block: 'start',
        behavior: behavior === 'instant' ? 'auto' : behavior,
      });
  }

  root.addEventListener(
    'click',
    (event) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        root.querySelector('dialog[open]')
      )
        return;
      const target = event.target.closest?.('a[href^="#"],button');
      if (!target) return;
      const hash = target.getAttribute('href');
      const stop = hash ? parseAboutHash(hash, stops, members) : null;
      if (stop !== null) {
        // An About address is a place on this page, like the index anchors.
        event.preventDefault();
        show(stop);
        if (window.location.hash !== hash) window.history.pushState(null, '', hash);
      } else if (fallback() || !layer.contains(target)) return;
      else if (target.dataset.member !== undefined) {
        const member = Number(target.dataset.member);
        goTo(stops.findIndex((entry) => entry.kind === 'who' && entry.member === member));
      } else if (target.dataset.goto !== undefined) goTo(Number(target.dataset.goto));
    },
    options,
  );
  // Leaving an article restores the reading position itself. The address it
  // returns to is only the one the visitor arrived by, so it must not move the
  // page; the flight in signal.js skips the same return the same way.
  let articleReturn = null;
  root.addEventListener(
    'portfolio:return',
    (event) => {
      // Sent while the article's own entry is current (its close button). The
      // copy sent after a browser Back names the current address and is late.
      if (event.detail?.hash !== window.location.hash) articleReturn = event.detail?.hash ?? null;
    },
    options,
  );
  const route = () => {
    const expected = articleReturn;
    articleReturn = null;
    // A Back while reading: this listener runs before the reader closes itself.
    if (viewer?.open || window.location.hash === expected) return;
    const stop = parseAboutHash(window.location.hash, stops, members);
    if (stop !== null) show(stop, 'instant');
  };
  window.addEventListener('popstate', route, options);
  window.addEventListener('scroll', sync, { passive: true, signal: controller.signal });
  window.addEventListener(
    'resize',
    () => {
      // The same scroll offset means a different place once the viewport changes:
      // return to the stop the visitor was on. Browser bars leave the span alone.
      if (pixels() !== knownPixels) {
        knownPixels = pixels();
        const at = aboutAt(state.targetUp, stops.length);
        if (!fallback() && at.split >= 1) goTo(Math.round(at.progress), 'instant');
      }
      measure();
      sync();
    },
    options,
  );
  window.addEventListener(
    'load',
    () => {
      measure();
      sync();
    },
    options,
  );

  // The article reader is transparent, so the layer's text steps aside under it.
  const viewerObserver = new MutationObserver(() => {
    html.classList.toggle('about-reading', viewer.open);
  });
  if (viewer) viewerObserver.observe(viewer, { attributes: true, attributeFilter: ['open'] });

  // Without WebGL the layer is an ordinary readable section of the document.
  root.addEventListener(
    'portfolio:flight-fallback',
    () => {
      Object.assign(state, createAboutState());
      html.classList.add('about-fallback');
      html.classList.remove('about-side', 'about-reading');
      onSide = false;
      track.style.removeProperty('--about-span');
      layer.removeAttribute('style');
      layer.querySelectorAll('[style]').forEach((node) => node.removeAttribute('style'));
      layer.querySelectorAll('*').forEach((node) => {
        if (node.inert) node.inert = false;
      });
      layer.inert = false;
      const stop = parseAboutHash(window.location.hash, stops, members);
      if (stop !== null) (stop === 0 ? layer : sections[stop]).scrollIntoView({ block: 'start' });
    },
    options,
  );

  route();
  measure();
  sync();

  return {
    scene: {
      state,
      stops,
      frame,
      sync,
      // Height of the About part of the track in pixels; 0 once it is a plain section.
      span: pixels,
      owns: (hash) => parseAboutHash(hash, stops, members) !== null,
    },
    dispose() {
      controller.abort();
      viewerObserver.disconnect();
      created.forEach((node) => node.remove());
      introLink?.setAttribute('href', '#o-mne');
      track.style.removeProperty('--about-span');
      layer.replaceChildren();
      layer.removeAttribute('style');
      layer.hidden = true;
      layer.inert = false;
      html.classList.remove('about-ready', 'about-side', 'about-fallback', 'about-reading');
    },
  };
}
