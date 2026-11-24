---
slug: urbit
url: https://urbit.org
source: manual-pick
corpus: expressive
captured: 2026-06-30
award_type: Manual (techno-feudal genre)
score: null
tags: [techno-feudal, neo-feudal, identity-system, developer-platform, dithered, retro-digital, monospace, editorial, paper, monochrome, developer-tool]
when_to_use: [brand-experience, landing, hero, navigation, docs, feature-section]
directions: [expressive, editorial, brutalist]
layout: [editorial-columns]
a11y: [reduced-motion-ignored, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [sticky-scrollspy-rail, notched-frame-nav]
tokens_snapshot: ../tokens/urbit.json
screenshots: ../screenshots/urbit/
---

## What works (transferable principles)

- **Run three type voices, each assigned to exactly one job — the hierarchy is which *family* speaks, not which size or weight.** A high-contrast didone serif (raw alias `Awesome Serif`) carries every display moment (the 96px italic hero, every section title); a humanist sans (`Skyling`) carries all body and UI copy; a monospace (`Space Mono`) carries every eyebrow, micro-label, nav link, and button. The reader learns the grammar in one screen — *mono = label/system, serif = subject, sans = explanation* — so a new section needs no styling decisions, just the right voice. Mechanism: register-by-family is a stronger, more memorable ordering device than the usual size/weight ramp, and it lets a calm single-weight page still feel richly structured. Transfers to any content-dense site (docs, editorial, developer platforms) that wants identity without shouting.

- **Use an italic serif for the hero to make a sentence feel *spoken*, not stamped.** "*A computer you can trust to be yours, forever.*" is set in a slanted, high-contrast serif rather than the default heavy upright sans — the slope reads as voice/manifesto, the thin-thick stroke reads as authored. Mechanism: italic + high stroke-contrast borrows book/editorial register, which signals conviction where a fat grotesque would signal a product launch. Transfers to brand/manifesto heroes that want to feel like a held belief rather than a tagline; pair it (as here) with mono utility chrome so the romance has a foil.

- **Pick a single muddy *olive* as the only color and let monochrome ink do the rest.** The entire palette is paper-white ground, `#3f3f3f` ink, `#b2b2b2` for dimmed/inactive, and one desaturated olive `#5e604c` reserved for buttons, the wordmark sigil, and the *active* scrollspy item. Because olive is nearly a neutral itself, it never reads as "brand blue" decoration — it reads as a considered, almost institutional choice, and spending it *only* on state (active/affordance) makes color itself a meaning. Mechanism: a near-neutral accent + strict role-gating turns the one hue into a wayfinding signal instead of paint. Transfers to any system that wants restraint with a fingerprint — choose an off-axis muted hue and spend it only where the user must look.

- **Make 1-bit dithered/stippled illustration the brand texture instead of photography or flat vector.** Every section is anchored by a large monochrome stippled isometric scene (a city, a circuit-board "planet", a factory) rendered as halftone engraving. The dithered grain evokes early-computing, woodcut, and samizdat print all at once — exactly the "leave the internet behind / computer that lasts forever" thesis — at near-zero palette cost (it's all one ink). Mechanism: a consistent rendering *technique* (not a color or a logo) can carry an entire identity, and a low-bit medium signals craft + ideology more than a glossy render. Transfers to any brand wanting a strong, cheap, ownable visual language — commit to one rendering treatment and apply it to every image.

- **Pin a grouped index rail and let the active item recolor as you read.** Desktop puts the section list ("Self-Hosting → Command Line / Native Planet / Cloud Server …") in a sticky left aside; the item for the section in view shifts from muted grey to ink/olive while the others stay dim. The reader always knows where they are in a long single-column page without a progress bar or breadcrumb. Mechanism: scrollspy-by-color on a pinned index = persistent orientation that costs one IntersectionObserver and a CSS color transition. Transfers to docs, long-form landing, and any multi-section page (see `sticky-scrollspy-rail`).

- **Frame the whole page like a device bezel, with the nav bars built into the frame edge.** Pinned floating bars sit at top and bottom; their ends curve *into* a rounded inset border that wraps the content, with inverse "notch" corners where bar meets frame — so the chrome reads as the rim of an instrument you're looking *into*, not a header stuck on top. Mechanism: tying nav to a continuous rounded frame (rather than a flat band) makes the surface feel like an object/OS, reinforcing a "personal computer" thesis. Transfers to product/OS brands and dashboards wanting a contained, hardware-like shell (see `notched-frame-nav`).

## Design-system read
- **Type:** Three families, three fixed roles. **Display** = a high-contrast didone serif (`Awesome Serif`), used **italic** for the 96px hero and upright for section titles. **Body/UI** = humanist sans (`Skyling`) at a generous **20px** body (the dominant size, 701 hits), 18px secondary. **Labels** = `Space Mono` for eyebrows, nav, buttons, micro-meta (12–14px, ~+1px tracking on the smallest). Scale spans ~12 → 96px (an **~8× display jump**); hierarchy comes from **family + scale**, not weight — the page is almost entirely **400**, with 600 used sparingly. Leading: hero is set solid (96/96 = 1.0), body relaxes to ~1.2–1.4 (20/24, 20/28). Tracking is near-zero on text, slightly positive on mono caps.
- **Color:** Monochrome ink on paper + one olive. `bg` paper white `#ffffff` (with a faint `#ededed` surface tint and a green-tinted dithered texture wash behind the hero); `fg` `#3f3f3f`; `muted` `#b2b2b2` (inactive index items, captions) with `#878787`/`#797979` as secondary greys; `accent` olive `#5e604c` reserved for buttons, sigil, and active state. Borders are a single hairline `#e5e7eb`. No gradients of consequence beyond an image fade mask; **no shadows**.
- **Spacing rhythm:** 8px base (8/16/32 dominate gaps; 4/12 fill in). Bimodal: tight inside label/button groups (4–8px), generous air between sections. Buttons sit on ~8px block / 12–16px inline padding.
- **Layout system:** A narrow **content column (~700–864px max)** on the right paired with a **sticky index rail** on the left (desktop); flex groupings of 2/3/4/6. Sections alternate illustration ↔ text. Mobile (390px) collapses to a single stacked column, rail dissolves into inline section headers, nav becomes a hamburger (3 desktop links → hamburger). Two breakpoints of consequence.
- **Motion / easing intent:** Quiet and utilitarian. Authored transitions are **150ms** (the workhorse, 209 hits) and **300ms** on `cubic-bezier(0.4,0,0.2,1)` (Material standard easing), plus a couple of 500ms `ease-in-out`. Only **2 `@keyframes`** exist (`pulse`, `fadeIn`). Motion communicates *orientation and reveal*, never spectacle — the page is largely static scaffolding animated by scroll position. Full breakdown in **Interaction & motion**.
- **Density:** Medium-high text density (20px body, long paragraphs, 44 disclosures) kept legible by the narrow column, the index rail offloading navigation, and big illustration breathers between sections.
- **Hierarchy:** Dominant device is **type family** (mono/serif/sans = label/subject/body), reinforced by **scale** and by **color-as-state** (olive/ink = active, grey = inactive).
- **Restraint:** No shadows, no second hue, no photography, no gradient-heavy hero, no oversized-feature-card template. Color is rationed to state; everything decorative is the one-ink dither.

## Interaction & motion
The capture is unambiguous that this is a **scroll-orientation page, not a spectacle page**: **1 IntersectionObserver with 98 targets** (rootMargin `200px`), **4 pin effects**, **1 fade-in**, a cluster of text **color-shifts**, only **2 `@keyframes` (`pulse`, `fadeIn`)**, and **0 hover effects / 0 cursor followers / 0 canvas / 0 carousels** in CSS. The 399 rAF calls + 20 scroll + 8 mousemove listeners back smooth-scroll and the scrollspy tracking, not GL. Reading the frames top→bottom (s02 active = *Command Line*, s05 active = *Cloud Server*) confirms the rail's active item advances with the content. Several logged color-shifts are `178→178` representation noise and are dropped; the real signal is the two `178→(94,96,76)` shifts (*Go Deeper*, *Running your Urbit*) plus the visible grey→ink advance in the frames. **`prefers-reduced-motion` is NOT respected** (`prmRules:0`, `reduced_motion:false`) — the one liability, though every effect here degrades gracefully to its end state.

- **Sticky scrollspy with active color-shift** — *Trigger:* in-view / scroll-progress (1 IO, 98 targets, rootMargin 200px). *Mechanism:* each section reports intersection; the matching index item in the pinned left rail transitions `color` from muted `#b2b2b2` → ink/olive `#5e604c` (the captured `178→(94,96,76)` shifts) while the others dim, so the rail mirrors reading position. *Reads as:* "you are here" — calm persistent orientation. *Transfers to:* docs, long landing pages, any multi-section read. *Safety:* **production-safe** (native sticky + one IO + CSS color transition; only animates `color`). See `sticky-scrollspy-rail`.
- **In-view fade-in reveal of the rail** — *Trigger:* in-view (the `aside "Get Started with Urbit…"` opacity `0→1`; the lone `fadeIn` keyframe). *Mechanism:* IntersectionObserver gates an opacity transition on the index aside as it enters. *Reads as:* the navigation "arrives" with its section. *Transfers to:* any deferred-content reveal. *Safety:* **production-safe** (opacity only) — but **must add a reduced-motion fallback** that jumps to opacity 1, since none ships today.
- **Pinned floating nav frame (top + bottom)** — *Trigger:* scroll-progress (3 of the 4 pins: top utility bar, top primary nav, bottom wordmark/footer bar all `position:fixed`). *Mechanism:* the chrome bars stay fixed at the viewport edges, framing the scrolling content like a device bezel (no per-frame JS — native fixed). *Reads as:* a contained OS/instrument surface. *Transfers to:* product/OS brands, dashboards. *Safety:* **production-safe**; on short mobile viewports two fixed bars eat vertical space — collapse one. See `notched-frame-nav`.
- **Read-more disclosure** — *Trigger:* click/tap (44 disclosure elements). *Mechanism:* each section truncates body copy with an expandable "Read more"; native disclosure, no animation cost. *Reads as:* progressive disclosure keeping the column scannable. *Transfers to:* any dense content page. *Safety:* **production-safe** (prefer native `<details>` or an `aria-expanded` toggle).

## Components
From `.craft.states` (`focus:[]`, `disabled:[]` — interaction states largely not captured; `focus_visible:true` overall):
- **Button:** two registers — a **filled olive** primary ("Get an Urbit ID", "Get started", "Start the CLI") with mono label and ~6px radius, and an **outline/ghost** secondary ("Docs", "Buy urbit hardware", "Read the docs"). Both small, low-radius, monospace-labelled. No captured hover delta (CSS `hoverEffects:0`) — likely a 150ms color/border transition.
- **Card:** none in the classic sense — sections are illustration + heading + body blocks separated by hairline rules, not bordered cards.
- **Nav:** floating fixed bars; **3 visible desktop links** + a "Get Urbit" CTA pill + search; **hamburger at mobile** (`likely_hamburger:true`, 0 inline mobile links). Footer is a mono link row (Docs · Bridge · Network Explorer · Technical Journal · Whitepaper) + email-capture input + social glyphs.
- **Input:** an email-capture field ("Get email updates") with mono placeholder; states not captured.

## Grid / container
`layout.gridCols` and `.craft.grid.columns` are **empty** — no fixed CSS grid; the layout is a **two-zone flex split** (sticky index rail + narrow content column) using flex groupings of `[2,3,4,6]`, gaps `[8,16,32]`, and **container max-widths `700 / 832 / 864px`**. Content stays in the ~700–864px column; illustrations bleed wider. Mobile (390px) stacks to one column and folds the rail into inline section headers. Hero h1 is `96px` desktop → `52.5px` mobile (responsive, not fluid-clamped — `fluid_type:false`); body stays 20px at both widths.

## Production-safety note
- **Three-voice type system (mono/serif/sans by role)** — **production-safe**. Cost: three families = webfont weight; subset aggressively and define explicit fallbacks per role so layout doesn't shift across the mono/serif/sans swap.
- **Italic high-contrast serif hero at 96px** — **production-safe** with a responsive `clamp()` (the capture already steps to 52.5px on mobile); keep the thin hairlines of a didone from disappearing at small sizes — don't scale it below ~32px.
- **Olive-as-only-accent, rationed to state** — **production-safe** and recommended; verify olive `#5e604c` on white clears WCAG AA for any *text* use (it's borderline for small text — measure), and don't let "active = olive" be the *only* differentiator (pair with weight/underline for color-blind users).
- **1-bit dithered illustration** — **production-safe** as a style; ship as optimized raster/SVG with real `alt` describing the subject (not "dithered drawing"); `img_alt_ratio:1` here is the bar to keep. Watch file size on full-bleed halftones.
- **Sticky scrollspy + in-view fade** — **production-safe** (one IO, CSS color/opacity). **Defect to fix:** add `@media (prefers-reduced-motion: reduce)` to disable the fade / jump to end state — not respected today (`reduced_motion:false`).
- **Dual fixed nav bars** — **production-safe** on desktop; on small/short viewports two fixed bars steal scroll height — collapse the footer bar to non-fixed on mobile.
- **A11y, measured:** `focus_visible:true` and `img_alt_ratio:1` are good. Risks: **reduced motion not respected** (headline fix), **66 small tap targets** of 291 interactive (the mono micro-links and footer glyphs need ≥44px touch areas), and the borderline contrast of muted greys (`#b2b2b2`) and olive small text — verify before reuse.

## Extracted patterns
- **sticky-scrollspy-rail** — a pinned, grouped index rail whose active item recolors (muted → ink/accent) as its section scrolls into view, driven by one IntersectionObserver; reuse for docs/long landing pages that need persistent orientation (production-safe, in-view).
- **notched-frame-nav** — pinned floating nav bars whose ends merge into a rounded inset page border with inverse-notch corners, framing content like a device bezel; reuse for product/OS brands and dashboards wanting a contained, instrument-like shell (production-safe, static chrome).
