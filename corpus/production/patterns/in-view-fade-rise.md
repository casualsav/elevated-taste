---
pattern: in-view-fade-rise
from: cursor
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, reveal]
---

## What it is
A section or card settles into place once — fading from 0 to full opacity while rising a few pixels — the first time it scrolls into view, then never animates again. The reveal is gated by `IntersectionObserver` (not a scroll-event handler), animates only `transform` and `opacity`, and is fully disabled under `prefers-reduced-motion`.

## Why it works
Reveal-on-enter signals "this content just arrived" without the perpetual, distracting motion of scroll-tied parallax. Because the observer unobserves after firing, there is zero ongoing cost; because only compositor properties move, it never triggers layout. The small rise (8–16px) reads as *settling*, not *flying in* — restrained enough for a dense product page. The default-hidden state lives behind a `.js` class so the content is visible if scripting fails.

## Reference implementation
```html
<div class="reveal">…section content…</div>

<style>
  /* default: visible (no-JS / no-IO safe). JS opts in to the hidden start state. */
  .js .reveal {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity var(--dur-reveal, 500ms) var(--ease-out, cubic-bezier(0.25,1,0.5,1)),
                transform var(--dur-reveal, 500ms) var(--ease-out, cubic-bezier(0.25,1,0.5,1));
    will-change: opacity, transform;
  }
  .js .reveal.is-in {
    opacity: 1;
    transform: none;
  }
  /* optional stagger when several reveals share a container */
  .js .reveal.is-in:nth-child(2) { transition-delay: 40ms; }
  .js .reveal.is-in:nth-child(3) { transition-delay: 80ms; }

  @media (prefers-reduced-motion: reduce) {
    .js .reveal { opacity: 1; transform: none; transition: none; will-change: auto; }
  }
</style>

<script>
  document.documentElement.classList.add('js');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      e.target.style.willChange = 'auto';   // release after the one-shot
      io.unobserve(e.target);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
</script>
```
