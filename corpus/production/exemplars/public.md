---
slug: public
url: https://public.com
source: manual-pick
corpus: production
captured: 2026-06-30
award_type: Manual (fintech/investing)
score: null
tags: [fintech, investing, consumer, b2c, premium, data, app-marketing]
when_to_use: [landing, product-marketing, hero, feature-section]
directions: [minimalist, editorial]
layout: [bento]
a11y: [reduced-motion-respected]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [outlined-capability-pill-cloud, rotating-gradient-cta-border]
tokens_snapshot: ../tokens/public.json
screenshots: ../screenshots/public/
---

## What works (transferable principles)
- **A light-weight serif carries the emotion; a neutral sans carries the work.** Every headline is set in a high-contrast display serif (Denton) at **weight 300** — thin, editorial, almost literary ("Investing for those who take it seriously") — while all UI, labels and body run in Inter 400. The serif is rationed to ~70 elements across the whole page; it shows up only at chapter heads, so each one reads as a considered statement rather than chrome. Transfers to any product that wants to feel premium/serious without going ornate: pick *one* serif, keep it light, and use it *only* for the few sentences that matter.
- **Three type roles, not two — add a dedicated face for numbers.** Beyond serif-display + sans-UI there's a third branded family ("Invest Pro") reserved for figures, prices and tickers. Money UIs live or die on whether $1,204.58 aligns and reads as data; giving numerals their own face (tabular, mono-ish) makes every price, yield and chart label feel instrument-grade. Transfers to any fintech/analytics/dashboard surface. See `typographic-role-split`.
- **Hairline borders instead of shadows.** The computed profile has *zero* box-shadows; separation comes entirely from 1px borders in a pale slate (`#DCE2EA`/`#F1F4F7`) and from whitespace. Cards, pills and panels sit flat on the page, which reads as engineered and trustworthy rather than floaty-marketing. Transfers anywhere you want a "precise" feel — borders + space scale to dense data far better than stacked drop-shadows.
- **Show the product UI, don't describe it.** Feature sections are bento grids where each tile embeds a real screenshot (or autoplaying video loop) of the actual app — Agents, Market briefing, Earnings-call summaries, Income Hub — under a one-line serif heading and a "Learn more" link. The proof *is* the interface. Far more credible than icon-plus-paragraph feature cards. See `embedded-product-frame`.
- **Full-bleed inverted bands are the chapter breaks.** The page paces a long scroll by flipping the canvas — off-white product sections, then full-black bands for "The new standard. For active trading." and "Secure by design." The colour switch *is* the section divider, so each band runs edge-to-edge and gets its own mood (the black bands feel like the "serious money" rooms). Transfers to any long marketing page: vary the ground, not the container.
- **Enumerate breadth as an outlined pill cloud.** Instead of a feature list, the full asset/product range (Stocks · Bonds · Treasuries · Options · Crypto · ETFs · Bond Account · IRAs · Agents · API…) is a centered, wrapping cloud of hairline-bordered chips. It signals "we do everything" in one calm scannable block without a wall of copy. See `outlined-capability-pill-cloud`.
- **Cool, desaturated, near-monochrome palette = trust.** White/off-white grounds, near-black ink, a slate-blue-gray muted family (`#516880`, `#A8B4BF`), and **black** (not a bright brand color) as the CTA fill. Colour is almost absent, so the few accents — a green yield figure, a chart line — actually carry meaning. Transfers to any product selling reliability over excitement.

## Design-system read
- **Type:** Three-role system. **Display** = Denton serif, weight **300**, H1 48px desktop / 32px mobile, line-height ~1.12. **UI/body** = Inter 400 at 16px (`leading` 1.5). **Data/numerals** = "Invest Pro". Hierarchy is created by **family contrast + scale** (3× body→display), almost never by weight — the page has essentially one sans weight (400) and one serif weight (300). Tiny 9–12px Inter handles the dense legal footer.
- **Color:** Near-monochrome. Grounds white `#FFFFFF` / off-white `#FAFAFA`; surfaces/borders pale slate `#F1F4F7` & `#DCE2EA`; ink near-black `#000`; muted text slate-blue `#516880`; a lighter slate `#A8B4BF` for de-emphasized fills. **Action = black**, not a saturated hue. Inverted bands flip to `#000` ground / white ink. The `#0000EE` blue in the raw profile is overwhelmingly *unstyled legal-footer links*, not a decorative accent — treat blue as a functional link color only.
- **Spacing rhythm:** 8px base. Component padding 8/12/16/24px; section padding climbs to 60/112/160px — the generous block padding is what lets full-bleed bands breathe.
- **Layout system:** Centered container ~1344px (narrows to ~640–710px for prose/CTA). Bento/flex feature grids of 2–6 columns that stack to one column on mobile; body stays 16px desktop→mobile (reflow by stacking, not shrinking). Hamburger nav under ~700px.
- **Motion / easing intent:** A *resting* page. Durations 100–300ms on `ease-in-out` / `ease-out` / `cubic-bezier(0.4,0,0.2,1)` / `cubic-bezier(0.215,0.61,0.355,1)`. Motion communicates "alive, not animated": a sticky header, gentle in-view reveals, looping product-demo videos, and one rotating-gradient glow on the primary CTA. `prefers-reduced-motion` is respected.
- **Density:** High content density (long page, many product surfaces, an enormous compliance footer) kept legible by band-pacing, hairline separation, and big section padding.
- **Hierarchy:** Dominant ordering device is **scale + family** (which face you're reading), reinforced by **canvas color** (which band you're in).
- **Restraint:** No drop-shadows, no gradient decoration, no bright brand-color splash, no oversized-hero-then-three-cards template. One serif weight, one sans weight, borders not shadows, black not blue.

## Interaction & motion (techniques)
Evidence: 9 `@keyframes` (`reveal`, `pulsate-icon`, `rotate`, `bg-btn-blue-gradient`, `borderTurn`, `borderTurnWithTranslate`, `show`, `hide`, `swiper-preloader-spin`), 3 IntersectionObservers over 12 targets (one with `rootMargin: 0px 0px -95% 0px`), 7 `position:fixed` pins (all header/nav chrome), 4 autoplay videos, 0 entrance reveals captured in frames, `respectsReducedMotion: true`. The page is largely static-with-flourishes.
- **Sticky header with backdrop** — *Trigger:* scroll-progress. *Mechanism:* the nav, logo and a `nav-backdrop` are `position:fixed`; the backdrop fades/solidifies as the page leaves the hero. *Reads as:* persistent wayfinding without stealing height. *Transfers to:* any long marketing/app page. *Safety:* **production-safe**. See `inverting-sticky-header`.
- **Rotating-gradient CTA glow** — *Trigger:* load/loop. *Mechanism:* `borderTurn`/`borderTurnWithTranslate` rotate a conic-gradient inside a masked wrapper (the `glowing-wrapper-glow/mask/borders` layers), drawing a slowly turning light around the primary button's edge. The matrix rotation in the profile is this turn, *not* a cursor-follower. *Reads as:* the one "premium" flourish on an otherwise flat page; pulls the eye to sign-up. *Transfers to:* a single hero/pricing CTA — ration it to one. *Safety:* **production-safe** (animates a decorative pseudo-layer, GPU transform); must drop to a static border under reduced motion. See `rotating-gradient-cta-border`.
- **In-view reveal** — *Trigger:* in-view. *Mechanism:* a `reveal` keyframe gated by IntersectionObserver (threshold 0/0.1) fades/rises blocks as they enter — subtle, transform/opacity only. *Reads as:* content "settles in" without popping. *Transfers to:* any long page. *Safety:* **production-safe**. See `scroll-reveal-in-view`.
- **Autoplay product-demo loops** — *Trigger:* load/in-view. *Mechanism:* 4 muted looping videos sit inside feature cards showing the live app instead of a static screenshot. *Reads as:* "the product really does this." *Transfers to:* feature bento tiles. *Safety:* **production-safe** if muted, lazy, and paused under reduced motion / off-screen.
- **Hover dropdown menus** — *Trigger:* hover. *Mechanism:* `show`/`hide` keyframes reveal mega-menu panels; nav items invert (transparent→pale fill, white→black ink) on hover. *Safety:* **production-safe**.

## Production-safety note
Everything animates `transform`/`opacity` or a decorative gradient layer — no scroll-event handlers driving layout properties. The only loop watch-items are the rotating CTA glow and the autoplay videos: both must fall back to a still state under `prefers-reduced-motion: reduce` (the site sets `prmRules` and reports reduced-motion respected).

## Extracted patterns
- `outlined-capability-pill-cloud` — a centered, wrapping cloud of hairline-bordered chips that enumerates a product/asset range in one scannable block; reuse for "everything we offer" without a copy wall.
- `rotating-gradient-cta-border` — a slowly turning conic-gradient glow masked to a button's border, as the single premium flourish on a flat page; reduced-motion-aware.
