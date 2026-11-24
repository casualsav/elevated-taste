---
slug: lassie
url: https://www.lassie.ai
source: manual-pick
corpus: production
captured: 2026-06-30
award_type: Manual (healthcare AI / B2B automation product marketing)
score: null
tags: [ai, healthcare, health-tech, b2b, saas, automation, agents, revenue-cycle, serif, light]
when_to_use: [landing, product-marketing, hero, feature-section, interactive-showcase]
directions: [editorial, minimalist]
layout: [center-stack]
a11y: [reduced-motion-ignored]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [register-shift-hero, in-view-scale-rise]
tokens_snapshot: ../tokens/lassie.json
screenshots: ../screenshots/lassie/
---

## What works
- **A serif editorial voice on a warm-stone canvas humanizes a back-office automation product.** Healthcare/billing AI defaults to cold enterprise blue-on-white; Lassie instead sets every headline in a literary serif (abcMarist) over a 3–4% warm off-white (`#f9f8f5`, not `#fff`) with a single calm sky-blue accent. Mechanism: serif + warm neutral + one-hue restraint reads as *care and calm* rather than *software*. Transfers to any health, care, or consumer-finance product that must feel human while selling precision.
- **Register-shift between an emotional serif headline and literal sans product proof.** The hero says, in serif italic, *"You're a doctor. Not a machine."*; the floating UI cards say, in clean dmSans/dmMono, *"Completed Humana enrollment," "Called Cigna for claim status."* Two type voices do two jobs — the serif sells the feeling, the sans proves the function. Transfers to any product marketing that must sell both an outcome and the mechanism behind it. See `patterns/register-shift-hero.md`.
- **Hierarchy is pure scale contrast in one weight, not weight or color.** ~86px display over 17px body is a ~5× jump, and tracking tightens as size grows (−1.73px at display, easing to near-zero at body) so big type reads as one confident shape. Weight barely varies (350 serif / 400 sans). The page stays calm because color and weight are held constant and *size* carries the whole order. Transfers to any editorial-leaning page that wants authority without bolding.
- **Whitespace is the pacing device — sections breathe at 160–270px vertical padding.** Product fragments float alone in large negative space, so each idea lands by itself before the next arrives; the page reads unhurried and premium. Cost to copy honestly: it makes the page *very* long (the full desktop capture is mostly air) — only worth it when the brand sells calm. Transfers to confident, low-density brand-marketing pages.
- **Shadowless elevation.** There is not a single box-shadow on the page. Depth comes from stepped warm surfaces (`stone-100/200/300`), hairline borders, and soft gradients. The result avoids the "floating card" cliché and reinforces the flat, calm register. Transfers to any soft/editorial system that wants depth without drop-shadows.
- **Two-accent discipline with saturation saved for the close.** A calm sky-blue owns the product/UI world (gradients, the hero sky); a single warm amber appears only once, on the closing *"A breath of fresh air for your office"* CTA band. Scarcity of saturation makes that band the page's unmistakable conversion anchor. Transfers to any long page that wants one undeniable final CTA.
- **The product narrates its own work instead of showing a fake dashboard.** "Trusted by 2,500+ doctors nationwide" sits over an interactive US map (canvas) with real-sounding task notifications animating in — Lassie *performing the job* rather than a screenshot of a UI. Tangible proof beats a mockup. Transfers to any automation/agent product proving throughput.

## Design-system read
- **Type:** three families, clear roles — abcMarist serif is the **display voice** (every H1/H2, hero, stats; warm, human), dmSans is **body + all product UI/nav/buttons** (precise), dmMono is reserved for **micro-labels and stats**. Scale ≈ 14 · 17(body) · 20 · 25 · 58 · 86, fluid via `clamp()`; ratio loose ~1.4–1.5 between display steps. Hierarchy = scale + size-proportional negative tracking; leading tight on display (~0.95–1.05), open on body (~1.5). Root is 62.5% (1rem=10px).
- **Color:** warm-stone base (`#f9f8f5`), white raised surfaces, warm near-black ink (`#1a1613`), muted grey secondary (`#666`). One calm sky-blue accent (`#42b5dc`) with pale blue surfaces (`#ddf3f9` / `#c3eaf4`) for the hero/section gradients; a single warm amber (`#f99c00`) for the closing band. No dark mode on this page.
- **Spacing rhythm:** 8px base. Intra-component gaps cluster at 16/24/32px; section vertical rhythm is deliberately huge (80 → 160 → 200 → 270px padding-block). Whitespace, never rules, separates sections.
- **Layout system:** single-column, centered editorial flow; content max ~766px for prose, up to 1350–1440px for full-bleed media and the map. The "How Lassie works" row is a 3-up flex grid of product-UI cards collapsing to one column on mobile. No multi-column body grid — the page is a vertical scroll narrative.
- **Motion / easing intent:** scroll-driven and abundant — parallax, scale, fade-rise, sticky pin. Durations 150–1000ms; easings `cubic-bezier(0.4,0,0.2,1)` and a springy `cubic-bezier(0.22,1,0.36,1)`. Motion communicates *arrival and aliveness* (the product working). Detail below.
- **Density:** low resting density held legible by alternating warm/blue bands, one ink color, serif headers as anchors, and a 7-item FAQ accordion that hides detail until tapped.
- **Hierarchy:** dominant device is **scale** (display vs body), reinforced by **position** (centered headers) and **register** (serif vs sans).
- **Restraint:** one type-voice per role; one product accent + one closing accent; zero shadows; no rainbow of borders. What they did NOT do: no oversized-hero-+-three-feature-cards-+-fake-dashboard template, no multi-accent palette, no drop-shadow elevation.

## Interaction & motion
- **In-view scale-rise on proof cards** — *Trigger:* in-view (IntersectionObserver, thresholds 0/0.1). *Mechanism:* testimonial cards transform `scale(0.5→1)` with an opacity fade as they enter the viewport; a testimonial thumbnail goes `scale(2→1)`. *Reads as:* each proof point "pops into place," giving the calm page punctuation. *Transfers to:* testimonial rows, stat reveals, feature cards. *Safety:* **production-safe** (transform/opacity only). See `patterns/in-view-scale-rise.md`.
- **Scroll-progress parallax on floating notification cards** — *Trigger:* scroll-progress (rAF loop). *Mechanism:* the task cards over the US map ("Called Cigna…", "Completed Humana enrollment") translate at differing rates against the map, driven by scroll position. *Reads as:* a living workspace, not a static graphic. *Transfers to:* "watch it work" product-proof sections. *Safety:* **production-safe** but watch cost — this page runs a heavy rAF/scroll loop (4953 rAF calls, 11 mousemove + 7 scroll listeners). Keep transforms compositor-only and throttle.
- **Scroll-progress scale on media** — *Trigger:* scroll-progress. *Mechanism:* the hero video eases `scale(1.05→1)` and a product video `scale(0.95→1)` as their section crosses the viewport, with a background crossfade from stone to transparent. *Reads as:* media "settles" into the page. *Transfers to:* full-bleed media reveals. *Safety:* **production-safe** (transform/opacity).
- **In-view fade-rise on section headers and copy** — *Trigger:* in-view. *Mechanism:* headlines/paragraphs `opacity 0→1` + small upward translate when scrolled into view. *Reads as:* unhurried arrival matched to the page's calm. *Transfers to:* any long scroll narrative. *Safety:* **production-safe**.
- **Sticky nav pin with in-view color/background flip** — *Trigger:* scroll-progress + in-view. *Mechanism:* the nav stays `position: fixed`; nav-item background and "Login" text shift (white→warm ink) as it leaves the media hero. *Reads as:* chrome that re-themes to stay legible over light and dark sections. *Transfers to:* any media-hero site. *Safety:* **production-safe**.
- **Stat headline pin-shrink** — *Trigger:* in-view. *Mechanism:* "Trusted by 2,500+…" transforms `scale(1→0.7)` as it pins. *Reads as:* a flourish, but mild motion-sickness risk on a long parallax page. *Safety:* **spectacle-only** — gate behind reduced-motion.

Evidence: 11 scroll frames + `motion.summary` show heavy scroll choreography — 37 scroll effects (15 parallax, 7 scale, 5 opacity, 2 pin, 2 background-shift), 6 IntersectionObservers over 10 targets, 4953 rAF calls, 0 CSS `@keyframes` (all motion is JS-driven transforms). 0 measured hover/cursor effects. **`prefers-reduced-motion` is NOT respected** — the single biggest fix when borrowing from this page.

## Production-safety note
The aesthetic (serif-on-warm-stone, shadowless, two-accent) is fully production-safe and is the part to copy. The motion is mostly production-safe *in kind* (transform/opacity), but this implementation has two real costs: (1) a heavy continuous rAF/scroll loop, and (2) **no reduced-motion gate at all**. If you reuse the parallax/scale/pin choreography, wrap every effect in `@media (prefers-reduced-motion: reduce)` to jump to the end state, prefer CSS scroll-driven animations or IntersectionObserver over a global scroll handler, and treat the stat pin-shrink as spectacle-only.

## Extracted patterns
- `register-shift-hero` — full-bleed media hero whose emotional serif headline names the human ("You're a doctor. Not a machine.") while sans/mono product cards prove the function; the two type registers split feeling from mechanism.
- `in-view-scale-rise` — proof/testimonial cards that scale-and-fade up on entering the viewport via IntersectionObserver + CSS, with a mandatory reduced-motion fallback.
