---
pattern: code-block-hero
from: resend
corpus: production
safety: production-safe
tags: [hero, feature-section, developer-tool, interactive-showcase, docs]
---

## What it is

A centered "show the product" block for an API / SDK / CLI: a short sans header and lede, then a single large code surface whose top edge is a **horizontal tab bar of languages or frameworks** (Node.js · Next.js · Remix · Express · Hono · Bun · Astro…). The body is a real, syntax-highlighted snippet — keywords/strings in the brand accent and semantic green — sitting on a barely-lifted near-black surface with a hairline border, plus quiet "Copy / View on GitHub" affordances. The code is the hero artifact; there is no illustration.

## Why it works

For a developer product the code *is* the value proposition and the proof of "first-class DX" — rendering an actual, runnable snippet earns more trust than abstract art. The framework tab bar does double duty: it signals broad ecosystem support and gives one concrete interaction ("that's *my* stack") without leaving the section. Tinting the syntax with the same accent + semantic colors used elsewhere ties the code into the page's palette so it reads as product, not as an embedded third-party widget. On a dark page a low-lift surface + hairline border lets the block feel inset rather than floating in a bright box. Transfers to any API, SDK, CLI, query-language, or config-driven product: lead with real, stack-switchable code above the fold.

## Reference implementation

```html
<!-- framework-neutral; var(--token) names from /tokens, no magic numbers -->
<section class="cbh">
  <h2 class="cbh__title">Integrate tonight</h2>
  <p class="cbh__lede">
    A simple, elegant interface so you can start sending emails in minutes —
    it fits right into your code with SDKs for your favorite languages.
  </p>

  <figure class="cbh__panel">
    <div class="cbh__tabs" role="tablist" aria-label="Framework">
      <button class="cbh__tab" role="tab" aria-selected="true">Node.js</button>
      <button class="cbh__tab" role="tab" aria-selected="false">Next.js</button>
      <button class="cbh__tab" role="tab" aria-selected="false">Remix</button>
      <button class="cbh__tab" role="tab" aria-selected="false">Express</button>
      <button class="cbh__tab" role="tab" aria-selected="false">Bun</button>
      <button class="cbh__copy" type="button" aria-label="Copy code">Copy</button>
    </div>
    <pre class="cbh__code"><code><span class="tok-kw">import</span> { Resend } <span class="tok-kw">from</span> <span class="tok-str">'resend'</span>;

<span class="tok-kw">const</span> resend = <span class="tok-kw">new</span> Resend(<span class="tok-str">'re_xxxxxxxxx'</span>);

<span class="tok-kw">await</span> resend.emails.send({
  from: <span class="tok-str">'onboarding@resend.dev'</span>,
  to:   <span class="tok-str">'delivered@resend.dev'</span>,
  subject: <span class="tok-str">'Hello World'</span>,
});</code></pre>
  </figure>
</section>

<style>
  .cbh {
    max-width: var(--container-md);
    margin-inline: auto;
    padding-block: var(--space-9);          /* generous vertical breaks */
    text-align: center;
  }
  .cbh__title {
    font-family: var(--font-sans);
    font-size: var(--text-4xl);
    font-weight: var(--weight-regular);     /* size carries it; stay calm */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg);
    margin: 0;
  }
  .cbh__lede {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-muted);
    max-width: var(--container-content);
    margin: var(--space-4) auto var(--space-7);
    text-wrap: balance;
  }
  .cbh__panel {
    margin: 0;
    text-align: left;
    border-radius: var(--radius-lg);
    background: var(--color-surface);                 /* barely-lifted, inset feel */
    box-shadow: var(--shadow-sm), 0 0 0 1px var(--color-border);
    overflow: hidden;
  }
  .cbh__tabs {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }
  .cbh__tab {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    color: var(--color-muted);
    background: transparent;
    border: 0;
    border-radius: var(--radius-full);               /* pill tabs */
    padding: var(--space-1) var(--space-3);
    cursor: pointer;
  }
  .cbh__tab[aria-selected="true"] {
    color: var(--color-fg);
    background: var(--color-surface-2);
  }
  .cbh__copy {
    margin-inline-start: auto;
    font-size: var(--text-sm);
    color: var(--color-muted);
    background: transparent;
    border: 0;
    cursor: pointer;
  }
  .cbh__code {
    margin: 0;
    padding: var(--space-5);
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--color-fg);
    tab-size: 2;
  }
  /* syntax tinted from the page palette, not a foreign theme */
  .tok-kw  { color: var(--color-accent); }
  .tok-str { color: var(--color-success); }

  @media (prefers-reduced-motion: no-preference) {
    .cbh__tab { transition: color var(--duration-fast) var(--ease-standard),
                            background-color var(--duration-fast) var(--ease-standard); }
  }
  @media (max-width: 640px) {
    .cbh__title { font-size: var(--text-3xl); }
    .cbh__tabs { overflow-x: auto; }                 /* tabs scroll, never wrap */
  }
</style>
```

Render the highlighted code as static server-side HTML (the `tok-*` spans) rather than booting a client editor library, so the above-the-fold code block isn't JS-blocked; lazy-init only the optional Copy / tab-switch behavior. Requires `--color-success` (semantic green) for the string token; if your theme lacks one, reuse `--color-accent` for both and rely on weight for separation.
