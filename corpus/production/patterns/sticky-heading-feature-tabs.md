---
pattern: sticky-heading-feature-tabs
from: airtable
corpus: production
safety: production-safe
trigger: in-view
tags: [feature-section, split, motion]
---

## What it is
A two-column feature section: a short heading + one CTA in a **sticky** left column, and a tabbed media panel on the right. Selecting a tab ("From a sentence to a system" / "Automate the busywork" / "Run on shared data") swaps the right-hand product artifact; the incoming panel's contents stagger in. The left column stays pinned while the reader steps through the tabs, so the "one story, told three ways" framing never scrolls away.

## Why it works
It tells a single feature story at low density — one heading, one proof visible at a time — which is why the page reads calm even though it is doing a lot. The sticky heading anchors context (position-based hierarchy) while the tablist carries the branching. Built on real `role="tab"` semantics it is keyboard-navigable and screen-reader-correct; the stagger is `transform`/`opacity` only and gated to the visible panel, so it stays cheap. Reuse for feature, how-it-works, and use-case sections wherever you have 2–4 parallel variations of one capability.

## Reference implementation
```html
<!-- framework-neutral; tokens from /tokens. Real ARIA tab semantics. -->
<section class="feat">
  <div class="feat__grid">
    <div class="feat__head">
      <h2 class="feat__title">How to build in Airtable</h2>
      <p class="feat__lede">Build with agents across your whole team — agents included.</p>
      <a class="feat__cta" href="#">Start building free</a>

      <div class="feat__tabs" role="tablist" aria-label="Ways to build">
        <button role="tab" id="t1" aria-selected="true"  aria-controls="p1">From a sentence to a system</button>
        <button role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1">Automate the busywork</button>
        <button role="tab" id="t3" aria-selected="false" aria-controls="p3" tabindex="-1">Run on shared data</button>
      </div>
    </div>

    <div class="feat__media">
      <div role="tabpanel" id="p1" aria-labelledby="t1" class="panel is-active">…media A…</div>
      <div role="tabpanel" id="p2" aria-labelledby="t2" class="panel" hidden>…media B…</div>
      <div role="tabpanel" id="p3" aria-labelledby="t3" class="panel" hidden>…media C…</div>
    </div>
  </div>
</section>

<style>
  .feat__grid {
    display: grid; gap: var(--space-8);
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    max-width: var(--container-xl); margin-inline: auto; padding: var(--space-9) var(--space-7);
  }
  .feat__head { position: sticky; top: var(--space-7); align-self: start; }
  .feat__title { font-size: var(--text-4xl); line-height: var(--leading-tight);
                 letter-spacing: var(--tracking-heading); margin: 0 0 var(--space-3); }
  .feat__lede { color: var(--color-muted); font-size: var(--text-lg); max-width: 32ch; }
  .feat__cta { display: inline-block; margin: var(--space-5) 0 var(--space-6);
               padding: var(--space-3) var(--space-5); border-radius: var(--radius-md);
               background: var(--color-fg); color: var(--color-bg); }

  .feat__tabs { display: flex; flex-direction: column; border-top: 1px solid var(--color-hairline); }
  .feat__tabs [role="tab"] {
    text-align: left; padding: var(--space-4) 0; font-size: var(--text-md);
    color: var(--color-muted); border: 0; border-bottom: 1px solid var(--color-hairline);
    background: none; cursor: pointer; transition: color var(--duration-fast) var(--ease-standard);
  }
  .feat__tabs [role="tab"][aria-selected="true"] { color: var(--color-fg); }

  .panel[hidden] { display: none; }
  .panel.is-active > * { opacity: 0; transform: translateY(12px); animation: rise var(--duration-slow) var(--ease-entrance) forwards; }
  .panel.is-active > *:nth-child(2) { animation-delay: 80ms; }
  .panel.is-active > *:nth-child(3) { animation-delay: 160ms; }
  .panel.is-active > *:nth-child(4) { animation-delay: 240ms; }
  @keyframes rise { to { opacity: 1; transform: none; } }

  @media (max-width: 768px) {
    .feat__grid { grid-template-columns: 1fr; }
    .feat__head { position: static; }
  }
  @media (prefers-reduced-motion: reduce) {
    .panel.is-active > * { animation: none; opacity: 1; transform: none; }
  }
</style>

<script>
  // Minimal, framework-neutral tab controller with arrow-key support.
  document.querySelectorAll('.feat__tabs').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = tab => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !on;
        panel.classList.toggle('is-active', on);
      });
    };
    list.addEventListener('click', e => { const t = e.target.closest('[role="tab"]'); if (t) select(t); });
    list.addEventListener('keydown', e => {
      const i = tabs.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { tabs[(i + 1) % tabs.length].focus(); select(tabs[(i + 1) % tabs.length]); }
      if (e.key === 'ArrowUp')   { tabs[(i - 1 + tabs.length) % tabs.length].focus(); select(tabs[(i - 1 + tabs.length) % tabs.length]); }
    });
  });
</script>
```
</content>
