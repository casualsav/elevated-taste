# Design-brief template — delegating UI work to a sub-agent

The corpus raises the ceiling only for the agent that reads it. When UI work is
delegated, the executing agent (often a smaller model) usually never opens the
corpus — so the lead must compress its taste consultation into a brief the
worker can execute *without judgment*. A filled brief beats "read the skill and
build a nice page" every time: workers comply with concrete constraints and
verbatim payloads far more reliably than with long instruction chains.

Rules of use:

- **The lead fills every section.** An empty section is a decision silently
  delegated to the worker — the exact thing this template exists to prevent.
- **Copy is verbatim.** Customer-facing words are the lead's (or the owner's)
  judgment; the worker pastes, never paraphrases. Same for token values.
- **Constraints must be checkable.** "Feels premium" is not a constraint;
  "no box-shadow except X" and "AA on every declared color pair" are.
- **Design decisions live here, not in the worker's head.** If review keeps
  amending the same kind of miss, that kind of decision belongs in the brief.
- Pair the brief with the mechanical gate: the worker's last verification step
  is always `design-lint` on the *rendered* output (see §9 and the SKILL.md
  "Lint the output" note).

Copy everything below the line into the delegation prompt and fill it in.

---

## 1. Corpus + direction

- Corpus: `production` | `expressive` — one line on why.
- Direction: `minimalist` | `brutalist` | `soft` | `editorial` | `expressive`.
- Exemplars/patterns drawn from (names only, for the record): …
- **Spend map — the ONE expressive move on this page is:** … (name the single
  element that gets the accent/spectacle treatment, e.g. "the hero headline's
  two-tone split; everything else stays flat"). Workers distribute embellishment
  evenly unless told where the budget goes; this line is where you tell them.
  Every other section is explicitly NOT the expressive move.

## 2. Design tokens (verbatim — the only colors/sizes that may appear)

Tailwind project? State it here and hand the worker the generated preset
(`node <taste-repo>/tokens/build.mjs --tailwind` → `tokens/tailwind.preset.mjs`);
utilities must be token-named (`bg-surface`, `text-muted`) — default-palette
classes (`text-purple-500`) are a lint error.

```css
:root{
  --bg:…; --surface:…; --ink:…; --muted:…; --hair:…;
  --accent:…; /* the accent's ONE job: … */
  --r-…; /* radius regime */
}
```

State the accent's single job explicitly (e.g. "checkout CTAs and links,
nothing else"). If a value is missing here, the worker may not invent it —
they must ask.

## 3. Type system

- Display face + weight(s), sizes (clamp), tracking — per size band, from the
  ramp tokens (`--tracking-display` ≥48px · `--tracking-heading` · `--tracking-ui`
  · `--tracking-body`; the bigger the type, the tighter — never one constant
  everywhere) — and case rule (e.g. sentence case, never uppercase headings).
- Body face + weights, size/leading.
- Mono/machine voice: exactly which elements may use it.
- Hierarchy device (scale jump / family switch — per the corpus, never weight).

## 4. Hard constraints (numbered; violating any = rejected)

Always include the standing ones, then add project-specific gotchas:

1. Animation: `transform`/`opacity` only; every non-trivial animation gated
   behind `prefers-reduced-motion`; resting state ships in the DOM (page fully
   readable with JS disabled). No `window.addEventListener('scroll')`.
2. AA contrast (4.5:1) on every declared text/background pair — including
   "decorative" small labels that carry meaning (risk-reversal notes, captions).
3. Shadow budget: name the elements allowed a shadow (usually one or zero).
4. One radius regime, stated in §2 — no per-component improvisation.
5. Full-bleed sections: never `width:100vw` (scrollbar-width horizontal
   overflow); use a full-width parent or `overflow-x:clip`.
6. No `—`/`–` in visible copy. <!-- plus any house copy laws -->
7. Project gotchas: … (fail-open timers, test-pinned substrings, etc.)

## 5. Page structure (one block per section, in order)

For each section:

- **id/anchor**, layout family (asymmetric split / bento / ruled rows / band),
  and which side carries what.
- **Copy, verbatim** — headline, sub, CTA labels, notes. Placeholders (like a
  price) named explicitly.
- **Motion**, if any: trigger (in-view/hover/load), mechanism, PRM fallback.
- Assets by exact path; if another agent produces them in parallel, say
  "reference the paths, do not wait for the files".

## 6. Component regime

Buttons (shapes, sizes, hover behavior — hovers must not break contrast),
cards, hairline usage, form controls, a11y minimums (44px tap targets,
focus-visible).

## 7. Out of scope / do-not-touch

Files, routes, strings, and behaviors the worker must leave alone (frozen
backups, JS logic during a restyle, unrelated pages sharing the file).

## 8. Tests

Which existing tests pin this surface; which new assertions to add. Never
weaken a test to pass — report the conflict instead.

## 9. Verification (exact commands + expected results)

- Render the final page(s) and pipe through the lint:
  `<render command> | node <taste-repo>/tooling/design-lint.mjs --stdin --name page.html`
  → expected: 0 errors (state any accepted warns).
- Test suite command → expected count.
- Greps that must hold (banned substrings, required substrings, placeholder
  substitution).

## 10. Report format

What you built; deviations from this brief (each with one-line why); and a
**Concerns** list — anything you noticed but didn't fix. Concerns are the
lead's review agenda, so err on the side of listing them.
