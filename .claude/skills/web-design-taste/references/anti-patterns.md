# Anti-Patterns: the frontend "slop" gate

The de-duplicated, canonical list of AI-design Tells to **avoid**. Synthesized from the four legacy skills (`taste-skill`, `soft-skill`, `minimalist-skill`, `gpt-tasteskill`). The Skill loads this as a quality gate, and the future design-lint reads it as its rule source.

**How to read each entry:** `anti-pattern` → *why it's bad* → **better move**.

**Corpus tags** (see `docs/ARCHITECTURE.md` — `production` = usability-first software; `expressive` = motion-led brand/spectacle):
- *(both)* — banned everywhere. Default if untagged.
- *(production)* — banned in product UI; **acceptable in `expressive`** when it serves the spectacle.
- *(expressive too)* — banned even in spectacle work; it's slop, not art.

When the brief explicitly asks for a banned pattern, the brief wins — but say so out loud. Silence = the pattern is a Tell.

---

## 0. THE CANONICAL GENERIC AI TEMPLATE (read this first)

The single most recognizable LLM output. If your page resembles this, you have failed before anyone reads the copy:

> **Oversized centered hero** (headline floating halfway down a `h-screen` section) + **vague aspirational headline** ("Build better, faster" / "The future of X") + **a soft purple/blue gradient** background or blob + **three identical feature cards** in a row + **a fake product dashboard built from `<div>`s** (fake task list / fake chart / fake terminal), often with a `v0.6 · BETA` eyebrow and a `Scroll ↓` cue at the bottom.

*Why it's bad:* it is the statistical mean of every template the model has seen. It signals "AI-generated" instantly, conveys nothing specific about the product, and every element is a Tell on its own.

**Better move:** infer the real product from the brief; write a concrete, specific headline; pick a deliberate palette (not default purple); replace the 3-card row with an asymmetric/zigzag layout; use a real or generated image instead of a div-mock; drop the version eyebrow and the scroll cue. Each of these is broken out below.

---

## 1. Generic-template content & copy *(both)*

- **Vague aspirational headlines** ("Elevate your workflow", "The future of work", "Build better, faster") → *says nothing about the product, infinitely reusable* → **name the actual job-to-be-done in concrete terms.**
- **Filler verbs / AI clichés** — "Elevate, Seamless, Unleash, Next-Gen, Game-changer, Revolutionize, Delve, Supercharge" → *marketing vapor, top LLM vocabulary tell* → **concrete verbs tied to what the product does.**
- **Placeholder names** — "John Doe", "Sarah Chan", "Jack Su", "Lorem Ipsum" → *screams unfinished/templated* → **realistic, locale-appropriate names.**
- **Startup-slop brand names** — "Acme", "Nexus", "SmartFlow", "Cloudly", "Quantum" → *generic SaaS-name generator output* → **a contextual name that sounds like a real company.**
- **Fake-perfect numbers** — `99.99%`, `50%`, `1,234,567`, `10x` → *too clean to be real data* → **organic, messy values (`47.2%`, `+1 (312) 847-1928`).**
- **"Quietly in use at" / "Quietly trusted by"** social-proof headers → *performative-humble AI phrasing* → **"Trusted by", "Used at", or just show the logos.**
- **Poetic craftsman labels** — "From the field", "Field notes", "On our desks", "Loose plates", "We respect the French ones" → *performative-artisan, instantly AI* → **plain functional labels ("Testimonials", "Latest writing") or none.**
- **Emojis in code / markup / copy / alt text** *(production; expressive too unless the brand is genuinely playful)* → *cheap, inconsistent rendering* → **real icons or SVG primitives.**
- **Hallucinated / broken copy** ("free on its past") → *nobody re-read it* → **re-read every visible string before shipping.**

---

## 2. Layout *(mixed — see tags)*

- **Three identical feature cards in a row** *(both)* → *the #1 layout Tell; Bootstrap-era default* → **2-column zigzag, asymmetric bento, scroll-pinned, or horizontal-scroll alternative.**
- **Div-based fake product UI / fake screenshots** *(both)* — fake task lists, fake terminals, fake dashboards built from styled `<div>`s, often with `v0.6.2-rc.1` / `last sync 4s ago` fake footers → *the #1 overall LLM-design Tell* → **a real screenshot, a generated image, a real component preview, or nothing.**
- **Empty/dead cells in bento grids** *(both)* → *lazy grid math, visible voids* → **`grid-auto-flow: dense`, interlock spans, N items → exactly N cells; 3–5 intentional cards beat 8 messy ones.**
- **3+ consecutive sections with the same image+text split** *(both)* → *monotonous, betrays a loop* → **vary layout family; ≥4 different families across 8 sections.**
- **Split-header** — giant left headline + tiny floating explainer paragraph in the top-right corner *(both)* → *the floater aligns to nothing; pure decoration* → **stack sub-text under the headline, or a clean aligned 2-column header.**
- **Hero floating halfway down the viewport** *(both)* → *no top discipline* → **max `pt-24` desktop; headline ≤2 lines; CTA visible without scroll.**
- **Hero overstuffed** — eyebrow + headline + subtext + CTAs + tagline + trust micro-strip *(both)* → *clutter* → **max 4 text elements in the hero.**
- **Logo wall with category/industry labels under each logo** *(both)* → *clutters the wall* → **logos only, real SVG marks (Simple Icons / devicon), under the hero not inside it.**
- **Edge-to-edge sticky navbar glued to the top** *(production)* → *generic; expressive prefers a detached floating pill* → fine in production if clean and ≤80px / one line; **avoid the glued-flush look in expressive.**
- **Symmetric Bootstrap 3-column grids with no whitespace** *(production)* → *cramped, templated* → **asymmetric grid + generous macro-whitespace (`py-24`+).**
- **Cramped sections** *(both)* → *no breathing room reads cheap* → **huge vertical rhythm between sections (`py-24`→`py-48`); omit card boxes in favor of spacing where possible.**

---

## 3. Typography *(mixed)*

- **Inter / Roboto / Open Sans / Arial / Helvetica as the default** *(production: avoid; expressive: hard-fail)* → *the universal AI-default typeface(s)* → **a deliberate face (Geist, Satoshi, Clash Display, Cabinet Grotesk, PP Editorial, Switzer); override path exists if the brand mandates Inter.**
- **6-line wrapped headlines** *(both)* — H1 jammed into a narrow container → *catastrophic LLM default* → **ultra-wide container (`max-w-5xl`+), `clamp()` font size, H1 ≤2–3 lines.**
- **Oversized H1s that just scream** *(both)* → *raw scale substituting for hierarchy* → **control hierarchy with weight + color, not size alone.**
- **Em-dash `—` anywhere visible** *(both — non-negotiable)* — headlines, eyebrows, pills, body, quotes, attribution, captions, buttons, alt text → *the single most-violated Tell; LLM signature crutch* → **regular hyphen `-`, or restructure (period / comma / colon / parentheses / line break).** En-dash `–` as a separator is banned too; ranges use a hyphen (`2018-2026`, `€40-80k`).
- **`<br>`-broken + italicized headlines** as a default "design move" *(both)* → *gimmick before legibility* → **headline reads naturally first; get clever only if the brief demands.**
- **Gratuitous gradient text** on large headers *(production)* → *over-decorated* → **solid color; reserve gradient text for genuine expressive accents.**
- **Vertical / 90°-rotated text** *(production)* → *agency-portfolio cliché* → **only in expressive when it serves real composition.**
- **Serif misuse** *(both)* — serif on a dashboard, or the AI-default serifs (Fraunces, Instrument Serif) → *wrong register / overused* → **serif only for editorial/luxury/publication; pick a less-defaulted face.**
- **Italic descender clipping** *(both)* — `y g j p q` clipped in italics → *sloppy* → **`leading-[1.1]` min + `pb-1` reserve.**

---

## 4. Color *(mixed)*

- **AI-default purple/blue gradient** (hero blob, mesh, button) *(production: avoid; expressive: use deliberately, not by reflex)* → *the canonical "AI look"* → **a brand-derived palette; if you want depth in expressive, choose the hue on purpose.**
- **Pure black `#000000` / pure white `#ffffff`** *(both)* → *kills depth, harsh* → **off-black (zinc-950, warm charcoal) and off-white (bone `#F7F6F3`).**
- **Oversaturated / neon accents** *(production; expressive sparingly)* → *cheap, clashes with neutrals* → **desaturate to blend; neon only as an intentional expressive signature.**
- **Primary-colored backgrounds for large sections/heroes** *(production)* → *loud, templated* → **neutral canvas; color as a scarce accent.**
- **AI-default premium-consumer palette** — beige + brass + oxblood + espresso *(both)* → *every AI "luxury cookware/wellness/artisan" page* → **a different, deliberate palette family.**
- **Inconsistent accent color across sections** *(both)* → *no system* → **one accent used identically everywhere.**

---

## 5. Motion *(heavily corpus-dependent)*

- **`window.addEventListener('scroll')` for scroll effects** *(both — hard ban)* → *continuous reflows, kills mobile perf* → **`IntersectionObserver`, CSS scroll-driven animation (`animation-timeline`), GSAP ScrollTrigger, or Motion `useScroll()`.**
- **Animating `top` / `left` / `width` / `height`** *(both)* → *layout-triggering, janky* → **animate `transform` + `opacity` only; `will-change` sparingly on actively-animating nodes.**
- **`linear` / `ease-in-out` / instant state changes** *(production: prefer better easing; expressive: required upgrade)* → *no physical feel* → **custom cubic-bezier (`cubic-bezier(0.16,1,0.3,1)`), spring physics.**
- **Heavy choreography — parallax, pinned/scrubbed scroll, card-stacking, kinetic type** *(production: avoid; expressive: encouraged)* → *spectacle that hurts usability/perf in product UI* → **in production keep motion subtle and feedback-oriented; in expressive go big — but every animation still justifiable in one sentence.**
- **GSAP-for-show / motion with no purpose** *(both)* → *movement as decoration* → **each animation justified by hierarchy / storytelling / feedback / state.**
- **Custom mouse cursors** *(production)* → *outdated, a11y- and perf-hostile* → **native cursor; only in expressive when it's a real interaction concept.**
- **`backdrop-blur` on scrolling containers / large content** *(both)* → *continuous GPU repaints, mobile frame drops* → **blur only on fixed/sticky elements (nav, overlays).**
- **Grain/noise on scrolling containers** *(both)* → *repaints* → **fixed `pointer-events-none` pseudo-element overlay only.**
- **Everything mounting at once** *(both)* → *flat, no rhythm* → **staggered reveals (`delay = index * 80ms`).**
- **Missing `prefers-reduced-motion` fallback** *(both)* → *accessibility failure* → **wrap everything above a low motion threshold; uncleaned `useEffect` animations also banned — strict cleanup required.**
- **`h-screen` for full-height sections** *(both)* → *iOS Safari viewport jump* → **`min-h-[100dvh]`.**

---

## 6. Components, icons & decoration *(mixed)*

- **Hand-rolled SVG icons / decorative SVGs** *(both)* → *inconsistent stroke, reinvented* → **Phosphor / HugeIcons / Radix / Tabler; standardize stroke weight. Lucide/Feather/Heroicons/FontAwesome/Material only on explicit request.**
- **shadcn/ui in default state** *(both)* → *recognizable as untouched* → **customize radii, color, shadow, typography to the brand.**
- **Tailwind default heavy shadows** (`shadow-md/lg/xl`) and harsh dark drops (`rgba(0,0,0,0.3)`) *(production; expressive sparingly)* → *cheap depth* → **ultra-diffuse low-opacity shadows (<0.05) or inner borders / tinted shadows.**
- **Generic 1px solid gray borders** *(production)* → *default look* → **hairlines tuned to the palette (`rgba(0,0,0,0.06)`), used to organize real content.**
- **Neon / outer glows** *(production)* → *AI-y* → **inner borders or subtle tinted shadows; glow only as an expressive signature.**
- **`rounded-full` on large containers/cards/primary buttons** *(production — minimalist/editorial)* → *off-register for clean UI* → **crisp 4–12px radii; one corner system page-wide. Pill CTAs are fine in soft/expressive directions.**
- **Section-number eyebrows** — `00 / INDEX`, `001 · Capabilities`, `06 · how it works`, "QUESTION 05", "SECTION 01", "ABOUT US" *(both)* → *cheap enumeration* → **name the topic in plain language; if the user can count, drop the number.**
- **Generic step labels** — "Stage 1/2/3", "Step 1/2/3", "Phase 01/02", "Pass One/Two" *(both)* → *filler* → **the verb-noun is the label ("Install", "Configure", "Ship").**
- **Version labels in the hero** — `V0.6`, `v2.0`, `BETA`, `EARLY ACCESS`, `INVITE-ONLY PREVIEW`, `ALPHA` *(both)* → *fake-exclusivity eyebrow* → **drop it, unless the brief is genuinely a launch/preview.**
- **Version footers on marketing pages** — `v1.4.2`, `Build 0048`, `last sync 4s ago · main` *(both)* → *devtool fixtures, not landing content* → **remove. (Fine on an actual docs/devtool site.)**
- **Decorative status dots** before nav items / list rows / badges *(both)* → *fake liveness* → **zero by default; only for real semantic state, sparingly.**
- **Middle-dot `·` as the default separator** ("foo · bar · baz · qux") *(both)* → *over-used metadata crutch* → **max 1 per line; prefer line breaks, hairlines, columns.**
- **Pills / labels / tags overlaid on images** — `Brand · 02`, `PLATE · BRAND`, `Field notes - journal` *(both)* → *clutters the photo* → **let the image speak, or caption directly below it.**
- **Photo-credit captions as decoration** — `Field study no. 12 · Ines Caetano`, `Frame XII · 35mm` *(both)* → *pretentious filler under stock images* → **credit only a real photographer of a real photo; otherwise skip or one functional caption.**
- **Decoration text strip at hero bottom** — `BRAND. MOTION. SPATIAL.`, `DESIGN · BUILD · SHIP`, `ESTD. 2018 · LISBON` *(production; expressive: only with real nav/status)* → *agency-portfolio cliché* → **drop, unless it carries real links or real status.**
- **Locale / city / time / weather strips** — "Lisbon 14:23 · 18°C", "1200-690 Lisbon, Portugal" in nav/hero *(both)* → *atmospheric decoration* → **drop, unless the brief is genuinely place- or timezone-relevant; a single footer address is fine.**
- **Scroll cues** — `Scroll`, `↓ scroll`, `Scroll to explore`, animated mouse-wheel *(both)* → *users know what scroll is* → **none; a bare arrow at most.**
- **Micro-meta-sentences under eyebrows** — explanatory sentence wedged between heading and body *(both)* → *clutter* → **eyebrow + headline + body is enough.**
- **`border-t` + `border-b` on every row** of a long list/spec table *(both)* → *laziest layout; double hairlines* → **pick one border, used sparsely; for >5 items use a real component, not `<ul>` + `divide-y`.**
- **Scoring/progress bars with filled background tracks** as comparison visuals *(production)* → *dashboard clutter on a landing page* → **a number + small icon, or a tiny inline bar with no track.**
- **Eyebrow overload** *(both)* → *every section shouting a mono-caps micro-label* → **count ≤ ceil(sections / 3); hero counts as one.**
- **Invisible button text** (white-on-white, low contrast) *(both)* → *unreadable, fails WCAG* → **dark bg = light text and vice versa; AA 4.5:1; no CTA label wraps to 2 lines at desktop.**
- **Duplicate-intent CTAs** ("Get in touch" + "Let's talk" on one page) *(both)* → *redundant* → **one CTA per intent.**

---

## 7. Images, a11y & semantics *(both)*

- **Broken Unsplash links** → *dead images* → **`https://picsum.photos/seed/{descriptive}/{w}/{h}`, generated placeholders, or real assets.**
- **Oversaturated raw stock photos** → *cheap, off-palette* → **desaturated/warm-toned, subtle grain overlay, CSS filters to match the system.**
- **Pure-text minimalism with no imagery** *(production)* → *flat, empty* → **real or generated images; ambient depth without breaking the aesthetic.**
- **Contrast failures** — body, placeholders, focus rings, form labels below AA → *inaccessible* → **WCAG AA minimum (AAA for hero copy), tested against the actual section background.**
- **Mid-page theme flips** — a section inverts light/dark while the rest doesn't → *jarring, betrays copy-paste* → **one theme lock for the whole page (light, dark, or auto).**
- **Light-only design** → *no dark support* → **dual-mode by default; define tokens and test in both modes before shipping.**
- **Missing empty / loading / error states** → *unfinished* → **provide all three.**
- **Mixed design systems** (Material + shadcn on one page) → *incoherent* → **one design system per project.**
- **Unstable layout** — high CLS, no mobile collapse → *broken on small screens* → **explicit mobile collapse (`w-full`, `px-4`, `max-w-7xl mx-auto`); plausible Core Web Vitals (LCP <2.5s, INP <200ms, CLS <0.1).**
- **`100vw` full-bleed breakouts** — `width:100vw` (often with `margin-left:50%` + `translateX(-50%)`) → *`100vw` includes the scrollbar, so the page gains a horizontal scrollbar on most desktops; the centering transform also collides with any reveal animation that ends in `transform:none`* → **give the element a full-width parent and `width:100%`; if a breakout is truly unavoidable, add `overflow-x:clip` on `body`.**

---

## Quick gate (the lint short-list)

The highest-signal checks, mechanical enough to automate:

1. Page does **not** match the §0 generic template.
2. **Zero** `—` / `–` anywhere visible.
3. No **div-based fake screenshot**.
4. No **three identical feature cards**.
5. Not **Inter/Roboto** by default; no **AI purple/blue gradient**; no **pure #000/#fff**.
6. No **section-number / version / scroll-cue / locale / decoration-strip** Tells.
7. No `window.addEventListener('scroll')`; motion animates only `transform`/`opacity`; reduced-motion handled.
8. No **placeholder names / Acme / fake-perfect numbers / filler verbs**.
9. **Icons** from an allowed library; **shadcn** customized, not default.
10. Hero ≤2-line headline, CTA visible, ≤4 text elements; CTA text passes AA.
