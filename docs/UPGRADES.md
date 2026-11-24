# Upgrade plan (2026-07-01 audit)

**Decisions (owner, 2026-07-01):**
- Hosting: `taste.extant.cc` subdomain. Deploy is **event-driven on merge to main** (not a timed
  cron): a GitHub Action builds the site in CI and publishes to a `site` branch. Preferred serving:
  GitHub Pages + CNAME (no server at all); fallback: the server cron-syncs the pre-built `site`
  branch into `/var/www` (`git fetch && git reset --hard origin/site`) — never builds locally.
- Distill auth: **subscription only** — `claude setup-token` → `CLAUDE_CODE_OAUTH_TOKEN` Actions
  secret. No `ANTHROPIC_API_KEY` path.
- Telegram control bot (`/approve` etc.): **retire** once auto-merge-after-gates lands; the digest
  notify can stay.
- Distill sandboxing (D10): agreed — scratch worktree + output allowlist.

**Status 2026-07-09 (cheap-model effectiveness pass):** a second audit asked "can Sonnet actually
execute this system?" and landed seven upgrades in one batch: **scored retrieval CLI**
(`tooling/query.mjs` + `corpus/index.summary.json` — kills the read-the-whole-index ~96k-token tax;
`/compose` + SKILL.md rewired), **visual pass** (Stop-gate screenshots desktop+mobile at build scale
and blocks once so the model Reads the PNGs; design-critic takes screenshot inputs), **sub-agent
scope union** (shared per-project `design-scope.json` — worker writes land in the lead's gate),
**Tailwind/CSS-in-JS lint coverage** (`tw-default-palette` error, tagged-template CSS,
marker-gated `.ts`/`.js`, `tokens/build.mjs --tailwind` preset), **lock hardening** (`lock-unused`
cross-check + edit-heavy single-file builds count as build-scale), **tracking-ramp tokens**
(`--tracking-display…caps` + `display-tracking` warn; spend-map line in the brief template), and
**A5 quotas wired** (`category_targets` + 12 gap-category candidates queued in
`tooling/manual-sources.json` for the weekly loop). Stale `REPO_PATH.txt` now warns loudly once
instead of failing silent.

Three parallel audits: ingestion/evolve pipeline, corpus consumption path, directory site + deploy.
Verdict up front: **the distillation layer is the strongest part of the repo** — exemplars are
grounded in captured code with honest caveats, patterns ship copy-pasteable token-based recipes,
motion is captured in genuinely usable form. The weak seams are (A) retrieval/remixing,
(B) autonomy of the weekly loop, and (C) hosting. Plus a bug list.

---

## A. Retrieval & remixing — make "compose a build from parts" a real operation

Today, a consuming agent finds parts by listing directories and grepping `when_to_use` strings.
That works for "give me a landing page like Ramp"; it does not work for "assemble the best-fit
palette + type + motion + sections for an arbitrary brief."

1. **Generated `corpus/index.json`** (single biggest win). A build script that walks both corpora
   and emits one machine-readable index: every exemplar (slug, corpus, tags, when_to_use,
   directions, palette summary, motion summary) and every pattern (slug, corpus, safety, trigger,
   tags, one-liner, source exemplar, tokens it requires). Retrieval becomes one read instead of
   dozens. Publish it (see C) so remote repos can fetch it without a clone.

2. **Fix the token contract.** 85 of 155 pattern recipes reference at least one `var(--x)` defined
   in neither `tokens/tokens.json` nor any preset (e.g. `dark-bento-grid.md` uses
   `--color-bg-dark`/`--color-fg-on-dark`/`--color-surface-dark-2`; the house file has
   `surface-inverse`/`fg-inverse`). Pasted recipes silently compute to nothing and the lint can't
   see it. Fix: reconcile names (add missing roles/steps to `tokens.json`, or rewrite recipes to
   house names), add `requires_tokens:` to pattern frontmatter, and add a CI check that resolves
   every var in every recipe against tokens + presets.

3. **Pattern frontmatter parity with exemplars.** Patterns lack `when_to_use` and `directions`
   entirely — the two fields retrieval routes on. Add them, plus composition metadata:
   `pairs_with:`, `clashes_with:`, `assumes:` (light/dark canvas, required token roles). Mixing
   parts across exemplars currently requires reading three full exemplars and adjudicating by
   taste; this makes it mechanical.

4. **Vocabulary validator.** `tooling/distill-prompt.md` defines a controlled vocabulary but it has
   drifted (`developer-tool` / `dev-tool` / `developer-tools` all appear; off-list values like
   `dashboard-adjacent`). One validator script, run in CI and as a distill vet step.

5. **Coverage quotas — the production corpus doesn't cover its own mandate.** `when_to_use`
   counts: hero 29, landing 26 … dashboard 3, data-table 2, settings 1, auth 1, forms/onboarding/
   empty-state/checkout 0. `SKILL.md` advertises "dashboard shell" patterns that don't exist.
   Make `evolve.config.json` quota-aware (category targets per run) and point ingestion at
   sources that show real app UI: public demos, docs/storybooks, design systems, open-source
   apps — not just award galleries (which are why the corpus skews marketing).

6. **Snapshot→preset converter.** Per-exemplar `corpus/*/tokens/<slug>.json` is descriptive
   evidence in a looser schema; there's no tool to turn it into a buildable preset. Add
   `node tokens/build.mjs --from-exemplar ramp` so "Ramp's palette + Linear's motion" is a
   command, not a transcription job.

7. **A `/compose` entry point.** A skill/command that takes a brief ("techno-feudalist event
   announcement", "ops dashboard") → picks corpus + direction → queries `index.json` → emits a
   build sheet: palette from X, type system from Y, motion vocabulary from Z, section patterns
   [a, b, c], with the exact tokens/preset to build. This is the thesis ("random elements from
   different exemplars, best fit for the build") made into a first-class operation instead of an
   emergent behavior.

8. **Package the cross-repo install.** Today: hand-copy the skill dir + `REPO_PATH.txt` + edit
   `~/.claude/CLAUDE.md`; none of the enforcement (lint, stop-gate, critic, `/reflect`) travels.
   Ship an installer (`npx`-able script or plugin) that vendors the Skill, `tokens.css`, the lint
   engine, and the hooks into a consuming repo, pinned to a corpus ref — or better, make the
   consuming skill fetch `index.json` + patterns over HTTPS from the published site so no local
   clone is needed at all.

---

## B. Weekly ingestion — fully autonomous, off-box

Today the loop needs your machine four ways: systemd timer, `claude -p` subscription login,
local `gh`/git creds, and Telegram bot process. Deploy of the directory site is a fifth manual
step. Target: **GitHub Actions weekly cron, zero local machine.**

1. **Move the loop to a scheduled GitHub Action.**
   - `schedule: cron` weekly + `workflow_dispatch` for manual runs.
   - Steps: checkout → `npm ci` → `npx playwright install chromium --with-deps` → evolve.
   - Distill auth: `CLAUDE_CODE_OAUTH_TOKEN` secret from `claude setup-token` — headless `claude -p`
     in Actions bills against the subscription, not the API. (Decision: subscription only; no
     `ANTHROPIC_API_KEY` fallback.) The "must run on this box for subscription auth" constraint in
     ROADMAP.md is no longer true. Note: ~4 Opus-effort distills will consume a visible chunk of
     that day's subscription quota.
   - PRs via `GITHUB_TOKEN`; concurrency guard via Actions `concurrency:` (fixes the missing-lock
     problem for free).
   - Persist `last_run` by committing `evolve.config.json` in the run (or derive from the last
     `evolve/*` branch date) — `touchLastRun` writing the local checkout is lost on ephemeral runners.

2. **Fix the pipeline bugs that currently break autonomy** (details in D):
   slug-before-resolve (kills 6 of 7 gallery adapters), no post-resolve dedupe, robots fail-open,
   `pr.mjs` unchecked `checkout -b` (can commit to main), capture has no bot-wall/blank gate.

3. **Solve the screenshots problem once — it blocks both PR review and off-box deploy.**
   `corpus/*/screenshots/` and `raw/` are git-ignored and exist only on your box; a fresh CI
   checkout builds a zero-exemplar site, silently. Options, best first:
   - **Private companion repo (or orphan branch) for captures**, written by the Action, read by
     the site build. Keeps the public repo clean and the "private reference" stance intact.
   - Git LFS in this repo (simplest, but public if the repo is public — licensing call).
   - Actions artifacts/releases (retention limits make this the weakest).
   Whatever the store, the evolve Action should upload captures there, and **embed the desktop
   screenshot in each draft PR body** so review is one look instead of "open the live site."

4. **Strengthen automated quality gates so auto-merge is defensible.** The current vet is
   "file exists, starts with `---`, ≥400 chars, tokens parse." Add: capture-quality check
   (blank/bot-wall detection — tiny PNG, error-page title, <N DOM nodes), frontmatter slug/url
   must match the candidate, controlled-vocab validation, referenced pattern files must exist,
   token-var resolution check (A2), and reject `mock`-tagged output. Run all of it as PR CI too.
5. **Approval policy for "fully autonomous."** Recommended: keep draft-PR-per-site, but
   **auto-merge any PR that passes all gates after a 48h window unless you label it `hold`** —
   you keep a veto without being a dependency. (Unsupervised trend-chasing drift was the original
   reason for the human gate; the gates in B4 + easy `git revert` of a one-site PR cover most of
   that risk.) Telegram digest can stay — `report.mjs` runs fine from Actions with the token as a
   secret; the long-poll control bot can retire (GitHub labels/merge UI replaces `/approve`).

6. **Post-merge deploy Action.** On merge to `main` touching `corpus/**` or `sites/**`: pull
   captures from the store (B3), run `build.py --strict`, deploy (C). Merging a PR then updates
   extant.cc/taste with zero manual steps — closing the loop end to end.

---

## C. Hosting extant.cc/taste without the local machine

The site itself is a perfect static-host fit (all-relative URLs, no server logic). The blockers
are the screenshots (solved by B3) and the URL shape.

- **Decided: `taste.extant.cc`, built in CI, deployed on merge.** The deploy Action (B6) builds
  the site and pushes the output to a `site` branch. Serving, in order of preference:
  1. **GitHub Pages on the `site` branch + `taste.extant.cc` CNAME** — fully off-box, GitHub
     manages TLS; Caddy keeps a `/taste` → subdomain redirect during transition.
  2. **Server syncs the pre-built branch** — hourly cron on the box:
     `git fetch && git reset --hard origin/site` into `/var/www/sites/pages`. No Python/Pillow/
     screenshots on the server; it's a plain file sync of CI-built output. Use only if keeping
     Caddy as the front matters.
  No timed coordination with the weekly ingest is needed in either case — merge is the trigger.
- Retire the `:8880` answer-anything on-demand-TLS beacon when Caddy stops fronting this.

---

## D. Bug list (fix regardless of the above)

Severity-ordered; file:line refs from the audits.
**Status 2026-07-02:** D1–D6, D8–D20 fixed on this branch (only D7 dead-config cleanup remains).
Week 2 (retrieval) also done: A1 `corpus/index.json` + `tooling/build-index.mjs`; A2 token
contract reconciled (0 unresolved vars across 153 patterns; dark-context roles added to house
tokens; pattern-specific values carry inline fallbacks sourced from their exemplar snapshots);
A3 pattern `when_to_use`/`directions`/`pairs_with`/`requires_tokens` derived into the index;
A4 `tooling/validate-corpus.mjs` (npm run validate) enforces the contract + controlled
vocabulary + cross-refs + sources sync; vocabulary drift normalized across 15 exemplars.
Week 3 (autonomy) scaffolded: `.github/workflows/{evolve,validate,auto-merge,post-merge}.yml` —
weekly evolve in Actions (subscription auth via the `CLAUDE_CODE_OAUTH_TOKEN` secret — **the one
manual step: add it in repo Settings → Secrets → Actions**), captures pushed to the orphan
`captures` branch, per-PR captures link, capture-quality gate (bot-wall/blank rejection),
auto-merge of evolve PRs after 48h unless labeled `hold` (validator re-run per branch is the
gate), derived artifacts (sources/index/tokens.css) regenerated post-merge on main.
Week 4 (hosting) scaffolded: `deploy-site.yml` builds the directory on merge (strict) from the
`captures` branch and publishes to GitHub Pages at `taste.extant.cc`. Manual steps remaining:
(1) `CLAUDE_CODE_OAUTH_TOKEN` secret — DONE; (2) seed captures from the box:
`bash tooling/push-captures.sh`; (3) Settings → Pages → Source "GitHub Actions" + custom domain
`taste.extant.cc`; (4) DNS `CNAME taste → casualsav.github.io`; (5) merge this branch.

**Pipeline correctness**
1. `tooling/evolve.mjs:139` — slug computed from the gallery *detail* URL before `resolve` runs:
   all detail-strategy adapters (awwwards, landbook, siteinspire, lapaninja, thefwa, cssdesignawards)
   collapse to one candidate per gallery per run and get wrong slugs (`land-book`). Recompute slug
   after resolve; re-run dedupe on the resolved URL (currently never checked → weekly re-ingest risk).
2. `tooling/lib/pr.mjs:61` — `git checkout -b` result unchecked; on failure the commit lands on the
   current branch (main). Also no fetch/clean-tree check before branching (`pr.mjs:42`).
3. `tooling/lib/robots.mjs:47-53,82` — fetch failure yields `''` → `isAllowed` returns true; the
   header says failures are DISALLOWED. Fails open and caches the failure 24h.
4. No concurrency lock: timer + Telegram `/run` + manual can interleave git operations in one
   working tree. (Actions `concurrency:` solves this post-migration; add a lockfile until then.)
5. `tooling/distill.mjs:79-94` vet accepts a `MOCK_DISTILL=1` stub; no semantic checks (see B4).
6. Evolve never writes the `sources.json` entry the distill prompt tells the session to read
   (`distill.mjs:48`); the header's "reconcile" stage (`evolve.mjs:5`) doesn't exist in `main()`.
7. Dead config: `galleries`, `min_score`, `directions_bias` in `evolve.config.json` are consumed
   nowhere; `tooling/manual-sources.json` is read by no code.
8. `sources.json` out of sync: 42 production exemplars, 37 sources entries (figma, notion, pitch,
   radix, swiper missing) — anything routing via sources.json never sees them.

**Security**
9. `tooling/control-bot.mjs:134-138` — `/approve <n>` merges ANY PR number (the `evolve/*` filter
   only guards the bare form); `/approve all` mass-merges with no confirmation.
10. `distill.mjs:59-68` — distillation runs `--permission-mode acceptEdits --add-dir ROOT` over
    attacker-controlled web content (`raw/<slug>.html`) — prompt-injection with repo-wide write.
    Sandbox it: run distill in a scratch worktree, diff against the expected file allowlist,
    discard anything else.
11. `control-bot.mjs:27-28` / `report.mjs:42-43` fall back to reading the Telegram token from the
    *committed* `evolve.config.json` — a designed-in path to leaking a secret. Env-only.
12. `preview/serve.mjs:32` — `startsWith(ROOT)` traversal guard lacks a trailing-separator check
    and serves the whole repo incl. `raw/`. Local-only today; still fix.

**Site build**
13. `sites/pages/build.py:160,225` — corpus strings are inlined into `<script type="application/json">`
    without `</script>` escaping → page corruption/XSS via corpus content. Escape `</` as `<\/`.
14. `build.py:96-99` — missing screenshots skip silently with exit 0; a fresh checkout deploys an
    empty site over the live one. Add `--strict` + minimum-exemplar-count guard.
15. `build.py:80` — scale factor can exceed 1: narrow captures get LANCZOS-upscaled. Cap at 1.
16. `build.py` never cleans `OUT/img/` (orphan webps accumulate); `Image.MAX_IMAGE_PIXELS = None`
    (line 34) disables the decompression-bomb guard on what will eventually be third-party images.

**Consumption layer**
17. `tooling/design-lint.mjs:265-272` — em-dash rule ignores the `<script>/<style>` region guard:
    an em-dash in a JS string is a hard `error` that blocks the Stop-gate.
18. `design-lint.mjs:103,129-136` — `container` token map is built but unreachable
    (`max-width: 1280px` never suggests `--container-xl`); `loadTokens` cache ignores `repo` (:96-99).
19. Path fictions: `SKILL.md:40` and `design-critic.md:22` point at a top-level `references/` that
    doesn't exist (real path: `.claude/skills/web-design-taste/references/`); `SKILL.md` omits
    `motion-key.md` — the single best retrieval artifact — from its reference list.
20. Stale claims: `principles.md:3,7` ("20 sites", "40 recipes" — now 42/89); `app.js:2` ("47 cards");
    `README.md:50` ("auto-delegates" critic — nothing wires that); `build.py:2`/`style.css:1` still
    say pages.extant.cc.

---

## Suggested sequencing

1. **Week 1 — correctness:** D1–D6, D9–D14 (small diffs, big trust gain), plus sources.json sync.
2. **Week 2 — retrieval:** A1 index + A2 token reconciliation + A3/A4 metadata & validator
   (these are also the CI gates B4 needs).
3. **Week 3 — autonomy:** B1 Actions cron + B3 capture store + B4 gates; keep human merge at first.
4. **Week 4 — hosting + close the loop:** C (Pages + `taste.extant.cc`), B6 deploy-on-merge,
   then flip B5 auto-merge-after-48h. The repo now upgrades itself and its public page weekly.
5. **Ongoing — thesis features:** A5 quotas (app-UI coverage), A6 converter, A7 `/compose`,
   A8 packaged cross-repo install.
