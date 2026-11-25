---
pattern: faux-app-mockup-feature-row
from: cursor
corpus: production
safety: production-safe
tags: [feature-section, product-marketing, layout]
---

## What it is
An alternating two-column feature row: one side is a *high-fidelity reconstruction of the actual product UI* (window chrome, tabs, syntax-colored code, a real-looking panel — not an icon or an abstract "dashboard" box), the other side is a tight text block — heading, one muted supporting line, and a single colored text-link with an arrow. Sides flip left/right down the page so a long feature list reads as rhythm instead of a list. The mockup is elevated with a soft shadow and may bleed past its panel to imply a larger surface.

## Why it works
The claim is *proven by a believable artifact* rather than asserted: a credible screenshot-grade mockup converts "we have agents" into "here is the agent working." Pairing it with copy at a single font-weight — heading and body separated only by **scale and ink-opacity**, not bold — keeps the eye on the artifact and the one arrow-link CTA. Alternation gives macro-rhythm; the large inter-row whitespace keeps a dense page calm. The accent color is spent only on the link, so action is always findable without competing buttons.

## Reference implementation
```html
<section class="feature-row">
  <figure class="mockup">
    <!-- a credible reconstruction of YOUR product UI: window chrome + real content -->
    <div class="win">
      <div class="win-bar"><span></span><span></span><span></span></div>
      <div class="win-body"><!-- tabs, code, panels — the real thing, scaled --></div>
    </div>
  </figure>
  <div class="copy">
    <h2>Agents turn ideas into code</h2>
    <p>Accelerate development by handing off tasks while you focus on decisions.</p>
    <a class="arrow-link" href="#">Learn about agents <span aria-hidden="true">→</span></a>
  </div>
</section>

<style>
  .feature-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-48, 48px);
    align-items: center;
    max-width: 1300px;
    margin-inline: auto;
    padding-block: var(--space-67, 67px);
  }
  /* flip every other row */
  .feature-row:nth-child(even) .mockup { order: 2; }

  .mockup { margin: 0; }
  .win {
    background: var(--color-surface, #F2F1ED);
    border-radius: var(--radius-8, 8px);
    box-shadow: 0 28px 70px rgba(0,0,0,0.14), 0 14px 32px rgba(0,0,0,0.1),
                0 0 0 1px var(--color-border, rgba(38,37,30,0.1));
    overflow: hidden;
  }
  .win-bar {
    display: flex; gap: var(--space-8, 8px);
    padding: var(--space-12, 12px);
    border-bottom: 1px solid var(--color-border, rgba(38,37,30,0.1));
  }
  .win-bar span { width: 10px; height: 10px; border-radius: var(--radius-pill, 9999px);
    background: var(--color-surface-2, #E6E5E0); }

  .copy h2 {
    font: 400 var(--fs-h2, 1.625rem)/1.2 var(--font-display, "CursorGothic", system-ui);
    letter-spacing: -0.0125em;
    color: var(--color-fg, #26251E);
    margin: 0 0 var(--space-12, 12px);
  }
  .copy p {
    font: 400 var(--fs-body, 1rem)/1.5 var(--font-ui, system-ui);
    color: var(--color-muted, rgba(38,37,30,0.6));   /* same ink, lowered alpha — not a new gray */
    margin: 0 0 var(--space-16, 16px);
    max-width: 38ch;
  }
  .arrow-link {
    color: var(--color-accent, #DB704B);
    text-decoration: none;
    font: 400 var(--fs-body, 1rem)/1 var(--font-ui, system-ui);
  }

  @media (max-width: 720px) {
    .feature-row { grid-template-columns: 1fr; gap: var(--space-28, 28px); padding-block: var(--space-48, 48px); }
    .feature-row:nth-child(even) .mockup { order: 0; }   /* mockup always on top when stacked */
  }
</style>
```
