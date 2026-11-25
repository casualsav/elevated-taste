# Redesign Audit — Audit-First Workflow

A repeatable, framework-neutral workflow for upgrading an **existing** UI to premium
quality. Redesign is not greenfield: misclassifying the mode is the single biggest
source of bad output. Audit before you touch anything, change the smallest thing that
moves the needle, and never break what already works.

**Cross-references** (relative to this file):
- Corpus exemplars & patterns — [`../../../../corpus/production/`](../../../../corpus/production/) and [`../../../../corpus/expressive/`](../../../../corpus/expressive/) (`exemplars/`, `patterns/`, `tokens/`).
- House tokens — [`../../../../tokens/tokens.json`](../../../../tokens/tokens.json), built to [`../../../../tokens/tokens.css`](../../../../tokens/tokens.css). Direction presets — [`../../../../tokens/presets/`](../../../../tokens/presets/).
- Tells & banned moves — [`anti-patterns.md`](anti-patterns.md) (sibling reference).

---

## Step 0 — Classify the mode (first action, before reading any CSS)

Pick one. If ambiguous, ask **once**: *"Preserve the existing brand, or start visually
from scratch?"*

| Mode | Trigger | Approach |
| --- | --- | --- |
| **Preserve** | Modernise without breaking the brand | Audit → extract brand tokens → evolve gradually (this doc) |
| **Overhaul** | New visual language, same content | Greenfield visuals; **preserve content + IA** |
| **Greenfield** | No site, or the brand itself is changing | Not this doc — build fresh from corpus + tokens |

Decision tree:
- IA, content, and SEO are sound → **targeted evolution** (Step 3 levers 1–4). ~70% of the value at ~40% of the risk.
- Visual debt is structural (broken IA, no design system, broken mobile) → **full redesign**, strict content preservation.
- Brand itself is changing → **greenfield**.

---

## Step 1 — Audit the existing UI (document before proposing changes)

### 1a. Scan the stack
Read the codebase first. Record framework, styling method (Tailwind v3 vs v4, vanilla
CSS, CSS-in-JS, etc.), and the dependency file. **Work with this stack — never migrate
frameworks or styling libraries as part of a redesign.**

### 1b. Capture the baseline (what to inspect)
- **Brand tokens** — primary/accent colors, type stack, logo treatment, radii, shadow style. Extract these *before* applying any house defaults.
- **Information architecture** — page tree, primary nav labels, route slugs, anchor IDs, key conversion paths.
- **Content blocks** — what exists, what's doing work, what's filler.
- **Patterns to preserve** — signature interactions, recognisable hero, copy voice, existing accessibility wins (focus states, alt text, keyboard nav, contrast).
- **SEO baseline** — ranking pages, meta titles, structured data, OG cards. **SEO migration is the #1 redesign risk.**
- **Dial reading** — infer the *current* level of visual variance, motion intensity, and visual density. This is your **starting point**, not the house baseline. Match a corpus lane to it: calmer/utilitarian → [`../../../../corpus/production/`](../../../../corpus/production/); bolder/editorial → [`../../../../corpus/expressive/`](../../../../corpus/expressive/).

### 1c. Spot the generic / AI-template tells
Walk the surface looking for fingerprints. The canonical, exhaustive list lives in
[`anti-patterns.md`](anti-patterns.md) — treat this as the fast triage pass:

- **Typography** — browser defaults or Inter everywhere; only 400/700 weights; headlines with no presence; body text running wider than ~65ch; Title Case on every header.
- **Color & surface** — the purple/blue "AI gradient"; pure `#000`/`#fff`; oversaturated accents; >1 accent color; mixed warm+cool grays; flat sections with zero texture or depth; a lone dark section dropped into a light page.
- **Layout** — everything centered and symmetrical; three equal feature cards; default left-sidebar dashboard; no max-width container; uniform border-radius; misaligned baselines across side-by-side cards.
- **Components** — border+shadow+white card by default; one filled + one ghost button only; pill "New/Beta" badges; accordion FAQ; 3-card carousel + dots; 3-tower pricing; modals for everything.
- **Icons** — Lucide/Feather exclusively; cliché metaphors (rocket = launch, shield = security); inconsistent stroke widths; missing favicon.
- **Content** — "John Doe", "Acme Corp", Lorem Ipsum; round fake numbers (`99.99%`, `$100.00`); "Elevate/Seamless/Unleash/Next-Gen" cliché copy; "Oops!" errors; exclamation marks in success messages.
- **Missing states & omissions** — no hover/active/focus/loading/empty/error states; dead `#` links; no active-nav indicator; no 404; no form validation; no legal links; no "back" path.

For each tell, note **where** it is and **whether it's brand-load-bearing** (a brand that
is *already* purple stays purple — that's identity, not slop).

---

## Step 2 — Prioritize fixes (impact vs effort)

Don't fix everything. Rank candidates and apply in impact order — biggest visual lift per
unit of risk first. Stop when the brief is satisfied.

```
        HIGH IMPACT
            │  [DO FIRST]            [PLAN / SCOPE]
            │  font swap             hero recomposition
            │  color cleanup         full block replacement
  low  ─────┼───────────────────────────────────────── high
  effort    │  hover/focus states   motion polish        effort
            │  spacing & rhythm      bespoke iconography
            │  [QUICK WINS]         [LATER / OPTIONAL]
        LOW IMPACT
```

**Default lever order (stop when brief is met):**
1. **Typography refresh** — biggest visual lift per unit of risk.
2. **Spacing & rhythm** — increase section padding; fix vertical rhythm; add a max-width container.
3. **Color recalibration** — desaturate, unify neutrals, keep the brand accent.
4. **Motion layer** — add dial-appropriate hover/active/focus + entrance micro-interactions to existing components.
5. **Hero & key-section recomposition** — restructure top-of-funnel using corpus patterns.
6. **Full block replacement** — only when a block is genuinely unsalvageable.

Sequence within a batch (max impact, min risk): font swap → color cleanup → hover/active
states → layout & spacing → swap generic components → add loading/empty/error states →
final typographic polish.

---

## Step 3 — Apply upgrades (corpus + tokens, working with the stack)

Improve what's there; don't rewrite from scratch. Keep each change reviewable and focused.
Retrieve before inventing: a real exemplar beats a guess.

### Where to pull from
- **Tokens first.** Map every value you touch to [`../../../../tokens/tokens.json`](../../../../tokens/tokens.json) (color, `text`/`weight`/`leading`/`tracking`, `space`, `radius`, `shadow`, `duration`/`ease`, `container`). If the brief names an aesthetic, load the matching preset from [`../../../../tokens/presets/`](../../../../tokens/presets/) instead of the seed defaults. In Preserve mode, override token values with the **extracted brand** values rather than the house ones.
- **Patterns & exemplars.** For recomposition (hero, feature rows, pricing, social proof, CTA, footer, nav), lift structure and motion specs from [`../../../../corpus/production/patterns/`](../../../../corpus/production/patterns/) / [`../../../../corpus/expressive/patterns/`](../../../../corpus/expressive/patterns/) and study real cases in the `exemplars/` siblings. Choose the lane that matches the dial reading from Step 1b.

### Translating the audit into fixes
- **Type** — swap to a font with character; introduce 500/600 for hierarchy; tighten tracking on display sizes (`tracking.tight`), cap body at ~65ch, use `text-wrap: balance`/`pretty`; tabular figures for data.
- **Color** — replace the AI gradient with a neutral base + one considered accent; keep saturation moderate; unify the gray family; tint shadows to the background hue.
- **Surface** — add subtle noise/grain or ambient/mesh gradients to flat sections; replace uniform radii with a varied scale; use elevation only where it communicates hierarchy.
- **Layout** — break symmetry; replace 3-equal-cards with zig-zag / asymmetric grid / masonry; add a max-width container; `min-height: 100dvh` over `100vh`; align shared baselines; bottom-pin card CTAs.
- **States & motion** — add hover/active/focus rings, smooth `200–300ms` transitions on `transform`/`opacity` only, skeleton loaders, composed empty states, inline (non-`alert`) errors. Match intensity to the dial; honor `prefers-reduced-motion`.
- **Content** — replace placeholder names/numbers/Lorem with realistic, specific copy; sentence case headers; confident, plain microcopy.
- **Code quality** — semantic HTML, relative units, real alt text, a z-index scale, verified imports, complete meta tags.

### Preservation rules (Preserve mode) — never change silently without approval
- URL structure / route slugs · primary nav labels · anchor IDs.
- Form field names and order (breaks analytics + autofill).
- Brand logo / wordmark · existing legal / consent / cookie copy.
- Don't change IA, don't rewrite copy voice, don't regress accessibility, don't rename
  elements that downstream analytics events depend on.

---

## Step 4 — Verify against anti-patterns

Before shipping, run the full checklist in [`anti-patterns.md`](anti-patterns.md) as the
last filter. **Not optional — run every box; if any fails, the redesign is not done.**

- [ ] Mode classified (Step 0); audit documented (Step 1).
- [ ] Every fix mapped to a token in [`../../../../tokens/tokens.json`](../../../../tokens/tokens.json) (or a `presets/` override); no orphan hardcoded values.
- [ ] Recomposed sections trace to a corpus pattern/exemplar in the lane matching the dial reading.
- [ ] No remaining tells from [`anti-patterns.md`](anti-patterns.md) — re-run the Step 1c triage.
- [ ] **Nothing in "never change silently"** was altered without explicit approval (slugs, nav labels, form fields, logo, legal copy).
- [ ] SEO preserved — meta titles, structured data, OG cards, ranking-page URLs intact.
- [ ] Accessibility held or improved — focus states, alt text, keyboard nav, contrast.
- [ ] Hover / active / focus / loading / empty / error states all present.
- [ ] Existing functionality still works; changes stayed within the existing stack.
- [ ] Changes are small, focused, and reviewable — evolution, not a silent rewrite.
