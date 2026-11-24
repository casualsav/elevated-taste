# Components — Micro-Aesthetics

The details that separate premium from generic. Expressed in house tokens (`var(--token)`, from `tokens/tokens.json`). Component *craft*, not page sections (those live in `corpus/`).

**Cross-cutting laws**
- **Shape lock:** pick ONE radius system and hold it page-wide. Common rule: interactive = `var(--radius-full)` (pill), cards = `var(--radius-lg/xl)`, inputs = `var(--radius-md)` — but whatever you pick, apply everywhere. Round buttons in a square layout (or vice-versa) is broken.
- **Shadow law:** shadows only when elevation signals real hierarchy; otherwise separate with `var(--color-border)`, `divide-y`, or whitespace. Tint shadows toward the bg hue — never pure-black drop shadows on light surfaces. Use the token ramp `var(--shadow-sm | -md | -lg)`; reserve `-lg` for floating/modal layers.
- **No pure `#000`/`#fff`** for depth surfaces — the tokens already use off-black `--color-fg` / off-white `--color-bg`.
- **Light hairlines:** prefer `1px` `var(--color-border)` (or `rgba` at ~6–10%) over heavy gray borders. Generic `1px solid gray` everywhere is a cheap tell.
- **Concentric radii (Double-Bezel):** premium cards/inputs sit in a nested enclosure like a glass plate in an aluminum tray — outer shell with a hairline + small padding + large radius, inner core with its own bg + inner highlight + a **smaller** radius (`calc(outer − padding)`) so curves stay concentric.

---

## Buttons

| Aspect | Premium move (tokens) |
|---|---|
| Shape/size | `var(--radius-full)` pill, generous `padding: var(--space-3) var(--space-5)`. |
| Contrast (a11y, mandatory) | Text must pass WCAG AA on its own fill (4.5:1; 3:1 for ≥18px). White-on-white, transparent-over-photo with no scrim — all banned. Audit every CTA. |
| Primary | `background: var(--color-accent)`, `color: var(--color-accent-fg)`. |
| Hover | tint/elevate over `var(--duration-fast)` `var(--ease-standard)` — not an instant swap. |
| Press | `:active { transform: scale(0.98) }` — physical push, every button. |
| Trailing icon ("button-in-button") | An arrow never sits naked: nest it in its own circle (`var(--radius-full)`, subtle `--color-surface`/white-10 fill) flush to the right padding. On `group-hover` it translates diagonally + scales ~1.05 while the button presses — internal kinetic tension. |
| Ghost/secondary | needs a `var(--color-border)` stroke or scrim over imagery; never invisible. |
| Label hygiene | ≤3 words, **must not wrap** at desktop; one label per intent across the whole page (don't ship "Get started" + "Sign up free"). |
| Focus | see Focus States — visible ring, never `outline:none` alone. |

---

## Cards

- **Elevation earns its place.** Default to a hairline (`1px var(--color-border)`) + `var(--radius-lg)`; add `var(--shadow-md)` only when the card truly floats. Hover → `var(--shadow-lg)` + `translateY(-2px)`, `var(--duration-base)`.
- **Double-Bezel for hero/feature cards:** outer shell `padding: var(--space-2)`, hairline, `var(--radius-xl)`; inner core distinct `var(--color-surface)` bg, inner highlight `box-shadow: inset 0 1px 0 rgba(255,255,255,.12)`, radius `calc(var(--radius-xl) - var(--space-2))`.
- **Media inside cards:** image in an `overflow-hidden` frame, `scale(1.03)` on hover — image grows, card edge stays sharp.
- **Background variety:** in any multi-cell grid, ≥2–3 cells need real visual variation (image, tinted `--color-surface-2`, brand gradient). All-`--color-bg`-on-`--color-bg` cards with only text = boring default.
- **No cards-in-cards-in-cards.** Nesting beyond the deliberate two-layer bezel reads cluttered.

---

## Inputs & Forms

- **Label ABOVE the field** (never placeholder-as-label, ever). Block: label / input / helper / error, `gap: var(--space-2)`.
- **Resting:** `background: var(--color-surface)` (or bg), `1px var(--color-border)`, `var(--radius-md)`, `padding: var(--space-3)`, text `var(--color-fg)`.
- **Placeholder:** `var(--color-subtle)` — and still must pass AA against the field bg. Light-gray-on-near-white placeholders are banned.
- **Focus:** border → `var(--color-focus)` + ring (see below), `var(--duration-fast)` `var(--ease-standard)`.
- **States are mandatory, not just the happy path:**
  - Error → border/text `var(--color-danger)`, message **below** the field, ring tinted danger.
  - Success → `var(--color-success)` accent where confirmation matters.
  - Disabled → reduce opacity, `cursor: not-allowed`.
  - Loading → skeleton matching final shape (`--color-surface` block, shimmer), not a generic spinner.
- **Contrast audit (a11y):** inputs, placeholder, focus ring, helper, and error text all pass WCAG AA against the section bg.

---

## Navigation

- **Single line at desktop**, height ≤80px (default 64–72px). Two-line or 15%-of-viewport nav = broken. If items overflow at `lg`, condense/drop/hamburger.
- **Floating glass pill** option: detached from top (`var(--space-5)` margin), `var(--radius-full)`, `var(--color-surface)` + `backdrop-filter` blur, hairline border + inner highlight. Apply `backdrop-blur` only on fixed/sticky elements — never on scrolling content (GPU repaints).
- **Hamburger → X morph:** lines rotate/translate into a true `X` (`rotate-45`/`-rotate-45`), not a swap.
- **Reveal:** full-screen overlay with heavy blur/scrim; links **stagger-slide-up** (`translateY(12px)+opacity 0 → 0/1`, `delay` per item) over `var(--duration-slow)` `var(--ease-entrance)`.
- Active/hover link: animate an underline or color over `var(--duration-fast)`, not an instant jump.

---

## Focus States (a11y — mandatory, not optional)

- **Always visible.** `outline: none` *without* a replacement is an accessibility failure — keyboard users navigate by the focus ring.
- **House recipe:** `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }` (or `box-shadow: 0 0 0 3px` accent-at-low-alpha). Offset keeps the ring off the content edge.
- **`:focus-visible`, not `:focus`** — so mouse clicks don't flash a ring but keyboard/AT users always get one.
- Ring must clear AA contrast against **both** the component and the page bg; on busy/photographic backgrounds add a contrasting halo.
- Preserve focus order = DOM order; don't let `tabindex` or visual reordering break it.

---

## Eyebrows, Pills & Chips (restraint)

- **Eyebrow** (small uppercase wide-tracking label above a headline): `text-[11px] uppercase tracking-[var(--tracking-wide)]`, color `var(--color-muted)`. **Max 1 per 3 sections** — an eyebrow on every header is the most over-used AI tell. Often the headline alone is enough.
- **Status/metric pill:** `var(--radius-full)`, `padding: var(--space-1) var(--space-3)`, tinted `--color-surface`/accent bg. Use semantic color tokens for state (`--color-success`/`-warning`/`-danger`), not raw hex.
- Don't print category labels under logos or beside every chip — the mark is the signal.
