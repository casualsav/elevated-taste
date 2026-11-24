---
pattern: scroll-reveal-panel
from: house
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, scroll, reveal, pin, sticky, transition, closing-cta]
---

## What it is
A closing transition where a foreground panel slides straight up and off the top of the viewport to uncover a second, full-screen panel that has been pinned behind it the whole time. Both panels are sticky at `top: 0`; the lower (revealed) panel sits underneath, and the upper (cover) panel is pulled upward by scroll progress, so the page reads as one surface peeling away to expose the next. It is a clean way to hand off between a recap and a final call-to-action without a hard section break.

## Why it works
Two stacked sticky layers turn ordinary vertical scroll into a wipe: the lower panel is already painted and waiting, so uncovering it costs nothing, and the upper panel only translates on the Y axis (a compositor-friendly `transform`), never reflowing. Driving it from a tall "stage" wrapper means scroll progress maps linearly to how much of the cover has lifted, and the motion is fully reversible: scroll back up and the cover slides home. The driver is an IntersectionObserver-gated `requestAnimationFrame` loop reading the stage's rect, so there is no scroll-event listener (the corpus bans those for the continuous reflows they cause); the rAF only runs while the stage is on screen. Where the platform supports it, a CSS scroll-driven animation (`animation-timeline: scroll()`) expresses the same lift declaratively and runs entirely off the main thread, so feature-detect and prefer it. Either way, animate only `transform` (and a late `opacity` fade), keeping the hot path on the GPU.

## Reference implementation
```html
<style>
  /* The stage is taller than the viewport; its extra height is the scroll budget
     over which the cover panel lifts away. */
  .reveal-stage { position: relative; height: 230dvh; }

  /* Two pinned layers at the same top. The cover is pulled up over the stage. */
  .reveal-cover,
  .reveal-behind {
    position: sticky; top: 0; height: 100dvh;
    display: grid; place-items: center; padding: var(--space-6);
  }
  .reveal-behind { z-index: 0; background: var(--color-surface-inverse); color: var(--color-fg-inverse); }
  .reveal-cover  { z-index: 2; margin-top: -100dvh; background: var(--color-bg); color: var(--color-fg);
                   will-change: transform, opacity; }

  /* Preferred path: CSS scroll-driven animation, entirely off the main thread.
     Applied only where animation-timeline is supported (feature query below);
     the JS fallback stays inert in that case. */
  @supports (animation-timeline: scroll()) {
    .reveal-cover {
      animation: panel-lift linear both;
      animation-timeline: scroll(root);
    }
  }
  @keyframes panel-lift {
    /* hold the cover in place over the first stretch, then lift + fade it away */
    0%, 60% { transform: translateY(0); opacity: 1; }
    100%    { transform: translateY(-100dvh); opacity: 0; }
  }

  /* No motion: drop the lift entirely and stack the two panels normally, so the
     revealed page renders statically and the cover stays put. */
  @media (prefers-reduced-motion: reduce) {
    .reveal-stage  { height: auto; }
    .reveal-cover  { animation: none; transform: none; margin-top: 0; }
    .reveal-behind { position: static; height: auto; min-height: 60dvh; }
  }
</style>

<section class="reveal-stage" aria-label="Closing">
  <div class="reveal-behind">
    <div><!-- the page being uncovered: final CTA, etc. --></div>
  </div>
  <div class="reveal-cover">
    <div><!-- the recap that lifts away --></div>
  </div>
</section>

<script>
  // JS fallback ONLY where CSS scroll-driven timelines are unsupported.
  // IntersectionObserver-gated rAF over the tall stage; no scroll listener.
  const noMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasTimeline = CSS.supports && CSS.supports('animation-timeline', 'scroll()');

  if (!noMotion && !hasTimeline) {
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const HOLD = 0.6;            // matches the keyframe: lift starts after this progress
    const FADE_START = 0.85;     // begin the late opacity fade near the end

    document.querySelectorAll('.reveal-stage').forEach((stage) => {
      const cover = stage.querySelector('.reveal-cover');
      if (!cover) return;
      let running = false;

      const tick = () => {
        const r = stage.getBoundingClientRect();
        // progress 0..1 as the pinned stage scrolls through its extra height
        const p = clamp(-r.top / Math.max(1, r.height - innerHeight));
        const lift = easeOut(clamp((p - HOLD) / (1 - HOLD)));
        cover.style.transform = 'translateY(' + (-lift * 100).toFixed(2) + 'dvh)';
        cover.style.opacity = (1 - clamp((p - FADE_START) / (1 - FADE_START))).toFixed(2);
        if (running) requestAnimationFrame(tick);
      };

      // Only run the loop while the stage is on screen.
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running) { running = true; requestAnimationFrame(tick); }
        else if (!e.isIntersecting) { running = false; }
      }, { threshold: 0 }).observe(stage);
    });
  }
</script>
```
