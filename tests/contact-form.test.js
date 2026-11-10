import { readFileSync } from 'node:fs';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { initContact } from '../src/features/contact.js';
let dispose = () => {};
const mount = async (request) => {
  document.body.innerHTML = new DOMParser().parseFromString(
    readFileSync('index.html', 'utf8'),
    'text/html',
  ).body.innerHTML;
  dispose = initContact({ request });
  await vi.waitFor(() =>
    expect(document.querySelector('#contact-availability').textContent).not.toContain('Overujeme'),
  );
  return document.querySelector('#contact-form');
};
afterEach(() => dispose());
describe('Contact form', () => {
  it('explains unavailable delivery and leaves the direct email accessible', async () => {
    const request = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ready: false }) });
    const form = await mount(request);
    expect(form.querySelector('button').disabled).toBe(true);
    expect(document.querySelector('#contact-availability').textContent).toContain('e-mail');
    expect(document.querySelector('.email-link').href).toBe('mailto:denisbalaz965@gmail.com');
  });
  it('focuses a missing field and preserves all data after a provider error', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ready: true }) })
      .mockResolvedValue({ ok: false, json: async () => ({ error: 'Služba neprijala zadanie.' }) });
    const form = await mount(request);
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(document.activeElement.name).toBe('name');
    form.elements.namedItem('name').value = 'Klient';
    form.elements.namedItem('email').value = 'klient@example.com';
    form.elements.namedItem('message').value = 'Potrebujeme nový web s rezerváciami.';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    await vi.waitFor(() =>
      expect(document.querySelector('#contact-result').textContent).toContain('neprijala'),
    );
    expect(form.elements.namedItem('message').value).toContain('rezerváciami');
    expect(form.querySelector('button').disabled).toBe(false);
  });
  it('shows acceptance only after the server confirms it and blocks duplicate submits', async () => {
    let complete;
    const request = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ready: true }) })
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            complete = resolve;
          }),
      );
    const form = await mount(request);
    form.elements.namedItem('name').value = 'Klient';
    form.elements.namedItem('email').value = 'klient@example.com';
    form.elements.namedItem('message').value = 'Potrebujeme nový web s rezerváciami.';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(request).toHaveBeenCalledTimes(2);
    expect(document.querySelector('#contact-result').textContent).toBe('');
    complete({ ok: true, json: async () => ({ accepted: true }) });
    await vi.waitFor(() =>
      expect(document.querySelector('#contact-result').dataset.state).toBe('success'),
    );
    expect(form.elements.namedItem('name').value).toBe('');
  });
});
