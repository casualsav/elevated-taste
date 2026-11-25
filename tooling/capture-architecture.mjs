// Page-architecture probe: the STRUCTURAL layers a screenshot + flat style-tally miss —
// fixed/sticky stacking, full-viewport backdrops, blend/glass overlays, transparent
// scroll sections, design-token surface, font/breakpoint/resource stack. Merged into
// raw/<slug>.json under `architecture`; the distiller reads it to name the mechanism.
// Read-only; every block is independently guarded so one bad probe can't sink the rest.

// ── in-page profiler (serialized; no module-scope refs) ──
function architectureProfileFn() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const csCache = new Map();
  const gcs = (el) => { let c = csCache.get(el); if (!c) { c = getComputedStyle(el); csCache.set(el, c); } return c; };
  const hint = (el) => {
    const id = el.id ? '#' + el.id : '';
    const cls = String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : (el.className || '')).trim().slice(0, 80);
    return el.tagName.toLowerCase() + id + (cls ? ' ' + cls : '');
  };
  const bgInfo = (cs) => {
    const color = cs.backgroundColor || 'rgba(0, 0, 0, 0)';
    let alpha = 1;
    if (color === 'transparent') alpha = 0;
    else { const m = color.match(/[\d.]+/g) || []; if (m.length === 4) alpha = parseFloat(m[3]); else if (color === 'rgba(0, 0, 0, 0)') alpha = 0; }
    const hasImage = !!(cs.backgroundImage && cs.backgroundImage !== 'none');
    return { color, alpha: +alpha.toFixed(3), hasImage };
  };
  const els = Array.from(document.querySelectorAll('body *')).slice(0, 8000);

  const out = {};
  const run = (name, fn) => { try { out[name] = fn(); } catch (e) { out[name] = { error: String(e && e.message || e) }; } };

  // 1. fixed/sticky stacking layers + role guess
  run('layers', () => {
    const layers = [];
    let fixed = 0, sticky = 0, hasBackdrop = false, hasBlend = false;
    for (const el of els) {
      const cs = gcs(el);
      const pos = cs.position;
      if (pos !== 'fixed' && pos !== 'sticky') continue;
      if (pos === 'fixed') fixed++; else sticky++;
      const r = el.getBoundingClientRect();
      const wPct = Math.round(r.width / vw * 100), hPct = Math.round(r.height / vh * 100);
      const zRaw = cs.zIndex;
      const zIndex = zRaw === 'auto' ? null : (Number.isNaN(parseInt(zRaw, 10)) ? null : parseInt(zRaw, 10));
      const mbm = cs.mixBlendMode || 'normal';
      const bdf = cs.backdropFilter || cs.webkitBackdropFilter || 'none';
      const bg = bgInfo(cs);
      const petNone = cs.pointerEvents === 'none';
      const filling = wPct >= 90 && hPct >= 90;
      const nearTop = r.top <= vh * 0.15, nearBottom = r.bottom >= vh * 0.85 && r.top > vh * 0.5;
      let role = 'other';
      if (filling && zIndex !== null && zIndex < 0) { role = 'static-backdrop'; hasBackdrop = true; }
      else if (filling && petNone && mbm !== 'normal') { role = 'blend-overlay'; hasBlend = true; }
      else if (filling && petNone) role = 'overlay';
      else if (nearTop && hPct <= 20) role = 'pinned-header';
      else if (nearBottom && hPct <= 25) role = 'pinned-footer-cta';
      if (layers.length < 40) layers.push({
        hint: hint(el), position: pos, zIndex, coverage: { wPct, hPct },
        top: signOf(cs.top), left: signOf(cs.left),
        mixBlendMode: mbm !== 'normal' ? mbm : undefined,
        backdropFilter: bdf !== 'none' ? bdf.slice(0, 80) : undefined,
        pointerEvents: cs.pointerEvents, opacity: cs.opacity, bg, role,
      });
    }
    out.layers_summary = { fixed, sticky, has_static_backdrop: hasBackdrop, has_blend_overlay: hasBlend };
    return layers;
  });
  function signOf(v) { if (!v || v === 'auto') return 'auto'; const n = parseFloat(v); if (Number.isNaN(n)) return 'auto'; return n === 0 ? '0' : (n > 0 ? '+' : '-'); }

  // 2. section-level surfaces — transparent/translucent scroll blocks
  run('surfaces', () => {
    const seen = new Set();
    const cands = Array.from(document.querySelectorAll('section'));
    const main = document.querySelector('main');
    if (main) for (const c of main.children) cands.push(c);
    const blocks = []; let totalH = 0, transH = 0, transN = 0;
    for (const el of cands) {
      if (seen.has(el)) continue; seen.add(el);
      const h = el.getBoundingClientRect().height;
      if (h < 240) continue;
      const bg = bgInfo(gcs(el));
      const transparent = bg.alpha < 0.05 && !bg.hasImage;
      const translucent = bg.alpha >= 0.05 && bg.alpha < 0.95 && !bg.hasImage;
      totalH += h; if (transparent) { transH += h; transN++; }
      if (blocks.length < 40) blocks.push({ hint: hint(el), heightPx: Math.round(h), bg, transparent, translucent });
    }
    return { blocks, summary: { blocks: blocks.length, transparent_blocks: transN, transparent_height_pct: totalH ? Math.round(transH / totalH * 100) : 0 } };
  });

  // 3. blend / glass census
  run('blend_glass', () => {
    const mix = {}, mixEx = {}, bgb = {}, bgbEx = {}, bdf = {}, bdfEx = {};
    const bump = (map, ex, v, el) => { map[v] = (map[v] || 0) + 1; if (!ex[v]) ex[v] = hint(el); };
    for (const el of els) {
      const cs = gcs(el);
      const m = cs.mixBlendMode; if (m && m !== 'normal') bump(mix, mixEx, m, el);
      const b = cs.backgroundBlendMode; if (b && b !== 'normal') bump(bgb, bgbEx, b, el);
      const f = cs.backdropFilter || cs.webkitBackdropFilter; if (f && f !== 'none') bump(bdf, bdfEx, f.slice(0, 60), el);
    }
    const top = (map, ex) => Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([value, count]) => ({ value, count, example: ex[value] }));
    return { mix_blend_mode: top(mix, mixEx), background_blend_mode: top(bgb, bgbEx), backdrop_filter: top(bdf, bdfEx) };
  });

  // 4. z-index stack among positioned elements
  run('z_stack', () => {
    const zmap = {}; const zels = [];
    for (const el of els) {
      const cs = gcs(el);
      if (cs.position === 'static') continue;
      const z = cs.zIndex; if (z === 'auto') continue;
      const n = parseInt(z, 10); if (Number.isNaN(n)) continue;
      zmap[n] = (zmap[n] || 0) + 1; zels.push({ z: n, hint: hint(el) });
    }
    const values = Object.entries(zmap).map(([z, count]) => ({ z: +z, count })).sort((a, b) => b.z - a.z).slice(0, 15);
    const top = zels.sort((a, b) => b.z - a.z).slice(0, 5).map((e) => e.hint);
    return { values, top };
  });

  // 5. design tokens (custom properties)
  run('tokens', () => {
    const rootCS = getComputedStyle(document.documentElement);
    const sample = {}; let count = 0;
    for (let i = 0; i < rootCS.length; i++) {
      const name = rootCS[i];
      if (!name.startsWith('--')) continue;
      count++;
      if (Object.keys(sample).length < 150) sample[name] = rootCS.getPropertyValue(name).trim().slice(0, 120);
    }
    if (count === 0) { // fallback: parse :root/html rules
      for (const ss of document.styleSheets) {
        let rules; try { rules = ss.cssRules; } catch (e) { continue; }
        if (!rules) continue;
        for (const r of rules) {
          if (r.type === 1 && /(^|,)\s*(:root|html)\b/.test(r.selectorText || '') && r.style) {
            for (let i = 0; i < r.style.length; i++) {
              const name = r.style[i];
              if (!name.startsWith('--')) continue;
              count++;
              if (!(name in sample) && Object.keys(sample).length < 150) sample[name] = r.style.getPropertyValue(name).trim().slice(0, 120);
            }
          }
        }
      }
    }
    return { count, sample };
  });

  // 6. @font-face + loaded families
  run('fonts', () => {
    const faces = []; const families = new Set();
    outer: for (const ss of document.styleSheets) {
      let rules; try { rules = ss.cssRules; } catch (e) { continue; }
      if (!rules) continue;
      for (const r of rules) {
        if (r.type !== 5 || !r.style) continue; // CSSFontFaceRule
        const s = r.style;
        const srcRaw = s.src || '';
        const um = srcRaw.match(/url\(([^)]+)\)/);
        let src_host = 'inline/self';
        if (um) { try { src_host = new URL(um[1].replace(/["']/g, ''), location.href).hostname; } catch (e) {} }
        const fm = srcRaw.match(/format\(([^)]+)\)/);
        faces.push({
          family: (s.fontFamily || '').replace(/["']/g, ''), weight: s.fontWeight || 'normal',
          style: s.fontStyle || 'normal', src_host, format: fm ? fm[1].replace(/["']/g, '') : null,
        });
        if (faces.length >= 20) break outer;
      }
    }
    try { for (const f of document.fonts) { families.add((f.family || '').replace(/["']/g, '')); if (families.size >= 15) break; } } catch (e) {}
    return { faces, loaded_families: [...families].slice(0, 15) };
  });

  // 7. media-query breakpoints
  run('breakpoints', () => {
    const set = new Set();
    const walk = (rules) => {
      for (const r of rules) {
        if (r.type === 4) {
          const ct = r.conditionText || (r.media && r.media.mediaText) || '';
          const ms = ct.match(/(?:min|max)-width:\s*[\d.]+px/g) || [];
          for (const s of ms) set.add(parseFloat(s.match(/([\d.]+)px/)[1]));
          if (r.cssRules) walk(r.cssRules);
        }
      }
    };
    for (const ss of document.styleSheets) { let rules; try { rules = ss.cssRules; } catch (e) { continue; } if (rules) walk(rules); }
    return [...set].sort((a, b) => a - b).slice(0, 20);
  });

  // 8. element census + landmarks + headings
  run('element_census', () => {
    const q = (s) => document.querySelectorAll(s).length;
    let scrollSnap = 0;
    for (const el of els) { const t = gcs(el).scrollSnapType; if (t && t !== 'none') scrollSnap++; }
    return {
      counts: { canvas: q('canvas'), svg_inline: q('svg'), video: q('video'), iframe: q('iframe'), picture: q('picture'), form: q('form'), input: q('input'), button: q('button'), details: q('details'), dialog: q('dialog') },
      landmarks: { header: q('header'), nav: q('nav'), main: q('main'), footer: q('footer'), aside: q('aside') },
      headings: { h1: q('h1'), h2: q('h2'), h3: q('h3'), h4: q('h4'), h5: q('h5'), h6: q('h6') },
      scroll_snap: scrollSnap,
    };
  });

  // 9. images
  run('images', () => {
    const imgs = Array.from(document.querySelectorAll('img[src]'));
    const formats = {}; let withSrcset = 0, lazy = 0;
    for (const im of imgs) {
      if (im.getAttribute('srcset')) withSrcset++;
      if (im.getAttribute('loading') === 'lazy') lazy++;
      const src = im.getAttribute('src') || '';
      let ext;
      if (src.startsWith('data:')) ext = 'data';
      else { try { const m = new URL(src, location.href).pathname.match(/\.([a-z0-9]+)$/i); ext = m ? m[1].toLowerCase() : 'other'; } catch (e) { ext = 'other'; } }
      formats[ext] = (formats[ext] || 0) + 1;
    }
    const fmt = Object.entries(formats).sort((a, b) => b[1] - a[1]).slice(0, 10).reduce((o, [k, v]) => ((o[k] = v), o), {});
    return { total: imgs.length, with_srcset: withSrcset, lazy, formats: fmt };
  });

  // 10. third-party resource hosts (stack / CDN reveal)
  run('resources', () => {
    const entries = performance.getEntriesByType('resource');
    const pageHost = location.hostname;
    const hosts = {};
    for (const e of entries) {
      let h; try { h = new URL(e.name).hostname; } catch (err) { continue; }
      if (!h || h === pageHost) continue;
      (hosts[h] ||= { count: 0, kinds: new Set() });
      hosts[h].count++; hosts[h].kinds.add(e.initiatorType);
    }
    return Object.entries(hosts).sort((a, b) => b[1].count - a[1].count).slice(0, 20).map(([host, v]) => ({ host, count: v.count, kinds: [...v.kinds] }));
  });

  // 11. layout primitives
  run('layout', () => {
    let grid = 0, flex = 0, iflex = 0, igrid = 0, ar = 0; const widths = {};
    for (const el of els) {
      const cs = gcs(el);
      const d = cs.display;
      if (d === 'grid') grid++; else if (d === 'flex') flex++; else if (d === 'inline-flex') iflex++; else if (d === 'inline-grid') igrid++;
      if (cs.aspectRatio && cs.aspectRatio !== 'auto') ar++;
      const mw = cs.maxWidth; if (mw && mw !== 'none') widths[mw] = (widths[mw] || 0) + 1;
    }
    const container_widths = Object.entries(widths).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([width, count]) => ({ width, count }));
    return { display: { grid, flex, inline_flex: iflex, inline_grid: igrid }, container_widths, aspect_ratio_used: ar };
  });

  // 12. document meta
  run('meta', () => {
    const g = (sel) => document.querySelector(sel);
    const colorScheme = g('meta[name="color-scheme"]')?.content || getComputedStyle(document.documentElement).colorScheme || null;
    return {
      color_scheme: colorScheme,
      theme_color: g('meta[name="theme-color"]')?.content || null,
      has_og_image: !!g('meta[property="og:image"]'),
      viewport_meta: g('meta[name="viewport"]')?.content || null,
    };
  });

  return out;
}

export async function architectureProfile(page) {
  return page.evaluate(architectureProfileFn);
}
