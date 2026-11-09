// Buttons and article links stay native HTML, independent of the WebGL renderer.
export function initHolograms({ root = document } = {}) {
  if (!root.querySelector('.flight-project') || !document.body.classList.contains('flight-ready'))
    return () => {};
  const projects = [...root.querySelectorAll('.flight-project')];
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let open;
  let blocked;
  let openedAt = 0;
  function close() {
    if (!open) return;
    blocked = open;
    open.classList.remove('is-revealed');
    open.querySelector('.fragment-beacon').setAttribute('aria-expanded', 'false');
    open.querySelector('.hologram').inert = true;
    open = null;
    root.dispatchEvent(new Event('portfolio:hologram'));
  }
  function reveal(project) {
    if (open === project) return;
    close();
    openedAt = window.scrollY;
    window.scrollTo({ top: openedAt, behavior: 'instant' });
    open = project;
    project.classList.add('is-revealed');
    project.querySelector('.fragment-beacon').setAttribute('aria-expanded', 'true');
    project.querySelector('.hologram').inert = false;
    root.dispatchEvent(new Event('portfolio:hologram'));
  }
  for (const project of projects) {
    const beacon = project.querySelector('.fragment-beacon');
    project.querySelector('.hologram').inert = true;
    beacon.addEventListener(
      'pointerenter',
      (event) => {
        if (event.pointerType === 'mouse' && blocked !== project) reveal(project);
      },
      options,
    );
    beacon.addEventListener(
      'focus',
      () => {
        blocked = null;
        reveal(project);
      },
      options,
    );
    beacon.addEventListener(
      'click',
      () => {
        blocked = null;
        reveal(project);
      },
      options,
    );
    project.addEventListener(
      'pointerleave',
      (event) => {
        if (event.pointerType === 'mouse') {
          if (!project.contains(document.activeElement)) close();
          if (blocked === project) blocked = null;
        }
      },
      options,
    );
    project.addEventListener(
      'focusout',
      (event) => {
        if (!project.contains(event.relatedTarget)) close();
      },
      options,
    );
    project.querySelector('.holo-dismiss').addEventListener(
      'click',
      () => {
        close();
        beacon.focus({ preventScroll: true });
        close();
      },
      options,
    );
  }
  root.addEventListener('portfolio:flight-jump', close, options);
  root.addEventListener(
    'portfolio:flight-fallback',
    () => {
      controller.abort();
      close();
      projects.forEach((project) => {
        project.querySelector('.hologram').inert = false;
      });
    },
    options,
  );
  root.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') close();
    },
    options,
  );
  root.addEventListener(
    'pointerdown',
    (event) => {
      if (open && !open.contains(event.target)) close();
    },
    options,
  );
  window.addEventListener(
    'scroll',
    () => {
      if (Math.abs(window.scrollY - openedAt) > 64) close();
    },
    { passive: true, signal: controller.signal },
  );
  window.addEventListener('wheel', close, { passive: true, signal: controller.signal });
  window.addEventListener('touchmove', close, { passive: true, signal: controller.signal });
  return () => {
    controller.abort();
    close();
  };
}
