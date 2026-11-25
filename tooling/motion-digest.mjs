#!/usr/bin/env node
// Aggregate the motion + craft layers across every raw/<slug>.json into a digest:
// technique frequencies, triggers, libraries, tuned params, interaction inventory,
// and craft signals. Feeds the technique catalog + the motion "key" (re-run as the
// corpus grows). Reads only; prints a compact summary (no raw dumps).
//   node tooling/motion-digest.mjs

import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(ROOT, 'raw');

const bump = (o, k, n = 1) => { if (k == null || k === '') return; o[k] = (o[k] || 0) + n; };
const rank = (o, k = 20) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, k);

function normKind(e) {
  const k = (e.kind || '').toLowerCase();
  if (/canvas|webgl|three|shader|particle|point-?cloud|perspective|\b3d\b/.test(k)) return 'webgl-3d';
  if (k.includes('rotate')) return 'scroll-rotate';
  if (k.includes('scale')) return 'scroll-scale';
  if (k.includes('parallax') || k.startsWith('transform') || k.includes('translate')) return 'parallax-translate';
  if (k.includes('color-shift') || e.property === 'color') return 'scroll-color-shift';
  if (k.includes('background')) return 'scroll-background-shift';
  if (k.includes('pin')) return 'sticky-pin';
  if (k.includes('clip')) return 'clip-reveal';
  if (k.includes('filter') || k.includes('blur')) return 'scroll-filter';
  if (k.includes('fade') || e.property === 'opacity') return 'in-view-fade-reveal';
  return (k.split(' ')[0] || 'other');
}

const kinds = {}, triggers = {}, libs = {}, eases = {}, durs = {}, iothr = {}, interactive = {}, hoverProps = {}, typeFamilies = {}, fontFeatures = {};
let withMotion = 0, withCraft = 0, dark = 0, fluid = 0, focusVis = 0, hamburger = 0, reducedMotion = 0;
let sEntrance = 0, sHover = 0, sCursor = 0;
const perSite = [];

for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  let j; try { j = JSON.parse(readFileSync(join(dir, f), 'utf8')); } catch (e) { continue; }
  const slug = f.replace(/\.json$/, ''); const m = j.motion, c = j.craft;
  const kc = {};
  if (m) {
    withMotion++;
    (m.scroll_effects || []).forEach((e) => { bump(kinds, normKind(e)); bump(kc, normKind(e)); bump(triggers, e.trigger); });
    (m.summary?.libraries || []).forEach((l) => bump(libs, l));
    (m.params?.easings || []).forEach((x) => bump(eases, x));
    (m.params?.durations_ms || []).forEach((x) => bump(durs, x));
    (m.params?.io_thresholds || []).forEach((x) => bump(iothr, x));
    (m.hover || []).forEach((h) => (h.changed || []).forEach((p) => bump(hoverProps, p)));
    const inter = m.interactive || {}; for (const k in inter) if (inter[k] > 0) bump(interactive, k);
    if ((m.summary?.entranceReveals || 0) > 0) sEntrance++;
    if ((m.summary?.hoverEffects || 0) > 0) sHover++;
    if ((m.summary?.cursorFollowers || 0) > 0) sCursor++;
  }
  if (c) {
    withCraft++;
    if (c.theme?.supportsDark) dark++;
    if (c.type_detail?.fluid_type) fluid++;
    if (c.a11y?.focus_visible) focusVis++;
    if (c.responsive?.nav?.likely_hamburger) hamburger++;
    if (c.a11y?.reduced_motion) reducedMotion++;
    (c.type_detail?.families || []).forEach((x) => bump(typeFamilies, x));
    (c.type_detail?.font_features || []).forEach((x) => bump(fontFeatures, x));
  }
  if (m || c) perSite.push({ slug, libs: m?.summary?.libraries || [], top: Object.entries(kc).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k), fx: (m?.scroll_effects || []).length, hover: m?.summary?.hoverEffects || 0 });
}

console.log(`profiles withMotion=${withMotion} withCraft=${withCraft}`);
console.log('\nTECHNIQUES (scroll):', JSON.stringify(rank(kinds)));
console.log('TRIGGERS:', JSON.stringify(rank(triggers)));
console.log('INTERACTION:', JSON.stringify(rank(interactive)), `| sites w/ entrance=${sEntrance} hover=${sHover} cursor=${sCursor}`);
console.log('HOVER PROPS:', JSON.stringify(rank(hoverProps)));
console.log('LIBS:', JSON.stringify(rank(libs)));
console.log('\nEASINGS:', JSON.stringify(rank(eases, 12)));
console.log('DURATIONS_ms:', JSON.stringify(rank(durs, 12)));
console.log('IO_THRESHOLDS:', JSON.stringify(rank(iothr)));
console.log(`\nCRAFT /${withCraft}: dark=${dark} fluidType=${fluid} focusVisible=${focusVis} hamburger=${hamburger} reducedMotion=${reducedMotion}`);
console.log('TYPE FAMILIES:', JSON.stringify(rank(typeFamilies, 16)));
console.log('FONT FEATURES:', JSON.stringify(rank(fontFeatures)));

// WebGL / 3D depth layer — surface the distilled depth techniques so the motion "key" 3D section stays current on regenerate.
const webglLibSites = perSite.filter((s) => s.libs.some((l) => /three|r3f|webgl|spline|babylon/i.test(l))).length;
const RE3D = /webgl|canvas|3d|perspective|cube|sphere|particle|point-?cloud|shader|tumble/i;
const SKIP3D = /canvas-(cream|tan|fade)|lavender-canvas|scroll-linked-canvas-warm/i;
const tech3d = {};
for (const sub of ['production', 'expressive']) {
  const tdir = join(ROOT, 'corpus', sub, 'tokens');
  let entries; try { entries = readdirSync(tdir); } catch { continue; }
  for (const f of entries.filter((x) => x.endsWith('.json'))) {
    let j; try { j = JSON.parse(readFileSync(join(tdir, f), 'utf8')); } catch { continue; }
    const mo = j.motion || {};
    const names = new Set([
      ...(mo.techniques || []),
      ...(mo.scroll_effects || []).map((e) => e.name).filter(Boolean),
      ...(mo.patterns_to_build || []).map((p) => String(p).split(/\s+[—–-]\s+/)[0].trim()),
    ]);
    for (const n of names) if (RE3D.test(n) && !SKIP3D.test(n)) bump(tech3d, n);
  }
}
console.log('\nWEBGL/3D: sites w/ 3D lib =', webglLibSites, '| + canvas-interactive sites in INTERACTION.canvas above');
console.log("WEBGL/3D TECHNIQUES (distilled, feeds the key's 3D section):", JSON.stringify(rank(tech3d, 30)));

console.log('\nPER-SITE:');
for (const s of perSite) console.log(`  ${s.slug}: fx=${s.fx} hover=${s.hover} libs=[${s.libs.join(',')}] top=[${s.top.join(', ')}]`);
