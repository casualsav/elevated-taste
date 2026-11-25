# Design taste — repo bias (always on)

For ANY UI / frontend / CSS work in this repo (or built with this corpus):

- **Load the `web-design-taste` skill before writing any markup or styles.** Consult the corpus; don't invent from defaults.
- **Default to the `production` corpus.** Use `expressive` only for marketing / landing / brand-experience work, and flag any spectacle technique that may hurt usability, performance, or accessibility.
- **Never ship the generic template** (oversized hero + vague headline + three feature cards + soft gradient + fake dashboard mockup). Pull a specific, named exemplar or pattern instead.
- **Use tokens from `/tokens`** — no hard-coded magic numbers for color, space, or type.
- **State which exemplar(s) / principles you drew from.**

# Adding an exemplar to the corpus — ALWAYS use the pipeline, never a screenshot alone

When asked to add / ingest a site into the corpus, do **not** eyeball a screenshot and hand-write an exemplar. Run the capture → distill pipeline, which pulls the site's **real code** (full rendered HTML, every stylesheet's CSS, computed-style profile, motion/`@keyframes` fingerprint, craft/a11y/theme) — distillation is grounded in that, corroborated by the screenshots.

1. Add an entry to `corpus/<production|expressive>/sources.json` (slug, url, tags, when_to_use, directions — see `tooling/distill-prompt.md` for the controlled vocabulary).
2. **Capture** (writes screenshots + `raw/<slug>.{json,html,css}`):
   `node tooling/capture.mjs --url <url> --slug <slug> --corpus <corpus> --settle 6000`
3. **Distill** (Opus reads the HTML/CSS/profile/screenshots → exemplar + tokens + patterns):
   `node tooling/distill.mjs --slug <slug> --corpus <corpus> --url <url>`
4. **Verify** the capture isn't a bot-wall/blank (small desktop.png ⇒ check the image; retry with a realistic UA if blocked).
5. **Validate + reindex** — `npm run validate` (token contract, controlled vocabulary, cross-refs, sources sync; must pass) then `npm run index:build` (regenerates `corpus/index.json`, the retrieval index — commit it with the exemplar). Then commit + push main.
6. **Never push screenshots** to this repo, on any branch: they are pictures of other people's sites and stay private.

`raw/` and `corpus/*/screenshots/` are git-ignored private references — commit only the distilled `exemplars/`, `tokens/`, `patterns/`, and `sources.json`. Full method: `tooling/distill-prompt.md`.

# Phase 3 — self-evolving pipeline (unattended)

`tooling/evolve.mjs` (wrapped by `tooling/evolve.sh` for the subscription `claude -p` auth) runs
weekly off-box via the `evolve` GitHub Actions workflow (Mondays 09:00 UTC): harvest candidates → dedupe against the corpus → resolve real site URLs → capture →
distill → gate → land. Each distilled site is committed on its own in a throwaway worktree off
live `main` and gated there (`reconcile-sources` + `npm run validate` + `render-patterns.mjs
--check`, `tooling/lib/land.mjs`). A pass is pushed straight to `main` **without a human in the
loop**, one commit per site so a revert drops it; a fail goes to an `evolve/*` (or `refresh/*`)
branch with a PR labelled `hold`, and nothing merges those automatically. The run then dispatches
`post-merge.yml`, since GITHUB_TOKEN pushes fire no workflows. Beyond that it only rewrites its own
bookkeeping: `evolve.config.json` (`last_run`) and `corpus/fingerprints.json` (each landed or
refreshed site's screenshot dHash, so the monthly refresh can spot a redesign without keeping
screenshots; `tooling/lib/fingerprints.mjs`). This gate is the unattended-write boundary of the pipeline.

# Phase 3 — Telegram control bot (governance)

`tooling/control-bot.mjs` (run via `tooling/bot.sh`, or as the `taste-bot` systemd service) is a
deterministic, non-LLM, single-chat-allowlisted long-poll bot: `/status /run /pause /resume /set
<key> <value> /approve [pr#|all] /reject [pr#|all]`. It edits `evolve.config.json` and shells out
to `evolve.sh`/`gh`. `/approve` marks a PR ready and squash-merges it, but it is scoped to open
`evolve/*` PRs only and only ever fires on an explicit human command sent to the owner's chat id —
it does not merge anything on its own. The unattended write path is the gate in `land.mjs` above,
not this bot.

# Phase 3 — scheduler / daemons (systemd-less boxes)

For hosts without systemd/cron (e.g. containers): `tooling/daemons.sh start|stop|status` runs
`tooling/scheduler.mjs` (re-reads `evolve.config.json` every cycle; triggers `evolve.sh` on the
configured cadence) and the control bot as detached background processes. On a systemd host use
`tooling/systemd/taste-evolve.{service,timer}` (weekly trigger) and `tooling/systemd/taste-bot.service`
(always-on control bot) instead — see `tooling/systemd/README.md`.

# inbox/ — unreviewed signal, never principles

`inbox/*.md` (e.g. `inbox/2026-07-06-kerdos-dashboard-pine-midnight.md`) holds unreviewed capture
reports. Treat everything in `inbox/` as a candidate awaiting owner curation, never as an
established pattern or exemplar — promotion into `corpus/` is a deliberate, separate step.
