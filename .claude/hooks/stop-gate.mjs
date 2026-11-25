#!/usr/bin/env node
/**
 * Stop hook — Phase 2/3 guardrail.
 *
 * Blocks Claude from declaring "done" while there are unresolved issues in any UI file touched
 * this session (the UNION across sessions — see lib/scope.mjs: a sub-agent worker writes under
 * a different session_id but never fires Stop, so its files must land in the LEAD's gate).
 * Checks that feed one gate:
 *   1. the static design-lint (re-lints FRESH, so a fix clears the gate),
 *   2. a runtime mobile-overflow check that renders standalone HTML at 375px and flags any
 *      horizontal smush/clip (./lib/responsive-check.mjs — best-effort, fail-open),
 *   3. a build-scale LOCK COVERAGE check: when the session is build-scale — ≥2 UI files, OR a
 *      whole-file Write happened, OR any single file was edited ≥4 times (an edit-heavy
 *      single-file rewrite IS a build even though only one file is touched) — `taste.lock.json`
 *      must name ≥2 distinct donor exemplars, cover `motion` (or carry a `motionWaiver`), and
 *      set `layout.archetype` to one of the controlled archetypes (or carry a `layoutWaiver`),
 *   4. a build-scale LOCK-USED cross-check: taste.lock.json is self-attested, so when a lock +
 *      taste.tokens.css exist we confirm at least one of the preset's `--vars` is actually
 *      referenced (`var(--name)`) somewhere in the shipped files — a lock nobody applied is a
 *      lie the gate should catch (rule `lock-unused`),
 *   5. a build-scale VISUAL PASS: when everything above is clean and the per-sid `visualNoted`
 *      flag is unset, capture desktop+mobile screenshots (./lib/screenshot.mjs) and BLOCK ONCE,
 *      handing back the PNG paths so the model READS them (Read renders images) and judges them
 *      against the corpus principles/anti-patterns. One extra round, then it proceeds.
 * Uses the Phase-1 smoke-test checklist as the rubric. Allows the stop when everything is clean,
 * or when no UI files were touched at all (non-UI sessions are never gated).
 *
 * Fail-safes so it can never trap a session:
 *   - only `error` findings gate (warnings never block)
 *   - only files INSIDE the project gate — an edit to a sibling repo's UI is advised on by the
 *     post-write lint but never blocks here (this gate's lock/token demands target REPO's root)
 *   - a PER-SID block counter gives up after CAP rounds and lets the stop through; the give-up
 *     is STICKY (flag `gaveUp`) so later turn-ends don't re-block on the same standing findings
 *     — it clears only once a stop comes through clean
 *   - a LIFETIME per-sid ceiling (HARD_CAP, never reset) bounds total blocks a session can ever
 *     see — even across clean-reset cycles, no session can be block-looped again
 *   - TASTE_GATE=off disables the whole gate; TASTE_RESPONSIVE=off skips only the 375px check
 *   - the mobile / screenshot checks self-skip (never block) when Chromium/Playwright is absent
 *   - the lock + visual checks only engage at build scale
 *   - if the taste repo can't be resolved (stale REPO_PATH.txt), a one-time note says so loudly
 *     instead of the whole gate vanishing silently
 *   - any internal error → allow (fail-open)
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  readScope, writeScope, sessionFiles, maxEdits,
  getBlocks, setBlocks, getFlag, setFlag, getTotalBlocks, bumpTotalBlocks,
} from './lib/scope.mjs';
import { checkResponsive } from './lib/responsive-check.mjs';
import { captureShots } from './lib/screenshot.mjs';
import { pluginHookShadowed, tasteRepo } from './lib/taste-repo.mjs';

// Installed both as a plugin and in this project (or globally)? Only the non-plugin copy runs.
if (pluginHookShadowed('stop-gate.mjs')) process.exit(0);

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = process.env.CLAUDE_PROJECT_DIR || resolve(HERE, '..', '..'); // the project being edited
const TASTE = tasteRepo(REPO); // { path, resolved, staleMarker } — engine + tokens live at .path
const CAP = 3; // after this many consecutive blocks (per sid), give up and allow (no infinite loop)
const HARD_CAP = 6; // LIFETIME blocks per sid, never reset — no session is ever blocked more than this
const BUILD_SCALE = 2; // ≥ this many UI files touched this session = "a build", not a spot-fix
const EDIT_HEAVY = 4;  // a single file edited ≥ this many times is also build-scale (rewrite via Edit)

// The 14 controlled layout archetypes — source of truth is the controlled-vocabulary section
// of tooling/distill-prompt.md (`layout:` field). Kept as a const here rather than parsed: it's
// a closed, rarely-changing list and a parse failure would silently disable this whole check.
const ARCHETYPES = [
  'split-hero', 'center-stack', 'full-bleed', 'bento', 'dense-grid', 'editorial-columns',
  'content-grid', 'app-shell', 'catalog', 'canvas-immersive', 'os-metaphor', 'collage',
  'text-only', 'scroll-theater',
];

/**
 * `taste.lock.json` is written by tooling/exemplar-preset.mjs --out (or /compose, same call).
 * `donors` is the raw source-spec list, e.g. ["ramp:color,radius", "linear:motion"] — a bare
 * slug with no `:fields` suffix donates ALL fields (including motion).
 */
function checkLockCoverage(repo) {
  const lockPath = join(repo, 'taste.lock.json');
  let lock;
  try { lock = JSON.parse(readFileSync(lockPath, 'utf8')); } catch { return { ok: false, lockPath, reason: 'no `taste.lock.json` in the project root — the donor mix was never locked in. Run `tooling/exemplar-preset.mjs --name <slug> --out . <donor1>:<fields> <donor2>:<fields>` (or `/compose <brief>`) before finishing.' }; }
  const donors = Array.isArray(lock.donors) ? lock.donors : [];
  const slugs = new Set(donors.map((d) => String(d).split(':')[0]));
  if (slugs.size < 2) {
    return { ok: false, lockPath, reason: `taste.lock.json names ${slugs.size} distinct donor(s) (${[...slugs].join(', ') || 'none'}) — pick at least 2 different exemplars across the layers (palette/type/motion/layout/imagery) instead of one exemplar for everything.` };
  }
  const motionCovered = donors.some((d) => {
    const fieldStr = String(d).split(':')[1];
    return !fieldStr || fieldStr.split(',').includes('motion');
  });
  const hasWaiver = typeof lock.motionWaiver === 'string' && lock.motionWaiver.trim().length > 0;
  if (!motionCovered && !hasWaiver) {
    return { ok: false, lockPath, reason: 'no donor in taste.lock.json covers `motion`, and there is no `motionWaiver`. Either add a motion donor, or add `"motionWaiver": "<one-line reason>"` to the lock if this build deliberately ships with none.' };
  }
  const hasLayoutWaiver = typeof lock.layoutWaiver === 'string' && lock.layoutWaiver.trim().length > 0;
  if (!hasLayoutWaiver) {
    const archetype = lock.layout && lock.layout.archetype;
    if (!archetype) {
      return { ok: false, lockPath, reason: 'taste.lock.json has no `layout.archetype` set, and there is no `layoutWaiver`. Run `node tooling/build-sheet.mjs --brief "<brief>" --out .` to pick a donor + archetype together, or `node tooling/exemplar-preset.mjs --layout <archetype> --layout-donor <slug> --out .` to set one directly — or add `"layoutWaiver": "<one-line reason>"` if this build deliberately has none.' };
    }
    if (!ARCHETYPES.includes(archetype)) {
      return { ok: false, lockPath, reason: `taste.lock.json's \`layout.archetype\` ("${archetype}") is not one of the controlled archetypes (${ARCHETYPES.join(', ')}). Fix it via \`node tooling/build-sheet.mjs --brief "<brief>" --out .\` or \`node tooling/exemplar-preset.mjs --layout <archetype> --layout-donor <slug> --out .\`, or add \`"layoutWaiver": "<one-line reason>"\` if intentional.` };
    }
  }
  return { ok: true };
}

/**
 * Cross-check that the LOCKED preset was actually applied. taste.lock.json is self-attested —
 * a session can write a beautiful lock and ship files that reference none of it. When the lock
 * AND its taste.tokens.css both exist, parse the `--var-name:` definitions out of the css and
 * confirm at least one is referenced (`var(--name)`) across the session's files. Zero refs →
 * the mix was locked but never linked in. FAIL-OPEN on any parse/read error (return ok:true).
 */
function checkLockUsed(repo, files) {
  try {
    const lockPath = join(repo, 'taste.lock.json');
    const cssPath = join(repo, 'taste.tokens.css');
    if (!existsSync(lockPath) || !existsSync(cssPath)) return { ok: true }; // nothing to cross-check
    const css = readFileSync(cssPath, 'utf8');
    const names = new Set();
    for (const m of css.matchAll(/(--[A-Za-z0-9_-]+)\s*:/g)) names.add(m[1]);
    if (!names.size) return { ok: true }; // no vars parsed → can't judge, fail-open
    for (const f of files) {
      let text;
      try { text = readFileSync(f, 'utf8'); } catch { continue; } // gone / unreadable → skip
      for (const m of text.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)) {
        if (names.has(m[1])) return { ok: true }; // at least one token is referenced → applied
      }
    }
    return {
      ok: false, lockPath,
      reason: 'the mix was locked but none of its tokens are referenced in the shipped files — apply the preset (link `taste.tokens.css`) or re-lock honestly.',
    };
  } catch { return { ok: true }; }
}

const allow = () => process.exit(0); // exit 0, no JSON → stop proceeds
const block = (reason) => { process.stdout.write(JSON.stringify({ decision: 'block', reason })); process.exit(0); };
const note = (additionalContext) => { process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'Stop', additionalContext } })); process.exit(0); };

const RUBRIC = [
  'Then self-confirm the smoke-test rubric before declaring done:',
  '  [ ] Right corpus loaded (production by default; expressive only for marketing/brand).',
  '  [ ] Tokens reused from /tokens — no hard-coded color/space/type magic numbers.',
  '  [ ] ≥2 distinct donor exemplars locked in (taste.lock.json), motion covered or waived, layout archetype set or waived, tokens actually referenced.',
  '  [ ] Named the exemplar(s) / principle(s) you drew from.',
  '  [ ] Not the generic template (oversized hero + vague headline + 3 feature cards + soft gradient + fake dashboard).',
  '  [ ] Visual pass done — LOOKED at the desktop + mobile screenshots and judged them against the corpus, not just passed the lint.',
  'For a deeper pass, run the design-critic subagent. If the brief deliberately wants a flagged pattern, say so and set TASTE_GATE=off to proceed (or TASTE_RESPONSIVE=off to skip only the 375px mobile-overflow check).',
].join('\n');

async function main() {
  if (process.env.TASTE_GATE === 'off') return allow();

  let input = {};
  try { input = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { return allow(); }
  const sid = input.session_id;

  const scope = readScope(REPO);

  // Loud fail-open, BEFORE the empty-scope early-allow: when the taste repo is unresolvable the
  // post-write lint never tracked any file (its engine import failed too), so `files` is empty
  // here and the gate would silently allow — the exact silent-disappearance we're fixing. Note
  // it ONCE per sid, then allow. (Only fires for a real stale/unresolved install, never at home.)
  if (!TASTE.resolved && (TASTE.staleMarker || TASTE.path !== REPO)) {
    if (!getFlag(scope, sid, 'repoUnresolvedNoted')) {
      writeScope(REPO, setFlag(scope, sid, 'repoUnresolvedNoted'));
      const tgt = TASTE.staleMarker || TASTE.path;
      return note(`web-design-taste hooks are installed but the taste repo could not be resolved (REPO_PATH.txt → ${tgt} is stale) — design lint and Stop-gate are NOT running. Fix REPO_PATH.txt or re-run tooling/install.mjs.`);
    }
    return allow();
  }

  // Gate only files INSIDE this project. A session may edit UI in a sibling repo (absolute
  // path), but this gate's demands — taste.lock.json in REPO's root, tokens from REPO's
  // system — are unsatisfiable there, and blocking on them loops the session. The post-write
  // lint still advises on such files inline; the sibling repo's own gate owns blocking them.
  const scoped = { ...scope, entries: (scope.entries || []).filter((e) => !relative(REPO, e.file).startsWith('..')) };
  const files = sessionFiles(scoped).filter((f) => existsSync(f));
  if (!files.length) return allow(); // no UI touched this session → never gate

  let engine;
  try { engine = await import(pathToFileURL(join(TASTE.path, 'tooling', 'design-lint.mjs')).href); }
  catch { return allow(); } // resolved-looking but import still failed → fail-open

  // re-lint fresh; collect error-level findings per file
  const failing = [];
  for (const file of files) {
    if (!engine.shouldLint(file)) continue;
    let findings = [];
    try { findings = engine.lintFile(file, { repo: TASTE.path }); } catch { continue; }
    const errs = findings.filter((f) => f.level === 'error');
    if (errs.length) failing.push({ file, errs });
  }

  // Build scale: ≥2 UI files, OR a whole-file Write (scope.build), OR any file edited ≥4 times
  // (an edit-heavy single-file rewrite is a build even when only one file is touched).
  const buildScale = files.length >= BUILD_SCALE || !!scope.build || maxEdits(scoped) >= EDIT_HEAVY;

  if (buildScale) {
    let lockCheck;
    try { lockCheck = checkLockCoverage(REPO); } catch { lockCheck = { ok: true }; } // fail-open
    if (!lockCheck.ok) {
      failing.push({
        file: lockCheck.lockPath,
        errs: [{ level: 'error', rule: 'lock-coverage', line: 0, message: lockCheck.reason }],
      });
    }
    // lock-used cross-check (only meaningful once coverage passed — a missing lock already fails above)
    if (lockCheck.ok) {
      const used = checkLockUsed(REPO, files);
      if (!used.ok) {
        failing.push({
          file: used.lockPath,
          errs: [{ level: 'error', rule: 'lock-unused', line: 0, message: used.reason }],
        });
      }
    }
  }

  // Runtime mobile-overflow check: render standalone HTML at 375px and fold any horizontal
  // smush into the same blocking findings. Best-effort and fail-open.
  let respGap = null;
  if (process.env.TASTE_RESPONSIVE !== 'off') {
    let res;
    try { res = await checkResponsive(files, { repo: REPO, widths: [375] }); }
    catch { res = { ran: false, reason: 'error' }; }
    if (res?.ran && res.overflows?.length) {
      for (const o of res.overflows) {
        const err = {
          level: 'error', rule: 'mobile-overflow', line: o.width,
          message: `horizontal overflow at ${o.width}px — content is ${o.overshoot}px wider than the viewport (scrollWidth ${o.scrollW} > clientWidth ${o.clientW}); it smushes/clips on mobile`,
        };
        const hit = failing.find((f) => f.file === o.file);
        if (hit) hit.errs.push(err); else failing.push({ file: o.file, errs: [err] });
      }
    } else if (res && !res.ran && /no-playwright|no-chromium/.test(res.reason || '')
               && files.some((f) => /\.html?$/i.test(f))) {
      respGap = res.reason; // HTML was edited but mobile couldn't be auto-verified
    }
  }

  if (!failing.length) {
    // Everything mechanical is clean. At build scale, force ONE visual pass before done.
    if (buildScale && !getFlag(scope, sid, 'visualNoted') && getTotalBlocks(scope, sid) < HARD_CAP) {
      let shot = null;
      try { shot = await captureShots(files, { repo: REPO }); }
      catch { shot = { ran: false }; }
      if (shot?.ran && shot.shots?.length) {
        writeScope(REPO, bumpTotalBlocks(setBlocks(setFlag(scope, sid, 'visualNoted'), sid, 0), sid));
        const corpus = 'production'; // default corpus; expressive builds should judge against theirs
        const paths = shot.shots.map((s) => s.path).join('\n');
        return block(
          `Visual pass required before done: Read these screenshots (the Read tool renders images) and judge them against corpus/${corpus}/principles.md + anti-patterns — generic-template tells, cramped spacing, missing motion cues, contrast. Fix what you see or state that it passes; for a deeper pass invoke the design-critic subagent with these paths.\n${paths}`
        );
      }
      // No shots (no standalone html / no chromium): fold into the respGap-style note, never block.
      if (!respGap && shot && !shot.ran && /no-playwright|no-chromium/.test(shot.reason || '')) {
        respGap = shot.reason;
      }
    }
    if (respGap && !getFlag(scope, sid, 'respNoted')) { // surface the un-verified gap once per session
      writeScope(REPO, setBlocks(setFlag(scope, sid, 'respNoted'), sid, 0));
      return note(`design Stop-gate: 375px mobile-overflow / visual check skipped (${respGap}) — HTML was edited but Chromium isn't available to render it. Run \`npx playwright install chromium\` to auto-check, or verify a 375px width and eyeball the result manually before shipping.`);
    }
    if (getBlocks(scope, sid) || getFlag(scope, sid, 'gaveUp')) {
      writeScope(REPO, setFlag(setBlocks(scope, sid, 0), sid, 'gaveUp', false)); // clean → reset
    }
    return allow();
  }

  // Sticky give-up: once this sid has burned CAP rounds on a failing set, never block it again
  // (a reset-to-0 here meant EVERY later turn-end re-blocked 3 more times — an endless loop for
  // findings the session can't or won't fix). Cleared only by a clean stop above.
  if (getFlag(scope, sid, 'gaveUp')) return allow();
  // Lifetime hard ceiling: even across clean-reset cycles, a sid is never blocked more than
  // HARD_CAP times, total. The absolute guarantee against any many-message block chain.
  if (getTotalBlocks(scope, sid) >= HARD_CAP) return allow();

  const blocks = getBlocks(scope, sid) + 1;
  const total = failing.reduce((n, f) => n + f.errs.length, 0);

  if (blocks > CAP) {
    // give up so the session can end; surface a clear warning, don't block
    writeScope(REPO, setFlag(setBlocks(scope, sid, 0), sid, 'gaveUp'));
    return note(`design Stop-gate: ${total} issue(s) remain after ${CAP} rounds — allowing stop, but the UI is not clean. Review manually or run the design-critic. (${failing.map((f) => relative(REPO, f.file)).join(', ')})`);
  }

  writeScope(REPO, bumpTotalBlocks(setBlocks(scope, sid, blocks), sid));
  const detail = failing.map(({ file, errs }) => {
    let rel; try { rel = relative(REPO, file) || file; } catch { rel = file; }
    return [rel, ...errs.map((e) => `  ✗ L${e.line} ${e.rule} — ${e.message}`)].join('\n');
  }).join('\n');

  block(
    `Design Stop-gate — not done yet. ${total} issue(s) remain in UI file(s) you edited this session:\n\n${detail}\n\n` +
    `Fix every ✗ — use var(--token) names (see .claude/skills/web-design-taste/references/anti-patterns.md and /tokens); for mobile-overflow, make the section reflow at 375px (clamp(), flex-wrap, restack to one column) so it doesn't clip. Then finish.\n${RUBRIC}`
  );
}

main().catch(() => allow());
