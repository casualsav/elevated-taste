---
pattern: tabbed-product-showcase
from: supabase
corpus: production
safety: production-safe
tags: [feature-section, interactive-showcase, product-marketing]
---

## What it is
A section header followed by a horizontal row of text tabs (e.g. "Table Editor / SQL Editor / RLS Policies"), and below it a single framed product screenshot that swaps to match the selected tab. One viewport stands in for what would otherwise be five stacked feature sections. The frame is a hairline border on a barely-off-white surface — no shadow, no gradient — so the product UI itself is the only thing with visual weight.

## Why it works
It compresses a broad product surface into one calm region: instead of scrolling past five near-identical feature blocks, the visitor self-selects what to look at, and the page stays short and high-signal. Keeping a single fixed frame and only changing its contents means the eye never re-anchors — attention stays on the screenshot. The pattern leans on **whitespace + one hairline border** for depth rather than shadows, matching a restrained, precise brand. Built on real tab semantics it is fully accessible and cheap; transfers to any multi-feature product with a screenshot-worthy UI.

## Reference implementation
```html
<section class="showcase">
  <h2 class="showcase__title">Stay productive and manage your app</h2>

  <div class="showcase__tabs" role="tablist" aria-label="Product views">
    <button role="tab" id="tab-table" aria-controls="panel-table" aria-selected="true"  class="tab">Table Editor</button>
    <button role="tab" id="tab-sql"   aria-controls="panel-sql"   aria-selected="false" class="tab">SQL Editor</button>
    <button role="tab" id="tab-rls"   aria-controls="panel-rls"   aria-selected="false" class="tab">RLS Policies</button>
  </div>

  <div class="frame">
    <img role="tabpanel" id="panel-table" aria-labelledby="tab-table" class="frame__img"
         src="table-editor.png" alt="Table editor view" />
    <img role="tabpanel" id="panel-sql"   aria-labelledby="tab-sql"   class="frame__img" hidden
         src="sql-editor.png"   alt="SQL editor view" loading="lazy" />
    <img role="tabpanel" id="panel-rls"   aria-labelledby="tab-rls"   class="frame__img" hidden
         src="rls-policies.png" alt="RLS policies view" loading="lazy" />
  </div>
</section>

<style>
  .showcase {
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-block: var(--space-9);
    padding-inline: var(--space-5);
    text-align: center;
  }
  .showcase__title {
    margin: 0 auto var(--space-6);
    max-width: var(--container-md);
    font-family: var(--font-sans);
    font-size: var(--text-2xl);
    font-weight: var(--weight-medium);
    line-height: var(--leading-snug);
    color: var(--color-fg);
  }

  .showcase__tabs {
    display: inline-flex;
    gap: var(--space-2);
    padding: var(--space-1);
    margin-bottom: var(--space-6);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    background: var(--color-surface);
  }
  .tab {
    font: inherit;
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-muted);
    padding: var(--space-2) var(--space-4);
    border: 0;
    border-radius: var(--radius-full);
    background: transparent;
    cursor: pointer;
    transition: color var(--duration-fast) var(--ease-standard),
                background var(--duration-fast) var(--ease-standard);
  }
  .tab[aria-selected="true"] {
    color: var(--color-fg);
    background: var(--color-bg);
  }

  .frame {
    border: 1px solid var(--color-border);   /* depth from a hairline, not shadow */
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    padding: var(--space-2);
    overflow: hidden;
  }
  .frame__img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--radius-md);
  }
  .frame__img[hidden] { display: none; }
</style>

<script>
  // Minimal tab wiring: toggle aria-selected + panel visibility.
  const tablist = document.querySelector('.showcase__tabs');
  tablist.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    for (const t of tablist.querySelectorAll('[role="tab"]')) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    }
  });
</script>
```
