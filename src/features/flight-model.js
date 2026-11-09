export const FLIGHT_STOPS = 6;
export const FLIGHT_END = 7.25;
export const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
export function flightAt(scrollY, start, distance) {
  return clamp((scrollY - start) / Math.max(1, distance), 0, 1) * FLIGHT_END;
}
export function scrollForStop(index, start, distance) {
  return start + ((clamp(index, 0, FLIGHT_STOPS - 1) + 1) / FLIGHT_END) * distance;
}
export function activeStop(progress) {
  return clamp(Math.round(progress - 1), 0, FLIGHT_STOPS - 1);
}
export function hologramPosition(x, y, width, height) {
  const panelWidth = Math.min(320, width - 40);
  return {
    left: clamp(x + 75, 20, width - panelWidth - 20),
    top: clamp(y - 95, 96, height - 275),
    width: panelWidth,
  };
}

export function introFracture(progress) {
  const t = clamp((progress - 0.08) / 0.72, 0, 1);
  return t * t * (3 - 2 * t);
}
export function chapterProgress(scrollTop, unit, count) {
  const raw = clamp(scrollTop / Math.max(1, unit), 0, Math.max(0, count - 1));
  const index = Math.floor(raw),
    phase = raw - index;
  const travel = clamp((phase - 0.5) / 0.45, 0, 1);
  return index + travel * travel * (3 - 2 * travel);
}
