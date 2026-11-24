#!/usr/bin/env node
/**
 * coverage.mjs — how well does the corpus cover its own mandate?
 *
 * The production corpus claims app UI (dashboards, forms, tables, settings…) but award
 * galleries structurally supply marketing pages, so those categories starve unless someone
 * queues sources deliberately. This tool makes the gap visible: a when_to_use histogram vs
 * the `category_targets` in evolve.config.json. The weekly digest includes the gaps; fill
 * them by adding app-UI sites to tooling/manual-sources.json (evolve ingests those first).
 *
 *   node tooling/coverage.mjs            # full histogram + gaps
 *   import { coverageGaps } from './coverage.mjs'
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Defaults if evolve.config.json carries no category_targets. Production corpus only —
// the expressive corpus has no app-UI mandate.
export const DEFAULT_TARGETS = {
  dashboard: 5, 'data-table': 3, forms: 3, settings: 2, onboarding: 2,
  auth: 2, 'empty-state': 2, checkout: 2, pricing: 4, docs: 3,
};

function fmList(md, key) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return [];
  const line = m[1].match(new RegExp(`^${key}:\\s*\\[([^\\]]*)\\]`, 'm'));
  return line ? line[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
}

export function coverageHistogram(root = ROOT, corpus = 'production') {
  const counts = {};
  const dir = join(root, 'corpus', corpus, 'exemplars');
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    for (const w of fmList(readFileSync(join(dir, f), 'utf8'), 'when_to_use')) {
      counts[w] = (counts[w] || 0) + 1;
    }
  }
  return counts;
}

export function coverageGaps(root = ROOT) {
  let targets = DEFAULT_TARGETS;
  try {
    const cfg = JSON.parse(readFileSync(join(root, 'evolve.config.json'), 'utf8'));
    if (cfg.category_targets && Object.keys(cfg.category_targets).length) targets = cfg.category_targets;
  } catch { /* defaults */ }
  const counts = coverageHistogram(root, 'production');
  const gaps = [];
  for (const [cat, target] of Object.entries(targets)) {
    const have = counts[cat] || 0;
    if (have < target) gaps.push({ category: cat, have, target });
  }
  return gaps.sort((a, b) => (a.have / a.target) - (b.have / b.target));
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const counts = coverageHistogram();
  console.log('production when_to_use histogram:');
  for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(v).padStart(3)}  ${k}`);
  }
  const gaps = coverageGaps();
  if (gaps.length) {
    console.log('\ngaps vs category_targets (fill via tooling/manual-sources.json):');
    for (const g of gaps) console.log(`  ${g.category}: ${g.have}/${g.target}`);
  } else {
    console.log('\nno gaps — every category target met.');
  }
}
