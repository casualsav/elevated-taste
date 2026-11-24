---
slug: quanta
url: https://www.quantamagazine.org
source: manual-pick
corpus: production
captured: 2026-06-30
award_type: Manual (editorial/science)
score: null
tags: [editorial, publication, science, magazine, long-form, illustrated, light, serif]
when_to_use: [editorial, blog, landing, navigation, footer, feature-section]
directions: [editorial]
layout: [editorial-columns]
a11y: [reduced-motion-respected]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [category-kicker-article-card, scroll-invert-overlay-nav]
tokens_snapshot: ../tokens/quanta.json
screenshots: ../screenshots/quanta/
---

## What works (transferable principles)

- **Family role-split carries hierarchy: serif owns the words, sans owns the chrome.** Every headline and the body copy sit in a reading serif (Merriweather, with Noe Display for the largest display lines); *only* the metadata — category kickers, bylines, nav, UI labels — uses the geometric-humanist sans (Pangram). The reader knows "this is journalism, read it" vs "this is wayfinding" because the *typeface role changed*, not because something got bolder. Transfers to any publication/blog/docs surface: assign one serif to all editorial text and one sans strictly to chrome, and hierarchy emerges before you touch size or weight.

- **One saturated accent, rationed strictly to wayfinding.** A single Quanta orange (`#ff8600`) marks *every* interactive/navigational event — category kickers, links, the wordmark, buttons, "More episodes / See all" affordances, active states — and nothing else. Headlines and body stay near-black `#1a1a1a`. Because the accent never lands on content, the vivid commissioned article illustrations supply all the other color and never fight the UI. Transfers anywhere: pick one brand color, reserve it *only* for interactive/wayfinding roles, and let imagery carry the rest of the palette.

- **The category kicker is the universal "an article begins here" unit.** Every article — hero, grid card, list row — opens with a tiny (10px) uppercase, heavily-tracked (2–3.5px) orange category label above a serif headline above a sans byline. It does triple duty at once: taxonomy, the page's color accent, and a repeated structural signal. Pure pattern repetition is what makes a dense, mixed-format homepage instantly scannable. Transfers to any content grid. (See `category-kicker-article-card`.)

- **Generous serif leading (~1.7) keeps a content-dense page calm.** Body is 16px on a 27.2px line-height — unusually open for an information-heavy homepage. The air *between* lines is what stops a serif-heavy, illustration-packed page from reading as cramped. Transfers to any reading-first surface: push serif body leading to 1.6–1.75 and let vertical air, not dividers, do the work.

- **Full-bleed dark bands chapter the long scroll.** The page alternates white content zones with full-width near-black (`#1a1a1a`) bands — one carrying a single large centered serif headline ("Seven Perfect Shuffles…"), another framing Featured Videos. The tonal flip is a chapter break that spotlights one item with zero decoration. Transfers to long editorial/marketing pages: use a full-bleed dark band as punctuation between light sections rather than reaching for rules or background patterns.

- **Strong imagery, deliberately plain scaffolding.** Each card is a vivid square-ish illustration + kicker + serif head + byline on a plain white grid joined by hairline rules — square corners, near-invisible shadows, no gradients. The scaffolding is intentionally unremarkable so the artwork is the spectacle. Transfers wherever the content imagery is the asset: keep corners sharp, shadows under ~10% opacity, group with thin rules + whitespace, and let images carry the visual energy.

## Design-system read

- **Type:** Two roles, three families. **Serif** = all editorial text: Merriweather (dominant, body + most headlines, 16px body / 40px H1 / 46px lh) with **Noe Display** reserved for the largest display lines (the ~45px dark-band headline). **Sans** = all chrome: Pangram (Avenir-class geometric humanist) for kickers, bylines, nav, UI. Scale is restrained — 10 · 13 · 16 · 22 · 25 · 40 · 45px — hierarchy comes from family role + the kicker, not a steep ramp. Weights 400 (overwhelmingly), 600/700, 800/900 on display. Kickers are 10px uppercase tracked +2–3.5px. Body leading ~1.7; headline leading ~1.15.
- **Color:** Near-monochrome ink system + one accent. `bg #ffffff` → light `surface #efefef` (newsletter band) → ink `#1a1a1a` → muted greys `#999999`/`#6b6b6b`/`#767676` → hairline `#d0d0d0`. The lone brand accent is **orange `#ff8600`** (all wayfinding). Dark bands invert to `#1a1a1a` bg with white text. Secondary hues (`#ea4235`, `#4867aa`, `#00754e`) appear *only* as social-brand icon colors, not as UI palette.
- **Spacing rhythm:** 8px base. Cluster scale 4/8/16, section padding 20/32/40/64. Containers cap ~1160px (main grid) with ~560–600px text/measure columns. Whitespace + hairline rules do the separating.
- **Layout system:** Centered ~1160px column. Hero is a full-bleed illustration with a transparent overlay nav. Main is a content + right-rail split (article grid left, podcast/social/most-read rail right), interrupted by full-bleed dark bands. Cards are a square illustration over kicker→headline→byline. Desktop 1440; mobile 390 collapses the rail beneath content, drops H1 40→25px, and the 13-link nav to a 7-link hamburger.
- **Motion / easing intent:** Near-static and functional. Base transitions 0.2s `ease-in-out` (332 rules) with a `cubic-bezier(0.09,0.47,0.18,0.99)` for the 0.5s ones. The one signature behavior is the scroll-inverting overlay nav; everything else is chrome (lightbox zoom, mobile-menu fade, hover dims). `prefers-reduced-motion` respected. Full read below.
- **Density:** High — article grid, right rail, dark interstitials, video playlist, three-up feature cards, about block, newsletter, fat footer — kept legible by generous serif leading, square plain cards, and big section gaps.
- **Hierarchy:** Dominant ordering device is **typeface role** (serif editorial vs sans chrome), reinforced by the repeated **orange category kicker** and scale.
- **Restraint:** No rounded app-cards (radius ~0–2px; circles only for avatars/social), no decorative gradients (only a nav legibility scrim), near-invisible shadows, exactly one UI accent color, no scroll spectacle.

## Interaction & motion

Quanta is **deliberately near-static**, and the probe confirms it: **0 entrance reveals, 0 IntersectionObservers, 0 rAF, no animation libraries**, `keyframeCount: 6`, and `prefers-reduced-motion` **respected** (`prmRules: 4`, `a11y.reduced_motion: true`). The `@keyframes` names are all utility chrome (`turn-on/off-visibility`, `lightbox-zoom-in/out`, `overlay-menu__fade-in-animation`, `sf_rotate`). The only genuinely designed behavior is the overlay nav; the rest is hover/disclosure. Three scroll listeners drive the nav state; one mousemove drives a tooltip/lightbox.

- **Scroll-inverting overlay nav** — *Trigger:* scroll-progress (past the hero). *Mechanism:* the fixed nav starts transparent over the full-bleed illustrated hero with **white** link text + a `nav__gradient` scrim for legibility; once scrolled past the hero its section background crossfades transparent→`#fff` and every link color crossfades white→`#1a1a1a` (evidenced by 11 `text color-shift` effects from `rgb(255,255,255)`→`rgb(26,26,26)` plus a `background-shift` to white and 3 `position: fixed` pins). *Reads as:* the nav belongs to the artwork at rest, then becomes a solid utility bar for reading. *Transfers to:* any page that opens on a full-bleed image/video hero and needs a persistent nav. *Safety:* **production-safe** (color/opacity transitions + native fixed positioning; CSS scroll-driven animation does it with zero JS). See `scroll-invert-overlay-nav`.
- **Lightbox image zoom** — *Trigger:* tap/click (image galleries). *Mechanism:* `lightbox-zoom-in/out` keyframes scale the figure into an overlay. *Reads as:* focused inspection of detailed science illustrations. *Transfers to:* any gallery/figure-heavy article. *Safety:* **production-safe** (transform/opacity only, reduced-motion gated).
- **Overlay-menu fade (mobile)** — *Trigger:* tap. *Mechanism:* `overlay-menu__fade-in-animation` fades the full-screen menu in; 13 disclosure widgets toggle nav/accordion sections. *Reads as:* quiet, composed navigation. *Transfers to:* any mobile menu/accordion. *Safety:* **production-safe**.
- **Hover micro-dims** — *Trigger:* hover. *Mechanism:* buttons/links drop opacity 1→0.8 over 0.2s `ease-in-out`. *Reads as:* restrained responsiveness. *Transfers to:* all links/buttons. *Safety:* **production-safe**.

## Production-safety note

A live shipping editorial site; everything here is **production-safe**. Caveats are accessibility, not motion:
- **Tiny tracked kickers:** 10px uppercase at +2–3.5px tracking is decorative-small — fine as a label, but never use it for anything a user must read in volume, and verify orange `#ff8600` on white meets contrast for the size (it is borderline at small sizes; the kicker leans on the adjacent black headline for legibility).
- **Accent-as-link contrast:** confirm `#ff8600` links/affordances meet 4.5:1 or pair them with an underline/weight cue; orange-on-white is the system's one contrast risk.
- Family role-split, single-accent wayfinding, kicker cards, dark interstitial bands, scroll-invert nav: all **production-safe**, cheap, framework-neutral.

## Extracted patterns

- **category-kicker-article-card** — the repeatable editorial unit: vivid square thumbnail → tiny tracked uppercase accent category kicker → serif headline → sans byline, on a plain white grid. Reuse for any publication/blog/news grid to make a dense, mixed-topic page scannable.
- **scroll-invert-overlay-nav** — a fixed nav that rides transparent (white text + gradient scrim) over a full-bleed hero image, then crossfades to a solid light bar with dark text once scrolled past the hero. Reuse on any page opening with an image/video hero that needs a persistent, always-legible nav.
