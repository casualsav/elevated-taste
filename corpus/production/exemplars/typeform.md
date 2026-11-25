---
slug: typeform
url: https://www.typeform.com
source: manual
corpus: production
surface: site
captured: 2026-08-24
award_type: null
score: null
tags: [saas, forms, ai, b2b, marketing, purple, dark, serif-display, webflow]
when_to_use: [landing, product-marketing, hero, feature-section, forms]
directions: [editorial, soft]
layout: [center-stack, content-grid]
a11y: [focus-visible, alt-coverage-high, reduced-motion-respected]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [section-corner-glow-band, glow-shadow-card-reveal]
tokens_snapshot: ../tokens/typeform.json
screenshots: ../screenshots/typeform/
---

## What works (transferable principles)
- **Hierarchy from a family switch, not a weight ramp.** Almost every glyph on the page is weight 400 (2131 of ~2160 sampled); emphasis comes from *swapping typefaces* — a humanist serif (Tobias) for display/H2 headlines against a neutral grotesque (Twklausanne) for body, eyebrows, and UI. The serif carries all the editorial "voice," so the page never needs bold to signal importance. Transfers to any brand that wants a magazine tone without shouting: pair one serif for headlines with one grotesque for everything functional and keep weight flat.
- **A single warm-dark hue owns the whole system.** The dark ground is not black but a plum/aubergine `#2a222b`, and the light ground is a faintly-lavender off-white `#faf9fb` — both pulled off the neutral axis toward the brand purple. Because bg, fg, and surface all lean the same direction, the page feels tinted and deliberate rather than default. Reusable rule: pick a near-neutral for your darkest and lightest values that carries a trace of the accent hue; it unifies the palette for free.
- **Depth is painted inside sections, not stacked in fixed layers.** The page is a single flat scroll (no parallax backdrop, no blend overlay). Dimension comes from *corner-anchored radial blooms* (`radial-gradient(circle farthest-side at 100% 0, purple, transparent 33%)`) placed in the corners of dark bands, plus product mockups that carry a colored **glow-shadow** (`box-shadow: rgb(182,109,213) 0 0 15px`). Cheap, GPU-friendly, and it makes flat screenshots read as luminous objects. Transfers to any dark marketing page that wants richness without a WebGL budget. See `section-corner-glow-band`, `glow-shadow-card-reveal`.
- **Alternating light/dark bands pace a long page.** Sections flip between the aubergine dark and the off-white light on a regular cadence, each opening with a colored eyebrow tag ("INTELLIGENT FORMS", "GROWTH FLOW"). The rhythm chunks a feature-dense scroll into legible chapters and lets the serif headline re-assert the brand at each transition. Transfers to any long product-marketing page: alternate ground value per section instead of running one continuous surface.
- **A closed token system underneath a loose-looking page.** 244 CSS custom properties expose full color primitive ramps (neutral/purple/lavender/blue/green/yellow/red, steps 25→1000), a heading size scale, spacer scale, and corner-radius tokens. The "soft, editorial" surface is engineered from a strict system — the lesson is that warmth and rigor are not opposed; name every value and the improvisation stays coherent.
- **Restraint makes the purple land.** Purple appears only as eyebrow tags, link/highlight text, glow blooms, and glow-shadows — never as large fills. Because the rest is neutral aubergine + off-white, the accent reads as luminous signal. The discipline (scarce accent on a near-neutral field) is what makes a single hue feel like a brand rather than a theme.

## Design-system read
- **Type:** Two families doing opposite jobs. Tobias (serif) for `heading-display` 5rem / `heading-two` 4rem with tight negative tracking (−2px H1/H2, −1px display) and ~1em leading; Twklausanne (grotesque, weights 350/400/500/600) for body 1rem, eyebrow 0.875rem, and smaller headings. Scale is a ~1.33 (perfect-fourth) ramp: 5 / 4 / 3 / 2.25 / 1.875 / 1.5 / 1rem. Fluid (`clamp`) between breakpoints. Hierarchy = scale contrast + family switch; weight stays ~400 throughout.
- **Color:** Warm-dark identity. Ground `#2a222b` (neutral-1000, aubergine) alternating with `#faf9fb` (neutral-25, lavender-white). Fg inverts per band (off-white on dark, aubergine on light). Muted `#d4d1d5` / `#837a85`. Surfaces `#eeecee`. Accent is a purple ramp: eyebrow `#a25fba`, highlight/link `#9454ab`, bloom `#753a88`, glow-shadow lavender `#b66dd5`/`#ddb7f0`. Tinted social-proof cards borrow turquoise/yellow/lavender radial fills. Semantic ramps (blue/green/yellow/red) exist but stay off the marketing surface.
- **Spacing rhythm:** 0.25rem base. Spacer scale .125/.25/.5/.75/1.25/1.5/2/2.5/3/4/5rem; section vertical spacing 1.5/3/4rem, section padding up to 7.5rem. Dominant gaps 8/16/32px. Generous section padding keeps a dense page calm.
- **Layout system:** Flex-dominant (606 flex vs 11 grid) over a 12-col grid, 32px gutters. Content sits at ~85% width inside a 80rem (1280px) / 96rem (1536px) max. Hero is center-stacked; features are two-column text+media rows that alternate image side; social proof is a bento/Swiper carousel of tinted cards. Collapses to 1-col on mobile.
- **Layering / page architecture:** Single flat scroll — `has_static_backdrop: false`, `has_blend_overlay: false`. Only a sticky transparent nav (z99) and the cookie banner (fixed, OneTrust) sit above the flow. Depth is intra-section: corner radial blooms + colored glow-shadows. `mix-blend-mode: darken` ×8 knocks white backgrounds out of partner logos. Z-order is otherwise shallow (mostly z 1–3).
- **Motion / easing intent:** GSAP + ScrollTrigger + Swiper + Webflow IX2 (+ SplitText, MotionPathPlugin). Base durations 200/250/300/350/400/800ms with two long linear loops (20s hero wave, 90s logo marquee). Easings: `ease-out`, `cubic-bezier(0.165,0.84,0.44,1)`, `cubic-bezier(0.33,1,0.68,1)`. Motion is ambient and confirmational, not spectacle. `prefers-reduced-motion` respected (5 PRM rules).
- **Density:** Medium-high content, low visual density — whitespace and band alternation do the separating so it never feels crowded.
- **Hierarchy:** Scale + family switch first; colored eyebrow tags second; position third.
- **Restraint:** No bold-weight ramp, no dark-mode toggle (the aubergine IS the identity), no fixed-layer parallax theater, purple never used as a large fill.

## Interaction & motion (techniques)
- **Dual-direction infinite logo marquee** — *Trigger:* load (autoplay). *Mechanism:* two duplicated logo tracks translate on `transform: translateX` via CSS `@keyframes marquee` / `marquee-reverse`, 90s linear infinite, opposite directions; `animation-play-state: paused` on container hover. *Reads as:* a living wall of integrations/customers. *Transfers to:* trust rows, integration walls, logo clouds. *Safety:* **production-safe** — transform-only, GPU-cheap; pause-on-hover aids reading. (See existing `duplicated-track-marquee` / `pause-on-hover-tag-marquee`.)
- **Corner-anchored radial bloom** — *Trigger:* static. *Mechanism:* a `radial-gradient` positioned at a section corner (`at 100% 0`, `at 0 100%`) fading purple→transparent by 33%, painted as a section background layer. *Reads as:* the dark band is lit from a corner, giving flat content depth. *Transfers to:* any dark hero/CTA/feature band. *Safety:* **production-safe** — pure paint, no JS. See `section-corner-glow-band`.
- **Glow-shadow product cards** — *Trigger:* in-view (IntersectionObserver, 8 observers / 16 targets, threshold 0.1, rootMargin 50px). *Mechanism:* product mockups carry a colored `box-shadow` halo and fade-rise (`opacity` + `translateY`) as they enter view. *Reads as:* luminous, floating UI. *Transfers to:* screenshot/feature cards on dark grounds. *Safety:* **production-safe** — animates only opacity/transform; glow is static shadow. See `glow-shadow-card-reveal`.
- **Scroll-progress parallax** — *Trigger:* scroll-progress. *Mechanism:* the integrations track and a header logotype translate as a function of scroll position (ScrollTrigger). *Reads as:* subtle spatial life. *Transfers to:* decorative bands. *Safety:* **production-safe** in small doses; transform-only. Keep displacement small to avoid layout thrash.
- **Swiper customer-stories carousel** — *Trigger:* drag/tap + pagination dots. *Mechanism:* horizontal slide track of tinted social-proof cards with a hover shine (radial-gradient sweep, opacity transition). *Reads as:* browsable proof. *Transfers to:* testimonials, case-study reels. *Safety:* **production-safe**; ensure dots are real buttons and arrows are keyboard-reachable.
- **Hero wave visualizer** — *Trigger:* load loop. *Mechanism:* a radial "wave bar" element (`gr2_hero_bg-wave-bar-radial`, `will-change: transform`, VOLUME_*_WAVE_FLASH keyframes) animates behind the hero card. *Reads as:* a form "responding" — voice/energy. *Transfers to:* AI/voice product heroes. *Safety:* **production-safe** but decorative; gate under reduced-motion.

## Production-safety note
All motion here is confirmational and transform/opacity-based; nothing is spectacle-only. `prefers-reduced-motion` is honored. Watch two things if you borrow: (1) 50 small tap-targets were flagged — size nav/footer links to ≥44px; (2) the 90s marquee and hero wave loops run indefinitely — pause them off-screen and under reduced-motion to save battery/main-thread.

## Extracted patterns
- `section-corner-glow-band` — a warm-dark feature/CTA band with a corner-anchored radial purple bloom for depth without fixed layers.
- `glow-shadow-card-reveal` — a product/screenshot card that carries a colored glow-shadow and fade-rises into view, gated by IntersectionObserver and reduced-motion.
