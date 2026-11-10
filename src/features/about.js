import { teamMembers, teamStory } from '../data/team-members.js';
import { findProject } from '../data/portfolio-projects.js';
import {
  ABOUT_RESPECTS_REDUCED_MOTION,
  aboutHash,
  aboutLayout,
  aboutReady,
  aboutStops,
  createAboutState,
  parseAboutHash,
  requestEnter,
  requestLeave,
  sectionProgress,
  stopWeight,
  turnPhases,
} from './about-model.js';

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
    image.loading = 'lazy';
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
  const html = root.documentElement;
  if (!layer) return { dispose() {}, scene: null };
  if (!aboutReady(members, story, (id) => Boolean(findProject(id)))) {
    // Closed gate: nothing is rendered and our addresses behave like the intro.
    if (window.location.hash.startsWith('#o-nas')) window.history.replaceState(null, '', '#svet');
    return { dispose() {}, scene: null };
  }

  const controller = new AbortController();
  const options = { signal: controller.signal };
  const state = createAboutState();
  const stops = aboutStops(members);
  const created = [];
  const make = (node) => (created.push(node), node);

  const scroller = el('div', 'about-scroller');
  scroller.tabIndex = -1;
  const sections = stops.map((stop, index) => buildSection(stop, index, members, story));
  scroller.append(...sections);

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

  const cue = el('p', 'about-cue', 'Posúvajte ↓');
  cue.setAttribute('aria-hidden', 'true');
  const veil = el('div', 'about-veil');
  veil.setAttribute('aria-hidden', 'true');
  layer.append(veil, scroller, names, facetTags, nav, cue);
  layer.hidden = false;
  layer.inert = true;
  html.classList.add('about-ready');

  // Entries exist only while the gate is open, so a closed site has no dead links.
  const header = root.querySelector('.boundary-nav');
  const headerContact = header?.querySelector('.boundary-contact');
  if (headerContact)
    headerContact.before(make(link('about-entry boundary-about', '#o-nas', 'O nás ↗')));
  header
    ?.querySelector('.project-index')
    ?.after(make(link('about-back', '#svet', '← Späť k prácam')));
  const services = root.querySelector('.project-index nav a[href="#o-mne"]');
  if (services) {
    const item = make(link('about-entry', '#o-nas'));
    item.append(el('span', '', '↗'), 'O nás');
    services.before(item);
  }
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

  const stage = root.querySelector('.flight-stage');
  const viewer = root.querySelector('#project-viewer');
  const panels = sections.map((section) => section.firstElementChild);
  const nameButtons = [...names.children];
  const tagItems = [...facetTags.children];
  const navButtons = [...nav.querySelectorAll('button')];
  let opener = null,
    pendingStop = 0,
    backPending = false,
    currentStop = -1,
    tops = sections.map(() => 0),
    viewport = 1,
    cutTimer = 0,
    tagOwner = -1;

  const fallback = () => html.classList.contains('about-fallback');
  const active = () => state.mode === 'about' || state.mode === 'turning';
  const wake = () => root.dispatchEvent(new Event('portfolio:about'));
  const calm = () =>
    ABOUT_RESPECTS_REDUCED_MOTION &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
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

  function measure() {
    viewport = scroller.clientHeight || window.innerHeight || 1;
    tops = sections.map((section) => section.offsetTop);
    panels.forEach((panel) =>
      panel.style.setProperty(
        '--about-overflow',
        `${Math.max(0, panel.offsetHeight - viewport)}px`,
      ),
    );
  }
  function goTo(index, behavior = state.calm ? 'instant' : 'smooth') {
    scroller.scrollTo({ top: tops[index] ?? 0, behavior });
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

  function open() {
    html.classList.add('about-open');
    layer.inert = false;
    measure();
    if (pendingStop > 0) {
      goTo(pendingStop, 'instant');
      state.target = pendingStop;
      if (state.split >= 1) state.progress = pendingStop;
    }
    pendingStop = 0;
    scroller.focus({ preventScroll: true });
    layer.querySelectorAll('.about-portrait img').forEach((image) => {
      image.decode?.().catch(() => {});
    });
  }
  function enter(hash, { push = true, instant = false } = {}) {
    if (!requestEnter(state, { calm: calm(), instant })) return false;
    pendingStop = parseAboutHash(hash, stops, members) ?? 0;
    if (push) window.history.pushState({ aboutEntry: true }, '', hash);
    if (stage) stage.inert = true;
    layer.inert = true;
    wake();
    if (instant) open();
    return true;
  }
  function startLeave(destination) {
    if (!requestLeave(state, destination)) return;
    layer.inert = true;
    wake();
  }
  function leave(destination = null) {
    if (!active() || backPending) return;
    // Leaving to where the visitor came from is one step back in history; the
    // popstate handler then starts the turn. A destination keeps the entry and
    // rewrites it on landing.
    if (destination === null && window.history.state?.aboutEntry) {
      backPending = true;
      window.history.back();
      return;
    }
    if (destination === null) window.history.replaceState(null, '', '#svet');
    startLeave(destination);
  }
  function land() {
    const destination = state.destination;
    state.destination = null;
    html.classList.remove('about-open');
    if (stage) stage.inert = false;
    layer.inert = true;
    scroller.scrollTop = 0;
    markCurrent(-1);
    if (destination) window.history.replaceState(null, '', destination);
    root.dispatchEvent(new CustomEvent('portfolio:about-landed', { detail: { destination } }));
    let focus = opener;
    if (destination === '#kontakt') {
      focus = root.querySelector('.flight-contact h2');
      focus?.setAttribute('tabindex', '-1');
    }
    opener = null;
    if (focus?.isConnected) focus.focus({ preventScroll: true });
  }

  function frame(view) {
    if (fallback()) return;
    if (view.event === 'arrived') open();
    else if (view.event === 'landed') land();
    const returning = state.mode === 'returning';
    const split = ease(state.split);
    const fade = returning ? split : 1;
    const ui = state.mode === 'front' ? 0 : turnPhases(state.turn).about * fade;
    put(layer, '--about-ui', ui.toFixed(3));
    put(layer, '--about-veil', state.veil.toFixed(3));
    if (state.mode === 'front') return;

    sections.forEach((section, index) => {
      const weight = stopWeight(state.progress, index) * (index === 0 ? split : fade);
      put(panels[index], 'opacity', weight.toFixed(3));
      put(panels[index], '--shift', `${((index - state.progress) * 46).toFixed(1)}px`);
      setInert(section, weight < 0.6);
    });
    const arrival = stopWeight(state.progress, 0) * split * ui;
    put(names, 'opacity', arrival.toFixed(3));
    put(cue, 'opacity', arrival.toFixed(3));
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
    const layout = aboutLayout(state.progress, stops);
    if (layout.facetOwner !== tagOwner) {
      tagOwner = layout.facetOwner;
      tagItems.forEach((item, index) => {
        item.textContent = members[tagOwner].skills[index] ?? '';
      });
    }
    put(facetTags, 'opacity', (layout.facetAmount * fade).toFixed(3));
    tagItems.forEach((item, index) => {
      const point = view.facets[index];
      if (point)
        put(
          item,
          'transform',
          `translate3d(${(point.x + 20).toFixed(1)}px,${(point.y - 10).toFixed(1)}px,0)`,
        );
    });

    if (state.mode !== 'about') return;
    const stop = Math.round(state.progress);
    if (stop === currentStop) return;
    markCurrent(stop);
    // One history entry for the whole layer: stops only rewrite its address,
    // and never while an article opened from a profile owns the address.
    if (parseAboutHash(window.location.hash, stops, members) !== null)
      window.history.replaceState(window.history.state, '', aboutHash(stop, stops, members));
  }

  root.addEventListener(
    'click',
    (event) => {
      if (
        fallback() ||
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
        event.preventDefault();
        if (state.mode === 'about') goTo(stop);
        else if (enter(hash) && !layer.contains(target)) opener = target;
      } else if (!active()) return;
      else if (hash === '#kontakt') {
        event.preventDefault();
        leave('#kontakt');
      } else if (hash === '#svet') {
        event.preventDefault();
        leave(null);
      } else if (layer.contains(target) && target.dataset.member !== undefined) {
        const member = Number(target.dataset.member);
        goTo(stops.findIndex((entry) => entry.kind === 'who' && entry.member === member));
      } else if (layer.contains(target) && target.dataset.goto !== undefined)
        goTo(Number(target.dataset.goto));
    },
    options,
  );
  root.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && active() && !fallback() && !root.querySelector('dialog[open]'))
        leave(null);
    },
    options,
  );
  window.addEventListener(
    'popstate',
    () => {
      backPending = false;
      if (fallback()) return;
      const hash = window.location.hash;
      const stop = parseAboutHash(hash, stops, members);
      if (stop === null) {
        if (active()) startLeave(null);
      } else if (state.mode === 'front' || state.mode === 'returning') enter(hash, { push: false });
      else if (state.mode === 'about' && hash !== aboutHash(currentStop, stops, members))
        goTo(stop);
    },
    options,
  );
  scroller.addEventListener(
    'scroll',
    () => {
      if (state.mode !== 'about') return;
      state.target = sectionProgress(scroller.scrollTop, tops, viewport);
      wake();
    },
    { passive: true, signal: controller.signal },
  );
  window.addEventListener(
    'resize',
    () => {
      if (state.mode !== 'about') return;
      measure();
      goTo(Math.round(state.target), 'instant');
      wake();
    },
    options,
  );
  window.addEventListener('load', () => state.mode === 'about' && measure(), options);

  // An article opened from a profile takes over the scene: the layer's own
  // text steps aside and a short veil covers the cut both ways.
  const viewerObserver = new MutationObserver(() => {
    if (state.mode !== 'about') return;
    html.classList.toggle('about-reading', viewer.open);
    html.classList.add('about-cut');
    window.clearTimeout(cutTimer);
    cutTimer = window.setTimeout(() => html.classList.remove('about-cut'), 300);
    wake();
  });
  if (viewer) viewerObserver.observe(viewer, { attributes: true, attributeFilter: ['open'] });

  const clearInline = () => {
    layer.removeAttribute('style');
    layer.querySelectorAll('[style]').forEach((node) => node.removeAttribute('style'));
    layer.querySelectorAll('*').forEach((node) => {
      if (node.inert) node.inert = false;
    });
  };
  // Without WebGL the layer is an ordinary readable section of the document.
  root.addEventListener(
    'portfolio:flight-fallback',
    () => {
      Object.assign(state, createAboutState());
      html.classList.add('about-fallback');
      html.classList.remove('about-open', 'about-reading', 'about-cut');
      clearInline();
      layer.inert = false;
      if (stage) stage.inert = false;
    },
    options,
  );

  const initial = window.location.hash;
  if (parseAboutHash(initial, stops, members) !== null)
    enter(initial, { push: false, instant: true });

  return {
    scene: { state, stops, frame },
    dispose() {
      controller.abort();
      viewerObserver.disconnect();
      window.clearTimeout(cutTimer);
      created.forEach((node) => node.remove());
      introLink?.setAttribute('href', '#o-mne');
      layer.replaceChildren();
      layer.removeAttribute('style');
      layer.hidden = true;
      layer.inert = false;
      if (stage && state.mode !== 'front') stage.inert = false;
      html.classList.remove(
        'about-ready',
        'about-open',
        'about-fallback',
        'about-cut',
        'about-reading',
      );
    },
  };
}
