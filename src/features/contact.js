export function initContact({
  root = document,
  clipboard = navigator.clipboard,
  request = (...args) => fetch(...args),
} = {}) {
  const controller = new AbortController();
  const form = root.querySelector('#contact-form');
  if (form) connectForm(form, root, request, controller.signal);
  const button = root.querySelector('#copy-email');
  const status = root.querySelector('#copy-status');
  const link = root.querySelector('.email-link');
  if (!button || !status || !link) return () => controller.abort();

  const email = link.getAttribute('href').replace(/^mailto:/, '');
  button.addEventListener(
    'click',
    async () => {
      try {
        if (!clipboard) throw new Error('Clipboard is unavailable');
        await clipboard.writeText(email);
        status.textContent = 'E-mail je skopírovaný.';
      } catch {
        status.textContent = 'Kopírovanie sa nepodarilo. Použite odkaz na e-mail.';
      }
    },
    { signal: controller.signal },
  );

  return () => controller.abort();
}

function connectForm(form, root, request, signal) {
  const button = form.querySelector('[type="submit"]');
  const availability = root.querySelector('#contact-availability');
  const result = root.querySelector('#contact-result');
  let ready = false,
    sending = false,
    requestId = crypto.randomUUID();
  const unavailable = 'Odosielanie ešte pripájame. Zatiaľ nám napíšte na e-mail uvedený nižšie.';
  async function checkAvailability() {
    try {
      const response = await request('/api/contact', {
        signal: AbortSignal.any([signal, AbortSignal.timeout(5000)]),
        headers: { Accept: 'application/json' },
      });
      const data = response.ok ? await response.json() : {};
      ready = data.ready === true;
    } catch {
      ready = false;
    }
    if (signal.aborted) return;
    button.disabled = !ready;
    availability.textContent = ready ? 'Zadanie odošlete priamo nášmu tímu.' : unavailable;
  }
  checkAvailability();
  form.addEventListener(
    'input',
    () => {
      requestId = crypto.randomUUID();
      for (const field of form.querySelectorAll('[aria-invalid]'))
        field.removeAttribute('aria-invalid');
      result.textContent = '';
    },
    { signal },
  );
  form.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();
      if (sending) return;
      result.dataset.state = 'error';
      if (!ready) {
        result.textContent = unavailable;
        return;
      }
      const fields = form.elements;
      const name = fields.namedItem('name'),
        email = fields.namedItem('email'),
        message = fields.namedItem('message');
      const invalid = !name.value.trim()
        ? name
        : !email.validity.valid || !email.value.trim()
          ? email
          : message.value.trim().length < 20
            ? message
            : null;
      if (invalid) {
        result.textContent =
          invalid === message
            ? 'Napíšte aspoň 20 znakov, aby sme rozumeli zadaniu.'
            : invalid === email
              ? 'Doplňte platnú e-mailovú adresu.'
              : 'Doplňte svoje meno.';
        invalid.setAttribute('aria-invalid', 'true');
        invalid.focus();
        return;
      }
      sending = true;
      for (const field of form.querySelectorAll('input,textarea')) field.readOnly = true;
      button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      button.firstElementChild.textContent = 'Odosielame…';
      result.textContent = '';
      const payload = {
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
        website: fields.namedItem('website').value,
        requestId,
      };
      try {
        const response = await request('/api/contact', {
          method: 'POST',
          signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]),
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok || data.accepted !== true)
          throw new Error(
            data.error ||
              'Odoslanie sa nepodarilo potvrdiť. Skúste to znova alebo nám napíšte e-mail.',
          );
        result.dataset.state = 'success';
        result.textContent =
          'E-mailová služba prijala vaše zadanie na odoslanie. Ďakujeme, ozveme sa na uvedený e-mail.';
        form.reset();
        requestId = crypto.randomUUID();
      } catch (error) {
        if (signal.aborted) return;
        result.textContent =
          error.name === 'TimeoutError' || error.name === 'AbortError'
            ? 'Odoslanie sa nepodarilo potvrdiť včas. Skúste to znova alebo použite e-mail.'
            : error.message;
      } finally {
        sending = false;
        for (const field of form.querySelectorAll('input,textarea')) field.readOnly = false;
        button.disabled = !ready;
        form.removeAttribute('aria-busy');
        button.firstElementChild.textContent = 'Poslať zadanie';
      }
    },
    { signal },
  );
}
