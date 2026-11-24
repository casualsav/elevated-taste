---
pattern: saturated-icon-tile-grid
from: rainbow
corpus: production
safety: production-safe
tags: [feature-section, capabilities]
---

## What it is
A feature/capability grid where each item leads with a **vivid, saturated rounded-square tile** holding a single bold line-icon, followed by a heavy label and a muted one-line description. The tiles cycle through a bright accent palette (cyan, yellow, magenta, green, orange, purple) so the row reads as a playful spectrum, while the surrounding page stays neutral. It replaces the generic "three cards + fake dashboard mockup" feature block.

## Why it works
Color is rationed to small, high-contrast objects, so the section feels energetic without fatiguing — the saturation never spans more than a ~64px tile. The repeated big radius and the single-icon-per-tile rule make the row instantly scannable: the eye hops tile→tile, then drops to read. Because the chrome is identical and only hue changes, a developer can add or reorder capabilities freely and the system holds. Transfers to any product's "what it does" section.

## Reference implementation
```html
<style>
  .cap-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-48, 48px) var(--space-32, 32px);
    max-width: var(--container, 1100px);
    margin-inline: auto;
  }
  @media (max-width: 720px) { .cap-grid { grid-template-columns: 1fr; } }

  .cap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-16, 16px);
  }
  .cap__tile {
    width: 64px; height: 64px;
    display: grid; place-items: center;
    border-radius: var(--radius-24, 24px);
    background: var(--tile);            /* set per-item, see below */
    color: #0f101a;                     /* black line-icon on saturated ground */
  }
  .cap__tile svg { width: 32px; height: 32px; stroke: currentColor; fill: none; stroke-width: 2.5; }

  .cap__title { font: 700 1.25rem/1.2 var(--font-rounded, system-ui); color: var(--fg, #0f101a); }
  .cap__title b { font-weight: 800; }
  .cap__desc  { font: 500 1rem/1.4 var(--font-rounded, system-ui); color: var(--muted, #777885); max-width: 24ch; }

  /* rotate the accent palette per tile */
  .cap:nth-child(6n+1) .cap__tile { --tile: var(--tile-cyan,    #00f0f0); }
  .cap:nth-child(6n+2) .cap__tile { --tile: var(--tile-yellow,  #ffd400); }
  .cap:nth-child(6n+3) .cap__tile { --tile: var(--tile-magenta, #ff54bb); }
  .cap:nth-child(6n+4) .cap__tile { --tile: var(--tile-green,   #3ddc4a); }
  .cap:nth-child(6n+5) .cap__tile { --tile: var(--tile-orange,  #ff8a00); }
  .cap:nth-child(6n+6) .cap__tile { --tile: var(--tile-purple,  #8c64ff); }
</style>

<section class="cap-grid">
  <div class="cap">
    <span class="cap__tile"><svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg></span>
    <p class="cap__title"><b>Impersonation mode</b></p>
    <p class="cap__desc">Use any wallet in read-only mode with just an address</p>
  </div>
  <!-- repeat .cap; the tile hue advances automatically -->
</section>
```
