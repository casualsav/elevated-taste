---
pattern: scroll-bound-dark-interlude
from: studiofreight
provenance: ingested-skill — video-to-website + frontend-design (2026-06-24)
corpus: expressive
safety: spectacle-only
trigger: scroll-progress
tags: [scroll, stats, overlay, scrim, interlude, motion, count-up]
---

## What it is
Inside a side-zoned scroll-cinema piece (where all text lives in the outer 40% so the canvas keeps the center), there is **one moment where a full-viewport dark scrim fades up to ~0.9** as the section enters, a centered band of counting stats reads over the now-dimmed moving canvas, and the scrim fades back out as the section leaves. It is the **single deliberate exception** to "text never sits in the center" — a punctuation beat that lets the numbers command the whole frame before handing the stage back to the product. Provenance: ingested from the `video-to-website` + `frontend-design` skills.

## Why it works
A scrubbed canvas has an *unknowable* background at any given frame, so text laid directly over its center would fail contrast somewhere. The dark scrim **manufactures a guaranteed legible surface on demand** — and because it's bound to a scroll window, it costs nothing the rest of the time. Rationing it to one interlude is what keeps the "margins hold the apparatus, center holds the spectacle" rule (§5) intact: the center is normally the product's; the interlude *borrows* it, on purpose, once. The dimming also does dramatic work — the product recedes, the metric lands, the product returns — which is far more memorable than a stats row in a card (and avoids the card entirely, per §5).

Drive the scrim's opacity with a **scroll-driven CSS view-timeline** (`animation-timeline: view()`) so it runs on the compositor with no `scroll` listener. The numbers themselves are **not** this pattern's job — delegate them to `count-up-stat` (IntersectionObserver, reduced-motion-aware). Under reduced motion the scrim is simply present at full opacity for that section and the numbers show their final value; nothing scrubs.

## Reference implementation
```html
<!-- Fixed scrim, painted only while the stats section is in view. -->
<div class="interlude-scrim" aria-hidden="true"></div>

<section class="interlude">
  <dl class="interlude__stats">
    <div class="stat">
      <dt class="stat__num" data-value="24" data-decimals="0">0</dt>
      <dd class="stat__unit">hrs</dd><dd class="stat__label">Cold retention</dd>
    </div>
    <div class="stat">
      <dt class="stat__num" data-value="0.4" data-decimals="1">0</dt>
      <dd class="stat__unit">kg</dd><dd class="stat__label">Carry weight</dd>
    </div>
  </dl>
</section>

<style>
  .interlude-scrim {
    position: fixed; inset: 0; z-index: 2; pointer-events: none;
    background: var(--color-surface-inverse); opacity: 0;
  }
  .interlude { position: relative; z-index: 3; min-height: 100svh;
               display: grid; place-items: center; text-align: center;
               color: var(--color-fg-inverse); }
  .interlude__stats { display: flex; gap: var(--space-8); margin: 0; }
  .stat__num   { font-family: var(--font-sans); font-weight: var(--weight-bold);
                 font-size: clamp(var(--text-4xl), 8vw, var(--text-display));
                 line-height: var(--leading-tight); letter-spacing: var(--tracking-tight); }
  .stat__unit  { font-size: var(--text-lg); color: var(--color-muted); }
  .stat__label { font-family: var(--font-mono); font-size: var(--text-xs);
                 letter-spacing: var(--tracking-wide); text-transform: uppercase;
                 color: var(--color-muted); }

  /* Scrim fades up only across this section's pass, on the compositor. */
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .interlude-scrim { animation: scrim linear both; animation-timeline: view();
                         animation-range: cover 15% cover 85%; }
    }
  }
  @keyframes scrim { 0% { opacity: 0; } 25%,75% { opacity: 0.9; } 100% { opacity: 0; } }

  /* Reduced motion: a steady dark panel for this beat, numbers at final value. */
  @media (prefers-reduced-motion: reduce) { .interlude-scrim { opacity: 0.9; } }
</style>
<!-- Counting handled by count-up-stat (IntersectionObserver) — not duplicated here. -->
```

Notes: `0.88–0.92` is the opacity band that keeps the product faintly alive without losing the numbers — full black erases the canvas and the dramatic recession with it. This is the *only* sanctioned center-aligned text in a `canvas-frame-scrub-cinema` build; use it once. Keep the metrics to 2–4 — a wall of counters dilutes the beat.
