---
pattern: source-avatar-pill
from: retool
corpus: production
safety: production-safe
tags: [navigation, forms, integrations, interactive-showcase]
---

## What it is
A compact, rounded control (a button or dropdown trigger) that **leads with a horizontal cluster of overlapping mini logo/source icons** — the "face-pile" idiom borrowed from avatar stacks — followed by a short label and, optionally, a dropdown chevron. Retool uses two in the hero: a pile of platform logos + "Import apps built in other platforms," and a pile of provider marks + "Build via MCP." The icons overlap by a fixed negative margin so four to six marks occupy roughly the width of one and a half, turning "this works with many things" into a single glanceable token.

## Why it works
A face-pile is a learned shorthand for "a set of many" — applying it to *sources/tools/integrations* (instead of people) instantly signals breadth without a sentence or a logo wall. Overlapping the marks caps the width regardless of count, so the control stays pill-sized and scannable; the label then names the *action* while the pile carries the *scope*. It reads as concrete and credible (real product/provider marks) where an abstract icon would read as generic. Transferable anywhere you need to express multi-provider/multi-source breadth in minimal space: importers, "connect a data source," multi-channel pickers, "trusted by N integrations" chips.

## Reference implementation
```html
<button class="src-pill" type="button" aria-haspopup="listbox"
        aria-label="Import apps built in other platforms (Figma, Notion, Airtable, Slack)">
  <span class="src-pile" aria-hidden="true">
    <img class="src-dot" src="/marks/figma.svg" alt="" />
    <img class="src-dot" src="/marks/notion.svg" alt="" />
    <img class="src-dot" src="/marks/airtable.svg" alt="" />
    <img class="src-dot" src="/marks/slack.svg" alt="" />
  </span>
  <span class="src-label">Import apps built in other platforms</span>
  <svg class="src-chev" width="12" height="12" aria-hidden="true" viewBox="0 0 12 12">
    <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" stroke-width="1.5"/>
  </svg>
</button>

<style>
  .src-pill{
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);          /* bone @ low alpha on dark */
    border-radius: var(--radius-full);
    background: var(--color-surface);               /* raised dark chip */
    color: var(--color-fg);
    font-size: var(--text-sm);
    line-height: var(--leading-tight);
    cursor: pointer;
    transition: background var(--duration-base) var(--ease-standard),
                border-color var(--duration-base) var(--ease-standard);
  }
  .src-pill:hover{ border-color: var(--color-border-strong); }
  .src-pill:focus-visible{ outline: 2px solid var(--color-accent); outline-offset: 2px; }

  /* the face-pile: overlap caps width regardless of count */
  .src-pile{ display: inline-flex; }
  .src-dot{
    inline-size: var(--space-5);
    block-size: var(--space-5);
    border-radius: var(--radius-full);
    background: var(--color-surface);          /* ring so marks separate on dark */
    box-shadow: 0 0 0 2px var(--color-surface);      /* punch-out ring in pill color */
    object-fit: contain;
    padding: 2px;
  }
  .src-dot + .src-dot{ margin-inline-start: calc(-1 * var(--space-2)); } /* the overlap */

  .src-label{ white-space: nowrap; }
  .src-chev{ flex: none; color: var(--color-muted); }

  /* tight screens: keep the pile, truncate the label */
  @media (max-width: 640px){
    .src-label{
      max-width: 8ch;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
```

> Safety: the pile is decorative (`aria-hidden`) — put the full meaning, including the source names, in the control's `aria-label` so it survives the mobile label truncation. Use real, recognizable marks on a light ring (the `box-shadow` punch-out in the pill's own color) so logos stay legible against a dark chip; keep the overlap and dot size on the token scale, never magic pixels.
