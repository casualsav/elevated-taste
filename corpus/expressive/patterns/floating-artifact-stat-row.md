---
pattern: floating-artifact-stat-row
from: praxis
corpus: expressive
safety: production-safe
trigger: in-view
tags: [stats, feature-section, brand-experience, motion]
---

## What it is

A centered **triptych of statistics** — each a single desaturated artifact image floating directly on the page background (no card, no border, no shadow), with an uppercase mono **label** and a mono **number** stacked beneath it. The three columns are bilaterally symmetric and collapse to a single centered stack on mobile. It's a "by the numbers" band that gets its gravitas from **borderless floating imagery + symmetry + whitespace**, not from boxed stat cards.

## Why it works

Conventional stat cards lean on borders/shadows/fills to separate themselves from the page; that reads as "dashboard/marketing." Here the separation is done by **whitespace and a shared image grade** instead — every artifact is bleached toward the white background, so the pictures float as if lit from within and the eye groups them by alignment, not by chrome. Bilateral symmetry makes the band read as *official / heraldic*, which is exactly the register a manifesto or "network-state" brand wants. The mechanism transfers to any stats/feature triptych that should feel monumental rather than transactional: commit every image to one desaturated grade, drop the boxes, and let the centered axis + big voids do the framing.

## Reference implementation

```html
<section class="stat-row">
  <figure class="stat reveal">
    <img class="stat__art" src="/art/applications.png" alt="" loading="lazy">
    <figcaption class="stat__caption">
      <span class="stat__label">Applications</span>
      <span class="stat__value">167,132</span>
    </figcaption>
  </figure>
  <figure class="stat reveal">
    <img class="stat__art" src="/art/population.png" alt="" loading="lazy">
    <figcaption class="stat__caption">
      <span class="stat__label">Population</span>
      <span class="stat__value">2,653</span>
    </figcaption>
  </figure>
  <figure class="stat reveal">
    <img class="stat__art" src="/art/gnp.png" alt="" loading="lazy">
    <figcaption class="stat__caption">
      <span class="stat__label">GNP (est.)</span>
      <span class="stat__value">$15.4 billion</span>
    </figcaption>
  </figure>
</section>

<style>
  .stat-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);   /* 3-up, symmetric */
    gap: var(--space-6, 64px);
    max-width: var(--container-full, 1520px);
    margin-inline: auto;
    padding-block: var(--space-section, 128px);
    padding-inline: var(--space-3, 24px);
  }
  .stat { margin: 0; text-align: center; }
  .stat__art {
    width: clamp(120px, 16vw, 220px);
    height: auto;
    /* borderless: the image floats on the bg, unified by one desaturated grade */
    filter: saturate(0.4) brightness(1.12);
    margin-inline: auto;
  }
  .stat__caption {
    display: grid;
    gap: var(--space-1, 2px);            /* tight intra-label spacing */
    margin-top: var(--space-5, 40px);
    font-family: var(--font-mono, "Chivo Mono", monospace);
  }
  .stat__label {
    text-transform: uppercase;
    letter-spacing: var(--tracking-label, 0.05em);
    font-size: var(--text-body, 0.9375rem);
    color: var(--fg, #101010);
  }
  .stat__value {
    font-size: var(--text-body, 0.9375rem);
    color: var(--fg, #101010);
  }

  /* single centered stack on mobile */
  @media (max-width: 720px) {
    .stat-row { grid-template-columns: 1fr; gap: var(--space-section-sm, 80px); }
  }

  /* in-view fade-up, opacity/transform only */
  .reveal {
    opacity: 0;
    transform: translateY(12px);
    transition:
      opacity var(--dur, 600ms) var(--ease, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--dur, 600ms) var(--ease, cubic-bezier(0.4, 0, 0.2, 1));
  }
  .reveal.is-visible { opacity: 1; transform: none; }

  /* MANDATORY reduced-motion fallback */
  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; transition: none; }
  }
</style>

<script>
  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    }
  }, { threshold: 0.3, rootMargin: '200px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
</script>
```

Notes: the `filter: saturate(.4) brightness(1.12)` stands in for the exemplar's bleached grade — bake the real treatment into the source assets for production rather than relying on a runtime filter. Because the stat number carries meaning, give it a real accessible value in text (not baked into the image), and keep the 12–15px labels above a11y minimums on mobile. Decorative artifacts use `alt=""`; if the stat is data, expose the number to assistive tech. The reveal is opacity/transform only and disabled under `prefers-reduced-motion`.
