---
pattern: alternative-to-logo-row
from: railway
corpus: production
safety: production-safe
tags: [feature-section, product-marketing, footer, navigation]
---

## What it is

A small horizontal strip that closes a feature section: a mono/sans micro-label reading **"Alternative to"** followed by a tight row of **muted competitor brand logos** (Heroku, Render, Fly, Vercel, AWS, …) rendered monochrome-dim so they sit quietly under the marketing copy. Railway repeats it at the foot of every feature block — networking, scaling, monitoring, workflow — each time listing the incumbents that block specifically replaces. It is the inverse of a "trusted by" logo wall: instead of friends you display, it names the *things you beat*.

## Why it works

It does competitive positioning *implicitly*, which is far more disarming than a comparison table. A row of greyed incumbent marks lets the visitor self-locate ("oh, this is my Heroku / my Vercel") and frames the product as a category replacement without a single boast or an aggressive feature matrix. Rendering the logos **muted and equal-weight** is the load-bearing move: it reads as a neutral compatibility/positioning note rather than trash-talk, keeps the brand's own accent unrivaled on the page, and visually subordinates the competitors (you are the headline; they are a footnote). Scoping one row *per feature block* makes each claim specific — "for networking we replace X, for monitoring we replace Y" — which is more credible than one generic "vs. everyone" banner. Transfers to any product entering a crowded category with known incumbents (dev tools, SaaS, fintech, infra): place a quiet "Alternative to {incumbents}" line under the relevant feature, keep the marks dim and uniform, and let recognition do the persuading. Avoid it only where you must not name competitors (some regulated/enterprise contexts) — there it becomes a legal/brand-usage risk, not a design one.

## Reference implementation

```html
<!-- framework-neutral; uses var(--token) names from /tokens, no magic numbers -->
<div class="altrow">
  <span class="altrow__label">Alternative to</span>
  <ul class="altrow__logos" role="list">
    <li><img class="altrow__logo" src="/logos/heroku.svg" alt="Heroku" width="80" height="20"></li>
    <li><img class="altrow__logo" src="/logos/render.svg" alt="Render" width="80" height="20"></li>
    <li><img class="altrow__logo" src="/logos/fly.svg"    alt="Fly.io" width="60" height="20"></li>
    <li><img class="altrow__logo" src="/logos/vercel.svg" alt="Vercel" width="80" height="20"></li>
    <li><img class="altrow__logo" src="/logos/aws.svg"    alt="AWS"    width="48" height="20"></li>
  </ul>
</div>

<style>
  .altrow {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding-block: var(--space-4);
    border-top: 1px solid var(--color-border);   /* same hairline that divides feature rows */
  }
  .altrow__label {
    font-family: var(--font-mono);               /* machine/metadata voice, not prose */
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    color: var(--color-subtle);
    white-space: nowrap;
    flex: none;
  }
  .altrow__logos {
    display: flex;
    align-items: center;
    gap: var(--space-5);
    margin: 0;
    padding: 0;
    list-style: none;
    overflow-x: auto;                            /* never wrap; scroll on narrow screens */
    scrollbar-width: none;
  }
  .altrow__logos::-webkit-scrollbar { display: none; }
  .altrow__logo {
    height: var(--space-4);                      /* uniform optical size across brands */
    width: auto;
    flex: none;
    /* flatten every mark to one dim monochrome so none competes with your accent */
    filter: grayscale(1) brightness(0) invert(1);
    opacity: 0.45;
  }
  @media (prefers-reduced-motion: no-preference) {
    .altrow__logo { transition: opacity var(--duration-fast) var(--ease-standard); }
  }
  .altrow__logo:hover { opacity: 0.7; }          /* optional: faint lift on hover */

  @media (max-width: 640px) {
    .altrow { gap: var(--space-3); }
  }
</style>
```

Tag: **production-safe** as a design technique. The real cost is non-engineering — using third-party logos as marketing implies you should respect each brand's trademark/logo-usage policy, and "alternative to {competitor}" copy can carry comparative-advertising obligations in some jurisdictions; clear it with legal for regulated verticals. Accessibility: keep each logo's `alt` as the real brand name (so the claim is announced) and don't rely on the dim opacity alone — `0.45` on small marks may miss contrast, so this row should read as supporting context, never as the only place a fact lives. The `filter: grayscale(1) brightness(0) invert(1)` chain assumes a dark surface and turns any source logo white; for light surfaces drop the `invert(1)`.
