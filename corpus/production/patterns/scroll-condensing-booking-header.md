---
pattern: scroll-condensing-booking-header
from: hoxton
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [navigation, header, hero, ecommerce, motion]
---

## What it is
A fixed header built from three stacked rows — an announcement bar, a navigation row, and a **utility row** carrying the site's one transactional control (location picker + primary CTA). Once the page scrolls past the fold, the navigation row collapses and fades out; the announcement bar and the utility row stay pinned. The header goes from roughly 160px to roughly 95px, and the only thing you lose is browsing chrome.

## Why it works
Most condensing headers shrink the logo and keep the links. That optimises for the wrong thing. A visitor who has scrolled has already declined the navigation once; what they still need — at every scroll depth, without hunting — is the control that starts the transaction. Dropping the links is what buys the room to keep the booking bar full-size, so the CTA never has to shrink into an icon.

The mechanism is deliberately dumb. A 1px sentinel at the top of the document is watched by one `IntersectionObserver`; when it leaves the viewport the header gets a class. No scroll listener, no rAF loop, no measurement. The collapse animates `grid-template-rows: 1fr → 0fr` plus `opacity`, which does reflow — but only inside a `position: fixed` subtree, so nothing in the document below it moves. Page content is offset once, from the *condensed* height, and the tall header simply overlaps the hero image at rest; that way the offset never changes and there is no jump.

Two rules keep it honest. The links you hide must exist somewhere else on the page (a footer, a menu button) — collapsing a row is not the same as deleting a destination, and the menu trigger must survive into the condensed state. And under `prefers-reduced-motion` the header still condenses — it is a functional state change, not decoration — it just arrives instantly instead of easing.

The CTA runs flush to the viewport's right edge with no radius and no margin. An edge-anchored button is bigger than it looks and needs no border to be found.

## Reference implementation
```html
<style>
  .siteheader {
    position: fixed;
    inset-block-start: 0;
    inline-size: 100%;
    z-index: 10;
    font-family: var(--font-sans);
  }

  /* Row 1 — announcement. Never collapses; it is the shortest thing on the page. */
  .siteheader__announce {
    background: var(--color-fg);
    color: var(--color-bg);
    text-align: center;
    font-size: var(--text-sm);
    padding: var(--space-3) var(--space-5);
  }

  /* Row 2 — navigation. This is the row that goes away. */
  .siteheader__nav {
    display: grid;
    grid-template-rows: 1fr;                 /* 0fr when condensed */
    background: var(--color-bg);
    transition:
      grid-template-rows var(--duration-slow) var(--ease-standard),
      opacity var(--duration-base) var(--ease-exit);
  }
  .siteheader__nav > ul {
    overflow: hidden;                        /* required for the 1fr→0fr collapse */
    display: flex;
    justify-content: flex-end;
    gap: var(--space-5);
    margin: 0;
    padding: var(--space-4) var(--space-6);
    list-style: none;
  }
  .siteheader__nav a {
    color: var(--color-fg);
    font-size: var(--text-base);
    text-decoration: none;
  }

  /* Row 3 — the transaction. Full size at every scroll depth. */
  .siteheader__utility {
    display: flex;
    align-items: stretch;
    background: var(--color-bg);
    border-block-start: 1px solid var(--color-hairline);
  }
  .siteheader__brand {
    display: flex;
    align-items: center;
    padding-inline: var(--space-6);
    border-inline-end: 1px solid var(--color-hairline);
  }
  .siteheader__picker {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding-inline: var(--space-6);
    background: none;
    border: 0;
    font: inherit;
    font-size: var(--text-lg);
    color: var(--color-fg);
    text-align: start;
    cursor: pointer;
  }
  /* Edge-flush, square, and the only saturated colour in the header. */
  .siteheader__cta {
    display: grid;
    place-items: center;
    min-block-size: var(--tap-target-comfortable, 56px);   /* tap target, not decoration */
    padding-inline: var(--space-6);
    border: 0;
    border-radius: 0;
    background: var(--color-accent, #ff9272);
    color: var(--color-accent-fg-deep, #7f2006);   /* a dark shade of the accent, never white */
    font-size: var(--text-base);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    cursor: pointer;
    transition: background var(--duration-slow) var(--ease-standard),
                color var(--duration-slow) var(--ease-standard);
  }
  .siteheader__cta:hover {
    background: var(--color-accent-fg-deep, #7f2006);
    color: var(--color-accent, #ff9272);
  }

  /* The condensed state. */
  .siteheader.is-condensed .siteheader__nav {
    grid-template-rows: 0fr;
    opacity: 0;
    pointer-events: none;
  }

  /* Offset the page by the CONDENSED height only, so nothing shifts when the nav collapses:
     at rest the tall header overlaps the top of the hero. That is affordable precisely because
     the hero is an unlettered photograph — put a headline up there and this trick stops working. */
  .pagebody { padding-block-start: var(--header-condensed-h, 95px); }

  @media (prefers-reduced-motion: reduce) {
    /* The state still changes — it is functional. Only the easing goes away. */
    .siteheader__nav { transition: none; }
    .siteheader__cta { transition: none; }
  }
</style>

<span id="hdr-sentinel" aria-hidden="true"></span>

<header class="siteheader">
  <div class="siteheader__announce">
    Give your pals 15% off their first stay. <a href="/referral">Invite now</a>
  </div>

  <div class="siteheader__nav">
    <ul>
      <li><a href="/why">Why book with us?</a></li>
      <li><a href="/offers">Global offers</a></li>
      <li><a href="/events">Meetings &amp; events</a></li>
      <li><a href="/blog">Blog</a></li>
    </ul>
  </div>

  <div class="siteheader__utility">
    <a class="siteheader__brand" href="/">Wordmark</a>
    <button class="siteheader__picker" type="button" aria-expanded="false" aria-controls="location-panel">
      <span aria-hidden="true">+</span> Select location
    </button>
    <button class="siteheader__cta" type="button">Find a room</button>
  </div>
</header>

<script>
  // One observer, one class. No scroll listener, no measurement, no rAF.
  const header = document.querySelector('.siteheader');
  new IntersectionObserver(
    ([entry]) => header.classList.toggle('is-condensed', !entry.isIntersecting),
    { threshold: 0 }
  ).observe(document.getElementById('hdr-sentinel'));
</script>
```
