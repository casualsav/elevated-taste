---
pattern: centered-spine-index
from: obys
corpus: expressive
safety: production-safe
tags: [portfolio-index, gallery, feed, navigation]
---

## What it is

A browse layout where the primary content — project thumbnails, story cards, media plates — stacks in a single **centered vertical column** running down the page axis, while navigation and metadata are pushed to thin left/right margin rails. Scrolling the spine *is* the navigation; the page reads minimal but carries a full index and credits in the margins.

## Why it works

A strong central axis turns the scroll direction into the layout system: the eye locks to one line and the flanking whitespace frames each item like a gallery plate. Separating navigation (margins) from content (center) lets each be information-dense without crowding the other. It is also the cheapest layout to make responsive — there is only ever one content column, so mobile is the same structure at a narrower width, not a reflow.

## Reference implementation

```html
<style>
  .spine-page {
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-sans);          /* swap for a display face if self-hosting */
    min-height: 100vh;
    padding-block: var(--space-9);
    display: grid;
    /* margin rail | centered spine | margin rail */
    grid-template-columns: 1fr minmax(0, var(--container-content)) 1fr;
    column-gap: var(--space-6);
  }
  .spine {
    grid-column: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-9);                     /* big voids between plates = the rhythm */
  }
  .spine__plate {
    width: 100%;
    filter: grayscale(1);                    /* spectacle-only: drop for content imagery */
    transition: filter var(--duration-base) var(--ease-standard);
  }
  .spine__plate:hover { filter: grayscale(0); }
  .spine__plate img { display: block; width: 100%; height: auto; }

  .rail {
    align-self: start;
    position: sticky;
    top: var(--space-6);
    font-size: var(--text-xs);               /* >=14px in true production */
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-tight);
    color: var(--color-muted);
  }
  .rail--left  { grid-column: 1; }
  .rail--right { grid-column: 3; text-align: right; }
  .rail a { color: var(--color-fg); text-decoration: none; }
  .rail a:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }

  @media (max-width: 48rem) {
    .spine-page { grid-template-columns: 1fr; padding-inline: var(--space-4); }
    .spine { grid-column: 1; }
    .rail--left, .rail--right { grid-column: 1; position: static; text-align: left; }
  }
  @media (prefers-reduced-motion: reduce) {
    .spine__plate { transition: none; }
  }
</style>

<div class="spine-page">
  <nav class="rail rail--left" aria-label="Index">
    <ul>
      <li><a href="#p1">Mathieu</a></li>
      <li><a href="#p2">Source Unknown</a></li>
      <li><a href="#p3">Eminente</a></li>
    </ul>
  </nav>

  <main class="spine">
    <a class="spine__plate" id="p1" href="/work/mathieu">
      <img src="/media/mathieu.jpg" alt="Mathieu — brand & art direction">
    </a>
    <a class="spine__plate" id="p2" href="/work/source-unknown">
      <img src="/media/source-unknown.jpg" alt="Source Unknown — editorial">
    </a>
  </main>

  <aside class="rail rail--right">
    Creative Direction,<br>Web Design / Dev
  </aside>
</div>
```
