---
pattern: rim-lit-void-stage
from: northkingdom
corpus: expressive
safety: production-safe
tags: [hero, hero-spectacle, brand-experience, dark, 3d]
---

## What it is
A near-empty hero where the entire viewport is a **near-black void** and the only "design" is a single focal object lit by a **colored radial/conic glow blooming from behind it**. On North Kingdom the ground is a warm indigo-black (`#050311`); a steel-blue light blooms from behind a 3D-rendered shield (center samples to `~#0f1d2f` while the corners stay flat black), and that object doubles as the play gate for the showreel. There is no scene, no texture, no second surface — one object, one light, one void. The lighting is rendered into the *background* (a gradient), not declared as a panel or fill, so the page reads as a lit room rather than a card on a page.

## Why it works
It buys a premium dark hero with almost no material. By **rationing all chroma to a single ambient glow**, the palette stays monochrome (white on black) yet the frame feels rich and dimensional — the eye reads the bloom as depth/atmosphere, so a literally empty page feels like a built environment. Concentrating the light *behind one element* makes that element unmistakably the subject (figure/ground does the hierarchy; nothing competes), which is exactly the setup a showreel/product/3D hero wants. It's also the **safe shape of spectacle**: the lighting is pure CSS, so it costs nothing and renders for everyone, and any heavy media (WebGL/video) can be layered on top as a static poster + explicit play affordance and lazy-mounted on interaction — strip the spectacle and a complete, legible page remains. Transferable rule: for a dramatic dark hero, don't build a scene — put one object in a void and spend the budget on lighting it; keep the light in the background layer so it never becomes a box.

## Reference implementation
```html
<!-- framework-neutral; var(--token) names from /tokens, no magic numbers.
     --color-bg is the void; --color-glow is the single ambient accent (a dark tint, not a UI fill). -->
<style>
  .rls {
    position: relative;
    min-height: 100svh;
    display: grid;
    place-items: center;
    background: var(--color-bg);
    color: var(--color-fg);
    isolation: isolate;
  }

  /* the rim-light: a colored bloom behind the focal object, fading to the void at the edges */
  .rls::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(60% 50% at 50% 55%,
        var(--color-glow, #1e3a5f) 0%,
        transparent 70%);
    /* optional perpetual drift — must respect reduced motion (see below) */
    animation: rls-breathe var(--rls-dur, 8s) var(--ease-standard) infinite alternate;
  }
  @keyframes rls-breathe {
    from { opacity: 0.8; transform: scale(1); }
    to   { opacity: 1;   transform: scale(1.06); }
  }

  /* the single focal object: ship a static poster; mount WebGL/video on top later */
  .rls__stage {
    display: grid;
    place-items: center;
    width: min(40rem, 70vw);
    aspect-ratio: 1;
  }
  .rls__poster {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /* explicit, real play affordance in the DOM (keyboard + SR reachable) */
  .rls__play {
    position: absolute;
    width: var(--space-8);
    height: var(--space-8);
    border: 1px solid var(--color-fg);
    border-radius: var(--radius-full);
    background: transparent;
    color: var(--color-fg);
    cursor: pointer;
    transition: transform var(--duration-slow) var(--ease-standard),
                background-color var(--duration-base) var(--ease-standard);
  }
  .rls__play:hover { transform: scale(1.08); background: rgba(255,255,255,0.08); }

  @media (prefers-reduced-motion: reduce) {
    .rls::before { animation: none; }
  }
</style>

<section class="rls">
  <div class="rls__stage">
    <img class="rls__poster" src="/shield-poster.avif" alt="" aria-hidden="true">
    <button class="rls__play" aria-label="Play showreel">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
    </button>
  </div>
</section>
```
