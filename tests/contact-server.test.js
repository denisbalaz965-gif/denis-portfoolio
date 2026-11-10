// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { handleContact } from '../server/contact.js';
const env = {
  CONTACT_ENABLED: 'true',
  CONTACT_FROM_EMAIL: 'studio@example.com',
  RESEND_API_KEY: 'test-placeholder',
};
const payload = {
  name: 'Klient',
  email: 'klient@example.com',
  message: 'Potrebujeme nový web s rezerváciami.',
  requestId: '163efafd-8fba-49ae-9a26-257b612a8364',
  website: '',
};
const post = (data = payload, origin = 'https://studio.example') =>
  new Request('https://studio.example/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: origin,
      'CF-Connecting-IP': '192.0.2.1',
    },
    body: JSON.stringify(data),
  });
describe('Contact delivery boundary', () => {
  it('is unavailable without explicit activation and never contacts a provider', async () => {
    const send = vi.fn();
    expect(
      await (await handleContact(new Request('https://studio.example/api/contact'), {})).json(),
    ).toEqual({ ready: false });
    expect((await handleContact(post(), {}, { send })).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });
  it('rejects foreign origin, oversized messages, invalid reply addresses and honeypot input', async () => {
    const send = vi.fn();
    expect(
      (await handleContact(post(payload, 'https://foreign.example'), env, { send })).status,
    ).toBe(403);
    for (const data of [
      { ...payload, email: 'bad\nBcc: other@example.com' },
      { ...payload, message: 'x'.repeat(4001) },
      { ...payload, website: 'spam' },
    ]) {
      expect((await handleContact(post(data), env, { send })).status).toBe(400);
    }
    expect(
      (await handleContact(post({ ...payload, message: 'x'.repeat(20000) }), env, { send })).status,
    ).toBe(413);
    expect(send).not.toHaveBeenCalled();
  });
  it('sends plain text to a fixed recipient and requires provider confirmation', async () => {
    const send = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ id: 'provider-id' }), { status: 200 }));
    const response = await handleContact(
      post({
        ...payload,
        to: 'attacker@example.com',
        message: '<script>example</script> — ukážka zadania',
      }),
      env,
      { send, now: 2000000 },
    );
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ accepted: true });
    const [url, options] = send.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    const body = JSON.parse(options.body);
    expect(body.to).toEqual(['denisbalaz965@gmail.com']);
    expect(body.reply_to).toBe(payload.email);
    expect(body.html).toBeUndefined();
    expect(options.headers['Idempotency-Key']).toContain(payload.requestId);
  });
  it('never returns success for provider errors or a missing confirmation', async () => {
    for (const response of [
      new Response('{}', { status: 403 }),
      new Response('{}', { status: 200 }),
    ]) {
      const result = await handleContact(post(), env, {
        send: vi.fn().mockResolvedValue(response),
        now: 3000000,
      });
      expect(result.status).toBe(502);
      expect((await result.json()).accepted).toBeUndefined();
    }
  });
  it('limits repeated attempts without sending another email', async () => {
    const send = vi.fn().mockImplementation(async () => new Response('{"id":"ok"}'));
    for (let i = 0; i < 3; i++)
      expect((await handleContact(post(), env, { send, now: 4000000 })).status).toBe(202);
    expect((await handleContact(post(), env, { send, now: 4000000 })).status).toBe(429);
    expect(send).toHaveBeenCalledTimes(3);
  });
});
