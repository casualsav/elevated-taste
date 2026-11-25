---
pattern: image-settle-scale-reveal
from: rhode
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, reveal, image, scroll]
---

## What it is
As a media block (or any element) enters the viewport it fades `opacity 0→1` while easing from a hair larger to natural size — `scale(1.03) → scale(1)`. Instead of rising up like a fade-rise, the content appears to *settle* and lock into place. Grouped siblings share the effect offset by a small fixed stagger (~150ms), so a row arrives as a composed sequence. It's a softer, calmer reveal — well suited to photography-led commerce and editorial pages.

## Why it works
A subtle inward zoom reads as "arriving and resolving," which feels more premium and less busy than vertical travel. It animates **only `opacity` and `transform`**, so it stays on the compositor's fast path — no layout, no paint thrash — and runs as a cheap one-shot when the element first crosses into view. Gating on `IntersectionObserver` (not a scroll handler) means nothing runs off-screen and the cost is bounded. The stagger replaces a single jarring snap with a perceived rhythm. Keeping the start scale tiny (≤1.04) avoids any motion-sickness risk and keeps text crisp.

## Reference implementation
```html
<style>
  .settle {
    opacity: 0;
    transform: scale(1.03);
    transition: opacity var(--duration-slow) var(--ease-entrance),
                transform var(--duration-slow) var(--ease-entrance);
    transition-delay: var(--settle-delay, 0ms);   /* set per item for stagger */
    will-change: opacity, transform;
  }
  .settle.is-in { opacity: 1; transform: scale(1); }

  /* media variant: clip the overscale so the 1.03 frame never bleeds */
  .settle--media { overflow: hidden; }
  .settle--media > img { display: block; width: 100%; }

  @media (prefers-reduced-motion: reduce) {
    .settle {
      opacity: 1; transform: none;
      transition: none; transition-delay: 0ms;
    }
  }
</style>

<div class="settle-group">
  <figure class="settle settle--media"><img src="campaign-1.jpg" alt="…"></figure>
  <figure class="settle settle--media"><img src="campaign-2.jpg" alt="…"></figure>
  <figure class="settle settle--media"><img src="campaign-3.jpg" alt="…"></figure>
</div>

<script>
  // assign a per-item stagger delay, then reveal on first intersection
  const STAGGER = 150; // ms — matches the exemplar's stagger
  document.querySelectorAll('.settle-group').forEach((group) => {
    [...group.children].forEach((el, i) =>
      el.style.setProperty('--settle-delay', `${i * STAGGER}ms`));
  });

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }, { threshold: 0.25 });
  document.querySelectorAll('.settle').forEach((el) => io.observe(el));
</script>
```

*Tokens:* `--duration-slow` ≈ 500–700ms, `--ease-out` ≈ `cubic-bezier(0.19,1,0.22,1)` (expo-out) from `tokens/rhode.json`. Prefer this `IntersectionObserver` + CSS-transition recipe over a scroll-event/GSAP handler for the one-shot reveal; reserve a scroll library only if you need continuous scroll-progress linkage.
