---
pattern: underlined-caps-info-block
from: gjelina
corpus: production
safety: production-safe
tags: [feature-section, landing, navigation, editorial, restaurant, local-business]
---

## What it is
A repeating block for entities that each carry a small pile of hard facts — a location, an office, a plan, a clinic, a team member. Each block is: a condensed all-caps heading with a **thick accent underline**, a short address/identity line, two to four `label: value` pairs, and exactly one action button. Two blocks sit side by side; there is no card, no border, no shadow, and no background change. Gjelina lists five businesses this way, directly under the fold, before any brand copy.

## Why it works
The bordered card exists to answer "where does this item end?" A heading that is 3× the body size, set in caps, in a condensed face, with a rule under it already answers that — twice over. Adding the card border means the item is now delimited three times, which is why card grids of text-only content look busy at rest and identical to each other at a glance.

Three mechanics carry it:

**The underline is a `border-bottom` on the heading, not `text-decoration`.** That makes its thickness, color, and offset controllable, and — because the heading is `display: inline-block` — the rule stops at the end of the *text*, not at the end of the column. A rule that ends at the text says "this heading is an object"; a rule that spans the column says "this is a section divider." You want the first, or the blocks stop reading as siblings.

**Facts are a `<dl>`, not paragraphs.** Bold label, regular value, one pair per line, no colons-as-decoration. Screen readers get the association for free, and the two typographic weights (700 label / 400 value) are the *only* place bold appears — so bold means "field name" everywhere on the page and nothing else.

**One button, and it is a rectangle.** Sharp corners, uppercase, tracked, filled with the accent. The hover is a ground/ink inversion rather than a darken — with a two-color palette there is no darker shade to reach for, and inventing one introduces a third color to maintain.

The discipline that makes this pattern honest: **the heading must be the fact, not the pitch.** "GJELINA LAS VEGAS", not "Visit us in Vegas". If the heading is a slogan, the underline is decorating a sentence rather than labelling an entity, and you should be using a card after all.

## Reference implementation
```html
<style>
  .infoblocks {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-9) var(--space-7);        /* the gutter is the only separator */
    max-width: var(--container-xl);
    margin-inline: auto;
    padding: var(--space-9) var(--space-5);
    background: var(--color-bg-warm, #f9e4c2); /* one ground for the whole page; no surface tier */
  }

  .infoblock__figure {
    margin: 0 0 var(--space-5);
    aspect-ratio: 3 / 2;
    overflow: hidden;
  }
  .infoblock__figure > img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* inline-block so the rule ends with the text — an object, not a divider */
  .infoblock__title {
    display: inline-block;
    margin: 0 0 var(--space-4);
    font-family: var(--font-display, "Anton", "Oswald", Impact, sans-serif);
    font-weight: var(--weight-regular);        /* a condensed face needs no bold */
    font-size: var(--text-4xl);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-normal);
    text-transform: uppercase;
    color: var(--color-fg);
    border-bottom: var(--rule-thick, 4px) solid var(--color-accent-brick, #b44226);
  }

  .infoblock__address {
    margin: 0 0 var(--space-5);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-fg);
  }

  .infoblock__facts { margin: 0 0 var(--space-6); }
  .infoblock__facts dt {
    font-weight: var(--weight-bold);           /* bold means "field name" — and nothing else */
    font-size: var(--text-base);
    line-height: var(--leading-normal);
  }
  .infoblock__facts dd {
    margin: 0 0 var(--space-4);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
  }
  .infoblock__facts dd:last-child { margin-bottom: 0; }

  /* Rectangle, not pill. Hover inverts ground and ink rather than darkening. */
  .infoblock__cta {
    display: inline-block;
    padding: var(--space-4) var(--space-6);
    min-height: 44px;                          /* tap-target floor */
    border: 1px solid var(--color-accent-brick, #b44226);
    border-radius: 0;
    background: var(--color-accent-brick, #b44226);
    color: var(--color-bg-warm, #f9e4c2);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    text-decoration: none;
    transition: background-color var(--duration-base) var(--ease-standard),
                color var(--duration-base) var(--ease-standard);
  }
  .infoblock__cta:hover,
  .infoblock__cta:focus-visible {
    background: var(--color-bg-warm, #f9e4c2);
    color: var(--color-fg);
  }

  @media (max-width: 768px) {
    .infoblocks { grid-template-columns: 1fr; gap: var(--space-8); padding-inline: var(--space-4); }
    .infoblock__title { font-size: var(--text-3xl); }
  }
</style>

<section class="infoblocks" aria-label="Locations">
  <article class="infoblock">
    <figure class="infoblock__figure">
      <img src="/photos/venice.jpg" alt="The Venice dining room at dusk, lit by pendant lamps over a communal table">
    </figure>
    <h2 class="infoblock__title">Gjelina Venice</h2>
    <p class="infoblock__address">1429 Abbot Kinney Blvd.<br>Venice CA 90291</p>
    <dl class="infoblock__facts">
      <dt>Phone:</dt><dd>310.450.1429</dd>
      <dt>Hours:</dt>
      <dd>Breakfast: Monday–Friday 8am–10:30a<br>Dinner: Daily 5pm–10:30pm</dd>
    </dl>
    <a class="infoblock__cta" href="/reservations/venice">Make a reservation</a>
  </article>

  <article class="infoblock">
    <figure class="infoblock__figure">
      <img src="/photos/ny.jpg" alt="A wood-fired oven glowing behind the pass at the New York location">
    </figure>
    <h2 class="infoblock__title">Gjelina NY</h2>
    <p class="infoblock__address">45 Bond St.<br>New York NY 10012</p>
    <dl class="infoblock__facts">
      <dt>Phone:</dt><dd>646.476.2506</dd>
      <dt>Hours:</dt>
      <dd>Weekend Brunch: 11am–2:30pm<br>Dinner: Daily 5:30pm–10:30pm</dd>
    </dl>
    <a class="infoblock__cta" href="/reservations/ny">Make a reservation</a>
  </article>
</section>
```
