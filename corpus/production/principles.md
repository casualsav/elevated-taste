# Production design principles

Cross-exemplar design rules for usability-first software: SaaS, dev tools, B2B/consumer apps, docs, and editorial. **Read this first**, before building any product UI — it is the synthesized "house taste" distilled from the shipping reference sites (`./exemplars/`).

How to use it: these are the *transferable mechanisms*, not site clones. Each rule names the principle, then 2-3 exemplars that prove it. Pair this with:
- `../../tokens/tokens.json` — the house token scale (bg/surface/fg/muted/border/accent roles, 8px space, radius, motion). Start every build from `/tokens`.
- `./patterns/` — the named, reusable section recipes (e.g. `feature-section-header`, `two-tone-headline`, `dark-bento-grid`). Principles say *why*; patterns give the *how*.
- `../../.claude/skills/web-design-taste/references/anti-patterns.md` — the slop gate. Every rule below has a mirror-image Tell there; this doc is the positive form of that ban list.

The throughline across all of them: **discipline is the aesthetic.** These sites look expensive because of what they *refuse* — extra weights, extra hues, extra shadows, extra ornament — not because of what they add. Expressiveness is rationed to one or two deliberate moves per page; everything else is held flat.

---

## Hierarchy & type

**Hierarchy comes from scale, not weight. Pick one weight band (≈400-500) and let a 3-5x size jump between body and display do the ranking.** This is the single most universal rule in the corpus — every minimalist exemplar obeys it. A headline reads as a headline because it is large, not because it is bold; the page stays optically calm at high density and never gets the "everything is shouting" feel. Body sits at 16px; display lands at ~48-110px with little in between — *the gap itself is the hierarchy*. (Marketing pages only: app screens keep a ~2× range, see App screens below.) — linear (4x, Inter 400/510/590), stripe (3.5x, Söhne 300/400 only), supabase (4.5x, 400/500 only), vercel (4-7x).

**The bigger the type, the tighter the tracking.** At display sizes default letter-spacing reads loose and amateur; negative tracking (~-0.02 to -0.05em) is what makes oversized headings feel *engineered* rather than ballooned. Bind a `tracking-tight` token to `2xl`+ sizes only; leave body near-zero. — vercel (-0.05em at 110px), resend (-0.05em at 56px), framer (-0.045em), linear (-0.022em).

**A second typeface should carry *meaning*, not variety.** The recurring high-craft move is a two- or three-register type system where face signals role: a serif or expressive display for the *message/voice*, a clean sans for *all functional chrome*, and a monospace for *machine/metadata* (eyebrows, labels, code, stats). The reader sorts message / interface / annotation pre-attentively, before parsing a word — and you get rich hierarchy with near-flat weight. Serif = "human/editorial/trusted institution"; mono = "this is code / a live number / a dev tool." — vanta & round (Reckless/PS-Times serif display over Inter), every (Signifier serif + Switzer sans + tracked-caps labels), warp & resend (display sans + mono chrome), vercel & mintlify & clerk (sans + mono-for-metadata). See patterns `typographic-role-split`, `mono-label-metadata`, `mixed-serif-sans-display`.

**Encode a sentence's structure with color, inside one type size: the "two-tone headline."** Split a line into an ink lead clause and a muted (or accent) continuation — "*Build in a weekend.* Scale to millions." The color shift front-loads the claim and demotes the elaboration with no second size, weight, or line break. The most-reused single device in the corpus. — stripe, supabase, ramp, round. See patterns `two-tone-headline`, `two-tone-display-hero`, `serif-display-on-neutral`.

**Reserve mono and tracked-uppercase strictly for short labels.** Mono is wide and tires the eye in long runs; uppercase tracking aids eyebrows and kills prose. Keep the machine voice to eyebrows, badges, stat captions, and code — never body. — vercel, warp, teak, every.

> Anti-pattern mirror (see `anti-patterns.md` §3): oversized H1s that just scream, 6-line wrapped headlines, gratuitous gradient text, Inter/Roboto as the *default* face, serif on a dashboard, em-dashes anywhere visible.

---

## Color & restraint

**Ration one saturated accent. The fewer pixels it touches, the more meaning each touch carries.** Run a near-monochrome neutral field and spend the *single* accent only on the things that must mean something: the primary CTA, links, and live/interactive signals. Scarcity is what turns a color into "brand" instead of decoration — the eye goes straight to the action. This is near-universal across the corpus. — clerk (violet `#6c47ff` on eyebrows + one CTA, else strict grayscale), framer (electric blue hoarded, released only on the Canvas glow + CTA bloom), mintlify (lone emerald = logo/links/metrics), supabase (one green = "go"), railway (purple on links + button only).

**Neutrals should lean toward the accent's hue family — and away from pure values.** Pick a slate/warm/cool neutral ramp that shares the accent's temperature so the accent reads as "more of the same family," not a foreign highlight; and shift bg ~3-5% off `#fff` and ink ~5% off `#000`. Pure `#000/#fff` reads clinical and "default-template"; an off-black + off-white instantly feels art-directed for zero effort. — stripe (blue-slate neutrals under a violet accent), teak (`#f0f2ef` canvas + `#2a0f14` plum ink), warp (warm `#fcfcfc`/`#f8f5ee` + `#0a0908`), retool (one bone `#e9ebdf` for text + surfaces + borders). (Exceptions that prove the rule: framer ships *pure* `#000` as a deliberate, darker-than-peers brand choice.)

**Assign each saturated hue exactly one job, and namespace decorative/data color away from UI color.** When a page is colorful, the discipline is that the rainbow is *coding* (product categories, chart series, illustration) and never leaks onto buttons or labels — the UI accent stays singular. One job per color is why a busy page still tells you where to click. — posthog (orange-red owns all actions; a dozen category hues tag products), sentry (one pink for chrome; a six-hue palette quarantined inside mocks + mascots), linear (pastel data-viz hues + two one-off spotlight colors, never on chrome).

**A light accent takes *dark* foreground text.** Acid-yellow, lime, mint, and pale-green accents fail white-on-color contrast; pair them with near-black text. — ramp (`#e4f222` + dark text), supabase (`#3fcf8e` button, dark label), teak (`#fae261`).

**Spend expressive color in a *few* deliberate full-bleed blocks, not everywhere.** Quarantine saturation into a small number of intentional bands/tiles — a dark stats band, a bright CTA panel, per-customer story cards — so the disciplined neutral everywhere else lets them land as punctuation. — stripe (two bands: hero ribbon + dark stats), mintlify (full-bleed story tiles in clay/periwinkle/forest), every (one cyan panel recurs as the conversion break), linear (two spotlight quote cards).

> Anti-pattern mirror (§4): the AI-default purple/blue gradient, pure `#000/#fff`, oversaturated neon, primary-colored hero backgrounds, inconsistent accent across sections.

---

## Space & rhythm

**Whitespace is the primary section separator — buy legibility with space, not borders or background boxes.** A long, dense page stays scannable because sections are divided by large vertical voids, not by rules, fills, or per-section card chrome. This holds across nearly every exemplar regardless of light/dark or density. — stripe (64-96px block padding, almost no dividers on a 14k-px page), vercel (96-256px voids; the emptiness *is* the layout), linear (96px breaks between feature blocks), mintlify (padding steps 48→80→104px).

**Work on an 8px base (occasionally 4px). Cluster control spacing tight, then jump hard between sections.** The signature rhythm is a tight intra-component cluster (2/4/8/12px gaps inside cards and controls) and a large macro jump (32→64→96px, sometimes 128-256px) between content groups. The *contrast* between dense components and airy section breaks is what keeps an information-rich page calm — dense blocks read as "screenshots," the air paces the narrative. — confirmed in nearly all `../tokens/*.json` (`space.base: "8px"`; vercel & posthog use 4px); warp (4-12px control gaps vs 64-96px section gaps), linear, teak.

**Structure dense regions with hairlines, not elevation.** Group feature trios, spec lists, and tables with a single 1px low-opacity border (and whitespace) rather than stacked shadowed cards. Lines keep a dense section flat and calm; "cards-in-cards-in-cards" reads cheap. — teak (hairline-boxed clusters, no cards-in-cards), ramp (1px 10%-black borders, financial-grade), linear (translucent-white 5-8% borders that feel like light, not lines).

> Anti-pattern mirror (§2): cramped sections, symmetric Bootstrap grids with no whitespace; (§6) `border-t`+`border-b` on every list row.

---

## Layout

**Define one section schema and repeat it down the page — vary only the payload.** A long marketing page feels *authored* (not assembled from a loop) when every feature block shares one skeleton and only the content rotates. Reusing one header/section geometry gives a 10k-px story a spine and reads as a system. — linear (`feature-section-header`: heading-left / description+numbered-link-right, repeated), railway (fixed beats: sticker label → serif headline → lede → icon triplet → logo row), warp (left text rail → product-UI panel, alternating image side).

**Prefer asymmetry and varied layout families over the centered-hero, 3-equal-cards default.** Centered single-column is fine for a hero or short editorial measure, but vary the layout family across sections (asymmetric splits, bento, tabbed showcase, zigzag) so no three consecutive sections share the same image+text split. — vercel (radically asymmetric hero: headline far-left, eyebrow far-right), mintlify (copy left, product frame bleeding off the right edge), supabase (`tabbed-product-showcase` compresses five features into one viewport).

**Build feature breadth as a uniform-shelled bento — let tile *contents* differ wildly, lock tile *frames* identically.** For an "all-in-one platform / we do many things" pitch, a grid of identical-radius, identical-padding cells each holding a distinct mini-UI conveys breadth in one scan; the locked frame is what stops variety from becoming chaos. Use `grid-auto-flow: dense` and mixed spans so N items fill exactly N cells (no dead voids). — vanta (`alternating-canvas-bento`, 2×3 of distinct mini-UIs), framer (3×3 capability grid, one repeated cell anatomy), supabase (mixed-size bento avoids the equal-card row), clerk (`dark-bento-grid`).

**Center the content in a ~1024-1280px max-width column; collapse cleanly to one stacked column on mobile with the type voices intact.** Every exemplar caps content width and reflows to a single column at mobile, keeping CTAs full-width and the display/serif/mono register split alive. — corpus-wide (1024-1280px content; 1440×900 desktop capture, ~1170px mobile).

> Anti-pattern mirror (§2): three identical feature cards, split-header (giant headline + tiny floating corner paragraph), hero floating halfway down the viewport, empty cells in bento grids, 3+ consecutive identical image+text sections.

---

## Components

**Show real product UI as the hero — never an abstract illustration or a `<div>`-mock.** For any tool whose value is legible in its own interface, the screenshot *is* the most persuasive image available and doubles as honest documentation. Render the actual app at high fidelity (or as crisp DOM chrome), lifted just off the page with a hairline border + whisper shadow, or — on dark — feathered into the background with a same-color glow so it reads embedded, not pasted. This is the corpus's most-repeated component move. — linear, vercel, clerk (literal `<SignIn/>` component), mintlify (`embedded-product-frame`, DOM not PNG), sentry (dark dashboards with `0 0 8px 6px` background-color feathering), warp & retool & resend & vanta & supabase (all lead with real UI). See patterns `embedded-product-frame`, `product-ui-on-tinted-panel`, `perspective-screenshot-field-hero`, `code-block-hero`, `os-shell-window-frame`.

**Borders over shadows. When you do use shadow, make it mean "this floats."** Default structure is hairlines + whitespace; box-shadow appears on only a handful of genuinely-floating elements (a demo card, a dropdown, a lifted product mock), so when it shows up it carries real meaning. Where shadow is used, make it ultra-diffuse and low-opacity (or a same-color glow), never the harsh Tailwind `shadow-lg`. — stripe (near-zero shadow; reserved for floats), supabase (depth = one hairline + one off-white surface), retool (the *one* big `0 68px 116px` shadow lifts the single focal card), linear (whisper `0 1.2px 0 rgba(0,0,0,0.03)`).

**One corner-radius system page-wide; crisp small radii for clean UI.** Pick a radius scale (commonly 4-12px for cards/controls, full-pill reserved for buttons in soft/expressive directions) and apply it consistently. `rounded-full` on large cards/containers reads off-register for minimalist/editorial product UI. — `../tokens/*.json` radius arrays cluster on 4/6/8/12px; round (`10px` everywhere), every (two radius tiers, one button shape).

**Monochrome the logo wall.** Desaturate trust/integration logos to one gray weight so the strip reads as a single texture, and so the eye still lands on the CTA above it rather than a clash of nine brand palettes. Logos only — no category/industry labels under them. — clerk, supabase (low-contrast grayscale strip), linear.

**On dark surfaces, signify status with low-alpha tint + colored text, never candy-colored fills.** Diffs, logs, table status, and validation read as green/red via ~7-18% alpha background washes with near-saturated text — unmistakable meaning without blocky rows. Keep the same green meaning "success" across both UI and code. — linear (`rgba(39,166,68,0.07)` add / `rgba(243,78,82,0.10)` delete), resend (12-18% washes, green doubles as code-string color), vanta (green lives only in the product mock's progress UI).

> Anti-pattern mirror (§6): Tailwind heavy shadows, generic 1px gray borders, `rounded-full` on large containers, shadcn in default state, hand-rolled SVG icons (use Phosphor/Tabler/Radix), neon/outer glows, logo walls with labels.

---

## Motion

**Motion communicates responsiveness and feedback, not spectacle.** In production UI, keep it subtle: snappy hovers/state changes (~100-300ms) and a slightly slower settle on entrance/reveal (~300-800ms). Every exemplar's motion intent is "responsiveness / the product is alive," never scroll-jacking, parallax, or pinned choreography (those belong to the `expressive` corpus, not here). — corpus-wide; durations cluster 100-300ms for hovers, the recurring easing is Material standard `cubic-bezier(0.4,0,0.2,1)` with a decisive ease-out (`cubic-bezier(0.25,1,0.5,1)`, `(0,0,0.2,1)`) for reveals.

**Use a real easing curve; stagger reveals; never animate layout.** Replace `linear`/`ease-in-out` and instant changes with a custom cubic-bezier for physical feel. Animate only `transform` and `opacity` (never `top/left/width/height`), stagger grouped entrances (`delay = index * ~80ms`), and drive scroll with `IntersectionObserver` or CSS scroll-driven animation — never a `scroll` listener. — stripe (`0.3s cubic-bezier(0.25,1,0.5,1)` hovers), warp (`cubic-bezier(0.16,1,0.3,1)` entrance), mintlify (snappy 100-300ms UI + one slow 700ms reveal system).

**Gate every non-trivial animation behind `prefers-reduced-motion`, and ship the resting state in the DOM.** Count-up odometers, gradient borders, marquees, aurora drift, and glow loops must all degrade — and the final value/static frame must exist without JS. — warp & mintlify (count-up stats gated; final value in DOM), arc (aurora drift as a 15-20s near-imperceptible loop, gated), resend (animated gradient-border badge gated), outerbloc (marquee pauses on hover/focus, never locks real info inside autoscroll).

> Anti-pattern mirror (§5): `window.addEventListener('scroll')`, animating `top/left/width/height`, heavy parallax/pinned/scrubbed choreography in product UI, `backdrop-blur` on scrolling containers, everything mounting at once, missing reduced-motion fallback, `h-screen` (use `min-h-[100dvh]`).

---

## Conversion & trust

**Prove value with concrete artifacts and real numbers, not adjectives.** Trust is built from live data and honest specifics — a running payments ticker, a `98%` deliverability card, count-up stats, named quotes, the real product doing its job — not from "seamless / next-gen / revolutionize" vapor or fake-perfect `99.99%` figures. — ramp (`inline-metric-pill`, "$400hrs saved", live ticker), warp (count-up active-developers / Fortune-500 row), mintlify (`inline-metric-chip`, mono-set live metrics). See patterns `inline-metric-pill`, `inline-metric-chip`.

**Make social proof read as a product *claim*: demote the attribution, promote the metric.** Invert the usual testimonial — set the customer name muted and the *outcome* in ink ("*Notion* powers millions of agent conversations daily") so the eye lands on the result. — vercel (`brand-quote-spec-block`), linear (`spotlight-quote-card`). Position competitively without boasting via a dim, equal-weight "Alternative to {incumbents}" logo row that lets visitors self-locate. — railway (`alternative-to-logo-row`).

**Protect one canonical CTA across every breakpoint; one CTA per intent.** Engineer the primary action so it never disappears — pinned in the header on desktop, full-width below the fold on mobile — and don't dilute it with duplicate-intent buttons ("Get in touch" + "Let's talk"). CTA text must clear AA contrast and never wrap to two lines at desktop. — warp ("Download Warp" pinned + keycap badge), arc (CTAs differentiated by fill/inversion, not a second color, so the action stays legible on a brand-color band).

> Anti-pattern mirror (§1): vague aspirational headlines, filler verbs, placeholder names, fake-perfect numbers, "quietly trusted by"; (§6) duplicate-intent CTAs, invisible button text, version/`BETA`/scroll-cue eyebrows, section-number eyebrows.

---

## Density

**High information density is fine — make it legible by holding the chrome disciplined, not by thinning the content.** The corpus pattern is a sparse, high-contrast marketing frame wrapped around genuinely dense embedded UI; the *contrast* is the point (sparse frame, rich proof). Density stays calm via: one type family + near-single weight, generous inter-section whitespace, a tight muted-gray ramp that lets secondary copy recede, and color rationed so only the accent is "loud." — linear, vercel ("low marketing-chrome density wrapped around high-density product shots"), retool, stripe.

**A repeated unit anatomy is the legibility mechanism for dense grids — learn the unit once, then sweep.** When dozens of cards/cells share one rigid recipe (media → title → meta, or icon → label → arrow), the eye parses the first and scans the rest. Consistency, not per-cell styling, is what lets ~16 items read in one pass. — every (one essay-card recipe across a magazine-dense homepage; hierarchy *inside* the card from typeface switch, not size), posthog (16-cell product grid legible via one outline + one weight + category-coded color), framer (3×3 grid, one cell anatomy).

**Density can also be carried by enclosure instead of air — but then commit to one border color and weight everywhere.** The inverse strategy: when whitespace isn't the separator, a single uniform hairline outline groups and separates everything, giving a packed page comic-panel coherence. This only works *because* the kit stays constrained (one family, one weight, one border, one accent) applied densely. — posthog (warm near-black outline is the most-used color on the page; it does the work elevation does elsewhere), every (one hairline `#3c3c3c`, packed cards / airy sections).

> Anti-pattern mirror (§2/§7): cramped sections vs. legible density is the line — the fix for "too dense" is rhythm + restraint, never a div-mock or a 3-card row; mid-page theme flips and mixed design systems break a dense page's coherence.

---

## App screens — dashboards, tables, forms, settings, sign-in

The rules above are drawn mostly from marketing pages. A screen someone *works in* — a dashboard, a data table, a settings page, a sign-in form, a checkout step — runs on different rules, and several of them invert the ones above. When the brief names an app job, these win. They come from the corpus's real app screens (`surface: app`), not from marketing pages that picture an app.

**The chrome is fixed; only the work scrolls.** A full-height rail, a top bar and an optional sticky per-object strip stay put around one scrolling content area, so the user never loses navigation or context. Inside the rail, zone vertically — primary nav, contextual list, utility links, account at the bottom — before reaching for a second bar. Make the work area the only scroll container; focus order stays sane and the area can hold a panel grid, a table or a form alike. — grafana-play (rail + command bar + sticky strip), catalyst (one 256px rail, four stacked jobs), shadcn-dashboard (collapsible rail). See patterns `dashboard-app-shell`, `collapsible-rail-app-shell`.

**Size panels to their container, not the window.** A content area next to a collapsible rail changes width without the window changing, so viewport breakpoints reflow at the wrong moment. Use container queries for the KPI row and card internals; the grid then reflows the instant the rail opens or closes, with no JS. — shadcn-dashboard (`@container/main`, numbers scale on the card's own width).

**Keep the type range small: about 2×, not 4-6×.** Here the marketing rule turns around. Body sits at 14px, the largest thing on screen (a KPI number or page title) at 24-30px, and hierarchy comes from weight, position and a muted/primary ink pair. A display jump on a dashboard shouts over the numbers it exists to show. — shadcn-dashboard (12/14/16 with 30px only on KPIs), catalyst (KPIs ~1.3× the page heading), grafana-play (28px max, 14/22 body), shadcn-login (one 24px/700 node, everything else 14-16).

**Two inks, or one ink at two or three alphas.** Every string is either primary or muted; there is no third grey and no colored body text. Deciding that per string is most of what keeps a dense screen calm. One foreground token at full, ~0.65 and ~0.3 alpha gives the same ladder on any surface without re-tuning a grey per background. — catalyst (zinc-950 / zinc-500), grafana-play (one text color at 1 / 0.65 / 0.3), shadcn-dashboard (foreground semibold values, muted labels).

**Separate with hairlines and tiny value steps; keep shadows for things that float.** Resting surfaces get one 1px border at low ink or a ~2% lightness step between chrome, content and wells. Drop shadows go to transient layers (menus, popovers, dialogs) and focus. Rule off stat strips and table rows with single hairlines instead of boxing every cell. — shadcn-dashboard (card shadow all-zero, three neutrals ~2% apart), catalyst (KPIs and rows divided by 5% rules), shadcn-login (resting elevation zero), grafana-play (one tight shadow step at most). See pattern `inset-app-panel`.

**Spend color on signal and the one action.** The chrome is neutral; saturated hue goes to data, status, the primary action and the current selection, and nowhere else. When the shell is grey, one green stat reads instantly. — grafana-play (saturation reserved for chart series), stripe-checkout (indigo only on the CTA and the selection ring), shadcn-login (no hue at all: near-black primary, outlined alternatives).

**Numbers align, and status stays quiet.** Set `tabular-nums` wherever numbers live, so columns align and live values don't jitter. Show a delta's direction with an arrow on a neutral or lightly tinted pill (low-alpha fill + saturated text of the same hue), and a row's status with a small dot + label, not a full-color chip. A table should never read as a traffic light. — shadcn-dashboard (tabular KPIs and cells, outline delta pills, dot status), catalyst (lime/pink washes at ~15-20% with -700 text). See patterns `kpi-stat-card-grid`, `kpi-stat-row`.

**A one-task screen is one framed object on a quiet ground.** Sign-in, a checkout step, an invite accept: delete the page chrome and center one bordered card. Pair a per-field secondary action with its field on the label row ("Forgot your password?" beside the Password label). Show selection additively — an accent ring and a tint, no layout shift or text recolor. Decoration (a media half of the card) drops away on mobile. — shadcn-login, stripe-checkout. See patterns `split-card-auth`, `plan-choice-card-pair`, `modal-scale-fade`.

**The focus ring is a first-class token.** On a shadowless, near-colorless screen the focus ring is the strongest visual event, which is right for keyboard-driven forms and tables. Give every control the same visible ring, never remove it, and make it the one place an accent or shadow is allowed at rest. — shadcn-login (one ~3px ring shared by every control), stripe-checkout (2px accent outline for focus and selection). See pattern `two-ring-focus`.

> Anti-pattern mirror (`anti-patterns.md`): a display-size H1 or a hero on an app screen, a card-and-shadow around every cell, red/green fills for every row, a serif on a dashboard, breakpoints that only fire when the window resizes.

---

## House defaults — the safe starting point

When the brief gives you no strong reason to deviate, start here. This is the consensus of all 20 exemplars; every choice has an escape hatch, but these are the defaults that *don't* read as slop.

- **Start from `/tokens`** (`../../tokens/tokens.json`) — adopt the house role scale (`bg / surface / fg / muted / subtle / border / accent`) rather than inventing one.
- **One accent, rationed.** A single saturated hue, spent only on the primary CTA, links, and live/interactive signals. Light accent → dark text.
- **Hierarchy from scale, in one weight band (≈400-500).** A 3-5x body→display jump; tighten tracking only at display sizes. Reach for a *second typeface* (serif or mono, by role) before you reach for a heavier weight.
- **Off-black + off-white, not pure `#000/#fff`.** Neutrals leaning toward the accent's temperature.
- **Hairline borders over shadows.** 1px low-opacity (light: `rgba(0,0,0,0.06)`; dark: 5-8% white) for structure; reserve diffuse low-opacity shadow for things that genuinely float.
- **8px rhythm.** Tight gaps inside components, large jumps (32→64→96px) between sections; let whitespace do the section dividing.
- **Real product UI over illustration.** Show the actual interface (screenshot or crisp DOM), lifted on a hairline or feathered into a dark field — never a `<div>`-mock, never a generic abstract graphic.
- **One section schema repeated, layout families varied.** Author the page; don't loop one image+text split.
- **Motion = feedback, gated.** Subtle hovers + staggered reveals on a real easing curve, `transform`/`opacity` only, behind `prefers-reduced-motion`.
- **Concrete proof.** Real numbers, named quotes, monochrome logo wall — no vapor copy, no fake-perfect stats, no em-dashes.

Then run the result against `../../.claude/skills/web-design-taste/references/anti-patterns.md` (the quick gate at the bottom is the lint short-list). Spend the page's *one or two* expressive moves deliberately — the rest stays disciplined. That discipline is the taste.
