---
slug: swiper
url: https://swiperjs.com
source: Reference
corpus: production
captured: 2026-06-24
award_type: Reference
score: null
tags: [open-source, library, developer-tool, dark, carousel, slider, interaction, frontend]
when_to_use: [product-marketing, landing, hero, feature-section, docs, navigation, footer, interactive-showcase]
directions: [minimalist, soft]
layout: [bento]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [oversized-display-headline, spotlight-quote-card, glow-framed-glass-panel, dark-bento-grid, outlined-app-icon-grid, announcement-ticker-marquee, scroll-reveal-in-view]
patterns_to_build: [drag-carousel, coverflow-3d-carousel]
tokens_snapshot: ../tokens/swiper.json
screenshots: ../screenshots/swiperjs-com/
---

> **Honest framing.** This is the marketing/home page of the **Swiper** open-source carousel library, captured as an *interaction reference*. Two things are distilled here and kept separate: (1) the **site's own** design language — a calm dark developer-tool page — which is what the capture actually shows; and (2) the **library's signature interaction** — the drag/swipe carousel Swiper exists to provide — which is the *reason to reference this entry* but which the home page itself mostly **does not run** at rest (the motion probe found `carousels: 0`, `draggable: 0`; the live demos live behind Playground/Docs routes). So: trust the frames for the look; treat the carousel section as the library's documented behavior, flagged as such, with a recipe to build (none exists in the corpus yet).

## What works (transferable principles)

- **Dark page, single chromatic accent, everything else monochrome.** The field is near-black; text is white at three opacities (`#fff` → 75% → 50%) and the *only* hue on the whole page is one sky-blue (`rgb(92,174,255)`), used 452× as the link/border/brand color and nothing else. Because the canvas is desaturated, that one blue carries 100% of the "this is interactive / this is the brand" signal — the logo, links, active borders, focus all read as one system. Transfers to any dark developer-tool or product page: pick *one* accent, drive every affordance from it, and let white-at-opacities do all the hierarchy instead of a second color.

- **Hierarchy from extreme scale contrast in one weight, not from boldness.** Body is 16px/400 (961 of 994 nodes are weight 400 — the page is essentially never bold); the H1 jumps to **96px** — a ~6× leap in a single move, with 24px subheads as the only middle step. The empty gap between 16/24 and 96 *is* the hierarchy. Reads as confident and quiet rather than shouty. Transfers anywhere you want a hero to dominate without a wall of bold weights: keep one weight, open a 4–6× scale gap, skip the in-between sizes.

- **Negative tracking applied only to display sizes.** Letter-spacing is `normal` everywhere except the two largest ramps, which tighten to `-1.2px` (48–56px) and `-1.4px`. Default tracking looks loose and amateur on big type; tightening *only* at display restores engineered density while UI text stays comfortable. Rule: gate a `tracking-tight` token to `2xl`+ and leave body alone.

- **One rounded radius language: a soft 24px on big surfaces, full-pill on chips.** Cards, panels and the hero quote all share a generous 24px radius (51×); interactive pills go fully round; only inputs/code drop to 12px. The consistent large radius is what makes a dark, information-dense page feel *soft* rather than severe — it's the personality, doing the work a gradient or illustration would in a brighter design. Transfers to any dark UI that risks reading as cold: commit to one generous corner radius across surfaces.

- **A floating, glassy pill nav instead of a full-width bar.** The header is a detached rounded capsule centered over the content (translucent dark fill, hairline `rgba(255,255,255,0.15)` border), not an edge-to-edge bar. It reads as lightweight and modern and lets the hero glow show through underneath. Transfers to dark landing pages where a solid nav bar would feel heavy. (Watch the a11y cost — see note.)

- **Borders and surfaces are white-at-low-opacity, not separate gray tokens.** Dividers, card edges and surface fills are all `rgba(255,255,255,0.05–0.15)` over black rather than hand-picked grays. One alpha ramp = automatically coherent elevation on a dark field, and it survives a theme flip. Transfers to any dark system: derive surfaces/borders from `fg` at fixed alphas instead of maintaining a parallel gray scale.

- **For an interaction library, show the interaction at scale, not a screenshot of it.** The proof section is a *wall of live demo thumbnails* (the "Proven. Trusted. Everywhere" tile grid) plus an ecosystem bento of real branded tools — the pitch is "here are thousands of these running," shown as density, not described. Transfers to any product whose value is a behavior: prove it with many small live instances, not one hero mockup.

## Design-system read

- **Type:** Inter, single family (mono only for code/kbd). One weight does almost all the work — **400 base**, with 500/600/700 appearing on <4% of nodes — so hierarchy is **scale, not weight**. Two-cluster ramp: a UI cluster (12/14/16/18/24px) and a display cluster (48/56/96px), the gap between them *is* the heading/body separation. Body 16px → H1 96px is ~6×. Leading is tight and proportional: 24px on body (1.5), down to ~52.8px on the 48px display (≈1.1). Tracking is `normal` for UI and tightens to `-1.2px`/`-1.4px` only at 48px+.
- **Color:** Dark, near-monochrome with one accent. `bg #000` (true black) / near-black sections; `fg #ffffff` with muted = white @75% and subtle = white @50%; a cool gray `rgb(150,159,175)` for placeholder/secondary UI text. The single accent is **sky-blue `rgb(92,174,255)`** — link, brand, active border, hover target, focus-adjacent — the only hue present. Surfaces/borders are `rgba(255,255,255,0.05/0.1/0.15)`. One brand gradient exists: `linear-gradient(to right, rgb(92,174,255) → #fff)` (the logo/wordmark sweep). Light mode is supported (`supportsDark: true`; the system inverts to a white bg), but the captured/default resting state is **dark** — distill it as a dark exemplar.
- **Spacing rhythm:** 4/8 base, tight and regular. Dominant component gap **16px** (54×), with 32px (12×) for section-internal grouping and 8px for chrome; 48/64px for large breaks. Padding clusters at **32px** block / 16–32px inline — section rhythm is moderate, not the 100–120px cathedral spacing of a marketing site; this reads as a docs-adjacent, utilitarian page.
- **Layout system:** centered max-width container; a **2- and 3-column** responsive grid (`gridCols: ["2","3"]`) for the feature-tile and ecosystem-bento sections, collapsing toward 1 column on mobile. Floating pill nav over the hero. Captured at 1440×900 desktop / 390 mobile.
- **Grid / container:** `craft.grid.columns = ["2","3"]` — the page is built on a simple 2↔3 column card grid (feature tiles at 3-up, ecosystem bento at 3-up, demo wall denser), not a fine 12-col system; whitespace and the 16px gap do the aligning.
- **Motion / easing intent:** the house transition is **`0.3s ease`** (248×) with `0.2s ease` (46×) for micro-states; a couple of nodes use `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard) and the digest also surfaces `cubic-bezier(0.2, 0.8, 0.2, 1)` (a decisive ease-out). Honestly: the dominant curve is **bare `ease`**, not a tuned bespoke easing — fine for a tool site, but a place this exemplar is *weaker* than Attio/Linear (whose `cubic-bezier(0.2,0,0,1)` is the house standard you'd actually copy). Motion overall communicates "responsive and quiet"; the real choreography (entrance reveals, the dual video marquee, and the library's drag carousel) is in **Interaction & motion**.
- **Density:** moderate-to-high in the proof/ecosystem sections (a dense wall of demo tiles; a 9-tile branded bento) but kept legible by the monochrome field, generous 24px radii, and consistent 16px gaps. The hero itself is spacious.
- **Hierarchy:** dominant ordering device is **scale** (the 6× body→H1 gap), reinforced by **color** (white vs the single blue accent) and **opacity** (white 100/75/50 for primary/secondary/tertiary text).
- **Restraint:** no second accent color, no bold-weight headings, no drop shadows at all (`elevation.shadows` is effectively `none` — depth is borders + glow, never shadow), no gradient text beyond the one brand sweep, no decorative illustration. The "modern" feel is achieved by subtraction plus one disciplined blue.
- **Components (from `craft.states`):**
  - **Buttons:** primary is a solid pill; secondary/ghost buttons sit on `rgba(255,255,255,0.05)` and hover to `0.15` (fill-darken/lighten on hover), border `rgba(255,255,255,0.15)`; focus shows a visible **2px** gray outline (`rgb(157–158)`). No disabled states were captured (`disabled: []`).
  - **Nav links:** white at rest, **recolor to the sky-blue accent on hover** (`#fff → rgb(92,174,255)` on Playground/Studio/star-count), with text-decoration underline on inline links. Focus = a thin **1px** dark outline (`rgb(16,16,16)`) — note this is *low-contrast on a dark bg* (a11y concern, below).
  - **Search ("⌘K") control:** a chip that shifts bg to `rgba(255,255,255,0.1)` and text from gray `rgb(150,159,175)` → near-black on hover/focus — a standard command-palette affordance.
  - **Cards (feature tile / ecosystem bento):** dark surface, hairline border, generous 24px radius, brand-colored app-icon tile + title + 75%-opacity description; the *active* feature card lifts with a **sky-blue glow** rather than a shadow (seen in the frames).
  - **Inputs:** dark fill, hairline border, 12px radius (the embedded Substack subscribe field follows the same language).

## Interaction & motion

Honest baseline first: the home page is **mostly static at rest**. The motion probe found **9 `@keyframes`, 6 CSS-animation rules, 1 IntersectionObserver over 91 targets (`rootMargin: 200px`), 2 scroll listeners, 8 mousemove listeners, 0 rAF, 0 detected libraries, and `prefers-reduced-motion` respected (6 PRM blocks)**. The two reported `scroll_effects` (a `position` pin on the Substack widget and a `transform` on `div.relative`) both have **`from == to`** and are **dropped as noise** — the frames show no real pin or parallax. So the site's *own* motion is entrance reveals + a video marquee; the *library's* signature motion (drag carousel) is documented behavior shown via demos, not running on the home hero.

- **In-view fade-rise reveal** — *Trigger:* in-view (1 IntersectionObserver, 91 targets, `rootMargin: 200px` so it fires comfortably before entry). *Mechanism:* a class flip on intersect drives the `fade-in` / `fadeIn` / `fadeInUp` / `reveal` keyframes — opacity + a small `translateY`, fired once. *Reads as:* the page settles in section by section as you scroll. *Transfers to:* any tall page that needs entrance rhythm. *Safety:* **production-safe** — GPU-cheap (opacity/transform), one-shot, reduced-motion respected. → `scroll-reveal-in-view`.
- **Dual-direction demo marquee** — *Trigger:* load/continuous (CSS animation, no JS rAF). *Mechanism:* the "Proven. Trusted. Everywhere" proof wall runs two rows of demo thumbnails translating in **opposite directions** — keyframes are literally named `home-videos-row-top` and `home-videos-row-bottom`. *Reads as:* "thousands of these are running right now" — proof-by-density. *Transfers to:* logo/demo/social-proof strips where motion implies scale. *Safety:* **production-safe** if it pauses on hover/focus and is gated under reduced-motion; perf-watch since the row is real demo media (10 `<video>` on the page) — lazy-load and cap concurrent playback. → `announcement-ticker-marquee` (same translate-loop mechanism; here the payload is demo tiles, not text).
- **Page-top background reveal** — *Trigger:* load. *Mechanism:* keyframe `page-top-bg-reveal` fades/wipes in the hero's blue-purple radial glow behind the headline on first paint. *Reads as:* a quiet "lights up" moment that frames the logo without a hero illustration. *Transfers to:* dark heroes that want depth from light, not imagery. *Safety:* **production-safe** (opacity on a background layer; trivially reduced-motion-safe by shipping the lit state).
- **Hover recolor / fill states** — *Trigger:* hover (11 hover deltas captured). *Mechanism:* nav links recolor white→sky-blue; ghost buttons darken/lighten their `rgba(255,255,255,…)` fill and drop opacity to 0.9; the ⌘K chip swaps bg + text color; inline links underline — all over `0.2–0.3s ease`. *Reads as:* responsive, consistent, single-accent feedback. *Transfers to:* all interactive chrome on a dark single-accent system. *Safety:* **production-safe**.
- **Loader / spinner micro-motion** — *Trigger:* async (demo/preview load). *Mechanism:* `demo-preloader-spin` and `cladd-spinner-rotate` keyframes rotate a spinner while playground/demo previews load. *Reads as:* the interactive demos are doing work. *Transfers to:* any embedded-demo or code-sandbox tile. *Safety:* **production-safe** (transform rotation; pure decoration, safe to freeze under reduced-motion).
- **Drag / swipe carousel — the library's signature (documented, not on the home hero)** — *Trigger:* drag / swipe / pointer (and autoplay/keyboard as configured). *Mechanism:* pointer-down captures `clientX`, pointer-move translates the track 1:1 with the drag (the 8 mousemove listeners are consistent with this on demo surfaces), pointer-up snaps to the nearest slide with momentum/inertia and an eased settle; touch-action and passive listeners keep it smooth on mobile; variants add free-mode, looping, and a 3-D *coverflow* transform. *Reads as:* native, hardware-accelerated, "you're physically moving the content." *Transfers to:* image galleries, onboarding steps, mobile feature tours, product shot sliders — the canonical reason to reach for this library. *Safety:* **production-safe** with care — it's GPU-transform-based, but you must: keep slides reachable by keyboard + provide visible prev/next controls (drag alone is not accessible), preserve vertical page scroll (`touch-action: pan-y`), and **disable autoplay / inertia under `prefers-reduced-motion`** (motion-sickness + a moving target are real costs). The 3-D coverflow variant is **spectacle-leaning** — striking but heavier and disorienting; reserve for brand moments. *No corpus recipe exists yet* → see `patterns_to_build` (`drag-carousel`, `coverflow-3d-carousel`).

**Reduced motion:** respected (6 `prefers-reduced-motion` blocks). Any reuse of the marquee or the carousel must keep that — ship the resting state in the DOM and freeze loops/inertia.

## Production-safety note

A shipping open-source project page; most of it is **production-safe**, with a few honest defects to fix on reuse:

- **One sky-blue accent on near-black** — verify contrast. `rgb(92,174,255)` on `#000` is fine for large/UI text, but as the *only* affordance signal it leans on hue: keep underline/shape cues on links so interactivity isn't color-only.
- **Floating glassy pill nav** — **production-safe but accessibility-watch**: translucent fill over a busy hero glow can drop nav-label contrast below 4.5:1 depending on what scrolls behind; pin a solid/blur backdrop and test contrast against the worst-case background.
- **Focus outlines are inconsistent and partly too faint** — captured focus rings range from a **1px `rgb(16,16,16)`** (near-invisible on a black bg — a real defect) to **2px ~`rgb(158,158,158)`**. On reuse, standardize a single high-contrast `focus-visible` ring (≥2px, light on dark) for every interactive element.
- **272 of 334 interactive elements are below a 44px tap target** (`small_tap_targets: 272`) — a genuine mobile a11y defect (dense link footer + compact nav chips). On reuse, enforce ≥44×44px hit areas.
- **Dual video marquee + 10 `<video>`** — perf-watch: lazy-load, pause off-screen, cap concurrent playback, pause-on-hover, gate under reduced-motion.
- **Drag carousel** — **production-safe only if** keyboard + visible prev/next controls exist, vertical scroll is preserved (`touch-action: pan-y`), and autoplay/inertia are disabled under reduced-motion. The **coverflow 3-D** variant is **spectacle-only**.
- **Bare `ease` everywhere** — not unsafe, just unrefined; prefer a tuned `cubic-bezier(0.2,0,0,1)`-style curve when porting.
- **Strengths to keep:** `img_alt_ratio: 0.99` (near-complete alt text — excellent), `focus_visible: true`, and reduced-motion respected.

## Extracted patterns

- **oversized-display-headline** — a single-weight headline blown up to ~6× body (here 96px) with display-only negative tracking; reuse for dark heroes that should dominate by scale, not bold weight. (existing)
- **spotlight-quote-card** — the hairline-bordered, large-radius glassy quote panel with oversized quotation marks framing the elevator pitch; reuse for testimonial/positioning blocks on a dark field. (existing)
- **glow-framed-glass-panel** — translucent dark panel with a hairline border and an accent glow instead of a drop shadow (the active feature card / hero frame); reuse for elevation-without-shadow on dark UI. (existing)
- **dark-bento-grid** — the 2↔3 column dark card bento (ecosystem tools) with icon + title + muted description; reuse for integrations/ecosystem/feature sections on dark. (existing)
- **outlined-app-icon-grid** — the grid of branded square app-icon tiles (JS/React/Vue/… and the ecosystem logos); reuse for "works with / built on" technology rows. (existing)
- **announcement-ticker-marquee** — the opposite-direction translate-loop (here the `home-videos-row-top/bottom` demo wall); reuse for proof/logo strips where motion implies scale; pause on hover/focus, gate under reduced-motion. (existing, motion)
- **scroll-reveal-in-view** — IntersectionObserver-gated fade+rise firing once (the page's `fadeIn`/`reveal` keyframes); reuse to give a long page entrance rhythm. (existing, motion)

### patterns_to_build (no recipe exists yet — do NOT cite as `patterns:` until written)
- **drag-carousel** — framework-neutral pointer/touch drag-to-scroll slider: capture pointer X, translate the track 1:1, snap to nearest slide on release with eased inertia; **must** ship keyboard nav + visible prev/next controls, `touch-action: pan-y`, and a reduced-motion fallback that disables autoplay/inertia. This is Swiper's signature interaction and the corpus currently has **no** carousel/drag recipe — highest-value pattern to author from this entry.
- **coverflow-3d-carousel** — the spectacle variant: slides rotate/translate in 3-D (perspective + rotateY) around a centered active slide; **spectacle-only**, reserve for brand moments, same a11y guards plus a flat fallback under reduced-motion.
