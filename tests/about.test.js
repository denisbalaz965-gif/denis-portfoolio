import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initAbout } from '../src/features/about.js';
import { requestEnter } from '../src/features/about-model.js';
import { restoreFlightFallback } from '../src/features/flight-fallback.js';
import { initProjectBrowser } from '../src/features/project-browser.js';
import { fixtureMembers, fixtureStory } from '../src/data/team-members.fixture.js';

const page = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
let dispose = () => {};
beforeEach(() => {
  // jsdom has no element scrolling; the layer only needs the call to exist.
  if (!Element.prototype.scrollTo) Element.prototype.scrollTo = function () {};
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

const view = (event = null) => ({ event, width: 1440, height: 900, names: [], facets: [] });
function arrive(about, entry = document.querySelector('.about-entry')) {
  entry.click();
  Object.assign(about.scene.state, { mode: 'about', turn: 1, split: 1 });
  about.scene.frame(view('arrived'));
}
function land(about) {
  Object.assign(about.scene.state, { mode: 'front', turn: 0, split: 0 });
  about.scene.frame(view('landed'));
}

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
