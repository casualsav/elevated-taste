---
pattern: event-row-to-card
from: odesza
corpus: expressive
safety: production-safe
tags: [editorial, data-table, ecommerce]
---

## What it is

A list of dated events — tour dates, changelog entries, release schedules, session agendas — laid out on desktop as an aligned multi-column row (date · title · location · action) and reflowed on narrow viewports into a stacked card. The reflow is not a shrink: the row's *title* field, body-sized in the row, is promoted to the card's headline, and the date drops to an eyebrow above it.

## Why it works

A row and a card order information differently. A row is scanned **vertically down one column** — the eye runs the dates, finds its month, then reads across. Alignment does the work, so the fields can all be the same size and no dividers are needed; fixed `min-width` columns create the rails. A card is scanned **as a block** — the eye lands somewhere in the middle and needs an anchor. A card with four same-sized fields has no anchor, which is exactly what you get when a row is merely allowed to wrap.

So the fix is to reassign the type scale rather than scale it down: at the breakpoint, the venue jumps from body to heading size and the date takes a weight bump to hold its rank as a label above it. Same content, same tokens, different hierarchy — because the reading mode changed. The action button, which sat at the row's far end pushed by `margin-inline-start: auto`, becomes a full-width target at the card's foot, where a thumb expects it.

Two details worth keeping: the desktop row needs no borders or zebra striping if the columns are rail-aligned, and the button's hover is a color inversion rather than a lift, so it costs no shadow token and survives forced-colors mode.

## Reference implementation

```html
<ul class="events">
  <li class="event">
    <p class="event__date"><time datetime="2026-07-18">Jul 18</time></p>
    <h3 class="event__venue">XS Nightclub</h3>
    <p class="event__city">Las Vegas, NV</p>
    <a class="event__cta" href="/tickets/xs">Buy tickets</a>
  </li>
</ul>

<style>
  .events {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    max-inline-size: var(--container-lg);
    margin-inline: auto;
    list-style: none;
    padding: 0;
  }

  .event__date {
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
  }

  .event__cta {
    display: block;
    padding: var(--space-3) var(--space-4);
    border: 2px solid var(--color-ink, #262744);
    border-radius: var(--radius-md);
    font-weight: var(--weight-semibold);
    text-align: center;
    text-decoration: none;
    color: var(--color-paper, #eeeeee);
    background-color: var(--color-ink, #262744);
    transition:
      color var(--duration-slow) var(--ease-standard),
      background-color var(--duration-slow) var(--ease-standard);
  }

  /* the state change is an inversion, not an elevation */
  .event__cta:hover,
  .event__cta:focus-visible {
    color: var(--color-ink, #262744);
    background-color: var(--color-paper, #eeeeee);
  }

  .event__cta:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  /* ---- Card: the default, because narrow is the harder case ---- */
  .event {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    text-align: center;
  }
  .event__venue { font-size: var(--text-3xl); line-height: var(--leading-tight); }
  .event__city  { font-size: var(--text-md); }
  .event__cta   { margin-block-start: var(--space-3); }

  /* ---- Row: rails, one size, no dividers ---- */
  @media (min-width: 768px) {
    .event {
      flex-direction: row;
      align-items: center;
      gap: 0;
      text-align: start;
      font-size: var(--text-md);
    }
    .event__date   { min-inline-size: 170px; }
    .event__venue  { min-inline-size: 350px; padding-inline-end: var(--space-5); font-size: inherit; font-weight: var(--weight-regular); }
    .event__cta    { margin-block-start: 0; margin-inline-start: auto; }
  }

  @media (prefers-reduced-motion: reduce) {
    .event__cta { transition: none; }
  }
</style>
```
