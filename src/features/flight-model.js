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
