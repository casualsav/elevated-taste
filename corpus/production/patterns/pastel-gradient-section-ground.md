---
pattern: pastel-gradient-section-ground
from: rainbow
corpus: production
safety: production-safe
tags: [section, brand, background, landing]
---

## What it is
A long marketing page is zoned by giving **each section its own soft, full-bleed pastel gradient ground** — sky-blue, lavender, mint, peach — stitched edge to edge with no dividers, boxes, or rules. The grounds are low-saturation and low-contrast against the near-black text, so the page feels color-saturated and branded while staying calm and readable. All the *loud* color is reserved for small objects (icon tiles, CTA pills, product UI) sitting on top.

## Why it works
It separates two jobs that generic pages conflate: **identity** (the ambient color) and **emphasis** (the punchy objects). Because the ground is a wide, smooth gradient at high lightness, it never competes with text or fights the next section — the eye reads the hue *change* as a section boundary, which is why no divider is needed. Rotating the hue per section gives a long page rhythm and a sense of place ("I've moved to a new chapter") without any structural chrome. Transfers to any vivid consumer brand that needs a colorful but non-fatiguing long page.

## Why it works
The mechanism is **lightness budgeting**: keep grounds ≥92% L so body text holds ≥7:1 contrast, vary only hue between sections, and let saturation spike only inside contained elements. That single rule keeps an exuberant palette from ever becoming noise.

## Reference implementation
```html
<style>
  .ground {
    padding-block: var(--space-100, 100px);
    /* full-bleed even inside a constrained container */
    width: 100vw; margin-inline: calc(50% - 50vw);
  }
  .ground > .inner {
    max-width: var(--container, 1100px);
    margin-inline: auto;
    padding-inline: var(--space-32, 32px);
  }

  /* High-lightness pastel washes — vary HUE, hold LIGHTNESS */
  .ground--sky     { background: linear-gradient(180deg, #eef4ff 0%, var(--ground-sky,     #dfe9fb) 100%); }
  .ground--lavender{ background: linear-gradient(180deg, #f4f2fe 0%, var(--ground-lavender, #ecebfb) 100%); }
  .ground--mint    { background: radial-gradient(120% 120% at 50% 100%, var(--ground-mint, #e3f3ec) 0%, #f4f7f6 100%); }
  .ground--peach   { background: linear-gradient(180deg, #fff6f0 0%, var(--ground-peach,   #fdeee4) 100%); }

  .ground h2 { font: 800 clamp(2.25rem, 6vw, 3.5rem)/1.05 var(--font-rounded, system-ui);
               letter-spacing: -0.02em; color: var(--fg, #0f101a); }
  .ground p  { font: 500 1.25rem/1.5 var(--font-rounded, system-ui); color: var(--muted, #777885); }
</style>

<section class="ground ground--lavender">
  <div class="inner">
    <h2>Effortlessly manage<br>hundreds of wallets</h2>
    <!-- saturated objects (tiles, pills, product UI) live here, on the calm ground -->
  </div>
</section>
<section class="ground ground--mint"><div class="inner"><!-- next chapter, new hue --></div></section>
<section class="ground ground--peach"><div class="inner"><!-- … --></div></section>
```
