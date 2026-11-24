---
slug: cssdesignawards
url: https://redcollar.co
source: cssdesignawards
corpus: expressive
captured: 2026-06-29
award_type: Site of the Day
score: null
tags: [agency, portfolio, design-studio, monochrome, brutalist, editorial, red-accent, motion-led, b2b, 3d]
when_to_use: [agency, portfolio, brand-experience, hero, hero-spectacle, interactive-showcase, navigation, footer]
directions: [expressive, brutalist, editorial]
layout: [editorial-columns]
provenance:
  gallery_url: https://www.cssdesignawards.com
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [alternating-polarity-name-index, scroll-polarity-invert]
tokens_snapshot: ../tokens/cssdesignawards.json
screenshots: ../screenshots/cssdesignawards/
---

## What works (transferable principles)
- **Hierarchy from scale, not weight.** The whole site runs on essentially one weight (400, with a sparse 500). A project name at ~130px against 16px body is an ~8× jump, and that ratio alone — not bold, not color — carries the entire visual order. Reusable anywhere you want a calm page that still has a loud focal point: pick one weight and let size do the shouting.
- **Negative tracking that scales with size.** Display type is set extremely tight (≈ −0.05em at 130px, −0.03em at 64px) while body stays near-neutral. Tightening *only* the large sizes makes giant lowercase words read as one solid graphic shape instead of loose letters — the move that separates "big text" from "type as object." Transfers to any oversized headline.
- **Two-pole monochrome with a single forbidden-red accent.** Near-black (#0d0c0c) and near-white (#fafafa) do all the structural work; one saturated red (#f51b1b) appears almost nowhere — the logo mark, a cookie-button outline, the `(a)` in the email. Scarcity is what makes the accent read as brand rather than decoration. Reusable rule: spend the accent like it costs money.
- **Editorial three-zone row as the repeating unit.** Each project is a full "stage": a small left kicker (category — *gaming*, *telecom*, *interior design*), a giant centered lowercase name with a hairline rule, and a right-aligned one-line blurb. The same skeleton repeats for every entry, so a long index stays scannable and rhythmic. A far better agency/portfolio index than a card grid — see [[alternating-polarity-name-index]].
- **Polarity inversion as section punctuation.** Instead of dividers or colored bands, the page flips its entire light/dark polarity between movements (light hero → dark services/awards/reviews → light contact). The inversion itself signals "new chapter," and text color crossfades with it. Cheap, dramatic, and reusable as a structural device — see [[scroll-polarity-invert]].
- **Flat by construction — no shadows, no gradients.** Zero box-shadows and zero CSS gradients in the whole profile. All sense of depth comes from one recurring 3D mannequin-head render (hero and footer) and the polarity flip. Removing elevation entirely is what lets the type and the one photographic object feel premium rather than busy.
- **Restraint on chrome.** Six nav links, a single hamburger toggle, pill buttons, hairline rules. The interface furniture is almost invisible so the content — names, numbers, one face — owns the screen.

## Design-system read
- **Type:** One sans family (custom "RedCollar" display + "TT Commons" text), single weight (400/500). Scale spans ~16 → 130px (~8×) with display leading crushed to ~0.9 and body opened to ~1.5–1.6. Hierarchy = scale contrast + tracking, never weight. Mobile drops the hero to 28px.
- **Color:** Two-pole monochrome. Light: bg `#fafafa`, fg `#0d0c0c`. Dark sections invert the same two values. Muted greys `#666`/`#343434` for secondary labels. Single accent red `#f51b1b`, used at <1% coverage. No semantic palette beyond that.
- **Spacing rhythm:** Generous vertical air — section padding up to ~184px, gaps of 100/56/32/20px. Base feels like an 8px grid scaled up hard; whitespace, not rules, separates entries.
- **Layout system:** Content max ~1164px. Repeating three-zone row (left kicker / center display / right blurb) over a loose 3-col logic; collapses to 1–2 cols on mobile. Awards row is a wide 3–5 column number band.
- **Motion / easing intent:** Signature is a 1s expo-out `cubic-bezier(0.165, 0.84, 0.44, 1)` (the most-used transition by far), with slower 2s for parallax and 0.2–0.4s micro-states. Motion communicates "engineered, weighty, smooth" — long eases, nothing snappy. Heavy rAF (621 calls) + 11 mousemove listeners drive a custom cursor and smooth-scroll feel.
- **Density:** Low per-screen density, high total length. Each viewport shows one idea (one name, one number band, one quote), so even a dense agency story stays legible.
- **Hierarchy:** Dominant ordering device is **scale**, reinforced by **position** (centered giant name vs. flanking small labels).
- **Restraint:** No gradients, no shadows, no multi-weight type, no color beyond red. One 3D object reused twice instead of stock imagery throughout.

## Interaction & motion (techniques)
- **Scroll-polarity color crossfade** — *Trigger:* scroll-progress. *Mechanism:* a persistent/sticky element (logo, heading) crossfades its `color` from near-black to near-white as the page scrolls from a light band into a dark one (`span "red collar"`: `rgb(13,12,12)→rgb(250,250,250)`), in lock-step with the section background inverting. *Reads as:* the page changing chapters; the element belongs to the page, not a layer on top. *Transfers to:* any long scroll that alternates light/dark sections. *Safety:* **production-safe** if done with CSS scroll-driven animation (compositor-friendly color/opacity); becomes spectacle-only if scroll-jacked. See [[scroll-polarity-invert]].
- **Pinned "stage" scrollytelling** — *Trigger:* scroll-progress. *Mechanism:* a fixed `main-stage`/`page-transition` layer is pinned while inner sections parallax through it (`transform` on ~6 sections, plus a fixed `div.black` mask). *Reads as:* a guided, cinematic reveal of one project at a time. *Transfers to:* portfolio/case-study indexes. *Safety:* **spectacle-only** — pinning + parallax driven by scroll listeners (9) + rAF means main-thread cost and scroll-position fighting; gate behind reduced-motion.
- **Load splash + hero fade-in** — *Trigger:* load. *Mechanism:* a `splash` keyframe runs an intro overlay, then the hero `h1` opacity animates 0→1 (firstChangeAt ≈150ms). *Reads as:* a deliberate curtain-up. *Transfers to:* brand landings. *Safety:* **production-safe** if brief; never block content on it.
- **Custom drag cursor + draggable galleries** — *Trigger:* hover/drag. *Mechanism:* a cursor-follower component swaps to a "drag" affordance over the reviews carousel and the horizontally-draggable news row (85 draggable nodes, 11 mousemove listeners). *Reads as:* "grab me." *Transfers to:* any drag carousel. *Safety:* **spectacle-only** — custom cursors hide the system cursor and the mousemove tracking is constant; always keep keyboard/tap fallbacks and a real cursor under reduced-motion.
- **Animated micro-states** — *Trigger:* load/loop. *Mechanism:* keyframes `borderColors` (cycling outline on the "Got it" cookie pill), `video-pulse` (showreel CTA), `marquee`, `pulse-animate`. *Reads as:* small signs of life. *Safety:* **production-safe** in isolation, but the looping ones ignore reduced-motion here.

Evidence: 11 scroll frames (light hero → dark services list → dark awards number-band → dark reviews carousel → dark news cards → light contact footer), keyframe names (`splash`, `marquee`, `borderColors`, `video-pulse`, `pulse-animate`), and probe counts (0 IntersectionObserver, 9 scroll + 11 mousemove listeners, 621 rAF). Drop the `from==to` "color-shift" noise on the awards numbers — the frames show those as static. **No IntersectionObserver** — "in-view" reveals are hand-rolled on scroll listeners.

## Production-safety note
- `prefers-reduced-motion` is **not respected** (`prmRules: 0`) — a real defect to fix on any port. The scroll-jacked pinned stage, parallax, and custom cursor are **spectacle-only** (main-thread cost, hijacked scroll, hidden system cursor). The *layout* ideas — alternating-polarity name index, one-weight scale hierarchy, scarce-red monochrome, flat/no-shadow — are all **production-safe** and the real takeaways. a11y also flags 9 small tap targets and no visible focus ring.

## Extracted patterns
- alternating-polarity-name-index — repeating three-zone row (kicker / giant lowercase name + rule / blurb) whose background flips light↔dark between entries; reuse for agency/portfolio indexes.
- scroll-polarity-invert — sticky element whose text color crossfades as the page scrolls past light↔dark bands, via CSS scroll-driven animation with a reduced-motion fallback.
