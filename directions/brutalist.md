# Direction: brutalist

> A **direction** (aesthetic-flavor preset on the direction axis), not a corpus. Compose with a corpus: `production` + `brutalist` = a raw, blueprint-style data UI; `expressive` + `brutalist` = a declassified-document brand site. Token overrides live in `tokens/presets/brutalist.json`.

## When to use it
- Data-heavy dashboards, technical/telemetry UIs, portfolios, or editorial sites that should read like declassified blueprints or industrial manuals.
- Brands wanting raw functionality and mechanical precision over polish.
- Pick **one** substrate per project — Swiss industrial print (light) **or** tactical terminal (dark). Never mix the two in one interface.

Avoid for friendly consumer/onboarding flows or anything that needs warmth and approachability.

## Stance

| Axis | Stance |
|---|---|
| **Type** | Typography *is* the structure. Neo-grotesque/heavy sans for macro headers at huge scale, exclusively uppercase, very tight (even negative) tracking, compressed leading. Monospace for all data/metadata/nav, small and fixed with generous tracking. |
| **Color** | Uncompromising and utilitarian. One substrate (matte paper light **or** deactivated-CRT dark — never pure `#000`), carbon/phosphor foreground, and a single hazard-red accent. No gradients, no translucency. |
| **Space** | Mathematically engineered. Strict CSS grid; visible compartmentalization with solid 1–2px borders and full-width rules. Bimodal density: tight monospace clusters vs vast negative space framing macro type. |
| **Radius** | Zero. Every corner exactly 90°. `border-radius` is rejected. |
| **Shadow** | None. Soft drop shadows are prohibited; depth comes from borders, rules, and hairline grid gaps. |
| **Motion** | Sparse and mechanical, not decorative. Optional analog-degradation texture (scanlines, halftone, grain) over springy choreography. |

## Do
- Commit to one substrate and one accent (hazard red); use red only for dividers, strike-throughs, or vital data.
- Build on a strict grid with visible borders/rules and `gap:1px` hairlines.
- Push extreme scale contrast: viewport-bleeding macro type beside small monospace telemetry.
- Use semantic technical tags and ASCII/registration symbols as structural marks.

## Don't
- No rounded corners anywhere; no soft shadows, gradients, or glass.
- No mixing light and dark substrates; no second accent color.
- No mixed-case macro headers; no airy consumer padding in place of grid compartments.
- No purely-digital flatness — engineer in physical texture instead.

## Corpus exemplars
- **expressive:** `adoratorio`, `corentinbernadou`, `basement`, `doronsupply`, `obys`, `tikhon` — raw grids, oversized type, utilitarian palettes, and analog-degradation texture.
- **production:** none currently tagged; apply the stance to telemetry/blueprint-style product UI when needed.
