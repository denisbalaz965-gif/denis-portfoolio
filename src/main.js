import './styles/main.css';
import { initAnimations } from './features/animations.js';
import { initNavigation } from './features/navigation.js';
import { initContact } from './features/contact.js';
import { initProjectBrowser } from './features/project-browser.js';
import { initSignal } from './features/signal.js';

const dispose = [
  initNavigation(),
  initContact(),
  initAnimations(),
  initProjectBrowser(),
  initSignal(),
];

if (import.meta.hot) {
  import.meta.hot.dispose(() => dispose.forEach((cleanup) => cleanup()));
}
