---
pattern: labeled-hairline-divider
from: shadcn-login
corpus: production
safety: production-safe
tags: [forms, auth, navigation, divider]
---

## What it is
A horizontal separator with a short label centered on it — e.g. **"Or continue with"** between a primary form and its alternative (social) actions. The rule passes *behind* the label while the label's background masks the line, so the text appears to float on a single continuous hairline.

## Why it works
It communicates "second path, equal tier" in one glance without a heavy heading or a filled band. Built from flex + a pair of `border-top` rules (or a pseudo-element line), it needs no fixed widths and adapts to any container — and it uses only the hairline tone already in the system, so it adds structure without adding ink. Reusable anywhere you fork a flow: "or", "then", a date break in a feed, a section marker.

## Reference implementation
```html
<div class="divider" role="separator" aria-label="Or continue with">
  <span class="divider-label">Or continue with</span>
</div>

<!-- the alternative actions this divider introduces -->
<div class="provider-row">
  <button class="btn-outline" aria-label="Login with Apple"><!-- icon --></button>
  <button class="btn-outline" aria-label="Login with Google"><!-- icon --></button>
  <button class="btn-outline" aria-label="Login with Meta"><!-- icon --></button>
</div>

<style>
  .divider {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    color: var(--color-muted);
    font-size: var(--text-sm);
    margin: var(--space-5) 0;
  }
  /* the rule: a hairline on each side of the centered label */
  .divider::before,
  .divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--color-border);          /* same hairline as the card edge */
  }
  .divider-label { white-space: nowrap; }

  /* equal-width outlined icon buttons — fill-swap on hover, no chroma */
  .provider-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-3);
  }
  .btn-outline {
    height: 44px;                             /* ≥44px hit area */
    display: grid; place-items: center;
    background: var(--color-surface);
    color: var(--color-fg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-standard);
  }
  .btn-outline:hover { background: var(--color-surface-2, #f5f5f5); }  /* swap to muted accent */
  .btn-outline:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-focus-ring, rgba(163,163,163,0.4));
  }

  @media (prefers-reduced-motion: reduce) {
    .btn-outline { transition: none; }
  }
</style>
```
