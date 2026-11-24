---
pattern: split-showcase-active-list
from: clarionhealth
corpus: production
safety: production-safe
trigger: in-view
tags: [feature-section, editorial]
---

## What it is
A 50/50 split feature block: a full-bleed image on one side, a solid dark color panel on the other. The panel holds a large serif heading, a **stacked vertical menu** of capabilities where only the *active* row is full-strength and the rest are dimmed, a hairline rule, a supporting line, and a CTA. Selecting (or auto-advancing) a row swaps the paired visual. It replaces a generic tabbed feature grid with one calm, editorial statement.

## Why it works
The dimmed inactive rows are the whole trick: they preview what's available while keeping attention on one capability, so you get the information scent of tabs without any tab chrome. Pairing the list with a solid color panel (not a card with a border/shadow) leans on **ground contrast** for structure — the block reads as a distinct "room" because the panel color differs from the page, not because it's boxed. Because hierarchy comes from opacity + scale, it stays legible and cheap: no borders, no shadows, one accent.

## Reference implementation
```html
<section class="showcase">
  <figure class="showcase__media">
    <!-- swap src when a row activates -->
    <img id="showcase-img" src="/img/receptionist.avif" alt="" />
  </figure>

  <div class="showcase__panel">
    <h2 class="showcase__title">One unified front office platform</h2>

    <ul class="showcase__list" role="tablist" aria-label="Capabilities">
      <li><button role="tab" aria-selected="true"  class="is-active">Inbound receptionist</button></li>
      <li><button role="tab" aria-selected="false">Documents &amp; referrals</button></li>
      <li><button role="tab" aria-selected="false">Outbound engagement</button></li>
    </ul>

    <hr class="showcase__rule" />
    <p class="showcase__lede">Handles scheduling, rescheduling, refills, patient
      questions, and escalations using your practice's workflows.</p>
    <a class="showcase__cta" href="/demo">Schedule a demo</a>
  </div>
</section>

<style>
  .showcase {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: var(--container-xl, 1280px);
    margin-inline: auto;
    border-radius: var(--radius-xl);            /* 16px */
    overflow: clip;
  }
  .showcase__media { margin: 0; }
  .showcase__media img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .showcase__panel {
    background: var(--color-ground-brown, #3c210c);   /* solid ground = the divider */
    color: var(--color-fg-on-dark);
    padding: var(--space-8);                            /* 4rem */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--space-6);
  }
  .showcase__title {
    font-family: var(--font-serif, "Moderat Serif Trial", Georgia, serif);
    font-size: var(--text-4xl);                        /* ~3rem */
    font-weight: var(--weight-medium);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-display);
    margin: 0;
  }

  .showcase__list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2); }
  .showcase__list button {
    all: unset;
    cursor: pointer;
    font-family: var(--font-serif, "Moderat Serif Trial", Georgia, serif);
    font-size: var(--text-xl);                         /* 1.5rem */
    line-height: var(--leading-snug);
    color: var(--color-muted-on-dark, rgba(255,255,255,0.55));   /* dimmed = inactive */
    transition: color var(--duration-base) var(--ease-standard);
  }
  .showcase__list button.is-active,
  .showcase__list button:hover,
  .showcase__list button:focus-visible {
    color: var(--color-fg-on-dark);                    /* full strength = active */
  }
  .showcase__list button:focus-visible { outline: 2px solid var(--color-fg-on-dark); outline-offset: 4px; }

  .showcase__rule  { border: 0; border-top: 1px solid var(--color-border-on-dark); margin: 0; }
  .showcase__lede  { color: var(--color-muted-on-dark, rgba(255,255,255,0.7)); max-width: 42ch; margin: 0; }
  .showcase__cta   {
    align-self: start;
    background: var(--color-fg-on-dark);
    color: var(--color-ground-brown, #3c210c);
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-full);
    text-decoration: none;
  }

  @media (max-width: 767px) { .showcase { grid-template-columns: 1fr; } }
</style>

<script>
  // Progressive enhancement: swap the paired visual on select. No framework required.
  const IMAGES = ['/img/receptionist.avif', '/img/documents.avif', '/img/outbound.avif'];
  const img = document.getElementById('showcase-img');
  document.querySelectorAll('.showcase__list button').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.showcase__list button').forEach(b => {
        b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active'); btn.setAttribute('aria-selected', 'true');
      img.src = IMAGES[i];
    });
  });
</script>
```
Notes: the active/inactive split is opacity-only, so it works with `prefers-reduced-motion` untouched (the `color` transition is trivial and can be dropped). Keep tap targets ≥44px tall — the source site under-sized some controls; give each `button` adequate vertical padding.
