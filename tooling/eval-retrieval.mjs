#!/usr/bin/env node
/**
 * eval-retrieval.mjs — does query.mjs bring back the right exemplars for real briefs?
 *
 * Runs every case in tooling/eval/retrieval-cases.json through the same ranking the CLI and
 * build-sheet.mjs use (brief only, no flags: that is how a person or a model actually asks),
 * then prints hit@3 and MRR per case.
 *
 * A right answer is a slug the case lists, or any real app screen (`surface: app`) whose
 * when_to_use covers an app job the brief implies (dashboard, data-table, auth …). The corpus
 * grows every week; without that second rule each new app screen that rightly outranks the
 * listed sites would read as retrieval getting worse. Exits 1 when fewer cases than `min_hit3` hit in the top 3,
 * so CI catches a ranking or tagging change that makes retrieval worse.
 *
 *   node tooling/eval-retrieval.mjs            # table + totals
 *   node tooling/eval-retrieval.mjs --json
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rankEntries, tokenizeBrief, inferWhen } from './query.mjs';
import { SURFACE_FOR } from './coverage.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const index = JSON.parse(readFileSync(join(ROOT, 'corpus', 'index.json'), 'utf8'));
const spec = JSON.parse(readFileSync(join(ROOT, 'tooling', 'eval', 'retrieval-cases.json'), 'utf8'));
const asJson = process.argv.includes('--json');

const known = new Set(index.exemplars.map((e) => e.slug));
const rows = [];
for (const c of spec.cases) {
  const missing = c.relevant.filter((s) => !known.has(s));
  if (missing.length) { console.error(`eval case "${c.brief}" names exemplars not in the corpus: ${missing.join(', ')}`); process.exit(2); }
  const briefTokens = tokenizeBrief(c.brief);
  const implied = inferWhen(briefTokens);
  const appJobs = implied.filter((w) => SURFACE_FOR[w] === 'app');
  const right = (e) => c.relevant.includes(e.slug) || (e.surface === 'app' && appJobs.some((w) => (e.when_to_use || []).includes(w)));
  const ranked = rankEntries(index.exemplars, { corpus: c.corpus || 'production', briefTokens, inferredWhen: implied });
  const slugs = ranked.map((r) => r.e.slug);
  const first = ranked.findIndex((r) => right(r.e));
  rows.push({ brief: c.brief, hit3: first > -1 && first < 3, rank: first + 1 || null, rr: first > -1 ? 1 / (first + 1) : 0, top3: slugs.slice(0, 3) });
}

const hits = rows.filter((r) => r.hit3).length;
const mrr = rows.reduce((a, r) => a + r.rr, 0) / rows.length;
const min = spec.min_hit3 ?? 0;
if (asJson) console.log(JSON.stringify({ hit3: hits, cases: rows.length, mrr: +mrr.toFixed(3), min_hit3: min, rows }, null, 2));
else {
  for (const r of rows) console.log(`${r.hit3 ? 'PASS' : 'MISS'}  rank ${String(r.rank ?? '-').padStart(3)}  ${r.brief.padEnd(54)} top3: ${r.top3.join(', ')}`);
  console.log(`\nhit@3 ${hits}/${rows.length} · MRR ${mrr.toFixed(3)} · floor ${min}`);
}
if (hits < min) { console.error(`retrieval got worse: ${hits} case(s) hit in the top 3, floor is ${min}`); process.exit(1); }
