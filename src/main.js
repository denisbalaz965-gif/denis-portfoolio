import './styles/main.css';
import { initAnimations } from './features/animations.js';
import { initNavigation } from './features/navigation.js';
import { initContact } from './features/contact.js';
import { initProjectBrowser } from './features/project-browser.js';
import { initSignal } from './features/signal.js';
import { initHolograms } from './features/holograms.js';
import { initCursor } from './features/cursor.js';

const dispose = [
  initNavigation(),
  initContact(),
  initAnimations(),
  initSignal(),
  initProjectBrowser(),
  initHolograms(),
  initCursor(),
];

if (import.meta.hot) {
  import.meta.hot.dispose(() => dispose.forEach((cleanup) => cleanup()));
}
