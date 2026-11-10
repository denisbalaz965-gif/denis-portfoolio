import { teamMembers, teamStory } from '../data/team-members.js';
import { findProject } from '../data/portfolio-projects.js';
import { aboutReady, aboutStops, createAboutState } from './about-model.js';

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
      html.classList.remove('about-open');
      clearInline();
      layer.inert = false;
    },
    options,
  );

  const scene = { state, stops, frame() {} };
  return {
    scene,
    dispose() {
      controller.abort();
      created.forEach((node) => node.remove());
      introLink?.setAttribute('href', '#o-mne');
      layer.replaceChildren();
      layer.removeAttribute('style');
      layer.hidden = true;
      layer.inert = false;
      html.classList.remove('about-ready', 'about-open', 'about-fallback', 'about-cut');
    },
  };
}
