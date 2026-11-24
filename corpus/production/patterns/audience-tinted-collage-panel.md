---
pattern: audience-tinted-collage-panel
from: userflow
corpus: production
safety: production-safe
tags: [feature-section, product-marketing, onboarding, personas, color-coding]
---

## What it is
A persona/audience section built from one repeatable panel: a display heading + a bento of flat outlined "sticker" feature cards on the left, and a hue-matched rounded photo tile carrying a couple of floating product-UI chips on the right. The whole panel is tinted with one pastel hue (with a matched darker border), and every audience gets the *same* skeleton in a *different* hue — Userflow ships Product & Growth in mint, Customer Success in powder blue, Customer Marketing in lavender. Color is wayfinding: the reader tells the sections apart by hue, not by re-reading the headings.

## Why it works
Presenting the same structure to several audiences is a layout trap — repeat it in one color and the sections blur together; redesign each and you lose the "one product, many teams" message. Assigning each audience a pastel hue (fill + matched border) solves both: the sections read as siblings *and* stay individually memorable, and the eye can jump straight to "the blue one." Three mechanics keep it calm at high density: (1) elevation comes from a single 1px near-black outline on every card, not shadows, so pastel fills stay clean and the tight bento never feels crowded (the outline does the separating whitespace would); (2) the right-hand media is a *tinted rounded tile* backing a real photo plus small product-UI chips (a welcome flow, a stat pill), which shows the product in use without a heavy device mockup; (3) one type family + a big heading-to-body scale jump carries hierarchy so the repeated panels stay quiet. Pair it with `sticky-stack-recede` to page the panels one at a time. Transferable to any "who it's for" / segment / plan comparison where the structure repeats.

## Reference implementation
```html
<style>
  .persona {
    display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8, 4rem);
    align-items: center;
    border: 1px solid var(--persona-border, #b4ea99);
    border-radius: var(--radius-xl, 24px);
    background: var(--persona-tint, #e4fcd7);   /* the audience's hue */
    padding: clamp(var(--space-6,2rem), 5vw, var(--space-9,6rem));
  }
  .persona__title {
    font-size: var(--text-5xl, 3.5rem); line-height: 1.05;
    letter-spacing: -0.02em; color: var(--color-fg-heading, #121941);
    margin: 0 0 var(--space-3, 0.75rem);
  }
  .persona__lede { color: var(--color-muted, #52577a); max-width: 34ch; margin: 0 0 var(--space-6,2rem); }

  /* Bento of flat outlined "sticker" feature cards — elevation by border, no shadow. */
  .persona__bento { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4, 1rem); }
  .feature {
    border: 1px solid var(--color-border, #141414);
    border-radius: var(--radius-lg, 16px);
    background: var(--color-surface, #ffffff);
    padding: var(--space-5, 1.5rem);
  }
  .feature__icon {          /* pastel-filled, outlined icon chip */
    display: grid; place-items: center; width: 2.75rem; height: 2.75rem;
    border-radius: var(--radius-md, 8px);
    background: var(--persona-tint, #e4fcd7);
    margin-bottom: var(--space-4, 1rem);
  }

  /* Hue-tinted rounded media tile with floating product-UI chips. */
  .persona__media { position: relative; border-radius: 60px; overflow: hidden; aspect-ratio: 1 / 1; }
  .persona__media img { width: 100%; height: 100%; object-fit: cover; }
  .chip {
    position: absolute;
    display: inline-flex; align-items: center; gap: var(--space-2, 0.5rem);
    padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
    border-radius: var(--radius-full, 9999px);
    background: var(--color-surface, #ffffff);
    box-shadow: var(--shadow-md, 0 4px 16px rgba(0,0,0,0.15));   /* the ONE place a shadow earns its keep: lifting a chip off a photo */
    font-size: var(--text-sm, 0.875rem);
  }

  @media (max-width: 767px) {
    .persona { grid-template-columns: 1fr; }
    .persona__bento { grid-template-columns: 1fr; }
  }
</style>

<!-- Swap --persona-tint / --persona-border per audience; everything else is identical. -->
<section class="persona" style="--persona-tint:#e4fcd7; --persona-border:#b4ea99;">
  <div>
    <h2 class="persona__title">Product &amp; Growth</h2>
    <p class="persona__lede">Improve activation and adoption — no-code onboarding, in-app experiences, and now task completion.</p>
    <div class="persona__bento">
      <article class="feature"><div class="feature__icon"><!-- icon --></div><p>Behavior-based in-app guidance to get users to value faster</p></article>
      <article class="feature"><div class="feature__icon"><!-- icon --></div><p>Clear visibility into drop-offs and what to improve next</p></article>
    </div>
  </div>
  <figure class="persona__media">
    <img src="team.jpg" alt="Two teammates reviewing an onboarding flow">
    <span class="chip" style="top:12%; left:8%;">Welcome! Let’s get started</span>
    <span class="chip" style="bottom:14%; right:8%;">135% ROI</span>
  </figure>
</section>
```
