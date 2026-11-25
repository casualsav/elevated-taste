---
slug: shopify-checkout
url: https://www.shopify.com/checkout
source: manual
corpus: production
surface: site
captured: 2026-08-31
award_type: null
score: null
tags: [ecommerce, saas, b2b, fintech, dark, product-marketing, variable-font]
when_to_use: [product-marketing, feature-section, landing, interactive-showcase, checkout]
directions: [minimalist, soft]
layout: [scroll-theater, dense-grid]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [scrollytelling-annotated-demo, dense-feature-index-grid]
tokens_snapshot: ../tokens/shopify-checkout.json
screenshots: ../screenshots/shopify-checkout/
---

## What works (transferable principles)
- **One product artifact, annotated by scroll.** The demo section pins a single realistic UI screenshot (an actual checkout) in the center and reveals labeled "capability pills" around it as you scroll — each pill (`Enable Shop Pay`, `Add express checkout`, `Enable local delivery`…) fades in tied to a scroll position. Instead of a wall of feature cards, the reader watches one concrete object accrue meaning. Transfers to any "our product does N things" section: show the thing once, let scroll narrate it. See `scrollytelling-annotated-demo`.
- **Section-as-band color blocking carries hierarchy, not decoration.** The page is a vertical stack of full-bleed bands each owning a single ground — near-black hero, saturated Shop-Pay purple, white customization band, deep-navy developer band, black feature index. Meaning is chunked by background swap, so within each band the type system can stay almost monochrome. Transfers to long marketing pages: change grounds between topics, keep the type quiet inside each.
- **Big rounded-top overlap stitches the bands.** Each new band starts with a large top radius (`--radius-theme-5xl`) and pulls up over the band above it, so transitions read as one continuous surface sliding rather than hard seams. A cheap, production-safe way to make a stacked-band page feel crafted. See tokens `radius.section`.
- **Hierarchy from scale + a variable-font micro-weight ramp, never bold.** Body and nearly every heading share one family (Inter) at weights that step in fine increments — 400 / 420 / 450 / 550 — not the usual 400/700 jump. Emphasis comes from *size* (a 6rem display against 1rem body) plus a barely-heavier weight, so the page reads calm and premium even at high density. Transfers anywhere a variable font is loaded.
- **Size-proportional tracking ramp.** Tracking tightens as type grows and *opens* below body: 56px→−0.01em, 24px→−0.01em, 16px→−0.01em, but 12px eyebrows→+0.06em uppercase. One rule (bigger = tighter, tiny-caps = looser) applied across the whole scale keeps optical rhythm consistent. Reusable as a token ramp.
- **A dense index grid can replace a "features" dumping ground.** The closing "Shopify Checkout features" section is a 3-to-4-column grid of ~24 tiny cells — icon + label + one line each — on black. It reads as a confident catalog ("there are this many") rather than three padded hero cards. Transfers to any product with a long capability list. See `dense-feature-index-grid`.
- **Restraint at the top.** The hero is a small eyebrow, a two-line display headline, a compact 3-metric stat row, one primary button, and a floating product screenshot — no gradient mesh spectacle, no three feature cards. The proof (metrics + real UI) does the work.

## Design-system read
- **Type:** One family, `Shopify-Inter` (Inter). Responsive token scale (values swapped at breakpoints, not `clamp()`): display `--text-dsp` 6rem; heading ramp `t1` 4rem → `t8` 1rem; body 1rem/1.5. Hierarchy = scale contrast (≈6× display-to-body) + micro-weight ramp 400/420/450/550 + size-proportional tracking. Tabular numerals (`font-feature: "tnum"`) on the stat/price figures.
- **Color:** Multi-ground, not one palette. Grounds: near-black `#02090a` / `#000`, Shop-Pay purple field (`#6639f6` core, `#4321b4` shade, `#7951ff` tint), white `#fff`, deep navy `#01072c`. Ink is off-white on dark, near-black `#000`/`#0009` on light; muted `#737373` / `#a1a1aa`. Accent is the single purple `#8645f6`; lime `#e7fe8e` and mint `#36f4a4` appear only as brand-sample confetti in the customization gallery. Semantic error `#f54344`.
- **Spacing rhythm:** 4px base (`--spacing` unit), rem scale — xs .5, sm 1, md 1.5, lg 2, xl 2.5, 2xl 4, 3xl 5, 4xl 8rem. Section vertical padding runs 80–128px; content columns cap ~600px inside a 72rem (`--container-6xl`) frame. Whitespace, not rules, separates.
- **Layout system:** 12-col grid (collapses to 1 on mobile) but most sections are a centered narrow measure or an asymmetric split (pinned artifact + copy). Flex-dominant (840 flex vs 27 grid nodes). Breakpoints token-swap type and spacing rather than reflowing structure.
- **Layering / page architecture:** Single flat scroll with a pinned header (`z-50`, transparent→solid) and, in the demo band, a **sticky product artifact** that holds center-screen while annotation pills scroll-reveal around it (`architecture.layers`: sticky `w-[365px]` + a `mix-blend-plus-lighter` glow plate behind it). No full-viewport backdrop; depth comes from band color changes and the rounded-top overlaps, plus a soft float shadow (`0 30px 40px -15px rgba(0,0,0,.2)`) under the hero screenshot. `has_static_backdrop: false`.
- **Motion / easing intent:** House timing is 150/200/300ms on `cubic-bezier(0.4,0,0.2,1)` (standard). Motion is quiet and functional — in-view fades and a sticky scrollytelling reveal — never spectacle. `prefers-reduced-motion` is respected (dedicated PRM rules).
- **Density:** Mixed by band — airy hero, then a very dense feature index. Legible because density is quarantined to its own black band with a strict icon/label/line cell template.
- **Hierarchy:** Scale is the dominant ordering device, color-ground second, weight a distant third.
- **Restraint:** No oversized gradient hero, no fake-3D, no carousel, no hover choreography (0 hover effects probed). Emphasis weight capped at 550. Accent color used sparingly.

## Interaction & motion (evidence-backed)
- **Sticky scrollytelling annotated demo** — *Trigger:* scroll-progress + in-view. *Mechanism:* a checkout screenshot is `position: sticky` and pins center-viewport; IntersectionObservers with band rootMargins (`-70% 0px -30% 0px`, `-55%/-45%`, `-40%/-60%`) detect which step is "active" as you scroll and fade its labeled pill from `opacity .2→1`. *Reads as:* a guided tour of one real object. *Transfers to:* feature tours, onboarding explainers, spec call-outs. *Safety:* **production-safe** — only `opacity`/`transform` animate; sticky is cheap; reduced-motion drops to all-visible. See `scrollytelling-annotated-demo`.
- **In-view fade-rise reveals** — *Trigger:* in-view (IntersectionObserver, threshold 0/0.2, rootMargin `0px 0px -250px 0px`). *Mechanism:* section blocks fade `0→1` (some with a small translate) as they enter. *Reads as:* content settling in on arrival. *Transfers to:* any long page. *Safety:* **production-safe**; PRM-gated.
- **Parallax on embedded media** — *Trigger:* in-view. *Mechanism:* Wistia video wrappers and an SVG group get small `transform` offsets vs scroll. *Reads as:* subtle depth on the product clips. *Transfers to:* media-in-context. *Safety:* **production-safe**, low amplitude; keep off the main thread.
- **Pinned header state** — *Trigger:* scroll. *Mechanism:* sticky header (`z-50`) transitions background/ink as the page scrolls off the dark hero. *Reads as:* persistent, unobtrusive nav. *Transfers to:* any marketing shell.
- The only CSS `@keyframes` are audio-meter flashes inside the Wistia player (`VOLUME_*_WAVE_FLASH`) — incidental, not page choreography. No cursor followers, carousels, or hover animations detected.

## Production-safety note
- Everything here is **production-safe**: opacity/transform-only, IntersectionObserver-driven, `prefers-reduced-motion` respected. Watch the one a11y flag — 58 sub-44px tap targets flagged (dense footer/feature links); enlarge hit areas when porting the dense grid to touch.

## Extracted patterns
- `scrollytelling-annotated-demo` — pin one real UI artifact; reveal labeled capability pills around it on scroll. Reuse for feature tours / product explainers.
- `dense-feature-index-grid` — a many-cell icon+label+line grid on a dark band that replaces the three-card "features" cliché with a confident catalog.
