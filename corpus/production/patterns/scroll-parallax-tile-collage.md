---
pattern: scroll-parallax-tile-collage
from: acorns
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, feature-section, product-marketing, interactive-showcase, parallax]
---

## What it is
A section where one anchor object — a phone, a laptop, the product itself — sits centered, ringed by satellite tiles naming the things it does. As the section crosses the viewport, each tile translates vertically at a **different rate**, so the cluster starts overlapped and fans apart, then re-converges as it leaves. Acorns uses it once, with six tiles (Investing, Retirement, Kids, Banking, Learning, Bonus) around a phone showing the real app.

## Why it works
A bundle is a *containment* claim: all of this is one product. A grid of six equal cards says the opposite — six peers, arbitrarily ordered. Anchoring the tiles around a single object and letting them drift relative to it animates the containment: the tiles visibly belong to the thing in the middle, and the scroll separates them just far enough to be read, then lets them fall back.

The rate difference is the whole mechanism, and it must be small. Tiles that move 4–10% of the scroll distance read as depth; tiles that move 40% read as chaos and induce the sliding-vertigo that makes parallax pages nauseating. Differentiate by rate, never by adding rotation or scale — those change the tile's silhouette and break the "these are the same kind of thing" reading.

Build it on `animation-timeline: view()` where it exists: the browser drives the transform off the compositor with no scroll listener, no rAF, no main-thread work. The source site instead hand-rolls it across seventeen scroll listeners and sixty-six rAF callbacks, which is a lot of main thread for a decoration. The JS fallback below is rAF-coalesced and reads layout once per frame.

Non-negotiable: the section must be **complete and readable at rest**. If the tiles only become legible mid-scroll, the effect is load-bearing and reduced-motion users lose content. Here the resting state is the finished collage; the drift is garnish, so `prefers-reduced-motion: reduce` simply removes it.

## Reference implementation
```html
<style>
  .collage {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 90svh;
    padding-block: var(--space-9);
    background: var(--color-bg);
  }
  .collage__anchor { position: relative; z-index: 1; max-width: 22rem; }
  .collage__anchor img { display: block; width: 100%; height: auto; }

  .collage__tile {
    position: absolute;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-4);
    border-radius: var(--radius-xl);
    color: var(--color-fg-on-dark);
    background: var(--color-tile, #2c4a29);
    font-size: var(--text-lg);
    font-weight: var(--weight-medium);
    will-change: transform;                       /* only on the six tiles, nowhere else */
  }
  /* Placement is authored; only the drift rate varies. Keep --rate between 0.04 and 0.10. */
  .collage__tile:nth-child(1) { top: 12%; left:  4%; --rate: 0.09; }
  .collage__tile:nth-child(2) { top:  4%; left: 33%; --rate: 0.05; --color-tile: #4a4a4a; }
  .collage__tile:nth-child(3) { top:  8%; right: 6%; --rate: 0.10; --color-tile: var(--color-spark, #6944ff); }
  .collage__tile:nth-child(4) { bottom:22%; right:10%; --rate: 0.06; --color-tile: #3f7a2e; }
  .collage__tile:nth-child(5) { bottom: 8%; right:26%; --rate: 0.08; --color-tile: #101410; }
  .collage__tile:nth-child(6) { bottom:14%; left: 12%; --rate: 0.04; --color-tile: #8a6a4b; }

  /* Preferred path: compositor-driven, zero JS. The tile travels ±(rate × 100vh) across its own view range. */
  @supports (animation-timeline: view()) {
    .collage__tile {
      animation: tile-drift linear both;
      animation-timeline: view();
      animation-range: entry 0% exit 100%;
    }
    @keyframes tile-drift {
      from { transform: translate3d(0, calc(var(--rate, 0.06) * 50vh), 0); }
      to   { transform: translate3d(0, calc(var(--rate, 0.06) * -50vh), 0); }
    }
  }

  /* Mandatory: the resting collage is the content; the drift is not. */
  @media (prefers-reduced-motion: reduce) {
    .collage__tile {
      animation: none !important;
      transform: none !important;
      transition: none !important;
    }
  }

  @media (max-width: 768px) {
    /* Absolute placement collapses; a 2-col tile grid under the anchor beats a squashed collage. */
    .collage { display: block; }
    .collage__tile { position: static; }
  }
</style>

<section class="collage" aria-label="What the app does">
  <div class="collage__anchor">
    <img src="/art/phone.png" alt="The app showing an investment balance of $27,953 and its performance chart">
  </div>
  <div class="collage__tile">Investing</div>
  <div class="collage__tile">Bonus investments</div>
  <div class="collage__tile">Kids</div>
  <div class="collage__tile">Banking</div>
  <div class="collage__tile">Learning</div>
  <div class="collage__tile">Retirement</div>
</section>

<script>
  // Fallback for engines without scroll-driven animations. Skipped entirely when unsupported
  // is false, when the user asks for less motion, or when the section is off-screen.
  (() => {
    if (CSS.supports('animation-timeline: view()')) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;

    const section = document.querySelector('.collage');
    const tiles = [...section.querySelectorAll('.collage__tile')];
    let ticking = false;
    let active = false;

    const paint = () => {
      const { top, height } = section.getBoundingClientRect();
      // progress: 0 as the section enters the bottom, 1 as it leaves the top.
      const progress = (innerHeight - top) / (innerHeight + height);
      for (const tile of tiles) {
        const rate = parseFloat(getComputedStyle(tile).getPropertyValue('--rate')) || 0.06;
        const travel = rate * innerHeight;           // px, small by construction
        tile.style.transform = `translate3d(0, ${(0.5 - progress) * travel}px, 0)`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!active || ticking) return;               // one layout read per frame, max
      ticking = true;
      requestAnimationFrame(paint);
    };

    // Only listen while the section is actually in view.
    new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) onScroll();
    }, { rootMargin: '200px' }).observe(section);

    addEventListener('scroll', onScroll, { passive: true });
    reduce.addEventListener('change', (e) => {
      if (!e.matches) return;
      active = false;
      tiles.forEach((t) => (t.style.transform = ''));
    });
  })();
</script>
```
