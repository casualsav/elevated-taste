---
pattern: scroll-scrub-word-brighten
from: haptic
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, scroll, type, reveal, read-along]
---

## What it is
A short paragraph or statement whose words rest dim (`opacity: 0.2`) and *brighten to full* one after another as the block scrolls up through the viewport — a "read-along" highlight tied to scroll progress, not a one-shot in-view fade. Haptic uses it on its intro line ("We design brands, products, and digital experiences…"), driving opacity per-word via dense scrub IntersectionObservers (threshold arrays `[0, 0.01, … 0.99]`). Unlike `scroll-blur-word-reveal`, the words stay legible the whole time (never hidden, never blurred) — the effect only *paces* reading, so it's safe on real copy.

## Why it works
Mapping each word's opacity to how far the paragraph has traveled through the viewport makes the sentence reveal in reading order at exactly reading speed — the motion mirrors the act of reading rather than decorating it. It stays cheap because it animates **opacity only** (GPU-compositable, no reflow, no re-raster the way `filter: blur()` would cost). The honest resting state is full-opacity readable text shipped in the DOM, so no-JS and reduced-motion both get the real copy. Keep it to one or two blocks — the continuous scroll-linked timeline is the only non-trivial cost, so don't scatter it across a page.

## Reference implementation
```html
<style>
  .read-along { max-width: 38ch; font-size: var(--text-xl);
    line-height: var(--leading-snug); letter-spacing: var(--tracking-heading);
    color: var(--color-fg); }
  /* RESTING STATE in the DOM: full opacity, readable with no JS. */
  .read-along .w { opacity: 1; }

  /* Preferred path: CSS scroll-driven animation — no JS, no scroll handler.
     Each word gets a view()-timeline slice via its --i / --n index so it
     brightens in sequence as the block crosses the viewport. */
  @supports (animation-timeline: view()) {
    .read-along.armed .w {
      opacity: 0.2;
      animation: word-brighten linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 55%;
      /* stagger each word across the shared range */
      animation-delay: calc(var(--i) / var(--n) * -1s);
      animation-duration: 1s; /* consumed by the timeline, not wall-clock */
    }
  }
  @keyframes word-brighten { to { opacity: 1; } }

  /* Reduced motion (and no scroll-timeline support): words stay full-opacity. */
  @media (prefers-reduced-motion: reduce) {
    .read-along .w { opacity: 1 !important; animation: none !important; }
  }
</style>

<p class="read-along" style="--n:10">
  <span class="w" style="--i:0">We</span> <span class="w" style="--i:1">design</span>
  <span class="w" style="--i:2">brands,</span> <span class="w" style="--i:3">products,</span>
  <span class="w" style="--i:4">and</span> <span class="w" style="--i:5">digital</span>
  <span class="w" style="--i:6">experiences</span> <span class="w" style="--i:7">that</span>
  <span class="w" style="--i:8">bring</span> <span class="w" style="--i:9">clarity.</span>
</p>

<script>
  // Arm only when motion is allowed AND scroll-driven animations exist.
  // JS fallback for browsers without animation-timeline: a single scrubbing
  // IntersectionObserver maps block progress -> number of lit words.
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsTimeline = CSS.supports('animation-timeline: view()');
  if (!reduce && supportsTimeline) {
    document.querySelectorAll('.read-along').forEach(el => el.classList.add('armed'));
  } else if (!reduce) {
    document.querySelectorAll('.read-along').forEach((p) => {
      const words = [...p.querySelectorAll('.w')];
      words.forEach(w => { w.style.opacity = '0.2';
        w.style.transition = 'opacity var(--duration-base) var(--ease-standard)'; });
      const io = new IntersectionObserver(([e]) => {
        // progress 0..1 as the block travels bottom->top of the viewport
        const r = e.boundingClientRect, vh = innerHeight;
        const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        const lit = Math.round(progress * words.length);
        words.forEach((w, i) => { w.style.opacity = i < lit ? '1' : '0.2'; });
      }, { threshold: Array.from({length: 21}, (_, i) => i / 20) });
      io.observe(p);
    });
  }
</script>
```
