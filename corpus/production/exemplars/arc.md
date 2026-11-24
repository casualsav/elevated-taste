---
slug: arc
url: https://arc.net
source: editorial-pick
corpus: production
captured: 2026-06-22
award_type: Editorial pick (consumer-software brand marketing)
score: null
tags: [consumer, software, browser, productivity, b2c, brand, warm, expressive-restraint]
when_to_use: [landing, product-marketing, hero, brand-experience, feature-section, interactive-showcase]
directions: [expressive, editorial]
layout: [center-stack, bento]
a11y: [reduced-motion-ignored, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [scalloped-band-edge, aurora-mesh-canvas, sticky-pin-scrollytelling, parallax-drift, announcement-ticker-marquee, magnetic-cta]
tokens_snapshot: ../tokens/arc.json
screenshots: ../screenshots/arc/
---

## What works (transferable principles)

- **One hue does triple duty — section background, brand, and the only CTA color — so the page reads owned without a palette.** Arc's `#3139fb` is the full-bleed band color *and* the accent: the quote band, the download buttons, the footer, the links are all the same blue, alternating with warm cream canvases. Collapsing bg + accent into a single saturated hue means brand is never "applied" as a decoration; it's the substrate. The trick that keeps the CTA legible despite this is *tone*: on the blue bands the secondary button is a translucent blue-on-blue while the primary goes solid white, so contrast comes from surface vs. inversion, not a second color. Transfers to any product with a strong single brand color — commit to it as the canvas and differentiate actions by fill/inversion, not by introducing more hues.

- **Section seams are the brand surface: a repeating scalloped wave is cut at every band transition.** Rather than flat dividers, every blue↔cream boundary (top of the hero canvas, both edges of the quote band, the footer top) is carved into a soft row of semicircle scallops. On a long stacked page the transitions are the cheapest place to express personality, and a *scallop* specifically signals soft/friendly/analog — exactly the "calmer, more personal internet" pitch. The same repeated cut down the page reads as deliberate craft, not a default rectangle stack. Transfers to any multi-band marketing page that alternates tone and wants a recognizable, near-zero-cost rhythm. (Distinct from a hard diagonal "ticket-stub" notch — the curve carries a consumer/friendly tone the diagonal can't.)

- **A bold transitional serif over a plain system sans is the entire voice — bought with one font, not a type system.** Display lines ("Meet Dia, the next evolution of Arc", the section headers) are a heavy ABC Oracle serif; everything functional — subheads, nav, labels, buttons — is the OS system sans. The serif reads characterful/human/editorial at the few large strings; the sans stays invisible and fast everywhere else. Hierarchy is created by *typeface contrast + scale*, so the page needs only a couple of weights. Transfers to any consumer brand wanting warmth at the headline without a bespoke sans: reserve a display serif for big strings only, let the system font carry the chrome.

- **The hero sits on a soft aurora mesh-gradient, not white or a flat tint.** Pale pink/peach/lavender blooms seeded at the edges fade to a warm cream center, so the canvas glows with brand atmosphere while the center stays light enough for full-contrast dark text. A *mesh* reads as crafted mood where a flat tint reads as a swatch — and it ships as a few hundred bytes of CSS gradients instead of a hero image (no CLS, no art-direction debt). Transfers to any hero that wants an expensive, owned backdrop without an image: keep chroma low and edge-weighted, keep the middle pale for legibility.

- **Real, generously sized product UI is the proof — large, slightly-3D browser mocks anchor every claim.** Each feature section ("A browser that doesn't just meet your needs", "Space for the different sides of you", "Your perfect setup") pairs a short centered headline with a big, lightly-tilted screenshot of the actual app in a realistic window chrome, often tinted to match the surrounding canvas. For a *visual* product (a browser), showing the interface at scale does more persuading than any copy. Transfers to any product whose value is its UI: lead with large, honest, in-context product shots over abstract illustration.

## Design-system read

- **Type:** Two-family system. Display = a bold transitional serif (raw: "ABC Oracle", Times fallback) at ~28–46px; body/UI = the OS system sans (`-apple-system`). Scale is restrained (raw clusters: 16px body, 12–14px labels, 24/28/32/40/45px display) — roughly a 2.5–3× body→display jump. Hierarchy = typeface + scale, not a weight ladder; weights stay near 400/700. An "Exposure VAR" face appears once (the eyebrow/marquee). Tight negative tracking on large serif (raw −1.4 to −1.8px) makes the display feel engineered.

- **Color:** Two-pole world. Pole A = saturated brand blue `#3139fb` (bands, accent, CTAs), deepening to `#2702c2` for pressed/secondary fills. Pole B = warm cream "paper" `#fffcec` / `#fffadd` canvases. Neutrals are minimal: near-black text, a single mid-gray `#696969` for subheads. The aurora hero adds pale pink/peach/lavender as *background mood only*. Roles: `bg`=blue (also `accent`), `surface`=cream, `fg`=near-black, on-brand text = white / translucent-white. Notably bg and accent are the *same* hue by design.

- **Spacing rhythm:** 8px base, but big section breathing — raw shows generous block padding (72/128/150px) on bands, 24px as the workhorse inline/gutter unit, 12px the dominant intra-component gap. Whitespace, not rules, separates sections; each band is tall and centered.

- **Layout system:** Single centered column for all headline/copy blocks (short measure, `text-wrap: balance` feel), with full-bleed product mocks below. One genuine grid: the bento/masonry photo wall in the first feature section. Max content width ~1100–1200px. Mobile (1170px shots) is a clean 1-column reflow — scallops shrink, mocks go full-width, nav collapses to a hamburger.

- **Motion / easing intent:** Micro-motion is deliberately tiny. Captured params: durations cluster at **100 / 150 / 200ms** for all hover/state changes (plus one outlier **78.6s** — the press-quote marquee loop), and easings are the bare CSS keywords **`ease` / `ease-out` / `ease-in-out`** — no tuned cubic-beziers, no stagger (`stagger_delays_ms: []`). So state transitions read as "instant but cushioned." The page-scale choreography (a persistent sticky title bar, a parallax quote band, the marquee) is detailed in **Interaction & motion** below — it is structural/continuous, not entrance choreography (zero in-view reveals captured).

- **Density:** Low. Lots of air, one idea per band, short copy. Information arrives sequentially down a tall page rather than packed into a screen.

- **Hierarchy:** Dominant device is **scale + typeface** (big serif vs. small sans), reinforced by **canvas color change** between bands. Position (centered) and the lone saturated CTA do the rest.

- **Restraint:** No second accent color, no gradients on text, no shadows beyond soft/rare, no icon-heavy feature grids, no animation spectacle, no bespoke body font. The expressiveness is spent entirely on two moves — the scalloped seams and the aurora canvas — against an otherwise calm, system-font, single-column layout.

## Interaction & motion

Arc's motion is **structural, not entrance-y** — almost no reveal choreography; the page instead leans on one persistent pinned element, one subtle parallax, and a continuous press marquee. Evidence from the capture: **1 `@keyframes`** (named `scroll` — the marquee), `cssAnimationRules: 0`, **0 entrance reveals / no stagger**, 2 `IntersectionObserver`s over 57 targets (lazy-load/visibility, *not* fade-rise), 3 scroll-pin/parallax effects, **3 marquees**, **4 `<video>`** (the "screenshots" are autoplaying loops), 0 `<canvas>`, ~944 rAF calls (video + marquee + scroll math), 6 scroll listeners, 8 mousemove listeners, no GSAP/Lenis/Framer. **`prefers-reduced-motion` is NOT respected** (`prmRules: 0`) — the one real motion defect. Stack: `position: sticky/fixed` · CSS `@keyframes` (marquee) · `<video>` autoplay · IntersectionObserver (load-gating).

- **Persistent pinned title bar** — *Trigger:* scroll-progress. *Mechanism:* once you scroll past the hero, the display headline ("Meet Dia, the next evolution of Arc") + the "Try Dia" CTA dock into a `position: fixed` top bar that keeps its scalloped under-edge, and rides along for the entire rest of the page (visible pinned in frames s01→s10). *Reads as:* a sticky "chapter title / persistent ask" — the brand line and the conversion button are never off-screen. *Transfers to:* long single-pitch landing pages that want one claim + one CTA always present. *Safety:* **production-safe** (native sticky/fixed, compositor-cheap; just reserve top padding and keep it keyboard-reachable). → `sticky-pin-scrollytelling`.
- **Scroll-parallax quote band** — *Trigger:* scroll-progress. *Mechanism:* the blue testimonial band ("Arc is the Chrome replacement…", raw el "Rethinking the fundamentals of how we u…") has its `transform` translated at a rate offset from the scroll, so the band's content drifts relative to the cream sections above/below it (the lone `transform/parallax` effect captured). *Reads as:* the saturated band feels like a deeper layer, adding depth to an otherwise flat single-column stack. *Transfers to:* a single hero/quote band you want to feel set-back without a parallax image rig. *Safety:* **production-safe if subtle** — cap the translate, transform-only; heavy offsets cause motion-sickness and decouple from reading. → `parallax-drift`.
- **Press-quote marquee** — *Trigger:* load (continuous). *Mechanism:* a horizontal ticker of press blurbs ("Arc is the best browser…", "Arc is the new browser…", "Arc is a great new…") translates left forever via the `scroll` keyframe on a ~**78.6s** loop (3 marquee instances; visible on the blue band in s02). *Reads as:* social-proof momentum without spending vertical space. *Transfers to:* logo walls, press strips, testimonial ribbons. *Safety:* **production-safe ONLY if gated** — here it is the a11y miss: no `prefers-reduced-motion` pause and no captured hover-pause, so it's an unpausable auto-scroll. Ship the pause. → `announcement-ticker-marquee`.
- **Autoplay product-video mocks** — *Trigger:* in-view (IO load-gated). *Mechanism:* the "screenshots" anchoring each feature are actually 4 muted autoplaying `<video>` loops (not stills), lazy-mounted as they approach viewport (IO `rootMargin: 200px`). *Reads as:* the product is *demonstrated*, not pictured — the browser is shown in motion. *Transfers to:* any UI product where the value is interaction; loop a short silent screen-capture instead of a static shot. *Safety:* **spectacle-leaning / perf watch** — 4 concurrent videos is the page's heaviest cost (decode + the bulk of the 944 rAF). Lazy-mount (they do), pause off-screen, ship a poster/static fallback under reduced-motion. (No snippet — reuse the principle: in-context looped product video, gated + pausable.)
- **Magnetic-scale hover on nav + CTA** — *Trigger:* hover. *Mechanism:* nav items scale to `matrix3d(1.05…)` and tint to `rgba(23,3,148,0.5)`; the logo scales `1.1×`; the primary "Try Dia" only lightens its fill (`rgba(0,0,0,0.85)→0.65`) — all over 100–200ms `ease-out` (7 hover effects, 8 mousemove listeners hint at a slight cursor-follow). *Reads as:* tactile, playful chrome that matches the consumer-warm brand. *Transfers to:* nav/CTA on a brand-led consumer site. *Safety:* **production-safe** (transform/opacity only; gate any true cursor-follow to fine pointers). → `magnetic-cta`.

## Components

From the captured interaction states (`craft.states`, `craft.a11y`):

- **Nav link** — resting transparent bg; **hover** = scale `1.05×` + fill `rgba(23,3,148,0.5)` (translucent brand-deep); **focus-visible** = lighter fill `rgba(23,3,148,0.173)`. Hover and focus differ in *opacity of the same hue*, not a ring — legible on cream, but thin proof on the blue bands.
- **Primary CTA ("Try Dia" / "Download Arc")** — near-black fill `rgba(0,0,0,0.85)`; **hover** = fill lightens to `rgba(0,0,0,0.65)` (no transform); **focus-visible** = a real **`2px rgb(150,196,255)` (`#96c4ff`) outline** + soft shadow on the download button. The download CTA is the one element with a proper visible focus ring — adopt that everywhere.
- **Card (press-quote / feature)** — flat cream surface, blue serif text, a small source pill; no captured hover-lift (cards are static content, not interactive). Elevation when present is soft and rare: `0 5px 5px rgba(0,0,0,.10)` / `0 2px 8px rgba(0,0,0,.25)`.
- **Input** — no form inputs were exercised in the capture; no input states recorded (don't infer any).

## Grid / container

- **Container:** centered single column, max content width **~1100–1200px** (consistent with the static read).
- **Grid:** the re-probe measures the one real grid — the bento/masonry photo wall + the product showcase row (s02–s06) — as a **3-column** layout (`flex` band of 3), with a **~12px** gutter (16px secondary). Mixed row spans give it the masonry feel. Everything else is single-column stacked bands, not a grid. (container max-width still frame-estimated; columns + gutter now measured)

## A11y (honest, incl. defects)

- **Alt text:** `img_alt_ratio: 1` — **every** captured image carries alt (4/4). Strong.
- **Focus-visible:** **present** (`focus_visible: true`) — nav links get a focus fill and the download button gets a true `#96c4ff` outline ring; good, though most controls signal focus by background opacity only.
- **Reduced motion:** **NOT respected** (`reduced_motion: false`, `prmRules: 0`) — the marquee and parallax run regardless. This is the headline a11y/motion defect: ship a `prefers-reduced-motion: reduce` block that pauses the marquee and freezes the parallax/videos.
- **Tap targets:** **24 small/under-min interactive targets** flagged (of 57) — likely the dense footer/nav links; enlarge hit-areas toward 44px for touch.

## Production-safety note

- **Scalloped band edge (`mask` + tiling radial-gradient)** — *production-safe.* Decorative-only; reserve content padding below the bite line, mark it non-semantic, and provide an `@supports` straight-edge fallback. Zero added DOM, one gradient's paint cost.
- **Aurora mesh canvas (stacked radial-gradients)** — *production-safe* when static and edge-weighted; the one cost is contrast — keep blooms pale and the center light so dark text holds 4.5:1. The ambient-drift variant is *spectacle-leaning*: gate behind `prefers-reduced-motion` and keep it a 15–20s near-imperceptible loop, never a fast cycle.
- **Single-hue bg/accent collapse** — *production-safe*, but demands discipline on actionable contrast: differentiate CTAs by fill/inversion (solid white vs. translucent) since you can't lean on a second color; verify focus rings stay visible on the saturated band.
- **Press-quote marquee** — *production-safe* if it respects `prefers-reduced-motion` (pause) and is keyboard-pausable; otherwise mild a11y/motion cost.

## Extracted patterns

- `scalloped-band-edge` — repeating semicircle wave cut at full-bleed band transitions via CSS `mask`; reuse to give a long multi-section page a soft, recognizable, near-zero-cost seam.
- `aurora-mesh-canvas` — pale edge-weighted radial blooms over a warm base as a hero/brand backdrop; reuse for an owned, image-free canvas that still holds dark text.
- `sticky-pin-scrollytelling` — the display headline + CTA dock into a fixed top bar past the hero and ride the whole page; reuse to keep one claim + one ask always on screen. (motion)
- `parallax-drift` — the blue quote band's `transform` is offset from scroll so it reads as a deeper layer; reuse for subtle depth on a single hero/quote band. (motion)
- `announcement-ticker-marquee` — infinite horizontal press-quote scroll (~78.6s loop); reuse for press strips / logo walls — **but add the reduced-motion + hover pause Arc omits**. (motion)
- `magnetic-cta` — nav/CTA scale + tint toward the pointer on hover (transform/opacity, fine-pointer only); reuse for tactile chrome on a consumer brand site. (motion)
