---
slug: shadcn-login
url: https://ui.shadcn.com/view/new-york-v4/login-04
source: manual
corpus: production
surface: app
captured: 2026-11-25
award_type: Reference component (shadcn/ui new-york-v4 "login-04" block)
score: null
tags: [saas, b2b, auth, design-system, shadcn, tailwind, neutral, light, dark, form]
when_to_use: [auth, forms, onboarding]
directions: [minimalist, soft]
layout: [center-stack, split-hero]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [split-card-auth, labeled-hairline-divider]
tokens_snapshot: ../tokens/shadcn-login.json
screenshots: ../screenshots/shadcn-login/
---

## What works (transferable principles)

- **Make the card the hero, and the page nearly nothing.** The viewport is a flat muted field (`#f5f5f5`) holding one centered, bordered, 14px-radius card roughly 896px wide; there is no page chrome, no nav, no headline above it. All attention collapses onto the single object the user must act on. Transfers to any focused one-task screen (sign-in, checkout step, invite accept, paywall): delete the page and present one framed object on a quiet ground.

- **Structure from a 1px hairline + large radius, not shadow.** Resting elevation is *zero* — the captured box-shadows are all transparent. The card and every control read as "raised" purely through a `#e5e5e5` border and generous corner radius against the slightly-darker field. Shadow is reserved for a single state (focus) rather than spent on resting depth. Transfers to any calm/enterprise surface: borrow a tone step and a hairline for separation and keep drop-shadow in your back pocket for interaction feedback.

- **Split one card into form + decorative panel, and drop the panel on mobile.** The card is a two-column grid: a `~384px` form column and an equal media panel (a muted `#e5e5e5` block with a placeholder glyph). At the mobile breakpoint the media column is simply removed and the form becomes full-width — the decoration is a desktop luxury, never load-bearing. Transfers to any auth/onboarding screen that wants brand presence without sacrificing a usable narrow layout. (See `split-card-auth`.)

- **Hierarchy from one scale jump and one weight jump — nothing in between.** The entire screen uses three sizes (24 / 16 / 14px) and three weights, but the *only* 24px node and the *only* 700 node are the same element: the "Welcome back" heading. Everything else is 16px (inputs, button) or 14px (labels, links, legal) at 400–500. A single simultaneous size+weight step does all the hierarchy work, so the form reads instantly without a type ramp. Transfers to any compact UI: don't build a 6-step scale for a screen that has one title — promote one element, flatten the rest.

- **Ration color to zero; the action is near-black, alternatives are outlined.** The palette is pure neutral gray — no brand hue anywhere. The primary CTA is a solid near-black (`#0a0a0a`) bar; the three social providers are equal-width *outlined* icon buttons. Emphasis comes from fill-vs-outline and black-vs-gray, never from chroma. Transfers to any product that wants the UI itself (not marketing color) to carry weight; it also makes the one eventual accent — a focus ring, an error — unmissable.

- **Attach the secondary action to the field it modifies, inline on the label row.** "Forgot your password?" sits right-aligned on the *same baseline as the Password label*, not floating below the input. The label row becomes a two-item flex (`label` ⟷ `action`), pairing the escape hatch with exactly the field it concerns and saving vertical space. Transfers to any labeled field that has a per-field secondary action (reset, "why we ask", unit toggle).

- **A visible, consistent focus ring is the whole interaction design.** Every input, button, and link shares one focus treatment: a ~3px ring in a translucent neutral (`ring #a3a3a3`) plus a 1px border shift, on a 150ms transition. Because the resting UI is shadowless and colorless, the ring is the single strongest visual event on the page — which is exactly right for a keyboard-navigated form. Transfers everywhere: design the focus state as a first-class token, not an afterthought.

## Design-system read

- **Type:** Geist (sans) with Geist Mono available but unused here. Three sizes only — **24px/32 (`text-2xl`) · 16px/24 (`base`) · 14px/20 (`sm`)** — and weights **400 base / 500 labels+buttons+links / 700 for the lone heading**. Hierarchy is a single size+weight jump (16→24, 400/500→700) on one element; there is deliberately no mid-scale.
- **Color:** Pure-neutral monochrome (shadcn new-york-v4 "neutral" base, confirmed by a=b=0 in every captured lab color). Field `#f5f5f5` → card `#ffffff` → media panel `#e5e5e5`; text `#0a0a0a` with secondary/placeholder `#737373`; borders/inputs `#e5e5e5`; ring `#a3a3a3`. The action color is the near-black foreground (`#0a0a0a` / fg `#fafafa`), not an accent hue. No brand chroma at all.
- **Spacing rhythm:** 4px base (`--spacing: .25rem`). Observed steps 8 / 12 / 16 / 24 / 28 / 32 / 40. Field internals use the small end (label→input ~6–8px, input padding 12px × 8px); field *groups* and the CTA→divider gaps use 24px; card padding ~32px. Tight-within / generous-between is what keeps a dense form breathing.
- **Layout system:** A centered `max-w` card on a min-height field; inside, `grid md:grid-cols-2` (form ~384px + media panel) collapsing to one column below ~768px (breakpoints observed at ~600/1024). The social row is its own 3-column grid of equal icon buttons. Controls are 36px tall (`h-9`).
- **Layering / page architecture:** Single flat scroll — no fixed/sticky chrome, no backdrop or blend layers (the one `fixed` element is an off-screen toast region). Depth is entirely a tone-step + hairline story on a single plane.
- **Motion / easing intent:** Near-static. One timing token — **150ms `cubic-bezier(0.4,0,0.2,1)`** — drives hover and focus only. Nothing animates on load or scroll. `prefers-reduced-motion` is respected, and there is almost nothing to reduce.
- **Density:** Moderate; a 7-element form with a providers row, kept legible by the tight-within/generous-between spacing and the monochrome field.
- **Hierarchy:** Scale+weight on the title; after that, fill-vs-outline and black-vs-gray. Position carries the rest (inline secondary action, centered divider label).
- **Restraint:** No brand color, no resting shadow, no gradient, no illustration (a literal placeholder glyph stands in for the brand image), no page header. The design is almost entirely *subtraction*.

## Interaction & motion (static screen — minimal by design)

- **Hover fill-swap on secondary buttons** — *Trigger:* hover. *Mechanism:* outlined social/ghost buttons transition `background` from transparent/white to the muted accent (`#f5f5f5`) over 150ms standard ease. *Reads as:* "clickable, same tier." *Transfers to:* any outlined button set. *Safety:* **production-safe** (compositor-cheap color transition).
- **Hover opacity-darken on the primary CTA** — *Trigger:* hover. *Mechanism:* the near-black fill drops to ~90% opacity. *Reads as:* press-ready without a color shift. *Safety:* **production-safe**.
- **Focus ring** — *Trigger:* focus-visible. *Mechanism:* a ~3px translucent neutral ring + border shift + whisper `0 1px 2px rgba(0,0,0,.05)` shadow appears on inputs/buttons/links. *Reads as:* precise keyboard location; the page's single strongest visual event. *Transfers to:* every interactive element in a form. *Safety:* **production-safe** and an a11y requirement.
- **Link underline / color on hover** — text links (Forgot, Sign up, Terms, Privacy) move from gray to `#0a0a0a` and/or underline. *Safety:* **production-safe**.

Reduced motion: respected. No scroll-linked, entrance, or parallax effects exist (0 scroll effects, 0 entrance reveals, 0 rAF in the probe); the library `@keyframes` present (sonner, accordion, shimmer) are unused on this screen.

## Production-safety note
- Every technique here is production-safe; the only caution is non-motion: controls are **36px tall (`h-9`)**, which flags as a small tap target against the 44px guideline (`tap-targets-risky`). On a real mobile auth screen, bump control height and hit-area.

## Extracted patterns
- `split-card-auth` — a centered card split into a form column and a decorative media panel that collapses to single-column on mobile; structure from hairline + radius, not shadow.
- `labeled-hairline-divider` — a centered label ("Or continue with") sitting on a single hairline rule, built with flex + border, for separating a form from its alternative actions.
