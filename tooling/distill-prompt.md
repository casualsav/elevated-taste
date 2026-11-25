# Distillation prompt (per exemplar)

This is the prompt template each **distillation subagent** runs, one exemplar at a time, on Opus at max effort. Distillation is the actual product — spend the depth here. Read this whole file, then produce the three outputs.

## Inputs (read all of them first)
- **Screenshots:** `corpus/<corpus>/screenshots/<slug>/desktop.png` and `mobile.png` — Read them as images. Primary evidence for the *resting* design. (Full-page PNGs can be very large; if one won't load, fall back to the frames below.)
- **Source code (READ THIS — not just the screenshot):** `raw/<slug>.html` (the full rendered DOM) and `raw/<slug>.css` (every stylesheet concatenated — same-origin via `cssRules`, cross-origin re-fetched). This is the *actual* markup and styles — the ground truth the screenshots only hint at. Mine it for the real type scale, custom properties / design tokens, grid + container values, breakpoints, and the techniques behind effects. **Distill the transferable idea — never reproduce the site's classes, markup, or bundle.** (Best-effort and possibly large/minified; if missing or unreadable, fall back to the profile + screenshots.)
- **Scroll frames:** `corpus/<corpus>/screenshots/<slug>/frames/s00.png … sNN.png` — viewport stills at even scroll depths (top → bottom). **Read several as images and compare them in order** — this is how you SEE the choreography: what reveals, pins, rotates, recolors, parallaxes as the page scrolls. A single still can't show motion; the frame sequence can. **Also compare for what does NOT move:** a region that stays pixel-identical across stops while content flows past it is a fixed layer (static backdrop, pinned chrome, blend overlay) — that stillness is a design decision; name the mechanism instead of diffing it away as noise.
- **Raw style + motion profile:** `raw/<slug>.json` — frequency-ranked computed styles + a `motion` block. **Approximate and noisy** — corroborate against the screenshots/frames, never treat as ground truth.
  - `motion.summary` — high-signal counts: scroll/entrance/hover effects, IntersectionObserver use + observed targets, scroll/mousemove listeners, rAF activity, `@keyframes` count, detected libraries, whether reduced-motion is respected, interactive elements (carousels/canvas/disclosure/…).
  - `motion.scroll_effects` — per-element effects from diffing computed style across scroll stops: `{property, kind, trigger (scroll-progress | in-view), from→to}`. **Drop entries whose `from == to`** (representation noise, e.g. oklab vs rgb of the same color) and anything the frames don't corroborate.
  - `motion.fingerprint.keyframes` — the site's `@keyframes` NAMES: often the single richest clue to intent (`rotate-reporting`, `connection`/`running`/`completed`, `…-gradient-spin` name the animated product demos). Use them to name techniques.
  - `motion.entrance` / `motion.hover` / `motion.cursor` / `motion.interactive` — load choreography, hover-state deltas, cursor-followers, and a click/drag/tap catalog.
  - `architecture` — the page's structural x-ray. `layers` inventories every `fixed`/`sticky` element with viewport coverage, z-index, blend mode, pointer-events, and a heuristic `role` (`static-backdrop`, `blend-overlay`, `pinned-header`, …) — **check `layers_summary.has_static_backdrop` and `has_blend_overlay` explicitly** — these are the load-bearing flags; a full-viewport fixed layer at negative z means the page scrolls over a still world, and that layering IS a distillable principle. `surfaces` gives per-section background alpha plus `surfaces.summary.transparent_height_pct` — a SOFT signal (sections default to transparent even on flat pages, so a high number only matters when a backdrop/blend layer exists for it to reveal). Also: `blend_glass` (blend-mode/backdrop-filter census), `z_stack`, `tokens` (the site's real custom properties), `fonts` (@font-face inventory), `breakpoints`, `element_census`, `images`, `resources` (third-party hosts — stack provenance), `layout` (grid/flex mix, container widths), `meta`. Role guesses are heuristics — corroborate against the frames before trusting them.
- **Source metadata:** the entry for this URL in `corpus/<corpus>/sources.json` (url, gallery, award type, date).

## Outputs (write exactly these)
1. `corpus/<corpus>/exemplars/<slug>.md` — the structured entry (schema below), including the **Interaction & motion** section.
2. `corpus/<corpus>/tokens/<slug>.json` — a **normalized** token snapshot, including the expanded `motion` block (schema below).
3. One or more `corpus/<corpus>/patterns/<pattern-slug>.md` — reusable patterns with a plain reference implementation. Keep the static section patterns as before, **and add at least one motion/interaction pattern when the site has notable behavior** — a reusable, framework-neutral, `prefers-reduced-motion`-aware recipe (see schema).

> **Principle, not a copy.** Distill the *idea and the technique* so they transfer to any stack — never reproduce this site's markup/classes/bundle. Name the approach generically ("scroll-progress rotation", "in-view fade-rise gated by IntersectionObserver") even if the site used a specific library; record the library only as `stack` provenance.

## The quality bar (calibrate to this)
- ❌ Bad: "Nice purple gradient, clean modern font, good spacing."
- ✅ Good: "Hierarchy comes from *scale contrast*, not weight — a 4.5–6× jump from body to display in a single weight family; whitespace does the separating, so the page reads calm even at high information density. Reusable in product UI."

Every principle must be **transferable** — a rule you could apply to a different site — not a description of this one. Name the mechanism (what creates the effect), not the vibe.

## Controlled retrieval vocabulary (use these so the corpus stays queryable)

The Skill routes requests by matching these fields, so consistency matters more than expressiveness. Reuse existing terms; add a new one only when nothing fits.

- **`directions`** — choose from: `minimalist` · `brutalist` · `soft` · `editorial` · `expressive`. (These five are the direction presets. Use additional flavor words only as `tags`, not here.)
- **`when_to_use`** — choose from: `landing` · `product-marketing` · `pricing` · `feature-section` · `hero` · `dashboard` · `data-table` · `settings` · `onboarding` · `auth` · `docs` · `changelog` · `blog` · `editorial` · `portfolio` · `agency` · `ecommerce` · `checkout` · `navigation` · `footer` · `forms` · `empty-state` · `brand-experience` · `interactive-showcase` · `hero-spectacle`.
  **This list is closed, and it is NOT interchangeable with `layout`.** `when_to_use` answers *"what job is the reader building?"*; `layout` answers *"what is this page's skeleton?"*. A structural archetype — `app-shell`, `dense-grid`, `bento`, `split-hero`, `full-bleed`, `editorial-columns`, `content-grid`, `catalog`, `canvas-immersive`, `os-metaphor`, `collage`, `text-only`, `scroll-theater` — is **never** a valid `when_to_use` value, however well it describes the page. Put it in `layout` and pick the job terms here (a dashboard shell is `dashboard` / `settings` / `navigation`, with `app-shell` in `layout`). Anything outside the list above fails the corpus validator.
- **`surface`** — what the capture actually shows, exactly one of: `app` (a working product screen: dashboard, table, form, settings, sign-in, checkout, onboarding — the thing itself, not a page about it) · `docs` (documentation or a component reference with live examples) · `site` (every public website: marketing, landing, editorial, store, portfolio). A product's homepage that *pictures* its dashboard is `site`. Keep `when_to_use` honest the same way: on a `site`, list an app job (`dashboard`, `settings` …) only when the page shows a usable rendition of it, not a screenshot in a hero. The provenance block below may carry a `surface` hint from the human who queued the page; keep it unless the capture plainly disagrees.
- **`tags`** — free-form industry/medium tags (`fintech`, `ai`, `gaming`, `b2b`, `dark`, `3d`, …); reuse existing ones where possible.
- **`layout`** — the page's dominant structural archetype, 1–2 from: `split-hero` · `center-stack` · `full-bleed` · `bento` · `dense-grid` · `editorial-columns` · `content-grid` · `app-shell` · `catalog` · `canvas-immersive` · `os-metaphor` · `collage` · `text-only` · `scroll-theater`. Judge from the frames and `architecture` profile (what the skeleton IS), not from the tags. This axis exists to break the split-hero monoculture in retrieval — be honest when a site really is `split-hero`.

## `exemplars/<slug>.md` schema

```yaml
---
slug: <slug>
url: <exemplar url>
source: <gallery>            # awwwards | landbook | ...
corpus: <production|expressive>
surface: <app|docs|site>                 # what the capture shows — see controlled vocabulary
captured: <YYYY-MM-DD>
award_type: <e.g. Site of the Day | Gallery | Curated>
score: <number|null>
tags: [<industry/type tags>]            # e.g. fintech, saas, dashboard, editorial
when_to_use: [<retrieval cues>]          # e.g. pricing-page, data-table, hero, onboarding
directions: [<aesthetic flavors>]        # minimalist | brutalist | soft | editorial | expressive
layout: [<structural archetypes>]        # 1-2 from the controlled layout vocabulary
a11y: [<evidence-backed flags>]          # from the craft probe, controlled vocabulary ONLY:
                                         # reduced-motion-respected|reduced-motion-ignored ·
                                         # focus-visible|focus-visible-missing ·
                                         # alt-coverage-high|partial|low · tap-targets-ok|risky
                                         # omit a flag when the evidence doesn't determine it
                                         # tap-targets: copy craft a11y.tap_targets.flag as-is
                                         # (WCAG 2.2 24px rule, text links exempt); omit if null
provenance:
  gallery_url: <listing url>
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [<pattern-slug>, ...]
tokens_snapshot: ../tokens/<slug>.json
screenshots: ../screenshots/<slug>/
---

## What works (3–7 transferable principles)
- <principle naming the mechanism + why it works + where it transfers>

## Design-system read
- **Type:** scale (ratio + range) + pairing logic + how hierarchy is created
- **Color:** relationships + roles (bg/surface/fg/accent/semantic), not just hex
- **Spacing rhythm:** base unit + scale + how whitespace is used
- **Layout system:** grid/columns, alignment, density, breakpoints observed
- **Layering / page architecture:** the z-axis story — what is fixed vs what flows, which surfaces are transparent to the layer beneath, blend/glass layers, and how depth is created (or state plainly "single flat scroll"). Ground it in `architecture.layers` + `surfaces` and the frames
- **Motion / easing intent:** base durations/easings + what motion communicates overall (detailed choreography goes in the **Interaction & motion** section below)
- **Density:** information density and how it stays legible
- **Hierarchy:** the dominant ordering device (scale / weight / color / position)
- **Restraint:** what they deliberately did NOT do

## Interaction & motion (3–6 techniques — REQUIRED when the site animates)
Name each TECHNIQUE, not the site. One bullet each:
- **<technique name>** — *Trigger:* scroll-progress | in-view | load | hover | drag/tap. *Mechanism:* which property is driven by which input (e.g. "element rotation tied to scroll progress inside a sticky track"; "in-view fade+rise gated by IntersectionObserver"; "headline color crossfades as its section pins"). *Reads as:* what it communicates. *Transfers to:* where you'd reuse it. *Safety:* **production-safe** | **spectacle-only** + the cost (reflow / main-thread / motion-sickness / reduced-motion). Cite the matching `patterns/<slug>.md` if you wrote a snippet.

Ground every technique in evidence — the frame sequence (what you watched change top→bottom), the `@keyframes` names, and the probe counts (IntersectionObserver targets, rAF, scroll/mousemove listeners). **Do not invent motion the evidence doesn't support;** if the site is largely static, say so and keep this section to a line or two. Note whether reduced-motion is respected.

## Production-safety note
- For expressive exemplars especially: tag each notable technique **production-safe** or **spectacle-only**, with the usability/perf/a11y cost.

## Extracted patterns
- <pattern-slug> — one line on what it is and when to reuse it
```

## `tokens/<slug>.json` schema (normalized, not a raw dump)

Collapse the noisy raw profile into a coherent set — round to a sane scale, drop one-offs, name roles.
**Dark axis:** when the raw profile's `craft.theme.supportsDark` is true, fill `color.dark` from
`craft.theme.dark` (bg/fg/accent + `surfaces`/`text`/`borders` frequency samples), corroborated by the
`desktop-dark.png` screenshot if present. OMIT `color.dark` entirely when the site doesn't re-theme —
never invent a dark palette.

```json
{
  "color": { "bg": "#…", "surface": "#…", "fg": "#…", "muted": "#…", "accent": "#…", "roles": { "…": "#…" },
             "dark": { "bg": "#…", "surface": "#…", "fg": "#…", "muted": "#…", "accent": "#…" } },
  "type":  { "families": ["…"], "scale": ["…rem"], "weights": [400,600], "leading": [1.1,1.5] },
  "space": { "base": "8px", "scale": ["…"] },
  "radius": ["…"],
  "shadow": ["…"],
  "motion": {
    "durations": ["…ms"], "easings": ["cubic-bezier(…)"],
    "triggers": ["scroll-progress","in-view","hover","load"],
    "techniques": ["in-view-fade-rise","scroll-progress-rotate","sticky-pin-scrollytelling"],
    "scroll_effects": [{ "name":"…", "property":"transform|opacity|color|background|clip", "trigger":"scroll-progress|in-view", "safety":"production-safe|spectacle-only" }],
    "stack": ["IntersectionObserver","CSS @keyframes","GSAP ScrollTrigger","…"],
    "reduced_motion": "respected|not-respected|unknown"
  },
  "notes": "what was normalized away or inferred"
}
```

## `patterns/<pattern-slug>.md` schema

```markdown
---
pattern: <pattern-slug>          # e.g. stat-card-grid, sticky-pricing-table, scroll-progress-rotate
from: <exemplar slug>
corpus: <production|expressive>
safety: production-safe | spectacle-only
trigger: <scroll-progress | in-view | hover | load | drag>   # motion patterns only; omit for static
tags: [<section type | motion>]
---

## What it is
<one paragraph>

## Why it works
<the mechanism — transferable>

## Reference implementation
```html
<!-- framework-neutral; uses var(--token) names from /tokens, no magic numbers -->
```
```

**Motion/interaction patterns** (the snippet must be a drop-in recipe, not a copy):
- **Framework-neutral vanilla JS + CSS.** No site classes, no bundle. A dev on React/Vue/Svelte can port it.
- **Cheap by construction.** Prefer `IntersectionObserver` + CSS transitions over scroll-event handlers; on the hot path animate only `transform`/`opacity` (never width/height/top); add `will-change` sparingly. For true scroll-progress effects prefer CSS scroll-driven animations (`animation-timeline: view()/scroll()`) with a JS fallback.
- **ALWAYS include the reduced-motion fallback** — wrap the effect so `@media (prefers-reduced-motion: reduce)` disables it or jumps to the end state. This is mandatory, not optional.
- Use the HOUSE motion tokens — `var(--duration-fast|base|slow)`, `var(--ease-standard|entrance|exit)` — no magic durations/easings. A timing the house scale can't express gets the fallback form below.

## Rules
- **Token contract (validated in CI — `npm run validate`):** every `var(--x)` in a reference implementation must either (a) be a house token from `/tokens/tokens.json` (including the dark-context roles `--color-bg-dark`, `--color-surface-dark`, `--color-fg-on-dark`, `--color-muted-on-dark`, `--color-border-on-dark`, `--color-border-strong`, `--color-hairline`), or (b) carry an inline fallback — `var(--color-sticker-coral, #ffab8d)` — for pattern-specific values (brand hues, signature shadows, odd sizes). Source fallback values from the exemplar's real palette. Never hard-code magic numbers directly.
- Be honest: if the raw profile and the screenshot disagree, trust the screenshot and say so in `notes`. Same for motion: trust the **frames** over `motion.scroll_effects`; drop `from==to` noise and anything the frames don't show.
- **Extract the principle + technique, never a copy.** Generic, transferable names; the site's library is `stack` provenance only.
- **Every motion claim is evidence-backed** (frames + keyframe names + probe counts). Tag each technique production-safe vs spectacle-only, and always state the reduced-motion story.
- Keep each file tight. Depth = insight density, not word count.
