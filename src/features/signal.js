// A moving field of data fragments and broken planes; the scroll position owns depth.
export function initSignal() {
  const canvas = document.querySelector('#signal-canvas');
  const pause = document.querySelector('#signal-pause');
  const depth = document.querySelector('#depth-value');
  if (!canvas || !pause) return () => {};
  const context = canvas.getContext('2d');
  if (!context) return () => {};
  const controller = new AbortController();
  const fragments = Array.from({ length: 58 }, (_, i) => ({
    x: Math.sin(i * 127.13) * 1.8,
    y: Math.cos(i * 47.87) * 1.5,
    z: (i * 0.137) % 1,
    width: 8 + (i % 7) * 13,
    kind: i % 4,
  }));
  let width = 1,
    height = 1,
    frame,
    phase = 0,
    previous = 0,
    paused = false;
  let scroll = window.scrollY;
  function draw(time = 0) {
    frame = null;
    const dt = Math.min((time - previous) / 1000 || 0, 0.05);
    previous = time;
    if (!paused) phase += dt * 0.025;
    context.clearRect(0, 0, width, height);
    const cx = width * (width < 761 ? 0.36 : 0.56),
      cy = height * 0.49;
    // Broken perspective planes, deliberately sparse around the reading area.
    for (let i = 0; i < 12; i++) {
      const z = (i / 12 + phase * 0.4 + scroll / 16000) % 1;
      const k = 0.06 + z * z * 1.7;
      const w = width * k,
        h = height * k * 0.63;
      context.strokeStyle = `rgba(129,255,73,${0.025 + z * 0.1})`;
      context.lineWidth = 0.65;
      context.beginPath();
      context.moveTo(cx - w, cy - h);
      context.lineTo(cx + w * 0.72, cy - h);
      context.lineTo(cx + w, cy - h * 0.6);
      context.moveTo(cx + w, cy + h);
      context.lineTo(cx - w * 0.68, cy + h);
      context.lineTo(cx - w, cy + h * 0.6);
      context.stroke();
    }
    fragments.forEach((p, i) => {
      const z = (p.z + phase + scroll / 7200) % 1;
      const k = z * z;
      const x = cx + p.x * width * k,
        y = cy + p.y * height * k;
      const length = p.width * (0.2 + k);
      context.strokeStyle = `rgba(153,255,94,${0.06 + k * 0.4})`;
      context.fillStyle = `rgba(153,255,94,${0.08 + k * 0.4})`;
      context.lineWidth = 0.7;
      if (p.kind === 0) {
        context.font = `${7 + k * 3}px monospace`;
        context.fillText(['010 /', '[ ]', '→ _', '/ d.'][i % 4], x, y);
      } else {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + length, y);
        if (p.kind === 1) context.lineTo(x + length, y + length * 0.22);
        context.stroke();
        if (p.kind === 2) context.fillRect(x, y - 3, 2, 2);
      }
    });
    if (!paused && !document.hidden) frame = requestAnimationFrame(draw);
  }
  function start() {
    if (frame) cancelAnimationFrame(frame);
    previous = 0;
    draw();
  }
  function updateDepth() {
    scroll = window.scrollY;
    const range = Math.max(1, document.documentElement.scrollHeight - height);
    if (depth) depth.textContent = String(Math.round((scroll / range) * 999)).padStart(3, '0');
    if (paused) start();
  }
  const resize = new ResizeObserver(([entry]) => {
    width = entry.contentRect.width;
    height = entry.contentRect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    updateDepth();
    start();
  });
  resize.observe(canvas);
  window.addEventListener('scroll', updateDepth, { passive: true, signal: controller.signal });
  pause.addEventListener(
    'click',
    () => {
      paused = !paused;
      pause.setAttribute('aria-pressed', String(paused));
      pause.textContent = paused ? 'Spustiť pozadie' : 'Pozastaviť pozadie';
      start();
    },
    { signal: controller.signal },
  );
  document.addEventListener('visibilitychange', start, { signal: controller.signal });
  start();
  return () => {
    controller.abort();
    resize.disconnect();
    if (frame) cancelAnimationFrame(frame);
  };
}
