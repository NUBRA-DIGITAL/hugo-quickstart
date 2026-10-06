import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const b64 = [0, 1, 2, 3]
  .map(i => readFileSync(new URL(`./chunk${i}.txt`, import.meta.url), 'utf8').trim())
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
