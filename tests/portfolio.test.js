import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initNavigation } from '../src/features/navigation.js';
import {
  buildWebScene,
  buildGrantScene,
  buildQuotesScene,
  buildReferenceScene,
} from '../src/features/scroll-stories.js';
import {
  initProjectBrowser,
  bindProjectSwipe,
  buildProjectContent,
} from '../src/features/project-browser.js';
import { findProject } from '../src/data/portfolio-projects.js';
import { initContact } from '../src/features/contact.js';

const page = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const originalBody = new DOMParser().parseFromString(page, 'text/html').body.innerHTML;
let dispose;

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  document.body.style.overflow = '';
  document.body.innerHTML = originalBody;
  dispose = () => {};
});

afterEach(() => {
  dispose();
  vi.unstubAllGlobals();
});

describe('Project index', () => {
  it('closes with Escape and returns focus to its summary', () => {
    dispose = initNavigation();
    const menu = document.querySelector('.project-index');
    menu.open = true;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(menu.open).toBe(false);
    expect(document.activeElement).toBe(menu.querySelector('summary'));
  });
  it('closes after choosing a destination', () => {
    dispose = initNavigation();
    const menu = document.querySelector('.project-index');
    menu.open = true;
    menu.querySelector('a[href="#stop-corinex"]').click();
    expect(menu.open).toBe(false);
  });
  it('closes when clicking outside the index', () => {
    dispose = initNavigation();
    const menu = document.querySelector('.project-index');
    menu.open = true;
    document.querySelector('.brand').click();
    expect(menu.open).toBe(false);
  });
});

describe('Contact', () => {
  it('copies the same email address shown in the contact link', async () => {
    const clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    dispose = initContact({ clipboard });
    document.querySelector('#copy-email').click();
    await vi.waitFor(() =>
      expect(document.querySelector('#copy-status').textContent).toBe('E-mail je skopírovaný.'),
    );
    expect(clipboard.writeText).toHaveBeenCalledWith('denisbalaz965@gmail.com');
  });

  it('keeps the address available when clipboard permission is denied', async () => {
    dispose = initContact({
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('Denied')) },
    });
    document.querySelector('#copy-email').click();
    await vi.waitFor(() =>
      expect(document.querySelector('#copy-status').textContent).toBe(
        'E-mail: denisbalaz965@gmail.com',
      ),
    );
  });
});

describe('Continuous project scenes', () => {
  it('builds the salon system forwards, then restores the brief when reversed', () => {
    const chapter = buildProjectContent(findProject('stylovy-chlpac'));
    document.body.append(chapter);
    const stage = chapter.querySelector('.web-stage');
    const timeline = buildWebScene(stage);
    dispose = () => timeline.revert();
    timeline.seek(2);
    expect(stage.querySelector('[data-part="catalogue"]').style.opacity).toBe('1');
    expect(stage.querySelector('[data-part="brief"]').style.visibility).toBe('hidden');
    timeline.seek(4);
    expect(stage.querySelector('[data-part="domain"]').style.opacity).toBe('1');
    expect(stage.querySelector('[data-part="hero"]').style.opacity).toBe('1');
    expect(stage.querySelector('[data-part="booking"]').style.visibility).toBe('hidden');
    timeline.seek(0);
    expect(stage.querySelector('[data-part="brief"]').style.opacity).toBe('1');
    expect(stage.querySelector('[data-part="wireframe"]').style.opacity).toBe('1');
    expect(stage.querySelector('[data-part="domain"]').style.visibility).toBe('hidden');
  });

  it('moves grant preparation into implementation and can return to preparation', () => {
    const chapter = buildProjectContent(findProject('eurofondova-agenda'));
    document.body.append(chapter);
    const stage = chapter.querySelector('.grant-stage');
    const timeline = buildGrantScene(stage);
    dispose = () => timeline.revert();
    timeline.seek(1);
    expect(stage.querySelector('[data-part="budget"]').style.opacity).toBe('1');
    timeline.seek(2);
    expect(stage.querySelector('[data-part="delivery"]').style.opacity).toBe('1');
    expect(stage.querySelector('[data-part="budget"]').style.visibility).toBe('hidden');
    timeline.seek(3);
    expect(stage.querySelector('[data-part="proof"]').style.opacity).toBe('1');
    timeline.seek(1);
    expect(stage.querySelector('[data-part="budget"]').style.opacity).toBe('1');
    expect(stage.querySelector('[data-part="proof"]').style.visibility).toBe('hidden');
  });
});

describe('Project selection and full-page stories', () => {
  const mountStories = vi.fn(() => vi.fn());
  beforeEach(() => {
    mountStories.mockClear();
  });

  it('offers six ordered fragments without mounting long articles on the main page', () => {
    dispose = initProjectBrowser({ animate: false, mountStories });
    expect([...document.querySelectorAll('[data-stop]')].map((node) => node.dataset.stop)).toEqual([
      'stylovy-chlpac',
      'zakazko',
      'corinex',
      'tornala',
      'horna-kralova',
      'eurofondova-agenda',
    ]);
    expect(document.querySelector('dialog').open).toBe(false);
    expect(document.querySelector('main [data-story]')).toBeNull();
    expect(mountStories).not.toHaveBeenCalled();
  });
  it('cycles between all six projects across web and grant work', () => {
    dispose = initProjectBrowser({ animate: false, mountStories });
    document.querySelector('#stop-zakazko .fragment-title-link').click();
    document.querySelector('.case-switch [data-case-next]').click();
    expect(document.querySelector('dialog').dataset.project).toBe('corinex');
    expect(document.querySelector('[data-case-counter]').textContent).toBe('3 / 6');
    document.querySelector('.case-switch [data-case-prev]').click();
    expect(document.querySelector('dialog').dataset.project).toBe('zakazko');
  });
  it('restores the exact main-page position after closing the reader', () => {
    const restore = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(1374);
    dispose = initProjectBrowser({ animate: false, mountStories });
    document.querySelector('.fragment-title-link').click();
    document.querySelector('.case-switch [data-case-next]').click();
    document.querySelector('[data-case-close]').click();
    expect(restore).toHaveBeenLastCalledWith({ top: 1374, behavior: 'instant' });
    restore.mockRestore();
    vi.restoreAllMocks();
  });

  it('mounts only the opened story and disposes it before switching projects', () => {
    const teardown = vi.fn();
    mountStories.mockReturnValueOnce(teardown).mockReturnValue(() => {});
    dispose = initProjectBrowser({ animate: false, mountStories });
    document.querySelector('.fragment-title-link').click();
    expect(document.querySelector('dialog').open).toBe(true);
    expect(document.querySelector('.case-content [data-story]').dataset.story).toBe('web');
    expect(location.hash).toBe('#projekt/stylovy-chlpac');
    const callsBefore = mountStories.mock.calls.length;
    document.querySelector('.case-switch [data-case-next]').click();
    expect(teardown).toHaveBeenCalledTimes(1);
    expect(mountStories.mock.calls.length).toBe(callsBefore + 1);
    expect(document.querySelectorAll('.case-content [data-story]')).toHaveLength(1);
    expect(document.querySelector('.case-content [data-story]').dataset.story).toBe('quotes');
    expect(document.querySelector('.case-scroll').scrollTop).toBe(0);
    expect(location.hash).toBe('#projekt/zakazko');
  });

  it('opens a shared project directly, then Escape restores the overview and focus', () => {
    window.history.replaceState(null, '', '/#projekt/horna-kralova');
    dispose = initProjectBrowser({ animate: false, mountStories });
    expect(document.querySelector('.case-content').textContent).toContain('867 180,67 €');
    expect(document.querySelector('.case-content').textContent).toContain('28. 9. 2026');
    document.querySelector('dialog').dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(document.querySelector('dialog').open).toBe(false);
    expect(document.querySelector('.case-content').children).toHaveLength(0);
    expect(document.body.style.overflow).toBe('');
    expect(location.hash).toBe('#stop-corinex');
    expect(document.activeElement).toBe(
      document.querySelector('#stop-horna-kralova .fragment-title-link'),
    );
  });

  it('returns to the overview when browser history leaves the project route', () => {
    dispose = initProjectBrowser({ animate: false, mountStories });
    document.querySelector('.fragment-title-link').click();
    window.history.replaceState(null, '', '/#projekty');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(document.querySelector('dialog').open).toBe(false);
    expect(document.querySelector('.case-content').children).toHaveLength(0);
    expect(document.activeElement.classList.contains('fragment-title-link')).toBe(true);
  });

  it('ignores a delayed close event from a previous project after a new one opens', () => {
    window.history.replaceState(null, '', '/#projekt/stylovy-chlpac');
    dispose = initProjectBrowser({ animate: false, mountStories });
    document.querySelector('[data-case-close]').click();
    document.querySelector('#stop-corinex .fragment-title-link').click();
    const dialog = document.querySelector('dialog');
    expect(dialog.dataset.project).toBe('corinex');
    dialog.dispatchEvent(new Event('close'));
    expect(dialog.open).toBe(true);
    expect(dialog.dataset.project).toBe('corinex');
    expect(document.querySelector('.case-content').children).toHaveLength(1);
  });

  it('treats a horizontal swipe as project selection and leaves vertical gestures alone', () => {
    const element = document.createElement('div');
    document.body.append(element);
    const controller = new AbortController();
    const move = vi.fn();
    bindProjectSwipe(element, move, controller.signal);
    const pointer = (type, x, y) =>
      element.dispatchEvent(
        new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 }),
      );
    pointer('pointerdown', 200, 150);
    pointer('pointerup', 80, 160);
    expect(move).toHaveBeenLastCalledWith(1);
    pointer('pointerdown', 100, 100);
    pointer('pointerup', 110, 300);
    expect(move).toHaveBeenCalledTimes(1);
    controller.abort();
    pointer('pointerdown', 200, 150);
    pointer('pointerup', 80, 160);
    expect(move).toHaveBeenCalledTimes(1);
  });
});

describe('Audit regressions', () => {
  const mountStories = () => () => {};

  it('moves focus from a removed story control to the new project heading', () => {
    dispose = initProjectBrowser({ animate: false, mountStories });
    document.querySelector('.fragment-title-link').click();
    const step = document.querySelector('dialog .story-index a');
    step.focus();
    step.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.querySelector('dialog').dataset.project).toBe('zakazko');
    expect(document.activeElement).toBe(document.querySelector('dialog #case-title'));
    expect(document.querySelector('[data-case-announcement]').textContent).toContain('Zákazko.sk');
  });

  it.each(['metaKey', 'ctrlKey', 'shiftKey'])('leaves %s clicks to the browser', (modifier) => {
    dispose = initProjectBrowser({ animate: false, mountStories });
    let intercepted;
    // Observe after the application listener, then suppress jsdom's native navigation.
    document.addEventListener(
      'click',
      (event) => {
        intercepted = event.defaultPrevented;
        event.preventDefault();
      },
      { once: true },
    );
    document.querySelector('.fragment-title-link').dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        [modifier]: true,
      }),
    );
    expect(intercepted).toBe(false);
    expect(document.querySelector('dialog').open).toBe(false);
  });

  it.each(['%E0%A4%A', 'projekt-neexistuje'])('recovers from invalid project address %s', (id) => {
    dispose = initProjectBrowser({ animate: false, mountStories });
    document.querySelector('.fragment-title-link').click();
    window.history.replaceState(null, '', `/#projekt/${id}`);
    expect(() => window.dispatchEvent(new HashChangeEvent('hashchange'))).not.toThrow();
    expect(document.querySelector('dialog').open).toBe(false);
    expect(document.body.style.overflow).toBe('');
    expect(location.hash).toBe('#projekty');
    expect(document.querySelector('#project-route-status').hidden).toBe(false);
    expect(document.activeElement.id).toBe('project-route-status');
    // Browsers may notify both popstate and hashchange for the same navigation.
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(document.querySelector('#project-route-status').hidden).toBe(false);
  });

  it('switches real captures without showing multiple panels or losing button focus', () => {
    dispose = initProjectBrowser({ animate: false, mountStories });
    document.querySelector('.fragment-title-link').click();
    const button = document.querySelector('[data-salon-view="admin"]');
    button.focus();
    button.click();
    expect(document.querySelectorAll('[data-salon-panel]:not([hidden])')).toHaveLength(1);
    expect(document.querySelector('[data-salon-panel="admin"]').hidden).toBe(false);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(document.activeElement).toBe(button);
    document.querySelector('.case-switch [data-case-next]').click();
    expect(document.querySelector('.case-showcase')).toBeNull();
  });
});

describe('Additional project animations', () => {
  it('fans out the three quote documents and restores the input when reversed', () => {
    const chapter = buildProjectContent(findProject('zakazko'));
    document.body.append(chapter);
    const stage = chapter.querySelector('.story-stage');
    const timeline = buildQuotesScene(stage);
    dispose = () => timeline.revert();
    timeline.seek(1);
    expect(stage.querySelector('[data-part="offer"]').style.opacity).toBe('1');
    expect(stage.querySelector('[data-part="order"]').style.opacity).toBe('1');
    expect(stage.querySelector('[data-part="handover"]').style.opacity).toBe('1');
    timeline.seek(2);
    expect(stage.querySelector('[data-part="quote-domain"]').style.opacity).toBe('1');
    timeline.seek(0);
    expect(stage.querySelector('[data-part="input"]').style.opacity).toBe('1');
    expect(stage.querySelector('[data-part="offer"]').style.visibility).toBe('hidden');
  });

  it('shows the budget layer only for the reference with a documented budget role', () => {
    const chapter = buildProjectContent(findProject('corinex'));
    document.body.append(chapter);
    const stage = chapter.querySelector('.story-stage');
    const timeline = buildReferenceScene(stage, false);
    dispose = () => timeline.revert();
    timeline.seek(1);
    expect(stage.querySelector('[data-part="application"]').style.opacity).toBe('1');
    expect(stage.querySelector('[data-part="budget"]').style.visibility).toBe('hidden');
    timeline.seek(2);
    expect(stage.querySelector('[data-part="proof"]').style.opacity).toBe('1');
    timeline.seek(0);
    expect(stage.querySelector('[data-part="proof"]').style.visibility).toBe('hidden');
  });
});
