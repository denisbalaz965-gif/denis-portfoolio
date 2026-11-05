import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const hidden = {
  autoAlpha: 0,
  xPercent: 0,
  yPercent: 16,
  scale: 0.88,
  rotation: -8,
  rotationX: 0,
  rotationY: 0,
};
const visible = {
  autoAlpha: 1,
  xPercent: 0,
  yPercent: 0,
  scale: 1,
  rotation: 0,
  rotationX: 0,
  rotationY: 0,
};

// One timeline owns every scene transform. Reversing the scroll reverses the same path.
function composeScene(stage, poses, length) {
  const timeline = gsap.timeline({
    paused: true,
    defaults: { duration: 0.65, ease: 'power2.inOut' },
  });
  const clock = { progress: 0 };
  timeline.to(clock, { progress: 1, duration: length, ease: 'none' }, 0);
  for (const [part, states] of Object.entries(poses)) {
    const element = stage.querySelector(`[data-part="${part}"]`);
    if (!element) continue;
    gsap.set(element, { ...states[0] });
    for (let step = 1; step < states.length; step += 1) {
      timeline.to(element, { ...states[step] }, step - 0.65);
    }
  }
  timeline.to(stage.querySelector('.orbit-a'), { rotation: 45, duration: length, ease: 'none' }, 0);
  timeline.to(
    stage.querySelector('.spark-a'),
    { rotation: 140, duration: length, ease: 'none' },
    0,
  );
  return timeline;
}

export function buildWebScene(stage) {
  return composeScene(
    stage,
    {
      browser: [
        { ...visible, rotation: -6, scale: 0.94, rotationY: -8, rotationX: 7 },
        { ...visible, rotation: -5, rotationY: 5, rotationX: 0 },
        { ...visible, rotation: -8, yPercent: -24, scale: 0.82, rotationY: -18, rotationX: 15 },
        {
          ...visible,
          rotation: -11,
          yPercent: -23,
          xPercent: 5,
          scale: 0.8,
          rotationY: -14,
          rotationX: 8,
        },
        { ...visible, rotation: -5, yPercent: -10, scale: 1, rotationY: 0, rotationX: 0 },
      ],
      wireframe: [visible, hidden, hidden, hidden, hidden],
      hero: [hidden, visible, visible, visible, visible],
      brief: [
        { ...visible, rotation: -10 },
        { ...hidden, xPercent: -25, yPercent: -20, rotation: -20 },
        hidden,
        hidden,
        hidden,
      ],
      phone: [
        hidden,
        { ...visible, rotation: 8 },
        { ...visible, rotation: 11, xPercent: 7, yPercent: -20, scale: 0.83 },
        hidden,
        hidden,
      ],
      connections: [hidden, hidden, visible, hidden, hidden],
      catalogue: [
        hidden,
        hidden,
        { ...visible, rotation: 4, rotationX: 5 },
        { ...hidden, yPercent: 40 },
        hidden,
      ],
      booking: [
        hidden,
        hidden,
        hidden,
        { ...visible, rotation: -5 },
        { ...hidden, xPercent: -40, rotation: -12 },
      ],
      admin: [
        hidden,
        hidden,
        hidden,
        { ...visible, rotation: 8, xPercent: 18, yPercent: -38, scale: 0.7 },
        { ...hidden, xPercent: 25, yPercent: -55, scale: 0.65 },
      ],
      domain: [hidden, hidden, hidden, hidden, { ...visible, rotation: 3 }],
    },
    4,
  );
}

export function buildGrantScene(stage) {
  return composeScene(
    stage,
    {
      pin: [visible, { ...hidden, yPercent: -40 }, hidden, hidden],
      need: [
        { ...visible, rotation: -7 },
        { ...hidden, xPercent: 25, yPercent: 35, rotation: 0 },
        hidden,
        hidden,
      ],
      call: [
        { ...visible, rotation: 8 },
        { ...hidden, xPercent: -20, yPercent: 50 },
        hidden,
        hidden,
      ],
      folder: [
        { ...visible, autoAlpha: 0.2, rotation: -7, scale: 0.75, yPercent: 20 },
        { ...visible, rotation: -8, yPercent: 20 },
        { ...visible, rotation: -7, scale: 0.9, yPercent: 22 },
        { ...visible, rotation: -10, yPercent: 22, scale: 0.85 },
      ],
      application: [
        hidden,
        { ...visible, rotation: -9, rotationY: -5 },
        { ...hidden, xPercent: -22, yPercent: -16, rotation: -15 },
        hidden,
      ],
      budget: [
        hidden,
        { ...visible, rotation: 8, rotationY: -6 },
        { ...hidden, xPercent: 25, yPercent: 15 },
        hidden,
      ],
      delivery: [
        hidden,
        hidden,
        { ...visible, rotation: -4, rotationX: 4 },
        { ...hidden, xPercent: -15, yPercent: -15 },
      ],
      proof: [hidden, hidden, hidden, { ...visible, rotation: 4 }],
    },
    3,
  );
}

export function buildQuotesScene(stage) {
  return composeScene(
    stage,
    {
      input: [
        { ...visible, rotation: -5 },
        { ...visible, scale: 0.74, yPercent: -28, xPercent: -18, rotation: -9 },
        hidden,
      ],
      offer: [
        hidden,
        { ...visible, rotation: -12, xPercent: -14, yPercent: 22, scale: 0.8 },
        { ...visible, rotation: -11, xPercent: -14, yPercent: 0, scale: 0.83 },
      ],
      order: [
        hidden,
        { ...visible, rotation: 2, yPercent: 7, scale: 0.8 },
        { ...visible, rotation: 2, yPercent: -5, scale: 0.83 },
      ],
      handover: [
        hidden,
        { ...visible, rotation: 14, xPercent: 22, yPercent: 0, scale: 0.8 },
        { ...visible, rotation: 14, xPercent: 22, yPercent: -12, scale: 0.83 },
      ],
      'quote-domain': [hidden, hidden, { ...visible, rotation: -3 }],
    },
    2,
  );
}

export function buildReferenceScene(stage, budget = false) {
  return composeScene(
    stage,
    {
      pin: [visible, hidden, hidden],
      need: [{ ...visible, rotation: -7 }, hidden, hidden],
      call: [{ ...visible, rotation: 8 }, hidden, hidden],
      folder: [
        { ...visible, autoAlpha: 0.18, scale: 0.75 },
        { ...visible, rotation: -8, yPercent: 17 },
        { ...visible, rotation: -9, scale: 0.85, yPercent: 20 },
      ],
      application: [
        hidden,
        { ...visible, rotation: -7, scale: budget ? 1 : 1.1, xPercent: budget ? 0 : 20 },
        hidden,
      ],
      budget: [hidden, budget ? { ...visible, rotation: 7 } : hidden, hidden],
      delivery: [hidden, hidden, hidden],
      proof: [hidden, hidden, { ...visible, rotation: 4 }],
    },
    2,
  );
}

export function initScrollStories({ root = document, scroller } = {}) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  // The owner explicitly requested automatic motion on this portfolio, including
  // browsers reporting reduced motion. Keep this choice local to this website.
  let disposed = false;
  media.add(
    {
      desktop: '(min-width: 761px)',
      mobile: '(max-width: 760px)',
    },
    (context) => {
      const chapters = [...root.querySelectorAll('[data-story]')];
      for (const chapter of chapters) {
        const stage = chapter.querySelector('.story-stage');
        const steps = [...chapter.querySelectorAll('[data-story-step]')];
        const links = [...stage.querySelectorAll('.story-index a')];
        const timeline =
          chapter.dataset.story === 'web'
            ? buildWebScene(stage)
            : chapter.dataset.story === 'quotes'
              ? buildQuotesScene(stage)
              : chapter.dataset.story === 'reference'
                ? buildReferenceScene(stage, chapter.dataset.hasBudget === 'true')
                : buildGrantScene(stage);
        chapter.classList.add('story-is-animated');
        let activeStep = -1;
        const update = (progress) => {
          const next = Math.round(progress * (steps.length - 1));
          gsap.set(stage.querySelector('.story-progress i'), { scaleX: progress });
          if (next === activeStep) return;
          activeStep = next;
          chapter.dataset.currentStep = String(next + 1);
          links.forEach((link, i) => {
            if (i === next) link.setAttribute('aria-current', 'step');
            else link.removeAttribute('aria-current');
          });
        };
        update(0);
        ScrollTrigger.create({
          id: `portfolio-${chapter.dataset.story}`,
          trigger: steps[0].firstElementChild,
          endTrigger: steps.at(-1).firstElementChild,
          start: context.conditions.mobile ? 'center 70%' : 'center 50%',
          end: context.conditions.mobile ? 'center 70%' : 'center 50%',
          animation: timeline,
          ...(scroller ? { scroller } : {}),
          scrub: 0.55,
          invalidateOnRefresh: true,
          onUpdate: (self) => update(self.progress),
          onRefresh: (self) => update(self.progress),
        });
      }
      return () =>
        chapters.forEach((chapter) => {
          chapter.classList.remove('story-is-animated');
          delete chapter.dataset.currentStep;
          chapter
            .querySelectorAll('.story-index a')
            .forEach((link) => link.removeAttribute('aria-current'));
        });
    },
  );
  document.fonts?.ready.then(() => {
    if (!disposed) ScrollTrigger.refresh();
  });
  return () => {
    disposed = true;
    media.revert();
  };
}
