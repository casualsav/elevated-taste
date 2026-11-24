---
pattern: fanned-card-deck-reveal
from: monzo
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, hero, interactive-showcase]
---

## What it is
A stack of cards (payment cards, plan tiers, gallery thumbs) that sits collapsed as a deck and **spreads into an overlapping fan** the first time it scrolls into view — each card rotated and translated a little more than the last, revealing with a short stagger. Monzo uses it to present the "Hot Coral card" as the hero of its account section (`PaymentCardFan_slideIn`, `CardCarouselAnimation_rotate`/`scale`).

## Why it works
The fan reads as a *physical* object being presented — depth and overlap imply "these are real things you hold," which a flat row of images never communicates. Because the spread is driven purely by `transform: rotate()/translate()` per card (compositor-only) and gated by a single IntersectionObserver, it's cheap and jank-free. The staggered delay makes the deck feel like it's being dealt rather than snapping, which is what sells the tactility. Reuse anywhere you want one product object to feel premium and central, not catalogued.

## Reference implementation
```html
<div class="fan" data-fan>
  <div class="fan__card" style="--i:0"></div>
  <div class="fan__card" style="--i:1"></div>
  <div class="fan__card" style="--i:2"></div>
  <div class="fan__card" style="--i:3"></div>
  <div class="fan__card" style="--i:4"></div>
</div>

<style>
  .fan {
    position: relative;
    width: 320px; height: 220px;
    margin-inline: auto;
  }
  .fan__card {
    position: absolute;
    inset: 0;
    width: 200px; height: 130px;
    margin: auto;
    border-radius: var(--radius-lg);     /* ~24px */
    background: var(--color-accent);
    box-shadow: var(--shadow-md);        /* 0 8px 32px rgba(0,0,0,.16) */
    transform-origin: bottom center;
    /* resting (collapsed) state */
    transform: rotate(0deg) translateX(0);
    opacity: 0;
    transition:
      transform var(--dur-400, 400ms) var(--ease-emphasized, cubic-bezier(0.05, 0.7, 0.1, 1)),
      opacity   var(--duration-slow) var(--ease-standard);
    transition-delay: calc(var(--i) * 60ms);   /* deal the deck */
  }
  /* spread: each card fans a little further than the previous */
  .fan.is-in .fan__card {
    opacity: 1;
    transform:
      rotate(calc((var(--i) - 2) * 9deg))
      translateX(calc((var(--i) - 2) * 18px));
  }

  @media (prefers-reduced-motion: reduce) {
    .fan__card {
      transition: none;
      opacity: 1;
      /* jump straight to the fanned end-state, no motion */
      transform:
        rotate(calc((var(--i) - 2) * 9deg))
        translateX(calc((var(--i) - 2) * 18px));
    }
  }
</style>

<script>
  // Cheap by construction: one IO, no scroll handler, transform/opacity only.
  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        obs.unobserve(e.target);           // fire once
      }
    }
  }, { threshold: 0.8 });
  document.querySelectorAll('[data-fan]').forEach(el => io.observe(el));
</script>
```
