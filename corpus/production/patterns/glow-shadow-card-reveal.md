---
pattern: glow-shadow-card-reveal
from: typeform
corpus: production
safety: production-safe
trigger: in-view
tags: [feature-section, motion, dark, interactive-showcase]
---

## What it is
A product screenshot / UI mockup card that (a) carries a **colored glow-shadow** — `box-shadow: <accent> 0 0 15px` — so it reads as a luminous, backlit object rather than a flat image on a dark ground, and (b) **fade-rises into view** (opacity + a short upward translate) the first time it enters the viewport, driven by an `IntersectionObserver` toggling one class. Typeform hangs these cards in its feature bands (the "FitCo" form, the browser-window demos), each glowing in the local purple of its section.

## Why it works
Two cheap mechanisms stack into one premium effect. The glow-shadow fakes rim-light: on a dark page a colored outer shadow separates figure from ground and injects the brand hue exactly where the eye is already looking, turning a static PNG into something that looks lit and alive. The in-view reveal buys perceived motion and sequencing without a scroll-jacking timeline — the observer fires once per element, CSS handles the transition, and you animate **only `opacity` and `transform`** so it stays off the main thread and never triggers layout. Gating on entry (not scroll progress) means the animation runs when it's relevant and then gets out of the way. Transfers to any screenshot grid, feature reel, or "meet the product" card set on a dark or tinted ground.

## Why it works — cost & fallbacks
The glow is a static shadow (never animate its blur radius — that's an expensive repaint). The reveal is one-shot: unobserve after firing so it never re-runs. Under `prefers-reduced-motion` the card simply starts visible — no rise, no fade. Keep the glow subtle enough that the card's own contents still meet contrast on their own.

## Reference implementation
```html
<div class="glow-card" data-reveal>
  <img class="glow-card__shot" src="product.avif" alt="AI form builder generating a form from a prompt" />
</div>

<style>
.glow-card {
  border-radius: var(--radius-xl);          /* 24px feel on Typeform; xl≈16px house */
  overflow: hidden;
  background: var(--color-surface-dark, #1e242f);
  /* the colored rim-light — a STATIC shadow, brand-hued */
  box-shadow: 0 0 15px 0 var(--color-glow-shadow, #b66dd5),
              0 0 25px 0 rgba(182,109,213,0.30);
  /* start state for the reveal */
  opacity: 0;
  transform: translateY(var(--space-5));
  transition: opacity var(--duration-slow) var(--ease-entrance),
              transform var(--duration-slow) var(--ease-entrance);
  will-change: opacity, transform;
}
.glow-card.is-in {                          /* toggled by the observer */
  opacity: 1;
  transform: none;
}
.glow-card__shot { display: block; width: 100%; height: auto; }

/* reduced motion: no reveal, render final state immediately */
@media (prefers-reduced-motion: reduce) {
  .glow-card { opacity: 1; transform: none; transition: none; will-change: auto; }
}
</style>

<script>
  // Cheap one-shot reveal: fire once on entry, then stop observing.
  const cards = document.querySelectorAll('[data-reveal]');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
      }
    }, { threshold: 0.1, rootMargin: '50px 0px' });
    cards.forEach(c => io.observe(c));
  } else {
    cards.forEach(c => c.classList.add('is-in'));
  }
</script>
```
