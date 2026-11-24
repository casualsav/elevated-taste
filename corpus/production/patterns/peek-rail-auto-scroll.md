---
pattern: peek-rail-auto-scroll
from: tend
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, carousel, testimonials, social-proof, feature-section]
---

## What it is
A horizontal rail of cards that drifts continuously to one side while it is on screen, with the neighbouring cards deliberately left half-visible past both edges. Tend uses it for patient reviews (and again for service chips and logos): the centre card is readable, the two beside it are cropped, and the whole set creeps by slowly enough to read.

## Why it works
The **peek is the affordance.** A rail whose cards end flush at the container edge looks like a finished row; users never scroll it, and arrows added afterwards are ignored. Letting the neighbours bleed past the edge makes the set visibly larger than its window, which is the entire argument a testimonial wall is trying to make — *there are more of these than we can show you*. The slow drift then proves the rail is a rail without requiring a gesture.

The mechanics that keep it production-safe rather than obnoxious:
- **Drive `scrollLeft` on a real scroll container**, not a `transform` on a track. You inherit native touch momentum, trackpad scrolling, keyboard focus scroll-into-view and `scroll-snap` for free — and the same DOM works if the script never loads.
- **Only animate while visible.** Gate the rAF loop behind an `IntersectionObserver` so an off-screen rail costs nothing; a marquee that keeps ticking at the bottom of a long page is a battery and jank tax nobody sees.
- **Pause on hover, focus-within, and pointer-down.** Text that slides away while being read is the failure mode of every auto-carousel. Perpetual motion next to body copy also violates WCAG 2.2.2 unless the user can stop it — the hover/focus pause is what makes this pattern usable, not a nicety.
- **Reduced motion downgrades, it does not delete.** Auto-advance stops; the rail stays a manually scrollable, snap-aligned list with the same peeking neighbours. The resting state is always the correct layout.

Speed matters more than anything else here: at roughly 20–30 px/s a card takes many seconds to traverse, which reads as "alive". Above ~60 px/s it reads as a stock ticker and the copy becomes unreadable.

## Reference implementation
```html
<style>
  .peek-rail {
    display: flex;
    gap: var(--space-5);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    /* the peek: first/last card can rest mid-viewport, neighbours bleed out */
    scroll-padding-inline: var(--space-8);
    padding-inline: var(--space-8);
    padding-block: var(--space-5);
    scrollbar-width: none;
    overscroll-behavior-x: contain;
  }
  .peek-rail::-webkit-scrollbar { display: none; }

  .peek-rail__card {
    flex: 0 0 clamp(18rem, 62vw, 48rem);   /* < 100% ⇒ neighbours always peek */
    scroll-snap-align: center;
    background: var(--color-quote-card, #698680);
    color: var(--color-fg-on-dark);
    border-radius: var(--radius-card, 1.5625rem);
    padding: var(--space-7) var(--space-6);
    font-size: var(--text-md);
    line-height: var(--leading-normal);
  }

  /* No-JS / reduced-motion resting state is this exact layout — nothing to undo. */
  @media (prefers-reduced-motion: reduce) {
    .peek-rail { scroll-behavior: auto; }
  }
</style>

<div class="peek-rail" role="region" aria-label="Patient reviews" tabindex="0">
  <blockquote class="peek-rail__card">…</blockquote>
  <blockquote class="peek-rail__card">…</blockquote>
  <blockquote class="peek-rail__card">…</blockquote>
</div>

<script>
  // Auto-drift: a rAF loop gated by IntersectionObserver, paused by the user.
  // Reduced motion never starts it — the rail stays a plain snap-scroller.
  const PX_PER_SECOND = 24;                       // intrinsic: reading pace, not a style token
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.peek-rail').forEach((rail) => {
    let onScreen = false, held = false, last = 0, frame = 0;

    const tick = (now) => {
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      if (!held) {
        rail.scrollLeft += PX_PER_SECOND * dt;
        // seamless-enough loop: jump back when the last card is fully in view
        if (rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1) rail.scrollLeft = 0;
      }
      frame = onScreen ? requestAnimationFrame(tick) : 0;
    };

    const start = () => { if (!frame && onScreen && !reduce.matches) { last = 0; frame = requestAnimationFrame(tick); } };
    const stop  = () => { cancelAnimationFrame(frame); frame = 0; };

    new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      onScreen ? start() : stop();
    }, { threshold: 0 }).observe(rail);

    // WCAG 2.2.2: the user must be able to stop it. Hover, focus and touch all hold.
    const hold = () => { held = true; };
    const release = () => { held = false; };
    rail.addEventListener('pointerenter', hold);
    rail.addEventListener('pointerleave', release);
    rail.addEventListener('pointerdown', hold);
    rail.addEventListener('focusin', hold);
    rail.addEventListener('focusout', release);

    reduce.addEventListener('change', () => (reduce.matches ? stop() : start()));
  });
</script>
```

Give the rail `tabindex="0"` and a `role="region"` + label so keyboard users can reach and arrow-scroll it; that, plus `focusin` pausing the drift, is what makes an auto-advancing rail keyboard-safe. If you add prev/next buttons, move them by `rail.scrollBy({left: cardWidth, behavior: 'smooth'})` rather than by index — the scroll container is already the source of truth.
