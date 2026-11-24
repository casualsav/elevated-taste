---
pattern: scroll-linked-ticker-band
from: headspace
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, marquee, footer, feature-section, landing, brand-experience]
---

## What it is
A full-bleed band of saturated color carrying a short brand phrase repeated across the viewport, separated by a small glyph. The strip translates horizontally **as a function of scroll progress** — not on a timer — so it drifts while the visitor scrolls and stops dead when they stop. Headspace drops one between the enterprise section and the content library: a sunflower band reading "find some headspace · ◠◠ · find some headspace".

## Why it works
Long marketing pages need chapter breaks. A horizontal rule is silent; a centered label is a heading competing with the real headings. A colored band that *says the brand once, decoratively* separates two chapters and spends zero hierarchy doing it — the phrase is deliberately not information, so it costs nothing when skipped.

Binding the travel to scroll rather than to `animation: marquee 20s linear infinite` is the whole difference between production-safe and spectacle:

- **A time-loop moves forever**, including while the visitor is reading the paragraph beside it. Perpetual peripheral motion is a reading tax, a vestibular trigger, and — under WCAG 2.2.2 — content that must be pausable.
- **A scroll-linked strip is a mirror.** It only confirms motion the user is already producing. Stop scrolling and it is a static colored band, which is exactly what it should be at rest.

Build it on `animation-timeline: view()`: the browser drives the transform on the compositor with no scroll listener, no rAF, no main-thread work. The source site hand-rolls it (26 scroll listeners on the page) — the JS fallback below is rAF-coalesced, reads layout once per frame, and only listens while the band is on screen.

Two rules that keep it honest: the strip must contain **enough repetitions to overfill the viewport at both travel extremes** (otherwise the band shows bare ground at one edge), and the repetition must be `aria-hidden` past the first — a screen reader should hear the phrase once, not eight times.

## Reference implementation
```html
<style>
  .ticker {
    /* Full-bleed out of a centered container without a wrapper. */
    width: 100vw;
    margin-inline: calc(50% - 50vw);
    overflow: clip;                /* clip, not hidden: no scroll container is created */
    background: var(--color-band, #ffce00);
    color: var(--color-band-fg, #2d2c2b);
    padding-block: var(--space-5);
    /* The band is a divider, not a landmark — it gets no heading. */
  }

  .ticker__strip {
    display: flex;
    align-items: center;
    gap: var(--space-7);
    width: max-content;
    /* Start shifted left so the strip overfills the viewport at both travel extremes. */
    transform: translate3d(-25%, 0, 0);
    will-change: transform;

    font-family: var(--font-sans);
    font-size: var(--text-3xl);
    font-weight: var(--weight-medium);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-display);
    white-space: nowrap;
    user-select: none;
  }
  .ticker__glyph { flex: none; display: inline-flex; }

  /* Preferred path: compositor-driven, zero JS. Travel is small — the band drifts, it does not race. */
  @supports (animation-timeline: view()) {
    .ticker__strip {
      animation: ticker-drift linear both;
      animation-timeline: view();
      animation-range: entry 0% exit 100%;
    }
    @keyframes ticker-drift {
      from { transform: translate3d(-15%, 0, 0); }
      to   { transform: translate3d(-35%, 0, 0); }
    }
  }

  /* Mandatory. At rest the band is the content; the drift is not. */
  @media (prefers-reduced-motion: reduce) {
    .ticker__strip {
      animation: none !important;
      transform: translate3d(-25%, 0, 0) !important;
      will-change: auto;
    }
  }

  @media (max-width: 48rem) {
    .ticker__strip { font-size: var(--text-xl); gap: var(--space-5); }
  }
</style>

<div class="ticker">
  <div class="ticker__strip">
    <span>find some headspace</span>
    <span class="ticker__glyph" aria-hidden="true">◠◠</span>
    <span aria-hidden="true">find some headspace</span>
    <span class="ticker__glyph" aria-hidden="true">◠◠</span>
    <span aria-hidden="true">find some headspace</span>
    <span class="ticker__glyph" aria-hidden="true">◠◠</span>
    <span aria-hidden="true">find some headspace</span>
    <span class="ticker__glyph" aria-hidden="true">◠◠</span>
    <span aria-hidden="true">find some headspace</span>
  </div>
</div>

<script>
  // Fallback for engines without scroll-driven animations.
  (() => {
    if (CSS.supports('animation-timeline: view()')) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;

    const band = document.querySelector('.ticker');
    const strip = band.querySelector('.ticker__strip');
    let ticking = false;
    let active = false;

    const paint = () => {
      const { top, height } = band.getBoundingClientRect();
      // 0 as the band enters the bottom of the viewport, 1 as it leaves the top.
      const progress = (innerHeight - top) / (innerHeight + height);
      const shift = -15 - progress * 20;            // -15% → -35%, matching the CSS keyframes
      strip.style.transform = `translate3d(${shift}%, 0, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!active || ticking) return;               // one layout read per frame, max
      ticking = true;
      requestAnimationFrame(paint);
    };

    // Only listen while the band is actually near the viewport.
    new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) onScroll();
    }, { rootMargin: '200px' }).observe(band);

    addEventListener('scroll', onScroll, { passive: true });
    reduce.addEventListener('change', (e) => {
      if (!e.matches) return;
      active = false;
      strip.style.transform = '';                   // fall back to the CSS resting position
    });
  })();
</script>
```
