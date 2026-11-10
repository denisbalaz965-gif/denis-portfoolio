// Pure model of the About layer ("the other side"). No DOM and no WebGL here,
// so the gate, addresses, timing and layout can be tested in isolation and
// reused by a Node script.

const filled = (value) => typeof value === 'string' && value.trim().length > 0;
const texts = (list, min) =>
  Array.isArray(list) && list.length >= min && list.every((item) => filled(item));

// The publication gate: open only when all three profiles and the shared story
// carry every required field. There is deliberately no manual switch.
export function aboutReady(members, story, hasProject = () => true) {
  if (!Array.isArray(members) || members.length !== 3) return false;
  if (!story || !filled(story.title) || !texts(story.paragraphs, 1)) return false;
  return members.every(
    (member) =>
      member &&
      filled(member.id) &&
      filled(member.letter) &&
      filled(member.name) &&
      filled(member.sentence) &&
      filled(member.portrait?.src) &&
      filled(member.portrait?.alt) &&
      texts(member.about, 1) &&
      texts(member.skills, 3) &&
      member.skills.length === 3 &&
      Array.isArray(member.works) &&
      member.works.length >= 1 &&
      member.works.every(
        (work) => work && filled(work.note) && filled(work.project) && hasProject(work.project),
      ),
  );
}

// Arrival, two steps per member, then the shared ending.
export function aboutStops(members) {
  return [
    { kind: 'arrival', member: -1 },
    ...members.flatMap((_, member) => [
      { kind: 'who', member },
      { kind: 'what', member },
    ]),
    { kind: 'together', member: -1 },
  ];
}

const ROOT = '#o-nas';
export function aboutHash(index, stops, members) {
  const stop = stops[index];
  if (!stop || stop.kind === 'arrival') return ROOT;
  if (stop.kind === 'together') return `${ROOT}/spolu`;
  return `${ROOT}/${members[stop.member].id}`;
}

// Returns the stop an address points at, or null when the address is not ours.
// Anything under #o-nas that cannot be resolved opens the arrival.
export function parseAboutHash(hash, stops, members) {
  if (hash !== ROOT && !String(hash).startsWith(`${ROOT}/`)) return null;
  let target;
  try {
    target = decodeURIComponent(hash.slice(ROOT.length + 1));
  } catch {
    return 0;
  }
  if (target === 'spolu') return stops.length - 1;
  const member = members.findIndex((entry) => entry.id === target);
  const index = stops.findIndex((stop) => stop.kind === 'who' && stop.member === member);
  return member >= 0 && index >= 0 ? index : 0;
}

// ---- Motion -----------------------------------------------------------------

export const ABOUT_TURN_SECONDS = 1.4;
export const ABOUT_SPLIT_SECONDS = 0.9;
export const ABOUT_REJOIN_SECONDS = 0.45;
export const ABOUT_FADE_SECONDS = 0.6;
// The turn is click-triggered and runs by itself, so it yields to the system
// reduced-motion setting. Scroll-driven motion on the other side stays active.
export const ABOUT_RESPECTS_REDUCED_MOTION = true;

const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
const smooth = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const ramp = (value, from, to) => smooth((value - from) / (to - from));
const mix = (a, b, t) => a * (1 - t) + b * t;

// turn, split, fade and veil run 0..1; progress and target are in stops.
export function createAboutState() {
  return {
    mode: 'front',
    turn: 0,
    split: 0,
    fade: 0,
    veil: 0,
    progress: 0,
    target: 0,
    calm: false,
    destination: null,
  };
}

// Both requests answer whether they changed anything, so callers can skip
// history and focus work for a repeated click. A turn in flight can be
// reversed from where it is in either direction.
export function requestEnter(state, { calm = false, instant = false } = {}) {
  if (state.mode !== 'front' && state.mode !== 'returning') return false;
  state.calm = calm;
  state.destination = null;
  state.fade = 0;
  state.veil = 0;
  if (instant) {
    state.mode = 'about';
    state.turn = 1;
    state.split = 1;
  } else state.mode = 'turning';
  return true;
}

export function requestLeave(state, destination = null) {
  if (state.mode !== 'about' && state.mode !== 'turning') return false;
  state.mode = 'returning';
  state.destination = destination;
  state.fade = 0;
  state.veil = 0;
  return true;
}

function crossFade(state, dt, turn) {
  state.fade = Math.min(1, state.fade + dt / ABOUT_FADE_SECONDS);
  state.veil = Math.sin(Math.PI * state.fade);
  if (state.fade >= 0.5) state.turn = turn;
  return state.fade >= 1;
}

// Advances the clocks by dt seconds. Reports the two moments the DOM cares
// about: 'arrived' on the other side and 'landed' back on the front.
export function stepAbout(state, dt) {
  if (state.mode === 'turning') {
    let done;
    if (state.calm) done = crossFade(state, dt, 1);
    else {
      state.turn = Math.min(1, state.turn + dt / ABOUT_TURN_SECONDS);
      done = state.turn >= 1;
    }
    if (!done) return null;
    state.mode = 'about';
    state.fade = 0;
    state.veil = 0;
    return 'arrived';
  }
  if (state.mode === 'about') {
    state.split = Math.min(1, state.split + dt / ABOUT_SPLIT_SECONDS);
    // Scrolling only takes over once the thirds have finished separating.
    const goal = state.split < 1 ? 0 : state.target;
    state.progress += (goal - state.progress) * (1 - Math.exp(-dt * 10));
    return null;
  }
  if (state.mode === 'returning') {
    // The thirds rejoin first, so the turn back pivots on the whole crystal.
    if (state.split > 0) {
      state.split = Math.max(0, state.split - dt / ABOUT_REJOIN_SECONDS);
      return null;
    }
    let done;
    if (state.calm) done = crossFade(state, dt, 0);
    else {
      state.turn = Math.max(0, state.turn - dt / ABOUT_TURN_SECONDS);
      done = state.turn <= 0;
    }
    if (!done) return null;
    Object.assign(state, { mode: 'front', turn: 0, split: 0, fade: 0, veil: 0 });
    state.progress = 0;
    state.target = 0;
    return 'landed';
  }
  return null;
}

export const turnEase = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Camera offset from the pivot: half an orbit at radius 7 that swells and
// lifts at its midpoint, so it reads as flying around rather than spinning.
export function orbitOffset(turn) {
  const angle = Math.PI * turnEase(turn);
  const swell = Math.sin(angle);
  const radius = 7 + 1.6 * swell;
  return { x: Math.sin(angle) * radius, y: 0.45 * swell, z: Math.cos(angle) * radius };
}

// Text follows the linear clock (front copy is gone in the first third, about
// copy waits for the end); the backdrop follows the eased camera angle.
export function turnPhases(turn) {
  const eased = turnEase(turn);
  return {
    front: 1 - ramp(turn, 0, 0.3),
    about: ramp(turn, 0.82, 1),
    space: ramp(eased, 0.2, 0.92),
    pan: 2.4 * eased,
    gather: ramp(turn, 0, 0.45),
  };
}

export const thirdApart = (split, index, join) => smooth(split * 1.3 - index * 0.15) * (1 - join);
export const stopWeight = (progress, index) => smooth(1 - Math.abs(progress - index) * 2.4);

// Screen-space poses: x, y in 0..1 from the top-left, d = distance from the
// camera, s = scale, f = material focus. Starting values from the prototype.
const pose = (x, y, d, s, f = 0) => ({ x, y, d, s, f });
export const ABOUT_LAYOUT = {
  wide: {
    row: [pose(0.3, 0.52, 8, 1.15), pose(0.5, 0.52, 8, 1.15), pose(0.7, 0.52, 8, 1.15)],
    who: {
      active: pose(0.27, 0.5, 6, 1.7, 0.6),
      away: [pose(0.06, 0.15, 17, 1.2, -1.4), pose(0.45, 0.9, 19, 1.2, -1.4)],
    },
    what: {
      active: pose(0.33, 0.52, 6.6, 1.5, 0.6),
      away: [pose(0.47, 0.09, 20, 1.2, -1.4), pose(0.2, 0.95, 18, 1.2, -1.4)],
    },
    join: pose(0.27, 0.5, 6.5, 1.75),
    facets: [pose(0.1, 0.29, 6.4, 0.2), pose(0.07, 0.54, 6.4, 0.24), pose(0.11, 0.78, 6.4, 0.2)],
    nebula: [-0.55, -0.16],
  },
  narrow: {
    row: [pose(0.2, 0.44, 10, 1), pose(0.5, 0.44, 10, 1), pose(0.8, 0.44, 10, 1)],
    who: {
      active: pose(0.5, 0.22, 7.5, 1.1, 0.6),
      away: [pose(0.1, 0.13, 18, 1.1, -1.4), pose(0.92, 0.32, 18, 1.1, -1.4)],
    },
    what: {
      active: pose(0.26, 0.22, 8, 0.95, 0.6),
      away: [pose(0.93, 0.12, 20, 1.1, -1.4), pose(0.07, 0.34, 19, 1.1, -1.4)],
    },
    join: pose(0.5, 0.22, 7.5, 1.15),
    facets: [pose(0.6, 0.15, 8, 0.17), pose(0.8, 0.22, 8, 0.2), pose(0.62, 0.3, 8, 0.17)],
    nebula: [0.02, 0.26],
  },
};

const mixPose = (a, b, t) => ({
  x: mix(a.x, b.x, t),
  y: mix(a.y, b.y, t),
  d: mix(a.d, b.d, t),
  s: mix(a.s, b.s, t),
  f: mix(a.f, b.f, t),
});

// Where the three thirds, the joined crystal and the skill facets belong at a
// (fractional) stop. The active member comes forward, the other two recede.
export function aboutLayout(progress, stops, narrow = false) {
  const preset = ABOUT_LAYOUT[narrow ? 'narrow' : 'wide'];
  const last = stops.length - 1;
  const at = clamp(progress, 0, last);
  const posesAt = (index) => {
    const stop = stops[index].kind === 'together' ? stops[index - 1] : stops[index];
    if (stop.kind === 'arrival') return preset.row;
    let away = 0;
    return [0, 1, 2].map((k) =>
      k === stop.member ? preset[stop.kind].active : preset[stop.kind].away[away++],
    );
  };
  const from = Math.min(Math.max(0, last - 1), Math.floor(at));
  const to = Math.min(last, from + 1);
  const a = posesAt(from),
    b = posesAt(to);
  let facetAmount = 0,
    facetOwner = Math.max(0, stops[Math.round(at)].member);
  stops.forEach((stop, index) => {
    if (stop.kind !== 'what') return;
    const amount = at <= index ? ramp(at, index - 0.95, index) : 1 - ramp(at, index, index + 0.6);
    if (amount > facetAmount) {
      facetAmount = amount;
      facetOwner = stop.member;
    }
  });
  return {
    thirds: a.map((start, k) => mixPose(start, b[k], at - from)),
    joinPose: preset.join,
    join: smooth(at - (last - 1)),
    facets: preset.facets,
    facetAmount,
    facetOwner,
    nebula: preset.nebula,
  };
}

// Progress in stops from the scroll position of normally flowing sections.
// Each section holds its stop and hands over during the last 45 % of a
// viewport before the next one, so a longer section simply holds for longer.
export function sectionProgress(scrollTop, tops, viewport) {
  const last = tops.length - 1;
  if (last <= 0 || scrollTop <= tops[0]) return 0;
  if (scrollTop >= tops[last]) return last;
  let index = 0;
  while (index < last - 1 && scrollTop >= tops[index + 1]) index++;
  const travel = Math.max(1, Math.min(0.45 * viewport, tops[index + 1] - tops[index]));
  return index + smooth((scrollTop - (tops[index + 1] - travel)) / travel);
}
