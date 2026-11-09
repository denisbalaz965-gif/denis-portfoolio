import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { teamProjects } from '../src/data/team-projects.js';
import {
  findProject,
  projectsForViewer,
  portfolioProjects,
} from '../src/data/portfolio-projects.js';
import { buildProjectContent, initProjectBrowser } from '../src/features/project-browser.js';
import { initScrollStories } from '../src/features/scroll-stories.js';

const page = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
let dispose = () => {};
beforeEach(() => {
  window.history.replaceState(null, '', '/');
  document.body.innerHTML = new DOMParser().parseFromString(page, 'text/html').body.innerHTML;
});
afterEach(() => dispose());

describe('Team work and retained experience', () => {
  it('uses sourced brand identities in the main journey and retains website captures inside articles', () => {
    const marks = [...document.querySelectorAll('.flight-project .brand-mark')];
    expect(marks).toHaveLength(6);
    expect(document.querySelector('.flight-project .holo-preview')).toBeNull();
    for (const mark of marks) {
      const path = mark.getAttribute('src');
      expect(path).toMatch(/^\/images\/brand-marks\//);
      expect(readFileSync(resolve('public', path.slice(1))).byteLength).toBeGreaterThan(100);
      expect(mark.closest('a').getAttribute('href')).toMatch(/^#projekt\//);
    }
    expect(
      buildProjectContent(findProject('previa')).querySelector('.case-showcase img'),
    ).not.toBeNull();
  });
  it('presents the studio without personal names across every article', () => {
    expect(document.body.textContent).not.toMatch(
      /Denis|Martin|Miroš|Pracujem|riešim|AI mi|Moja úloha/,
    );
    expect(document.querySelector('.team-members')).toBeNull();
    for (const project of portfolioProjects)
      expect(buildProjectContent(project).textContent).not.toMatch(
        /Denis|Martin|Miroš|Pracujem|riešim|AI mi|Moja úloha/,
      );
  });
  it('keeps client-facing selection separate from personal grant experience', () => {
    const featured = projectsForViewer(findProject('attilapark'));
    const personal = projectsForViewer(findProject('corinex'));
    expect(featured).toHaveLength(6);
    expect(featured.map((p) => p.id)).not.toContain('corinex');
    expect(personal.map((p) => p.id)).toContain('zakazko');
    expect(personal.map((p) => p.id)).not.toContain('attilapark');
  });
  it.each(teamProjects)(
    'preserves attribution, live link and evidence for $name without WebGL',
    (project) => {
      const chapter = buildProjectContent(project);
      document.body.append(chapter);
      expect(chapter.querySelector('.case-contribution').textContent).toBe(project.credit);
      expect(chapter.querySelector('.chapter-link').href).toBe(project.url);
      expect(chapter.querySelector('.case-showcase img').getAttribute('src')).toContain(
        project.screenshot,
      );
      dispose = initScrollStories({ root: chapter });
      expect(chapter.classList.contains('story-is-animated')).toBe(false);
      expect(chapter.querySelectorAll('.story-step')).toHaveLength(2);
      expect(chapter.querySelector('.section-kicker')).toBeNull();
      expect(chapter.querySelector('.story-step > div').firstElementChild.tagName).toBe('H3');
    },
  );
  it('keeps an old shared stop URL usable and closes to the team overview', async () => {
    window.history.replaceState(null, '', '/#stop-corinex');
    dispose = initProjectBrowser({ animate: false, mountStories: () => () => {} });
    expect(document.querySelector('dialog').dataset.project).toBe('corinex');
    document.querySelector('[data-case-close]').click();
    await Promise.resolve();
    expect(document.querySelector('dialog').open).toBe(false);
    expect(location.hash).toBe('#o-mne');
  });
});
