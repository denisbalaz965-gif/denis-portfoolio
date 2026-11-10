import { clamp } from './flight-model.js';

// The same scroll owns both the claim and its evidence. No autoplay or scroll trap.
export function presentationAt(progress, count = 6) {
  const index = clamp(Math.floor(progress - 0.18), 0, count - 1);
  const relative = progress - index - 1;
  const first = index === 0;
  return relative >= (first ? -0.18 : -0.6) && relative <= 0.16 ? index : -1;
}

export function presentationLayout(
  index,
  width,
  height,
  { copyHeight = 160, captionHeight = 170 } = {},
) {
  const right = index % 2 === 0;
  const narrow = width < 761 && !(width >= 600 && height < 600);
  const gutter = narrow ? 24 : Math.max(40, width * 0.07);
  const panelWidth = narrow ? width - 48 : Math.min(480, width * 0.36);
  const copyTop = narrow ? Math.max(96, height * 0.12) : Math.max(88, (height - copyHeight) / 2);
  const top = narrow
    ? Math.max(280, height * 0.38, copyTop + copyHeight + 24)
    : Math.max(104, (height - captionHeight) / 2);
  return {
    right,
    left: narrow ? gutter : right ? width / 2 + gutter * 0.72 : gutter,
    top,
    width: panelWidth,
    copyLeft: narrow ? gutter : right ? gutter : width / 2 + gutter * 0.72,
    copyTop,
  };
}
