#!/usr/bin/env node
// Rebuild corpus/<corpus>/sources.json from the distilled exemplar frontmatter,
// so sources.json is an accurate provenance log of what's actually in the corpus.
// (During scale-up we passed provenance to the distill subagents inline and let
// each write it into its exemplar frontmatter; this reconciles the log.)
//   node tooling/reconcile-sources.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CORPORA = ['production', 'expressive'];

// minimal frontmatter parser for our known, flat-ish schema
function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const obj = {};
  let parent = null;
  for (const raw of m[1].split('\n')) {
    if (!raw.trim()) continue;
    const indented = /^\s+/.test(raw);
    const line = raw.trim();
    const ci = line.indexOf(':');
    if (ci === -1) continue;
    const key = line.slice(0, ci).trim();
    let val = line.slice(ci + 1).trim();
    const coerce = (v) => {
      if (v === '' ) return null;
      if (v === 'null') return null;
      if (v === 'true') return true;
      if (v === 'false') return false;
      if (/^\[.*\]$/.test(v)) return v.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
      return v.replace(/^["']|["']$/g, '');
    };
    if (indented && parent) { obj[parent][key] = coerce(val); continue; }
    if (val === '') { obj[key] = {}; parent = key; continue; }
    parent = null;
    obj[key] = coerce(val);
  }
  return obj;
}

for (const corpus of CORPORA) {
  const dir = join(ROOT, 'corpus', corpus, 'exemplars');
  let files = [];
  try { files = readdirSync(dir).filter((f) => f.endsWith('.md')); } catch { continue; }
  const entries = [];
  for (const f of files.sort()) {
    const fm = parseFrontmatter(readFileSync(join(dir, f), 'utf8'));
    if (!fm) continue;
    const prov = fm.provenance || {};
    entries.push({
      slug: fm.slug || f.replace(/\.md$/, ''),
      url: fm.url || null,
      source: fm.source || null,
      corpus,
      captured: fm.captured || null,
      award_type: fm.award_type ?? null,
      score: fm.score ?? null,
      tags: fm.tags || [],
      when_to_use: fm.when_to_use || [],
      directions: fm.directions || [],
      gallery_url: prov.gallery_url ?? null,
      robots_ok: prov.robots_ok ?? null,
      license_note: prov.license_note ?? 'private reference; not redistributed',
    });
  }
  const out = join(ROOT, 'corpus', corpus, 'sources.json');
  writeFileSync(out, JSON.stringify(entries, null, 2) + '\n');
  console.log(`${corpus}: ${entries.length} entries -> corpus/${corpus}/sources.json`);
}
