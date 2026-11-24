// Minimal single-file static host for a temporary public demo (cloudflared/tailscale
// in front). Serves one HTML file for ANY path, re-read per request so edits show on
// refresh. Not part of the corpus tooling — a throwaway preview host.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const FILE = join(ROOT, process.env.DEMO_FILE || 'attio-mobile.html');
const PORT = Number(process.env.PORT) || 8799;

createServer((req, res) => {
  if (req.url === '/healthz') { res.writeHead(200, { 'content-type': 'text/plain' }); return res.end('ok'); }
  try {
    const body = readFileSync(FILE);
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    res.end(body);
  } catch (e) {
    res.writeHead(500, { 'content-type': 'text/plain' }); res.end('error: ' + e.message);
  }
}).listen(PORT, '127.0.0.1', () => console.log(`demo http://127.0.0.1:${PORT}  (file: ${FILE})`));
