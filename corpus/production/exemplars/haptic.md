---
slug: haptic
url: https://www.haptic.studio
source: landbook
corpus: production
captured: 2026-10-05
award_type: Gallery
score: null
tags: [agency, portfolio, design-studio, b2b, light, framer, editorial]
when_to_use: [portfolio, agency, landing, feature-section]
directions: [minimalist, editorial]
layout: [content-grid, bento]
a11y: [reduced-motion-ignored, focus-visible-missing, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: https://land-book.com/websites/100677-haptic-a-a-design-studio-for-startups-and-scaleups
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [scroll-scrub-word-brighten, labeled-work-card-grid]
tokens_snapshot: ../tokens/haptic.json
screenshots: ../screenshots/haptic/
---

## What works
- **Tiny body copy as a deliberate editorial signal.** Body text sits at ~12px while the display headline hits 48px (and the footer wordmark 100px) — a 4–8× scale gulf in a single near-mono palette. The small body reads as "studio/spec sheet" precision rather than an accessibility slip *because* it's paired with generous whitespace and short measures; hierarchy is carried entirely by scale + position, never by color or weight. Transfers to agency/portfolio work where you want a confident, understated information layer under big statements. (Validate the 12px against WCAG before shipping to a general audience — see safety note.)
- **The product shots do the color.** The shell is monochrome — white ground, near-black (#101214) ink, grey surfaces — and *all* saturation lives inside the work cards (a lime-green music app, an electric-blue finance phone, orange gradient dashboards). Keeping the chrome colorless makes a grid of wildly different client brands read as one calm catalog. Transfers to any portfolio/case-study index where the content is visually loud and the frame must not compete.
- **One restrained accent, used as a state not a brand color.** Electric link-blue (#0000ee) appears only on the floating "New Case Study" badge and in-flow links, and it *resolves to black* as its section scrolls into view (a color-shift, not a static highlight). Reserving a hot accent for a single moving element keeps the palette monochrome at rest while still giving the eye one place to land. Transfers to any mostly-neutral layout that needs a single controlled pop.
- **Bento of equal-and-double cells makes a grid feel composed, not tabular.** The work section is a 3-column grid where most cards are 1-wide but a few span 2 (a wide dark dashboard, a mixed media pair), each card a full-bleed shot with a small meta label pinned to its bottom-left. The size variation gives rhythm; the identical radius + label treatment keeps it coherent. Transfers directly to portfolios, changelog galleries, feature mosaics.
- **Persistent corner CTAs instead of a sticky bar.** A glass "Book a call" pill and a "New Case Study" card float fixed in the corners (backdrop-blur, ~26% viewport width) rather than a full-width sticky header. The conversion path is always one click away without a bar eating vertical space or covering content. Transfers to marketing pages that want an ever-present CTA with a lighter footprint than a pinned nav.

## Design-system read
- **Type:** Display family GT Standard L paired with SF Pro Display for UI/body (one accent cut, Passenger Sans, used once). Scale is wide and sparse — ~12 / 15–16 / 24 / 32 / 42 / 48 / 100px — roughly a 1.3–1.4 ratio in the mid range exploding to a 100px footer wordmark. Hierarchy = scale contrast in two weights only (400/500); display tracks tight (−0.02 to −0.03em), body neutral. Tabular-nums on the pricing figures.
- **Color:** Monochrome shell — bg #ffffff, grey surfaces #f4f5f7 / #f5f5f7, ink #101214, muted grey #cecece / black-at-50%. Dark tiles use #141414 / #000 with white text. Two accents, both content-local: electric blue #0000ee (links + the one floating badge) and lime #9dff5e (a client-brand card, "NEW CS" tag). No dark theme.
- **Spacing rhythm:** ~4px base on an 8px rhythm — card gaps 6/8/10/12px, section gaps 20/32/70px, section padding 60/80/120/180px. Whitespace is the primary separator; the page breathes between dense card clusters.
- **Layout system:** Very wide max container (~1800px) for the full-bleed card grids, tightening to ~1070px / 800px for reading sections. 3-column work grid with 1- and 2-wide cells (bento), collapsing to 1 column on mobile. Breakpoints at ~810 / 1000 / 1800. Flex-dominant (393 flex vs 3 grid containers — Framer output).
- **Layering / page architecture:** Single flat scroll — no fixed backdrop, no blend curtain. The only fixed layers are the two corner CTA chrome elements (z-10, ~6% and ~17% viewport). Depth is shallow and comes from soft shadows (`0 4px 10px rgba(0,0,0,.05)`, plus a 72px inset white glow on glass) and `backdrop-filter: blur(10px)` on 6 glass pills; a single `mix-blend-mode: difference` element lets a label invert over imagery beneath it.
- **Motion / easing intent:** One house timing — 600ms on `cubic-bezier(0.4,0,0.2,1)` (Material standard) plus plain `ease`. Motion is quiet and communicative: text brightens as you read, cards rise in, the badge recolors. Nothing loops or demands attention. Built on Framer; dense scrub IntersectionObservers (threshold arrays `[0,0.01,…,0.99]`) drive the scroll-linked effects.
- **Density:** High *content* density (many cards, small type) held legible by whitespace between clusters and a strict monochrome frame.
- **Hierarchy:** Scale and position first; color a distant last (reserved for the moving accent).
- **Restraint:** No gradients in the chrome, no multi-weight type ramp, no sticky nav bar, no hero mockup cliché — just big type, a quiet grid, and color quarantined to the work.

## Interaction & motion
- **Scroll-scrubbed word brighten (read-along)** — *Trigger:* scroll-progress. *Mechanism:* the intro paragraph is split into per-word spans resting at `opacity: 0.2`; each word's opacity is driven toward `1` as the block scrolls through a track (dense scrub IO, threshold `[0…0.99]`), so the sentence lights up word-by-word in reading order. *Reads as:* the copy "activating" as you read it — attention pacing. *Transfers to:* mission statements, manifesto paragraphs, any single hero line you want read deliberately. *Safety:* **production-safe** — opacity-only, GPU-cheap; the cost is the continuous scrub IO (keep it to one or two blocks). See `patterns/scroll-scrub-word-brighten.md`.
- **In-view card rise + fade** — *Trigger:* in-view. *Mechanism:* work cards and sections fade (`opacity 0→1`) and translate up a short distance, staggered, gated by IntersectionObserver (28 fade-ins observed). *Reads as:* the catalog assembling as you descend. *Transfers to:* any card grid or section list. *Safety:* **production-safe** (transform+opacity). See the existing `inview-fade-rise-stagger.md`.
- **In-view color-shift on the accent badge** — *Trigger:* in-view. *Mechanism:* the floating "New Case Study" badge text crossfades `#0000ee → #000` (and fades opacity) as it enters, tying the one hot accent to a moment rather than a resting state. *Reads as:* a highlight that "settles." *Transfers to:* a single attention element you want to introduce then calm. *Safety:* **production-safe**.
- **Scroll-progress scale/parallax on vector marks** — *Trigger:* scroll-progress. *Mechanism:* an SVG `<g>` scales (≈0.38→0.22) and parallax-translates against scroll — the footer wordmark / graphic treatment. *Reads as:* subtle depth as you reach the end. *Transfers to:* oversized footer wordmarks, decorative marks. *Safety:* **production-safe** (transform-only), but it's scrub-driven so keep the node count low.
- **Micro hover feedback** — *Trigger:* hover. *Mechanism:* buttons nudge scale ~1.003 (near-imperceptible) and solidify background `rgba(0,0,0,.9)→#000`; nav/service links fade to 50% opacity. *Reads as:* responsive but understated. *Transfers to:* any restrained UI. *Safety:* **production-safe**.

## Production-safety note
- **Reduced motion is NOT respected** (`respectsReducedMotion: false`). Every technique above must be re-wrapped in `@media (prefers-reduced-motion: reduce)` to jump to the end state before reuse — the patterns here do this; the live site does not.
- **12px body copy** is below the comfortable floor for a general audience; it works here as an aesthetic signal for a design-literate B2B audience. Bump to ≥14–16px for anything content-heavy or consumer-facing, and never ship it as the only size.
- **Tap targets:** 10 small targets flagged, no `main`/`nav`/`footer` landmarks (Framer div-soup), focus-visible not implemented. Add real landmarks, visible focus rings, and ≥44px targets when porting.

## Extracted patterns
- `scroll-scrub-word-brighten` — per-word opacity read-along driven by scroll progress; for manifesto/intro copy you want read deliberately.
- `labeled-work-card-grid` — monochrome bento of full-bleed shots with a corner meta label; for portfolio/case-study/feature indexes.
