// Foreground geometry stays crisp; the ambient shader keeps a separate budget.
export function scenePixelRatio(width, height, deviceRatio = 1) {
  const budget = width < 761 ? 1400000 : 8500000;
  return Math.min(
    deviceRatio || 1,
    width < 761 ? 2 : 1.5,
    Math.sqrt(budget / Math.max(1, width * height)),
  );
}
export function fogDimensions(width, height) {
  const scale = Math.min(1, (width < 761 ? 640 : 960) / Math.max(width, height));
  return {
    width: Math.max(8, Math.round(width * scale)),
    height: Math.max(8, Math.round(height * scale)),
  };
}
export function introCrystalPose(width, height) {
  const narrow = width < 761,
    short = height < 600 && width >= 600;
  const x = 0.5;
  const y = 0.49;
  const span = 2 * 7 * Math.tan((24 * Math.PI) / 180);
  return {
    x: ((x - 0.5) * span * width) / Math.max(1, height),
    y: (0.5 - y) * span,
    scale: short ? 1.3 : narrow ? (height < 680 ? 1.05 : 1.4) : 2.3,
  };
}

export function finaleCrystalPose(width, height, slide) {
  const narrow = width < 761 && height >= 600;
  const span = 2 * 7 * Math.tan((24 * Math.PI) / 180);
  const x = 0.5 + ((narrow ? 0.17 : 0.245) - 0.5) * slide;
  const y = 0.49 + ((narrow ? 0.185 : 0.49) - 0.49) * slide;
  return {
    x: ((x - 0.5) * span * width) / Math.max(1, height),
    y: (0.5 - y) * span,
    scale: (height < 600 ? 1.2 : narrow ? 1.25 : 2.2) * (1 - (narrow ? 0.64 : 0.08) * slide),
  };
}
