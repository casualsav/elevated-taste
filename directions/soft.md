# Direction: soft

> A **direction** (aesthetic-flavor preset on the direction axis), not a corpus. Compose with a corpus: `production` + `soft` = an approachable, premium consumer/health/portfolio UI; `expressive` + `soft` = a warm, friendly brand experience. Token overrides live in `tokens/presets/soft.json`.

## When to use it
- Consumer, health, fintech-friendly, portfolio, or marketing surfaces that should feel expensive *and* approachable.
- Brands wanting warmth, calm, and tactile depth — "soft structuralism": airy, floating components with diffused light.
- A friendlier alternative to `minimalist` when pure restraint reads as cold.

Avoid for dense data tooling or anything that needs hard, mechanical rigor — use `brutalist`; avoid when stark editorial restraint is the goal — use `minimalist`.

## Stance

| Axis | Stance |
|---|---|
| **Type** | Big, friendly grotesk display with a rounded feel; comfortable body sizes and relaxed leading. Eyebrow tags in small, wide-tracked uppercase. Headings can stay bold but warm, not severe. |
| **Color** | Gentle and warm. Soft off-white/cream canvas, softened (not pitch-black) ink, low-contrast tinted surfaces, a calmer accent. No harsh pure-black-on-white. |
| **Space** | Heavy macro-whitespace; the layout breathes. Generous component padding; floating "island" cards rather than tightly compartmentalized grids. |
| **Radius** | Large and squircle-ish — generous `xl`+ radii on cards/containers; pills welcome for buttons and badges. |
| **Shadow** | Soft and highly diffused ambient shadows (large blur, low opacity, subtle lift) — the signature of the flavor. Inner highlights for nested/double-bezel depth. |
| **Motion** | Fluid, springy, mass-feeling. Custom cubic-bezier transitions, gentle fade-up + slight blur on scroll entry, magnetic/scale hover. `transform`/`opacity` only. |

## Do
- Use large radii and soft diffused shadows to make components feel like they float.
- Keep the palette warm and low-contrast; soften ink off pure black.
- Lean on macro-whitespace and big friendly display type with eyebrow tags.
- Apply nested (double-bezel) enclosures with inner highlights for tactile depth.

## Don't
- No hard 90° corners or razor-thin compartment grids (that's `brutalist`).
- No harsh dark drop shadows or generic 1px gray borders as the main structure.
- No clinical pure-white + pure-black severity (that drifts toward cold `minimalist`).
- No `linear`/`ease-in-out` or instant state changes — motion must have spring.

## Corpus exemplars
- **production:** `posthog`, `supabase`, `stripe`, `sentry`, `teak`, `vanta` — warm palettes, rounded friendly type, soft ambient depth on premium product surfaces.
- **expressive:** `cubiflow` — soft, rounded, gently-colored brand experience.
