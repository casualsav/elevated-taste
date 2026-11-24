---
pattern: in-view-autoplay-media-card
from: v0
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, gallery, ecommerce, interactive-showcase]
---

## What it is
A bordered card in a grid whose embedded media (a looping product micro-demo video or CSS animation) plays **only while the card is in or near the viewport** and pauses when it scrolls away. A static poster covers the media until it's ready, and an `IntersectionObserver` with a generous `rootMargin` pre-warms playback just before the card enters. Under `prefers-reduced-motion`, the media never autoplays — the poster stays.

## Why it works
A gallery of animated thumbnails *feels* alive, but autoplaying all of them at once burns the main thread, decodes dozens of videos, and drains battery. Gating play on visibility means only the 1–3 visible cards ever run — wall-clock cost scales with what the user can see, not with grid size. The `rootMargin` (the site uses `200px`) starts playback a moment before entry so it's already running when seen, with no pop-in. This is the production-grade alternative to `autoplay loop` on every tile; reuse for template marketplaces, case-study grids, product galleries, or any wall of motion thumbnails.

## Reference implementation
```html
<article class="media-card">
  <div class="media-card__frame">
    <video class="media-card__video" muted loop playsinline preload="none"
           poster="thumb.jpg" data-autoplay-inview>
      <source src="demo.webm" type="video/webm" />
    </video>
  </div>
  <footer class="media-card__meta">
    <img class="media-card__avatar" src="avatar.jpg" alt="" width="20" height="20" />
    <span class="media-card__title">Image Generation Playground</span>
    <span class="media-card__stat" style="font-variant-numeric: tabular-nums;">6.1K · ♥ 682</span>
  </footer>
</article>

<style>
  .media-card__frame {
    border: 1px solid var(--color-border);     /* hairline structure, not shadow */
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 16 / 10;
    background: #000;                           /* dark content tile on a near-white page */
  }
  .media-card__video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .media-card__meta {
    display: flex; align-items: center; gap: 6px;
    margin-top: 8px; font-size: 0.8125rem; color: var(--color-fg);
  }
  .media-card__stat { margin-left: auto; color: var(--color-muted); }
  .media-card__avatar { border-radius: 9999px; }
</style>

<script>
  // Cheap by construction: one observer, transform/play-state only, no scroll handler.
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vids = document.querySelectorAll('[data-autoplay-inview]');

  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const v = e.target;
        if (e.isIntersecting) { v.play?.().catch(() => {}); }
        else { v.pause?.(); }
      }
    }, { threshold: 0.15, rootMargin: '200px' });   // pre-warm 200px before entry
    vids.forEach((v) => io.observe(v));
  }
  // Reduced motion (or no IO support): leave the poster, never autoplay.
</script>
```

```css
/* Belt-and-suspenders: if a CSS-animated demo is used instead of <video>, halt it too. */
@media (prefers-reduced-motion: reduce) {
  .media-card__video { animation: none !important; }
}
```
Notes: keep videos `muted playsinline preload="none"` so mobile browsers allow programmatic play and don't fetch bytes until needed. For a CSS-animation demo instead of video, toggle a `.is-playing` class in the same observer and drive the keyframes off it, keeping animated properties to `transform`/`opacity`.
