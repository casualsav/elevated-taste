---
pattern: tilt-in-card-reveal
from: fillout
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, feature-section, product-marketing, reveal]
---

## What it is
A product mock (a card, a screenshot fragment, a floating UI panel) that enters the viewport **slightly rotated and faded**, then settles to flat + opaque as it scrolls into view — as if a physical card were being laid down on the page. Fillout uses it on the branding section's tilted "Theme" panel; the resting state keeps a small tilt while the reveal animates the last few degrees away.

## Why it works
A pure fade-up is invisible; a full spin is spectacle. A **small rotation (≤ ~12°) plus opacity** lands in between — it's enough to register as a deliberate, tactile entrance without moving the layout or inducing motion-sickness, and it reads as "this is a real object" which reinforces the product-artifact framing. The mechanism is cheap by construction: an `IntersectionObserver` toggles one class, and the browser animates only `transform` and `opacity` (both compositor-only — no reflow). Gating on the observer (rather than a scroll handler) means it fires once per element and costs nothing on the scroll hot path. Transfers to any hero or feature mock reveal. Keep the angle small, the transform-origin toward a bottom corner (so it "hinges" rather than spins about center), and always ship the reduced-motion rest state.

## Reference implementation
```html
<figure class="tilt-reveal">
  <!-- your product-UI slice / card -->
  <img src="theme-panel.png" alt="Theme editor panel" />
</figure>
```
```css
.tilt-reveal {
  opacity: 0;
  transform: rotate(-8deg) translateY(24px);
  transform-origin: 20% 100%;              /* hinge from a bottom corner, not the center */
  transition:
    opacity var(--duration-slow, 400ms) var(--ease-entrance, cubic-bezier(0, 0, 0.2, 1)),
    transform var(--duration-slow, 400ms) var(--ease-entrance, cubic-bezier(0, 0, 0.2, 1));
  will-change: transform, opacity;
}
.tilt-reveal.is-in {
  opacity: 1;
  transform: rotate(0deg) translateY(0);
}

/* Mandatory: no motion — show the finished, flat, opaque state immediately */
@media (prefers-reduced-motion: reduce) {
  .tilt-reveal { opacity: 1; transform: none; transition: none; }
}
```
```js
// Cheap: one observer, fires once per element (matches the site's rootMargin/threshold)
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }
}, { rootMargin: '200px 0px', threshold: 0 });

document.querySelectorAll('.tilt-reveal').forEach((el) => io.observe(el));
```
