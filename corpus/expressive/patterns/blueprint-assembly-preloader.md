---
pattern: blueprint-assembly-preloader
from: igloo
corpus: expressive
safety: spectacle-only
trigger: load
tags: [hero, preloader, loading, reveal, svg, motion]
---

## What it is

Instead of fading a finished image in (or spinning a ring while it downloads), the subject **draws itself as an annotated wireframe first**, then resolves into the finished render. Three ramps run in sequence, never concurrently: **lines draw on** (a schematic, with small numeric part labels), **material resolves** (the wireframe cross-fades under a real image/canvas), **camera settles** (a slow scale/translate that lands on the resting framing). The wireframe doesn't disappear at the end — it survives at ~6–8% opacity as a permanent residue, which is what keeps the result reading as *an engineered artifact* rather than a stock photo.

The reduction below is plain SVG + CSS. The original drives it through a WebGL loop, but nothing about the *choreography* requires that: `stroke-dashoffset` on a path is the DOM's native "draw this line" primitive, and it composites cheaply.

## Why it works

A preloader is dead time you have already spent. The only question is whether the user spends it watching a spinner (which communicates *nothing* and makes the wait feel like a fault) or watching the subject arrive (which makes the same wait feel like an *introduction*). Assembly beats fade because a fade has no internal structure — you can't tell 40% from 60% of a fade, but you can absolutely tell that the roof isn't on yet. That legibility is the whole trick: **sequence the ramps so each one is separately readable**, and the wait acquires narrative shape.

The two failure modes are (1) making it long — this is an *overture*, so 1.5–2.5s total, and it must never gate a user who arrives at a warm cache; and (2) treating it as decoration you can leave ungated. The finished image must be real, present DOM from the first byte: reduced motion, a failed script, or a crawler all get the resting state immediately, with no wireframe and no wait. Pairs with `clear-color-canvas-shell` (what sits underneath) and is the load-time sibling of `circle-wipe-hero-reveal` (a scroll-time hand-off).

## Reference implementation

```html
<!-- The finished subject is REAL DOM, present from the first byte. The wireframe is decoration. -->
<figure class="subject">
  <img class="subject__render" src="/igloo.avif" alt="An ice dome on an arctic ridge" />

  <svg class="subject__blueprint" viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <g class="blueprint__lines" stroke="currentColor" stroke-width="0.4" vector-effect="non-scaling-stroke">
      <ellipse cx="50" cy="62" rx="30" ry="10" pathLength="1" />
      <path d="M20 62a30 30 0 0 1 60 0"                        pathLength="1" />
      <path d="M50 32v30M20 62h60M30 42q20 8 40 0"             pathLength="1" />
    </g>
    <text class="blueprint__note" x="82" y="46">08</text>
    <text class="blueprint__note" x="14" y="72">23</text>
  </svg>
</figure>

<style>
  .subject {
    position: relative; margin: 0; isolation: isolate;
    background: var(--color-stage-clear, #a0a5b1);   /* == the render's own ground tone: no flash */
    color: var(--color-ice-rim, #ffffff);            /* the wireframe inherits this via currentColor */
    overflow-x: clip;   /* the 1.04 scale the camera settles FROM is meant to spill, not scroll */
  }
  .subject__render,
  .subject__blueprint { display: block; width: 100%; height: auto; }
  .subject__blueprint { position: absolute; inset: 0; z-index: 1; pointer-events: none; }

  .blueprint__note {
    font-family: var(--font-mono); font-size: 3px;
    letter-spacing: var(--tracking-wide); fill: currentColor;
  }

  /* Resting state (also the reduced-motion state, and the no-JS/no-support state): the render is
     simply there, and the blueprint is the faint residue it will settle to anyway. */
  .subject__render    { opacity: 1; }
  .blueprint__lines,
  .blueprint__note    { opacity: 0.07; }

  @media (prefers-reduced-motion: no-preference) {
    /* Ramp 1 — lines draw on. `pathLength="1"` normalises every path so one dash rule fits all. */
    .blueprint__lines path,
    .blueprint__lines ellipse {
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: bp-draw var(--duration-draw, 900ms) var(--ease-entrance) forwards;
    }
    .blueprint__lines ellipse            { animation-delay: 0ms; }
    .blueprint__lines path:nth-of-type(1){ animation-delay: 180ms; }
    .blueprint__lines path:nth-of-type(2){ animation-delay: 360ms; }

    /* Ramp 2 — the schematic hands off to the material, and decays to residue rather than to zero. */
    .blueprint__lines,
    .blueprint__note { opacity: 1; animation: bp-residue var(--duration-settle, 800ms) var(--ease-standard) var(--delay-handoff, 1000ms) forwards; }
    .blueprint__note { opacity: 0; animation-name: bp-annotate; }

    /* Ramp 3 — material resolves + the camera settles. Compositor-only: opacity + transform. */
    .subject__render {
      opacity: 0; transform: scale(1.04);
      animation: bp-resolve var(--duration-resolve, 1200ms) var(--ease-standard) var(--delay-handoff, 1000ms) forwards;
    }
  }

  @keyframes bp-draw     { to { stroke-dashoffset: 0; } }
  @keyframes bp-annotate { 0% { opacity: 0; } 40% { opacity: 1; } 100% { opacity: 0.07; } }
  @keyframes bp-residue  { to { opacity: 0.07; } }
  @keyframes bp-resolve  { to { opacity: 1; transform: none; } }
</style>
```

Notes: total budget ≈ 2.2s — past ~2.5s the overture becomes a toll. `pathLength="1"` is what lets one `stroke-dasharray` rule cover paths of wildly different lengths; without it you must measure each path in JS. The three `--duration-*` / `--delay-handoff` values carry inline fallbacks because the house scale tops out at `var(--duration-slow)` (320ms), which is a UI transition, not an overture. If the subject is a `<canvas>` rather than an `<img>`, swap the `<img>` for the canvas and start the ramp on your renderer's "first frame ready" signal instead of on load — and **still** ship a `<noscript>` poster, because the blueprint alone communicates nothing.
