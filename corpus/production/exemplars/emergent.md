---
slug: emergent
url: https://emergent.sh
source: manual-pick
corpus: production
surface: site
captured: 2026-07-06
award_type: Manual (owner pick)
score: null
tags: [ai, agents, saas, developer-tools, b2b, plg, light, pills, y-combinator]
when_to_use: [landing, product-marketing, pricing, hero, auth, feature-section, navigation, footer]
directions: [minimalist, soft]
layout: [split-hero]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [auth-first-hero, sticky-cta-reveal, fixed-backdrop-reveal]
tokens_snapshot: ../tokens/emergent.json
screenshots: ../screenshots/emergent/
---

## What works (transferable principles)

- **The sign-up form IS the hero — activation over persuasion.** The top-left slot, where a marketing page normally puts a headline + one CTA, instead holds the full auth stack: Google / Apple / Facebook social buttons, then "Continue with Email", "Continue with Phone", with the legal fine-print underneath. There is no giant headline competing for the same space. For a product whose only goal is "get them building," this collapses the funnel — the first screen is the conversion step, not a pitch about it. Transfers to any PLG / self-serve tool confident enough to lead with the door instead of the billboard; the risk is it only works when the brand + one line of context already carry the "why," so it's a returning-traffic / warm-audience move. → `auth-first-hero`.
- **The page scrolls; the world behind it doesn't.** A full-viewport `<picture>` sits `position: fixed` at `-z-10` (a faint glyph-texture image in light mode, swapped per color-scheme and per viewport via `<source>`), and most sections carry **no background at all** — so the backdrop stays perfectly static while transparent content slides over it, showing through at every seam. Only deliberate "sheets" (the `#f5f4f2` pricing band, white cards) cover it. A second fixed image sits *above* the content (`z-1000`, `mix-blend-mode: screen`, `pointer-events: none`) adding atmosphere over dark showcase areas while vanishing over white. Depth without parallax math, scroll listeners, or iOS-hostile `background-attachment: fixed`. Transfers to any page that wants a layered, "printed on glass" feel at zero motion cost. → `fixed-backdrop-reveal`.
- **All structure is drawn with one hairline, zero shadows.** A single warm near-white border (`#e5e3e1`) appears **630×** — it separates cards, inputs, the pricing plans, section seams, and the nav. Elevation is almost never used (the one real shadow is the floating hero showcase). The result is a page that reads as a precise, systematic instrument rather than a stack of floating cards; density stays calm because a 1px rule is quieter than a drop-shadow. Transfers to any dense product/marketing surface that wants to look engineered — pick one border token and let it do all the dividing.
- **Quarantine the color into one bounded exhibit.** The page is white / warm-gray with near-black text; every saturated thing — the cyan→blue gradient, the dark agent tiles, the accent-green highlight words in the video, the orange YC badge — lives *inside* a single rounded showcase object or a lone photo. Color is a contained specimen on a lab bench, not ambient wash. Transfers to any product that has one vivid asset (a demo, a screenshot, a gradient brand mark) and an otherwise neutral system: frame it, don't bleed it.
- **Hierarchy from a typeface switch + a 4.5× scale jump, not weight.** Display headings ("Build Full-Stack…", section titles) are set in **Brockmann**, a geometric grotesque, at 72 / 36 / 32px with tight negative tracking (`-3px` at 72); everything else — body, UI, labels — is **Inter** at 16/14, weight 400–500. 419 of ~635 weight-tagged nodes are 400. The jump from body to display is scale + family, so the page stays flat-toned and quiet even where it's shouting. Transfers to any system that wants gravitas without a bold-weight arms race.
- **Wide-tracked micro-eyebrows orient without adding mass.** Each section is introduced by a tiny (12–14px) uppercase, letter-spaced label — "PRODUCT VIDEO", "FREQUENTLY ASKED QUESTIONS" — in muted gray above the real heading. It gives wayfinding and rhythm at near-zero visual weight, so the display type never has to also carry the "what section is this." Transfers to any long marketing page that needs chaptering cheaper than a divider.
- **One pill radius regime = instant cohesion on an un-branded UI.** Full-radius pills (`9999px`, 29×) for every button, social login, toggle knob and CTA; a consistent 20px (`--radius: 1.25rem`) for cards/tiles; 4px for chips. The repeated shape language makes a fairly generic component kit feel like one designed system. Transfers to any design system wanting cohesion for free: choose one radius regime and apply it ruthlessly.
- **Save the spectacle for the last screen.** The entire page is a disciplined white instrument — until the closing CTA, which breaks to a full-bleed photographic sky-and-green-hill with white Brockmann type and a gradient scrim for legibility. After a utilitarian page, one emotional, photographic band lands as a deliberate exhale / "go build" moment. Transfers to any product page that wants a memorable close without turning the whole experience into a mood piece.

## Design-system read

- **Type:** Tri-family. Display = **Brockmann** (geometric grotesque, weights 400/500/600), 72 / 36 / 32 / 22px, leading ~1.0–1.1, tracking tight-negative (`-3px`@72, `-0.72px`@36). Body/UI = **Inter** (variable, self-hosted, `cv05/cv10/cv11` stylistic sets on), 16 body / 14 / 12 labels, leading 1.5 (24px on 16). A novelty **Ndot** dot-matrix face (`ndot-47-inspired-by-nothing`) is loaded single-weight for a display accent (numerals / techy glyph seasoning), never for reading. Hierarchy = **family switch + ~4.5× scale jump**; weight contrast is minimal (mostly 400/500).
- **Color:** White (`#ffffff`) page, warm-gray section band (`#f5f4f2`/`#ebebeb`), near-black fg (`#0e0e0e`), muted gray (`#666`). Structure color is the hairline `#e5e3e1`. Chromatic accents are *contained*: an accent blue (`#0051ff`, links / toggle), a cyan→blue product gradient (`#4e9bee → #57d5fe → #3489fe`), an accent-green highlight (`~#7fff8b`), and a YC orange (`#e57845`). shadcn-style HSL tokens back the theme (`--background`, `--foreground`, `--accent-blue`, `--border`). Roles are crisp: surface ≠ hairline ≠ fg ≠ accent.
- **Spacing rhythm:** 4/8 base. Intra-component 4/8/12/16/24; gaps cluster at 8 and 12. Section rhythm is large — 80/120/150/200px block padding — so density inside cards reads as calm.
- **Layout system:** ~1280px max container; content columns ~672px. Hero is **asymmetric two-column** — auth panel left (~40%), floating gradient showcase card right, overlapping. Pricing is a **3-up equal card row** on the gray band with a segmented Individual/Enterprise toggle + an Annual switch. FAQ is a full-width disclosure accordion. Mobile collapses to one stacked column (2/3-col grids → 1/2) with a sticky header + `Get Started` pill.
- **Motion / easing intent:** Restrained, utilitarian. Base curve `cubic-bezier(0.4,0,0.2,1)` at 150/200/300ms (the Material "standard" easing), plus `cubic-bezier(0,0,0.2,1)` for entrances. 15 `@keyframes` — but they are almost all **product-demo micro-loops** (`marquee`, `wingman-task-slider`, `skeleton-shimmer`, `fillProgress`, `pulse`, `spin`), not page choreography. `prefers-reduced-motion` **is respected** (5 PRM rules). Detail below.
- **Density:** Bimodal — dense inside the auth panel / agent-card grid / pricing lists, generous air at the section seams. The gap sells "capable tool, unhurried page."
- **Hierarchy:** Dominant device = **scale + typeface** (Brockmann display vs Inter body), reinforced by the lone contained gradient/photo as the only saturated focal points and the hairline system doing all the quiet dividing.
- **Restraint:** No drop-shadow elevation on chrome (one exception: the hero card), no multi-hue UI palette, no gradient washes behind text, no decorative icon soup — a single hairline, one pill regime, and one bounded gradient carry the whole look.

## Interaction & motion

Emergent's motion is **quiet page chrome + lively product-demo loops**, cleanly separated. The page itself barely animates (a pinned header, one in-view CTA reveal, button hovers); the *animation budget* is spent inside the showcase objects (a horizontal app marquee, shimmering skeletons, a filling progress bar). Evidence: **15 `@keyframes`** with product names (`marquee`, `wingman-task-slider`, `skeleton-shimmer`, `fillProgress`, `pulse`, `spin`), **10 IntersectionObservers over 10 targets** (thresholds 0.1/0, rootMargins `100px` / `300px 0px`), **14 scroll + 12 mousemove listeners**, **295 rAF calls**, **1 marquee**, no external animation library, and **`prefers-reduced-motion` respected (5 rules)**. Frames s00→s10 corroborate; `from==to` color rows in the raw profile were dropped as noise.

- **Fixed-backdrop reveal** — *Trigger:* scroll (pure compositing, no listeners). *Mechanism:* a `fixed inset-0 -z-10` full-viewport image never moves while unbackgrounded sections scroll over it; a second fixed `mix-blend-mode: screen` texture floats above the content (`pointer-events: none`). *Reads as:* the page is printed on glass over a still world — layered depth with literally zero animation. *Transfers to:* any long page wanting parallax-like depth without parallax. *Safety:* **production-safe** (nothing animates; verify text-over-backdrop contrast). → `fixed-backdrop-reveal`.
- **Pinned header** — *Trigger:* scroll (`position: fixed`). *Mechanism:* the top nav stays fixed while the page scrolls beneath it. *Reads as:* persistent wayfinding; the CTA is always one click away. *Transfers to:* any marketing nav. *Safety:* **production-safe**.
- **In-view CTA / condensed-nav reveal** — *Trigger:* in-view (IntersectionObserver, threshold 0.1). *Mechanism:* a compact `Get Started` pill + condensed nav links **fade in (`opacity 0→1`) and rise (`transform`)** once the hero scrolls past — a sticky conversion prompt appears exactly when the big auth panel leaves view. *Reads as:* the door follows you down the page. *Transfers to:* any long PLG page that wants a persistent sign-up prompt after the hero. *Safety:* **production-safe** (compositor-only opacity/transform); ship the resting/end state so no-JS + reduced-motion users still get the pill. → `sticky-cta-reveal`.
- **Horizontal app marquee** — *Trigger:* load (CSS `@keyframes marquee`, 15s/28s linear infinite). *Mechanism:* a strip of app-cover cards (inside the phone/desktop mockup) scrolls continuously via `transform: translateX(0 → -25%)`. *Reads as:* "a living gallery of things people built here." *Transfers to:* logo walls, template galleries, testimonial rows. *Safety:* **production-safe** but gate on reduced-motion and pause on hover/focus; infinite motion is a vestibular + attention cost otherwise.
- **Skeleton-shimmer / fill-progress demo loops** — *Trigger:* load / in-view. *Mechanism:* `skeleton-shimmer` sweeps a gradient `background-position` across placeholder blocks; `fillProgress` animates a bar `width 0→100%`; `wingman-task-slider` translates a task list. *Reads as:* "the agent is working" — motion as product proof, not decoration. *Transfers to:* any UI that wants to *show* an async agent/build running inside a marketing frame. *Safety:* **production-safe** for shimmer/translate; `fillProgress` animates `width` (layout) so keep it to a small isolated bar, and gate all three on reduced-motion.
- **Button micro-interactions** — *Trigger:* hover. *Mechanism:* social-login buttons lift `~3.5px` with a soft white glow and darken their label; secondary buttons darken their gray fill; primary CTAs dim opacity `1→0.8`. All on the 150–200ms standard curve. *Reads as:* responsive, tactile chrome. *Transfers to:* any button system. *Safety:* **production-safe**.

## Production-safety note

- Auth-first hero — **production-safe** and conversion-strong, but assumes warm/branded traffic; a cold visitor gets no pitch. Pair with a one-line value prop and keep the social-login order accessible (real `<button>`s, visible focus).
- Contained gradient showcase + one photographic close — **production-safe**; the photo band needs the gradient scrim (present: `linear-gradient(rgba(0,0,0,0.3), transparent 50%, rgba(0,0,0,0.3))`) to keep white type over the bright sky above 4.5:1.
- Infinite marquee + demo loops — **production-safe only when gated**: wrap in `@media (prefers-reduced-motion: reduce)` (this site does), pause on hover/focus, and avoid animating `width` on anything large.
- **A11y (from the probe):** `focus-visible` present (2px outlines), image `alt` coverage complete (ratio 1.0), reduced-motion respected — all good. **But 33 small tap targets** flagged (dense pricing checkmark rows, the segmented toggle, footer link columns): verify ≥44px on mobile before reuse.

## Extracted patterns

- auth-first-hero — the sign-up / social-login panel occupies the hero's primary column beside a floating product showcase card; reuse for warm-traffic PLG products that lead with activation instead of a headline.
- sticky-cta-reveal — an IntersectionObserver-gated, reduced-motion-aware CTA pill that fades + rises into view once the hero scrolls out; reuse to keep a persistent sign-up prompt on any long page.
</content>
</invoke>
