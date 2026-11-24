#!/usr/bin/env node
/**
 * build-sheet.mjs — the DONOR-SELECTION ENGINE. Kills the "same look every build" failure by
 * making layout-archetype + per-layer donor choice a deterministic ENGINE decision instead of
 * a model preference (which defaults to split-hero + whichever 2-3 exemplars it remembers).
 *
 * WHAT IT ENFORCES, AND WHY:
 *  - Deterministic, no randomness: same --brief + same recent-donors history ⇒ byte-identical
 *    output. Variety across builds comes from HISTORY PRESSURE — a hard ban on donors used in
 *    the last 6 builds, a heavy recency penalty on recently-used layout archetypes, split-hero
 *    rationed to at most once per 5 builds — never from a coin flip. A session re-running the
 *    same brief twice must get the same answer; the fifth build in a row must not look like
 *    the first four.
 *  - Layout is chosen BEFORE donors, so the "layout" layer's donor search is constrained to
 *    exemplars that actually embody the chosen archetype (or the closest tag proxy while the
 *    corpus-wide `layout` backfill is still landing — treat it as present-but-sparse, never
 *    crash on its absence).
 *  - Bold-tilt: unless the brief/--direction explicitly asks for quiet/minimalist, at least
 *    one donor must carry `brutalist` or `expressive` — counters the model's quiet-minimal
 *    default.
 *  - Donor ranking reuses tooling/query.mjs's `scoreEntry`/`rankEntries` (imported, not
 *    forked) so "how a donor is scored" stays one rule shared by the human-facing query tool
 *    and this engine.
 *
 *   node tooling/build-sheet.mjs --brief "…" [--corpus production|expressive|both] \
 *     [--direction minimalist] [--when dashboard,pricing] [--tags dark,saas] \
 *     [--out <project-dir>] [--json]
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { has, rankEntries, scoreEntry, tokenizeBrief } from './query.mjs';
import { readRecent } from './recent-donors.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Mirrors the 14-archetype controlled vocabulary in distill-prompt.md (also re-declared, not
// imported, in validate-corpus.mjs's LAYOUT set). Duplicated rather than imported: validate-
// corpus.mjs is a side-effecting CLI script — importing it runs the FULL corpus check and can
// process.exit(1) on unrelated repo drift (e.g. today's in-flight sources.json edits), which
// would make this engine's exit code depend on things it has nothing to do with.
const LAYOUT_VOCAB = ['split-hero', 'center-stack', 'full-bleed', 'bento', 'dense-grid', 'editorial-columns', 'content-grid', 'app-shell', 'catalog', 'canvas-immersive', 'os-metaphor', 'collage', 'text-only', 'scroll-theater'];
// layout-ish tags used as a fallback candidate signal while `layout` frontmatter is sparse.
const LAYOUT_TAGS = ['dense-grid', 'full-bleed', 'bento', 'content-grid', 'app-shell', 'catalog', 'os-metaphor', 'text-only', 'collage', 'scroll-theater'];
// Below this many distinct archetypes observed in-corpus, don't trust the index alone as the
// candidate set (too thin to be a real signal this early in the backfill) — widen via tags.
const MIN_LAYOUT_COVERAGE = 3;

// when_to_use term -> archetypes it fits. Anything not listed (landing, product-marketing,
// hero, footer, …) is intentionally an OPEN FIELD — no nudge, let recency/tie-break decide.
const WHEN_LAYOUT_FIT = {
  dashboard: ['app-shell', 'dense-grid'], 'data-table': ['dense-grid', 'app-shell'],
  settings: ['app-shell'], navigation: ['app-shell'],
  ecommerce: ['catalog', 'content-grid'], checkout: ['content-grid', 'center-stack'],
  pricing: ['content-grid', 'bento'], 'feature-section': ['bento', 'content-grid'],
  portfolio: ['canvas-immersive', 'collage'], agency: ['canvas-immersive', 'collage', 'scroll-theater'],
  'brand-experience': ['scroll-theater', 'canvas-immersive'],
  'interactive-showcase': ['os-metaphor', 'canvas-immersive'],
  'hero-spectacle': ['scroll-theater', 'full-bleed'],
  editorial: ['editorial-columns', 'text-only'], blog: ['editorial-columns', 'text-only'],
  docs: ['text-only', 'editorial-columns'],
  forms: ['center-stack'], auth: ['center-stack'], onboarding: ['center-stack'], 'empty-state': ['center-stack'],
};

const LAYERS = ['palette', 'type', 'motion', 'layout', 'imagery'];
// exemplar-preset.mjs token fields a layer maps onto; layout/imagery aren't token fields —
// layout is fed as --layout-donor, imagery is guidance-only (no token snapshot field exists).
const PRESET_FIELD = { palette: 'color', type: 'type', motion: 'motion' };
// repair-pass order: touch flavor layers (imagery, layout) before structural ones (type,
// palette) so a forced swap disturbs the strongest-scoring picks least.
const REPAIR_ORDER = ['imagery', 'layout', 'motion', 'type', 'palette'];

// ── args ─────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (!t.startsWith('--')) continue;
    const key = t.slice(2);
    if (key === 'json') { a[key] = true; continue; }
    a[key] = argv[i + 1]; i++;
  }
  return a;
}
const list = (v) => (v ? String(v).split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : []);
const args = parseArgs(process.argv.slice(2));

if (!args.brief) {
  console.error('usage: node tooling/build-sheet.mjs --brief "…" [--corpus production|expressive|both] [--direction d] [--when a,b] [--tags a,b] [--out <project-dir>] [--json]');
  process.exit(1);
}

const corpus = (args.corpus || 'production').toLowerCase();
const wantWhen = list(args.when);
const wantDir = list(args.direction);
const wantTags = list(args.tags);
const briefTokens = tokenizeBrief(args.brief);
const outDir = args.out || null;
if (outDir && !existsSync(outDir)) { console.error(`--out dir not found: ${outDir}`); process.exit(1); }

const indexPath = join(ROOT, 'corpus', 'index.json');
if (!existsSync(indexPath)) { console.error(`build-sheet.mjs: cannot find ${indexPath} — run npm run index:build`); process.exit(1); }
const index = JSON.parse(readFileSync(indexPath, 'utf8'));

const inCorpus = (e) => corpus === 'both' || e.corpus === corpus;

// ── a. recent-donors history ─────────────────────────────────────────────────
const rows = readRecent();
const bannedDonors = new Set(rows.slice(-6).flatMap((r) => (r.donors || []).map((d) => String(d).split(':')[0])));
const recentArchetypes = rows.slice(-5).map((r) => r.layout).filter(Boolean);
function lastUsedIndex(archetype) {
  for (let i = rows.length - 1; i >= 0; i--) if (rows[i].layout === archetype) return i;
  return -1;
}

// ── b. choose the layout archetype FIRST ─────────────────────────────────────
function candidateArchetypes() {
  const pool = index.exemplars.filter(inCorpus);
  const fromIndex = new Set(pool.flatMap((e) => e.layout || []));
  if (fromIndex.size >= MIN_LAYOUT_COVERAGE) return [...fromIndex].sort();
  const tagSet = new Set(pool.flatMap((e) => e.tags || []));
  const fromTags = LAYOUT_TAGS.filter((t) => tagSet.has(t));
  const merged = new Set([...fromIndex, ...fromTags]);
  if (merged.size) return [...merged].sort();
  // neither the layout backfill nor layout-ish tags have landed for this corpus yet (today's
  // actual state) — fall back to the full controlled vocabulary so the engine still makes a
  // deterministic pick instead of stalling on corpus sparsity.
  return [...LAYOUT_VOCAB];
}

function pickArchetype() {
  const fitWhens = new Set([...wantWhen, ...briefTokens.filter((t) => WHEN_LAYOUT_FIT[t])]);
  let pool = candidateArchetypes();
  const rationed = recentArchetypes.includes('split-hero');
  if (rationed && pool.includes('split-hero') && pool.length > 1) pool = pool.filter((a) => a !== 'split-hero');
  const scored = pool.map((arch) => {
    let fit = 0;
    const matched = [];
    for (const w of fitWhens) if ((WHEN_LAYOUT_FIT[w] || []).includes(arch)) { fit += 3; matched.push(w); }
    const recentCount = recentArchetypes.filter((a) => a === arch).length;
    const penalty = recentCount * 4;
    return { arch, s: fit - penalty, fit, penalty, matched, recentCount, lru: lastUsedIndex(arch) };
  });
  scored.sort((a, b) => b.s - a.s || a.lru - b.lru || a.arch.localeCompare(b.arch));
  const top = scored[0];
  const why = top.matched.length
    ? `fit +${top.fit} (${top.matched.join(',')})`
    : 'open field — no when_to_use fit signal';
  const whyBits = [why];
  if (top.penalty) whyBits.push(`recency -${top.penalty} (used ${top.recentCount}/5 recent builds)`);
  else whyBits.push('not used in the last 5 builds');
  if (rationed && top.arch !== 'split-hero') whyBits.push('(split-hero rationed out — used within the last 5)');
  return { archetype: top.arch, why: whyBits.join(' · '), scored };
}
const { archetype, why: archetypeWhy } = pickArchetype();

// ── c. pick a donor per layer ────────────────────────────────────────────────
const scoreOpts = { wantWhen, wantDir, wantTags, briefTokens };
const ranked = rankEntries(index.exemplars, { corpus, ...scoreOpts }).filter((r) => !bannedDonors.has(r.e.slug));
// Unfiltered-by-score twin of `ranked`, for repair passes only: a constraint like bold-tilt is
// a MUST ("at least one donor carries brutalist/expressive"), not a preference, so its search
// can't be limited to donors that happened to score >0 against this brief's brief/when/tags —
// a dashboard brief may score zero relevance against every bold-tagged exemplar in-corpus.
const rankedAll = index.exemplars.filter(inCorpus).filter((e) => !bannedDonors.has(e.slug))
  .map((e) => ({ e, ...scoreEntry(e, scoreOpts) }))
  .sort((a, b) => b.s - a.s || a.e.slug.localeCompare(b.e.slug));

/** Layer-specific candidate narrowing: the layout layer must carry the chosen archetype (or
 *  the closest tag proxy while the backfill is sparse); other layers use the full pool. */
function narrowToLayer(layer, pool) {
  if (layer !== 'layout') return pool;
  const withArchetype = pool.filter((r) => (r.e.layout || []).includes(archetype));
  if (withArchetype.length) return withArchetype;
  const proxyTagged = pool.filter((r) => (r.e.tags || []).includes(archetype));
  if (proxyTagged.length) return proxyTagged;
  return pool; // no in-corpus evidence for this archetype yet — best-ranked donor, flagged unproven below
}
const layerPool = (layer) => narrowToLayer(layer, ranked);
const layerPoolAll = (layer) => narrowToLayer(layer, rankedAll);
const layoutProven = layerPool('layout').some((r) => (r.e.layout || []).includes(archetype));

const eligible = (pool, usedCount, excludeSlug) =>
  pool.filter((r) => r.e.slug !== excludeSlug && (usedCount.get(r.e.slug) || 0) < 2);

function alphabeticalFallback(usedCount) {
  return index.exemplars.filter(inCorpus)
    .filter((e) => !bannedDonors.has(e.slug) && (usedCount.get(e.slug) || 0) < 2)
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((e) => ({ e, s: 0, why: ['fallback:alphabetical — brief scored nothing for this layer'] }))[0] || null;
}

function pickForLayer(layer, usedCount) {
  const cands = eligible(layerPool(layer), usedCount, null);
  return cands[0] || alphabeticalFallback(usedCount);
}

const usedCount = new Map();
const picks = {};
for (const layer of LAYERS) {
  const pick = pickForLayer(layer, usedCount);
  picks[layer] = pick;
  if (pick) usedCount.set(pick.e.slug, (usedCount.get(pick.e.slug) || 0) + 1);
}

function directionsUnion() {
  const s = new Set();
  for (const layer of LAYERS) for (const d of picks[layer]?.e.directions || []) s.add(d);
  return s;
}

/** Force-swap one layer's donor to the first candidate matching `want` that isn't already
 *  picked here, respecting the ≤2-layers-per-donor cap. Used by both repair passes below. */
function trySwap(layer, want) {
  const current = picks[layer];
  if (current) usedCount.set(current.e.slug, usedCount.get(current.e.slug) - 1);
  let cands = eligible(layerPool(layer).filter(want), usedCount, current?.e.slug);
  if (!cands.length) cands = eligible(layerPoolAll(layer).filter(want), usedCount, current?.e.slug); // MUST-constraint fallback — see rankedAll comment above
  if (cands.length) {
    picks[layer] = cands[0];
    usedCount.set(cands[0].e.slug, (usedCount.get(cands[0].e.slug) || 0) + 1);
    return true;
  }
  if (current) usedCount.set(current.e.slug, usedCount.get(current.e.slug) + 1);
  return false;
}

// donor set must span >=2 distinct directions
if (directionsUnion().size < 2) {
  for (const layer of REPAIR_ORDER) {
    const union = directionsUnion();
    if (trySwap(layer, (r) => (r.e.directions || []).some((d) => !union.has(d))) && directionsUnion().size >= 2) break;
  }
}

// bold-tilt: unless the brief explicitly wants quiet/minimalist, at least one donor must
// carry brutalist or expressive
const quietIntent = wantDir.includes('minimalist') || /\bquiet\b|\bminimal(ist)?\b/i.test(args.brief || '');
if (!quietIntent) {
  const isBold = (r) => has(r.e.directions, 'brutalist') || has(r.e.directions, 'expressive');
  const alreadyBold = LAYERS.some((l) => picks[l] && isBold(picks[l]));
  if (!alreadyBold) {
    for (const layer of REPAIR_ORDER) if (trySwap(layer, isBold)) break;
  }
}

// ── d. output ────────────────────────────────────────────────────────────────
function patternPath(patSlug, donorCorpus) {
  for (const c of [donorCorpus, 'production', 'expressive']) {
    if (existsSync(join(ROOT, 'corpus', c, 'patterns', `${patSlug}.md`))) return `corpus/${c}/patterns/${patSlug}.md`;
  }
  return null;
}

function patternShortlist(cap = 6) {
  const seen = new Set();
  const out = [];
  for (const r of layerPool('layout').slice(0, 8)) {
    for (const p of r.e.patterns || []) {
      if (seen.has(p)) continue;
      seen.add(p);
      out.push({ slug: p, path: patternPath(p, r.e.corpus) });
      if (out.length >= cap) return out;
    }
  }
  return out;
}

function mergeSources() {
  const bySlug = new Map();
  for (const layer of ['palette', 'type', 'motion']) {
    const p = picks[layer];
    if (!p) continue;
    if (!bySlug.has(p.e.slug)) bySlug.set(p.e.slug, new Set());
    bySlug.get(p.e.slug).add(PRESET_FIELD[layer]);
  }
  return [...bySlug.entries()].map(([slug, fields]) => `${slug}:${[...fields].join(',')}`);
}

function slugifyName(s) {
  const base = String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return base.slice(0, 40).replace(/-+$/, '') || 'sheet';
}
const presetName = `${slugifyName(args.brief)}-${archetype}`.slice(0, 60).replace(/-+$/, '');
const layoutDonorSlug = picks.layout?.e.slug || null;
const mergedSources = mergeSources();

const paletteDerivation = 'derive color from the client\'s brand assets / content imagery / cultural context first '
  + '(sample → converge in oklch: 2-3 chromatic + one neutral lightness ramp → one-line justification); '
  + 'the donor palette is the structural anchor, not the answer.';

const commandParts = ['node', 'tooling/exemplar-preset.mjs', '--name', presetName, '--out', outDir || '<project-dir>'];
if (layoutDonorSlug) commandParts.push('--layout', archetype, '--layout-donor', layoutDonorSlug);
commandParts.push(...mergedSources);
const command = commandParts.join(' ');

if (outDir) {
  const spawnArgs = ['--name', presetName, '--out', outDir];
  if (layoutDonorSlug) spawnArgs.push('--layout', archetype, '--layout-donor', layoutDonorSlug);
  spawnArgs.push(...mergedSources);
  const res = spawnSync('node', [join(ROOT, 'tooling', 'exemplar-preset.mjs'), ...spawnArgs], { cwd: ROOT, encoding: 'utf8' });
  if (res.status !== 0) {
    console.error(res.stderr || res.stdout || `exemplar-preset.mjs exited ${res.status}`);
    process.exit(res.status || 1);
  }
}

const layerOut = {};
for (const layer of LAYERS) {
  const p = picks[layer];
  layerOut[layer] = p ? {
    donor: p.e.slug, corpus: p.e.corpus, score: p.s, why: p.why,
    unproven: layer === 'layout' && !layoutProven ? true : undefined,
    path: `corpus/${p.e.corpus}/exemplars/${p.e.slug}.md`,
    patterns: p.e.patterns || [],
  } : null;
}

if (args.json) {
  console.log(JSON.stringify({
    brief: args.brief, corpus, archetype, archetypeWhy,
    layers: layerOut,
    paletteDerivation,
    patternShortlist: patternShortlist(),
    command,
    ranOut: !!outDir,
  }, null, 2));
  process.exit(0);
}

const out = [];
out.push(`# BUILD SHEET  (brief: "${args.brief}" · corpus:${corpus})`);
out.push(`\n▸ layout: ${archetype}${layoutProven ? '' : '  [unproven — no in-corpus exemplar/tag evidence yet, best-ranked donor used]'}`);
out.push(`  why: ${archetypeWhy}`);

out.push(`\n# DONORS (reuse one donor across at most 2 layers)`);
for (const layer of LAYERS) {
  const p = picks[layer];
  if (!p) { out.push(`\n▸ ${layer}: (no eligible donor — corpus too thin for this brief/filter combo)`); continue; }
  out.push(`\n▸ ${layer}: ${p.e.slug} [${p.e.corpus}]  score ${p.s}`);
  out.push(`  why: ${p.why.join(' ') || '(fallback pick)'}`);
  out.push(`  read: corpus/${p.e.corpus}/exemplars/${p.e.slug}.md`);
}

out.push(`\n# PALETTE DERIVATION`);
out.push(`  ${paletteDerivation}`);

out.push(`\n# PATTERN SHORTLIST (${archetype})`);
const pats = patternShortlist();
if (!pats.length) out.push('  (none found — read the layout donor\'s exemplar file directly)');
for (const p of pats) out.push(`  ▸ ${p.slug}${p.path ? `  read: ${p.path}` : '  (path unresolved)'}`);

out.push(`\n# RUN`);
out.push(`  ${command}`);
if (outDir) out.push(`  → ran: ${outDir}/taste.preset.json + taste.tokens.css + taste.lock.json`);

console.log(out.join('\n'));
