import { describe, it, expect } from 'vitest';
import { presentationAt, presentationLayout } from '../src/features/flight-presentation.js';

describe('A continuous statement and its proof', () => {
  it('leaves the first view and contact clear, then exposes the matching project at each stop', () => {
    expect(presentationAt(0)).toBe(-1);
    expect(presentationAt(0.5)).toBe(-1);
    expect(presentationAt(6.5)).toBe(-1);
    for (let i = 0; i < 6; i++) expect(presentationAt(i + 1)).toBe(i);
  });
  it('places each desktop proof entirely across the axis from its copy, alternating sides', () => {
    for (const [w, h] of [
      [1280, 900],
      [921, 833],
      [844, 390],
    ]) {
      for (let i = 0; i < 6; i++) {
        const p = presentationLayout(i, w, h);
        expect(p.left).toBeGreaterThan(0);
        expect(p.left + p.width).toBeLessThan(w);
        expect(p.left < w / 2 !== p.copyLeft < w / 2).toBe(true);
        expect(p.right).toBe(i % 2 === 0);
      }
    }
  });
  it('stacks the proof below the copy with touch-sized side gutters on a narrow screen', () => {
    const p = presentationLayout(0, 390, 844);
    expect(p.left).toBe(24);
    expect(p.left + p.width).toBe(366);
    expect(p.top - p.copyTop).toBeGreaterThan(180);
  });
});
