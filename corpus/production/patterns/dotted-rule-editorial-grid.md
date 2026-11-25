---
pattern: dotted-rule-editorial-grid
from: semafor
corpus: production
safety: production-safe
tags: [editorial, blog, navigation, dense-grid, print, minimalist]
---

## What it is
A front page laid out as three simultaneous columns on a tinted paper ground — a standing-head rail (a numbered briefing), a feature well, and a secondary news rail — where **nothing is a card**. No shadow, no fill, no border-radius, no container edge. Separation is done by 1px *dotted* hairlines drawn in the same warm ink as the body text, plus generous column gutters. Semafor runs 64 headlines and 38 nav links this way and it still reads as a newspaper rather than a feed.

## Why it works
A card is four decisions bundled together: a fill, a border, a radius, and a shadow. On a page of homogeneous items — headlines, changelog entries, log lines, table rows — you are paying for all four to communicate one thing, "these are separate." A rule communicates exactly that and nothing more, so the eye stops parsing containers and starts parsing content. The moment items stop being boxed, the strongest verticals on the page become the *text column edges*, which is what makes a three-column layout legible at this density.

Three details carry it:

**Dot the rule, and tint it to the ink.** A solid black hairline is a graphic element; a dotted rule in the ink color (here `#4b4a47`, the same value as body copy) reads as typography — the eye files it with the text, not against it. Reserve a lighter rule for dividers that must recede inside a column.

**Cap the measure per column, not per page.** Each column is capped near 40–55ch. This is what buys the density: three columns at full-bleed measure would be unreadable; three columns at newspaper measure are a newspaper.

**Let the chrome scroll away.** No sticky header. On a page whose value is the content, a pinned masthead spends 10% of every viewport forever to save one scroll-to-top.

Below the single breakpoint, the columns stack in **priority order** — feature well first, briefing rail second, secondary rail last — and the vertical rules become horizontal ones. Do not preserve the visual left-to-right order; the DOM order should already be the priority order, with `order` used only to hoist the feature well on wide screens.

## Reference implementation
```html
<style>
  .front {
    --rule: var(--color-rule, #4b4a47);            /* same ink as body copy */
    --rule-soft: var(--color-rule-soft, #c3c1ae);  /* recedes: within-column dividers */

    background: var(--color-paper, #f8f5d7);
    color: var(--color-ink, #1f1d1a);
    font-family: var(--font-serif, "Times New Roman", Times, serif);
  }

  .front__grid {
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--space-5);
    display: grid;
    /* rail · well · rail — the well is the only flexible track */
    grid-template-columns: 20rem minmax(0, 1fr) 18rem;
    gap: var(--space-6);                            /* the gutter IS the divider */
    align-items: start;
  }

  /* One rule declaration, reused. Dotted + ink-toned = reads as typography. */
  .front__rail { border-inline-end: 1px dotted var(--rule); padding-inline-end: var(--space-6); }
  .front__aside { border-inline-start: 1px dotted var(--rule); padding-inline-start: var(--space-6); }
  .front__band { border-block-start: 1px dotted var(--rule); padding-block-start: var(--space-4); }

  /* Serif = things a person wrote. Sans = things the system knows. */
  .front__kicker,
  .front__meta {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--color-ink-soft, #4b4a47);
  }
  .front__kicker { color: var(--color-link, #3a6d78); }

  /* Live state is the ONLY thing that gets to be red. */
  .front__live::before {
    content: "";
    display: inline-block;
    inline-size: 0.5rem; block-size: 0.5rem;
    margin-inline-end: var(--space-2);
    border-radius: var(--radius-full);
    background: var(--color-live, #af1f1b);
  }

  /* Hierarchy: size × a half-step of weight. Never color. */
  .front__lead {
    font-size: var(--text-3xl);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);              /* headline and body share a ratio */
    margin: 0 0 var(--space-3);
    text-wrap: balance;
  }
  .front__deck {
    font-size: var(--text-md);
    line-height: var(--leading-normal);            /* the one leading exception = "read me" */
    color: var(--color-ink-soft, #4b4a47);
    max-width: 46ch;
    margin: 0;
  }
  .front__hed {
    font-size: var(--text-lg);
    font-weight: var(--weight-medium);
    line-height: var(--leading-snug);
    margin: 0;
  }

  /* A numbered briefing: the ordinal replaces the bullet, the marker, and the card. */
  .front__briefing { list-style: none; margin: 0; padding: 0; counter-reset: item; }
  .front__briefing > li {
    counter-increment: item;
    display: grid;
    grid-template-columns: 1.5rem 1fr;
    gap: var(--space-3);
    padding-block: var(--space-4);
    line-height: var(--leading-snug);
    max-width: 46ch;
  }
  .front__briefing > li + li { border-block-start: 1px dotted var(--rule-soft); }
  .front__briefing > li::before {
    content: counter(item);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    color: var(--color-ink-soft, #4b4a47);
  }
  .front__briefing a { color: inherit; text-underline-offset: 0.2em; transition: color var(--duration-fast) var(--ease-standard); }
  .front__briefing a:hover { color: var(--color-link, #3a6d78); }

  /* Line art takes the paper's tint instead of carrying a white box. */
  .front__engraving { mix-blend-mode: multiply; }

  @media (max-width: 768px) {
    .front__grid { grid-template-columns: 1fr; gap: var(--space-5); }
    /* Priority order, not visual order: the feature well leads. */
    .front__well { order: -1; }
    /* Vertical rules become horizontal ones. */
    .front__rail, .front__aside {
      border-inline: 0;
      padding-inline: 0;
      border-block-start: 1px dotted var(--rule);
      padding-block-start: var(--space-4);
    }
  }
</style>

<div class="front">
  <div class="front__grid">
    <section class="front__rail" aria-labelledby="glance">
      <h2 id="glance" class="front__hed">The World at a Glance</h2>
      <p class="front__meta front__live">Updated 11:42pm UTC</p>
      <ol class="front__briefing">
        <li><a href="/a">The US and Iran exchanged strikes for a second day</a>, the most serious rupture yet in a crumbling ceasefire.</li>
        <li>The fading prospect of a durable ceasefire is <a href="/b">forcing investors to reassess</a>.</li>
      </ol>
    </section>

    <section class="front__well" aria-label="Lead story">
      <p class="front__kicker">Gulf</p>
      <h1 class="front__lead"><a href="/lead">US, Iran trade more strikes as ceasefire crumbles</a></h1>
      <p class="front__deck">The US cannot easily walk away from the conflict, but any likely deal is unpalatable.</p>
    </section>

    <aside class="front__aside" aria-label="More coverage">
      <h2 class="front__hed"><a href="/c">Markets reassess post-truce optimism</a></h2>
      <p class="front__deck">Investors are bracing for prolonged instability.</p>
      <div class="front__band">
        <p class="front__kicker">View</p>
        <h2 class="front__hed"><a href="/d">The mistrust of AI labs bubbles over</a></h2>
      </div>
    </aside>
  </div>
</div>
```
