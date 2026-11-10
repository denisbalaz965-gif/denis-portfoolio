import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import { handleContact } from './server/contact.js';

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'contact-server-preview',
      configureServer(server) {
        const env = { ...loadEnv(server.config.mode, process.cwd(), ''), ...process.env };
        server.middlewares.use('/api/contact', async (req, res) => {
          const parts = [];
          let size = 0;
          for await (const part of req) {
            size += part.length;
            if (size > 18000) {
              res.writeHead(413);
              res.end();
              return;
            }
            parts.push(part);
          }
          const request = new Request(`http://${req.headers.host}/api/contact`, {
            method: req.method,
            headers: req.headers,
            ...(!['GET', 'HEAD'].includes(req.method) ? { body: Buffer.concat(parts) } : {}),
          });
          const response = await handleContact(request, env);
          res.writeHead(response.status, Object.fromEntries(response.headers));
          res.end(await response.text());
        });
      },
    },
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    restoreMocks: true,
    clearMocks: true,
  },
});
