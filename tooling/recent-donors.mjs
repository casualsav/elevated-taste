/**
 * recent-donors.mjs — cross-project, cross-session memory of which exemplars recently
 * donated which layers, so the corpus's breadth actually gets sampled instead of the same
 * 2-3 "best fit by tag match" exemplars winning every build.
 *
 * Deliberately stored OUTSIDE any installer-managed path: `tooling/install.mjs --global`
 * vendors the skill into ~/.claude/skills/web-design-taste/ and re-copies it on every rerun,
 * which would silently wipe a log kept there. ~/.claude/taste-state/ is untouched by both
 * the plugin installer and tooling/install.mjs.
 *
 * Written by exemplar-preset.mjs (--out mode, the same call that writes taste.lock.json —
 * no separate step for a session to forget). Read by ui-prompt-guard.mjs to fold an
 * overuse nudge into the injected reminder, so the nudge fires on every UI prompt
 * regardless of which model is driving.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';

const CAP = 20;
const STATE_DIR = join(homedir(), '.claude', 'taste-state');
const STATE_PATH = join(STATE_DIR, 'recent-donors.json');

export function recentDonorsPath() {
  return STATE_PATH;
}

/** Fail-open: a missing/corrupt log reads as empty history, never an error. */
export function readRecent() {
  try {
    const rows = JSON.parse(readFileSync(STATE_PATH, 'utf8'));
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

/**
 * entry: { project, donors, patterns, layout? }. `donors` is the raw exemplar-preset.mjs
 * source spec list (e.g. ["ramp:color,radius", "linear:motion"]) — slugs are parsed out for
 * the overuse tally, the fields string is kept for context. `layout` (when set by
 * exemplar-preset.mjs --layout) is the chosen archetype slug — build-sheet.mjs reads it back
 * to keep archetype rotation, not just donor rotation, under recency pressure.
 */
export function appendRecent(entry) {
  const rows = readRecent();
  rows.push({ date: new Date().toISOString().slice(0, 10), ...entry });
  const capped = rows.slice(-CAP);
  try {
    mkdirSync(dirname(STATE_PATH), { recursive: true });
    writeFileSync(STATE_PATH, JSON.stringify(capped, null, 2) + '\n');
  } catch { /* best-effort — never block a build over a memory-log write failure */ }
  return capped;
}

function donorSlugs(donors) {
  return (donors || []).map((d) => String(d).split(':')[0]);
}

/**
 * One short line naming donors that show up in at least `minCount` of the last `window`
 * builds — a nudge, not a rule. Returns '' when nothing is overrepresented (small history,
 * or genuinely varied history) so the caller can skip the line entirely.
 */
export function overuseNudge(rows = readRecent(), { window = 10, minCount = 3 } = {}) {
  const recent = rows.slice(-window);
  if (recent.length < minCount) return '';
  const counts = new Map();
  for (const row of recent) {
    for (const slug of new Set(donorSlugs(row.donors))) {
      counts.set(slug, (counts.get(slug) || 0) + 1);
    }
  }
  const overused = [...counts.entries()]
    .filter(([, n]) => n >= minCount)
    .sort((a, b) => b[1] - a[1])
    .map(([slug, n]) => `${slug} (${n}/${recent.length})`);
  if (!overused.length) return '';
  return `Recent builds leaned on ${overused.join(', ')} — favor different donors this time unless the brief genuinely calls for the same look.`;
}
