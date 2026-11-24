---
slug: decimals
url: https://www.decimals.co
source: landbook
corpus: production
captured: 2026-09-21
award_type: Gallery
score: null
tags: [saas, agency, hiring, recruiting, b2b, editorial, warm, light, product-marketing]
when_to_use: [landing, product-marketing, hero, feature-section, agency, footer]
directions: [editorial, soft]
layout: [center-stack]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high]
provenance:
  gallery_url: https://land-book.com/websites/98068-decimals-hire-vetted-designers
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [warm-inset-elevation, idle-product-sim-loop]
tokens_snapshot: ../tokens/decimals.json
screenshots: ../screenshots/decimals/
---

## What works (transferable principles)

- **Pair a book-weight editorial serif for display with a sans for everything functional — hierarchy comes from the register switch, not a weight jump.** Every headline (hero, each `WHY`/section title, the pull-quote) is set in a Plantijn-style transitional serif at ~400 weight; all body, UI, labels and buttons are a neutral grotesque (LTSuperior/Geist). Because the serif *is* the emphasis, headings never need to go bold — the page stays calm and literary while still having an unmistakable top of the hierarchy. Transfers to any marketing or content site that wants a considered, non-generic voice: assign the serif to display only and let the sans do all the work text.

- **Build the whole palette from two warm neutrals — a cream ground and a taupe "ink" — with zero pure black or pure white.** Ground is `#ede8e1`; text/borders/dark surfaces are all tints of `#4d4638`; hairlines are `rgba(77,70,56,0.12)`, muted text `rgba(77,70,56,0.6)`. Nothing is `#000`/`#fff`. The single-hue relationship reads as paper-and-ink warmth rather than default-CSS starkness, and it makes the one saturated accent (pin-red `#d94f3d`) land hard when it appears. Transfers to any brand that wants to feel analog/premium: pick one warm dark and tint everything from it instead of reaching for neutral grays.

- **Tint elevation with the ink color, not black — and cap it with a bright inset top-highlight.** The signature card shadow is a *stack*: `rgba(255,255,255,0.82) 0 0 0 1px inset` (a lit bevel), a `rgba(77,70,56,0.08) 0 0 0 1px` hairline ring, then a `rgba(77,70,56,0.08) 0 2px 6px` ambient — the ambient shadow carries the same brown as the text, so cards look printed onto warm paper instead of floating on a neutral screen. Transfers to any warm/light surface where neutral-gray shadows look cold. See `warm-inset-elevation`.

- **Escape the "three feature cards" template by making the cards asymmetric and alive.** The `WHY` section is three cards, but they're vertically *offset* on a staggered baseline and each frames a distinct, self-running mini-product simulation (a Slack shell, a "signal" candidate list, a shuffling profile-card deck) rather than an icon + blurb. The offset breaks the row's monotony and the live demos carry the argument. Transfers to any product page tempted by the generic triptych: stagger the cards and put real (or simulated) product UI inside them.

- **Use small mono all-caps pills as section kickers to chapter a long scroll.** `WHY DECIMALS`, `OUR CUSTOMERS`, `HOW IT WORKS` are `.75rem` monospace, `+1.4px` tracking, inside a hairline pill. The mono/caps register is the opposite of the serif display above it, so each kicker reads as a quiet system label and gives the tall page a spine. Transfers to any multi-section landing that needs wayfinding without heavy dividers.

- **Invert to a dark warm band for the closing CTA + footer, and let the wordmark bleed off-page.** The page is light cream throughout, then the final section flips to a solid `#4d4638` band with cream text and an oversized `DECIMALS` serif wordmark cropped by the viewport bottom. The single tonal inversion signals "the end / the ask" and the bleeding wordmark gives a poster-like sign-off. Transfers to any long landing that wants a decisive close instead of a thin gray footer.

## Design-system read
- **Type:** Two families doing two jobs. Display = MartinaPlantijn (transitional serif), hero/section titles `clamp(42px, 4.8vw, 68px)` at `0.95` line-height, `-2.2px` tracking so big serif stays optically tight; card titles `1.75rem`. Text = LTSuperior/Geist sans at `1rem/1.5`; card body `0.875rem`. Labels = `ui-monospace` `0.75rem` uppercase, `+1.4px`. Hierarchy is register (serif vs sans vs mono) + a wide scale jump (16px body → 68px display, ~4.3×), almost nothing in between.
- **Color:** Monochrome-warm. Ground `#ede8e1` cream; foreground/ink `#4d4638` with an alpha ramp (`0.42 / 0.6 / 0.74`) doing all the muting; hairlines `rgba(77,70,56,0.10–0.14)`. Surfaces are translucent warm whites (`rgba(255,252,247,·)`). Accent `#d94f3d` (pin-red) is rationed to focus rings + one status badge; a soft `#63d98e` green marks "open/connected". Hero adds a coral radial wash (`#f4c9be`→transparent). No dark theme.
- **Spacing rhythm:** 4px base (`--spacing:.25rem`); tight component gaps (4/8/9px) inside cards, generous section breaks (36/40/72px). Pills padded `4–8px` block. Density is high inside the demo cards but the section-level whitespace keeps it breathing.
- **Layout system:** Center-stack throughout. Content column `896px`, generous outer margins on a `≤1800px` frame. Flex-dominant (126 flex vs 11 grid); the feature "grid" is really three offset flex columns. Mobile collapses to a single stacked column, hero serif drops to `clamp(24px,7.5vw,36px)`.
- **Layering / page architecture:** Single flat scroll — **no fixed or sticky layers** (`layers_summary` all zero), no blend overlays. Depth is manufactured entirely by the warm inset-highlight shadows and by z-stacked card *decks* (fanned profile cards at `z 20–29`), plus the hero's transparent section floating over a cream ground with a radial coral gradient. The one canvas is the hero's dotted wireframe globe.
- **Motion / easing intent:** Base durations `180–300ms` with `ease`/`cubic-bezier(0.2,0.78,0.22,1)` for UI; long `9–12s` loops for ambient product simulations; `steps(22)` for a typewriter search cursor. Motion communicates "a living, working product" (things type, connect, shuffle) rather than page transitions. `prefers-reduced-motion` respected (3 PRM rules).
- **Density:** High local density (chat logs, candidate lists, profile cards full of micro-copy) kept legible by the calm mono/sans body, alpha-muted secondary text, and lots of section-level air.
- **Hierarchy:** Dominant device is **register + scale contrast** (serif display vs sans/mono), reinforced by position (centered) and the alpha ramp for de-emphasis.
- **Restraint:** No pure black/white, no saturated brand color splashed around, no gradients beyond the one soft hero wash, no fixed chrome, no bold headings. Effects stay sub-pixel (hover lifts of ~1px).

## Interaction & motion (techniques)
- **In-view fade-rise reveals** — *Trigger:* in-view (IntersectionObserver, 1 observer / 3 targets, `rootMargin:200px`). *Mechanism:* opacity `0→1` + a small `translateY` on chat messages, "typing…" rows, and the blank deck card as they enter. *Reads as:* content arriving as you reach it. *Transfers to:* any section reveal. *Safety:* **production-safe** (transform/opacity only). See `in-view-fade-rise`.
- **Rotated card-deck shuffle** — *Trigger:* in-view + timed loop. *Mechanism:* a stack of profile cards positioned with per-card `--stack-rotate` (−2°/−6°/−8°) + `--stack-scale` (.96–.98) offsets that cycle (`v4why-profile-cycle`), the top card upright. *Reads as:* a live deck of scouted candidates being flipped through. *Transfers to:* testimonials, card carousels, "options" showcases. *Safety:* **production-safe**; see existing `fanned-card-deck-reveal` / `card-stack-scale-dim`.
- **Idle product-simulation loops** — *Trigger:* load / autonomous (rAF + long CSS keyframes, no scroll dependency). *Mechanism:* self-running micro-UIs — a logo marquee (`v4gs-logo-marquee`, 420% translate), a scout connector drawing itself (`v4gs-connector-draw`/`dash-flow`), typing dots, a "thinking" pulse, value-progress bars. *Reads as:* the product is alive and working. *Transfers to:* SaaS feature cards that want motion without a video. *Safety:* **production-safe** if paused/hidden under reduced-motion. See `idle-product-sim-loop`.
- **Scroll-progress parallax** — *Trigger:* scroll-progress. *Mechanism:* subtle `translate`/`scale(1→0.96)`/`rotate` on the hero quote card and profile rows tied to scroll position (6 scroll listeners). *Reads as:* gentle depth as the page moves. *Transfers to:* hero foreground elements. *Safety:* **production-safe** (small transforms; keep off the critical text).
- **Sub-pixel hover micro-lift** — *Trigger:* hover. *Mechanism:* buttons/pills translate up ~1px (`matrix(…,-0.92…-0.99)`) with a slight shadow deepen + surface-opacity bump, `~0.22s ease`. *Reads as:* tactile, restrained responsiveness. *Transfers to:* any button/chip. *Safety:* **production-safe**.

## Production-safety note
Everything here is production-safe. The only cost to watch is the ambient loops (`rafCalls` high, one canvas globe): gate them behind `prefers-reduced-motion` and `content-visibility`/IntersectionObserver so off-screen loops don't burn the main thread. Decimals already respects reduced motion.

## Extracted patterns
- warm-inset-elevation — ink-tinted layered card shadow with a bright inset top-highlight, for cards/pills on a warm ground.
- idle-product-sim-loop — a self-running, scroll-independent mini-product UI that loops inside a feature card, reduced-motion aware.
</content>
</invoke>
