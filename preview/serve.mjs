// Zero-config static dev server for previewing token style guides and pattern
// reference implementations. Serves the repo root so you can open the built
// tokens.css, preview/index.html, and corpus/**/patterns/*.html directly.
//   npm run preview   ->  http://localhost:4321/preview/
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, resolve, sep } from 'node:path';

const ROOT = resolve(process.cwd());
const PORT = Number(process.env.PORT) || 4321;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

const server = createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/') pathname = '/preview/';
    if (pathname.endsWith('/')) pathname += 'index.html';
    const fp = normalize(join(ROOT, pathname));
    // require the separator: bare startsWith(ROOT) would admit sibling dirs like ROOT + '-secrets'
    if (fp !== ROOT && !fp.startsWith(ROOT + sep)) { res.writeHead(403); return res.end('forbidden'); }
    // never serve the private captures, even on localhost
    const rel = fp.slice(ROOT.length + 1);
    if (rel === 'raw' || rel.startsWith('raw' + sep) || /(^|[\\/])screenshots([\\/]|$)/.test(rel)) { res.writeHead(403); return res.end('forbidden'); }
    const s = await stat(fp).catch(() => null);
    if (!s || s.isDirectory()) { res.writeHead(404); return res.end('not found'); }
    const body = await readFile(fp);
    res.writeHead(200, { 'content-type': MIME[extname(fp)] || 'application/octet-stream' });
    res.end(body);
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
});

server.listen(PORT, () => console.log(`preview: http://localhost:${PORT}/preview/`));
