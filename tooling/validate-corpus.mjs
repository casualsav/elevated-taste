#!/usr/bin/env node
/**
 * validate-corpus.mjs — corpus consistency gate (run in CI and after any distill/merge).
 *
 * Checks, all ERRORS (exit 1):
 *  1. Token contract — every `var(--x)` inside a pattern's ``` code fences must resolve:
 *     house tokens/tokens.json ∪ tokens/presets/*.json ∪ a local definition in the same file
 *     (`--x: …`, `style="--x: …"`, `setProperty('--x'…)`) ∪ an inline fallback `var(--x, value)`.
 *     Comments (<!-- --> and slash-star) inside fences are ignored.
 *  2. Controlled vocabulary — exemplar `when_to_use` ⊆ the distill-prompt list;
 *     `directions` ⊆ the five direction presets; `layout` (when present) ⊆ the 14-archetype
 *     list — a missing `layout` is legal (backfill in flight). (`tags` stay free-form.)
 *  3. Cross-references — every exemplar `patterns:` entry has a pattern file (same corpus
 *     preferred, cross-corpus allowed: expressive sites cite production motion recipes);
 *     every pattern `from:` has an exemplar (or is `house` for house-authored recipes);
 *     pattern frontmatter carries pattern/from/corpus/safety.
 *  4. sources.json sync — same slug set as the exemplar files (run reconcile-sources.mjs to fix).
 *
 *   node tooling/validate-corpus.mjs            # validate everything
 *   node tooling/validate-corpus.mjs --quiet    # errors only
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const QUIET = process.argv.includes('--quiet');
const CORPORA = ['production', 'expressive'];

export const WHEN_TO_USE = new Set(['landing', 'product-marketing', 'pricing', 'feature-section', 'hero', 'dashboard', 'data-table', 'settings', 'onboarding', 'auth', 'docs', 'changelog', 'blog', 'editorial', 'portfolio', 'agency', 'ecommerce', 'checkout', 'navigation', 'footer', 'forms', 'empty-state', 'brand-experience', 'interactive-showcase', 'hero-spectacle']);
export const DIRECTIONS = new Set(['minimalist', 'brutalist', 'soft', 'editorial', 'expressive']);
// layout — mirrors the "layout" bullet in distill-prompt.md's controlled retrieval vocabulary;
// missing is legal (the backfill is in flight across the existing corpus), an unknown value is not.
export const LAYOUT = new Set(['split-hero', 'center-stack', 'full-bleed', 'bento', 'dense-grid', 'editorial-columns', 'content-grid', 'app-shell', 'catalog', 'canvas-immersive', 'os-metaphor', 'collage', 'text-only', 'scroll-theater']);
// surface — what the capture actually shows (distill-prompt.md). Required: a marketing page that
// pictures a dashboard is `site`, not `app`, and coverage counts only real app screens for app jobs.
export const SURFACE = new Set(['app', 'docs', 'site']);
export const A11Y_FLAGS = new Set(['reduced-motion-respected', 'reduced-motion-ignored', 'focus-visible', 'focus-visible-missing', 'alt-coverage-high', 'alt-coverage-partial', 'alt-coverage-low', 'tap-targets-ok', 'tap-targets-risky']);
const PATTERN_SAFETY = new Set(['production-safe', 'spectacle-only']);

const errors = [];
const err = (msg) => errors.push(msg);

// ── house token names (tokens.json + presets, flattened to css var names) ────
function definedTokens() {
  const defined = new Set();
  const walk = (obj, path) => {
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('$')) continue;
      if (v && typeof v === 'object' && !('$value' in v)) walk(v, [...path, k]);
      else defined.add([...path, k].join('-'));
    }
  };
  walk(JSON.parse(readFileSync(join(ROOT, 'tokens/tokens.json'), 'utf8')), []);
  for (const f of readdirSync(join(ROOT, 'tokens/presets'))) {
    if (f.endsWith('.json')) walk(JSON.parse(readFileSync(join(ROOT, 'tokens/presets', f), 'utf8')), []);
  }
  return defined;
}

function fm(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
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

// ── 1. token contract ────────────────────────────────────────────────────────
function checkTokenContract(defined) {
  for (const corpus of CORPORA) {
    const dir = join(ROOT, 'corpus', corpus, 'patterns');
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
      const text = readFileSync(join(dir, f), 'utf8');
      let code = [...text.matchAll(/```[a-z]*\n([\s\S]*?)```/g)].map((m) => m[1]).join('\n');
      code = code.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
      const local = new Set();
      for (const m of code.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)) local.add(m[1].slice(2));
      for (const m of code.matchAll(/setProperty\(\s*['"](--[a-zA-Z0-9-]+)['"]/g)) local.add(m[1].slice(2));
      const bad = new Set();
      for (const m of code.matchAll(/var\((--[a-zA-Z0-9-]+)\s*(,)?/g)) {
        if (m[2]) continue; // inline fallback — self-contained
        const name = m[1].slice(2);
        if (!defined.has(name) && !local.has(name)) bad.add('--' + name);
      }
      if (bad.size) err(`token-contract corpus/${corpus}/patterns/${f}: unresolved ${[...bad].join(' ')}`);
    }
  }
}

// ── 2–3. exemplar vocab + cross-refs ─────────────────────────────────────────
function checkExemplars() {
  for (const corpus of CORPORA) {
    const dir = join(ROOT, 'corpus', corpus, 'exemplars');
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
      const rel = `corpus/${corpus}/exemplars/${f}`;
      const meta = fm(readFileSync(join(dir, f), 'utf8'));
      if (!meta) { err(`${rel}: no frontmatter`); continue; }
      if (!meta.slug) err(`${rel}: missing slug`);
      if (meta.slug && meta.slug !== f.replace(/\.md$/, '')) err(`${rel}: slug "${meta.slug}" != filename`);
      if (!meta.url) err(`${rel}: missing url`);
      for (const w of meta.when_to_use || []) if (!WHEN_TO_USE.has(w)) err(`${rel}: when_to_use "${w}" not in controlled vocabulary`);
      for (const d of meta.directions || []) if (!DIRECTIONS.has(d)) err(`${rel}: direction "${d}" not in {${[...DIRECTIONS].join(', ')}}`);
      for (const l of meta.layout || []) if (!LAYOUT.has(l)) err(`${rel}: layout "${l}" not in controlled vocabulary`); // absent field is legal — backfill in flight
      for (const a of meta.a11y || []) if (!A11Y_FLAGS.has(a)) err(`${rel}: a11y flag "${a}" not in controlled vocabulary`);
      if (!meta.surface) err(`${rel}: missing surface (app | docs | site)`);
      else if (!SURFACE.has(meta.surface)) err(`${rel}: surface "${meta.surface}" not in {${[...SURFACE].join(', ')}}`);
      for (const p of meta.patterns || []) {
        const anywhere = CORPORA.some((c) => existsSync(join(ROOT, 'corpus', c, 'patterns', `${p}.md`)));
        if (!anywhere) err(`${rel}: cited pattern "${p}" has no file in either corpus`);
      }
      if (!existsSync(join(ROOT, 'corpus', corpus, 'tokens', `${meta.slug}.json`))) err(`${rel}: tokens snapshot missing`);
    }
  }
}

function checkPatterns() {
  const exemplars = new Set();
  for (const corpus of CORPORA) {
    for (const f of readdirSync(join(ROOT, 'corpus', corpus, 'exemplars')).filter((x) => x.endsWith('.md'))) {
      exemplars.add(`${corpus}/${f.replace(/\.md$/, '')}`);
    }
  }
  for (const corpus of CORPORA) {
    const dir = join(ROOT, 'corpus', corpus, 'patterns');
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
      const rel = `corpus/${corpus}/patterns/${f}`;
      const meta = fm(readFileSync(join(dir, f), 'utf8'));
      if (!meta) { err(`${rel}: no frontmatter`); continue; }
      if (!meta.pattern) err(`${rel}: missing pattern field`);
      if (meta.pattern && meta.pattern !== f.replace(/\.md$/, '')) err(`${rel}: pattern "${meta.pattern}" != filename`);
      if (!meta.from) err(`${rel}: missing from (source exemplar)`);
      else if (meta.from !== 'house' && !exemplars.has(`${corpus}/${meta.from}`)) err(`${rel}: from "${meta.from}" has no exemplar in ${corpus}`);
      if (!PATTERN_SAFETY.has(meta.safety)) err(`${rel}: safety "${meta.safety || '(none)'}" must be production-safe|spectacle-only`);
    }
  }
}

// ── 4. sources.json sync ─────────────────────────────────────────────────────
function checkSources() {
  for (const corpus of CORPORA) {
    let sources = [];
    try { sources = JSON.parse(readFileSync(join(ROOT, 'corpus', corpus, 'sources.json'), 'utf8')); }
    catch { err(`corpus/${corpus}/sources.json: unreadable`); continue; }
    const srcSlugs = new Set(sources.map((e) => e.slug));
    const exSlugs = new Set(readdirSync(join(ROOT, 'corpus', corpus, 'exemplars')).filter((x) => x.endsWith('.md')).map((f) => f.replace(/\.md$/, '')));
    for (const s of exSlugs) if (!srcSlugs.has(s)) err(`corpus/${corpus}/sources.json: missing "${s}" (run tooling/reconcile-sources.mjs)`);
    for (const s of srcSlugs) if (!exSlugs.has(s)) err(`corpus/${corpus}/sources.json: stale entry "${s}" with no exemplar (run tooling/reconcile-sources.mjs)`);
  }
}

const defined = definedTokens();
checkTokenContract(defined);
checkExemplars();
checkPatterns();
checkSources();

if (errors.length) {
  console.error(`corpus INVALID — ${errors.length} error(s):`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
} else if (!QUIET) {
  console.log('corpus valid — token contract, vocabulary, cross-refs, sources all clean.');
}
