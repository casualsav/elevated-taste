#!/usr/bin/env node
/**
 * refresh.mjs — staleness pass over the corpus. "Self-upgrading" must mean CURRENT, not just
 * bigger: sites redesign and captures rot. Monthly (refresh.yml), this re-captures the N
 * oldest exemplars and:
 *   - DEAD site (HTTP >= 400 / network error): reported for human review — never auto-removed.
 *   - DRIFTED (screenshot dHash distance > threshold vs the previous capture): re-distilled
 *     and landed on main in the same run if it passes the gate, else held in a refresh/<date>-<slug>
 *     PR labelled hold (lib/land.mjs, same as evolve).
 *   - unchanged: capture freshened (screenshots re-uploaded to the captures branch), no PR.
 *
 * Prev captures come from the overlay the workflow copies out of the `captures` branch; with
 * no previous shot, drift can't be judged and the capture is just freshened.
 *
 *   node tooling/refresh.mjs --limit 3 [--threshold 60] [--dry-run]
 */
import { readFileSync, readdirSync, existsSync, copyFileSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

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

function oldestExemplars(limit) {
  const all = [];
  for (const corpus of ['production', 'expressive']) {
    const dir = join(ROOT, 'corpus', corpus, 'exemplars');
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
      const md = readFileSync(join(dir, f), 'utf8');
      all.push({ slug: f.replace(/\.md$/, ''), corpus, url: fmField(md, 'url'), captured: fmField(md, 'captured') || '0000-00-00' });
    }
  }
  return all.filter((e) => e.url).sort((a, b) => a.captured.localeCompare(b.captured)).slice(0, limit);
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
  for (const p of picks) log(`  ${p.captured}  ${p.corpus}/${p.slug}  ${p.url}`);
  if (DRY) return;

  const dead = [], drifted = [], freshened = [], failed = [];
  for (const c of picks) {
    const live = await alive(c.url);
    if (!live.ok) { dead.push({ ...c, status: live.status }); log(`  DEAD ${c.slug}: ${live.status}`); continue; }

    // stash the previous capture (from the captures-branch overlay) before we overwrite it
    const shot = join(ROOT, 'corpus', c.corpus, 'screenshots', c.slug, 'desktop.png');
    let prev = null;
    if (existsSync(shot)) { prev = join(mkdtempSync(join(tmpdir(), `refresh-${c.slug}-`)), 'old.png'); copyFileSync(shot, prev); }

    const cap = spawnSync('node', [join(ROOT, 'tooling', 'capture.mjs'), '--url', c.url, '--slug', c.slug, '--corpus', c.corpus, '--settle', '7000'], { cwd: ROOT, encoding: 'utf8' });
    if (cap.status !== 0) { failed.push(c); log(`  capture failed ${c.slug}`); continue; }

    let distance = null;
    if (prev) { distance = drift(prev, shot); rmSync(dirname(prev), { recursive: true, force: true }); }
    if (distance == null && prev) log(`  ${c.slug}: drift unknowable (dhash unavailable) — freshened only`);

    if (distance != null && distance > THRESHOLD) {
      log(`  DRIFT ${c.slug}: dHash distance ${distance}/256 — re-distilling`);
      const { distillCandidate } = await import(pathToFileURL(join(ROOT, 'tooling', 'distill.mjs')).href);
      const ok = await distillCandidate({ slug: c.slug, corpus: c.corpus, url: c.url, source: 'refresh' });
      if (ok) drifted.push({ ...c, distance });
      else failed.push(c);
    } else {
      freshened.push({ ...c, distance });
      log(`  ${c.slug}: ${distance == null ? 'no previous capture' : `distance ${distance}/256`} — capture freshened, no re-distill`);
    }
  }

  if (drifted.length) {
    const { landOrHold } = await import(pathToFileURL(join(ROOT, 'tooling', 'lib', 'land.mjs')).href);
    const results = await landOrHold(drifted, { kind: 'refresh' });
    for (const r of results) log(`  ${r.slug}: ${r.landed ? `landed ${r.landed.sha.slice(0, 7)}` : r.pr?.url ? `held ${r.pr.url}` : `failed — ${r.error}`}`);
  }

  log(`\nrefresh done — ${drifted.length} re-distilled, ${freshened.length} freshened, ${dead.length} dead, ${failed.length} failed`);
  for (const d of dead) log(`  DEAD (human review — deprecate or re-point): ${d.corpus}/${d.slug} ${d.url} (${d.status})`);
  if (dead.length) process.exitCode = 78; // visible in CI without failing the whole run hard
}

main().catch((e) => { console.error(e); process.exit(1); });
