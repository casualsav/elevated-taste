---
pattern: condensing-scroll-nav
from: charitywater
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [navigation, motion, landing, conversion]
---

## What it is

A fixed header that carries its full navigation while the visitor is at the top of the page, then — once they've scrolled past roughly the first viewport — sheds everything except the wordmark and the **one** primary CTA. It's a single discrete state change at a threshold, not a continuous scroll-linked animation. charity: water's header goes from `logo · Take Action · About Us · Why Water? · Sign in · Give` to `logo · Give` and stays there for the remaining ~5,000px of page.

Reach for it when a long page has exactly one conversion. It's the honest alternative to a separate sticky "Donate now" bar bolted to the bottom of the viewport: instead of adding chrome as the visitor descends, you *subtract* it, and the CTA that was already in the header is the one that persists.

## Why it works

Navigation and conversion have opposite scroll profiles. Nav links matter most in the first screen, when the visitor is deciding whether this is the right page at all; after that they're a set of exits, competing with the argument the page is making. The CTA is the inverse — it matters more the further you read. Condensing the header lets the same fixed strip serve both curves without ever showing two competing CTAs.

The subtraction also buys back horizontal space and, more importantly, *attention*. A header that gets simpler as the page gets denser is a legibility gain exactly where the page needs one.

Three construction rules:

**Cross a threshold; don't map scroll position.** Tie the state to an `IntersectionObserver` on a zero-height sentinel at the top of the document, grown by a `rootMargin` of one viewport — one callback per crossing, no scroll listener, no rAF, nothing on the main thread while scrolling. Put the threshold a full viewport down, well clear of any content the visitor might scrub back and forth over, or the header will flicker for anyone parked on the boundary.

**Never transition `height` or `width`.** Crossfade `opacity` and collapse with `transform`/`visibility`, and give the header a fixed height in both states. Animating `height` reflows the whole document under a fixed element on every frame.

**The links must leave the accessibility tree, not just the screen.** `opacity: 0` alone leaves them focusable — a keyboard user tabs into invisible links. Use `visibility: hidden` (which the transition can still stagger) or `inert` on the collapsed group, and make sure focus inside that group moves to the CTA before it hides.

Under `prefers-reduced-motion` the state change still happens — it's information, not decoration — but it happens instantly, with no crossfade.

## Reference implementation

```html
<style>
  .topbar {
    position: fixed;
    inset-block-start: 0;
    inset-inline: 0;
    z-index: 100;
    height: 5rem;                                   /* SAME in both states — this is what keeps it cheap */
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-5);
    padding-inline: var(--space-5);
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-hairline);
  }

  .topbar__brand { display: flex; align-items: center; gap: var(--space-2); }

  /* The group that disappears. Fixed-height header + transform means zero reflow. */
  .topbar__links {
    display: flex;
    align-items: center;
    gap: var(--space-6);
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    transition:
      opacity    var(--duration-base) var(--ease-standard),
      transform  var(--duration-base) var(--ease-standard),
      visibility 0s linear var(--duration-base);   /* hold visibility until the fade finishes */
  }

  .topbar[data-condensed="true"] .topbar__links {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-0.5rem);
    transition:
      opacity    var(--duration-fast) var(--ease-exit),
      transform  var(--duration-fast) var(--ease-exit),
      visibility 0s linear var(--duration-fast);
  }

  .topbar__link {
    color: var(--color-fg);
    text-decoration: none;
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    padding-block: var(--space-3);                  /* keeps the hit area ≥44px in a 80px bar */
    transition: color var(--duration-fast) linear;
  }
  .topbar__link:hover { color: var(--color-muted); }
  .topbar__link:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 4px; }

  /* The one thing that never leaves. */
  .topbar__cta {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    padding-inline: var(--space-5);
    border-radius: var(--radius-sm);
    background: var(--color-accent-warm, #ffca0a);
    color: var(--color-accent-warm-fg, #222520);
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    text-decoration: none;
    transition: background-color var(--duration-fast) linear;
  }
  .topbar__cta:hover { background: var(--color-accent-warm-hover, #ffd53b); }

  /* Mandatory: the state still changes, it just doesn't animate. */
  @media (prefers-reduced-motion: reduce) {
    .topbar__links,
    .topbar[data-condensed="true"] .topbar__links { transition: none; transform: none; }
  }
</style>

<!-- Zero-height sentinel: while it is on screen, the header is expanded. -->
<div id="nav-sentinel" aria-hidden="true" style="position:absolute;top:0;height:1px;width:1px"></div>

<header class="topbar" data-condensed="false">
  <a class="topbar__brand" href="/"><img src="/logo.svg" alt="Acme" height="24"></a>
  <nav class="topbar__links" aria-label="Primary">
    <a class="topbar__link" href="/act">Take action</a>
    <a class="topbar__link" href="/about">About us</a>
    <a class="topbar__link" href="/why">Why water?</a>
    <a class="topbar__link" href="/signin">Sign in</a>
  </nav>
  <a class="topbar__cta" href="/give">Give</a>
</header>

<script>
  (function () {
    const bar = document.querySelector('.topbar');
    const links = bar.querySelector('.topbar__links');
    const cta = bar.querySelector('.topbar__cta');
    const sentinel = document.getElementById('nav-sentinel');

    const setCondensed = (on) => {
      if (bar.dataset.condensed === String(on)) return;
      // Move focus out before the group leaves the a11y tree.
      if (on && links.contains(document.activeElement)) cta.focus();
      bar.dataset.condensed = String(on);
      links.inert = on;
    };

    // The sentinel's box is grown upward by one viewport, so it stops intersecting
    // once you are ~1vh down — one callback per crossing, no scroll listener.
    new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { rootMargin: '100% 0px 0px 0px', threshold: 0 }
    ).observe(sentinel);
  })();
</script>
```
