---
slug: vercel
url: https://vercel.com
source: editorial-pick
corpus: production
surface: site
captured: 2026-06-22
award_type: Editorial pick (canonical developer-platform marketing)
score: null
tags: [saas, developer, infrastructure, ai, b2b, enterprise, dev-tool, developer-tool]
when_to_use: [product-marketing, landing, feature-section, hero, navigation]
directions: [minimalist]
layout: [split-hero]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [mono-label-metadata, brand-quote-spec-block, sticky-pin-scrollytelling, announcement-ticker-marquee]
patterns_to_build: [scroll-background-shift]   # header bg crossfades transparent→solid as content scrolls under a sticky nav; no pattern file yet (motion-key lists it but no recipe exists)
tokens_snapshot: ../tokens/vercel.json
screenshots: ../screenshots/vercel/
---

## What works (transferable principles)

- **A monospace voice, used only for metadata, splits the page into two registers without a second color or weight.** Geist Sans carries all headings/body; Geist Mono — uppercase, letter-spaced (~+0.04em), muted grey — carries every *label*: hero eyebrows (`FOR CODING AGENTS`), section "Features" captions, and the spec lists under each quote. The reader instantly sorts "this is the message" (proportional sans) from "this is a tag/annotation" (mono). Transfers anywhere you have system-y metadata next to prose — feature flags, spec sheets, changelog labels, code-adjacent UI: reserve mono for the machine voice and prose stays prose.

- **Hierarchy is pure scale contrast in one near-single weight on a monochrome field.** Display headings (`Agentic Infrastructure`, `Agents`, `Apps`) hit ~64–110px while body sits at 16px — a 4–7× jump — all in Geist 400/500 ink `#171717` on white. Nothing is bold-for-emphasis; size and air do the ordering, so even a colossal headline reads calm. Transfers to any marketing/product surface that wants authority without loudness: scale up, don't bold up.

- **Tracking is a continuous function of size, not one constant em — it gets sharply tighter as type grows and slightly *looser* on the smallest labels.** Captured per-size: 12px label `+0.6px` (≈ +0.05em, looser), 30px `−1.5px` (−0.05em), 40px `−2.4px` (−0.06em), 64px `−3.84px` (−0.06em), 110px `−5.5px` (−0.05em). So display sits around −0.05 to −0.06em while small mono labels go positive — there is no single tracking value for the page. At large sizes default spacing reads loose and amateur, so tightening restores optical density; at small caps a touch of positive spacing keeps the mono legible. Rule: bind a tightening `tracking` ramp to size — negative from `2xl`+, mildly positive on small uppercase labels.

- **The brand-quote inverts the usual two-tone: the customer name is *muted*, the claim is ink.** "_Notion_ powers millions of agent conversations daily on Vercel" sets the logo-name in grey and the outcome in black, so the eye lands on the *result* (millions of conversations), not the name. It's social proof that reads as a product claim. Transfers to any logo-quote or testimonial: demote the attribution, promote the metric.

- **The product UI is the hero, embedded at true fidelity, never an abstract illustration.** Each "Apps/Agents" block pairs a short text claim with a real, recognizable app screenshot (Notion's AI chat, Zapier's dashboard) framed as a floating card with one hairline border + a whisper shadow. For infrastructure, showing what customers actually built is more persuasive than diagrams. Transfers to any dev/SaaS site — render the real interface, lifted just off the page.

- **Extreme whitespace plus hairline structure makes a dense story feel like a spec sheet, not a brochure.** Sections are separated by huge vertical voids (raw shows 96–256px gaps); the only "lines" are 1px `#ebebeb` borders on cards and the nav. The emptiness is the layout — it lets a long, multi-section page breathe and signals engineering confidence (nothing to oversell). Transfers anywhere you want a premium/technical mood: spend whitespace lavishly, draw borders at 1px, and let air do the dividing.

- **A single black mark (the triangle) is the only non-text ink, so the brand is unmistakable while the palette stays at zero chroma.** The page is white → near-white `#fafafa` surfaces → ink `#171717` → greys, with the one solid black logo as the focal mass in the hero and a lone blue `#0072f3` reserved for inline links. Starve the palette and one shape carries 100% of identity. Transfers to brand-forward minimalism: one solid mark on emptiness beats decoration.

## Design-system read

- **Type:** Two families, both Geist — a proportional sans for all headings/body and Geist Mono for labels/metadata. Wide two-cluster scale: a UI ramp (12/14/16/20/22px) plus display jumps (~40/64/110px) with little between — the gap is the hierarchy. Weights are essentially 400 with 500/600 for sparse emphasis; ordering is **size + tracking**, never bold. Leading ~1.5 on body (24px/16px), ~1.0 on display. Tracking goes sharply negative on display (-0.02→-0.05em) and slightly positive on mono labels (+0.04em uppercase).
- **Color:** White monochrome system. `bg #ffffff` → `surface #fafafa` → ink `#171717` → `muted #4d4d4d` → `subtle #666 / #8f8f8f`; borders are a single hairline grey `#ebebeb`. The only saturation is link-blue `#0072f3` (≈`#0070f3`) used inline, and pure black on the logo mark and primary button. No gradients, no tints.
- **Spacing rhythm:** ~4px base, controls cluster tight (2/3/4/6/12px padding & gaps) but sections break with very large vertical voids (40/96/256px in raw). Whitespace is the primary separator; visible dividers are rare and always 1px.
- **Layout system:** Wide content frame; radically asymmetric hero (display headline far-left, mono eyebrow far-right, logo mark centered). Feature blocks alternate a text column with a real product-UI card. Logo wall is an even monochrome row. Captured at 1440×900; mobile collapses to a single stacked column with the same type voices intact.
- **Grid / container:** Captured column counts are **12 / 5 / 2 / 1** — a 12-column base grid with 5-, 2- and 1-column sub-layouts (the feature blocks read as a wide 12-col field carrying a ~5-col text column + a product card). At 390px mobile these collapse / re-order (`12 → 12`, `5 → 1`, `1 → 5`, `2 → 4`), i.e. the multi-column feature rows stack to one column. The re-probe now measures a **wide ~1448px content frame** (near edge-to-edge with only ~24px side margins — the frames confirm it: hero headline pushed far-left, mono eyebrow far-right, logo wall spanning ≈30→1410px), with **~24px gutters** on the 12-col grid. This is a wide content frame, not a tight ~1200px column.
- **Components (from captured states):**
  - **Button** — two forms: a solid `#171717` ink fill with white text (Sign Up / Deploy Now / Deploy a Next.js app) and a hairline-bordered ghost on white (Talk to Sales / View more templates). The ghost CTA "Get a Demo" hovers `bg #ffffff → #f2f2f2` (a 5% grey wash, no lift, no border change). Disabled states were **not captured** (empty `states.disabled`).
  - **Nav** — top-bar text links (Products / Resources / Enterprise / Pricing) are muted `#4d4d4d` and on hover darken to ink `#171717` (color-only, ~100–150ms) — the single most repeated interaction on the page. `Products`/`Resources` are disclosure triggers (dropdown menus; 7 disclosure elements, `navigation-menu` scale/enter keyframes).
  - **Card** — the floating product frame: white surface, 1px `#ebebeb` hairline ring + a whisper drop (`rgba(0,0,0,0.08) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 2px, rgb(250,250,250) 0 0 0 1px`), no hover state (cards are display assets, not interactive).
  - **Input** — the inline "command" field (`npx plugins add vercel/vercel-plugin` with a copy button; the Copilot "Enter an idea…" field inside the embedded UI) is a hairline-bordered pill/box on white; focus styling not separately captured for inputs (the one captured focus is the link ring below).
- **Motion / easing intent:** Quick and restrained. Captured durations run **100 / 150 / 200ms** for hover/state, **300 / 400 / 500ms** for reveals, and a few **700 / 1000ms** for slow loops (logo carousel); the dominant pair is 100/150ms micro-motion. Easings are `cubic-bezier(0.4,0,0.2,1)` (Material standard) for state and `cubic-bezier(0,0,0.2,1)` ease-out for reveals, plus `cubic-bezier(0.32,0.72,0,1)` and `cubic-bezier(0.23,1,0.32,1)` for the longer eased moves (and bare `ease`/`ease-out` on minor transitions). **No stagger** is configured (zero stagger delays) — nothing rises in sequence. The base micro-motion reads as responsiveness and polish; the page's full *choreography* (header recolor, sticky scrollytelling, logo marquee) is detailed in **Interaction & motion** below. Motion = responsiveness, not spectacle.
- **Density:** Low marketing-chrome density (lots of air) wrapped around high-density embedded product shots — the contrast is the point: sparse frame, rich proof.
- **Hierarchy:** Dominant device is **scale** (display vs body gap), reinforced by the sans-vs-mono register split and position (asymmetric placement).
- **Restraint:** No gradients, no color washes, no multi-weight headings, no decorative illustration, no card shadows beyond a hairline + whisper. Color is rationed to one blue and one black mark.
- **A11y (captured, incl. defects):** **Good:** `focus-visible` is present and links get a real 2px `rgb(0,114,245)` focus ring; `prefers-reduced-motion` is respected (19 PRM rules); **image alt coverage is 100%** (`img_alt_ratio: 1`, 18/18 images). **Defect:** **122 of 173 interactive elements are below the 44px tap-target minimum** (`small_tap_targets: 122`) — the dense mega-menus and the ~89-link footer pack many small hit areas, a real touch-usability and WCAG 2.5.5 concern on mobile. Hairline-only `#ebebeb` borders can also fail 3:1 non-text contrast as the sole boundary cue (see safety note). Dark mode is supported (`bg #000`, `fg #ededed`).

## Interaction & motion

Vercel's page is **deliberately near-static — motion is restraint, not spectacle.** The capture is unambiguous: across 11 scroll frames there are **zero entrance reveals** (`entranceReveals: 0`, `staggeredEntrance: false`, no stagger delays configured) — sections are simply *present* as they scroll into view, nothing fades or rises in. Despite **235 IntersectionObservers over 3,766 targets** (Next.js link-prefetch / lazy-mount instrumentation, not animation triggers — confirmed by the frames showing no opacity/transform deltas), 41 scroll listeners, 15 mousemove listeners, and 358 rAF calls, the only page-level motion the frames actually show is a header recolor and an ambient logo crawl; everything else is micro-state on hover. **78 `@keyframes` exist but most belong to embedded product demos / cmdk / tooltips, not the marketing scroll.** `prefers-reduced-motion` **is respected** (19 PRM rules). Stack: `IntersectionObserver` (instrumentation) · CSS `@keyframes` · CSS transitions — **no GSAP/Lenis/Framer**, hand-rolled.

- **Header background-shift on scroll** — *Trigger:* in-view / scroll-progress (sticky header). *Mechanism:* the top bar transitions `background rgba(0,0,0,0) → rgb(250,250,250)` once the hero scrolls under it (it's a `position: sticky` header), so the nav gains a solid surface only when content is behind it (visible s00 transparent → s02+ filled). *Reads as:* the chrome "activating" — transparent over the open hero, solid over content for legibility. *Transfers to:* any sticky top nav over a light hero. *Safety:* **production-safe** (compositor `background`/`position`, no JS scroll math required; pair with a backdrop only if content shows through). → `scroll-background-shift` (no pattern file yet).
- **Sticky-pinned section scrollytelling** — *Trigger:* scroll-progress. *Mechanism:* `position: sticky` on the header plus pinned overlay layers (the raw shows 1 sticky + several fixed pins on nav/skip-link/`pointer-events-none` overlays); in the frames each section's huge display headline ("Agents" → "Apps" → "Platforms") and its brand-quote hold while the framed product card scrolls past beneath, then the next headline takes over (watch s02→s03→s05: "Agents" exits up as "Apps" enters from the bottom; the "…millions of conversations" quote sits put while the Notion card moves). *Reads as:* one claim, evolving evidence — a calm scrollytelling spine. *Transfers to:* feature deep-dives that pair a fixed claim with a moving demo. *Safety:* **production-safe** (native CSS sticky, no scroll-jacking). → `sticky-pin-scrollytelling`.
- **Logo / customer marquee** — *Trigger:* load (continuous). *Mechanism:* an infinite horizontal crawl of customer logos (`logo-carousel`, `customer-carousel-…__scroll`/`mount-li` keyframes; `marquee: 3`), translate-driven loop. *Reads as:* ambient "lots of companies run on this" social proof you absorb rather than read. *Transfers to:* logo walls / press rows on any marketing page. *Safety:* **production-safe with conditions** — must pause on hover/focus, `aria-hidden` the duplicated copy, and stop under reduced-motion (decorative). → `announcement-ticker-marquee` (same translate-loop recipe).
- **Nav / CTA hover micro-states** — *Trigger:* hover. *Mechanism:* nav links crossfade `color #4d4d4d → #171717`; the ghost "Get a Demo" CTA washes `bg #ffffff → #f2f2f2`; ~100–150ms `cubic-bezier(0.4,0,0.2,1)`. The disclosure menus (Products / Resources) scale-in via `navigation-menu` keyframes. *Reads as:* responsive, "rendered with intent" chrome. *Transfers to:* all interactive nav/buttons. *Safety:* **production-safe** (color/background only; keyboard-operable). → `hover-recolor` (no standalone file — see motion-key).

**No** parallax, no scroll-scrub, no scroll-rotate, no count-up, no cursor-follower, no clip-reveal on this page — the evidence doesn't support them, and inventing them would misrepresent a site whose whole motion thesis is *restraint*.

## Production-safety note

This is a live, performance-obsessed platform marketing site — everything here is **production-safe**:
- Mono-label metadata system: **production-safe**, zero cost; just keep label copy short (mono is wide) and tracked uppercase only on labels, never on long mono text.
- Scale-driven hierarchy in one weight: **production-safe**, free.
- Hairline-only structure (`#ebebeb`): **production-safe**; a11y caveat — a single 1px light-grey border can fail non-text contrast (3:1) against white, so don't rely on it as the *only* boundary cue for interactive elements.
- Muted greys: **production-safe** but verify `#8f8f8f`/`#666` on white meet 4.5:1 for small body text; the `#4d4d4d` muted is safe.
- Embedded real-UI screenshots floated on the page: **production-safe** but a **payload/perf watch** — ship responsive `srcset`/AVIF and lazy-load below the fold (this page is ~5.7k px tall).
- One solid-black logo mark on emptiness: **production-safe**; the impact comes from rarity — repeating heavy marks would break it.

## Extracted patterns

- **mono-label-metadata** — the uppercase, letter-spaced monospace voice used for eyebrows, section captions, and spec lists; reuse to separate machine/metadata annotation from prose without adding a color or weight.
- **brand-quote-spec-block** — a customer outcome stated as "_Name_ verb metric on Product" (muted name, ink claim) paired with a mono "Features" spec list and a real product-UI card; reuse for logo-quote social proof that reads as a product claim.
