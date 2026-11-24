# Directions — the aesthetic-flavor layer

A **direction** answers *"what does it look and feel like?"* It is a named aesthetic flavor expressed as a partial **token preset** (`tokens/presets/<name>.json`) plus a stance doc (`directions/<name>.md`). Directions are the second of the system's two axes — see `docs/ARCHITECTURE.md`.

## Directions are ORTHOGONAL to corpus

This is the load-bearing idea, and the most common thing people get wrong: **minimalist / brutalist / soft / editorial / expressive are *not* corpora.** There are two independent axes:

- **Corpus axis — usability vs spectacle** (`corpus/production` vs `corpus/expressive`): *Is this product software, or a brand experience?* Picks which distilled exemplar set and `principles.md` you read, and which production-safety regime applies.
- **Direction axis — aesthetic flavor** (`directions/*`): *What is the visual register?* Picks token overrides (color, type, radius, motion) and the stance doc you follow.

You always choose **one of each**. The corpus governs *how careful* you must be (every `expressive`-corpus technique is tagged production-safe or spectacle-only); the direction governs *how it looks*. They never substitute for each other — e.g. "brutalist" tells you nothing about whether spectacle-only WebGL is acceptable; the **corpus** does.

## How they compose (corpus × direction)

Pick a corpus, then layer a direction over it. The pairing is meaningful — the same direction reads differently on each corpus:

| Want… | Corpus | Direction | Reads as |
|---|---|---|---|
| Calm, document-style SaaS dashboard | `production` | `minimalist` | premium-through-restraint product UI |
| Reading-first publication / media product | `production` | `editorial` | a publication with a clean UI |
| Raw blueprint / telemetry data tool | `production` | `brutalist` | declassified-document data UI |
| Approachable consumer / health / fintech app | `production` | `soft` | expensive *and* friendly |
| Product-launch / marketing hero | `production` | `expressive` | one cinematic hero, sober body |
| Restrained, type-and-space award site | `expressive` | `minimalist` | gallery-grade brand experience |
| Art-directed agency / portfolio showcase | `expressive` | `editorial` | a designed magazine that moves |
| Full motion-led brand experience | `expressive` | `expressive` | the immersive, WebGL/3D event |
| Declassified-document brand site | `expressive` | `brutalist` | tactical/industrial brand experience |

Rule of thumb: **`production` corpus keeps you honest (no spectacle-only moves leak in); the direction supplies the flavor.** On the `expressive` corpus you may reach for spectacle-only techniques — but read each direction doc's production-safety note, and the corpus's, before you do.

A direction never crosses the corpus boundary on its own — applying the `expressive` *preset* to a `production` page does not make spectacle-only WebGL acceptable there; that's a corpus decision. Tokens set the look; the corpus sets the rules.

## How to apply a preset

Presets are partial DTCG overrides (only the changed keys, same `{ "$value", "$type" }` leaf shape) that `tokens/build.mjs` **deep-merges over `tokens.json`** before flattening to `tokens.css`:

```bash
node tokens/build.mjs                      # base only -> tokens.css
node tokens/build.mjs --preset=minimalist  # base + presets/minimalist.json -> tokens.css
node tokens/build.mjs --preset=editorial   # base + presets/editorial.json
node tokens/build.mjs --preset=expressive  # base + presets/expressive.json
```

One preset at a time; the built `tokens.css` carries the merged result, and components consume the CSS custom properties (`var(--color-fg)`, `var(--text-display)`, …) — **no magic numbers, ever.** To preview, run `npm run preview` and load the static reference.

## The five directions (one-line index)

| Direction | Preset | One-liner |
|---|---|---|
| **minimalist** | `presets/minimalist.json` | Premium-through-restraint: extreme typographic contrast, off-black on warm white, generous space, near-zero chrome, no gradients/heavy shadows. The default for most real software. |
| **brutalist** | `presets/brutalist.json` | Raw mechanical precision: huge uppercase neo-grotesque + monospace data, rigid grids, hard edges, utilitarian color — Swiss industrial print *or* tactical terminal (pick one). |
| **soft** | `presets/soft.json` | Warm "soft structuralism": friendly rounded grotesk, airy floating cards, diffused light and tactile depth, muted pastels — expensive *and* approachable. |
| **editorial** | `presets/editorial.json` | Publication gravitas: a serif/display voice carries hierarchy, hairline rules + tracked-caps labels structure the page, generous measure + leading, restrained color. |
| **expressive** | `presets/expressive.json` | Spectacle and motion: large display scale, a family of darks with off-white body, WebGL/3D and immersive scroll motion, one rationed accent — *budget the wow to one surface; mind the production-safety note.* |

Each direction's full stance, exemplars, and (for `editorial`/`expressive`) its production-safety note live in `directions/<name>.md`.
