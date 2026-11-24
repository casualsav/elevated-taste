#!/usr/bin/env node
// Capture desktop + mobile screenshots and a raw computed-style profile from the
// ACTUAL exemplar sites, for private reference. Robots-aware, graceful per-URL.
//
//   node tooling/capture.mjs --url https://linear.app --slug linear --corpus production
//   node tooling/capture.mjs --corpus production --limit 4   # reads sources.json
//
// Screenshots -> corpus/<corpus>/screenshots/<slug>/{desktop,mobile}.png
// Raw style profile -> raw/<slug>.json  (normalized later, during distillation)

import { chromium, devices } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { urlAllowed } from './lib/robots.mjs';
import { PROBE_INIT, captureMotion } from './capture-motion.mjs';
import { craftProfile, captureStates, captureTheme, diffResponsive } from './capture-craft.mjs';
import { architectureProfile } from './capture-architecture.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA = process.env.CAPTURE_UA || 'web-design-taste-bot/0.1 (+https://localhost; respects robots.txt; private design reference)';

function parseArgs(argv) {
  const a = { limit: 4, settle: 1500, motion: true, stops: 11, frames: true, craft: true, code: true };
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--url') a.url = argv[++i];
    else if (t === '--slug') a.slug = argv[++i];
    else if (t === '--corpus') a.corpus = argv[++i];
    else if (t === '--limit') a.limit = parseInt(argv[++i], 10) || 4;
    else if (t === '--settle') a.settle = parseInt(argv[++i], 10) || 1500;
    else if (t === '--no-motion') a.motion = false;
    else if (t === '--no-frames') a.frames = false;
    else if (t === '--motion-stops') a.stops = parseInt(argv[++i], 10) || 11;
    else if (t === '--no-craft') a.craft = false;
    else if (t === '--no-code') a.code = false;
  }
  return a;
}

// Scroll through the page to trigger lazy/intro reveals, then return to top.
// Heavy WebGL-intro sites fire `networkidle` mid-preloader; --settle + this
// scroll lets the real content paint before the screenshot.
async function autoScroll(page, steps = 8, dy = 1200, pause = 350) {
  for (let i = 0; i < steps; i++) {
    await page.evaluate((y) => window.scrollBy(0, y), dy);
    await page.waitForTimeout(pause);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

const slugify = (s) =>
  s.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

// In-page computed-style sampler. Returns top-K frequent values per property +
// page meta. Approximate by design; distillation normalizes it (see ARCHITECTURE).
async function profilePage(page) {
  return page.evaluate(() => {
    const tally = {};
    const SKIP = new Set(['none','normal','auto','0px','0s','rgba(0, 0, 0, 0)','transparent','rgb(0, 0, 0)','0','start','repeat','0px 0px']);
    const bump = (cat, val) => {
      if (!val) return;
      val = String(val).trim();
      if (SKIP.has(val) || val.length > 140) return;
      (tally[cat] ||= {});
      tally[cat][val] = (tally[cat][val] || 0) + 1;
    };
    const els = Array.from(document.querySelectorAll('body *')).slice(0, 5000);
    for (const el of els) {
      const cs = getComputedStyle(el);
      bump('fontFamily', cs.fontFamily);
      bump('fontSize', cs.fontSize);
      bump('fontWeight', cs.fontWeight);
      bump('lineHeight', cs.lineHeight);
      bump('letterSpacing', cs.letterSpacing);
      bump('color', cs.color);
      bump('backgroundColor', cs.backgroundColor);
      bump('borderColor', cs.borderTopColor);
      bump('borderRadius', cs.borderTopLeftRadius);
      bump('boxShadow', cs.boxShadow);
      bump('paddingBlock', cs.paddingTop);
      bump('paddingInline', cs.paddingLeft);
      bump('gap', cs.columnGap);
      if (cs.transitionDuration && cs.transitionDuration !== '0s') {
        bump('transition', `${cs.transitionDuration} ${cs.transitionTimingFunction}`);
      }
    }
    const topK = (o, k = 14) =>
      Object.entries(o || {}).sort((a, b) => b[1] - a[1]).slice(0, k).map(([value, count]) => ({ value, count }));
    const result = {};
    for (const cat of Object.keys(tally)) result[cat] = topK(tally[cat]);
    result._meta = {
      title: document.title || '',
      description: document.querySelector('meta[name="description"]')?.content || '',
      headings: Array.from(document.querySelectorAll('h1,h2'))
        .slice(0, 10).map((h) => h.textContent.trim().replace(/\s+/g, ' ').slice(0, 140)).filter(Boolean),
      viewport: { w: window.innerWidth, h: window.innerHeight },
    };
    return result;
  });
}

// Pull the page's ACTUAL source code (not just pixels): full rendered outerHTML
// + every stylesheet's text — same-origin via cssRules, cross-origin re-fetched.
// Written to raw/<slug>.{html,css} (git-ignored) for the distiller to read.
async function capturePageCode(page) {
  const out = await page.evaluate(async () => {
    const CAP = 4_000_000; // ~4MB ceiling per file
    const html = document.documentElement.outerHTML.slice(0, CAP);
    let css = '', sheets = 0;
    for (const ss of Array.from(document.styleSheets)) {
      let rules = null;
      try { rules = ss.cssRules; } catch (e) { rules = null; } // cross-origin throws
      if (rules) {
        css += `\n/* === ${ss.href || 'inline <style>'} === */\n`;
        for (const r of Array.from(rules)) css += r.cssText + '\n';
        sheets++;
      } else if (ss.href) {
        try {
          const t = await (await fetch(ss.href)).text();
          css += `\n/* === ${ss.href} (fetched) === */\n${t}\n`;
          sheets++;
        } catch (e) { /* CORS-blocked; skip */ }
      }
      if (css.length > CAP) { css = css.slice(0, CAP); break; }
    }
    return { html, css, sheets };
  });
  return out;
}

async function captureOne(browser, { url, slug, corpus }, opts = {}) {
  const captureErrors = []; // which sub-captures failed; consumed by evolve's capture gate
  const settle = opts.settle ?? 1500;
  if (!(await urlAllowed(url, UA))) { console.warn(`  [robots] skip ${url}`); return null; }
  const shotDir = join(ROOT, 'corpus', corpus, 'screenshots', slug);
  mkdirSync(shotDir, { recursive: true });
  mkdirSync(join(ROOT, 'raw'), { recursive: true });

  let profile = null;
  let motion = null;
  let code = null;
  let craft = null, deskCraft = null, mobCraft = null, states = null;
  let arch = null;
  // desktop
  const dctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
  if (opts.motion !== false) await dctx.addInitScript(PROBE_INIT); // wrap APIs before page scripts run
  try {
    const dpage = await dctx.newPage();
    await dpage.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => dpage.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }));
    await dpage.waitForTimeout(settle);
    await autoScroll(dpage);
    await dpage.screenshot({ path: join(shotDir, 'desktop.png'), fullPage: true });
    profile = await profilePage(dpage);
    try { arch = await architectureProfile(dpage); } catch (e) { captureErrors.push({ stage: 'architecture', message: e.message }); console.warn(`  architecture failed ${url}: ${e.message}`); }
    if (opts.code !== false) {
      try { code = await capturePageCode(dpage); } catch (e) { captureErrors.push({ stage: 'code', message: e.message }); console.warn(`  code failed ${url}: ${e.message}`); }
    }
    if (opts.motion !== false) {
      try {
        motion = await captureMotion({ browser, page: dpage, url, slug, shotDir, viewport: { width: 1440, height: 900 }, UA, stops: opts.stops ?? 11, frames: opts.frames !== false });
      } catch (e) { captureErrors.push({ stage: 'motion', message: e.message }); console.warn(`  motion failed ${url}: ${e.message}`); }
    }
    if (opts.craft !== false) {
      deskCraft = await craftProfile(dpage);
      states = await captureStates(dpage).catch((e) => { captureErrors.push({ stage: 'states', message: e.message }); return null; });
    }
  } catch (e) { captureErrors.push({ stage: 'desktop', message: e.message }); console.warn(`  desktop failed ${url}: ${e.message}`); }
  await dctx.close();

  // mobile
  const mctx = await browser.newContext({ ...devices['iPhone 13'], userAgent: UA });
  try {
    const mpage = await mctx.newPage();
    await mpage.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => mpage.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }));
    await mpage.waitForTimeout(settle);
    await autoScroll(mpage, 6);
    await mpage.screenshot({ path: join(shotDir, 'mobile.png'), fullPage: true });
    if (opts.craft !== false) mobCraft = await craftProfile(mpage);
  } catch (e) { captureErrors.push({ stage: 'mobile', message: e.message }); console.warn(`  mobile failed ${url}: ${e.message}`); }
  await mctx.close();

  if (opts.craft !== false && deskCraft) {
    craft = { ...deskCraft, states, responsive: diffResponsive(deskCraft, mobCraft) };
    try { craft.theme = await captureTheme(browser, url, UA, { width: 1440, height: 900 }, shotDir); }
    catch (e) { captureErrors.push({ stage: 'theme', message: e.message }); console.warn(`  theme failed ${url}: ${e.message}`); }
  }
  if (motion) (profile ||= {}).motion = motion;
  if (craft) (profile ||= {}).craft = craft;
  if (arch) (profile ||= {}).architecture = arch;
  if (profile || captureErrors.length) {
    profile ||= {};
    // Sub-captures fail independently and this process still exits 0. Record WHICH ones failed
    // so the gate downstream can tell a whole capture from a hollowed-out one.
    if (captureErrors.length) profile.capture_errors = captureErrors;
    profile._source = { url, slug, corpus, captured_at: new Date().toISOString() };
    writeFileSync(join(ROOT, 'raw', `${slug}.json`), JSON.stringify(profile, null, 2) + '\n');
  }
  let codeNote = '';
  if (code) {
    if (code.html) writeFileSync(join(ROOT, 'raw', `${slug}.html`), code.html);
    if (code.css) writeFileSync(join(ROOT, 'raw', `${slug}.css`), code.css);
    codeNote = `  code: ${Math.round((code.html || '').length / 1024)}KB html, ${Math.round((code.css || '').length / 1024)}KB css (${code.sheets} sheets)`;
  }
  const m = motion?.summary;
  const mNote = m ? `  motion: ${m.scrollEffects} scroll fx, ${m.entranceReveals} entrance, ${m.hoverEffects} hover, IO=${m.usesIntersectionObserver}, libs=[${(m.libraries || []).join(', ')}]` : '';
  const cNote = craft ? `  craft: hamburger=${craft.responsive?.nav?.likely_hamburger}, dark=${craft.theme?.supportsDark}, focus-visible=${craft.a11y?.focus_visible}, shadows=${craft.elevation?.shadows?.length || 0}` : '';
  const ls = arch?.layers_summary;
  const aNote = ls ? `  arch: fixed=${ls.fixed} sticky=${ls.sticky} backdrop=${ls.has_static_backdrop} transparent=${arch.surfaces?.summary?.transparent_height_pct ?? 0}% tokens=${arch.tokens?.count ?? 0}` : '';
  const dNote = captureErrors.length ? `  DEGRADED: ${captureErrors.map((e) => e.stage).join(', ')}` : '';
  console.log(`  captured ${slug}  (shots: corpus/${corpus}/screenshots/${slug}/, profile: ${profile ? `raw/${slug}.json` : 'none'})${codeNote}${mNote}${cNote}${aNote}${dNote}`);
  return { slug, url, corpus };
}

function fromSources(corpus, limit) {
  const file = join(ROOT, 'corpus', corpus, 'sources.json');
  if (!existsSync(file)) return [];
  const list = JSON.parse(readFileSync(file, 'utf8'));
  return list.slice(0, limit).filter((e) => e.url).map((e) => ({ url: e.url, slug: e.slug || slugify(e.title || e.url), corpus }));
}

async function main() {
  const args = parseArgs(process.argv);
  let targets = [];
  if (args.url) {
    targets = [{ url: args.url, slug: args.slug || slugify(args.url), corpus: args.corpus || 'production' }];
  } else if (args.corpus) {
    targets = fromSources(args.corpus, args.limit);
    if (targets.length === 0) { console.error(`no sources for ${args.corpus} — run harvest first`); process.exit(1); }
  } else {
    console.error('usage: --url <url> --slug <slug> --corpus <c>   |   --corpus <c> --limit N');
    process.exit(1);
  }

  const browser = await chromium.launch();
  try {
    for (const t of targets) await captureOne(browser, t, args);
  } finally {
    await browser.close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
