---
slug: monogrid
url: https://weekend-mm-2026-pasticcino-bag-master.monogrid.io
source: awwwards
corpus: expressive
surface: site
captured: 2026-09-14
award_type: Site of the Day
score: null
tags: [fashion, ecommerce, brand-experience, illustrated, storytelling, painterly, immersive, audio]
when_to_use: [brand-experience, interactive-showcase, hero-spectacle, landing, ecommerce]
directions: [expressive, editorial]
layout: [full-bleed, canvas-immersive]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-ok]
provenance:
  gallery_url: https://www.awwwards.com/sites/the-tuscan-journey-begins
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [torn-paper-viewport-frame, scroll-tilt-diorama]
tokens_snapshot: ../tokens/monogrid.json
screenshots: ../screenshots/monogrid/
---

## What works (transferable principles)

- **Make the entire viewport one painted "world," then float the UI on top of it instead of laying it out in document flow.** The whole screen is a single illustrated train compartment (window, two bench seats, a suitcase, the product bag) rendered edge-to-edge; every piece of interface — a title card, a "Start now" button, a sound toggle, a logo ribbon — is absolutely/fixed-positioned over that scene, not stacked in a column. Mechanism: the illustration *is* the layout, so composition is art-directed by where objects sit in the painting rather than by a grid. Transfers to any brand-experience or campaign intro where you want the reader to feel *placed somewhere* rather than reading a page — the discipline is: one immersive backdrop, chrome as sparse floating plates.

- **Frame the immersive scene with a pinned torn-paper border so it reads as a storybook page, not a browser window.** A full-viewport `position: fixed` overlay (`pointer-events: none`, z above the scene) draws a deckled/hand-torn paper edge around all four sides; it stays pixel-locked while the scene and content scroll *inside* it. Mechanism: a static frame layer converts "scrolling a website" into "looking through an aperture into a world," and the irregular torn edge signals handcraft/illustration, killing the rectangular-screen feel. Transfers to editorial, children's-book, game, and campaign microsites — any time you want containment + tactile craft cheaply (one PNG/SVG frame, zero JS). See `torn-paper-viewport-frame`.

- **Build a travel-poster title with scale + tracking *polarity*, not multiple fonts.** "THE / **TUSCAN JOURNEY** / BEGINS" is one grotesque family: micro caps at +0.25em tracking bracketing a ~92px display word at slightly-negative tracking, all centered. The tiny wide-spaced labels read as engraved captions; the huge tight word reads as a monument. Mechanism: hierarchy comes from the *opposition* of two tracking extremes at two size extremes in a single typeface — cheaper and more coherent than a display/body font pairing. Transfers to any hero/masthead that wants vintage-poster gravity from one webfont. (Reuses the corpus `staggered-display-headline` idea; here it's centered + bracketed rather than staggered.)

- **Lock the UI palette to pigments pulled straight from the illustration so the chrome looks painted-in.** The title card, ribbon, and button use only deep olive `#465016`, forest `#23280b`, and parchment cream `#dfddcb` — the exact greens and creams already in the painted scene and the Pasticcino crest. No system blue, no pure-white card. Mechanism: sampling the interface colors *from* the artwork makes buttons and panels feel like props inside the world instead of stickers pasted over it. Transfers to any illustrated/photographic hero — spend your UI color budget out of the image's own palette, reserve pure white only for the highest-contrast type.

- **Render the primary CTA as a physical sticker: an organic blob edge + a hard offset shadow with zero blur.** "Start now" is a torn cream lozenge with a wavy (non-geometric) outline and a `2.4px 3.6px 0 rgba(66,38,1,0.25)` umber shadow — offset, no blur — so it reads as a die-cut paper sticker resting on the scene, casting a flat drop like cut paper. Mechanism: hard-offset (blur-0) shadows read as *paper/print*, soft blurred shadows read as *screen/material* — choosing blur-0 is what makes it tactile. Transfers to playful/craft brands; pair with an irregular mask so the button doesn't betray its rectangle.

- **Treat the page as an *attraction* with diegetic controls and an explicit entry gate.** A fixed sound toggle (a little wooden token, bottom-left), an "Activate sound for a better experience" prompt, and a single "Start now" gate frame the site as a guided, audio-led ride rather than a scrollable document. Mechanism: acknowledging sound/entry up front sets expectations and earns the immersive motion budget; the gate also defers the heavy rAF/audio/canvas work until the user opts in. Transfers to any experience-led campaign — declare the ride, give one clear way in, keep the controls in-world.

## Design-system read

- **Type:** One grotesque family (**Nimbus** — a Helvetica/Nimbus-Sans clone — plus an **Extended** cut for display), two weights (400/700). Hierarchy is pure **scale + tracking polarity**: body/label 16–20px at *positive* tracking (eyebrows at ~+0.25em / +4.5px), the display word at ~92px / 0.93 line-height and *slightly negative* tracking (−0.83px). No serif, no third font; the "vintage editorial" tone is manufactured entirely by tracking extremes on one sans. `fluid_type: false` — sizes are stepped, not clamped.
- **Color:** A pigment palette sampled from the painting. **Olive** `#465016` (panel/ribbon fill, the workhorse surface), **deep forest** `#23280b` (darkest band / ribbon shadow), **mid olive** `#616a37`, against **parchment cream** `#dfddcb` and `#d9cdad` for text-on-green and the sticker. Pure **white** `#ffffff` is reserved for type sitting directly on the sienna scene (the dominant world ground is warm umber/sienna, ~`#6b4a28`, supplied by the illustration, not a token). The only "accent" is the green itself; there is no chromatic UI accent and no semantic color — this is a single-campaign world, not a product system.
- **Spacing rhythm:** Roughly 8px-based (`gap: 8/20px`), but spacing is mostly *compositional* — objects are placed in the painting, and the floating chrome sits at fixed insets (`bottom-6 left-6` toggle, `bottom-10` CTA). Container maxes at ~1464px but the scene is full-bleed beyond it.
- **Layout system:** `full-bleed` / `canvas-immersive`. Almost no grid does real work (2 grid + 12 flex nodes; a `grid-cols-[1fr_auto_1fr]` header for balance). The page is a stack of layers: painted scene → SVG object groups → torn-paper frame overlay → floating chrome (header ribbon, CTA, sound toggle, modal-root). Breakpoints at 640/768/1024; mobile keeps the same immersive scene cropped to portrait (the title card and CTA re-center).
- **Layering / page architecture:** The z-axis IS the design. `architecture.layers` shows **5 fixed layers, 0 sticky**: a 100%-coverage `div.framing` (the torn-paper frame, `pointer-events:none`, z1), the header logo ribbon, the sound toggle (`z-menu`, bottom-left), a modal-root (z5), and a pinned-footer CTA. `has_static_backdrop:false`/`has_blend_overlay:false` — no blend/glass tricks; depth is honest painted layers + a pinned frame, not mix-blend. The scene's illustrated groups (inline SVG `<g>`) are the moving depth planes.
- **Motion / easing intent:** Three authored tempos — `600ms cubic-bezier(0.55,0,1,0.45)` (an accelerate-in curve, the dominant one ×4), `300ms ease`, `500ms cubic-bezier(0.4,0,0.2,1)` (Material standard). `keyframeCount: 10` (all from `vue-boost-marquee` + a `spinner` loader). The heavy lifting is a **rAF engine (1094 calls)** driving scroll-progress transforms and one **pointer-parallax** (`mousemove: 1`); **no IntersectionObserver, no scroll listeners** — effects are read off scroll progress each frame. Intent: a gently *living diorama* — the painted world sways and breathes as you travel through it, like watching scenery from a moving train.
- **Density:** Very low surface density — one scene, one title, one button. All the richness is pictorial, not informational. It buys attention with a single fully-realized image.
- **Hierarchy:** Dominant ordering device is **position within the painting** + **scale** of the title. Weight and color barely rank anything.
- **Restraint:** No gradients on chrome, no glass/blur, no blurred shadows (only the hard sticker offset), no accent hue beyond the palette's own green, no autoplaying audio (gated behind a prompt), and — notably for an expressive site — **reduced motion is respected**.

## Interaction & motion

Evidence base: 11 scroll frames (s00→s10 hold on the gated intro state, so the *entry* choreography is read from `scroll_effects` + `entrance` deltas + keyframe names, not frame-to-frame diffing), plus probe counts: **rAF 1094**, **mousemove 1**, **scroll listeners 0**, **IntersectionObserver 0**, **5 fixed layers**, **1 canvas + 1 video**, **10 `@keyframes`** (all marquee/spinner), **respectsReducedMotion: true** (10 `prefers-reduced-motion` rules). No GSAP/Lenis/Locomotive global detected — hand-rolled or bundle-opaque rAF over native scroll. Stack: Vue/Nuxt · UnoCSS · `vue-boost-marquee` · rAF transform engine · inline SVG · HTML `<video>` + `<canvas>`.

- **Scroll-progress diorama tilt** — *Trigger:* scroll-progress. *Mechanism:* inline SVG object groups (`<g>`) and scene layers have their `transform: rotate()` driven off scroll progress by a per-frame rAF loop — the profile catches groups rotating **+9.3°, +5.7°, +1.1°, −3.7°**. *Reads as:* the painted furniture and props *sway* as the page travels, evoking the rocking of a moving train — the world feels alive rather than a flat backdrop. *Transfers to:* illustrated/campaign scenes wanting ambient life on scroll. *Safety:* **spectacle-only** — transform-only so GPU-cheap, but it's a free-running rAF engine over native scroll; gate on `prefers-reduced-motion` and keep angles small. See `scroll-tilt-diorama`.

- **Pointer parallax on scene layers** — *Trigger:* pointer (`mousemove: 1`). *Mechanism:* a single mousemove handler feeds a shared pointer delta into the same rAF loop; scene planes translate by a per-layer depth factor, nearer objects moving more. *Reads as:* a diorama with real depth — the compartment has near seats and a far window that separate as you move the cursor. *Transfers to:* any layered illustrated/photographic hero (fine-pointer only; no-op on touch). *Safety:* **spectacle-only** — decorative, invisible to keyboard/touch; must idle when the pointer is still and disable under reduced motion. (Corpus already has `floating-scatter-parallax-stage` for the pointer-only variant; `scroll-tilt-diorama` folds pointer + scroll together.)

- **Staggered title reveal** — *Trigger:* in-view / scroll-progress on the title card. *Mechanism:* the card's lines fade+rise in sequence — "The" → "TUSCAN" → "JOURNEY" → "begins" → subcopy — each an `opacity 0→1` + small `translate`, staggered (`staggeredEntrance: true`, 24 entrance reveals; the dominant `600ms cubic-bezier(0.55,0,1,0.45)`). *Reads as:* the poster assembling itself, drawing the eye down the hierarchy. *Transfers to:* any hero title — the safest technique here. *Safety:* **production-safe** iff a resting (fully-visible) state ships and reduced-motion collapses the stagger to an instant show.

- **Skewed logo marquee ribbon** — *Trigger:* load (infinite loop). *Mechanism:* a `vue-boost-marquee` keyframe translates a repeating "PASTICCINO" crest strip horizontally; the band is skewed like banner tape across the top of the frame. *Reads as:* a decorative brand valance / bunting, reinforcing the campaign identity without a nav. *Transfers to:* brand headers, ticker bars, festival/campaign chrome. *Safety:* **production-safe** (transform-only) but an infinite loop — pause it under `prefers-reduced-motion`.

- **Ambient canvas texture + windowed video** — *Trigger:* load. *Mechanism:* 1 `<canvas>` (per rAF budget, a paint/grain/particle texture over the scene) and 1 `<video>` (likely the view through the train window). *Reads as:* the painterly grain and passing scenery that sell "hand-illustrated, in motion." *Transfers to:* atmospheric illustrated scenes. *Safety:* **spectacle-leaning** — budget the canvas loop and gate/poster the video; both should quiet under reduced motion.

## Production-safety note

- **Immersive full-viewport illustrated world** — **spectacle-only by nature.** Cost: a single large hero image/scene is the LCP and the whole payload; ship a compressed poster + `fetchpriority`, and ensure the content/CTA is real DOM (it is — SVG text, a real `<button>`), not baked into the picture, so it stays accessible and selectable.
- **Pinned torn-paper frame** — **production-safe.** One fixed `pointer-events:none` layer; free. Only caveat: keep it out of the a11y tree (decorative) and make sure it never covers interactive targets.
- **Sticker CTA (organic edge + hard offset shadow)** — **production-safe.** Pure CSS/SVG; just guarantee the visible label is real text with a focus ring (it is: `outline: 1px rgb(16,16,16)`), not an image.
- **Scroll-progress tilt / pointer parallax / ambient canvas** — **spectacle-only.** Cost: continuous rAF main-thread load and motion-sickness risk from rotating scenery; the redeeming detail this site gets *right* (unlike many expressive peers) is `respectsReducedMotion: true` — copy that, gate every rAF effect behind `prefers-reduced-motion` and a coarse-pointer check, and let the page rest as a still painting.
- **Gated audio** — **production-safe and exemplary.** Sound is opt-in behind a prompt/toggle, never autoplayed. Copy this.

- **Accessibility scorecard (from `.craft.a11y`):** `focus_visible: true` (the `Start now` button and controls get a `1px` outline) — **passes**; `reduced_motion: true` with 10 PRM rules — **passes** (rare for a spectacle site); `img_alt_ratio: 1.0` — passes, though only 1 raster image was probed (most of the scene is SVG/canvas, so alt coverage is thin data); `small_tap_targets: 0` of 3 interactive — **tap-targets-ok**. Headings: 1 `<h2>`, **no `<h1>`** (the visual title is SVG/`<h2>`) — a minor semantic gap to fix in a production port. Overall: unusually responsible for an immersive campaign site.

## Extracted patterns

- **torn-paper-viewport-frame** — a full-viewport pinned deckled/torn-paper frame overlay containing a full-bleed illustrated world, with sparse floating diegetic chrome; reuse for storybook/campaign/game microsites wanting tactile containment (production-safe, static).
- **scroll-tilt-diorama** — scroll-progress rotation + pointer parallax of layered scene elements so a painted/illustrated backdrop sways and gains depth as you travel; reduced-motion- and pointer-gated (spectacle-only, motion).

### Patterns reused (already in the corpus)
- **staggered-display-headline** — the travel-poster title (bracketed micro-caps + huge display word, one family, tracking polarity) is a centered variant of this. (typography)
- **floating-scatter-parallax-stage** — the pointer-parallax component of the diorama is this pattern's pointer-only sibling. (motion)
