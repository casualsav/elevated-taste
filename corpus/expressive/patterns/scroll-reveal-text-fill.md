---
pattern: scroll-reveal-text-fill
from: apple-airpods-pro
corpus: expressive
safety: production-safe
trigger: in-view
tags: [feature-section, editorial, motion]
---

## What it is
A block of copy (an eyebrow, a display headline, or a paragraph) is painted in a **muted gray at rest** and animates to **full ink** the moment it scrolls into view — as if the words "turn on" exactly when the reader reaches them. Apple uses it across the AirPods Pro editorial sections (headline + body both fill in as the section enters). It's the calm, readerly alternative to a fade-in-from-below: the text is always in place, only its *color* resolves.

## Why it works
The reveal is bound to reading position, so it directs attention down the page without moving layout — no reflow, no motion-sickness axis. Because it only drives `color` (optionally `opacity`), it's near-free on the main thread and degrades perfectly: the muted rest state only applies once the script has marked the page (`.js-reveal` on `<html>`), so with JS off or reduced-motion on the text simply renders at its final ink color. The observer's bottom margin stays at 0, so copy at the very end of the page still fills once it is on screen. Splitting into per-line spans lets the fill cascade word-by-word for extra craft, but a single element already reads well.

## Reference implementation
```html
<section class="reveal-section">
  <p class="reveal" style="--i:0">Hearing Health</p>
  <h2 class="reveal reveal--display" style="--i:1">Check, aid, and help protect your hearing.</h2>
  <p class="reveal reveal--body" style="--i:2">
    Take a scientifically validated Hearing Test in a broader range of
    background conditions, with improved voice clarity and Conversation Boost.
  </p>
</section>

<style>
  .reveal {
    color: var(--color-fg, #1d1d1f); /* no-JS / reduced-motion: final ink */
  }
  .js-reveal .reveal {
    /* rest state, only once the observer is running: muted, waiting to resolve to ink */
    color: var(--color-muted, #6e6e73);
    transition: color var(--duration-slow, 320ms) var(--ease-standard, cubic-bezier(0.4,0,0.6,1));
    transition-delay: calc(var(--i, 0) * 80ms); /* house stagger step */
  }
  .js-reveal .reveal.is-in {
    color: var(--color-fg, #1d1d1f);
  }
  .reveal--display {
    font-size: var(--text-display, 6rem);
    line-height: var(--leading-tight, 1.05);
    letter-spacing: -0.015em;      /* large type tightens (see tokens) */
    font-weight: var(--weight-semibold, 600);
  }
  .reveal--body {
    font-size: var(--text-md, 1.0625rem);
    line-height: var(--leading-normal, 1.47);
    letter-spacing: -0.022em;
    max-width: 34ch;               /* narrow measure beside full-bleed art */
  }

  /* Mandatory: reduced-motion → no animation, straight to final ink. The script never adds
     .js-reveal when reduced-motion is on at load; this covers a user who switches it on
     mid-session, after the class is already set. */
  @media (prefers-reduced-motion: reduce) {
    .js-reveal .reveal { transition: none; color: var(--color-fg, #1d1d1f); }
  }
</style>

<!-- Inline, at the end of <body> (not deferred or async): it must mark the page before first
     paint, or the text renders in ink and then flashes to muted. -->
<script>
  // Cheap, transform/opacity-free reveal via IntersectionObserver.
  // rootMargin trims the top so text fills as it clears the nav (Apple uses ~-53px); the bottom
  // margin stays 0 so blocks at the end of the page, which can never scroll higher, still fill.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  }, { rootMargin: '-53px 0px 0px 0px', threshold: 0.01 });

  // Respect reduced-motion by skipping the observer entirely: the page is never marked, so the
  // text stays at final ink. Otherwise mark the page, which switches on the muted rest state.
  const prm = matchMedia('(prefers-reduced-motion: reduce)');
  if (!prm.matches) {
    document.documentElement.classList.add('js-reveal');
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }
</script>
```
