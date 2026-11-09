export function initCursor() {
  const cursor = document.querySelector('.target-cursor');
  if (!cursor) return () => {};
  const media = window.matchMedia('(hover: hover) and (pointer: fine)');
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let frame = 0,
    x = 0,
    y = 0;
  function update() {
    frame = 0;
    cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
  }
  function setEnabled() {
    document.body.classList.toggle('custom-cursor', media.matches);
  }
  document.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse' || !media.matches) return;
      x = event.clientX;
      y = event.clientY;
      cursor.classList.add('cursor-visible');
      cursor.classList.toggle('cursor-target', Boolean(event.target.closest('a,button,summary')));
      if (!frame) frame = requestAnimationFrame(update);
    },
    options,
  );
  document.addEventListener(
    'pointerout',
    (event) => {
      if (!event.relatedTarget) cursor.classList.remove('cursor-visible');
    },
    options,
  );
  document.addEventListener('keydown', () => cursor.classList.remove('cursor-visible'), options);
  document.addEventListener('pointerdown', () => cursor.classList.add('cursor-pressed'), options);
  document.addEventListener('pointerup', () => cursor.classList.remove('cursor-pressed'), options);
  media.addEventListener('change', setEnabled);
  const viewer = document.querySelector('#project-viewer');
  const moveLayer = () => (viewer?.open ? viewer : document.body).append(cursor);
  const observer = new MutationObserver(moveLayer);
  if (viewer) observer.observe(viewer, { attributes: true, attributeFilter: ['open'] });
  setEnabled();
  return () => {
    observer.disconnect();
    document.body.append(cursor);
    controller.abort();
    media.removeEventListener('change', setEnabled);
    if (frame) cancelAnimationFrame(frame);
    document.body.classList.remove('custom-cursor');
  };
}
