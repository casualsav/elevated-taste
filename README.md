# Web Design Taste

A **retrieval-augmented design-taste system** for Claude Code. It upgrades the UI/UX quality of everything you build by giving Claude a distilled corpus of real exemplars (transferable principles + normalized tokens), loaded reliably at build time via a Skill and an always-on bias.

> New here? Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the reframe (a repo is *context*, not training), the two-corpus split (`production` vs `expressive`), and the two-axis model (corpus × direction).

## Status

Phase 1 (corpus + Skill + `CLAUDE.md`), Phase 2 (guardrails), and Phase 3 (self-evolving loop) are all **built** — see below and [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Layout

```
.claude/skills/web-design-taste/   # the Skill + references/ (craft layer)
.claude/hooks/                     # Phase 2 guardrail hooks (prompt-submit, post-write lint, stop-gate)
.claude/agents/design-critic.md    # Phase 2 critic subagent (Sonnet + advisor escalation, read-only)
.claude/settings.json              # wires the hooks
.claude/commands/reflect.md        # Phase 3 /reflect slash command
corpus/{production,expressive}/     # exemplars, patterns, tokens, principles, sources
taste/owner.md                     # the owner's own rules from real build verdicts (win over corpus defaults)
inbox/                             # unreviewed build notes; promoted ones feed taste/owner.md
directions/                        # aesthetic presets (minimalist, brutalist, soft, …)
tokens/                            # tokens.json → tokens.css (+ presets/)
preview/                           # zero-config static server for reference implementations
tooling/                           # harvest, capture, distill, evolve, reflect, design-lint, control-bot
tooling/systemd/                   # weekly scheduler units (+ cron fallback)
proposals/                         # Phase 3 reflection output (corpus edits awaiting review)
evolve.config.json                 # Phase 3 loop config (source of truth)
docs/                              # ARCHITECTURE, ROADMAP, MIGRATION
```

## Setup

- Node ≥ 20. `npm install`, then `npx playwright install chromium`.
- `npm run tokens:build` — build `tokens/tokens.css` from `tokens/tokens.json`.
- `npm run preview` — static preview server for pattern reference implementations.
- `npm run harvest` / `npm run capture` — ingestion tooling (see [`tooling/`](tooling/)).

## Using it in this repo

Build UI here and the project-local Skill (`.claude/skills/web-design-taste/`) + `CLAUDE.md` apply automatically.

## Guardrails (Phase 2)

Skills and `CLAUDE.md` *bias* selection; hooks gate *outcomes*. Four guardrails (config in [`.claude/settings.json`](.claude/settings.json)) keep output honest. They reuse the same machine-readable rule sources as the Skill — `references/anti-patterns.md`, `tokens/tokens.json`, `corpus/*/principles.md` — and all **fail open**.

| Guardrail | Event | What it does |
|---|---|---|
| **Prompt-submit** (`hooks/ui-prompt-guard.mjs`) | `UserPromptSubmit` | On UI prompts, injects the taste rules + "load the Skill"; silent otherwise. Never blocks. |
| **Design-lint** (`hooks/post-write-lint.mjs` → `tooling/design-lint.mjs`) | `PostToolUse` | On HTML/CSS/JSX/TSX/Vue/Svelte edits — plus CSS-in-JS tagged templates and `.ts`/`.js` files carrying design decisions — flags banned patterns, magic numbers vs `/tokens` (with the `var(--name)` to use), default-palette Tailwind color classes, display type without the tracking ramp, and basic a11y/contrast. Advisory. |
| **Stop-gate** (`hooks/stop-gate.mjs`) | `Stop` | Re-lints the UI files touched this build — the **union across sessions**, so sub-agent/worker writes land in the lead's gate — and blocks "done" until zero lint **errors**. At build scale it also checks `taste.lock.json` (≥2 donors, motion covered/waived), cross-checks the locked tokens are actually **referenced** (`lock-unused`), renders standalone HTML at 375px for overflow, and forces one **visual pass**: it screenshots desktop+mobile and blocks once so the model Reads the PNGs and judges them against the corpus. 3-round give-up cap. |
| **design-critic** (`agents/design-critic.md`) | subagent (Sonnet; escalates via the session's advisor model when configured) | Read-only critique against `principles.md` + `anti-patterns.md` — including the Stop-gate's screenshots (it renders the PNGs via Read); returns a prioritized PASS/REVISE verdict. Invoke it (or it auto-delegates) after a build; revise and re-invoke until PASS. |

Run the lint by hand: `npm run lint:design -- path/to/file.html` (exit 1 if any error). The lint distinguishes `error` (gates the Stop-gate) from `warn` (advisory) — only high-precision Tells are errors, so heuristics never trap a session. Escape hatch: set `TASTE_GATE=off` to mute every hook (use when a brief deliberately wants a flagged pattern). If the hooks are installed but the taste clone can't be resolved (stale `REPO_PATH.txt`), they warn **once, loudly** instead of disappearing silently.

Every exemplar records its `surface` (`app` · `docs` · `site`), and `node tooling/coverage.mjs` counts app jobs (dashboard, forms, settings, auth …) only from real `app` screens, so a homepage that pictures a dashboard no longer fills the dashboard quota. App screens the galleries can't supply are queued in `tooling/manual-sources.json`.

Retrieval is mechanical too: `npm run query -- --brief "dark saas dashboard" [--direction minimalist]` returns a scored donor/pattern shortlist instead of reading the 380KB `corpus/index.json` whole; `corpus/index.summary.json` is the compact skim view. Plain words map to the category vocabulary ("login screen" finds auth exemplars), and `npm run eval:retrieval` checks a set of real briefs in [`tooling/eval/retrieval-cases.json`](tooling/eval/retrieval-cases.json) against the exemplars they should return; CI fails if fewer of them hit than before. Tailwind projects generate a token-named theme preset with `node tokens/build.mjs --tailwind` → `tokens/tailwind.preset.mjs`.

## Self-evolving loop (Phase 3)

A weekly run keeps the corpus fresh. It runs **in GitHub Actions** (`.github/workflows/evolve.yml`, Mondays) — distillation still uses your Claude Code **subscription** via the `CLAUDE_CODE_OAUTH_TOKEN` repo secret (`claude setup-token`), not a paid API key. Each new site is gated in the same run (reconcile + `npm run validate` + render check on the change merged onto `main`): a pass lands on `main` as one commit per site (revert it to drop the site); a fail opens a PR labelled `hold`, the only PRs you ever see. The run then regenerates the derived artifacts (`post-merge.yml`). The legacy on-box scheduler (`tooling/systemd/`, control bot) still works but is no longer the canonical path.

```
harvest ─▶ dedupe ─▶ resolve ─▶ capture ─▶ distill (claude -p) ─▶ gate ─▶ land on main (or hold PR) ─▶ Telegram digest
 new URLs   vs corpus  detail→site  shots+raw   exemplar/tokens/patterns   validate+render   pass: commit on main · fail: PR labelled hold   landed + held → you
```

`npm run evolve` (add `-- --dry-run` to plan without writing). Config lives in [`evolve.config.json`](evolve.config.json) (the control bot edits it). Each new site is its **own** commit on `main`, so dropping one is a single revert; the Telegram digest lists every landed site with its source and commit, and every held one with its PR. Scheduling + secrets: [`tooling/systemd/`](tooling/systemd/README.md) (systemd user timer + always-on bot, or cron).

- **Distill** one captured exemplar: `npm run distill -- --slug <s> --corpus <c> --url <u>` (`--mock`/`--print-cmd` to dry it).
- **Reflect** after a build: `/reflect` in a session, or `npm run reflect -- --target <path>` → a proposal in [`proposals/`](proposals/) for review.
- **Control bot** (`npm run bot`, opt-in): a non-agentic Telegram bot — `/status` `/run` `/pause` `/resume` `/set`, and `/approve` (merge) `/reject` (close) — gated to your chat id. See [`tooling/control-bot.mjs`](tooling/control-bot.mjs).

## Using it in other projects (cross-project install)

One command — everything travels (Skill + craft references, the three guardrail hooks, `/compose` + `/reflect`, built `tokens.css`), while the corpus stays in this clone behind a `REPO_PATH.txt` pointer:

```bash
node tooling/install.mjs --project /path/to/your-app   # vendor into one project
node tooling/install.mjs --global                      # skill + bias for every project
```

Idempotent — re-run after tooling/hook changes; `git pull` this clone to refresh the corpus (the skill reads it live). `settings.json` merges are additive with a `.taste-backup`. Then in the consuming repo: `/compose <brief>` assembles a build sheet (palette/type/motion donors + pattern list + the `tooling/exemplar-preset.mjs` command that builds the mixed token preset). Manual fallback: [`docs/MIGRATION.md`](docs/MIGRATION.md).

## Relationship to the old taste skills

This **replaces** the eight installed generative taste skills by absorbing their value into the corpus / directions / references layers — see [`docs/MIGRATION.md`](docs/MIGRATION.md). Image-generation skills are untouched. The cutover is reversible and runs only on your approval after the smoke test.
