---
pattern: sticky-pin-scrollytelling
from: attio
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, scroll, pin, sticky, scrollytelling, feature-section]
---

## What it is
The backbone of scrollytelling, and the corpus's single most-trodden scroll technique (`sticky-pin` ★★★, 188 across 50 sites). One element pins to a fixed spot in the viewport (`position: sticky; top: 0`) while sibling content keeps scrolling past it, so a caption, chart, or media frame holds steady and gets *narrated* by whatever moves beside it. Attio uses the two-column form: a left caption column ("Continuous context for everyone.", "Explore reporting") stays put while the right column swaps through product fragments - an AI-chat stack, then an integration logo grid, then a reporting chart with a `$2.8M→$0.4M` axis, then funnel hexagons. Teak runs the simplest form, a top nav pinned (`position: fixed`) across the whole scroll while section after section travels under it. Optionally a scroll-driven `animation-timeline: scroll()` adds a progress transform to the pinned thing so it advances *with* the read.

## Why it works
A sticky element is free: the browser keeps it placed during scroll with zero JavaScript and zero reflow, so pinning costs nothing on the hot path. That makes it the cheapest way to buy *narrative time* - the reader's scroll becomes a clock, and the pinned subject is the thing being explained while supporting beats pass by. The pin needs only a tall enough parent to scroll against (the sticky child releases at the parent's bottom edge), so the structure is just "tall track wraps short sticky." When you want the pinned subject to change with progress (Attio's chart redrawing as you descend), drive it with a CSS scroll-driven timeline so it runs on the compositor; never a scroll-event handler (the corpus bans those for their continuous reflows). Keep any progress transform on `transform`/`opacity` only so it stays GPU-composited.

## Reference implementation
```html
<style>
  /* A tall track is the scroll budget; the sticky child holds while it scrolls. */
  .pin-track { position: relative; }

  /* The pinned subject: stays in view via native sticky. top:0 alone is enough;
     this is the part that is cheap and may survive reduced-motion. */
  .pin-subject {
    position: sticky; top: 0;
    height: 100dvh;
    display: grid; place-items: center;
    padding-block: var(--space-7);
  }

  /* The content that scrolls PAST the pinned subject (the narration beats). */
  .pin-scroller { display: grid; gap: var(--space-9); }

  /* Optional: advance the pinned subject WITH scroll progress, on the compositor.
     Applied only where scroll-driven timelines exist; otherwise it rests. */
  @supports (animation-timeline: scroll()) {
    .pin-subject__media {
      transform: translateY(0);
      will-change: transform;
      animation: pin-advance linear both;
      animation-timeline: scroll(nearest);
    }
  }
  @keyframes pin-advance {
    from { transform: translateY(0) scale(1); opacity: 1; }
    to   { transform: translateY(calc(var(--pin-shift, 0px) * -1)) scale(1); opacity: 1; }
  }

  /* Reduced motion: the pin itself is cheap and may stay, but kill any
     progress-driven transform and ship the resting state in the DOM. */
  @media (prefers-reduced-motion: reduce) {
    .pin-subject__media { animation: none; transform: none; }
  }
</style>

<section class="pin-track">
  <aside class="pin-subject">
    <div class="pin-subject__media"><!-- caption / chart / media that holds --></div>
  </aside>
  <div class="pin-scroller">
    <div><!-- beat 1 scrolling past --></div>
    <div><!-- beat 2 --></div>
    <div><!-- beat 3 --></div>
  </div>
</section>
```
