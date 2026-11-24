---
pattern: in-view-blur-reveal
from: ardor
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, reveal, scroll]
---

## What it is
Elements enter the page out of focus — `opacity:0` + `filter:blur(8px)` — and resolve to sharp+opaque the moment they scroll into view. An IntersectionObserver flips a `data-reveal` attribute (or a class); the de-blur runs on a slightly longer transition than the fade so content "focuses" into place rather than sliding. A companion loop variant drives a composer's placeholder text or a gradient ring the same way (blur-in, hold, blur-out) for ambient "the machine is working" life.

## Why it works
It animates only compositor-friendly properties (`opacity`, `filter`) — no layout, no scroll-event handler, no jank — so it scales to hundreds of targets (this site observes ~388 at threshold 0.35). Blur-to-sharp reads as calm and premium where a `translateY` slide reads as busy; it suggests *resolution* rather than motion, which pairs naturally with "AI generates the real thing" messaging. Reusable on any long scroll page that wants life without movement-sickness.

## Reference implementation
```html
<style>
  .reveal {
    opacity: 0;
    filter: blur(8px);
    transition-property: opacity, filter;
    /* fade slightly faster than the de-blur so it reads as "focusing in" */
    transition-duration: var(--duration-base, 280ms), var(--duration-slow, 560ms);
    transition-timing-function: var(--ease-entrance, cubic-bezier(0,0,0.2,1));
    will-change: opacity, filter;
  }
  .reveal[data-reveal="shown"] { opacity: 1; filter: blur(0.001px); }
  .reveal[data-reveal="settled"] { filter: none; will-change: auto; } /* drop the layer once idle */

  /* Mandatory: no motion → show everything, instantly sharp */
  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; filter: none; transition: none; }
  }
</style>

<div class="reveal">…</div>
<div class="reveal">…</div>

<script>
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target;
        el.dataset.reveal = 'shown';
        el.addEventListener('transitionend', () => { el.dataset.reveal = 'settled'; }, { once: true });
        io.unobserve(el);           // reveal once, then stop watching
      }
    }, { threshold: 0.35 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }
  // reduced-motion path: elements are already visible via the CSS media query — do nothing.
</script>
```

### Loop variant — cycling placeholder / ambient ring
For a hero input whose placeholder cycles through example prompts, or a soft focus ring on it, drive the same blur with a keyframe and pin it under reduced-motion:
```css
@keyframes placeholder-cycle {
  0%   { opacity: 0; filter: blur(6px); transform: translateY(0.9em); }
  12%, 86% { opacity: 1; filter: blur(0); transform: translateY(0); }
  100% { opacity: 0; filter: blur(6px); transform: translateY(-0.9em); }
}
.placeholder-cycle { animation: placeholder-cycle 3.4s var(--ease-standard, cubic-bezier(0.4,0,0.2,1)) both; }
@media (prefers-reduced-motion: reduce) { .placeholder-cycle { animation: none; } } /* show one static prompt */
```
Swap the cycled strings in JS on `animationiteration`. Keep the ring/placeholder on `opacity`/`filter`/`transform` (or an `@property` angle for a conic ring) so it stays GPU-cheap.
