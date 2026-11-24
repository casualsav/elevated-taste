---
pattern: muted-until-hover-nav
from: grafana-play
corpus: production
safety: production-safe
trigger: hover
tags: [navigation, motion, dark, hover]
---

## What it is

A list of secondary/navigational links (sidebar items, breadcrumbs, menu entries) that **rest at a reduced opacity of one shared foreground color** and rise to full opacity — links also underlining — on hover or keyboard focus. The resting state *is* the "muted" tier of the alpha ladder, so the same value that means "secondary text" everywhere else doubles as the nav's idle state; hovering simply promotes the item to the "primary" tier. Grafana Play's nav rail and breadcrumbs do exactly this: every link sits at `~65%` and animates to `100%` over `~100ms`.

## Why it works

A dense nav where every label is at full contrast competes with content for attention; dropping the resting state to the muted tier lets the whole rail recede into quiet scaffolding until the user reaches for it. Because idle and active states are the *same hue at two alphas* (not two different colors), the transition is a single `opacity`/`color` interpolation — no palette bookkeeping, and it composites cheaply with zero reflow. It reuses the exact alpha ladder the rest of the UI already defines, so it costs no new tokens and stays coherent on any dark surface. Transferable to any menu, sidebar, tab strip, or breadcrumb of navigational links.

## Reference implementation

```html
<style>
  .qnav { --gp-fg: var(--color-fg-on-dark, #ccccdc); display: flex; flex-direction: column; gap: var(--space-1); }

  .qnav__link {
    color: color-mix(in srgb, var(--gp-fg) 65%, transparent);   /* muted resting tier */
    text-decoration: none;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    transition: color var(--duration-fast) var(--ease-standard),
                background-color var(--duration-fast) var(--ease-standard);
  }
  .qnav__link:hover,
  .qnav__link:focus-visible {
    color: var(--gp-fg);                                         /* promote to primary tier */
    background: color-mix(in srgb, var(--gp-fg) 8%, transparent);
    text-decoration: underline;
  }
  .qnav__link[aria-current="page"] { color: var(--gp-fg); }      /* active item stays bright */

  /* double-ring focus that reads on any surface */
  .qnav__link:focus-visible {
    outline: 2px solid transparent;
    box-shadow: 0 0 0 2px var(--color-bg-dark, #111217),
                0 0 0 4px var(--color-grafana-focus, #3d71d9);
  }

  @media (prefers-reduced-motion: reduce) {
    .qnav__link { transition: none; }   /* state change is instant; no animated fade */
  }
</style>

<nav class="qnav" aria-label="Sections">
  <a class="qnav__link" aria-current="page" href="#">Dashboards</a>
  <a class="qnav__link" href="#">Explore</a>
  <a class="qnav__link" href="#">Alerting</a>
  <a class="qnav__link" href="#">Administration</a>
</nav>
```

Notes: the effect is pure `opacity`/`color`, so the reduced-motion fallback only needs to drop the transition (the end state is already the correct hover appearance — nothing to jump). `color-mix` gives the ladder from one `--fg`; where it's unavailable, substitute the house `--color-muted-on-dark` for the resting tier and `--color-fg-on-dark` for the active tier.
