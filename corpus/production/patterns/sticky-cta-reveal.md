---
pattern: sticky-cta-reveal
from: emergent
corpus: production
safety: production-safe
trigger: in-view
tags: [navigation, cta, motion]
---

## What it is
A compact, fixed conversion prompt — a `Get Started` pill (optionally with condensed nav links) — that **fades in and rises** into view only once the hero (with its full sign-up panel) scrolls out of view. While the hero is on screen the sticky pill is hidden; the moment the primary CTA leaves, this one takes over so the door is always one click away without cluttering the first screen.

## Why it works
It ties a persistent CTA to *need*, not to scroll position math: an `IntersectionObserver` watches the hero, and the sticky prompt is shown exactly when the hero is no longer visible. The reveal animates only `opacity` and `transform` (compositor-only, no layout), and the resting/end state is the DOM default so keyboard, no-JS, and reduced-motion users still get a working, visible CTA. Cheaper and more robust than a scroll-event handler recomputing offsets every frame.

## Reference implementation
```html
<header class="hero" id="hero"><!-- big auth panel / primary CTA lives here --></header>

<div class="sticky-cta" data-revealed>
  <nav class="sticky-cta__links"><a href="#features">Features</a><a href="#pricing">Pricing</a></nav>
  <a class="sticky-cta__btn" href="/start">Get Started</a>
</div>

<style>
  .sticky-cta {
    position: fixed; top: var(--space-4, 1rem); left: 50%;
    display: flex; align-items: center; gap: var(--space-4, 1rem);
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    background: #fff; border: 1px solid var(--color-border, #e5e3e1);
    border-radius: var(--radius-full, 9999px); box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    z-index: 50;

    /* resting = VISIBLE end state (a11y / no-JS default) */
    opacity: 1; transform: translate(-50%, 0);
    transition: opacity var(--duration-base, 200ms) var(--ease-entrance, cubic-bezier(0,0,0.2,1)),
                transform var(--duration-base, 200ms) var(--ease-entrance, cubic-bezier(0,0,0.2,1));
  }
  /* hidden while the hero is still in view */
  .sticky-cta[data-revealed="false"] {
    opacity: 0; transform: translate(-50%, -12px); pointer-events: none;
  }
  .sticky-cta__links { display: flex; gap: var(--space-4, 1rem); font: 500 0.875rem/1 var(--font-sans); }
  .sticky-cta__btn {
    padding: var(--space-2, 0.5rem) var(--space-5, 1.5rem); border-radius: var(--radius-full, 9999px);
    background: var(--color-fg, #0e0e0e); color: #fff; font: 500 0.875rem/1 var(--font-sans); text-decoration: none;
    transition: opacity var(--duration-fast, 150ms) var(--ease-standard, cubic-bezier(0.4,0,0.2,1));
  }
  .sticky-cta__btn:hover { opacity: 0.8; }

  /* reduced motion: keep the state toggle, drop the movement */
  @media (prefers-reduced-motion: reduce) {
    .sticky-cta, .sticky-cta[data-revealed="false"] { transition: none; transform: translate(-50%, 0); }
  }
</style>

<script>
  const bar = document.querySelector('.sticky-cta');
  const hero = document.getElementById('hero');
  // start hidden ONLY if JS runs — no-JS users keep the visible default
  bar.setAttribute('data-revealed', 'false');
  new IntersectionObserver(([e]) => {
    bar.setAttribute('data-revealed', e.isIntersecting ? 'false' : 'true');
  }, { threshold: 0.1, rootMargin: '100px' }).observe(hero);
</script>
```
