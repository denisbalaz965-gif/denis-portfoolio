export function initProjectFilter({ root = document, onChange = () => {} } = {}) {
  const buttons = [...root.querySelectorAll('.filters button')];
  const cards = [...root.querySelectorAll('.project-card')];
  const controller = new AbortController();

  buttons.forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        const filter = button.dataset.filter;
        buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        cards.forEach((card) => {
          const tags = (card.dataset.tags ?? '').split(/\s+/);
          card.hidden = filter !== 'all' && !tags.includes(filter);
        });
        onChange();
      },
      { signal: controller.signal },
    );
  });

  return () => controller.abort();
}
