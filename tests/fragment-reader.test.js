import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { makeCrystalPiece } from '../src/features/fracture-geometry.js';
import { introFracture, chapterProgress } from '../src/features/flight-model.js';
import { initFragmentReader } from '../src/features/fragment-reader.js';
import { buildProjectContent, initProjectBrowser } from '../src/features/project-browser.js';
import { findProject } from '../src/data/portfolio-projects.js';
const html = readFileSync(resolve('index.html'), 'utf8');
const body = new DOMParser().parseFromString(html, 'text/html').body.innerHTML;
let dispose = () => {};
beforeEach(() => {
  document.body.innerHTML = body;
  document.body.className = '';
  window.history.replaceState(null, '', '/');
});
afterEach(() => {
  dispose();
  vi.restoreAllMocks();
  document.body.className = '';
});
function reader(id) {
  const project = findProject(id),
    root = document.querySelector('.case-content'),
    scroller = document.querySelector('.case-scroll');
  root.append(buildProjectContent(project));
  scroller.scrollTo = vi.fn(({ top }) => {
    if (scroller.scrollTop !== top) {
      scroller.scrollTop = top;
      scroller.dispatchEvent(new Event('scroll'));
    }
  });
  const fallback = vi.fn(() => vi.fn());
  dispose = initFragmentReader({ root, scroller, project, mountFallback: fallback });
  return { root, scroller, fallback };
}
describe('A whole crystal becomes the actual project pieces', () => {
  it('six distinct watertight wedges reconstruct a solid irregular hull', () => {
    let volume = 0;
    const signatures = new Set();
    for (let i = 0; i < 6; i++) {
      const geometry = makeCrystalPiece(i);
      const positions = geometry.getAttribute('position');
      let signed = 0;
      for (let j = 0; j < positions.count; j += 3) {
        const a = new THREE.Vector3().fromBufferAttribute(positions, j),
          b = new THREE.Vector3().fromBufferAttribute(positions, j + 1),
          c = new THREE.Vector3().fromBufferAttribute(positions, j + 2);
        signed += a.dot(b.cross(c)) / 6;
      }
      expect(Math.abs(signed)).toBeGreaterThan(0);
      volume += Math.abs(signed);
      const edges = new Map();
      const key = (v) =>
        v
          .toArray()
          .map((n) => n.toFixed(6))
          .join(',');
      for (let j = 0; j < positions.count; j += 3) {
        const corners = [0, 1, 2].map((n) =>
          key(new THREE.Vector3().fromBufferAttribute(positions, j + n)),
        );
        for (let n = 0; n < 3; n++) {
          const edge = [corners[n], corners[(n + 1) % 3]].sort().join('/');
          edges.set(edge, (edges.get(edge) ?? 0) + 1);
        }
      }
      expect([...edges.values()].every((count) => count === 2)).toBe(true);
      signatures.add([...positions.array].join(','));
      geometry.dispose();
    }
    expect(signatures.size).toBe(6);
    expect(volume).toBeGreaterThan(0.2);
    expect(volume).toBeLessThan(0.5);
  });
  it('the opening stays whole before movement and reconstructs on reverse scroll', () => {
    expect(introFracture(0)).toBe(0);
    expect(introFracture(1)).toBe(1);
    const forward = [0, 0.2, 0.4, 0.6, 1].map(introFracture);
    expect(forward).toEqual([...forward].sort((a, b) => a - b));
    expect([1, 0.6, 0.4, 0.2, 0].map(introFracture).reverse()).toEqual(forward);
  });
});
describe('Reading the fragments', () => {
  it('keeps source evidence and gives each salon chapter an individual stop', () => {
    const { root } = reader('stylovy-chlpac');
    expect(root.querySelectorAll('.reader-panel')).toHaveLength(7);
    expect(
      [...root.querySelectorAll('.reader-panel')].filter((panel) => !panel.inert),
    ).toHaveLength(1);
    expect(root.textContent).toContain('Jeden katalóg.');
    expect(root.querySelector('#salon-ukazky')).not.toBeNull();
    expect(root.querySelector('img[src="/images/chlpac-admin-demo.webp"]')).not.toBeNull();
    expect(root.querySelectorAll('.reader-index button')).toHaveLength(7);
  });
  it('moves forward and backward and keeps inactive sections out of keyboard focus', () => {
    const { root } = reader('corinex');
    root.querySelectorAll('.reader-index button')[2].click();
    expect(root.querySelector('.is-current').dataset.chapter).toBe('2');
    expect(
      [...root.querySelectorAll('.reader-panel')].filter((panel) => !panel.inert),
    ).toHaveLength(1);
    root.querySelectorAll('.reader-index button')[0].click();
    expect(root.querySelector('.is-current').dataset.chapter).toBe('0');
  });
  it('a small slow wheel movement advances and a reverse movement returns', () => {
    vi.useFakeTimers();
    try {
      const { root, scroller } = reader('corinex');
      root.querySelector('.reader-index button').click();
      scroller.scrollTop = 100;
      scroller.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaY: 100 }));
      scroller.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(260);
      expect(root.querySelector('.is-current').dataset.chapter).toBe('1');
      scroller.scrollTop -= 100;
      scroller.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaY: -100 }));
      scroller.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(260);
      expect(root.querySelector('.is-current').dataset.chapter).toBe('0');
    } finally {
      dispose();
      vi.useRealTimers();
    }
  });
  it('restores the complete conventional article if 3D fails', () => {
    const { root, fallback } = reader('stylovy-chlpac');
    document.dispatchEvent(new Event('portfolio:flight-fallback'));
    expect(root.querySelector('.reader-track')).toBeNull();
    expect(root.querySelectorAll('.story-step')).toHaveLength(5);
    expect(root.querySelector('#salon-ukazky')).not.toBeNull();
    expect(document.querySelector('dialog').classList.contains('reader-mode')).toBe(false);
    expect(document.querySelector('.flight-stage').inert).toBe(false);
    expect(fallback).toHaveBeenCalledOnce();
  });
  it('provides a stable reading interval then lands on the next fragment', () => {
    expect(chapterProgress(0, 400, 5)).toBe(0);
    expect(chapterProgress(180, 400, 5)).toBe(0);
    expect(chapterProgress(380, 400, 5)).toBeCloseTo(1);
    expect(chapterProgress(400, 400, 5)).toBe(1);
    expect(chapterProgress(9999, 400, 5)).toBe(4);
  });
});
describe('Project fragment entry', () => {
  it('waits for the fragment opening, and Escape cancels a pending entry', () => {
    document.body.classList.add('flight-ready');
    const captured = [];
    const entry = (event) => {
      event.preventDefault();
      captured.push(event.detail);
    };
    document.addEventListener('portfolio:project-entry', entry);
    dispose = () => document.removeEventListener('portfolio:project-entry', entry);
    const browser = initProjectBrowser({ animate: true, mountStories: () => () => {} });
    const previous = dispose;
    dispose = () => {
      browser();
      previous();
    };
    document.querySelector('.holo-open').click();
    expect(document.querySelector('dialog').open).toBe(false);
    expect(captured).toHaveLength(1);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    captured[0].complete();
    expect(document.querySelector('dialog').open).toBe(false);
    document.querySelector('.holo-open').click();
    expect(captured).toHaveLength(2);
    captured[1].complete();
    expect(document.querySelector('dialog').open).toBe(true);
    expect(document.querySelector('.reader-track').dataset.project).toBe('stylovy-chlpac');
  });
});
