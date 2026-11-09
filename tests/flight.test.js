import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { restoreFlightFallback } from '../src/features/flight-fallback.js';
import { initHolograms } from '../src/features/holograms.js';
import {
  activeStop,
  flightAt,
  scrollForStop,
  hologramPosition,
  FLIGHT_END,
} from '../src/features/flight-model.js';
const html = readFileSync(resolve('index.html'), 'utf8');
const body = new DOMParser().parseFromString(html, 'text/html').body.innerHTML;
let dispose = () => {};
beforeEach(() => {
  document.body.innerHTML = body;
  document.body.className = 'flight-ready';
});
afterEach(() => {
  dispose();
  document.body.className = '';
});
describe('Projected project holograms', () => {
  it('first touch reveals a panel without opening an article, then offers a normal project link', () => {
    dispose = initHolograms();
    const project = document.querySelector('.flight-project');
    const button = project.querySelector('.fragment-beacon');
    expect(project.querySelector('.hologram').inert).toBe(true);
    button.click();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(project.querySelector('.hologram').inert).toBe(false);
    expect(document.querySelector('dialog').open).toBe(false);
    expect(project.querySelector('.holo-open').getAttribute('href')).toBe('#projekt/attilapark');
  });
  it('keeps the panel open while moving from the object to its link, then closes on departure', () => {
    dispose = initHolograms();
    const project = document.querySelector('.flight-project');
    const pointer = (type) => {
      const event = new MouseEvent(type);
      Object.defineProperty(event, 'pointerType', { value: 'mouse' });
      return event;
    };
    project.querySelector('.fragment-beacon').dispatchEvent(pointer('pointerenter'));
    expect(project.classList.contains('is-revealed')).toBe(true);
    project.querySelector('.holo-open').dispatchEvent(pointer('pointerenter'));
    expect(project.querySelector('.hologram').inert).toBe(false);
    project.dispatchEvent(pointer('pointerleave'));
    expect(project.querySelector('.hologram').inert).toBe(true);
  });
  it('does not reopen under the pointer immediately after Escape', () => {
    dispose = initHolograms();
    const project = document.querySelector('.flight-project');
    const button = project.querySelector('.fragment-beacon');
    button.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    const enter = new MouseEvent('pointerenter');
    Object.defineProperty(enter, 'pointerType', { value: 'mouse' });
    button.dispatchEvent(enter);
    expect(project.classList.contains('is-revealed')).toBe(false);
    button.click();
    expect(project.classList.contains('is-revealed')).toBe(true);
  });
  it('allows one panel at a time and closes it on scroll or Escape', () => {
    dispose = initHolograms();
    const buttons = document.querySelectorAll('.fragment-beacon');
    buttons[0].click();
    buttons[1].click();
    expect(document.querySelectorAll('.is-revealed')).toHaveLength(1);
    expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
    expect(document.querySelectorAll('.is-revealed')).toHaveLength(0);
    buttons[2].focus();
    expect(buttons[2].getAttribute('aria-expanded')).toBe('true');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(buttons[2].getAttribute('aria-expanded')).toBe('false');
  });
  it('keeps article links available when WebGL has no enhanced view', () => {
    document.body.className = 'flight-fallback';
    dispose = initHolograms();
    expect(document.querySelectorAll('.holo-open')).toHaveLength(6);
    expect([...document.querySelectorAll('.hologram')].every((panel) => !panel.inert)).toBe(true);
  });
  it('automatically pairs one preview with the scroll without opening a dialog or locking it as a hover', () => {
    dispose = initHolograms();
    const present = (id) =>
      document.dispatchEvent(new CustomEvent('portfolio:presentation', { detail: { id } }));
    present('attilapark');
    expect(document.querySelectorAll('.is-presented')).toHaveLength(1);
    expect(document.querySelector('#holo-attilapark').inert).toBe(false);
    expect(document.querySelector('.is-revealed')).toBeNull();
    expect(document.querySelector('dialog').open).toBe(false);
    present('previa');
    expect(document.querySelector('#holo-attilapark').inert).toBe(true);
    expect(document.querySelector('#holo-previa').inert).toBe(false);
    present(null);
    expect(document.querySelectorAll('.is-presented')).toHaveLength(0);
    expect(document.querySelector('#holo-previa').inert).toBe(true);
  });
  it('lets Escape dismiss the automatic preview until the next stop and retains an explicit way to reopen', () => {
    dispose = initHolograms();
    document.dispatchEvent(new CustomEvent('portfolio:presentation', { detail: { id: 'previa' } }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.querySelector('.is-presented')).toBeNull();
    expect(document.querySelector('#holo-previa').inert).toBe(true);
    document.querySelector('#stop-previa .fragment-beacon').click();
    expect(document.querySelector('#holo-previa').inert).toBe(false);
    expect(document.querySelector('dialog').open).toBe(false);
  });
});
describe('Flight navigation', () => {
  it('jumps to every project and reverses without changing the order', () => {
    const points = Array.from({ length: 6 }, (_, i) => scrollForStop(i, 100, 2800));
    points.forEach((scroll, i) => {
      expect(flightAt(scroll, 100, 2800)).toBeCloseTo(i + 1);
      expect(activeStop(flightAt(scroll, 100, 2800))).toBe(i);
    });
    expect(points).toEqual([...points].sort((a, b) => a - b));
    expect(activeStop(flightAt(points[1], 100, 2800))).toBe(1);
    expect(flightAt(0, 100, 2800)).toBe(0);
    expect(flightAt(9999, 100, 2800)).toBe(FLIGHT_END);
  });
  it.each([
    [320, 740],
    [390, 844],
    [740, 360],
    [1440, 900],
  ])('keeps the hologram inside %sx%s', (width, height) => {
    for (const x of [40, width / 2, width - 40]) {
      const panel = hologramPosition(x, height / 2, width, height);
      expect(panel.left).toBeGreaterThanOrEqual(20);
      expect(panel.left + panel.width).toBeLessThanOrEqual(width - 20);
      expect(panel.top).toBeGreaterThanOrEqual(96);
    }
  });
});

describe('Loss of 3D mid-flight', () => {
  it('restores all project links, introduction and contact and stops hiding them on later scroll', () => {
    dispose = initHolograms();
    document.querySelector('.fragment-beacon').click();
    for (const el of document.querySelectorAll('.flight-intro,.flight-contact')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-60px)';
      el.style.pointerEvents = 'none';
      el.inert = true;
    }
    for (const project of document.querySelectorAll('.flight-project')) {
      project.style.transform = 'translate3d(900px, 400px, 0)';
    }
    restoreFlightFallback();
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
    expect(document.body.classList.contains('flight-ready')).toBe(false);
    expect(document.body.classList.contains('flight-fallback')).toBe(true);
    for (const el of document.querySelectorAll('.flight-intro,.flight-contact')) {
      expect(el.style.opacity).toBe('');
      expect(el.style.transform).toBe('');
      expect(el.style.pointerEvents).toBe('');
      expect(el.inert).toBe(false);
    }
    expect([...document.querySelectorAll('.hologram')].every((el) => !el.inert)).toBe(true);
    expect(
      [...document.querySelectorAll('.flight-project')].every((el) => !el.style.transform),
    ).toBe(true);
    expect(document.querySelector('.flight-contact a[href^="mailto:"]')).not.toBeNull();
  });
});
