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
  requestEnter,
  requestLeave,
  stepAbout,
  orbitOffset,
  turnPhases,
  thirdApart,
  stopWeight,
  ABOUT_LAYOUT,
  aboutLayout,
  sectionProgress,
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

describe('About state machine', () => {
  const run = (state, seconds, dt = 0.05) => {
    const events = [];
    for (let t = 0; t < seconds; t += dt) {
      const e = stepAbout(state, dt);
      if (e) events.push(e);
    }
    return events;
  };
  it('turns for 1.4 s, arrives once, then splits for 0.9 s', () => {
    const s = createAboutState();
    expect(requestEnter(s)).toBe(true);
    expect(s.mode).toBe('turning');
    expect(run(s, 1.3)).toEqual([]);
    expect(run(s, 0.2)).toEqual(['arrived']);
    expect(s.mode).toBe('about');
    expect(s.turn).toBe(1);
    expect(s.split).toBeLessThan(1);
    run(s, 1);
    expect(s.split).toBe(1);
  });
  it('holds the first stop until the split has finished', () => {
    const s = createAboutState();
    requestEnter(s);
    run(s, 1.5);
    s.target = 3;
    stepAbout(s, 0.05);
    expect(s.progress).toBe(0);
    run(s, 2);
    expect(s.progress).toBeCloseTo(3, 2);
  });
  it('rejoins before turning back and reports the landing once', () => {
    const s = createAboutState();
    requestEnter(s);
    run(s, 3);
    expect(requestLeave(s, '#kontakt')).toBe(true);
    expect(s.destination).toBe('#kontakt');
    stepAbout(s, 0.05);
    expect(s.turn).toBe(1);
    expect(run(s, 0.45 + 1.4 + 0.1)).toEqual(['landed']);
    expect(s).toMatchObject({ mode: 'front', turn: 0, split: 0, progress: 0, target: 0 });
  });
  it('ignores repeated requests and reverses a turn in flight', () => {
    const s = createAboutState();
    requestEnter(s);
    expect(requestEnter(s)).toBe(false);
    run(s, 0.7);
    const mid = s.turn;
    expect(mid).toBeGreaterThan(0.3);
    expect(requestLeave(s)).toBe(true);
    expect(requestLeave(s)).toBe(false);
    stepAbout(s, 0.05);
    expect(s.turn).toBeLessThan(mid);
    expect(run(s, 1)).toEqual(['landed']);
    expect(requestLeave(s)).toBe(false);
  });
  it('re-enters from a returning turn without snapping', () => {
    const s = createAboutState();
    requestEnter(s);
    run(s, 3);
    requestLeave(s);
    run(s, 0.45 + 0.5);
    const mid = s.turn;
    expect(requestEnter(s)).toBe(true);
    stepAbout(s, 0.05);
    expect(s.turn).toBeGreaterThan(mid);
  });
  it('cross-fades instead of turning when calm', () => {
    const s = createAboutState();
    requestEnter(s, { calm: true });
    run(s, 0.2);
    expect(s.turn).toBe(0);
    expect(s.veil).toBeGreaterThan(0.5);
    expect(run(s, 0.5)).toEqual(['arrived']);
    expect(s.turn).toBe(1);
    expect(s.veil).toBe(0);
  });
  it('opens instantly for a direct address', () => {
    const s = createAboutState();
    requestEnter(s, { instant: true });
    expect(s).toMatchObject({ mode: 'about', turn: 1, split: 1 });
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
  it('derives progress from section positions so long sections hold longer', () => {
    const tops = [0, 800, 2400, 3200];
    expect(sectionProgress(0, tops, 800)).toBe(0);
    expect(sectionProgress(400, tops, 800)).toBe(0);
    expect(sectionProgress(620, tops, 800)).toBeCloseTo(0.5);
    expect(sectionProgress(800, tops, 800)).toBe(1);
    expect(sectionProgress(2000, tops, 800)).toBe(1);
    expect(sectionProgress(2400, tops, 800)).toBe(2);
    expect(sectionProgress(9999, tops, 800)).toBe(3);
    expect(sectionProgress(-50, tops, 800)).toBe(0);
  });
  it('weights a stop fully at rest and not at all one stop away', () => {
    expect(stopWeight(2, 2)).toBe(1);
    expect(stopWeight(2.5, 2)).toBe(0);
    expect(stopWeight(3, 2)).toBe(0);
  });
});
