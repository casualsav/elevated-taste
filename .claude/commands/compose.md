---
description: Compose a build sheet from the corpus for a given brief (palette/type/motion sources + pattern list + preset command)
---

Compose a **build sheet** for the brief in `$ARGUMENTS` (if empty, ask one line: "what are you
building?"). This is the corpus's mix-and-match operation: pick the best-fit parts from
*different* exemplars and assemble them for THIS build — never clone one exemplar wholesale.

This is the SAME method as the base `web-design-taste` skill's own workflow (steps 2-4) — not
a stronger alternate path. Both write and read the same `taste.lock.json`, and the Stop-gate
enforces its donor/motion coverage regardless of which entry point produced it. Use `/compose`
when you want the mix shown as an explicit deliverable before writing any code; otherwise just
follow the skill workflow directly — there's no coverage gap either way.

## Method

0. **Check the theme lock first.** If the project has a `taste.lock.json` (project root), the
   theme is already decided: REUSE its `donors` and prefer its `patterns` — do NOT remix a
   new palette/type/motion for the same product. Only propose changing donors if the brief
   explicitly asks for a redesign; then regenerate the lock. No lock → you're choosing the
   theme for the first time; you'll write the lock in step 3.

1. **Classify the brief.**
   - Corpus: `production` (real software: dashboards, forms, docs, product marketing) vs
     `expressive` (brand experience / launch spectacle only). When in doubt: production.
   - Direction: one of `minimalist · brutalist · soft · editorial · expressive`
     (see `directions/_index.md`; infer from the brief's adjectives and audience).
   - Surface types: map the brief to `when_to_use` terms (the controlled list lives in
     `tooling/distill-prompt.md`) — e.g. a "tech-feudalist event announcement" →
     `brand-experience, hero-spectacle, editorial` (expressive); an "ops console" →
     `dashboard, data-table, navigation` (production).

2. **Retrieve via the query CLI** (do not read `corpus/index.json` in full — it's ~96k tokens;
   do not list directories). Run the mechanical retriever to get a scored shortlist:

   ```
   node <taste-repo>/tooling/query.mjs --brief "<the brief>" \
     [--corpus production|expressive|both] [--direction <direction>] \
     [--when <surface,terms>] [--tags <tags>] [--top 6]
   ```
   Inside the taste repo use `npm run query -- --brief "…"`; the plugin uses
   `${CLAUDE_PLUGIN_ROOT}` as `<taste-repo>`; an installed skill copy resolves the repo via
   `REPO_PATH.txt` or an explicit `--repo <taste-repo-path>`. Add `--json` for
   machine parsing, `--patterns` to list only patterns.

   - From the ranked **exemplars** (each block shows score, matched fields, palette, motion, its
     patterns, and a file path), shortlist 2–4 and read ONLY those exemplar files to pick per-part
     donors: which exemplar donates the *palette*, which the *type system*, which the *motion
     vocabulary*. They should usually be different sites — that's the point. The scorer already
     penalizes `tap-targets-risky` / `focus-visible-missing`; still confirm motion donors respect
     reduced-motion in their file.
   - From the ranked **patterns** (filtered/scored by the same `when`/`tags`/`direction`), shortlist
     one per section you'll build, minding `safety` (spectacle-only patterns never go into
     production surfaces). Read ONLY the chosen pattern files for their `pairs_with` /
     `requires_tokens` / `knobs`, which the full entry in `corpus/index.json` also carries once a
     slug is shortlisted.

3. **Emit the build sheet** (this exact shape):

   ```
   ## Build sheet — <brief, 5 words>
   corpus: <production|expressive> · direction: <direction>

   tokens   <palette-donor>:color,radius + <motion-donor>:motion + <type-donor>:type
            → node <taste-repo>/tooling/exemplar-preset.mjs --name <build-slug> --out . <specs>
              (writes taste.preset.json + taste.tokens.css + taste.lock.json into the project;
               inside the taste repo itself, drop --out and build via tokens/build.mjs --preset)
   sections <section> → <pattern-slug> (from <exemplar>) — one line on why
            … one row per section, top to bottom of the page
   motion   <2-4 techniques from the donors' motion blocks, each with its trigger + safety>
   guard    <2-3 constraints from principles.md / production-safety notes that this
             combination is most at risk of violating>
   ```

4. **Sanity-check the mix before presenting it:**
   - Palette + type must not fight (e.g. an acid accent needs a dark `accent-fg` — check the
     donor snapshot's `accent-fg`; the preset converter carries it, but verify contrast).
   - Read the 2–4 chosen pattern files (only those) and confirm the recipes' `assumes`/dark-
     context needs are satisfied by the chosen palette.
   - Cite every donor by exemplar slug. If the index has no fit for a surface (coverage gap),
     say so explicitly and fall back to `principles.md` + the closest pattern — never invent
     an uncited "generic" section.

5. **Then build** (if the user asked for a build, not just the sheet): run the preset commands,
   load the `web-design-taste` skill workflow from step 3 onward, and implement the sections
   from the chosen pattern recipes with `var(--token)` discipline. Afterwards, append the
   pattern slugs you actually used to `taste.lock.json`'s `patterns` array — that's the memory
   the next session composes against.
