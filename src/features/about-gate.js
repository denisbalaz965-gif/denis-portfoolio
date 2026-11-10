import { findProject } from '../data/portfolio-projects.js';
import { aboutReady } from './about-model.js';

// The one definition of "the About layer may be shown": complete content whose
// works all point at real projects. The page, the app entry and the bundle
// check use this same predicate.
export const hasProject = (id) => Boolean(findProject(id));
export const aboutContentReady = (members, story) => aboutReady(members, story, hasProject);
