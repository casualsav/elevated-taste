---
pattern: two-tone-display-hero
from: supabase
corpus: production
safety: production-safe
tags: [hero, landing, product-marketing]
---

## What it is
A centered hero whose headline is a single large display size set in one weight, but split across two lines colored differently: a neutral first line and an accent-colored second line. Below it sits muted centered subcopy and a two-button CTA row — one solid accent button with dark text, one outlined neutral button. There are no gradients, shadows, or background imagery; the entire hero is type and one accent color on a flat field.

## Why it works
Hierarchy is created by **scale and color, not weight**: the ~4.5× jump from body to display does the ranking, so the headline reads as authoritative without bold's heaviness, and the whole type system stays at two weights. Splitting the headline into neutral + accent lines encodes a setup/payoff value prop ("Build in a weekend" → "Scale to millions") so the positioning lands in one glance — contrast carries meaning that would otherwise need a second sentence. Because the accent is a *light* hue, the primary button uses near-black text, which keeps contrast high and avoids the muddy white-on-saturated-color look. Transfers to any landing hero with a before/after or promise/proof structure.

## Reference implementation
```html
<section class="hero">
  <h1 class="hero__title">
    <span class="hero__line">Build in a weekend</span>
    <span class="hero__line hero__line--accent">Scale to millions</span>
  </h1>
  <p class="hero__sub">
    The Postgres development platform. Start your project with a database,
    auth, instant APIs, realtime, storage, and vector embeddings.
  </p>
  <div class="hero__cta">
    <a class="btn btn--primary" href="#">Start your project</a>
    <a class="btn btn--ghost" href="#">Request a demo</a>
  </div>
</section>

<style>
  .hero {
    max-width: var(--container-md);
    margin-inline: auto;
    padding-block: var(--space-9) var(--space-8);
    padding-inline: var(--space-5);
    text-align: center;
    background: var(--color-bg);
  }
  .hero__title {
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--text-display);     /* scale, not weight, makes it loud */
    font-weight: var(--weight-medium);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
  }
  .hero__line { display: block; color: var(--color-fg); }
  .hero__line--accent { color: var(--color-accent); }

  .hero__sub {
    max-width: var(--container-content);
    margin: var(--space-5) auto 0;
    font-size: var(--text-md);
    line-height: var(--leading-normal);
    color: var(--color-muted);
  }

  .hero__cta {
    display: flex;
    gap: var(--space-3);
    justify-content: center;
    margin-top: var(--space-6);
    flex-wrap: wrap;
  }
  .btn {
    font: inherit;
    font-weight: var(--weight-medium);
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    transition: background var(--duration-fast) var(--ease-standard),
                border-color var(--duration-fast) var(--ease-standard);
  }
  .btn--primary {
    background: var(--color-accent);
    color: var(--color-fg);            /* dark text: accent is a light hue */
  }
  .btn--ghost {
    background: var(--color-bg);
    color: var(--color-fg);
    border-color: var(--color-border);
  }
  .btn--ghost:hover { border-color: var(--color-border-strong, var(--color-muted)); }
</style>
```
