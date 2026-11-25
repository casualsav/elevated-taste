---
pattern: sticky-stack-recede
from: userflow
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, scroll, cards, stack, feature-section, onboarding]
---

## What it is
A vertical deck of full-bleed panels that page one at a time: each panel is `position: sticky` and pins near the top of the viewport, then the next panel scrolls up *over* it, and the one being covered quietly scales down and dims. Userflow uses it for its "Built for customer-obsessed teams" band — three tall audience panels (mint / blue / lavender) that stack like a hand of cards as you scroll, so you always read exactly one in focus. It differs from `card-stack-scale-dim` (a *horizontal* depth-of-field row where the centered card is largest): here the movement is a *vertical* pin-and-cover, and the scale/dim is the "I'm being buried" cue, not a carousel focus.

## Why it works
Sticky siblings at increasing z-index turn a long section into discrete, self-paced chapters without a scroll-jacking framework: the browser's own sticky positioning does the pinning, so scrolling stays native and reversible. Scaling the covered card down a hair (~0.92) and dimming it (~brightness 0.9) manufactures depth — the brain reads the smaller, darker card as *behind* and *done*, so attention lands on the incoming panel with zero extra chrome. **Safety: production-safe.** The deltas are tiny and animate only `transform` and `filter: brightness` (both compositor-friendly), so there is no reflow and no lurch; the resting state — a plain stack of full-size, full-brightness panels — is the correct layout, so reduced-motion and unsupported browsers lose nothing. Prefer a CSS scroll-driven `animation-timeline: view()` so the scrub runs off the main thread; never a scroll-event handler (the corpus bans those for their continuous reflows).

## Reference implementation
```html
<style>
  .deck { display: flex; flex-direction: column; gap: var(--space-6, 2rem); }

  /* Each panel pins at the top of the viewport; the next one scrolls over it.
     Increasing z-index (via --i) makes later panels cover earlier ones. */
  .deck__panel {
    position: sticky;
    top: var(--space-7, 3rem);
    z-index: var(--i, 1);
    border: 1px solid var(--color-border, #141414);
    border-radius: var(--radius-xl, 24px);
    padding: var(--space-7, 3rem);
    background: var(--panel-tint, #e4fcd7);   /* hue codes the audience */
    transform-origin: center top;
    will-change: transform, filter;

    /* Scrub: the panel recedes (shrinks + dims) as it scrolls up and out of
       view under the next panel. Runs on the compositor, no scroll listener. */
    animation: recede linear both;
    animation-timeline: view();
    animation-range: exit 0% exit 100%;
  }
  @keyframes recede {
    from { transform: scale(1);    filter: brightness(1); }
    to   { transform: scale(0.92); filter: brightness(0.9); }   /* capped, subtle */
  }

  /* Reduced motion / no scroll-timeline support: a plain, legible stack. */
  @media (prefers-reduced-motion: reduce) {
    .deck__panel { animation: none; transform: none; filter: none; }
  }
</style>

<section class="deck">
  <article class="deck__panel" style="--i:1; --panel-tint:#e4fcd7;"><!-- Product & Growth --></article>
  <article class="deck__panel" style="--i:2; --panel-tint:#d1e5ff;"><!-- Customer Success --></article>
  <article class="deck__panel" style="--i:3; --panel-tint:#d7d4ff;"><!-- Customer Marketing --></article>
</section>

<script>
  // Fallback ONLY where animation-timeline is unsupported. No scroll listener:
  // an IntersectionObserver gates a rAF loop that runs only while the deck is
  // on screen and maps each panel's exit progress to scale + brightness.
  const supportsTimeline = CSS.supports('animation-timeline: view()');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsTimeline && !reduce) {
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const MIN_S = 0.92, DIM = 0.9;                 // match the keyframe caps
    document.querySelectorAll('.deck').forEach((deck) => {
      const panels = [...deck.querySelectorAll('.deck__panel')];
      let running = false;
      const tick = () => {
        for (const p of panels) {
          const r = p.getBoundingClientRect();
          // 0 while fully in view, →1 as its top slides above the viewport top
          const exit = clamp(-r.top / (r.height || 1));
          p.style.transform = 'scale(' + (1 - (1 - MIN_S) * exit).toFixed(3) + ')';
          p.style.filter = 'brightness(' + (1 - (1 - DIM) * exit).toFixed(3) + ')';
        }
        if (running) requestAnimationFrame(tick);
      };
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running) { running = true; requestAnimationFrame(tick); }
        else if (!e.isIntersecting) running = false;
      }, { threshold: 0 }).observe(deck);
    });
  }
</script>
```
