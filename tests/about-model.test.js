import { describe, expect, it } from 'vitest';
import { teamMembers, teamStory } from '../src/data/team-members.js';
import {
  fixtureMembers,
  fixtureStory,
  FIXTURE_SENTINEL,
} from '../src/data/team-members.fixture.js';
import { findProject } from '../src/data/portfolio-projects.js';
import { aboutReady, aboutStops, aboutHash, parseAboutHash } from '../src/features/about-model.js';

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
