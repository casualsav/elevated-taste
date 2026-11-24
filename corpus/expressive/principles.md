---
title: Expressive corpus — synthesized principles
corpus: expressive
synthesized_from: 21 exemplars (corpus/expressive/exemplars/*.md)
captured: 2026-06-22
scope: award / spectacle / brand-experience web (marketing, landing, brand sites, agency/portfolio)
companions:
  tokens: ../../tokens/                # house tokens + presets/ (expressive preset overrides the seed)
  patterns: ./patterns/               # 40 extracted expressive patterns
  anti_patterns: ../../.claude/skills/web-design-taste/references/anti-patterns.md
---

# Expressive principles

Cross-exemplar rules distilled from 21 award/agency/brand-experience sites (14islands,
adoratorio, aristide, basement, buildinamsterdam, corentinbernadou, creativeinc, cuberto,
cubiflow, dogstudio, doronsupply, exoape, hellomonday, locomotive, lusion, northkingdom,
obys, phantom, studiofreight, tikhon, wokine).

**The one-line thesis of the whole corpus:** *expressiveness is bought by subtraction in the
system and concentration in one or two surfaces.* Every site here strips a hierarchy axis
(usually weight and color), commits to one typeface and one motion curve, and spends its entire
"wow" budget on a single loud object — a giant wordmark, one cinematic photo, one 3D scene, one
metaphor. The discipline *is* the spectacle. None of these read as "more"; they read as *fewer
things, larger*.

> **Read this with the guardrail.** Most of what makes these pages stunning is **spectacle-only**
> and will degrade a product UI's usability, performance, and accessibility. The
> **[Production-safety ledger](#production-safety-ledger)** below is the gate that separates the
> portable ideas from the indulgences. When in doubt, default to the **production corpus**, not
> this one — see [When to reach for expressive at all](#when-to-reach-for-expressive-at-all).

---

## 1. Hierarchy & scale

**RULE: Drop weight (and usually color) from the hierarchy toolkit; rank by scale + position alone.**
Almost every exemplar runs a *single* font weight and builds the entire order from an extreme
size ratio plus where things sit. Removing an axis is what reads as confidence — nothing is
"bolded louder," so the giant type stays calm. The recurring ratio is **bimodal**: a body size
and a display size with the *middle deliberately empty* (body-vs-huge, no mid-rung).
→ northkingdom (one family, one weight 400, ~5× jump), obys (two sizes only, ~7×), lusion
(body-vs-huge with the mid-scale absent), aristide (~30× from 10px chrome to a 337px wordmark).

**RULE: The bigger the type, the tighter the tracking — scale negative tracking with font-size.**
Default letter-spacing looks gappy and amateur at poster sizes; pulling glyphs together packs a
word into one dense graphic mass that reads as *set*, not typed. Body sits near 0; display goes
to roughly −0.04 to −0.05em. This is the single most repeated micro-detail in the corpus.
→ wokine (−6.7px at 160px), basement (tracking ramps with size: body 0 → 38px −1.52px → 76px
−3.04px), northkingdom (−0.05em on the display wordmark), exoape (−0.05em at 250px).

**RULE: Indicate state by a value step, not by added material.** On a monochrome system the
"you are here" / active / focused signal is a single jump up the brightness scale (or a
typographic frame), never a new pill, box, or color.
→ corentinbernadou (active nav = near-white vs mid-grey), obys (focused row wrapped in oversized
`[ ]` brackets, no fill), aristide (promoted link = underline only).
**Guardrail:** brightness or brackets alone are *not* an accessible focus indicator — always pair
with a real `:focus-visible` ring (see [ledger](#production-safety-ledger) and
anti-patterns §5/§6).

> **Product-UI caveat carried by every exemplar:** the extreme body-vs-huge ratio leaves
> mid-level text *homeless*. In a real interface cap the ratio nearer **4–6×** so sub-nav,
> captions, and secondary headings keep a legible rung. The 11–12px body several of these ship
> (obys, corentinbernadou, doronsupply, cubiflow) is itself a borderline a11y choice — bump to
> ≥14–16px in production.

---

## 2. Type as spectacle

**RULE: When color and weight are removed, the typeface carries the entire personality — so make
the type the event.** A single well-chosen face at display scale *is* the brand; no logo lockup,
no second display family, no ornament required.
→ corentinbernadou (giant orange wordmark is the whole hero), adoratorio (name set bigger than the
viewport), wokine (160–180px Moderat headlines), aristide (one heavily-condensed word = the logo).

**RULE: Assign a second face to a *job* (voice/naming), never to hierarchy.** The corpus
repeatedly *inverts* the cliché serif-display/sans-body pairing: the workhorse grotesque does
display + UI, and a serif (often italic) is rationed to the *thing being named* or one voice line.
The reader learns "this face = the subject / the human note," so the system needs almost no weight
or color variation.
→ exoape (huge neutral sans + tiny italic Times voice — the *small* text is the characterful one),
hellomonday (grotesque workhorse + Clarendon serif on names only), dogstudio (serif = subject,
sans = apparatus), buildinamsterdam (one serif subhead inside an all-sans page).

**RULE: One serif can do *everything* — display and body — and read as a printed essay.** Refusing
the pairing entirely is itself the signal. Build hierarchy from scale + measure width alone; let
weight *drop* as size grows so big type stays elegant.
→ creativeinc (single STK serif, body 16px → display 60px, weight drops with size),
locomotive (Times-class book serif at 110px display and 15px body, one 400 weight).

**RULE: A metaphor or a real-text graphic can replace visual hierarchy outright.** When the
page maps onto a schema users already know (receipt, terminal, spec sheet, magazine masthead),
the familiar structure *is* the navigation. When a graphic is built from real glyphs, it's
craft, not decoration — and stays selectable/animatable.
→ tikhon (receipt/invoice schema replaces a type ladder), doronsupply (every component dressed as
retro software UI), adoratorio (hero ring built from repeated brand-word glyphs),
corentinbernadou (editorial issue/edition masthead metadata).

**Patterns:** `staggered-display-headline`, `edge-bleed-wordmark`, `single-serif-manifesto`,
`serif-italic-counterpoint`, `cycling-word-headline`, `serif-list-index`, `receipt-ledger`,
`monospace-wordmark-bar`, `editorial-masthead` (see `./patterns/`).

---

## 3. Color & monochrome discipline

**RULE: The chrome does *zero* color work; all chroma is delegated to the content.** The single
most universal rule in the corpus. The shell is achromatic on purpose so the work (thumbnails,
photos, renders) is the only color event and never has to compete with buttons or labels. Swap the
content and the page re-themes for free.
→ 14islands (two inks, no accent anywhere — all color in the project tiles), phantom (pure
black/white chrome, thumbnails supply 100% of the hue), studiofreight & obys & hellomonday
(monochrome frame, content-only saturation), cuberto (the "accent" *is* the black inversion).

**RULE: If you keep an accent, ration it to ~1–5% of pixels and spend it on one job.** One
saturated hue on an otherwise neutral field reads as pure emphasis wherever it lands — usually
reserved for *actions only*, or for a single hero object, or as edge/glow rather than fill.
→ cubiflow (orange appears literally twice — "APP" + one control), basement (orange only on
hairline borders + a faint glow, never a fill area), lusion (electric blue under ~5% coverage),
buildinamsterdam (the entire accent budget is one ochre disc), locomotive (one blue reserved
exclusively for interaction).

**RULE: "Expressive" ≠ "dark," and "monochrome" ≠ "pure black/white."** The system (one hue
family, rationed accent, scale-driven hierarchy) is what makes a page expressive, not its value.
Light registers read as gallery/print; choosing a *tint* for the foreground (not `#fff`) and a
*warm paper* for the background (not `#fff`) signals authorship.
→ adoratorio / hellomonday / creativeinc / studiofreight (light expressive register),
aristide (sage tint `#bac4b8` as fg instead of white), exoape & buildinamsterdam & creativeinc
(warm paper grounds, not flat white).

**RULE: On dark, drop body off pure white and pure black off the ground.** True `#fff` on `#000`
vibrates, fatigues, and halates; ~90% grey body + reserving `#fff` for emphasis creates a free
second tier and reduces glare.
→ basement (`#e6e6e6` body, `#fff` = "louder"), aristide & northkingdom (off-white / tinted fg),
ledger note on `#000` halation below.

> **The carried a11y trap:** low-contrast tints and faded greys are the corpus's signature *and*
> its biggest accessibility risk. `#a2a2a9` on `#f2f2f2` (14islands) is ~2.3:1 and **fails AA for
> body**; grey-on-near-black bodies (corentinbernadou, obys) are borderline at 11px. The tint is
> fine for *large decorative* type; it is not safe for small reading text. Always measure against
> the *actual* background, not an average (see anti-patterns §4 + §7 contrast rules).

---

## 4. Motion & interaction

**RULE: Pick ONE signature easing curve and apply it everywhere; vary only duration.** A single
non-linear curve across hovers, reveals, and nav makes unrelated movements feel authored by the
same hand — that coherence is what reads as "crafted motion." The corpus clusters hard on a few
expo/quint-out curves; standardize on one as a token.
→ cubiflow & cuberto & obys (`cubic-bezier(0.16,1,0.3,1)` expo-out everywhere), northkingdom
(one easeOutCubic on 42 elements), 14islands & corentinbernadou & aristide
(`cubic-bezier(0.25,0.46,0.45,0.94)` house curve), wokine (`cubic-bezier(0.36,0.33,0,1)`).
**Transfer the curve and the consistency — not the duration.**

**RULE: Two motion registers — snappy feedback, slow reveal — and never mix them up.** Functional
feedback (hover, state, button) stays ≤200–320ms; brand reveals/entrances earn the long
0.6–1.6s glide. The slow curve is the *brand*; using it on things the user is waiting on reads as
broken.
→ basement (60ms micro-feedback vs 300ms reveals), phantom (0.2s neutral grid hover + one springy
reveal gesture), dogstudio (1.2s cinematic reveals, sub-second feedback kept snappy).

**RULE: Spend almost all your warmth/character in a single deliberate motion or gesture.** In a
restrained system, *one* signature animation is worth more than ten — and it stays cheap to gate.
→ tikhon (one liquid wordmark distortion on an otherwise rigid page), phantom (a single springy
overshoot on the capsule reveal; everything else is calm), cuberto (one rotating "Contact" badge).

**RULE: Active state, custom cursors, ambient loops, and scroll-driven motion are *decoration* —
they must be gated and must never be the only path to anything.** Every continuous/JS/scroll-hijack
effect in the corpus is flagged spectacle-only. The non-negotiables that recur in every safety
note: respect `prefers-reduced-motion`, never block first paint behind a reveal/loader, keep the
underlying content in the DOM, and provide a native-scroll fallback.
→ locomotive & exoape (smooth-scroll inertia breaks find-in-page/keyboard paging unless reduced),
wokine & adoratorio (ghost marquees / particle rings = `aria-hidden` + reduced-motion + pause
off-screen), cuberto/cubiflow (decorative cursor/shake = optional flourish, never the only path).

**RULE: In a scroll-cinema narrative, vary the *vector* but keep one *curve*.** A long scrubbed-canvas
scroll needs each text beat to enter from a different direction (left / right / up / clip) so the
descent never feels like one effect on repeat — but every entrance must ride the *same* easing token
and the two registers above, or "variety" curdles into noise. Sequence each beat label → heading →
body → CTA on a small stagger; keep all text in the outer side-zones so the canvas keeps the center
(§5); reserve the center for **one** dark-scrim stat interlude; and **never gate first paint behind a
frame-loader** — ship the poster as LCP and stream frames behind it.
→ the ingested scroll-cinema genre (`canvas-frame-scrub-cinema`, `circle-wipe-hero-reveal`,
`scroll-bound-dark-interlude`); corpus kin studiofreight (authors of Lenis) and hellomonday /
northkingdom (poster→reveal). The scrubbed canvas is the *one* place a per-frame rAF reader is
sanctioned — and even there, read a scroll-driven value, never attach a `scroll` handler.

See anti-patterns §5 (Motion) for the hard bans this corpus must still obey:
no `scroll` listeners (use `IntersectionObserver` / scroll-driven CSS / GSAP ScrollTrigger),
animate `transform`+`opacity` only, `backdrop-blur` on fixed/sticky only, and a
`prefers-reduced-motion` fallback on *everything* above a low threshold.

**Patterns:** `canvas-frame-scrub-cinema`, `circle-wipe-hero-reveal`, `scroll-bound-dark-interlude`,
`perspective-curved-ticker`, `ghost-watermark-marquee`, `cycling-word-headline`,
`staggered-display-headline`, `tick-scrubber-indicator`, `ascii-particle-ring`.

---

## 5. Layout & spine

**RULE: Margins hold the apparatus; the center holds the spectacle.** Push identity, nav, status,
clocks, edition metadata, and credits to the four corners/edges, and leave the optical center for
the one hero object. Hierarchy by *position* (center = subject, corners = controls) lets the page
be information-dense *and* feel minimal.
→ aristide & adoratorio & corentinbernadou (corner-anchored "instrument panel" frame),
cubiflow (monospace HUD labels in the corners), lusion (thin edge-pinned HUD around a centered
stage), obys (margin rails carry the TOC/metadata, center carries the spine).

**RULE: Let whitespace — not boxes — do all the separating.** Zero card chrome, zero borders,
zero shadows, zero radius; sections are divided by large vertical voids (often hundreds of px) plus
at most a hairline rule or one small label. High item count still reads calm because each element
floats in air instead of sitting in a card.
→ hellomonday & locomotive & creativeinc (whitespace/rule-rows replace cards),
14islands & cuberto & wokine (acres of section padding as the primary separator).
*This one is largely production-safe and ports straight to dense product UI: remove the card, add
the space.* (Counters anti-patterns §6 `border-t`+`border-b`-on-every-row and heavy-shadow slop.)

**RULE: Asymmetry / a single centered spine reads as "hand-composed," not templated.** Off-grid
straddled headlines, vertically-offset masonry, or one narrow centered column turn the layout
itself into the art direction. Nothing centered-and-contained (which reads "finished"); edges are
left ragged on purpose.
→ 14islands (split/offset headline words), hellomonday (vertically-offset 3-col masonry = instant
"studio"), obys (single centered vertical spine *is* the layout), studiofreight (modular
span-grid contact sheet).

**RULE: An edge-bleed / clipped object is a confidence signal and implies latent density.** A
wordmark bigger than the viewport, or a media strip pinned to one edge and running off-screen,
reads as "this continues" and invites interaction — far better than a centered, fully-contained
block.
→ adoratorio (wordmark overflows and clips at the margins), aristide (portrait strip bleeds off the
right edge), exoape & locomotive (full-bleed cinematic hero).

**RULE: Preserve the art direction across the breakpoint — *restack*, don't collapse to generic.**
The identity must survive mobile: re-stack the *same* two zones top/bottom, keep the giant type
giant, reflow components (grid → fewer columns) rather than swapping in a default stacked-card
layout. A genuine *treatment change* (e.g. desktop hover-list → mobile color-flooded panels) is
fine; a generic squeeze is not.
→ buildinamsterdam (split-stage restacks, never drops the black panel), doronsupply (components
reflow, headline stays oversized), dogstudio (hover-index → full-bleed color panels on mobile),
cubiflow (drops WebGL for a device-native interaction rather than a shrunken 3D scene).

**Patterns:** `split-stage-hero`, `centered-spine-index`, `staggered-masonry-feed`,
`tight-thumbnail-mosaic`, `edge-bleed-portrait-strip`, `monospace-hud-chrome`,
`viewport-frame-ticks`, `floating-glass-capsule-nav`, `wordmark-nav-index`, `bracketed-index-rail`.

---

## 6. Imagery / 3D / WebGL

**RULE: Quarantine the spectacle to one surface; pay flat everywhere else.** Concentrate the
GPU/wow budget in a single viewport (the hero) and keep the rest a near-flat dark/light canvas.
"One loud thing on a silent page, never two." This is what buys "premium" cheaply *and* keeps
scroll performance and legibility intact.
→ dogstudio (3D render quarantined to screen one), basement (3D wireframe hero, austere chrome
below), cubiflow (~95% empty page around one floating object), creativeinc (one claymorphic
sculpture, everything else text).

**RULE: Frame the canvas; don't full-bleed it.** A contained, inset "viewport" (rounded rect on a
calm page) reads as *a deliberate object on a website* — the DOM shell stays legible, scannable,
and crawlable — instead of a WebGL gate that hijacks the whole window. Keep all *text* on the
legible field, never inside the simulation.
→ lusion (dark inset canvas-stage on a lavender page — the load-bearing decision), northkingdom
(rim-lit object on a void, poster-state), corentinbernadou (centered 3D cube with corner chrome).

**RULE: If the hero is photographic, spend zero color budget on the UI — the photo is the palette.**
One cinematic, art-directed image re-themes the whole page; a neutral interface makes the photo
look more expensive. Overlay type on the image's *own* dark zone (or add a real gradient scrim);
straddle the headline across a tonal seam so the image feels like it rises *through* the words.
→ exoape (one blue-hour Venice photo is the entire color system), locomotive (one red-lit portrait
hero, then a calm white document), dogstudio (painterly nebula behind the hero).

**RULE: When a brand has a concrete noun, render *that* as the hero instead of an abstract
gradient.** Memorable and self-explaining; cheap to adopt as a static illustration even when the
live site renders it in 3D.
→ basement (3D wireframe of an actual basement), northkingdom (hexagonal shield emblem),
phantom (illustrated cartoon "phantom" character as the one warm note).

**RULE: Ship a static poster + real DOM, then *layer* the spectacle on top (progressive
enhancement, never the baseline).** Every WebGL/3D hero in the corpus is flagged spectacle-only:
heavy GPU/bandwidth, invisible to crawlers and screen readers, motion-sickness risk. The safe
shape is a poster-state object with an explicit affordance, content present in the DOM, and the
canvas lazy-mounted only after a capability + reduced-motion check.
→ northkingdom (3D shield = a `<button>` play target over a static poster — the model safe shape),
cubiflow (sphere SEO-captured **zero headings** — the cautionary tale: layer it over a real `<a>`
grid), lusion & basement & dogstudio & hellomonday (poster fallback + lazy-mount + reduced-motion).

**RULE: Pre-bake spectacle into the *art* whenever you can.** Glitch/dither/halftone/grain *in the
image file* costs nothing at runtime; the same look done as a live shader is a perf liability.
→ doronsupply (glitch/dither thumbnails are static images — "maximal" at zero runtime cost),
obys/aristide (desaturated imagery via `filter: grayscale()` or baked, with real `alt`).

**RULE: On dark/photographic backgrounds, build elevation from translucency + blur, not shadow.**
Shadows vanish against black and against photos; frosted glass layers legibly and unifies all
floating controls into one material — but it's a real compositing cost, so keep blurred surfaces
few and mostly static, and back critical text with a minimum-opacity scrim.
→ phantom (frosted-glass capsule + chips, zero drop-shadows — see `floating-glass-capsule-nav`).

**Patterns:** `canvas-frame-scrub-cinema`, `circle-wipe-hero-reveal`, `inset-canvas-stage`,
`rim-lit-void-stage`, `webgl-thumbnail-sphere`, `ascii-particle-ring`, `perspective-curved-ticker`,
`full-bleed-photo-headline`, `headline-bracketed-object`, `dimmed-color-case-stack`,
`metadata-tagged-thumbnail-plate`.

---

## 7. Restraint (the meta-principle)

**RULE: Expressiveness comes from what was *removed*, plus one well-funded hero.** Every exemplar's
"What works" reduces to subtraction: no second typeface, no second weight, no accent color (or one,
rationed), no shadows, no radius, no gradients, no centered/templated layout — and then one loud
object. The list of *absences* is the design system.
→ creativeinc ("an exercise in subtraction"), obys / cuberto / northkingdom ("the discipline is the
point — one void, one object, one curve"), cubiflow ("almost everything a landing page *should*
have is absent — that absence is the statement").

**RULE: Route all warmth into copy and one gesture, keep the form austere.** Personality lives in
playful microcopy + a single illustration/motion, *not* in the chrome — so the grid can stay strict
and "designed" while the brand still feels human.
→ adoratorio (austere Swiss layout, playful copy: "Manywhere in Europe / (not Milan)"),
phantom (clinical mono/glass + one cartoon character), tikhon (rigid receipt + one liquid glyph).

**RULE: When content is busy, make the surrounding UI maximally quiet.** Chaotic content (3D,
generative art, colorful thumbnails, photography) inside rigid, monochrome, orderly chrome is what
keeps a maximal aesthetic from reading as noise — the eye always knows where the subject is.
→ doronsupply (wild thumbnails, rigid mono frame), studiofreight & phantom (colorful work, silent
shell).

> **Restraint is the part that ports.** Nearly every "restraint" rule above is production-safe.
> The expressive *spectacle* (the one loud object) is what the ledger gates. Borrow the subtraction
> freely; gate the indulgence.

---

## Production-safety ledger

The guardrail. Each recurring expressive technique tagged **production-safe** (port it),
**safe-with-care** (port it but mind the cost), or **spectacle-only** (marketing/brand surfaces
only — keep it out of product UI). Costs are usability / performance / accessibility. Every
spectacle-only row assumes the four non-negotiables from §4: real DOM content, `prefers-reduced-motion`,
no first-paint blocking, native-scroll fallback.

| Technique | Verdict | Usability / perf / a11y cost | Production-safe fallback |
|---|---|---|---|
| Achromatic / monochrome chrome, content-as-color | **Production-safe** | Near-zero; *improves* a11y & theming. No accent ⇒ affordances must be carried by material/motion + one CTA. | Adopt freely. Add a hairline + one accent reserved for actions if affordances get ambiguous. |
| Single-weight, scale-driven hierarchy | **Production-safe** | Needs a face with real display presence; extreme ratio leaves mid-level text homeless. | Keep one weight; **cap the body-vs-display ratio at ~4–6×** and add an intermediate rung (sub-nav, captions). |
| Size-scaled negative tracking on display | **Production-safe** | None at large sizes; **destroys legibility below ~24px**. | Gate negative tracking *by size* (large only); body stays ~0. |
| Whitespace-only separation (no cards/shadows/radius) | **Production-safe** | Needs disciplined spacing tokens or sections blur; mobile tap-targets must stay ≥44px. | Remove the card, add the space; keep link rows ≥44px; pair with small labels for orientation. |
| Off-white body on dark / tint-as-foreground | **Safe-with-care** | Lower contrast than `#fff`; tints **routinely fail AA for small text** (e.g. `#a2a2a9` on `#f2f2f2` ≈ 2.3:1; grey-on-black @11px borderline). | Verify ≥4.5:1 against the *actual* bg; reserve tints for large decorative type; bump body to ≥14–16px. |
| Rationed single accent (≤1–5%, action/edge/glow only) | **Production-safe** | None; just don't make the accent the *sole* signifier of an interactive state. | Reserve one hue for actions; pair with underline/focus so it isn't color-only (anti-patterns §4). |
| Corner/HUD metadata, mono labels, live clock, edition tags | **Safe-with-care** | Tiny edge type fails zoom/contrast; out-of-DOM-order positioning confuses SR; cryptic labels (`[G]`) hurt wayfinding. | Keep logical DOM/reading order, accessible size, real link text; `aria-hidden` purely-ambient bits (clock); add tooltips/`aria-label` to cryptic affordances. |
| Two-register serif/sans (or single-serif) type | **Production-safe** | One–two extra webfont requests; display serifs may be unreadable at body size. | Self-host, subset, `font-display: swap`; test the face at *both* body and display sizes. |
| Value-step / bracket-frame active & focus state | **Safe-with-care** | Brightness or brackets **are not** a keyboard focus indicator. | Keep the value step *and* add a real `:focus-visible` ring; mirror `:hover` to `:focus`. |
| Inset/framed canvas stage (the *frame*, not contents) | **Production-safe** | Low; the framing is plain CSS. | This *is* the safe way to ship "3D hero" energy — keep text outside the canvas, lazy-mount contents. |
| Edge-bleed wordmark / off-center clipped strip (layout) | **Safe-with-care** | A fixed giant word overflows narrow viewports; an only-draggable strip is unreachable by keyboard. | Real selectable `<h1>` with `clamp()` + clipped overflow (no h-scroll); back drag-strips with native overflow scroll + visible affordance/arrows. |
| Full-bleed photo hero with type on the image | **Safe-with-care** | Legibility depends entirely on the chosen image; busy/light photo behind white text fails AA instantly; LCP/bandwidth. | Add a gradient scrim or `text-shadow` fallback; solid bg color behind the image; `fetchpriority`/responsive sizes; test contrast vs the *actual* art. |
| Frosted-glass elevation (`backdrop-filter: blur`) | **Safe-with-care** | Real compositing cost; **drops frames if animated or stacked over moving content**; text on translucent fill can fail contrast. | Blur only on **fixed/sticky** surfaces (nav/overlays), few & static; back critical text with a min-opacity scrim (anti-patterns §5). |
| Pure-black `#000` ground / pure-white-on-black body | **Safe-with-care** | Halation/smearing (esp. OLED on scroll); fatigue. | Use a near-black (`#0a0a0a`/`#0b0d12`) ground and `#e6e6e6` body; reserve `#fff` for emphasis. |
| Column-flow masonry / span-grid feed | **Safe-with-care** | CSS columns make **DOM order ≠ visual order** (a11y/SEO) and risk CLS. | Use an explicit `grid` + `row-span` where reading order matters; reserve `aspect-ratio` boxes; lazy-load. |
| House easing token + snappy feedback (≤200–320ms) | **Production-safe** | None — *recommended*. | Define one `--ease`/`--dur`; keep functional transitions ≤200–320ms. |
| **Long (0.6–1.6s+) entrance reveals as global motion** | **Spectacle-only** | Adds perceived latency, hurts INP/perceived-load, frustrates repeat visitors; blocks interaction if gating content. | Reserve long glides for hero/brand moments only; content present in DOM; `prefers-reduced-motion` off-switch; ~0.6s max even then. |
| **Scroll-jacking / smooth-scroll inertia / parallax / pinned-scrubbed** | **Spectacle-only** | Hijacks native scroll → motion-sickness, breaks find-in-page, keyboard paging, scrollbars; invisible to crawlers/reduced-motion. | Must read perfectly as normal-scroll static layout; gate behind reduced-motion + capability check (anti-patterns §5 hard ban on `scroll` listeners). |
| **Canvas frame-sequence scrubbing (scroll-cinema)** | **Spectacle-only** | 150–300 decoded frames = heavy bandwidth/decode + memory (worse on mobile); a rAF reader runs every frame; canvas content invisible to SEO/SR; vestibular risk; first-paint risk if frames gate a loader. | Poster frame as LCP + real DOM hero/text; decode ~10 frames then stream the rest (never block paint); cap ≤150 frames @ ≤1280px on mobile; gate behind reduced-motion + capability; read scroll in rAF, never a `scroll` handler. |
| **WebGL/3D hero (cube, sphere, render, physics cluster)** | **Spectacle-only** | Heavy GPU/CPU/bandwidth + battery; **invisible to SEO/keyboard/SR** (cubiflow captured *zero headings*); vestibular risk. | Real DOM hero + static poster as LCP; explicit `<button>`/`<a>` affordances; lazy-mount on interaction after capability + reduced-motion check (northkingdom = the model). |
| **Ghost/dormant-until-hover index (≤10–15% contrast at rest)** | **Spectacle-only** | Fails WCAG at rest; hides navigable links from low-vision/touch; hover-only reveal invisible on touch. | Keep the giant scale + reveal *delight* but set the resting state to a legible muted token; reveal on **focus** too. |
| **Animated particle ring / liquid-distortion / kinetic type** | **Spectacle-only** | Continuous JS/shader = ongoing GPU/battery; warped logo can fail recognition; no semantic payload. | Render the underlying phrase as readable text; `aria-hidden` the ornament; keep an undistorted accessible name; gate by reduced-motion + pause off-screen. |
| **Ghost watermark / perspective ticker / marquee** | **Spectacle-only** | Continuous transform = perpetual GPU cost; far/faint items illegible by design. | Pure `aria-hidden` ornament; never place nav/real content in it; if a list must function, ship a flat readable copy. |
| **All-monospace / bitmap-font body, near-zero type scale** | **Spectacle-only** (as a global rule) | Mono/bitmap @ ~12px is slow to read & fails comfortable a11y for long copy; flat scale destroys scannability + landmarks. | Keep mono/bitmap for *chrome/labels/short lines*; switch body + all transactional flows (cart, forms, legal) to a readable face/size with real heading levels. |
| **Custom cursor / accelerometer ("shake") / device-native gimmick** | **Spectacle-only** | a11y- & perf-hostile; undiscoverable; excludes users who can't perform the gesture; permission often denied. | Native cursor; the gimmick is an Easter egg over a static fallback, never the only path to content (anti-patterns §5). |
| **Glyph/dingbat-encoded footer or data** | **Spectacle-only** (as drawn) | SR gibberish, copy-paste breakage, contrast traps when a glyph *is* the comma/digit. | Render real semantic text; keep dingbats as `aria-hidden` ornament *around* it. |
| **Intro loader / wordmark-reveal gate** | **Spectacle-only** | Adds latency before content; blocks first paint; hostile where users have a task. | Keep skippable and short; never hide critical content/LCP behind it. |
| Fully desaturated imagery (greyscale-everything) | **Safe-with-care / brand-dependent** | Throws away product/photo information; costly where image content carries meaning (ecommerce, docs). | Fine for mood pieces; keep real `alt`; don't desaturate where the image's content is the information. |

---

## When to reach for expressive at all

**Default to the production corpus.** Reach for this expressive corpus *only* on **marketing,
landing, brand-experience, agency/portfolio, campaign, and launch surfaces** — pages whose job is
attention, mood, and brand affect, where a moment of spectacle is the point and the user does not
have a task to complete.

**Do NOT reach for it on product UI**: dashboards, apps, settings, checkout/cart, forms, docs,
data-dense tools, or anything transactional. There, the spectacle techniques in the ledger become
pure liability — they slow comprehension, fail a11y, hurt Core Web Vitals, and read as noise.

A useful test: **if the screen has a task, default production; if the screen has a message, expressive
is on the table.** Even then, take only the **production-safe** column wholesale; bring in any
**spectacle-only** technique deliberately, one or two per page, each justified in a single sentence
(per anti-patterns §5: *every animation justifiable in one sentence*), each gated, each with a
fallback. The point of this corpus is not "add more"; it is **subtract harder, then concentrate the
one thing you keep.**

**Cross-references**
- House tokens & the expressive preset that overrides the seed: [`../../tokens/`](../../tokens/)
  (note the seed ships a full semantic palette + dual-mode + 4–12px radii + diffuse low-opacity
  shadows — the production baseline these exemplars deliberately strip).
- Extracted expressive patterns (45): [`./patterns/`](./patterns/).
- The slop gate every expressive build must still pass:
  [`../../.claude/skills/web-design-taste/references/anti-patterns.md`](../../.claude/skills/web-design-taste/references/anti-patterns.md)
  — especially §5 Motion (corpus-dependent; expressive may "go big" but must obey the hard bans),
  §4 Color, §6 decoration clichés (scroll cues, locale strips, section-number eyebrows — note
  several appear *legitimately* here only when they carry real nav/status), and §7 a11y/contrast.
