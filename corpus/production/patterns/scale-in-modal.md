---
pattern: scale-in-modal
from: stripe-checkout
corpus: production
safety: production-safe
trigger: load
tags: [modal, onboarding, motion, dialog]
---

## What it is

A decision-gate dialog that opens as the product's first frame: a full-viewport scrim fades in while the content panel scales up from a hair under full size (`0.97 → 1`) and settles. It presents one focused choice — an option picker, confirm, or onboarding step — floated on a heavy soft shadow over a dimmed workspace. The entrance is a single ~250ms gesture on a fast-out ease, so attention "lands" on the choice without a jarring pop or a slow fade.

## Why it works

Animating only `opacity` (scrim) and `transform: scale()` (panel) keeps the entrance entirely on the compositor — no layout, no paint thrash — so it stays smooth even on a heavy page. The small scale delta (0.97, not 0.8) plus a decisive ease-out (`cubic-bezier(0.18,1,0.4,1)`, fast start → gentle settle) reads as "arriving and settling," which draws the eye to the panel rather than announcing a transition. Pairing the scrim (recedes the background) with a dramatic ambient shadow (lifts the panel) makes the dialog unmistakably the subject. Because the effect is decorative, it must be gated by `prefers-reduced-motion` — the fallback shows the fully-formed dialog with no movement, losing nothing functional. Transfers to any onboarding gate, confirm dialog, or command palette.

## Reference implementation

```html
<style>
  .sm-overlay {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    z-index: 999;
    opacity: 0;
    transition: opacity var(--duration-base) var(--ease-entrance, cubic-bezier(0.18,1,0.4,1));
  }
  .sm-overlay::before {                     /* scrim */
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
  }
  .sm-panel {
    position: relative;
    max-width: 58.5rem;
    width: calc(100% - var(--space-8, 48px));
    padding: var(--space-9, 40px);
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg, 0 40px 100px rgba(10,37,64,0.2), 0 6px 12px rgba(0,0,0,0.03));
    transform: scale(0.97);
    transition: transform var(--duration-base) var(--ease-entrance, cubic-bezier(0.18,1,0.4,1));
  }
  /* .is-open added on mount (next frame) */
  .sm-overlay.is-open { opacity: 1; }
  .sm-overlay.is-open .sm-panel { transform: none; }

  /* mobile: dock as a bottom sheet */
  @media (max-width: 62rem) {
    .sm-overlay { place-items: end stretch; }
    .sm-panel {
      width: 100%;
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      transform: translateY(100%);
    }
    .sm-overlay.is-open .sm-panel { transform: none; }
  }

  /* mandatory: no motion for users who ask for none — show finished state instantly */
  @media (prefers-reduced-motion: reduce) {
    .sm-overlay, .sm-panel { transition: none; }
    .sm-overlay { opacity: 1; }
    .sm-panel { transform: none; }
  }
</style>

<div class="sm-overlay" id="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
  <div class="sm-panel">
    <h1 id="gate-title">Choose your integration</h1>
    <!-- e.g. drop in the selectable-radio-cards pattern here -->
  </div>
</div>

<script>
  // Trigger the entrance on the next frame so the transition runs from the start state.
  const gate = document.getElementById('gate');
  requestAnimationFrame(() => requestAnimationFrame(() => gate.classList.add('is-open')));
</script>
```
