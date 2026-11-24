#!/usr/bin/env node
/**
 * evolve.mjs — Phase 3 self-evolving loop orchestrator.
 *
 * Stages: load config → candidates (harvest --json | injected) → dedupe pass 1 (vs corpus)
 *         → resolve detail-page URLs → slug from the REAL site URL → dedupe pass 2 (resolved
 *         identity) → cap → capture → distill (subscription `claude -p`) → land or hold → report.
 *
 * Each distilled site is gated (reconcile + validate + render check) and landed on main as its
 * own commit in the same run; one that fails the gate opens a PR labelled `hold` instead
 * (lib/land.mjs). It never writes the canonical sources.json: post-merge-derivations does.
 * Config is evolve.config.json (the CP5 bot edits it).
 *
 *   node tooling/evolve.mjs --dry-run --candidates cand.json   # plan only, offline, no writes
 *   node tooling/evolve.mjs                                     # full live run (uses subscription)
 *   node tooling/evolve.mjs --limit 2 --no-pr --no-report
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve as presolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadExistingKeys, filterNew, normalizeUrl } from './lib/dedupe.mjs';

const ROOT = presolve(dirname(fileURLToPath(import.meta.url)), '..');
const log = (...a) => console.log(...a);

const DEFAULTS = {
  paused: false, cadence: 'weekly', candidates_per_run: 4,
  corpora: ['production', 'expressive'], galleries: ['godly', 'landbook', 'awwwards'],
  directions_bias: [], min_score: null, capture_settle_ms: 7000, report: { telegram: true }, last_run: null,
};

function loadConfig() {
  try { return { ...DEFAULTS, ...JSON.parse(readFileSync(join(ROOT, 'evolve.config.json'), 'utf8')) }; }
  catch { return { ...DEFAULTS }; }
}

function parseArgs(argv) {
  const a = { dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--dry-run') a.dryRun = true;
    else if (t === '--force') a.force = true;
    else if (t === '--no-pr') a.noPr = true;
    else if (t === '--no-report') a.noReport = true;
    else if (t === '--candidates') a.candidatesFile = argv[++i];
    else if (t === '--limit') a.limit = parseInt(argv[++i], 10);
  }
  return a;
}

function slugFromUrl(url) {
  try {
    const host = new URL(/^[a-z]+:\/\//.test(url) ? url : 'https://' + url).hostname.replace(/^www\./, '');
    const labels = host.split('.');
    const name = labels.length >= 2 ? labels[labels.length - 2] : labels[0];
    return name.replace(/[^a-z0-9-]/gi, '').toLowerCase();
  } catch { return String(url).replace(/[^a-z0-9-]/gi, '').toLowerCase().slice(0, 24) || 'site'; }
}

function spawnNode(scriptRelPath, args, opts = {}) {
  return spawnSync('node', [join(ROOT, scriptRelPath), ...args], { cwd: ROOT, encoding: 'utf8', ...opts });
}

// ── stage 1: candidates ──────────────────────────────────────────────────────
/** Human-queued sources (tooling/manual-sources.json) — ingested FIRST, before gallery
 *  harvest, so under-covered app-UI categories (see tooling/coverage.mjs) can be filled
 *  deliberately. Already-merged entries are dropped by dedupe, so the file never needs
 *  mutation after ingestion. */
function manualCandidates() {
  // Absent is fine (nothing queued); present-but-unparseable is a config error only a human
  // can fix. Both used to return [] in silence, which is how a queued backlog can stop being
  // ingested for weeks without a single line of output saying so.
  const p = join(ROOT, 'tooling/manual-sources.json');
  if (!existsSync(p)) { log('manual-sources: none queued (tooling/manual-sources.json absent)'); return []; }
  let m;
  try { m = JSON.parse(readFileSync(p, 'utf8')); }
  catch (e) { throw new Error(`tooling/manual-sources.json is present but unparseable: ${e.message} — fix or remove it; refusing to run as if nothing were queued`); }
  const out = [];
  for (const corpus of ['production', 'expressive']) {
    for (const e of m[corpus] || []) {
      if (!e?.url) continue;
      out.push({ ...e, corpus, source: e.source || 'manual', needs_resolve: false, manual: true });
    }
  }
  log(`manual-sources: ${out.length} queued candidate(s)${out.length ? ' (ingested before gallery harvest)' : ''}`);
  return out;
}

async function getCandidates(cfg, args) {
  if (args.candidatesFile) {
    const arr = JSON.parse(readFileSync(presolve(args.candidatesFile), 'utf8'));
    return Array.isArray(arr) ? arr : [];
  }
  const manual = manualCandidates();
  // live: harvest emits JSON, never touching sources.json
  const limit = Math.max(cfg.candidates_per_run * 3, 12); // over-harvest; dedupe trims
  const harvestArgs = ['--json', '--limit', String(limit)];
  const r = spawnNode('tooling/harvest.mjs', harvestArgs);
  if (r.status !== 0) { console.error('harvest failed:', r.stderr || r.error?.message); return manual; }
  try { return [...manual, ...JSON.parse(r.stdout.trim().split('\n').pop())]; }
  catch (e) {
    // Harvest exited 0 but emitted something unparseable — a harvester bug that silently
    // degraded the run to manual-only. Loud, but not fatal: manual sources can still carry it.
    console.error(`harvest emitted unparseable JSON despite exit 0: ${e.message} · stdout tail: ${(r.stdout || '').trim().slice(-200)}`);
    return manual;
  }
}

// ── stage 2: resolve detail-page URLs → real external site (best-effort, live only) ──
// The slug is derived from the RESOLVED site URL, never the gallery detail URL — a detail-URL
// slug would name every candidate after the gallery and collide across weeks.
async function resolveCandidates(fresh, { dryRun }) {
  const out = [];
  let resolver = null;
  for (const c of fresh) {
    if (!c.needs_resolve) { out.push(c); continue; }
    if (dryRun) { out.push({ ...c, slug: c.slug || slugFromUrl(c.url), _resolve: 'would resolve detail page → external site' }); continue; }
    if (!resolver) { try { resolver = (await import(pathToFileURL(join(ROOT, 'tooling/lib/resolve.mjs')).href)).resolveExternalUrl; } catch { resolver = null; } }
    let real = null;
    try { real = resolver ? await resolver(c.url) : null; } catch { real = null; }
    if (real) out.push({ ...c, url: real, slug: slugFromUrl(real), gallery_url: c.url, needs_resolve: false });
    else log(`  · could not resolve ${c.url} — skipping (use godly/external galleries or manual-sources.json)`);
  }
  return out;
}

// ── run lock: timer + Telegram /run + manual invocations share one working tree ──
const degradedSites = []; // sites distilled on reduced evidence — surfaced in the run + digest
const LOCK = join(ROOT, '.cache', 'evolve.lock');
const LOCK_STALE_MS = 2 * 3600_000; // a run is capped well under 2h; older locks are crash leftovers
function acquireLock() {
  mkdirSync(join(ROOT, '.cache'), { recursive: true });
  try { writeFileSync(LOCK, String(process.pid), { flag: 'wx' }); return true; }
  catch {
    try {
      if (Date.now() - statSync(LOCK).mtimeMs > LOCK_STALE_MS) { writeFileSync(LOCK, String(process.pid)); return true; }
    } catch { /* raced or unreadable — treat as held */ }
    return false;
  }
}
function releaseLock() { try { unlinkSync(LOCK); } catch { /* already gone */ } }

function printPlan(picked, skipped, cfg) {
  log(`\nPLAN — up to ${cfg.candidates_per_run} candidate(s)/run:`);
  if (!picked.length) log('  (no new candidates)');
  picked.forEach((c, i) => log(`  ${i + 1}. ${c.slug.padEnd(20)} ${c.corpus || '?'}  ${c.url}${c._resolve ? '  [' + c._resolve + ']' : ''}`));
  if (skipped.length) {
    log(`\n  skipped ${skipped.length} (dedupe):`);
    for (const s of skipped.slice(0, 12)) log(`    - ${(s.slug || slugFromUrl(s.url)).padEnd(20)} ${s.reason}`);
  }
}

// ── live stages (filled across CP2/CP3; dynamic-imported so dry-run never needs them) ──
function captureOne(c, cfg) {
  const r = spawnNode('tooling/capture.mjs', ['--url', c.url, '--slug', c.slug, '--corpus', c.corpus, '--settle', String(cfg.capture_settle_ms)]);
  if (r.status !== 0) { log(`  capture failed: ${c.slug} — ${(r.stderr || '').trim().split('\n').pop()}`); return false; }
  // quality gate: a bot-wall / blank page produces a tiny screenshot and thin HTML —
  // distilling it would fabricate an exemplar from an error page.
  try {
    const shot = statSync(join(ROOT, 'corpus', c.corpus, 'screenshots', c.slug, 'desktop.png'));
    if (shot.size < 25_000) { log(`  capture rejected: ${c.slug} — desktop.png only ${Math.round(shot.size / 1024)}KB (bot-wall/blank?)`); return false; }
    const html = statSync(join(ROOT, 'raw', `${c.slug}.html`));
    if (html.size < 10_000) { log(`  capture rejected: ${c.slug} — raw html only ${Math.round(html.size / 1024)}KB (bot-wall/blank?)`); return false; }
  } catch (e) { log(`  capture rejected: ${c.slug} — expected outputs missing (${e.message})`); return false; }

  // capture.mjs's sub-captures fail independently and it still exits 0, so a hollowed-out
  // capture used to pass this gate and get distilled on whatever survived. `code` (the rendered
  // HTML/CSS) is the evidence distillation is grounded in — without it the session would work
  // from screenshots alone, which is the one thing the pipeline must never do. That one is
  // fatal for the candidate; the rest reduce the evidence without invalidating it.
  const prof = captureErrorsFor(c.slug);
  if (!prof.ok) { log(`  capture rejected: ${c.slug} — ${prof.reason}`); return false; }
  const fatal = prof.stages.filter((s) => s === 'code' || s === 'desktop');
  if (fatal.length) { log(`  capture rejected: ${c.slug} — ${fatal.join(' + ')} capture failed; distillation would run on screenshots alone`); return false; }
  if (prof.stages.length) {
    log(`  capture DEGRADED: ${c.slug} — ${prof.stages.join(', ')} failed; distilling on reduced evidence`);
    degradedSites.push(`${c.slug} (${prof.stages.join('/')})`);
  }
  return true;
}

/** Which sub-captures failed, per raw/<slug>.json. An unreadable profile is itself a reject —
 *  swallowing that here would just reintroduce the bug this gate exists to close. */
function captureErrorsFor(slug) {
  const p = join(ROOT, 'raw', `${slug}.json`);
  try {
    const j = JSON.parse(readFileSync(p, 'utf8'));
    return { ok: true, stages: (j.capture_errors || []).map((e) => e.stage) };
  } catch (e) { return { ok: false, reason: `capture profile unreadable (${e.message})` }; }
}
async function distillOne(c) {
  const { distillCandidate } = await import(pathToFileURL(join(ROOT, 'tooling/distill.mjs')).href);
  return distillCandidate(c, { root: ROOT });
}
async function landSites(distilled, cfg) {
  const { landOrHold } = await import(pathToFileURL(join(ROOT, 'tooling/lib/land.mjs')).href);
  return landOrHold(distilled, { cfg }); // one commit per site on main, or a hold PR
}
/** Both digest secrets present — i.e. the run intends to send, so a miss is a real failure. */
function digestConfigured() {
  return !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

async function sendReport(payload, cfg) {
  const { sendReport: send } = await import(pathToFileURL(join(ROOT, 'tooling/report.mjs')).href);
  let coverage = [];
  try { coverage = (await import(pathToFileURL(join(ROOT, 'tooling/coverage.mjs')).href)).coverageGaps(ROOT); }
  catch (e) { log(`coverage gaps unavailable: ${e.message}`); } // advisory, but no longer silent
  const res = await send({ ...payload, coverage }, { cfg });
  // The digest is the detection channel. report.mjs prints why a send failed, but nothing
  // noticed that it HADN'T sent — so a dead channel looked like a healthy run.
  if (digestConfigured() && !res?.sent) log('report FAILED: digest not sent although TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID are set (reason above).');
  return res;
}

function touchLastRun(extra = {}) {
  try {
    const p = join(ROOT, 'evolve.config.json');
    const cfg = JSON.parse(readFileSync(p, 'utf8'));
    writeFileSync(p, JSON.stringify({ ...cfg, last_run: new Date().toISOString(), ...extra }, null, 2) + '\n');
  } catch (e) { log(`last_run not recorded: ${e.message}`); } // non-fatal, but no longer silent
}

async function main() {
  const args = parseArgs(process.argv);
  const cfg = loadConfig();
  const limit = args.limit || cfg.candidates_per_run;
  log(`evolve — ${args.dryRun ? 'DRY RUN' : 'live'} · cadence ${cfg.cadence} · cap ${limit}`);

  if (cfg.paused && !args.force) { log('paused (evolve.config.json) — set paused:false or pass --force. Exiting.'); return; }
  if (!args.dryRun && !acquireLock()) { log('another evolve run holds .cache/evolve.lock — exiting.'); return; }

  try {

  const raw = await getCandidates(cfg, args);
  // Slug now only for candidates already pointing at the real site; detail-page candidates
  // get theirs from the resolved URL inside resolveCandidates (see D1 in docs/UPGRADES.md).
  const candidates = raw.map((c) => (c.needs_resolve ? { ...c } : { ...c, slug: c.slug || slugFromUrl(c.url) }));
  log(`candidates in: ${candidates.length}`);

  const keys = loadExistingKeys(ROOT, cfg.corpora);
  // pass 1: cheap pre-resolve dedupe (known site URLs + in-batch duplicates)
  const pass1 = filterNew(candidates, keys);
  const resolved = await resolveCandidates(pass1.fresh, args);
  // pass 2: the resolved site URL + real slug re-checked against the corpus — a gallery links
  // the same site under a fresh detail URL every week, so pass 1 alone would re-ingest it.
  // Skipped in dry-run: unresolved candidates still carry gallery URLs there and would
  // false-positive as in-batch slug duplicates.
  const pass2 = args.dryRun ? { fresh: resolved, skipped: [] } : filterNew(resolved, keys);
  const skipped = [...pass1.skipped, ...pass2.skipped];
  const picked = pass2.fresh.slice(0, limit);
  printPlan(picked, skipped, cfg);

  if (args.dryRun) { log('\n[dry-run] stop before capture/distill/PR.'); return; }
  if (!picked.length) { log('nothing new to distill.'); if (!args.noReport) await sendReport({ results: [], skipped, degraded: degradedSites }, cfg).catch((e) => log(`report failed: ${e.message}`)); return; }

  log('\ncapturing…');
  const captured = picked.filter((c) => captureOne(c, cfg));
  log(`captured ${captured.length}/${picked.length}`);

  log('distilling (subscription claude -p)…');
  const distilled = [];
  for (const c of captured) { try { if (await distillOne(c)) distilled.push(c); } catch (e) { log(`  distill failed: ${c.slug} — ${e.message}`); } }
  log(`distilled ${distilled.length}/${captured.length}`);

  let results = [];
  if (distilled.length && !args.noPr) { try { results = await landSites(distilled, cfg); } catch (e) { log(`landing failed: ${e.message}`); } }
  const landed = results.filter((r) => r.landed).length;
  const held = results.filter((r) => r.pr?.url).length;
  log(`landed ${landed} on main, held ${held} for review (PR labelled hold)`);
  // land.mjs returns per-site failures on `.error`; print them, so a run that distilled fine but
  // landed nothing never reads like a clean one.
  for (const r of results.filter((x) => x.error)) log(`  landing failed: ${r.slug} — ${r.error}`);
  if (!args.noReport) { try { await sendReport({ results, skipped, degraded: degradedSites }, cfg); } catch (e) { log(`report failed: ${e.message}`); } }
  touchLastRun();
  log('\ndone. Passing sites are on main (one commit each); failing ones wait in a hold PR.');

  // Captured sites but distilled none = failure, not a quiet "nothing new". Four weekly runs
  // 401'd on every candidate and still reported success. Set the code AFTER the digest sends,
  // so the report that explains the failure still reaches the owner.
  if (captured.length && !distilled.length) {
    log(`FAILED: captured ${captured.length} site(s) but distilled 0 — see the distill errors above.`);
    process.exitCode = 1;
  } else if (distilled.length && !args.noPr && !landed && !held) {
    log(`FAILED: distilled ${distilled.length} site(s) but landed or held none — see the errors above.`);
    process.exitCode = 1;
  }

  } finally { if (!args.dryRun) releaseLock(); }
}

main().catch((e) => { console.error(e); process.exit(1); });
