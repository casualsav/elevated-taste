/**
 * Screenshot forcing function — the VISUAL half of the Stop-gate.
 *
 * WHY: static lint and the 375px overflow check catch mechanical tells, but they can't see
 * "this looks generic / cramped / lifeless." Nothing in the pipeline made the model actually
 * LOOK at what it shipped. At build-scale, once the mechanical checks are clean, the Stop-gate
 * captures desktop + mobile screenshots of the standalone HTML and blocks ONCE, handing the
 * PNG paths back so the model reads them (the Read tool renders images) and judges them
 * against the corpus principles/anti-patterns. Costs exactly one extra round.
 *
 * Reuses the serving + Chromium plumbing from responsive-check.mjs (same HTTP-serve shape so
 * root-absolute /tokens/… refs resolve). FAIL-OPEN by construction, exactly like that module:
 *   - only standalone .html/.htm can be rendered; capped at 3 files so the round stays cheap.
 *   - no Playwright / no Chromium → { ran:false, reason } (the gate folds it into a note, never
 *     blocks).
 *   - every capture is independently guarded; one bad page can't abort the batch.
 *   - any internal error → { ran:false }. It never throws.
 *
 * Shots land in .claude/.cache/design-shots/<basename>-<width>.png (gitignored), fullPage:false
 * (viewport only — we're judging the above-the-fold impression at each width, not a long dump).
 */
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename, extname, normalize, relative, sep } from 'node:path';
import { serveRoot, loadChromium, isHtml } from './responsive-check.mjs';

const SHOTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
];

/**
 * @param {string[]} files  absolute paths touched this session
 * @param {object}   opts   { repo, cap=3, perPageMs=8000, settleMs=600, budgetMs=25000 }
 * @returns {Promise<{ran:boolean, reason?:string, shots?:{file,width,path}[]}>}
 */
export async function captureShots(files, opts = {}) {
  const repo = normalize(opts.repo || process.cwd());
  const cap = opts.cap ?? 3;
  const perPageMs = opts.perPageMs ?? 8000;
  const settleMs = opts.settleMs ?? 600;
  const budgetMs = opts.budgetMs ?? 25000;
  const t0 = Date.now();

  const targets = (files || [])
    .map((f) => normalize(f))
    .filter((f) => isHtml(f) && existsSync(f))
    .slice(0, cap);
  if (!targets.length) return { ran: false, reason: 'no-standalone-html' };
  const inRepo = (f) => f === repo || f.startsWith(repo + sep);

  const { chromium, reason: noChromium } = await loadChromium();
  if (!chromium) return { ran: false, reason: noChromium };

  const outDir = join(repo, '.claude', '.cache', 'design-shots');
  try { await mkdir(outDir, { recursive: true }); } catch { return { ran: false, reason: 'no-outdir' }; }

  let browser;
  const servers = new Map(); // root -> { origin, close }
  const serverFor = async (root) => {
    if (!servers.has(root)) servers.set(root, await serveRoot(root));
    return servers.get(root);
  };
  try {
    browser = await chromium.launch();
    const shots = [];
    outer: for (const file of targets) {
      const root = inRepo(file) ? repo : normalize(join(file, '..'));
      const server = await serverFor(root);
      const url = server.origin + '/' + relative(root, file).split(sep).map(encodeURIComponent).join('/');
      const stem = basename(file, extname(file));
      for (const shot of SHOTS) {
        if (Date.now() - t0 > budgetMs) break outer; // out of time → return what we have
        let ctx;
        try {
          ctx = await browser.newContext({ viewport: { width: shot.width, height: shot.height }, deviceScaleFactor: 1 });
          const page = await ctx.newPage();
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: perPageMs });
          await page.waitForTimeout(settleMs);
          const path = join(outDir, `${stem}-${shot.width}.png`);
          await page.screenshot({ path, fullPage: false });
          shots.push({ file, width: shot.width, path });
        } catch { /* skip this capture, fail-open */ }
        finally { if (ctx) await ctx.close().catch(() => {}); }
      }
    }
    return { ran: true, shots };
  } catch (e) {
    return { ran: false, reason: 'error:' + (e && e.message ? e.message : String(e)) };
  } finally {
    if (browser) await browser.close().catch(() => {});
    for (const s of servers.values()) await s.close().catch(() => {});
  }
}
