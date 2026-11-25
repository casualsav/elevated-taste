---
pattern: prose-manifesto-landing
from: arena
corpus: production
safety: production-safe
tags: [landing, pricing, editorial, text-only, hero-replacement]
---

## What it is

A landing page with no hero: one centered reading column of first-person prose that *argues* for the product, with section headings set at **body size in bold** and the pricing built into the paragraph flow as two bordered rows rather than a comparison table. The page opens by defining the product in numbered clauses, quotes how users describe it, states the price, and then spends its remaining length on the idea behind the tool.

Use it when the value proposition is an idea rather than a screenshot — research tools, dev tools, community products, anything independent — and when a six-word headline would flatten the proposition into something you'd have to walk back. It is the deliberate opposite of the oversized-hero-plus-three-feature-cards template.

## Why it works

Three mechanisms carry it:

**Hierarchy from position and weight, with zero scale contrast.** Nothing on the page is larger than the body text. Because there is exactly one reading path, the page doesn't need scale to say "start here" — it needs only silence between chapters (a full `--space-10` band) and a bold line to name the next one. Removing the scale axis entirely is more coherent than using it timidly. This only works when the content is genuinely linear; a page the user is meant to *scan* still needs scale.

**Pricing as a sentence.** With ≤2 plans differing by one quantity, a three-column matrix manufactures a decision the reader doesn't have. A row — name, one line of scope, price as a button — states the offer and gets out of the way. Because the rows sit *in* the prose, the price arrives at the exact moment the argument has earned it.

**Chroma rationed to the end.** The body uses no saturated color at all, so a single deep-colored footer reads as a conclusion rather than a chrome band. Withheld color is a hierarchy device that costs nothing to render.

**The affordances:** links are bold rather than underlined, and every control reserves `1px solid transparent` at rest so its hover border can appear without reflowing the line. Ship the underline anyway (see the a11y note below) — the reserved border is the part worth copying everywhere.

## Reference implementation

```html
<!-- framework-neutral; house tokens + arena's own values as inline fallbacks -->
<style>
  .doc-page {
    /* the whole page inherits one measure; nothing floats free of it */
    --measure: var(--container-content);
    background: var(--color-bg);
    color: var(--color-doc-ink, #333);
    font: var(--weight-regular) var(--text-base) / var(--leading-normal) var(--font-sans);
    padding: var(--space-8) var(--space-6);
  }

  .doc {
    max-width: var(--measure);
    margin-inline: auto;
    display: flex;
    flex-direction: column;
    /* the space BETWEEN chapters is the only hierarchy signal besides weight */
    gap: var(--space-10);
  }

  .doc__chapter { display: flex; flex-direction: column; gap: var(--space-4); }
  .doc__chapter p, .doc__chapter ol { margin: 0; }
  .doc__chapter ol { padding-left: var(--space-4); }

  /* headings are body size — a heading level is a semantic claim, not a size */
  .doc h1, .doc h2 {
    font-size: var(--text-base);
    font-weight: var(--weight-bold);
    line-height: var(--leading-normal);
    margin: 0;
  }

  /* bold-as-affordance; keep the underline on hover/focus so weight isn't the only cue */
  .doc a { color: inherit; font-weight: var(--weight-bold); text-decoration: none; }
  .doc a:hover,
  .doc a:focus-visible { color: var(--color-doc-ink-max, #000); text-decoration: underline; text-underline-offset: 0.2em; }
  :focus-visible { outline: 1px solid var(--color-focus); }

  /* --- pricing, inline in the prose flow --- */
  .plans { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-3); }

  .plan {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-4);
    padding: var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-bg);
  }
  .plan__name { font-weight: var(--weight-bold); }
  .plan__scope { color: var(--color-muted); }
  .plan__prices { display: flex; gap: var(--space-2); flex-shrink: 0; }

  /* the border is RESERVED at transparent, so hover paints without reflowing */
  .price {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
    font-weight: var(--weight-bold);
    color: inherit;
    text-decoration: none;
    background: var(--color-surface);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    transition: color var(--duration-fast) var(--ease-standard),
                border-color var(--duration-fast) var(--ease-standard);
  }
  .price:hover { color: var(--color-doc-ink-max, #000); border-color: var(--color-border); }
  .price:active { border-color: var(--color-doc-ink-max, #000); }

  /* keep the touch target at 44px without growing the visual box */
  .price::after { content: ""; position: absolute; inset: 50% 0 auto 0; min-height: 44px; transform: translateY(-50%); }

  /* chroma is withheld until the page ends */
  .doc-footer {
    background: var(--color-brand-dark, #00075f);
    color: var(--color-fg-inverse);
    padding-block: var(--space-9);
  }
  .doc-footer a { color: inherit; font-weight: var(--weight-bold); text-decoration: none; }
  .doc-footer a:hover { color: var(--color-border-strong); }

  @media (max-width: 520px) {
    .doc-page { padding: var(--space-4) var(--space-3); }
    .plan { flex-direction: column; align-items: stretch; }
  }
</style>

<main class="doc-page">
  <article class="doc">
    <section class="doc__chapter">
      <h1>Widgetry is:</h1>
      <ol>
        <li>software for saving the things that matter to you</li>
        <li>a toolkit for assembling new work from the scraps of the old</li>
      </ol>
      <p>People describe it as <a href="/essays/playlists">“playlists, but for ideas.”</a></p>
      <p>If this speaks to you, try it now:</p>

      <ul class="plans">
        <li class="plan">
          <div>
            <div class="plan__name">Premium</div>
            <div class="plan__scope">Unlimited blocks, additional features.</div>
          </div>
          <div class="plan__prices">
            <a class="price" href="/signup?plan=annual">$70 / year</a>
            <a class="price" href="/signup?plan=monthly">$7 / month</a>
          </div>
        </li>
        <li class="plan">
          <div>
            <div class="plan__name">Guest</div>
            <div class="plan__scope">Up to 200 total blocks.</div>
          </div>
          <div class="plan__prices">
            <a class="price" href="/signup">Free / forever</a>
          </div>
        </li>
      </ul>
    </section>

    <section class="doc__chapter">
      <h2>Long-term vision</h2>
      <p>A small team builds this. The company is independent and <strong>sustained entirely by its members.</strong></p>
    </section>
  </article>
</main>
```

**A11y notes carried from the source, and the fixes.** The exemplar ships no `<h1>` at all and uses bold-only links with no underline — both are copied here *corrected*: use a real `h1` styled at body size, and restore the underline on hover/focus. Its price buttons are 24px tall; the `::after` hit-area above lifts them to the 44px touch floor without changing the visual box. The rest of the pattern — reserved transparent borders, body-size headings, whitespace-as-hierarchy, withheld chroma — transfers as-is.
