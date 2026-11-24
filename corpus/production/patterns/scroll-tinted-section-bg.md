---
pattern: scroll-tinted-section-bg
from: land-book
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, color, background, scroll, feature-section, brand-experience]
---

## What it is
A full-width section whose background **crossfades from the page base to a warm tint as it scrolls through the viewport**, then the next block hands off to a contrasting color/photo — so a long page reads as warm-then-cool "chapters" without any hard dividers. Solidroad warms a white block to peach (`#ffffff → #fdecd8`) on scroll-progress (captured on `framer-wchy1`) before flipping to a dark-green photographic section. It's the ambient-progress cousin of `scroll-linked-recolor` (which recolors text) and `notched-section-transition` (which cuts a hard seam).

## Why it works
Background is the largest surface on screen, so a slow tint shift is felt more than seen — it gives a sense of motion and place while the reader scrolls, doing the wayfinding job of a divider with none of the visual noise. Tying it to *scroll position* (not a one-shot reveal) means the warmth tracks the reader continuously. It's cheap **if you animate a color token, not an image**, and it degrades to a flat tint for reduced-motion or no-JS. Keep the two colors close in lightness so body text contrast holds at every point in the fade.

## Reference implementation
```html
<style>
  .tinted {
    /* exemplar maps: base -> warm tint; keep both legible for fg text */
    --tint-from: var(--color-surface);   /* page base */
    --tint-to: #fdecd8;                   /* warm chapter tint */
    background-color: var(--tint-from);
    color: var(--color-fg);
    padding-block: var(--space-9);
  }

  /* Preferred: CSS scroll-driven animation — no JS, runs off the main thread */
  @supports (animation-timeline: view()) {
    @keyframes warm-bg {
      to { background-color: var(--tint-to); }
    }
    .tinted {
      animation: warm-bg linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 60%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .tinted { animation: none; background-color: var(--tint-to); } /* land on end state */
  }
</style>

<section class="tinted">
  <!-- section content; text uses var(--color-fg) which clears contrast on both tints -->
</section>

<script>
  /* JS fallback for browsers without animation-timeline.
     rAF-throttled scroll read; animates only background-color (no layout). */
  if (!CSS.supports('animation-timeline: view()')
      && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const lerp = (a, b, t) => Math.round(a + (b - a) * t);
    const FROM = [255, 255, 255], TO = [253, 236, 216]; // tint-from -> tint-to
    const els = [...document.querySelectorAll('.tinted')];
    let ticking = false;
    const update = () => {
      ticking = false;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const vh = innerHeight;
        // 0 when section bottom enters, 1 when it's ~60% covered
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.9)));
        el.style.backgroundColor =
          `rgb(${lerp(FROM[0],TO[0],p)},${lerp(FROM[1],TO[1],p)},${lerp(FROM[2],TO[2],p)})`;
      }
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }
</script>
```
