#!/usr/bin/env node
/**
 * reflect.mjs — Phase 3 post-build reflection.
 *
 * After a real build, look at what was actually built and propose corpus edits — a new pattern,
 * a principle refinement, or a new anti-pattern — that would have helped. It writes a *proposal*
 * to proposals/ for human review and NEVER edits the corpus itself. Like distill, it uses an
 * ephemeral subscription `claude -p` session (TASTE_GATE=off so the repo hooks don't trap it).
 *
 *   node tooling/reflect.mjs --target path/to/build.html --note "pricing page, soft direction"
 *   node tooling/reflect.mjs --target src/ --mock       # offline stub proposal
 *   node tooling/reflect.mjs --target x.html --print-cmd
 *
 * In a live session, the `/reflect` slash command (.claude/commands/reflect.md) is the ergonomic path.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const cfg = () => { try { return JSON.parse(readFileSync(join(ROOT, 'evolve.config.json'), 'utf8')); } catch { return {}; } };
const CLAUDE_BIN = process.env.CLAUDE_BIN || cfg().claude_bin || 'claude';
const MODEL = process.env.DISTILL_MODEL || cfg().distill_model || 'claude-opus-4-8';

const slugify = (s) => basename(String(s)).replace(extname(String(s)), '').replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'build';

function proposalPath(target) {
  const date = new Date().toISOString().slice(0, 10);
  return join(ROOT, 'proposals', `${date}-${slugify(target)}.md`);
}

function buildPrompt(target, note, out) {
  return [
    `You are running POST-BUILD REFLECTION for the Web Design Taste system. A UI was just built; decide whether the corpus should learn anything from it.`,
    ``,
    `Target build: ${target}${note ? `  (context: ${note})` : ''}`,
    ``,
    `Do this:`,
    `1. Read the target build. Optionally run \`node tooling/design-lint.mjs ${target}\` for the mechanical read.`,
    `2. Compare it against the corpus: corpus/<corpus>/principles.md, the relevant corpus/<corpus>/patterns/, and .claude/skills/web-design-taste/references/anti-patterns.md.`,
    `3. Identify at most 2-3 things worth teaching the corpus: a genuinely reusable section pattern it lacks, a principle that needs refining, or a new anti-pattern you hit. Each must be transferable, not specific to this one build. If nothing is worth changing, say so plainly.`,
    ``,
    `Write a SINGLE proposal file to ${out} (create the proposals/ dir if needed). Structure each item as: what -> why it generalizes -> the concrete corpus edit (which file, what change). This is a PROPOSAL for human review.`,
    ``,
    `Do NOT edit anything under corpus/, tokens/, directions/, or references/ — propose only. When done, print one line: REFLECTED ${basename(out)}`,
  ].join('\n');
}

export function buildArgs(target, note, out, { model = MODEL } = {}) {
  return ['-p', buildPrompt(target, note, out), '--model', model, '--effort', 'high', '--permission-mode', 'acceptEdits', '--no-session-persistence', '--add-dir', ROOT];
}

function mockWrite(target, note, out) {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, [
    `# Reflection proposal — ${basename(target)}`, '',
    `> Mock proposal written offline to exercise the reflection path. Not a real proposal. ${note ? `Context: ${note}.` : ''}`, '',
    `## Proposed corpus edits (review before applying)`, '',
    `1. **(example) New pattern candidate** -> a reusable section this build used that the corpus lacks -> add \`corpus/production/patterns/<slug>.md\`.`,
    `2. **(example) Principle refinement** -> something the corpus under-specifies -> tighten the relevant rule in \`corpus/production/principles.md\`.`, '',
    `Nothing here is auto-applied. Fold good items in by hand or via a PR.`, '',
  ].join('\n') + '\n');
}

export async function reflect(target, { note = '', mock = false, printCmd = false } = {}) {
  if (!target) { console.error('reflect: --target required'); return false; }
  const out = proposalPath(target);

  if (printCmd) { console.log([CLAUDE_BIN, ...buildArgs(target, note, out).map((a) => (a.includes('\n') || a.includes(' ') ? JSON.stringify(a.slice(0, 60) + (a.length > 60 ? '…' : '')) : a))].join(' ')); return true; }
  if (mock || process.env.MOCK_DISTILL === '1') { mockWrite(target, note, out); console.log(`[mock] wrote ${out.replace(ROOT + '/', '')}`); return existsSync(out); }

  const env = { ...process.env, TASTE_GATE: 'off' };
  const r = spawnSync(CLAUDE_BIN, buildArgs(target, note, out), { cwd: ROOT, env, encoding: 'utf8', timeout: (cfg().distill_timeout_min || 12) * 60_000, stdio: ['ignore', 'pipe', 'pipe'] });
  if (r.error) { console.error(`reflect: failed to launch ${CLAUDE_BIN}: ${r.error.message}`); return false; }
  if (!existsSync(out)) { console.error(`reflect: no proposal written (${r.status})`); return false; }
  console.log(`reflected -> ${out.replace(ROOT + '/', '')}`);
  return true;
}

if (resolve(process.argv[1] || '') === resolve(fileURLToPath(import.meta.url))) {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const t = process.argv[i];
    if (t === '--target') a.target = process.argv[++i];
    else if (t === '--note') a.note = process.argv[++i];
    else if (t === '--mock') a.mock = true;
    else if (t === '--print-cmd') a.printCmd = true;
  }
  if (!a.target) { console.error('usage: reflect.mjs --target <path> [--note "..."] [--mock|--print-cmd]'); process.exit(1); }
  reflect(a.target, a).then((ok) => process.exit(ok ? 0 : 1));
}
