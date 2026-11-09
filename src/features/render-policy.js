// Keep costly shader pixels bounded independently from sharp HTML text.
export function scenePixelRatio(width, height, deviceRatio = 1) {
  const budget = width < 761 ? 550000 : 1000000;
  return Math.min(
    deviceRatio || 1,
    width < 761 ? 1 : 0.9,
    Math.sqrt(budget / Math.max(1, width * height)),
  );
}
export function fogDimensions(width, height) {
  const scale = Math.min(1, 448 / Math.max(width, height));
  return {
    width: Math.max(8, Math.round(width * scale)),
    height: Math.max(8, Math.round(height * scale)),
  };
}
export function introCrystalPose(width, height) {
  const narrow = width < 761,
    short = height < 600 && width >= 600;
  const x = short ? 0.29 : narrow ? 0.55 : 0.32;
  const y = short ? 0.65 : narrow ? (height < 680 ? 0.39 : 0.435) : 0.59;
  const span = 2 * 7 * Math.tan((24 * Math.PI) / 180);
  return {
    x: ((x - 0.5) * span * width) / Math.max(1, height),
    y: (0.5 - y) * span,
    scale: short ? 1.1 : narrow ? (height < 680 ? 0.8 : 1.05) : 2.05,
  };
}
