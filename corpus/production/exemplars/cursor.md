---
slug: cursor
url: https://cursor.com
source: manual-pick
corpus: production
surface: site
captured: 2026-06-30
award_type: Manual (ai/developer-tool)
score: null
tags: [ai, developer-tool, code-editor, b2b, product-marketing, warm-neutral, light]
when_to_use: [landing, product-marketing, hero, feature-section]
directions: [minimalist, editorial]
layout: [split-hero]
a11y: [reduced-motion-respected]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [faux-app-mockup-feature-row, in-view-fade-rise]
tokens_snapshot: ../tokens/cursor.json
screenshots: ../screenshots/cursor/
---

## What works (transferable principles)
- **Show the product, don't diagram it.** Every feature row is anchored by a *high-fidelity faux-app mockup* — real window chrome, tabs, syntax-colored code, a working-looking agent chat — not an abstract icon or a vague "dashboard" rectangle. The claim ("Agents turn ideas into code") is proven by a believable artifact beside it. Transfers to any product-marketing page: replace generic illustration with a credible screenshot-grade reconstruction of the actual UI.
- **Hierarchy from scale + opacity, not weight.** ~99% of text is a single weight (400); a heading and its supporting line differ only by *size* and by *ink opacity* (full-ink heading → ~60% muted body). The page reads calm and editorial because nothing shouts in bold. Reusable anywhere you want density without visual noise.
- **Warm neutral system instead of cool gray.** Background, surfaces and ink are all warm (parchment `#F7F7F4`, ink `#26251E` — a near-black with green-brown bias), so the page feels like paper rather than a default Tailwind slate UI. A single warm terracotta (`#DB704B`) carries every call-to-action link. Transferable lesson: pick an off-axis neutral and one accent; the off-axis is what stops it looking like a template.
- **Action lives in one repeated micro-component.** Forward motion is a recurring *colored text-link + arrow* ("Learn about agents →", "Learn about Tab →"), never a field of competing buttons. One CTA grammar repeated down the page keeps scan-cost low and trains the eye.
- **Borders and insets do the structuring, shadows are rare.** Sections are separated by hairline `rgba(ink,0.1)` borders and panel insets on the same warm surface, not drop-shadows or color blocks. Elevation (soft layered shadow) is spent only on the floating product mockups that should read as "above" the page. Restraint that scales to dense pages.
- **Generous vertical breathing at section scale, tight rhythm inside components.** Big empty bands (~67px block padding) between feature rows; 4–8px rhythm inside the mockups. The contrast of macro-calm / micro-density is what makes a content-heavy page feel unhurried.

## Design-system read
- **Type:** Custom grotesque (`CursorGothic`) for display + UI, `system-ui` for long body, a serif (EB Garamond/Times) for occasional editorial accents, monospace inside code mockups. Scale spans ~11px → 72px; tracking is size-aware — it tightens hard on display (72px at −2.16px, 36px at −0.72px) and opens slightly on small caps-ish labels (14px at +0.14px). Hierarchy is created by size and ink-opacity, almost never by weight.
- **Color:** Warm-neutral base — page `#F7F7F4`, panel `#F2F1ED`, deeper surface `#E6E5E0`; ink `#26251E`. Muted text = the *same ink at 0.5–0.6 alpha* (oklab), so secondary copy is tonally unified, not a separate gray. One brand accent: terracotta `#DB704B` for links/CTAs. The vivid purples/magentas/crimsons in the raw profile are **syntax-highlighting colors inside the code mockups**, not brand colors — kept out of the chrome. Dark theme exists (`#14120B` / `#EDECEC`).
- **Spacing rhythm:** 4px base; 8px the workhorse gap; section padding an order larger (~67px). Whitespace is the primary separator between feature rows.
- **Layout system:** Centered container (~1300px max), repeated **alternating two-column feature rows** — mockup on one side, text on the other, sides flipping down the page. Mockups bleed to / past the panel edge to imply a larger surface. Collapses to a single stacked column on mobile.
- **Motion / easing intent:** Resting page is nearly still. Base transitions 140–200ms on `cubic-bezier(0.4,0,0.2,1)` / `(0.25,1,0.5,1)`. Motion communicates "responsive tool, not a billboard": hover feedback + lively *embedded product demos*, not page-level spectacle. (Details below.)
- **Density:** High information density (long page, many features, changelog, testimonials) kept legible by uniform weight, muted secondary ink, and large inter-section gaps.
- **Hierarchy:** Dominant ordering device is **scale**, with **opacity** as the secondary and **position** (left/right alternation) as the rhythm.
- **Restraint:** No bold-weight headlines, no gradient hero, no drop-shadowed cards everywhere, no multi-color CTA buttons, no decorative 3D. Color saturation is quarantined to the code mockups.

## Interaction & motion (techniques)
- **Pinned header** — *Trigger:* scroll-progress. *Mechanism:* nav switches to `position: fixed` and persists over the warm surface. *Reads as:* always-available navigation on a long page. *Transfers to:* any long marketing/docs page. *Safety:* **production-safe** (compositor-cheap).
- **In-view fade-rise** — *Trigger:* in-view (IntersectionObserver; 11 observers / 27 targets, thresholds like `[0.15,0.35]`, `200px` rootMargin). *Mechanism:* `fadeSlideUp`/`fadeIn` keyframes drive `opacity` + small `translateY` once an element enters the viewport, then stop. *Reads as:* content settling into place, not animating forever. *Transfers to:* section/card reveals on any scroll page. *Safety:* **production-safe** — transform/opacity only; reduced-motion respected. See `patterns/in-view-fade-rise.md`.
- **Live embedded product demos** — *Trigger:* in-view + rAF (299 rAF calls; keyframes `barGrow`, `tilePopIn`, `tabCaretBlink`, `pulse-emit`, `newsletter-submit-pulse`). *Mechanism:* the faux-app mockups self-animate (typing caret, growing bars, popping tiles, pulsing send) to look like a working app. *Reads as:* "the product is alive." *Transfers to:* hero/feature product shots where a static image undersells. *Safety:* **production-safe** if gated to in-view and reduced-motion; watch main-thread cost of many simultaneous rAF loops (**spectacle-only** if every demo runs at once off-screen).
- **Quiet hover feedback** — *Trigger:* hover. *Mechanism:* nav links fade ink to ~75% alpha; primary button darkens `#26251E → #3B3A33`; ghost buttons gain a faint warm fill. 140–150ms. *Reads as:* precise, low-drama affordance. *Transfers to:* any restrained nav/button set. *Safety:* **production-safe**.
- Reduced motion: **respected** (`prefers-reduced-motion` rules present; profile flags it true).

## Production-safety note
- Faux-app mockups with self-running rAF demos are the one cost center: cheap when each is gated to `in-view` + `prefers-reduced-motion`, expensive if all loop continuously off-screen. Everything else (pinned header, fade-rise, hover) is compositor-cheap and production-safe.

## Extracted patterns
- `faux-app-mockup-feature-row` — alternating two-column row pairing a high-fidelity reconstructed product UI with a tight heading + muted body + arrow link; the proof-by-artifact device. Reuse for product-marketing feature sections.
- `in-view-fade-rise` — IntersectionObserver-gated opacity+translateY reveal, fires once, reduced-motion-safe. Reuse for any on-scroll section entrance.
