const DESKTOP_QUERY = '(min-width: 761px)';

export function initNavigation({ root = document } = {}) {
  const menu = root.querySelector('#mobile-menu');
  const toggle = root.querySelector('.menu-toggle');
  if (!menu || !toggle) return () => {};

  const controller = new AbortController();
  const options = { signal: controller.signal };
  const desktop = window.matchMedia(DESKTOP_QUERY);

  function setMenu(open, restoreFocus = false) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zavrieť navigáciu' : 'Otvoriť navigáciu');
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => setMenu(menu.hidden), options);
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false), options);
  });
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && !menu.hidden) setMenu(false, true);
    },
    options,
  );

  function handleBreakpoint(event) {
    if (event.matches) setMenu(false);
  }
  desktop.addEventListener('change', handleBreakpoint);

  const links = root.querySelectorAll('.chapter-nav a, .nav a');
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const hash = `#${entry.target.id}`;
        links.forEach((link) => {
          const active = link.getAttribute('href') === hash;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    },
    { rootMargin: '-20% 0px -45% 0px' },
  );

  root.querySelectorAll('main > section').forEach((section) => observer.observe(section));

  return () => {
    controller.abort();
    desktop.removeEventListener('change', handleBreakpoint);
    observer.disconnect();
    setMenu(false);
  };
}
