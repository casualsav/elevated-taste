---
pattern: card-stack-scale-dim
from: pitch
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, scroll, cards, stack, depth, feature-section]
---

## What it is
A row or stack of cards where the focused card sits largest and brightest while its neighbors scale down and dim, so attention is steered to one card at a time - a depth-of-field carousel driven by scroll. Pitch's testimonial deck shows it plainly: in the frame the center "Trusted by 4M+ teams" card reads full-size and bright while the cards flanking it are visibly smaller and darkened, and the deltas are *small* (the capture measured scale only ~0.88→0.94 and `filter: brightness(1)→brightness(0.7)`, with just 2 scale effects, not a slam). Use it for testimonial decks, template galleries, any "one-at-a-time" stack.

## Why it works
Scaling and dimming the off-focus cards manufactures depth of field: the brain reads the largest, brightest element as nearest, so the focused card pops without a heavier treatment. Tying that to scroll progress means focus *travels* as you read, which keeps a long stack engaging without extra chrome. **Safety: production-safe** - and the reason is the cap. `transform: scale()` and `filter: brightness()` are both compositor-friendly, and because Pitch keeps the scale delta tiny (≈0.06) and the dim shallow (down to 0.7), it never lurches; a `0.6→1` slam with heavy darkening would tip it into spectacle (motion sickness, jank) and would belong in the expressive corpus. Drive it with a CSS scroll-driven `animation-timeline: view()` per card so it runs off the main thread; never a scroll-event handler (the corpus bans those for their continuous reflows), and animate only `transform` and the cheap `filter: brightness`. The resting state is full-size, full-brightness cards, so reduced-motion and unsupported browsers land on a correct, legible stack.

## Reference implementation
```html
<style>
  .stack { display: flex; gap: var(--space-5); overflow: hidden; }

  /* Each card peaks (full size + brightness) while centered in the viewport and
     recedes as it leaves. Primary path: CSS scroll-driven animation on the
     compositor, no scroll listener. The peak state (scale 1) IS the resting
     layout, so unsupported browsers render the correct stack. */
  .stack__card {
    flex: 0 0 auto;
    transform: scale(1);
    will-change: transform;
    border-radius: var(--radius-xl);
    animation: stack-focus linear both;
    animation-timeline: view(inline);
    animation-range: entry 0% exit 100%;
  }
  @keyframes stack-focus {
    /* small, capped deltas are intrinsic; keep them subtle for production */
    entry 0%, exit 100% { transform: scale(0.9);  filter: brightness(0.7); }
    cover 50%           { transform: scale(1);     filter: brightness(1); }
  }

  /* Reduced motion: render the stack flat: full size, full brightness, no scrub. */
  @media (prefers-reduced-motion: reduce) {
    .stack__card { animation: none; transform: none; filter: none; }
  }
</style>

<div class="stack">
  <article class="stack__card"><!-- card 1 --></article>
  <article class="stack__card"><!-- card 2 (focus when centered) --></article>
  <article class="stack__card"><!-- card 3 --></article>
</div>

<script>
  // Fallback ONLY where animation-timeline is unsupported. No scroll listener:
  // an IntersectionObserver gates a rAF loop that runs only while the stack is
  // on screen and reads each card's center offset via getBoundingClientRect.
  const supportsTimeline = CSS.supports('animation-timeline: view()');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsTimeline && !reduce) {
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const MIN_S = 0.9, DIM = 0.7;          // match the keyframe caps above
    document.querySelectorAll('.stack').forEach((stack) => {
      const cards = [...stack.querySelectorAll('.stack__card')];
      let running = false;
      const tick = () => {
        for (const card of cards) {
          const r = card.getBoundingClientRect();
          const mid = r.left + r.width / 2;
          // 1 when the card is centered, 0 at the viewport edges
          const p = clamp(1 - Math.abs(mid - innerWidth / 2) / (innerWidth / 2));
          const s = MIN_S + (1 - MIN_S) * p;
          card.style.transform = 'scale(' + s.toFixed(3) + ')';
          card.style.filter = 'brightness(' + (DIM + (1 - DIM) * p).toFixed(3) + ')';
        }
        if (running) requestAnimationFrame(tick);
      };
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running) { running = true; requestAnimationFrame(tick); }
        else if (!e.isIntersecting) running = false;
      }, { threshold: 0 }).observe(stack);
    });
  }
</script>
```
