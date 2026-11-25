---
pattern: rotating-noun-headline
from: faire
corpus: production
safety: production-safe
trigger: load
tags: [motion, hero, landing, product-marketing, typography]
---

## What it is
A closing (or opening) headline with exactly one word swapped out on a loop: *"The perfect **candle** for your store, right this way."* Faire cycles five concrete nouns — drinkware, planter, moisturizer, coffee, candle — through a single underlined slot on a ~5s cycle, crossfading opacity and sliding a few pixels vertically, while the rest of the sentence never moves. The words are real links, and the surrounding band is collaged with photographs of those exact products.

## Why it works
Marketplaces, platforms, and toolkits all have the same headline problem: the true value proposition is *"many things"*, and "many things" is unwriteable. The three bad solutions are a vague abstraction ("Everything your store needs"), five competing headlines in a carousel, or a bullet list that nobody reads. The rotator picks a fourth: keep one sentence, make it **specific**, and let specificity be a set. At any instant the visitor reads a concrete, complete claim; across four seconds they infer the breadth without being told it.

Three details separate the good version from the cliché:

- **Rotate a noun, not an adjective.** Swapping *fast / simple / powerful* rotates through synonyms of nothing. Swapping *candle / planter / coffee* rotates through the actual catalog, and each word is a real query the visitor could have typed.
- **The slot must not resize the sentence.** If the line reflows on every swap, the eye tracks the jump instead of the word. Reserve the slot at the width of the longest word (`ch`-sized or via a hidden sizer), left-align the words inside it, and give it a persistent underline so the empty moments still look intentional.
- **Every word is in the DOM.** Screen readers, search crawlers, and no-JS clients get the full list; only the visual presentation is a loop. Mark the slot `aria-live="off"` — a headline that announces itself five times is a hostile page.

Cost is negligible (`opacity` + `transform` on one inline element), but it is a **perpetual** animation next to a call to action, which is precisely the case `prefers-reduced-motion` was written for. The source site ships no such rule (`prmRules: 0`). The reduced-motion fallback here is not "animate slower" — it is "show the first word, statically, forever," and the sentence still works, because a single concrete noun was always a valid headline.

## Reference implementation
```html
<style>
  .promise {
    display: grid;
    place-items: center;
    gap: var(--space-4);
    padding-block: var(--space-10);
    text-align: center;
    background: var(--color-band, #ffd0b2);       /* an expressive brand ground, never a UI surface */
    color: var(--color-fg);
  }
  .promise__line {
    font-family: var(--font-display, "Nantes", Georgia, serif);
    font-size: var(--text-4xl);
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-heading);
    margin: 0;
    max-width: 18ch;
  }
  .promise__cta {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    color: var(--color-fg);
    text-underline-offset: 4px;
  }

  /* The slot is sized once, by the longest word, and never reflows. */
  .rotator {
    position: relative;
    display: inline-block;
    width: var(--rotator-width, 6.5ch);            /* set from the longest noun */
    height: 1em;
    vertical-align: baseline;
    text-align: left;
    border-bottom: 1px solid currentColor;         /* the underline persists between words */
  }
  .rotator__word {
    position: absolute;
    inset: 0;
    opacity: 0;
    white-space: nowrap;
    color: inherit;
    text-decoration: none;
    animation: word-cycle var(--rotator-cycle, 5000ms) var(--ease-standard) infinite both;
    animation-delay: calc(var(--i) * (var(--rotator-cycle, 5000ms) / var(--rotator-count, 5)));
  }

  /* One word visible per 1/N of the cycle; the crossfade is the overlap at each boundary. */
  @keyframes word-cycle {
    0%              { opacity: 0; transform: translateY(0.18em); }
    3%, 17%         { opacity: 1; transform: translateY(0); }
    20%, 100%       { opacity: 0; transform: translateY(-0.18em); }
  }

  /* Mandatory. The first noun alone is a complete, honest headline. */
  @media (prefers-reduced-motion: reduce) {
    .rotator__word { animation: none; opacity: 0; transform: none; }
    .rotator__word:first-child { opacity: 1; }
  }
</style>

<section class="promise">
  <!-- Every noun ships in the markup: crawlers and screen readers read the whole list.
       aria-live is off on purpose — the loop must never be announced. -->
  <h2 class="promise__line">
    The perfect
    <span class="rotator" style="--rotator-count: 5; --rotator-width: 6.5ch" aria-live="off">
      <a class="rotator__word" style="--i: 0" href="/c/candles">candle</a>
      <a class="rotator__word" style="--i: 1" href="/c/drinkware">drinkware</a>
      <a class="rotator__word" style="--i: 2" href="/c/planters">planter</a>
      <a class="rotator__word" style="--i: 3" href="/c/skincare">moisturizer</a>
      <a class="rotator__word" style="--i: 4" href="/c/coffee">coffee</a>
    </span>
    for your store, right this way.
  </h2>
  <a class="promise__cta" href="/signup">Sign up for free</a>
</section>
```

Two adjustments worth making on adoption. If the nouns differ wildly in length, size `--rotator-width` from a visually-hidden sizer holding the longest one rather than guessing `ch`. And if the words are links, pause the cycle while the slot has focus or hover (`.rotator:hover .rotator__word, .rotator:focus-within .rotator__word { animation-play-state: paused; }`) — an animated link is otherwise impossible to click.
