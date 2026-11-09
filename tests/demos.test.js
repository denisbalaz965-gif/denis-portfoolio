import { afterEach, describe, expect, it, vi } from 'vitest';
import { demoProjects } from '../src/data/demo-projects.js';
import { availableSlots, advertDraft, advertText } from '../src/features/demo-model.js';
import { buildDemoContent, mountDemo } from '../src/features/demos.js';

let dispose = () => {};
afterEach(() => {
  dispose();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function demo(index) {
  const root = document.createElement('div');
  root.append(buildDemoContent(demoProjects[index]));
  document.body.replaceChildren(root);
  dispose = mountDemo(root, demoProjects[index]);
  return root;
}

describe('Model calendar', () => {
  it('respects opening hours and existing appointments for both durations', () => {
    expect(availableSlots(0, 'consult')).toContain(570);
    expect(availableSlots(0, 'consult')).not.toContain(600);
    expect(availableSlots(0, 'service')).not.toContain(570);
    expect(availableSlots(0, 'service')).not.toContain(750);
  });
  it('rejects overlaps with reservations while allowing adjacent time ranges', () => {
    const reservations = [{ day: 0, start: 630, duration: 60 }];
    const slots = availableSlots(0, 'consult', reservations);
    expect(slots).not.toContain(630);
    expect(slots).not.toContain(660);
    expect(slots).toContain(690);
    expect(availableSlots(1, 'consult', reservations)).toContain(630);
  });
  it('rejects invalid service or day values', () => {
    expect(availableSlots(0, 'invalid')).toEqual([]);
    expect(availableSlots(-1, 'consult')).toEqual([]);
    expect(availableSlots(99, 'consult')).toEqual([]);
  });
  it('removes a confirmed time, resets selection, and restores the calendar on reset', () => {
    const root = demo(0),
      book = root.querySelector('.demo-book');
    expect(book.disabled).toBe(true);
    root.querySelector('[data-time="540"]').click();
    expect(book.disabled).toBe(false);
    book.click();
    expect(root.querySelector('[data-time="540"]')).toBeNull();
    expect(book.disabled).toBe(true);
    expect(root.querySelector('.demo-result').textContent).toContain('09:00–09:30');
    root.querySelector('.demo-reset').click();
    expect(root.querySelector('[data-time="540"]')).not.toBeNull();
  });
});

describe('Local advertisement draft', () => {
  it('requires actual offer text before exporting and limits values', () => {
    expect(advertText({ service: '   ', benefit: 'Test' })).toBeNull();
    expect(advertDraft({ service: 'x'.repeat(100), cta: 'bad' }).service).toHaveLength(60);
    expect(advertDraft({ cta: 'bad' }).cta).toBe('Získať ponuku');
  });
  it('renders user input as text and updates the preview without executing HTML', () => {
    const root = demo(1),
      input = root.querySelector('#ad-service');
    input.value = '<img src=x onerror=alert(1)>';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(root.querySelector('[data-ad-headline]').textContent).toContain('<img');
    expect(root.querySelector('.demo-ad img')).toBeNull();
  });
  it('exports the current draft and releases its download URL on disposal', () => {
    const make = vi.fn(() => 'blob:demo'),
      release = vi.fn();
    vi.stubGlobal('URL', { createObjectURL: make, revokeObjectURL: release });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const root = demo(1);
    root
      .querySelector('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(make).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(root.querySelector('.demo-result').textContent).toContain('stiahnutie');
    dispose();
    expect(release).toHaveBeenCalledWith('blob:demo');
    dispose = () => {};
  });
});
