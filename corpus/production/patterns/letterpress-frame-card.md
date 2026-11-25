---
pattern: letterpress-frame-card
from: dishoom
corpus: production
safety: production-safe
tags: [feature-section, editorial, awards, stats, pull-quote, landing]
---

## What it is

A block presented as a *printed object* rather than as a UI card: a double rule (an outer hairline and an inner hairline separated by a few pixels of ground), a tracked small-caps eyebrow, a serif line, and a centred ornament divider — a star, an asterisk, a pair of short rules. No shadow, no fill, no radius beyond 2px. Dishoom uses it for awards ("MCA · Best Restaurant Company · 2024"), for a headline statistic ("25 MILLION MEALS"), and, at photograph scale, for the three-up navigation plaques over café photography.

## Why it works

A shadowed rounded rectangle is a *surface*: it says "this is a thing you can click, floating above the page." A double-rule frame is an *engraving*: it says "this was set in metal and printed here." The distinction matters because most content in a three-card grid isn't clickable and isn't floating — it's a claim, a number, a citation. Giving it the form of a certificate makes the claim feel attested; giving it the form of a card makes it feel like a placeholder.

Three properties carry the whole effect, and all three are cheap:

1. **Two rules, not one.** The inner rule is what reads as engraving. Draw it with a pseudo-element inset by 3–5px, never with a second nested `<div>`.
2. **The frame's inside is the page ground, not a surface colour.** The moment you fill it, it becomes a card again.
3. **The eyebrow is tracked far past comfort** (0.2–0.25em) and the display line is tracked *open* too (~0.1em). Tight display tracking on a serif inside a rule frame reads as a modern app trying on a costume.

The unlock is that the frame is *self-sufficient at any size*. Three of them in a row is not a feature grid, because there is nothing to click and nothing pretending to be a screenshot — it's a page from an annual report. Reach for it wherever you would otherwise have written "three cards with icons."

## Reference implementation

```html
<style>
  .plaque-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
    gap: var(--space-6);
    padding-block: var(--space-9);
    background: var(--color-paper, #f0ece0);   /* the ground, and the frame's interior */
  }

  .plaque {
    position: relative;
    padding: var(--space-6) var(--space-5);
    text-align: center;
    color: var(--color-ink, #353839);
    border: 1px solid currentColor;
    border-radius: var(--radius-sm);           /* 4px max — this is paper, not a chip */
  }
  /* The inner rule. This — not a shadow — is the whole effect. */
  .plaque::before {
    content: "";
    position: absolute;
    inset: 4px;
    border: 1px solid currentColor;
    border-radius: 1px;
    pointer-events: none;
  }

  .plaque__eyebrow {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-caps);      /* push to 0.25em for the full letterpress read */
    text-transform: uppercase;
    margin: 0 0 var(--space-3);
  }

  .plaque__line {
    font-family: var(--font-serif, Georgia, "Times New Roman", serif);
    font-size: var(--text-2xl);
    font-weight: var(--weight-regular);        /* weight ranks nothing here */
    line-height: var(--leading-tight);
    letter-spacing: 0.04em;                    /* tracking OPENS as size grows */
    margin: 0;
    text-wrap: balance;
  }

  /* Ornament divider: two rules with a glyph breathing between them. */
  .plaque__ornament {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    margin-top: var(--space-4);
    color: var(--color-rule, #c4bfaf);
  }
  .plaque__ornament::before,
  .plaque__ornament::after {
    content: "";
    inline-size: var(--space-7);
    block-size: 1px;
    background: currentColor;
  }
  .plaque__ornament > span { font-size: var(--text-sm); line-height: 1; }

  .plaque__source {
    margin: var(--space-4) 0 0;
    font-family: var(--font-serif, Georgia, "Times New Roman", serif);
    font-size: var(--text-sm);
    color: var(--color-muted, #8b7f6b);        /* NOT the hairline colour — this text must pass 4.5:1 */
  }

  /* A statistic wants the frame at display scale and a condensed voice. */
  .plaque--stat .plaque__line {
    font-family: var(--font-display, "Arial Narrow", var(--font-sans));
    font-size: var(--text-5xl);
    font-weight: var(--weight-bold);
    letter-spacing: 0;
  }
</style>

<section class="plaque-row" aria-label="Recognition">
  <figure class="plaque">
    <p class="plaque__eyebrow">Sunday Times</p>
    <p class="plaque__line">Best Places to Work &mdash; 2025</p>
    <div class="plaque__ornament" aria-hidden="true"><span>&#9733;</span></div>
  </figure>

  <figure class="plaque">
    <p class="plaque__eyebrow">MCA</p>
    <p class="plaque__line">Best Restaurant Company</p>
    <div class="plaque__ornament" aria-hidden="true"><span>&#10033;</span></div>
    <figcaption class="plaque__source">2024</figcaption>
  </figure>

  <figure class="plaque plaque--stat">
    <p class="plaque__line">25 Million Meals</p>
    <div class="plaque__ornament" aria-hidden="true"><span>&#9733;</span></div>
    <figcaption class="plaque__source">Donated to date, and counting.</figcaption>
  </figure>
</section>
```

**Do not:** fill the frame, round it past 4px, add a shadow, tighten the display tracking, or make the whole plaque a link. If it must be clickable, put a real link *inside* it and let the frame stay inert — an engraving that lifts on hover stops being an engraving.
