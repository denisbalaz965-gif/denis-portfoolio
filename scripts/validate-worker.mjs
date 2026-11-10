import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker from '../dist/server/index.js';
import { FIXTURE_SENTINEL } from '../src/data/team-members.fixture.js';
import { teamMembers, teamStory } from '../src/data/team-members.js';
import { aboutReady } from '../src/features/about-model.js';

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
// The About layer ships closed until real profiles exist: neither the dev
// fixture nor a member's name may be in any embedded text asset. The Worker
// stores assets as base64, so they are decoded before looking.
const source = await readFile('dist/server/index.js', 'utf8');
const shipped = [
  ...source.matchAll(/"data":"([A-Za-z0-9+/=]+)","type":"text\/(?:html|javascript|css)/g),
]
  .map((match) => Buffer.from(match[1], 'base64').toString('utf8'))
  .join('\n');
assert.ok(shipped.length > 1000, 'Embedded text assets were not found.');
assert.ok(!shipped.includes(FIXTURE_SENTINEL), 'Fixture content must not ship.');
if (!aboutReady(teamMembers, teamStory))
  assert.doesNotMatch(
    shipped,
    /Martin|Miroš/,
    'Member names must not ship while the gate is closed.',
  );
const manifest = JSON.parse(await readFile('dist/.openai/hosting.json', 'utf8'));
assert.equal(manifest.project_id, 'appgprj_6ae39fd576d881919058eaae5e0df0e0');
assert.equal(manifest.static, undefined);
console.log(
  'Worker ESM, HTML assets, private-file rejection, closed About gate and unavailable contact API verified. No emails sent.',
);
