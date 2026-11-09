// Screen-space waypoints become real 3D positions at each fragment's depth.
// Incoming arcs are long; a calm stop precedes a short flyby out of the frame.
const routes = [
  {
    enter: [0.04, 0.1],
    bend: [0.07, 0.72],
    hold: [0.36, 0.53],
    leaveBend: [0.78, 0.17],
    exit: [1.45, -0.4],
    turn: 0.65,
  },
  {
    enter: [0.96, 0.9],
    bend: [0.92, 0.2],
    hold: [0.63, 0.47],
    leaveBend: [0.25, 0.8],
    exit: [-0.45, 1.4],
    turn: -0.55,
  },
  {
    enter: [0.95, 0.08],
    bend: [0.3, 0.08],
    hold: [0.39, 0.48],
    leaveBend: [0.82, 0.68],
    exit: [1.4, 1.4],
    turn: -0.7,
  },
  {
    enter: [0.06, 0.9],
    bend: [0.73, 0.88],
    hold: [0.64, 0.55],
    leaveBend: [0.19, 0.25],
    exit: [-0.4, -0.4],
    turn: 0.6,
  },
  {
    enter: [0.02, 0.5],
    bend: [0.2, 0.13],
    hold: [0.38, 0.46],
    leaveBend: [0.65, 0.8],
    exit: [1.45, 1.2],
    turn: 0.5,
  },
  {
    enter: [0.98, 0.43],
    bend: [0.8, 0.9],
    hold: [0.61, 0.51],
    leaveBend: [0.3, 0.12],
    exit: [-0.45, -0.25],
    turn: -0.6,
  },
];
const smooth = (value) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};
const bezier = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;

export function fragmentWaypoint(index, relative, narrow = false, reader = false, out = {}) {
  const route = routes[index % routes.length];
  const holdX = reader
    ? narrow
      ? 0.52
      : 0.29 + ((index % 3) - 1) * 0.02
    : narrow
      ? 0.88
      : index % 2 === 0
        ? 0.73
        : 0.27;
  const holdY = reader ? (narrow ? 0.22 : 0.48 + (index % 2 ? 0.025 : -0.025)) : 0.22;
  const arrival = smooth((relative + 1.25) / (reader ? 1.1 : 0.65));
  const departure = smooth((relative - 0.08) / 0.26);
  if (relative <= 0.08) {
    out.x = bezier(route.enter[0], route.bend[0], holdX, arrival);
    out.y = bezier(route.enter[1], route.bend[1], holdY, arrival);
  } else {
    out.x = bezier(holdX, route.leaveBend[0], route.exit[0], departure);
    out.y = bezier(holdY, route.leaveBend[1], route.exit[1], departure);
  }
  out.roll = route.turn * (1 - arrival - departure);
  return out;
}

export function waypointToWorld(point, depth, aspect, out) {
  // Farther objects retain perspective; they do not stick to screen corners.
  const span = 2 * Math.max(1.3, Math.min(14, depth)) * Math.tan((24 * Math.PI) / 180);
  out.x = (point.x - 0.5) * span * aspect;
  out.y = (0.5 - point.y) * span;
  return out;
}
