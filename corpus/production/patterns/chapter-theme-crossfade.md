---
pattern: chapter-theme-crossfade
from: grida
corpus: production
safety: production-safe
trigger: in-view
tags: [section, scroll-theater, motion]
---

## What it is
A transition section that crossfades from a light "chapter" to a dark one (or vice-versa) as the next act of a long page scrolls into view — so the page changes register (ideation → world-building → ownership) without a theme toggle or a navigation. On Grida a sentinel block animates its background `#fafafa → #111` and fades its own copy out as the dark creative chapter arrives beneath it. The dark band is *punctuation*, not a global theme (`supportsDark:false`).

## Why it works
A single monochrome type system reads as one calm voice; swapping only the chapter background gives the long scroll acts and gravity exactly where the pitch turns, while keeping everything else flat and fast. Because only `background` and `opacity` animate — both compositor-cheap — it never jank-costs layout. Driving it from an IntersectionObserver that toggles a class (rather than a scroll handler mapping pixels) keeps it robust and trivially reduced-motion-safe: under `reduce`, the end chapter simply appears.

## Reference implementation
```html
<section class="chapter chapter--light" data-chapter>
  <div class="chapter__inner">
    <h2>Follow an idea.</h2>
    <p>Make room to explore, arrange, and design.</p>
  </div>
</section>
<!-- when this enters view, the page flips to its dark act -->
<section class="chapter chapter--dark is-next" data-chapter-next>
  <div class="chapter__inner"><h2>Worlds start here.</h2></div>
</section>

<style>
  .chapter {
    padding-block: var(--space-10);
    /* crossfade only cheap properties */
    transition: background-color var(--duration-slow) var(--ease-standard),
                color var(--duration-slow) var(--ease-standard);
  }
  .chapter--light { background: var(--color-bg);   color: var(--color-fg); }
  .chapter--dark  { background: var(--color-surface-dark, #111111);
                    color: var(--color-fg-on-dark); }

  /* the sentinel fades its own content out as the next act takes over */
  .chapter__inner { transition: opacity var(--duration-base) var(--ease-exit); }
  .chapter.is-leaving .chapter__inner { opacity: 0; }

  @media (prefers-reduced-motion: reduce) {
    .chapter, .chapter__inner { transition: none; }
    .chapter.is-leaving .chapter__inner { opacity: 1; }
  }
</style>

<script>
  // Toggle the "leaving" state when the next chapter crosses into view.
  const next = document.querySelector('[data-chapter-next]');
  const leaving = document.querySelector('[data-chapter]');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      leaving.classList.toggle('is-leaving', e.isIntersecting);
    }
  }, { threshold: 0.25, rootMargin: '-10% 0px' }); // matches the exemplar's [0,0.25]
  io.observe(next);
</script>
```
