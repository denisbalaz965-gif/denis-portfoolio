import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function refreshAnimations() {
  ScrollTrigger.refresh();
}
export function initAnimations() {
  const context = gsap.context(() => {
    gsap.from('.flight-intro', {
      opacity: 0,
      y: 18,
      duration: 1,
      ease: 'power3.out',
      clearProps: 'all',
    });
  });
  return () => context.revert();
}
