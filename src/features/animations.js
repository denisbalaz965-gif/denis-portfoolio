import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { artwork } from './project-browser.js';
import { findProject } from '../data/portfolio-projects.js';
gsap.registerPlugin(ScrollTrigger);
export function refreshAnimations() {
  ScrollTrigger.refresh();
}
export function initAnimations() {
  document.querySelectorAll('[data-preview]').forEach((node) => {
    node.replaceChildren(artwork(findProject(node.dataset.preview), document));
  });
  const controller = new AbortController();
  let disposed = false;
  const context = gsap.context(() => {
    gsap.from('.intro-copy', {
      opacity: 0,
      y: 25,
      duration: 1.2,
      ease: 'power3.out',
      clearProps: 'all',
    });
    document.querySelectorAll('.project-stop').forEach((node) => {
      const fragment = node.querySelector('.project-fragment');
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: node, start: 'top 95%', end: 'bottom 5%', scrub: 0.45 },
      });
      timeline
        .fromTo(
          fragment,
          {
            opacity: 0,
            scale: 0.55,
            y: 80,
            rotationY: node.classList.contains('stop-right') ? -12 : 12,
          },
          { opacity: 1, scale: 1, y: 0, rotationY: 0, duration: 0.3, ease: 'power2.out' },
        )
        .to(fragment, { opacity: 1, scale: 1, duration: 0.45 })
        .to(fragment, { opacity: 0, scale: 1.12, y: -60, duration: 0.25, ease: 'power2.in' });
      node.addEventListener(
        'focusin',
        (event) => {
          // Keyboard navigation brings the focused project into its stable reading interval.
          if (event.target.matches(':focus-visible') && !document.querySelector('dialog[open]'))
            node.scrollIntoView({ behavior: 'instant', block: 'center' });
        },
        { signal: controller.signal },
      );
    });
  });
  document.fonts?.ready.then(() => {
    if (!disposed) refreshAnimations();
  });
  window.addEventListener('load', refreshAnimations, { once: true, signal: controller.signal });
  return () => {
    disposed = true;
    controller.abort();
    context.revert();
  };
}
