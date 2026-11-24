---
pattern: sticky-product-subnav
from: apple-airpods-pro
corpus: expressive
safety: production-safe
trigger: scroll-progress
tags: [navigation, product-marketing, motion]
---

## What it is
A product-scoped secondary navigation bar — product name on the left, in-page section links in the middle, a **persistent Buy pill (with price)** on the right — that sits inline at the top of the page and **pins to the viewport** once the hero scrolls under the global site nav. Apple runs this on every product page (here: "AirPods Pro 3 · Overview · Hearing Health · Tech Specs · Compare · Buy"). The primary conversion action is always one glance away without a nagging floating modal.

## Why it works
It gives a long marketing page a persistent table-of-contents *and* keeps the CTA on screen, so scroll depth never costs you the buy action. Pinning is done with `position: sticky` (no scroll-handler jank) and an IntersectionObserver only toggles a *style* (shadow/blur) when it detaches — the layout itself never thrashes. Because the accent is reserved for the Buy pill and the active-link marker, the bar reads as "act here" the moment it appears.

## Reference implementation
```html
<nav class="subnav" aria-label="AirPods Pro">
  <span class="subnav__title">AirPods Pro 3</span>
  <ul class="subnav__links">
    <li><a href="#overview" class="is-active">Overview</a></li>
    <li><a href="#hearing">Hearing Health</a></li>
    <li><a href="#specs">Tech Specs</a></li>
    <li><a href="#compare">Compare</a></li>
  </ul>
  <a href="#buy" class="subnav__buy">Buy <span class="subnav__price">$249</span></a>
</nav>

<style>
  .subnav {
    position: sticky;
    top: 0;                        /* pins under a fixed global nav; use top: var(--globalnav-h) if present */
    z-index: 20;
    display: flex;
    align-items: center;
    gap: var(--space-6, 2rem);
    padding-inline: var(--space-6, 2rem);
    min-height: 52px;
    background: color-mix(in srgb, var(--color-bg, #ffffff) 82%, transparent);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    backdrop-filter: saturate(180%) blur(20px);
    /* hairline appears only once the bar detaches (see .is-stuck) */
    box-shadow: 0 0 0 rgba(0,0,0,0);
    transition: box-shadow var(--duration-base, 200ms) var(--ease-standard, cubic-bezier(0.4,0,0.6,1));
  }
  .subnav.is-stuck {
    box-shadow: inset 0 -1px 0 var(--color-hairline, rgba(0,0,0,0.08));
  }
  .subnav__title { font-weight: var(--weight-semibold, 600); font-size: var(--text-md, 1.0625rem); letter-spacing: -0.01em; }
  /* On narrow viewports the link row scrolls inside itself (Apple's mobile behavior)
     instead of overflowing the page. */
  .subnav__links {
    display: flex; gap: var(--space-5, 1.5rem); margin-inline-start: auto; list-style: none;
    min-width: 0; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch;
  }
  .subnav__links::-webkit-scrollbar { display: none; }
  .subnav__links a { white-space: nowrap; }
  .subnav__links a { color: var(--color-muted, #6e6e73); font-size: var(--text-sm, 0.875rem); text-decoration: none; }
  .subnav__links a.is-active { color: var(--color-fg, #1d1d1f); }
  .subnav__buy {
    display: inline-flex; align-items: baseline; gap: 0.4em;
    padding: 0.4em 1em;
    border-radius: var(--radius-full, 980px);        /* Apple pill */
    background: var(--color-accent, #0071e3);
    color: var(--color-accent-fg, #fff);
    font-size: var(--text-sm, 0.875rem); text-decoration: none;
  }
  .subnav__price { opacity: 0.8; }
  /* Focus ring reserved for keyboard nav (Apple blue) */
  .subnav a:focus-visible { outline: 2px solid var(--color-focus, #0071e3); outline-offset: 3px; }
</style>

<script>
  // Toggle the detached (.is-stuck) style with a sentinel — no scroll listener.
  const bar = document.querySelector('.subnav');
  const sentinel = document.createElement('div');
  bar.before(sentinel);
  new IntersectionObserver(
    ([e]) => bar.classList.toggle('is-stuck', !e.isIntersecting),
    { rootMargin: '-53px 0px 0px 0px', threshold: 0 }   // Apple's observed offset
  ).observe(sentinel);
</script>
```

Reduced-motion: nothing here animates position or transform — only a shadow cross-fades, which is safe. If you add an entrance slide for the bar, wrap it in `@media (prefers-reduced-motion: reduce)` and jump straight to the pinned state.
