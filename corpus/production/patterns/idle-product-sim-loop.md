---
pattern: idle-product-sim-loop
from: decimals
corpus: production
safety: production-safe
trigger: load
tags: [motion, feature-section, product-demo]
---

## What it is
A small, self-running product simulation that lives inside a feature card and **loops on its own timeline — no scroll, no hover, no click required**. Decimals fills its three `WHY` cards this way: a chat shell where a message fades in and a "typing…" indicator pulses, a candidate list whose rows shimmer in sequence, a scout connector line that draws itself. It's the "living product" trick — motion that argues the product is real and working, without shipping a video. Distinct from scrollytelling: the loop runs independently of scroll position (start/pause is gated by visibility only).

## Why it works
A static screenshot says "here is a UI"; a gentle idle loop says "here is a UI *doing something*." Keeping it on a long, slow cadence (multi-second cycles, eased) makes it read as ambient life rather than an attention-grab — the eye registers it once and moves on, but the page feels inhabited. The cost is CPU, so the recipe is built to be cheap and polite: animate only `opacity`/`transform`, gate playback with an `IntersectionObserver` so off-screen loops don't run, and collapse to a static end-state under `prefers-reduced-motion`.

## Why it works — the safety wiring
The loop is CSS `@keyframes` (so it stays off the main thread) and is *toggled* by a class the observer adds/removes; there is no `requestAnimationFrame` scroll handler. `content-visibility` lets the browser skip work entirely when the card is far off-screen.

## Reference implementation
```html
<article class="sim-card" aria-hidden="true">
  <div class="sim-card__ui">
    <div class="sim-msg">Ridd · Scout — Can't wait to get started</div>
    <div class="sim-typing"><span></span><span></span><span></span></div>
  </div>
</article>

<style>
  .sim-card {
    background: var(--color-surface, #fdfbf6);
    border-radius: var(--radius-lg, 14px);
    padding: var(--space-5, 1.5rem);
    box-shadow: var(--color-hairline, rgba(77,70,56,0.08)) 0 0 0 1px,
                var(--color-hairline, rgba(77,70,56,0.08)) 0 2px 6px 0;
    content-visibility: auto;              /* skip work when off-screen */
    contain-intrinsic-size: 320px;
  }

  /* loops are OFF until the observer marks the card in view */
  .sim-msg    { opacity: 0; transform: translateY(8px); }
  .sim-typing span {
    display: inline-block; width: 6px; height: 6px; border-radius: var(--radius-full, 999px);
    background: var(--color-muted, rgba(77,70,56,0.6)); opacity: 0.3;
  }

  .sim-card.is-live .sim-msg {
    animation: sim-msg-in var(--duration-slow, 620ms) var(--ease-entrance, cubic-bezier(0.16,1,0.3,1)) forwards;
  }
  .sim-card.is-live .sim-typing span {
    animation: sim-blink 1.2s ease-in-out infinite;
  }
  .sim-card.is-live .sim-typing span:nth-child(2) { animation-delay: 0.15s; }
  .sim-card.is-live .sim-typing span:nth-child(3) { animation-delay: 0.30s; }

  @keyframes sim-msg-in { to { opacity: 1; transform: translateY(0); } }
  @keyframes sim-blink  { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }

  /* reduced motion: show the finished frame, run nothing */
  @media (prefers-reduced-motion: reduce) {
    .sim-card.is-live .sim-msg { animation: none; opacity: 1; transform: none; }
    .sim-card.is-live .sim-typing { display: none; }
  }
</style>

<script>
  // Gate the loop on visibility so off-screen cards do no work.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) e.target.classList.toggle('is-live', e.isIntersecting);
  }, { rootMargin: '200px' });
  document.querySelectorAll('.sim-card').forEach((el) => io.observe(el));
</script>
```
