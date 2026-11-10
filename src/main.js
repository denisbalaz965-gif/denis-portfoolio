import './styles/main.css';
import { initAnimations } from './features/animations.js';
import { initNavigation } from './features/navigation.js';
import { initContact } from './features/contact.js';
import { initProjectBrowser } from './features/project-browser.js';
import { initSignal } from './features/signal.js';
import { initHolograms } from './features/holograms.js';
import { initCursor } from './features/cursor.js';
import { initAbout } from './features/about.js';
import { aboutContentReady } from './features/about-gate.js';
import { teamMembers, teamStory } from './data/team-members.js';

// Placeholder profiles exist for the dev server only. The branch is removed
// from production builds, so the fixture never reaches the shipped bundle.
let aboutContent = {};
if (import.meta.env.DEV && !aboutContentReady(teamMembers, teamStory)) {
  const fixture = await import('./data/team-members.fixture.js');
  aboutContent = { members: fixture.fixtureMembers, story: fixture.fixtureStory };
}
// About registers its click handling first, so it can claim links before the flight.
const about = initAbout(aboutContent);

const dispose = [
  about.dispose,
  initNavigation(),
  initContact(),
  initAnimations(),
  initSignal({ about: about.scene }),
  initProjectBrowser(),
  initHolograms(),
  initCursor(),
];

if (import.meta.hot) {
  import.meta.hot.dispose(() => dispose.forEach((cleanup) => cleanup()));
}
