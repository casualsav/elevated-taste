---
slug: shadcn
url: https://ui.shadcn.com
source: manual-pick
corpus: production
surface: docs
captured: 2026-06-30
award_type: Manual (dashboard/components)
score: null
tags: [developer-tool, design-system, component-library, dashboard, app-ui, open-source, b2b, light, react, neutral]
when_to_use: [dashboard, data-table, settings, forms, interactive-showcase, docs, navigation, hero]
directions: [minimalist]
layout: [center-stack, content-grid]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [live-component-masonry, scroll-edge-fade-mask, oversized-display-headline]
tokens_snapshot: ../tokens/shadcn.json
screenshots: ../screenshots/shadcn/
---

> **What this is.** The home of **shadcn/ui** — the copy-paste React component collection built on Radix + Tailwind. The page is a single centered hero over a **wide masonry of ~30 live component demos** (forms, a bar chart, a chat panel, savings/progress cards, a QR pairing card, settings lists). The "marketing" is the kit running in place: every card is a real instance of a component the project ships, so the page *is* its own product catalog. Distilled here: the neutral-zinc system, the 14px app-density baseline, and the "show the kit by building the page from it" layout move.

## What works (transferable principles)

- **Demonstrate the kit, don't illustrate it — the component gallery is the hero.** Below a short centered hero, the entire page is a dense masonry of *real, varied* component instances: a form cluster, a contribution bar chart, a "Set a new milestone" form, a chat thread, sparkline rows, a payout-threshold slider, breadcrumb settings. Breadth is proven by *seeing thirty things work at once*, not by a feature list. Same family as Radix/Attio — the interface sells itself — but pushed to the extreme of "the page is a component catalog." Transfers to any design-system, UI-kit, or component-library site: compose the landing page out of the product.

- **Neutral-zinc monochrome chrome + one rationed blue reserved for data and in-demo actions.** The whole frame is a single neutral ramp — white card → `#f4f4f5` surface → `#18181b` near-black text → `#71717a` muted → `#e4e4e7` hairline borders (the zinc scale). All chroma is rationed into the *live data*: blue bar charts, blue progress fills, the in-demo "Create Goal" / send buttons. Because the chrome is fully desaturated, those blue elements read as *real working signal*, not decoration. Note the deliberate split: **site CTAs are pure black** ("Build Your Own", "+ New"), **demo accents are blue** — chrome-primary and content-primary are different colors on purpose. Transfers anywhere you want data to pop: starve the surround.

- **Hairline-border-first elevation; shadow is a whisper or absent.** Every card is defined by a 1px `#e4e4e7` ring, not a drop shadow (`shadow-sm` = `0 1px 2px rgba(0,0,0,.05)` at most). This is the shadcn `Card` recipe and it's why a ~30-card composition stays flat, calm, and legible instead of becoming a pile of floating panels. Transfers to any data-dense surface: border for definition, micro-shadow for the barest lift, never a chunky elevation.

- **14px UI baseline = "this is product, not a landing page."** The dominant body size is **14px / 20px line-height** (1381 nodes vs 195 at 16px) — most marketing sites set 16px. Choosing a 14px baseline is the single strongest signal that you're looking at *application density*, and it lets the demo cards pack real-app information without feeling oversized. Pair with a 4px spacing base. Transfers to dashboards, settings, data tables — match the baseline to the medium (14 for app UI, 16 for reading).

- **Scale-driven hierarchy in one family; tracking scales hard with size.** Hierarchy is created by the *size gap*, not weight — weights are only 400 (base), 500 (labels/buttons), 600 (rare headings). The hero leaps to **48px with -2.4px tracking (-5%)** while micro-labels ("UPCOMING", "SAVINGS PLAN") take **+0.6px positive tracking** as uppercase eyebrows. Rule: tighten display type aggressively and loosen small uppercase labels — opposite directions, both deliberate; don't leave either at default.

- **A coherent radius + token system makes thirty disparate widgets feel like one family.** Cards/inputs cluster at 8–10px, smaller chips at 6px, pills at full-round — all derived from one `--radius` token. Combined with the shared border/space/color tokens, a chat panel, a chart, and a settings list read as obviously the same system. Transfers to any kit: a *single* derived radius scale is what makes heterogeneous components cohere.

## Design-system read

- **Type:** **Geist** (sans) as the sole workhorse — UI, labels, and display (Geist Mono ships for code/inputs; the `caret-blink` keyframe is the input demo, but the capture shows only Geist sans). Two-cluster scale: a tight UI band **12 / 14 / 16 / 18px** and a display band **24 / 30 / 36 / 48px**, with the gap as hierarchy. Weights **400 base, 500 labels/buttons, 600 rare**. Leading ~1.1 on the 48px hero (52.8/48), 1.43 on 14px body (20/14), 1.5 on 16px. Tracking: **-2.4px @ 48px (-5%)** display, **+0.6px @ 12px** uppercase labels.
- **Color:** Light **neutral-zinc monochrome.** `bg #f4f4f5` (zinc-100) → `card #ffffff` → `fg #18181b` (near-black) → `muted #71717a` (zinc-500) → `border #e4e4e7` (zinc-200). **Site primary is black** `#000`/zinc-950 (CTAs, "+ New"). The **accent is a single blue ~`#3a5ccc`** living almost entirely in the demos (chart bars, progress fills, in-demo primary buttons), with a chart ramp down to a deeper indigo `~#2f2db5` and a lighter blue `~#6ea8e0`; **destructive red `~#dc2626`** appears in danger states. Full dark-mode support (the page ships a theme toggle).
- **Spacing rhythm:** **4px base.** Gaps cluster 4 / 6 / 8 / 12 / 16 / 20 / 24px (8px dominant); card padding 16–20px inline. Tight, even, app-grade rhythm — whitespace inside cards is modest; the *gaps between cards* do the separating.
- **Layout system:** centered hero (badge → 48px headline → muted subhead → black pill CTA) over a **wide multi-column masonry** of cards (desktop reports 4 / 3 / 2 / 1-col sub-grids; container max-widths 896 / 1400 / 1600px). On mobile the masonry collapses toward 2 columns with horizontal overflow for the rest. Captured 1440×900 desktop, 390 mobile.
- **Motion / easing intent:** minimal and component-level. Base durations **100 / 150 / 200ms**, easing `cubic-bezier(0.4, 0, 0.2, 1)` (the Tailwind standard ease). Page motion is a **sticky nav** + ghost hover washes; the rich motion is the *components'* micro-interactions (accordion, toast, skeleton shimmer) and a **scroll-driven edge-fade** on overflow areas. Reduced motion **respected** (2 PRM rules).
- **Density:** high — real forms, charts, and lists packed into compact cards — kept legible by the desaturated chrome, the 14px baseline tuned for it, and hairline (not shadow) separation.
- **Hierarchy:** dominant device is **scale** (UI band vs display band), reinforced by **color** (near-black fg vs zinc-500 muted) and by **position** (centered hero above a grid).
- **Restraint:** no hero illustration, no gradient text, no chunky shadows, no multi-weight body, no decorative color. Chroma is confined to live data; everything structural is one neutral ramp.

## Interaction & motion

**Honest framing first.** The page is **largely static**. The profiler reports a single scroll effect — the **sticky nav header** (position pin) — and **0 entrance reveals, 0 cursor followers, 0 canvas, 0 parallax**. The one IntersectionObserver (10 targets, `rootMargin: 200px`) is a **lazy-mount** boundary for the demo cards, not a reveal animation. So there is no scroll choreography to speak of; the motion that matters is at the component level, read straight off 19 `@keyframes` and the hover deltas.

- **Ghost-hover wash (nav + links)** — *Trigger:* hover. *Mechanism:* nav items go from transparent to a faint `#f4f4f5` background + text darken to near-black, 150ms `cubic-bezier(0.4,0,0.2,1)`. *Reads as:* quiet, low-commitment affordance — the chrome stays calm. *Transfers to:* any text-link nav / menu. *Safety:* **production-safe** (bg/color only).

- **Scroll-driven edge fade on overflow areas** — *Trigger:* scroll-progress. *Mechanism:* the `scroll-fade-reveal-{t,b,s,e}` keyframes fade an element's top/bottom/start/end edges in and out as a scroll container moves — a scroll-position-linked `mask-image` gradient (the bottom of the masonry dissolves into the background; scroll areas gain/lose edge fades). *Reads as:* "there's more past this edge" without a hard cut or a heavy button. *Transfers to:* scroll areas, long lists, overflowing previews/galleries. *Safety:* **production-safe** — mask + opacity, compositor-friendly; degrade to a static always-on fade under reduced-motion. → see `patterns/scroll-edge-fade-mask.md`.

- **Disclosure slide (accordion height-tween)** — *Trigger:* open/close (click). *Mechanism:* `accordion-down/up` animate measured panel height via `--radix-accordion-content-height`. *Reads as:* content makes room for itself. *Transfers to:* FAQ, filters, nav sub-menus. *Safety:* **production-safe** — height is the one non-compositor property but it's on a click (cold path); reduced-motion → instant toggle.

- **Toast lifecycle (Sonner)** — *Trigger:* event. *Mechanism:* paired `sonner-fade-in/out` + `sonner-spin` + `swipe-out-{left,right,up,down}` give a transient, swipe-dismissible confirmation. *Reads as:* lightweight acknowledgement with a spatial exit. *Transfers to:* save/copy/undo toasts. *Safety:* **production-safe** (transform/opacity, auto-dismiss); reduced-motion → fade only.

- **Skeleton shimmer + indeterminate states** — *Trigger:* load/pending. *Mechanism:* `tw-shimmer` sweeps a sheen over placeholder blocks; `pulse`/`spin` cover loading/indeterminate. *Reads as:* "content is coming," holding layout so nothing shifts. *Transfers to:* any data-fetch view. *Safety:* **production-safe**; pause off-screen / under reduced-motion (looping opacity/transform).

Stack (provenance only): hand-rolled **CSS `@keyframes` + Tailwind transitions + Radix primitives + Sonner + IntersectionObserver** — no GSAP/Lenis/Framer; CSS scroll-driven animation for the edge fade.

## Production-safety note

This is a shipping open-source kit; everything here is **production-safe** by design (it *is* what people ship).

- Neutral-zinc chrome + rationed blue — **production-safe**, zero cost. The blue carries data/action meaning; **don't make it the *only* signal** — keep labels on charts and text on buttons so it isn't hue-only.
- Hairline `#e4e4e7` borders — **production-safe**; 1px low-contrast borders can vanish on poor displays — fine for card chrome, verify for a11y-critical dividers.
- 14px baseline — **production-safe** for app UI; for *reading*-heavy pages step up to 16px. Keep `#71717a` muted text at body size or larger to hold 4.5:1.
- Component micro-interactions — **production-safe**; reduced-motion respected (2 PRM rules), animate transform/opacity (accordion height is the click-path exception).

**A11y, honestly (from `.craft.a11y`):**
- ✅ `focus_visible: true` with real focus rings (a ~2px ring + border shift on every nav item / the search button) and reduced-motion respected.
- ⚠️ **69 of 86 interactive elements flagged small tap targets** — many sub-44px hit areas (dense demo toggles, icon buttons, compact nav). Real on touch; enlarge hit areas in production.
- ✅ `img_alt_ratio: 1` on the 2 images captured (the page is overwhelmingly text/SVG/component UI, not imagery).

## Extracted patterns

- **live-component-masonry** — a wide multi-column masonry packed with many *real* component instances (forms, charts, lists, chat, progress) as the primary proof section, on monochrome chrome with rationed accent in the live data; reuse for any design-system / component-library / UI-kit landing where the product should sell itself.
- **scroll-edge-fade-mask** — a scroll-position-linked `mask-image` gradient that fades a container's edges in/out to signal "more past this edge" (scroll areas, overflowing galleries); CSS scroll-driven, reduced-motion → static fade.
- **oversized-display-headline** *(existing)* — the 48px single-weight hero with -5% tracking over a quiet centered subhead; reuse where scale, not weight, is the hierarchy.
