import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initAbout } from '../src/features/about.js';
import { aboutSpan, aboutUpFor } from '../src/features/about-model.js';
import { restoreFlightFallback } from '../src/features/flight-fallback.js';
import { fixtureMembers, fixtureStory } from '../src/data/team-members.fixture.js';

const page = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
// jsdom has no layout: one viewport is 800 px and the About span is measured from it.
const UNIT = 800;
const SPAN = aboutSpan(8) * UNIT;
const topFor = (stop) => SPAN - aboutUpFor(stop) * UNIT;
const view = (extra = {}) => ({
  width: 1440,
  height: 900,
  names: [],
  facets: [],
  facetOwner: 0,
  facetAmount: 0,
  ...extra,
});
let dispose = () => {};
let scrollY = 0;
const open = () => {
  const about = initAbout({ members: fixtureMembers, story: fixtureStory });
  dispose = about.dispose;
  return about;
};

beforeEach(() => {
  scrollY = 0;
  vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => scrollY);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function () {
    return this.classList.contains('about-span') ? SPAN : 0;
  });
  if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = function () {};
  window.history.replaceState(null, '', '/');
  document.body.innerHTML = new DOMParser().parseFromString(page, 'text/html').body.innerHTML;
});
afterEach(() => {
  dispose();
  dispose = () => {};
  document.documentElement.className = '';
});

describe('About layer in the document', () => {
  it('renders nothing and behaves like the intro while the gate is closed', () => {
    window.history.replaceState(null, '', '#o-nas/denis');
    const about = initAbout();
    dispose = about.dispose;
    expect(about.scene).toBeNull();
    expect(document.querySelector('#o-nas').hidden).toBe(true);
    expect(document.querySelector('#o-nas').childElementCount).toBe(0);
    expect(document.querySelector('.about-entry')).toBeNull();
    expect(document.querySelector('.about-span')).toBeNull();
    expect(document.querySelector('.flight-intro a[href="#o-mne"]')).not.toBeNull();
    expect(window.location.hash).toBe('#svet');
    expect(document.documentElement.classList.contains('about-ready')).toBe(false);
  });
  it('lives inside the one flight stage and extends the one scroll track above the start', () => {
    const about = open();
    const layer = document.querySelector('#o-nas');
    expect(layer.closest('.flight-stage')).not.toBeNull();
    expect(layer.hidden).toBe(false);
    expect(layer.inert).toBe(true);
    const track = document.querySelector('.flight-track');
    expect(track.style.getPropertyValue('--about-span')).toBe('820svh');
    expect(track.querySelector(':scope > .about-span')).not.toBeNull();
    expect(about.scene.span()).toBe(SPAN);
    expect(document.documentElement.classList.contains('about-ready')).toBe(true);
  });
  it('renders three profiles, the shared part and every entry when content is complete', () => {
    open();
    const layer = document.querySelector('#o-nas');
    expect(layer.querySelectorAll('.about-section')).toHaveLength(8);
    const portraits = [...layer.querySelectorAll('.about-section[data-kind="who"] img[alt]')];
    expect(portraits).toHaveLength(3);
    expect(portraits.every((image) => image.loading !== 'lazy')).toBe(true);
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
    expect(layer.querySelector('.about-cta').getAttribute('href')).toBe('#kontakt');
    expect(layer.querySelector('.about-leave').getAttribute('href')).toBe('#svet');
    // Header, index, the upward cue at the start, contact and footer.
    expect(document.querySelectorAll('.about-entry')).toHaveLength(5);
    expect(document.querySelector('.flight-stage .about-up-cue').textContent).toContain('O nás');
    expect(document.querySelector('.flight-intro a[href="#o-nas"]')).not.toBeNull();
    const nav = [...layer.querySelectorAll('.about-nav button')];
    expect(nav.map((b) => b.getAttribute('aria-label'))).toEqual([
      ...fixtureMembers.map((m) => m.name),
      'Spolu',
    ]);
    expect([...layer.querySelectorAll('.about-section')].map((s) => s.id)).toEqual([
      'o-nas-prichod',
      'o-nas-denis',
      'o-nas-denis-praca',
      'o-nas-martin',
      'o-nas-martin-praca',
      'o-nas-miros',
      'o-nas-miros-praca',
      'o-nas-spolu',
    ]);
  });
  it('gives every profile the same structure whatever its number of works', () => {
    open();
    const shape = (el) => [...el.querySelector('.about-panel').children].map((c) => c.className);
    const what = [...document.querySelectorAll('.about-section[data-kind="what"]')];
    expect(shape(what[1])).toEqual(shape(what[0]));
    expect(shape(what[2])).toEqual(shape(what[0]));
    expect(document.querySelectorAll('.about-facet-tags li')).toHaveLength(3);
  });
});

describe('One continuous scroll', () => {
  it('scrolls up to the arrival when an entry is clicked and keeps the stage usable', () => {
    scrollY = SPAN;
    const about = open();
    const woke = vi.fn();
    document.addEventListener('portfolio:about', woke);
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    document.querySelector('.boundary-nav .about-entry').dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: topFor(0), behavior: 'smooth' });
    expect(window.location.hash).toBe('#o-nas');
    expect(document.querySelector('.flight-stage').inert).toBeFalsy();
    expect(about.scene.state.targetUp).toBe(0);
    document.removeEventListener('portfolio:about', woke);
  });
  it('turns the scroll position above the start into the About target', () => {
    const about = open();
    const woke = vi.fn();
    document.addEventListener('portfolio:about', woke);
    scrollY = SPAN - 2 * UNIT;
    window.dispatchEvent(new Event('scroll'));
    expect(about.scene.state.targetUp).toBeCloseTo(2);
    expect(woke).toHaveBeenCalledTimes(1);
    scrollY = SPAN + 500;
    window.dispatchEvent(new Event('scroll'));
    expect(about.scene.state.targetUp).toBe(0);
    scrollY = 0;
    window.dispatchEvent(new Event('scroll'));
    expect(about.scene.state.targetUp).toBeCloseTo(aboutSpan(8));
    document.removeEventListener('portfolio:about', woke);
  });
  it('moves between members from the switcher and the names', () => {
    open();
    const nav = [...document.querySelectorAll('.about-nav button')];
    nav[1].click();
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: topFor(3), behavior: 'smooth' });
    nav[3].click();
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: topFor(7), behavior: 'smooth' });
    document.querySelector('.about-names button[data-member="2"]').click();
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: topFor(5), behavior: 'smooth' });
    document.querySelector('.project-index a[href="#o-nas"]').click();
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: topFor(0), behavior: 'smooth' });
  });
  it('opens a direct address at its stop without animating', () => {
    window.history.replaceState(null, '', `#o-nas/${fixtureMembers[2].id}`);
    open();
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: topFor(5), behavior: 'instant' });
    window.history.replaceState(null, '', '#o-nas/nikto');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: topFor(0), behavior: 'instant' });
  });
  it('leaves the contact and home links to the flight', () => {
    open();
    for (const selector of ['.about-cta', '.about-leave', '.boundary-contact']) {
      const click = new MouseEvent('click', { bubbles: true, cancelable: true });
      document.querySelector(selector).dispatchEvent(click);
      expect(click.defaultPrevented).toBe(false);
    }
  });
  it('shows the stop the scroll is on and nothing while on the front', () => {
    const about = open();
    const layer = document.querySelector('#o-nas');
    about.scene.frame(view());
    expect(layer.inert).toBe(true);
    expect(layer.style.getPropertyValue('--about-ui')).toBe('0.000');
    expect(document.documentElement.classList.contains('about-side')).toBe(false);

    Object.assign(about.scene.state, { up: 4, turn: 1, split: 1, progress: 3 });
    about.scene.frame(view({ names: [{ x: 10, y: 20 }], facetOwner: 1 }));
    const sections = [...layer.querySelectorAll('.about-section')];
    expect(layer.inert).toBe(false);
    expect(Number(sections[3].querySelector('.about-panel').style.opacity)).toBe(1);
    expect(sections[3].inert).toBe(false);
    expect(sections[0].inert).toBe(true);
    const nav = [...layer.querySelectorAll('.about-nav button')];
    expect(nav.map((b) => b.getAttribute('aria-current'))).toEqual([null, 'true', null, null]);
    expect(document.documentElement.classList.contains('about-side')).toBe(true);
    expect(layer.querySelector('.about-names button').style.transform).toContain('10.0px');
    expect(layer.querySelector('.about-facet-tags li').textContent).toBe(
      fixtureMembers[1].skills[0],
    );
  });
  it('waits with the arrival title until the crystal has split', () => {
    const about = open();
    const arrival = document.querySelector('.about-section[data-kind="arrival"] .about-panel');
    Object.assign(about.scene.state, { up: 1, turn: 1, split: 0, progress: 0 });
    about.scene.frame(view());
    expect(Number(arrival.style.opacity)).toBe(0);
    Object.assign(about.scene.state, { up: 1.4, split: 1 });
    about.scene.frame(view());
    expect(Number(arrival.style.opacity)).toBe(1);
  });
  it('stays on the same stop after a resize', () => {
    const about = open();
    Object.assign(about.scene.state, { up: aboutUpFor(5), turn: 1, split: 1, progress: 5 });
    window.scrollTo.mockClear();
    window.dispatchEvent(new Event('resize'));
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: topFor(5), behavior: 'instant' });
    Object.assign(about.scene.state, { up: 0, turn: 0, split: 0, progress: 0 });
    window.scrollTo.mockClear();
    window.dispatchEvent(new Event('resize'));
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
  it('steps aside while an article opened from a profile is being read', async () => {
    open();
    const viewer = document.querySelector('#project-viewer');
    viewer.setAttribute('open', '');
    await Promise.resolve();
    expect(document.documentElement.classList.contains('about-reading')).toBe(true);
    viewer.removeAttribute('open');
    await Promise.resolve();
    expect(document.documentElement.classList.contains('about-reading')).toBe(false);
  });
});

describe('Panels that do not fit', () => {
  it('marks a panel that has to scroll inside itself, and only that one', () => {
    const tall = (el) =>
      el.closest?.('#o-nas-martin-praca') && el.classList.contains('about-panel');
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function () {
      return tall(this) ? 505 : 280;
    });
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function () {
      return tall(this) ? 384 : 280;
    });
    open();
    const marked = [...document.querySelectorAll('.about-panel.is-scrollable')];
    expect(marked.map((panel) => panel.parentElement.id)).toEqual(['o-nas-martin-praca']);
  });
});

describe('About without WebGL', () => {
  it('becomes a plain readable section and resets the scroll track', () => {
    const about = open();
    Object.assign(about.scene.state, { up: 4, turn: 1, split: 1, progress: 3 });
    about.scene.frame(view());
    restoreFlightFallback();
    const layer = document.querySelector('#o-nas');
    expect(document.documentElement.classList.contains('about-fallback')).toBe(true);
    expect(document.documentElement.classList.contains('about-side')).toBe(false);
    expect(about.scene.state).toEqual({ up: 0, targetUp: 0, turn: 0, split: 0, progress: 0 });
    expect(layer.inert).toBe(false);
    expect(layer.querySelector('.about-panel').style.opacity).toBe('');
    expect(document.querySelector('.flight-track').style.getPropertyValue('--about-span')).toBe('');
    expect(about.scene.span()).toBe(0);
  });
  it('leaves entries as plain anchors and leads addresses to their section', () => {
    window.history.replaceState(null, '', `#o-nas/${fixtureMembers[1].id}`);
    open();
    const target = document.querySelector('#o-nas-martin');
    const shown = vi.spyOn(target, 'scrollIntoView');
    restoreFlightFallback();
    expect(shown).toHaveBeenCalled();
    window.scrollTo.mockClear();
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    document.querySelector('.about-entry').dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
