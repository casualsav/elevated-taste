---
pattern: scroll-blur-word-reveal
from: pitch
corpus: production
safety: spectacle-only
trigger: in-view
tags: [motion, scroll, type, reveal, blur, hero-spectacle]
---

## What it is
A single statement line that resolves word by word: trailing words sit at low opacity and `blur()`, then snap sharp (`opacity: 1`, `blur(0)`) as they enter view, so the sentence literally "comes into focus." Pitch was captured *mid-transition* on the line "Build trust, get **buy-in, and win more deals.**" - in the frame, "get buy-in," is sharp while "and win more deals." is still soft and pale, caught animating blur+opacity (so the exact resting blur/opacity are inferred from that frame, not read off a settled DOM). The capture shows 6 `filter` scroll effects and fade-ins climbing from `0.10→1.00` opacity, driven by dense scrub IntersectionObservers (threshold arrays `[0, 0.01, … 0.99]`). Reserve it for ONE cinematic line.

## Why it works
Sequencing a claim word by word makes the reader *earn* the sentence - a focus pull on copy that mirrors the meaning ("it comes into focus"). It works only in moderation: it is **spectacle-only** because animated `filter: blur()` is not GPU-free the way `transform`/`opacity` are (the browser re-rasterizes the blurred text each frame), and the dense scrub IntersectionObserver that scrubs it is the most expensive motion pattern in the corpus. Worse, it *delays readable text*, so it must never sit on critical above-the-fold copy. Gate it behind a one-shot IntersectionObserver (threshold `0`, fire once, then disconnect) rather than a continuous scrub, animate per-word spans, and stagger with a small per-word delay. The mandatory reduced-motion path renders every word sharp and full-opacity immediately, and that sharp state is the one shipped in the DOM, so no-JS and reduced-motion both get readable text.

## Reference implementation
```html
<style>
  /* RESTING STATE shipped in the DOM: sharp, full-opacity, readable with no JS.
     The .is-armed class (added by JS only when motion is allowed) is what
     hides the words so they can resolve in. */
  .focus-line { font-size: var(--text-3xl); line-height: var(--leading-snug);
                letter-spacing: var(--tracking-tight); color: var(--color-fg); }
  .focus-line .w {
    display: inline-block;
    filter: blur(0); opacity: 1;
    transition: filter var(--duration-slow) var(--ease-standard),
                opacity var(--duration-slow) var(--ease-standard);
    transition-delay: calc(var(--i, 0) * 60ms);   /* small per-word stagger */
  }
  /* Pre-reveal look, applied only once JS arms the line. */
  .focus-line.is-armed .w { filter: blur(0.5rem); opacity: 0.1; }
  .focus-line.is-armed.in .w { filter: blur(0); opacity: 1; }

  /* Reduced motion: never arm, never blur; show sharp words at once. */
  @media (prefers-reduced-motion: reduce) {
    .focus-line .w { filter: none !important; opacity: 1 !important; transition: none; }
  }
</style>

<p class="focus-line">
  <span class="w" style="--i:0">Build</span> <span class="w" style="--i:1">trust,</span>
  <span class="w" style="--i:2">get</span> <span class="w" style="--i:3">buy-in,</span>
  <span class="w" style="--i:4">and</span> <span class="w" style="--i:5">win</span>
  <span class="w" style="--i:6">more</span> <span class="w" style="--i:7">deals.</span>
</p>

<script>
  // No scroll listener: a one-shot IntersectionObserver arms the line just
  // before it enters, then reveals it and disconnects. Skipped entirely under
  // reduced motion, so the DOM's sharp resting state stands.
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    document.querySelectorAll('.focus-line').forEach((line) => {
      line.classList.add('is-armed');                 // hide words to resolve in
      new IntersectionObserver((entries, obs) => {
        for (const e of entries) if (e.isIntersecting) {
          requestAnimationFrame(() => line.classList.add('in'));  // resolve to sharp
          obs.disconnect();
        }
      }, { threshold: 0, rootMargin: '0px 0px -10% 0px' }).observe(line);
    });
  }
</script>
```
