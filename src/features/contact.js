export function initContact({ root = document, clipboard = navigator.clipboard } = {}) {
  const button = root.querySelector('#copy-email');
  const status = root.querySelector('#copy-status');
  const link = root.querySelector('.email-link');
  if (!button || !status || !link) return () => {};

  const email = link.getAttribute('href').replace(/^mailto:/, '');
  const controller = new AbortController();
  button.addEventListener(
    'click',
    async () => {
      try {
        if (!clipboard) throw new Error('Clipboard is unavailable');
        await clipboard.writeText(email);
        status.textContent = 'E-mail je skopírovaný.';
      } catch {
        status.textContent = `E-mail: ${email}`;
      }
    },
    { signal: controller.signal },
  );

  return () => controller.abort();
}
