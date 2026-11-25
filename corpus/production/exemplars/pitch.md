---
slug: pitch
url: https://pitch.com
source: editorial-pick
corpus: production
surface: site
captured: 2026-06-23
award_type: Editorial pick (canonical presentation / deck SaaS — motion-led product marketing)
score: null
tags: [saas, presentations, ai, b2b, productivity, dark, purple, brand, motion-dense, framer]
when_to_use: [product-marketing, landing, hero, feature-section, interactive-showcase, hero-spectacle, navigation, footer]
directions: [expressive, soft]
layout: [center-stack, bento]
a11y: [reduced-motion-ignored, focus-visible-missing, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [oversized-display-headline, scroll-blur-word-reveal, parallax-drift, card-stack-scale-dim, scroll-reveal-in-view, sticky-pin-scrollytelling, announcement-ticker-marquee, two-tone-headline]
tokens_snapshot: ../tokens/pitch.json
screenshots: ../screenshots/pitch-com/
---

## What works (transferable principles)

- **Commit fully to one saturated brand hue and build the whole field from its value ramp.** The page is essentially a single violet (`#5318eb`) stretched into a tonal system: near-black indigo (`#0c021c`) bodies, a mid-deep `#280f62` nav/section band, the pure-violet action/brand, and pale `#ebe3fe`/`#c6a5ff` washes — plus exactly *one* foil, a lime `#c4ee87` reserved for the primary CTA. Because everything else is the same hue, the lime button is unmissable without being loud, and dark and light sections alternate as values of the *same* color rather than a palette swap. Transfers to any brand-forward marketing site: pick one hue, derive bg/surface/deep/wash from its value axis, and ration a single complementary accent for the one action that matters.

- **Make the headline the hero — display type at a register that dwarfs everything else.** The H1 ("Create slides that win.") renders at **180px** with **-7.2px** tracking and **0.8 line-height**; section heads run 48–92px. There is no in-between display tier — body sits at a tiny 12–16px and the gap *is* the hierarchy (a ~10–15× jump from body to H1). On a deck tool this is on-message: the page itself performs "a stunning slide." Transfers to brand/landing work where confidence matters more than density — let one or two giant lines carry the page and keep everything else quiet UI text.

- **Tighten tracking as type scales up — and tighten it *harder* at the very top.** Tracking is *not* a single global em value: it holds at roughly **-0.02em across body and mid-display** (-0.32px@16px, -0.4px@20px, -1.28px@32px, -1.92px@48px, -2.56px@64px) and then **tightens to -0.04em only at the 180px hero** (-7.2px). The 92px step is a deliberate near-zero **outlier** (-0.2px ≈ -0.002em), left almost open so that one big section head breathes. Default letter-spacing looks slack and amateur at display sizes; binding a per-size negative `tracking` token — flat in the middle, tighter at the extreme, with one intentional exception — keeps huge type optically dense and engineered. Transfers anywhere you ship large display type — make tracking a token per scale step, not a single global value.

- **Round everything generously so a serious B2B tool feels friendly and "designed."** Radii cluster large — 20px is the dominant value (cards, inputs), with 24/30/40px on bigger surfaces and full pills on buttons. Combined with the soft violet washes and a single tinted shadow, the dark, dense page reads approachable rather than corporate-severe. Transfers to consumer-leaning SaaS: a big consistent corner radius is a cheap, high-leverage "craft" signal — pick one generous value and apply it everywhere.

- **Show the product as living, colorful UI fragments — not one framed screenshot.** Feature sections (Brand library / Team organization / Unrivaled visuals) are built from small, genuine product chips — a climbing "76%" chart, avatar stacks, a color/asset library, template thumbnails — each in its own rounded card. For a visual tool the proof is *many* small bright artifacts on the desaturated violet field, which makes the color belong to the product. Transfers to any creative/visual product: decompose the UI into a few legible, on-brand fragments instead of one shrunk-down full-app screenshot.

- **Chapter the long page with tiny tracked-caps eyebrows over giant heads.** Each section opens with a small letter-spaced caps label — `THE PAYOFF`, `TOOLKIT`, `FAQS` — sitting above a massive display heading. The micro/giant pairing gives a tall, motion-heavy scroll a calm spine and a sense of "chapters," so the spectacle never feels like undifferentiated noise. Transfers to any long marketing page: a quiet caps eyebrow is the cheapest wayfinding device and it grounds an otherwise loud composition.

## Design-system read

- **Type:** Eina 03 (geometric grotesk, regular + bold) for display/UI with Mark Pro Bold as a heavy display companion; Space Mono for the occasional metadata/eyebrow. A two-tier system with a deliberate void in the middle: tiny UI/body **12 / 16 / 20px** and a display ramp **28 / 32 / 48 / 64 / 92 / 180px**. Hierarchy is pure **scale** (body→H1 is ~10–15×). Leading is tight on display (180/144 = 0.8; 48/57.6 = 1.2) and ~1.6 on body (16/25.6). Tracking is negative and runs ~**-0.02em** across body/mid-display, tightening to **-0.04em only at the 180px hero** (the 92px step is a deliberate near-zero outlier); small caps eyebrows are the inverse (tracked-out). `tabular-nums` on stats.
- **Color:** One-hue value system. `bg #0c021c` (near-black indigo) → `surface/band #280f62` (deep violet) → `brand/action #5318eb` (pure violet) → washes `#ebe3fe` / `#c6a5ff` → `fg #ffffff` on dark, `#0c021c` on light. Light sections are `#ffffff` / `#f6f6f6`. The *only* non-violet is the **lime `#c4ee87` CTA** (hover → lilac `#c6aafa`), plus a default-link blue (`#0000ee`, mostly unstyled anchors — likely capture noise, not a design color). Borders reuse the text colors. One tinted elevation: `rgba(198,165,255,.35) 0 20px 60px -20px` over a matching radial glow.
- **Spacing rhythm:** 4/8 base. Component gaps cluster at 8/10/16/20/24px; section padding jumps to 80/104/120px (one 210px outlier). Generous vertical breaks separate sections — color-band changes and whitespace do the macro-separation, not dividers.
- **Layout system:** centered max-width container; alternating full-bleed color bands (dark hero → light feature → dark templates → dark FAQ). Feature blocks are eyebrow + giant head + 3-up card row. **Container / grid (measured — profiler re-probe captured the flex-band content column + gutters; corroborated by the 1440×900 frames):** content sits in a **centered container with a ~1224px max-width** within the 1440 viewport (frame check: left edge ≈116px, right edge ≈1332px, near-symmetric ~110px gutters; the nav logo→button span runs slightly wider). The feature card row is **3-up with a ~24px gutter**, collapsing **2-up → 1-up at 390px**. Full-bleed color bands ignore the container; only the inner content respects it. Captured 1440×900; mobile 390 downsizes H1 180→82px and collapses the 8-link nav to a hamburger.
- **Imagery:** two distinct registers on the violet field — (1) **realistic product-UI chrome** (cropped Pitch panels: a "Brand kit" inspector with style-color swatches and headline/body font pickers, an in-deck "what customers are saying" chart slide, avatar stacks, a climbing % stat) that proves the actual product, and (2) **flat, high-saturation template thumbnails** ("THE EDITORIAL TEMPLATE", "PARTNERSHIP PROPOSAL", "BRIEF") used as decorative parallax/marquee fill. The chrome panels carry credibility; the flat thumbnails carry color and motion.
- **Motion / easing intent:** Framer-driven and pervasive — base micro-transitions at 150/200/300ms, reveals 400–500ms. Easings include Material `cubic-bezier(0.4,0,0.2,1)`, an expressive ease-out `cubic-bezier(0.22,1,0.36,1)`, and a **spring/overshoot `cubic-bezier(0.34,1.56,0.64,1)`** for playful entrances. Motion here communicates "this product is alive and animated" — it's part of the pitch, not just polish (full choreography below).
- **Density:** low text density, high *motion* density. Sparse copy, huge type, lots of breathing room — but nearly every element moves on scroll, so the page feels busy in time rather than in space.
- **Hierarchy:** dominant device is **scale** (the enormous display tier), reinforced by **color value** (light vs near-black bands) and by the single lime accent marking the one primary action.
- **Restraint:** despite the motion budget, the *static* system is disciplined — one hue, one accent, one shadow, one big radius, two type families, no gradient text, no competing accent colors. The restraint is in the palette; the indulgence is in the motion.

### Components (with captured states)

Buildable from this block alone — no JSON needed; states are from the capture (`craft.states`).

- **Pill button (primary CTA):** full pill (`9999px`), lime fill `#c4ee87` with label `#0c021c`; **hover →** lilac `#c6aafa` fill. **Disabled →** violet `#5318eb` fill at **opacity `0.4`**, white label, **`cursor: not-allowed`**. The one non-violet control on the page; signal the action by shape + label, not hue alone.
- **"Log in" link/button:** text/fill **white → `#5211eb`** (brand-hover) on hover. Pairs with the primary pill as the secondary action.
- **Nav buttons / links:** background fades to **`rgba(11,3,24,0.024)`** (a barely-there indigo tint) on hover; the **"See what's new"** announcement link **gains an underline** on hover; generic buttons simply **drop to opacity `0.6`**. Focus today falls back to a **`1px` `#101010` outline** (no `:focus-visible` ring — fix on rebuild).
- **Product card:** **~20px radius** (the dominant value) over the violet field, lifted by the single tinted elevation **`rgba(198,165,255,.35) 0 20px 60px -20px`** plus a matching radial glow. Holds either a product-UI chrome fragment or a flat template thumbnail.
- **Nav bar:** transparent over the hero, animating **`rgba(0,0,0,0)` → `#280f62`** (deep band) once you leave the hero so links stay legible; **8 links collapse to a hamburger at 390px**. Right cluster = "Log in" + primary pill.

## Interaction & motion

Pitch is **motion-led and Framer-built** — the opposite of Attio's hand-rolled restraint. Evidence from the capture: library = **Framer**, **88 IntersectionObservers over 88 targets** (many with dense scrub arrays `[0,0.01,…,0.99]`), **2467 rAF calls** in one scroll pass, **10 scroll + 6 mousemove listeners**, **5 cursor-followers**, **21 marquees**, **83 draggable** nodes, 1 pinned (fixed) element, 0 `@keyframes` (all motion is JS/Framer-driven, not CSS). Crucially, **`prefers-reduced-motion` is NOT respected** (`respectsReducedMotion: false`, 0 PRM rules) and **`:focus-visible` is not styled** (focus falls back to a 1px outline) — both are real accessibility gaps to fix on any rebuild. Stack: `Framer` · `IntersectionObserver` · rAF · `script_main.*.mjs`.

- **Oversized-display reveal + parallax drift** — *Trigger:* in-view / scroll-progress. *Mechanism:* the H1 and section heads fade-rise on entry while background deck thumbnails and decorative layers translate at their own rates (18 `transform/parallax` effects across the page). *Reads as:* depth and momentum — the page has a back, middle, and foreground. *Transfers to:* any brand hero that wants dimensionality without 3D. *Safety:* **production-safe if subtle** (compositor-only `transform`; cap the offset, gate reduced-motion) → `parallax-drift`. The corpus warns parallax tips to **spectacle** when heavy — Pitch is on the heavier side.

- **Scroll-blur word-by-word headline reveal** — *Trigger:* in-view (dense IO scrub). *Mechanism:* a sentence resolves word by word — trailing words sit at low opacity + `blur()` and snap to `opacity:1 / blur(0)` as they enter (captured *mid-transition* on "get **buy-in, and win more deals.**" — the spans were caught animating blur+opacity, so the exact resting blur/opacity values are **inferred from the frames**, not read off a settled DOM). *Reads as:* the claim "comes into focus," a literal focus pull on copy. *Transfers to:* a single statement section you want to feel cinematic. *Safety:* **spectacle-only** — animated `filter: blur` is GPU-expensive and the dense scrub IO is the costliest pattern in the corpus; it also delays readable text. Use sparingly, never on critical above-the-fold copy, and **must** ship a reduced-motion fallback that renders the text sharp → `scroll-blur-word-reveal`.

- **Card-stack scale + dim on scroll** — *Trigger:* in-view / scroll-progress. *Mechanism:* stacked list items scale between ~0.88 and 0.94 and shift `filter: brightness(1)→brightness(0.7)` as they move through the viewport, so the focused card is largest/brightest and neighbors recede. *Reads as:* a depth-of-field carousel; attention is steered to one card at a time. *Transfers to:* testimonial decks, template galleries, any "one-at-a-time" stack. *Safety:* **production-safe with care** (transform + filter are compositor-friendly; brightness is cheap) — cap the scale delta and gate reduced-motion → `card-stack-scale-dim`.

- **Sticky-pinned announcement / section** — *Trigger:* scroll-progress. *Mechanism:* the "Introducing Pitch Agent" bar pins (`position: fixed`) while content scrolls beneath it (1 pin detected); section heads also hold while their card rows scroll past. *Reads as:* a persistent message + scrollytelling chapters. *Transfers to:* launch banners, feature deep-dives. *Safety:* **production-safe** (native sticky/fixed, no JS cost) → `sticky-pin-scrollytelling`.

- **Nav background-shift on scroll** — *Trigger:* in-view / scroll position. *Mechanism:* the top nav animates from transparent `rgba(0,0,0,0)` to the deep band `#280f62` once you leave the hero, keeping links legible over changing sections. *Reads as:* the chrome "solidifies" as you commit to the page. *Transfers to:* any over-hero transparent nav. *Safety:* **production-safe** (single bg transition; ensure contrast holds in both states).

- **Testimonial / logo marquee** — *Trigger:* continuous (autoplay). *Mechanism:* 21 marquee tracks scroll quote and template cards horizontally in an infinite loop. *Reads as:* social-proof abundance, "everyone uses this." *Transfers to:* logo walls, testimonial rows, template showcases. *Safety:* **production-safe** *if* it pauses on hover/focus and respects reduced-motion — Pitch's does neither here, so 21 simultaneous autoplay tracks are a motion-sickness + CPU concern → `announcement-ticker-marquee`.

- **Cursor-followers + hover micro-states** — *Trigger:* mousemove / hover. *Mechanism:* 5 cursor-following elements (matrix translate tracking the pointer via 6 mousemove listeners); buttons drop opacity to ~0.6 or swap fill on hover (lime→lilac, white→violet). *Reads as:* a bespoke, "alive" surface. *Transfers to:* brand-experience sites. *Safety:* **spectacle-only** — cursor-followers are fine-pointer-only (useless/janky on touch), add mousemove load, and should be gated; the simple hover recolors are production-safe.

## Production-safety note

Pitch corpus = **production** (it's a shipping product-marketing site), but it leans **expressive** and several techniques are spectacle-grade. Honest tags:

- One-hue value system + single lime CTA — **production-safe**, zero cost; just ensure the lime↔white/violet contrast meets AA and the action is signaled by shape/label, not hue alone.
- Oversized 180px display + tight tracking — **production-safe**; verify it downscales (it does: 82px mobile) so it doesn't overflow small viewports.
- Parallax drift (18×) — **production-safe only if subtle + gated**; tips to spectacle at Pitch's intensity. Cap offsets, animate `transform` only.
- Scroll-blur word reveal — **spectacle-only**: animated `blur()` + dense scrub IO is the most expensive thing here and delays text; reserve for one statement, fall back to sharp text.
- Card-stack scale/dim — **production-safe with care**; small deltas, compositor properties.
- 21 autoplay marquees + 5 cursor-followers + 2467 rAF/scroll — **spectacle / perf-watch**: a real main-thread budget. Pause marquees on hover/focus, lazy-init off-screen, throttle.
- **`prefers-reduced-motion` NOT respected** and **no `:focus-visible` ring** — the two concrete a11y defects. Any rebuild from this exemplar MUST add a reduced-motion path (ship resting states in the DOM) and a visible focus ring. `small_tap_targets: 62` also flags touch-target sizing to audit. **On the credit side, alt-text coverage is strong — ~98% of 104 images (`craft.a11y.img_alt_ratio` 0.98)** — so the gaps are motion/focus, not image labelling.

## Extracted patterns
- **oversized-display-headline** — a single display tier (90–180px) with proportional negative tracking and no mid-size step, so body→head scale *is* the hierarchy; reuse for confident brand/landing heroes. (Distinct from attio's two-cluster scale: this is the extreme single-giant-tier variant.)
- **scroll-blur-word-reveal** — words resolve from low-opacity+blur to sharp as they enter view; reuse for one cinematic statement line. **spectacle-only**, reduced-motion-gated. (motion)
- **card-stack-scale-dim** — stacked cards scale + dim with scroll so the focused one dominates; reuse for testimonial/template stacks. (motion)
- **parallax-drift** — background/foreground layers translate at different scroll rates for depth; reuse subtly on brand heroes. (motion; existing corpus recipe)
- **announcement-ticker-marquee** — infinite horizontal ticker for logos/quotes/templates; reuse for social proof — must pause on hover/focus + gate reduced-motion. (motion; existing corpus recipe)
- **two-tone-headline** — display heading where part of the line drops to a lighter tint of the same hue for emphasis (FAQ "Not just another slide tool", "get buy-in…"); reuse to add emphasis within one heading without a second color.
