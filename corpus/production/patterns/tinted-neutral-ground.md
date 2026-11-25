---
pattern: tinted-neutral-ground
from: typeform
corpus: production
safety: production-safe
tags: [color-system, palette, branding, soft]
---

## What it is
A whole-page neutral system where **nothing is `#000` or `#fff`**. The near-black ink and the near-white ground are each nudged toward one brand hue, and every gray between them is derived on the same axis. Typeform sets its ink to `#2a222b` (a warm aubergine) and its light ground to `#faf9fb` (a lavender off-white), with a warm-plum ramp (`#f5f3f6 · #eeecee · #c5c0c6 · #a49da6 · #837a85 · #564b58`) filling the middle. The page reads unmistakably *branded* using only two grounds and one accent — no saturated surfaces required.

## Why it works
Pure `#000`/`#fff` is the fingerprint of an un-designed page: it's what every framework ships by default, and the eye has learned to read it as "no one chose this." Bending the extremes toward a single hue does the opposite — it signals authorship on *every* surface at once, before any accent color, illustration, or logo does its work. Because the tint is small (a few points of saturation, one hue), it never reads as a colored background; it reads as a *temperature*. And deriving the whole gray ramp from the same axis keeps borders, muted text, and disabled states in the family, so nothing looks like it was pasted in from a different system.

Three rules make it hold:

**Keep the tint tiny and single-hue.** The ink and ground should still pass as "black" and "white" at a glance — this is temperature, not color. One hue for both extremes; if the ink leans plum, the white leans plum too.

**Derive the mids, don't pick them.** Every gray (borders, muted copy, surfaces, hairlines) is a step on the *same* hue axis between ink and ground. A neutral gray dropped into a tinted system is the thing that looks broken.

**Spend saturation on the accent, not the surfaces.** Because the grounds are only whispered, one real accent (here a magenta-purple) carries all the signal — eyebrows, tags, glows. Saturated *section grounds* would drown the tint and turn the page loud; keep grounds to the two tinted neutrals and let the accent be the only saturated thing on screen.

The same axis powers the dark bands: the dark ground is simply the ink color used as a full-bleed surface, with the light ground as its text — so dark and light sections are one palette inverted, never two themes.

## Reference implementation
```html
<style>
  .brand {
    /* One hue, two extremes, a ramp between — all on the same axis.
       Fallbacks carry Typeform's plum; swap for your own hue. */
    --ink:        var(--color-fg, #2a222b);          /* near-black, hue-shifted (NOT #000) */
    --ground:     var(--color-bg, #faf9fb);          /* near-white, same hue  (NOT #fff) */
    --surface:    var(--color-surface, #f5f3f6);     /* raised light surface */
    --surface-2:  var(--color-surface-2, #eeecee);   /* nested / hover surface */
    --line:       var(--color-border, #eeecee);      /* hairline / card border */
    --line-strong: var(--color-border-strong, #c5c0c6);
    --muted:      var(--color-muted, #837a85);       /* secondary text, same hue */
    --accent:     var(--color-accent, #9454ab);      /* the ONLY saturated value */

    background: var(--ground);
    color: var(--ink);
    font-family: var(--font-sans);
  }

  /* Cards separate with fill + hairline, never a gray drop shadow. */
  .brand__card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-xl);
    padding: var(--space-6);
  }
  .brand__muted { color: var(--muted); }

  /* Accent is rationed: eyebrows, tags, links — not surfaces. */
  .brand__eyebrow {
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--accent);
  }

  /* Dark band = the ink color used as a full-bleed GROUND, text flips to the light ground.
     One palette inverted, not a second theme. */
  .brand--dark {
    background: var(--ink);
    color: var(--ground);
  }
  .brand--dark .brand__card {
    background: color-mix(in srgb, var(--ink) 88%, white);
    border-color: color-mix(in srgb, var(--ground) 12%, transparent);
  }
  .brand--dark .brand__muted { color: color-mix(in srgb, var(--ground) 64%, transparent); }
</style>

<section class="brand">
  <div class="brand__card">
    <p class="brand__eyebrow">Intelligent forms</p>
    <h2>Build forms at the drop of a prompt</h2>
    <p class="brand__muted">Every neutral here is one hue off gray — the page reads branded before the accent appears.</p>
  </div>
</section>

<section class="brand brand--dark">
  <div class="brand__card">
    <p class="brand__eyebrow">Growth flow</p>
    <h2>When the form ends, the flow begins</h2>
    <p class="brand__muted">Same palette, inverted — the ink becomes the ground.</p>
  </div>
</section>
```
