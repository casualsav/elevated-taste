---
slug: saronic
url: https://www.saronic.com
source: manual-pick
corpus: expressive
surface: site
captured: 2026-06-30
award_type: Manual (techno-feudal genre)
score: null
tags: [defense-tech, maritime, hardware, b2b, dark, cinematic, heraldic-mark, techno-feudal, mono-label]
when_to_use: [brand-experience, hero, product-marketing, landing, hero-spectacle, interactive-showcase]
directions: [expressive, minimalist]
layout: [editorial-columns, full-bleed]
a11y: [reduced-motion-ignored]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [inverting-sticky-header, cinematic-media-cta-card]
tokens_snapshot: ../tokens/saronic.json
screenshots: ../screenshots/saronic/
---

## What works (transferable principles)
- **Two-temperature scroll architecture.** The page alternates full-bleed *dark cinematic media* sections (hero render, vessel-at-sea, footer) with a single cool *near-white "document"* section (the Capabilities slab). The contrast between the two temperatures — not internal decoration — is what paces the scroll. Reusable anywhere you want a long page to feel composed rather than stacked: pick two backgrounds at opposite ends of the value scale and let the boundary between them do the sectioning.
- **Scale-only hierarchy in a single weight.** Everything is Suisse at 400/450 — the *only* variable that changes is size: 16px body → ~54px section heads → a 226px "SARONIC" wordmark, with letter-tracking tightening as size grows (−0.5px at 28px down to −9px at 226px). No bold, no second display face. Reads as engineered and calm even at high density. Transfers directly to product UI where weight-spam usually creates noise.
- **One saturated accent guarding a desaturated field.** The whole palette is slate (#162029) + cool white (#F2F6FA) + grays — effectively monochrome — and then a single acid-green (#ACFF24) is reserved *exclusively* for CTAs and the announcement bar (a rare orange marker is the only other chroma). Scarcity is the mechanism: because green never appears as decoration, every green rectangle reads unambiguously as "act here." Transfers as an accent-discipline rule for any brand.
- **Mono as the "instrument-panel" register.** Suisse Mono, uppercase, tracked, small (12px) carries every eyebrow, section tag, terminal overlay, and even live coordinate readouts (`X = 0  Y = 0`) — a technical voice held strictly separate from the humanist body type. `slashed-zero` is on. The two-typeface split (humanist headline / mono label) is a cheap, portable way to signal engineering credibility without skinning the whole site.
- **Hairline grid made visible.** 1px rules expose the column structure — the header splits into vertical cells, the footer is three ruled columns, capability panels carry thin borders. Structure becomes the only ornament; the page reads like a schematic. Transfers to editorial/technical layouts that want rigor without graphics.
- **Corner-anchored solid card over full-bleed media.** Copy never floats centered on the imagery; it sits in a small *solid* block (acid-green or slate) pinned to a corner of the frame, like a spec callout stamped on a film still. Keeps text legible over busy renders without a scrim wash, and gives each cinematic section a clear, repeatable content slot.

## Design-system read
- **Type:** Suisse Int'l (humanist grotesque) + Suisse Mono. Single fluid scale from 12px (mono labels) through 16px body, ~18/22/28/35/54px heads, to a 226px wordmark — roughly a 14× range. Hierarchy is **pure scale + tracking**, weights stay at 400/450. Tracking negative and increasing with size.
- **Color:** Near-monochrome cool system. `bg` slate #162029, `surface` lighter slate #1B2733/#44505C, `fg`/light-bg #F2F6FA, muted grays #C6CBD0 / #79848F. Accent #ACFF24 (acid green) for action only; secondary #FB6B3C (orange) as a rare directional/progress marker. Light section inverts: bg #F2F6FA, fg #162029.
- **Spacing rhythm:** 8px base. Common steps 8/16/24/40/80/120px. Generous vertical air around the giant display type; tight, consistent 16/24px gutters inside grids.
- **Layout system:** 12-col feel expressed through 2- and 3-column flex/grid blocks with visible hairline gutters. Container max-widths ~600–920px for text blocks; media goes edge-to-edge. Desktop multi-column collapses to 1-col on mobile; nav stays 8 links behind a MENU toggle.
- **Motion / easing intent:** Slow, cinematic. Custom `cubic-bezier(0.25,0.25,0,1)` (sharp ease-out) at 1–1.2s for big transitions; `ease` at 0.25/0.5s for micro-interactions. Motion communicates *gravity and precision*, not playfulness. (Detail below.)
- **Density:** High information density in the dark sections, kept legible by huge value contrast, mono labels chunking content, and lots of whitespace around the display type.
- **Hierarchy:** Dominant ordering device is **scale**, backed by the dark/light value flip between sections.
- **Restraint:** No rounded blobs (max radius 4px), no soft drop-shadows or glows, no decorative gradients (the only gradient is a tiny conic progress dial), no second display face, no color outside the slate/white/green triad.

## Interaction & motion
- **Inverting sticky header** — *Trigger:* in-view (section boundary). *Mechanism:* as the header crosses from the dark hero into the light Capabilities slab, its text color flips #F2F6FA→#162029 and its background transparent→#F2F6FA, gated by IntersectionObserver sentinels rather than a scroll handler. *Reads as:* chrome that always belongs to whatever's behind it. *Transfers to:* any site with fixed chrome over alternating light/dark sections. *Safety:* **production-safe** (toggles class on one element, animates only color/background). See `patterns/inverting-sticky-header.md`.
- **Pinned video background with opacity fade** — *Trigger:* scroll-progress. *Mechanism:* the hero render is `position: fixed` behind the content and fades opacity ~1→0.2 as you scroll past, so foreground sections appear to slide over a receding film. *Reads as:* cinematic depth / parallax without moving the heavy layer. *Transfers to:* hero-spectacle landings. *Safety:* **spectacle-only** — full-screen video + fixed positioning is GPU/main-thread heavy and the site **does not respect `prefers-reduced-motion`**; gate it and offer a static poster fallback.
- **Tabbed capability switcher with auto-advance** — *Trigger:* load + tap. *Mechanism:* a horizontal tab rail (Launch…Recover) swaps a 3D ASV render + mono "terminal" caption; it auto-cycles with a visible pause control and a conic-gradient progress dial. *Reads as:* a guided product demo / mission timeline. *Transfers to:* feature showcases with several facets of one product. *Safety:* **production-safe** if the pause control and tap-to-jump are real (they are here); always expose the pause.
- **Footer reveal-from-under** — *Trigger:* scroll-progress. *Mechanism:* the footer background is pinned (`fixed`) so the final content section scrolls up to uncover it. *Reads as:* a deliberate "end of transmission" close. *Transfers to:* long marketing pages. *Safety:* **production-safe** (cheap), but pair with reduced-motion fallback.
- **Micro scale-on-hover** — *Trigger:* hover. *Mechanism:* buttons/links scale to ~1.02 (transform only) and the menu toggle lifts a faint 5%-white wash. *Reads as:* tactile, restrained. *Transfers to:* anywhere. *Safety:* **production-safe**.

## Production-safety note
- **Inverting sticky header, tabbed switcher, footer reveal, hover scale** — production-safe; transform/color/opacity only.
- **Pinned full-screen video background** — spectacle-only. Heavy (rAF count is very high), and **reduced-motion is not respected on the live site** — a defect to fix when borrowing: wrap the fixed video and opacity drive in `@media (prefers-reduced-motion: no-preference)` and ship a static poster otherwise.

## Extracted patterns
- `inverting-sticky-header` — fixed header that flips its color scheme at section boundaries via IO sentinels; reuse over any alternating light/dark page.
- `cinematic-media-cta-card` — full-bleed media section with a small solid, corner-anchored accent CTA card; reuse for hardware/brand spotlights.
