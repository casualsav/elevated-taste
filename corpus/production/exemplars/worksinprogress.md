---
slug: worksinprogress
url: https://worksinprogress.co
source: manual-pick
corpus: production
surface: site
captured: 2026-06-30
award_type: Manual (editorial/long-form)
score: null
tags: [editorial, publication, magazine, long-form, reading, serif, light, print-inspired]
when_to_use: [editorial, blog, navigation, footer, hero, feature-section]
directions: [editorial, minimalist]
layout: [editorial-columns, content-grid]
a11y: [reduced-motion-respected]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [ruled-article-card-grid, color-band-illustration-feature]
tokens_snapshot: ../tokens/worksinprogress.json
screenshots: ../screenshots/worksinprogress/
---

## What works (transferable principles)
- **Mono + serif as the entire hierarchy engine.** A grotesque *monospace* (GT America Mono) carries every functional string — nav, bylines ("Words by …"), tags, deks, dates — while a *serif* (Editor) carries every editorial string — headlines, the dek lead, section titles. Reader instantly sorts "chrome vs. content" by typeface alone, with almost no size or weight escalation. Transfers to any publication/docs/blog that wants voice without a six-step type scale.
- **Hairline rules do the work of boxes and shadows.** The page is built from 1px near-black borders: ruled dividers under each headline, framed cards, bordered tag "chips", framed CTA panels. One device (a hairline) replaces card shadows, fills, and dividers — giving a print/archive feel that stays crisp at any zoom and costs nothing to render. Reusable anywhere you'd reach for `box-shadow` to separate cards.
- **Color lives in full-bleed editorial panels, not in the UI.** The chrome is monochrome (cream ground, near-black ink); saturated color (indigo, red, yellow, mint, lavender) appears only as full-width section grounds behind commissioned illustrations and as caption bands. Because the interface itself never competes, each colored band reads as a distinct "spread" and pacing comes from color rhythm, not whitespace alone. Transfers to magazine/portfolio layouts that need variety without a noisy shell.
- **A warm off-white ground, never pure white.** The background is a blush cream (#FFF7F4) and the ink is #141414, not #000 on #FFF. The lowered contrast reads as paper and lets the bold illustration colors pop harder. Reusable as a default "editorial" surface pairing.
- **Context-aware sticky subnav.** A thin second bar under the masthead stays pinned and relabels itself to the section you're scrolled into ("Issues ▾", "Notes ▾ | October 2025", "Issue 08 ▾ | July 2022"). It doubles as breadcrumb + jump menu without adding chrome. Transfers to any long single-page index or scrollytelling archive.
- **Square by default, restraint as the look.** Almost everything is unrounded; radius appears only on incidental controls. Combined with the hairline system, the squared geometry is what signals "serious publication" rather than "consumer app".

## Design-system read
- **Type:** Two families, not a scale. Editor (serif) for display/headline/dek; GT America Mono (Light + Bold) for all UI/metadata. Sizes cluster at 12 (labels/tags), 14, 16 (body/dek), 20, 24, 28, and 48 (h1). Range is shallow (~3× body→display) because *typeface contrast*, not size, creates rank. H1 48px/1.3 desktop → 24px mobile. Mono set at ~1.25 leading reads as captions; serif body at 1.5.
- **Color:** Monochrome shell — bg cream `#FFF7F4`, ink `#141414`/`#121212`, hairlines same ink, muted gray `#D6D6D6`. A fixed editorial accent set used only as section grounds/bands: indigo `#363B8F`, red `#E20A39`, yellow `#F4D06F`, mint `#CEE0DC`, pink `#F8E6EA`, lavender `#D8D9F1`, deep green `#073429`. Primary action = solid black button (Subscribe) / yellow fill (Sign up). No gradients in the UI; semantic color is absent — the palette is editorial, not status-driven.
- **Spacing rhythm:** Base ~5px; dominant paddings 5 / 15 / 30, gaps 20 / 50. Generous block padding inside colored bands; tight, ruled internal spacing inside cards. Whitespace separates *sections*; hairlines separate *within* a card.
- **Layout system:** Centered container ~1472px max; primary content runs a 2-column card grid with a wider featured "spotlight" column beside a stacked secondary column. Full-bleed colored bands break the grid for features. Mobile collapses to a single column. High information density (many cards per issue) stays legible because each card is internally ruled.
- **Motion / easing intent:** Minimal and utilitarian — `0.15s ease-in-out` hovers dominate; `0.5s ease` for the few fades. Motion communicates "a document, not an app." (Detail below.)
- **Density:** High — an entire magazine index on one scroll — kept readable by typeface-coded roles, hairline separation, and color-banded chunking.
- **Hierarchy:** Dominant ordering device is **typeface + rule**, secondarily **color-block position**; size is a minor lever.
- **Restraint:** No shadows (one stray 1px), no rounded card language, no gradient UI, no decorative motion, no hero spectacle. The illustrations are the only ornament.

## Interaction & motion (largely static — utility motion only)
Evidence: 11 frames show no entrance/parallax/recolor on scroll; `usesIntersectionObserver: false`, `rafCalls: 0`, `entranceReveals: 0`. The only own `@keyframes` are loading shimmers/pulses (and a Stripe checkout pulse) — vendor, not design. `respectsReducedMotion: true`.
- **Sticky context subnav** — *Trigger:* scroll-progress. *Mechanism:* `position: sticky` bar whose text content updates to the section/issue currently in view. *Reads as:* breadcrumb + jump-to. *Transfers to:* long indexes, docs, scroll archives. *Safety:* **production-safe** (no transform churn; label swap is cheap).
- **Lazy image fade-in** — *Trigger:* in-view/decode. *Mechanism:* `opacity 0→1` over ~0.5s as each illustration loads. *Reads as:* calm progressive paint. *Transfers to:* any image-heavy index. *Safety:* **production-safe**; gate behind reduced-motion to jump straight to opaque.
- **Hover underline / micro-state** — *Trigger:* hover. *Mechanism:* `text-decoration` + `0.15s ease-in-out` on links and "Read more →". *Reads as:* quiet affordance. *Safety:* **production-safe**.
- **Disclosure menus** (21) — *Trigger:* tap/click. *Mechanism:* the "Issues ▾ / Notes ▾" dropdowns and tab groups (5). Standard expand/collapse. *Safety:* **production-safe**.

## Production-safety note
Everything here is production-safe; the site is deliberately under-animated. The only caution is the persistent EU cookie band occupying the bottom viewport — a real UX cost worth designing around (don't anchor primary CTAs where a consent bar will sit).

## Extracted patterns
- `ruled-article-card-grid` — bordered editorial article cards (serif headline, mono byline, hairline-ruled dek, "Read more →", mono tag chip) in a 2-column grid. Reuse for blog/issue indexes.
- `color-band-illustration-feature` — full-bleed illustration sitting above a solid-color caption band carrying a serif title + mono byline; alternate band colors to pace a long page. Reuse for feature/spotlight blocks.
