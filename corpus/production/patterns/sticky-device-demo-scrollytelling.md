---
pattern: sticky-device-demo-scrollytelling
from: cashapp
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [hero, app-marketing, scrollytelling, motion]
---

## What it is
A product device (phone, browser, card) sits in the center column and **pins** to the viewport while the user scrolls a tall track. As scroll advances, the device's *on-screen content* swaps between app states (balance → card → offers), while flanking text columns hold their position. One device, many features, one continuous read — instead of three disconnected screenshots.

## Why it works
The device staying still while its screen changes mimics how someone actually uses the app: the hardware is constant, the UI moves. Pinning is just `position: sticky`; the "scrollytelling" is a set of opacity cross-fades driven by which sentinel is in view. Because only `opacity`/`transform` animate (never the wrapper's size or layout), it's cheap and jank-free. Prefer CSS scroll-driven animations or IntersectionObserver over scroll-event handlers.

## Reference implementation
```html
<section class="demo-track">
  <!-- flanking copy holds while the device pins -->
  <aside class="demo-copy demo-copy--lead">
    <h2>The way money should work</h2>
  </aside>

  <div class="demo-stage">
    <div class="device">               <!-- sticky: pins to viewport center -->
      <div class="screen" data-screen="0"><!-- balance --></div>
      <div class="screen" data-screen="1"><!-- card    --></div>
      <div class="screen" data-screen="2"><!-- offers  --></div>
    </div>
    <!-- invisible sentinels mark each screen's scroll zone -->
    <div class="step" data-step="0"></div>
    <div class="step" data-step="1"></div>
    <div class="step" data-step="2"></div>
  </div>

  <aside class="demo-copy demo-copy--support">
    <p>From getting paid to growing what you've got — effortless and instant.</p>
    <a class="pill" href="#start">Get started →</a>
  </aside>
</section>

<style>
  .demo-track {
    display: grid;
    grid-template-columns: 1fr minmax(320px, 480px) 1fr;
    align-items: start;
    gap: var(--space-32, 32px);
    background: var(--color-brand-field, #00E013);
    padding-block: var(--space-90, 90px);
  }
  .demo-copy { position: sticky; top: 22vh; }      /* side text holds too */

  .device { position: sticky; top: 12vh; aspect-ratio: 9 / 19; border-radius: var(--radius-card, 20px); }
  .screen {
    position: absolute; inset: 0;
    opacity: 0;
    transition: opacity var(--dur-300, 300ms) var(--ease-inout, ease-in-out);
  }
  .screen.is-active { opacity: 1; }                 /* JS toggles this */

  .step { height: 90vh; }                            /* each step = one scroll zone */

  @media (max-width: 720px) {
    .demo-track { grid-template-columns: 1fr; }
    .demo-copy, .device { position: static; }        /* stack; no pin on small screens */
  }

  /* MANDATORY reduced-motion fallback: show all screens stacked, kill the pin/cross-fade */
  @media (prefers-reduced-motion: reduce) {
    .device, .demo-copy { position: static; }
    .screen { opacity: 1; position: relative; transition: none; }
    .step { display: none; }
  }
</style>

<script>
  // Cheap by construction: IntersectionObserver, no scroll handler.
  const screens = [...document.querySelectorAll('.screen')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    const activate = i => screens.forEach((s, n) => s.classList.toggle('is-active', n === Number(i)));
    activate(0);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) activate(e.target.dataset.step); });
    }, { threshold: 0.6 });          // matches site's 0.51–0.75 thresholds
    document.querySelectorAll('.step').forEach(s => io.observe(s));
  }
</script>
```
