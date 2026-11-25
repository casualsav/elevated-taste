---
pattern: mono-label-metadata
from: vercel
corpus: production
safety: production-safe
tags: [typography, eyebrow, feature-section, navigation, label]
---

## What it is

A second typographic *register* — a monospace family, set uppercase, letter-spaced, and muted — reserved exclusively for metadata: hero eyebrows (`FOR CODING AGENTS`), section captions (`Features`), spec/feature lists (`AI MODEL GATEWAY`, `FLUID COMPUTE`), tags, and code-adjacent annotations. The proportional sans keeps every headline and paragraph; the mono never carries prose. On Vercel the two voices interleave down the whole page — a giant sans claim, a tracked mono eyebrow beside it, a mono spec-list beneath — so each block silently announces which parts are *message* and which are *annotation*.

## Why it works

Switching to a monospace, tracked, uppercase, muted treatment changes four perceptual signals at once (rhythm, case, spacing, contrast), so the reader sorts label-from-content pre-attentively — no box, no rule, no extra accent color needed. It exploits a learned convention: mono reads as "machine / literal / spec," which is exactly the right connotation for feature flags, API names, and metadata on a developer surface. Because it costs no new hue and no new size, it adds a full level of hierarchy for free and keeps a monochrome page calm. The mechanism transfers to any product with system-y metadata next to prose: changelog entry types, status/spec labels, table column eyebrows, pricing-tier tags, docs callout kickers. Constraints: keep mono copy *short* (it sets wide), reserve uppercase+tracking for labels only (never multi-line mono body — it gets unreadable), and keep the muted tone above AA so the label is legible, not decorative.

## Reference implementation

```html
<style>
  /* the metadata register */
  .meta-label {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: var(--leading-normal);
    letter-spacing: var(--tracking-wide);   /* opens the uppercase forms */
    text-transform: uppercase;
    color: var(--color-muted);              /* demoted vs ink prose */
  }

  /* eyebrow stack beside a big sans claim */
  .meta-eyebrow {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  /* a labeled spec / feature list */
  .meta-spec { display: flex; flex-direction: column; gap: var(--space-2); }
  .meta-spec__caption { /* the "Features" kicker */
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-subtle);             /* one step quieter than the items */
    margin-bottom: var(--space-2);
  }
  .meta-spec__item {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-fg);                 /* items are ink; caption is muted */
  }
</style>

<!-- hero eyebrow: mono metadata sitting beside a sans display headline -->
<aside class="meta-eyebrow" aria-label="Summary">
  <span class="meta-label">For coding agents</span>
  <span class="meta-label">To ship apps and agents</span>
  <span class="meta-label">Automated by agents</span>
</aside>

<!-- labeled spec list under a claim -->
<div class="meta-spec">
  <span class="meta-spec__caption">Features</span>
  <span class="meta-spec__item">Durable orchestration</span>
  <span class="meta-spec__item">Sandboxed environments</span>
  <span class="meta-spec__item">AI model gateway</span>
  <span class="meta-spec__item">Fluid compute</span>
</div>
```
