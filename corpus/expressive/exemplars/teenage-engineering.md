---
slug: teenage-engineering
url: https://teenage.engineering
source: manual-pick
corpus: expressive
captured: 2026-06-30
award_type: Manual (ecommerce/industrial-design)
score: null
tags: [ecommerce, industrial-design, hardware, brand, grid, swiss, playful, product, monochrome, minimal, catalog]
when_to_use: [ecommerce, navigation, brand-experience, hero, product-marketing, footer]
directions: [brutalist, editorial, expressive]
layout: [catalog, dense-grid]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [directory-nav, alternating-ground-catalogue]
tokens_snapshot: ../tokens/teenage-engineering.json
screenshots: ../screenshots/teenage-engineering/
---

## What works
- **The product renders carry all the expression; the chrome stays Swiss-neutral.** The page is a catalogue of full-bleed product photography — pitch-black cinematic stages (the K.O. mixer lit with molten light-trails, the OB-4 floating in void, the vinyl spread) interleaved with austere off-white spec rows. Every gram of drama lives in the *imagery*; the surrounding UI is hairline-ruled, sharp-cornered, shadowless, light-weight grotesque. The transferable rule: when the assets are genuinely strong (industrial design, lit hardware), let the photography own the hierarchy and keep the frame deliberately un-designed — the austerity makes the renders read as expensive. The failure mode it avoids is dressing strong product shots in trendy card chrome that competes with them.
- **Directory-style categorized header instead of a slim nav bar.** The top of the page is a *sitemap*, not a navigation strip: ~22 links grouped under four headed columns — `products` (instruments / audio / designs), `store` (visit store / cart & checkout / deals), `latest` (newsletter / instagram / now), `finder` (guides & downloads / support / search) — each column led by a custom pictographic glyph, with the `TO` mark anchoring the right. It surfaces the entire information architecture at a glance rather than hiding it behind a hamburger. Transferable to any content- or catalogue-dense commerce/brand site: a labelled multi-column header out-navigates a minimal bar when the IA is genuinely wide. → `directory-nav`.
- **One poster moment, captioned silence everywhere else.** The hero is treated as an *EP/album cover*, not a product hero — a giant condensed black display lockup ("DAILY LIFE OF MR. UPDATE") with an editorial ink illustration and a catalogue-number table (`EP-133  2.5`). It is the only place type gets loud. Everything below it drops to one tiny uniform label register (product names, "buy now", spec captions) at ~13px in a light weight. Bimodal type — a single expressive poster against a flat field of functional micro-labels — concentrates the personality into one block and lets the grid stay calm. Transferable: ration display drama to one hero lockup; demote all other type to captions.
- **Alternating ground inversion as the page's rhythm.** The scroll alternates near-black product *stages* (`#0F0E12`) with light grid *rows* (`#F6F8F7`): a dramatic dark render, then a light hairline-separated 3-up of related SKUs, repeating. Each product gets a black stage to perform on and a white shelf to be priced on. The edge-to-edge background flip does the chaptering — no dividers, no section headers needed. Transferable to any long product or portfolio page. → `alternating-ground-catalogue`.
- **Functional web-blue is the only accent, and it only ever means "act."** The lone chroma in the chrome is classic link-blue `#0071BB`, reserved exclusively for transactional links ("buy now"). It is not a brand color used for fills or flourish — it is the unstyled-default blue, used *on purpose* to read as honest, utilitarian e-commerce. Product cells are split by thin `#E5E5E5` grid lines, not cards. The mechanism: by refusing decorative color, the one functional color becomes unmistakable as the call to action. Transferable to any commerce UI that wants to feel like a tool, not a campaign.
- **Brand personality lives in tiny editorial details, not effects.** A Japanese subhead in the nav and footer, the `®`, EP-series catalogue numbers, hand-pictographic nav glyphs, a country selector — the playfulness is carried entirely by *content and typographic detail*, with essentially zero motion or graphical trickery. Transferable lesson: a static, restrained site can still feel characterful if the copy, glyphs, and catalogue metadata are designed with care.

## Design-system read
- **Type:** Two custom faces — `te-20` (a neutral grotesque, the workhorse for all UI/body/captions) and `te-40` (a tight condensed display, the poster headline) — over a `Unicode, sans-serif` fallback. Hierarchy is **bimodal scale**, not weight: one poster-scale condensed display in the hero (set far larger than the raw probe's 53px ceiling — likely an SVG/oversized lockup) against a dense floor of ~13–24px UI/body. Weights run *light*: 300 dominant (607), 100 thin (330), 400 sparse (157) — the airy, technical feel comes from thin weights at a generous measure, with the hero's heavy condensed display as the deliberate contrast. Leading is bimodal too: ~1.1 on labels/display, ~1.5 on body. Tracking is near-neutral (1.2px on a couple of caps). OpenType `kern`/`liga`/`dlig` on.
- **Color:** Inverted monochrome with one functional accent. Grounds invert chapter-to-chapter: near-black `#0F0E12` (product stages, hero type, footer) ↔ off-white `#F6F8F7` / `#F5F5F5` (grid rows). Greyscale ladder for structure: hairline `#E5E5E5`, muted text `#B2B2B2`, dark hairline `#272727`. The only chroma is link-blue `#0071BB` (transactional links). An orange (~`#FF6600`, the "UPDATE" EP tag, illustration smoke, K.O. knobs) appears only *inside imagery/SVG* — not a computed UI token; treat as art-direction, not a system color.
- **Spacing rhythm:** ~8px base; the recurring grid gap normalizes to ~12px (raw 11.75); block padding steps to ~32 and ~64px (raw 33 / 66). Two speeds — tight 12px gutters packing the product grids, large 32–64px padding releasing between chapters.
- **Layout system:** Strict modular grid — 12-column for the wide rows, collapsing product shelves to 3-up; hero on a 3-column band. The directory nav is itself a multi-column grid of labelled link stacks. Gutters ~12px, sharp cells, full-bleed stage bands. Mobile (390) folds the 22-link nav to a hamburger and stacks shelves to one column.
- **Motion / easing intent:** Minimal and restrained — durations ~200ms, easings `ease` / `ease-in`. Motion communicates "tool, not show": a hover bulge on nav glyphs, a marquee ticker, a sticky cart, load-in fades. No scroll spectacle. Detail below.
- **Density:** High locally inside the product shelves and the 22-link directory nav, but chunked by large chapter padding and the dark/light ground flips, so it reads ordered, never cramped — the grid does the legibility work.
- **Hierarchy:** Dominant device is **image drama + ground inversion**; type is near-flat captioning (one poster exception), and grid position does the ordering.
- **Restraint:** No drop shadows, no gradients, no rounded product cards (only pill buttons), no scroll animation, no parallax, no hero video autoplay-spectacle. Color is monochrome bar one functional blue. The whole expressive budget is spent on photography and one poster headline.

## Interaction & motion
Teenage Engineering is **a largely static, grid-driven catalogue** — and that restraint is the point. The probe is blunt: **0 IntersectionObservers, no GSAP/Lenis, no carousels/canvas in the main flow**, only 2 scroll + 4 mousemove + 4 rAF listeners, and **`prefers-reduced-motion` is respected** (`prmRules: 1`, `reduced_motion: true`). The 8 `@keyframes` are mostly utility: `vjs-spinner-show`/`-spin`/`-fade` are the embedded video.js product-video loader; `bulge`, `_load`/`_in`, and `_mrq-scroll-left`/`-right` are the only house animations. The single diffed scroll effect is a `position: fixed` **sticky cart** ("in cart" element pinning as you scroll). Frames `s00→s10` show *no* reveal/parallax/recolor choreography — the page simply scrolls through stages. Don't invent motion here; the honest read is "static catalogue with playful micro-interactions."

- **Glyph bulge on hover** — *Trigger:* hover/cursor (the `bulge` keyframe + 4 mousemove listeners). *Mechanism:* the custom pictographic nav icons scale/bulge briefly on pointer-over. *Reads as:* the toy-like, tactile TE personality surfacing on interaction without disturbing the calm grid. *Transfers to:* any iconographic nav wanting a playful affordance. *Safety:* **production-safe** — animate `transform: scale` only; cheap, and trivially disabled under reduced-motion.
- **Marquee ticker** — *Trigger:* continuous (`_mrq-scroll-left`/`-right`). *Mechanism:* a horizontal text/asset strip auto-scrolls (the "latest / now" register). *Reads as:* a small editorial newswire. *Transfers to:* announcement bars, "now" strips. *Safety:* **production-safe with care** — pause on hover/focus, never carry essential-only content, and freeze under reduced-motion (the classic marquee a11y caveats).
- **Sticky cart pin** — *Trigger:* scroll-progress. *Mechanism:* the "in cart" element holds `position: fixed` so the cart stays reachable down a long catalogue. *Reads as:* persistent commerce affordance. *Transfers to:* any long shop/checkout flow. *Safety:* **production-safe** — pure positioning, no animation cost.
- **Load-in fade** — *Trigger:* load (`_load` / `_in`). *Mechanism:* a brief entrance fade as the page resolves. *Reads as:* a settled, deliberate arrival. *Transfers to:* any first-paint. *Safety:* **production-safe**; respect reduced-motion (TE does).

## Production-safety note
- **Image-first hierarchy + Swiss chrome + directory nav + alternating grounds** — all production-safe and fully portable; no perf or a11y cost. Keep label-on-dark contrast in check on the black stages.
- **Functional-blue-only accent** — production-safe. Cost: none. Don't let blue be the *only* signifier of a link on the dark stages — pair with underline/position.
- **Glyph bulge / marquee / load-fade** — production-safe; reduced-motion respected here. Keep marquee pausable and inessential.
- **Sharp cells, no shadows, pill buttons only** — production-safe; recommended for an honest "tool" register.
- **a11y (measured, `craft.a11y`) — strong.** `focus_visible: true` (1px outline on nav links), `img_alt_ratio: 1` (all 37 images carry alt), `reduced_motion: true`. *Watch:* 24 sub-44px tap targets (the dense micro-label links and 22-link nav) — enlarge hit areas on touch; and verify `#0071BB` on `#0F0E12` link contrast on the dark stages.

## Extracted patterns
- directory-nav — a labelled multi-column header that surfaces the whole site IA (grouped link stacks + pictographic glyphs) instead of a slim bar or hamburger; for content/catalogue-dense commerce and brand sites.
- alternating-ground-catalogue — a long page chaptered by edge-to-edge dark "product stage" bands alternating with light hairline-separated 3-up spec rows; ground inversion replaces dividers and lets each product perform on black then sell on white.
