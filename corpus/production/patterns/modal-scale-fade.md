---
pattern: modal-scale-fade
from: stripe-checkout
corpus: production
safety: production-safe
trigger: load
tags: [modal, dialog, motion]
---

## What it is
A dialog entrance that reads as "settling in": the scrim fades from transparent while the content panel scales up slightly (`0.97 → 1`) and fades in, both on the same short curve. On small screens the same open swaps to a bottom-sheet that slides up (`translateY(100%) → 0`). It is the calm, non-theatrical way to bring a modal on screen — and, unlike the source site, it ships a `prefers-reduced-motion` fallback that jumps straight to the resting state.

## Why it works
Scaling from `0.97` (not `0.8`) is a *whisper* of motion — enough to signal "new layer arrived" without the bouncy zoom that feels toy-like. Animating only `opacity` and `transform` keeps it on the compositor (no layout/paint), so it stays smooth under a fading scrim. Separating scrim (opacity) from panel (opacity + transform) lets the backdrop establish "the page is now behind glass" a beat before the content resolves. The mobile bottom-sheet reuses the same tokens with a `translateY` instead of a scale, so one motion system covers both form factors.

## Reference implementation
```html
<div class="scrim" data-open>
  <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title">
    <h2 id="dlg-title" class="dialog__title">Choose an integration</h2>
    <!-- content -->
  </div>
</div>

<style>
  .scrim {
    position: fixed; inset: 0; z-index: 99998;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity var(--duration-base, 250ms) var(--ease-standard, cubic-bezier(0.18, 1, 0.4, 1));
  }
  .dialog {
    background: var(--color-surface, #ffffff);
    border-radius: var(--radius-lg, 12px);
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.03);
    padding: var(--space-7, 3rem);
    transform: scale(0.97);
    opacity: 0;
    transition: transform var(--duration-base, 250ms) var(--ease-standard, cubic-bezier(0.18, 1, 0.4, 1)),
                opacity   var(--duration-base, 250ms) var(--ease-standard, cubic-bezier(0.18, 1, 0.4, 1));
  }

  /* open state — toggle [data-open] via JS after mount */
  .scrim[data-open]                { opacity: 1; }
  .scrim[data-open] .dialog        { transform: none; opacity: 1; }

  /* mobile: bottom sheet reusing the same tokens */
  @media (max-width: 640px) {
    .scrim { align-items: flex-end; }
    .dialog {
      width: 100%; border-bottom-left-radius: 0; border-bottom-right-radius: 0;
      transform: translateY(100%);
    }
    .scrim[data-open] .dialog { transform: translateY(0); }
  }

  /* MANDATORY reduced-motion fallback the source omits: no travel, instant */
  @media (prefers-reduced-motion: reduce) {
    .scrim, .dialog { transition-duration: 1ms; }
    .dialog { transform: none; }
  }
</style>

<script>
  // drive open/close by toggling the attribute; render the node first, then flip on next frame
  const scrim = document.querySelector('.scrim');
  function openDialog() { requestAnimationFrame(() => scrim.setAttribute('data-open', '')); }
  function closeDialog() { scrim.removeAttribute('data-open'); }
</script>
```

## Merged in
`scale-in-modal` (a second write-up of the same Stripe Checkout dialog) was folded in here. What it added:
- The same open works as a product's **first frame**: an onboarding gate, a confirm step or a command palette floated over a dimmed workspace.
- A heavy, soft ambient shadow on the panel (large blur, low alpha) lifts it while the scrim pushes the page back, so the dialog is unmistakably the subject.
