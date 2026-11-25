---
pattern: count-up-stat
from: warp
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, in-view, stat, metric, number, feature-section, dashboard]
---

## What it is
A metric (3,200 teams, 98%, $4.2M) counts up from zero to its target the first time it scrolls into view, easing as it goes so it decelerates into the final figure rather than ticking linearly. The number is rendered in a tabular-figure font so digits do not jitter sideways while they change. Crucially, the real final value is what ships in the markup; the JS only animates toward a value that is already there.

## Why it works
Because the resting value lives in the DOM, the stat is correct with no JavaScript, before hydration, and for reduced-motion users, the animation is pure enhancement layered on a working number. A single IntersectionObserver triggers the count once on entry (no scroll handler, no continuous work), and an easeOutCubic curve makes the run feel like it arrives and settles rather than stopping dead. Updates touch only `textContent` and the value is read once from a data attribute, so there is no layout thrash from the digits themselves; `tabular-nums` fixes each glyph to one advance width so the count does not visibly shift as it climbs. Keep the run around a second: long enough to register as motion, short enough not to make the reader wait.

## Reference implementation
```html
<style>
  .count { font-variant-numeric: tabular-nums; }  /* digits keep a fixed width */
</style>

<!-- Final value is in the DOM: correct with no JS / reduced motion -->
<div class="stat"><span class="count" data-to="3200">3,200</span> teams</div>
<div class="stat"><span class="count" data-to="98" data-suffix="%">98%</span> replies drafted</div>
<div class="stat"><span class="count" data-prefix="$" data-to="4.2" data-decimals="1" data-suffix="M">$4.2M</span> forecast</div>

<script>
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);   // easeOutCubic: decelerate into target

  function countUp(el) {
    const to = parseFloat(el.dataset.to || '0');
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const fmt = (v) => pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString()) + suf;

    if (reduce) { el.textContent = fmt(to); return; }   // already-final value, no run

    const dur = 1000, t0 = performance.now();
    const step = (t) => {
      const p = clamp((t - t0) / dur);
      el.textContent = fmt(easeOut(p) * to);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Run once when the stat enters view. No scroll listener.
  document.querySelectorAll('.count').forEach((el) => {
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      countUp(el);
      o.unobserve(el);
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    o.observe(el);
  });
</script>
```
