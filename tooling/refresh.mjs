#!/usr/bin/env node
/**
 * refresh.mjs — staleness pass over the corpus. "Self-upgrading" must mean CURRENT, not just
 * bigger: sites redesign and captures rot. Monthly (refresh.yml), this re-captures the N
 * oldest exemplars and:
 *   - DEAD site (HTTP >= 400 / network error): reported for human review — never auto-removed.
 *   - DRIFTED (screenshot dHash distance > threshold vs the last recorded fingerprint): re-distilled
 *     and landed on main in the same run if it passes the gate, else held in a refresh/<date>-<slug>
 *     PR labelled hold (lib/land.mjs, same as evolve).
 *   - unchanged: capture freshened locally, no PR.
 *
 * Captures are never pushed, so the comparison point is the site's fingerprint in
 * corpus/fingerprints.json (tooling/lib/fingerprints.mjs), with a local previous screenshot as a
 * fallback on a box that has one. Every capture records a fresh fingerprint and `checked` date,
 * committed to main at the end of the run, so the next pick moves on to the next-oldest sites.
 * With no fingerprint yet, drift can't be judged: the site is fingerprinted for next time.
 *
 *   node tooling/refresh.mjs --limit 3 [--threshold 60] [--dry-run]
 */
import { readFileSync, readdirSync, existsSync, copyFileSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadFingerprints, keyFor, hashPng, distance as fpDistance, commitFingerprints } from './lib/fingerprints.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const log = (...a) => console.log(...a);

const args = process.argv.slice(2);
const num = (flag, dflt) => { const i = args.indexOf(flag); return i !== -1 ? parseInt(args[i + 1], 10) : dflt; };
const LIMIT = num('--limit', 3);
const THRESHOLD = num('--threshold', 60); // of 256 dHash bits; redesigns land far above, content churn below
const DRY = args.includes('--dry-run');

function fmField(md, key) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const line = m[1].split('\n').find((l) => l.trim().startsWith(key + ':'));
  return line ? line.slice(line.indexOf(':') + 1).trim().replace(/^["']|["']$/g, '') : null;
}

/** Least recently seen first: the later of the exemplar's `captured` date and its last fingerprint check. */
function oldestExemplars(limit) {
  const fps = loadFingerprints(ROOT);
  const all = [];
  for (const corpus of ['production', 'expressive']) {
    const dir = join(ROOT, 'corpus', corpus, 'exemplars');
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
      const md = readFileSync(join(dir, f), 'utf8');
      const slug = f.replace(/\.md$/, '');
      const captured = fmField(md, 'captured') || '0000-00-00';
      const checked = fps[keyFor(corpus, slug)]?.checked || '0000-00-00';
      all.push({ slug, corpus, url: fmField(md, 'url'), captured, seen: [captured, checked].sort().pop() });
    }
  }
  return all.filter((e) => e.url).sort((a, b) => a.seen.localeCompare(b.seen)).slice(0, limit);
}

async function alive(url) {
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(20000) });
    if (res.status === 405 || res.status === 501) res = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(20000) });
    return { ok: res.status < 400, status: res.status };
  } catch (e) { return { ok: false, status: `network: ${String(e.message || e).slice(0, 80)}` }; }
}

function drift(oldPng, newPng) {
  const r = spawnSync('python3', [join(ROOT, 'tooling', 'dhash.py'), oldPng, newPng], { encoding: 'utf8' });
  if (r.status !== 0) return null; // no python/pillow → drift unknowable, fail open to "freshen only"
  const d = parseInt(r.stdout.trim(), 10);
  return Number.isFinite(d) ? d : null;
}

async function main() {
  const picks = oldestExemplars(LIMIT);
  log(`refresh — ${DRY ? 'DRY RUN' : 'live'} · ${picks.length} oldest exemplar(s), drift threshold ${THRESHOLD}/256`);
  for (const p of picks) log(`  ${p.seen}  ${p.corpus}/${p.slug}  ${p.url}`);
  if (DRY) return;

  const dead = [], drifted = [], freshened = [], failed = [];
  const fps = loadFingerprints(ROOT);
  const updates = {}; // fingerprints to record for sites that won't stay drifted-and-unlanded
  const today = new Date().toISOString().slice(0, 10);
  for (const c of picks) {
    const live = await alive(c.url);
    if (!live.ok) { dead.push({ ...c, status: live.status }); log(`  DEAD ${c.slug}: ${live.status}`); continue; }

    // stash the previous capture (if one is on disk) before we overwrite it
    const shot = join(ROOT, 'corpus', c.corpus, 'screenshots', c.slug, 'desktop.png');
    let prev = null;
    if (existsSync(shot)) { prev = join(mkdtempSync(join(tmpdir(), `refresh-${c.slug}-`)), 'old.png'); copyFileSync(shot, prev); }

    const cap = spawnSync('node', [join(ROOT, 'tooling', 'capture.mjs'), '--url', c.url, '--slug', c.slug, '--corpus', c.corpus, '--settle', '7000'], { cwd: ROOT, encoding: 'utf8' });
    if (cap.status !== 0) { failed.push(c); log(`  capture failed ${c.slug}`); continue; }

    const key = keyFor(c.corpus, c.slug);
    const hash = hashPng(shot, ROOT);
    let distance = fpDistance(fps[key]?.dhash, hash);
    if (distance == null && prev) distance = drift(prev, shot);
    if (prev) rmSync(dirname(prev), { recursive: true, force: true });
    if (!hash) log(`  ${c.slug}: dhash unavailable (python3/Pillow?) — drift unknowable, freshened only`);
    else if (distance == null) log(`  ${c.slug}: no fingerprint yet — recording one for next time`);
    const fingerprint = hash ? { dhash: hash, checked: today } : null;

    if (distance != null && distance > THRESHOLD) {
      log(`  DRIFT ${c.slug}: dHash distance ${distance}/256 — re-distilling`);
      const { distillCandidate } = await import(pathToFileURL(join(ROOT, 'tooling', 'distill.mjs')).href);
      const ok = await distillCandidate({ slug: c.slug, corpus: c.corpus, url: c.url, source: 'refresh' });
      if (ok) drifted.push({ ...c, distance, fingerprint });
      else failed.push(c); // keep the old fingerprint so next month still sees the drift
    } else {
      freshened.push({ ...c, distance });
      if (fingerprint) updates[key] = fingerprint;
      log(`  ${c.slug}: ${distance == null ? 'no previous capture' : `distance ${distance}/256`} — capture freshened, no re-distill`);
    }
  }

  if (drifted.length) {
    const { landOrHold } = await import(pathToFileURL(join(ROOT, 'tooling', 'lib', 'land.mjs')).href);
    const results = await landOrHold(drifted, { kind: 'refresh' });
    for (const r of results) log(`  ${r.slug}: ${r.landed ? `landed ${r.landed.sha.slice(0, 7)}` : r.pr?.url ? `held ${r.pr.url}` : `failed — ${r.error}`}`);
    // Only a landed re-distill adopts the new look; a held one keeps the old fingerprint.
    for (const r of results) if (r.landed && r.fingerprint) updates[keyFor(r.corpus, r.slug)] = r.fingerprint;
  }

  const fpSha = commitFingerprints(updates, { root: ROOT });
  log(`fingerprints: ${Object.keys(updates).length} recorded${fpSha && fpSha !== 'unchanged' ? ` (${fpSha} on main)` : fpSha === 'unchanged' ? '' : ' — NOT committed (see above)'}`);

  log(`\nrefresh done — ${drifted.length} re-distilled, ${freshened.length} freshened, ${dead.length} dead, ${failed.length} failed`);
  for (const d of dead) log(`  DEAD (human review — deprecate or re-point): ${d.corpus}/${d.slug} ${d.url} (${d.status})`);
  if (dead.length) process.exitCode = 78; // visible in CI without failing the whole run hard
}

main().catch((e) => { console.error(e); process.exit(1); });
