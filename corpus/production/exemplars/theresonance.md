---
slug: theresonance
url: https://viewport.theresonance.studio
source: landbook
corpus: production
surface: site
captured: 2026-09-21
award_type: Gallery
score: null
tags: [saas, mac-app, product-marketing, dark, developer-tools, design-tools]
when_to_use: [landing, product-marketing, hero, pricing, feature-section, changelog]
directions: [minimalist, soft]
layout: [center-stack, full-bleed]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: https://land-book.com/websites/99424-viewport-macos-screen-recorder-for-designers
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [fixed-viewport-bezel, acrylic-key-control]
tokens_snapshot: ../tokens/theresonance.json
screenshots: ../screenshots/theresonance/
---

## What works (transferable principles)
- **The chrome IS the product metaphor.** A single fixed, rounded "viewport" bezel (glowing blue ring + a `0 0 0 100vmax` black box-shadow matte) frames the *entire* page like the app's own recording window. One decorative layer restates the pitch — "everything you see is inside a viewport" — without a word of copy. Transfers to any tool whose value is a container/canvas/frame (recorders, editors, browsers, cameras): make the site inhabit the product's frame instead of screenshotting it.
- **Brand mark → page frame continuity.** The wordmark glyph is a tiny rounded-rectangle "viewport"; on load it morphs from that logo-sized rect up to the full-screen bezel. The identity, the loader, and the page shell are the *same object* at three scales — the cheapest possible way to feel designed-through.
- **Sell the product by rebuilding it in the DOM, not by pasting a PNG.** The hero and every feature card contain a pixel-faithful, self-animating replica of the macOS app (timeline with draggable action chips, export quality/scale/frame-rate toggles, a live "Recording" state). Live DOM demos stay crisp at any zoom, theme with your tokens, and can choreograph themselves in-view — far more convincing than a static mockup.
- **Hierarchy from scale + one accent word, in a near-monochrome field.** Section headers are a 4.5rem display line where only the *last* word takes the brand blue ("Record. Refine. **Share.**"). Everything else is off-white on near-black. Color is spent almost nowhere, so the one blue word and the blue CTA carry the whole page. Reusable anywhere you want punch without a palette.
- **Cathedral whitespace as pacing.** Sections are separated by tall empty voids (`py` 80→144px plus large intrinsic gaps); the page breathes between each idea so a dense product demo never feels cluttered. Whitespace, not dividers, does the sectioning.
- **A three-font system that encodes function.** A display face (`ritual`) for headlines, a grotesque (`Geist`) for body/UI, and a monospace (`Geist Mono`) reserved for the product-demo chrome (timestamps, field labels). The mono is what makes the fake app read as *software*; the split keeps marketing voice and product voice legible as different registers.

## Design-system read
- **Type:** Three roles. Display `ritual` (H1 ≈ 4.5rem/72px, tracking −2.1px ≈ −0.03em, leading ≈ 1.0) → fluid down to 40px on mobile; body `Geist` at 16px/24px (1.5); mono `Geist Mono` for demo UI. Hierarchy is scale-driven (~4.5× body→display) in weights 400/500 only — almost no bold. Tight negative tracking on display, near-zero on body.
- **Color:** Dark-only, near-monochrome. bg near-black navy `#090d14`; fg off-white `#eceef2`; muted slate `#8792a5` / `#c2cad8`. A single brand blue `#4f8cff` (with `#2888ff` stroke and `#a7caff` bevel highlight) is the *only* chromatic accent in marketing surfaces. Product-demo surfaces add a full semantic set — success green, danger red `#ff5f57`, amber — but those live inside the mock app, not the page. Borders are white at ~10% alpha (hairlines at 8%).
- **Spacing rhythm:** 4px base (`--spacing: .25rem`), Tailwind-v4 scale (4/8/12/16/24/32…); section padding steps 80/112/144px across breakpoints. Whitespace is generous and rhythmic; gaps cluster at 8/16.
- **Layout system:** Centered, full-bleed single column with content capped ~1194–1368px; features are a 2-up card grid that collapses to 1 on mobile. Flex-dominant (171 flex vs 5 grid). One breakpoint of consequence (~600px). Everything sits inside the fixed bezel's inner rectangle.
- **Layering / page architecture:** Not a scroll-over-still-world (no static backdrop / blend overlay). The z-story is a small fixed stack over normally-flowing content: a full-viewport `page-transition-root` (z1000) for route morphs, the **fixed viewport bezel** (the signature masking frame), a glass **pinned header** pill (z50), a hidden scroll-progress pill (z1001), and one `sticky` demo sidebar (z20) inside a feature card. Sections are transparent; the mood comes from a page-level deep-black→bright-blue vertical gradient (`--gradient-cta`) so the page appears to rise out of black into a blue "horizon" at the CTA/footer.
- **Motion / easing intent:** Two easings do everything — `cubic-bezier(0.4,0,0.2,1)` for UI transitions (~150ms) and `cubic-bezier(0.16,1,0.3,1)` (`--ease-reveal`) for entrances (~700ms). Motion communicates *assembly and playback*: content reveals up in-view, the demo assembles then "plays" a recording (action chips light in sequence, video clip-reveals). Reduced-motion is respected (3 PRM rule blocks; reveals fall back to static).
- **Density:** High inside the demo (a real app UI), low everywhere else. The contrast is the point — dense proof floated in calm space.
- **Hierarchy:** Scale first, then the single accent-blue word, then position. Weight is never the lever.
- **Restraint:** No hero video autoplay spectacle, no multi-hue gradients in copy areas, no parallax theatrics, no bold weights. One accent color, two easings, three fonts.

## Interaction & motion (evidence-backed)
- **Fixed viewport bezel + matte** — *Trigger:* load (persists on scroll). *Mechanism:* a `position:fixed` centered rounded rect with `box-shadow: …#a7caff 0 0 0 4px inset, #2888ff 0 0 0 4px, #000 0 0 0 100vmax` — the giant last spread paints everything *outside* the frame black, so the page reads as content inside a glowing window. `pointer-events:none`. *Reads as:* "you're looking through the product's viewport." *Transfers to:* any container-shaped product. *Safety:* **production-safe** (one fixed element, no per-frame work; `will-change` is set but it's static after load). See `patterns/fixed-viewport-bezel.md`.
- **Logo→frame morph on load** — *Trigger:* load. *Mechanism:* the bezel animates from the wordmark glyph's size (64×39px, 12px radius, offset like the logo) to full-viewport, driven by the `demo-assemble`/page-transition system. *Reads as:* the mark "opening" into the page. *Transfers to:* brand-forward loaders. *Safety:* **production-safe**; gate the morph behind `prefers-reduced-motion` (jump to final frame).
- **In-view reveal-up, staggered** — *Trigger:* in-view (IntersectionObserver, threshold 0.12, rootMargin `0px 0px -8% 0px`; ~65 targets). *Mechanism:* `animation: reveal-up .7s cubic-bezier(.16,1,.3,1) both` (opacity+translateY) toggled by an `.animate-*` class when the IO fires; siblings staggered 90–270ms. *Reads as:* orderly settling. *Transfers to:* any sectioned marketing page. *Safety:* **production-safe**; `motion-reduce:animate-none` present.
- **Self-playing product demo** — *Trigger:* in-view + rAF loop (1277 rAF calls). *Mechanism:* inside the DOM mockup, action-chip labels color-shift in sequence (Load URL→Scroll→Click), a `video` clip-reveals via `inset()` clip-path, an `export-complete-pulse` fires. *Reads as:* watching the app record a take. *Transfers to:* explaining any timeline/sequence product. *Safety:* **production-safe** but rAF-heavy — pause when offscreen and honor reduced-motion.
- **Masked logo marquee** — *Trigger:* load (CSS `marquee` keyframe, ~44s). *Mechanism:* translateX loop under a `--mask-marquee` edge-fade gradient. *Reads as:* social proof in motion. *Safety:* **production-safe**; pause-on-hover / reduced-motion recommended.
- **Glass pinned header + hover fills** — *Trigger:* scroll / hover. *Mechanism:* `backdrop-filter: blur(8px)` header pill; nav links fade 77%→100% white, buttons gain an acrylic bevel + blue focus ring on hover. *Safety:* **production-safe**.

## Production-safety note
- The bezel matte and reveal-up are cheap and safe. The only real cost is the always-on rAF product demo (1277 calls) — throttle it offscreen. Tap targets: the profile flags 21 small targets (dense demo controls) — fine as decorative mock UI, but don't ship controls that small as real interactive elements. Everything honors `prefers-reduced-motion`.

## Extracted patterns
- fixed-viewport-bezel — a fixed, glowing rounded frame that masks the whole page inside a "window" via a `100vmax` box-shadow matte (optional logo→frame load morph). Reuse for container-metaphor products.
- acrylic-key-control — glossy macOS-native control surface (light-top / dark-bottom inset bevel + colored ring) for primary buttons and the pricing card. Reuse for a tactile, OS-native primary action.
