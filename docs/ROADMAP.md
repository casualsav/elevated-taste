# Roadmap

Phase 1 (corpus + Skill + `CLAUDE.md` + ingestion tooling), Phase 2 (guardrails), and Phase 3 (self-evolving loop) are **built**.

## Phase 2 — Guardrails ✅ built

Hooks gate *actions / outcomes* — they **cannot** force skill selection. So before-action hooks **block**, and after-action hooks **feed results back**. All four are live; config in `.claude/settings.json`, scripts in `.claude/hooks/` + `.claude/agents/`, rule engine in `tooling/design-lint.mjs`. Everything **fails open** (bad input / engine error / `TASTE_GATE=off` → silent allow) so it never traps legitimate work.

- **Prompt-submit hook** — `.claude/hooks/ui-prompt-guard.mjs` (`UserPromptSubmit`). On a UI-related prompt, injects the taste rules + a reminder to load the Skill; silent + zero-overhead otherwise. Makes `CLAUDE.md`'s rules deterministic; never blocks.
- **Design-lint (post-write)** — `.claude/hooks/post-write-lint.mjs` (`PostToolUse` on `Edit|Write|MultiEdit`) → engine `tooling/design-lint.mjs`. On edits to HTML/CSS/JSX/TSX/Vue/Svelte it flags banned patterns, magic numbers vs tokens, and basic a11y/contrast, and records the file into per-session scope. Rule sources: `references/anti-patterns.md` "Quick gate" short-list (encoded, each finding cites its §) + `tokens/tokens.json` (parsed into a reverse `value → var(--name)` map). `error` vs `warn` severity — only errors gate.
- **Stop-gate** — `.claude/hooks/stop-gate.mjs` (`Stop`). Re-lints (fresh) every UI file touched this session and blocks "done" while any `error` remains; the reason carries the failing lines + the Phase-1 smoke-test checklist as the rubric. Allows when clean or when no UI was touched. Fail-safes: 3-round give-up cap, `TASTE_GATE=off`.
- **`design-critic` subagent** — `.claude/agents/design-critic.md` (Sonnet, read-only — the rubric is mechanized enough, lint + screenshots + explicit citations, that Sonnet suffices; a configured advisor model covers borderline verdicts). Isolated context; runs the lint for the mechanical layer, then judges against `corpus/<corpus>/principles.md` + `anti-patterns.md` (the §0 template, hierarchy, layout variety, copy, motion, color, exemplar grounding) and returns a prioritized PASS/REVISE verdict with corpus citations. It critiques only; the calling agent revises and re-invokes until PASS (the loop is the orchestration, kept out of the critic so its context stays clean).

## Phase 3 — Self-evolving ✅ built

A weekly loop that harvests new winners, distills them, and lands the ones that pass the gate. It runs **in GitHub Actions** (`.github/workflows/evolve.yml`, Mondays 09:00 UTC); distillation still uses the Claude Code **subscription** through the `CLAUDE_CODE_OAUTH_TOKEN` repo secret (`claude setup-token`), not a paid API key. The on-box scheduler (`tooling/systemd/`, `tooling/daemons.sh`) is the legacy path and still works.

Orchestrator `tooling/evolve.mjs` (config: `evolve.config.json`): manual queue (`tooling/manual-sources.json`) + harvest (`harvest.mjs --json`, never touches the canonical `sources.json`) → **dedupe** (`lib/dedupe.mjs`, slug+normalized-url read straight from the exemplar files) → **resolve** detail-page URLs (`lib/resolve.mjs`) → cap → capture → **distill** (`distill.mjs`, ephemeral `claude -p` per candidate, `TASTE_GATE=off` so the Phase-2 hooks can't trap it, structural vet) → **gate and land** (`lib/land.mjs`) → **digest** (`report.mjs`, Telegram).

- **The gate is the approval step.** Each site is committed on its own in a throwaway worktree off live `main` and checked there (`reconcile-sources` + `npm run validate` + `render-patterns.mjs --check` + the retrieval eval, so a landing that breaks search is held). A pass is pushed straight to `main` as one commit per site, so dropping a site is one `git revert`. A fail goes to an `evolve/<date>-<slug>` branch with a PR labelled `hold`; nothing merges those automatically. The run then dispatches `post-merge.yml` to rebuild the derived files (pushes made with `GITHUB_TOKEN` fire no workflows).
- **Monthly refresh** — `refresh.yml` re-captures the oldest exemplars, reports dead sites and re-distills ones whose screenshot drifted, landing them through the same gate (`refresh/<date>-<slug>` hold PRs on a fail).
- **Captures stay private.** Screenshots and `raw/` live only on the runner and are never pushed to this repo, on any branch.
- **Pause** via `"paused": true` in `evolve.config.json` (or the control bot).
- **Post-build reflection** — `tooling/reflect.mjs` / the `/reflect` command: after a real build, propose corpus edits to `proposals/` for human review. Never auto-applied.

Prerequisites (Actions): the `CLAUDE_CODE_OAUTH_TOKEN` secret, and optionally `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` for the digest. The legacy on-box path also needs Playwright, an active `claude` login and `gh` auth on the box.

### Phase 3.5 — control bot
- **`tooling/control-bot.mjs`** — a non-agentic Telegram bot (long-poll, no LLM) that edits `evolve.config.json` and drives the loop: `/status` `/run` `/pause` `/resume` `/set`, and `/approve <#>` (squash-merges a held `evolve/*` PR) `/reject <#>` (closes it). Strict chat-id allowlist. Run on demand (`npm run bot`) or always-on (`tooling/systemd/taste-bot.service`). The config file is the source of truth; the bot is an optional front-end.

## Seams left in Phase 1

- `tooling/distill.mjs` — was a stub; **built** in Phase 3 as the headless `claude -p` orchestrator.
- `sources.json` stable slug+url identity — **consumed** by `tooling/lib/dedupe.mjs`.
- `references/anti-patterns.md` + `tokens/` are machine-readable for the lint (Phase 2) — **consumed** by `tooling/design-lint.mjs`.
- The smoke-test checklist doubles as the Stop-gate rubric (Phase 2) — **consumed** by `.claude/hooks/stop-gate.mjs`.
- `tooling/harvest.mjs` + `capture.mjs` run non-interactively — **consumed** by `tooling/evolve.mjs` (`harvest --json` added for emit-without-write).
