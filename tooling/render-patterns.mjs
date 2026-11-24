#!/usr/bin/env node
/**
 * render-patterns.mjs — render every pattern's reference implementation in a real browser.
 * The token contract proves a recipe's vars RESOLVE; this proves the recipe RUNS: no JS
 * exceptions, no console errors, no horizontal overflow at 1280 or 375 (the Stop-gate's own
 * mobile rule, applied to our own corpus).
 *
 *   node tooling/render-patterns.mjs --check                      # all patterns, exit 1 on failures
 *   node tooling/render-patterns.mjs --check corpus/…/foo.md      # just these files (distill vet)
 *   node tooling/render-patterns.mjs --gallery dist/patterns      # demo pages + screenshots + index
 *
 * Also exported: renderCheck(files) for the distill vet (evolve runs have Playwright).
 * Resource-load failures (missing /img placeholders) are expected in recipes and ignored;
 * only real console errors and pageerrors count.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function fm(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const obj = {};
  for (const line of m[1].split('\n')) {
    const ci = line.indexOf(':');
    if (ci === -1 || /^\s/.test(line)) continue;
    const key = line.slice(0, ci).trim();
    const val = line.slice(ci + 1).trim();
    obj[key] = /^\[.*\]$/.test(val)
      ? val.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
      : val.replace(/^["']|["']$/g, '');
  }
  return obj;
}

/** Assemble a pattern's fences into one document body (html raw, css wrapped, bash skipped). */
function recipeBody(md) {
  const parts = [];
  for (const m of md.matchAll(/```([a-z]*)\n([\s\S]*?)```/g)) {
    const lang = m[1] || 'html';
    if (lang === 'html' || lang === '') parts.push(m[2]);
    else if (lang === 'css') parts.push(`<style>\n${m[2]}\n</style>`);
    // bash/other fences are docs, not renderable recipe
  }
  return parts.join('\n').trim();
}

function harness(body, tokensCss) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${tokensCss}</style>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: var(--space-6, 2rem) 0; font-family: var(--font-sans, sans-serif);
         background: var(--color-bg, #fff); color: var(--color-fg, #111); }
  img { max-width: 100%; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

function patternFiles() {
  const out = [];
  for (const corpus of ['production', 'expressive']) {
    const dir = join(ROOT, 'corpus', corpus, 'patterns');
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) out.push(join(dir, f));
  }
  return out.sort();
}

async function withBrowser(fn) {
  const { chromium } = await import('playwright');
  // CHROMIUM_PATH: escape hatch for environments whose preinstalled browser build doesn't
  // match the pinned playwright version (CI installs its own; local dev may need this).
  const opts = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
  const browser = await chromium.launch(opts);
  try { return await fn(browser); } finally { await browser.close(); }
}

const IGNORABLE = /Failed to load resource|net::ERR_|favicon/i;

async function renderOne(page, file, tokensCss) {
  const md = readFileSync(file, 'utf8');
  const meta = fm(md);
  const slug = meta.pattern || basename(file, '.md');
  const body = recipeBody(md);
  if (!body) return { slug, file, skipped: 'no recipe fences' };

  const problems = [];
  const onConsole = (msg) => { if (msg.type() === 'error' && !IGNORABLE.test(msg.text())) problems.push(`console: ${msg.text().slice(0, 200)}`); };
  const onError = (e) => problems.push(`pageerror: ${String(e.message || e).slice(0, 200)}`);
  page.on('console', onConsole);
  page.on('pageerror', onError);
  try {
    for (const width of [1280, 375]) {
      await page.setViewportSize({ width, height: 800 });
      // real navigation first: setContent alone reuses the window's JS realm, so a recipe's
      // top-level `const` would collide with its previous render ("already declared")
      await page.goto('about:blank');
      await page.setContent(harness(body, tokensCss), { waitUntil: 'load', timeout: 15000 });
      await page.waitForTimeout(250); // let entrance JS run
      const overflow = await page.evaluate(() => {
        const el = document.scrollingElement || document.documentElement;
        return el.scrollWidth - window.innerWidth;
      });
      if (overflow > 1) problems.push(`horizontal overflow at ${width}px (+${overflow}px)`);
    }
  } catch (e) {
    problems.push(`render: ${String(e.message || e).slice(0, 200)}`);
  }
  page.off('console', onConsole);
  page.off('pageerror', onError);
  return { slug, file, meta, body, problems };
}

/** Exported vet: render the given pattern files, return { ok, failures }. */
export async function renderCheck(files) {
  const tokensCss = readFileSync(join(ROOT, 'tokens', 'tokens.css'), 'utf8');
  return withBrowser(async (browser) => {
    const page = await browser.newPage();
    const failures = [];
    let checked = 0;
    for (const file of files) {
      const r = await renderOne(page, file, tokensCss);
      if (r.skipped) continue;
      checked++;
      if (r.problems.length) failures.push({ file: r.file, slug: r.slug, problems: r.problems });
    }
    return { ok: failures.length === 0, checked, failures };
  });
}

// ── gallery ───────────────────────────────────────────────────────────────────
function galleryIndex(entries) {
  const card = (e) => `      <li class="pg-card" data-corpus="${e.meta.corpus}">
        <a class="pg-shot" href="${e.slug}.html"><img loading="lazy" src="img/${e.slug}.webp" alt="${e.slug} rendered"></a>
        <div class="pg-meta">
          <h2>${e.slug}</h2>
          <p class="mono">from ${e.meta.from || 'house'} · ${e.meta.corpus} · ${e.meta.safety || ''}${e.meta.trigger ? ' · ' + e.meta.trigger : ''}</p>
        </div>
      </li>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pattern gallery — the taste corpus</title>
<link rel="stylesheet" href="../css/style.css">
<style>
  /* gallery-specific layout on the directory site's tokens */
  .pg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-6) var(--space-5); padding-block: var(--space-7) var(--space-9); }
  .pg-card { display: flex; flex-direction: column; gap: var(--space-2); }
  .pg-shot { display: block; border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; background: var(--color-surface); box-shadow: var(--shadow-sm); }
  .pg-shot img { display: block; width: 100%; height: 200px; object-fit: cover; object-position: top; }
  .pg-card h2 { font-size: var(--text-md); font-weight: var(--weight-medium); }
  .pg-meta p { color: var(--color-subtle); font-size: var(--text-xs); margin-top: var(--space-1); }
</style>
</head>
<body>
  <header class="masthead"><div class="wrap">
    <p class="kicker mono">Web-design-taste · corpus</p>
    <h1 class="masthead__title">The pattern gallery</h1>
    <p style="margin-top:var(--space-4);color:var(--color-muted)">${entries.length} reference implementations, rendered live from the corpus recipes. Click any card for the standalone demo. <a href="../" style="text-decoration:underline">Exemplar directory</a></p>
  </div></header>
  <main class="wrap"><ol class="pg-grid">
${entries.map(card).join('\n')}
  </ol></main>
</body>
</html>
`;
}

async function buildGallery(outDir) {
  const tokensCss = readFileSync(join(ROOT, 'tokens', 'tokens.css'), 'utf8');
  mkdirSync(join(outDir, 'img'), { recursive: true });
  return withBrowser(async (browser) => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const entries = [];
    const failures = [];
    for (const file of patternFiles()) {
      const r = await renderOne(page, file, tokensCss);
      if (r.skipped) continue;
      if (r.problems.length) { failures.push(r); continue; } // broken recipes never ship to the gallery
      writeFileSync(join(outDir, `${r.slug}.html`), harness(r.body, tokensCss));
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.screenshot({ path: join(outDir, 'img', `${r.slug}.webp`), type: 'jpeg', quality: 80 }).catch(async () => {
        await page.screenshot({ path: join(outDir, 'img', `${r.slug}.webp`) });
      });
      entries.push(r);
    }
    writeFileSync(join(outDir, 'index.html'), galleryIndex(entries));
    return { entries, failures };
  });
}

// ── CLI ───────────────────────────────────────────────────────────────────────
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const args = process.argv.slice(2);
  const gIdx = args.indexOf('--gallery');
  if (gIdx !== -1) {
    const outDir = args[gIdx + 1];
    if (!outDir) { console.error('usage: render-patterns.mjs --gallery <outdir>'); process.exit(1); }
    const { entries, failures } = await buildGallery(outDir);
    console.log(`gallery: ${entries.length} pattern demo(s) -> ${outDir}`);
    if (failures.length) {
      console.error(`${failures.length} recipe(s) failed to render and were EXCLUDED:`);
      for (const f of failures) console.error(`  ✗ ${f.slug}: ${f.problems.join(' · ')}`);
      process.exit(1);
    }
  } else {
    const files = args.filter((a) => !a.startsWith('--'));
    const { ok, checked, failures } = await renderCheck(files.length ? files : patternFiles());
    console.log(`render-check: ${checked} recipe(s) rendered, ${failures.length} failing`);
    for (const f of failures) {
      console.error(`  ✗ ${f.slug}`);
      for (const p of f.problems) console.error(`      ${p}`);
    }
    process.exit(ok ? 0 : 1);
  }
}
