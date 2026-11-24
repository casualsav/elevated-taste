---
slug: radix
url: https://www.radix-ui.com
source: Reference
corpus: production
captured: 2026-06-24
award_type: Reference
score: null
tags: [developer-tool, design-system, component-library, open-source, b2b, light, react]
when_to_use: [docs, product-marketing, landing, hero, feature-section, interactive-showcase, forms, navigation]
directions: [minimalist, soft]
layout: [split-hero]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-low, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [oversized-display-headline, code-block-hero, embedded-product-frame, mono-label-metadata]
tokens_snapshot: ../tokens/radix.json
screenshots: ../screenshots/radix-ui-com/
---

> **What this is.** The marketing/docs home of **Radix UI** — an open-source React component library (Themes + Primitives + Colors + Icons). This entry distills the *site's own* design language (its type/color/layout) plus the **component micro-interactions the library ships** (accordion, dialog, dropdown, toast, progress, skeleton). It is a component-library reference site: the "product" is the UI kit, so the page is itself built from the kit, and that is the honest source of its polish.

## What works (transferable principles)

- **Let the product demo carry the color while the page stays near-monochrome.** The frame is white → near-white surfaces → near-black text (`#1c2024`, Radix gray-12), and *all* chroma is rationed into one cluster: the live component demos on the right (a team table, sign-up form, notification toggles with teal switches, an "Invoice paid" card) sitting on a soft diagonal blue→pink gradient. Because the canvas is desaturated, those colored chips read as *real working UI*, not decoration. Identical move to Attio — starve the marketing palette so the embedded product supplies the saturation. Transfers to any tool whose interface is the pitch.

- **Display type gets aggressive negative tracking; body stays neutral.** The hero "Start building your app now" is ~66px with **-3.3px tracking (-5%)**, and the 78px variant tightens to -3.9px — far past the usual -1 to -2% display token. Meanwhile 16px body sits at a near-zero +0.03px. Default letter-spacing reads loose and amateur at 66px+; tightening hard restores an engineered, "set by a typographer" density. Rule: scale tracking *with* size and don't be timid at display sizes — a -4 to -5% token at 4rem+ is legitimate, but keep small UI text near-normal.

- **Three type families, three jobs — sans for everything, serif and mono as punctuation.** `untitledSans` does UI + display; `adobeTextPro` (serif) appears only as a rare accent; `soehneMono` is reserved for *labels and metadata* — the bracketed eyebrow "Read about Radix Themes 3.0", the "Live examples" rail tag, code. The mono isn't body copy; it's a wayfinding/technical signal. Transfers to any developer tool: pair one workhorse sans with a mono used *only* for labels/code/version strings, so "this is technical" is communicated by typeface role, not by styling everything.

- **Keep the base weight at 400 and create hierarchy with scale, not bolding.** This page is overwhelmingly Regular (758 nodes at 400 vs 37 at 500), with 700 used only for display headings and key emphasis (83 nodes). It never "semi-bolds" its body the way many SaaS sites do. The heading/body separation comes entirely from the two-cluster size ramp (UI 12–24px vs display 35–78px) and color, leaving the long-form docs calm and readable. (Note: this is the deliberate *inverse* of Attio's 500-floor choice — both work; the lever is "pick a floor and hold it," not "always raise it.")

- **Elevation is hairline-first: a 1px inset ring, then a whisper of ambient shadow.** Cards in the demo composition use `inset 0 0 0 1px` rings (often a tinted one — `rgba(0,52,220,0.447)` for the focused blue field, `rgba(210,0,5,0.443)` for an error field) layered with a soft `0 8px 40px rgba(0,0,0,0.05)`. Structure comes from the crisp border; depth is barely-there. This is the classic Radix card recipe and it keeps a dense, multi-card layout from feeling heavy. Transfers to any data-dense surface — border for definition, micro-shadow for lift, never a chunky drop shadow.

- **Inset tinted rings double as state.** Form fields in the demo signal focus/error with the *color of the inset ring* (blue for active, red for invalid) rather than a separate outline or background fill. It's a single-property state change that reads instantly and composes with the hairline elevation. Transfers to any input system: drive focus/validity through one ring token and you get state for free without layout shift. (Pair with a text/icon cue so state isn't hue-only.)

## Design-system read

- **Type:** `untitledSans` (UI + display) + `adobeTextPro` serif (rare accent) + `soehneMono` (labels/code/metadata). Two-cluster scale — UI 12 / 13.3 / 14 / 16 / 20 / 24px and display 35 / 66 / 78px — with the gap as hierarchy. Weights are **400 (base)** and **700 (display/emphasis)**, 500 sparse. Leading: ~1.0 on the largest display (66/60), 1.5 on body (16/24). Tracking scales hard with size: 66px → -3.3px, 78px → -3.9px (≈ -5%), titles ~-0.2px, body ~+0.03px. `tabular-nums` is enabled where numeric tables appear.
- **Color:** Light near-monochrome. `bg #ffffff` → `surface #fcfcfd` → `fg #1c2024` (Radix gray-12, near-black) → `muted rgba(0,7,20,0.624)` → `subtle #60646c`. Borders are translucent alpha hairlines (`rgba(0,8,48,~.12–.27)`) — Radix's alpha-on-white scale, which is why they sit so naturally on any tint. The **action color is blue-violet `#3e63dd`** (the primary "Invite" button; hover `#3358d4`). The rest of the chroma is a *palette set* living inside the demos — teal `#008573` (switch/link), violet `#6550b9`, crimson `#cb1d63`, red `#c40006d3` — not one brand accent but the library's color scales on display. A pastel `linear-gradient(to right top, #3e63dd, #e18bff)` backs the demo composition.
- **Spacing rhythm:** 8px base with a tight low end (the most common gaps are 8 / 12 / 16px; component padding clusters at 6 / 4 / 32px). Card interiors are compact; section rhythm wasn't captured below the fold.
- **Layout system:** centered max-width hero, split into a **left editorial column** (mono eyebrow → oversized headline → muted subhead → code card → "Get started" / "Playground" buttons → "Live examples" rail label) and a **right product-demo collage** (overlapping cards on the gradient). Captured at 1440×900.
- **Components (from `.craft.states`):** **Nav/links** — resting `rgba(0,7,20,0.624)`, hover resolves to full `#1c2024` (recolor) with an underline on text links; **focus** is explicit and varied by element: a 2px `#8da4ef` ring/`box-shadow` on brand + doc links, a border-color shift to `#1c2024` on the Primitives/Icons/Colors nav. **Buttons** — primary is solid `#3e63dd` filled, hover darkens to `#3358d4`; ghost/reset buttons take a faint `rgba(0,0,51,0.06)` wash on hover. **Inputs** — state carried by inset ring color (blue focus / red invalid). **Cards** — hairline inset ring + whisper ambient shadow. `disabled` states were **not present in the capture** (empty array). Focus-visible is implemented site-wide (`focus_visible: true`).
- **Grid / container (from `.craft.grid`):** demo composition reports **3- and 2-column** sub-grids (the card collage), at `vw 1440`. Honesty flag: the capture's `grid_collapse` shows the same `3/2` at both 1440px and 390px — almost certainly a **capture artifact** (the fixed-width demo board didn't reflow in the harness), not a real responsive choice; the H1 *does* downscale 66px → 38.5px on mobile, so the page is responsive even though the demo board sample isn't reliable.
- **Motion / easing intent:** the site's *own* motion is minimal — a sticky nav header and a sticky "Live examples" rail label, plus hover recolors (durations **140 / 180ms**, easing `cubic-bezier(0.45, 0.05, 0.55, 0.95)`, a sinusoidal ease-in-out). The *interesting* motion is what the **component library ships** — accordion height, dialog/dropdown enter-exit, toast, progress, skeleton — detailed below. Reduced motion is **respected** (8 `prefers-reduced-motion` rules).
- **Density:** medium-high in the demo collage (real tables/forms with many rows and toggles), kept legible by the desaturated surround, generous card padding, and `tabular-nums`.
- **Hierarchy:** dominant device is **scale** (the two-cluster gap, exaggerated by the tight display tracking), reinforced by **color** (near-black vs translucent-muted) and by **typeface role** (mono = label/technical).
- **Restraint:** no gradient text, no oversized hero illustration, no heavy drop shadows, no multi-weight body. Color is confined to live UI. The page demonstrates the kit by *being* an instance of it rather than decorating around it.

## Interaction & motion

**Honest framing first.** The 11 captured scroll frames are **byte-identical** — the harness never scrolled — so there is **no observed scroll choreography**, and below-fold layout is unknown. The two `scroll_effects` the profiler reports are both **position pins**: the **sticky nav header** and a **sticky "Live examples" rail label** (`position: fixed/sticky`), *not* scrollytelling. There are **0 entrance reveals, 0 cursor followers, 0 canvas, 0 parallax**. The single IntersectionObserver (11 targets, `rootMargin: 200px`) is a **lazy-mount** boundary, not a reveal animation.

The real motion story is the **component library's micro-interactions**, read straight off 35 `@keyframes` (all enter/exit *pairs*) and 11 disclosure widgets. These are the techniques worth transferring:

- **Disclosure slide (accordion height-tween)** — *Trigger:* open/close (click). *Mechanism:* panel animates its measured height via `--radix-accordion-content-height` between 0 and content height (`primitives-hero-accordion slideDown/slideUp`), the live demo of Radix's accordion; 11 disclosure widgets on the page. *Reads as:* content "makes room for itself" instead of snapping. *Transfers to:* FAQ, nav sub-menus, filter panels. *Safety:* **production-safe** — height is the one non-compositor property here, but it's gated to a click (cold path), not the scroll hot path; reduced-motion collapses it to an instant toggle.

- **Overlay fade + directional slide (dialog / dropdown / popover / toast enter-exit)** — *Trigger:* open/close. *Mechanism:* paired keyframes `rt-fade-in/out` + `rt-slide-from/to-{top,bottom,left,right}` run on data-state mount/unmount, so the overlay slides in from its trigger edge and slides back out on dismiss (not just an appear). *Reads as:* the surface has a spatial origin — it came *from* the button. *Transfers to:* any popover/menu/sheet/toast system. *Safety:* **production-safe** (transform + opacity only, 140–180ms); reduced-motion drops to a plain fade or instant show. → `tabbed-product-showcase` is the nearest reusable swap recipe (use it for the *idea* of an animated state-driven panel; the enter/exit *pairing* is the Radix-specific lesson).

- **Indeterminate progress shimmer** — *Trigger:* load / pending. *Mechanism:* a bar runs `rt-progress-indicator-indeterminate-grow` plus a `…-shine-from-left` sheen sweep while value is unknown (a full family of variants: surface/classic/soft/high-contrast). *Reads as:* "working, duration unknown" without a fake percentage. *Transfers to:* any async action with no measurable progress. *Safety:* **production-safe** (transform sweep); it loops, so pause/stop it under reduced-motion and when off-screen.

- **Skeleton pulse** — *Trigger:* load. *Mechanism:* placeholder blocks breathe via `rt-skeleton-pulse` (opacity loop) until content resolves. *Reads as:* "content is coming," holding layout so nothing shifts on arrival. *Transfers to:* any data-fetch view. *Safety:* **production-safe**; a low-frequency opacity loop, but still gate it under reduced-motion (steady state).

- **Toast scale-in / scale-out** — *Trigger:* event (e.g. copy-to-clipboard). *Mechanism:* `copy-toast scaleIn/scaleOut` pops a confirmation with a small scale+fade and removes it with the inverse. *Reads as:* lightweight, transient acknowledgement. *Transfers to:* copy/save/undo confirmations. *Safety:* **production-safe** (transform/opacity, auto-dismiss); reduced-motion → fade only.

- **Magic-curtain clip reveal (theme switcher)** — *Trigger:* control/in-view. *Mechanism:* `magic-curtain` keyframes (`clip` / `clip-reverse` / `fade` / `scale-in/out`) wipe between theme states behind a `clip-path`/mask so one palette uncovers another. *Reads as:* a polished "swap the whole look" beat for the theming demo. *Transfers to:* before/after, theme/preview toggles, light↔dark demos. *Safety:* **production-safe if budgeted** — `clip-path` animation is cheap on modern engines but heavier than a fade; keep it short and offer a reduced-motion crossfade. (Bespoke to the demo — reuse the *principle*: clip-wipe to reveal a second state.)

Stack (provenance only): hand-rolled **CSS `@keyframes` + IntersectionObserver + Radix Themes primitives** (data-state-driven), no GSAP/Lenis/Framer.

## Production-safety note

This is a shipping open-source reference site; everything here is **production-safe** by design (it *is* the library people ship):

- Near-monochrome canvas + rationed color — **production-safe**, zero cost. Because the only saturated color is the live UI, don't rely on those demo hues to convey meaning in copy; keep labels.
- Blue-violet `#3e63dd` primary action on white — **production-safe**; verify the action is signaled by shape/label too, and check `#3e63dd` text/icon contrast if used at small sizes.
- Alpha hairline borders (`rgba(0,8,48,~.12)`) — **production-safe**; very-low-contrast 1px borders can vanish on poor displays — fine for marketing chrome, verify for a11y-critical dividers.
- Translucent muted text `rgba(0,7,20,0.624)` (≈ #60646c on white) — borderline for small text; keep at body size or darken to hold 4.5:1.
- Inset-ring input states (blue focus / red invalid) — **production-safe** but **don't make state hue-only**: pair the ring with an icon or text so colorblind users aren't excluded.
- Component micro-interactions (accordion/overlay/toast/progress/skeleton) — **production-safe**; all gate under reduced-motion (8 PRM rules) and animate transform/opacity (the one exception, accordion height, is on a click path).

**A11y, honestly (from `.craft.a11y`):**
- ✅ `focus_visible: true` with real focus rings (`#8da4ef` 2px) and reduced-motion respected — both above the corpus norm.
- ⚠️ **77 of 89 interactive elements are flagged small tap targets** — many sub-44px hit areas (dense demo toggles, icon buttons, compact nav). On a touch device this is a real ergonomics defect; enlarge hit areas in production use.
- ⚠️ **`img_alt_ratio` 0.32** — only ~a third of the 19 images carry alt text. Decorative demo art aside, audit and label any informative imagery.

## Extracted patterns

- **oversized-display-headline** — a 4rem+ headline set in a single weight with aggressive negative tracking (-4 to -5% at this size); reuse for hero statements where scale, not weight, is the hierarchy. (Radix pushes the tracking harder than most — see -3.3px at 66px.)
- **code-block-hero** — a syntax-styled code card placed as a primary hero asset for a developer tool ("import and go"); reuse when the install/usage *is* the pitch.
- **embedded-product-frame** — real working UI (tables, forms, toggles, cards) shown as the hero asset on a soft tinted backdrop instead of an abstract illustration; reuse for any product where the interface sells itself.
- **mono-label-metadata** — a monospace typeface reserved strictly for eyebrows, rail labels, version strings, and code (here `soehneMono`: "Read about Radix Themes 3.0", "Live examples"); reuse to signal "technical" by typeface role without styling everything.

> **patterns_to_build (genuinely new here; not faked into `patterns:`):**
> - `overlay-enter-exit-pair` — the data-state-driven *paired* fade+directional-slide for dialogs/dropdowns/popovers/toasts (slide-from-edge in, slide-to-edge out), reduced-motion → fade/instant. The corpus has `tabbed-product-showcase` (a swap) but no canonical enter/exit-pair recipe; Radix is the textbook source.
> - `disclosure-height-tween` — accordion that animates measured content height (`--content-height` var) open/close, gated to click, reduced-motion → instant toggle.
> - `indeterminate-progress-shimmer` — grow + shine-sweep bar for async actions with unknown duration; pause under reduced-motion / off-screen.
> - `inset-ring-input-state` — form-field focus/validity driven by the color of a 1px inset ring (blue focus / red invalid), composing with hairline elevation, no layout shift.
