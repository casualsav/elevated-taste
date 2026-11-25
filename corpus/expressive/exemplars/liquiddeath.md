---
slug: liquiddeath
url: https://liquiddeath.com
source: manual-pick
corpus: expressive
surface: site
captured: 2026-06-30
award_type: Manual (ecommerce/brand)
score: null
tags: [ecommerce, dtc, beverage, brand, irreverent, bold, maximalist, dark, heavy-metal]
when_to_use: [ecommerce, brand-experience, landing, hero]
directions: [expressive, brutalist]
layout: [catalog, full-bleed]
a11y: [reduced-motion-ignored, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [flavor-hero-carousel, full-bleed-message-band]
tokens_snapshot: ../tokens/liquiddeath.json
screenshots: ../screenshots/liquiddeath/
---

## What works (transferable principles)

- **Voice IS the design system.** The product is commodity water; the moat is a death-metal editorial voice applied to every surface — section headers ("MURDER YOUR THIRST", "KILLER MERCH"), product names ("Reusable Slaughter Bottle", "Death's A Beach Chair"), even the submit button ("HELL YES"). Differentiation lives in *microcopy and imagery*, not in novel layout. **Transfers to:** any commodity/undifferentiated product — commit fully to one voice and name *everything* in-world; half-commitment reads as a gimmick, full commitment reads as a brand.

- **Transgressive skin over an orthodox conversion skeleton.** Strip the styling and the page is a textbook DTC layout: rotating hero → 3-product feature row → mission band → merch grid → dual CTA tiles → footer. The information architecture is completely conventional and legible; only the *surface* (blackletter, skulls, gore, gold crests) is wild. **Transfers to:** you can be visually loud and still convert — keep the IA boring so the aesthetic can be fearless. Spectacle in the skin, safety in the structure.

- **Three-tier type split: brand font / display font / body font.** A purely decorative blackletter wordmark (brand asset, never used for content) sits above an ultra-condensed grotesque for all-caps headlines, which sits above a neutral humanist sans (Acumin Pro) for body. The genre signal ("heavy metal") is carried entirely by the first two tiers; readability is protected by the third. **Transfers to:** reserve your most characterful face for the logo/wordmark only — let a condensed display face carry headline personality and keep body in a calm workhorse so density stays legible.

- **Saturated hero islands on a white canvas; color derived from the product.** The page body is white/black editorial, but each hero slide is a fully-saturated color field (magenta, iced-tea green, orange) keyed to the *flavor of the can shown*. Palette is product-derived, not arbitrary. The white surroundings let each saturated hero detonate without the whole page being exhausting. **Transfers to:** when you have multiple SKUs/themes, let color come from the artifact and isolate it in full-bleed islands separated by neutral space — you get maximal punch and sustained calm at once.

- **One reserved metallic accent for brand equity.** Amid black and white, a single metallic gold/tan (`#cba14f`) is reserved exclusively for crests, emblems, and the wordmark — it reads as "band merch / premium insignia" and ties the heavy-metal world together. **Transfers to:** pick one accent and reserve it for identity moments only (logos, badges, seals); never spend it on routine UI, or it stops signaling "special."

- **Values delivered as spectacle, not a footer link.** The sustainability message ("PLASTIC RECYCLING IS A MYTH. ALUMINUM IS INFINITELY RECYCLABLE.") gets a full-bleed photographic band (crushed bottles) with overlaid condensed caps — the ESG point is staged in the brand's own aggressive register instead of being quarantined in fine print. **Transfers to:** if a value matters, give it a full-bleed moment in the brand voice; relegating it to a quiet link signals it's an afterthought.

## Design-system read
- **Type:** Scale 12 → 60px (body 16). Hierarchy is **scale + width contrast**, not weight — ultra-condensed all-caps display headlines (40–60px, tracking tightens to −0.44px at size) tower over a normal-width 16px body at 1.5 leading. Three families: blackletter wordmark (brand only) · `acumin-pro-condensed` (display, all-caps) · Acumin Pro (body). Caps labels get +1px tracking.
- **Color:** Neutral editorial base — white bg, near-black fg (`#151515`), grey muted (`#696969`). One brand accent: metallic gold (`#cba14f`) for insignia. Black tiles (`#000`/`#121212`) for CTA blocks. Hero color fields are *imagery-driven* (per-flavor saturated gradients), not tokens. (The `#2563eb` blue in the raw profile is incidental widget/utility chrome, not brand.)
- **Spacing rhythm:** ~8px base but lived-in (6/10/12/16 dominate small gaps; 32/64/150 for section rhythm). Generous vertical air between full-bleed bands keeps the loud content from colliding.
- **Layout system:** Single column of full-bleed bands; product rows are 3-up (cans) and 4-up (merch), collapsing to 1-up on mobile. Container max ~1312px. Nav: 9 links desktop → hamburger (2 visible) mobile.
- **Motion / easing intent:** Light. Base durations 200–500ms, easings `ease` / `cubic-bezier(0.4,0,0.2,1)`. Motion communicates "store, not show" — carousels rotate flavor worlds; the page itself barely animates. **`prefers-reduced-motion` is NOT respected** (0 PRM rules) — a real defect.
- **Density:** Moderate. Each band does one job (one hero, one mission, one grid); white space carries the separation so high-saturation imagery never crowds.
- **Hierarchy:** Dominant device is **scale + width** (condensed display vs body), reinforced by full-bleed color blocking for section starts.
- **Restraint:** Despite the maximalist *voice*, the *layout* is disciplined — products shot clean on white, no decorative clutter between sections, no gradient soup, near-zero shadows (flat), squared corners (5px max). The wildness is concentrated in imagery + copy, not in layout chaos.

## Interaction & motion (evidence-light — site is mostly static)
Probes: 5 carousels, 102 draggable handles, Swiper detected, 26 IntersectionObservers / 106 targets (mostly **lazy-load + analytics**, not choreography), only **1** entrance reveal and **1** parallax effect diffed, **0** hover effects. Treat this as a store with carousels, not a scrollytelling piece.

- **Auto-rotating flavor-hero carousel** — *Trigger:* load + timer (Swiper), drag. *Mechanism:* full-bleed hero slides swap between saturated per-flavor worlds (product can + condensed headline + outline CTA), with prev/next arrows and dot pager. *Reads as:* a rotating "this season's flavors" billboard. *Transfers to:* multi-SKU brand heroes. *Safety:* **spectacle-only-leaning** — autoplay carousels steal control, can fail WCAG 2.2.2 (pause/stop) and bury slides 2-N; make it pausable and not the only path to that content. See `patterns/flavor-hero-carousel.md`.
- **In-view fade-in (single)** — *Trigger:* in-view (IntersectionObserver). *Mechanism:* one product block animates opacity 0→1 (~150px before entry). *Reads as:* gentle arrival. *Transfers to:* any below-fold section reveal. *Safety:* **production-safe** (opacity only), *but here the reduced-motion fallback is missing.* See pattern's PRM guard.
- **Mild in-view parallax (single)** — *Trigger:* in-view. *Mechanism:* one section's `transform` shifts on scroll. *Reads as:* subtle depth. *Safety:* **production-safe** if `transform`-only and PRM-gated.
- **On-load email-capture modal (pinned overlay)** — *Trigger:* load. *Mechanism:* fixed full-screen dialog ("WANNA CHEAT ON YOUR OTHER BEVERAGE COMPANY?" / "HELL YES") via Klaviyo. *Reads as:* aggressive conversion grab. *Safety:* **spectacle/conversion-only** — it blocks every viewport on first load (see all frames); a real UX/CWV tax. Use sparingly, delay it, make dismissal obvious.

## Production-safety note
- **Reduced motion not respected** — carousel autoplay + reveals should be gated by `@media (prefers-reduced-motion: reduce)`; this site doesn't. Fix on reuse.
- **Blocking on-load modal** — covers the whole page; hurts first impression, accessibility, and Core Web Vitals. Delay, scope, and make `Esc`/close trivial.
- **51 small tap targets** flagged — the condensed/dense styling pushes some controls under 44px. Keep tap targets ≥44px when porting the aesthetic.
- Strong points to keep: `alt` ratio 1.0, visible focus ring present, flat/low-shadow surfaces, clean product photography on white.

## Extracted patterns
- `flavor-hero-carousel` — full-bleed, per-SKU saturated hero slides with condensed display + outline CTA; reduced-motion-aware, pausable autoplay.
- `full-bleed-message-band` — photographic full-bleed band with overlaid condensed-caps headline + outline button, for mission/value moments staged in brand voice.
