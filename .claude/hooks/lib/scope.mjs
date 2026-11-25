/**
 * Session scope state shared by the post-write lint (writer) and the Stop-gate (reader).
 *
 * WHY a single shared per-project file (not one file per session_id):
 *   Sub-agent (worker) sessions run under a DIFFERENT session_id than the lead, and they
 *   never fire the Stop hook themselves — only the lead does. When each session kept its own
 *   `design-scope-<sid>.json`, a worker could write every UI file in a build and the lead's
 *   Stop-gate would read an EMPTY scope for its own sid and wave the stop through. The gate
 *   was trivially bypassed by delegation. Now every writer appends to ONE file,
 *   `.claude/.cache/design-scope.json`, and the Stop-gate re-lints the UNION of everything
 *   touched within a recent window — a worker-written file lands in the lead's gate.
 *
 * Shape:
 *   { entries: [{ file, sid, ts, edits }],   // one row per touched UI file, any session
 *     blocks:  { <sid>: n },                  // give-up counter — PER-sid (only the session
 *                                             //   being blocked increments its own count)
 *     build:   bool,                          // any whole-file Write happened this build
 *     flags:   { <sid>: { respNoted, visualNoted, repoUnresolvedNoted, ... } } }  // per-sid one-shots
 *
 * `entries` older than RECENT_MS are pruned on every write, so a stale build from hours ago
 * can't gate a fresh unrelated session. Per-sid `blocks`/`flags` keep the give-up valve and
 * one-time notices scoped to the session actually being acted on.
 *
 * Stored under .claude/.cache/ (gitignored). All failures are swallowed — fail-open. An
 * OLD-format file (per-sid path, or a bare {files,blocks} object) must not crash anything:
 * readScope() normalizes anything it can't understand to a fresh empty state.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dir = (repo) => join(repo, '.claude', '.cache');
const RECENT_MS = 4 * 60 * 60 * 1000; // 4h — a build older than this can't gate a new session
const sane = (sid) => String(sid || 'default').replace(/[^\w-]/g, '_').slice(0, 64);

export const scopePath = (repo) => join(dir(repo), 'design-scope.json');

/** Coerce whatever is on disk (possibly old-format or garbage) into the current shape. */
function normalize(raw) {
  const s = (raw && typeof raw === 'object') ? raw : {};
  return {
    entries: Array.isArray(s.entries) ? s.entries.filter((e) => e && typeof e.file === 'string') : [],
    blocks: (s.blocks && typeof s.blocks === 'object' && !Array.isArray(s.blocks)) ? s.blocks : {},
    totals: (s.totals && typeof s.totals === 'object' && !Array.isArray(s.totals)) ? s.totals : {},
    build: !!s.build,
    flags: (s.flags && typeof s.flags === 'object') ? s.flags : {},
  };
}

export function readScope(repo) {
  try { return normalize(JSON.parse(readFileSync(scopePath(repo), 'utf8'))); }
  catch { return { entries: [], blocks: {}, build: false, flags: {} }; }
}

export function writeScope(repo, data) {
  try {
    mkdirSync(dir(repo), { recursive: true });
    writeFileSync(scopePath(repo), JSON.stringify(normalize(data)));
  } catch { /* fail-open */ }
}

/** Drop entries older than the recent window (called on every write). */
function prune(entries) {
  const cutoff = Date.now() - RECENT_MS;
  return entries.filter((e) => typeof e.ts === 'number' && e.ts >= cutoff);
}

/** Upsert a touched UI file: bump `edits` + refresh `ts` on repeat, else append. Returns scope. */
export function addFile(repo, sid, file) {
  const abs = resolve(repo, file);
  const s = readScope(repo);
  s.entries = prune(s.entries);
  const hit = s.entries.find((e) => e.file === abs);
  if (hit) { hit.edits = (hit.edits || 1) + 1; hit.ts = Date.now(); hit.sid = sid; }
  else s.entries.push({ file: abs, sid, ts: Date.now(), edits: 1 });
  writeScope(repo, s);
  return s;
}

/** Union of files touched within the recent window, any session. */
export function sessionFiles(scope) {
  const cutoff = Date.now() - RECENT_MS;
  const seen = new Set();
  const out = [];
  for (const e of scope.entries || []) {
    if (typeof e.ts !== 'number' || e.ts < cutoff) continue;
    if (seen.has(e.file)) continue;
    seen.add(e.file);
    out.push(e.file);
  }
  return out;
}

/** Highest per-entry edit count across the recent window (build-scale signal). */
export function maxEdits(scope) {
  const cutoff = Date.now() - RECENT_MS;
  let m = 0;
  for (const e of scope.entries || []) {
    if (typeof e.ts !== 'number' || e.ts < cutoff) continue;
    if ((e.edits || 1) > m) m = e.edits || 1;
  }
  return m;
}

// ── per-sid LIFETIME block counter — never reset, the Stop-gate's hard ceiling ─
export const getTotalBlocks = (scope, sid) => (scope.totals && scope.totals[sane(sid)]) || 0;
export function bumpTotalBlocks(scope, sid) {
  scope.totals = scope.totals || {};
  scope.totals[sane(sid)] = (scope.totals[sane(sid)] || 0) + 1;
  return scope;
}

// ── per-sid give-up counter ──────────────────────────────────────────────────
export const getBlocks = (scope, sid) => (scope.blocks && scope.blocks[sane(sid)]) || 0;
export function setBlocks(scope, sid, n) {
  scope.blocks = scope.blocks || {};
  if (n) scope.blocks[sane(sid)] = n; else delete scope.blocks[sane(sid)];
  return scope;
}

// ── per-sid one-shot flags (respNoted / visualNoted / repoUnresolvedNoted / …) ─
export const getFlag = (scope, sid, name) => !!(scope.flags && scope.flags[sane(sid)] && scope.flags[sane(sid)][name]);
export function setFlag(scope, sid, name, value = true) {
  scope.flags = scope.flags || {};
  scope.flags[sane(sid)] = scope.flags[sane(sid)] || {};
  scope.flags[sane(sid)][name] = value;
  return scope;
}
