---
pattern: endorsed-wordmark-lockup
from: buildinamsterdam
corpus: expressive
safety: production-safe
tags: [navigation, branding, footer, header]
---

## What it is

A masthead wordmark that carries a *second* brand alongside the primary mark, joined by a thin vertical divider: a large primary logotype ("BiA."), a hairline rule, then a small two-line endorser lockup ("Powered by / FRONT ROW") set in tiny tracked caps. Opposite it on the bar sits an unrelated trust badge ("CERTIFIED SHOPIFY PLUS PARTNER"). The two brands share one baseline and one ink colour; only *size* separates principal from endorser. It is text and a border, nothing more — no logos-as-images, no boxes.

## Why it works

Sub-brands, white-label products, and agency studios constantly need to express a parent/endorser relationship ("X, a Y company" / "X powered by Y") without giving the secondary brand equal billing. Scale does the diplomacy: the principal stays large, the endorser drops to ~11px caps so the relationship is legible but the rank is unambiguous — the eye reads ownership from size, not from layout gymnastics. The hairline divider is the grammatical glue — a vertical rule reads as "in association with" far more cleanly than a slash or parentheses at small sizes, and it costs one `border-left`. Keeping both in the *same* ink and family (only the endorser optionally bumped one weight) makes the pair read as one considered lockup rather than two pasted logos. Putting a separate certification/trust badge at the far end of the same bar uses the masthead as a credibility strip without crowding the lockup. Transferable to any nav or footer for sub-brands, partner-certified studios, acquired products, or "made by" attributions — and it stays crawlable and translatable because it's real text.

## Reference implementation

```html
<style>
  .masthead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-6);
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-sans);
  }

  /* the lockup: principal | endorser */
  .lockup {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
    text-decoration: none;
    color: inherit;
  }
  .lockup__primary {
    font-size: var(--text-lg);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-tight);
    line-height: 1;
  }
  .lockup__divider {
    width: 1px;
    align-self: stretch;               /* full-height hairline = "in association with" */
    background: currentColor;
    opacity: 0.4;
  }
  .lockup__endorser {
    font-size: var(--text-xs);          /* tiny: legible but clearly subordinate */
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    line-height: var(--leading-tight);
  }
  .lockup__endorser span { display: block; } /* "Powered by" over the name */

  /* far-end trust badge — same bar, credibility strip */
  .masthead__badge {
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  @media (max-width: 768px) {
    .masthead__badge { max-width: 12ch; text-align: right; line-height: var(--leading-tight); }
  }
</style>

<header class="masthead">
  <a class="lockup" href="/">
    <span class="lockup__primary">BiA.</span>
    <span class="lockup__divider" aria-hidden="true"></span>
    <span class="lockup__endorser"><span>Powered by</span>Front Row</span>
  </a>
  <span class="masthead__badge">Certified Shopify Plus Partner</span>
</header>
```

> Notes: rank is set purely by `--text-lg` vs `--text-xs` in one ink — do not colour-differentiate the endorser. The divider is a real element (`1px` + `currentColor`), so it inverts correctly on dark stages. Keep everything as live text (not an SVG/PNG lockup) so the relationship stays accessible, translatable, and crawlable.
