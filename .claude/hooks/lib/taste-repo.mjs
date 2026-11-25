/**
 * Resolve the TASTE REPO (where the lint engine + tokens + corpus live) from wherever the
 * hooks are running. Inside the taste repo itself the two are the same directory; in a
 * consuming project (cross-repo install via tooling/install.mjs) the vendored skill carries
 * a REPO_PATH.txt pointing back at the clone; installed as a plugin, the plugin root is a full
 * copy of the repo. Fail-open: no marker → assume we're home.
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
import { join, resolve, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const HOOKS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const hasEngine = (p) => !!p && existsSync(join(p, 'tooling', 'design-lint.mjs'));

/** The plugin root when this hook is running from an installed plugin copy, else null. */
export function pluginRoot() {
  const root = process.env.CLAUDE_PLUGIN_ROOT;
  if (!root) return null;
  const r = resolve(root);
  return HOOKS_DIR === join(r, '.claude', 'hooks') ? r : null;
}

/**
 * True when this is the PLUGIN copy of a hook and a non-plugin copy of the same hook is also
 * wired for this session: the project's own `.claude/hooks/` (the taste repo itself, or a
 * vendored `install.mjs --project`) or a global `install.mjs --global` in ~/.claude/settings.json.
 * The plugin copy then exits quietly, so a hook never runs twice on one event.
 */
export function pluginHookShadowed(name, projectRepo = process.env.CLAUDE_PROJECT_DIR || process.cwd()) {
  if (!pluginRoot()) return false;
  if (existsSync(join(projectRepo, '.claude', 'hooks', name))) return true;
  try { return readFileSync(join(homedir(), '.claude', 'settings.json'), 'utf8').includes(name); } catch { return false; }
}

export function tasteRepo(projectRepo) {
  // Installed as a plugin: the plugin root is a full copy of the taste repo.
  const plugin = pluginRoot();
  if (plugin && hasEngine(plugin)) return { path: plugin, resolved: true, staleMarker: null };
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
