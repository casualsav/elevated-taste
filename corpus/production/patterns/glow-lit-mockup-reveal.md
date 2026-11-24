---
pattern: glow-lit-mockup-reveal
from: typeform
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, reveal, product-shot, dark]
---

## What it is
A product screenshot or device mockup that **settles into view once** — fading up and rising a few pixels the first time its section enters — while resting on a soft radial bloom of the brand accent, then drifts a hair with continued scroll. On Typeform's dark bands the "Aa" form card and the interview panels sit inside an accent-purple glow (`0 0 25px rgba(162,95,186,0.3)`) and lift on `transform` as the band scrolls. The reveal is gated by `IntersectionObserver`, the drift by a CSS scroll-driven animation, and **both are fully disabled under `prefers-reduced-motion`** — the guard the source site omits.

## Why it works
On a dark ground a gray drop shadow looks muddy; a glow in the brand hue reads as the product *emitting* light, which flatters a UI screenshot and stays on-brand. The one-shot reveal says "this just arrived" without the perpetual distraction of scroll-tied parallax, and because the observer unobserves after firing there is zero ongoing cost. The small scroll drift (a few px of `translateY`) is what makes the mockup feel *held in space* rather than pasted on — but it must be tiny and compositor-only, or it tips from "alive" into motion-sickness spectacle. Animating only `transform`/`opacity` keeps it off the layout path; the default-visible start state (behind a `.js` opt-in) means the shot still shows if scripting or IO fails.

Two details carry it:

**Glow, don't shadow, on dark.** The bloom is a `radius`-less `box-shadow` (or a `radial-gradient` pseudo-element) in a translucent accent color — depth as light, not as a gray smudge.

**Cap the drift and gate everything.** The scroll drift is expressed as a CSS scroll-driven animation (`animation-timeline: view()`) so it stays off the main thread with no scroll handler; under reduced motion the reveal jumps to its end state and the drift animation is removed entirely.

## Reference implementation
```html
<figure class="shot">
  <img class="shot__img" src="/product.avif" alt="AI form builder composing a question" />
</figure>

<style>
  .shot {
    margin: 0;
    /* brand glow — depth as emitted light, not a gray shadow. Swap the hue for yours. */
    --glow: var(--color-glow, rgba(162,95,186,0.3));
    border-radius: var(--radius-xl);
    box-shadow: 0 0 25px 0 var(--glow);
  }
  .shot__img {
    display: block;
    inline-size: 100%;
    border-radius: var(--radius-xl);
  }

  /* --- one-shot reveal (default visible; JS opts into the hidden start) --- */
  .js .shot {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity var(--duration-slow) var(--ease-entrance),
                transform var(--duration-slow) var(--ease-entrance);
    will-change: opacity, transform;
  }
  .js .shot.is-in { opacity: 1; transform: none; }

  /* --- gentle scroll drift, compositor-only, no scroll handler --- */
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .shot.is-in {
        animation: shot-drift linear both;
        animation-timeline: view();
        animation-range: entry 0% exit 100%;
      }
      @keyframes shot-drift {
        from { translate: 0 12px; }
        to   { translate: 0 -12px; }   /* ~24px total travel — keep it small */
      }
    }
  }

  /* --- mandatory reduced-motion fallback: jump to end, no drift --- */
  @media (prefers-reduced-motion: reduce) {
    .js .shot { opacity: 1; transform: none; transition: none; will-change: auto; animation: none; }
  }
</style>

<script>
  document.documentElement.classList.add('js');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      e.target.style.willChange = 'auto';   // release after the one-shot
      io.unobserve(e.target);
    }
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.shot').forEach((el) => io.observe(el));
</script>
```
