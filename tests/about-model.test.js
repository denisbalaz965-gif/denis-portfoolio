import { describe, expect, it } from 'vitest';
import { teamMembers, teamStory } from '../src/data/team-members.js';
import {
  fixtureMembers,
  fixtureStory,
  FIXTURE_SENTINEL,
} from '../src/data/team-members.fixture.js';
import { findProject } from '../src/data/portfolio-projects.js';
import {
  aboutReady,
  aboutStops,
  aboutHash,
  parseAboutHash,
  createAboutState,
  stepAbout,
  aboutSpan,
  aboutAt,
  aboutUpFor,
  aboutNarrow,
  orbitOffset,
  turnPhases,
  thirdApart,
  stopWeight,
  ABOUT_LAYOUT,
  aboutLayout,
} from '../src/features/about-model.js';

const has = (id) => Boolean(findProject(id));

describe('About content gate', () => {
  it('ships closed: production data is empty', () => {
    expect(teamMembers).toEqual([]);
    expect(teamStory).toBeNull();
    expect(aboutReady(teamMembers, teamStory, has)).toBe(false);
  });
  it('opens only for three complete members and a story', () => {
    expect(aboutReady(fixtureMembers, fixtureStory, has)).toBe(true);
    expect(aboutReady(fixtureMembers.slice(0, 2), fixtureStory, has)).toBe(false);
    expect(aboutReady(fixtureMembers, null, has)).toBe(false);
    for (const field of ['name', 'sentence', 'portrait', 'about', 'skills', 'works']) {
      const broken = structuredClone(fixtureMembers);
      delete broken[1][field];
      expect(aboutReady(broken, fixtureStory, has)).toBe(false);
    }
    const four = structuredClone(fixtureMembers);
    four[0].skills.push('štvrtá');
    expect(aboutReady(four, fixtureStory, has)).toBe(false);
    const unknown = structuredClone(fixtureMembers);
    unknown[2].works[0].project = 'neexistuje';
    expect(aboutReady(unknown, fixtureStory, has)).toBe(false);
  });
  it('keeps the fixture truthful and marked', () => {
    expect(fixtureMembers.map((m) => m.letter)).toEqual(['d', 'm', 'm']);
    expect(fixtureStory.title).toContain(FIXTURE_SENTINEL);
    const works = (i) => fixtureMembers[i].works.map((w) => w.project);
    expect(works(0)).toEqual(['stylovy-chlpac', 'zakazko', 'eurofondova-agenda']);
    expect(works(1)).toEqual(['attilapark', 'previa', 'phlaboratories', 'newera', 'tatrascool']);
    expect(works(2)).toEqual(['attilapark']);
    expect(fixtureMembers[0].works[2].note).toMatch(/CASSIS Consult/);
  });
});

describe('About stops and addresses', () => {
  const stops = aboutStops(fixtureMembers);
  it('has arrival, two steps per member and the shared ending', () => {
    expect(stops.map((s) => s.kind)).toEqual([
      'arrival',
      'who',
      'what',
      'who',
      'what',
      'who',
      'what',
      'together',
    ]);
    expect(stops.map((s) => s.member)).toEqual([-1, 0, 0, 1, 1, 2, 2, -1]);
  });
  it('maps stops to addresses and back', () => {
    const id = fixtureMembers[1].id;
    expect(aboutHash(0, stops, fixtureMembers)).toBe('#o-nas');
    expect(aboutHash(3, stops, fixtureMembers)).toBe(`#o-nas/${id}`);
    expect(aboutHash(4, stops, fixtureMembers)).toBe(`#o-nas/${id}`);
    expect(aboutHash(7, stops, fixtureMembers)).toBe('#o-nas/spolu');
    expect(parseAboutHash(`#o-nas/${id}`, stops, fixtureMembers)).toBe(3);
    expect(parseAboutHash('#o-nas/spolu', stops, fixtureMembers)).toBe(7);
    expect(parseAboutHash('#o-nas', stops, fixtureMembers)).toBe(0);
  });
  it('treats unknown and malformed about addresses as arrival, others as not ours', () => {
    expect(parseAboutHash('#o-nas/nikto', stops, fixtureMembers)).toBe(0);
    expect(parseAboutHash('#o-nas/%E0%A4%A', stops, fixtureMembers)).toBe(0);
    expect(parseAboutHash('#o-mne', stops, fixtureMembers)).toBeNull();
    expect(parseAboutHash('#kontakt', stops, fixtureMembers)).toBeNull();
    expect(parseAboutHash('', stops, fixtureMembers)).toBeNull();
  });
});

describe('About turn and layout', () => {
  it('orbits half a circle at radius 7 with a swell and lift at the midpoint', () => {
    expect(orbitOffset(0)).toEqual({ x: 0, y: 0, z: 7 });
    const end = orbitOffset(1);
    expect(end.x).toBeCloseTo(0);
    expect(end.z).toBeCloseTo(-7);
    const mid = orbitOffset(0.5);
    expect(mid.x).toBeCloseTo(8.6);
    expect(mid.y).toBeCloseTo(0.45);
    expect(mid.z).toBeCloseTo(0);
  });
  it('hides front text in the first third and shows about text only at the end', () => {
    expect(turnPhases(0)).toEqual({ front: 1, about: 0, space: 0, pan: 0, gather: 0 });
    expect(turnPhases(0.3).front).toBe(0);
    expect(turnPhases(0.45).gather).toBe(1);
    expect(turnPhases(0.8).about).toBe(0);
    expect(turnPhases(1)).toEqual({ front: 0, about: 1, space: 1, pan: 2.4, gather: 1 });
  });
  it('lays the thirds out per stop and brings each member forward in turn', () => {
    const stops = aboutStops(fixtureMembers);
    const { wide } = ABOUT_LAYOUT;
    expect(aboutLayout(0, stops, false).thirds).toEqual(wide.row);
    const who1 = aboutLayout(3, stops, false);
    expect(who1.thirds[1]).toEqual(wide.who.active);
    expect(who1.thirds[1].f).toBe(0.6);
    expect(who1.thirds[0].f).toBe(-1.4);
    expect(who1.join).toBe(0);
    const what0 = aboutLayout(2, stops, false);
    expect(what0.facetAmount).toBe(1);
    expect(what0.facetOwner).toBe(0);
    expect(aboutLayout(1, stops, false).facetAmount).toBe(0);
    expect(aboutLayout(7, stops, false).join).toBe(1);
    const half = aboutLayout(0.5, stops, false).thirds[0];
    expect(half.x).toBeCloseTo((wide.row[0].x + wide.who.active.x) / 2);
    expect(aboutLayout(1, stops, true).thirds[0]).toEqual(ABOUT_LAYOUT.narrow.who.active);
  });
  it('keeps thirds together while joined and staggers the split', () => {
    expect(thirdApart(0, 0, 0)).toBe(0);
    expect(thirdApart(1, 2, 0)).toBe(1);
    expect(thirdApart(1, 0, 1)).toBe(0);
    expect(thirdApart(0.4, 0, 0)).toBeGreaterThan(thirdApart(0.4, 2, 0));
  });
  it('weights a stop fully at rest and not at all one stop away', () => {
    expect(stopWeight(2, 2)).toBe(1);
    expect(stopWeight(2.5, 2)).toBe(0);
    expect(stopWeight(3, 2)).toBe(0);
  });
});

describe('About on the scroll', () => {
  it('spends one viewport on the turn, then splits, then holds each stop', () => {
    expect(aboutSpan(8)).toBeCloseTo(8.2);
    expect(aboutAt(0, 8)).toEqual({ turn: 0, split: 0, progress: 0 });
    expect(aboutAt(-3, 8)).toEqual({ turn: 0, split: 0, progress: 0 });
    expect(aboutAt(0.5, 8)).toEqual({ turn: 0.5, split: 0, progress: 0 });
    expect(aboutAt(1, 8)).toEqual({ turn: 1, split: 0, progress: 0 });
    expect(aboutAt(1.2, 8).split).toBeCloseTo(0.5);
    expect(aboutAt(1.4, 8)).toEqual({ turn: 1, split: 1, progress: 0 });
  });
  it('rests exactly on every stop and holds it before travelling on', () => {
    for (let stop = 0; stop < 8; stop++) {
      expect(aboutAt(aboutUpFor(stop), 8).progress).toBe(stop);
      expect(aboutAt(aboutUpFor(stop) + 0.2, 8).progress).toBe(stop);
    }
    const between = aboutAt(aboutUpFor(3) + 0.6, 8).progress;
    expect(between).toBeGreaterThan(3);
    expect(between).toBeLessThan(4);
  });
  it('never runs backwards and ends on the last stop at the top of the page', () => {
    let last = -1;
    for (let up = 0; up <= 9; up += 0.05) {
      const now = aboutAt(up, 8).progress;
      expect(now).toBeGreaterThanOrEqual(last);
      last = now;
    }
    expect(aboutAt(aboutSpan(8), 8).progress).toBe(7);
    expect(aboutAt(99, 8)).toEqual({ turn: 1, split: 1, progress: 7 });
  });
  it('follows the scroll target smoothly and settles exactly', () => {
    const state = createAboutState();
    expect(state).toEqual({ up: 0, targetUp: 0, turn: 0, split: 0, progress: 0 });
    state.targetUp = 2;
    stepAbout(state, 0.05, 8);
    expect(state.up).toBeGreaterThan(0);
    expect(state.up).toBeLessThan(2);
    expect(state.turn).toBeCloseTo(state.up);
    for (let i = 0; i < 80; i++) stepAbout(state, 0.05, 8);
    expect(state).toMatchObject({ up: 2, turn: 1, split: 1 });
    state.targetUp = 0;
    for (let i = 0; i < 80; i++) stepAbout(state, 0.05, 8);
    expect(state).toEqual({ up: 0, targetUp: 0, turn: 0, split: 0, progress: 0 });
  });
  it('uses one rule for the narrow composition in the scene and the styles', () => {
    expect(aboutNarrow(375, 812)).toBe(true);
    expect(aboutNarrow(760, 700)).toBe(true);
    expect(aboutNarrow(500, 400)).toBe(true);
    expect(aboutNarrow(1440, 900)).toBe(false);
    expect(aboutNarrow(844, 390)).toBe(false);
    expect(aboutNarrow(740, 360)).toBe(false);
    expect(aboutNarrow(667, 375)).toBe(false);
  });
});

describe('About ids', () => {
  it('rejects duplicate, reserved and address-unsafe member ids', () => {
    const has = (id) => Boolean(findProject(id));
    for (const id of ['denis', 'spolu', 'Mi roš', '']) {
      const broken = structuredClone(fixtureMembers);
      broken[2].id = id;
      expect(aboutReady(broken, fixtureStory, has)).toBe(false);
    }
  });
});
