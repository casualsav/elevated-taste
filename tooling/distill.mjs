#!/usr/bin/env node
/**
 * distill.mjs — Phase 3 headless distillation orchestrator.
 *
 * For one captured exemplar (screenshots + raw/<slug>.json + sources.json entry) it spins up an
 * EPHEMERAL Claude Code session via `claude -p` — using the box's SUBSCRIPTION auth, no API key —
 * that follows tooling/distill-prompt.md and writes the three corpus outputs:
 *   corpus/<corpus>/exemplars/<slug>.md
 *   corpus/<corpus>/tokens/<slug>.json
 *   corpus/<corpus>/patterns/<pattern-slug>.md  (1-2)
 *
 * The headless run executes inside this repo, so the Phase-2 hooks would otherwise fire on it.
 * We run it with TASTE_GATE=off so the Stop-gate can't trap the unattended session; the orchestrator
 * vets the outputs structurally afterwards instead.
 *
 *   node tooling/distill.mjs --slug linear --corpus production --url https://linear.app
 *   node tooling/distill.mjs --slug demo --corpus production --mock        # offline stub, no claude
 *   node tooling/distill.mjs --slug demo --corpus production --print-cmd   # show the claude argv
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, mkdtempSync, cpSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

function cfg() {
  try { return JSON.parse(readFileSync(join(ROOT, 'evolve.config.json'), 'utf8')); } catch { return {}; }
}

const CLAUDE_BIN = process.env.CLAUDE_BIN || cfg().claude_bin || 'claude';
const MODEL = process.env.DISTILL_MODEL || cfg().distill_model || 'claude-opus-4-8';
const EFFORT = process.env.DISTILL_EFFORT || cfg().distill_effort || 'high';
const TIMEOUT_MS = (cfg().distill_timeout_min || 12) * 60_000;

function buildPrompt(c) {
  const { slug, corpus, url } = c;
  return [
    `You are distilling ONE design exemplar into the Web Design Taste corpus. Follow the method in tooling/distill-prompt.md EXACTLY — read that file first.`,
    ``,
    `Exemplar: slug=${slug} · corpus=${corpus} · url=${url || '(see sources.json)'}`,
    ``,
    `Read first (this is your evidence):`,
    `- Screenshots: corpus/${corpus}/screenshots/${slug}/desktop.png and mobile.png — Read them as images.`,
    `- Source code (READ THESE — the real markup + styles, not just pixels): raw/${slug}.html (full rendered DOM) and raw/${slug}.css (every stylesheet concatenated). Use them to ground tokens, layout, and technique in the actual code — but distill transferable principles, never copy the site's classes/markup.`,
    `- Raw style + motion profile: raw/${slug}.json (frequency-ranked computed styles + motion block; approximate — corroborate against the code + screenshots, never ground-truth).`,
    `- Provenance (use this for the frontmatter provenance block; in the evolve flow there is no sources.json entry yet):`,
    '```json',
    JSON.stringify({ slug, corpus, url: url || null, title: c.title || null, source: c.source || 'editorial-pick', gallery_url: c.gallery_url || null, award_type: c.award_type || null, harvested_at: c.harvested_at || null }, null, 2),
    '```',
    ``,
    `Write exactly the three outputs defined in distill-prompt.md:`,
    `1. corpus/${corpus}/exemplars/${slug}.md  (structured entry + controlled retrieval vocabulary)`,
    `2. corpus/${corpus}/tokens/${slug}.json   (normalized token snapshot)`,
    `3. one or two corpus/${corpus}/patterns/<pattern-slug>.md  (reusable section patterns, framework-neutral HTML/CSS)`,
    ``,
    `Every principle must be transferable, not a description of this one site. Avoid the anti-patterns in the craft references. When finished, print exactly one final line: DONE ${slug}`,
  ].join('\n');
}

export function buildArgs(c, { model = MODEL, effort = EFFORT } = {}) {
  return [
    '-p', buildPrompt(c),
    '--model', model,
    '--effort', effort,
    '--permission-mode', 'acceptEdits', // auto-accept file writes; read/glob/grep are already allowed
    '--no-session-persistence',         // temporary/ephemeral CC session
    // no --add-dir: the session runs with cwd set to a throwaway git worktree (see runSandboxed)
    // and must not be granted the real checkout — raw/<slug>.html is attacker-controlled input.
  ];
}

function outPaths(c) {
  return {
    exemplar: join(ROOT, 'corpus', c.corpus, 'exemplars', `${c.slug}.md`),
    tokens: join(ROOT, 'corpus', c.corpus, 'tokens', `${c.slug}.json`),
    patternsDir: join(ROOT, 'corpus', c.corpus, 'patterns'),
  };
}

function fmField(md, key) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const line = m[1].split('\n').find((l) => l.trim().startsWith(key + ':'));
  return line ? line.slice(line.indexOf(':') + 1).trim().replace(/^["']|["']$/g, '') : null;
}
const hostOf = (u) => { try { return new URL(/^[a-z]+:\/\//.test(u) ? u : 'https://' + u).hostname.replace(/^www\./, ''); } catch { return null; } };

/**
 * Vet the distilled outputs: structure (frontmatter, valid JSON, non-trivial) PLUS semantics —
 * frontmatter identity must match the candidate, every cited pattern file must exist, and mock
 * stubs are rejected unless explicitly allowed (CLI --mock pipeline tests only, never evolve).
 */
export function verifyOutputs(c, { allowMock = false } = {}) {
  const p = outPaths(c);
  const reasons = [];
  if (!existsSync(p.exemplar)) reasons.push('exemplar .md missing');
  else {
    const t = readFileSync(p.exemplar, 'utf8');
    if (!t.startsWith('---')) reasons.push('exemplar .md has no frontmatter');
    if (t.length < 400) reasons.push('exemplar .md too short');
    const fmSlug = fmField(t, 'slug');
    if (fmSlug && fmSlug !== c.slug) reasons.push(`frontmatter slug "${fmSlug}" != candidate "${c.slug}"`);
    const fmCorpus = fmField(t, 'corpus');
    if (fmCorpus && fmCorpus !== c.corpus) reasons.push(`frontmatter corpus "${fmCorpus}" != candidate "${c.corpus}"`);
    if (c.url) {
      const want = hostOf(c.url), got = hostOf(fmField(t, 'url') || '');
      if (want && got && want !== got) reasons.push(`frontmatter url host "${got}" != candidate "${want}"`);
    }
    const tags = fmField(t, 'tags') || '';
    if (!allowMock && /\bmock\b/.test(tags)) reasons.push('mock stub output (tags contain "mock")');
    const pm = t.match(/^patterns:\s*\[([^\]]*)\]/m);
    if (pm) {
      for (const pat of pm[1].split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)) {
        if (!existsSync(join(p.patternsDir, `${pat}.md`))) reasons.push(`cited pattern "${pat}" has no file`);
      }
    }
  }
  if (!existsSync(p.tokens)) reasons.push('tokens .json missing');
  else {
    try {
      const j = JSON.parse(readFileSync(p.tokens, 'utf8'));
      if (!j || typeof j !== 'object') reasons.push('tokens .json not an object');
      else if (!allowMock && j.$mock) reasons.push('mock stub tokens ($mock)');
    }
    catch { reasons.push('tokens .json invalid'); }
  }
  return { ok: reasons.length === 0, reasons };
}

/**
 * Run the headless session inside a throwaway git worktree and copy back ONLY the allowlisted
 * outputs. The prompt embeds raw/<slug>.html — arbitrary web content — so the session must be
 * treated as injectable: nothing it writes lands in the real checkout except the three expected
 * corpus outputs (and new pattern files); everything else is logged and discarded.
 */
function runSandboxed(c, args, env) {
  const parent = mkdtempSync(join(tmpdir(), `distill-${c.slug}-`));
  const wt = join(parent, 'wt');
  const add = spawnSync('git', ['worktree', 'add', '--detach', wt, 'HEAD'], { cwd: ROOT, encoding: 'utf8' });
  if (add.status !== 0) { rmSync(parent, { recursive: true, force: true }); return { launched: false, error: `worktree add failed: ${(add.stderr || '').slice(-200)}` }; }
  try {
    // stage the git-ignored evidence the session reads
    for (const ext of ['json', 'html', 'css']) {
      const f = join(ROOT, 'raw', `${c.slug}.${ext}`);
      if (existsSync(f)) { mkdirSync(join(wt, 'raw'), { recursive: true }); cpSync(f, join(wt, 'raw', `${c.slug}.${ext}`)); }
    }
    const shots = join(ROOT, 'corpus', c.corpus, 'screenshots', c.slug);
    if (existsSync(shots)) cpSync(shots, join(wt, 'corpus', c.corpus, 'screenshots', c.slug), { recursive: true });

    const r = spawnSync(CLAUDE_BIN, args, { cwd: wt, env, encoding: 'utf8', timeout: TIMEOUT_MS, stdio: ['ignore', 'pipe', 'pipe'] });
    if (r.error) return { launched: false, error: `failed to launch ${CLAUDE_BIN}: ${r.error.message}` };
    if (r.status !== 0) console.error(`distill: ${c.slug} exited ${r.status}: ${(r.stderr || '').slice(-400)} · stdout: ${(r.stdout || '').slice(-400)}`);

    const status = spawnSync('git', ['status', '--porcelain'], { cwd: wt, encoding: 'utf8' }).stdout || '';
    const allowExact = new Set([`corpus/${c.corpus}/exemplars/${c.slug}.md`, `corpus/${c.corpus}/tokens/${c.slug}.json`]);
    const newPattern = new RegExp(`^corpus/${c.corpus}/patterns/[a-z0-9-]+\\.md$`);
    const files = [];
    for (const line of status.split('\n').filter(Boolean)) {
      const code = line.slice(0, 2), rel = line.slice(3).trim();
      if (!rel) continue;
      if (allowExact.has(rel) || (code === '??' && newPattern.test(rel))) {
        mkdirSync(dirname(join(ROOT, rel)), { recursive: true });
        cpSync(join(wt, rel), join(ROOT, rel));
        files.push(rel);
      } else {
        console.warn(`distill: ${c.slug} wrote outside the output allowlist — DISCARDED: ${code} ${rel}`);
      }
    }
    return { launched: true, copied: files.length, files };
  } finally {
    spawnSync('git', ['worktree', 'remove', '--force', wt], { cwd: ROOT, encoding: 'utf8' });
    rmSync(parent, { recursive: true, force: true });
  }
}

function mockWrite(c) {
  const p = outPaths(c);
  mkdirSync(dirname(p.exemplar), { recursive: true });
  mkdirSync(dirname(p.tokens), { recursive: true });
  mkdirSync(p.patternsDir, { recursive: true });
  writeFileSync(p.exemplar, [
    '---', `slug: ${c.slug}`, `url: ${c.url || ''}`, `corpus: ${c.corpus}`,
    'captured: 2026-06-23', 'tags: [mock]', 'when_to_use: [landing]', 'directions: [minimalist]',
    '---', '', `# ${c.slug} (MOCK)`, '',
    'Mock distillation stub written offline to exercise the Phase 3 pipeline end to end — the orchestrator, the structural vet, and the reconcile step. This is not a real exemplar and must never be committed to the corpus; the `mock` tag marks it for removal. A real distillation run replaces this body with transferable, cross-exemplar design principles drawn from the screenshots and the normalized token snapshot.',
  ].join('\n') + '\n');
  writeFileSync(p.tokens, JSON.stringify({ $mock: true, slug: c.slug, color: { bg: '#ffffff' } }, null, 2) + '\n');
  writeFileSync(join(p.patternsDir, `${c.slug}-mock.md`), `# ${c.slug} mock pattern\n\nStub.\n`);
}

/**
 * Distill one candidate. Returns true on a verified write.
 *   opts.mock     — write stub outputs instead of calling claude (offline test)
 *   opts.printCmd — print the claude argv and return true without running
 */
export async function distillCandidate(c, opts = {}) {
  if (!c?.slug || !c?.corpus) { console.error('distill: candidate needs slug + corpus'); return false; }

  if (opts.printCmd) {
    console.log([CLAUDE_BIN, ...buildArgs(c, opts).map((a) => (a.includes('\n') || a.includes(' ') ? JSON.stringify(a.slice(0, 60) + (a.length > 60 ? '…' : '')) : a))].join(' '));
    return true;
  }
  if (opts.mock || process.env.MOCK_DISTILL === '1') {
    mockWrite(c);
    // Only an EXPLICIT --mock (pipeline test) may pass the vet; a stray MOCK_DISTILL=1 in the
    // environment must never let a stub through evolve to a PR.
    const v = verifyOutputs(c, { allowMock: opts.mock === true });
    console.log(`[mock] ${c.slug}: ${v.ok ? 'outputs written + verified' : 'FAILED ' + v.reasons.join(', ')}`);
    return v.ok;
  }

  const args = buildArgs(c, opts);
  const env = { ...process.env, TASTE_GATE: 'off' }; // don't let the repo hooks trap the headless run
  const sb = runSandboxed(c, args, env);
  if (!sb.launched) { console.error(`distill: ${sb.error}`); return false; }

  const v = verifyOutputs(c);
  if (!v.ok) { console.error(`distill: ${c.slug} produced invalid output — ${v.reasons.join(', ')}`); return false; }

  // render gate: every NEW pattern recipe must actually run (no JS errors, no 1280/375
  // overflow) before it can reach a PR. Infra failure (no Playwright) fails open with a
  // warning — the structural vet already passed and CI re-checks.
  const newPatterns = (sb.files || []).filter((f) => f.includes('/patterns/')).map((f) => join(ROOT, f));
  if (newPatterns.length) {
    try {
      const { pathToFileURL } = await import('node:url');
      const { renderCheck } = await import(pathToFileURL(join(ROOT, 'tooling', 'render-patterns.mjs')).href);
      const rc = await renderCheck(newPatterns);
      if (!rc.ok) {
        for (const f of rc.failures) console.error(`distill: ${c.slug} pattern "${f.slug}" fails render check — ${f.problems.join(' · ')}`);
        return false;
      }
    } catch (e) {
      console.warn(`distill: render check unavailable (${String(e.message || e).slice(0, 120)}) — accepted on structural vet only`);
    }
  }
  console.log(`distilled ${c.slug} ✓ (${sb.copied} file(s) from sandbox)`);
  return true;
}

// ── CLI ──────────────────────────────────────────────────────────────────────
if (resolve(process.argv[1] || '') === resolve(fileURLToPath(import.meta.url))) {
  const a = { };
  for (let i = 2; i < process.argv.length; i++) {
    const t = process.argv[i];
    if (t === '--slug') a.slug = process.argv[++i];
    else if (t === '--corpus') a.corpus = process.argv[++i];
    else if (t === '--url') a.url = process.argv[++i];
    else if (t === '--effort') a.effort = process.argv[++i];
    else if (t === '--mock') a.mock = true;
    else if (t === '--print-cmd') a.printCmd = true;
  }
  if (!a.slug || !a.corpus) { console.error('usage: distill.mjs --slug <s> --corpus <production|expressive> [--url u] [--mock|--print-cmd]'); process.exit(1); }
  distillCandidate({ slug: a.slug, corpus: a.corpus, url: a.url }, a)
    .then((ok) => process.exit(ok ? 0 : 1));
}
