---
pattern: tonal-band-scroll-field
from: felt
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [layout, page-architecture, long-scroll, section-divider, motion, dark]
---

## What it is

A long page is chunked into chapters without a single divider, card, or shadow. Every section is `background: transparent`; the ground is painted once on the root and stepped through **three or four lightness values of one hue** as you scroll. Sections don't have backgrounds — the *page* has a background, and it changes. Felt runs a ~15,000px page this way on one olive (`#3d521e` → `#36471c` → `#2d3f13` → `#445b23`), with zero `<hr>` elements and one box-shadow in the entire stylesheet.

## Why it works

Section separation is normally paid for with **edges** — a rule, a card border, a shadow, or a hue change. Every edge you add is a thing the eye must classify. Value steps inside one hue give you the chunking without the edge: the reader registers "different chapter" pre-attentively, from ground luminance, and never has to decide whether the boundary means anything.

Two mechanical consequences make it cheap:

- **Transparent sections are portable.** Because no section owns a color, you can reorder, insert, or A/B a section without touching a palette. The ground is a single variable.
- **Hover states stop needing variants.** Interaction surfaces become alpha-white (`rgba(255,255,255,0.2)` fill, `0.15` hairlines) instead of named colors, so one hover rule works over every band. Felt's entire nav does this.

Animating the ground is the optional half. `background-color` is a **paint-only** property — no layout, no composite layer — so one repaint of the root per band boundary is genuinely cheap. The rule that keeps it cheap: drive it on the **root element only**. The same crossfade applied to items in a scrolling list is a repaint storm.

The no-JS baseline (bands declare their own background, hard edges between them) is a legitimate resting state, not a degradation — Felt ships both.

## Reference implementation

```html
<body class="field">
  <section class="band" style="--band: var(--field-ground, #3d521e)">…</section>
  <section class="band" style="--band: var(--field-dark, #36471c)">…</section>
  <section class="band" style="--band: var(--field-darkest, #2d3f13)">…</section>
  <section class="band" style="--band: var(--field-light, #445b23)">…</section>
</body>
```

```css
/* 1. The ground. One variable, painted on the root. */
.field {
  background-color: var(--field, var(--field-ground, #3d521e));
  color: var(--color-fg-on-dark);
  transition: background-color var(--duration-slow) var(--ease-standard);
}

/* 2. Sections own no color — only rhythm. */
.band {
  background: transparent;
  padding-block: var(--space-10);
  padding-inline: var(--space-5);
}
.band > * { max-width: var(--container-lg); margin-inline: auto; }

/* 3. Chrome that must work over EVERY band uses alpha, not hue. */
.band__eyebrow {
  font: var(--weight-medium) var(--text-sm) / 1.2 var(--font-sans);
  text-transform: uppercase;
  letter-spacing: var(--tracking-caps);
  color: var(--color-muted-on-dark);
}
.band__rule { border: 0; border-top: 1px solid var(--color-border-on-dark); }
.band__hover:hover { background-color: var(--color-border-inverse); }

/* 4. No-JS / no-support baseline: hard-edged bands. Also the resting state. */
.field:not(.field--linked) .band { background-color: var(--band, var(--field-ground, #3d521e)); }

/* 5. Reduced motion: never crossfade the ground. Paint the bands and stop. */
@media (prefers-reduced-motion: reduce) {
  .field { transition: none; }
  .band { background-color: var(--band, var(--field-ground, #3d521e)); }
}
```

```js
/* Progressive enhancement: hand the root the band color of whatever section
   currently owns the middle of the viewport. IntersectionObserver, not a
   scroll listener — this fires a handful of times per page, not per frame. */
const field = document.querySelector('.field');
const bands = document.querySelectorAll('.band');

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  field.classList.add('field--linked');

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        field.style.setProperty('--field', getComputedStyle(e.target).getPropertyValue('--band'));
      }
    },
    // Collapse the root to a 1px line across the viewport's middle: only one
    // section can intersect it, so there is no last-write-wins race.
    { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
  );
  bands.forEach((b) => io.observe(b));
}
```

**Picking the steps.** Keep hue and saturation fixed; move lightness only, in steps of roughly 4–8% L. Two steps read as an accident; five stop being legible as a system. Contrast-check the *darkest* band against your body text and the *lightest* against your accent — the accent is what usually breaks first.

**Costs.** `background-color` cannot be animated off the main thread; on the root, at four transitions per page, that is a non-issue, and it is the only place this pattern belongs. Don't stack it with a `backdrop-filter` layer — you'll pay for the blur on every repaint.
