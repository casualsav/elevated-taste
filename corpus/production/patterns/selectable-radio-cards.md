---
pattern: selectable-radio-cards
from: stripe-checkout
corpus: production
safety: production-safe
trigger: hover
tags: [forms, onboarding, pricing, selection, card-grid]
---

## What it is

A row of media-topped cards that behave as a single-select radio group — a plan picker, integration/template chooser, or option gate. Each card has a **media well** on top (product screenshot, illustration, or brand gradient), then a taxonomy pill, a bold title, a subtitle, and a short feature checklist. The **selected** card is marked with a 2px accent **outline** (not a border); **unselected** cards fade in a brand-gradient tint over their media well on hover to preview the choice. A single primary button below commits the selection.

## Why it works

Selection state as `outline` instead of `border` is the load-bearing trick: outline is painted outside the box model, so toggling it causes **zero layout shift** — a border swap would nudge the card (and its neighbors) by 2px every time selection moves. The hover gradient reuses a layer that is already painted at `opacity:0`, so previewing a card only animates `opacity` (cheap, GPU-friendly) and the *selected* card simply pins that same tint on permanently — one mechanism, two states. Native `<input type="radio">` under each card keeps it keyboard- and screen-reader-correct while the visible card is the styled label. Transfers to any "pick one" surface: pricing tiers, onboarding paths, template galleries, checkout options.

## Reference implementation

```html
<style>
  .rc-group {
    display: flex;
    gap: var(--space-8, 48px);
    justify-content: center;
    flex-wrap: wrap;
  }
  .rc-card {
    position: relative;
    width: 22.5rem;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    cursor: pointer;
    outline: 2px solid transparent;           /* reserved — no reflow on select */
    outline-offset: -2px;
    transition: outline-color var(--duration-fast) linear;
  }
  /* native radio drives state; visually hidden but focusable */
  .rc-input {
    position: absolute;
    opacity: 0;
    width: 0; height: 0;
  }
  .rc-input:checked + .rc-card { outline-color: var(--color-accent); }
  .rc-input:focus-visible + .rc-card { outline-color: var(--color-focus); }

  .rc-media {
    height: 11rem;
    background: var(--color-surface-2);        /* neutral well; swap for <img> */
    background-size: cover;
    background-position: center;
    position: relative;
  }
  /* brand tint layer — painted, revealed by opacity only */
  .rc-media::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--rc-tint, linear-gradient(70deg, rgba(252,252,252,0.6), rgba(101,205,234,0.6), rgba(187,141,240,0.4)));
    opacity: 0;
    transition: opacity var(--duration-base) linear;
  }
  .rc-input:checked + .rc-card .rc-media::before { opacity: 1; }   /* selected: pinned */

  .rc-body {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-6) var(--space-6);
  }
  .rc-tag {
    align-self: start;
    display: inline-flex;
    gap: var(--space-2);
    padding: var(--space-1) var(--space-3);
    border: 1px solid var(--color-hairline);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    color: var(--color-muted);
  }
  .rc-title { font-size: var(--text-2xl); font-weight: var(--weight-bold); color: var(--color-fg); }
  .rc-sub   { font-size: var(--text-base); color: var(--color-muted); }
  .rc-feats { list-style: none; margin: var(--space-2) 0 0; padding: 0; display: grid; gap: var(--space-3); }
  .rc-feats li { display: flex; gap: var(--space-2); font-size: var(--text-sm); color: var(--color-fg); }
  .rc-check {
    flex: none;
    width: 1rem; height: 1rem;
    display: grid; place-items: center;
    border-radius: var(--radius-full);
    background: var(--rc-check-chip, #e0d9ef);
    color: var(--rc-check-mark, #9966ff);
    font-size: var(--text-xs);
  }
  .rc-commit {
    margin: var(--space-6) auto 0;
    padding: var(--space-2) var(--space-5);
    border: 0; border-radius: var(--radius-md);
    background: var(--color-accent); color: var(--color-accent-fg);
    font-size: var(--text-sm); font-weight: var(--weight-medium);
    cursor: pointer;
    transition: transform var(--duration-fast) linear;
  }
  .rc-commit:active { transform: scale(0.99); }

  /* hover preview only where motion is welcome; selection state is instant regardless */
  @media (prefers-reduced-motion: no-preference) {
    .rc-input:not(:checked) + .rc-card:hover .rc-media::before { opacity: 1; }
  }
  @media (max-width: 62rem) { .rc-group { flex-direction: column; align-items: stretch; } }
</style>

<form class="rc-picker">
  <div class="rc-group">
    <input class="rc-input" type="radio" name="integration" id="opt-fullpage" checked>
    <label class="rc-card" for="opt-fullpage">
      <span class="rc-media" style="background-image:url(/img/full-page.png)"></span>
      <span class="rc-body">
        <span class="rc-tag">No code <span aria-hidden="true">│</span> Low code</span>
        <span class="rc-title">Full page</span>
        <span class="rc-sub">Launch payments out-of-the-box</span>
        <ul class="rc-feats">
          <li><span class="rc-check" aria-hidden="true">✓</span> Customize colors and fonts</li>
          <li><span class="rc-check" aria-hidden="true">✓</span> Support subscriptions, tax, and more</li>
        </ul>
      </span>
    </label>

    <input class="rc-input" type="radio" name="integration" id="opt-elements">
    <label class="rc-card" for="opt-elements">
      <span class="rc-media" style="background-image:url(/img/elements.png)"></span>
      <span class="rc-body">
        <span class="rc-tag">More code</span>
        <span class="rc-title">Elements</span>
        <span class="rc-sub">Build a custom flow with UI components</span>
        <ul class="rc-feats">
          <li><span class="rc-check" aria-hidden="true">✓</span> Use custom CSS to match your brand</li>
          <li><span class="rc-check" aria-hidden="true">✓</span> Reduce friction with built-in logic</li>
        </ul>
      </span>
    </label>
  </div>
  <button class="rc-commit" type="submit">View demo</button>
</form>
```
