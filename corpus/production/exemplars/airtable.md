---
slug: airtable
url: https://www.airtable.com
source: manual
corpus: production
captured: 2026-09-07
award_type: null
score: null
tags: [saas, b2b, ai, enterprise, productivity, data-table]
when_to_use: [landing, product-marketing, feature-section, hero, navigation]
directions: [minimalist, editorial]
layout: [split-hero, full-bleed]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [pinned-hero-curtain-reveal, sticky-heading-feature-tabs]
tokens_snapshot: ../tokens/airtable.json
screenshots: ../screenshots/airtable/
---

## What works (transferable principles)
- **Monochrome discipline with a saturated reserve.** The chrome is almost entirely near-black (`#181d26`) on white/`#f8fafc`, with text in a warm ink and secondary text as a single alpha-black (`#040e20b0`). Color — vermilion, pink, indigo, a rainbow spotlight gradient — is quarantined into the product mockups and one CTA banner. The result reads as a serious enterprise tool, not a toy, yet still feels alive where it counts. Transfers to any B2B/SaaS site that wants "premium and trustworthy" without going grey and lifeless: pick one ink, one surface, and let product screenshots carry the brand hues.
- **Hierarchy from scale contrast in a single display family, not weight soup.** The H1 is 64px on a 64px line-height (leading 1.0) with −1.28px (−0.02em) tracking in a display cut (Haas Groot Disp); body sits at 20px. That ~3.2× jump plus near-zero leading is what makes the headline feel monumental — weight barely changes (most of the page is one 550-ish weight). Reusable rule: buy hierarchy with size + tight tracking + tight leading on the display tier, keep everything else one weight.
- **Two type systems for two jobs.** A branded variable sans (ATSeasonSans / Haas) sets all marketing copy; the product-UI mockups are rendered in `SF Pro Text` with `tabular-nums`. Using the OS UI font *inside* the fake app screenshots makes them read as real software, not marketing art. Transfers anywhere you embed a product demo in a marketing page.
- **A pinned hero that the page curtains over.** The dark hero is `position: fixed` behind the flow; a transparent spacer reserves ~one viewport of scroll, then an opaque white content slab slides up and covers it. Depth for free, zero parallax jank — the hero never transforms, the content just occludes it. See `pinned-hero-curtain-reveal`.
- **Repeating split rhythm: heading-left, evidence-right.** Nearly every section is a two-column split — a short heading + one CTA on the left, a live product artifact (mockup, stat card, orbit, video) on the right. The consistency is the design system; density stays low because each row makes exactly one claim and shows one proof. Transfers to any feature/customer-story page.
- **Customer proof as the primary content, not a testimonial footer.** Logo wall, "Trusted by 500,000+", per-customer stat lines (OpenAI 50+, eBay 1M+), and a dark full-bleed pull-quote carousel are load-bearing sections, not garnish. The credibility architecture *is* the page.

## Design-system read
- **Type:** Display family Haas Groot Disp (500/600/700/900) for headlines; ATSeasonSans variable (100–900) for body/UI; SF Pro Text for embedded product chrome. Scale is fluid — H1 64px desktop → 40px mobile, body a constant 20px. Token scale: 12 / 14 / 24 / 32 / 48 / 64 / 96 / 120px. Hierarchy = scale + tracking (−0.02em display, +0.01–0.02em at small caps/labels), not weight.
- **Color:** Ink `#181d26` (icon/heading) and `#333840` (`--theme_text`); secondary text `#040e20b0`; tertiary `#000e263b`. Surfaces: white `#fff`, page `#f8fafc`, subtle `#f8f6f6`; dark sections `#181d26`/`#161616`/`#0a0a0a`. Interactive accent is a blue (`#254fad` hover, link `#1b61c9`). A large primitive palette exists (vermilion `#f85c0e`, pink `#ea4ecb`, indigo `#775cff`, yellow `#ffcd05`, red `#e33a3d`) plus a coral→pink→indigo→blue radial "spotlight" gradient — reserved for mockups and the closing CTA.
- **Spacing rhythm:** 8px base. Named scale 8 / 12 / 24 / 40 / 64px (`--spacing-sm…4xl`); section inline padding 48px desktop; common gaps 8/12/16/24. Whitespace does the separating — sections are tall and single-claim.
- **Layout system:** Content max ~1344px (marketing max 1536px); dominant two-column split with generous gutters. `flex` everywhere (622 uses) with `grid` reserved for card/logo grids (1/2/3/5 cols). Rich breakpoint ladder (600–1664). Mobile collapses splits to stacked single-column and the 53-link mega-nav to a 16-link hamburger drawer.
- **Layering / page architecture:** Not a flat scroll. A sticky transparent header (z 4) rides the top; the hero is a `fixed` dark full-viewport layer (z 0) that the white `afterHero` slab (6128px) scrolls up over — a curtain reveal, not a parallax. Mega-menu is a nested fixed-drawer system with a full-viewport `#0114351f` backdrop-overlay. One sticky heading column inside the feature-tab section. Minimal glass: a couple of `backdrop-blur` chips inside mockups; one `mix-blend:screen`/`multiply` overlay each. `has_static_backdrop: true`, `has_blend_overlay: false`.
- **Motion / easing intent:** House easing `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard) with a fast `0.15s ease-in` default; durations cluster at 150/200/400/700ms plus a 30s ambient orbit loop. Motion communicates *state and liveness in the product demos* (bars fill, cards stagger, a fake cursor clicks) and *continuity in the chrome* (nav crossfade, logo stagger). Reduced-motion is respected (172 PRM rules).
- **Density:** Low in marketing regions (one claim per tall section), high in the dense mega-nav and footer. Product mockups are deliberately dense to look real.
- **Hierarchy:** Scale first, position second (left heading anchors each split), color last (accent used sparingly).
- **Restraint:** No parallax on the headline, no gradient hero, no drop-shadow excess (shadows are 1–3 layer, ≤0.1 alpha). Brand color is withheld from 90% of the page so the 10% lands.

## Interaction & motion (evidence-backed)
- **Pinned-hero curtain reveal** — *Trigger:* scroll-progress. *Mechanism:* dark hero fixed at z0 behind the flow; a transparent `scrollSpacer` reserves viewport-height of scroll, then an opaque content slab occludes it (profile: hero `position:fixed`, `scrollSpacer` + `afterHero` surfaces, hero pin at scroll-progress). *Reads as:* the page "opens" over a stage. *Transfers to:* any hero you want to feel cinematic without motion cost. *Safety:* **production-safe** (occlusion only, no transform on the hot path). See `pinned-hero-curtain-reveal`.
- **Scroll-progress integration orbit** — *Trigger:* scroll-progress. *Mechanism:* concentric rings and logo chips rotate by scroll fraction (keyframes `integrationsOrbit`/`integrationsCounterOrbit`/`integrationsRingFlow`; measured rotate −286°/−165°/+84°/+286°), counter-rotating the chips so logos stay upright. *Reads as:* "everything connects to the hub." *Transfers to:* integrations / ecosystem sections. *Safety:* **spectacle-only-ish but cheap** — transform-only, but continuous rotation can distract; gate to in-view and honor reduced-motion.
- **Sticky-heading tabbed feature showcase** — *Trigger:* in-view + click. *Mechanism:* left heading column is `position:sticky` while a tablist ("From a sentence to a system / Automate the busywork / Run on shared data") swaps the right media panel; panel content staggers in (`uc-stagger`, `barFill`). *Reads as:* one story told three ways. *Transfers to:* feature and how-it-works sections. *Safety:* **production-safe**. See `sticky-heading-feature-tabs`.
- **In-view staggered entrance** — *Trigger:* in-view (IntersectionObserver, 5 observers / 9 targets, rootMargin 200px). *Mechanism:* logos and cards fade+rise on a stagger (delays 80/160/240/320/400ms; keyframes `LogosColumn__coming-in`, `RiskSummaryCard__stagger`). *Safety:* **production-safe**.
- **Scripted product-demo playback** — *Trigger:* in-view/autoplay. *Mechanism:* fake cursor moves and clicks, toggles flip, bars fill inside the mockups (keyframes `claude-cursor-move`/`claude-cursor-click`/`claude-toggle-on-show`, `RiskSummaryCard__barFill`). *Reads as:* a live product tour. *Safety:* **production-safe** (transform/opacity only), reduced-motion honored.
- **Word-blur pull-quote carousel** — *Trigger:* in-view/interval. *Mechanism:* quote words de-blur in (`word-blur-in`) as slides advance on a dark stage. *Safety:* **production-safe**; small `filter:blur` cost, gate to in-view.

## Production-safety note
- Everything animates `transform`/`opacity`/`filter` only; no width/height/top on scroll. The one to watch is the continuous 30s orbit — cap it to in-view and drop to a static ring under `prefers-reduced-motion`. 81/232 interactive elements are small tap targets (dense mega-nav + footer) — the risk lives in navigation, not the core CTAs.

## Extracted patterns
- **pinned-hero-curtain-reveal** — fixed hero the page scrolls up over; cinematic depth with no parallax jank.
- **sticky-heading-feature-tabs** — sticky left heading + tabbed right media panel for feature/how-it-works sections.
</content>
</invoke>
