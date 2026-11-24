---
pattern: plan-choice-card-pair
from: stripe-checkout
corpus: production
safety: production-safe
trigger: hover
tags: [feature-section, card, selection, onboarding]
---

## What it is
Two (or more) side-by-side selectable cards for a fork-in-the-road choice — integration type, plan, template, theme. Each card carries a small tag-chip row, a title + one-line subtitle, a short checkmark feature list, and (optionally) an image well up top. Selecting a card is **additive**: it gains an accent ring and its image well fades in a gradient tint — no layout shift, no text-color swap, fully reversible.

## Why it works
Pickers fail when the selected state moves things or recolors text, forcing the eye to re-parse both cards. Here the resting and selected states share identical geometry and typography; selection adds only an `outline` ring and an `opacity` fade on the image well — both compositor-cheap and instantly reversible. The tag chip answers "how much effort?" before the title answers "what is it?", and the checklist gives 2–3 concrete reasons in scannable form. One rationed accent color does all the signalling (chip, checkmark, ring), so the chosen card is unmistakable without shouting.

## Reference implementation
```html
<fieldset class="choices" role="radiogroup" aria-label="Choose an integration">
  <label class="choice choice--selected">
    <input type="radio" name="integration" checked class="choice__input" />
    <span class="choice__well" aria-hidden="true"></span>
    <span class="choice__tags">
      <span class="chip">No code</span><span class="chip">Low code</span>
    </span>
    <span class="choice__title">Full page</span>
    <span class="choice__sub">Launch payments out-of-the-box</span>
    <ul class="choice__features">
      <li>Customize colors and fonts</li>
      <li>Support subscriptions, tax, and more</li>
    </ul>
  </label>

  <label class="choice">
    <input type="radio" name="integration" class="choice__input" />
    <span class="choice__well" aria-hidden="true"></span>
    <span class="choice__tags"><span class="chip">More code</span></span>
    <span class="choice__title">Elements</span>
    <span class="choice__sub">Build a custom flow with UI components</span>
    <ul class="choice__features">
      <li>Use custom CSS to match your brand</li>
      <li>Reduce friction with built-in logic</li>
    </ul>
  </label>
</fieldset>

<style>
  .choices {
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-6, 2rem); border: 0; margin: 0; padding: 0;
  }
  @media (max-width: 640px) { .choices { grid-template-columns: 1fr; } }

  .choice {
    display: flex; flex-direction: column; gap: var(--space-3, 12px);
    padding: var(--space-5, 24px);
    background: var(--color-surface, #ffffff);
    border: 1px solid var(--color-hairline, #d8dee4);
    border-radius: var(--radius-lg, 12px);
    outline: 2px solid transparent; outline-offset: 0;
    cursor: pointer;
    transition: box-shadow var(--duration-base, 200ms) linear,
                outline-color var(--duration-fast, 120ms) linear;
  }
  .choice:hover { box-shadow: 0 3px 6px rgba(0,0,0,.12), 0 7px 14px rgba(48,49,61,.08); }
  .choice__input { position: absolute; opacity: 0; pointer-events: none; }

  /* image well with a tint that only appears when chosen */
  .choice__well {
    height: 140px; border-radius: var(--radius-md, 8px);
    background: var(--color-surface-2, #f5f6f8); position: relative; overflow: hidden;
  }
  .choice__well::after {
    content: ""; position: absolute; inset: 0; opacity: 0;
    background: linear-gradient(70deg,
      rgba(252,252,252,.6), rgba(101,205,234,.6), rgba(187,141,240,.4));
    transition: opacity var(--duration-base, 200ms) linear;
  }

  .choice__tags { display: flex; gap: var(--space-2, 8px); }
  .chip {
    font-size: var(--text-xs, 12px); font-weight: var(--weight-medium, 500);
    color: var(--color-muted, #596171);
    padding: 2px 8px; border: 1px solid var(--color-hairline, #d8dee4);
    border-radius: var(--radius-sm, 6px);
  }
  .choice__title {
    font: var(--weight-bold, 700) var(--text-xl, 1.5rem)/1.33 var(--font-sans, Inter, system-ui, sans-serif);
    color: var(--color-fg, #353a44);
  }
  .choice__sub { font-size: var(--text-base, 1rem); color: var(--color-muted, #596171); }
  .choice__features { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-3, 12px); }
  .choice__features li {
    position: relative; padding-left: 26px;
    font-size: var(--text-sm, 0.875rem); color: var(--color-fg, #353a44);
  }
  .choice__features li::before {
    content: "✓"; position: absolute; left: 0; top: -1px;
    display: grid; place-items: center; width: 16px; height: 16px; border-radius: var(--radius-full, 9999px);
    font-size: 10px; color: var(--color-accent, #675dff); background: color-mix(in srgb, var(--color-accent, #675dff) 16%, #fff);
  }

  /* selected state — additive: ring + revealed tint, nothing moves */
  .choice:has(.choice__input:checked),
  .choice--selected { outline-color: var(--color-accent, #675dff); }
  .choice:has(.choice__input:checked) .choice__well::after,
  .choice--selected .choice__well::after { opacity: 1; }

  .choice__input:focus-visible ~ .choice__title { outline: 2px solid var(--color-focus, #675dff); outline-offset: 2px; }
</style>
```
