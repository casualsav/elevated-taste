#!/usr/bin/env node
/**
 * install.mjs — cross-repo install of the Web Design Taste system into a consuming project.
 * Everything travels: the Skill (+ craft references), the guardrail hooks (prompt-guard,
 * post-write lint, Stop-gate), the /compose and /reflect commands, and the built tokens.css.
 * The corpus itself stays in this clone — the vendored skill carries a REPO_PATH.txt pointer
 * and the hooks resolve the lint engine + tokens through it (lib/taste-repo.mjs).
 *
 *   node tooling/install.mjs --project /path/to/your-app     # vendor into one project
 *   node tooling/install.mjs --global                        # skill + bias for every project
 *
 * Idempotent: re-run after pulling new corpus/tooling to refresh the vendored copies.
 * settings.json is merged additively (a timestamped backup is written first); an existing
 * conflicting hook entry is never removed.
 */
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const TASTE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const globalMode = args.includes('--global');
const pIdx = args.indexOf('--project');
const project = pIdx !== -1 ? resolve(args[pIdx + 1] || '') : null;

if (!globalMode && !project) {
  console.error('usage: node tooling/install.mjs --project <dir> | --global');
  process.exit(1);
}
if (project && !existsSync(project)) {
  console.error(`project dir not found: ${project}`);
  process.exit(1);
}
if (project && resolve(project) === TASTE) {
  console.error('that IS the taste repo — nothing to install; the skill and hooks already apply here.');
  process.exit(1);
}

const done = [];
const manual = [];

const BIAS_BEGIN = '<!-- web-design-taste:begin (managed by tooling/install.mjs) -->';
const BIAS_END = '<!-- web-design-taste:end -->';
const BIAS = [
  BIAS_BEGIN,
  '# Design taste — repo bias (always on)',
  '',
  'For ANY UI / frontend / CSS work:',
  '',
  '- **Load the `web-design-taste` skill before writing any markup or styles.** Consult the corpus (see the skill\'s `corpus/index.json` retrieval index); don\'t invent from defaults.',
  '- **Default to the `production` corpus.** Use `expressive` only for marketing / landing / brand-experience work.',
  '- **Never ship the generic template** (oversized hero + vague headline + three feature cards + soft gradient + fake dashboard mockup).',
  '- **Use `var(--token)` names from the taste tokens** — no hard-coded magic numbers for color, space, or type.',
  '- **State which exemplar(s) / principles you drew from.** `/compose <brief>` assembles a build sheet from the corpus.',
  BIAS_END,
].join('\n');

function appendBias(claudeMdPath) {
  let text = '';
  try { text = readFileSync(claudeMdPath, 'utf8'); } catch { /* new file */ }
  if (text.includes(BIAS_BEGIN)) {
    const next = text.replace(new RegExp(`${BIAS_BEGIN}[\\s\\S]*?${BIAS_END}`), BIAS);
    if (next !== text) { writeFileSync(claudeMdPath, next); done.push(`refreshed bias block in ${claudeMdPath}`); }
    return;
  }
  writeFileSync(claudeMdPath, (text ? text.trimEnd() + '\n\n' : '') + BIAS + '\n');
  done.push(`${text ? 'appended' : 'created'} bias block in ${claudeMdPath}`);
}

/** Merge our three hook entries into a settings.json, additively, with a backup. */
function mergeSettings(settingsPath, hookPathPrefix) {
  const ours = JSON.parse(readFileSync(join(TASTE, '.claude', 'settings.json'), 'utf8')).hooks;
  let settings = {};
  let existed = false;
  try { settings = JSON.parse(readFileSync(settingsPath, 'utf8')); existed = true; } catch { /* new file */ }
  settings.hooks ||= {};
  let added = 0;
  for (const [event, entries] of Object.entries(ours)) {
    settings.hooks[event] ||= [];
    for (const entry of entries) {
      const rewritten = JSON.parse(JSON.stringify(entry));
      for (const h of rewritten.hooks || []) {
        h.command = h.command.replace('${CLAUDE_PROJECT_DIR}/.claude/hooks', hookPathPrefix);
      }
      const already = JSON.stringify(settings.hooks[event]).includes(
        (rewritten.hooks?.[0]?.command || '').split('/').pop().replace(/"$/, ''));
      if (!already) { settings.hooks[event].push(rewritten); added++; }
    }
  }
  if (added) {
    if (existed) { copyFileSync(settingsPath, settingsPath + '.taste-backup'); manual.push(`review ${settingsPath} (backup at .taste-backup)`); }
    mkdirSync(dirname(settingsPath), { recursive: true });
    writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
    done.push(`wired ${added} hook entr${added === 1 ? 'y' : 'ies'} into ${settingsPath}`);
  } else {
    done.push(`hooks already wired in ${settingsPath}`);
  }
}

function installSkill(skillDest) {
  cpSync(join(TASTE, '.claude', 'skills', 'web-design-taste'), skillDest, { recursive: true });
  writeFileSync(join(skillDest, 'REPO_PATH.txt'), TASTE + '\n');
  copyFileSync(join(TASTE, 'tokens', 'tokens.css'), join(skillDest, 'tokens.css'));
  done.push(`skill → ${skillDest} (REPO_PATH → ${TASTE}; tokens.css vendored alongside)`);
}

if (project) {
  installSkill(join(project, '.claude', 'skills', 'web-design-taste'));
  cpSync(join(TASTE, '.claude', 'hooks'), join(project, '.claude', 'hooks'), { recursive: true });
  done.push(`hooks → ${join(project, '.claude', 'hooks')} (lint engine + tokens resolve via REPO_PATH)`);
  for (const cmd of ['compose.md', 'reflect.md']) {
    mkdirSync(join(project, '.claude', 'commands'), { recursive: true });
    copyFileSync(join(TASTE, '.claude', 'commands', cmd), join(project, '.claude', 'commands', cmd));
  }
  done.push('commands → /compose, /reflect');
  mergeSettings(join(project, '.claude', 'settings.json'), '${CLAUDE_PROJECT_DIR}/.claude/hooks');
  appendBias(join(project, 'CLAUDE.md'));
  manual.push(`link the tokens where your styles load: .claude/skills/web-design-taste/tokens.css (or build a preset: node ${TASTE}/tokens/build.mjs --preset=<name>)`);
} else {
  installSkill(join(homedir(), '.claude', 'skills', 'web-design-taste'));
  // Global hooks run from the taste clone itself with absolute paths — nothing else to vendor.
  mergeSettings(join(homedir(), '.claude', 'settings.json'), join(TASTE, '.claude', 'hooks'));
  appendBias(join(homedir(), '.claude', 'CLAUDE.md'));
  manual.push('global hooks execute from this clone — keep it in place (or re-run after moving it)');
}

console.log('installed:');
for (const d of done) console.log('  ✓ ' + d);
if (manual.length) {
  console.log('check by hand:');
  for (const m of manual) console.log('  → ' + m);
}
console.log('\nkeep this clone up to date (git pull) — the skill reads the corpus live from it; re-run this installer only when tooling/hooks change.');
