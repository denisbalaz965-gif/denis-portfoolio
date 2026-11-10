import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../dist/server/index.js';

assert.equal(typeof worker.fetch, 'function');
const get = (path) => worker.fetch(new Request(`https://portfolio.example${path}`), {});
const response = await get('/');
assert.equal(response.status, 200);
assert.match(response.headers.get('Content-Type'), /text\/html/);
const html = await response.text();
for (const match of html.matchAll(/(?:src|href)="(\.\/assets\/[^"#]+)"/g)) {
  const path = match[1].slice(1);
  const asset = await get(path);
  assert.equal(asset.status, 200, path);
  assert.ok((await asset.arrayBuffer()).byteLength > 0, path);
}
assert.equal((await get('/.env.local')).status, 404);
assert.equal((await get('/server/contact.js')).status, 404);
assert.deepEqual(await (await get('/api/contact')).json(), { ready: false });
const manifest = JSON.parse(await readFile('dist/.openai/hosting.json', 'utf8'));
assert.equal(manifest.project_id, 'appgprj_6ae39fd576d881919058eaae5e0df0e0');
assert.equal(manifest.static, undefined);
console.log(
  'Worker ESM, HTML assets, private-file rejection and unavailable contact API verified. No emails sent.',
);
