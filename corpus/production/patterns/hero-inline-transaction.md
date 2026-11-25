---
pattern: hero-inline-transaction
from: charitywater
corpus: production
safety: production-safe
tags: [hero, forms, landing, conversion, split-hero]
---

## What it is

The hero doesn't advertise the conversion — it *starts* it. A full-bleed photograph runs edge to edge, and an elevated white panel sits over its left third holding the first (and often only) step of the real form: a frequency/plan toggle, a grid of preset amounts with a sensible one preselected, a free-entry escape hatch, a single line of copy translating the selected amount into the unit the visitor actually cares about, and one button. charity: water puts a working monthly/one-time donation form there — four preset tiers with `$40/mo` pre-selected and "Gives 12 people clean water every year on average" underneath it.

Use it when the conversion is short, well understood, and doesn't need to be sold: donate, subscribe, get a quote, check availability, start a booking. Don't use it when the visitor doesn't yet know what the product is — a form for a thing you haven't explained is a wall.

## Why it works

Three mechanisms, and they're separable:

**Removing the navigation step.** A hero CTA converts intent into a page load; a hero form converts intent into a filled field. The click you save is the click at which intent is highest, and every subsequent step inherits the sunk cost of the one already taken.

**The preselected default answers the question the visitor is actually asking.** Faced with a blank amount field, a first-time donor doesn't ask "how much can I afford" — they ask "how much is normal here?" A preselected middle tier answers it, silently, without a "most popular" badge. The presets also set the range: showing $10–$100 tells you what kind of organization this is faster than any copy could. (The honest version of this: preselect a tier you'd be happy to receive, not the largest one — an aggressive default reads as a trick and gets changed downward, which is worse than a modest default getting changed up.)

**Denomination.** The impact line under the grid recomputes as the selection changes, converting currency into outcome — people served, hours saved, seats covered. The number that persuades is never the price; it's the price divided by the thing you wanted. This single line is the most portable part of the pattern.

Two construction rules keep it from breaking. The panel must be a real `<form>` with real inputs (a radio group for the presets, `<legend>`s for the toggles) so it linearizes, keyboards, and autofills — a grid of `<div>`s with click handlers loses all three. And the photo must be sized so the panel never covers the subject's face: at desktop the copy and panel occupy the left column, at mobile the panel drops *below* a cropped photo (or collapses to the single button, as here) rather than floating over it.

## Reference implementation

```html
<style>
  .txhero {
    position: relative;
    min-height: 78vh;
    display: grid;
    align-items: center;
    background: var(--color-fg) center / cover no-repeat;   /* fg = warm near-black; shows before the image paints */
    background-image: image-set(url("/hero.avif") type("image/avif"), url("/hero.jpg") type("image/jpeg"));
  }
  .txhero__inner {
    width: 100%;
    max-width: var(--container-xl);
    margin-inline: auto;
    padding: var(--space-8) var(--space-5);
  }
  .txhero__col {
    max-width: 26rem;                                        /* the panel column, never more than ~40% of the shell */
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }
  .txhero__title {
    font-family: var(--font-serif, Georgia, "Times New Roman", serif);
    font-size: var(--text-3xl);
    font-weight: var(--weight-regular);                      /* serif at 400 — the family is the emphasis */
    line-height: var(--leading-snug);
    color: var(--color-fg-inverse);
    text-wrap: balance;
    margin: 0;
    text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35);             /* guarantees contrast over an unknown photo */
  }

  /* ── the panel ─────────────────────────────────────────── */
  .give {
    background: var(--color-bg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
  .give fieldset { border: 0; margin: 0; padding: 0; }
  .give legend {
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--color-muted);
    margin-bottom: var(--space-2);
  }

  /* Frequency toggle and amount grid are the SAME primitive: a radio group styled as cells. */
  .give__cells { display: grid; gap: var(--space-2); }
  .give__cells--freq   { grid-template-columns: 1fr 1fr; }
  .give__cells--amount { grid-template-columns: repeat(3, 1fr); }

  .give__cell { position: relative; }
  .give__cell input {
    position: absolute; inset: 0; opacity: 0;                /* focusable + form-native, visually replaced */
    width: 100%; height: 100%; margin: 0; cursor: pointer;
  }
  .give__cell span {
    display: flex; align-items: center; justify-content: center;
    min-height: 3rem;                                        /* ≥44px tap target, no exceptions */
    border-radius: var(--radius-sm);
    background: var(--color-surface-2);
    color: var(--color-fg);
    font-size: var(--text-base);
    transition: background-color var(--duration-fast) var(--ease-standard);
  }
  .give__cell input:hover + span { background: var(--color-surface); }
  .give__cell input:focus-visible + span {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }
  .give__cell input:checked + span {
    background: var(--color-accent-warm, #ffca0a);           /* exemplar's yellow; the ONE action hue */
    color: var(--color-accent-warm-fg, #222520);
    font-weight: var(--weight-medium);
  }
  .give__cell--wide { grid-column: span 2; }

  /* Denomination line: the price divided by the thing they wanted. */
  .give__impact {
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--color-muted);
    margin: 0;
  }
  .give__impact b { color: var(--color-fg); font-weight: var(--weight-medium); }

  .give__submit {
    min-height: 3.5rem;
    border: 0;
    border-radius: var(--radius-sm);
    background: var(--color-accent-warm, #ffca0a);
    color: var(--color-accent-warm-fg, #222520);
    font: inherit;
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-standard);
  }
  .give__submit:hover { background: var(--color-accent-warm-hover, #ffd53b); }

  @media (max-width: 768px) {
    /* Never float the panel over a face. Below the fold-photo, or nothing. */
    .txhero { min-height: 0; }
    .txhero__col { max-width: none; }
    .give { display: none; }                                 /* replaced by a single full-width CTA */
  }
  @media (prefers-reduced-motion: reduce) {
    .give__cell span, .give__submit { transition: none; }
  }
</style>

<section class="txhero">
  <div class="txhero__inner">
    <div class="txhero__col">
      <h1 class="txhero__title">Bring clean and safe water to every person on the planet</h1>

      <form class="give" action="/give" method="post">
        <fieldset>
          <legend>How often</legend>
          <div class="give__cells give__cells--freq">
            <label class="give__cell">
              <input type="radio" name="cadence" value="monthly" checked>
              <span>Monthly</span>
            </label>
            <label class="give__cell">
              <input type="radio" name="cadence" value="once">
              <span>Give once</span>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Choose or enter an amount to give</legend>
          <div class="give__cells give__cells--amount">
            <label class="give__cell">
              <input type="radio" name="amount" value="10"><span>$10</span>
            </label>
            <label class="give__cell">
              <input type="radio" name="amount" value="20"><span>$20</span>
            </label>
            <!-- Preselect a tier you'd be glad to receive, not the biggest one. -->
            <label class="give__cell">
              <input type="radio" name="amount" value="40" checked><span>$40</span>
            </label>
            <label class="give__cell">
              <input type="radio" name="amount" value="100"><span>$100</span>
            </label>
            <label class="give__cell give__cell--wide">
              <input type="radio" name="amount" value="other"><span>Other amount</span>
            </label>
          </div>
        </fieldset>

        <!-- Recompute this string from the checked amount; it is the persuasive element, not the price. -->
        <p class="give__impact">Gives <b>12 people</b> clean water every year on average.</p>

        <button class="give__submit" type="submit">Join today</button>
      </form>
    </div>
  </div>
</section>
```
