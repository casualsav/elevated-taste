#!/usr/bin/env node
/**
 * PostToolUse hook (matcher Edit|Write|MultiEdit) — Phase 2 guardrail #2.
 *
 * On every edit to a UI file (HTML/CSS/JSX/TSX/Vue/Svelte): run the design-lint engine
 * and surface findings back to Claude as advisory context (non-blocking). Also record the
 * file into the session scope so the Stop-gate can re-lint it before "done".
 *
 * Fail-open everywhere: bad input, non-UI file, import/lint error, or TASTE_GATE=off → exit
 * 0 silently. This hook never blocks; the Stop-gate is the only gate (it re-lints fresh).
 *
 * One exception to "silent": if the taste repo can't be resolved (a stale REPO_PATH.txt, or a
 * cross-repo install whose engine is missing) the engine import fails and the whole guardrail
 * would vanish without a trace. In that specific case we emit ONE per-project advisory so the
 * owner knows the hooks are installed but NOT running — see the repoWarn() below. Never blocks.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { addFile, writeScope, readScope, getFlag, setFlag } from './lib/scope.mjs';
import { pluginHookShadowed, tasteRepo } from './lib/taste-repo.mjs';

// Installed both as a plugin and in this project (or globally)? Only the non-plugin copy runs.
if (pluginHookShadowed('post-write-lint.mjs')) process.exit(0);

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = process.env.CLAUDE_PROJECT_DIR || resolve(HERE, '..', '..'); // the project being edited
const TASTE = tasteRepo(REPO); // { path, resolved, staleMarker } — engine + tokens live at .path

const exit0 = () => process.exit(0);
const emit = (obj) => { process.stdout.write(JSON.stringify(obj)); process.exit(0); };

/**
 * Loud fail-open: the hooks are installed but the taste repo (engine) is unreachable, so no
 * lint / Stop-gate is running. Warn ONCE per project (a scope flag dedupes it) rather than
 * disappearing silently. Only fires when a real reason exists — a stale marker, or an
 * unresolved cross-repo install (NOT when we're simply home in the taste repo itself).
 */
function repoWarn(sid) {
  if (TASTE.resolved) return; // home or a good marker — nothing to warn about
  if (!TASTE.staleMarker && TASTE.path === REPO) return; // plausibly the taste repo w/o engine; stay quiet
  const scope = readScope(REPO);
  if (getFlag(scope, sid, 'repoUnresolvedNoted')) return exit0(); // already warned this project
  writeScope(REPO, setFlag(scope, sid, 'repoUnresolvedNoted'));
  const tgt = TASTE.staleMarker || TASTE.path;
  emit({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext:
    `web-design-taste hooks are installed but the taste repo could not be resolved (REPO_PATH.txt → ${tgt} is stale) — design lint and Stop-gate are NOT running. Fix REPO_PATH.txt or re-run tooling/install.mjs.` } });
}

async function main() {
  if (process.env.TASTE_GATE === 'off') return exit0();

  let input = {};
  try { input = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { return exit0(); }
  const file = input?.tool_input?.file_path;
  if (!file) return exit0();

  let engine;
  try { engine = await import(pathToFileURL(join(TASTE.path, 'tooling', 'design-lint.mjs')).href); }
  catch { return repoWarn(input.session_id); } // engine missing → warn once, then fail-open
  if (!engine.shouldLint(file)) return exit0();

  let findings = [];
  try { findings = engine.lintFile(file, { repo: TASTE.path }); } catch { return exit0(); }

  // record the touched UI file for the Stop-gate (even when clean — it's "in scope");
  // a whole-file Write is a rewrite, so the Stop-gate treats the session as build-scale
  const scope = addFile(REPO, input.session_id, file);
  if (input.tool_name === 'Write' && !scope.build) writeScope(REPO, { ...scope, build: true });
  if (!findings.length) return exit0();

  const e = engine.errorCount(findings), w = engine.warnCount(findings);
  let rel; try { rel = relative(REPO, file) || file; } catch { rel = file; }
  const body = findings.map((f) => `  ${f.level === 'error' ? '✗' : '·'} L${f.line} ${f.rule} — ${f.message}`).join('\n');
  const tail = e
    ? `Fix the ✗ errors before calling this done — the Stop-gate re-lints and will block otherwise. Use var(--token) names (see /tokens) and .claude/skills/web-design-taste/references/anti-patterns.md. If the brief deliberately wants one, say so out loud.`
    : `Warnings are advisory — apply the ones that fit.`;
  const additionalContext = `design-lint · ${rel} · ${e} error(s), ${w} warning(s)\n${body}\n${tail}`;

  emit({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext } });
}

main().catch(() => exit0());
