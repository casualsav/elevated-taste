# Architecture

## The reframe (read this first)

This repo is **not** a model you train. A repo loaded into Claude Code becomes **context**, not training data. So this is a **retrieval-augmented design-reference system**: a distilled, structured corpus that Claude consults *at build time*, plus a Skill that loads it reliably and quality gates that keep output honest.

The leverage is in three places, in order:

1. **Quality of distillation** — turning real exemplars into *transferable rules* + normalized tokens, not descriptions of one site.
2. **Reliable loading** — a high-recall Skill plus an always-on `CLAUDE.md` bias.
3. **Quality gates** — `anti-patterns.md` now; a design-lint and a critic loop in Phase 2.

Scraping raw HTML is the **low-value** path and we deliberately avoid leaning on it. Galleries are used only to discover winner URLs + public metadata; the design knowledge is produced by the distillation pass.

## Two corpora, never blended

| Corpus | What it holds | When to use |
|---|---|---|
| `production` | usability-first SaaS / app / product / editorial UI | **default** for real software |
| `expressive` | award / spectacle web (immersive, motion-led, brand-experience) | only marketing / landing / brand-experience |

Award-winning sites routinely trade usability, performance, and accessibility for visual spectacle. Copying them wholesale into product UI is a known failure mode. Every expressive technique is tagged **production-safe** or **spectacle-only**, and the two corpora are kept physically apart.

## Two orthogonal axes + a craft layer

A common mistake is to treat "minimalist" or "brutalist" as a *corpus*. They aren't. There are **two independent axes**:

- **Corpus axis — usability vs spectacle:** `production` vs `expressive`. *Is this product software or a brand experience?*
- **Direction axis — aesthetic flavor:** `directions/` presets (minimalist, brutalist, soft, editorial, expressive). *What does it look and feel like?*

The axes **compose**: a minimalist SaaS dashboard = `production` corpus + `minimalist` direction; a maximalist product-launch page = `expressive` corpus + `expressive`/`soft` direction.

On top sits a **craft layer** (`.claude/skills/web-design-taste/references/`): procedural knowledge that isn't exemplar distillation — anti-patterns, motion technique, component craft, the redesign-audit workflow, and real design-system anchors.

## Framework decision

Framework-agnostic with instant previews:

- **Tokens are the portable source of truth:** `tokens/tokens.json` → built to `tokens/tokens.css` (CSS custom properties) by `tokens/build.mjs`. Direction presets in `tokens/presets/` override the base.
- **Patterns are framework-neutral** with **plain HTML/CSS reference implementations**, so they preview instantly via the zero-config static server in `preview/`.
- The Skill **emits components into whatever stack the consuming project uses**; with no framework present, it defaults to the static preview.

## Honesty about token extraction

Token extraction from arbitrary live sites is **approximate**. `tooling/capture.mjs` samples computed styles, but real pages carry noise (ad/embed styles, one-off values, JS-driven states). The **normalization + distillation pass** is what turns a raw style profile into a coherent, reusable token set. Treat each `corpus/<corpus>/tokens/<slug>.json` as a *normalized reading*, not a faithful dump.

## Data flow

```
galleries ──harvest──▶ sources.json ──(curate)──▶ capture ──▶ raw style profile + screenshots
                                                                      │
                                                          distill (Opus subagent)
                                                                      ▼
                          exemplars/<slug>.md + tokens/<slug>.json + patterns/<slug>.md
                                                                      │
                                                                synthesize
                                                                      ▼
                                 principles.md + anti-patterns.md + house tokens + presets
                                                                      │
                                                            Skill + CLAUDE.md
                                                                      ▼
                                               build-time design guidance in any project
```
