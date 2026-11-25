---
slug: grafana-play
url: https://play.grafana.org
source: manual
corpus: production
surface: app
captured: 2026-08-24
award_type: null
score: null
tags: [dashboard, observability, data-viz, dark, b2b, saas, app-shell]
when_to_use: [dashboard, data-table, navigation, settings, empty-state]
directions: [minimalist]
layout: [app-shell, dense-grid]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [dashboard-app-shell, two-ring-focus]
tokens_snapshot: ../tokens/grafana-play.json
screenshots: ../screenshots/grafana-play/
---

## What works (transferable principles)
- **The chrome is fixed; only the data scrolls.** Three persistent frames — a full-height left rail (≈22vw / 250px), a top command bar, and a *sticky* per-dashboard control strip below it — bracket a single scrolling canvas. The reader never loses navigation or context because the shell is structural, not scrolled content. Transfers to any tool with an object being viewed inside a persistent workspace (editors, consoles, admin panels).
- **A near-monochrome dark field so data is the only color.** The entire UI is one desaturated slate ramp — canvas `#111217`, panel `#181b1f`, text `#ccccdc` — with saturated hue reserved almost entirely for *content*: chart series, the blue→magenta welcome banner, the amber CTA chips. When the shell is grey, a single green stat or red bar reads instantly. The discipline (not the palette) is the lesson: spend saturation on signal, not chrome.
- **Two text alphas do all the hierarchy work.** Primary text is `#ccccdc`; everything secondary is *the same color at 0.65 alpha*, tertiary at 0.3. One foreground token expressed at three opacities gives a legible three-level hierarchy on any surface it lands on, without a second grey needing to be re-tuned per background.
- **Panels are transparent by default; solidity is opt-in.** ~66% of content blocks paint no background — the dark canvas shows straight through viz panels, so charts float on the field. Only text-heavy panels (the "What is Grafana Play?" card, the blog list) get the solid `#181b1f` surface + hairline border. Backgrounds become a tool for *grouping prose*, not a default box around everything.
- **Density stays legible through a strict 8px grid and a tiny type range.** Body is 14px/22px throughout; the largest thing on the page is a 28px H1. Hierarchy comes from position, weight (400 vs 500), and the alpha ramp — not from scale. A 4px/8px/16px spacing rhythm keeps a very dense toolbar readable. This is how product UI stays calm while packing information.
- **Depth is one shadow step, not a stack.** Elevated surfaces get a single tight shadow (`0 1px 2px rgba(1,4,9,.75)` / `0 2px 5px rgba(0,0,0,.2)`); there is no glow, no layered elevation theater. On a dark UI a faint drop shadow plus a hairline border is enough to lift a panel off the canvas.

## Design-system read
- **Type:** Inter (UI) + Roboto Mono (numeric/values). Almost no scale contrast — 14px body, 12px labels, 28px H1 (a ~2× range, not the 4–6× of a marketing page). Hierarchy is carried by weight (400/500, 700 rare) and text-alpha, not size. Body tracking a hair positive (0.15px); the lone 28px H1 tracks negative (−0.25px). `line-height:22px` on 14px ≈ 1.57 for comfortable dense reading.
- **Color:** single desaturated slate ramp. Ground `#111217`, panel surface `#181b1f`, raised/secondary `#22252b`. One foreground `#ccccdc` at alphas 1 / 0.65 / 0.3 for text tiers; hairlines are that same white-lilac at 0.12/0.08. Accents are functional: link/interactive blue `#6e9fff`, focus ring `#3d71d9`, brand amber `#f9a825` (hero CTAs), and a blue→magenta hero gradient `#3577be → #c62a52`. Semantic chart hues live in content, not tokens.
- **Spacing rhythm:** 8px base. Dominant gaps 8 and 16; inline padding 4/7/8/12/16. Tight by marketing standards — appropriate for an information tool.
- **Layout system:** CSS grid/flex app-shell. Fixed left rail (250px / 22vw), fixed header (78vw × ~5vh), sticky controls chrome (z 1020), then a responsive panel grid (2-col desktop → 1-col mobile) inside a scrolling `main`. Breakpoints at 480 / 544 / 768 / 992 / 1200 / 1513; nav collapses to a hamburger (13 links → 3) below the small breakpoints.
- **Layering / page architecture:** flat z-story with a clear stack, no blend/glass. `layers_summary.has_static_backdrop:false`, no `backdrop-filter`, no `mix-blend-mode`. Six `fixed` frames + one `sticky` strip: rail (z2), header (z1000), sticky controls (z1020), portals/toasts (z1061). The canvas itself simply scrolls under them. Depth = fixed chrome + transparent panels revealing the ground, *not* parallax.
- **Motion / easing intent:** near-static, utilitarian. Material-standard `cubic-bezier(0.4,0,0.2,1)` at 100–300ms on hovers and control transitions; Emotion-hashed keyframes are spinners and slider tooltips. Motion confirms interaction, never performs. `prefers-reduced-motion` respected.
- **Density:** high — 74 interactive elements, 58 inline SVGs, a 13-item nav — kept legible by the alpha hierarchy, the 8px grid, and reserving color for data.
- **Hierarchy:** dominant device is **text-alpha + position**, with weight second. Scale barely participates.
- **Restraint:** no hero spectacle, no gradient-on-everything, no elevation stacking, no decorative motion. The one gradient (welcome banner) and the amber chips are the only "brand" flourishes; the rest is deliberately quiet so data owns attention.

## Interaction & motion (utilitarian — the site is near-static)
- **Fixed-shell / scrolling-canvas** — *Trigger:* scroll-progress. *Mechanism:* rail, header, and control strip are `position:fixed`/`sticky` while `main` scrolls beneath; content offsets by the rail width and header height. *Reads as:* a stable workspace. *Transfers to:* any editor/console/admin tool. *Safety:* **production-safe** (fixed layers are cheap; no scroll handler needed for the pinning). See `patterns/dashboard-app-shell.md`.
- **Two-ring focus indicator** — *Trigger:* keyboard focus. *Mechanism:* a double `box-shadow` — an inner ring painted in the page-bg color to open a gap, then a 2px accent-blue ring — plus a faint outline fallback. *Reads as:* an unmistakable focus target that works over any surface. *Transfers to:* every interactive control anywhere. *Safety:* **production-safe**, a11y-positive. See `patterns/two-ring-focus.md`.
- **Opacity-lift hover** — *Trigger:* hover. *Mechanism:* nav items raise text/border from 0.65α to 1.0α (and a whisper of `rgba(204,204,220,0.08)` fill) over ~100–200ms; links underline. *Reads as:* "this is live" without color change. *Transfers to:* any muted-by-default nav or toolbar. *Safety:* **production-safe**.
- **In-view panel rendering** — *Trigger:* in-view. *Mechanism:* IntersectionObserver (4 observers, ~16 targets, rootMargin 100px) defers rendering off-screen viz until it nears the viewport. *Reads as:* nothing — it's invisible; it's a perf technique, not a reveal animation. *Transfers to:* long dashboards / infinite lists. *Safety:* **production-safe**.

## Production-safety note
Everything here is production-safe; this is the reference for how a data tool should behave. The one caution the probe surfaces is **tap-target risk**: 59 of 74 interactive elements are below the ~44px comfortable-touch threshold (dense icon toolbars) — acceptable on a pointer-first product, but enlarge hit areas before shipping a touch-primary variant.

## Extracted patterns
- dashboard-app-shell — fixed rail + fixed header + sticky control strip bracketing a scrolling panel canvas; the skeleton for any workspace tool.
- two-ring-focus — accessible bg-gap + accent-color double-ring focus indicator that reads on any surface.
