---
slug: praxis
url: https://www.praxisnation.com
source: manual-pick
corpus: expressive
captured: 2026-06-30
award_type: Manual (techno-feudal genre)
score: null
tags: [techno-feudal, neo-imperial, neoclassical, network-state, heraldic, monochrome, manifesto, minimal]
when_to_use: [brand-experience, editorial, hero, landing]
directions: [expressive, editorial, minimalist]
layout: [center-stack]
a11y: [reduced-motion-ignored, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [monospace-manifesto-column, floating-artifact-stat-row]
tokens_snapshot: ../tokens/praxis.json
screenshots: ../screenshots/praxis/
---

## What works (transferable principles)

- **A near-flat type scale forces hierarchy onto image, weight and whitespace.** Almost the entire page is set at *one size* — ~15–16px monospace body, with a 12px caption tier and no display tier at all (no `<h1>` was even measurable). There is no 4–6× headline jump; the page refuses scale as an ordering device. Mechanism: when type can't shout, *position, voids, and the floating artifacts* become the hierarchy — the eye is led by what's centered and what's surrounded by emptiness, not by what's big. Transfers to any brand/manifesto page that wants a deadpan, document-like authority instead of a marketing shout; the discipline is "pick the ONE thing per screen and let whitespace point at it."

- **Emphasis lives *inside the running line*, by weight, not by a separate headline.** The voice is justified/centered monospace prose where only the load-bearing phrases are bumped to 700 — `ONLINE COMMUNITY`, `NEW CITY`, `HEROISM`, `MOVE TO THE CITY`. Mechanism: bolding keywords within otherwise-uniform mono body turns *copy itself* into the hierarchy — you read the bold words first and the sentence second, like a redacted manifesto. Transfers to mission statements, legal/charter pages, any place a designed headline would feel like advertising; it's the typographic equivalent of underlining the thesis.

- **One serif glyph against an all-monospace page is the entire brand mark.** The whole site is `Chivo Mono` — except a single italic serif `𝒳` wordmark top-left (the lone `Times New Roman` in the profile). Mechanism: a single deliberate exception in an otherwise rigid system reads as a *seal* — the contrast does the work a logo lockup usually needs, with zero ornament. Transfers anywhere you want a "house mark" cheaply: keep the system monotone and let exactly one element break the rule.

- **A unified high-key desaturation makes a junk-drawer of images one coherent world.** Every image — a watercolor globe, Greek bas-relief, Corinthian columns, glass plates, a sunburst monstrance — is rendered blown-out and bleached toward the same icy pale-blue/white. Mechanism: a single post-process (desaturate + raise exposure toward white) is what unifies wildly different source artifacts into one iconography; the *treatment*, not the subject, is the brand. Transfers to any site sourcing mixed imagery (stock, archival, AI) — commit to one grade and the collage becomes a system. The bonus: bleaching imagery toward the white background lets pictures float *without* frames or cards.

- **The whole layout is a single centered spine with cosmic whitespace.** Content stacks on one vertical axis, each beat (statement → globe → stat triptych → relief → columns) separated by ~128px voids. Mechanism: a strong central axis plus oversized vertical rhythm turns scrolling into a *processional* — each artifact arrives alone, framed by emptiness, like plates in a catalogue raisonné. Transfers to manifestos, about-pages, and any "one revelation at a time" narrative; it's also trivially responsive because there's only ever one column (mobile is the same system, narrower).

- **Symmetry as message.** Stats come in a centered triptych; the closing icon is two columns flanking a sunburst; the relief is dead-centered. Mechanism: bilateral symmetry reads as *institutional / heraldic / sacred* — it's the layout grammar of seals, flags and altarpieces, and it's doing rhetorical work here (a "nation" wants to look official). Transfers when a brand wants gravitas or permanence; use sparingly — symmetry reads as authority but also as static, so it suits manifestos far better than product UI.

## Design-system read

- **Type:** `Chivo Mono`, one family, **two weights (400 / 700)**. **Near-flat scale** — body 15–16px, captions/labels 12px; *no display tier*. Hierarchy is created by **weight + uppercase + letter-spacing + position**, never by size. Labels are uppercase with **positive** tracking (+0.75px @15px ≈ +0.05em, +0.6px @12px) — the wide-tracked-monospace-caps signature of terminal/technical chrome. One exception: an italic **serif** wordmark glyph (`Times New Roman`), the only non-mono element on the page.
- **Color:** Effectively monochrome on white. `bg` pure white `#ffffff`; `fg` near-black `#101010` (from the focus-ring color — true text is ~black). No UI accent hue. The *only* color in the composition is the bleached **pale ice-blue** of the imagery (a desaturated `#cfe0ee`-ish tint), used as a treatment, not a token. Permanently light — no dark mode.
- **Spacing rhythm:** 8px base; the visible rhythm is **huge** — `128px` (and `112px`) section padding-block, `64px` and `40px` gaps. Tiny internal label spacing (2px between a stat's two lines) set against cosmic section voids — the contrast *is* the rhythm.
- **Layout system:** A single centered content spine (`max-width` ~800–896px for text, ~1520px for the full-bleed thumbnail row). Two repeating multi-col modules: a **3-up stat triptych** and a **3-col footer**; a top **thumbnail essay-row** that bleeds off the right edge. Desktop 3-col → mobile 1-col (everything collapses to the centered stack). Sticky top bar (wordmark left, "JOIN PRAXIS" right).
- **Motion / easing intent:** Minimal and ambient. One transition curve — `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard) at `0.15s`, used for hover/utility only. Two `@keyframes` exist (`fadeIn`, `bounce`). The site communicates **stillness and gravity**; motion is not the message. Detail in **Interaction & motion** below.
- **Density:** Looks austere, reads as a complete charter — manifesto copy, a 4-item essay index, three live-looking stats, contact/legal/social — kept legible by isolating each on its own band of whitespace.
- **Hierarchy:** Dominant ordering device is **position + whitespace** (what's centered and alone), seconded by **weight** (the 700 keywords). Scale plays *no* role — the most unusual thing about the system.
- **Restraint:** No display type, no second font (bar the one serif mark), no accent color, no shadows, no gradients (`elevation.shadows: []`, `gradients: []`), no rounded cards, no borders around images, no hero headline. Expressiveness is bought entirely with **imagery treatment + symmetry + whitespace**.

## Interaction & motion

Praxis is **deliberately near-static** — an honest read of the probe and frames. The motion summary reports **0 entrance reveals, 0 hover effects, 0 cursor followers, 0 carousels/tabs/disclosure**, **2 `@keyframes`** (`fadeIn`, `bounce`), and a **single scroll effect: a `position: fixed` pin** on the "JOIN PRAXIS" header. The eleven scroll frames are essentially identical bar the content scrolling past a sticky top bar — there is no pinning of artifacts, no parallax, no recolor. Two ambient sources of life remain: **one `<video>`** (the slowly-rotating watercolor globe) and a probe footprint of **212 rAF + 10 mousemove + 6 scroll listeners** that is *consistent with* a subtle cursor/scroll parallax on the floating artifacts but is **not corroborated by any captured hover/cursor effect** — treat it as unconfirmed. **Reduced motion is NOT respected** (`respectsReducedMotion: false`, 0 PRM rules) — a minor issue given how little moves, but it should still gate the video and any fade.

- **Sticky chrome pin** — *Trigger:* scroll-progress. *Mechanism:* the top bar (serif wordmark + "JOIN PRAXIS" CTA) takes `position: fixed` so the join action and identity ride along the entire scroll (the one confirmed scroll effect). *Reads as:* "the door is always open" — the membership CTA is never more than a glance away on a long manifesto. *Transfers to:* any long-scroll landing/about page whose single conversion goal must stay reachable. *Safety:* **production-safe** (native sticky, cheap, JS-optional); just reserve its height so it never occludes content.
- **In-view fade-in (probe-suggested, frame-unconfirmed)** — *Trigger:* in-view. *Mechanism:* **4 IntersectionObservers / 11 targets** at `threshold 0.3`, `rootMargin 200px`, plus a `fadeIn` `@keyframes`, point to artifacts fading up as they enter the viewport — the canonical IO-gated reveal. The frame diff caught **0 entrance reveals**, so this is *inferred from the wiring, not seen* — flagged. *Reads as:* a quiet, reverent arrival for each artifact. *Transfers to:* image-led narrative pages wanting calm reveals. *Safety:* **production-safe** when it's opacity-only and gated by `prefers-reduced-motion` (which here it is not). → `monospace-manifesto-column` notes the reduced-motion gate.
- **Ambient looping globe video** — *Trigger:* load (continuous, scroll-independent). *Mechanism:* a single `<video>` (the bleached rotating Earth) loops as the page's only moving element. *Reads as:* a living centerpiece on an otherwise frozen page — one breath of motion that signals "alive" without competing for attention. *Transfers to:* hero centerpieces, "now"/status moments. *Safety:* **production-safe** (autoplay muted loop), but it should `pause()` off-screen and on `prefers-reduced-motion` (poster fallback) — neither is guaranteed here.
- **Hover micro-transition** — *Trigger:* hover. *Mechanism:* the lone `0.15s cubic-bezier(0.4,0,0.2,1)` transition (11 rules) handles link/CTA hover; no hover *delta* was captured, so it's a subtle opacity/underline shift at most. *Reads as:* restrained, functional feedback. *Transfers to:* any minimal link system. *Safety:* **production-safe.**

## Production-safety note

- **Near-flat type scale** — **production-safe but use with eyes open.** It buys document-like calm, but a single ~15px size gives mid-level content nowhere to live and the 12px labels flirt with a11y minimums — in product UI keep at least 2–3 legible steps and ≥14–16px body.
- **Keyword-weight emphasis in running copy** — **production-safe.** A clean way to add hierarchy without headlines; just don't over-bold (if everything's emphasized, nothing is) and ensure 700 vs 400 in a mono face is visually distinct at your size.
- **Single high-key image grade** — **production-safe / brand-dependent.** Unifying mixed imagery into one world is powerful, but bleaching toward white throws away photographic information and can drop contrast/legibility — costly anywhere the image *content* must be read (e-commerce, docs); fine for mood/manifesto.
- **Centered symmetry as the layout grammar** — **production-safe for manifestos, risky for apps.** Reads as institutional and permanent, but also static and slow to scan; reserve for brand/about pages, not task flows.
- **Sticky CTA chrome** — **production-safe.** Reserve its height; ensure it doesn't trap focus or cover anchored content.
- **A11y, honestly (`craft.a11y`):** **`prefers-reduced-motion` not respected** (0 PRM rules) — minor here but the video + any fade should gate it. **`focus-visible` reported false**, though a real `1px rgb(16,16,16)` focus outline *is* present on links (fires on `:focus`, so also on click — acceptable, not ideal). **9 small tap targets** (<44px) among 13 interactive — the 12px footer/label links are a mobile/zoom hazard. **`img_alt_ratio` = 1.0** — all 12 images carry alt text (the clear win). No dark mode. Net: visually disciplined and image-accessible, but soft on reduced-motion and tap-size.

## Extracted patterns

- **monospace-manifesto-column** — a narrow, centered column of monospace running copy whose load-bearing phrases are bolded to 700, used as the page's primary voice instead of display headlines. Reuse for mission statements, charters, about-pages, any deadpan-authority manifesto. *production-safe.*
- **floating-artifact-stat-row** — a centered triptych of stats (uppercase label + mono number), each crowned by a borderless, desaturated artifact image floating directly on the background. Reuse for "by the numbers" bands that want gravitas without cards/borders. *production-safe* (optional in-view fade, reduced-motion gated).
