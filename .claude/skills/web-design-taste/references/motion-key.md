# Motion & interaction key

The **menu you pick keywords from** to specify a build: *"I want `sticky-pin` + `parallax-drift` + `fade-reveal`, production/calm"* or *"`scroll-scrub` + `cursor-follow` + `clip-reveal`, expressive."* Each entry: what it is · how common in the corpus · safety · where the recipe lives.

Distilled from **50 exemplars** captured with the motion + craft pipeline. Regenerate after any new capture: `node tooling/motion-digest.mjs`. Frequency = how often it appears across the corpus → **★★★ very common / well-trodden**, **☆ rare / spectacle**. Triggers observed: `scroll-progress` 336× · `in-view` 313×.

---

## House motion params — the tuned defaults (use these, not guesses)

- **Durations:** micro **100–200ms** (hover/state) · reveal **300–500ms** · long **600–800ms** · count-up **~1000ms**. Most common: `300 / 200 / 150ms`.
- **Easings (real curves, ranked by corpus use):**
  - `cubic-bezier(0.2, 0, 0, 1)` — **house standard** (Attio/Linear), decisive ease-out
  - `cubic-bezier(0, 0, 0, 1)` — **entrance**
  - `cubic-bezier(0.16, 1, 0.3, 1)` — **expressive ease-out** (Warp), long soft settle
  - `cubic-bezier(0.4, 0, 0.2, 1)` — Material standard
  - `cubic-bezier(0.25, 0.46, 0.45, 0.94)` / `(0.215, 0.61, 0.355, 1)` — easeOutQuad / Cubic
  - `cubic-bezier(0.34, 1.56, 0.64, 1)` — spring / gentle overshoot (playful entrances, badges, toggles)
  - Avoid bare `ease` / `ease-in-out` / `linear` for anything non-trivial.
- **In-view trigger:** IntersectionObserver threshold **`0`** (fire on first pixel) is most common; `0.1–0.25` for "mostly visible"; `rootMargin: 0px 0px -10%` to wait until comfortably in view. Scrubbed effects use a dense threshold array `[0,0.01,…,1]`.
- **Stagger:** **~60–90ms** per item.
- **Reduced motion:** only **44%** of the corpus gates it — **we always do.** Ship the resting state in the DOM.

---

## Scroll-driven  *(trigger: scroll-progress | in-view)*

| keyword | what it is | freq | safety | recipe |
|---|---|---|---|---|
| `sticky-pin` | element pins while content scrolls past it (scrollytelling) | ★★★ 196 | production-safe | `sticky-pin-scrollytelling` |
| `parallax-drift` | layers translate at different rates with scroll | ★★★ 150 | prod-safe (subtle) → spectacle (heavy) | `parallax-drift` |
| `fade-reveal` | in-view fade + rise, fires once | ★★ 90 | production-safe | `scroll-reveal-in-view` |
| `scroll-rotate` | element rotates as a function of scroll progress | ★★ 67 | prod-safe (cap the angle) | `scroll-progress-rotate` |
| `scroll-scale` | element scales / zooms with scroll | ★★ 49 | prod-safe (subtle) | `scroll-scale` |
| `scroll-color-shift` | text / bg recolors on enter or progress | ★★ 52 | production-safe | `scroll-linked-recolor` |
| `scroll-background-shift` | section background swaps / reveals with scroll | ★ 36 | production-safe | — |
| `scroll-scrub` | animation timeline scrubbed by scroll — incl. a video exported to an image sequence drawn frame-by-frame on a `<canvas>` (Apple product-page lineage) | ☆ | spectacle (perf) | `canvas-frame-scrub-cinema` *(ingested)* |
| `scroll-scrim-interlude` | full-screen dark scrim fades up over a scroll window so centered counting stats read over a moving canvas, then fades out | ingest | spectacle | `scroll-bound-dark-interlude` *(ingested)* |
| `scroll-filter` | blur / brightness shifts with scroll | ☆ 9 | spectacle | — |

*All scroll-driven recipes above now exist as pattern files in `corpus/production/patterns/`.*

## Entrance / load
| keyword | what it is | freq | safety | recipe |
|---|---|---|---|---|
| `entrance-stagger` | grouped elements rise/fade in sequence on load | 25 sites | production-safe | `scroll-reveal-in-view` (group) |
| `clip-reveal` | text/lines mask up from a clipped box | house | production-safe | `clip-reveal` |
| `count-up` | numbers animate 0→value when in view | house | production-safe | `count-up-stat` |

## Hover & cursor
| keyword | what it is | freq | safety | recipe |
|---|---|---|---|---|
| `hover-recolor` / `hover-lift` | bg / color / border / transform shift on hover (bg+color+opacity dominate) | 32 sites | production-safe | — |
| `magnetic` | button eases toward the cursor | house | prod-safe (fine-pointer only) | `magnetic-cta` |
| `cursor-follow` | custom element trails the pointer | 7 sites | spectacle | — |

## Click / drag / tap
| keyword | what it is | freq | safety | recipe |
|---|---|---|---|---|
| `carousel` / `drag-slider` | swipe / drag through items | 6 / 11 sites | production-safe | — (Swiper seen) |
| `disclosure` | accordion / expand-collapse | 24 sites | production-safe | — |
| `tabs` | tabbed product showcase | 6 sites | production-safe | `tabbed-product-showcase` |

## Continuous / ambient
| keyword | what it is | freq | safety | recipe |
|---|---|---|---|---|
| `marquee` | infinite horizontal ticker, pauses on hover/focus | 13 sites | production-safe | `announcement-ticker-marquee` |
| `pulse` / `gradient-spin` | looping glow/spin for a "live" feel | demo | prod-safe (gated) | demo |
| `canvas-loop` | WebGL / canvas rAF scene (umbrella — pick a specific one below) | canvas 25, video 19 | spectacle (perf budget) | → **3D / WebGL / perspective** ↓ |

## 3D / WebGL / perspective  *(trigger: load | scroll-progress | pointer)*

The depth layer — pick one of these for a 3D object, canvas scene, or perspective transform. **All spectacle-only** except the inset *frame*. Non-negotiable rules for every one: keep real text **outside** the canvas, **lazy-mount** the scene, and ship a **static poster** + `prefers-reduced-motion` + no-WebGL fallback. Default to the `expressive` corpus; the one production precedent is Resend's gated `pointer-reactive-3d`. Cross-check the production-safety ledger in `corpus/expressive/principles.md` §6 before shipping.

| keyword | what it is | freq | safety | recipe |
|---|---|---|---|---|
| `webgl-stage` | ambient WebGL/canvas hero — idle-tumbling primitive, shader field, "live" 3D stage (incl. `point-cloud` case media) | ★ 4 | spectacle — but the *frame* is prod-safe; lazy-mount + poster the contents | `inset-canvas-stage` · `rim-lit-void-stage` |
| `webgl-thumbnail` | draggable / auto-rotating 3D object (sphere or cube) as hero/thumbnail; "spinning 3D logo / floating blob" | ★ 3 | spectacle | `webgl-thumbnail-sphere` |
| `webgl-corner-object` | brand object `position:fixed`, bleeding off a viewport edge, doubling as the nav anchor | ☆ 1 | spectacle | `fixed-corner-webgl-sphere` *(to build)* |
| `pointer-reactive-3d` | 3D object / canvas field that deforms or parallaxes toward the cursor | ☆ 1 | spectacle (Resend ships a gated **production** version) | — |
| `perspective-ticker` | text crawl on a 3D-perspective curve (`rotateX` + `translateZ`) | ☆ | spectacle-only — illegible by design; ship a flat `aria-hidden` ornament + a readable copy | `perspective-curved-ticker` |
| `perspective-carousel` | draggable cards / tabs fanned on a 3D-perspective arc | ☆ 1 | spectacle | `perspective-folder-tab-carousel` *(to build)* |
| `particle-field` | ASCII / dot particle ring or ambient field, rAF-driven | ☆ 2 | spectacle | `ascii-particle-ring` |
| `pinned-webgl-stage` | a WebGL scene pinned + scroll-scrubbed through a sequence (heaviest) | ☆ 1 | spectacle (perf budget) | compose `sticky-pin` + `scroll-scrub` + `webgl-stage` |

*Provenance:* `webgl-stage` basement / lusion / phantom / aristide · `webgl-thumbnail` cubiflow / corentinbernadou · `webgl-corner-object` hellomonday · `pointer-reactive-3d` resend (prod) · `perspective-*` corentinbernadou / doronsupply · `particle-field` adoratorio / tikhon · `pinned-webgl-stage` dogstudio.

## Page transitions
| keyword | what it is | freq | safety | recipe |
|---|---|---|---|---|
| `reveal-panel` | a panel scrolls up to uncover a pinned page behind it | house | production-safe | `scroll-reveal-panel` |
| `circle-wipe` | a clip-path circle/iris expands on scroll to hand a standalone hero off to the canvas beneath | ingest | spectacle (CSS scroll-timeline; gate) | `circle-wipe-hero-reveal` *(ingested)* |

---

## Stacks seen *(provenance, not prescription)*
GSAP / ScrollTrigger / TweenMax · Framer · Locomotive (`data-scroll`) · Webflow IX2 · Three.js · Swiper. **Most production sites hand-roll with IntersectionObserver + CSS** — prefer that; reach for a library only for `scroll-scrub` / `canvas-loop`.

## Design-layer keys *(beyond motion)*
- **Type:** `two-tone-headline` · `serif-display` · `mono-metadata` · `fluid-type` (clamp; 22% of corpus) · `tracking-tight-display` (bigger = tighter; e.g. 64px → −1.28px) · stylistic sets `ss01`/`ss03`, `tabular-nums`.
- **Color / theme:** `rationed-accent` · `near-black-action` · `soft-tag-tints` · `dark-mode` (**60%** support it) · `off-black-off-white`.
- **Elevation:** `hairline-over-shadow` · `whisper-shadow` · `same-color-glow`.
- **Layout / responsive:** `nav-collapse-hamburger` (**52%**) · `column-collapse` · `mobile-type-downscale` (e.g. h1 64→40px).
- **A11y / quality:** `focus-visible-ring` (**70%**) · `reduced-motion-gated` (only 44% — we always do) · `tap-target-44` · `alt-text`.

---

*Safety legend:* **production-safe** = cheap, accessible, ship anywhere · **spectacle** = high-impact but watch perf / motion-sickness / reduced-motion; default to the `expressive` corpus. Every motion technique must ship a `prefers-reduced-motion` fallback and a resting state.
