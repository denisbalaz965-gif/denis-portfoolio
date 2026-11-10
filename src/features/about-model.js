import { chapterProgress } from './flight-model.js';

// Pure model of the About layer ("the other side"). No DOM and no WebGL here,
// so the gate, addresses, timing and layout can be tested in isolation and
// reused by a Node script.

const filled = (value) => typeof value === 'string' && value.trim().length > 0;
const texts = (list, min) =>
  Array.isArray(list) && list.length >= min && list.every((item) => filled(item));

// A full profile is optional and comes whole: portrait, own sentence, a short
// introduction and exactly three main skills. Half a profile closes the gate,
// so nothing is published that looks like a profile but is not one.
const PROFILE_FIELDS = ['portrait', 'sentence', 'about', 'skills'];
export const hasProfile = (member) => PROFILE_FIELDS.every((field) => member?.[field] != null);
const profileValid = (member) =>
  filled(member.sentence) &&
  filled(member.portrait?.src) &&
  filled(member.portrait?.alt) &&
  texts(member.about, 1) &&
  texts(member.skills, 3) &&
  member.skills.length === 3;

// The publication gate: three members with their documented works and the
// shared story. There is deliberately no manual switch.
export function aboutReady(members, story, hasProject = () => true) {
  if (!Array.isArray(members) || members.length !== 3) return false;
  if (!story || !filled(story.title) || !texts(story.paragraphs, 1)) return false;
  // Ids become addresses (#o-nas/<id>), so they must be unique and URL-safe.
  const ids = members.map((member) => member?.id);
  if (new Set(ids).size !== ids.length) return false;
  return members.every((member) => {
    if (!member) return false;
    const someProfile = PROFILE_FIELDS.some((field) => member[field] != null);
    return (
      filled(member.id) &&
      /^[a-z0-9-]+$/.test(member.id) &&
      member.id !== 'spolu' &&
      filled(member.letter) &&
      filled(member.name) &&
      (!someProfile || (hasProfile(member) && profileValid(member))) &&
      Array.isArray(member.works) &&
      member.works.length >= 1 &&
      member.works.every(
        (work) => work && filled(work.note) && filled(work.project) && hasProject(work.project),
      )
    );
  });
}

// Arrival, then per member "who" (only with a full profile) and "what", then
// the shared ending. Skill facets belong to members who have skills.
export function aboutStops(members) {
  return [
    { kind: 'arrival', member: -1 },
    ...members.flatMap((entry, member) =>
      hasProfile(entry)
        ? [
            { kind: 'who', member },
            { kind: 'what', member, facets: true },
          ]
        : [{ kind: 'what', member, facets: false }],
    ),
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
  // A member's address opens their first stop: "who" or, without a profile, "what".
  const member = members.findIndex((entry) => entry.id === target);
  const index = member < 0 ? -1 : stops.findIndex((stop) => stop.member === member);
  return index >= 0 ? index : 0;
}

// ---- Motion -----------------------------------------------------------------
// About lives above the opening crystal on the same scroll: going up turns the
// space, splits the crystal and walks the stops; going back down undoes it.
// All spans are in viewport heights of upward scroll.

export const ABOUT_TURN_SPAN = 1;
export const ABOUT_SPLIT_SPAN = 0.4;
export const ABOUT_STOP_SPAN = 0.9;
export const ABOUT_TAIL_SPAN = 0.5;
// A stop is at rest a little into its hold, so a small nudge either way keeps it.
const REST = 0.15;

const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
const smooth = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const ramp = (value, from, to) => smooth((value - from) / (to - from));
const mix = (a, b, t) => a * (1 - t) + b * t;

// The narrow composition (third on top, text below). A low landscape phone is
// wide enough for the side-by-side one, exactly as in the opening pose.
export const aboutNarrow = (width, height) => width < 761 && !(height <= 560 && width >= 600);

// A 0..1 share that lands exactly on its ends despite float division.
const whole = (value) => {
  const share = clamp(value);
  return share > 1 - 1e-9 ? 1 : share < 1e-9 ? 0 : share;
};

// Height of the About part of the track, in viewports.
export const aboutSpan = (stopCount) =>
  ABOUT_TURN_SPAN + ABOUT_SPLIT_SPAN + (stopCount - 1) * ABOUT_STOP_SPAN + ABOUT_TAIL_SPAN;

// Upward distance at which a stop is at rest.
export const aboutUpFor = (stop) =>
  ABOUT_TURN_SPAN + ABOUT_SPLIT_SPAN + (stop + REST) * ABOUT_STOP_SPAN;

// Where the turn, the split and the stops are for a distance scrolled above
// the start. Stops hold, then travel, like the chapters of an article.
export function aboutAt(up, stopCount) {
  const rest = Math.max(0, up - ABOUT_TURN_SPAN - ABOUT_SPLIT_SPAN);
  return {
    turn: whole(up / ABOUT_TURN_SPAN),
    split: whole((up - ABOUT_TURN_SPAN) / ABOUT_SPLIT_SPAN),
    // chapterProgress works in pixels; a notional 1000 px viewport keeps its floor of 1 away.
    progress: chapterProgress(rest * 1000, ABOUT_STOP_SPAN * 1000, stopCount),
  };
}

export function createAboutState() {
  return { up: 0, targetUp: 0, turn: 0, split: 0, progress: 0 };
}

// Eases the drawn position toward the scroll target, like the flight does.
export function stepAbout(state, dt, stopCount) {
  const gap = state.targetUp - state.up;
  state.up = Math.abs(gap) < 0.0005 ? state.targetUp : state.up + gap * (1 - Math.exp(-dt * 12));
  Object.assign(state, aboutAt(state.up, stopCount));
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
    if (stop.kind !== 'what' || !stop.facets) return;
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
