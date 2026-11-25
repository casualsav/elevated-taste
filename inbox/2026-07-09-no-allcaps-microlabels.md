# Owner rejected all-caps mono microlabels (dark studio-console storefront)

> Promoted: taste/owner.md (owner taste profile). This note keeps the full context.

**Context:** the owner's storefront + full customer journey (studio chat,
auth, download gate), rethemed Jul 9 2026 to the dark studio-console
direction. The technical-registration motif used monospace microlabels
(`text-transform:uppercase`, tracking .05-.1em) for eyebrows, section tags,
field labels, progress text — the treatment several corpus exemplars use.

**Result:** Owner rejected it on sight across pages: "I don't like the way
the all caps font looks… it doesn't look good in all caps." Shipped fix:
keep the mono voice, drop the uppercase transform everywhere, cut tracking
to .02em (wide tracking only earns its keep on caps). Typed IDs (EXT-0001)
stay caps. Owner saw sentence-case version; no further complaint.

**Why it failed (hypothesis):** at 11-12.5px, all-caps mono with wide
tracking reads as shouting and eats legibility on a dark ground; the
"technical" flavor survives entirely in the font choice + tracking, so caps
add noise without adding voice.

**Steal this:** microlabel voice = font + tracking, not case. Default mono
microlabels to sentence case; reserve caps for typed identifiers.

---

```css
/* before */
.label{font-family:var(--mono);font-size:12px;text-transform:uppercase;letter-spacing:.09em;color:var(--muted)}
/* after (shipped) */
.label{font-family:var(--mono);font-size:12px;letter-spacing:.02em;color:var(--muted)}
```

**Resolution (Jul 10):** owner chose ALL CAPS in Space Grotesk (the display face) from a 7-way board — refines the verdict: the failure was ui-monospace caps, not caps per se. Final rule: caps microlabels are fine in a designed display face; never in system mono; sentence case for mono.
