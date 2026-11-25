---
pattern: scroll-exit-dissolve
from: copilot
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, scroll, exit, opacity, scale, hero, decorative]
---

## What it is
A layer of decorative foreground props — Copilot's floating 3D category capsules around the hero headline — that **scales up and fades to zero as its section scrolls out of view**, so the props appear to rush past the camera and clear the stage before the next section arrives. It's the mirror image of a grow-in reveal: instead of settling *into* place on entry, the objects dissolve *out* of place on exit. Reserve it for ornamental layers (props, glows, oversized marks), never for content the user needs to read.

## Why it works
Tying scale + opacity to the *exit* portion of a section's scroll progress turns a hard section boundary into a soft hand-off: the decoration removes itself instead of being clipped by the next block sliding over it. Pushing scale past 1 (≈1.2→3×) while opacity drops to 0 makes the props read as "moving toward the viewer and out of frame," which gives the flat page a shallow sense of depth for free. Driving it with the **CSS scroll-driven animation** API (`animation-timeline: view()`, `animation-range: exit`) runs it on the compositor with no scroll handler, and because the resting (in-view) state is full-opacity at scale 1, any browser without the API — or any reduced-motion user — simply sees the static hero. Only `transform` and `opacity` animate, so it never touches layout.

**Safety:** production-safe — *as a technique* — because the end state (gone) only happens once the section is already leaving the viewport, so nothing important is ever hidden mid-read. The hazards are (1) large-scale zoom can trigger motion sickness, so always honor `prefers-reduced-motion` (the source site does not — fix that here), and (2) only ever apply it to decorative elements with `aria-hidden`, never to text or controls.

## Reference implementation
```html
<style>
  .hero { position: relative; isolation: isolate; }

  /* Decorative prop layer — purely ornamental, hidden from AT. */
  .hero__props { position: absolute; inset: 0; z-index: -1; pointer-events: none; }

  .hero__prop {
    will-change: transform, opacity;
    /* Primary path: scroll-driven, compositor-only, no JS. Resting state
       (in view) is scale 1 / opacity 1 — the correct static composition. */
    animation: prop-dissolve linear both;
    animation-timeline: view();
    animation-range: exit 0% exit 100%;   /* runs only as the hero leaves */
  }
  @keyframes prop-dissolve {
    from { transform: scale(1);   opacity: 1; }
    to   { transform: scale(2.6); opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero__prop { animation: none; transform: none; opacity: 1; }
  }
</style>

<section class="hero">
  <div class="hero__props" aria-hidden="true">
    <span class="hero__prop" style="--x:12%; --y:30%">🏠 Home</span>
    <span class="hero__prop" style="--x:70%; --y:20%">🛒 Groceries</span>
    <span class="hero__prop" style="--x:80%; --y:60%">🧸 Baby</span>
    <!-- …position each prop via its own absolute offset… -->
  </div>
  <h1>Your headline, beautifully large.</h1>
</section>

<script>
  // Fallback ONLY where animation-timeline is unsupported. No scroll listener:
  // an IntersectionObserver gates a rAF loop that runs solely while the hero is
  // on screen, mapping the section's exit progress to scale + opacity.
  const supportsTimeline = CSS.supports('animation-timeline: view()');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsTimeline && !reduce) {
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const MIN_S = 1, MAX_S = 2.6;
    document.querySelectorAll('.hero').forEach((hero) => {
      const props = hero.querySelectorAll('.hero__prop');
      let running = false;
      const tick = () => {
        const r = hero.getBoundingClientRect();
        // 0 while fully in view, → 1 as the hero's bottom passes the top edge
        const p = clamp(-r.top / r.height);
        const s = (MIN_S + (MAX_S - MIN_S) * p).toFixed(3);
        props.forEach((el) => {
          el.style.transform = 'scale(' + s + ')';
          el.style.opacity = (1 - p).toFixed(3);
        });
        if (running) requestAnimationFrame(tick);
      };
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running) { running = true; requestAnimationFrame(tick); }
        else if (!e.isIntersecting) running = false;
      }, { threshold: 0 }).observe(hero);
    });
  }
</script>
```
