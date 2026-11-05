import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initNavigation } from '../src/features/navigation.js';
import { buildWebScene, buildGrantScene } from '../src/features/scroll-stories.js';
import { initContact } from '../src/features/contact.js';

const page = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const originalBody = new DOMParser().parseFromString(page, 'text/html').body.innerHTML;
let dispose;

beforeEach(() => {
  document.body.innerHTML = originalBody;
  dispose = () => {};
});

afterEach(() => {
  dispose();
  vi.unstubAllGlobals();
});

describe('Mobile navigation', () => {
  it('opens, then closes with Escape and returns focus to its button', () => {
    dispose = initNavigation();
    const toggle = document.querySelector('.menu-toggle');
    toggle.click();
    expect(document.querySelector('#mobile-menu').hidden).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.querySelector('#mobile-menu').hidden).toBe(true);
    expect(document.activeElement).toBe(toggle);
  });

  it('closes after choosing a destination', () => {
    dispose = initNavigation();
    document.querySelector('.menu-toggle').click();
    document.querySelector('#mobile-menu a[href="#granty"]').click();
    expect(document.querySelector('#mobile-menu').hidden).toBe(true);
  });

  it('closes an open menu when the layout crosses to desktop', () => {
    dispose = initNavigation();
    document.querySelector('.menu-toggle').click();
    const media = window.matchMedia.mock.results[0].value;
    const event = new Event('change');
    Object.defineProperty(event, 'matches', { value: true });
    media.dispatchEvent(event);
    expect(document.querySelector('#mobile-menu').hidden).toBe(true);
    expect(document.querySelector('.menu-toggle').getAttribute('aria-expanded')).toBe('false');
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
    const stage = document.querySelector('.web-stage');
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
    const stage = document.querySelector('.grant-stage');
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
