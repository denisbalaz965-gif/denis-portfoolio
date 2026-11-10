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
