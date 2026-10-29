import './styles/main.css';
import { initAnimations, refreshAnimations, animateWorkflowStep } from './features/animations.js';
import { initNavigation } from './features/navigation.js';
import { initProjectDialog } from './features/project-dialog.js';
import { initProjectFilter } from './features/project-filter.js';
import { initWorkflowDemo } from './features/workflow-demo.js';
import { initContact } from './features/contact.js';

const dispose = [
  initNavigation(),
  initProjectDialog(),
  initProjectFilter({ onChange: refreshAnimations }),
  initWorkflowDemo({ onStepChange: animateWorkflowStep }),
  initContact(),
  initAnimations(),
];

// Remove listeners and animation contexts before Vite replaces this module.
if (import.meta.hot) {
  import.meta.hot.dispose(() => dispose.forEach((cleanup) => cleanup()));
}
