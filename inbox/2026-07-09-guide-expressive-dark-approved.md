# Guide expressive-dark rebuild — approved same day the quiet-editorial pass was rejected

> Promoted: taste/owner.md (owner taste profile). This note keeps the full context.

**Context:** suchag.com/guide (owner's personal Cloud Server Guide), 2026-07-09. Owner is
exploring his own style by regenerating this page against the corpus. Audience: technical
readers following a setup guide. Goal: "stand out as a modern guide that says: the owner
of this page is on the cutting edge."

**Result:** Approved and shipped to live ("Approved"; earlier: "I like everything, but
let's change the font"). Nine preview iterations in one session, each delivered as a
self-contained HTML file over Telegram. The same page redesigned the same day in the
production/editorial lane (worksinprogress donor: serif + hairlines + warm cream) was
reverted within minutes ("I liked it better before").

**Why it worked (hypothesis):** The owner's stated taste for his personal pages is
spectacle-forward, not print-restraint: dark ground, one strong generative figure (dithered
starburst, fixed, difference-blend), motion everywhere but gated (entrance stagger,
scrollspy rail, marquee, glass), and a modern-tech type voice (one grotesk at display scale
+ mono machine voice). "Premium-luxury" cues (didone italic) were explicitly rejected;
"modern-tech" (Space Grotesk caps, tracking ramp) accepted. Physics detail that mattered:
dark translucent panels only read "black glass" when the ground behind them is also dark —
over a light field they composite to gray and were rejected as "more gray than black."

**Steal this:** For this owner's personal-brand pages, default to expressive-dark: one
grotesk + mono, black glass panels on a dark ground, a single fixed generative figure the
page scrolls over, motion on everything but reduced-motion-gated. Iterate via self-contained
HTML previews, never straight to live.

Related but not filed there: funnel-cro-taste (the guide has no conversion goal; pure content).

---

**Artifact:** live at https://suchag.com/guide/ (source: `~/sites/suchag.com/guide/index.html`;
rejected editorial version preserved at `index.html.bak-20260709`).

Donor lock (`taste.lock.json`): `basement:type` (grotesk display, tracking ramps with size) ·
`urbit:space` (sticky scrollspy rail + narrow column) · `machine-consciousness:color,motion`
(monochrome ink, bracket labels, serial marquee, assembling reveals, starburst) ·
`thepudding:radius,shadow` (boxless → glass panels carry the only chrome).

Token system as shipped:

```css
--color-ground:#262626;          /* page ground (dark register) */
--color-fg:#1e1e1e;              /* bookends + terminal blocks */
--color-fg-on-dark:#f0f1f1;
--color-muted-on-dark:rgba(240,241,241,0.60);
--color-border-on-dark:rgba(240,241,241,0.16);
--color-focus:#2e6ef2;           /* rationed accent: active state, links, prompt ticks */
--color-focus-bright:#7aa5ff;    /* link hover on dark glass */
--glass-fill:rgba(0,0,0,0.4);    /* panels darker than ground = "black glass" */
--glass-edge:rgba(240,241,241,0.16);
--glass-blur:10px;
--font-display/--font-sans:'Space Grotesk';  /* one grotesk, scale-driven hierarchy */
--font-mono:'Space Mono';                     /* all machine voice */
--ease-standard:cubic-bezier(0.16,1,0.3,1);   /* one signature curve */
```
