---
slug: copilot
url: https://www.copilot.money
source: manual-pick
corpus: production
captured: 2026-06-30
award_type: Manual (fintech/personal-finance)
score: null
tags: [fintech, personal-finance, consumer, ios, app, premium, dark, b2c]
when_to_use: [product-marketing, landing, hero]
directions: [minimalist, soft]
layout: [center-stack, bento]
a11y: [reduced-motion-ignored, focus-visible, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [floating-pill-nav, scroll-exit-dissolve]
tokens_snapshot: ../tokens/copilot.json
screenshots: ../screenshots/copilot/
---

## What works
- **One enormous scale jump carries the whole hierarchy.** A 148px display headline sits over 12–16px body — a ~10–12× range in two type families, with no in-between sizes doing the work. Because the gap is so wide, the page never needs heavy weights or rules to signal importance; emptiness and scale do it. Transfers to any landing hero where you want a single confident focal point rather than a ladder of near-equal headings.
- **A near-black navy ground makes one electric-blue accent do all the pointing.** The page is `#000814`–`#01122d` everywhere, so the single saturated CTA blue (`#2563ff`) reads as the only actionable color on screen — promo bar, primary button, active links all share it. Restricting accent to one hue on a dark, low-chroma field is what makes a consumer app feel "premium" rather than busy. Transfers to any dark product-marketing page.
- **Decorative color lives in objects, not surfaces.** All the brand's rainbow (green/red/orange/pink/purple category capsules) is confined to floating 3D props; the layout chrome stays monochrome navy. This lets the page be playful AND calm at once — the joy is quarantined into removable objects so the information design underneath never gets noisy. A reusable governance rule: keep hue in the illustration layer, keep the UI layer neutral.
- **The props feel physical because they're composited, not painted.** The category capsules read as glossy candy through `mix-blend-mode` gloss (26 `hard-light` + 4 `soft-light` highlight layers) and `backdrop-filter` frost — the light is computed against whatever sits behind each pill, so the objects feel *lit* rather than drawn with a baked gradient. Transfers to any 3D-object or glass UI layer: reach for blend-mode highlights over gradient fills when you want props to feel tactile against flat surfaces. *Cost:* blend + backdrop-filter compositing isn't free (30 blend + 32 backdrop-filter elements here) and a fixed backdrop-blur repaints every scroll frame — budget it on low-end devices.
- **The headline is silver, not white.** A subtle top-down gradient fill (`rgba(255,255,255,.9)→.7`) on the display type reads as brushed metal against the dark ground — richer than flat white, and it ties the type to the glossy gel props without adding a second color. Cheap, transferable luxe move for dark heroes.
- **Theme inverts to chapter-mark a topic shift.** Most sections are dark, but "Grow your wealth" drops in as an inset off-white rounded panel — a light island in a dark page. The polarity flip is the section divider; no headline rule or number needed. Transfers anywhere you want one section to feel like a different room without changing the type system.
- **Generous corner radii everywhere set the friendly register.** Cards at 20–24px, props fully rounded (capsules), buttons pill-shaped — the radius scale itself is the brand's warmth. On a dark fintech page that could read cold, rounding is what keeps it consumer-approachable. Transferable: pick radius as a deliberate tone control, not a default.

## Design-system read
- **Type:** Two geometric grotesques — **Matter** (display) + **Jokker** (UI/body). Scale is bimodal: a display tier (148px desktop / 49px mobile h1, 64px section heads) and a UI tier (12–18px), with almost nothing between. Hierarchy comes from *scale contrast*, never weight escalation. Display carries tight negative tracking (≈ −0.02em at 148px); numbers use `tabular-nums`. Leading is near-1 on display (133/148 ≈ 0.9), ~1.4 on body.
- **Color:** Ground `#000814`; lifted card surface `#081b36`; one inverted light panel `#f6f8fb` with ink `#11263b`. Foreground white at 90% opacity; muted is a desaturated blue-gray (`#597caa` / `#7f8ba4`) — not gray, which keeps text tinted to the navy. Single accent `#2563ff`. A separate decorative rainbow (green `#00cc4b`, red `#ff4433`, orange `#ff9900`, yellow `#ffcc02`, pink `#ea687c`, purple) lives only on the 3D props.
- **Spacing rhythm:** 4px base; common steps 4/8/12/16/20/24/32/40, section padding 64–112px. Whitespace is the primary separator — the hero is mostly empty navy with the headline and props floating in it.
- **Layout system:** ~1200px max container; feature blocks are a 4-up / 2×2 card grid that collapses to a single column on mobile. Content is centered for statement sections, left-aligned for the closing CTA. Cards are dark-on-dark, separated by radius + faint border rather than heavy elevation.
- **Layering / page architecture:** Single flat scroll — no fixed backdrop and no full-page blend overlay (`has_static_backdrop` / `has_blend_overlay` both false); the only pinned layer is the nav pill (z-10, 100%×16% coverage), and the rest of the page sits flat at z-0 / z-1 (42 / 84 elements). Depth is faked *per-object*, never by a global z-stack. The nav pill has **no background color** (`rgba(0,0,0,0)`) — its frost is pure `backdrop-filter: blur(12px)` over the content scrolling beneath it (you can watch dashboard UI smear under the pill between frames). The glossy props are composited locally: 26 `hard-light` + 4 `soft-light` `mix-blend-mode` gloss layers, plus `backdrop-filter: blur(6px)` (19 elements) on the frosted pills so the navy ground reads through them. The depth lives entirely in the object layer; the page structure itself is flat.
- **Motion / easing intent:** Built in **Framer**. Base 400ms, easing `cubic-bezier(0.44,0,0.56,1)` (symmetric ease-in-out). Motion communicates "alive but controlled" — props drift/parallax on entrance and dissolve on exit; nothing loops or demands attention.
- **Density:** Marketing chrome is low-density (huge type, lots of air); the embedded product mini-UIs inside feature cards are deliberately *high*-density (charts, lists, tabular numbers) — the contrast sells "the app does a lot, the marketing stays calm."
- **Hierarchy:** Dominant device is **scale**, backed by **position** (centered focal statements) and the single accent for action.
- **Restraint:** No second accent hue in the UI layer; no gradient meshes behind text; no oversized fake dashboard as hero (the product shots are contained, contextual cards). Color is rationed to props and one CTA.

## Interaction & motion
Built in Framer; IntersectionObserver-heavy (29 observers with fine-grained threshold ladders), 2 scroll listeners, rAF active. Evidence below is corroborated by the frame sequence; `from==to` probe noise dropped. **Reduced motion is NOT respected** — the single biggest production caveat here.

- **Floating capsule nav (pinned island)** — *Trigger:* load + fixed. *Mechanism:* the nav is a rounded frosted-dark pill (brand+links in a left capsule, auth in a right capsule) that stays `position: fixed` floating just inside the top edge while the page scrolls under it. *Reads as:* an app chrome bar, not a website header — reinforces "this is software." *Transfers to:* any product-marketing top nav. *Safety:* **production-safe** (no motion; just a pinned element). See `patterns/floating-pill-nav.md`.
- **Scroll-exit dissolve of hero props** — *Trigger:* scroll-progress. *Mechanism:* the foreground category-capsule cluster scales up (≈1.2→3×) and fades to ~0 opacity as the hero scrolls away, driven by the section's scroll progress. *Reads as:* the props "fly past the camera" and clear out so the next section arrives clean. *Transfers to:* any decorative foreground layer you want to dissolve on section exit instead of hard-cutting. *Safety:* **production-safe** in effect but here it's **not reduced-motion-gated** — wrap it. See `patterns/scroll-exit-dissolve.md`.
- **In-view fade-rise entrance** — *Trigger:* in-view (IntersectionObserver). *Mechanism:* sections/cards fade opacity 0→1 with a small upward translate as they cross into view; the hero headline rises from a scaled-down state on load. *Reads as:* content settling into place. *Transfers to:* universal section reveal. *Safety:* **production-safe**, but gate on reduced-motion (this site does not).
- **Parallax drift on props** — *Trigger:* in-view / scroll-progress. *Mechanism:* the floating capsules and embedded UI tiles translate at slightly different rates than the page, giving depth. *Reads as:* a shallow 3D scene. *Transfers to:* hero prop layers. *Safety:* **production-safe** if deltas stay small; spectacle if overdone.
- **Link hover desaturation** — *Trigger:* hover. *Mechanism:* nav links shift from white-90% toward a muted blue-gray over 400ms rather than changing weight/underline. *Reads as:* a quiet, premium hover. *Transfers to:* any minimal nav. *Safety:* **production-safe**.

## Production-safety note
- The page **does not honor `prefers-reduced-motion`** and has `focus-visible` styling that's thin (1px outline) with 23 small tap targets flagged. If you borrow the motion, add the reduced-motion fallback the patterns include, and strengthen focus rings. The motion *vocabulary* is production-safe; this site's *implementation* of the a11y guardrails is not.

## Extracted patterns
- floating-pill-nav — a fixed, frosted, capsule-shaped nav island that reads as app chrome; reuse for product-marketing top nav.
- scroll-exit-dissolve — decorative foreground props scale up + fade out on section-exit scroll progress; reuse to clear a hero's prop layer before the next section.
