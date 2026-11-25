---
pattern: ghost-watermark-marquee
from: wokine
corpus: expressive
safety: spectacle-only
tags: [decoration, marquee, section-break, brand-experience, motion]
---

## What it is

A section-break / outro field built entirely from one **oversized word repeated across several stacked rows** at very low ink opacity (~6%), each row drifting horizontally and offset from its neighbour, with a small glyph (a 4-point sparkle "✦") punctuating the repeats. On the exemplar it spells "Inside Wokine ✦ Inside Wokine ✦…" filling a full viewport block as a ghosted watermark behind/around nothing — it *is* the content of the band. Unlike a single-line ticker or a vertical receding column, this is a **multi-row horizontal field** that reads as ambient texture: present, branded, never in focus.

## Why it works

It turns dead space (the gap before a footer, a chapter break) into a branded moment for almost no cost — it is just text, opacity, and a transform. Because the contrast is deliberately low, the word registers as *atmosphere*, not as a message competing with real headlines, so it can be huge without overwhelming the page; the slow horizontal drift adds life without asking for attention; and the repeated glyph gives the field rhythm so it doesn't read as a mistake. The mechanism is fully general: any brand word + N offset rows + a low-opacity fill + a marquee animation yields an ownable section-break texture. The cost is that it is pure ornament — illegible by design, an ongoing GPU/battery draw while animating, and meaningless to assistive tech — so it must be `aria-hidden`, must pause off-screen, and must collapse to a static (or absent) state under reduced-motion. **Use it to brand empty space; never put navigation, copy, or anything load-bearing inside it.**

## Reference implementation

```html
<!-- Multi-row ghosted brand watermark that drifts. Decoration only. -->
<style>
  .watermark {
    overflow: hidden;
    padding-block: var(--space-9);
    background: var(--color-bg);
    /* the field is decoration; it carries no semantics */
  }

  .watermark__row {
    display: flex;
    white-space: nowrap;
    width: max-content;

    color: var(--color-ghost-text, rgba(24,23,23,0.06));              /* ~6% ink — atmosphere, not message */
    font-family: var(--font-sans);
    font-size: clamp(var(--text-4xl), 16vw, var(--text-display));
    font-weight: var(--weight-regular);
    letter-spacing: var(--tracking-tight);       /* big type wants tight tracking */
    line-height: var(--leading-tight);

    /* continuous horizontal drift; alternate rows go the other way */
    animation: drift 30s linear infinite;
  }
  .watermark__row:nth-child(even) {
    animation-direction: reverse;
    margin-inline-start: var(--space-8);          /* stagger so rows don't align */
  }

  .watermark__unit { padding-inline-end: var(--space-7); }
  .watermark__glyph { color: var(--color-accent); } /* the lone spot of hue, optional */

  /* duplicate the unit run inside each row so the loop is seamless */
  @keyframes drift {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* pure ornament: kill it entirely when motion is unwelcome */
  @media (prefers-reduced-motion: reduce) {
    .watermark__row { animation: none; }
  }
</style>

<!-- aria-hidden: this is texture, invisible to assistive tech -->
<section class="watermark" aria-hidden="true">
  <!-- 3–5 rows; each row repeats the unit twice for a seamless -50% loop -->
  <div class="watermark__row">
    <span class="watermark__unit">Inside Wokine <span class="watermark__glyph">✦</span></span>
    <span class="watermark__unit">Inside Wokine <span class="watermark__glyph">✦</span></span>
    <span class="watermark__unit">Inside Wokine <span class="watermark__glyph">✦</span></span>
    <span class="watermark__unit">Inside Wokine <span class="watermark__glyph">✦</span></span>
  </div>
  <div class="watermark__row">
    <span class="watermark__unit">Inside Wokine <span class="watermark__glyph">✦</span></span>
    <span class="watermark__unit">Inside Wokine <span class="watermark__glyph">✦</span></span>
    <span class="watermark__unit">Inside Wokine <span class="watermark__glyph">✦</span></span>
    <span class="watermark__unit">Inside Wokine <span class="watermark__glyph">✦</span></span>
  </div>
  <div class="watermark__row">
    <span class="watermark__unit">Inside Wokine <span class="watermark__glyph">✦</span></span>
    <span class="watermark__unit">Inside Wokine <span class="watermark__glyph">✦</span></span>
    <span class="watermark__unit">Inside Wokine <span class="watermark__glyph">✦</span></span>
    <span class="watermark__unit">Inside Wokine <span class="watermark__glyph">✦</span></span>
  </div>
</section>
<!-- Tip: pause the animation when the section leaves the viewport (IntersectionObserver) to save battery. -->
```
