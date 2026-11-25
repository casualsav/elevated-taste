---
pattern: ghost-index-hover-list
from: dogstudio
corpus: expressive
safety: spectacle-only
tags: [list, portfolio-index, gallery, hover, active-state, navigation]
---

## What it is

A large project/archive list whose items sit at **near-invisible resting contrast** — huge thin type, dark-on-dark, present but dormant — and only **brighten (and reveal associated media) on hover/focus**. A thin gutter column carries tracked metadata (date ranges, categories) so the list still indexes itself even while the names are barely legible. The list is not decoration around content; scrolling and pointing *at* it is the interaction.

## Why it works

It turns a static list into a reward loop: withholding legibility makes the reveal feel earned, and the eye is drawn to the one item it can actually read. Because the resting state is almost pure value (low-alpha type on ink), the page reads calm and gallery-like at huge scale without shouting — hierarchy comes entirely from the *contrast delta between dormant and active*, not from color or weight changes. Keeping the metadata in a separate margin rail lets the headline column stay pure scale while the list still answers "when / what." It also costs nothing structurally: one list, two states.

**Honesty / safety:** as drawn this is **spectacle-only**. Resting contrast (~10–15%) fails WCAG, hover-only reveal is invisible on touch, and a low-vision or keyboard user can lose the navigation entirely. The reference below keeps the *delight* (giant scale, brighten-and-reveal) but fixes the floor: resting state uses a legible muted token, the brighten triggers on `:focus-within` too, and a `prefers-reduced-motion` branch drops the transition. Treat the original dark-on-dark version as art direction, not a shippable nav.

## Reference implementation

```html
<style>
  .ghost-index {
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-sans);
    padding-block: var(--space-9);
    display: grid;
    /* metadata rail | name column */
    grid-template-columns: minmax(6rem, 12vw) 1fr;
    column-gap: var(--space-6);
    align-items: baseline;
  }

  .ghost-index__row {
    display: contents;                         /* row participates in the parent grid */
  }

  .ghost-index__meta {
    grid-column: 1;
    align-self: center;
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-subtle);
    padding-block: var(--space-4);
  }

  .ghost-index__name {
    grid-column: 2;
    margin: 0;
    font-size: clamp(var(--text-4xl), 9vw, 7.5rem);
    font-weight: var(--weight-regular);        /* thin/light is the dormant look */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    /* RESTING STATE: dim but still legible (a11y floor). The original sits near-invisible. */
    color: var(--color-muted);
    text-decoration: none;
    display: block;
    padding-block: var(--space-4);
    transition: color var(--duration-slow) var(--ease-standard);
  }

  /* ACTIVE: the item the user points at (or tabs to) wakes up */
  .ghost-index__row:hover .ghost-index__name,
  .ghost-index__row:focus-within .ghost-index__name {
    color: var(--color-fg);
  }

  /* Optional media reveal anchored to the pointed row */
  .ghost-index__media {
    position: fixed;
    inset-block-start: 50%;
    inset-inline-end: var(--space-8);
    width: min(32vw, 28rem);
    aspect-ratio: 4 / 3;
    transform: translateY(-50%) scale(0.96);
    opacity: 0;
    pointer-events: none;
    object-fit: cover;
    border-radius: var(--radius-sm);
    transition:
      opacity var(--duration-base) var(--ease-standard),
      transform var(--duration-slow) var(--ease-entrance);
  }
  .ghost-index__row:hover .ghost-index__media,
  .ghost-index__row:focus-within .ghost-index__media {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .ghost-index__name,
    .ghost-index__media { transition: none; }
  }

  /* Narrow screens: drop the side rail — meta stacks above each name */
  @media (max-width: 40rem) {
    .ghost-index { grid-template-columns: 1fr; }
    .ghost-index__meta { grid-column: 1; padding-block-end: 0; }
    .ghost-index__name { grid-column: 1; }
  }

  /* Touch / coarse pointers can't hover — show names legibly by default */
  @media (hover: none) {
    .ghost-index__name { color: var(--color-fg); }
    .ghost-index__media { display: none; }
  }
</style>

<nav class="ghost-index" aria-label="Featured projects">
  <a class="ghost-index__row" href="/work/tomorrowland">
    <span class="ghost-index__meta">2020 – Ongoing</span>
    <span class="ghost-index__name">Tomorrowland</span>
    <img class="ghost-index__media" src="/img/tomorrowland.jpg" alt="" aria-hidden="true" />
  </a>
  <a class="ghost-index__row" href="/work/navy-pier">
    <span class="ghost-index__meta">2019 – Today</span>
    <span class="ghost-index__name">Navy Pier</span>
    <img class="ghost-index__media" src="/img/navy-pier.jpg" alt="" aria-hidden="true" />
  </a>
  <a class="ghost-index__row" href="/work/msi-chicago">
    <span class="ghost-index__meta">2015 – Today</span>
    <span class="ghost-index__name">MSI Chicago</span>
    <img class="ghost-index__media" src="/img/msi.jpg" alt="" aria-hidden="true" />
  </a>
</nav>
```
