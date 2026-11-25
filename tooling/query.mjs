#!/usr/bin/env node
/**
 * query.mjs — mechanical retrieval over corpus/index.json. Replaces "read the whole
 * 96k-token index to pick donors" with a scored shortlist a cheap model can act on.
 *
 * Scoring is simple and transparent (see below). Output is capped small; read only the
 * files it points at, then pull palette/motion/tokens from the full index entry.
 *
 *   node tooling/query.mjs --brief "dark saas dashboard with data tables" \
 *     [--corpus production|expressive|both] [--direction minimalist] \
 *     [--when dashboard,pricing] [--tags dark,saas] [--layout app-shell,dense-grid] \
 *     [--top 6] [--patterns] [--json]
 *   npm run query -- --brief "…"                     # inside the repo
 *   node query.mjs --repo /path/to/taste --brief "…" # installed skill copy
 *
 * Also importable as a library (tooling/build-sheet.mjs reuses the scoring instead of
 * forking it) — `tokenizeBrief`/`scoreEntry`/`rankEntries` are pure exports with no
 * module-level side effects. The CLI body below only runs when this file is the entry
 * point (`isMain`), so `import`-ing it never prints, reads argv, or exits the process.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SURFACE_FOR } from './coverage.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

// ── args ─────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (!t.startsWith('--')) continue;
    const key = t.slice(2);
    const next = argv[i + 1];
    if (key === 'patterns' || key === 'json') { a[key] = true; continue; }
    a[key] = next; i++;
  }
  return a;
}
const list = (v) => (v ? String(v).split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : []);

function resolveRepo(args) {
  if (args.repo) return args.repo;
  const marker = join(HERE, 'REPO_PATH.txt');
  if (existsSync(marker)) return readFileSync(marker, 'utf8').trim();
  return join(HERE, '..');
}

// "dark"/"light" are NOT stopwords: they are real tags (a dark dev-tool page is a different
// donor from a light one), and dropping them made "dark landing page" rank light sites first.
export const STOP = new Set('a an and or the of to for with in on at by from into as is are be this that these those your you our their it its my we us site page app build design ui ux using use want need make more most very some any all it a i new'.split(/\s+/));
// Two-word phrases that name one job, joined before "in"/"up" fall to STOP: "sign in page"
// otherwise reduces to "sign" and finds no auth screen at all.
const PHRASES = [[/\b(sign|log)[\s-]+in\b/g, 'signin'], [/\b(sign)[\s-]+up\b/g, 'signup']];
export const tokenizeBrief = (brief) => PHRASES
  .reduce((s, [re, to]) => s.replace(re, to), String(brief || '').toLowerCase())
  .replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/)
  .filter((t) => t.length > 1 && !STOP.has(t));

export const has = (arr, v) => (arr || []).some((x) => String(x).toLowerCase() === v);
export const A11Y_RISK = ['tap-targets-risky', 'focus-visible-missing'];

// Plain words people type → the controlled `when_to_use` vocabulary. Without this a brief only
// reached a category if it used the exact vocabulary word ("auth", "data-table"), so "login
// screen" or "API documentation" found nothing relevant. Keys are single brief tokens; a token
// may name several categories.
export const WHEN_SYNONYMS = {
  auth: ['auth'], login: ['auth'], signin: ['auth'], 'sign-in': ['auth'], signup: ['auth'], 'sign-up': ['auth'], password: ['auth'], sso: ['auth'],
  table: ['data-table'], tables: ['data-table'], 'data-table': ['data-table'], grid: ['data-table'], spreadsheet: ['data-table'], rows: ['data-table'],
  dashboard: ['dashboard'], dashboards: ['dashboard'], analytics: ['dashboard'], kpi: ['dashboard'], kpis: ['dashboard'], metrics: ['dashboard'], charts: ['dashboard'], admin: ['dashboard', 'data-table'],
  settings: ['settings'], preferences: ['settings'], toggles: ['settings', 'forms'], account: ['settings'],
  form: ['forms'], forms: ['forms'], validation: ['forms'], fields: ['forms'], inputs: ['forms'], survey: ['forms'], 'multi-step': ['forms', 'onboarding'],
  checkout: ['checkout'], cart: ['checkout', 'ecommerce'], payment: ['checkout'], payments: ['checkout'],
  onboarding: ['onboarding'], 'first-run': ['onboarding'], welcome: ['onboarding'], setup: ['onboarding'], checklist: ['onboarding'],
  empty: ['empty-state'], 'empty-state': ['empty-state'], 'zero-state': ['empty-state'],
  docs: ['docs'], documentation: ['docs'], api: ['docs'], reference: ['docs'], guide: ['docs'], guides: ['docs'],
  pricing: ['pricing'], plans: ['pricing'], tiers: ['pricing'],
  changelog: ['changelog'], release: ['changelog'], releases: ['changelog'],
  blog: ['blog'], articles: ['blog', 'editorial'], article: ['editorial', 'blog'], posts: ['blog'],
  magazine: ['editorial'], editorial: ['editorial'], 'long-read': ['editorial'], longread: ['editorial'], journalism: ['editorial'],
  shop: ['ecommerce'], store: ['ecommerce'], storefront: ['ecommerce'], ecommerce: ['ecommerce'], 'e-commerce': ['ecommerce'], product: [],
  portfolio: ['portfolio'], studio: ['portfolio', 'agency'], agency: ['agency'],
  landing: ['landing'], homepage: ['landing'], hero: ['hero'], footer: ['footer'], nav: ['navigation'], navigation: ['navigation'],
};
// A few brief words that name a tag under another word.
export const TAG_SYNONYMS = { skincare: ['beauty', 'skincare'], cosmetics: ['beauty'], developer: ['developer', 'developer-tool', 'dev-tool', 'developer-tools', 'devtools'], dev: ['developer-tool', 'dev-tool', 'devtools'], bank: ['banking', 'fintech'], banking: ['banking', 'fintech'] };

/** when_to_use categories a brief implies, from WHEN_SYNONYMS (deduped, in brief order). */
export function inferWhen(briefTokens = []) {
  return [...new Set(briefTokens.flatMap((t) => WHEN_SYNONYMS[t] || []))];
}

const stem = (w) => (w.length > 4 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w);
const words = (s) => String(s || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map(stem);

// ── scoring ──────────────────────────────────────────────────────────────────
// +3 per --when in when_to_use · +3 per --layout · +2 per --direction · +2 per --tags ·
// +3 per category the brief implies (inferWhen) that the entry's when_to_use has ·
// +1 per brief word matching a whole tag/when_to_use/slug word, or a tag synonym ·
// +0.5 per brief word found only in the summary ·
// -0.5 if a risky a11y flag is present (a tie-break: it never removes a matching entry).
// Whole-word matching: "form" no longer matches "platform", nor "table" "stable".
// Pure (no module-level args) so build-sheet.mjs can reuse it for per-layer donor ranking
// instead of forking the scoring rule.
export function scoreEntry(entry, { wantWhen = [], wantDir = [], wantTags = [], wantLayout = [], briefTokens = [], inferredWhen } = {}) {
  const why = [];
  let s = 0;
  for (const w of wantWhen) if (has(entry.when_to_use, w)) { s += 3; why.push(`when:${w}`); }
  for (const l of wantLayout) if (has(entry.layout, l)) { s += 3; why.push(`layout:${l}`); }
  for (const d of wantDir) if (has(entry.directions, d)) { s += 2; why.push(`dir:${d}`); }
  for (const t of wantTags) if (has(entry.tags, t)) { s += 2; why.push(`tag:${t}`); }

  const implied = (inferredWhen ?? inferWhen(briefTokens)).filter((w) => !wantWhen.includes(w));
  const impliedHits = implied.filter((w) => has(entry.when_to_use, w));
  if (impliedHits.length) { s += 3 * impliedHits.length; why.push(`implies:${impliedHits.join('+')}`); }

  // A real app screen beats a marketing page about an app when the brief is an app job: someone
  // asking for an admin dashboard wants the dashboard itself, not the product's landing page.
  const surfaceHits = [...wantWhen, ...implied].filter((w) => SURFACE_FOR[w] && SURFACE_FOR[w] === entry.surface && has(entry.when_to_use, w));
  if (surfaceHits.length) { s += 2; why.push(`surface:${entry.surface}`); }

  const labels = new Set([...(entry.tags || []), ...(entry.when_to_use || []), entry.slug || ''].flatMap((x) => [String(x).toLowerCase(), ...words(x)]));
  const tags = new Set((entry.tags || []).map((t) => String(t).toLowerCase()));
  const summary = new Set(words(entry.summary));
  const matched = new Set();
  const soft = new Set();
  for (const tok of briefTokens) {
    if (matched.has(tok) || soft.has(tok)) continue;
    if (labels.has(tok) || labels.has(stem(tok)) || (TAG_SYNONYMS[tok] || []).some((t) => tags.has(t))) { s += 1; matched.add(tok); }
    else if (summary.has(stem(tok))) { s += 0.5; soft.add(tok); }
  }
  if (matched.size) why.push(`brief:${[...matched].join('+')}`);
  if (soft.size) why.push(`summary:${[...soft].join('+')}`);

  const risks = (entry.a11y || []).filter((f) => A11Y_RISK.includes(f));
  if (s > 0 && risks.length) { s = Math.max(s - 0.5, 0.25); why.push(`-a11y:${risks.join('+')}`); }
  return { s, why, implied: impliedHits.length };
}

/** Rank entries by scoreEntry against a corpus filter; keeps only s > 0. Ties go to the entry
 *  matching more implied categories, then the more specific one (fewer when_to_use), then slug. */
export function rankEntries(items, { corpus = 'production', ...scoreOpts } = {}) {
  const inCorpus = (e) => corpus === 'both' || e.corpus === corpus;
  return items.filter(inCorpus).map((e) => ({ e, ...scoreEntry(e, scoreOpts) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || b.implied - a.implied
      || (a.e.when_to_use || []).length - (b.e.when_to_use || []).length
      || a.e.slug.localeCompare(b.e.slug));
}

// ── CLI ──────────────────────────────────────────────────────────────────────
const isMain = import.meta.url === pathToFileURL(process.argv[1] || '').href;
if (isMain) {
  const args = parseArgs(process.argv.slice(2));

  const REPO = resolveRepo(args);
  const indexPath = join(REPO, 'corpus', 'index.json');
  if (!existsSync(indexPath)) {
    console.error(`query.mjs: cannot find ${indexPath} (pass --repo <taste-repo-path>)`);
    process.exit(1);
  }
  const index = JSON.parse(readFileSync(indexPath, 'utf8'));

  const corpus = (args.corpus || 'production').toLowerCase();
  const wantWhen = list(args.when);
  const wantDir = list(args.direction);
  const wantTags = list(args.tags);
  const wantLayout = list(args.layout);
  const top = Math.max(1, parseInt(args.top, 10) || 6);
  const patternsOnly = !!args.patterns;
  const briefTokens = tokenizeBrief(args.brief);

  const scoreOpts = { wantWhen, wantDir, wantTags, wantLayout, briefTokens };
  const rank = (items) => rankEntries(items, { corpus, ...scoreOpts });

  const rankedEx = rank(index.exemplars);
  const rankedPat = rank(index.patterns);

  if (args.json) {
    const exOut = rankedEx.slice(0, top).map(({ e, s, why }) => ({
      slug: e.slug, corpus: e.corpus, score: s, why,
      palette: e.palette || null,
      motion: e.motion?.techniques || [],
      layout: e.layout || [],
      patterns: e.patterns || [],
      path: `corpus/${e.corpus}/exemplars/${e.slug}.md`,
    }));
    const patOut = rankedPat.slice(0, 8).map(({ e, s, why }) => ({
      slug: e.slug, corpus: e.corpus, score: s, why, safety: e.safety,
      summary: e.summary,
      requires_tokens: (e.requires || []).length,
      hasRecipe: !!e.hasRecipe, hasJs: !!e.hasJs,
      path: `corpus/${e.corpus}/patterns/${e.slug}.md`,
    }));
    console.log(JSON.stringify(patternsOnly ? { patterns: patOut } : { exemplars: exOut, patterns: patOut }, null, 2));
    process.exit(0);
  }

  const out = [];
  if (!patternsOnly) {
    out.push(`# EXEMPLARS  (brief: "${args.brief || ''}" · corpus:${corpus}${wantDir.length ? ` · dir:${wantDir.join(',')}` : ''})`);
    if (!rankedEx.length) out.push('  (no exemplar scored > 0 — widen --brief/--tags or try --corpus both)');
    for (const { e, s, why } of rankedEx.slice(0, top)) {
      const p = e.palette || {};
      const pal = [p.bg && `bg ${p.bg}`, p.fg && `fg ${p.fg}`, p.accent && `accent ${p.accent}`].filter(Boolean).join(' · ') || '—';
      const mot = (e.motion?.techniques || []).join(', ') || '—';
      out.push(`\n▸ ${e.slug} [${e.corpus}]  score ${s}`);
      out.push(`  why: ${why.join(' ')}`);
      out.push(`  palette: ${pal}`);
      out.push(`  motion: ${mot}`);
      out.push(`  layout: ${(e.layout || []).join(', ') || '—'}`);
      out.push(`  patterns: ${(e.patterns || []).join(', ') || '—'}`);
      out.push(`  read: corpus/${e.corpus}/exemplars/${e.slug}.md`);
    }
  }

  out.push(`\n# PATTERNS`);
  if (!rankedPat.length) out.push('  (no pattern scored > 0)');
  for (const { e, s, why } of rankedPat.slice(0, 8)) {
    const flags = [e.hasRecipe && 'recipe', e.hasJs && 'js'].filter(Boolean).join('/') || 'no-recipe';
    out.push(`\n▸ ${e.slug} [${e.safety || '?'}]  score ${s} · ${(e.requires || []).length} tokens · ${flags}`);
    out.push(`  ${e.summary || ''}`);
    out.push(`  read: corpus/${e.corpus}/patterns/${e.slug}.md`);
  }

  out.push(`\n— pick a donor per layer (palette/type/motion/layout/imagery); reuse one donor across at most 2 layers.`);

  // hard-cap human output at ~120 lines
  const lines = out.join('\n').split('\n');
  console.log((lines.length > 120 ? lines.slice(0, 119).concat('  … (truncated — narrow the query or use --json)') : lines).join('\n'));
}
