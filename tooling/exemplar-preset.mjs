#!/usr/bin/env node
/**
 * exemplar-preset.mjs — compose a buildable tokens PRESET from exemplar token snapshots.
 * The thesis feature: "Ramp's palette + Linear's motion" as one command, not a manual
 * transcription job.
 *
 *   node tooling/exemplar-preset.mjs --name ramp-mix ramp:color,radius linear:motion
 *   node tokens/build.mjs --preset=ramp-mix        # -> tokens/tokens.css
 *
 *   # cross-repo: write the preset + BUILT css + theme lock into a consuming project
 *   node tooling/exemplar-preset.mjs --name ramp-mix --out /path/to/app ramp:color linear:motion
 *   #   -> <app>/taste.preset.json, <app>/taste.tokens.css, <app>/taste.lock.json
 *   # taste.lock.json records the donors so later sessions REUSE the same theme instead of
 *   # remixing (read by /compose before it picks donors).
 *
 *   # record the engine's layout pick alongside the token donors (--out mode only, since
 *   # that's the only mode that writes a lock file):
 *   node tooling/exemplar-preset.mjs --name ramp-mix --out /path/to/app --layout app-shell \
 *     --layout-donor linear ramp:color linear:motion   # -> lock.layout = {archetype, donor}
 *
 * Each source is <slug>[:<fields>] where fields ⊆ color,type,space,radius,shadow,motion
 * (default: all). Later sources override earlier ones on overlapping fields. Snapshots are
 * found in corpus/{production,expressive}/tokens/<slug>.json.
 *
 * Mapping (snapshot → DTCG preset that tokens/build.mjs deep-merges over the base):
 *  - color: top-level house-named keys (bg/surface/surface-2/fg/muted/subtle/border/accent/
 *    accent-fg) + any `roles` entries whose key matches a house color token. Exemplar-specific
 *    roles (e.g. spotlight-chartreuse) are skipped and listed — they belong in pattern knobs.
 *  - type: first non-mono family → font.sans, mono-looking family → font.mono; weights map to
 *    the nearest of regular/medium/semibold/bold; leading min→tight, max→normal.
 *    text scale: each house step (xs…display) takes the nearest snapshot size within 20%.
 *  - space: each house step (1…10) takes the nearest snapshot value within 25%.
 *  - radius: nearest onto sm/md/lg/xl; 9999px/50% → full.
 *  - shadow: entries (minus "none") in order → sm/md/lg.
 *  - motion: duration.fast = min, duration.slow = max, duration.base = median;
 *    ease.standard = first easing (entrance/exit keep the house curves).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { appendRecent } from './recent-donors.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIELDS = ['color', 'type', 'space', 'radius', 'shadow', 'motion'];
const HOUSE = JSON.parse(readFileSync(join(ROOT, 'tokens/tokens.json'), 'utf8'));

const toPx = (v) => {
  const m = String(v).trim().match(/^(-?\d*\.?\d+)(rem|px)$/);
  return m ? (m[2] === 'rem' ? parseFloat(m[1]) * 16 : parseFloat(m[1])) : null;
};
const token = (value, type) => ({ $value: String(value), $type: type });

function findSnapshot(slug) {
  for (const corpus of ['production', 'expressive']) {
    const p = join(ROOT, 'corpus', corpus, 'tokens', `${slug}.json`);
    if (existsSync(p)) return { corpus, snap: JSON.parse(readFileSync(p, 'utf8')) };
  }
  return null;
}

/** For each house step name, adopt the nearest snapshot value within `tol` relative distance.
 *  A second pass keeps the scale strictly increasing — two adjacent steps never collapse
 *  onto the same snapshot value (drop the override rather than flatten the scale). */
function nearestOntoScale(houseGroup, snapValues, tol, type) {
  const out = {};
  const values = (snapValues || []).map(toPx).filter((v) => v != null && v > 0);
  if (!values.length) return out;
  for (const [step, def] of Object.entries(houseGroup)) {
    if (step.startsWith('$')) continue;
    const base = toPx(def.$value);
    if (base == null) continue;
    let best = null;
    for (const v of values) {
      const d = Math.abs(v - base) / base;
      if (d <= tol && (best == null || d < Math.abs(best - base) / base)) best = v;
    }
    if (best != null && best !== base) {
      out[step] = token(best % 16 === 0 ? `${best / 16}rem` : `${best}px`, 'dimension');
    }
  }
  let last = 0;
  for (const [step, def] of Object.entries(houseGroup)) {
    if (step.startsWith('$')) continue;
    const effective = out[step] ? toPx(out[step].$value) : toPx(def.$value);
    if (out[step] && effective <= last) { delete out[step]; last = toPx(def.$value); }
    else last = effective;
  }
  return out;
}

function mapColor(snap, skipped) {
  const houseColors = new Set(Object.keys(HOUSE.color));
  const out = {};
  const src = { ...(snap.color?.roles || {}) };
  for (const k of ['bg', 'surface', 'surface-2', 'fg', 'muted', 'subtle', 'border', 'accent', 'accent-fg']) {
    if (typeof snap.color?.[k] === 'string') src[k] = snap.color[k];
  }
  for (const [k, v] of Object.entries(src)) {
    if (typeof v !== 'string') continue;
    if (houseColors.has(k)) out[k] = token(v, 'color');
    else skipped.push(k);
  }
  // dark axis: snapshots with a captured color.dark block map onto the house dark-context roles
  const dark = snap.color?.dark || {};
  const darkMap = { bg: 'bg-dark', surface: 'surface-dark', fg: 'fg-on-dark', muted: 'muted-on-dark', border: 'border-on-dark' };
  for (const [k, houseName] of Object.entries(darkMap)) {
    if (typeof dark[k] === 'string') out[houseName] = token(dark[k], 'color');
  }
  // a light accent (e.g. Ramp acid yellow) usually shipped its own accent-fg; if the
  // snapshot set accent but not accent-fg, leave the base's white and let the user check.
  return Object.keys(out).length ? { color: out } : {};
}

function mapType(snap) {
  const out = {};
  const fams = snap.type?.families || [];
  const isMono = (f) => /mono|menlo|consolas|courier/i.test(f);
  const sans = fams.find((f) => !isMono(f));
  const mono = fams.find(isMono);
  const font = {};
  if (sans) font.sans = token(sans, 'fontFamily');
  if (mono) font.mono = token(mono, 'fontFamily');
  if (Object.keys(font).length) out.font = font;

  const weights = (snap.type?.weights || []).map(Number).filter(Boolean).sort((a, b) => a - b);
  if (weights.length) {
    const nearest = (target) => weights.reduce((b, w) => (Math.abs(w - target) < Math.abs(b - target) ? w : b));
    const weight = {};
    for (const [name, target] of [['regular', 400], ['medium', 500], ['semibold', 600], ['bold', 700]]) {
      const w = nearest(target);
      if (Math.abs(w - target) < 100) weight[name] = token(w, 'fontWeight'); // 590 is not "bold" — leave the base value
    }
    if (Object.keys(weight).length) out.weight = weight;
  }

  const leading = (snap.type?.leading || []).map(Number).filter(Boolean).sort((a, b) => a - b);
  if (leading.length >= 2) out.leading = { tight: token(leading[0], 'number'), normal: token(leading[leading.length - 1], 'number') };

  const text = nearestOntoScale(HOUSE.text, snap.type?.scale, 0.2, 'dimension');
  if (Object.keys(text).length) out.text = text;
  return out;
}

function mapRadius(snap) {
  const out = {};
  const values = (snap.radius || []);
  const px = values.map(toPx).filter((v) => v != null);
  for (const [step, def] of Object.entries(HOUSE.radius)) {
    if (step === 'full') continue;
    const base = toPx(def.$value);
    let best = null;
    for (const v of px) {
      const d = Math.abs(v - base);
      if (d <= Math.max(2, base * 0.4) && (best == null || d < Math.abs(best - base))) best = v;
    }
    if (best != null && best !== base) out[step] = token(`${best}px`, 'dimension');
  }
  return Object.keys(out).length ? { radius: out } : {};
}

function mapShadow(snap) {
  const entries = (snap.shadow || []).filter((s) => s && s !== 'none');
  if (!entries.length) return {};
  const shadow = {};
  const names = ['sm', 'md', 'lg'];
  for (let i = 0; i < Math.min(entries.length, 3); i++) shadow[names[i]] = token(entries[entries.length <= 3 ? i : Math.round((i * (entries.length - 1)) / 2)], 'shadow');
  return { shadow };
}

function mapMotion(snap) {
  const out = {};
  const ms = (snap.motion?.durations || []).map((d) => parseFloat(d)).filter((n) => Number.isFinite(n) && n > 0).sort((a, b) => a - b);
  if (ms.length) {
    out.duration = {
      fast: token(`${ms[0]}ms`, 'duration'),
      base: token(`${ms[Math.floor(ms.length / 2)]}ms`, 'duration'),
      slow: token(`${ms[ms.length - 1]}ms`, 'duration'),
    };
  }
  const easings = snap.motion?.easings || [];
  if (easings.length) out.ease = { standard: token(easings[0], 'cubicBezier') };
  return out;
}

// ── CLI ───────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const nameIdx = args.indexOf('--name');
const name = nameIdx !== -1 ? args[nameIdx + 1] : null;
const outIdx = args.indexOf('--out');
const outDir = outIdx !== -1 ? args[outIdx + 1] : null;
const layoutIdx = args.indexOf('--layout');
const layout = layoutIdx !== -1 ? args[layoutIdx + 1] : null;
const layoutDonorIdx = args.indexOf('--layout-donor');
const layoutDonor = layoutDonorIdx !== -1 ? args[layoutDonorIdx + 1] : null;
const sources = args.filter((a, i) => !a.startsWith('--')
  && i !== nameIdx + 1 && i !== outIdx + 1 && i !== layoutIdx + 1 && i !== layoutDonorIdx + 1);
if (!name || !sources.length || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  console.error('usage: node tooling/exemplar-preset.mjs --name <preset-name> [--out <project-dir>] [--layout <archetype> --layout-donor <slug>] <slug>[:<fields>] [...]\n  fields: ' + FIELDS.join(','));
  process.exit(1);
}
if (outDir && !existsSync(outDir)) { console.error(`--out dir not found: ${outDir}`); process.exit(1); }

let preset = {};
const provenance = [];
const skippedRoles = [];
for (const spec of sources) {
  const [slug, fieldStr] = spec.split(':');
  const fields = fieldStr ? fieldStr.split(',').map((s) => s.trim()) : FIELDS;
  const badField = fields.find((f) => !FIELDS.includes(f));
  if (badField) { console.error(`unknown field "${badField}" in ${spec} (allowed: ${FIELDS.join(',')})`); process.exit(1); }
  const found = findSnapshot(slug);
  if (!found) { console.error(`no token snapshot for "${slug}" in either corpus`); process.exit(1); }
  const { corpus, snap } = found;
  provenance.push(`${slug} (${corpus}): ${fields.join(',')}`);
  const parts = {};
  if (fields.includes('color')) Object.assign(parts, mapColor(snap, skippedRoles));
  if (fields.includes('type')) Object.assign(parts, mapType(snap));
  if (fields.includes('space')) { const s = nearestOntoScale(HOUSE.space, snap.space?.scale, 0.25, 'dimension'); if (Object.keys(s).length) parts.space = s; }
  if (fields.includes('radius')) Object.assign(parts, mapRadius(snap));
  if (fields.includes('shadow')) Object.assign(parts, mapShadow(snap));
  if (fields.includes('motion')) Object.assign(parts, mapMotion(snap));
  // later sources override earlier on overlap, group-by-group
  for (const [group, tokens] of Object.entries(parts)) preset[group] = { ...(preset[group] || {}), ...tokens };
}

preset = {
  $description: `Generated by tooling/exemplar-preset.mjs from ${provenance.join(' + ')}. Regenerate rather than hand-edit; check accent/accent-fg contrast when mixing palettes.`,
  ...preset,
};

const groups = Object.keys(preset).filter((k) => !k.startsWith('$'));
if (outDir) {
  // cross-repo: the consuming project OWNS its theme — preset + built css + lock live there.
  const { buildCss } = await import(pathToFileURL(join(ROOT, 'tokens', 'build.mjs')).href);
  writeFileSync(join(outDir, 'taste.preset.json'), JSON.stringify(preset, null, 2) + '\n');
  const { css, count } = buildCss(preset, name);
  writeFileSync(join(outDir, 'taste.tokens.css'), css);
  let lock = {};
  try { lock = JSON.parse(readFileSync(join(outDir, 'taste.lock.json'), 'utf8')); } catch { /* new lock */ }
  lock.preset = name;
  lock.donors = sources;
  lock.patterns ||= []; // /compose (and the base skill workflow) append the patterns they use
  lock.note = 'Theme lock — /compose and the web-design-taste skill reuse these donors instead of remixing. Regenerate with tooling/exemplar-preset.mjs --out.';
  if (layout || layoutDonor) lock.layout = { archetype: layout || null, donor: layoutDonor || null };
  writeFileSync(join(outDir, 'taste.lock.json'), JSON.stringify(lock, null, 2) + '\n');
  // cross-build memory: same call, no separate step for a session to forget (best-effort, never blocks this command).
  appendRecent({ project: outDir, donors: sources, patterns: lock.patterns, ...(layout ? { layout } : {}) });
  console.log(`${outDir}: taste.preset.json + taste.tokens.css (${count} vars) + taste.lock.json — overrides: ${groups.join(', ') || '(none)'}`);
} else {
  const outPath = join(ROOT, 'tokens/presets', `${name}.json`);
  writeFileSync(outPath, JSON.stringify(preset, null, 2) + '\n');
  console.log(`tokens/presets/${name}.json written — overrides: ${groups.join(', ') || '(none)'}`);
  console.log(`  build it: node tokens/build.mjs --preset=${name}`);
}
if (skippedRoles.length) console.log(`  exemplar-specific roles NOT promoted (use as pattern knobs): ${[...new Set(skippedRoles)].join(', ')}`);
