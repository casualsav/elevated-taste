---
pattern: dialog-to-bottom-sheet
from: stripe-checkout
corpus: production
safety: production-safe
trigger: load
tags: [modal, dialog, overlay, onboarding, motion, responsive]
---

## What it is

One modal component that arrives two ways depending on viewport: on desktop it **scale-fades in, centered** over a dimmed scrim; on mobile the *same element* **slides up from the bottom edge as a sheet** with rounded top corners. It's used as a first-run decision gate (pick an integration) — a surface that pauses the page and demands one answer before returning you to it. Only the entrance *geometry* changes across breakpoints, not the markup.

## Why it works

- **Match the arrival to the platform's mental model.** A centered dialog reads as "modal decision" on a pointer device; a bottom sheet reads as "drawer pulled up" and lands under the thumb on touch. Serving both from one component (a media query swaps `scale()` for `translateY()`) is far cheaper and more consistent than shipping two dialogs.
- **Depth from a scrim + one big-blur shadow, nothing exotic.** The scrim (`rgba(0,0,0,0.2)`) demotes the page without hiding it; a single deep, soft shadow (`0 40px 100px …`) floats the surface. No backdrop-filter, no blend modes — legible and fast.
- **Compositor-only entrance.** Both forms animate only `transform` + `opacity`, so the open is jank-free even on a heavy page behind it. `scale(0.97) → 1` is a restrained "settle," not a bouncy pop.
- **Accessibility is part of the mechanism, not a bolt-on.** `role="dialog"` + `aria-modal`, initial focus into the dialog, `Esc` and scrim-click to dismiss, focus trapped while open, focus restored on close — and, unlike the source, a `prefers-reduced-motion` fallback that still *shows* the dialog, just without travel.

## Reference implementation

```html
<button data-open-dialog aria-haspopup="dialog">Choose integration</button>

<div class="scrim" data-scrim hidden></div>
<div class="sheet" id="chooser" role="dialog" aria-modal="true" aria-label="Choose an integration" hidden>
  <!-- e.g. the selectable-option-card-pair goes here -->
</div>
```

```css
.scrim {
  position: fixed; inset: 0; z-index: 998;
  background: var(--color-fg);
  opacity: 0; pointer-events: none;            /* inert at rest */
  transition: opacity var(--duration-base) var(--ease-standard);
}
.scrim[hidden] { display: none; }
.is-dialog-open .scrim { opacity: 0.2; pointer-events: auto; }  /* dim + click-out target */

.sheet {
  position: fixed; z-index: 999;
  background: var(--color-bg);
  box-shadow: var(--shadow-lg);
  border-radius: var(--radius-lg);
  /* Desktop: centered, settles up from a slight shrink */
  left: 50%; top: 50%;
  width: min(936px, calc(100vw - var(--space-6)));
  transform: translate(-50%, -50%) scale(0.97);
  opacity: 0;
  transition:
    transform var(--duration-slow) var(--ease-entrance, cubic-bezier(0.18,1,0.4,1)),
    opacity   var(--duration-slow) var(--ease-entrance, cubic-bezier(0.18,1,0.4,1));
}
.sheet[hidden] { display: none; }
.is-dialog-open .sheet { transform: translate(-50%, -50%) scale(1); opacity: 1; }

/* Mobile: same element re-anchors to the bottom and slides up as a sheet */
@media (max-width: 992px) {
  .sheet {
    left: 0; top: auto; bottom: 0;
    width: 100%;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    transform: translateY(100%);
  }
  .is-dialog-open .sheet { transform: translateY(0); }
}

/* Mandatory: the dialog still appears — instantly, in its end state — with no travel. */
@media (prefers-reduced-motion: reduce) {
  .scrim, .sheet { transition: none; }
  .sheet { transform: translate(-50%, -50%); }        /* no scale */
  @media (max-width: 992px) { .sheet { transform: none; } }
}
```

```js
const html = document.documentElement;
const dialog = document.getElementById('chooser');
const scrim = document.querySelector('[data-scrim]');
const opener = document.querySelector('[data-open-dialog]');
let lastFocused = null;

function open() {
  lastFocused = document.activeElement;
  scrim.hidden = false; dialog.hidden = false;
  requestAnimationFrame(() => html.classList.add('is-dialog-open')); // give the transition a `from`
  (dialog.querySelector('a,button,input,[tabindex]:not([tabindex="-1"])') || dialog).focus();
}
function close() {
  html.classList.remove('is-dialog-open');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hide = () => { scrim.hidden = true; dialog.hidden = true; };
  if (reduce) hide();                                  // no transitionend fires under reduced motion
  else dialog.addEventListener('transitionend', hide, { once: true });
  lastFocused?.focus();
}

opener.addEventListener('click', open);
scrim.addEventListener('click', close);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && html.classList.contains('is-dialog-open')) close();
});
dialog.addEventListener('keydown', e => {              // trap Tab while open
  if (e.key !== 'Tab') return;
  const s = dialog.querySelectorAll('a[href],button,input,[tabindex]:not([tabindex="-1"])');
  if (!s.length) return;
  const [first, last] = [s[0], s[s.length - 1]];
  if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
  else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
});
```

**Notes on reuse**

- The scrim color is the foreground token at low alpha, not a dedicated grey — one fewer token and it tracks the theme.
- Under reduced motion `transitionend` never fires, so `close()` guards with `matchMedia` and hides synchronously; without that the scrim would never re-hide.
- Keep the shrink subtle (`scale(0.97)`), not `0.8` — a decision surface should *settle*, not pop. The mobile `translateY(100%)` is the honest "sheet" gesture; don't also scale it.
- For a persistent gate (no dismiss), drop `Esc`/scrim-click and the opener; mount it open. Everything else is unchanged.
