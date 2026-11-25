---
pattern: inline-capture-hero
from: ramp
corpus: production
safety: production-safe
tags: [hero, landing, forms, navigation]
---

## What it is
A left-aligned hero that puts the conversion field *in the hero itself*: a one-weight two-tone headline, a short subhead, then an email input sitting directly above (or beside) a single high-chroma CTA button — no "learn more" maze, the ask is right there. The whole block sits on a flat canvas with a faint low-contrast dotted-grid texture behind it for depth without imagery. On desktop the field + button can sit inline; on mobile they stack full-width.

## Why it works
Top-of-funnel B2B conversion drops with every click between landing and signup; embedding the capture field in the hero collapses that to zero — the visitor can act on the first screen. Keeping the form to *one field + one button* minimizes friction, and spending the page's only accent on that button makes the click target unmissable against the achromatic field. Left alignment (vs. centered) reads as product/utility rather than brochure, and gives the form a natural left edge to align to. The dotted-grid background adds a "blueprint/system" texture at near-zero contrast, so it implies engineering rigor without competing with the type. Transfers to any product-led SaaS landing where email or workspace-name capture is the primary goal.

## Reference implementation
```html
<style>
  .cap-hero {
    --dot: var(--color-border);
    max-width: var(--container-xl);
    margin-inline: auto;
    padding: var(--space-9) var(--space-6);
    background-color: var(--color-bg);
    /* faint dotted-grid texture, low contrast on purpose */
    background-image: radial-gradient(var(--dot) 1px, transparent 1px);
    background-size: var(--space-5) var(--space-5);
  }
  .cap-hero__title {
    max-width: var(--container-md);
    margin: 0;
    font-family: var(--font-sans);
    font-weight: var(--weight-regular);          /* hierarchy = scale + color */
    font-size: var(--text-5xl);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg);
  }
  .cap-hero__title .cont { color: var(--color-muted); }
  .cap-hero__sub {
    max-width: var(--container-content);
    margin: var(--space-4) 0 var(--space-6);
    font-size: var(--text-md);
    line-height: var(--leading-normal);
    color: var(--color-muted);
  }
  .cap-form {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
    max-width: var(--container-sm);
  }
  .cap-form__input {
    flex: 1 1 var(--container-content);   /* clamps to row; never wider than copy */
    min-width: 0;
    font: inherit;
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-fg);
  }
  .cap-form__input:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }
  .cap-form__btn {
    font: inherit;
    padding: var(--space-3) var(--space-5);
    border: 0;
    border-radius: var(--radius-md);
    background: var(--color-accent);
    color: var(--color-accent-fg);               /* dark text on light accent */
    cursor: pointer;
    transition: filter var(--duration-base) var(--ease-standard);
  }
  .cap-form__btn:hover { filter: brightness(0.95); }
  @media (max-width: var(--container-sm)) {
    .cap-hero__title { font-size: var(--text-3xl); }
    .cap-form__input, .cap-form__btn { flex: 1 1 100%; } /* stack full-width */
  }
</style>

<section class="cap-hero">
  <h1 class="cap-hero__title">
    Time is money.
    <span class="cont">Save both.</span>
  </h1>
  <p class="cap-hero__sub">Cards, expenses, bill payments, and banking — in the blink of AI.</p>
  <form class="cap-form" action="#" method="post">
    <label class="sr-only" for="cap-email">Work email</label>
    <input class="cap-form__input" id="cap-email" type="email" name="email"
           autocomplete="email" placeholder="What's your work email?" required>
    <button class="cap-form__btn" type="submit">Get started for free</button>
  </form>
</section>
```

**Safety:** production-safe. CTA text must be dark on the light accent (`--color-accent-fg`) for AA. Always pair the input with a real `<label>` (visually hidden is fine) — placeholder text is not an accessible label. Keep the dotted-grid contrast low enough that it never reduces text legibility. Provide a visible `:focus-visible` ring on both field and button.
