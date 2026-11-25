---
pattern: section-corner-glow-band
from: typeform
corpus: production
safety: production-safe
tags: [feature-section, hero, cta, dark, brand-experience]
---

## What it is
A full-width **dark band** (Typeform uses a warm aubergine, not black) whose depth comes entirely from a **radial bloom anchored to one corner** of the section — `radial-gradient(circle farthest-side at 100% 0, accent, transparent 33%)` — rather than from a centered halo behind a single object or a fixed parallax backdrop. Consecutive dark bands place the bloom on alternating corners (`topright`, `botleft`, `topcenter`), so the page feels lit from shifting directions as you scroll. Each band opens with a small colored eyebrow tag and a serif headline sitting in the lit corner's glow.

## Why it works
On a flat single-scroll page you get depth for free by faking a light source: a corner-anchored gradient reads as illumination spilling in from off-canvas, which lifts the section's content off the ground plane without any JS, extra DOM layers, or GPU-heavy blur. Anchoring to a *corner* (not the center) is the key move — a centered bloom says "spotlight on this object," a corner bloom says "this whole surface is a lit space," which is what a text+media band wants. Alternating the corner between stacked bands keeps a long dark stretch from flattening into one continuous void. Because it's just a background layer, it composites cheaply and never touches the content's own contrast. Transfers to any dark hero, CTA, or feature band that needs richness on a budget.

## Why it works — contrast discipline
The bloom is decorative only: keep real text contrast against the base band color (off-white on aubergine clears AA on its own), so the gradient can be tuned purely for mood without risking legibility where the glow is brightest.

## Reference implementation
```html
<section class="glow-band glow-band--topright">
  <div class="glow-band__inner">
    <p class="glow-band__eyebrow">Growth Flow</p>
    <h2 class="glow-band__title">When the form ends, the flow begins.</h2>
    <p class="glow-band__body">Trigger automated workflows the moment a response lands.</p>
    <a class="glow-band__cta" href="#">Explore Growth Flow</a>
  </div>
</section>

<style>
.glow-band {
  position: relative;
  isolation: isolate;
  background: var(--color-bg-dark, #2a222b);      /* warm aubergine ground */
  color: var(--color-fg-on-dark, #faf9fb);
  padding-block: var(--space-9);
  padding-inline: var(--space-6);
  overflow: hidden;
}
/* the corner bloom — a paint-only pseudo-element, no JS, no blur cost */
.glow-band::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(circle farthest-side at var(--glow-x) var(--glow-y),
              var(--color-bloom, #753a88),
              transparent 33%);
}
.glow-band--topright  { --glow-x: 100%; --glow-y: 0%;   }
.glow-band--botleft   { --glow-x: 0%;   --glow-y: 100%; }
.glow-band--topcenter { --glow-x: 50%;  --glow-y: 0%;   }

.glow-band__inner { max-width: var(--container-lg, 1024px); margin-inline: auto; }
.glow-band__eyebrow {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-caps, 0.06em);
  text-transform: uppercase;
  color: var(--color-eyebrow, #c6a5d6);            /* lightened accent for AA on dark */
  margin: 0 0 var(--space-4);
}
.glow-band__title {
  font-family: var(--font-serif, Georgia, "Times New Roman", serif);
  font-weight: var(--weight-regular);
  font-size: clamp(var(--text-3xl), 5vw, var(--text-5xl, 3.75rem));
  letter-spacing: var(--tracking-display, -0.022em);
  line-height: var(--leading-tight);
  margin: 0 0 var(--space-4);
  max-width: 18ch;
}
.glow-band__body { color: var(--color-muted-on-dark, #d4d1d5); max-width: 46ch; margin: 0 0 var(--space-6); }
.glow-band__cta {
  display: inline-block;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-full);
  background: var(--color-fg-on-dark, #faf9fb);
  color: var(--color-bg-dark, #2a222b);
  text-decoration: none;
  font-family: var(--font-sans);
}
</style>
```
