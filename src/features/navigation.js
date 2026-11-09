export function initNavigation({ root = document } = {}) {
  const menu = root.querySelector('.project-index');
  if (!menu) return () => {};
  const controller = new AbortController();
  const options = { signal: controller.signal };
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener(
      'click',
      () => {
        menu.open = false;
      },
      options,
    );
  });
  root.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    },
    options,
  );
  root.addEventListener(
    'click',
    (event) => {
      if (!menu.contains(event.target)) menu.open = false;
    },
    options,
  );
  return () => controller.abort();
}
