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
5. **Validate + reindex** — `npm run validate` (token contract, controlled vocabulary, cross-refs, sources sync; must pass) then `npm run index:build` (regenerates `corpus/index.json`, the retrieval index — commit it with the exemplar). Then rebuild the directory site: `python3 sites/pages/build.py`.
6. **Push captures BEFORE pushing main** — `bash tooling/push-captures.sh` (syncs `corpus/*/screenshots/` to the orphan `captures` branch CI reads). The deploy-site workflow fires on the main push and builds `--strict`: if the new exemplar's screenshots aren't on `captures` yet, the deploy fails. Then commit + push main.

`raw/` and `corpus/*/screenshots/` are git-ignored private references — commit only the distilled `exemplars/`, `tokens/`, `patterns/`, and `sources.json`. Full method: `tooling/distill-prompt.md`. Deploy/serving notes: `sites/pages/README.md`.
