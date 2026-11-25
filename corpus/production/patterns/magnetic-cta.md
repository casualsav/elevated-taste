---
pattern: magnetic-cta
from: house
corpus: production
safety: production-safe
trigger: hover
tags: [motion, hover, pointer, cursor, cta, button, navigation]
---

## What it is
A primary call-to-action that behaves as if it is magnetised to the cursor: as the pointer moves across (and just around) the button, the button eases a short distance toward the pointer, then springs back to rest the instant the pointer leaves. The displacement is a fraction of the cursor's offset from the button center, so the element feels heavier than the cursor and "pulls" rather than "snaps". This is the agency-studio signature popularised by Cuberto and Lusion, applied to a single high-intent target instead of the whole page.

## Why it works
The effect rewards the precise moment a user aims at the action, turning a flat target into something that acknowledges intent before the click. Because the displacement is proportional (about 0.3 of the cursor delta) and capped by how far the pointer can travel over a small element, it reads as polish, not chaos. It is pure progressive enhancement: the listener is `pointermove` on the element itself (not a banned scroll listener, and not a global mousemove), and it is only wired up under `(hover: hover) and (pointer: fine)` and when reduced motion is not requested. On touch devices the feature is never attached, so the button is an ordinary, fully usable CTA with zero overhead. Only `transform` is touched, so every frame stays on the compositor; resetting `transform` on leave lets the browser's own transition ease it home.

## Reference implementation
```html
<style>
  .magnetic {
    /* resting transform; the transition eases the spring-back on pointerleave */
    transform: translate(0, 0);
    transition: transform var(--duration-base) var(--ease-standard);
    will-change: transform;
  }
  /* No motion: hard-disable so the button never shifts and sits at rest. */
  @media (prefers-reduced-motion: reduce) {
    .magnetic { transition: none; transform: none; }
  }
</style>

<a class="magnetic" href="#start">Start free</a>

<script>
  // Progressive enhancement: only on devices with a precise hovering pointer,
  // and only when the user has not asked for reduced motion. Touch = no-op.
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const noMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (fine && !noMotion) {
    const PULL = 0.3; // fraction of cursor offset the button follows (heavier than cursor)
    document.querySelectorAll('.magnetic').forEach((btn) => {
      // pointermove on the element is NOT a scroll listener; it only fires while hovered.
      btn.addEventListener('pointermove', (ev) => {
        const r = btn.getBoundingClientRect();
        const dx = (ev.clientX - (r.left + r.width / 2)) * PULL;
        const dy = (ev.clientY - (r.top + r.height / 2)) * PULL;
        btn.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
      });
      // Spring back: clearing transform lets the CSS transition ease it to rest.
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }
</script>
```
