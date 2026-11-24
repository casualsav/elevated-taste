---
pattern: auth-first-hero
from: emergent
corpus: production
safety: production-safe
tags: [hero, auth, landing, plg]
---

## What it is
A hero that puts the **sign-up action itself** in the primary column instead of a headline + single CTA. The left column is a compact auth panel — a stack of social-login buttons (Google / Apple / Facebook), an "or" divider, then email/phone fallbacks and legal fine-print. The right column is a floating product showcase (a bounded card holding the one saturated asset — a gradient, a demo, a screenshot grid). For warm-traffic PLG products, the first screen *is* the conversion step.

## Why it works
It collapses the funnel: the highest-intent visitor doesn't scroll past a pitch to find the door — the door is the hero. The showcase card carries the "why" visually so no large headline is needed, which is what keeps the auth panel from feeling like a bare login form. The whole thing is drawn with a single hairline border and one pill radius, so a generic auth stack reads as a designed system, not a modal. It only works with warm/branded traffic (returning users, ad clicks with context) — a cold visitor gets no argument, so keep one line of value context above the buttons.

## Reference implementation
```html
<section class="hero">
  <!-- LEFT: the conversion action is the hero -->
  <div class="auth">
    <p class="auth__context">Build full-stack web &amp; mobile apps in minutes</p>

    <button class="btn btn--social">Continue with Google</button>
    <div class="auth__oauth-row">
      <button class="btn btn--icon" aria-label="Continue with GitHub"><!-- svg --></button>
      <button class="btn btn--icon" aria-label="Continue with Apple"><!-- svg --></button>
      <button class="btn btn--icon" aria-label="Continue with Facebook"><!-- svg --></button>
    </div>

    <div class="auth__divider"><span>or</span></div>

    <button class="btn btn--muted">Continue with Email</button>
    <button class="btn btn--muted">Continue with Phone</button>

    <p class="auth__legal">By continuing, you agree to our
      <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</p>
  </div>

  <!-- RIGHT: the one saturated asset, contained in a card -->
  <div class="showcase" role="img" aria-label="Emergent building custom agents">
    <div class="showcase__badge">10k+ custom agents</div>
    <div class="showcase__grid">
      <article class="agent">Research Agent</article>
      <article class="agent">Data Analyst Agent</article>
      <article class="agent">Automation Engineer</article>
      <article class="agent">And many more</article>
    </div>
  </div>
</section>

<style>
  .hero {
    display: grid; grid-template-columns: minmax(320px, 40%) 1fr;
    gap: var(--space-8, 4rem); align-items: center;
    max-width: var(--container-xl, 1280px); margin-inline: auto;
    padding: var(--space-9, 6rem) var(--space-6, 2rem);
  }
  .auth { display: flex; flex-direction: column; gap: var(--space-3, 0.75rem); max-width: 360px; }
  .auth__context { font: 500 1rem/1.5 var(--font-sans); color: var(--color-muted, #666); margin-bottom: var(--space-2, 0.5rem); }

  /* one pill regime + one hairline = designed, not a bare form */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2, 0.5rem);
    padding: var(--space-3, 0.75rem) var(--space-5, 1.5rem);
    border: 1px solid var(--color-border, #e5e3e1);
    border-radius: var(--radius-full, 9999px);
    font: 500 0.9375rem/1 var(--font-sans); color: var(--color-fg, #0e0e0e);
    background: #fff; cursor: pointer;
    transition: transform var(--duration-fast, 150ms) var(--ease-standard, cubic-bezier(0.4,0,0.2,1)),
                background-color var(--duration-fast, 150ms) var(--ease-standard, cubic-bezier(0.4,0,0.2,1));
  }
  .btn--muted   { background: var(--color-surface-2, #ebebeb); border-color: transparent; }
  .btn--muted:hover { background: #d9d9d9; }
  .btn--social:hover { transform: translateY(-3px); box-shadow: 0 0 35px rgba(255,255,255,0.18); }
  .btn--icon { flex: 1; }
  .auth__oauth-row { display: flex; gap: var(--space-3, 0.75rem); }

  .auth__divider { display: flex; align-items: center; gap: var(--space-3, 0.75rem); color: var(--color-muted, #666); font-size: 0.8125rem; }
  .auth__divider::before, .auth__divider::after { content: ""; flex: 1; height: 1px; background: var(--color-border, #e5e3e1); }
  .auth__legal { font-size: 0.75rem; color: var(--color-muted, #666); line-height: 1.5; }

  .showcase {
    border-radius: var(--radius-xl, 16px); padding: var(--space-6, 2rem);
    background: linear-gradient(90deg,
      var(--color-gradient-from, #4e9bee), var(--color-gradient-mid, #57d5fe) 58.5%, var(--color-gradient-to, #3489fe));
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  }
  .showcase__badge { color:#fff; font-weight:600; font-size:1.375rem; margin-bottom: var(--space-5,1.5rem); }
  .showcase__grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3, 0.75rem); }
  .agent {
    background: rgba(0,0,0,0.9); color:#fff; border-radius: var(--radius-lg, 12px);
    padding: var(--space-4, 1rem); font-size: 0.875rem;
  }

  @media (max-width: 860px) {
    .hero { grid-template-columns: 1fr; }
    .auth { max-width: none; order: 1; }        /* auth first on mobile too */
    .showcase { order: 0; }
  }
</style>
```
