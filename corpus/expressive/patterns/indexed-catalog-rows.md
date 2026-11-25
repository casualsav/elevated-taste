---
pattern: indexed-catalog-rows
from: mschf
corpus: expressive
safety: production-safe
trigger: hover
tags: [catalog, archive, changelog, list, navigation, terminal, text-only]
---

## What it is

A homepage-as-inventory: every item the org has ever shipped, one per line, numbered, in a monospace character grid. Each row is a flex pair — a fixed `4ch` index gutter and a fixed-`ch` title column that never wraps and never ellipses. Sections are not announced by headings; they are distinguished only by the **color of a rail** (a thick left border) that runs down their whole length, and each hue means exactly one state: archived, live, unreleased. At rest every row sits under a **dither veil** — a 50% checkerboard of ground-colored squares built from two offset 45° gradients — which the row sheds when you hover it.

## Why it works

Three mechanisms, each independently portable:

1. **`ch` columns over `fr` columns.** With a monospace face, `ch` is a hard unit, so the page becomes a terminal buffer: alignment is guaranteed at every viewport, the row count *is* the item count, and the eye's saccades land on a predictable advance width. This is why a 128-row wall stays scannable where a wrapped, proportional list would not.
2. **A rail replaces a heading.** Section identity is a 3px border color plus a hue that means one thing. It costs zero vertical space, so the catalog stays uninterrupted — the aggregate mass is the message. The a11y bill for this is real and non-optional: a rail carries no meaning to assistive tech, so each section still needs a real (visually-hidden) heading and each state hue a text label.
3. **A screen, not an alpha wash.** `opacity: 0.5` dims a row uniformly; a halftone screen *degrades* it, which reads as physical (un-developed, un-printed, un-clicked) rather than merely faint. Toggling the overlay's `display` is free — no paint on the hover path, no compositing layer. Because the veil is drawn from two `linear-gradient`s in the ground color, it works on any background without a second asset.

**Cost — read before shipping.** A 50% cell coverage roughly halves effective contrast: mid-gray text that measures 5.9:1 on black lands near 2.9:1 under the veil and fails AA at rest. Ship the veil over decorative rows or duplicated information, drop the cell coverage (12.5% reads almost as well and costs far less contrast), or lift the veil on `:focus-visible` as well as `:hover` — a keyboard user must never be stuck reading through it. The `--cell` size must stay an integer multiple of the device pixel or the checkerboard shimmers on scroll.

## Reference implementation

```html
<style>
  .catalog {
    --cell: 6px;                      /* dither cell; keep it an even px value */
    --index-col: 4ch;
    --title-col: 33ch;
    --rail: 3px;
    background: var(--color-catalog-bg, #000000);
    color: var(--color-catalog-fg, #84898e);
    font-family: var(--font-mono);
    font-size: clamp(var(--text-lg), 3vw, var(--text-4xl));
    line-height: 0.9;                 /* sub-1 leading fuses rows into a slab */
    text-transform: uppercase;        /* required: sub-1 leading collides descenders */
  }

  /* A section is identified by its rail color alone. Its accessible name
     lives in the visually-hidden heading, never in the border. */
  .catalog__section {
    border-left: var(--rail, 3px) solid var(--rail-color, var(--color-border-on-dark));
    padding-inline: var(--space-2) var(--space-5);
  }
  .catalog__section[data-state="archive"]    { --rail-color: var(--color-rail-archive, rgba(168,145,65,0.3)); }
  .catalog__section[data-state="live"]       { --rail-color: var(--color-rail-live, #40aaff); color: var(--color-rail-live, #40aaff); }
  .catalog__section[data-state="unreleased"] {
    color: var(--color-rail-unreleased, #f00007);
    /* the rail dissolves into the ground: "end of known data" */
    border-image: linear-gradient(180deg,
      var(--color-rail-unreleased, #f00007),
      var(--color-catalog-bg, #000000)) 1;
  }

  .catalog__row { display: flex; flex-wrap: nowrap; white-space: nowrap; }

  .catalog__index {
    flex-shrink: 0;
    width: var(--index-col, 4ch);
    font-size: 0.4em;               /* the only other size in the scale */
    line-height: 1.1;
    letter-spacing: 0;
  }

  .catalog__title {
    position: relative;             /* veil anchor */
    flex-grow: 1;
    width: var(--title-col, 33ch);
    overflow: hidden;
  }

  .catalog__link { color: inherit; text-decoration: none; }
  .catalog__link:hover,
  .catalog__link:focus-visible { color: var(--color-catalog-fg-hover, #ffffff); }
  .catalog__link:focus-visible { outline: 2px solid var(--color-accent, #ffc700); outline-offset: 2px; }

  /* Reserve the glyph cell at rest so revealing it can't shift a nowrap row. */
  .catalog__link::after { content: "\00a0"; }
  .catalog__link:hover::after,
  .catalog__link:focus-visible::after { content: "\2197"; }

  /* The veil: two 45deg gradients offset by half a cell = a 50% checkerboard.
     pointer-events:none so it never eats the hover it exists to react to. */
  .catalog__veil {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(45deg, var(--color-catalog-bg, #000000) 25%, transparent 0, transparent 75%, var(--color-catalog-bg, #000000) 0),
      linear-gradient(45deg, var(--color-catalog-bg, #000000) 25%, transparent 0, transparent 75%, var(--color-catalog-bg, #000000) 0);
    background-size: var(--cell, 6px) var(--cell, 6px);
    background-position: 0 0, calc(var(--cell, 6px) / 2) calc(var(--cell, 6px) / 2);
  }
  /* Lift on hover AND focus — a keyboard user must not read through the screen. */
  .catalog__row:hover .catalog__veil,
  .catalog__row:focus-within .catalog__veil { display: none; }

  /* Forced-colors / high-contrast users get no veil at all. */
  @media (forced-colors: active), (prefers-contrast: more) {
    .catalog__veil { display: none; }
  }

  @media (max-width: 500px) {
    .catalog { --title-col: 19ch; --rail: 10px; --cell: 12px; letter-spacing: -0.03em; }
  }
</style>

<main class="catalog">
  <section class="catalog__section" data-state="archive">
    <h2 class="visually-hidden">Released projects</h2>

    <div class="catalog__row">
      <span class="catalog__index" aria-hidden="true">1</span>
      <span class="catalog__title">
        <a class="catalog__link" href="/persistence-of-chaos">The Persistence of Chaos</a>
        <span class="catalog__veil"></span>
      </span>
    </div>

    <div class="catalog__row">
      <span class="catalog__index" aria-hidden="true">2</span>
      <span class="catalog__title">
        <a class="catalog__link" href="/man-eating-food">Man Eating Food</a>
        <span class="catalog__veil"></span>
      </span>
    </div>
  </section>

  <section class="catalog__section" data-state="unreleased">
    <h2 class="visually-hidden">Unreleased</h2>
    <div class="catalog__row">
      <span class="catalog__index" aria-hidden="true">129</span>
      <span class="catalog__title">?????????????????</span>
    </div>
  </section>
</main>
```
