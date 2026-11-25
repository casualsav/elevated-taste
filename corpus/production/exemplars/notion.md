---
slug: notion
url: https://www.notion.com
source: Reference
corpus: production
surface: site
captured: 2026-06-24
award_type: "Reference"
score: null
tags: [saas, productivity, ai, b2b, collaboration, light, warm-neutral, enterprise]
when_to_use: [product-marketing, landing, hero, feature-section, navigation, footer, interactive-showcase]
directions: [minimalist, soft, editorial]
layout: [center-stack, bento]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [scroll-linked-recolor, scroll-progress-rotate, sticky-pin-scrollytelling, announcement-ticker-marquee, tabbed-product-showcase, embedded-product-frame, product-ui-on-tinted-panel, mixed-serif-sans-display]
patterns_to_build: [hero-flicker-on]
tokens_snapshot: ../tokens/notion.json
screenshots: ../screenshots/notion-com/
---

## What works (transferable principles)

- **Keep the base text weight at regular 400 and build hierarchy from scale + warm color, not weight.** 1181 nodes are 400; 500 is the emphasis step and 700 is rare (40 nodes, reserved for the largest display/quote). This is the *opposite* of the "raise the floor to 500" move (cf. Attio) and works here because Notion leans on a huge display ramp and warm-gray de-emphasis instead. The lesson is the meta-rule, not the number: *pick one weight as your floor and make scale do the hierarchy* — raising the floor is right on a thin white field, but a generous display scale lets you stay at 400 and read as calm/document-like (apt for a writing tool). Transfers to any content-first product where the marketing page should feel like the canvas.

- **Use a warm-neutral gray axis, not the default cool gray.** The muted/subtle grays are `#615d59` and `#a39e98` — their oklch hue sits on the warm/yellow axis (~80-106°), and surfaces are warm off-whites (`#f6f5f4`, `#f7f7f5`), not blue-tinted `#f6f7f8`. The whole page reads a few degrees warmer than a typical SaaS site, which feels paper-like and human rather than clinical. Transfers anywhere you want "approachable software" instead of "enterprise dashboard": shift your neutral ramp warm and the personality changes with zero added color.

- **Negative tracking scaled to size keeps the oversized display optically tight.** h1 is 64px with `line-height: 64px` (a 1.0 leading) and `-2.125px` tracking; 54px → `-1.875px`, 26px → `-0.625px`, 22px → `-0.25px`, while small UI text goes the other way to `+0.125px`. At 64px, default spacing looks gappy and amateur; tightening as size grows (and setting leading to exactly 1.0 on the hero) restores engineered density. Transfers to any oversized-headline hero: apply a `tracking-tight` token only at display sizes and pull leading toward 1.0.

- **Starve the marketing palette so the embedded product UI supplies all the color.** The page itself is near-monochrome warm (white → warm off-white → soft-black `#0d0d0d`, indigo `#2537b1` only on links). Every saturated hue — teal `#2a9d99`, blues, peach/cream database cards, the launch-tracker rainbow — lives *inside* the rounded product captures. Because the field is desaturated, the screenshots read as live, colorful software against a quiet frame. Transfers to any product whose UI is itself colorful: let the captures carry the chroma and keep the chrome neutral.

- **Carry a long page with a literal product narrative, not abstract illustration.** Each section embeds a true-to-life Notion surface (a "Ramp HQ" workspace, an Office Q&A database, a Launch tracker, a Company HQ home, a Design System page) in a large-radius (`20px`) card on a warm tinted panel. The interface *is* the pitch; the visitor sees exactly what they'd build. Transfers to any tool where seeing the real UI sells better than a diagram — frame genuine captures on tinted panels rather than drawing metaphors.

- **A persistent dark CTA panel closes the page as a hard punctuation mark.** The footer/CTA sits on navy `#02093a` — the only large dark surface on an otherwise all-white page — so "Try for free." and the footer read as a deliberate full stop after a tall warm scroll. Transfers to any long marketing page that needs an unmistakable end-of-story conversion zone: invert one block instead of adding a colored band mid-page.

## Design-system read

- **Type:** `NotionInter` (a customized Inter) + `system-ui`, with a system serif for oversized pull-quotes only. Two-cluster scale — UI ramp 12/14/16/20/24px + display ramp 40/48/54/64px — with the empty middle as hierarchy (body 16 → display 64 is a 4× jump). Weights: **400 (base)**, 450/550/650 (variable-font intermediates), 500 (emphasis), 700 (rare, largest sizes only). Leading runs tight up top (64/64 = 1.0, 54/56 ≈ 1.04) and opens to 1.5 on body (16/24). Tracking tightens with size (64px → -2.125px … 22px → -0.25px) and inverts to +0.125px on small UI text. Fluid type confirmed (`fluid_type: true`).
- **Color:** Warm light monochrome. `bg #ffffff` → `surface #f6f5f4` / `#f7f7f5` → `fg #0d0d0d` (normalized from the two dominant tokens `rgba(0,0,0,0.898)` and `rgba(0,0,0,0.95)`) → `muted #615d59` → `subtle #a39e98` (both **warm** grays). Hairline border `#eae8e5`. The action color is the **soft-black fg**, not an accent; indigo `#2537b1` is the link color and brighter blue `#0075de` is the focus ring. Saturated color (teal `#2a9d99`, blues, peach/cream tints) appears only inside product captures; one inverted navy surface `#02093a` carries the closing CTA + footer.
- **Spacing rhythm:** 8px base — `gap: 8px` dominates (127×), `padding-inline: 8px` (110×); component steps 4/6/8/12/16/24, section rhythm jumps to 64/80/120px. Whitespace and warm tinted panels do the separating; almost no hard divider lines.
- **Layout system:** centered max-width container; repeating blocks of heading + muted description + a full-width rounded product capture, plus 1–4-column bento grids. Card radii cluster at 12 and 20px (large, friendly). Captured at 1440×900.
- **Components (from `craft.states` + frames):**
  - **Button:** primary = soft-black `#0d0d0d` fill, white text, ~8px radius ("Get Notion free"); secondary = white fill with hairline border ("Download", "Request a demo"). Nav buttons are ghost (transparent → `rgba(0,0,0,0.05)` tint on hover). Focus ring `2px rgb(0,117,222)`.
  - **Card:** warm-off-white or white surface, 12–20px radius, layered whisper micro-shadow (multi-stop, alpha ≤ 0.03) — elevation by hairline-over-shadow, never a heavy drop. Product captures sit in 20px-radius cards on tinted panels.
  - **Nav:** sticky top bar, 37 links across dropdown menus; text is light `#f6f5f4` over the dark hero and **recolors to soft-black** once the hero scrolls away (see motion). Collapses to a hamburger on mobile (32 links, `likely_hamburger: true`).
  - **Input:** no standalone form inputs surfaced in the capture (marketing page); search/comment fields appear only inside embedded product mockups, so input styling is frame-estimated, not authoritative — **flag: thin data.**
- **Grid / container:** explicit 1/2/3/4-column tracks on desktop inside a centered **~1250px** content container (~105px side margins on the 1440 frame), with bento gutters of **~16–24px**; hero copy sits in a narrower centered text column (~825–890px). Collapses to a single column on mobile (the last bento cell spans wide — `mobile cols [1,2,3,15]`). h1 downscales 64 → 42px on mobile; body stays 16px.
- **Motion / easing intent:** house transition is `0.2s cubic-bezier(0.42,0,1,1)` (132×) — notably an **ease-IN** (slow start, fast finish), paired with `0.15s ease` for quick state flips and `0.2s cubic-bezier(0.645,0.045,0.355,1)` (easeInOutCubic) for larger moves; a `steps(7)` curve drives the hero "flicker-on." Durations cluster at 150/200ms micro, 300/600/1000ms for reveals. The micro-motion reads as crisp and slightly mechanical (fitting the "agents doing work" theme); full choreography is in **Interaction & motion**.
- **Density:** medium — generous whitespace around dense embedded product shots, kept legible because the surrounding chrome is sparse, warm, and high-contrast.
- **Hierarchy:** dominant ordering device is **scale** (the two-cluster gap, amplified to 4× at the hero), reinforced by **warm-gray de-emphasis** (soft-black → `#615d59` → `#a39e98`) rather than weight.
- **Restraint:** no gradient text, no saturated brand color on the primary CTA (soft-black instead), no heavy shadows, no divider bands, no cool-gray clinical palette. The friendly-but-serious feel comes from a warm neutral ramp + a regular-weight floor + a single dark closing panel.

## Interaction & motion

Notion's motion is **functional and theme-driven, not spectacle** — almost everything is in-view or scroll-progress, hand-rolled (no GSAP/Lenis/Framer globals). Evidence: 39 `@keyframes`, **35 IntersectionObservers over 699 targets**, 572 `requestAnimationFrame` calls per scroll pass, 5 scroll + 10 mousemove listeners, **0 `<canvas>`, 0 cursor-followers, 0 generic entrance reveals**; interactive catalog = 10 tabs, 6 disclosures, 24 marquee tracks, 1 carousel, 4 videos. **Reduced motion is respected** (14 `prefers-reduced-motion` rules). Stack: `IntersectionObserver` · CSS `@keyframes` · CSS transitions · rAF.

- **Nav hero-exit recolor + sticky background-fill** — *Trigger:* scroll-progress (leaving the hero). *Mechanism:* the sticky nav fills from transparent to white (`background-shift` to `rgb(255,255,255)`) while all 11 nav links crossfade `color` from light `#f6f5f4` to soft-black `rgba(0,0,0,0.898)`; keyframes `globalNavigation_navBgScrolled`, `logoFillHeroExit`, `navTokensHeroExit`. Frames confirm it: s00 = white nav text on the dark hero, s04+ = dark nav text on a white bar. *Reads as:* the chrome "lands" on the page once you leave the hero; one nav serves a dark hero and a light body. *Transfers to:* any site with a dark hero above a light page. *Safety:* **production-safe** (color/opacity only, GPU-cheap; ensure contrast holds in both states). → `scroll-linked-recolor`, `sticky-pin-scrollytelling`.

- **Agent-badge & conveyor-gear rotate jitter** — *Trigger:* in-view. *Mechanism:* small floating agent marks, task chips and "graphic" sprites get low-angle `transform: rotate` deltas (±2–15°), and literal conveyor-belt gears rotate ±34.7° (`Illustrations_leftConveyorGear` / `rightConveyorGear`); keyframes `Agent_agentScroll`, `agentMarkScroll`, `Illustrations_rotate/rotateEnter`. In s00/s02 these are the orbiting app icons and the "night shift" conveyor metaphor. *Reads as:* the workspace is alive and "running a shift." *Transfers to:* decorative hero ornaments / "machine at work" illustrations. *Safety:* **production-safe** with care — compositor-only transforms, but 17 simultaneous tracks + 572 rAF/scroll is the heaviest thing here; cap angles, gate on in-view, pause off-screen. → `scroll-progress-rotate`.

- **Logo-wall reveal sticky bar + stats parallax** — *Trigger:* scroll-progress. *Mechanism:* the customer logo wall (OpenAI / Figma / Ramp / Vercel / Cursor / L'Oréal in s00) pins/reveals a sticky bar (`homepageLogoWall_revealStickyBar`, `snackBar` fixed pin) and the proof-stats row ("Over 100M users… #1 enterprise search… 62% of Fortune 100", s04) drifts on a `transform/parallax`. *Reads as:* social proof that arrives with a little momentum, then sticks. *Transfers to:* logo rows, stat bars, persistent promo/CTA snackbars. *Safety:* **production-safe** (transform/position; subtle parallax only — keep the drift small to avoid motion-sickness). → `sticky-pin-scrollytelling`, `announcement-ticker-marquee`.

- **Tabbed agent showcase with active-tab recolor** — *Trigger:* tab/click. *Mechanism:* a vertical list of agent types (Q&A / Task routing / Reporting / Create your own, s02) swaps the demo panel; the active row's `color` resolves toward `rgba(0,0,0,0.95)` while the inactive dims to `rgba(0,0,0,0.54)` (10 tab groups detected). *Reads as:* one frame, many proofs, user-driven. *Transfers to:* multi-feature heroes instead of stacked screenshots. *Safety:* **production-safe** (color/opacity swap; keep tabs keyboard-operable). → `tabbed-product-showcase`.

- **Hero "flicker-on"** — *Trigger:* load. *Mechanism:* the hero agent badges power on like a neon sign via `opacity` keyframes `HomepageHeroAgents_flicker-on` / `flicker` / `fade-in` on a `steps(7)` easing (the only stepped curve on the page). The generic-entrance probe is 0, so this is the *one* deliberate load-time animation, scoped to the hero. *Reads as:* "the night shift just switched on" — reinforces the headline. *Transfers to:* a single signature hero entrance; do not generalize to the whole page. *Safety:* **production-safe** (opacity steps, one-shot) — but `steps()` flicker can read as a glitch; keep it brief and gate under reduced-motion. → **patterns_to_build: `hero-flicker-on`** (no file yet).

- **Hover micro-states** — *Trigger:* hover. *Mechanism:* nav items shift `background` transparent → `rgba(0,0,0,0.05)` (and the inverse over the dark hero) on the `0.15s/0.2s` house curves. *Reads as:* responsive, rendered-with-intent chrome. *Transfers to:* all interactive chrome. *Safety:* **production-safe**.

## Production-safety note

This is a shipping B2B product site; techniques are **production-safe**, with two caveats:
- Nav hero-exit recolor — **production-safe**; verify text clears contrast in *both* the on-hero (light text) and scrolled (dark text) states, since the same links live on two backgrounds.
- Agent/gear rotate jitter — **production-safe but the perf watch**: 17 in-view rotate tracks + 572 rAF/scroll is the heaviest budget item; cap angles, lazy-init on in-view, pause off-screen, and it's already reduced-motion-gated — keep that.
- Hero flicker-on (`steps(7)`) — **production-safe** but can read as a glitch / risk for photosensitivity; keep it short, single-shot, reduced-motion off.
- Soft-black primary CTA (no saturated hue) — **production-safe**; ensure a non-color affordance (clear filled button shape) since the action isn't signaled by color.
- Warm subtle gray `#a39e98` on white ≈ borderline contrast — keep it ≥ body size or darken to `#615d59` for small text to hold 4.5:1.
- Full-fidelity product captures (70 images) — **payload/perf watch**: ship responsive `srcset`/AVIF and lazy-load below the fold on a tall page.
- **A11y defect:** `img_alt_ratio` is 1.0 (all images alt'd) and `focus_visible` + reduced-motion are honored — good — **but 87 of 163 interactive elements fall below the 44px tap-target minimum.** Enlarge touch targets (especially the dense nav and in-mockup controls) before reusing this density on touch.

## Extracted patterns

- **scroll-linked-recolor** — sticky nav fills to white and its links crossfade light→dark as the hero scrolls away; reuse for any single nav that must serve a dark hero above a light body. (motion)
- **scroll-progress-rotate** — low-angle in-view rotation on decorative sprites/gears bound to scroll; reuse for "machine at work" hero ornaments, capped and gated. (motion)
- **sticky-pin-scrollytelling** — pinned logo-wall / promo snackbar that reveals and sticks on scroll-progress; reuse for persistent proof bars or CTAs. (motion)
- **announcement-ticker-marquee** — infinite horizontal logo/feature tickers (24 marquee tracks); reuse for logo walls and looping feature lists that pause on hover. (motion)
- **tabbed-product-showcase** — one framed product panel swapped by a tab list with active-row recolor; reuse for multi-feature heroes instead of stacked screenshots. (motion)
- **embedded-product-frame** — true-to-life product capture in a large-radius hairline/whisper-shadow card; reuse when the real UI sells better than a diagram.
- **product-ui-on-tinted-panel** — product capture set on a warm tinted background panel; reuse to give a screenshot a calm, branded surround without heavy elevation.
- **mixed-serif-sans-display** — oversized serif pull-quotes interleaved with a sans body/UI; reuse to add editorial warmth to a product page without switching the whole type system.
