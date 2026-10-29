import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initNavigation } from '../src/features/navigation.js';
import { initProjectFilter } from '../src/features/project-filter.js';
import { initProjectDialog } from '../src/features/project-dialog.js';
import { initWorkflowDemo } from '../src/features/workflow-demo.js';
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

describe('Project filters', () => {
  it.each([
    ['design', ['project-chlpac', 'project-ponuky']],
    ['automation', ['project-workflow', 'project-ponuky']],
  ])('shows the relevant projects for %s, then restores all projects', (filter, expected) => {
    dispose = initProjectFilter();
    document.querySelector(`[data-filter="${filter}"]`).click();
    const visible = () =>
      [...document.querySelectorAll('.project-card')]
        .filter((card) => !card.hidden)
        .map((card) => card.id);
    expect(visible()).toEqual(expected);
    expect(document.querySelectorAll('.filters [aria-pressed="true"]')).toHaveLength(1);
    document.querySelector('[data-filter="all"]').click();
    expect(visible()).toHaveLength(3);
  });

  it('does not duplicate listeners after teardown and reinitialization', () => {
    const onChange = vi.fn();
    initProjectFilter({ onChange })();
    dispose = initProjectFilter({ onChange });
    document.querySelector('[data-filter="design"]').click();
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('Project details', () => {
  it.each([
    ['eurofondy', 'Eurofondy s podporou AI'],
    ['chlpac', 'Štýlový chlpáč'],
    ['ponuky', 'Zákazko.sk'],
  ])('opens the matching story for %s and returns focus after Escape', (id, title) => {
    dispose = initProjectDialog();
    const opener = document.querySelector(`[data-case="${id}"]`);
    opener.click();
    const dialog = document.querySelector('#case-dialog');
    expect(dialog.open).toBe(true);
    expect(document.querySelector('#case-title').textContent).toBe(title);
    expect(dialog.querySelectorAll('.case-section')).toHaveLength(4);
    expect(document.body.classList.contains('dialog-open')).toBe(true);
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(dialog.open).toBe(false);
    expect(document.body.classList.contains('dialog-open')).toBe(false);
    expect(document.activeElement).toBe(opener);
  });

  it('closes using the visible return button', () => {
    dispose = initProjectDialog();
    document.querySelector('[data-case="eurofondy"]').click();
    document.querySelector('.dialog-done').click();
    expect(document.querySelector('dialog').open).toBe(false);
  });

  it('renders story text without interpreting embedded markup', () => {
    const text = '<img src=x onerror="alert(1)">';
    dispose = initProjectDialog({
      stories: {
        eurofondy: { category: 'Test', title: 'Test', intro: text, sections: [['Text', text]] },
      },
    });
    document.querySelector('[data-case="eurofondy"]').click();
    expect(document.querySelector('#case-intro').textContent).toBe(text);
    expect(document.querySelector('#case-details img')).toBeNull();
  });
});

describe('Workflow example', () => {
  it('cycles through all four steps and returns to the first', () => {
    dispose = initWorkflowDemo();
    const next = document.querySelector('#next-step');
    for (const counter of ['02 / 04', '03 / 04', '04 / 04', '01 / 04']) {
      next.click();
      expect(document.querySelector('#stage-counter').textContent).toBe(counter);
      expect(document.querySelectorAll('.step[aria-pressed="true"]')).toHaveLength(1);
    }
  });

  it('can jump directly to a step and shows its context and control state', () => {
    dispose = initWorkflowDemo();
    document.querySelector('[data-step="2"]').click();
    expect(document.querySelector('#stage-counter').textContent).toBe('03 / 04');
    expect(document.querySelector('#stage-title').textContent).toBe(
      'Overiť verziuaj skutočný stav.',
    );
    expect(document.querySelector('#stage-example span').textContent).toBe('KONTROLA PODKLADOV');
    expect(document.querySelector('#stage-title br')).not.toBeNull();
    expect(document.querySelector('[data-step="2"]').getAttribute('aria-pressed')).toBe('true');
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
