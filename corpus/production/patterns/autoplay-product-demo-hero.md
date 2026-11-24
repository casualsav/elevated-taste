---
pattern: autoplay-product-demo-hero
from: typeform
corpus: production
safety: production-safe
trigger: in-view
tags: [hero, feature-section, motion, product-demo]
---

## What it is
A hero (or feature block) whose visual proof is a **short, muted, looping video of the real product being used** — a form being filled, a cursor clicking, a completion state — instead of a static dashboard screenshot. The clip only plays while it's on screen, and collapses to a poster frame when the user prefers reduced motion. It's the direct replacement for the generic "fake dashboard mockup" hero.

## Why it works
A flow-based product (forms, editors, workflows) is *mis-sold by a still* — the value is the motion through it. Showing the product actually running is proof, not a promise, and it reads as confidence. Gating playback to in-view via `IntersectionObserver` keeps it cheap (off-screen videos stay paused) and the muted+loop+`playsinline` combo autoplays on mobile without hijacking the user. The reduced-motion fallback swaps the video for its poster so nothing moves.

## Reference implementation
```html
<section class="demo-hero">
  <div class="demo-copy">
    <p class="eyebrow">Intelligent forms</p>
    <h1 class="demo-title">Build forms at the drop of a prompt</h1>
    <a class="demo-cta" href="#">Explore forms</a>
  </div>

  <figure class="demo-frame">
    <video class="demo-video" muted loop playsinline preload="none"
           poster="form-demo-poster.avif" aria-label="A form being filled out and submitted">
      <source src="form-demo.mp4" type="video/mp4">
    </video>
  </figure>
</section>

<style>
  .demo-hero {
    display: grid; gap: var(--space-8, 4rem);
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    align-items: center;
    max-width: var(--container-xl, 1280px); margin-inline: auto;
    padding: var(--space-9, 6rem) var(--space-6, 2rem);
  }
  @media (max-width: 768px) { .demo-hero { grid-template-columns: 1fr; } }

  .eyebrow {
    color: var(--color-accent, #a25fba);
    font-size: var(--text-sm, 0.875rem); letter-spacing: 0.02em;
    text-transform: uppercase; margin: 0 0 var(--space-3, 0.75rem);
  }
  .demo-title {
    /* scale carries the hierarchy — keep the weight light */
    font-size: clamp(2.25rem, 5vw, var(--text-5xl, 3.75rem));
    font-weight: var(--weight-regular, 400);
    letter-spacing: var(--tracking-display, -0.022em);
    line-height: var(--leading-tight, 1.1); margin: 0;
  }
  .demo-cta {
    display: inline-block; margin-top: var(--space-6, 2rem);
    background: var(--color-fg, #2a222b); color: var(--color-bg, #faf9fb);
    padding: var(--space-3, 0.75rem) var(--space-5, 1.5rem);
    border-radius: var(--radius-full, 9999px); text-decoration: none;
    transition: background var(--duration-base, 200ms) var(--ease-standard, ease-out);
  }

  .demo-frame {
    margin: 0; overflow: hidden;
    border-radius: var(--radius-xl, 24px);
    box-shadow: var(--shadow-lg, 0 12px 32px rgba(11,13,18,0.12));
  }
  .demo-video { display: block; width: 100%; height: auto; }

  /* Reduced motion: freeze on the poster, never autoplay. */
  @media (prefers-reduced-motion: reduce) {
    .demo-video { display: none; }
    .demo-frame {
      aspect-ratio: 16 / 10;
      background: center / cover no-repeat var(--color-surface, #eeecee);
    }
  }
</style>

<script>
  // Play only while in view; pause when scrolled away. Cheap + battery-friendly.
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.demo-video').forEach((video) => {
    if (reduce) return;                       // fallback: poster only
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }
    }, { threshold: 0.25 });
    io.observe(video);
  });
</script>
```
