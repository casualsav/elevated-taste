---
slug: plaid
url: https://plaid.com
source: manual
corpus: production
surface: site
captured: 2026-09-07
award_type: null
score: null
tags: [fintech, saas, b2b, developer-platform, api, marketing, light]
when_to_use: [landing, product-marketing, feature-section, hero, footer]
directions: [soft, minimalist]
layout: [split-hero, bento]
a11y: [focus-visible, alt-coverage-high, reduced-motion-respected]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [duotone-gradient-hero, inview-fade-rise-stagger]
tokens_snapshot: ../tokens/plaid.json
screenshots: ../screenshots/plaid/
---

## What works (transferable principles)
- **A single accent keyword recolors the headline instead of a second weight.** The hero H1 runs one weight (600) at 76px, and hierarchy *inside* the sentence comes from painting the load-bearing phrase in the brand teal-green (`#0ba299`) while the rest stays white — "Turn **data into** revolutionary financial products." No bold, no size change: the eye is steered by hue. Reusable anywhere a headline has a concept worth spotlighting — color one clause, leave the rest neutral, and you get emphasis without a heavier face.
- **Tight negative tracking scaled with size is the display signature.** Display type packs hard: 76px at `-3.4px` (~-0.045em), 58px at `-2px`, 50px at `-2px`, easing to `-0.4px` at 20px and near-zero at body. The tracking is dialed *down* as size drops so optical density stays constant across the ramp. This is what makes a plain grotesk (Cern) read as a confident, engineered display face rather than default sans. Rule: negative-track your display sizes, relax toward body.
- **Brand color lives on photography and gradients, not flat fills.** The page stays mostly white; saturation is delivered through a duotone teal→blue treatment of a real photo (the $100-bill Franklin portrait) bleeding under the hero text, and through soft 48°/46° pastel-gradient card surfaces (`linear-gradient(48deg,#cdf5fd,#d8fef3,#e8fed7)`). Big neutral canvas + a few high-chroma image/gradient moments reads richer than blanket-coloring surfaces, and keeps text on white where it's most legible.
- **Accent-coded metric numerals turn a stat row into a wayfinding index.** The "network" stats ("1 in 2", "25%", "1M+", "5000") each render the *numeral* in its own hue — pink, magenta, purple, green — while labels stay ink. Color tags each figure as a distinct fact instead of decorating the block; a busy stat quartet reads as four separate claims. Transfers to any KPI/metric row: color the number, not the card.
- **Rounded-pill button on a luminosity-blend base.** Primary/secondary CTAs are 100px pills whose fill is a `linear-gradient(77deg,#111112,#373839)` layer set `mix-blend-mode: luminosity` and inset 2px inside a border ring — so the button picks up a subtle sheen and sits into its own frame rather than being a flat rectangle. A cheap, GPU-friendly way to give a solid button depth without a drop shadow.
- **One bento of product cards carries the whole "everything we do" story.** Instead of a wall of text, the "Powered by the largest financial network" section is a 2-row bento (`border-radius: 20px`) where each card holds a *tiny working UI mockup* (a payment row, an "83" credit gauge, avatar chips, an onboarding sheet). Showing the product in miniature — at real fidelity — sells capability faster than a feature list, and the uniform radius + soft tinted surfaces keep six different mockups reading as one family.

## Design-system read
- **Type:** Cern (custom grotesk; `Plaid Sans`/Helvetica fallback) for everything, Inconsolata mono for code blocks, `Bowery Street` for rare display accents. Scale ≈ 16·18·20 body ramp / 26·30 / 50·58 / 70·76 display. Two working weights — 400 for reading, 600 for headings/emphasis (700–800 are rare). Hierarchy = **scale + color**, not weight. Signature is negative tracking that scales with size.
- **Color:** White base `#fff` + faint surfaces `#f6f6f6`/`#fafafa`. Ink foreground `#111112`; muted `#555`/`#595b5c`. Brand accent is the Plaid teal-green pair `#0ba299`/`#088181`, backed by deep teal `#012e37` and navy `#02294b` for dark sections. Interactive/form states use a separate blue (`#0072cf`, `#0a85ea`). A metric palette — pink, magenta, purple `#7646ec`, green — appears only on stat numerals. Gradients are pastel (card surfaces) or saturated purple `#6748d8→#b14edb` (accents).
- **Spacing rhythm:** 8px base (4/8/12/16/24/30/32/40 common; 50/88 for section breaks). Card padding ~24-30px; generous vertical air between sections. Whitespace separates, hairlines (`rgba(17,17,17,.08)`) are used sparingly.
- **Layout system:** Flex-dominant (2/3/5/6-col rows) with a 2-col grid for the hero and section headers; container maxes ~1730 (full-bleed backdrop) / 1200 / 743 / 520px inner columns. Gaps 12/16px. H1 76→32px mobile; body holds at 16px. Nav collapses to a hamburger.
- **Layering / page architecture:** Essentially a flat white scroll — `has_static_backdrop: false`, `has_blend_overlay: false`. The load-bearing fixed layer is the pinned top nav (z ~1e8); the hero's duotone image and pastel gradients are *in-flow* backgrounds, not fixed parallax planes. Depth comes from soft layered card shadows and the luminosity-blend button base, not a z-axis world.
- **Motion / easing intent:** Base durations 100–350ms (plus a 500ms modal, a 10s marquee loop); easings `ease`/`ease-out`/`ease-in-out` with one overshoot `cubic-bezier(0.23,1.2,0.32,1)`. Motion says "live financial data / a working product": staggered in-view reveals, an animated number-flow on stats, mini product-demo loops, and a logo marquee. Restrained and functional, not spectacle.
- **Density:** Moderately high (bento mockups, code block, stat rows, deep footer) kept legible by the white canvas, muted secondary text, and one clear accent per region.
- **Hierarchy:** Dominant ordering device is **scale**, with **color** as the secondary steer (accent keyword, accent-coded numerals, one saturated CTA per view).
- **Restraint:** No dark mode (`supportsDark: false`), no blend-overlay theater, no cursor followers, no full-page parallax. Saturation is quarantined to images, gradients, and numerals; the reading surface stays white.

## Interaction & motion (techniques)
- **In-view fade-rise, staggered** — *Trigger:* in-view (IntersectionObserver, ~412 observed targets, thresholds 0.01/0.2). *Mechanism:* elements start `opacity:0; translateY(...)` and settle to rest (`fadeInUp`/`slideInUp` keyframes) when they enter the viewport; siblings are delayed in sequence (`staggeredEntrance: true`). *Reads as:* content arriving in order, calm and directed. *Transfers to:* any long marketing page. *Safety:* **production-safe** — transform/opacity only; `respectsReducedMotion: true`. See `patterns/inview-fade-rise-stagger.md`.
- **Animated number-flow on stats** — *Trigger:* in-view. *Mechanism:* the metric numerals (`--_number-flow-*` custom props) count/roll up to their final value when the stat row scrolls into view. *Reads as:* "these are live, growing numbers." *Transfers to:* KPI/stat sections. *Safety:* **production-safe**; gate the roll behind reduced-motion (jump to final value).
- **Logo marquee** — *Trigger:* load (continuous, ~10s loop). *Mechanism:* the customer-logo strip under the hero (Rocket, Venmo, Varo, Robinhood…) translates horizontally on a linear loop (`marquee: 12`). *Reads as:* breadth of adoption. *Safety:* **production-safe** if paused under reduced-motion and on hover.
- **Mini product-demo loops** — *Trigger:* in-view / load. *Mechanism:* the bento cards run small self-contained animations (loading spinner → connected state, phone screens sliding in via `fadeInUpPhone`, a `screenOn` reveal) on 7 canvases. *Reads as:* the actual product working, in miniature. *Transfers to:* feature cards that want to show liveness without a video. *Safety:* **production-safe**; keep loops short and reduced-motion-aware.
- **Pill hover + nav opacity dim** — *Trigger:* hover. *Mechanism:* nav items crossfade `opacity 1→0.75` (0.1s ease-out); pill buttons shift their luminosity-blend base. *Reads as:* tactile, responsive. *Safety:* **production-safe**.

## Production-safety note
- Everything here is production-safe and reduced-motion is genuinely respected (`prmRules: 7`, `respectsReducedMotion: true`). The real liability is tap-target sizing: `small_tap_targets: 117` across 419 interactive elements — an adopter should enforce ≥44px hit areas, especially in the dense footer and nav. Focus rings are present (`focus_visible: true`) and alt coverage is high (0.93).

## Extracted patterns
- `duotone-gradient-hero` — split hero: text column over a duotone-treated photo that bleeds behind it, with one accent-colored keyword in the headline and pill CTAs.
- `inview-fade-rise-stagger` — IntersectionObserver-gated fade+translateY entrance with sibling stagger; reduced-motion-aware, transform/opacity only.
