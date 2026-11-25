#!/usr/bin/env node
/**
 * build-index.mjs — generate corpus/index.json, the single machine-readable retrieval
 * index over both corpora. This is what a consuming agent (or the /compose flow) reads
 * INSTEAD of listing 150+ files: one fetch answers "which exemplars/patterns fit this
 * build, what palette/motion do they carry, which tokens does a recipe need".
 *
 * Everything here is DERIVED — exemplar frontmatter, pattern frontmatter + recipe scan,
 * token snapshots. Never edit index.json by hand; re-run this after any corpus change.
 *
 *   node tooling/build-index.mjs          # writes corpus/index.json
 *   npm run index:build
 */
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CORPORA = ['production', 'expressive'];

function fm(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const obj = {};
  for (const line of m[1].split('\n')) {
    const ci = line.indexOf(':');
    if (ci === -1 || /^\s/.test(line)) continue;
    const key = line.slice(0, ci).trim();
    const val = line.slice(ci + 1).trim();
    if (val === '') continue; // nested block (provenance:) — not needed here
    obj[key] = /^\[.*\]$/.test(val)
      ? val.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
      : val.replace(/^["']|["']$/g, '');
  }
  return obj;
}

/** First sentence (or first line) of the section following `## <title>`. */
function sectionSummary(md, title) {
  const m = md.match(new RegExp(`^## ${title}\\s*\\n+([\\s\\S]*?)(?=\\n## |$)`, 'm'));
  if (!m) return null;
  const para = m[1].trim().split(/\n\n/)[0].replace(/\s+/g, ' ').trim();
  const sentence = para.match(/^.*?[.!?](\s|$)/)?.[0]?.trim() || para;
  return sentence.length > 220 ? sentence.slice(0, 217) + '…' : sentence;
}

function tokensSummary(corpus, slug) {
  try {
    const t = JSON.parse(readFileSync(join(ROOT, 'corpus', corpus, 'tokens', `${slug}.json`), 'utf8'));
    const roles = t.color?.roles || t.color || {};
    return {
      palette: {
        bg: t.color?.bg ?? roles.bg ?? null,
        surface: t.color?.surface ?? roles.surface ?? null,
        fg: t.color?.fg ?? roles.fg ?? null,
        muted: t.color?.muted ?? roles.muted ?? null,
        accent: t.color?.accent ?? roles.accent ?? null,
      },
      fonts: t.type?.families || [],
      weights: t.type?.weights || [],
      motion: t.motion ? {
        durations: t.motion.durations || [],
        easings: t.motion.easings || [],
        triggers: t.motion.triggers || [],
        techniques: t.motion.techniques || [],
        reduced_motion: t.motion.reduced_motion || 'unknown',
        stack: t.motion.stack || [],
      } : null,
    };
  } catch { return { palette: null, fonts: [], weights: [], motion: null }; }
}

/** House + preset token names, for classifying a recipe's var() references. */
function houseTokens() {
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

function recipeScan(text, house) {
  let code = [...text.matchAll(/```[a-z]*\n([\s\S]*?)```/g)].map((m) => m[1]).join('\n');
  const hasRecipe = code.trim().length > 0;
  const hasJs = /<script|addEventListener|IntersectionObserver|requestAnimationFrame/.test(code);
  code = code.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const requires = new Set(); // house tokens the recipe consumes
  const knobs = new Set();    // pattern-local vars with inline fallbacks (themeable)
  for (const m of code.matchAll(/var\((--[a-zA-Z0-9-]+)\s*(,)?/g)) {
    const name = m[1].slice(2);
    if (house.has(name)) requires.add('--' + name);
    else if (m[2]) knobs.add('--' + name);
  }
  return { hasRecipe, hasJs, requires: [...requires].sort(), knobs: [...knobs].sort() };
}

// ── walk corpora ─────────────────────────────────────────────────────────────
const house = houseTokens();
const exemplars = [];
const patterns = [];
const patternMeta = new Map(); // `${corpus}/${slug}` -> pattern entry (for enrichment)
const citedBy = new Map();     // `${corpus}/${patternSlug}` -> [exemplar slugs]

for (const corpus of CORPORA) {
  for (const f of readdirSync(join(ROOT, 'corpus', corpus, 'exemplars')).filter((x) => x.endsWith('.md')).sort()) {
    const md = readFileSync(join(ROOT, 'corpus', corpus, 'exemplars', f), 'utf8');
    const meta = fm(md);
    if (!meta) continue;
    const slug = meta.slug || f.replace(/\.md$/, '');
    for (const p of meta.patterns || []) {
      const key = `${corpus}/${p}`;
      if (!citedBy.has(key)) citedBy.set(key, []);
      citedBy.get(key).push(slug);
    }
    exemplars.push({
      slug, corpus,
      url: meta.url || null,
      surface: meta.surface || null,
      tags: meta.tags || [],
      when_to_use: meta.when_to_use || [],
      directions: meta.directions || [],
      layout: meta.layout || [], // sparse until the layout backfill lands — [] means "not yet tagged", not "none"
      a11y: meta.a11y || [],
      patterns: meta.patterns || [],
      captured: meta.captured || null,
      award_type: meta.award_type || null,
      summary: sectionSummary(md, 'What works'),
      ...tokensSummary(corpus, slug),
    });
  }

  for (const f of readdirSync(join(ROOT, 'corpus', corpus, 'patterns')).filter((x) => x.endsWith('.md')).sort()) {
    const md = readFileSync(join(ROOT, 'corpus', corpus, 'patterns', f), 'utf8');
    const meta = fm(md);
    if (!meta) continue;
    const slug = meta.pattern || f.replace(/\.md$/, '');
    const entry = {
      slug, corpus,
      from: meta.from || null,
      safety: meta.safety || null,
      trigger: meta.trigger || null,
      tags: meta.tags || [],
      summary: sectionSummary(md, 'What it is'),
      // derived retrieval fields (enriched from the source exemplar below)
      when_to_use: [],
      directions: [],
      pairs_with: [],
      ...recipeScan(md, house),
    };
    patterns.push(entry);
    patternMeta.set(`${corpus}/${slug}`, entry);
  }
}

// enrich patterns from their source exemplar + co-citation
const exByKey = new Map(exemplars.map((e) => [`${e.corpus}/${e.slug}`, e]));
for (const p of patterns) {
  const src = exByKey.get(`${p.corpus}/${p.from}`);
  if (src) {
    p.when_to_use = src.when_to_use;
    p.directions = src.directions;
  }
  // pairs_with: patterns co-extracted/co-cited on the same exemplar(s)
  const pairs = new Set();
  for (const exSlug of citedBy.get(`${p.corpus}/${p.slug}`) || []) {
    const ex = exByKey.get(`${p.corpus}/${exSlug}`);
    for (const other of ex?.patterns || []) if (other !== p.slug) pairs.add(other);
  }
  p.pairs_with = [...pairs].sort();
}

const index = {
  $schema_note: 'GENERATED by tooling/build-index.mjs — do not edit. Retrieval index over both corpora: filter exemplars/patterns by when_to_use + directions + tags, then read only the files you need.',
  counts: {
    exemplars: exemplars.length,
    patterns: patterns.length,
    production: { exemplars: exemplars.filter((e) => e.corpus === 'production').length, patterns: patterns.filter((p) => p.corpus === 'production').length },
    expressive: { exemplars: exemplars.filter((e) => e.corpus === 'expressive').length, patterns: patterns.filter((p) => p.corpus === 'expressive').length },
  },
  vocabulary: {
    when_to_use: [...new Set(exemplars.flatMap((e) => e.when_to_use))].sort(),
    directions: ['minimalist', 'brutalist', 'soft', 'editorial', 'expressive'],
    tags: [...new Set(exemplars.flatMap((e) => e.tags))].sort(),
  },
  exemplars,
  patterns,
};

const indexPath = join(ROOT, 'corpus', 'index.json');
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');

// ── summary index ────────────────────────────────────────────────────────────
// A light retrieval-only view (no palette/motion/knobs). tooling/query.mjs is the
// preferred entry point; this file exists for a quick whole-corpus skim under budget.
// summary strings are for skimming only; strip markdown emphasis and cap to one clause so
// the summary view stays well under budget. The full summary lives in index.json.
function clip(s) {
  if (!s) return null;
  const plain = s.replace(/\*\*|__|`/g, '');
  return plain.length > 90 ? plain.slice(0, 87).replace(/\s+\S*$/, '') + '…' : plain;
}
const summary = {
  $schema_note: 'GENERATED by tooling/build-index.mjs — do not edit. Light summary view for skimming; prefer tooling/query.mjs (npm run query) for scored retrieval, and read corpus/index.json for a shortlisted entry\'s full palette/motion/tokens.',
  counts: index.counts,
  vocabulary: index.vocabulary,
  exemplars: exemplars.map((e) => ({
    slug: e.slug, corpus: e.corpus, surface: e.surface, tags: e.tags,
    when_to_use: e.when_to_use, directions: e.directions, layout: e.layout, summary: clip(e.summary),
  })),
  patterns: patterns.map((p) => ({
    slug: p.slug, corpus: p.corpus, from: p.from, safety: p.safety,
    tags: p.tags, when_to_use: p.when_to_use, summary: clip(p.summary),
  })),
};
const summaryPath = join(ROOT, 'corpus', 'index.summary.json');
// compact (no pretty-print): this is a machine-skim view, never hand-edited, and the
// 2-space indent roughly triples the array-heavy payload.
writeFileSync(summaryPath, JSON.stringify(summary) + '\n');

const kb = (p) => (statSync(p).size / 1024).toFixed(1) + 'KB';
console.log(`corpus/index.json: ${exemplars.length} exemplars, ${patterns.length} patterns (${kb(indexPath)}); index.summary.json (${kb(summaryPath)}).`);
