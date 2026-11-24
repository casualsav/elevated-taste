---
pattern: sticky-companion-panel
from: framer
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [feature-section, motion, layout]
---

## What it is
A two-column feature section where the left column is a tall stack of copy-and-mockup blocks (one per capability) and the right column is a single card — a live-looking assistant/preview panel — that **pins to the viewport with `position: sticky`** and stays in place while the left column scrolls through it. Each left block also fade-rises as it enters view. One companion visibly "accompanies" several steps, rather than repeating a screenshot per row.

## Why it works
Native `position: sticky` gives you scroll-pinned depth with zero scroll-event handlers, no layout thrash, and automatic release at the section boundary — the browser does it on the compositor. Pairing it with an IntersectionObserver-gated fade-rise (transform + opacity only) keeps the reveal cheap and the reduced-motion fallback trivial. The result reads as a continuous product presence while each block still earns its own moment.

## Reference implementation
```html
<section class="feat">
  <div class="feat__blocks">
    <article class="feat__block reveal">
      <h3>Design with an agent</h3>
      <p>A professional design agent, native to the canvas.</p>
      <a class="feat__cta" href="#">Start with Agents →</a>
    </article>
    <article class="feat__block reveal">
      <h3>Run your CMS with an agent</h3>
      <p>The CMS agent sets up and connects your entire content model.</p>
      <a class="feat__cta" href="#">Start with Agents →</a>
    </article>
    <article class="feat__block reveal">
      <h3>Code with an agent</h3>
      <p>Turn ideas into code and put them on your site.</p>
      <a class="feat__cta" href="#">Start with Agents →</a>
    </article>
  </div>

  <aside class="feat__companion" aria-label="Assistant preview">
    <!-- live-looking preview / chat card -->
  </aside>
</section>

<style>
  .feat {
    display: grid;
    grid-template-columns: 1fr minmax(320px, 420px);
    gap: var(--space-8);
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-block: var(--space-10);
    background: var(--color-bg-dark, #050505);
    color: var(--color-fg-on-dark, #fff);
  }
  .feat__blocks { display: flex; flex-direction: column; gap: 40vh; } /* space lets the panel pin between blocks */
  .feat__block h3 { font-size: var(--text-2xl); letter-spacing: var(--tracking-heading); }
  .feat__block p  { color: var(--color-muted-on-dark, rgba(255,255,255,0.6)); max-width: 46ch; }
  .feat__cta { color: var(--color-fg-on-dark, #fff); text-decoration: none; opacity: 1;
               transition: opacity var(--duration-fast) var(--ease-standard); }
  .feat__cta:hover { opacity: 0.62; }

  .feat__companion {
    position: sticky;
    top: var(--space-8);
    align-self: start;            /* required so sticky has room to travel */
    height: 70vh;
    border: 1px solid var(--color-hairline, rgba(255,255,255,0.08));
    border-radius: var(--radius-lg);
    background: var(--color-surface-dark, #111);
  }

  /* in-view fade-rise for each block */
  .reveal { opacity: 0.2; transform: translateY(16px);
            transition: opacity var(--duration-slow) var(--ease-entrance),
                        transform var(--duration-slow) var(--ease-entrance); }
  .reveal.is-in { opacity: 1; transform: none; }

  @media (max-width: 900px) {
    .feat { grid-template-columns: 1fr; }
    .feat__companion { position: static; height: auto; }
    .feat__blocks { gap: var(--space-8); }
  }

  /* mandatory: no motion, no low-opacity resting state */
  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; transition: none; }
  }
</style>

<script>
  // Cheap reveal: IntersectionObserver flips a class, CSS does the rest.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
</script>
```
