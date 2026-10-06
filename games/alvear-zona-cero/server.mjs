import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const parts = ['chunk0.txt', 'chunk1.txt', 'p4.txt', 'p5.txt', 'chunk3.txt'];
const b64 = parts
  .map(name => readFileSync(new URL(`./${name}`, import.meta.url), 'utf8').trim())
  .join('');

const html = gunzipSync(Buffer.from(b64, 'base64')).toString('utf8');

Bun.serve({
  port: Number(process.env.PORT || 3000),
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === '/health') {
      return new Response('ok', {
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'cache-control': 'no-store'
        }
      });
    }
    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
        'pragma': 'no-cache',
        'expires': '0',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'no-referrer'
      }
    });
  }
});
