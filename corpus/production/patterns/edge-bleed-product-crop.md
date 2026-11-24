---
pattern: edge-bleed-product-crop
from: felt
corpus: production
safety: production-safe
tags: [feature-section, product-shot, hero, layout, screenshot]
---

## What it is

The copy sits in a narrow, centered measure. The product screenshot sits in a rail **wider than the viewport** and runs off the right edge, cropped by the window rather than by a frame. No browser chrome, no floating device mockup, no drop shadow, no perspective tilt — just the real application, too large to fit. Felt puts its text in a 940px column and its dashboard shots in an 1800px rail on a 1440px page: a 5,000-point map with a legend, a histogram, and a live comment thread, sheared off mid-continent.

## Why it works

A screenshot inside a rounded, shadowed card is read as an *illustration of software*. The same screenshot cropped by the viewport is read as *software*, because the crop is the only visual convention that means "this continues." The frame answers "how big is it?" with "this big." The crop refuses to answer, and refusal is the stronger claim.

That makes the pattern conditional, not universal: **it only works when the artifact rewards inspection.** A dense, real UI at 1:1 (or near it) survives being cropped, because whatever the viewport keeps is still legible and still busy. A sparse mockup that gets cropped just looks broken. The test before reaching for this: *if I cut the right third off this image, is what remains still evidence?*

The composition also inverts the usual density gradient. The page is calm — centered eyebrow, one display line, one subhead in a 640px measure, then acres of ground. All the information lives inside the artifact. A page that crowds itself to prove the product is capable is arguing; a calm page holding one overwhelming screenshot is demonstrating.

Two implementation details carry it:

- **`overflow-x: clip`, not `hidden`.** `hidden` silently makes the element a scroll container, which breaks `position: sticky` on any ancestor or descendant and can trap focus scroll. `clip` cuts the pixels without any of that.
- **Start the rail at the content column's left edge, then let it grow right.** Left-aligning the shot with the prose keeps the crop reading as deliberate. Centering an over-wide image bleeds symmetrically and reads as a sizing bug.

## Reference implementation

```html
<section class="showcase">
  <div class="showcase__head">
    <p class="showcase__eyebrow">Dashboards</p>
    <h2 class="showcase__title">Empower your team with dashboards</h2>
    <p class="showcase__lede">Chart a time series, filter categories on the fly, and
      highlight statistics — without a development cycle.</p>
  </div>

  <figure class="showcase__rail">
    <img class="showcase__shot" src="/img/dashboard.png" width="1800" height="1013"
         loading="lazy" decoding="async"
         alt="Sales performance dashboard: a map of the United States with several
              thousand plotted orders, a category legend, an annual-revenue histogram,
              and a teammate's comment thread pinned to the Northwest region." />
  </figure>
</section>
```

```css
.showcase {
  /* `clip` crops without creating a scroll container — `hidden` would break
     any sticky positioning in this subtree. */
  overflow-x: clip;
  padding-block: var(--space-10);
  background: transparent;
}

.showcase__head {
  max-width: var(--container-content);
  margin-inline: auto;
  padding-inline: var(--space-5);
  text-align: center;
}
.showcase__eyebrow {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--color-muted-on-dark);
}
.showcase__title {
  font-size: var(--text-5xl);
  font-weight: var(--weight-regular);       /* scale carries the hierarchy, not weight */
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-display);
  color: var(--color-fg-on-dark);
  margin-block: var(--space-4) var(--space-5);
}
.showcase__lede {
  max-width: var(--container-sm);
  margin-inline: auto;
  color: var(--color-muted-on-dark);
  line-height: var(--leading-normal);
}

/* The rail: begins flush with the content column, ends past the window. */
.showcase__rail {
  margin: var(--space-9) 0 0;
  margin-inline-start: max(var(--space-5), calc(50vw - var(--container-lg) / 2));
}
.showcase__shot {
  display: block;
  width: var(--shot-width, 125vw);           /* > 100vw is the whole point */
  max-width: var(--shot-max, 1800px);
  height: auto;
  border-radius: var(--radius-md);           /* the ONLY frame — no shadow, no chrome */
}

@media (max-width: 767px) {
  .showcase__rail { margin-inline-start: var(--space-5); }
  .showcase__shot { width: var(--shot-width-sm, 165vw); }  /* crop harder, stay at 1:1 */
}
```

**Accessibility.** The cropped region is unreachable — so the `alt` text must describe *what the whole screenshot shows*, not what survives the crop, and it should name the specific evidence (counts, controls, real numbers) rather than saying "a dashboard." If the shot carries information a user might need, link a full-size view beside it; never rely on the crop being scrollable, because `clip` guarantees it isn't.

**When not to use it.** Sparse UI, invented mockups, anything where the right third is empty canvas. Crop a screenshot that has nothing in it and you've only advertised that.
