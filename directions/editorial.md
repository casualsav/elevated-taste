---
direction: editorial
axis: aesthetic-flavor
one_liner: "Publication gravitas — a display/serif voice carries hierarchy, hairline rules and tracked-caps labels do the structuring, color stays restrained."
preset: ../tokens/presets/editorial.json
composes_with: [production, expressive]
exemplars:
  production: [every, outerbloc, ramp, round, resend, teak, vanta, warp, railway]
  expressive: [locomotive, adoratorio, 14islands, dogstudio, exoape, basement, buildinamsterdam, studiofreight, wokine, creativeinc]
---

# Editorial

> The page should read as **"a publication"** before you parse a word.

A flavor for content-led brands, media sites, agencies, and any product-marketing that wants editorial gravitas without abandoning a clean UI. It is **orthogonal to corpus**: layer it on `production` for a calm, literary SaaS/blog (`every`, `outerbloc`, `railway`), or on `expressive` for an art-directed agency showcase (`locomotive`, `dogstudio`, `exoape`).

## Signature (what makes something read "editorial")

1. **A display register that is a different *face*, not a heavier weight.** The defining move is a strict division of labor between two type voices: a serif (or strong, characterful display face) is reserved for *display* — wordmark, headlines, named things (article/project titles) — while a neutral grotesque carries all functional UI, body, nav, and buttons. The serif never sets prose; the sans never sets a headline. Because **face**, not size or weight, signals which voice you're reading, the page sorts message / identity / annotation pre-attentively and stays calm at high density.
   - `every`: Signifier serif for display, Switzer sans for everything functional. Hierarchy from **typeface + scale**, weight ~400 throughout (600 rare, 700 essentially unused).
   - `railway`: IBM Plex Serif for *the claims*, Inter for *the interface*, mono for system tags.
   - `locomotive`/`exoape`: a book/Times-class serif blown up to poster scale (or, inverted, a neutral sans at display with a small serif-italic voice).
   - `outerbloc`: three registers — Larken serif (headlines), TWK Lausanne grotesque (wordmark/UI), Geist Mono uppercase (all metadata).

2. **Hierarchy by scale + face, not by bold.** Headlines run large but in a near-single weight; emphasis is bought with *size and air*, never a "bold everything" arms race. Keep the display-to-body ratio meaningful (~3–7×) but, in **production**, keep an intermediate rung (sub-heads, deks) so mid-level text has a home — the extreme 10×+ jumps of the expressive exemplars leave product UI's middle tier homeless.

3. **Generous measure + leading.** Reading is the job. Body copy runs ~1.5–1.7 leading on a constrained measure (a centered content column, ~`container.content`), so prose breathes like a page, not a dashboard. (A tight serif at small size hurts — keep serif body ≥ ~16px with generous leading, and serif *headlines* ≥ ~20px on dark so thin high-contrast strokes don't shimmer.)

4. **Rules and dividers instead of boxes.** Hairline rules — a single grey — separate sections and list rows; large vertical voids do the chunking. Cards (when present) share one rigid anatomy (media → serif title → sans dek → tracked byline) and are flat: no shadows, one or two radius tiers. The frame stays silent so the *content* (the serif, the art, one bright break) carries the interest.
   - `locomotive`'s "list-as-gallery": project names set as full-width, rule-separated serif rows — the names *are* the portfolio.
   - `every`'s "labeled-editorial-feed": a tracked-caps section label over its own grid of serif-title cards; the label *is* the wayfinding.

5. **A metadata language: tracked-caps eyebrows + boxed micro-labels.** Short uppercase, wide-tracked labels (`RECENT ESSAYS`, role/spec labels) and small hairline-boxed tags (`[OPS]`, `[DES]`, category chips) annotate without shouting. Never run prose this way — restrict to short eyebrows/metadata.

6. **Restrained color — monochrome plus one rationed accent (or none).** No gradients in chrome, no decorative hues. Emphasis comes from *surface inversion* (`outerbloc`: warm bone ↔ warm near-black) or one bright field used as scarce punctuation (`every`: a single cyan panel in a near-black book). The accent, if any, is spent only on links/actions. Color often comes from the *content* (thumbnails, art), not the UI.

## How to apply

```bash
node tokens/build.mjs --preset=editorial   # base + presets/editorial.json -> tokens.css
```

The preset (`tokens/presets/editorial.json`) overrides only the keys that carry the editorial signature: it introduces a **serif display family** (`font.serif`), relaxes body leading and tightens display tracking, mutes the accent toward an editorial link-blue, drops shadows toward flat, and lengthens the reading measure. Everything else inherits from the base. Pair with the appropriate corpus — read `corpus/<corpus>/principles.md` and the named exemplars before writing markup.

## Production-safety note (editorial moves are mostly cheap)

Editorial is the **safest** expressive flavor — most of its power is pure CSS/type and ports straight to product UI:

- **Two-register serif/sans typography** — *production-safe, recommended.* A value lever that recolors the whole tone for free. Self-host the serif as a `woff2` subset (display glyphs only) with `font-display: swap` so it isn't render-blocking.
- **Scale-driven (single-weight) hierarchy** — *production-safe*, but needs a face with real display presence; test the large end, and in product UI add a mid rung so not everything is body-or-hero.
- **Hairline rules, flat cards, surface inversion** — *production-safe, cheap.* Just verify muted/label greys and any link-blue clear WCAG AA on the chosen background.
- **Tracked-caps eyebrows + boxed micro-labels** — *production-safe* at eyebrow/metadata scope only; keep ~11px caps above contrast minimums and give each section a real heading (don't encode meaning in a bracket alone).
- **Ink-alternation emphasis in a sentence** (`14islands`) — *production-safe with care*: the de-emphasized grey can fail AA for small text. Acceptable for a large decorative hero statement; never for small reading copy.
- **Spectacle-only when editorial borrows from `expressive`** (these belong to the expressive flavor, see `expressive.md`): the *animated* ASCII/word ring (`adoratorio`), the dormant-until-hover **ghost index** (`dogstudio`, `14islands`' opacity-decay index when it gates real nav), the **glyph-encoded footer** where dingbats replace real characters (`locomotive`), and **smooth-scroll inertia** (Locomotive Scroll). Keep the static composition, gate the motion behind `prefers-reduced-motion`, and always leave real, focusable, semantic text underneath the ornament.
