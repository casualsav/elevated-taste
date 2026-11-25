/**
 * fingerprints.mjs — screenshot fingerprints so refresh can judge drift without keeping pictures.
 *
 * Captures never leave the runner, so a monthly refresh in CI used to have no previous screenshot
 * to compare with and could never detect a redesign. Instead, each capture's 256-bit dHash
 * (tooling/dhash.py: top 2000px, 16×16 gradient bits) is recorded as 64 hex chars in
 * corpus/fingerprints.json, keyed "<corpus>/<slug>". A dHash is a perceptual summary, not an
 * image: nothing of the site can be rebuilt from it, so it is safe in this public repo.
 *
 *   { "production/linear": { "dhash": "9f3c…", "checked": "2026-11-25" } }
 *
 * `checked` is the last day the site was captured, so refresh rotates through the corpus instead
 * of re-picking the same oldest exemplars every month. The file is bookkeeping, like
 * evolve.config.json's last_run: commitFingerprints() pushes it to main on its own.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdtempSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');
export const FINGERPRINTS = 'corpus/fingerprints.json';

export const keyFor = (corpus, slug) => `${corpus}/${slug}`;

export function loadFingerprints(root = ROOT) {
  const p = join(root, FINGERPRINTS);
  if (!existsSync(p)) return {};
  return JSON.parse(readFileSync(p, 'utf8'));
}

export function saveFingerprints(fps, root = ROOT) {
  const sorted = Object.fromEntries(Object.keys(fps).sort().map((k) => [k, fps[k]]));
  writeFileSync(join(root, FINGERPRINTS), `${JSON.stringify(sorted, null, 2)}\n`);
}

/** 64-hex dHash of a PNG, or null when python3/Pillow is unavailable (drift then fails open). */
export function hashPng(png, root = ROOT) {
  const r = spawnSync('python3', [join(root, 'tooling', 'dhash.py'), png], { encoding: 'utf8' });
  const bits = (r.stdout || '').trim();
  if (r.status !== 0 || !/^[01]{256}$/.test(bits)) return null;
  let hex = '';
  for (let i = 0; i < 256; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  return hex;
}

/** Hamming distance (0..256) between two 64-hex dHashes, or null if either is malformed. */
export function distance(a, b) {
  const ok = (h) => typeof h === 'string' && /^[0-9a-f]{64}$/.test(h);
  if (!ok(a) || !ok(b)) return null;
  let d = 0;
  for (let i = 0; i < 64; i++) {
    let x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    while (x) { d += x & 1; x >>= 1; }
  }
  return d;
}

const git = (args, cwd) => spawnSync('git', args, { cwd, encoding: 'utf8' });

/**
 * Commit corpus/fingerprints.json to `base` on its own, in a throwaway worktree off the live
 * branch, so it never carries anything else from the run's working tree. Entries already on
 * `base` that this run didn't touch are kept (another run may have landed since). Returns the
 * short sha, 'unchanged', or null on failure (logged; never fatal for the run).
 */
export function commitFingerprints(updates, { root = ROOT, base = 'main', message = 'chore: record capture fingerprints' } = {}) {
  if (!Object.keys(updates).length) return 'unchanged';
  let r = git(['fetch', '-q', 'origin', base], root);
  if (r.status !== 0) { console.error(`  fingerprints: fetch ${base} failed: ${r.stderr.trim()}`); return null; }
  const wt = mkdtempSync(join(tmpdir(), 'fingerprints-'));
  rmSync(wt, { recursive: true, force: true });
  r = git(['worktree', 'add', '-q', '--detach', wt, `origin/${base}`], root);
  if (r.status !== 0) { console.error(`  fingerprints: worktree add failed: ${r.stderr.trim()}`); return null; }
  try {
    const merged = { ...loadFingerprints(wt), ...updates };
    saveFingerprints(merged, wt);
    git(['add', '--', FINGERPRINTS], wt);
    if (git(['diff', '--cached', '--quiet'], wt).status === 0) return 'unchanged';
    r = git(['commit', '-q', '-m', message], wt);
    if (r.status !== 0) { console.error(`  fingerprints: commit failed: ${(r.stdout + r.stderr).trim()}`); return null; }
    r = git(['push', '-q', 'origin', `HEAD:refs/heads/${base}`], wt);
    if (r.status !== 0) { console.error(`  fingerprints: push to ${base} refused: ${r.stderr.trim()}`); return null; }
    // keep the run's own copy in step with what landed
    copyFileSync(join(wt, FINGERPRINTS), join(root, FINGERPRINTS));
    return git(['rev-parse', '--short', 'HEAD'], wt).stdout.trim();
  } finally {
    git(['worktree', 'remove', '--force', wt], root);
    rmSync(wt, { recursive: true, force: true });
  }
}
