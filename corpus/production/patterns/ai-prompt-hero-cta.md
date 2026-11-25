---
pattern: ai-prompt-hero-cta
from: fillout
corpus: production
safety: production-safe
trigger: load
tags: [hero, forms, ai, cta, motion]
---

## What it is

A hero whose primary call-to-action is the product's **real generate-input** instead of a "Sign up" button — a prompt textarea plus an inline submit, wrapped in an animated shine border that sweeps around the edge to say "type here." Fillout opens with `Describe the form you want to create…` + `Create form →`; the visitor's first gesture is *using* the tool, not registering for it.

## Why it works

For a generative/AI product the empty input IS the pitch: it demonstrates the interaction model and lowers the cost of trying from "create an account" to "type a sentence." The travelling shine border is a moving highlight (an animated gradient position, not layout) — cheap on the compositor, and far more magnetic than a static glow. Keeping it monochrome except for the border draws the eye without adding a competing color. Because it's the actual product surface, it doubles as a live demo.

## Reference implementation

```html
<section class="hero">
  <p class="eyebrow">New · AI agent</p>
  <h1 class="hero-title">Forms that <em>do it all</em></h1>
  <p class="hero-sub">Make any form with the all-in-one form solution.</p>

  <form class="prompt" aria-label="Describe your form">
    <div class="prompt__shine" aria-hidden="true"></div>
    <textarea class="prompt__input" rows="2"
      placeholder="Describe the form you want to create…"></textarea>
    <button class="prompt__submit" type="submit">Create form →</button>
  </form>
</section>

<style>
  .hero { max-width: var(--container-lg, 1024px); margin-inline: auto; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: var(--space-5); }
  .eyebrow { font-size: var(--text-sm); color: var(--color-muted);
             padding: var(--space-1) var(--space-3); border: 1px solid var(--color-border);
             border-radius: var(--radius-full); }
  .hero-title { font-size: var(--text-display); line-height: var(--leading-tight);
                color: var(--color-fg); font-weight: var(--weight-regular); }
  .hero-title em { font-style: italic; }           /* upright + italic mix within one line */
  .hero-sub { font-size: var(--text-md); color: var(--color-muted); }

  /* Prompt card with a travelling shine border */
  .prompt { position: relative; width: min(100%, 560px);
            display: flex; align-items: flex-end; gap: var(--space-2);
            padding: var(--space-3); border-radius: var(--radius-xl);
            background: var(--color-bg);
            box-shadow: 0 12px 32px -6px var(--color-hairline),
                        0 0 0 1px var(--color-border); }
  .prompt__input { flex: 1; border: 0; resize: none; background: transparent;
                   font: inherit; font-size: var(--text-base); color: var(--color-fg); }
  .prompt__input:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
  .prompt__submit { flex: none; padding: var(--space-2) var(--space-4);
                    border-radius: var(--radius-lg); border: 0;
                    background: var(--color-fg); color: var(--color-bg);
                    font-weight: var(--weight-medium); cursor: pointer;
                    transition: background var(--duration-fast) var(--ease-standard); }
  .prompt__submit:hover { background: var(--color-action-hover, #424242); }

  /* Animated gradient border: a conic sweep clipped to a 1.5px ring via mask */
  .prompt__shine { position: absolute; inset: 0; border-radius: inherit; padding: 1.5px;
                   background: conic-gradient(from var(--angle, 0deg),
                     transparent 0turn, var(--color-accent-gold, #f9b31e) .12turn, transparent .28turn, transparent 1turn);
                   -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                   -webkit-mask-composite: xor; mask-composite: exclude;
                   animation: shine-border-travel 3.5s linear infinite; }
  @property --angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
  @keyframes shine-border-travel { to { --angle: 360deg; } }

  @media (prefers-reduced-motion: reduce) {
    .prompt__shine { animation: none;
      background: linear-gradient(var(--color-accent-gold, #f9b31e), var(--color-accent-gold, #f9b31e)); opacity: .5; }
  }
</style>
```
