---
pattern: caption-free-hero-crossfade
from: gjelina
corpus: production
safety: production-safe
trigger: load
tags: [hero, motion, landing, photography, restaurant, brand-experience]
---

## What it is
A full-bleed hero that is *only* photography: several images stacked in the same box, crossfaded on `opacity`, with a visible pause control and dot pagination sitting over the image. No headline, no subhead, no CTA, no gradient scrim. The page's first words appear in the section below the fold. Gjelina runs four slides this way at ~630px tall — deliberately short of `100vh`, so the next section's cream edge is visible and the fold reads as "there is more," not as "this is the whole site."

## Why it works
Overlaying a headline on a photograph costs you three things at once: the photo needs a scrim (which mutes it), the type needs a safe area (which crops it), and the sentence has to be good enough to be worth both. For sensory products — food, hospitality, apparel, travel, materials — it rarely is, because the photograph is already making a claim the sentence can only weaken by paraphrasing. Removing the overlay lets the image be uncropped, unscrimmed, and edge-to-edge, and it moves the first heading into normal document flow where it can be an actual `<h1>` about an actual thing.

The crossfade is the right motion because it is the only one that says "another view of the same place." A horizontal slide implies a sequence you're moving through; a Ken Burns zoom implies the camera is alive. Opacity implies substitution. It is also the cheapest: no layout, no paint of moving edges, compositor-only.

Two obligations come with autoplay, and most implementations ship neither:
- **A pause control**, keyboard-reachable, that actually stops the timer (not just the CSS). Autoplaying imagery next to text is a reading tax, and WCAG 2.2.2 requires a mechanism to pause anything that moves for more than five seconds.
- **A reduced-motion stop.** Under `prefers-reduced-motion: reduce` the correct behavior is not "fade faster" — it is *don't rotate at all*. Show slide one, keep the dots functional as manual navigation, and never start the timer. The snippet below does this in JS as well as CSS, because a CSS-only opt-out still leaves the class-swapping timer running.

Sizing rule: give the hero a height that stops short of the viewport (`clamp()` against `70vh`, not `100vh`). A hero that exactly fills the fold is the single most common reason a page reads as having nothing below it.

## Reference implementation
```html
<style>
  .phero {
    position: relative;
    height: clamp(24rem, 70vh, 44rem);        /* deliberately short of 100vh */
    background: var(--color-bg-warm, #f9e4c2);
  }

  .phero__slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity var(--duration-crossfade, 1500ms) var(--ease-standard);
    will-change: opacity;
  }
  .phero__slide[data-active] { opacity: 1; }
  .phero__slide > img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .phero__controls {
    position: absolute;
    inset-inline: 0;
    bottom: var(--space-6);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
  }

  .phero__toggle,
  .phero__dot {
    display: grid;
    place-items: center;
    min-width: 44px;                          /* tap-target floor — the usual failure here */
    min-height: 44px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--color-fg-on-dark);
    cursor: pointer;
  }
  .phero__dots { display: flex; gap: var(--space-2); }
  .phero__dot::before {
    content: "";
    width: 12px;
    height: 12px;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-fg-on-dark);
    background: transparent;
    transition: background-color var(--duration-base) var(--ease-standard);
  }
  .phero__dot[aria-current="true"]::before { background: var(--color-fg-on-dark); }
  .phero__toggle:focus-visible,
  .phero__dot:focus-visible { outline: 3px solid var(--color-fg-on-dark); outline-offset: 2px; }

  /* Mandatory: no rotation, no transition. Slide one, dots stay usable as manual nav. */
  @media (prefers-reduced-motion: reduce) {
    .phero__slide { transition: none; }
  }
</style>

<section class="phero" aria-roledescription="carousel" aria-label="The restaurant">
  <div class="phero__slide" data-active>
    <img src="/photos/pizza.jpg" alt="A server carrying two blistered wood-fired pizzas across the dining room">
  </div>
  <div class="phero__slide">
    <img src="/photos/cellar.jpg" alt="Natural wine bottles lined along a reclaimed-wood shelf">
  </div>
  <div class="phero__slide">
    <img src="/photos/patio.jpg" alt="The brick patio in afternoon light, tables set for dinner">
  </div>

  <div class="phero__controls">
    <button class="phero__toggle" type="button" aria-pressed="false">
      <span aria-hidden="true">❙❙</span>
      <span class="sr-only">Pause the image slideshow</span>
    </button>
    <div class="phero__dots" role="group" aria-label="Choose an image"></div>
  </div>
</section>

<script>
  (function () {
    const hero = document.querySelector('.phero');
    const slides = [...hero.querySelectorAll('.phero__slide')];
    const dots = hero.querySelector('.phero__dots');
    const toggle = hero.querySelector('.phero__toggle');
    const calm = matchMedia('(prefers-reduced-motion: reduce)');
    const INTERVAL = 5000;
    let i = 0, timer = null;

    slides.forEach((_, n) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'phero__dot';
      dot.setAttribute('aria-current', String(n === 0));
      dot.innerHTML = '<span class="sr-only">Image ' + (n + 1) + '</span>';
      dot.addEventListener('click', () => { stop(); show(n); });   // manual nav ends autoplay for good
      dots.append(dot);
    });

    function show(n) {
      i = n;
      slides.forEach((s, k) => s.toggleAttribute('data-active', k === n));
      [...dots.children].forEach((d, k) => d.setAttribute('aria-current', String(k === n)));
    }
    function start() {
      if (calm.matches || timer) return;      // JS gate: the timer never runs, not just the transition
      timer = setInterval(() => show((i + 1) % slides.length), INTERVAL);
      toggle.setAttribute('aria-pressed', 'false');
    }
    function stop() {
      clearInterval(timer);
      timer = null;
      toggle.setAttribute('aria-pressed', 'true');
    }

    toggle.addEventListener('click', () => (timer ? stop() : start()));
    hero.addEventListener('focusin', stop);   // never rotate under a keyboard user's hands
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    calm.addEventListener('change', () => (calm.matches ? stop() : start()));

    start();
  })();
</script>
```
