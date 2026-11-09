import { clamp } from './flight-model.js';

// The same scroll owns both the claim and its evidence. No autoplay or scroll trap.
export function presentationAt(progress, count = 6) {
  const index = clamp(Math.floor(progress - 0.18), 0, count - 1);
  const relative = progress - index - 1;
  const first = index === 0;
  return relative >= (first ? -0.18 : -0.6) && relative <= 0.16 ? index : -1;
}

export function presentationLayout(index, width, height) {
  const right = index % 2 === 0;
  const narrow = width < 761 && !(width >= 600 && height < 600);
  const gutter = narrow ? 24 : Math.max(40, width * 0.07);
  const panelWidth = narrow ? width - 48 : Math.min(460, width * 0.36);
  return {
    right,
    left: narrow ? gutter : right ? width / 2 + gutter * 0.72 : gutter,
    top: narrow ? Math.max(300, height * 0.39) : Math.max(112, height * 0.29),
    width: panelWidth,
    copyLeft: narrow ? gutter : right ? gutter : width / 2 + gutter * 0.72,
    copyTop: narrow ? Math.max(108, height * 0.145) : Math.max(135, height * 0.34),
  };
}
