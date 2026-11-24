---
pattern: brand-quote-spec-block
from: vercel
corpus: production
safety: production-safe
tags: [feature-section, social-proof, testimonial, product-marketing]
---

## What it is

A social-proof block built as three stacked parts beside (or above) a real product-UI screenshot: (1) a large headline that states a customer *outcome* in the form "_Name_ verb metric on Product" — with the **customer name set in muted grey and the claim in ink** (an inverted two-tone); (2) a small monospace `Features` caption; and (3) a mono uppercase spec list of the capabilities that made the outcome possible. On Vercel: "_Notion_ powers millions of agent conversations daily on Vercel," then `Features → DURABLE ORCHESTRATION · SANDBOXED ENVIRONMENTS · AI MODEL GATEWAY · FLUID COMPUTE`, paired with a floating capture of Notion's actual UI.

## Why it works

Inverting the usual emphasis — demoting the logo-name, promoting the result — makes the reader's eye land on the *metric* ("millions of conversations"), so the quote reads as a product claim rather than a vanity logo. Pairing that human-readable claim with a machine-readable spec list answers both audiences at once: the decision-maker reads the outcome, the engineer reads the capabilities, in one block and one type system. Anchoring it all to a real screenshot turns an assertion into evidence — you see the product the customer actually shipped. The structure transfers to any "customer proof" or "use-case" surface: case-study teasers, integration spotlights, solution pages. Keep the muted name above AA contrast, and make sure the sentence still parses if color is stripped (the claim must read in one tone for screen readers — color is not the only carrier).

## Reference implementation

```html
<style>
  .bqs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-9);
    align-items: center;
    max-width: var(--container-xl);
    margin-inline: auto;
  }
  .bqs__claim {
    font-family: var(--font-sans);
    font-weight: var(--weight-regular);     /* hierarchy is scale + color, not weight */
    font-size: var(--text-3xl);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg);                  /* the outcome is ink */
  }
  .bqs__name { color: var(--color-muted); }  /* demote the customer name */

  .bqs__spec { margin-top: var(--space-6); display: flex; flex-direction: column; gap: var(--space-2); }
  .bqs__spec-caption {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-subtle);
    margin-bottom: var(--space-2);
  }
  .bqs__spec-item {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-fg);
  }

  /* real product-UI capture, floated just off the page */
  .bqs__shot {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
  }
  .bqs__shot img { display: block; width: 100%; height: auto; }

  @media (max-width: 64rem) { .bqs { grid-template-columns: 1fr; gap: var(--space-7); } }
</style>

<section class="bqs">
  <div>
    <h3 class="bqs__claim">
      <span class="bqs__name">Notion</span> powers millions of agent
      conversations daily on Vercel.
    </h3>
    <div class="bqs__spec">
      <span class="bqs__spec-caption">Features</span>
      <span class="bqs__spec-item">Durable orchestration</span>
      <span class="bqs__spec-item">Sandboxed environments</span>
      <span class="bqs__spec-item">AI model gateway</span>
      <span class="bqs__spec-item">Fluid compute</span>
    </div>
  </div>

  <figure class="bqs__shot">
    <img src="/img/notion-ai.png" alt="Notion AI chat running on Vercel" loading="lazy" />
  </figure>
</section>
```
