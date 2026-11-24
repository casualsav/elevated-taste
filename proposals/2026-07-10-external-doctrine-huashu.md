# External doctrine candidates — 2026-07-10 (huashu-design + expo-native-ui review)

Source: github.com/alchaincyf/huashu-design (reviewed on owner request during the
consumption-side upgrade). Two transferable protocols worth folding into our doctrine,
rewritten for this repo's vocabulary — not copied text. **Never auto-applied**; fold by
hand into the named targets and delete this file.

## 1. Color-derivation protocol (target: `corpus/*/principles.md` + build-sheet doctrine)

Colors are never picked from model priors or copied from a donor palette verbatim.
Three steps, in order:

1. **Sample** the dominant hue from one of three sources, in preference order:
   the client's brand assets (logo / existing VI), the content's real imagery
   (product shots, photography), or the subject's cultural color memory
   (e.g. imperial vermilion vs cola red — same hue, different gray-load, different world).
2. **Converge** in oklch: 2–3 chromatic colors max + ONE neutral written as a lightness
   ramp (e.g. L 0.15 / 0.35 / 0.65 / 0.92 / 0.98). Chromatic pairs need hue separation
   ≥60° or lightness separation ≥0.3. Chroma discipline: large surfaces 0.01–0.04,
   brand/accent 0.08–0.15, small punch elements 0.15–0.22; full-bleed >0.25 only for
   deliberately "screen-native" styles. Low chroma reads premium because print trained
   the eye — borrowed physics, not fashion.
3. **Justify** in one sentence, written into the build sheet or delivery note
   ("primary sampled from the logo's ochre, chroma pressed to 0.08 for an ink feel").
   **Cannot write the sentence ⇒ copying a formula, not deriving a palette.**

Donor palettes from the corpus remain the *structural* anchor (role architecture,
lightness relationships) — the hues come from the client's world.

## 2. Concept-zero review veto (target: `.claude/agents/design-critic.md` — being wired
in by the enforcement worker; this entry records the doctrine + provenance for principles.md)

Execution is an amplifier; polishing an empty concept only makes it emptier. Before any
craft dimension is scored, the review asks: **does this build contain one idea derived
from THIS client's content?**

- The reviewer must state the idea in one sentence, or the dimension fails.
- **Swap test:** replace the client name/product — if the design still "works"
  unchanged, it is a template. Fail.
- **Cover test:** mask all copy — is the subject still guessable from form alone?
  (Typography-led builds instead ask: does the type treatment itself carry the subject?)
- A failed concept caps the overall verdict at REVISE regardless of execution scores.

## 3. (Micro, from expo-native-ui) Continuous corner curvature (target: `references/components.md`)

From github.com/expo/skills `expo-native-ui` (MIT): iOS ships `borderCurve: 'continuous'` —
squircle corners whose curvature eases into the edges instead of a constant-radius arc. The
premium feel of Apple-hardware corners is this curve, not the radius value. Web transfer:
`corner-shape: squircle` where supported, SVG `clip-path` mask as fallback; worth reaching for
on large rounded surfaces (cards ≥16px radius, modals, hero media) where the constant-radius
arc reads subtly "webby." The rest of that skill is Expo/React-Native stack mechanics — good,
but a different medium; install it in Expo projects rather than folding it into this corpus.

## 4. (Smaller) Bold-bias counterweight (target: `references/anti-patterns.md` note)

Model priors skew quiet-minimal; "beige + whitespace + one accent" is the most common
failure mode across three generated directions, not a taste. When the brief doesn't ask
for quiet, at least one layer of the mix must pull from a bold direction (brutalist /
expressive). The build-sheet engine now enforces this mechanically; principles.md should
name WHY so humans reviewing output know it's deliberate.
