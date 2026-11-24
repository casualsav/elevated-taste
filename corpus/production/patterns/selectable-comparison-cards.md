---
pattern: selectable-comparison-cards
from: stripe-checkout
corpus: production
safety: production-safe
trigger: hover
tags: [cards, selection, pricing, onboarding, checkout, forms]
---

## What it is
A short row of option cards the user picks between — Stripe Checkout uses two ("Full page" vs "Elements"), but the shape scales to any small set. Each card stacks a **hero panel** (illustration / preview), an **effort chip** that pre-classifies the tradeoff ("No code · Low code" / "More code"), a bold title, a one-line subtitle, and a **checkmark feature list**. Exactly one card is selected; selection is shown by an accent **outline swap**, and hovering an unselected card fades a diagonal pastel gradient into its hero panel. Use it for plan pickers, integration/option grids, template galleries, or any "choose one of a few" step.

## Why it works
The three states a chooser must express — resting, hoverable, selected — are each given a *distinct, non-reflowing* signal: resting is a hairline border, hover is a gradient wash in the hero (a cheap "you could pick this" preview), and selected is a 2px accent outline drawn *inside* the card's box so the grid never shifts. Because selection is an outline, not a fill, the card's content contrast is untouched and the choice stays scannable. The effort chip lets the reader grade each option before reading prose, and the checkmark list keeps the differentiators parallel and skimmable. Everything animates on `opacity`/`box-shadow` only, so it's compositor-cheap and degrades to a correct static layout.

## Reference implementation
```html
<style>
  .options { display: flex; gap: var(--space-7); flex-wrap: wrap; justify-content: center; }

  .option {
    width: 22.5rem; max-width: 100%;
    display: flex; flex-direction: column;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    outline: 2px solid transparent;      /* selection outline lives here — no reflow on select */
    outline-offset: -2px;
    transition: outline-color var(--duration-fast) linear, box-shadow var(--duration-base) linear;
    cursor: pointer;
  }
  .option[aria-pressed="true"] { outline-color: var(--color-accent-indigo, #675dff); }

  /* Hero panel: a pastel gradient wash previews on hover, and shows at rest when selected */
  .option__hero {
    position: relative; height: 11rem;
    background: var(--color-surface-2);
    display: flex; align-items: center; justify-content: center;
  }
  .option__hero::before {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(70deg,
      var(--wash-1, rgba(252,252,252,0.6)),
      var(--wash-2, rgba(101,205,234,0.6)),
      var(--wash-3, rgba(187,141,240,0.4)));
    opacity: 0; transition: opacity var(--duration-base) linear;
  }
  .option:hover:not([aria-pressed="true"]) .option__hero::before,
  .option[aria-pressed="true"] .option__hero::before { opacity: 1; }

  .option__body { display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-5) var(--space-6); }

  .option__chip {
    align-self: flex-start;
    font: var(--weight-medium) var(--text-xs)/1.4 var(--font-sans);
    color: var(--color-muted);
    border: 1px solid var(--color-border); border-radius: var(--radius-sm);
    padding: 2px var(--space-2);
  }
  .option__title    { font: var(--weight-bold) var(--text-2xl)/1.3 var(--font-sans); color: var(--color-fg); margin: var(--space-2) 0 0; }
  .option__subtitle { font: var(--weight-regular) var(--text-base)/1.5 var(--font-sans); color: var(--color-muted); margin: 0; }

  .option__features { list-style: none; margin: var(--space-3) 0 0; padding: 0; display: grid; gap: var(--space-3); }
  .option__features li { display: flex; gap: var(--space-2); font: var(--weight-regular) var(--text-sm)/1.4 var(--font-sans); color: var(--color-fg); }
  .option__check {
    flex: 0 0 auto; width: 1rem; height: 1rem; border-radius: var(--radius-full);
    display: grid; place-items: center;
    background: var(--check-bg, #e0d9ef);
    color: var(--color-accent-lavender, #9966ff);
    font-size: 0.7rem;
  }
</style>

<div class="options" role="group" aria-label="Choose an integration">
  <button class="option" type="button" aria-pressed="true">
    <span class="option__hero"><!-- preview art --></span>
    <span class="option__body">
      <span class="option__chip">No code · Low code</span>
      <span class="option__title">Full page</span>
      <span class="option__subtitle">Launch payments out-of-the-box</span>
      <ul class="option__features">
        <li><span class="option__check" aria-hidden="true">✓</span>Customize colors and fonts</li>
        <li><span class="option__check" aria-hidden="true">✓</span>Support subscriptions, tax, and more</li>
      </ul>
    </span>
  </button>

  <button class="option" type="button" aria-pressed="false">
    <span class="option__hero"><!-- preview art --></span>
    <span class="option__body">
      <span class="option__chip">More code</span>
      <span class="option__title">Elements</span>
      <span class="option__subtitle">Build a custom flow with UI components</span>
      <ul class="option__features">
        <li><span class="option__check" aria-hidden="true">✓</span>Use custom CSS to match your brand</li>
        <li><span class="option__check" aria-hidden="true">✓</span>Reduce friction with built-in logic</li>
      </ul>
    </span>
  </button>
</div>

<script>
  // Single-select: pressing one card clears the others. Framework-neutral.
  const group = document.querySelector('.options');
  group.addEventListener('click', (e) => {
    const card = e.target.closest('.option');
    if (!card) return;
    group.querySelectorAll('.option').forEach((c) =>
      c.setAttribute('aria-pressed', String(c === card)));
  });
</script>
```
