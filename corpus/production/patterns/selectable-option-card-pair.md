---
pattern: selectable-option-card-pair
from: stripe-checkout
corpus: production
safety: production-safe
trigger: hover
tags: [forms, onboarding, pricing, comparison, selection, cards]
---

## What it is

Two (or more) side-by-side cards presenting mutually-exclusive options — integrations, plans, themes — where the reader picks one and confirms with a single shared CTA below. Each card carries a media/hero region, a metadata chip row, a title + subtitle, and a checkmark feature list. Exactly one card is *selected* at a time (radio semantics); selection and hover are both signalled without moving a single pixel of layout.

## Why it works

- **Selection via `outline`, not a `border` swap.** The selected card gets `outline: 2px solid var(--color-accent)`. Outline is painted outside the box model and takes no space, so toggling it never reflows the card or nudges siblings — the classic jump you get switching between `border:1px` and `border:2px` simply can't happen. It also stacks cleanly on top of the card's resting shadow.
- **One gradient does hover *and* selection.** A single brand gradient lives in the hero pseudo-element at `opacity:0`. Hover an unselected card → it fades to `1`; the selected card renders it at full opacity permanently. Two states, one asset, one animated property (`opacity`) — no image swap, no second color, compositor-cheap.
- **Real radio semantics.** It's a `radiogroup` of `role="radio"` cards driven by arrow keys and `aria-checked`, so it's operable and announced correctly — the visual polish doesn't cost accessibility.
- **A tight type scale keeps two dense cards calm.** Title/subtitle/features stay inside a 14–24px range so nothing competes with the one filled CTA. Transfers to plan pickers, integration/theme choosers, and comparison selectors.

## Reference implementation

```html
<!-- framework-neutral; var(--token) names from /tokens -->
<form class="chooser">
  <div class="chooser__cards" role="radiogroup" aria-label="Choose an integration">
    <label class="opt is-active">
      <input class="opt__input" type="radio" name="integration" value="fullpage" checked>
      <span class="opt__hero"><img src="/full-page.png" alt="Prebuilt full-page checkout preview"></span>
      <span class="opt__body">
        <span class="opt__tags"><span class="chip">No code</span><span class="chip">Low code</span></span>
        <span class="opt__title">Full page</span>
        <span class="opt__sub">Launch payments out-of-the-box</span>
        <span class="opt__feats">
          <span class="feat"><i class="feat__check" aria-hidden="true">✓</i>Customize colors and fonts</span>
          <span class="feat"><i class="feat__check" aria-hidden="true">✓</i>Subscriptions, tax, and more</span>
        </span>
      </span>
    </label>

    <label class="opt">
      <input class="opt__input" type="radio" name="integration" value="elements">
      <span class="opt__hero"><img src="/elements.png" alt="Custom Elements checkout preview"></span>
      <span class="opt__body">
        <span class="opt__tags"><span class="chip">More code</span></span>
        <span class="opt__title">Elements</span>
        <span class="opt__sub">Build a custom flow with UI components</span>
        <span class="opt__feats">
          <span class="feat"><i class="feat__check" aria-hidden="true">✓</i>Custom CSS to match your brand</span>
          <span class="feat"><i class="feat__check" aria-hidden="true">✓</i>Reduce friction with built-in logic</span>
        </span>
      </span>
    </label>
  </div>

  <button class="chooser__cta" type="submit">View demo</button>
</form>
```

```css
.chooser__cards {
  display: flex;
  gap: var(--space-8);              /* generous inter-card gap reads as calm */
  justify-content: center;
  flex-wrap: wrap;
}

.opt {
  position: relative;
  width: 368px;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg);
  box-shadow: var(--shadow-md);
  outline: 2px solid transparent;  /* reserve the ring so selection is a color flip, not a size change */
  cursor: pointer;
  transition: outline-color var(--duration-fast) linear;
}
.opt:has(.opt__input:focus-visible) { outline-color: var(--color-focus); }
.opt.is-active,
.opt:has(.opt__input:checked)      { outline-color: var(--color-accent); }

.opt__input { position: absolute; opacity: 0; pointer-events: none; }

/* Hero + the one gradient that serves both hover and selected states */
.opt__hero {
  position: relative;
  height: 177px;
  display: flex;
  justify-content: center;
  background: var(--color-surface);
  overflow: hidden;
}
.opt__hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(70deg,
    rgba(252,252,252,0.6), rgba(101,205,234,0.6), rgba(187,141,240,0.4)); /* brand wash */
  opacity: 0;
  transition: opacity var(--duration-base) linear;
}
.opt:not(.is-active):hover .opt__hero::before { opacity: 1; }   /* light up on hover */
.opt.is-active .opt__hero::before,
.opt:has(.opt__input:checked) .opt__hero::before { opacity: 1; } /* stay lit when chosen */

.opt__body   { display: flex; flex-direction: column; padding: var(--space-5) var(--space-7); gap: var(--space-2); }
.opt__tags   { display: flex; gap: var(--space-2); }
.chip {
  font-size: var(--text-xs); line-height: 1;
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-muted);
}
.opt__title { font-size: var(--text-xl); font-weight: var(--weight-bold); color: var(--color-fg); }
.opt__sub   { font-size: var(--text-base); color: var(--color-fg); }

.opt__feats { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-2); }
.feat { display: flex; align-items: flex-start; gap: var(--space-2); font-size: var(--text-sm); color: var(--color-fg); }
.feat__check {
  flex: none;
  display: grid; place-items: center;
  width: 16px; height: 16px;
  border-radius: var(--radius-full);
  background: var(--color-check-bg, #e0d9ef);   /* pastel disc — soft "yes" */
  color: var(--color-check-fg, #9966ff);
  font-size: 10px; font-style: normal;
}

.chooser__cta {
  display: block;
  margin: var(--space-6) auto 0;
  min-width: 200px;
  padding: var(--space-2) var(--space-4);
  border: 0; border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: var(--color-accent-fg);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: transform var(--duration-fast) linear;
}
.chooser__cta:active { transform: scale(0.99); }  /* physical press */

/* Selection is a color/opacity change, not motion — nothing to disable.
   The only transitions are the outline color and the gradient fade; both
   are safe to keep, but honor the setting anyway. */
@media (prefers-reduced-motion: reduce) {
  .opt, .opt__hero::before, .chooser__cta { transition: none; }
}

@media (max-width: 992px) {                 /* stack + drop the hero on small screens */
  .opt { width: 100%; }
  .opt__hero { display: none; }
}
```

```js
// Arrow-key roving + reflect selection to the .is-active class.
const group = document.querySelector('.chooser__cards');
const opts = [...group.querySelectorAll('.opt')];
function select(card) {
  opts.forEach(o => {
    const on = o === card;
    o.classList.toggle('is-active', on);
    o.querySelector('.opt__input').checked = on;
  });
}
group.addEventListener('change', e => select(e.target.closest('.opt')));
group.addEventListener('keydown', e => {
  if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
  const i = opts.findIndex(o => o.classList.contains('is-active'));
  const next = opts[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : opts.length - 1)) % opts.length];
  select(next);
  next.querySelector('.opt__input').focus();
  e.preventDefault();
});
```

**Notes on reuse**

- `outline` over `border` is the load-bearing trick. If you truly need a border, reserve it at rest (`border: 2px solid transparent`) and only change its color — same no-reflow guarantee.
- The gradient values are the exemplar's brand wash and carry inline fallbacks; swap them for your own — the mechanism (one gradient, `opacity` 0/1) is what transfers.
- `:has()` drives selection styling with no JS; the script only adds arrow-key roving and the `.is-active` mirror for browsers/logic that want an explicit class. Degrade gracefully if `:has()` is unavailable by toggling `.is-active` in the `change` handler (already done).
