---
pattern: scroll-progress-orbit-counterrotate
from: cal
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, feature-section, integrations, interactive-showcase]
---

## What it is

Concentric rings carry your integration logos around a central product mark. As the section crosses the viewport, each ring rotates by a fixed angle — the outer one clockwise, the inner one counter — and every icon mounted on a ring rotates by the *negative* of its ring's angle, so the logos stay upright while they orbit. A radial vignette dissolves the rings into the card's background before they can hit its edge.

Nothing plays on a clock. The rotation is a pure function of scroll position, so it runs while the reader scrolls and stops when they stop.

## Why it works

Two mechanisms, both worth stealing independently.

**Counter-rotation** is what separates an orbit from a tumble. Rotate a parent and the child inherits the spin; apply `rotate: calc(-1 * var(--spin))` to the child on the same timeline and it travels the circle while its own axis stays fixed. Readable logos, moving arrangement. (The evidence for it in the source is a `+105.5°` / `−105.5°` pair of scroll-progress rotations on nested elements.)

**Scroll-parameterized instead of time-parameterized** motion is the reason this survives contact with a real reader. A time-loop next to body copy is a permanent distraction and a reading tax; a scroll-linked one is feedback — it confirms the reader's own input and goes quiet when they do. The rule generalizes: if motion is decorative and continuous, bind it to scroll, not to a timer.

Reuse this wherever you would otherwise ship a static logo cloud, and where the claim is *"we sit at the center of the tools you already use."* If the claim is anything else, the geometry is lying.

## Reference implementation

Two rings, `animation-timeline: view()` first, an rAF fallback second, reduced-motion honored in both.

```html
<figure class="orbit">
  <img class="orbit__hub" src="/logo.svg" alt="Acme" width="48" height="48">

  <div class="orbit__ring orbit__ring--outer" style="--spin: 106deg; --r: 11rem">
    <img class="orbit__icon" style="--a:   0deg" src="/google-calendar.svg" alt="Google Calendar">
    <img class="orbit__icon" style="--a: 120deg" src="/outlook.svg"         alt="Outlook">
    <img class="orbit__icon" style="--a: 240deg" src="/zoom.svg"            alt="Zoom">
  </div>

  <div class="orbit__ring orbit__ring--inner" style="--spin: -118deg; --r: 6.5rem">
    <img class="orbit__icon" style="--a:  60deg" src="/slack.svg"  alt="Slack">
    <img class="orbit__icon" style="--a: 240deg" src="/stripe.svg" alt="Stripe">
  </div>
</figure>

<style>
  .orbit {
    position: relative;
    display: grid;
    place-items: center;
    aspect-ratio: 1;
    max-width: 30rem;
    margin-inline: auto;
    border-radius: var(--radius-xl);
    background: var(--color-bg);
    /* Every ring and icon reads its progress from this one timeline. */
    view-timeline-name: --orbit;
    view-timeline-axis: block;
    /* Rotating a ring is invisible (it's a circle) but its axis-aligned bounding
       box still grows mid-spin; clip that layout artifact, not the visible orbit. */
    overflow-x: clip;
  }

  /* Vignette: the rings never reach the card edge, so they never need a mask
     that fights the border-radius. */
  .orbit::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(50% 50%, transparent 87%, var(--color-bg) 100%);
    pointer-events: none;
  }

  .orbit__hub { position: relative; z-index: 1; }

  .orbit__ring {
    position: absolute;
    width: calc(var(--r, 11rem) * 2);
    aspect-ratio: 1;
    border: 1px solid var(--color-hairline);
    border-radius: var(--radius-full);
  }

  .orbit__icon {
    position: absolute;
    inset: 0;
    width: var(--icon-size, 2rem);
    height: var(--icon-size, 2rem);
    margin: auto;
    /* Static placement uses `transform`; the animation uses `rotate`.
       Separate properties, so they never overwrite each other. */
    transform:
      rotate(var(--a, 0deg))
      translateY(calc(-1 * var(--r, 11rem)))
      rotate(calc(-1 * var(--a, 0deg)));
  }

  /* --- Preferred: CSS scroll-driven animation. Zero JS, off the main thread. --- */
  .orbit__ring,
  .orbit__icon {
    animation: linear both;
    animation-timeline: --orbit;
    animation-range: entry 0% exit 100%;
  }
  .orbit__ring { animation-name: orbit-spin; }
  .orbit__icon { animation-name: orbit-counter-spin; }

  @keyframes orbit-spin         { to { rotate: var(--spin, 106deg); } }
  /* --spin is inherited from the ring, so the icon always undoes exactly its own ring. */
  @keyframes orbit-counter-spin { to { rotate: calc(-1 * var(--spin, 106deg)); } }

  /* --- Fallback: one rAF-coalesced scroll read, writing a single custom property. --- */
  @supports not (animation-timeline: view()) {
    .orbit__ring,
    .orbit__icon { animation: none; }
    .orbit__ring { rotate: calc(var(--p, 0) * var(--spin, 106deg)); }
    .orbit__icon { rotate: calc(var(--p, 0) * -1 * var(--spin, 106deg)); }
  }

  /* --- Mandatory: no orbit for readers who asked for no motion. --- */
  @media (prefers-reduced-motion: reduce) {
    .orbit__ring,
    .orbit__icon { animation: none; rotate: 0deg; }
  }
</style>

<script type="module">
  // Only runs where scroll-driven CSS is unavailable, and never under reduced motion.
  const supported = CSS.supports('animation-timeline: view()');
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!supported && !calm) {
    for (const orbit of document.querySelectorAll('.orbit')) {
      let ticking = false;
      const update = () => {
        const { top, height } = orbit.getBoundingClientRect();
        const progress = (innerHeight - top) / (innerHeight + height); // 0 entering → 1 leaving
        orbit.style.setProperty('--p', Math.min(1, Math.max(0, progress)).toFixed(3));
        ticking = false;
      };
      const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
      // The IntersectionObserver is the point: no scroll work while the section is off-screen.
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { addEventListener('scroll', onScroll, { passive: true }); update(); }
        else removeEventListener('scroll', onScroll);
      }).observe(orbit);
    }
  }
</script>
```

The `--p` fallback writes one custom property per section per frame and lets CSS do both rotations; the icons cost nothing extra. If you drop the fallback entirely, the rings simply render at rest — which is a fine static integration diagram.
