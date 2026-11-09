import { describe, it, expect } from 'vitest';
import { fragmentWaypoint, waypointToWorld } from '../src/features/fragment-paths.js';
import { activeStop } from '../src/features/flight-model.js';

describe('Fragments arrive from different directions', () => {
  it('hands interaction to the next fragment as the previous one leaves', () => {
    for (let stop = 1; stop < 6; stop++) {
      expect(activeStop(stop)).toBe(stop - 1);
      expect(activeStop(stop + 0.2)).toBe(stop);
    }
  });
  it('uses all four incoming quadrants and sides, rather than one lane', () => {
    const entries = Array.from({ length: 6 }, (_, i) => fragmentWaypoint(i, -1.3));
    const corners = new Set(
      entries.map((p) => `${p.x < 0.5 ? 'left' : 'right'}-${p.y < 0.5 ? 'top' : 'bottom'}`),
    );
    expect(corners.size).toBe(4);
    const p = fragmentWaypoint(0, -0.7),
      a = entries[0],
      b = fragmentWaypoint(0, 0);
    expect(Math.abs((p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x))).toBeGreaterThan(0.01);
  });
  it('has a calm clickable/readable hold, then exits before the camera passes', () => {
    for (let i = 0; i < 6; i++) {
      const center = fragmentWaypoint(i, 0);
      expect(fragmentWaypoint(i, -0.1)).toEqual(center);
      expect(fragmentWaypoint(i, 0.05)).toEqual(center);
      expect(center.x).toBeGreaterThan(0.25);
      expect(center.x).toBeLessThan(0.75);
      const gone = fragmentWaypoint(i, 0.34);
      expect(gone.x < 0 || gone.x > 1 || gone.y < 0 || gone.y > 1).toBe(true);
    }
  });
  it('is continuous at both ends of the hold and reversible by scroll', () => {
    for (let i = 0; i < 6; i++) {
      for (const boundary of [-0.15, 0.08, 0.34]) {
        const before = fragmentWaypoint(i, boundary - 0.00001),
          after = fragmentWaypoint(i, boundary + 0.00001);
        expect(Math.hypot(after.x - before.x, after.y - before.y)).toBeLessThan(0.001);
      }
      const forward = [-1, -0.7, -0.2, 0, 0.1, 0.3].map((t) => fragmentWaypoint(i, t));
      expect([0.3, 0.1, 0, -0.2, -0.7, -1].map((t) => fragmentWaypoint(i, t)).reverse()).toEqual(
        forward,
      );
    }
  });
  it('keeps mobile stops accessible and reader stops in their dedicated reading area', () => {
    for (let i = 0; i < 7; i++) {
      const mobile = fragmentWaypoint(i, 0, true);
      expect(mobile.x).toBeGreaterThan(0.75);
      expect(mobile.x).toBeLessThan(0.9);
      expect(mobile.y).toBeLessThan(0.3);
      const reader = fragmentWaypoint(i, 0, false, true);
      expect(reader.x).toBeLessThan(0.4);
      const world = waypointToWorld(reader, 4, 1.5, {});
      expect(world.x).toBeLessThan(0);
      expect(Number.isFinite(world.y)).toBe(true);
    }
  });
});
