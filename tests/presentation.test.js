import { describe, it, expect } from 'vitest';
import { presentationAt, presentationLayout } from '../src/features/flight-presentation.js';
import { scrollTurn, FLIGHT_END } from '../src/features/flight-model.js';

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
  it('leads with the service and stacks supporting proof below it on mobile', () => {
    const p = presentationLayout(0, 390, 844);
    expect(p.left).toBe(24);
    expect(p.left + p.width).toBe(366);
    expect(p.copyTop - p.top).toBeGreaterThan(180);
  });
  it('fits the measured opposite service and preserves the text-to-proof gap', () => {
    for (const [width, height, copyHeight, captionHeight] of [
      [1280, 900, 344, 493],
      [390, 844, 220, 340],
      [320, 740, 231, 320],
      [844, 390, 230, 274],
    ]) {
      const p = presentationLayout(0, width, height, { copyHeight, captionHeight });
      expect(p.top + captionHeight).toBeLessThan(height - 24);
      if (width < 600) {
        expect(p.copyTop).toBeGreaterThanOrEqual(p.top + captionHeight + 24);
        expect(p.copyTop + copyHeight).toBeLessThan(height - 45);
      }
    }
  });
  it('makes a single smooth full turn over travel, deterministic and reversible', () => {
    expect(scrollTurn(0)).toBe(0);
    expect(scrollTurn(FLIGHT_END)).toBeCloseTo(Math.PI * 2);
    expect(scrollTurn(-10)).toBe(0);
    expect(scrollTurn(FLIGHT_END + 10)).toBeCloseTo(Math.PI * 2);
    const path = [0, 1, 2, 3, 4, 5, 6, FLIGHT_END];
    const angles = path.map((p) => scrollTurn(p));
    expect(angles).toEqual([...angles].sort((a, b) => a - b));
    expect(
      [...path]
        .reverse()
        .map((p) => scrollTurn(p))
        .reverse(),
    ).toEqual(angles);
    expect(scrollTurn(3.01) - scrollTurn(3)).toBeLessThan(0.01);
    expect(scrollTurn(1.5, 3)).toBeCloseTo(Math.PI);
  });
});
