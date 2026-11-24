---
pattern: display-font-closing-cta
from: sentry
corpus: production
safety: production-safe
tags: [footer, hero, cta, typography, brand-experience, product-marketing]
---

## What it is
The final conversion block before the footer, set entirely in a **different, characterful display typeface** from the rest of the page. Where the whole site runs on one workhorse sans (Rubik), this one centered block switches *both* its short headline ("Fix It") *and* its supporting paragraph into a chunky custom slab face, then drops the usual two-button CTA row (one solid, one outline) beneath. The type change — not color, size, or a divider — is what marks it as the ending.

## Why it works
A long marketing page needs a recognizable *last beat*; reusing the same hero treatment at the bottom reads as a loop, not a conclusion. Swapping the typeface for the sign-off is a **register shift** — like a person changing tone for their closing line — so the moment feels deliberate and human, and it does the brand-voice work that an illustration or color wash would, but cheaper. Critically, the display face is rationed to *only* this block (and never the body), so it stays special: scarcity is what makes it read as personality rather than noise. The mechanism is transferable to any closing CTA, pricing-page kicker, or empty-state where you want one warm, voiced moment against an otherwise systematic, neutral type ramp. The rule of thumb: one secondary display face, used in exactly one place, kept short.

## Why it's safe
The typeface is a stylistic swap on a few words, not a structural change — semantics, tab order, and contrast are unchanged, so there is no a11y cost when the face has solid letterforms and you keep contrast within ratio. The one real risk is **webfont weight**: a custom display face used for ~10 words is wasteful if it ships the full character set, so subset it to the glyphs that block actually uses, load it `font-display: swap` with a sane fallback in the same metrics band, and never let it become a render-blocking dependency for above-the-fold content (it lives at page bottom, so lazy/deferred loading is ideal). Decorative display faces can be illegible at small sizes — keep this usage at display scale only.

## Reference implementation
```html
<!-- framework-neutral; var(--token) names from /tokens/tokens.json, no magic numbers -->
<style>
  /* the secondary display face, scoped so it can never leak into body copy.
     Declare it as its own role token, subset + swap for safety. */
  @font-face {
    font-family: "BrandDisplay";
    src: url("/fonts/brand-display.woff2") format("woff2");
    font-weight: 700;
    font-display: swap;               /* never block render on a footer face */
  }

  .closer {
    background: var(--color-surface);
    color: var(--color-fg);
    text-align: center;
    padding-block: var(--space-8);
    padding-inline: var(--space-6);
  }
  .closer__inner {
    max-width: var(--container-md);
    margin-inline: auto;
  }

  /* the register shift lives entirely on these two elements */
  .closer__title {
    font-family: "BrandDisplay", var(--font-sans);
    font-size: var(--text-5xl);
    line-height: var(--leading-tight);
    margin: 0 0 var(--space-5);
  }
  .closer__lede {
    font-family: "BrandDisplay", var(--font-sans);
    font-size: var(--text-xl);
    line-height: var(--leading-snug);
    margin: 0 auto var(--space-6);
  }

  /* CTA row stays in the normal UI register: solid + outline */
  .closer__cta { display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap; }
  .btn {
    font-family: var(--font-sans);    /* buttons do NOT inherit the display face */
    font-weight: var(--weight-medium);
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-md);
    border: 1px solid transparent;
  }
  .btn--solid   { background: var(--color-fg); color: var(--color-bg); }
  .btn--outline { background: transparent; color: var(--color-fg); border-color: var(--color-accent); }
</style>

<section class="closer">
  <div class="closer__inner">
    <h2 class="closer__title">Fix It</h2>
    <p class="closer__lede">
      Get started with the only platform that lets developers fix problems
      without compromising on velocity.
    </p>
    <div class="closer__cta">
      <a class="btn btn--solid" href="#">Try it for free</a>
      <a class="btn btn--outline" href="#">Get a demo</a>
    </div>
  </div>
</section>
```
