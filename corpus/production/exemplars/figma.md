---
slug: figma
url: https://www.figma.com
source: Reference
corpus: production
surface: site
captured: 2026-06-24
award_type: "Reference"
score: null
tags: [saas, design-tool, creative, collaboration, b2b, multi-color, expressive-but-shipping]
when_to_use: [landing, product-marketing, hero, feature-section, interactive-showcase, navigation, footer]
directions: [expressive, editorial]
layout: [split-hero, content-grid]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [oversized-display-headline, product-ui-on-tinted-panel, spotlight-quote-card, source-avatar-pill, tabbed-product-showcase, scroll-scale]
patterns_to_build: [cursor-reveal-canvas, primitive-shape-collage, brand-rotating-testimonial]
tokens_snapshot: ../tokens/figma.json
screenshots: ../screenshots/figma-com/
---

## What works (transferable principles)

- **Run a *light* base weight (~330) and let SIZE, not weight, carry hierarchy.** Figma's variable display face sits at weight 330 for the bulk of text (622 nodes) with 400 as the next step; bold (700) appears once on the whole page. The opposite of the "raise the floor to 500" move — here the floor is *dropped* to ~330 so the huge display sizes feel airy and confident rather than heavy. It only works because the headline scale is enormous (72px) and the tracking is pulled tight; at small sizes a 330 weight would smear, so the body holds at 400. Transfers to any brand that wants a refined, gallery-like calm under playful content: thin the weight, enlarge the scale, tighten the tracking — don't bold.

- **A loud, multi-hue palette stays legible because color lives in the *content*, never the chrome.** The page touches cyan, lime, indigo, orange, gold, green, pink — but every one of those hues is inside a community-work thumbnail, a decorative primitive shape, or a brand quote-glyph. The structural layer (nav, body copy, CTAs, footer) is strictly black / white / cool-slate. So the canvas reads as "a tool that makes colorful things" while staying readable. Transfers to any creative / UGC / portfolio product: desaturate the frame to its bones and let user content (or decorative motifs) supply 100% of the chroma — the inverse of Attio's "starve the marketing palette," reached by the same discipline of *where* color is allowed.

- **Oversized display headlines set in the brand's own face are the hero, not a screenshot.** Section headlines run 56–72px, near-black, on white, with negative tracking scaled to size (−1.44px at 72, −0.84px at 56). A pull-quote like "Nearly everything that designers and developers need is available in Figma." fills the column at display scale and *is* the visual. Transfers anywhere the brand's typography is itself a credential (design tools, type foundries, editorial) — let the word be the picture and skip the decorative image.

- **Decorate with the product's own primitives — including its selection UI — as iconography.** The pre-footer composition is built from raw geometric shapes (circle, diamond, scalloped "flower," squiggle on a checkerboard) wearing Figma's signature *green selection handles* on their corners. It's brand decoration that doubles as a wordless "this is what you do here" — you compose shapes on a canvas. Transfers to any tool whose canvas/primitives are recognizable: dress your decoration in your own UI chrome so ornament also demonstrates the product.

- **Outline-as-elevation: a 1px inset ring instead of a drop shadow.** The secondary "Contact sales" button and several cards carry a `0 0 0 1px inset` black (or white-on-dark) ring rather than a shadow; the only real shadow on the page is one deep `0 24px 70px rgba(0,0,0,.1)` reserved for the floating hero demo card. Flat structure from rings keeps the busy, colorful page from accumulating shadow-grime, and concentrates depth on the single element meant to float. Transfers to any dense or colorful UI where stacked shadows would muddy: define structure with hairline/inset rings and spend a real shadow only on the one floating object.

- **Rotate testimonials by swapping the brand mark *and* the accent glyph together.** Each quote pairs a giant quotation-mark glyph tinted to match the testifier (cyan for Perplexity, gold for GitHub) with that company's wordmark and an author face-pill. The color-coded glyph makes social proof feel bespoke per logo while reusing one layout. Transfers to any social-proof carousel: tie one accent token to the active logo so the slot re-skins itself instead of looking like a static quote with a swapped name.

## Design-system read

- **Type:** Custom `figmaSans` (variable; with `figmaMono` for labels). Two body sizes dominate — **18px (635 nodes) and 16px (559 nodes)** — then 24px subhead, and a display pair at **56 / 72px**. Hierarchy is **scale-driven in a single light weight family**: base ~**330**, with 400 / 340 / 320 in the mix and 480–520 for the rare emphasis; **700 used once.** Leading is generous on body (~1.4: 25.2px on 18, 23.2px on 16) and snaps tight on display (72/72 = 1.0, 56/61.6 ≈ 1.1). Tracking tightens with size — −1.44px @72 (−2%), −0.84px @56, −0.24px @24, −0.12/−0.14 on body — and inverts **positive** for small caps/labels (+0.48–0.6px). `font-feature: "kern"`; no fluid `clamp()` (fixed breakpoints).
- **Color:** Black / white / cool-slate structural core — `bg #ffffff`, near-black `fg #000000`-ish, muted `#697485` (cool slate, 4.73:1 on white — passes). Chroma is rationed entirely to content + decoration: cyan `#33dfdf`, lime `#e4ff97` / pale-lime `#f3ffe3`, green `#24cb71`, sky `#00b6ff`, indigo `#4d49fc`, lavender `#c4baff`, orange `#ff7237`, gold `#b98e01`. The primary CTA is **near-black fill** (not a brand hue); the persistent Config announcement bar is the one saturated band (green `#24cb71`) and correctly uses **black** text on it (9.86:1), not white. Two decorative `repeating-conic-gradient` sunbursts (cyan, gold) are the only gradients.
- **Spacing:** 8px base. Component gaps cluster at 6 / 8 / 16 / 24px; a distinctive **60px** column gap (25 nodes) opens the feature rows; section padding jumps to **120px** vertical. Whitespace does the macro-separation — no divider bands.
- **Layout / grid:** centered container at 1440 viewport; feature rows use **2- and 3-column** layouts, community/gallery grids use **4- and 5-column** (`gridCols 3/2/4/5`). Mobile (390) collapses to **3→1 column**, h1 downscales **72→44px**, and the 5-link nav drops to 2 (**hamburger likely**).
- **Motion / easing intent:** the house micro-transition is a fast **`0.16s ease-out`** (57 occurrences) — snappy, tool-like responsiveness. Entrances use a **spring** `cubic-bezier(0.34, 1.56, 0.64, 1)` at ~0.35s (gentle overshoot), one dramatic `cubic-bezier(0.8, 0, 0.2, 1)` at 0.4s, and slow **ambient loops** at 0.8s / 2s `ease-in-out`. Durations span 100–350ms for interaction up to 2s for ambient (plus a 60s loop). Full choreography in **Interaction & motion** below.
- **Density:** medium-high but *chunked* — busy, colorful content zones (community grids, primitive collages, interactive demo) are spaced apart by 120px gutters of pure white, so the eye gets rest between spectacles.
- **Hierarchy:** dominant device is **scale** (a ~4× body→display jump in one light weight), reinforced by **position** (oversized quote glyphs anchoring testimonials) and per-testimonial **color coding**.
- **Restraint:** despite a rainbow palette, restraint shows in the *structure* — black/white chrome, near-black CTAs, almost no bold weight, rings instead of shadows, exactly one floating-shadow element. The loudness is contained to content and pre-footer decoration.
- **Components** (from `.craft.states` + frames — note: this profile only captured `focus`/`disabled` state objects, so resting button/card/nav/input specs are **frame-estimated** and flagged):
  - **Button** — primary: near-black fill, white label, ~50px (pill) radius, `0.16s ease-out` hover (frame-estimate); secondary "Contact sales": white fill + `0 0 0 1px inset` black ring. **Focus: 2px solid black outline** (captured, real). Mega-CTA variant: display-scale black pill.
  - **Card** — white or tinted-panel surface, 8–16px radius, hairline/ring rather than shadow; the floating hero demo card is the lone `0 24px 70px rgba(0,0,0,.1)` shadow (frame-estimate from elevation tokens).
  - **Nav** — sticky white top bar, 5 dropdown links (Products / Solutions / Community / Resources / Pricing) + Log in / Contact sales / Get started; collapses to hamburger on mobile (frame + responsive data).
  - **Input** — no form inputs captured in the marketing frames; **flag: empty** (no input-state evidence).
  - **Announcement bar** — persistent bottom-pinned green band, black text, dismiss "×", "Register" pill (captured in every frame).

## Interaction & motion

Figma's motion is **content-forward and ambient**, not heavy scroll-scrubbing: pinned chrome, in-view fades, a continuous scale beat, and a genuinely-interactive cursor demo. Evidence from capture: **18 IntersectionObservers over 208 targets** (threshold 0, rootMargin 150–200px), 13 scroll + **22 mousemove** listeners, **328 rAF** calls per pass, **2 canvas**, 70 draggable nodes, 9 disclosures, 9 tabs, 2 carousels. Only **4 `@keyframes`** (names obfuscated — `animation-6j0toc` etc., so intent is read from frames, not names) but **119 transition rules** — motion is mostly CSS transitions, not keyframe animation. **15 `prefers-reduced-motion` rules — reduced motion is respected.** No GSAP/Lenis/Framer globals (hand-rolled). Stack: IntersectionObserver · CSS transitions · canvas + rAF.

- **In-view fade reveal** — *Trigger:* in-view (IO, 208 targets, threshold 0). *Mechanism:* one class flip on intersect → CSS transitions `opacity` 0→1, first change ~300ms; capture shows **fade only, not rise** (`staggeredEntrance: false`). *Reads as:* sections quietly arriving as you scroll a very long page. *Transfers to:* any tall marketing page that wants calm entrance rhythm. *Safety:* **production-safe** (opacity-only, once, gated). → `scroll-reveal-in-view`.

- **Scroll-scale beat on a repeating element** — *Trigger:* in-view / scroll-progress. *Mechanism:* one component (`div.fig-1anly6q`) cycles through `scale` values **0.8→0.7→0.8→1→0.7** across the capture — a continuous compositor `transform: scale()` tied to scroll position, not a one-shot pop. *Reads as:* media "settling forward" to meet you as it centers. *Transfers to:* feature stills, hero panels, gallery tiles. *Safety:* **production-safe** — but Figma's floor dips to **0.7**, deeper than the corpus-recommended 0.94; keep it subtle in your build to avoid a zoom-bomb. → `scroll-scale` (and the dim variant `card-stack-scale-dim`).

- **Sticky chrome (nav + announcement bar)** — *Trigger:* scroll-progress. *Mechanism:* the header ("Products / Figma Design…") and the Config banner ("Join Config virtually June 24-25…") both `position: fixed/sticky` and persist through the whole scroll (2 pin effects; banner visible in every frame). *Reads as:* navigation and the event CTA are always one click away. *Transfers to:* any long page with a standing promo + nav. *Safety:* **production-safe** (native sticky, no JS); watch that a persistent bottom bar doesn't occlude content on short viewports (it overlaps the footer in s10).

- **Parallax drift on stacked layers** — *Trigger:* scroll-progress / in-view. *Mechanism:* several layers (`div.fig-723z9s`, `ul.fig-1xj69t0`, the demo stack) translate at differing rates (4 transform/parallax effects). *Reads as:* depth and liveliness in the collage zones. *Transfers to:* layered hero / gallery compositions. *Safety:* **production-safe if subtle** — parallax is the corpus's prod-safe→spectacle hinge; cap the offset and gate reduced-motion (Figma does). → `parallax-drift`.

- **Cursor-reveal interactive demo** — *Trigger:* mousemove / drag. *Mechanism:* the hero card literally instructs "Make my cursor reveal an image"; 22 mousemove listeners + 2 canvas + 328 rAF + 70 draggable nodes drive a live multiplayer-cursor canvas where moving the pointer paints/reveals content. *Reads as:* "the product is in your hands right now" — the canvas IS the pitch, made interactive. *Transfers to:* any tool whose core loop is direct manipulation (canvas, map, editor). *Safety:* **spectacle-leaning, budget it** — the most expensive thing on the page (live canvas + rAF + mousemove). Lazy-init in-view, throttle to rAF, pause off-screen, and ship a static fallback under reduced-motion (Figma gates PRM). *No corpus recipe yet* → `patterns_to_build: cursor-reveal-canvas`.

- **Ambient brand loops** — *Trigger:* load (continuous). *Mechanism:* slow `0.8s` / `2s ease-in-out` transitions and the conic-gradient sunbursts give decorative motifs a gentle perpetual shimmer. *Reads as:* a living, creative surface. *Transfers to:* hero ornament, loaders. *Safety:* **production-safe if gated + paused off-screen**; keep loops cheap (transform/opacity) and honor reduced-motion.

## Production-safety note

This is a shipping product site and most techniques are **production-safe**; the watch-items:
- Light **~330 base weight** — **production-safe** at large sizes; **defect risk** for small text — verify it doesn't thin below legibility on low-DPI screens (body holds at 400, which is why it works).
- **~47% of tap targets under 44px** (100 of 215 interactive elements) — a real **a11y defect**: dense nav/footer link lists and small controls. If you transfer the look, enlarge hit areas to 44px on touch.
- **Multi-hue palette** — **production-safe** only because hue never encodes state in the chrome; never let a decorative color become the sole signal for meaning. Keep state on the black/white/slate layer.
- **Scroll-scale to 0.7** — **production-safe but tune up the floor** (~0.94) to avoid motion-sickness / zoom-bomb feel.
- **Cursor-reveal canvas** — **spectacle**; the page's perf budget centerpiece. Gate, throttle, pause, and ship a static fallback (reduced-motion is respected).
- **Persistent bottom announcement bar** — occludes the footer on short viewports (seen in s10); ensure it's dismissible (it is, "×") and doesn't cover primary actions.
- Good marks to keep: **focus-visible 2px black outline**, **img alt ratio 1.0** (every image has alt), **reduced-motion respected**, green promo bar uses **black** (not white) text for contrast.

## Extracted patterns
- **oversized-display-headline** — 56–72px brand-face headline as the hero visual with negative size-scaled tracking; reuse when the typography itself is the credential. (already in corpus)
- **product-ui-on-tinted-panel** — real product screenshots seated on soft tinted (lavender/dark/collage) panels in 2-col feature rows; reuse for feature-section proof. (already in corpus)
- **spotlight-quote-card** — color-anchored testimonial with oversized quote glyph + author face-pill; here re-skinned per logo (cyan/gold). (already in corpus)
- **source-avatar-pill** — author face-pill (avatar + name) under each community-gallery tile; reuse for attributed UGC grids. (already in corpus)
- **tabbed-product-showcase** — segmented pill tab row (Prompt/Design/Draw/Build…) swapping one panel; reuse for multi-mode heroes. (already in corpus)
- **scroll-scale** — continuous compositor scale tied to scroll on a repeating media element (motion); reuse for "settle-forward" feature stills — but raise the floor toward 0.94. (already in corpus)
- *Genuinely-new, not faked into `patterns:`* → **cursor-reveal-canvas** (mousemove/drag canvas that reveals content under the pointer), **primitive-shape-collage** (geometric primitives wearing the product's own selection handles as decoration), **brand-rotating-testimonial** (accent glyph recolors to match the active logo). Recorded in `patterns_to_build:` for later authoring.
