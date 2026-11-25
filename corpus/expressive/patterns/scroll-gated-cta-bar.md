---
pattern: scroll-gated-cta-bar
from: masterclass
corpus: expressive
safety: production-safe
trigger: in-view
tags: [conversion, footer, navigation, motion, landing, pricing]
---

## What it is
A fixed bottom bar carrying the offer — price, a strip of social-proof avatars, and the single primary action — that does not exist when the page loads. It slides up and fades in the moment a sentinel element (the hero, or the fold) leaves the viewport, and slides back down when you scroll home. It is the honest alternative to an on-load modal or a nav that never lets go of its CTA.

## Why it works
The mechanism is **earned persistence**: the visitor's own scroll is the qualifying signal, so the offer arrives only after interest is demonstrated, and the first impression stays uncluttered. Three details do the real work.

First, **`visibility` is transitioned alongside `opacity` and `transform`.** A bar at `opacity: 0` is still focusable, still announced, still tab-order noise; transitioning `visibility` (which is discrete, so it flips at the end of the exit and the start of the entrance) removes it from the accessibility tree and the tab order at rest, for free. This is the difference between a correct implementation and the common one.

Second, **only `transform` and `opacity` animate** — no `bottom`, no `height`. The bar never triggers layout, so a permanently-composited element costs nothing on the main thread.

Third, **the trigger is an `IntersectionObserver` on a sentinel, not a scroll handler.** You are asking "has the fold passed?", which is a boolean about an element's position — exactly what IO answers, at zero scroll-frame cost. A `scroll` listener recomputing `getBoundingClientRect()` on every frame answers the same question 60× a second.

Reserve the bar for one action. The moment it holds two competing buttons it stops being an offer and becomes a second navigation, and it will eat the bottom edge of every mobile viewport for the life of the session.

## Reference implementation
```html
<!-- The sentinel sits at the bottom of the hero. When it leaves, the bar arrives. -->
<section class="hero">…</section>
<div id="cta-sentinel" aria-hidden="true"></div>

<div class="cta-bar" id="cta-bar">
  <div class="cta-bar__proof">
    <ul class="avatars" aria-hidden="true">
      <li><img src="/i1.jpg" alt=""></li>
      <li><img src="/i2.jpg" alt=""></li>
      <li><img src="/i3.jpg" alt=""></li>
    </ul>
    <p class="cta-bar__price">
      <strong>Starting at $10/month</strong>
      <span>(billed annually) for all classes</span>
    </p>
  </div>
  <a class="cta-bar__action" href="/join">Get started</a>
</div>

<style>
  .cta-bar {
    position: fixed;
    inset: auto 0 0 0;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-5);
    padding: var(--space-4) var(--space-6);
    background: var(--color-panel-translucent, rgba(25, 28, 33, 0.95));
    border-top: 1px solid var(--color-border-on-dark);
    color: var(--color-fg-on-dark);

    /* Resting state: off-screen, transparent, and out of the a11y tree. */
    opacity: 0;
    visibility: hidden;
    transform: translateY(100%);
    transition:
      transform var(--duration-slow) var(--ease-standard),
      opacity var(--duration-slow) var(--ease-standard),
      visibility var(--duration-slow) var(--ease-standard);
  }

  .cta-bar.is-active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .cta-bar__proof { display: flex; align-items: center; gap: var(--space-4); }

  .avatars { display: flex; margin: 0; padding: 0; list-style: none; }
  .avatars li { margin-inline-start: calc(var(--space-2) * -1); }
  .avatars li:first-child { margin-inline-start: 0; }
  .avatars img {
    display: block;
    inline-size: var(--space-6);
    block-size: var(--space-6);
    border-radius: var(--radius-full);
    border: 2px solid var(--color-panel-translucent, rgba(25, 28, 33, 0.95));
    object-fit: cover;
  }

  .cta-bar__price { margin: 0; font-size: var(--text-sm); line-height: var(--leading-snug); }
  .cta-bar__price strong { display: block; font-weight: var(--weight-semibold); color: var(--color-fg-on-dark); }
  .cta-bar__price span { color: var(--color-muted-on-dark); }

  .cta-bar__action {
    /* 44px minimum tap target — the one thing the source site gets wrong. */
    display: inline-flex;
    align-items: center;
    min-block-size: var(--tap-target-min, 44px);
    padding-inline: var(--space-5);
    border-radius: var(--radius-md);
    background: var(--color-brand-accent, #e32652);
    color: var(--color-accent-fg);
    font-weight: var(--weight-semibold);
    text-decoration: none;
    transition: background var(--duration-base) var(--ease-standard);
  }
  .cta-bar__action:hover { background: var(--color-brand-accent-pressed, #c71a42); }
  .cta-bar__action:focus-visible { outline: 2px solid var(--color-fg-on-dark); outline-offset: 2px; }

  @media (max-width: 640px) {
    .cta-bar { padding: var(--space-3) var(--space-4); }
    .cta-bar__proof .avatars { display: none; }   /* proof yields to the action on small screens */
  }

  /* MANDATORY: no slide for reduced-motion users — the bar simply appears. */
  @media (prefers-reduced-motion: reduce) {
    .cta-bar { transition: none; transform: none; }
    .cta-bar:not(.is-active) { transform: translateY(100%); }
  }
</style>

<script>
  // IntersectionObserver, not a scroll listener: the question is "is the fold visible?",
  // which is a boolean about an element — so let the browser answer it off the main thread.
  const bar = document.getElementById('cta-bar');
  const sentinel = document.getElementById('cta-sentinel');

  new IntersectionObserver(
    ([entry]) => bar.classList.toggle('is-active', !entry.isIntersecting),
    { threshold: 0 }
  ).observe(sentinel);
</script>
```
> **Safety: production-safe.** `transform`/`opacity` only — no reflow, no scroll handler, no main-thread work. Transition `visibility` so the resting bar is invisible to screen readers and to <kbd>Tab</kbd>, not merely transparent. Keep the action ≥44px; a fixed bottom bar already sits in the hardest-to-hit strip of a phone screen, next to the home indicator. One action only — a second button turns the offer into a navigation.
