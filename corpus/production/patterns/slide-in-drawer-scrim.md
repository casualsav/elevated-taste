---
pattern: slide-in-drawer-scrim
from: mcmaster
corpus: production
safety: production-safe
trigger: tap
tags: [navigation, drawer, overlay, motion, disclosure]
---

## What it is

An off-canvas panel that slides in from the page edge over a scrim that dims everything beneath it. The panel and the scrim both exist in the DOM at rest, both are `position: fixed`, and both are *inert* when closed — the scrim sits at `opacity: 0; pointer-events: none`, so it costs nothing and intercepts nothing. Opening is a single class flip: the panel translates in, the scrim fades up and becomes clickable. This is the whole motion budget of a page that otherwise animates nothing.

## Why it works

- **Motion that narrates a state change is earned; motion that narrates your taste is a tax.** A drawer *is* a second surface arriving over the first. Animating its arrival is the one case where the movement carries information — the direction of travel tells the user where the thing came from and, therefore, where dismissing it will send it back.
- **The scrim does two jobs at once.** Visually it demotes the page rather than replacing it, preserving context. Functionally it is the click-out dismissal target. Both are free once you stop treating it as decoration: at rest it is a zero-cost, zero-paint, pointer-transparent layer.
- **Translate, don't offset.** The instinct (and the source site's actual code) is `transition: left 0.3s` — but `left` triggers layout on every frame of a 300ms animation, on a panel containing a long list. `transform: translateX()` runs on the compositor. Same visual, no reflow.
- **Reduced motion still needs the disclosure.** The mistake is disabling the transition and shipping nothing. Under `prefers-reduced-motion`, the drawer must still *appear* — instantly, in its end state. The information is not optional; only the travel is.

## Reference implementation

```html
<button class="drawer-toggle" aria-expanded="false" aria-controls="catalog-drawer">Browse catalog</button>

<div class="scrim" data-scrim hidden></div>

<aside id="catalog-drawer" class="drawer" aria-label="Catalog" aria-hidden="true">
  <header class="drawer__head">
    <button class="drawer__close" aria-label="Close catalog">&times;</button>
  </header>
  <nav class="drawer__list"><!-- category tiles --></nav>
</aside>
```

```css
.scrim {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--color-fg);
  opacity: 0;
  pointer-events: none;         /* inert at rest — blocks nothing, paints nothing */
  transition: opacity var(--duration-slow) var(--ease-exit);
}
.scrim[hidden] { display: none; }

.drawer {
  position: fixed;
  inset-block: 0;
  inset-inline-start: 0;
  z-index: 101;
  width: min(var(--drawer-w, 400px), 90vw);
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  box-shadow: var(--shadow-lg);
  transform: translateX(-100%);  /* compositor-only; never animate `left` */
  visibility: hidden;
  transition:
    transform var(--duration-slow) var(--ease-entrance),
    visibility 0s linear var(--duration-slow);
}

.drawer__list { overflow-y: auto; }

/* Open state — one class on <html> or a shared ancestor drives both layers. */
.is-drawer-open .scrim {
  opacity: 0.45;
  pointer-events: auto;         /* now it is the click-out target */
}
.is-drawer-open .drawer {
  transform: translateX(0);
  visibility: visible;
  transition:
    transform var(--duration-slow) var(--ease-entrance),
    visibility 0s;
}

/* Mandatory: the drawer still opens, it just doesn't travel. */
@media (prefers-reduced-motion: reduce) {
  .scrim,
  .drawer,
  .is-drawer-open .drawer {
    transition: none;
  }
}
```

```js
const html = document.documentElement;
const drawer = document.getElementById('catalog-drawer');
const scrim = document.querySelector('[data-scrim]');
const toggle = document.querySelector('.drawer-toggle');
const close = drawer.querySelector('.drawer__close');
let lastFocused = null;

function open() {
  lastFocused = document.activeElement;
  scrim.hidden = false;
  // next frame, so the transition has a `from` value to animate out of
  requestAnimationFrame(() => html.classList.add('is-drawer-open'));
  drawer.setAttribute('aria-hidden', 'false');
  toggle.setAttribute('aria-expanded', 'true');
  close.focus();
}

function dismiss() {
  html.classList.remove('is-drawer-open');
  drawer.setAttribute('aria-hidden', 'true');
  toggle.setAttribute('aria-expanded', 'false');
  lastFocused?.focus();
  drawer.addEventListener('transitionend', () => { scrim.hidden = true; }, { once: true });
}

toggle.addEventListener('click', open);
close.addEventListener('click', dismiss);
scrim.addEventListener('click', dismiss);          // the scrim IS the dismissal affordance
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && html.classList.contains('is-drawer-open')) dismiss();
});

// Keep Tab inside the open drawer.
drawer.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const stops = drawer.querySelectorAll('a[href], button, input, [tabindex]:not([tabindex="-1"])');
  if (!stops.length) return;
  const [first, last] = [stops[0], stops[stops.length - 1]];
  if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
});
```

**Notes on reuse**

- Under reduced motion the `transitionend` in `dismiss()` never fires (there is no transition), so the scrim would never re-hide. Either drop the `hidden` toggle and rely on `pointer-events: none`, or guard with `matchMedia('(prefers-reduced-motion: reduce)').matches` and hide synchronously. The `hidden` attribute is a belt-and-braces optimization, not the mechanism — the mechanism is `pointer-events`.
- `visibility` is transitioned with a `0s` delay on the way in and a `--duration-slow` delay on the way out. That keeps the closed drawer out of the tab order without killing the exit animation. `display: none` cannot do this.
- If the drawer opens from the right, flip `inset-inline-start` → `inset-inline-end` and `translateX(-100%)` → `translateX(100%)`. Logical properties mean RTL is free.
- The scrim colour is the foreground token at partial alpha, not a dedicated grey. One less token, and it tracks the theme.
