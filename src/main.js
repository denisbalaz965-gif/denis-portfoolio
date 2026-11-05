import './styles/main.css';
import { initAnimations } from './features/animations.js';
import { initNavigation } from './features/navigation.js';
import { initContact } from './features/contact.js';
import { initScrollStories } from './features/scroll-stories.js';

const dispose = [initNavigation(), initContact(), initAnimations(), initScrollStories()];

if (import.meta.hot) {
  import.meta.hot.dispose(() => dispose.forEach((cleanup) => cleanup()));
}
