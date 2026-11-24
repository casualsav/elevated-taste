---
pattern: char-cell-marquee
from: mschf
corpus: expressive
safety: spectacle-only
trigger: hover
tags: [motion, marquee, ticker, overflow, monospace, catalog, data-table]
---

## What it is

A marquee for text that overflows a fixed-`ch` column, whose timing function is `steps(n)` where **n is the overflow measured in characters**. The string therefore advances exactly one monospace cell per tick and never renders half-way between cells — it clacks instead of glides, like a split-flap board or a hardware LED ticker. A reversing variant (`alternate`) walks the text out and back rather than looping, so the beginning of the label is never off-screen for long.

## Why it works

Two ideas do the work:

1. **The overflow, not the duration, is the unit.** Measure `scrollWidth - clientWidth` once, divide by the width of one `ch`, and you have both the travel distance (`n * 1ch`) and the step count (`n`). Duration is then `n × step_ms`, so a title that overflows by 3 characters moves for a moment and one that overflows by 40 takes a long walk — every row runs at the *same reading speed* without a single hand-tuned timing. This is what makes it a system rather than a decoration.
2. **`steps()` is the whole aesthetic.** A linear translate reads as an ad banner. Quantizing the same translate to the character grid makes the motion feel like it is being *typeset*, and — because glyphs only ever land on their cell — it stays crisp with no sub-pixel blur. The property animated is `transform` only, so it runs on the compositor.

**Cost — read before shipping.** As found in the wild this runs forever, at ~50s a cycle, on load, with no `prefers-reduced-motion` guard, which means the overflowed half of the label is *unreadable until the animation happens to bring it around*. That is an information-availability bug, not a style choice. The recipe below fixes it: the animation is **paused at rest and runs only on `:hover` / `:focus-within`**, the resting state is a plain `text-overflow: ellipsis`, and reduced-motion users keep the ellipsis and never see the animation. Do not use this on the *only* copy of a critical label — the full string must also exist as an accessible name (`title`, `aria-label`) or in an expanded view.

## Reference implementation

```html
<style>
  .marq {
    /* per-character dwell — the reading speed of the whole system */
    --step-ms: 260ms;
    --overflow-amount: 0;                /* set by JS, in characters */
    display: inline-block;               /* `width` is a no-op on an inline box */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;             /* the resting truth: never animating */
    font-family: var(--font-mono);
    width: var(--marq-col, 33ch);
    max-width: 100%;
  }

  /* --step-ms and --overflow-amount are intrinsic to the effect, not house tokens;
     both always carry an inline fallback so the recipe drops in anywhere. */

  .marq__text {
    display: inline-block;
    transform: translateX(0);
    will-change: transform;
    /* padding-right reserves the travel so the tail can clear the column */
    padding-right: calc(var(--overflow-amount, 0) * 1ch);
  }

  /* Only overflowing rows are animatable, and only while engaged. */
  .marq[data-overflows] { text-overflow: clip; }
  .marq[data-overflows]:hover  .marq__text,
  .marq[data-overflows]:focus-within .marq__text {
    animation: char-cell-marquee
               calc(var(--overflow-amount, 0) * var(--step-ms, 260ms))
               steps(var(--overflow-amount, 0))
               infinite alternate;       /* drop `alternate` for a one-way loop */
  }

  @keyframes char-cell-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(calc(var(--overflow-amount, 0) * -1ch)); }
  }

  /* Mandatory: no motion, no clipped text — fall back to the ellipsis. */
  @media (prefers-reduced-motion: reduce) {
    .marq[data-overflows] { text-overflow: ellipsis; }
    .marq__text { animation: none !important; transform: none; padding-right: 0; }
  }
</style>

<span class="marq" tabindex="0" title="Global Supply Chain Telephone Handbag">
  <span class="marq__text">Global Supply Chain Telephone Handbag</span>
</span>

<script>
  // Measure overflow ONCE per element, in character cells. No scroll or rAF loop:
  // the animation is pure CSS, JS only supplies the integer.
  const cellWidth = (el) => {
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre';
    probe.style.font = getComputedStyle(el).font;
    probe.textContent = '0';
    document.body.append(probe);
    const w = probe.getBoundingClientRect().width;
    probe.remove();
    return w;
  };

  const measure = (marq) => {
    const text = marq.querySelector('.marq__text');
    text.style.paddingRight = '0';                       // measure the bare string
    const ch = cellWidth(text);
    const overflow = Math.ceil((text.scrollWidth - marq.clientWidth) / ch);
    text.style.paddingRight = '';
    if (overflow > 0) {
      marq.style.setProperty('--overflow-amount', overflow);
      marq.dataset.overflows = '';
    } else {
      marq.style.removeProperty('--overflow-amount');
      delete marq.dataset.overflows;
    }
  };

  const all = document.querySelectorAll('.marq');
  // Re-measure only on resize (ch width is vw-independent, but the column isn't).
  const ro = new ResizeObserver((entries) => entries.forEach((e) => measure(e.target)));
  document.fonts.ready.then(() => all.forEach((m) => { measure(m); ro.observe(m); }));
</script>
```
