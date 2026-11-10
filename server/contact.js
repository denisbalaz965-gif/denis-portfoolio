const RECIPIENT = 'denisbalaz965@gmail.com';
const WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY = 18000;
const limits = new Map();
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
function configured(env) {
  return (
    env.CONTACT_ENABLED === 'true' &&
    Boolean(env.RESEND_API_KEY) &&
    emailPattern.test(env.CONTACT_FROM_EMAIL || '') &&
    !/[\r\n]/.test(env.CONTACT_FROM_EMAIL)
  );
}

// A bounded per-isolate backstop, not a distributed quota. Upgrade this guard
// to a shared rate limiter before a campaign or high-traffic launch.
function reserve(ip, now) {
  for (const [key, value] of limits) if (now - value.start >= WINDOW_MS) limits.delete(key);
  const keys = [
    ['global', 20],
    [`ip:${ip}`, 3],
  ];
  if (limits.size > 5000) return false;
  for (const [key, max] of keys) if ((limits.get(key)?.count || 0) >= max) return false;
  for (const [key] of keys) {
    const bucket = limits.get(key) || { start: now, count: 0 };
    bucket.count++;
    limits.set(key, bucket);
  }
  return true;
}

export async function handleContact(request, env = {}, { send = fetch, now = Date.now() } = {}) {
  if (request.method === 'GET') return json({ ready: configured(env) });
  if (request.method !== 'POST') return json({ error: 'Metóda nie je podporovaná.' }, 405);
  const origin = new URL(request.url).origin;
  if (
    request.headers.get('Origin') !== origin ||
    request.headers.get('Sec-Fetch-Site') === 'cross-site'
  ) {
    return json({ error: 'Odoslanie je možné iba z nášho webu.' }, 403);
  }
  if (!configured(env))
    return json({ error: 'Odosielanie ešte pripájame. Napíšte nám zatiaľ e-mail.' }, 503);
  if (!request.headers.get('Content-Type')?.startsWith('application/json'))
    return json({ error: 'Neplatný formát zadania.' }, 415);
  if (Number(request.headers.get('Content-Length')) > MAX_BODY)
    return json({ error: 'Zadanie je príliš dlhé.' }, 413);
  let data;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error('Missing body');
    const chunks = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY) {
        await reader.cancel();
        return json({ error: 'Zadanie je príliš dlhé.' }, 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    data = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return json({ error: 'Zadanie sa nepodarilo načítať.' }, 400);
  }
  if (!data || typeof data !== 'object') return json({ error: 'Skontrolujte zadanie.' }, 400);
  if (data.website)
    return json({ error: 'Zadanie sa nepodarilo overiť. Použite priamy e-mail.' }, 400);
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  if (
    !name ||
    name.length > 100 ||
    [...name].some((char) => char.charCodeAt(0) < 32) ||
    !emailPattern.test(email) ||
    email.length > 254 ||
    /[\r\n]/.test(email) ||
    message.length < 20 ||
    message.length > 4000 ||
    !uuidPattern.test(data.requestId || '')
  ) {
    return json({ error: 'Skontrolujte meno, platný e-mail a aspoň 20 znakov zadania.' }, 400);
  }
  if (!reserve(request.headers.get('CF-Connecting-IP') || 'local', now)) {
    return json(
      {
        error: 'Za krátky čas prišlo viac pokusov. Skúste to o 10 minút alebo nám napíšte priamo.',
      },
      429,
    );
  }
  try {
    const response = await send('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `dmm-contact/${data.requestId}`,
      },
      body: JSON.stringify({
        from: `d/m/m <${env.CONTACT_FROM_EMAIL}>`,
        to: [RECIPIENT],
        reply_to: email,
        subject: 'Nové zadanie z webu d/m/m',
        text: `Meno: ${name}\nE-mail: ${email}\n\n${message}`,
      }),
    });
    if (!response.ok)
      return json(
        { error: 'Služba teraz zadanie neprijala. Skúste to neskôr alebo použite e-mail.' },
        502,
      );
    const result = await response.json();
    if (typeof result.id !== 'string' || !result.id)
      throw new Error('Missing provider confirmation');
    return json({ accepted: true }, 202);
  } catch {
    return json(
      { error: 'Odoslanie sa nepodarilo potvrdiť. Skúste ho znova alebo nám napíšte e-mail.' },
      502,
    );
  }
}
