import './styles/main.css';
import { initAnimations } from './features/animations.js';
import { initNavigation } from './features/navigation.js';
import { initContact } from './features/contact.js';
import { initProjectBrowser } from './features/project-browser.js';

const dispose = [initNavigation(), initContact(), initAnimations(), initProjectBrowser()];

if (import.meta.hot) {
  import.meta.hot.dispose(() => dispose.forEach((cleanup) => cleanup()));
}
