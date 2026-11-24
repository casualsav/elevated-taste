---
slug: ourplace
url: https://fromourplace.com
source: manual-pick
corpus: production
captured: 2026-06-30
award_type: Manual (ecommerce/dtc)
score: null
tags: [ecommerce, dtc, cookware, home, warm, editorial, light, product]
when_to_use: [ecommerce, product-marketing, landing, brand-experience, navigation, footer]
directions: [editorial, soft]
layout: [content-grid, split-hero]
a11y: [reduced-motion-respected, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [scrolling-trust-marquee, product-carousel-rail]
tokens_snapshot: ../tokens/ourplace.json
screenshots: ../screenshots/ourplace/
---

## What works (transferable principles)

- **A two-family editorial split carries all hierarchy: a warm transitional serif for naming, a tracked grotesque for everything functional.** Every *name* — the `Our Place` wordmark, the H1 "Non-Toxic Cookware, By Design", section titles ("Shop Bestsellers", "New Arrivals", "Happening at Our Place"), product titles ("Titanium Pro Cookware Set") — is set in a Cheltenham-class old-style serif. Every *operational* string — nav labels, prices, descriptions, buttons, the trust bar — is a neutral sans, with nav/labels in **tracked uppercase**. You always know "this is a thing you can buy / a place you can go" because the serif appeared, not because text got bold. Transfers to any DTC/editorial catalog: pick one characterful serif for headings + product names and one neutral sans for UI, and let the *family* signal "content vs chrome" so you barely need a size ramp.

- **A warm-neutral canvas (cream + cocoa ink) makes a busy commerce page feel like a cookbook, not a store.** The page sits on `#FCFAF6` cream with ink at `#35312E` (a warm cocoa-black, never `#000`); product tiles deepen to `#F6F3EB`/`#EBE5D4` sand. Killing pure white and pure black is what makes a homepage stuffed with carousels, prices, and badges still read calm and premium. Transfers to any light-mode retail surface — shift the background a few percent toward warm off-white and the ink toward `#2e2e2e`-warm, and the whole grid stops looking like default Shopify.

- **One terracotta accent does every "act now" job; nothing else is allowed to be loud.** A single clay `#AF5A3C` marks the primary CTA fill, the `SALE` nav item, and all *active* prices — and that's nearly the entire chromatic budget of the chrome. Because the UI is otherwise two warm neutrals, the eye reads terracotta as "this is the money/action color" instantly and consistently. Transfers anywhere: ration the accent to a single hue with a single meaning (commit/price/sale) and let product photography supply the rest of the color.

- **Color bands chapter a long scroll without rules or boxes.** The page paces itself with full-bleed color bands — an olive `#6C674D` promo strip ("SAVE $193…") and trust marquee, then a dusty-blue `#748EA1` footer — dropped between cream content zones. The band changes are the section breaks; there are almost no divider lines or drop-shadowed cards. Transfers to any long marketing/commerce page: use 2–3 brand-tinted full-width bands as punctuation instead of hairline rules, and the page reads as composed chapters.

- **Product cards earn trust with structure, not decoration: name · one-line spec · price-with-savings · finish swatches.** Each bestseller card is image tile → serif name + piece-count → one plain spec line → terracotta price beside a struck-through compare-at price → a row of round color/finish dots (metallic finishes faked with a conic-gradient swatch). It answers "what / how much / which finish" in one glance with zero chrome. Transfers to any multi-variant catalog. (See `product-carousel-rail`.)

- **A repeating trust marquee turns policy fine-print into ambient reassurance.** "100-DAY TRIAL · FREE RETURNS · FREE SHIPPING OVER $135+" scrolls continuously across an olive band. Because it loops, three short promises read as "this brand is low-risk" without occupying a static, skimmable block. Transfers to any DTC/checkout-adjacent page that needs to keep guarantees in view. (See `scrolling-trust-marquee`.)

- **Generous body leading keeps a dense page restful.** Body copy runs 16px at ~1.7 line-height (27px) — unusually airy for commerce. Paired with big section gaps (48–96px), the density of carousels and grids never feels cramped. Transfers wherever information-dense retail content must still feel unhurried: loosen body leading toward 1.6–1.7 before shrinking type or cutting content.

## Design-system read

- **Type:** Two families. A **Cheltenham-class transitional serif** ("Chelt") is the *display + naming* face — wordmark, H1 (60px/66px desktop, 36px mobile), section titles (~28px), product titles. A **grotesque sans** ("Plaid"/Calibre) carries body (16px, 1.7 leading), descriptions, prices, and **tracked uppercase** nav/labels/buttons (12px, +0.96px ≈ +0.08em tracking; 16px at +1.28px). Weights 400 (dominant), 600, 700. Hierarchy = **family + tracking + scale**, in that order — the serif/sans swap does most of the work; weight barely changes.
- **Color:** Warm-neutral system + one accent + two brand bands. `bg #FCFAF6` (cream) → tile `#F6F3EB` → deeper tile `#EBE5D4` → ink `#35312E` → muted `#5A5854`/`#60605E`. Accent: terracotta `#AF5A3C` (CTA fill, SALE, active prices) with a soft tint `#E09D81`. Brand bands: olive `#6C674D` (promo + trust marquee) and dusty blue `#748EA1` (footer). Borders: ink `#35312E` hairlines + a light `#E6E6E6` rule. Press logos are desaturated grey. No dark mode.
- **Spacing rhythm:** 8px base. Common gaps 8/16/24, big section gaps 48/80/96. Inline padding 8/16/24/40/48. Buttons pad ~12–16 block. Whitespace + color bands are the separators.
- **Layout system:** Centered max-width ~1440px with text columns capped ~676–760px. Sticky top utility bar (rotating promo with ‹ › arrows) above a sticky main nav (10 top-level links, centered wordmark, search/account/cart at right). Content is a stack of: 4-up category image-tiles, horizontal **Splide product carousels** with top-right arrow controls, two-up big lifestyle feature cards (image + serif title + sentence + outlined button), a desaturated press-logo row, an editorial carousel, full-width trust marquee, and a multi-column footer. Mobile (390) collapses nav to a hamburger (10→2 links) and grids 2-up → 1-up.
- **Motion / easing intent:** Functional ecommerce chrome only — Splide carousels (26), CSS marquees (3), sticky pins, a one-shot in-view fade, cart-badge micro-pops. No scroll spectacle. Durations 100–600ms; easings `ease`, `cubic-bezier(.4,0,.2,1)`, plus snappier custom curves for carousels. `prefers-reduced-motion` **respected**. Full read below.
- **Density:** High (category grid + multiple product carousels + feature cards + press bar + editorial cards + deep footer), kept legible by airy 1.7 body leading, big section gaps, and the calm two-neutral palette.
- **Hierarchy:** Dominant ordering device is **typeface family** (serif = name, sans = chrome), reinforced by the single terracotta accent and full-width color bands.
- **Restraint:** No drop-shadowed app-cards, no gradients in the UI (conic-gradients appear only inside finish swatches), no second accent hue, no pure black/white, no scroll-jacking. Warmth + rationing is the system.

## Interaction & motion

Our Place is a **live Shopify storefront** — motion is shipping-grade chrome, not spectacle. The capture confirms it: library **Splide** drives **26 carousels**, there are **3 marquees**, **8 IntersectionObservers** but only **1 real in-view fade reveal**, two **pins** (sticky nav + sticky cart), **reduced-motion respected** (`prmRules`, `a11y.reduced_motion: true`). The rAF count (1490) and 16 `<video>` reflect carousel autoplay + an autoplaying testimonial video, not bespoke scroll math. `@keyframes` names corroborate the inventory: `marquee`/`marquee2` (trust band), `slide1…5`/`fadeIn`/`fadeOut` (carousels), `cart-badge-pop`/`cart-badge-radar`/`cart-badge-dot-cycle` (cart micro-states), `shine`/`glow`/`shake` (button/label flourishes).

- **Continuous trust marquee** — *Trigger:* load (autoplay). *Mechanism:* a duplicated track translates on X via a linear `@keyframes marquee` loop on the olive band. *Reads as:* ambient, low-risk reassurance (trial / returns / free shipping). *Transfers to:* any DTC trust/announcement bar. *Safety:* **production-safe** — `transform`-only, GPU-cheap; must pause/halt under reduced-motion. (See `scrolling-trust-marquee`.)
- **Arrow-controlled product carousels** — *Trigger:* tap/drag + ‹ › buttons. *Mechanism:* Splide rail with scroll-snap items and top-right prev/next controls; advances `transform` between slides (~300–600ms snappy easing). *Reads as:* browsable shelf without a long scroll. *Transfers to:* bestseller/related-product rails, testimonial and editorial strips. *Safety:* **production-safe** — keep native focus order and visible controls; reduced-motion should snap without animating. (See `product-carousel-rail`.)
- **Sticky utility + nav pin** — *Trigger:* scroll-progress. *Mechanism:* the rotating promo bar and main nav switch to `position: fixed/sticky` so search/cart stay reachable on a long page. *Reads as:* persistent shopping chrome. *Transfers to:* any long commerce page. *Safety:* **production-safe** (native sticky, no per-frame JS).
- **Cart-badge micro-pop** — *Trigger:* add-to-cart event. *Mechanism:* a short scale/`radar` keyframe on the cart count badge. *Reads as:* "we registered that." *Transfers to:* any cart/notification counter. *Safety:* **production-safe** — tiny, one-shot, gate under reduced-motion.
- **One-shot in-view fade** — *Trigger:* in-view (IntersectionObserver). *Mechanism:* a single content block fades `opacity 0→1` once on first reveal; no per-element stagger. *Reads as:* gentle settling, not a reveal show. *Transfers to:* a hero subhead or a single feature block. *Safety:* **production-safe**.

## Production-safety note

A live shipping ecommerce site; everything is **production-safe**. Real caveats are accessibility/perf, not motion:
- **Reduced-motion must halt the marquee and carousel autoplay** — the site respects it; any reuse must too (`@media (prefers-reduced-motion: reduce)` pauses translation / disables autoplay).
- **Tap targets:** capture flagged ~210 small tap targets among 395 interactive nodes (swatch dots, carousel arrows). Keep finish-swatch and arrow hit-areas ≥44px even if the visual dot is smaller.
- **Contrast:** verify white CTA text on terracotta `#AF5A3C` and any ink-on-band copy meet 4.5:1; muted `#5A5854` on cream is fine for body, borderline for micro-labels.
- Warm-neutral palette, two-family hierarchy, single rationed accent, color-band chaptering, structured product card: all **production-safe**, cheap, framework-neutral.

## Extracted patterns

- **scrolling-trust-marquee** — a continuously looping, `transform`-only band of short trust promises (trial · returns · free shipping) on a brand-tinted strip; reduced-motion-aware; reuse as a DTC announcement/trust bar that keeps guarantees ambient instead of in a static block.
- **product-carousel-rail** — a horizontal scroll-snap product carousel with top-right ‹ › controls, where each card is image · serif name · one-line spec · terracotta price beside a struck-through compare-at · a row of round finish swatches (metallics faked with conic-gradient); reuse for bestseller/related rails in any multi-variant catalog.
