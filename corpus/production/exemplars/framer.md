---
slug: framer
url: https://framer.com
source: refresh
corpus: production
captured: 2026-09-05
award_type: null
score: null
tags: [saas, ai, design-tool, dark, product-marketing, b2b, bento]
when_to_use: [landing, product-marketing, feature-section, hero]
directions: [minimalist]
layout: [bento, split-hero]
a11y: [reduced-motion-ignored]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [sticky-companion-panel, dark-capability-bento]
tokens_snapshot: ../tokens/framer.json
screenshots: ../screenshots/framer/
---

## What works (transferable principles)
- **Near-black canvas as the neutral, product UI as the color.** The page ships one flat near-black surface (#050505) and near-zero decorative color; every hue on screen comes from the embedded product mockups (photography in the CMS rows, the electric-indigo hero frame, the blue analytics bar). The chrome recedes so the product does the talking — reusable anywhere the artifact you're selling is itself visual.
- **Restrained display scale, not oversized hero.** The largest type is ~44–54px, left-aligned, single weight family (Inter). Hierarchy is carried by *position and whitespace* plus tight negative tracking on the big text (−0.6 to −2.2px), not by a giant 120px headline. Reads confident and dense rather than shouty — transfers to any information-rich SaaS landing.
- **A capability is proven by a live-looking UI tile, never an icon.** Each platform claim (CMS, SEO, Hosting, Analytics, Localization) is a miniature, functional-looking product panel with real rows, toggles, and numbers — one-line label + arrow underneath. Concrete beats abstract; avoids the three-generic-feature-cards template.
- **Hairline dark surfaces build depth without shadow.** Panels are separated by 1px `rgba(255,255,255,0.06–0.1)` borders and half-steps of near-black (#111 → #171717 → #1e1e1e → #242424), not drop shadows. Depth reads as layered glass in low light — a clean recipe for dark dashboards and dense grids.
- **Monochrome logo wall + arrow-only CTAs keep one accent budget.** Customer logos are flattened to a single grey; inline CTAs are text + `→` with an opacity-dim hover, reserving saturated blue for the one primary "Sign up". Spending accent sparingly is why the page feels calm at high density.

## Design-system read
- **Type:** Inter / Inter Variable throughout, Input Mono for code/branch labels, occasional GT Walsheim for display. Modest scale — body 14–18px, section headings 24–36px, display 44–54px (~3–4× range, not the usual 6×). Hierarchy from weight (400/500 dominant; 600/700 rare) + tight tracking on large sizes.
- **Color:** dark-native (no light theme). bg #050505; elevated surfaces #111/#171717/#1e1e1e/#242424; fg #fff, muted #999 / `rgba(255,255,255,0.6)`, faint 0.4. Accents used sparingly: electric indigo #0000EE (hero frame glow), bright blue #0099FF (primary button / links), success green #00BB88 (status "Live"), terracotta #D67A5C (imagery/tags). Hairlines `rgba(255,255,255,0.06–0.1)`.
- **Spacing rhythm:** 5px increment (5/10/15/20/25/40 gaps) with large 100–120px section padding — dense inside components, generous between sections.
- **Layout system:** 1200px content container; hero is a left-aligned single-column stack; feature section is a split of scrolling copy blocks + a sticky right rail; "full platform" is a mixed-size bento; galleries are marquee/grid rows.
- **Layering / page architecture:** sticky pinned top nav over a single flat near-black scroll. The signature depth move is a **sticky companion panel** — an AI-chat card that pins to the right viewport edge and stays put while a column of feature blocks scrolls past it. Otherwise no parallax backdrop; depth is per-tile via hairlines and surface half-steps.
- **Motion / easing intent:** quiet, utilitarian. Sections fade-rise into view (opacity 0.2→1 + small translate) gated by IntersectionObserver (81 observers); a fan of image cards scales/parallaxes slightly on scroll; logo/gallery marquees loop. Base duration ~750ms, `ease`. Communicates "alive product," not spectacle.
- **Density:** high — many UI panels, rows, stats — kept legible by the monochrome base, hairline separation, and one accent.
- **Hierarchy:** dominant device is **position + scale**, with color as a rare emphasis.
- **Restraint:** no gradient hero-wash, no oversized headline, no drop-shadow stacks, no multi-color palette; decoration is delegated to the embedded product imagery.

## Interaction & motion
- **In-view fade-rise reveal** — *Trigger:* in-view. *Mechanism:* section wrappers start at opacity ~0.2 and small offset, transition to opacity 1 / 0 offset when an IntersectionObserver fires (thresholds 0/0.1). *Reads as:* content settling in as you arrive. *Transfers to:* any long scrolling marketing page. *Safety:* **production-safe** (transform/opacity only) — but here reduced-motion is **not** respected; gate it.
- **Sticky companion panel** — *Trigger:* scroll-progress. *Mechanism:* a right-rail card is `position: sticky` inside a tall section so it stays pinned while the left column of feature blocks scrolls through. *Reads as:* one assistant accompanying several steps. *Transfers to:* feature walkthroughs, docs with a live demo, comparison rails. *Safety:* **production-safe** (native sticky, no JS scroll handler needed). See `patterns/sticky-companion-panel.md`.
- **Scroll-progress card fan (image wheel)** — *Trigger:* scroll-progress / in-view. *Mechanism:* a cluster of tilted image cards each get a small scale (≈0.54→0.57) and translate as they enter view. *Reads as:* a deck of work fanning open. *Transfers to:* portfolio / gallery intros. *Safety:* **production-safe** if limited to transform; keep deltas small.
- **Logo & gallery marquee** — *Trigger:* load (continuous). *Mechanism:* horizontally looping strips (21 marquee instances) for customer logos and shipped-site cards. *Reads as:* momentum/scale. *Transfers to:* social-proof strips. *Safety:* **production-safe**; pause on `prefers-reduced-motion` and on hover.
- **Opacity-dim hover on text CTAs** — *Trigger:* hover. *Mechanism:* text+arrow links drop to ~0.6 opacity; ghost nav links brighten 0.6→1. *Reads as:* light-touch affordance. *Safety:* **production-safe**.

## Production-safety note
All motion here is transform/opacity/opacity-dim and native sticky — production-safe. The one real cost: the raw profile reports `respectsReducedMotion: false` (reduced-motion-ignored) and a very high rAF count — when you reuse these, **wrap every reveal/marquee in `@media (prefers-reduced-motion: reduce)`** to jump to the end state, which the source fails to do.

## Extracted patterns
- `sticky-companion-panel` — a pinned right-rail card that accompanies a scrolling column of feature blocks; reuse for guided feature walkthroughs.
- `dark-capability-bento` — mixed-size grid of dark, hairline-bordered product-UI tiles each ending in a label + arrow; reuse for "full platform" capability sections.
