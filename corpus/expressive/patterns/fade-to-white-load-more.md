---
pattern: fade-to-white-load-more
from: thepudding
corpus: expressive
safety: production-safe
trigger: scroll-progress
tags: [pagination, overflow, navigation, motion]
---

## What it is
A truncated grid/list whose last rows **fade into the page background** under a CSS gradient mask, with a centered "load more" control seated in the fade. It signals "there's more below" and gives a soft, designed boundary instead of a hard cut — no infinite-scroll surprise, no abrupt edge.

## Why it works
The mask is a pure `linear-gradient(transparent → bg)` overlay, so it's free on the main thread and degrades to nothing — there is no animation to disable, which makes it trivially reduced-motion-safe. It works because the eye reads a fade as "continues, but paused," which is exactly the right affordance for a manual pagination button: it invites the click without committing to auto-load. Transferable to any place you deliberately show *part* of a collection — search results, "recent" sections, comment threads. The button uses `aria-expanded` + a real focus ring so it stays a proper control, not decoration.

## Reference implementation
```html
<style>
  .more-wrap { position: relative; }

  /* the collection, clipped to a preview height while collapsed */
  .more-wrap[data-collapsed="true"] .more-list {
    max-height: 60vh;
    overflow: hidden;
  }

  /* gradient mask + button sit over the foot of the list */
  .more-fade {
    position: absolute; inset-inline: 0; bottom: 0;
    height: clamp(120px, 20vh, 240px);
    display: flex; align-items: flex-end; justify-content: center;
    padding-bottom: var(--space-24, 24px);
    pointer-events: none;          /* let the list scroll/click through… */
    background: linear-gradient(
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.8) 30%,
      var(--bg, #fff) 50%);
  }
  .more-wrap[data-collapsed="false"] .more-fade { background: none; }

  .more-btn {
    pointer-events: auto;          /* …but the button stays clickable */
    font-family: var(--font-mono, "Atlas Typewriter", monospace);
    text-transform: uppercase; letter-spacing: 1px;
    background: var(--fg, #262626); color: var(--bg, #fff);
    border: 0; border-radius: var(--radius-pill, 28px);
    padding: var(--space-12, 12px) var(--space-24, 24px);
    cursor: pointer;
    transition: opacity .25s ease;  /* token: --dur-base / ease */
  }
  .more-btn:hover { opacity: .85; }
  .more-btn:focus-visible { outline: 2px solid var(--accent, #3ae660); outline-offset: 2px; }

  /* reduced motion: nothing to do — the mask is static and the reveal is instant.
     Disable the one transition for users who want zero movement. */
  @media (prefers-reduced-motion: reduce) {
    .more-btn { transition: none; }
  }
</style>

<div class="more-wrap" data-collapsed="true">
  <div class="more-list"><!-- grid/list of items --></div>
  <div class="more-fade">
    <button class="more-btn" aria-expanded="false">Load more stories</button>
  </div>
</div>

<script>
  // Framework-neutral: flip the collapsed state (or fetch + append) on click.
  document.querySelectorAll('.more-wrap').forEach(wrap => {
    const btn = wrap.querySelector('.more-btn');
    btn?.addEventListener('click', () => {
      const open = wrap.dataset.collapsed === 'false';
      wrap.dataset.collapsed = open ? 'true' : 'false';
      btn.setAttribute('aria-expanded', String(!open));
      // or: fetch next page → append to .more-list, keep collapsed=false
    });
  });
</script>
```
Notes: match the gradient's solid stop to the actual page background (here `--bg`); on a dark theme swap to `rgba(25,25,25,…)`. The mask is decoration only — `pointer-events:none` on the layer, `auto` on the button — so it never blocks scrolling. No scroll listeners, no rAF; the only "motion" is an optional hover fade that reduced-motion turns off.
