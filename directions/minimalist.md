# Direction: minimalist

> A **direction** (aesthetic-flavor preset on the direction axis), not a corpus. Compose it with either corpus: `production` + `minimalist` = a calm, document-style SaaS UI; `expressive` + `minimalist` = a restrained, type-and-space award site. Token overrides live in `tokens/presets/minimalist.json`.

## When to use it
- Editorial / document-style product UI where content is the hero (docs, dashboards, reading surfaces, settings).
- Brands that want to read as *premium through restraint* — warmth and typography instead of color and chrome.
- Default flavor for most real software when no louder direction is requested.

Avoid when the brief asks for spectacle, energy, or playful warmth — reach for `expressive` or `soft` instead.

## Stance

| Axis | Stance |
|---|---|
| **Type** | Extreme typographic contrast carries the design. Large, tightly-tracked headings (optionally an editorial serif for display); calm sans body. Never absolute black on white — off-black/charcoal text. Generous body line-height. |
| **Color** | Color is scarce. Warm-neutral / bone canvas, near-black ink, hairline borders. Accent desaturated and used only for semantic meaning or tiny spots (tags, inline code). No primary-colored hero sections. |
| **Space** | Macro-whitespace first. Big vertical rhythm between sections; narrow measure for prose. Let emptiness do the work. |
| **Radius** | Crisp and small — `4–12px` max. No pill-shaped large containers or buttons. |
| **Shadow** | Practically non-existent — ultra-diffuse, very low opacity (<0.05). Lift via a barely-there shadow shift, never a drop shadow. |
| **Motion** | Invisible-but-present. Gentle fade + small `translateY` on scroll entry; subtle hover lift; staggered reveals. `transform`/`opacity` only. |

## Do
- Lead with whitespace and a tight type hierarchy; constrain prose to a narrow measure.
- Keep every divider/border a single hairline; keep surfaces nearly flat.
- Reserve accent color for semantics and tiny accents (badges, links, inline code).
- Use warm off-white canvas over pure clinical white when warmth is wanted.

## Don't
- No gradients, neon, glassmorphism (beyond a subtle nav blur), or 3D.
- No heavy drop shadows; no `rounded-full` large containers/buttons.
- No primary-colored hero backgrounds; no absolute black body text.
- No generic SaaS chrome, no filler — every element earns its place.

## Corpus exemplars
- **production:** `clerk`, `linear`, `mintlify`, `resend`, `ramp`, `framer`, `outerbloc` — calm, type-led product surfaces with hairline structure.
- **expressive:** `aristide`, `phantom`, `northkingdom`, `lusion` — spectacle sites that win through restraint, space, and typography rather than ornament.
