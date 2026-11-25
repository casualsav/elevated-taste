---
slug: clarionhealth
url: https://www.clarionhealth.com
source: landbook
corpus: production
surface: site
captured: 2026-09-28
award_type: Gallery
score: null
tags: [healthcare, saas, ai, b2b, editorial, warm, serif]
when_to_use: [landing, product-marketing, feature-section, hero, navigation]
directions: [editorial, soft]
layout: [full-bleed, scroll-theater]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high]
provenance:
  gallery_url: https://land-book.com/websites/100493-home
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [split-showcase-active-list, pinned-horizontal-scroll-carousel]
tokens_snapshot: ../tokens/clarionhealth.json
screenshots: ../screenshots/clarionhealth/
---

## What works (transferable principles)
- **A three-ground band system carries the whole page.** Instead of one flat background, sections alternate between a warm off-white (`#fbfaf8`), a deep desaturated teal (`#072d35`, hero + CTA), and an espresso brown (`#3c210c`/`#361700`, feature panels + the pinned carousel). Each dark band bookends or punctuates a run of light bands, so scrolling feels like moving through rooms rather than down a list. Reusable anywhere you want rhythm without decoration — the color *is* the section divider, so you can drop borders and shadows entirely (this page ships **zero box-shadows**).
- **Editorial serif display over sans body, hierarchy from scale not weight.** A single light-weight serif (Moderat Serif Trial) does every heading; Geist sans does all body and UI. Headings run ~500 weight but read light because the serif is delicate and the tracking is negative (`-0.03em`); the jump from 1rem body to ~3.85rem h1 (a ~3.8× scale contrast) is what creates the hierarchy, not boldness. Transfers to any calm, premium, human brand (health, finance, wellness) that wants warmth without a heavy grotesk.
- **Warmth is engineered into the neutrals, not added as an accent.** The off-whites are hue-shifted toward cream and the "black" text is actually deep brown (`#361700`), not `#000`. A near-monochrome brown/cream field with one rust accent (`#a73524`) reads far warmer and more editorial than a gray-neutral palette with a colored accent. Reusable rule: tint your neutrals toward the brand hue before you reach for accent color.
- **Full-bleed photography gated by a gradient scrim, so overlaid text is always legible.** The hero image fades into the teal band via a bottom-anchored `linear-gradient(rgba(7,45,53,0) 18%, #072d35 92%)`; the logo marquee sits in that darkened zone. Same trick on the CTA. The gradient does double duty — it both darkens the plate under white type and stitches the photo into the section's solid color. Transfers to any hero/CTA that overlays copy on a photograph.
- **A pill nav that floats and re-skins over changing grounds.** The fixed nav is a rounded-`1000px` capsule (cream fill, `999` z) that reads over teal, brown, and cream alike because it carries its own opaque surface. Floating chrome like this survives a multi-ground page where a transparent bar would become illegible on some bands.
- **Marquees and a horizontal carousel replace "three feature cards."** Proof (customer logos, integration logos) scrolls as edge-faded marquees; the process story ("Implementation made easy") is a pinned horizontal-scroll carousel of tall photo cards. The page never falls back to the generic 3-up icon grid — every band has a purpose-built shape.

## Design-system read
- **Type:** Two families, clear division of labor — **Moderat Serif Trial** (light editorial serif) for all headings, **Geist** (variable sans) for body/UI/eyebrows. Modular scale ≈1.2–1.25: eyebrow 0.8rem · body 1rem · para-lg 1.25rem · para-xl/h4 1.5rem · h3 1.75rem · h2 3rem · h1 3.5rem (fluid up to ~3.85rem/61.7px desktop, down to 40px mobile). Headings weight 500, body 400. Tracking tightens as size grows (body −0.16px → h1 −1.85px), a size-proportional ramp. Line-height 1.1 on display, 1.5 on body.
- **Color:** Near-monochrome warm system. Grounds: cream `#fbfaf8` / `#fdfcfb` / `#f6f5ed`, teal `#072d35`, brown `#3c210c`+`#361700`. Text: deep brown `#361700` on light, off-white `#fbfaf8` on dark, muted `#71604e`. One rust accent `#a73524` for emphasis/underlines; a mint `#c9edde` and teal `#257787` appear only inside product illustrations. Borders are barely-there warm hairlines (`#e7e4da`, `#eeece3`). Roles are carried by ground + hue, not by saturation.
- **Spacing rhythm:** 8px base. Section padding 6.25rem (100px), stepping to 10rem / 12.5rem on the tall bands. Grid gaps 8 / 20 / 40px. Generous vertical air — the page is long and calm, letting each band breathe.
- **Layout system:** 1400px (87.5rem) max container centered; mostly flex, with `grid` reserved for the split panels and stat blocks. Split feature card is ~50/50 photo|panel. Breakpoints at 479/767/991/1280/1440/1920. On mobile the pinned carousel and marquees degrade to static stacked/columnar layouts.
- **Layering / page architecture:** Largely a single flat scroll — `has_static_backdrop: false`, `has_blend_overlay: false`, no `backdrop-filter` glass except a subtle blur behind the hero marquee. Depth comes from (a) the fixed pill nav (`z 999`) floating over content, and (b) one `position: sticky; height: 100vh` **pin** on the implementation carousel that holds the band still while its cards translate horizontally. Everything else is normal document flow on solid grounds.
- **Motion / easing intent:** Two easings — `ease` for small state changes and `cubic-bezier(0.165, 0.84, 0.44, 1)` (a decelerating "expo-out") for the expressive ones. Durations 200/300/350/400ms for UI; 44s/60s/100s for the infinite marquees. Motion communicates *continuous, effortless operation* (things that run themselves) — nothing bounces or demands attention. `prefers-reduced-motion` is respected across marquees and reveals.
- **Density:** Moderately low. Long single-column-ish narrative with big type and lots of whitespace; information is metered out one band at a time rather than packed into a dashboard-dense grid.
- **Hierarchy:** Scale + ground contrast are the dominant ordering devices. Position (centered hero, left-panel split) and the lone rust accent are secondary.
- **Restraint:** No box-shadows anywhere. No gradients except the two photo scrims and the marquee edge-fades. One accent hue. Two typefaces. The calm is deliberate — a healthcare buyer needs to feel safety, not spectacle.

## Interaction & motion (techniques)
- **Pinned horizontal-scroll carousel** — *Trigger:* scroll-progress. *Mechanism:* a `position: sticky; top:0; height:100vh` track pins the "Implementation made easy" band while GSAP ScrollTrigger maps vertical scroll to a horizontal `translateX` of the tall photo cards (evidence: `carousel-pin` sticky layer at 96%×100vh, `cc-scroll` section `overflow: clip`, `transform/parallax` scroll-effect, GSAP+ScrollTrigger in the bundle). *Reads as:* a guided, cinematic walk through the process steps. *Transfers to:* multi-step process / feature tours. *Safety:* **production-safe** *if* it falls back to a normal stacked/scrollable list — and this one does: at ≤991px `carousel-pin` becomes `position: static`, so the pin is desktop-only. Cost: hijacks scroll velocity while pinned; keep the pinned distance short. See `patterns/pinned-horizontal-scroll-carousel.md`.
- **Edge-faded infinite logo marquee (pure CSS)** — *Trigger:* load (autoplay). *Mechanism:* a duplicated `_track` translated by a `@keyframes …-scroll` at `linear` timing over 44–100s; container carries a `mask-image` / gradient fade at both edges so logos dissolve rather than clip; `:hover` sets `animation-play-state: paused`. *Reads as:* a living roster of partners/integrations. *Transfers to:* logo walls, testimonial ribbons, "works with" strips. *Safety:* **production-safe** — animates only `transform`, GPU-composited, and fully disabled under `prefers-reduced-motion` (the site sets `animation: none`). Cheapest possible "alive" element.
- **Active-item list that swaps a paired panel** — *Trigger:* in-view / auto-advance (Swiper-driven tabs). *Mechanism:* a stacked vertical menu (Inbound receptionist / Documents & referrals / Outbound engagement) where the active label is full-strength brown-on-white and the rest are muted, paired with a photo/visual that changes with the active row. *Reads as:* one capability at a time, without tab chrome. *Transfers to:* feature explainers, product-mode switchers. *Safety:* **production-safe**. See `patterns/split-showcase-active-list.md`.
- **Photo-into-color gradient scrim** — *Trigger:* static (no motion). *Mechanism:* a bottom-anchored linear-gradient from transparent to the section's solid ground darkens the base of a hero photo and blends it into the band. *Reads as:* seamless, premium. *Transfers to:* any text-over-photo hero/CTA. *Safety:* **production-safe**.
- **Pill hover re-skin** — *Trigger:* hover. *Mechanism:* nav links/buttons transition `background` + `color` over 200–300ms on the expo-out curve (e.g. rust button darkens `#3c210c → #674200`; ghost link fills with a warm neutral). *Reads as:* soft, tactile. *Safety:* **production-safe**.

Reduced motion: **respected** (`respectsReducedMotion: true`; marquees and reveals disabled). Focus-visible outlines present; a skip-link exists. Caveat: 16 of 39 interactive elements measured as small tap targets — audit hit-area on the icon/pill controls before reuse.

## Production-safety note
- Everything here is production-safe. The only technique that needs care is the **pinned horizontal carousel** (scroll-jacking): keep the pinned scroll distance short, animate only `transform`, and — as this site does — collapse it to a static list below the desktop breakpoint and under reduced-motion.

## Extracted patterns
- `split-showcase-active-list` — 50/50 photo + dark panel where a stacked menu highlights the active capability and swaps the paired visual; reuse for feature explainers.
- `pinned-horizontal-scroll-carousel` — sticky-pinned band whose cards translate horizontally with scroll, with a mandatory static fallback; reuse for process/step tours.
