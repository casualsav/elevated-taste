---
pattern: glass-nav-blur-curtain
from: apple
corpus: production
safety: production-safe
trigger: hover
tags: [navigation, motion, glass, disclosure, header]
---

## What it is
A thin fixed navigation bar with a translucent, saturated backdrop-blur fill, plus a **sibling full-viewport curtain** — a `position: fixed; inset: 0` layer sitting one z-index below the bar — that fades from `opacity: 0` to `1` whenever a menu opens, blurring the entire page behind the flyout. Two details make it correct rather than merely pretty: `visibility` is transitioned with `steps(1)` so the inert curtain never intercepts a click during its fade, and the blur is dropped entirely below the tablet breakpoint rather than paid for on phones.

## Why it works
Glass is a z-index annotation, not a decoration. If exactly one surface on the page is translucent, the blur *means* "this floats above your content" — the moment a second element gets `backdrop-filter`, the signal is gone. The curtain extends that grammar: rather than dimming the page with a flat scrim (which reads as "modal, you are blocked"), blurring it reads as "still there, just out of focus" — the right message for a menu you are browsing, not a dialog you must dismiss.

The `steps(1)` trick is the transferable engineering idea. Animating only `opacity` leaves a fully-clickable invisible layer over the page for the whole transition; animating `visibility` with a normal ease does nothing (it's a discrete property). `transition: visibility 320ms step-end` flips it exactly at the boundary — hidden the instant the fade-out completes, visible the instant the fade-in starts (`step-start`). One line, and your overlays stop eating clicks.

Chrome text follows the same restraint: hover raises the ink's **alpha** (`rgba(0,0,0,0.8) → 0.96`) instead of switching to a second gray. Because the value is a tint of whatever ground is behind it, one variable flip (`0,0,0` → `255,255,255`) retargets the whole bar for a dark hero.

## Reference implementation
```html
<style>
  .glassnav {
    position: fixed;
    inset-block-start: 0;
    inset-inline: 0;
    z-index: 100;
    height: var(--glassnav-h, 44px);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-5);
    background: var(--color-nav-glass, rgba(250, 250, 252, 0.8));
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
  }
  /* No @supports for backdrop-filter? Fall back to an opaque bar, never a see-through one. */
  @supports not (backdrop-filter: blur(1px)) {
    .glassnav { background: var(--color-surface-2, #fafafc); }
  }

  .glassnav__link {
    font-size: var(--text-sm);
    text-decoration: none;
    /* Ink-with-alpha, not a gray hex: retarget the whole bar by flipping the channel. */
    color: rgb(var(--glassnav-ink, 0 0 0) / 0.8);
    transition: color var(--duration-base) var(--ease-standard);
  }
  .glassnav__link:hover { color: rgb(var(--glassnav-ink, 0 0 0) / 0.96); }
  .glassnav__link:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 1px;
    border-radius: var(--radius-sm);
  }
  .glassnav--on-dark { --glassnav-ink: 255 255 255; }

  /* The curtain: one z-index below the bar, inert until a menu opens. */
  .glassnav-curtain {
    position: fixed;
    inset: 0;
    z-index: 99;
    opacity: 0;
    visibility: hidden;
    background: var(--color-curtain, rgba(232, 232, 237, 0.4));
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    /* opacity eases; visibility SNAPS at the far end so the layer never eats clicks. */
    transition: opacity var(--duration-slow) var(--ease-standard) 80ms,
                visibility var(--duration-slow) step-end 80ms;
  }
  .glassnav[data-menu-open="true"] ~ .glassnav-curtain {
    opacity: 1;
    visibility: visible;
    transition: opacity var(--duration-slow) var(--ease-standard) 80ms,
                visibility var(--duration-slow) step-start 80ms;
  }

  /* Full-viewport backdrop-filter is the one expensive composite here.
     Drop it on phones rather than pay for it — an opaque sheet reads the same. */
  @media (max-width: 833px) {
    .glassnav,
    .glassnav-curtain { backdrop-filter: none; -webkit-backdrop-filter: none; }
    .glassnav-curtain { background: var(--color-surface-2, #fafafc); }
  }

  /* Mandatory: no fade, no blur — jump straight to the end state. */
  @media (prefers-reduced-motion: reduce) {
    .glassnav__link,
    .glassnav-curtain { transition: none; }
    .glassnav-curtain { backdrop-filter: none; -webkit-backdrop-filter: none; }
  }
</style>

<nav class="glassnav" aria-label="Primary" data-menu-open="false">
  <a class="glassnav__link" href="/">Home</a>
  <button class="glassnav__link" type="button" aria-expanded="false" aria-controls="menu-store">Store</button>
  <a class="glassnav__link" href="/support">Support</a>
</nav>
<div class="glassnav-curtain" aria-hidden="true"></div>

<script>
  const nav = document.querySelector('.glassnav');
  const trigger = nav.querySelector('[aria-controls]');

  const setOpen = (open) => {
    nav.dataset.menuOpen = String(open);
    trigger.setAttribute('aria-expanded', String(open));
  };

  trigger.addEventListener('click', () => setOpen(nav.dataset.menuOpen !== 'true'));
  // Hover opens on pointer devices only — never bind hover as the sole affordance.
  if (window.matchMedia('(hover: hover)').matches) {
    trigger.addEventListener('pointerenter', () => setOpen(true));
    nav.addEventListener('pointerleave', () => setOpen(false));
  }
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
</script>
```
