---
pattern: warm-inset-elevation
from: decimals
corpus: production
safety: production-safe
tags: [card, surface, elevation, warm]
---

## What it is
A card/pill surface whose elevation is built from a **stack of shadow layers tinted with the page's foreground ink** (not neutral black) and capped by a **bright inset top-highlight**, so it looks printed onto warm paper rather than floating on a screen. It is the warm-ground counterpart to the Stripe-style neutral `soft-elevation-surface`: same layered structure, but every layer borrows the brand's dark hue and adds a lit bevel.

## Why it works
Three cues stacked read as real depth: a **1px inner ring** (`inset 0 0 0 1px` in translucent white) that catches light along the top edge like a beveled card; a **hairline color ring** (`0 0 0 1px` in low-alpha ink) that keeps a crisp edge at any zoom; and a **soft ambient** (`0 2px 6px` in low-alpha ink) for the ground shadow. The critical move is that the ambient shadow carries the *same brown as the text* — a black shadow on a cream field reads cold and "default CSS," while an ink-tinted one reads as warm, intentional print. Because each layer is near-transparent, none is individually visible; the eye just reads "this object sits above the paper." Hover deepens the ambient a notch instead of moving the card.

## Reference implementation
```html
<article class="warm-card">
  <span class="warm-card__kicker">Senior Product Designer</span>
  <h3 class="warm-card__title">Nia Laurent</h3>
  <p class="warm-card__body">Interaction systems with rare taste. Every detail feels intentional.</p>
</article>

<style>
  .warm-card {
    /* warm ground + ink tokens with exemplar fallbacks */
    background: var(--color-surface, #fdfbf6);
    color: var(--color-fg, #4d4638);
    border-radius: var(--radius-lg, 14px);
    padding: var(--space-5, 1.5rem);
    /* inset top-highlight  +  ink hairline ring  +  ink ambient */
    box-shadow:
      rgba(255,255,255,0.82) 0 0 0 1px inset,
      var(--color-hairline, rgba(77,70,56,0.08)) 0 0 0 1px,
      var(--color-hairline, rgba(77,70,56,0.08)) 0 2px 6px 0;
    transition: box-shadow var(--duration-base, 220ms) var(--ease-standard, cubic-bezier(0.2,0.78,0.22,1)),
                transform   var(--duration-base, 220ms) var(--ease-standard, cubic-bezier(0.2,0.78,0.22,1));
  }
  .warm-card:hover {
    transform: translateY(-1px);
    box-shadow:
      rgba(255,255,255,0.90) 0 1px 0 0 inset,
      var(--color-hairline, rgba(77,70,56,0.08)) 0 0 0 1px,
      var(--color-hairline, rgba(77,70,56,0.08)) 0 8px 22px 0;   /* one deeper ambient layer */
  }
  .warm-card__kicker {
    font: 700 var(--text-xs, 0.75rem)/1 var(--font-mono, ui-monospace, monospace);
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: var(--color-muted, rgba(77,70,56,0.6));
  }
  .warm-card__title { font: 400 var(--text-2xl, 1.75rem)/1.1 var(--font-serif, "MartinaPlantijn", Georgia, serif); }
  .warm-card__body  { color: var(--color-muted, rgba(77,70,56,0.6)); }

  @media (prefers-reduced-motion: reduce) {
    .warm-card { transition: none; }
    .warm-card:hover { transform: none; }
  }
</style>
```
