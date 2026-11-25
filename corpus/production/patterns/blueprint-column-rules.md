---
pattern: blueprint-column-rules
from: knock
corpus: production
safety: production-safe
tags: [layout, feature-section, structure, dev-tools]
---

## What it is

A full-width content band whose **grid columns are drawn as thin vertical hairlines** — 0.5px rules dropped at the column boundaries, running the full height of the section, sitting *above* the content as a non-interactive overlay. Instead of putting cards in boxes or separating regions with fills, the layout exposes its own skeleton: the reader sees the engineering grid the page was built on. Knock uses it to frame every feature band, so dense product mockups read as precisely placed on a technical drawing rather than floating in whitespace.

Reach for it on developer-tool, infrastructure, or data-product marketing where the brand promise is *rigor and control*. It gives structure and a "schematic" personality at almost zero visual weight — the page stays 95% whitespace but never feels loose.

## Why it works

Borders around cards say "here are some boxes." Rules *between* columns say "here is a system." The hairline is faint enough (a near-invisible cool gray) that it never competes with content, but present enough that the eye registers alignment — every element in the band visibly snaps to the same grid, which is exactly the feeling an infra product wants to sell.

Three construction rules make it safe:

**The rules are an overlay, not layout.** Draw them in an absolutely-positioned layer with `pointer-events:none` above the grid, so they never affect flow, wrapping, or clicks. The content grid underneath is a normal responsive grid; the rules just visualize its tracks.

**Match the rules to the *actual* columns, and drop them on breakpoints.** Two or three rules on desktop; collapse to the outer frame (or none) on mobile where the grid becomes one column. Rules that don't line up with real content edges look like noise.

**Keep them hairline and cool.** 0.5px (or 1px at `transform: scaleX(.5)` for crisper sub-pixel) in a low-contrast gray. If you can read the rule from across the room, it's too strong.

There's no motion; nothing to gate for reduced motion.

## Reference implementation

```html
<style>
  .band {
    position: relative;
    max-inline-size: var(--container-xl, 1216px);
    margin-inline: auto;
    padding-block: var(--space-9);          /* generous air; the rules carry the structure */
    padding-inline: var(--space-5);
  }

  /* The real content grid — a normal responsive 12-track grid. */
  .band__grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: var(--space-5);
    align-items: start;
  }

  /* The blueprint overlay: vertical hairlines at chosen column edges. */
  .band__rules {
    position: absolute;
    inset: 0;
    pointer-events: none;                    /* never intercept clicks */
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    z-index: 2;                              /* above content, but inert */
  }
  /* A rule = a 0.5px line on the leading edge of selected tracks. */
  .band__rules > i {
    border-inline-start: 0.5px solid var(--color-hairline, #cdced6);
  }
  /* Close the frame on the trailing edge. */
  .band__rules::after {
    content: "";
    position: absolute;
    inset-block: 0;
    inset-inline-end: 0;
    border-inline-end: 0.5px solid var(--color-hairline, #cdced6);
  }

  /* Mobile: single column — retire the interior rules, keep only the frame. */
  @media (max-width: 768px) {
    .band__grid { grid-template-columns: 1fr; }
    .band__rules > i { border-inline-start: none; }
    .band__rules {
      border-inline: 0.5px solid var(--color-hairline, #cdced6);
      display: block;
    }
  }
</style>

<section class="band">
  <!-- Overlay: one <i> per grid track; borders render the column edges. -->
  <div class="band__rules" aria-hidden="true">
    <i></i><i></i><i></i><i></i><i></i><i></i>
    <i></i><i></i><i></i><i></i><i></i><i></i>
  </div>

  <div class="band__grid">
    <header style="grid-column: 1 / -1">
      <h2>Unify and activate your data.</h2>
    </header>
    <figure style="grid-column: 1 / span 6"><!-- product mockup --></figure>
    <figure style="grid-column: 7 / span 6"><!-- product mockup --></figure>
  </div>
</section>
```
