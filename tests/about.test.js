import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initAbout } from '../src/features/about.js';
import { requestEnter } from '../src/features/about-model.js';
import { restoreFlightFallback } from '../src/features/flight-fallback.js';
import { fixtureMembers, fixtureStory } from '../src/data/team-members.fixture.js';

const page = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
let dispose = () => {};
beforeEach(() => {
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
