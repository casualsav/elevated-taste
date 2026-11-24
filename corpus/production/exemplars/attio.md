---
slug: attio
url: https://attio.com
source: editorial-pick
corpus: production
captured: 2026-06-23
award_type: Editorial pick (canonical CRM / data-product marketing)
score: null
tags: [saas, crm, b2b, data, ai, productivity, light, enterprise]
when_to_use: [product-marketing, landing, hero, feature-section, dashboard, data-table, navigation, footer]
directions: [minimalist, editorial]
layout: [center-stack]
a11y: [reduced-motion-respected]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [numbered-section-index, soft-tag-palette, scroll-reveal-in-view, scroll-linked-recolor, scroll-progress-rotate]
tokens_snapshot: ../tokens/attio.json
screenshots: ../screenshots/attio/
---

## What works (transferable principles)

- **Set the base text weight to medium (500), not regular (400), on a light field.** Nearly every text node is Inter at 500; 600 is the only step up and 700 is essentially unused (3 nodes). On a bright white canvas, 400 can look thin and washed; nudging the *floor* to 500 gives the whole page a crisp, "rendered-with-intent" density without ever reading as bold. Hierarchy then comes from scale and color, not from a weight jump. Transfers to any light-mode product/marketing surface that feels flimsy at 400 — raise the base weight one step instead of bolding headings.

- **Hierarchy from a wide two-cluster scale, with almost nothing in the middle.** Type lives in a tight UI ramp (12 / 14 / 16 / 20px) and a separate display ramp (32 / 40 / 56 / 64px) — the empty gap between them *is* the hierarchy. Body 16 → display 56 is a ~3.5× jump in one move, so headings feel like a different register, not a slightly bigger paragraph. Transfers anywhere you want unambiguous heading/body separation: define two clusters and skip the in-between sizes rather than stepping smoothly.

- **Negative tracking scaled to type size keeps big type optically tight.** Body 16px carries ~-0.01em; display 56px tightens to ~-0.015em and the largest heads to the -2% token. Default letter-spacing looks loose and amateur at display sizes; tightening as size grows restores the engineered density. Rule: apply a `tracking-tight` token only at `2xl`+ and let small UI text stay near-normal. (Small all-caps eyebrows invert this — see below.)

- **Near-monochrome field; color is rationed to soft data tints and a near-black action.** The page is white → light-gray surfaces → near-black text, with cool hairline borders. The only chroma is (a) low-chroma blue/green *record tints* borrowed from the CRM's own tag UI and (b) the primary CTA, which is near-black fill, not a saturated brand color. Because the field is desaturated, the product's colored chips read as the live data they represent. Transfers to any data-heavy product: starve the marketing palette so the product UI supplies the color.

- **Chapter a long page with a bracketed numeric index.** Feature sections are eyebrow-labeled `[01] Powerful platform` → `[02] Adaptive model` → `[03] Data enrichment` → `[04] Built for scale`. The repeated `[0X]` device turns a tall scroll into a numbered table of contents, giving the visitor a sense of progress and making a dense story feel like a deliberate system. Transfers to any multi-section landing or docs page that needs spine and wayfinding.

- **Show the real product UI — a dense CRM table — as the hero asset, framed in a hairline card.** For a data tool the interface *is* the pitch; Attio renders true-to-life spreadsheet/record views inside large-radius, hairline-bordered, barely-shadowed frames on the near-white page. The frame is structure from a 1px cool border plus a whisper micro-shadow, not heavy elevation. Transfers to any SaaS/dashboard product: capture the genuine UI and present it in a calm, low-elevation frame instead of an abstract illustration.

- **Calm at high density via whitespace + hairlines, not dividers or fills.** Sections are separated by large vertical breaks (~100–120px) and bordered by 1px cool hairlines; there are no chunky background-color bands doing the macro-separation. The result carries a lot of information yet breathes. Transfers to data-dense B2B pages that must avoid feeling cluttered.

- **Composite overlays into the field with `mix-blend-mode`, not a masking box.** Where animated diagram content sits over a textured dotted-grid backdrop, Attio blends it in rather than boxing it: `mix-blend-darken` drops the overlay's white background so the grid shows through continuously, while `mix-blend-screen` adds accent light (hover underlines, gradient glow) that lightens against any tone instead of stamping a solid rectangle (~12 blended elements — 9 screen, 3 darken). The payoff matches the rest of the page's restraint — depth without another opaque card or drop shadow. Transfers to any surface layering product diagrams, logos, or glows over a textured/gridded field: blend the layer into the backdrop instead of masking it with a filled card.

## Design-system read

- **Type:** Inter (with Inter Display for the largest display sizes). Two-cluster scale — UI ramp 12/14/16/20px + display ramp 32/40/56/64px — with the gap as hierarchy. Weights are just **500 (base)** and **600 (emphasis)**; 700 effectively unused, so the page never "bolds." Leading: ~1.07 on display (56/60), ~1.19 on subheads (32/38), 1.375 on body (16/22). Tracking tightens with size (body -0.01em → display ~-0.015em / -2%); small all-caps eyebrows go the *other* way to ~+0.06em.
- **Color:** Light monochrome system. `bg #ffffff` → `surface #f6f7f8` → `surface-2 #eeeff1` → `fg #18191c` (near-black, faint blue) → `muted #5c5e63` → `subtle #75777c`. Borders are cool hairlines `#e6e9ee`/`#d4dae0`. The action color is the **near-black fg**, not an accent. Chroma appears only as soft categorical record tints — blue (`#e5eeff` on `#d6e5ff`) and green (`#ddf9e4` on `#c7f4d3`) — plus a web-blue link/focus accent ~`#2f6df6`. One inverted dark surface (`#181a1f`) carries the closing CTA / footer.
- **Spacing rhythm:** 4/8 base. Component gaps cluster tight (the single most common gap is 6px, then 4/8/12px) for the chrome; section padding jumps to ~100–120px vertical. Whitespace + hairlines do the separating; near-zero use of filled divider bands.
- **Layout system:** centered max-width container; repeating feature blocks (bracketed index eyebrow + heading + muted description, then a full-width hairline-framed product capture). Card grids use 12px-radius hairline surfaces. Viewport captured at 1440×900.
- **Layering / page architecture:** No full-page fixed backdrop and no page-wide blend overlay — depth comes from *native sticky pinning* over *mostly-transparent surfaces*, not stacked opaque cards. Two sticky layers: the header (`z-92`, 100%×13%, fully transparent bg) and one scrollytelling region (`sticky top-[--site-header-height]`, ~100vh grid, 97%×87%) that pins a claim while its demo scrolls beneath (see **Sticky-pinned section headline**). Of 10 page surfaces, **7 are transparent (~72% of scroll height)**, so most content flows over one shared light field rather than sitting on its own filled band. Compositing is done with **blend, not masks — ~12 `mix-blend` elements:** `darken` (×3) knocks white out of the `opacity-0` diagram columns so the dotted-grid backdrop reads straight through them (visible in the "Continuous context" data-model frame), and `screen` (×9) adds light for hover-underline / gradient accents that lighten against any tone instead of painting an opaque box. Glass (`backdrop-blur 12–24px`) appears only on the nav popup/menu, never as a page-wide sheet.
- **Motion / easing intent:** standard transition `0.3s cubic-bezier(0.2,0,0,1)` (a decelerating ease-out — identical to the house `ease.standard`), with `0.15s` for quick state changes, an entrance `cubic-bezier(0,0,0,1)`, and `cubic-bezier(0.32,0,0.67,0)` for ease-in. Durations cluster at 150 / 300 / 400ms. The base micro-motion reads as responsiveness and polish; the page's full *choreography* (in-view reveals, scroll-pinned scrollytelling, live product diagrams) is detailed in **Interaction & motion** below.
- **Density:** high — embedded product shots are genuinely data-dense CRM tables — kept legible because the surrounding marketing chrome is sparse, high-contrast, and monochrome.
- **Hierarchy:** dominant ordering device is **scale** (the two-cluster gap), reinforced by **color** (near-black vs muted gray) and by the numbered index for sequence.
- **Restraint:** no gradient text, no multiple competing weights, no saturated brand accent on the CTA, no heavy drop shadows, no divider bands. The "serious data platform" feel is achieved by subtraction — exactly like a well-built dark monochrome site, but inverted to light.

## Interaction & motion

Attio's motion is **functional, not spectacle** — restrained micro-transitions plus pervasive in-view reveal, with the "wow" reserved for *live product diagrams*. Evidence from the motion capture: 47 `@keyframes`, 10 `IntersectionObserver`s over 128 targets, ~500 `requestAnimationFrame` callbacks during one scroll pass (live canvas loops), 5 `<canvas>` nodes, and 3 `prefers-reduced-motion` blocks — **reduced motion is respected.** No GSAP/Lenis/Framer globals; it's hand-rolled CSS keyframes + IntersectionObserver + canvas. Stack: `IntersectionObserver` · CSS `@keyframes` · `<canvas>` + rAF.

- **In-view fade-rise reveal** — *Trigger:* in-view (IO, 128 targets). *Mechanism:* one class flip on intersect → CSS transitions `opacity` + a ~16–24px `translateY`, fired once. *Reads as:* a long page that "settles in" section by section. *Transfers to:* any tall marketing/docs page. *Safety:* **production-safe** (GPU-cheap, once-only, reduced-motion off). → `scroll-reveal-in-view`.
- **Scroll-into-view recolor** — *Trigger:* in-view. *Mechanism:* muted text resolves to full-strength fg and near-white blocks lift to a solid surface as they enter (`rgb(113,122,136)→rgb(80,89,103)`). *Reads as:* "this just became important" — the static two-tone heading made temporal. *Transfers to:* feature captions, eyebrow→headline. *Safety:* **production-safe** (one-shot; meaning not hue-dependent). → `scroll-linked-recolor`.
- **Scroll-progress rotation / spin** — *Trigger:* scroll-progress. *Mechanism:* a reporting chart and an "AI hero box" gradient rotate/scale with scroll progress (keyframes `rotate-reporting`, `rotate`, `spin`, `ai-hero-box-gradient-spin`). *Reads as:* the data viz feels alive and reader-driven. *Transfers to:* any hero visual or chart you want to feel responsive. *Safety:* **production-safe** with care (compositor-only transform; cap the angle). → `scroll-progress-rotate`.
- **Sticky-pinned section headline** — *Trigger:* scroll-progress. *Mechanism:* a section heading pins (`position: sticky`) while its product demo scrolls past beneath (capture: pin on "Orchestrate revenue agents…"). *Reads as:* scrollytelling — one claim, evolving evidence. *Transfers to:* feature deep-dives. *Safety:* **production-safe** (native sticky, no JS).
- **Animated connector diagrams** — *Trigger:* in-view, then a `<canvas>`/SVG rAF loop. *Mechanism:* nodes connect with drawing paths and cycle through states (`connection`→`running`→`completed`, plus `pulse`) over a dotted-grid bg — the workflow graph and the Universal-Context data model. *Reads as:* "the product is doing work right now"; the interface IS the pitch, animated. *Transfers to:* any platform / automation / graph story. *Safety:* **spectacle-leaning but production-safe if budgeted** — the most expensive thing on the page (live canvas + rAF). Lazy-init on in-view, pause off-screen, ship a static fallback under reduced-motion. (No standalone snippet — bespoke to the content; reuse the *principle*: animate the real product graph, gated + pausable.)
- **Tabbed product showcase** — *Trigger:* click/tap. *Mechanism:* a tab row (Ask Attio / Data model / Workflows / Reporting) swaps the framed product panel with a slide-in (`navigation-enter-from-right`, `enter`/`exit`). *Reads as:* one hero frame, four proofs, user-controlled. *Transfers to:* multi-feature heroes, instead of four stacked screenshots. *Safety:* **production-safe** (transform/opacity swap; keep tabs keyboard-operable).
- **Hover micro-states** — *Trigger:* hover. *Mechanism:* nav items and CTAs shift `background`/`color`/`border` over 120–200ms `ease-standard`. *Reads as:* responsive, "rendered with intent." *Transfers to:* all interactive chrome. *Safety:* **production-safe**.

## Production-safety note

This is a shipping B2B product site; all techniques are **production-safe**:
- Base-weight 500 + scale/color hierarchy — **production-safe**, zero cost.
- Near-black primary CTA (no saturated accent) — **production-safe**; ensure non-color affordance (clear button shape/label) since the action isn't signaled by hue.
- Cool hairline borders + micro-shadow frames — **production-safe**; 1px low-contrast borders can vanish on low-quality displays — fine for marketing, verify for a11y-critical UI.
- Soft record tints (blue/green) — **production-safe**; they're decorative-categorical, so don't rely on hue alone to convey state — keep a text label inside the chip (see pattern).
- Full-fidelity CRM screenshots — **production-safe** but a **payload/perf watch**: ship responsive `srcset`/AVIF and lazy-load below the fold on a tall page.
- Muted/subtle grays (`#75777c` on white ≈ borderline) — keep them ≥ body size or darken for small text to hold 4.5:1.

## Extracted patterns
- **numbered-section-index** — bracketed `[0X]` sequential eyebrow labels that chapter a long feature page into a numbered table of contents; reuse to give a multi-section landing spine and wayfinding. (Distinct from linear's `feature-section-header`, which is about the two-column heading geometry; this is specifically the numeric index device.)
- **soft-tag-palette** — a set of low-chroma tinted pills (each hue = one category) lifted from a CRM/label UI; reuse for record tags, table category cells, kanban labels, or filter chips where you need several distinguishable-yet-calm colors on a light surface.
- **scroll-reveal-in-view** — IntersectionObserver-gated fade+rise that fires once per element; reuse to give any long page entrance rhythm without scroll-jank. (motion)
- **scroll-linked-recolor** — muted text/surface resolves to full-strength on entry; reuse to add a second beat to a reveal or make a two-tone heading temporal. (motion)
- **scroll-progress-rotate** — transform (rotate/scale) bound to scroll progress via CSS `animation-timeline` with a rAF fallback; reuse to make a hero visual or chart feel alive and reader-driven. (motion)
