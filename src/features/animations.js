import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function refreshAnimations() {
  ScrollTrigger.refresh();
}
export function initAnimations() {
  const context = gsap.context(() => {
    gsap.from('.intro-identity,.intro-work', {
      opacity: 0,
      y: 18,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      clearProps: 'all',
    });
  });
  return () => context.revert();
}
