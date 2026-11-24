---
pattern: hairline-grid-canvas
from: cal
corpus: production
safety: production-safe
tags: [page-shell, layout, landing, feature-section, structure]
---

## What it is

The page is a light gray canvas with a fixed-width content column, and that column's two edges are drawn as 1px hairlines that run the *entire* page height. A horizontal hairline closes each section, and a small `+` crosshair is painted wherever rules meet — including at the corners of the cards that sit on the grid. Content lives on white cards with a hairline ring-shadow instead of a border. Nothing else separates one section from the next: no divider bars, no alternating background bands, no color chapters.

## Why it works

Whitespace alone can't tell a reader whether two things belong to the same system. A visible rule can — and a rule that never moves, section after section, becomes a coordinate frame: every card is *registered* to it rather than floating. The crosshair is what sells it, because it says the rules were drawn deliberately rather than left over from a border reset. The cost is two pseudo-element gradients and a repeated glyph, and the payoff is structure you'd otherwise buy with boxes.

Three rules make it hold together, and all three are load-bearing:
1. **The rules are page-scale, the cards are section-scale.** If the hairlines stop and restart per section, the frame stops being a frame.
2. **Cards get a ring-shadow, not a border.** A `0 0 0 1px` shadow reads as an outline, doesn't participate in layout, and doesn't double up where a card meets a rule.
3. **The canvas is the only tint on the page.** Once the grid is doing the chunking, a colored band would be saying the same thing twice.

Transfers to any long marketing or docs page. It is the structural alternative to the soft-gradient-band template — and it scales down: at mobile the vertical rules move to the viewport edge and the crosshairs disappear.

## Reference implementation

```html
<div class="canvas">
  <section class="band">
    <div class="band__inner">
      <p class="eyebrow"><span aria-hidden="true">◆</span> Benefits</p>
      <h2 class="display">Your all-purpose scheduling app</h2>
      <p class="lede">Discover a variety of our advanced features. Unlimited and free for individuals.</p>
      <div class="grid">
        <article class="card">…</article>
        <article class="card">…</article>
      </div>
    </div>
  </section>

  <section class="band">
    <div class="band__inner">…</div>
  </section>
</div>

<style>
  .canvas {
    /* the ruled ground: two full-height hairlines at the content edges */
    --gutter-rule: var(--color-hairline);
    --column: var(--container-xl);

    background: var(--color-surface);
    background-image:
      linear-gradient(to right, var(--gutter-rule, rgba(11, 13, 18, 0.08)) 1px, transparent 1px),
      linear-gradient(to left,  var(--gutter-rule, rgba(11, 13, 18, 0.08)) 1px, transparent 1px);
    background-repeat: no-repeat;
    background-position: calc(50% - var(--column, 1224px) / 2) 0, calc(50% + var(--column, 1224px) / 2) 0;
    background-size: 1px 100%, 1px 100%;
    /* crosshair glyphs straddle the column edge by design; clip the sliver that can
       spill past the viewport when the column matches the viewport width exactly */
    overflow-x: clip;
  }

  /* Each section closes with a horizontal rule; the crosshairs are painted
     where that rule crosses the two gutter rules. */
  .band {
    position: relative;
    padding-block: var(--space-9);
    border-bottom: 1px solid var(--color-hairline);
  }
  .band::before,
  .band::after {
    content: "+";
    position: absolute;
    bottom: 0;
    translate: -50% 50%;                 /* centre the glyph on the joint */
    font: var(--weight-regular) var(--text-sm) / 1 var(--font-sans);
    color: var(--color-border-strong);
    pointer-events: none;
  }
  .band::before { left:  calc(50% - var(--column, 1224px) / 2); }
  .band::after  { left:  calc(50% + var(--column, 1224px) / 2); }

  .band__inner {
    max-width: var(--column, 1224px);
    margin-inline: auto;
    padding-inline: var(--space-5);
  }

  /* Section header: pill eyebrow → display → one muted line. Never varies. */
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    margin: 0 auto var(--space-5);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-full);
    background: var(--color-bg);
    box-shadow: var(--shadow-ring, 0 0 0 1px rgba(34, 42, 53, 0.08));
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-ui);
    color: var(--color-fg);
  }
  .display {
    max-width: var(--container-sm);       /* headline + lede share one measure */
    margin: 0 auto;
    font-size: var(--text-4xl);
    font-weight: var(--weight-regular);   /* scale ranks, weight does not */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-display);
    text-align: center;
    text-wrap: balance;
  }
  .lede {
    max-width: var(--container-sm);
    margin: var(--space-4) auto 0;
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-muted);
    text-align: center;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 28rem), 1fr));
    gap: var(--space-5);
    margin-top: var(--space-8);
  }

  /* Card: ring-shadow instead of a border, so it never doubles against a rule. */
  .card {
    padding: var(--space-5);
    border-radius: var(--radius-lg);
    background: var(--color-bg);
    box-shadow:
      0 0 0 1px rgba(34, 42, 53, 0.08),
      0 1px 5px -4px rgba(19, 19, 22, 0.7),
      0 4px 8px rgba(34, 42, 53, 0.05);
  }

  @media (width < 48rem) {
    /* rules retreat to the viewport edge; the crosshairs would land off-canvas */
    .canvas { --column: 100%; }
    .band::before,
    .band::after { content: none; }
    .display { font-size: var(--text-3xl); }
  }
</style>
```
