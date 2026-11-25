---
pattern: flavor-hero-carousel
from: liquiddeath
corpus: expressive
safety: spectacle-only
trigger: load
tags: [hero, carousel, ecommerce, brand-experience, motion]
---

## What it is
A full-bleed hero that rotates between per-SKU "worlds" — each slide is a fully-saturated color field keyed to the product shown, with a big condensed all-caps headline, a thin outline CTA, prev/next arrows and a dot pager. Used when a brand has several flavors/themes and wants each to detonate in isolation rather than competing in one frame.

## Why it works
The punch comes from **isolation + product-derived color**: the surrounding page is neutral (white/black), so each saturated slide reads as an event, and the palette comes from the artifact (the can) instead of being decorative. Hierarchy on each slide is **scale + width contrast** (condensed display over normal body), not weight. The carousel earns its keep only when slides are genuinely equivalent options; it must stay *pausable* and never be the sole route to slide content (slides 2-N are effectively hidden from most users and crawlers).

## Reference implementation
```html
<section class="hero" aria-roledescription="carousel" aria-label="Featured flavors">
  <ul class="hero__track" data-autoplay="6000">
    <li class="hero__slide" style="--field: var(--hero-field-1, linear-gradient(160deg, #d6218e, #7a1fa2))" aria-hidden="false">
      <div class="hero__copy">
        <h1 class="hero__title">LESS SUGAR.<br>HUGE FLAVOR.</h1>
        <a class="btn-outline" href="/shop">SHOP NOW</a>
      </div>
      <img class="hero__product" src="/can-1.png" alt="Scary Strawberry sparkling energy can">
    </li>
    <!-- more <li class="hero__slide"> … -->
  </ul>
  <button class="hero__nav hero__nav--prev" aria-label="Previous">‹</button>
  <button class="hero__nav hero__nav--next" aria-label="Next">›</button>
  <button class="hero__pause" aria-pressed="false" aria-label="Pause rotation">❚❚</button>
</section>

<style>
  .hero { position: relative; overflow: hidden; }
  .hero__track { display: flex; margin: 0; padding: 0; list-style: none;
    transition: transform var(--dur-slide, 500ms) var(--ease-emphasis, cubic-bezier(.4,0,.2,1)); }
  .hero__slide { flex: 0 0 100%; min-height: 70vh; display: grid;
    grid-template-columns: 1fr 1fr; align-items: center; gap: var(--space-8, 32px);
    padding: var(--space-8, 32px) var(--space-10, 64px);
    background: var(--field); }          /* per-flavor saturated field */
  .hero__title { font-family: var(--font-display); text-transform: uppercase;
    font-size: clamp(2.5rem, 6vw, 3.75rem); line-height: 1; letter-spacing: -0.44px;
    color: var(--on-dark, #fff); margin: 0 0 var(--space-6, 24px); }
  .btn-outline { display: inline-block; font-family: var(--font-display);
    text-transform: uppercase; letter-spacing: 1px; color: var(--on-dark, #fff);
    border: 1px solid currentColor; border-radius: var(--radius-1, 5px);
    padding: var(--space-3, 12px) var(--space-6, 24px); text-decoration: none;
    transition: background var(--dur-fast, 200ms) ease, color var(--dur-fast, 200ms) ease; }
  .btn-outline:hover { background: var(--on-dark, #fff); color: var(--fg, #151515); }
  .hero__product { width: 100%; height: auto; object-fit: contain; }
  .hero__nav, .hero__pause { position: absolute; top: 50%; transform: translateY(-50%);
    background: none; border: 0; color: var(--on-dark, #fff); font-size: 2rem; cursor: pointer; }
  .hero__nav--prev { left: var(--space-4, 16px); }
  .hero__nav--next { right: var(--space-4, 16px); }
  .hero__pause { top: auto; bottom: var(--space-4, 16px); right: var(--space-4, 16px);
    transform: none; font-size: 1rem; }
  @media (max-width: 640px) { .hero__slide { grid-template-columns: 1fr; text-align: center; } }

  /* MANDATORY: stop autoplay + transition for reduced-motion users */
  @media (prefers-reduced-motion: reduce) {
    .hero__track { transition: none; }
  }
</style>

<script>
  // Cheap, dependency-free carousel. Transform-only animation = no reflow.
  const track = document.querySelector('.hero__track');
  const slides = [...track.children];
  let i = 0, timer = null;
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const go = (n) => {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(${-i * 100}%)`;
    slides.forEach((s, k) => s.setAttribute('aria-hidden', k !== i));
  };
  const start = () => { if (!prefersReduced) timer = setInterval(() => go(i + 1), +track.dataset.autoplay || 6000); };
  const stop  = () => { clearInterval(timer); timer = null; };

  document.querySelector('.hero__nav--next').onclick = () => { stop(); go(i + 1); };
  document.querySelector('.hero__nav--prev').onclick = () => { stop(); go(i - 1); };
  const pause = document.querySelector('.hero__pause');
  pause.onclick = () => {
    const playing = !!timer;
    playing ? stop() : start();
    pause.setAttribute('aria-pressed', String(playing));
  };
  // Pause on hover/focus so users keep control (WCAG 2.2.2).
  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);
  go(0); start();
</script>
```
> **Safety:** autoplay carousels are spectacle-only on conversion-critical heroes — they hide most slides and can fail pause/stop requirements. Keep autoplay pausable, gate it on `prefers-reduced-motion`, and ensure slide 2-N content is also reachable via a static route (links/grid). Animate only `transform` (done here) — never `left`/`width`.
