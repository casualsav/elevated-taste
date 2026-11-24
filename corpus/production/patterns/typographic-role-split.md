---
pattern: typographic-role-split
from: warp
corpus: production
safety: production-safe
tags: [typography, hero, navigation, feature-section, developer-tool, brand-experience]
---

## What it is
A whole-page typographic *system* built from three families assigned by **job, not by level**: a humanist/geometric display sans for the brand's *voice* (headlines, pull-quotes), a neutral sans for *prose* (body, intros), and a **monospace** for all *functional chrome* (nav links, button labels, eyebrows, stat captions, breadcrumbs, table headers). On Warp the mono is what makes a near-monochrome, color-free marketing page instantly read as a *terminal/developer product* — the technical signal comes from the typeface roles, not from a neon accent or skeuomorphic device. (Where `mono-label-metadata` isolates the mono-for-metadata move on a serif/sans page, this is the superset: it also fixes what the display and body voices are, and pairs the mono with a *sans* display rather than a serif.)

## Why it works
Assigning families by function gives the reader a second, orthogonal hierarchy channel that costs no extra size, weight, or hue: you can tell *message* (display sans) from *prose* (body sans) from *machine/control* (mono) pre-attentively, so the page can stay one-weight and grayscale yet still feel structured. The mono exploits a learned convention — mono reads as "literal / system / spec" — which is exactly the connotation a devtool wants on its buttons and labels; it buys technical credibility without a single colored pixel. Because the display sans (not a serif) carries the voice, the page reads modern-product rather than editorial-publication. The mechanism transfers to any brand that wants "engineered" credibility on a clean canvas — CLIs, infra, fintech, security, data tools: split type by role, reserve mono for short chrome only, and let scale (not weight) do the leveling within each role. Constraints: never set long body copy in mono (reading speed collapses); keep mono labels short since mono sets wide; ship the display + mono as subset webfonts with `font-display: swap`; ensure muted chrome still clears AA.

## Reference implementation
```html
<style>
  /* role 1 — the VOICE: humanist/geometric display sans, regular weight, size carries it */
  .voice {
    font-family: var(--font-sans);          /* a display sans, not a serif */
    font-weight: var(--weight-regular);
    font-size: var(--text-5xl);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg);                  /* warm ink */
    text-wrap: balance;
    margin: 0;
  }

  /* role 2 — PROSE: neutral sans, demoted to muted */
  .prose {
    font-family: var(--font-sans);
    font-weight: var(--weight-regular);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-muted);
    max-width: var(--container-content);
    margin: var(--space-5) 0 0;
  }

  /* role 3 — CHROME: monospace for every functional/UI string */
  .chrome {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;               /* labels/eyebrows only */
    color: var(--color-muted);
  }
  .chrome-eyebrow { color: var(--color-subtle); margin: 0 0 var(--space-3); }

  /* a chrome control: ink-on-surface pill with a keycap affordance */
  .chrome-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    text-transform: none;
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-sm);         /* small radius = boxy/terminal, not pill */
    background: var(--color-fg);
    color: var(--color-bg);
    border: 0;
    transition: opacity var(--duration-fast) var(--ease-standard);
  }
  .chrome-btn:hover { opacity: 0.88; }
  .chrome-btn__key {                          /* the keyboard-shortcut badge */
    font-size: var(--text-xs);
    padding: 0 var(--space-2);
    border-radius: var(--radius-sm);
    background: var(--color-muted);
    color: var(--color-bg);
  }
</style>

<header>
  <!-- nav links: chrome register -->
  <nav class="chrome" aria-label="Primary">Products · Solutions · Pricing</nav>
</header>

<section>
  <p class="chrome chrome-eyebrow">Why Warp</p>           <!-- chrome eyebrow -->
  <h1 class="voice">From the terminal to the cloud, with any agent</h1>
  <p class="prose">An open agentic development environment born from the terminal.</p>
  <button class="chrome-btn">Download Warp <kbd class="chrome-btn__key">D</kbd></button>
</section>
```
