---
pattern: edge-bleed-portrait-strip
from: aristide
corpus: expressive
safety: production-safe
tags: [portfolio, gallery, showcase, carousel, hero]
---

## What it is

A single horizontal row of tall portrait-format media "slats" (here desaturated B&W project stills), anchored to one side of the viewport and deliberately running *past* the edge so the last items are clipped. The opposite side of the screen is left empty, and the whole strip scrolls/drags horizontally to reveal the rest. On narrow screens the strip recenters and gains a soft left/right **edge mask** (a fade to background) so the clipping reads as intentional rather than broken. Aristide uses it as the entire portfolio: the work is one filmic film-strip floating on near-black, with the brand wordmark and corner metadata around the empty space.

## Why it works

A cut edge implies continuation. By showing only a slice of the set and clipping the rest off-screen, the page communicates "there is more — drag to see it" without a single "scroll" label, arrow, or counter; the truncation itself is the affordance. This is *latent density*: low visual density (a few visible slats, lots of void) but high information density (a full archive lives off-edge), which reads as calm and premium where a fully-contained, centered carousel reads as finished and ordinary. Tall portrait slats also pack more items into a horizontal run than landscape cards and give a cinematic, contact-sheet rhythm. The transferable mechanism — *anchor one hero object to an edge and let it bleed, masking the seam with a fade* — applies to any showcase that wants to imply a larger collection behind a small window. The critical discipline: the off-screen items must stay reachable by native horizontal scroll and keyboard, so the strip is a real scroll container, not a JS-only draggable; the drag-inertia is an *enhancement* layered on top.

## Reference implementation

```html
<style>
  .strip {
    background: var(--color-bg);
    color: var(--color-fg);
    /* push the strip toward one edge; leave the other side empty */
    padding-block: var(--space-9);
    display: flex;
    justify-content: flex-end;          /* anchor right; the void sits left */
  }

  /* the real, natively-scrollable, focusable track */
  .strip__track {
    display: flex;
    gap: var(--space-2);
    inline-size: 70%;                   /* occupies a slice; remainder is void */
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x proximity;
    /* soft fade at the leading/trailing edge so the clip reads as designed */
    -webkit-mask-image: linear-gradient(to right,
      transparent 0, #000 var(--space-7),
      #000 calc(100% - var(--space-7)), transparent 100%);
            mask-image: linear-gradient(to right,
      transparent 0, #000 var(--space-7),
      #000 calc(100% - var(--space-7)), transparent 100%);
  }
  /* hide the native scrollbar; keyboard + wheel still work */
  .strip__track { scrollbar-width: none; }
  .strip__track::-webkit-scrollbar { display: none; }

  .strip__item {
    flex: 0 0 auto;
    inline-size: var(--container-content);  /* swap for a narrower slat width token */
    max-inline-size: 22vw;                  /* tall, narrow portrait slat */
    aspect-ratio: 3 / 5;
    scroll-snap-align: center;
    overflow: clip;
  }
  .strip__item img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    filter: grayscale(1);               /* desaturated stills; remove for color work */
    transition: filter var(--duration-slow) var(--ease-standard),
                transform var(--duration-slow) var(--ease-standard);
  }
  .strip__item:hover img,
  .strip__item:focus-visible img {
    filter: grayscale(0);               /* reveal color on intent */
    transform: scale(1.03);
  }
  .strip__item a:focus-visible {
    outline: 2px solid var(--color-focus, var(--color-fg));
    outline-offset: var(--space-1);
  }

  /* narrow screens: recenter the slice, keep the masked edges */
  @media (max-width: 48rem) {
    .strip { justify-content: center; }
    .strip__track { inline-size: 100%; }
    .strip__item { max-inline-size: 40vw; }
  }

  /* the page must read fine without drag-inertia / hover-reveal */
  @media (prefers-reduced-motion: reduce) {
    .strip__item img { transition: none; }
    .strip__item:hover img, .strip__item:focus-visible img { transform: none; }
  }
</style>

<section class="strip" aria-label="Selected work">
  <ul class="strip__track" tabindex="0">
    <li class="strip__item">
      <a href="/work/portrait-01"><img src="/work/01.jpg" alt="Moving Portraits — interaction study" loading="lazy"></a>
    </li>
    <li class="strip__item">
      <a href="/work/portrait-02"><img src="/work/02.jpg" alt="Issey Miyake SS25 — site" loading="lazy"></a>
    </li>
    <li class="strip__item">
      <a href="/work/portrait-03"><img src="/work/03.jpg" alt="Studies in Motion — reel" loading="lazy"></a>
    </li>
    <!-- …more slats continue off the edge; the masked seam signals "drag for more" -->
  </ul>
</section>

<!--
  ENHANCEMENT (optional, spectacle-only): JS may add pointer-drag + inertia
  and WebGL hover reveals on top of this track. It must only augment the
  native scroll above — never replace it — and must no-op under
  prefers-reduced-motion. The slat width should come from a token
  (e.g. --container-content) rather than the 22vw/40vw fallbacks shown.
-->
```

> Token note: the slat width here borrows `--container-content` as a stand-in; a project should define a dedicated slat-width token rather than rely on the `vw` fallbacks, which exist only to keep the demo self-contained.
