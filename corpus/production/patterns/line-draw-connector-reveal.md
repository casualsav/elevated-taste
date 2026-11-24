---
pattern: line-draw-connector-reveal
from: thrad
corpus: production
safety: production-safe
trigger: in-view
tags: [feature-section, diagram, motion]
---

## What it is
An in-view entrance family where a section doesn't just fade in — it *assembles*. A horizontal connector line grows from one anchor to another (`scaleX(0)→1`), a leading dot fades in at its origin and a trailing label rides along to its end, and — for schematic graphics — an SVG path draws itself via `stroke-dashoffset`. One shared `IntersectionObserver` arms every element by toggling a single `data-motion-in` attribute, so the whole choreography is declarative CSS with ~10 lines of JS. Thrad uses it to "wire together" an Advertisers ↔ Publishers diagram as the reader scrolls to it.

## Why it works
The growth direction encodes meaning: a line that draws *between* two labels reads as a connection forming, which a plain fade can't say. Because every effect is expressed as `opacity` + `transform` (and one `stroke-dashoffset`), it stays on the compositor — no layout thrash — and the IO gate means it fires once, on arrival, not on every scroll tick. Driving state with a data attribute (not a class per effect) lets rise / line-grow / draw share one observer and one reduced-motion switch.

## Reference implementation
```html
<style>
  .reveal-section { display: grid; gap: var(--space-5); }

  @media (prefers-reduced-motion: no-preference) {
    /* fade-rise: default section entrance */
    [data-motion-rise] {
      opacity: 0;
      transform: translateY(var(--rise-offset, 24px));
      transition:
        opacity var(--duration-slow) var(--ease-entrance) var(--motion-delay, 0s),
        transform 600ms var(--ease-entrance) var(--motion-delay, 0s);
    }
    [data-motion-rise][data-motion-in] { opacity: 1; transform: none; }

    /* line-grow: a rule that draws left→right, with lead dot + trailing label */
    [data-motion-grow] [data-grow-line] {
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 700ms var(--ease-grow, cubic-bezier(.34, 1.4, .64, 1))
                  calc(var(--motion-delay, 0s) + 180ms);
    }
    [data-motion-grow] [data-grow-mark] {
      opacity: 0;
      transition: opacity var(--duration-slow) var(--ease-entrance) var(--motion-delay, 0s);
    }
    [data-motion-grow][data-motion-in] [data-grow-line] { transform: scaleX(1); }
    [data-motion-grow][data-motion-in] [data-grow-mark] { opacity: 1; }

    /* svg-draw: a schematic path that strokes itself in */
    [data-motion-draw] .draw-path {
      stroke-dasharray: 1;
      stroke-dashoffset: 1;            /* pathLength normalized to 1 */
      transition: stroke-dashoffset 2500ms var(--ease-standard) var(--motion-delay, 0s);
    }
    [data-motion-draw][data-motion-in] .draw-path { stroke-dashoffset: 0; }
  }

  .connector { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: var(--space-3); }
  .connector__dot  { inline-size: 8px; block-size: 8px; border-radius: var(--radius-full); background: var(--color-accent); }
  .connector__line { block-size: 1px; background: var(--color-border, var(--color-hairline)); }
  .connector__label{ font: var(--text-sm) / var(--leading-normal) var(--font-sans); color: var(--color-muted); }
</style>

<section class="reveal-section" data-reveal>
  <h2 data-motion-rise>One buy across every AI conversation</h2>

  <div class="connector" data-motion-grow style="--motion-delay: .1s">
    <span class="connector__dot"   data-grow-mark></span>
    <span class="connector__line"  data-grow-line></span>
    <span class="connector__label" data-grow-mark>Advertisers &rarr; Publishers</span>
  </div>

  <svg viewBox="0 0 600 120" fill="none" data-motion-draw aria-hidden="true">
    <path class="draw-path" pathLength="1" d="M20 100 C 200 100, 300 20, 580 20"
          stroke="var(--color-hairline)" stroke-width="1.5" />
  </svg>
</section>

<script>
  // One observer arms every [data-reveal] block; CSS owns the choreography.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.querySelectorAll('[data-motion-rise],[data-motion-grow],[data-motion-draw]')
        .forEach((el) => el.setAttribute('data-motion-in', ''));
      e.target.setAttribute('data-motion-in', '');
      io.unobserve(e.target);                 // fire once
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

  // reduced-motion users: skip the observer, everything is already in its end state
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  }
</script>
```
