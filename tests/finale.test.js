import { describe, it, expect } from 'vitest';
import {
  finaleAt,
  FLIGHT_END,
  CONTACT_STOP,
  flightAt,
  scrollForContact,
} from '../src/features/flight-model.js';
import { finaleCrystalPose } from '../src/features/render-policy.js';
describe('Reversible ending', () => {
  it('finishes assembling before moving aside and reveals the form last', () => {
    expect(finaleAt(6.1)).toEqual({
      gather: 0,
      slide: 0,
      reveal: 0,
      hud: 1,
      contact: 0,
      footer: 0,
    });
    expect(finaleAt(7.24).gather).toBe(1);
    expect(finaleAt(7.24).slide).toBe(0);
    expect(finaleAt(7.6).slide).toBeGreaterThan(0);
    expect(finaleAt(7.6).reveal).toBe(0);
    expect(finaleAt(FLIGHT_END)).toEqual({
      gather: 1,
      slide: 1,
      reveal: 1,
      hud: 0,
      contact: 0,
      footer: 1,
    });
    expect(finaleAt(CONTACT_STOP).contact).toBe(1);
    expect(finaleAt(CONTACT_STOP).footer).toBe(0);
    expect(flightAt(scrollForContact(120, 4000), 120, 4000)).toBeCloseTo(CONTACT_STOP);
    const forward = [6.32, 6.8, 7.3, 7.8, 8.2].map(finaleAt);
    expect([8.2, 7.8, 7.3, 6.8, 6.32].map(finaleAt)).toEqual(forward.reverse());
  });
  it.each([
    [1440, 900],
    [390, 844],
    [320, 740],
    [844, 390],
  ])('keeps the assembled crystal in its own text-safe region at %sx%s', (w, h) => {
    const pose = finaleCrystalPose(w, h, 1),
      span = 2 * 7 * Math.tan((24 * Math.PI) / 180);
    const x = 0.5 + ((pose.x / span) * h) / w,
      y = 0.5 - pose.y / span;
    expect(x).toBeGreaterThan(0.1);
    expect(x).toBeLessThan(0.3);
    expect(y).toBeGreaterThan(0.1);
    expect(y).toBeLessThan(0.55);
    expect(finaleCrystalPose(w, h, 0).x).toBe(0);
  });
});
