import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function refreshAnimations() {
  ScrollTrigger.refresh();
}

export function animateWorkflowStep(element) {
  if (!element) return;
  gsap.fromTo(
    element,
    { opacity: 0.4, y: 9 },
    {
      opacity: 1,
      y: 0,
      duration: 0.35,
      overwrite: true,
      clearProps: 'opacity,transform',
    },
  );
}

export function initAnimations() {
  let disposed = false;
  const controller = new AbortController();
  const media = gsap.matchMedia();

  const entrance = gsap.context(() => {
    gsap.from('.hero-line', {
      y: 65,
      opacity: 0,
      duration: 1.15,
      stagger: 0.13,
      ease: 'power3.out',
      clearProps: 'all',
    });
    gsap.from('.hero-enter', {
      y: 20,
      opacity: 0,
      duration: 0.9,
      delay: 0.35,
      stagger: 0.12,
      ease: 'power3.out',
      clearProps: 'all',
    });
    gsap.from('.world-stage', {
      y: 60,
      opacity: 0,
      scale: 0.94,
      duration: 1.5,
      delay: 0.1,
      ease: 'power3.out',
      clearProps: 'opacity,transform',
    });
    document.querySelectorAll('.reveal').forEach((element) => {
      gsap.from(element, {
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 94%', once: true },
        clearProps: 'transform,opacity',
      });
    });
  });

  // Scroll parallax is reverted when crossing back to the mobile layout.
  media.add('(min-width: 761px)', () => {
    gsap.to('.world-image', {
      y: 65,
      rotation: 3,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    });
    gsap.to('.document-stack', {
      rotation: 8,
      y: -22,
      ease: 'none',
      scrollTrigger: { trigger: '.quotes-art', start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
    gsap.to('.salon-browser', {
      rotation: 1,
      y: -15,
      ease: 'none',
      scrollTrigger: { trigger: '.salon-art', start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
    gsap.to('.about-monogram', {
      rotation: 8,
      ease: 'none',
      scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  });

  media.add('(min-width: 761px) and (hover: hover) and (pointer: fine)', () => {
    const stage = document.querySelector('.world-stage');
    const layer = stage?.querySelector('.world-parallax');
    if (!stage || !layer) return;

    const pointer = new AbortController();
    const xTo = gsap.quickTo(layer, 'x', { duration: 0.9, ease: 'power2.out' });
    const yTo = gsap.quickTo(layer, 'y', { duration: 0.9, ease: 'power2.out' });
    stage.addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType !== 'mouse') return;
        const bounds = stage.getBoundingClientRect();
        xTo(((event.clientX - bounds.left) / bounds.width - 0.5) * 22);
        yTo(((event.clientY - bounds.top) / bounds.height - 0.5) * 18);
      },
      { signal: pointer.signal },
    );
    stage.addEventListener(
      'pointerleave',
      () => {
        xTo(0);
        yTo(0);
      },
      { signal: pointer.signal },
    );
    return () => pointer.abort();
  });

  window.addEventListener('load', refreshAnimations, { once: true, signal: controller.signal });
  document.fonts?.ready.then(() => {
    if (!disposed) refreshAnimations();
  });

  return () => {
    disposed = true;
    controller.abort();
    media.revert();
    entrance.revert();
    gsap.killTweensOf('.stage-content');
    gsap.set('.stage-content', { clearProps: 'opacity,transform' });
  };
}
