---
pattern: serif-italic-counterpoint
from: exoape
corpus: expressive
safety: production-safe
tags: [typography, hero, branding, editorial]
---

## What it is

A two-typeface system where a **neutral light sans carries the display headline and the UI**, and a **serif is reserved almost exclusively for *italic* "voice" text** — the short intro paragraph and one accented word inside the wordmark (here "exo" sans + "*ape*" serif italic). The expressive face is the *small* one; the giant type stays plain. The same sans/serif-italic contrast appears in the logotype and is then reused as the page's type system, so brand and interface share one tension.

## Why it works

Hierarchy (what's important) is already settled by **scale contrast** — a ~9–16× jump from 16px body to a 144–250px display word. With rank handled by size, the serif no longer has to signal importance; it is freed to carry **tone**. An italic serif reads as a human aside next to the architectural sans, so the page feels authored and warm without the headline becoming decorative. Deriving the pairing from the wordmark means every screen echoes the logo's "technical + expressive" duality, which is what makes a site feel like one hand made it. The move is transferable to any editorial/agency surface: pick a calm sans to do the shouting, and ration a serif to short italic copy so it adds voice, not noise.

## Reference implementation

```html
<style>
  :root {
    /* from /tokens/tokens.json */
    --font-sans: var(--font-sans, "Lausanne", system-ui, sans-serif);
    --font-serif: Georgia, "Times New Roman", serif; /* use a real licensed serif in prod */
  }

  .hero {
    background: var(--color-bg);
    color: var(--color-fg);
    padding: var(--space-9);
  }
  @media (max-width: 40rem) {
    .hero { padding-inline: var(--space-6); } /* keep the display word inside a narrow viewport */
  }

  /* tiny italic serif = the "voice" */
  .hero__intro {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: var(--text-md);          /* ~1.125rem, small on purpose */
    line-height: var(--leading-normal);
    font-weight: var(--weight-regular);
    max-width: var(--container-content); /* short measure — voice, not body */
    color: var(--color-fg);
  }

  /* giant neutral sans = the architecture */
  .hero__display {
    font-family: var(--font-sans);
    font-weight: var(--weight-regular);  /* light/regular, never bold at size */
    font-size: clamp(var(--text-5xl), 16vw, var(--text-display));
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight); /* negative — tighten thin strokes */
    margin: var(--space-6) 0 0;
  }

  /* two-part logotype reusing the same contrast */
  .wordmark { font-family: var(--font-sans); font-weight: var(--weight-medium); }
  .wordmark em {
    font-family: var(--font-serif);
    font-style: italic;
    font-weight: var(--weight-regular);
  }
</style>

<header>
  <a class="wordmark" href="/">exo<em>ape</em></a>
</header>

<section class="hero">
  <p class="hero__intro">
    Global digital design studio partnering with brands and businesses that
    create exceptional experiences where people live, work, and unwind.
  </p>
  <h1 class="hero__display">Digital Design Experience</h1>
</section>
```
