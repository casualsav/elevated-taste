---
pattern: tick-scrubber-indicator
from: aristide
corpus: expressive
safety: production-safe
tags: [chrome, navigation, indicator, decoration, hud]
---

## What it is

A short row of evenly-spaced monospace tick / pipe glyphs (`| | | | | | | |`) sitting in the chrome — on Aristide, centered in the top bar — acting as an ambient gauge: a scrubber, ruler, or progress readout rendered entirely in type. It carries no label, icon, or required animation; it simply *looks like* an instrument scale. It can be purely decorative ("this is a precise system") or wired to a real value, lighting the tick that corresponds to the active item / scroll position.

## Why it works

A regular, monospaced run of ticks reads instantly as a *measuring scale* — the brain maps it to rulers, audio scrubbers, and equalizers — so it signals machinery and precision before the visitor processes any content, and it does so at the cost of one line of text. On a deliberately empty, monochrome page it adds "expensive/intentional" character where a logo flourish or animated loader would add weight and noise. The transferable mechanism: **borrow instrument iconography (ticks, gauges, readouts) to imply a live, navigable system**, and build it from tabular monospace so the marks stay perfectly even with zero assets. Because it is text, it scales, recolors, and themes for free. The discipline: if it's decorative, hide it from assistive tech; if it encodes state (position / index), expose that state as a real, labelled value — a glyph row that *looks* meaningful but announces nothing to a screen reader is the failure mode.

## Reference implementation

```html
<style>
  .scrubber {
    display: inline-flex;
    gap: var(--space-1);                 /* even spacing = the "ruler" read */
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
    color: var(--color-muted);           /* recessive by default */
    user-select: none;
  }

  .scrubber__tick {
    /* each tick is just a vertical bar glyph; tabular metrics keep them even */
    font-variant-numeric: tabular-nums;
  }

  /* the active position lights up in the foreground tint */
  .scrubber__tick[aria-current="true"] {
    color: var(--color-fg);
  }

  /* OPTIONAL ambient shimmer — gauge "alive" cue; gate behind motion pref */
  @media (prefers-reduced-motion: no-preference) {
    .scrubber--live .scrubber__tick {
      animation: scrubber-pulse var(--duration-slow) var(--ease-standard) infinite alternate;
      animation-delay: calc(var(--i) * var(--duration-fast));
    }
  }
  @keyframes scrubber-pulse { to { opacity: 0.5; } }
</style>

<!-- A) DECORATIVE: pure instrument texture, hidden from assistive tech -->
<div class="scrubber" aria-hidden="true">
  <span class="scrubber__tick" style="--i:0">|</span>
  <span class="scrubber__tick" style="--i:1">|</span>
  <span class="scrubber__tick" style="--i:2">|</span>
  <span class="scrubber__tick" style="--i:3">|</span>
  <span class="scrubber__tick" style="--i:4">|</span>
  <span class="scrubber__tick" style="--i:5">|</span>
  <!-- …as many ticks as the scale needs… -->
</div>

<!-- B) STATEFUL: encodes position; expose the real value to assistive tech -->
<div class="scrubber" role="group"
     aria-label="Project 3 of 6" aria-current="step">
  <span class="scrubber__tick">|</span>
  <span class="scrubber__tick">|</span>
  <span class="scrubber__tick" aria-current="true">|</span>
  <span class="scrubber__tick">|</span>
  <span class="scrubber__tick">|</span>
  <span class="scrubber__tick">|</span>
</div>
```

> Token note: spacing, size, weight, color and any motion all come from `var(--token)`s — no per-tick magic numbers. Variant A is the literal Aristide capture (decorative, `aria-hidden`); variant B shows the production-correct way to make the same glyph row carry real state.
