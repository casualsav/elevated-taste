/**
 * Resolve the TASTE REPO (where the lint engine + tokens + corpus live) from wherever the
 * hooks are running. Inside the taste repo itself the two are the same directory; in a
 * consuming project (cross-repo install via tooling/install.mjs) the vendored skill carries
 * a REPO_PATH.txt pointing back at the clone. Fail-open: no marker → assume we're home.
 *
 * WHY this now returns a struct instead of a bare path:
 *   The old version silently fell back to `projectRepo` when a REPO_PATH.txt pointed at a
 *   moved/deleted clone. Then the engine import (`<repo>/tooling/design-lint.mjs`) failed,
 *   every hook exited 0, and the WHOLE guardrail system vanished with no trace — a stale
 *   marker looked identical to "no marker, we're home". The callers now get enough signal to
 *   tell those apart and warn ONCE (never block) when the repo is genuinely unresolvable:
 *     { path, resolved, staleMarker }
 *   - resolved:    a marker (or home) actually pointed at a dir with tooling/design-lint.mjs.
 *   - staleMarker: a REPO_PATH.txt existed and was readable, but its target LACKS the engine
 *                  (the loud case — someone moved the clone); the path string, else null.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const hasEngine = (p) => !!p && existsSync(join(p, 'tooling', 'design-lint.mjs'));

export function tasteRepo(projectRepo) {
  const markers = [
    join(projectRepo, '.claude', 'skills', 'web-design-taste', 'REPO_PATH.txt'),
    join(homedir(), '.claude', 'skills', 'web-design-taste', 'REPO_PATH.txt'),
  ];
  let staleMarker = null;
  for (const marker of markers) {
    let target;
    try { target = readFileSync(marker, 'utf8').trim(); } catch { continue; } // no such marker → try next
    if (!target) continue;
    if (hasEngine(target)) return { path: target, resolved: true, staleMarker: null };
    if (!staleMarker) staleMarker = target; // marker present but its target is missing the engine
  }
  // No usable marker. If the project IS the taste repo, we're home and resolved; otherwise
  // this is an unresolved cross-repo install (engine import will fail downstream).
  const resolved = hasEngine(projectRepo);
  return { path: projectRepo, resolved, staleMarker };
}
