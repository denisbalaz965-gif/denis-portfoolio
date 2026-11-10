import { readFile, readdir, mkdir, writeFile, rm } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';

const dist = resolve('dist');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};
const assets = {};
async function collect(dir, prefix = '') {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${prefix}/${entry.name}`;
    if (entry.name === '.openai' || entry.name === 'server') continue;
    if (entry.isDirectory()) await collect(resolve(dir, entry.name), path);
    else {
      const bytes = await readFile(resolve(dir, entry.name));
      assets[path] = {
        data: bytes.toString('base64'),
        type: mime[extname(path)] || 'application/octet-stream',
        etag: `"${createHash('sha256').update(bytes).digest('hex').slice(0, 20)}"`,
      };
    }
  }
}
await collect(dist);
if (!assets['/index.html']) throw new Error('Build the Vite site first.');
const handler = await readFile(resolve('server/contact.js'), 'utf8');
const worker = `const STATIC_ASSETS = ${JSON.stringify(assets)};\n${handler}\n
const decoded = new Map();
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') return handleContact(request, env);
    if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed', {status:405});
    let path;
    try { path = decodeURIComponent(url.pathname); } catch { return new Response('Bad request', {status:400}); }
    if (path === '/') path = '/index.html';
    const asset = STATIC_ASSETS[path];
    if (!asset) return new Response('Not found', {status:404});
    const headers = {'Content-Type':asset.type,'ETag':asset.etag,'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':path.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache'};
    if (request.headers.get('If-None-Match') === asset.etag) return new Response(null,{status:304,headers});
    if (request.method === 'HEAD') return new Response(null,{headers});
    if (!decoded.has(path)) decoded.set(path, Uint8Array.from(atob(asset.data), c => c.charCodeAt(0)));
    return new Response(decoded.get(path), {headers});
  }
};`;
// All previous assets have been embedded before replacing the static artifact.
await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, 'server'), { recursive: true });
await mkdir(resolve(dist, '.openai'), { recursive: true });
await writeFile(resolve(dist, 'server/index.js'), worker);
await writeFile(resolve(dist, '.openai/hosting.json'), await readFile('.openai/hosting.json'));
console.log(
  `Worker ESM: ${Object.keys(assets).length} preserved assets, ${(gzipSync(worker).length / 1024 / 1024).toFixed(2)} MiB compressed.`,
);
