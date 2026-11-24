---
pattern: mono-eyebrow-fluid-masthead
from: enode
corpus: production
safety: production-safe
tags: [hero, section-header, typography]
---

## What it is
A section/hero header built from two type registers on a warm near-monochrome ground: a small uppercase **monospace eyebrow** prefixed by a tiny signal square, sitting above a **fluid-clamp masthead** set in a single variable sans. Hierarchy comes entirely from scale contrast (a ~3–4× jump from body to display) plus the font-family switch — not from heavier weight or color. The one saturated hue in the system appears only as the eyebrow's square marker, so it reads as a "live / system" tag rather than decoration.

## Why it works
The monospace eyebrow carries *meaning*: the typeface switch itself tells the reader "this is a measured, machine-level fact," which is why it suits infra/energy/developer products. The masthead uses `clamp()` so it scales smoothly between mobile and desktop with no breakpoint jump, and negative tracking on the large size keeps a big headline optically tight while the small caps eyebrow opens up with positive tracking. Because weight stays nearly constant, the whole block reads as one calm voice and the eye ranks by size alone. Reserving the single accent hue for the 6px marker makes color a scarce signal, not a texture.

## Reference implementation
```html
<!-- framework-neutral; var(--token) names from /tokens, inline fallbacks for brand values -->
<header class="section-head">
  <p class="eyebrow"><span class="eyebrow-mark" aria-hidden="true"></span>The platform</p>
  <h1 class="masthead">Orchestrating energy<br>for the next grid</h1>
  <p class="standfirst">One platform for energy retailers and the teams that trade for
    them. Connect every asset, coordinate every home, and shape thousands as one.</p>
</header>

<style>
  .section-head {
    /* warm near-mono ground + ink ramp */
    background: var(--color-bg, #f4f2f1);
    color: var(--color-fg, #252322);
    max-width: var(--container-xl, 1280px);
    padding: var(--space-8, 4rem) var(--space-5, 1.5rem);
    font-family: var(--font-sans, "Enode Sans", system-ui, sans-serif);
  }

  /* monospace eyebrow — a semantic label register, not just small text */
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    margin: 0 0 var(--space-5, 1.5rem);
    font-family: var(--font-mono, "Enode Mono", ui-monospace, monospace);
    font-size: var(--text-xs, 0.75rem);
    font-weight: var(--weight-medium, 500);
    letter-spacing: var(--tracking-caps, 0.06em); /* small caps open up */
    text-transform: uppercase;
    color: var(--color-muted, #4c4948);
  }
  .eyebrow-mark {
    width: 6px; height: 6px;
    background: var(--color-signal-lime, #b0f87c); /* the one rationed accent */
    border-radius: var(--radius-sm, 2px);
  }

  /* fluid masthead — scale does the ranking; weight stays near body */
  .masthead {
    margin: 0;
    font-size: clamp(2.125rem, 1.211rem + 3.9vw, 4.25rem); /* 34 → 68px */
    line-height: 1.05;
    letter-spacing: var(--tracking-display, -0.022em); /* tight at large size */
    font-weight: var(--weight-medium, 500);          /* NOT bold */
    text-wrap: balance;
  }

  .standfirst {
    max-width: 34ch;
    margin: var(--space-5, 1.5rem) 0 0;
    font-size: var(--text-md, 1.125rem);
    line-height: var(--leading-normal, 1.5);
    font-weight: var(--weight-regular, 400);
    color: var(--color-muted, #4c4948);
  }
</style>
```
