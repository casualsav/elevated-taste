---
slug: mercury
url: https://mercury.com
source: manual-pick
corpus: production
surface: site
captured: 2026-06-30
award_type: Manual (fintech/dashboard)
score: null
tags: [fintech, banking, b2b, dashboard, premium, minimal, dark, dual-theme]
when_to_use: [landing, product-marketing, feature-section, hero, navigation, pricing]
directions: [minimalist, soft]
layout: [center-stack, bento]
a11y: [reduced-motion-ignored]
provenance:
  gallery_url: https://mercury.com
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [shadowless-ground-card-grid, multi-band-nav-retheme]
tokens_snapshot: ../tokens/mercury.json
screenshots: ../screenshots/mercury/
---

## What works
- **Depth without shadows.** There is not a single drop shadow on the page (the raw elevation profile is all-zero). Cards, media tiles and the nav read as layered purely through *ground inversion* — a light card on a dark band, or a dark card on a light band — plus a 1px hairline (`rgba(175,178,206,0.36)`) and generous radius. Transfers to any product UI that wants to feel calm and precise instead of "floating": replace `box-shadow` elevation with a contrast step in background + a hairline.
- **Hierarchy from scale + a display cut, never weight.** The entire page lives in a 360–480 font-weight band — there is no true bold anywhere. A heading reads as a heading because it's 3–4× the body size and set in the `arcadiaDisplay` cut, not because it's heavier. This keeps long financial/legal copy feeling editorial and unshouty. Reusable wherever you want emphasis without the "marketing bold" look.
- **Alternating dark/light bands as a pacing device.** Rather than one background, the page is a stack of full-bleed bands that flip between near-black `#171721` and white/`#f4f5f9`. Each flip resets attention and chunks the long page into digestible acts (hero → social proof → product → press → split CTA). The rhythm does the work a divider or shadow normally would. See `patterns/multi-band-nav-retheme`.
- **One saturated color, rationed.** Iris `#5266eb` appears almost exclusively on the primary "Open account" button; secondary CTAs drop to a translucent `accent-soft` tint of the same hue. Everything else is greyscale on the two grounds. The scarcity is what makes the one blue button unmissable — a transferable rule: spend saturation only on the single next action.
- **Slightly positive tracking on labels signals engineering.** Small text, eyebrows and the `MERCURY` wordmark carry +0.07–0.48px letter-spacing while display text stays normal. The micro-spacing reads as deliberate and machined — a cheap, high-leverage detail for fintech/B2B credibility.
- **Glass belongs to the product, not the chrome.** The marketing shell is deliberately opaque and shadowless, yet the app UI shown *inside* the feature mockups leans on frosted translucency — ~16 `backdrop-filter:blur(20px)` panels off a named `--surface-frosted` token — so controls float over live content the way the real product does. Splitting the two registers keeps the page austere while letting the demo read as polished software. Transferable rule: reserve blur/glass for the depicted product surfaces and keep the page frame that holds them flat. Safety: backdrop-filter forces a repaint of everything behind it — confine it to a handful of small panels, never full-width bands or the sticky nav.
- **Photography as the only warmth.** The hero (a serene mountain vista with a floating desk) and the testimonial portraits are the sole organic, full-color elements in an otherwise monochrome system. Concentrating all the "feeling" into a couple of editorial images lets the rest of the UI stay austere without going cold.

## Design-system read
- **Type:** custom `arcadia` / `arcadiaDisplay` variable family. Scale roughly 12 → 65px (≈1rem body, ≈4rem display) — a ~3–4× body-to-display jump. Hierarchy = scale + display cut; weights confined to 360/400/420/480 (no bold). Body 16/24 (1.5 leading); display ~49/54 (1.1). Positive tracking only on small/label text.
- **Color:** dual-theme. Dark ground `#171721`, raised dark surfaces `#1e1e2a`/`#272735`, light grounds `#fff`/`#f4f5f9`. Text `#ededf3` on dark, `#272735` on light; muted `#c3c3cc`/`#70707d`. Single accent iris `#5266eb` + its soft tint for ghost CTAs. Pink `#fc92b4` and chip-blue `#cdddff` are rare grace notes.
- **Spacing rhythm:** 8px base (with a 4px half-step). Tight cluster 4–16px for component internals, then a big jump to 72/112/128px section padding — generous air between bands is what keeps high information density legible.
- **Layout system:** 16-column grid, container max ~1376px; text columns capped near 608px for readability. Two-up card grids dominate. Hero is centered; content bands are left-aligned with a measured text column. Mobile collapses to a 12-col single stack; H1 49→28px.
- **Layering / page architecture:** shallow and *opaque-flat*, not glassy — at the page level. 13 of 14 full-bleed sections are transparent and simply inherit the themed band beneath them (no per-section fill), so depth comes from ground contrast, not stacking; the z-stack is thin (bulk at z0–1, one sticky nav at z99 that re-themes rather than blurs, one pointer-events-none sticky footer CTA at z3). No fixed backdrop, no page-level blend overlay (only a hero scrim via `mix-blend-mode:overlay`). The one real glass in the system lives *inside the product-UI mockups*, not the marketing shell: ~16 `backdrop-filter:blur(20px)` frosted panels drawn from a dedicated `--surface-frosted` (`#7073931a`, neutral @ ~10%) token — e.g. the floating controls on the invoice/card demos. So the app depicted is translucent while the page framing it stays honest and flat. (backdrop-filter repaints everything behind it — they scope it to a few small panels, never bands.)
- **Motion / easing intent:** restrained and production-safe. Dominant easing `cubic-bezier(0,0,0.2,1)` (ease-out) at 150–500ms. Motion communicates *settledness* — things fade up into place and the nav re-themes quietly; nothing bounces or parallaxes. No animation library (keyframe count 0); it's IntersectionObserver + CSS transitions only.
- **Density:** high (lots of copy, footnotes, press stats, legal disclaimers) but kept legible by the band rhythm, the capped measure, and the calm weight band.
- **Hierarchy:** dominant ordering device is **scale**, reinforced by **ground contrast** (which band you're on) and **position**, not weight or color.
- **Restraint:** no drop shadows, no bold weights, no gradients beyond a hero scrim, one accent color, no decorative motion. Deliberately austere.

## Interaction & motion
- **Multi-band nav re-theme** — *Trigger:* scroll-progress. *Mechanism:* the sticky nav reads which full-bleed band it's overlapping and crossfades its background + link color to suit — transparent-over-hero, solid dark on dark bands, solid light on light bands (probe: `nav background rgba(0,0,0,0)→rgb(23,23,33)`, `position: sticky/fixed`, many per-link color targets). *Reads as:* the nav "belongs" to whatever it's floating over, always legible. *Transfers to:* any long page that alternates section backgrounds. *Safety:* **production-safe** (animates only `background-color`/`color`; one sentinel per band, zero per-frame JS). See `patterns/multi-band-nav-retheme`.
- **In-view fade-rise reveal** — *Trigger:* in-view (IntersectionObserver, 51 observers / 358 targets, thresholds 0/0.2/0.5, rootMargin `0px 0px -35% 0px`). *Mechanism:* section blocks start at `opacity:0` and fade/rise to rest once ~35% into the viewport. *Reads as:* the page assembles calmly as you read. *Transfers to:* essentially any content section. *Safety:* **production-safe**, but **note:** the live site sets `respectsReducedMotion:false` — it does *not* gate this behind `prefers-reduced-motion`. That's a real a11y gap; our pattern fixes it.
- **Logo marquee** — *Trigger:* load (slow 45s linear translate). *Mechanism:* a row of customer logos drifts horizontally (frames show different logos at the same scroll depth). *Reads as:* "trusted by everyone," continuously. *Safety:* **production-safe** if paused under reduced-motion; can distract — keep it slow and low-contrast as Mercury does.
- **Testimonial carousel + autoplay media tiles** — *Trigger:* tap / autoplay. *Mechanism:* a 3-slide quote carousel (dot indicators) and feature tiles with muted autoplay product video/animated gradients (9 videos detected). *Reads as:* product proof without a heavy demo. *Safety:* **production-safe**; autoplay video should be muted, lazy, and reduced-motion-aware.

## Production-safety note
Everything here is production-safe by construction — the site's whole thesis is restraint. The one genuine flaw to *not* copy: it ships scroll/IO reveals and a marquee with `prefers-reduced-motion` **unhandled**. Any reuse of these patterns must add the reduced-motion fallback (jump-to-end / pause), which the reference implementations below do.

## Extracted patterns
- `shadowless-ground-card-grid` — two-up feature cards that get their depth from ground inversion + hairline + radius instead of shadows; reuse for calm, precise product/feature sections.
- `multi-band-nav-retheme` — a sticky nav that crossfades its theme across alternating dark/light page bands via one sentinel per band; reuse on any long page with alternating section grounds.
