// tokens.json -> tokens.css (CSS custom properties). No external deps.
//   node tokens/build.mjs                 # build base -> tokens.css
//   node tokens/build.mjs --preset=soft   # base + presets/soft.json -> tokens.css
// Direction presets deep-merge over the base before flattening.
// Also exported as a library (deepMerge/flatten/buildCss) for tooling/exemplar-preset.mjs --out.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export function deepMerge(base, over) {
  if (Array.isArray(over)) return over;
  if (typeof over !== 'object' || over === null) return over;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) {
    out[k] = k in base && typeof base[k] === 'object' && !('$value' in (v || {}))
      ? deepMerge(base[k], v)
      : v;
  }
  return out;
}

export function flatten(obj, prefix = [], out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) {
      out[[...prefix, k].join('-')] = v.$value;
    } else if (v && typeof v === 'object') {
      flatten(v, [...prefix, k], out);
    }
  }
  return out;
}

/** base tokens.json (+ optional preset OBJECT) -> css text. */
export function buildCss(preset = null, label = 'base') {
  const base = JSON.parse(readFileSync(join(here, 'tokens.json'), 'utf8'));
  const merged = preset ? deepMerge(base, preset) : base;
  const flat = flatten(merged);
  const css =
    `/* Generated from tokens.json (${label}) — do not edit by hand. Run: npm run tokens:build */\n` +
    `:root {\n` +
    Object.entries(flat).map(([k, v]) => `  --${k}: ${v};`).join('\n') +
    `\n}\n`;
  return { css, count: Object.keys(flat).length };
}

/**
 * base tokens.json (+ optional preset) -> a Tailwind preset object.
 * Values are `var(--token)` strings so the generated CSS variables stay the single
 * source of truth: Tailwind only names the utilities, tokens.css supplies the values.
 * Straightforward mapping over the flat token names, grouped by first segment.
 */
export function buildTailwindPreset(preset = null) {
  const base = JSON.parse(readFileSync(join(here, 'tokens.json'), 'utf8'));
  const merged = preset ? deepMerge(base, preset) : base;
  const flat = flatten(merged);
  const colors = {};        // nested: color-accent-fg -> colors.accent.fg (var(--color-accent-fg))
  const spacing = {}, fontSize = {}, borderRadius = {}, boxShadow = {};
  const transitionTimingFunction = {}, transitionDuration = {}, letterSpacing = {};
  for (const name of Object.keys(flat)) {
    const seg = name.split('-');
    const group = seg[0];
    const rest = seg.slice(1).join('-');
    const cssvar = `var(--${name})`;
    if (group === 'color') {
      // nest a single extra segment as an object so `bg-accent` and `text-accent-fg`
      // both work: color-accent -> colors.accent, color-accent-fg -> colors.accent.fg
      const key = seg.slice(1);
      if (key.length <= 1) colors[key[0]] = cssvar;
      else {
        const head = key[0];
        if (typeof colors[head] === 'string') colors[head] = { DEFAULT: colors[head] };
        else if (!colors[head]) colors[head] = {};
        colors[head][key.slice(1).join('-')] = cssvar;
      }
    } else if (group === 'space') spacing[rest] = cssvar;
    else if (group === 'text') fontSize[rest] = cssvar;
    else if (group === 'radius') borderRadius[rest] = cssvar;
    else if (group === 'shadow') boxShadow[rest] = cssvar;
    else if (group === 'ease') transitionTimingFunction[rest] = cssvar;
    else if (group === 'duration') transitionDuration[rest] = cssvar;
    else if (group === 'tracking') letterSpacing[rest] = cssvar;
  }
  return {
    theme: {
      extend: {
        colors, spacing, fontSize, borderRadius, boxShadow,
        transitionTimingFunction, transitionDuration, letterSpacing,
      },
    },
  };
}

/** Tailwind preset object -> ESM module text (default export). */
export function buildTailwindFile(preset = null, label = 'base') {
  const obj = buildTailwindPreset(preset);
  return (
    `/* Generated from tokens.json (${label}) — do not edit by hand. Run: node tokens/build.mjs --tailwind\n` +
    ` *\n` +
    ` * Consuming projects wire this in as a Tailwind preset:\n` +
    ` *   // tailwind.config.js\n` +
    ` *   module.exports = { presets: [require('./tokens/tailwind.preset.mjs')] };\n` +
    ` *   // or ESM: import tokensPreset from './tokens/tailwind.preset.mjs'\n` +
    ` * You then get token-named utilities: bg-surface, text-muted, p-6, rounded-lg, …\n` +
    ` * Values are var(--token) refs, so tokens.css remains the source of truth — ship it too.\n` +
    ` */\n` +
    `export default ${JSON.stringify(obj, null, 2)};\n`
  );
}

// ── CLI ───────────────────────────────────────────────────────────────────────
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const presetArg = process.argv.find((a) => a.startsWith('--preset='));
  const tailwind = process.argv.includes('--tailwind');
  let preset = null;
  let label = 'base';
  if (presetArg) {
    const name = presetArg.split('=')[1];
    const pPath = join(here, 'presets', `${name}.json`);
    if (!existsSync(pPath)) {
      console.error(`preset not found: ${pPath}`);
      process.exit(1);
    }
    preset = JSON.parse(readFileSync(pPath, 'utf8'));
    label = name;
  }
  if (tailwind) {
    const file = buildTailwindFile(preset, label);
    writeFileSync(join(here, 'tailwind.preset.mjs'), file);
    console.log(`tailwind.preset.mjs written (${label})`);
  } else {
    const { css, count } = buildCss(preset, label);
    writeFileSync(join(here, 'tokens.css'), css);
    console.log(`tokens.css written (${label}): ${count} variables`);
  }
}
