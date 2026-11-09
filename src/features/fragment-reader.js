import { chapterProgress, clamp } from './flight-model.js';

export function initFragmentReader({
  root,
  scroller,
  project,
  mountFallback = () => () => {},
  initialStep,
}) {
  const chapter = root.firstElementChild;
  const original = chapter.cloneNode(true);
  const dialog = root.closest('dialog');
  const worldStage = document.querySelector('.flight-stage');
  const previousInert = worldStage?.inert;
  if (worldStage) worldStage.inert = true;
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let fallbackDispose = () => {},
    stopped = false,
    unit = 1,
    settle = 0,
    landing = null,
    previousTop = scroller.scrollTop;
  const chunks = [];
  const intro = document.createElement('div');
  const layout = chapter.querySelector('.story-layout');
  for (const child of [...chapter.children]) {
    if (child === layout) break;
    if (!child.matches('.case-reading-hint,.section-kicker')) intro.append(child);
  }
  chunks.push({ content: intro, id: `${project.id}-intro`, label: 'Projekt' });
  chapter.querySelectorAll('.story-step').forEach((step) => {
    chunks.push({
      content: step.firstElementChild,
      id: step.id,
      label: [...step.querySelector('h3').childNodes]
        .map((node) => (node.nodeName === 'BR' ? ' ' : node.textContent))
        .join('')
        .replace(/\s+/g, ' ')
        .trim(),
    });
  });
  const evidence = document.createElement('div');
  chapter
    .querySelectorAll('.case-showcase,.reference-heading,.grant-list,.grant-note')
    .forEach((el) => evidence.append(el));
  if (evidence.children.length)
    chunks.push({ content: evidence, id: `${project.id}-evidence`, label: 'Výsledok a podklady' });
  const track = document.createElement('div');
  track.className = 'reader-track';
  track.dataset.project = project.id;
  const stage = document.createElement('div');
  stage.className = 'reader-stage';
  const panels = document.createElement('div');
  panels.className = 'reader-panels';
  const nav = document.createElement('nav');
  nav.className = 'reader-index';
  nav.setAttribute('aria-label', 'Časti príbehu');
  const indicator = document.createElement('p');
  indicator.className = 'reader-location';
  indicator.setAttribute('aria-live', 'polite');
  const frames = chunks.map((chunk, i) => {
    const frame = document.createElement('article');
    frame.className = 'reader-panel';
    frame.id = chunk.id;
    frame.dataset.chapter = String(i);
    frame.append(chunk.content);
    panels.append(frame);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(i + 1).padStart(2, '0');
    button.setAttribute('aria-label', chunk.label);
    button.setAttribute('aria-controls', chunk.id);
    button.addEventListener('click', () => go(i), options);
    nav.append(button);
    return frame;
  });
  const ending = document.createElement('div');
  ending.className = 'reader-ending';
  ending.innerHTML =
    '<button type="button" data-case-next>Ďalší projekt →</button><button type="button" data-case-close>Späť do priestoru</button>';
  frames.at(-1).append(ending);
  stage.append(panels, nav, indicator);
  track.append(stage);
  root.replaceChildren(track);
  dialog.classList.add('reader-mode');
  document.body.classList.add('reader-world');
  let active = -1;
  const send = (detail) => document.dispatchEvent(new CustomEvent('portfolio:reader', { detail }));
  function go(index) {
    clearTimeout(settle);
    landing = clamp(index, 0, frames.length - 1);
    if (Math.abs(scroller.scrollTop - landing * unit) < 2) {
      landing = null;
      update();
      return;
    }
    scroller.scrollTo({ top: landing * unit, behavior: 'smooth' });
  }
  function update() {
    if (stopped) return;
    const progress = chapterProgress(scroller.scrollTop, unit, frames.length);
    const index = Math.min(frames.length - 1, Math.round(progress));
    frames.forEach((frame, i) => {
      const difference = i - progress;
      frame.classList.toggle('is-current', i === index);
      frame.inert = i !== index;
      frame.style.opacity = String(Math.max(0, 1 - Math.abs(difference) * 1.8));
      frame.style.transform = `translate3d(${difference * 40}px,${difference * 16}px,0)`;
      frame.style.visibility = Math.abs(difference) > 0.9 ? 'hidden' : 'visible';
      nav.children[i].setAttribute('aria-current', i === index ? 'step' : 'false');
    });
    if (active !== index) {
      active = index;
      indicator.textContent = `${String(index + 1).padStart(2, '0')} / ${String(frames.length).padStart(2, '0')} — ${chunks[index].label}`;
    }
    send({ project: project.id, count: frames.length, progress });
  }
  function resize() {
    const index = chapterProgress(scroller.scrollTop, unit, frames.length);
    const height = window.innerHeight;
    unit = Math.max(230, height * 0.55);
    track.style.height = `${height + (frames.length - 1) * unit}px`;
    if (index > 0) scroller.scrollTop = Math.round(index) * unit;
    previousTop = scroller.scrollTop;
    update();
  }
  function teardown() {
    if (stopped) return;
    stopped = true;
    controller.abort();
    clearTimeout(settle);
    if (worldStage) worldStage.inert = previousInert ?? false;
    dialog.classList.remove('reader-mode');
    document.body.classList.remove('reader-world');
    send(null);
  }
  function fallback() {
    teardown();
    root.replaceChildren(original);
    root.querySelector('#case-title')?.focus({ preventScroll: true });
    fallbackDispose = mountFallback({ root, scroller });
  }
  root.addEventListener(
    'click',
    (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (
        !link ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target = root.querySelector(`[id="${link.hash.slice(1)}"]`);
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      const panel = target.closest('.reader-panel');
      go(frames.indexOf(panel));
    },
    options,
  );
  const userInput = () => {
    landing = null;
    clearTimeout(settle);
  };
  scroller.addEventListener('wheel', userInput, { passive: true, signal: controller.signal });
  scroller.addEventListener(
    'keydown',
    (event) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key))
        userInput();
    },
    options,
  );
  scroller.addEventListener('touchstart', userInput, { passive: true, signal: controller.signal });
  scroller.addEventListener(
    'scroll',
    () => {
      update();
      const delta = scroller.scrollTop - previousTop;
      previousTop = scroller.scrollTop;
      if (landing !== null) {
        if (Math.abs(scroller.scrollTop - landing * unit) < 2) landing = null;
        return;
      }
      if (Math.abs(delta) < 1) return;
      clearTimeout(settle);
      const direction = Math.sign(delta);
      settle = setTimeout(() => {
        const raw = scroller.scrollTop / unit;
        const index = direction > 0 ? Math.ceil(raw - 0.002) : Math.floor(raw + 0.002);
        if (Math.abs(index * unit - scroller.scrollTop) > 2) go(index);
      }, 240);
    },
    { passive: true, signal: controller.signal },
  );
  window.addEventListener('resize', resize, options);
  document.addEventListener('portfolio:flight-fallback', fallback, options);
  resize();
  if (initialStep) {
    const index = frames.findIndex(
      (frame) => frame.id === initialStep || frame.querySelector(`[id="${initialStep}"]`),
    );
    if (index >= 0) {
      scroller.scrollTop = index * unit;
      update();
    }
  }
  return () => {
    teardown();
    fallbackDispose();
  };
}
