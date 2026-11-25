---
pattern: split-card-auth
from: shadcn-login
corpus: production
safety: production-safe
tags: [auth, forms, onboarding, split-hero, card]
---

## What it is
A focused sign-in / sign-up screen built as **one centered card on a quiet field**, where the card is internally split into a form column and a decorative media panel. The media panel is a desktop-only luxury: below a mid-width breakpoint it is removed and the form goes full-width. There is no page header or nav — the card is the entire screen.

## Why it works
Collapsing the whole viewport onto a single framed object removes every competing target, so a one-task screen reads instantly. Elevation comes from a **tone step + 1px hairline + large corner radius**, not a drop shadow — calm and enterprise-safe, and it keeps shadow free to signal the one thing that matters (focus). Making the brand image a separate grid column (rather than a background) means it can vanish on mobile with zero layout surgery: the decoration is never load-bearing.

## Reference implementation
```html
<main class="auth-field">
  <section class="auth-card">
    <!-- Form column -->
    <div class="auth-form-col">
      <form class="auth-form">
        <header class="auth-head">
          <h1 class="auth-title">Welcome back</h1>
          <p class="auth-sub">Login to your Acme Inc account</p>
        </header>

        <div class="field">
          <label for="email">Email</label>
          <input id="email" type="email" placeholder="m@example.com" />
        </div>

        <div class="field">
          <div class="field-label-row">
            <label for="password">Password</label>
            <a class="field-action" href="#">Forgot your password?</a>
          </div>
          <input id="password" type="password" />
        </div>

        <button type="submit" class="btn-primary">Login</button>
      </form>
    </div>

    <!-- Media panel (desktop only) -->
    <aside class="auth-media" aria-hidden="true"></aside>
  </section>
</main>

<style>
  .auth-field {
    min-height: 100svh;
    display: grid;
    place-items: center;
    padding: var(--space-5);
    background: var(--color-bg);              /* quiet muted field, e.g. #f5f5f5 */
    color: var(--color-fg);
  }
  .auth-card {
    width: 100%;
    max-width: var(--container-md, 768px);    /* ~768–896px split card */
    display: grid;
    grid-template-columns: 1fr;               /* mobile: single column */
    overflow: hidden;
    background: var(--color-surface);         /* white card */
    border: 1px solid var(--color-border);    /* structure from hairline… */
    border-radius: var(--radius-lg, 14px);    /* …and large radius, NOT shadow */
  }
  .auth-form-col { padding: var(--space-6) var(--space-5); }
  .auth-form { display: grid; gap: var(--space-5); }     /* generous between groups */

  .auth-head { text-align: center; display: grid; gap: var(--space-1); }
  .auth-title { font-size: var(--text-xl); font-weight: var(--weight-bold);
                line-height: 1.33; margin: 0; }          /* the only large+bold node */
  .auth-sub   { font-size: var(--text-sm); color: var(--color-muted); margin: 0; }

  .field { display: grid; gap: var(--space-2); }          /* tight within a group */
  .field-label-row { display: flex; align-items: center; justify-content: space-between; }
  label { font-size: var(--text-sm); font-weight: var(--weight-medium); }
  .field-action { font-size: var(--text-sm); color: var(--color-fg); text-decoration: none; }
  .field-action:hover { text-decoration: underline; }

  input {
    height: 44px;                             /* ≥44px hit area (card default is 36px — risky on touch) */
    padding: 0 var(--space-3);
    font-size: var(--text-base);
    color: var(--color-fg);
    background: var(--color-surface);
    border: 1px solid var(--color-input, var(--color-border));
    border-radius: var(--radius-md);          /* controls 8px, card 14px */
    transition: box-shadow var(--duration-fast) var(--ease-standard),
                border-color var(--duration-fast) var(--ease-standard);
  }
  input::placeholder { color: var(--color-muted); }
  input:focus-visible {
    outline: none;
    border-color: var(--color-border-strong);
    box-shadow: 0 0 0 3px var(--color-focus-ring, rgba(163,163,163,0.4)),
                0 1px 2px rgba(0,0,0,0.05);   /* ring is the strongest visual event */
  }

  .btn-primary {
    height: 44px;
    font-size: var(--text-base); font-weight: var(--weight-medium);
    color: var(--color-accent-fg); background: var(--color-accent);  /* near-black action */
    border: none; border-radius: var(--radius-md); cursor: pointer;
    transition: opacity var(--duration-fast) var(--ease-standard);
  }
  .btn-primary:hover { opacity: 0.9; }
  .btn-primary:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-focus-ring, rgba(163,163,163,0.4));
  }

  .auth-media {
    display: none;                            /* hidden on mobile */
    background: var(--color-surface-2, #e5e5e5);   /* deeper neutral panel for brand art */
  }

  @media (min-width: 768px) {
    .auth-card  { grid-template-columns: 1fr 1fr; }
    .auth-form-col { padding: var(--space-7) var(--space-6); }
    .auth-media { display: block; }
  }
</style>
```
