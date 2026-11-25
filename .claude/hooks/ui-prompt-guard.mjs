#!/usr/bin/env node
/**
 * UserPromptSubmit hook — Phase 2 guardrail #1.
 *
 * On a UI/frontend-related prompt, deterministically inject the repo taste rules + a reminder
 * to load the web-design-taste skill. CLAUDE.md already encodes these; the hook makes them
 * fire reliably (hooks gate outcomes — they can't force skill selection, but they can put the
 * rules in front of the model every time). Non-UI prompts → silent, zero overhead.
 *
 * Phase 3: the rules now name the per-layer donor discipline (palette/type/motion/layout/
 * imagery — motion explicitly, since it's the layer that most often gets silently dropped)
 * and, when history exists, fold in HARD constraints (not a soft nudge) read from
 * recent-donors.mjs: every donor used in the last 6 builds is banned, and every layout
 * archetype used in the last 5 is off-limits — so the corpus's breadth actually gets sampled
 * instead of the same 2-3 exemplars/archetypes winning every build. This is the enforcement
 * point that has to work regardless of which model is driving — it fires as injected context,
 * not as a hope that the model remembers.
 *
 * Never blocks (injects context, exit 0). Fail-open on any error.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { pluginHookShadowed, tasteRepo } from './lib/taste-repo.mjs';

// Installed both as a plugin and in this project (or globally)? Only the non-plugin copy runs.
if (pluginHookShadowed('ui-prompt-guard.mjs')) process.exit(0);

const HERE = dirname(fileURLToPath(import.meta.url));
const exit0 = () => process.exit(0);

// strong frontend signals — any one fires the guard
const STRONG = /\b(css|scss|sass|less|html|jsx|tsx|svelte|vue|astro|tailwind|front-?end|stylesheet|styling|restyle|nav ?bar|hero|landing\s*page|home\s*page|dashboard|web\s*page|web ?site|web app|ui|ux|component|responsive|favicon|design system|dark mode|light mode|modal|dropdown|tooltip|hero section)\b/i;
// "make it look good"-class polish requests
const POLISH = /\b(make (it|this|the [\w-]+) look|look (good|nicer|better|professional|polished|modern|premium|clean|sleek)|polished|premium|on-brand|aesthetics?|visually|prettier|more beautiful|good[- ]looking)\b/i;
// ambiguous words that only count alongside a web context (avoids "design the DB schema")
const AMBIG = /\b(designs?|redesigns?|style|theme|layout|typography|colou?r\s*(palette|scheme)|fonts?|spacing|buttons?|forms?|cards?|pricing|footer|header|sections?|page|brand)\b/i;
const WEBCTX = /\b(web|site|page|app|screen|ui|ux|css|html|jsx|tsx|front-?end|component|react|next(\.?js)?|vue|svelte|tailwind|browser|responsive|landing|marketing|dashboard|portfolio|blog|stylesheet)\b/i;
// MECHANICAL — the prompt names a web thing, but the correct result is already known and no
// visual design decision is on the table (a mis-sized input, a dead handler). Same axis as the
// skill's own trigger: decide-how-it-looks vs. make-it-right. Overridable by DESIGN below.
const MECHANICAL = /\b(wrong (size|width|height|colou?r|place|position)|too (big|small|wide|narrow|tall|short)|resiz(e|ed|ing)|mis-?align(ed|ment)?|overflow(ing|s|ed)?|off-?cent(er|re)|cut off|clipped|click handler|event handler|onclick|typos?|broken link|does(n't| not) (work|fire|submit|render)|stack trace)\b/i;
// META — work ON the taste machinery itself (this hook, the skill frontmatter, the plugin
// wiring). Text work that merely quotes UI vocabulary; a design prompt never uses these words.
// NOT overridable: such a prompt routinely QUOTES design requests ("must fire on 'redesign a
// page'"), and a DESIGN override would let the quote re-trip the guard it is describing.
const META = /(\bfrontmatter\b|\bwhen_to_use\b|SKILL\.md|CLAUDE\.md|plugin\.json|marketplace\.json|\bplugin manifest\b|prompt-?guard|stop-?gate|post-write-lint|design-lint|hooks?\.mjs|\btrigger (rule|wording|text)\b|\bover-?fir(e|es|ing)\b)/i;
// explicit design intent overrides MECHANICAL — "redesign the hero, it overflows" still fires.
// POLISH counts as design intent too, so a fix that also asks for taste ("resize it, and make
// the form look premium") is not swallowed by the veto.
const DESIGN = /\b(re-?design|re-?style|re-?skin|re-?theme|new (page|landing|screen|section|component|site|layout)|design system|colou?r\s*(palette|scheme)|visual (overhaul|refresh|identity)|from scratch|greenfield|art direction)\b/i;

function isUi(p) {
  if (!p) return false;
  if (META.test(p)) return false;
  if (MECHANICAL.test(p) && !DESIGN.test(p) && !POLISH.test(p)) return false;
  if (STRONG.test(p) || POLISH.test(p)) return true;
  if (AMBIG.test(p) && WEBCTX.test(p)) return true;
  return false;
}

const BASE_RULES = [
  '[Web Design Taste — repo guardrail] This looks like UI/frontend work. Before writing any HTML/CSS/JSX/markup or styles:',
  '• Load the `web-design-taste` skill and consult the corpus — do not invent from defaults.',
  '• Default to the `production` corpus; use `expressive` only for marketing/landing/brand work, and flag any spectacle technique that may hurt usability, performance, or accessibility.',
  '• Pick a DONOR EXEMPLAR PER LAYER — palette, type, motion, layout/section patterns, imagery — not one exemplar for everything. Reuse a donor across at most 2 layers; past that you are wholesale-cloning it, the exact thing this corpus exists to prevent.',
  '• Motion is a mandatory layer, not an optional one — it is the layer most often silently dropped. Check the shortlisted exemplars\' `motion` field and `references/motion-key.md` before deciding a build needs none; zero motion is a legitimate call but it must be a stated decision, not an omission.',
  '• Lock the mix: `node <taste-repo>/tooling/build-sheet.mjs --brief "<brief>" --out <project-dir>` is the default way to pick — it derives the donor pairing + layout archetype and writes `taste.lock.json` deterministically. For manual control, `exemplar-preset.mjs --name <slug> --layout <archetype> --layout-donor <slug> --out <project-dir> <donor1>:<fields> ...` writes the same lock by hand. The Stop-gate reads it to confirm ≥2 distinct donors, motion coverage, and a layout archetype (or explicit waivers) before letting you finish.',
  '• Never ship the generic template (oversized hero + vague headline + three feature cards + soft gradient + fake dashboard). Pull a specific, named exemplar or pattern instead.',
  '• Use tokens from /tokens — no hard-coded magic numbers for color, space, or type. A post-write design-lint and a Stop-gate enforce this.',
  '• State which exemplar(s) / principles you drew from.',
];

/** Best-effort, fail-open: a resolution or read failure just means an empty history — never blocks. */
async function recentHistory() {
  try {
    const projectRepo = process.env.CLAUDE_PROJECT_DIR || resolve(HERE, '..', '..');
    const repo = tasteRepo(projectRepo).path;
    const mod = join(repo, 'tooling', 'recent-donors.mjs');
    const m = await import(pathToFileURL(mod).href);
    return m.readRecent();
  } catch {
    return [];
  }
}

/**
 * The owner's own rules (taste/owner.md), as one-liners. They win over corpus defaults inside
 * their scope, so they go in front of the model on every UI prompt. Fail-open: no file, no lines.
 */
function ownerRuleLines(md) {
  const rules = [];
  let inRules = false;
  for (const line of String(md || '').split('\n')) {
    if (/^##\s+/.test(line)) { inRules = /^##\s+Rules\b/i.test(line); continue; }
    const m = inRules && line.match(/^- \*\*(.+?)\*\*/);
    if (m) rules.push(m[1]);
  }
  if (!rules.length) return [];
  return [
    "• OWNER RULES (taste/owner.md) — the owner's own verdicts; they override corpus defaults inside their scope (read the file for scope), and say when you apply one:",
    ...rules.map((r, i) => `  ${i + 1}. ${r}`),
  ];
}

function ownerRules() {
  try {
    const projectRepo = process.env.CLAUDE_PROJECT_DIR || resolve(HERE, '..', '..');
    const repo = tasteRepo(projectRepo).path;
    return ownerRuleLines(readFileSync(join(repo, 'taste', 'owner.md'), 'utf8'));
  } catch {
    return [];
  }
}

const donorSlugs = (row) => (row.donors || []).map((d) => String(d).split(':')[0]);

/**
 * Hard constraints (not a nudge) built from the shared cross-project donor log: every donor
 * used in the last 6 builds is BANNED this build, and every layout archetype used in the last
 * 5 is off-limits (split-hero doubly so). Old entries with no `layout` field are just skipped.
 */
function hardConstraintLines(rows) {
  if (!rows.length) return [];
  const lines = [];
  const banned = [...new Set(rows.slice(-6).flatMap(donorSlugs))];
  if (banned.length) {
    lines.push(`• BANNED donors for this build (hard rule): ${banned.join(', ')} — choose different donors; the corpus has >100 exemplars.`);
  }
  const archetypes = [...new Set(rows.slice(-5).map((r) => r.layout).filter(Boolean))];
  if (archetypes.length) {
    lines.push(`• Recently used layout archetypes (hard rule) — pick a different one: ${archetypes.join(', ')}. split-hero is only eligible if it does not appear in this list.`);
  }
  return lines;
}

async function main() {
  if (process.env.TASTE_GATE === 'off') return exit0();
  let input = {};
  try { input = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { return exit0(); }
  if (!isUi(input.prompt || '')) return exit0();
  const rows = await recentHistory();
  const rules = [...BASE_RULES, ...ownerRules(), ...hardConstraintLines(rows)];
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: rules.join('\n') },
  }));
  exit0();
}

main();
