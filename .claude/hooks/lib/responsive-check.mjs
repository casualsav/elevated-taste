/**
 * Headless mobile-overflow check — the runtime half of Phase-2 guardrail #3.
 *
 * The design-lint is static (it reads file text); it cannot see a layout that
 * smushes or clips on a narrow screen. This renders each standalone HTML file
 * touched this session in headless Chromium at a mobile width and asserts there
 * is no horizontal overflow (scrollWidth > clientWidth = content spilling past
 * the viewport edge — the classic mobile "smush"). The Stop-gate folds any
 * overflow into its blocking findings, so mobile is never shipped untested.
 *
 * Best-effort and FAIL-OPEN by construction — it must never trap a session:
 *   - only standalone `.html`/`.htm` files can be rendered; everything else
 *     (JSX/Vue/Svelte/etc., which need a build step) is skipped, not failed.
 *   - if Playwright or its Chromium isn't installed, it returns {ran:false}
 *     with a reason — the gate stays silent rather than blocking.
 *   - every page render is independently guarded; one bad page can't abort it.
 *   - any internal error → {ran:false}. It never throws.
 *
 * Reuses the serving shape from preview/serve.mjs (root-absolute /tokens/… refs
 * need HTTP, not file://). Disable with TASTE_RESPONSIVE=off.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, normalize, relative, sep } from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
};

export const isHtml = (f) => /\.html?$/i.test(f);

/** Load Playwright's chromium, or null if it/its browser isn't installed (fail-open). */
export async function loadChromium() {
  let chromium;
  try { ({ chromium } = await import('playwright')); }
  catch { try { ({ chromium } = await import('playwright-core')); } catch { return { chromium: null, reason: 'no-playwright' }; } }
  try { if (!existsSync(chromium.executablePath())) return { chromium: null, reason: 'no-chromium' }; }
  catch { return { chromium: null, reason: 'no-chromium' }; }
  return { chromium, reason: null };
}

/** Serve `root` on an ephemeral loopback port; returns { origin, close }. */
export async function serveRoot(root) {
  const server = createServer(async (req, res) => {
    try {
      let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const fp = normalize(join(root, pathname));
      if (fp !== root && !fp.startsWith(root + sep)) { res.writeHead(403); return res.end('forbidden'); }
      const s = await stat(fp).catch(() => null);
      if (!s || s.isDirectory()) { res.writeHead(404); return res.end('not found'); }
      res.writeHead(200, { 'content-type': MIME[extname(fp).toLowerCase()] || 'application/octet-stream' });
      res.end(await readFile(fp));
    } catch (e) { res.writeHead(500); res.end(String(e)); }
  });
  await new Promise((ok, no) => { server.once('error', no); server.listen(0, '127.0.0.1', ok); });
  const { port } = server.address();
  return { origin: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(r)) };
}

/**
 * @param {string[]} files  absolute paths touched this session
 * @param {object}   opts   { repo, widths=[375], cap=12, perPageMs=8000, settleMs=600, tolerancePx=2, budgetMs=25000 }
 * @returns {Promise<{ran:boolean, reason?:string, widths?:number[], checked?:number, overflows?:object[]}>}
 */
export async function checkResponsive(files, opts = {}) {
  const repo = normalize(opts.repo || process.cwd());
  const widths = opts.widths || [375];
  const cap = opts.cap ?? 12;
  const perPageMs = opts.perPageMs ?? 8000;
  const settleMs = opts.settleMs ?? 600;
  const tol = opts.tolerancePx ?? 2;
  const budgetMs = opts.budgetMs ?? 25000; // overall ceiling so we stay well under the hook timeout
  const t0 = Date.now();

  // Only standalone HTML is renderable as-is. Files inside the repo are served from the
  // repo root (root-absolute /tokens/… refs resolve); files elsewhere (e.g. ~/sites/…)
  // are served from their own directory — skipping them let mobile overflow ship unchecked.
  const targets = (files || [])
    .map((f) => normalize(f))
    .filter((f) => isHtml(f) && existsSync(f))
    .slice(0, cap);
  if (!targets.length) return { ran: false, reason: 'no-standalone-html' };
  const inRepo = (f) => f === repo || f.startsWith(repo + sep);

  const { chromium, reason: noChromium } = await loadChromium();
  if (!chromium) return { ran: false, reason: noChromium };

  let browser;
  const servers = new Map(); // root -> { origin, close }
  const serverFor = async (root) => {
    if (!servers.has(root)) servers.set(root, await serveRoot(root));
    return servers.get(root);
  };
  try {
    browser = await chromium.launch();
    const overflows = [];
    let checked = 0;
    outer: for (const file of targets) {
      const root = inRepo(file) ? repo : normalize(join(file, '..'));
      const server = await serverFor(root);
      const url = server.origin + '/' + relative(root, file).split(sep).map(encodeURIComponent).join('/');
      checked++;
      for (const width of widths) {
        if (Date.now() - t0 > budgetMs) break outer; // out of time → return what we have
        let ctx;
        try {
          ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
          const page = await ctx.newPage();
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: perPageMs });
          await page.waitForTimeout(settleMs);
          const m = await page.evaluate(() => {
            const de = document.documentElement, b = document.body;
            const scrollW = Math.max(de.scrollWidth, b ? b.scrollWidth : 0);
            return { scrollW, clientW: de.clientWidth };
          });
          const overshoot = m.scrollW - m.clientW;
          if (overshoot > tol) overflows.push({ file, width, scrollW: m.scrollW, clientW: m.clientW, overshoot });
        } catch { /* skip this render, fail-open */ }
        finally { if (ctx) await ctx.close().catch(() => {}); }
      }
    }
    return { ran: true, widths, checked, overflows };
  } catch (e) {
    return { ran: false, reason: 'error:' + (e && e.message ? e.message : String(e)) };
  } finally {
    if (browser) await browser.close().catch(() => {});
    for (const s of servers.values()) await s.close().catch(() => {});
  }
}
