---
pattern: ambient-drift-card-field
from: lightspark
corpus: production
safety: production-safe
trigger: load
tags: [hero, motion, ambient, cards, interactive-showcase]
---

## What it is
A hero that replaces the single big product mockup with a **constellation of cards scattered around a centered headline**, where every card *drifts forever on its own gentle loop* — a few pixels of slow, independent x/y wander — so the field feels buoyant and alive while the type stays dead still on top. Hovering a card grows it; the whole field can be grabbed and dragged as one "world." Lightspark floats ~20 app/payment mockups this way behind "The API for money," communicating breadth and liveliness no static screenshot could.

## Why it works
Idle ambient motion reads as *alive* rather than *demanding* precisely because it is **unsynchronized and non-scroll-tied**: each card runs two infinite keyframe loops at different durations (x ~12s, y ~16s) with a per-card offset, so the field never pulses in lockstep and never competes with the content. Binding only `transform: translate` keeps every card on the compositor — no layout, no paint, no scroll handler. Three guards make it production-safe: (1) **drive the amplitude and timing from custom properties** so one rule animates any number of cards; (2) **pause the whole field when it's offscreen or idle** (`animation-play-state: paused` toggled by an IntersectionObserver) so you pay nothing when it's not visible; (3) **collapse to the resting layout under `prefers-reduced-motion`**. The optional cursor spotlight (a radial `mask-image` on a dot grid following `--mx/--my`) is the only continuous-input cost — keep it pointer-only and behind the reduced-motion gate.

## Reference implementation
```html
<!-- framework-neutral; house tokens + inline fallbacks for per-card drift values -->
<section class="field" id="field">
  <div class="field__world" aria-hidden="true">
    <!-- repeat per card; set --ax/--ay (amplitude) and --tx/--ty (duration) per card -->
    <figure class="field__card" style="--ax:14px; --ay:10px; --tx:12s; --ty:16s; top:12%; left:8%;">
      <img src="card-1.webp" alt="" />
    </figure>
    <figure class="field__card" style="--ax:-10px; --ay:16px; --tx:15s; --ty:13s; top:60%; left:70%;">
      <img src="card-2.webp" alt="" />
    </figure>
    <!-- …more cards… -->
  </div>

  <div class="field__center">
    <h1>The headline</h1>
    <p>One calm line of support copy.</p>
    <a class="field__cta" href="#">Primary</a>
  </div>
</section>

<style>
  .field {
    position: relative; min-height: 100dvh;
    display: flex; align-items: center; justify-content: center;
    padding: clamp(5.6rem, 4.16rem + 3vw, 8rem) var(--space-4, 2.4rem);
    background: var(--color-bg, #f8f8f7);
    overflow: hidden; cursor: grab;           /* whole field is grabbable */
  }
  .field:active { cursor: grabbing; }

  .field__world { position: absolute; inset: 0; z-index: 0; }

  .field__card {
    position: absolute; margin: 0; width: clamp(14rem, 18vw, 22rem);
    border-radius: var(--radius-card, 2.4rem); overflow: hidden;
    /* two independent infinite loops -> unsynchronized ambient drift */
    animation:
      drift-x var(--tx, 12s) cubic-bezier(.455,.03,.515,.955) infinite,
      drift-y var(--ty, 16s) cubic-bezier(.455,.03,.515,.955) infinite;
    will-change: transform;
  }
  .field__card img { display: block; width: 100%; height: auto; }
  /* hover grows a single card without disturbing the drift (nested transform) */
  .field__card:hover { transform: scale(1.12); transition: transform var(--duration-slow, 320ms) cubic-bezier(.175,.885,.32,1.1); }

  .field__center {
    position: relative; z-index: 2; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: var(--space-4, 2.4rem);
    color: var(--color-fg, #020202); pointer-events: none;    /* clicks fall through to cards */
  }
  .field__center a, .field__center h1, .field__center p { pointer-events: auto; }
  .field__center h1 {
    margin: 0; font-weight: 400; letter-spacing: -0.04em; line-height: 1.15;
    font-size: clamp(3.6rem, 2.88rem + 1.5vw, 4.8rem);
  }

  @keyframes drift-x {
    0%, 100% { translate: 0 0; }
    25% { translate: var(--ax, 12px) 0; }
    50% { translate: calc(var(--ax, 12px) * -0.6) 0; }
    75% { translate: calc(var(--ax, 12px) * 0.3) 0; }
  }
  @keyframes drift-y {
    0%, 100% { translate: 0 0; }
    25% { translate: 0 calc(var(--ay, 10px) * -0.5); }
    50% { translate: 0 var(--ay, 10px); }
    75% { translate: 0 calc(var(--ay, 10px) * -0.3); }
  }

  /* pay nothing while offscreen: JS toggles .is-asleep via IntersectionObserver */
  .field.is-asleep .field__card { animation-play-state: paused; }

  /* mandatory: no ambient motion for reduced-motion users */
  @media (prefers-reduced-motion: reduce) {
    .field__card { animation: none; }
    .field__card:hover { transition: none; }
    .field { cursor: default; }
  }
</style>

<script>
  // Pause the drift whenever the hero isn't on screen — zero cost when away.
  const field = document.getElementById('field');
  new IntersectionObserver(([e]) => {
    field.classList.toggle('is-asleep', !e.isIntersecting);
  }, { threshold: 0 }).observe(field);
</script>
```
