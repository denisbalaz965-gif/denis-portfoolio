import { describe, it, expect } from 'vitest';
import { scenePixelRatio, fogDimensions } from '../src/features/render-policy.js';

describe('Bounded GPU work', () => {
  it('keeps actual scene pixel work within budget even on large high-DPI screens', () => {
    for (const [width, height, dpr] of [
      [1944, 953, 2],
      [3840, 2160, 2],
      [1200, 800, 1],
      [390, 844, 3],
      [320, 740, 2],
    ]) {
      const ratio = scenePixelRatio(width, height, dpr);
      expect(ratio).toBeGreaterThan(0);
      expect(ratio).toBeLessThanOrEqual(dpr);
      expect(width * height * ratio * ratio).toBeLessThanOrEqual(width < 761 ? 1400001 : 8500001);
    }
  });
  it('bounds the expensive background separately without stretching its aspect ratio', () => {
    for (const [width, height] of [
      [1944, 953],
      [3840, 2160],
      [390, 844],
      [740, 360],
    ]) {
      const field = fogDimensions(width, height);
      expect(Math.max(field.width, field.height)).toBeLessThanOrEqual(width < 761 ? 640 : 960);
      expect(Math.abs(field.width / field.height - width / height)).toBeLessThan(0.015);
    }
  });
  it('does not enlarge a sub-native foreground on the owner desktop or a 4K display', () => {
    for (const [width, height] of [
      [1944, 984],
      [3840, 2160],
    ]) {
      expect(scenePixelRatio(width, height, 2)).toBeGreaterThanOrEqual(1);
      expect(fogDimensions(width, height).width).toBe(960);
    }
    expect(scenePixelRatio(390, 844, 3)).toBeGreaterThan(1.5);
  });
});
