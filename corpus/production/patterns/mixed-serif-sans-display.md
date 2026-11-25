---
pattern: mixed-serif-sans-display
from: resend
corpus: production
safety: production-safe
tags: [hero, heading, typography, editorial, feature-section]
---

## What it is

A display headline that interleaves **two typefaces inside a single line** — a serif and a sans — so individual words flip register. Resend writes "Everything in your **control**" and "Email **reimagined**. Available **today**." with the serif carrying the emotional/focal words and the sans carrying the structural ones (or vice-versa). Same size, same color, same near-regular weight throughout; only the typeface changes word to word. It is distinct from the more common two-tone-by-color headline (`two-tone-headline`, `serif-display-on-neutral`): here the contrast device is the *face*, not hue or weight.

## Why it works

It produces a focal accent and a "second-read" detail using nothing but type — no second size step, no bold, no highlight, no color. Because both faces sit at the same scale and weight, the line stays calm and the emphasis feels editorial rather than shouty; the serif against an otherwise all-sans, grayscale page reads as "human / crafted," so it naturally lands on the word you want felt. Mixing per-word also lets one headline encode tone (sans = engineering, serif = aspiration) in a single gesture, which is cheaper and quieter than adding a sub-headline. Works best when exactly one or two words switch — the rarity is what makes it read as intentional. Transfers to hero and section heads on content-led or product pages that want a considered, premium focal point.

## Reference implementation

```html
<!-- framework-neutral; var(--token) names from /tokens, no magic numbers -->
<h1 class="mss">
  <span class="mss__sans">Everything in your</span>
  <span class="mss__serif">control</span>
</h1>

<h2 class="mss mss--center">
  <span class="mss__serif">Email reimagined.</span>
  <span class="mss__sans">Available</span>
  <span class="mss__serif">today.</span>
</h2>

<style>
  .mss {
    /* one size + one weight for the whole line; the FACE is the only variable */
    font-size: var(--text-5xl);
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);   /* tight tracking at display size */
    color: var(--color-fg);
    margin: 0;
    max-width: var(--container-md);
    text-wrap: balance;
  }
  .mss--center { text-align: center; margin-inline: auto; }

  .mss__sans  { font-family: var(--font-sans);  }
  .mss__serif { font-family: var(--font-serif); }  /* focal words */

  /* optional: nudge optical baseline if the serif sits high/low vs the sans */
  .mss__serif { font-feature-settings: "kern" 1; }

  @media (max-width: 640px) {
    .mss { font-size: var(--text-4xl); }
  }
</style>
```

Requires a `--font-serif` token (a transitional/old-style display serif such as a Domaine-class face). Subset it to the display weight + latin only — it renders just a handful of words, so don't ship a full family. Keep the size/weight identical across both spans; if the serif's cap-height differs noticeably from the sans, adjust with a small `line-height`/baseline nudge rather than changing the font-size (changing size turns this back into ordinary scale-contrast and loses the effect). Safe for body text contrast since color is untouched (`--color-fg`); no a11y cost.
