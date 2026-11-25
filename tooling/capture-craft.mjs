// Craft-capture: the structural / quality layers a screenshot throws away. Built for
// the "top-tier" bar — fold in everything of value. Merged into raw/<slug>.json under
// `craft`. All read-only; robots/load handled by the caller (capture.mjs).
//
//   responsive   — desktop↔mobile layout deltas (column collapse, type shift, nav→hamburger)
//   type_detail  — fluid clamp(), per-size tracking, font-feature-settings, families
//   elevation    — full box-shadow scale + gradient definitions actually used
//   grid         — grid-template-columns + flex-band columns, gutter, container max-width
//   a11y         — focus-visible, tap-target sizes, alt-text ratio, reduced-motion
//   states       — focus / disabled recipes for interactive elements (Node-driven)
//   theme        — dark-mode palette (separate prefers-color-scheme: dark context)

const pickk = (obj, keys) => keys.reduce((o, k) => ((o[k] = obj[k]), o), {});

// ── in-page profiler (serialized; no module-scope refs) ──
function craftProfileFn() {
  const css = (el) => getComputedStyle(el);
  const rank = (o, k = 6) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, k).map(([v]) => v);

  // type detail
  const families = new Set(); const trackBySize = {};
  for (const el of [...document.querySelectorAll('h1,h2,h3,p,body')].slice(0, 200)) {
    const c = css(el);
    families.add(c.fontFamily.split(',')[0].replace(/["']/g, '').trim());
    if (c.letterSpacing && c.letterSpacing !== 'normal') trackBySize[c.fontSize] = c.letterSpacing;
  }

  // stylesheet scans (same-origin only; CORS sheets skipped)
  let fluidType = false, focusVisible = false, prm = false; const fontFeatures = new Set();
  for (const ss of [...document.styleSheets]) {
    let rules; try { rules = ss.cssRules; } catch (e) { continue; }
    if (!rules) continue;
    for (const r of [...rules]) {
      try {
        const t = r.cssText || '';
        if (!fluidType && /font-size:\s*clamp\(/i.test(t)) fluidType = true;
        if (!focusVisible && /:focus-visible/.test(t)) focusVisible = true;
        if (r.style) {
          const ff = r.style.fontFeatureSettings; if (ff && ff !== 'normal') fontFeatures.add(ff);
          const fv = r.style.fontVariantNumeric; if (fv && fv !== 'normal') fontFeatures.add(fv);
        }
        if (r.type === 4 && /prefers-reduced-motion/i.test(r.conditionText || '')) prm = true;
      } catch (e) {}
    }
  }

  // elevation + gradients + grids + flex bands + container width (one sweep)
  const shadows = {}, grads = {}, gridCols = {}, flexCols = {}, gaps = {}, maxW = {};
  const vw = window.innerWidth;
  let n = 0;
  for (const el of document.querySelectorAll('body *')) {
    if (n++ > 4000) break;
    const c = css(el);
    if (c.boxShadow && c.boxShadow !== 'none') shadows[c.boxShadow.slice(0, 120)] = (shadows[c.boxShadow.slice(0, 120)] || 0) + 1;
    if (c.backgroundImage && /gradient\(/.test(c.backgroundImage)) grads[c.backgroundImage.slice(0, 120)] = (grads[c.backgroundImage.slice(0, 120)] || 0) + 1;
    const disp = c.display;
    // explicit CSS grid
    if (disp === 'grid' && c.gridTemplateColumns && c.gridTemplateColumns !== 'none') {
      const cols = c.gridTemplateColumns.split(' ').filter(Boolean).length; gridCols[cols] = (gridCols[cols] || 0) + 1;
    }
    // flex/band column structure — wide row-flex containers with a handful of visible children
    if ((disp === 'flex' || disp === 'inline-flex') && (c.flexDirection || 'row').startsWith('row')) {
      const rect = el.getBoundingClientRect();
      if (rect.width >= vw * 0.45) {
        let kids = 0;
        for (const k of el.children) { const r = k.getBoundingClientRect(); if (r.width > 0 && r.height > 0) kids++; }
        if (kids >= 2 && kids <= 12) flexCols[kids] = (flexCols[kids] || 0) + 1;
      }
    }
    // gutter (grid or flex)
    const gap = c.columnGap && c.columnGap !== 'normal' ? c.columnGap : (c.gap && c.gap !== 'normal' ? c.gap : '');
    if (gap && /^[0-9]/.test(gap) && parseFloat(gap) > 0 && (disp === 'grid' || disp === 'flex' || disp === 'inline-flex')) {
      gaps[gap] = (gaps[gap] || 0) + 1;
    }
    // content container max-width (skip small components + full-bleed)
    const mw = c.maxWidth;
    if (mw && /px$/.test(mw)) { const px = parseFloat(mw); if (px >= 480 && px <= 2000) maxW[mw] = (maxW[mw] || 0) + 1; }
  }

  // a11y
  const inter = [...document.querySelectorAll('button,a,[role="button"],input,select,textarea')];
  let small = 0;
  for (const b of inter) { const r = b.getBoundingClientRect(); if (r.width > 0 && r.height > 0 && (r.width < 40 || r.height < 40)) small++; }
  const imgs = [...document.querySelectorAll('img')];
  const withAlt = imgs.filter((i) => i.hasAttribute('alt')).length;

  // layout (for the responsive diff)
  const h1 = document.querySelector('h1'); const h1c = h1 ? css(h1) : null;
  const navLinks = [...document.querySelectorAll('header a,nav a')].filter((a) => {
    const r = a.getBoundingClientRect(); const c = css(a);
    return r.width > 0 && c.display !== 'none' && c.visibility !== 'hidden';
  }).length;

  return {
    layout: {
      vw: window.innerWidth,
      h1: h1c ? { size: h1c.fontSize, lh: h1c.lineHeight, tracking: h1c.letterSpacing } : null,
      body: { size: css(document.body).fontSize },
      gridCols: rank(gridCols, 4),
      navVisibleLinks: navLinks,
    },
    type_detail: {
      families: [...families].filter(Boolean).slice(0, 4),
      tracking_by_size: Object.entries(trackBySize).slice(0, 8).map(([size, tracking]) => ({ size, tracking })),
      font_features: [...fontFeatures].slice(0, 4),
      fluid_type: fluidType,
    },
    elevation: { shadows: rank(shadows, 6), gradients: rank(grads, 6) },
    grid: { columns: rank(gridCols, 4), flex_columns: rank(flexCols, 4), gap: rank(gaps, 4), container_max_width: rank(maxW, 3) },
    a11y: {
      focus_visible: focusVisible,
      small_tap_targets: small,
      interactive_count: inter.length,
      img_count: imgs.length,
      img_alt_ratio: imgs.length ? +(withAlt / imgs.length).toFixed(2) : null,
      reduced_motion: prm,
    },
  };
}

export async function craftProfile(page) {
  return page.evaluate(craftProfileFn).catch(() => null);
}

// focus / disabled recipes (needs real focus() from Node)
export async function captureStates(page) {
  const out = { focus: [], disabled: [] };
  const read = (el) => {
    const c = getComputedStyle(el);
    return {
      outline: c.outlineStyle !== 'none' ? `${c.outlineWidth} ${c.outlineColor}` : 'none',
      shadow: c.boxShadow, border: c.borderColor, bg: c.backgroundColor,
    };
  };
  let handles = [];
  try { handles = await page.$$('button, a, input, [role="button"]'); } catch (e) { return out; }
  let tried = 0;
  for (const h of handles) {
    if (out.focus.length >= 8 || tried >= 30) break;
    tried++;
    let box; try { box = await h.boundingBox(); } catch (e) { box = null; }
    if (!box || box.width < 8 || box.y > 3000) continue;
    try {
      const before = await h.evaluate(read);
      await h.focus();
      await page.waitForTimeout(60);
      const after = await h.evaluate(read);
      const changed = Object.keys(before).filter((k) => before[k] !== after[k]);
      if (changed.length) {
        const meta = await h.evaluate((el) => ({ tag: el.tagName.toLowerCase(), text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24) }));
        out.focus.push({ el: meta.text ? `${meta.tag} ${meta.text}` : meta.tag, focus: pickk(after, changed) });
      }
      await page.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());
    } catch (e) {}
  }
  try {
    const dis = await page.$$('[disabled],[aria-disabled="true"]');
    if (dis[0]) out.disabled.push(await dis[0].evaluate((el) => { const c = getComputedStyle(el); return { opacity: c.opacity, bg: c.backgroundColor, color: c.color, cursor: c.cursor }; }));
  } catch (e) {}
  return out;
}

// Dark-scheme pass: load with prefers-color-scheme: dark, decide whether the site actually
// re-themes (body luminance), and if it does, sample a real dark palette (frequency over the
// first ~300 elements) and save a full-page desktop-dark.png next to the light captures —
// the dark axis of the corpus (distilled into the snapshot's `color.dark`).
export async function captureTheme(browser, url, UA, viewport, shotDir = null) {
  const out = { supportsDark: false, dark: null, error: null };
  const ctx = await browser.newContext({ userAgent: UA, viewport, colorScheme: 'dark' });
  try {
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(1500);
    out.dark = await p.evaluate(() => {
      const css = (el) => getComputedStyle(el);
      const cta = document.querySelector('button, a[class*="btn" i], [class*="button" i]'); const link = document.querySelector('a');
      const freq = { bg: new Map(), fg: new Map(), border: new Map() };
      const bump = (map, v) => { if (v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent') map.set(v, (map.get(v) || 0) + 1); };
      for (const el of [...document.querySelectorAll('body *')].slice(0, 300)) {
        const s = css(el);
        bump(freq.bg, s.backgroundColor);
        bump(freq.fg, s.color);
        if (s.borderTopWidth !== '0px') bump(freq.border, s.borderTopColor);
      }
      const top = (map, n) => [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([v]) => v);
      return {
        bg: css(document.body).backgroundColor,
        fg: css(document.body).color,
        accent: cta ? css(cta).backgroundColor : (link ? css(link).color : null),
        surfaces: top(freq.bg, 4),
        text: top(freq.fg, 3),
        borders: top(freq.border, 2),
      };
    });
    const m = (out.dark.bg || '').match(/\d+/g);
    if (m) { const [r, g, b] = m.map(Number); out.supportsDark = (0.2126 * r + 0.7152 * g + 0.0722 * b) < 110; }
    if (out.supportsDark && shotDir) {
      // settle lazy content, then shoot from the top
      for (let i = 0; i < 6; i++) { await p.evaluate((y) => window.scrollBy(0, y), 1200); await p.waitForTimeout(250); }
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.waitForTimeout(400);
      await p.screenshot({ path: `${shotDir}/desktop-dark.png`, fullPage: true });
      out.screenshot = 'desktop-dark.png';
    }
  } catch (e) { out.error = e.message; }
  await ctx.close();
  return out;
}

export function diffResponsive(desk, mob) {
  if (!desk || !mob) return null;
  const d = desk.layout, m = mob.layout;
  return {
    desktop_vw: d.vw, mobile_vw: m.vw,
    h1_size: { desktop: d.h1 && d.h1.size, mobile: m.h1 && m.h1.size },
    body_size: { desktop: d.body.size, mobile: m.body.size },
    grid_collapse: { desktop: d.gridCols, mobile: m.gridCols },
    nav: { desktop_links: d.navVisibleLinks, mobile_links: m.navVisibleLinks, likely_hamburger: (d.navVisibleLinks - m.navVisibleLinks) >= 2 },
  };
}
