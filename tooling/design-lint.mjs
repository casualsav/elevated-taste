#!/usr/bin/env node
/**
 * design-lint.mjs — the Web Design Taste lint engine (Phase 2, guardrail #2).
 *
 * Machine-readable rule sources (the brief's constraint — reuse, don't reinvent):
 *   - tokens/tokens.json ............ parsed into a reverse value->var(--name) map, so a
 *                                     literal that EQUALS a token is flagged "use var(--x)".
 *   - references/anti-patterns.md ... the "Quick gate" short-list (its §"Quick gate") is
 *                                     encoded below as the rule set; each rule cites its §.
 *
 * Reused by: .claude/hooks/post-write-lint.mjs (PostToolUse), .claude/hooks/stop-gate.mjs
 * (Stop), and the design-critic subagent (mechanical layer). Pure Node, zero deps, fast.
 *
 * Severity: only `error` findings gate (the Stop-gate blocks on them). `warn` = advisory,
 * surfaced but never blocking — that is the fail-open hinge. High-precision tells are
 * errors; fuzzy heuristics are warns.
 *
 * CLI:  node tooling/design-lint.mjs <file...> [--json]                  (exit 1 if any error)
 *       node tooling/design-lint.mjs --stdin [--name <label>] [--json] [--house-tokens]
 *         (lints stdin; file args ignored if given. token-coupling rules — magic-number,
 *          raw-color — are downgraded to warn by default since stdin is presumed external
 *          code with its own token system; --house-tokens restores strict repo-internal mode)
 */
import { readFileSync } from 'node:fs';
import { join, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');

export const UI_EXT = new Set([
  '.html', '.htm', '.css', '.scss', '.sass', '.less',
  '.jsx', '.tsx', '.vue', '.svelte', '.astro',
]);

// .ts/.js are linted ONLY when they carry design decisions — a CSS-in-JS tagged
// template or a className. Most .ts is pure logic; linting all of it would be noise.
const MARKER_EXT = new Set(['.ts', '.js', '.mjs', '.cjs']);
const UI_MARKER = /\bstyled[.(]|\bcss`|\bkeyframes`|\bcreateGlobalStyle\b|className\s*[:=]/;

/** first 64KB is enough to spot the marker; whole-file reads on big bundles are wasteful */
function hasUiMarker(file) {
  try {
    const fd = readFileSync(file, 'utf8');
    return UI_MARKER.test(fd.slice(0, 65536));
  } catch { return false; }
}

function routableExt(p) {
  if (/\/(node_modules|\.cache|\.git)\//.test(p)) return null;
  // never lint the token files themselves — they legitimately hold the raw literals
  if (/(^|\/)tokens\/tokens(\.[\w-]+)?\.css$/.test(p)) return null;
  if (/(^|\/)tokens\/tokens\.json$/.test(p)) return null;
  // the lint engine's own source legitimately holds pattern literals (regexes containing
  // `css\``, `<img`, `100vh`, raw colors as doc examples) — never lint it against itself.
  // Same for the guardrail hooks: their message strings carry those literals too (e.g.
  // "taste.tokens.css`" trips the css` marker), so editing a hook must not gate the session.
  if (/(^|\/)tooling\/design-lint\.mjs$/.test(p)) return null;
  if (/(^|\/)\.claude\/hooks\/(lib\/)?[\w.-]+\.mjs$/.test(p)) return null;
  return extname(p).toLowerCase();
}

/**
 * Should this path be TRACKED (linted) at all? The forward-looking router: true for any
 * UI_EXT, and for .ts/.js only when the content carries a UI marker (styled/css`/className).
 * Hooks will migrate to this; shouldLint stays for existing callers.
 */
export function shouldTrack(file) {
  const p = String(file).replace(/\\/g, '/');
  const ext = routableExt(p);
  if (ext == null) return false;
  if (UI_EXT.has(ext)) return true;
  if (MARKER_EXT.has(ext)) return hasUiMarker(file);
  return false;
}

/** Should this path be linted at all? (used by the hooks to route files) */
export function shouldLint(file) {
  const p = String(file).replace(/\\/g, '/');
  const ext = routableExt(p);
  if (ext == null) return false;
  if (UI_EXT.has(ext)) return true;
  // .ts/.js pass only when they actually hold design decisions (read to confirm)
  if (MARKER_EXT.has(ext)) return hasUiMarker(file);
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tokens → reverse maps (mirrors tokens/build.mjs flatten: name = group-key)
// ─────────────────────────────────────────────────────────────────────────────
function flatten(obj, prefix = [], out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) out[[...prefix, k].join('-')] = v.$value;
    else if (v && typeof v === 'object') flatten(v, [...prefix, k], out);
  }
  return out;
}

/** "#fff" / "rgb(0 0 0)" / "rgba(255,255,255,.16)" -> {r,g,b,a} | null */
export function parseColor(raw) {
  if (!raw) return null;
  let s = String(raw).trim().toLowerCase();
  let m;
  if ((m = s.match(/^#([0-9a-f]{3,8})$/))) {
    const h = m[1];
    if (h.length === 3 || h.length === 4) {
      const r = parseInt(h[0] + h[0], 16), g = parseInt(h[1] + h[1], 16), b = parseInt(h[2] + h[2], 16);
      const a = h.length === 4 ? parseInt(h[3] + h[3], 16) / 255 : 1;
      return { r, g, b, a };
    }
    if (h.length === 6 || h.length === 8) {
      const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
      const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
      return { r, g, b, a };
    }
    return null;
  }
  if ((m = s.match(/^rgba?\(([^)]+)\)$/))) {
    const parts = m[1].split(/[ ,/]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const r = +parts[0], g = +parts[1], b = +parts[2];
    let a = parts[3] != null ? (parts[3].endsWith('%') ? +parts[3].slice(0, -1) / 100 : +parts[3]) : 1;
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b, a: Number.isNaN(a) ? 1 : a };
  }
  return null;
}

const colorKey = (c) => c && `${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${+c.a.toFixed(3)}`;

/** neutral (gray/black/white/transparent) border color? used by the side-tab rule so a plain
 *  neutral divider border doesn't get flagged as a colored "accent" tell. */
function isNeutralBorderColor(raw, T) {
  const v = String(raw).trim();
  if (/^(transparent|currentcolor|inherit|none)$/i.test(v)) return true;
  const named = v.match(/^(gray|grey|silver|white|black)\b/i);
  if (named) return true;
  const vm = v.match(/var\(\s*(--[\w-]+)/);
  const c = vm ? T?.varColor?.get(vm[1]) : parseColor((v.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/) || [])[0]);
  if (!c) return false;
  return Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b) < 30;
}

/** dimension string -> px number (rem*16) | null */
function toPx(v) {
  const m = String(v).trim().match(/^(-?\d*\.?\d+)(rem|px)$/);
  if (!m) return null;
  return m[2] === 'rem' ? parseFloat(m[1]) * 16 : parseFloat(m[1]);
}

const normStr = (v) => String(v).toLowerCase().replace(/\s*,\s*/g, ',').replace(/\s+/g, ' ').trim();

// display scale = ≥40px / ≥2.5rem; for clamp(min, pref, max) the MAX arg is what caps the size.
const DISPLAY_PX = 40;
function displayFontSize(value) {
  const v = String(value).trim();
  const clamp = v.match(/clamp\(\s*[^,]+,\s*[^,]+,\s*([^)]+)\)/i);
  const px = toPx((clamp ? clamp[1] : v).trim());
  return px != null && px >= DISPLAY_PX;
}

const _tokensByRepo = new Map(); // keyed by repo so the engine can serve more than one root per process
export function loadTokens(repo = REPO) {
  if (_tokensByRepo.has(repo)) return _tokensByRepo.get(repo);
  let raw = {};
  try { raw = JSON.parse(readFileSync(join(repo, 'tokens', 'tokens.json'), 'utf8')); } catch { /* fail-open */ }
  const flat = flatten(raw);
  const t = {
    color: new Map(), varColor: new Map(),
    px: { text: new Map(), space: new Map(), radius: new Map(), container: new Map() },
    str: { duration: new Map(), ease: new Map(), shadow: new Map(), font: new Map(), weight: new Map(), leading: new Map(), tracking: new Map() },
  };
  for (const [name, value] of Object.entries(flat)) {
    const group = name.split('-')[0];
    if (group === 'color') {
      const c = parseColor(value); const k = colorKey(c);
      if (k && !t.color.has(k)) t.color.set(k, name);
      if (c) t.varColor.set('--' + name, c);
      continue;
    }
    if (t.px[group]) { const px = toPx(value); if (px != null && !t.px[group].has(px)) t.px[group].set(px, name); }
    if (t.str[group]) { const s = normStr(value); if (s && !t.str[group].has(s)) t.str[group].set(s, name); }
  }
  _tokensByRepo.set(repo, t);
  return t;
}

// ─────────────────────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────────────────────
const lineOf = (text, index) => text.slice(0, index).split('\n').length;

const ALLOW_DIM = new Set(['0', '0px', '0rem', '1px', '2px', '0.5px', '100%', '100vh', '100dvh', 'auto', 'none', 'inherit']);

// which px token map a CSS property should be checked against
function pxGroupFor(prop) {
  if (prop === 'font-size') return 'text';
  if (/(^|-)border(-[a-z]+)*-radius$/.test(prop) || prop === 'border-radius') return 'radius';
  if (/^(padding|margin)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$/.test(prop)) return 'space';
  if (/^(gap|row-gap|column-gap|top|right|bottom|left|inset)$/.test(prop)) return 'space';
  if (/^(width|min-width|max-width)$/.test(prop)) return 'container-or-space';
  if (/^(height|min-height|max-height)$/.test(prop)) return 'space';
  return null;
}
function strGroupFor(prop) {
  if (/duration$/.test(prop)) return 'duration';
  if (/timing-function$/.test(prop)) return 'ease';
  if (prop === 'box-shadow') return 'shadow';
  if (prop === 'font-family') return 'font';
  if (prop === 'font-weight') return 'weight';
  if (prop === 'line-height') return 'leading';
  if (prop === 'letter-spacing') return 'tracking';
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// the lint
// ─────────────────────────────────────────────────────────────────────────────
export function lintText(name, text, opts = {}) {
  const T = opts.tokens || loadTokens(opts.repo);
  const ext = extname(name).toLowerCase();
  const isCss = ['.css', '.scss', '.sass', '.less'].includes(ext);
  const isScript = ['.jsx', '.tsx', '.ts', '.js', '.mjs', '.cjs'].includes(ext);
  const findings = [];
  const add = (level, rule, section, index, message, fix) =>
    findings.push({ level, rule, section, line: lineOf(text, index), message, fix: fix || null });

  // whole-document overflow-x guard for the vw-breakout rule below
  const hasOverflowGuard = /overflow-x\s*:\s*(clip|hidden)\b|overflow\s*:\s*[^;}]*\b(clip|hidden)\b/i.test(text);

  // token-coupling rules (magic-number, raw-color) presume THIS repo's tokens.json; an
  // external project with its own disciplined tokens gets false errors, so callers linting
  // someone else's code (the --stdin CLI) pass houseTokens:false to keep them as advisories.
  const tokenLevel = opts.houseTokens === false ? 'warn' : 'error';

  // region maps so we don't lint JS numbers as CSS, etc.
  const styleRanges = []; // [start,end) where CSS declarations live
  const scriptRanges = [];
  if (isCss) styleRanges.push([0, text.length]);
  else {
    for (const m of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) styleRanges.push([m.index + m[0].indexOf('>') + 1, m.index + m[0].length - 8]);
    for (const m of text.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) scriptRanges.push([m.index, m.index + m[0].length]);
    for (const m of text.matchAll(/\bstyle\s*=\s*"([^"]*)"/gi)) styleRanges.push([m.index + m[0].indexOf('"') + 1, m.index + m[0].length - 1]);
  }
  if (isScript) {
    scriptRanges.push([0, text.length]);
    // CSS-in-JS: the body of css`…`, styled.x`…`, styled(X)`…`, keyframes`…`,
    // createGlobalStyle`…` is real CSS. Add each template's inner range to styleRanges so
    // the whole style-rules pipeline (raw colors, magic numbers, display-tracking) runs on
    // it. Nested ${…} interpolations are left in place — they never match CSS-literal rules.
    const TAG = /(?:\bcss|\bkeyframes|\bcreateGlobalStyle|\bstyled\.[a-zA-Z][\w]*|\bstyled\([^)]*\))\s*`/g;
    for (const m of text.matchAll(TAG)) {
      const open = m.index + m[0].length; // first char after the backtick
      // find the matching closing backtick, skipping escaped ones and ${...} spans
      let i = open, depth = 0, close = -1;
      while (i < text.length) {
        const ch = text[i];
        if (ch === '\\') { i += 2; continue; }
        if (ch === '$' && text[i + 1] === '{') { depth++; i += 2; continue; }
        if (ch === '}' && depth > 0) { depth--; i++; continue; }
        if (ch === '`' && depth === 0) { close = i; break; }
        i++;
      }
      if (close === -1) close = text.length;
      styleRanges.push([open, close]);
    }
  }
  const inRanges = (i, ranges) => ranges.some(([a, b]) => i >= a && i < b);

  // ── colors + dimensions inside style regions ────────────────────────────────
  const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g;
  const seen = new Set();
  for (const [start, end] of styleRanges) {
    const chunk = text.slice(start, end);

    // CSS declarations: prop: value;  (also matches the last decl before })
    for (const dm of chunk.matchAll(/([-a-z]+)\s*:\s*([^;{}]+)(?=[;}]|$)/gi)) {
      const prop = dm[1].toLowerCase();
      const value = dm[2].trim();
      const declIndex = start + dm.index;
      if (/^--/.test(dm[1]) || /^\$/.test(value)) continue; // custom prop def / scss var

      // dimension magic numbers (exact token match → error)
      const pg = pxGroupFor(prop);
      if (pg) {
        for (const piece of value.split(/\s+/)) {
          if (piece.includes('var(') || ALLOW_DIM.has(piece)) continue;
          const px = toPx(piece);
          if (px == null) continue;
          // width-like props: prefer a container token (1280px → --container-xl), else space
          const hit = pg === 'container-or-space'
            ? (T.px.container.get(px) || T.px.space.get(px))
            : T.px[pg].get(px);
          if (hit) add(tokenLevel, 'magic-number', 'tokens.json', declIndex,
            `\`${piece}\` on \`${prop}\` equals a token — use var(--${hit}).`,
            `var(--${hit})`);
        }
      }
      // 100vw full-bleed breakout — anti-patterns §7
      if (/^(width|min-width|max-width|inline-size|margin-left|margin-right|margin-inline(-start|-end)?|inset)$/.test(prop)) {
        const vwMatch = value.match(/\b100(?:vw|dvw|svw|lvw)\b/);
        if (vwMatch) {
          add(hasOverflowGuard ? 'warn' : 'error', 'vw-breakout', 'anti-patterns §7', declIndex,
            `\`${prop}: ${value}\` full-bleeds with \`${vwMatch[0]}\` — 100vw includes the scrollbar width, causing horizontal overflow. Size a full-width parent with \`width:100%\` instead, or add \`overflow-x:clip\` on body if the breakout is unavoidable.`);
        }
      }

      // string-valued tokens (duration / easing / shadow / weight / line-height …)
      const sg = strGroupFor(prop);
      if (sg) {
        const hit = T.str[sg].get(normStr(value));
        if (hit) add(tokenLevel, 'magic-number', 'tokens.json', declIndex,
          `\`${prop}: ${value}\` equals a token — use var(--${hit}).`, `var(--${hit})`);
      }

      // side-tab — adapted from impeccable's `side-tab` rule (github.com/pbakaus/impeccable,
      // Apache-2.0): a thick colored border on one side of a card, the most recognizable
      // AI-slop tell. High precision (explicit side + width + non-neutral color) → error.
      if (/^border-(left|right)$/.test(prop)) {
        const bm = value.match(/^(\d+)px\s+solid\s+(.+)$/i);
        if (bm && +bm[1] >= 3 && !isNeutralBorderColor(bm[2].trim(), T)) {
          add('error', 'side-tab', 'impeccable', declIndex,
            `\`${prop}: ${value}\` — thick colored side border is the most recognizable AI-slop card tell. Use a subtler accent or remove it entirely.`);
        }
      }
    }

    // owner rule 1 (taste/owner.md): caps microlabels only in a designed display face, never
    // in system/ui monospace. One rule block that sets both uppercase and a mono family is the
    // rejected treatment. Advisory: a mono font var can't always be resolved from here.
    const MONO = /\b(monospace|ui-monospace|[\w-]*mono[\w-]*|menlo|consolas|courier)\b/i;
    for (const bm of chunk.matchAll(/\{([^{}]*)\}/g)) {
      const body = bm[1];
      const up = body.match(/text-transform\s*:\s*uppercase/i);
      const fam = body.match(/font-family\s*:\s*([^;}]+)/i) || body.match(/(?:^|[;\s])font\s*:\s*([^;}]+)/i);
      if (up && fam && MONO.test(fam[1])) {
        add('warn', 'owner-mono-caps', 'taste/owner.md rule 1', start + bm.index + 1 + up.index,
          'All-caps text in a monospace face: the owner rejected caps mono microlabels. Use sentence case with tracking near .02em, or set caps in the display face.',
          'drop text-transform:uppercase; letter-spacing:.02em');
      }
    }

    // custom-property DEFINITION lines (--foo: #abc;) — defining your own token IS the
    // tokenized discipline, so raw-color must not flag them as "hardcoded".
    const customPropRanges = [];
    for (const pm of chunk.matchAll(/--[\w-]+\s*:\s*[^;{}]+/g)) {
      customPropRanges.push([start + pm.index, start + pm.index + pm[0].length]);
    }

    // color literals anywhere in style regions
    for (const cm of chunk.matchAll(COLOR_RE)) {
      const lit = cm[0];
      const absIndex = start + cm.index;
      const c = parseColor(lit);
      if (!c) continue;
      // definition lines are exempt from ALL literal-color rules, not just raw-color below:
      // a token file re-declaring a house value (generated taste.tokens.css) is the
      // discipline itself, not a violation of it.
      if (inRanges(absIndex, customPropRanges)) continue;
      const k = colorKey(c);
      const dedupe = absIndex + lit;
      if (seen.has(dedupe)) continue; seen.add(dedupe);
      const tok = T.color.get(k);
      const opaque = c.a >= 0.999; // translucent black/white = legit overlays/borders, not the §4 tell
      if (tok) {
        add(tokenLevel, 'magic-number', 'tokens.json', absIndex,
          `\`${lit}\` equals a token — use var(--${tok}).`, `var(--${tok})`);
      } else if (opaque && ((c.r === 0 && c.g === 0 && c.b === 0) || (c.r === 255 && c.g === 255 && c.b === 255))) {
        const dark = c.r === 0;
        add('error', 'pure-bw', 'anti-patterns §4', absIndex,
          `pure ${dark ? 'black' : 'white'} \`${lit}\` kills depth — use var(--color-${dark ? 'fg' : 'bg'}) (off-${dark ? 'black' : 'white'}).`,
          `var(--color-${dark ? 'fg' : 'bg'})`);
      } else if (opaque && !inRanges(absIndex, customPropRanges)) {
        add('warn', 'raw-color', 'tokens.json', absIndex,
          `hardcoded color \`${lit}\` — tokenize it or use an existing var(--color-*).`);
      }
    }

    // contrast (best-effort): within a CSS rule block, literal/var color on bg
    for (const block of chunk.matchAll(/\{([^{}]*)\}/g)) {
      const body = block[1];
      const fg = body.match(/(?:^|[;{])\s*color\s*:\s*([^;}]+)/i);
      const bg = body.match(/background(?:-color)?\s*:\s*([^;}]+)/i);
      if (!fg || !bg) continue;
      const fc = resolveColor(fg[1].trim(), T), bc = resolveColor(bg[1].trim(), T);
      if (!fc || !bc) continue;
      const ratio = contrast(fc, bc);
      if (ratio < 4.5) {
        const idx = start + block.index;
        const level = ratio < 3 ? 'error' : 'warn';
        add(level, 'contrast', 'anti-patterns §7', idx,
          `text/background contrast ${ratio.toFixed(2)}:1 is below WCAG AA (4.5:1).`);
      }
    }

    // display-tracking: a rule block that sets a display-scale font-size (≥40px / ≥2.5rem,
    // or a clamp() whose max hits that) but declares no letter-spacing. Big type reads loose
    // without a negative track — warn, not error (heuristic: block boundaries are fuzzy).
    for (const block of chunk.matchAll(/\{([^{}]*)\}/g)) {
      const body = block[1];
      const fs = body.match(/font-size\s*:\s*([^;}]+)/i);
      if (!fs) continue;
      if (/letter-spacing\s*:/i.test(body)) continue;
      if (displayFontSize(fs[1].trim())) {
        add('warn', 'display-tracking', 'corpus', start + block.index,
          'display-size type without negative tracking — big type needs tighter tracking; use var(--tracking-display) (corpus: −0.02em-class at display sizes).');
      }
    }
  }

  // Tailwind arbitrary dimension values: p-[2rem], gap-[16px], text-[3rem] …
  if (!isCss) {
    const TW = /\b(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|w|h|max-w|min-w|min-h|max-h|top|left|right|bottom|inset|rounded|text)-\[([^\]]+)\]/g;
    const twGroup = (u) => u === 'text' ? 'text' : u === 'rounded' ? 'radius' : 'space';
    for (const m of text.matchAll(TW)) {
      if (inRanges(m.index, scriptRanges)) continue;
      const px = toPx(m[2]);
      if (px == null || ALLOW_DIM.has(m[2])) continue;
      const g = twGroup(m[1]);
      const hit = T.px[g].get(px);
      if (hit) add(tokenLevel, 'magic-number', 'tokens.json', m.index,
        `\`${m[1]}-[${m[2]}]\` equals a token — use the \`--${hit}\` scale.`, `--${hit}`);
    }
  }

  // default-palette Tailwind color classes (bg-purple-500, text-slate-400 …) — a
  // high-precision tell: the house tokens never produce these utility names, so any hit is a
  // developer reaching past the token layer. Error. Scans class/className attr values and the
  // string args of clsx()/cn(); the utility prefix + named-palette + numeric shade is the tell.
  if (!isCss) {
    const TW_PALETTE = /\b(text|bg|border|ring|fill|stroke|from|via|to|divide|outline|shadow|accent|caret|decoration)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g;
    // regions that hold utility class strings: class=/className= attrs and clsx/cn(...) calls
    const classRegions = [];
    for (const m of text.matchAll(/\b(?:class|className)\s*=\s*("[^"]*"|'[^']*'|\{`[^`]*`\}|\{"[^"]*"\}|\{'[^']*'\})/gi)) {
      classRegions.push([m.index, m.index + m[0].length]);
    }
    for (const m of text.matchAll(/\b(?:clsx|cn|classNames|twMerge)\s*\(([\s\S]*?)\)/gi)) {
      classRegions.push([m.index, m.index + m[0].length]);
    }
    const inClass = (i) => classRegions.some(([a, b]) => i >= a && i < b);
    for (const m of text.matchAll(TW_PALETTE)) {
      if (!inClass(m.index)) continue;
      add('error', 'tw-default-palette', 'tokens.json', m.index,
        `\`${m[0]}\` is a default Tailwind palette color — use token-named classes from tokens/tailwind.preset.mjs (bg-surface, text-muted, …) or var(--token).`);
    }
  }

  // ── banned text patterns (skip <script>/<style> in markup) ───────────────────
  const visible = (i) => !inRanges(i, scriptRanges) && !inRanges(i, styleRanges);

  // em / en dash — anti-patterns §3, "the single most-violated Tell", non-negotiable —
  // but only where it can RENDER: markup copy, or a CSS `content:` value. A dash inside
  // a CSS/JS comment or a script string is never user-visible and must not gate the stop.
  const cssContentRanges = [];
  for (const [start, end] of styleRanges) {
    for (const dm of text.slice(start, end).matchAll(/content\s*:\s*[^;}]+/gi)) {
      cssContentRanges.push([start + dm.index, start + dm.index + dm[0].length]);
    }
  }
  for (const m of text.matchAll(/[—–]/g)) {
    if (!visible(m.index) && !inRanges(m.index, cssContentRanges)) continue;
    add('error', 'em-dash', 'anti-patterns §3', m.index,
      `visible "${m[0]}" — replace with a hyphen "-" or restructure.`, '-');
  }

  // markup-only copy/decoration tells (warn — fuzzy)
  const COPY = [
    [/\b(Elevate|Seamless|Unleash|Next-?Gen|Game-?changer|Revolutioniz\w+|Supercharge|Delve)\b/g, 'filler verb / AI cliché — use a concrete verb tied to what it does'],
    [/\b(John Doe|Sarah Chan|Jack Su|Lorem Ipsum)\b/gi, 'placeholder name — use a realistic name'],
    [/\b(Acme|Nexus|SmartFlow|Cloudly)\b/g, 'startup-slop brand name — use a contextual name'],
    [/\b99\.99%|\b1,234,567\b|\b10x\b/g, 'fake-perfect number — use organic, messy values'],
    [/\bv\d+\.\d+(\.\d+)?\b|\bBETA\b|\bEARLY ACCESS\b|\bINVITE-ONLY\b/g, 'version / fake-exclusivity eyebrow — drop unless a real launch'],
    [/(?:↓\s*)?\bscroll\s*(to\s*explore|down)?\b/gi, 'scroll cue — users know what scroll is; drop it'],
    [/\b0?0[0-9]\s*[·/]\s*\w+/g, 'section-number eyebrow — name the topic in plain language'],
    [/\b\d{1,2}:\d{2}\b\s*[·,]?\s*\d{1,3}°/g, 'locale/time/weather strip — drop unless truly relevant'],
    // marketing clichés — adapted from impeccable's `marketing-buzzword` rule (github.com/pbakaus/impeccable, Apache-2.0)
    [/\b(streamline your|empower your|supercharge your|unleash your|unleash the power|leverage the power|built for the modern|trusted by leading|trusted by the world|best-in-class|industry-leading|world-class|enterprise-grade|next-generation|cutting-edge|transform your business|game-changer|game changing|mission-critical|best of breed|future-proof|future proof|seamless experience|seamlessly integrate|drive engagement|drive growth|drive results|harness the power)\b/gi, 'marketing buzzword — pick a specific verb and noun that says what the product literally does'],
  ];
  for (const [re, msg] of COPY) {
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) {
      if (!visible(m.index)) continue;
      add('warn', 'template-copy', 'anti-patterns §1/§6', m.index, `${msg} (\`${m[0].trim()}\`).`);
    }
  }

  // AI-default purple/blue gradient — anti-patterns §4 (warn)
  for (const m of text.matchAll(/linear-gradient\([^)]*\)|(?:from|via|to)-(?:purple|violet|indigo|fuchsia)-\d{3}/gi)) {
    if (/purple|violet|indigo|fuchsia|#7c3aed|#8b5cf6|#6366f1|#a855f7/i.test(m[0]))
      add('warn', 'ai-gradient', 'anti-patterns §4', m.index,
        'AI-default purple/blue gradient — derive the hue from the brand on purpose.');
  }

  // Inter/Roboto as default face — anti-patterns §3 (warn; the house token IS Inter, so soft)
  for (const m of text.matchAll(/font-family\s*:\s*["']?(Inter|Roboto|Open Sans|Arial|Helvetica)\b/gi)) {
    if (inRanges(m.index, styleRanges) || isCss)
      add('warn', 'default-font', 'anti-patterns §3', m.index,
        `\`${m[1]}\` as the face is the AI default — prefer var(--font-sans) or a deliberate face.`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Rules adapted from impeccable (github.com/pbakaus/impeccable), Apache-2.0.
  // Ported from its regex engine (the only one that doesn't need a DOM/browser —
  // impeccable's static-html/browser engines depend on htmlparser2/css-select/
  // css-tree, which this file intentionally has zero dependencies on).
  // ─────────────────────────────────────────────────────────────────────────
  const isFullPageDoc = /<!doctype\s|<html[\s>]|<head[\s>]/i.test(text.replace(/<!--[\s\S]*?-->/g, ''));

  // border-accent-on-rounded — a thick accent border clashing with a rounded corner
  for (const [start, end] of styleRanges) {
    const chunk = text.slice(start, end);
    for (const block of chunk.matchAll(/\{([^{}]*)\}/g)) {
      const body = block[1];
      if (!/border-radius/i.test(body)) continue;
      const bm = body.match(/border-(top|bottom)\s*:\s*(\d+)px\s+solid\s+([^;}]+)/i);
      if (!bm || +bm[2] < 1 || isNeutralBorderColor(bm[3].trim(), T)) continue;
      add('warn', 'border-accent-on-rounded', 'impeccable', start + block.index,
        `\`border-${bm[1]}: ${bm[2]}px solid ...\` on a rounded element clashes with the corner radius — remove the border or the radius.`);
    }
  }

  // overused-font — the newer AI-default face wave (beyond Inter/Roboto/Arial above)
  const OVERUSED_FONTS = /Fraunces|Geist Sans|Geist Mono|Geist|Mona Sans|Plus Jakarta Sans|Space Grotesk|Recoleta|Instrument Sans|Instrument Serif/;
  for (const m of text.matchAll(/font-family\s*:\s*["']?([\w -]+?)\b/gi)) {
    const fm = m[1].match(OVERUSED_FONTS);
    if (fm && (inRanges(m.index, styleRanges) || isCss))
      add('warn', 'overused-font', 'impeccable', m.index,
        `\`${fm[0]}\` is part of the newer AI-default font wave — as overused now as Inter. Choose a face that gives the interface personality.`);
  }

  // single-font — only one non-generic font family across a full page
  if (isFullPageDoc && text.split('\n').length >= 20) {
    const GENERIC_FONTS = new Set(['sans-serif', 'serif', 'monospace', 'system-ui', 'ui-sans-serif', 'ui-serif', 'ui-monospace', 'ui-rounded', '-apple-system', 'blinkmacsystemfont', 'segoe ui', 'helvetica neue', 'cursive', 'fantasy', 'emoji', 'math', 'fangsong', 'inherit', 'initial', 'unset']);
    const families = new Set();
    for (const m of text.matchAll(/font-family\s*:\s*([^;}]+)/gi)) {
      for (const f of m[1].split(',')) {
        const name = f.trim().replace(/^['"]|['"]$/g, '').toLowerCase();
        if (name && !GENERIC_FONTS.has(name)) families.add(name);
      }
    }
    if (families.size === 1) add('warn', 'single-font', 'impeccable', 0,
      `only one font family (\`${[...families][0]}\`) used across the whole page — pair a distinctive display face with a refined body face for hierarchy.`);
  }

  // flat-type-hierarchy — ≥3 font sizes present but the largest/smallest ratio is under 2×
  if (isFullPageDoc) {
    const sizes = new Set();
    for (const m of text.matchAll(/font-size\s*:\s*([\d.]+)(px|rem|em)\b/gi)) {
      const px = m[2] === 'px' ? +m[1] : +m[1] * 16;
      if (px > 0 && px < 200) sizes.add(Math.round(px * 10) / 10);
    }
    const TW_SIZES = { 'text-xs': 12, 'text-sm': 14, 'text-base': 16, 'text-lg': 18, 'text-xl': 20, 'text-2xl': 24, 'text-3xl': 30, 'text-4xl': 36, 'text-5xl': 48, 'text-6xl': 60, 'text-7xl': 72, 'text-8xl': 96, 'text-9xl': 128 };
    for (const [cls, px] of Object.entries(TW_SIZES)) if (new RegExp(`\\b${cls}\\b`).test(text)) sizes.add(px);
    if (sizes.size >= 3) {
      const sorted = [...sizes].sort((a, b) => a - b);
      const ratio = sorted[sorted.length - 1] / sorted[0];
      if (ratio < 2.0) add('warn', 'flat-type-hierarchy', 'impeccable', 0,
        `type sizes are too close together (${sorted.map((s) => s + 'px').join(', ')}, ratio ${ratio.toFixed(1)}:1 top-to-bottom) — use fewer sizes with more contrast between steps.`);
    }
  }

  // gradient-text — decorative rather than meaningful, common on headings/metrics
  for (const m of text.matchAll(/(?:-webkit-)?background-clip\s*:\s*text/gi)) {
    const around = text.slice(Math.max(0, m.index - 200), m.index + m[0].length + 200);
    if (/gradient/i.test(around)) add('warn', 'gradient-text', 'impeccable', m.index,
      'gradient text (`background-clip:text` + a gradient) is decorative rather than meaningful — use a solid color for text.');
  }
  if (/\bbg-clip-text\b/.test(text) && /\bbg-gradient-to-/.test(text)) {
    add('warn', 'gradient-text', 'impeccable', text.indexOf('bg-clip-text'),
      '`bg-clip-text` + `bg-gradient-to-*` (Tailwind) renders gradient text — decorative rather than meaningful; use a solid color.');
  }

  // gray-on-color — Tailwind gray text utility on a colored background utility, same element line
  for (const m of text.matchAll(/\btext-(?:gray|slate|zinc|neutral|stone)-\d+\b/g)) {
    const lineEnd = text.indexOf('\n', m.index);
    const line = text.slice(text.lastIndexOf('\n', m.index) + 1, lineEnd === -1 ? text.length : lineEnd);
    const bg = line.match(/\bbg-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/);
    if (bg) add('warn', 'gray-on-color', 'impeccable', m.index,
      `\`${m[0]}\` on \`${bg[0]}\` — gray text looks washed out on a colored background; use a darker shade of the background color, or near-white.`);
  }

  // ai-color-palette — purple/violet/indigo text color on a heading (the gradient-class variant
  // of this impeccable rule is already covered above by ai-gradient)
  for (const m of text.matchAll(/\btext-(?:purple|violet|indigo)-\d+\b/g)) {
    const lineEnd = text.indexOf('\n', m.index);
    const line = text.slice(text.lastIndexOf('\n', m.index) + 1, lineEnd === -1 ? text.length : lineEnd);
    if (/\btext-[2-9]xl\b/.test(line) || /<h[1-3][\s>]/i.test(line))
      add('warn', 'ai-color-palette', 'impeccable', m.index,
        `\`${m[0]}\` on a heading — purple/violet text is one of the most recognizable AI-generated-UI tells; choose a distinctive, intentional palette.`);
  }

  // bounce-easing — bounce/elastic motion feels dated; real objects decelerate smoothly
  for (const m of text.matchAll(/\banimate-bounce\b/g)) {
    add('warn', 'bounce-easing', 'impeccable', m.index,
      '`animate-bounce` (Tailwind) — bounce/elastic easing feels dated; real objects decelerate smoothly (use ease-out-quart/quint/expo).');
  }
  for (const m of text.matchAll(/animation(?:-name)?\s*:\s*([^;{}]*(?:bounce|elastic|wobble|jiggle|spring)[^;{}]*)/gi)) {
    add('warn', 'bounce-easing', 'impeccable', m.index,
      `\`animation: ${m[1].trim()}\` — bounce/elastic/spring easing feels dated; use exponential easing instead.`);
  }
  for (const m of text.matchAll(/cubic-bezier\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)/g)) {
    const y1 = parseFloat(m[2]), y2 = parseFloat(m[4]);
    if (y1 < -0.1 || y1 > 1.1 || y2 < -0.1 || y2 > 1.1) add('warn', 'bounce-easing', 'impeccable', m.index,
      `\`cubic-bezier(${m[1]}, ${m[2]}, ${m[3]}, ${m[4]})\` overshoots past 0-1 — a bounce/elastic curve. Use exponential easing instead.`);
  }

  // monotonous-spacing — one spacing value used almost everywhere, no rhythm
  {
    const vals = [];
    for (const m of text.matchAll(/(?:padding|margin)(?:-(?:top|right|bottom|left))?\s*:\s*(\d+)px/gi)) { const v = +m[1]; if (v > 0 && v < 200) vals.push(v); }
    for (const m of text.matchAll(/(?:padding|margin)(?:-(?:top|right|bottom|left))?\s*:\s*([\d.]+)rem/gi)) { const v = Math.round(parseFloat(m[1]) * 16); if (v > 0 && v < 200) vals.push(v); }
    for (const m of text.matchAll(/gap\s*:\s*(\d+)px/gi)) vals.push(+m[1]);
    for (const m of text.matchAll(/\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap)-(\d+)\b/g)) vals.push(+m[1] * 4);
    const rounded = vals.map((v) => Math.round(v / 4) * 4);
    if (rounded.length >= 10) {
      const counts = {};
      for (const v of rounded) counts[v] = (counts[v] || 0) + 1;
      const maxCount = Math.max(...Object.values(counts));
      const pct = maxCount / rounded.length;
      const unique = [...new Set(rounded)].filter((v) => v > 0);
      if (pct > 0.6 && unique.length <= 3) {
        const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        add('warn', 'monotonous-spacing', 'impeccable', 0,
          `~${dominant}px spacing used ${maxCount}/${rounded.length} times (${Math.round(pct * 100)}%) — no rhythm. Use tight groupings for related items, generous gaps between sections.`);
      }
    }
  }

  // aphoristic-cadence — ≥3 manufactured-contrast / short-rebuttal sentences reads as AI cadence
  {
    let count = 0, first = null;
    for (const re of [/\bNot an? [a-z][^.!?]{1,40}[.!]\s+[A-Z][^.!?]{1,60}[.!]/g, /\b[A-Z][^.!?]{4,80}[.!]\s+(?:No|Just)\s+[a-z][^.!?]{2,60}[.!]/g]) {
      for (const m of text.matchAll(re)) {
        if (!visible(m.index)) continue;
        count++;
        if (first == null) first = m.index;
      }
    }
    if (count >= 3) add('warn', 'aphoristic-cadence', 'impeccable', first,
      `${count} manufactured-contrast constructions ("X. No Y." / "Not a X. A Y.") — reads as AI cadence, not voice. Once is fine; the pattern is the tell.`);
  }

  // numbered-section-markers — sequential 01/02/03 section labels one tier past eyebrow chips
  {
    const seen = new Set();
    for (const m of text.matchAll(/\b(0[1-9]|1[0-2])\b/g)) if (visible(m.index)) seen.add(m[1]);
    if (seen.size >= 3) {
      const sorted = [...seen].sort();
      let sequential = 0;
      for (let i = 1; i < sorted.length; i++) if (parseInt(sorted[i], 10) === parseInt(sorted[i - 1], 10) + 1) sequential++;
      if (sequential >= 2) add('warn', 'numbered-section-markers', 'impeccable', 0,
        `sequential numbered section markers (${sorted.slice(0, 6).join(', ')}) — AI editorial scaffolding one tier deeper than tracked eyebrow chips; choose a different section cadence.`);
    }
  }

  // dark-glow — dark background + a colored, blurred box-shadow is the default "cool" AI look
  {
    const hasDarkBg = /background(?:-color)?\s*:\s*(?:#(?:0[0-9a-f]|1[0-9a-f]|2[0-3])[0-9a-f]{4}\b|#(?:0|1)[0-9a-f]{2}\b|rgb\(\s*\d{1,2}\s*,\s*\d{1,2}\s*,\s*\d{1,2}\s*\))/i.test(text)
      || /\bbg-(?:gray|slate|zinc|neutral|stone)-(?:9\d{2}|800)\b/.test(text);
    if (hasDarkBg) {
      for (const m of text.matchAll(/box-shadow\s*:\s*([^;{}]+)/gi)) {
        const val = m[1];
        const colorMatch = val.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (!colorMatch) continue;
        const [r, g, b] = [+colorMatch[1], +colorMatch[2], +colorMatch[3]];
        if (Math.max(r, g, b) - Math.min(r, g, b) < 30) continue; // grayscale glow, not a color tell
        const pxVals = [...val.matchAll(/(\d+)px|(?<![.\d])\b(0)\b(?![.\d])/g)].map((p) => +(p[1] || p[2]));
        if (pxVals.length >= 3 && pxVals[2] > 4) {
          add('warn', 'dark-glow', 'impeccable', m.index,
            `colored glow \`rgb(${r},${g},${b})\` in a box-shadow on a dark background — the default "cool" AI look. Use subtle, purposeful lighting, or skip the dark theme.`);
          break;
        }
      }
    }
  }

  // broken-image — <img> with no src, or an empty/placeholder src, ships as a broken-image box
  for (const m of text.matchAll(/<img\b[^>]*>/gi)) {
    const srcMatch = m[0].match(/\bsrc\s*=\s*("([^"]*)"|'([^']*)')/i);
    if (!srcMatch) {
      add('error', 'broken-image', 'impeccable', m.index, '<img> with no src attribute — ships as a broken-image box. Add a real src or remove the tag.');
      continue;
    }
    const val = (srcMatch[2] ?? srcMatch[3] ?? '').trim();
    if (val === '' || val === '#') add('error', 'broken-image', 'impeccable', m.index,
      `<img src="${val}"> — empty/placeholder src ships as a broken-image box. Use a real image or remove the tag.`);
  }

  // skipped-heading — heading levels shouldn't skip (h1 → h3 with no h2); screen readers rely
  // on the outline
  if (!isCss) {
    let prevLevel = 0, prevText = '';
    for (const m of text.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)) {
      const level = +m[1];
      const headingText = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 60);
      if (prevLevel > 0 && level > prevLevel + 1) add('error', 'skipped-heading', 'impeccable', m.index,
        `<h${prevLevel}> "${prevText}" is followed by <h${level}> "${headingText}" — heading levels should not skip (missing h${prevLevel + 1}); screen readers use heading hierarchy for navigation.`);
      prevLevel = level; prevText = headingText;
    }
  }

  // ── a11y / motion (anti-patterns §5/§7) ──────────────────────────────────────
  for (const m of text.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt\s*=/.test(m[0])) add('error', 'img-alt', 'anti-patterns §7', m.index, '<img> without alt — add alt text (alt="" if decorative).');
  }
  for (const m of text.matchAll(/addEventListener\(\s*["']scroll["']|onscroll\s*=/g)) {
    add('error', 'scroll-listener', 'anti-patterns §5', m.index,
      'scroll event listener — use IntersectionObserver / CSS scroll-driven animation instead (continuous reflows).');
  }
  for (const m of text.matchAll(/transition\s*:[^;}]*\b(top|left|width|height)\b|\b(top|left|width|height)\s+\d[\d.]*m?s\b/g)) {
    add('warn', 'layout-anim', 'anti-patterns §5', m.index, 'animating a layout property — animate transform/opacity only.');
  }
  for (const m of text.matchAll(/\b(100vh|h-screen)\b/g)) {
    add('warn', 'viewport-height', 'anti-patterns §5', m.index, `\`${m[1]}\` — use 100dvh / min-h-[100dvh] (iOS Safari viewport jump).`);
  }
  if (/(@keyframes|animation\s*:|animation-name\s*:|transition\s*:)/.test(text) && !/prefers-reduced-motion/.test(text)) {
    const i = (text.match(/@keyframes|animation\s*:|transition\s*:/) || { index: 0 }).index;
    add('warn', 'reduced-motion', 'anti-patterns §5', i, 'motion present but no prefers-reduced-motion fallback.');
  }

  // dedupe by rule+line, cap per rule
  return capAndSort(findings);
}

function resolveColor(raw, T) {
  const v = raw.trim();
  const vm = v.match(/var\(\s*(--[\w-]+)/);
  if (vm) return T.varColor.get(vm[1]) || null;
  return parseColor((v.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/) || [])[0]);
}
function relLum({ r, g, b }) {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a, b) {
  const la = relLum(a), lb = relLum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
function capAndSort(findings) {
  const byRule = new Map();
  const kept = [];
  const dropped = new Map();
  const seen = new Set();
  for (const f of findings) {
    const key = `${f.rule}:${f.line}:${f.message}`;
    if (seen.has(key)) continue; seen.add(key);
    const n = (byRule.get(f.rule) || 0) + 1; byRule.set(f.rule, n);
    if (n <= 8) kept.push(f); else dropped.set(f.rule, (dropped.get(f.rule) || 0) + 1);
  }
  for (const [rule, n] of dropped) kept.push({ level: 'warn', rule, section: '', line: 0, message: `…and ${n} more \`${rule}\` occurrence(s).`, fix: null });
  return kept.sort((a, b) => (a.line - b.line) || (a.level === b.level ? 0 : a.level === 'error' ? -1 : 1));
}

export function lintFile(file, opts = {}) {
  let text;
  try { text = readFileSync(file, 'utf8'); } catch { return []; }
  return lintText(file, text, opts);
}

export const errorCount = (f) => f.filter((x) => x.level === 'error').length;
export const warnCount = (f) => f.filter((x) => x.level === 'warn').length;

/** human-readable report for a {file: findings} map */
export function formatReport(byFile) {
  const lines = [];
  let e = 0, w = 0;
  for (const [file, findings] of Object.entries(byFile)) {
    if (!findings.length) continue;
    lines.push(file);
    for (const f of findings) {
      if (f.level === 'error') e++; else w++;
      const tag = f.level === 'error' ? 'ERROR' : 'warn ';
      const loc = f.line ? `L${f.line}`.padEnd(5) : '     ';
      const sec = f.section ? `  [${f.section}]` : '';
      lines.push(`  ${tag} ${loc} ${f.rule.padEnd(14)} ${f.message}${sec}`);
    }
  }
  lines.push(`${e} error${e === 1 ? '' : 's'}, ${w} warning${w === 1 ? '' : 's'}`);
  return lines.join('\n');
}

// ── CLI ──────────────────────────────────────────────────────────────────────
if (resolve(process.argv[1] || '') === resolve(fileURLToPath(import.meta.url))) {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');
  const useStdin = args.includes('--stdin');
  const houseTokens = args.includes('--house-tokens'); // --stdin defaults to false (external code)
  const nameIdx = args.indexOf('--name');
  const label = (nameIdx !== -1 && args[nameIdx + 1]) ? args[nameIdx + 1] : 'stdin.html';
  const files = useStdin ? [] : args.filter((a, i) => !a.startsWith('--') && !(nameIdx !== -1 && i === nameIdx + 1));
  const byFile = {};
  if (useStdin) byFile[label] = lintText(label, readFileSync(0, 'utf8'), { houseTokens });
  else for (const f of files) byFile[f] = lintFile(resolve(f));
  if (asJson) { console.log(JSON.stringify(byFile, null, 2)); }
  else { console.log(formatReport(byFile)); }
  const errors = Object.values(byFile).reduce((n, fs) => n + errorCount(fs), 0);
  process.exit(errors ? 1 : 0);
}
