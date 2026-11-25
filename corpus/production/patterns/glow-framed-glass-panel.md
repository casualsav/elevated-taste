---
pattern: glow-framed-glass-panel
from: framer
corpus: production
safety: production-safe
tags: [hero-spectacle, brand-experience, interactive-showcase, dark, glassmorphism]
---

## What it is
A product-UI panel (a toolbar, a card, an app frame) rendered as **frosted glass** — a semi-transparent dark surface with `backdrop-filter: blur` and a faint top-edge highlight — sitting on a **true-black** canvas and wrapped in an **electric-blue glow**: a blurred accent halo behind the panel plus a brighter rim-light catching its top corners. Framer uses it for the floating "Canvas" toolbar above the footer and, in stripped-down radial form, as the blue bloom under the final "Get started" CTA. The glass makes the panel feel like a real, layered piece of software; the glow makes a static screenshot read as a luminous, backlit *object* rather than a flat image pasted on black.

## Why it works
On a pure-black page there is no ambient light, so any figure/ground separation has to be manufactured — a soft accent halo behind an element is the cheapest way to lift it off the void and simultaneously inject the one brand color the rest of the page withholds (restraint elsewhere is what makes the bloom land). Glass (translucency + blur) signals depth and "live UI" the way a flat fill or hard border cannot: the eye reads stacked, light-permeable layers as a system you could reach into. Pairing the two — backlight a glassy surface — converts a marketing screenshot into a hero artifact with almost no content, which is exactly what a tool-for-designers wants its homepage to demonstrate. The mechanism transfers to any single "hero object" moment on a dark page: a CTA, a logo lockup, a featured product frame, an empty-state illustration. The discipline is **scarcity** — one glow per viewport, reserved for the thing you want clicked or believed.

## Production-safety
**production-safe with care.** `backdrop-filter` is widely supported but expensive when the blurred region is large or animated — keep the glass area bounded and prefer a static blur over animating it. The glow is just `box-shadow` / a blurred pseudo-element (cheap, GPU-friendly) — do not animate its blur radius; if it must pulse, animate `opacity`/`transform` only. Provide an opaque fallback fill (`var(--color-surface-2)`) for `@supports not (backdrop-filter: blur())` so the panel never becomes unreadable. The glow is decorative — keep real contrast on the panel's own text (white on the opaque fallback meets AA), never rely on the halo for legibility. Respect `prefers-reduced-motion` for any pulse.

## Reference implementation
```html
<section class="glow-stage">
  <!-- the luminous object: a frosted product panel with an accent rim + halo -->
  <div class="glass-panel">
    <div class="glass-panel__row glass-panel__row--bar">
      <span class="glass-panel__brand">◆ Canvas</span>
      <button class="glass-panel__icon" aria-label="Add">+</button>
    </div>
    <div class="glass-panel__row glass-panel__row--tabs">
      <span class="is-active">Pages</span><span>Layers</span><span>Assets</span>
    </div>
    <div class="glass-panel__row glass-panel__row--search">Search…</div>
  </div>
</section>

<style>
.glow-stage {
  position: relative;
  background: var(--color-bg);            /* true black */
  display: grid;
  place-items: center;
  padding-block: var(--space-10);
  overflow: hidden;
}
/* the halo: a blurred accent bloom behind the panel, the only color on the page */
.glow-stage::before {
  content: "";
  position: absolute;
  inset: auto auto -10% 50%;
  translate: -50% 0;
  width: min(90vw, var(--container-md));
  aspect-ratio: 2 / 1;
  background: radial-gradient(closest-side,
              var(--color-accent) 0%,
              color-mix(in srgb, var(--color-accent) 50%, transparent) 35%,
              transparent 72%);
  filter: blur(60px);
  opacity: 0.45;
  pointer-events: none;
}
.glass-panel {
  position: relative;
  width: min(92vw, var(--container-sm));
  padding: var(--space-5);
  border-radius: var(--radius-xl);
  /* glass: translucent dark fill + frost; opaque fallback below */
  background: color-mix(in srgb, var(--color-surface) 55%, transparent);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  /* top-edge highlight + accent rim light + outer glow */
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 0 0 1px color-mix(in srgb, var(--color-accent) 40%, transparent),
    var(--shadow-glow, 0 0 40px 8px rgba(0,153,255,0.35));                   /* 0 0 40px 8px rgba(accent,.35) */
  color: var(--color-fg);
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-panel { background: var(--color-surface-2); }   /* opaque, still legible */
}
.glass-panel__row { display: flex; align-items: center; gap: var(--space-4);
  padding-block: var(--space-3); }
.glass-panel__row--bar { justify-content: space-between; }
.glass-panel__brand { font-weight: var(--weight-semibold); }
.glass-panel__icon {
  background: var(--color-button-dark-bg, rgba(255,255,255,0.1)); color: var(--color-fg);
  border: 0; border-radius: var(--radius-md); width: 2em; height: 2em; cursor: pointer;
}
.glass-panel__row--tabs span { color: var(--color-subtle); }
.glass-panel__row--tabs .is-active {
  color: var(--color-fg);
  background: var(--color-button-dark-bg, rgba(255,255,255,0.1));
  padding: var(--space-2) var(--space-4); border-radius: var(--radius-md);
}
.glass-panel__row--search { color: var(--color-subtle);
  background: color-mix(in srgb, var(--color-fg) 4%, transparent);
  border-radius: var(--radius-lg); padding: var(--space-4); }

@media (prefers-reduced-motion: reduce) { .glow-stage::before { animation: none; } }
</style>
```
