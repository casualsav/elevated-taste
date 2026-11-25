---
pattern: register-shift-hero
from: lassie
corpus: production
safety: production-safe
tags: [hero, editorial, brand-experience]
---

## What it is
A full-bleed media hero where the headline is set in an emotional **serif** voice that names the human ("You're a doctor. Not a machine."), while the product proves its function nearby in a **sans/mono** voice (UI cards, factual notifications). The hero sells a feeling; the supporting copy sells the mechanism. The two type registers are doing two different jobs on purpose.

## Why it works
Most B2B product heroes use one neutral sans for everything, so the emotional claim and the factual proof read in the same tone — flat. Splitting registers gives each its natural voice: a literary serif italic carries warmth and aspiration (what the buyer *feels*), a clean sans/mono carries precision and evidence (what the product *does*). The contrast itself is the message — "you are human, the work is automated." It humanizes an otherwise clinical category without a single illustration, and it works on a restrained palette because the type does the differentiating.

## Reference implementation
```html
<section class="hero">
  <img class="hero__media" src="/doctor.jpg" alt="A physician at a sunlit window" />
  <div class="hero__scrim"></div>
  <div class="hero__copy">
    <h1 class="hero__headline">You're a doctor.<br /><em>Not a machine.</em></h1>
    <p class="hero__sub">AI that runs the back office, so your team can focus on patients.</p>
    <a class="hero__cta" href="/demo">Get started</a>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 86vh;
    display: grid;
    place-items: end start;
    color: #fff;
    background: var(--gradient-hero-sky, linear-gradient(180deg, #6dc8e4, #c3eaf4));
  }
  .hero__media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  /* readable serif on the brightest part of the photo */
  .hero__scrim {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(18,12,8,.45));
  }
  .hero__copy { position: relative; padding: var(--space-32, 32px); max-width: 38ch; }

  /* serif = the emotional register */
  .hero__headline {
    font-family: var(--font-serif, "abcMarist", Georgia, serif);
    font-weight: 350;
    font-size: clamp(3.2rem, 8vw, 5.4rem);
    line-height: 1.02;
    letter-spacing: -0.02em;
    margin: 0 0 var(--space-16, 16px);
  }
  .hero__headline em { font-style: italic; }

  /* sans = the factual / product register */
  .hero__sub {
    font-family: var(--font-sans, "dmSans", system-ui, sans-serif);
    font-size: 1.0625rem;
    line-height: 1.5;
    max-width: 32ch;
    margin: 0 0 var(--space-24, 24px);
    opacity: .92;
  }
  .hero__cta {
    font-family: var(--font-sans, "dmSans", system-ui, sans-serif);
    display: inline-block;
    padding: 12px 24px;
    border-radius: var(--radius-pill, 64px);
    background: #fff; color: var(--color-fg, #1a1613);
    text-decoration: none;
  }
</style>
```

Pair it with factual proof cards (e.g. "Completed Humana enrollment") set in the sans/mono register — that's the other half of the register shift. Always verify the resting serif text clears contrast over the *brightest* region of the photo; add or deepen the scrim if not.
