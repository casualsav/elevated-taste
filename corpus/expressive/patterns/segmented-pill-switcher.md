---
pattern: segmented-pill-switcher
from: wokine
corpus: expressive
safety: production-safe
tags: [navigation, chrome, hero, controls]
---

## What it is

A compact navigation rendered as a single **dark, fully-rounded bar** sitting on a light page, holding two or three inline text items styled like segments of a switcher: the current one is full-white, the others are recessed to a muted gray. At one end, *nested inside the same bar*, is a **darker-still pill** acting as the primary CTA, capped with a white circular icon button (here a chat bubble: "Parlez-nous…"). It is not a glass/translucent bar and not a row of separate buttons — it is one solid object whose internal contrast does all the signposting: dark vs light = chrome vs content, white vs muted = active vs available, nested-darker = "this is the action."

## Why it works

On a light editorial canvas the usual elevation cues invert: a drop-shadow is faint on near-white and a bordered button looks like a form field. Making the control a **single dark mass** instead reframes it as a physical object resting on the page — the eye reads "this is the interface" without any box, rule, or shadow. Inside it, hierarchy is built purely from value steps (white → muted text, and a deeper-dark inset for the CTA), so the user perceives active state, secondary options, and the primary action in one glance with zero color. The transferable rule: **on light layouts, package navigation as one dark container and signal every state with internal value contrast (fill darkness + text lightness) rather than borders, shadows, or hue.** Reusable for hero nav, view/tab switchers, segmented filters, command bars, and pricing toggles — anywhere a small cluster of options needs a primary action attached.

## Reference implementation

```html
<!-- One dark bar; states come from value contrast only. All values from /tokens. -->
<style>
  .switcher {
    display: inline-flex;
    align-items: center;
    gap: var(--space-5);

    background: var(--color-chrome-bg, #2a2828);          /* dark object on a light page */
    color: var(--color-chrome-fg, #ffffff);               /* white default ink */
    padding: var(--space-2) var(--space-2) var(--space-2) var(--space-6);
    border-radius: var(--radius-full);           /* full pill */

    font-family: var(--font-sans);
    font-size: var(--text-md);
    letter-spacing: var(--tracking-tight);
  }

  /* text "segments": active is full white, the rest recede to muted */
  .switcher__seg {
    color: var(--color-chrome-fg-muted, rgba(255,255,255,0.45));         /* available-but-inactive */
    text-decoration: none;
    transition: color var(--duration-base) var(--ease-standard);
  }
  .switcher__seg:hover { color: var(--color-chrome-fg, #ffffff); }
  .switcher__seg[aria-current="page"] { color: var(--color-chrome-fg, #ffffff); } /* active */

  .switcher__seg:focus-visible {
    outline: 2px solid var(--color-chrome-fg, #ffffff);   /* hue can't carry focus on dark */
    outline-offset: var(--space-2);
    border-radius: var(--radius-sm);
  }

  /* CTA: a deeper-dark pill NESTED in the bar, with an icon cap */
  .switcher__cta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);

    background: var(--color-chrome-bg-deep, #0b0b0b);     /* darker than the bar = "the action" */
    color: var(--color-chrome-fg, #ffffff);
    text-decoration: none;
    padding: var(--space-2) var(--space-2) var(--space-2) var(--space-5);
    border-radius: var(--radius-full);
    transition: background var(--duration-base) var(--ease-standard);
  }
  .switcher__cta:hover { background: var(--color-fg); }

  .switcher__icon {
    display: grid;
    place-items: center;
    inline-size: var(--space-6);
    block-size: var(--space-6);
    border-radius: var(--radius-full);
    background: var(--color-chrome-fg, #ffffff);          /* white circular icon button */
    color: var(--color-chrome-bg-deep, #0b0b0b);
  }
  .switcher__icon svg { inline-size: 50%; block-size: 50%; }

  @media (prefers-reduced-motion: reduce) {
    .switcher__seg, .switcher__cta { transition: none; }
  }
</style>

<nav class="switcher" aria-label="Primary">
  <a class="switcher__seg" href="/work" aria-current="page">Ce qu'on fait</a>
  <a class="switcher__seg" href="/about">Qui on est</a>

  <a class="switcher__cta" href="/contact">
    Parlez-nous
    <span class="switcher__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12Z"/>
      </svg>
    </span>
  </a>
</nav>
```
