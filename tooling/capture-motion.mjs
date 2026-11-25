// Interaction & motion capture for the design corpus. Stills can't show behavior,
// so this adds three sensing methods (locked spec) on top of the static profile:
//
//   1. Scroll-state diffing   — drive the page through N scroll stops and diff each
//      tracked element's computed style/transform to detect what ACTUALLY changes
//      (reveal, color-shift, parallax, rotate, scale, pin). Library-agnostic: it
//      reads the rendered effect, however it's implemented.
//   2. Library/source fingerprint — detect GSAP/Framer/Lenis/Lottie/Three/Swiper/…,
//      read @keyframes + animation-/transition rule counts, and BEHAVIORAL probes
//      (IntersectionObserver, scroll/mousemove listeners, rAF) installed BEFORE the
//      page's own scripts run. Captures the *tools used*.
//   3. Scroll-through frames  — viewport stills across the scroll, for an Opus vision
//      pass during distillation to narrate choreography the DOM diff can't name.
//
// Plus entrance/load choreography, hover & cursor effects, and a best-effort
// click/drag/tap catalog. Everything is merged into raw/<slug>.json under `motion`;
// frames go to corpus/<corpus>/screenshots/<slug>/frames/ (gitignored, private ref).

import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

// ── Installed via context.addInitScript BEFORE navigation, so it wraps the native
// APIs before the page's own bundles call them. Pure string (runs in the page). ──
export const PROBE_INIT = `(() => {
  const mp = (window.__mp = { io: 0, ioTargets: 0, scroll: 0, mousemove: 0, raf: 0, ioConfigs: [] });
  try {
    const OIO = window.IntersectionObserver;
    if (OIO) {
      const Wrapped = function (cb, opts) {
        mp.io++;
        try { if (opts) mp.ioConfigs.push({ threshold: opts.threshold, rootMargin: opts.rootMargin }); } catch (e) {}
        const inst = new OIO(cb, opts);
        const obs = inst.observe.bind(inst);
        inst.observe = (el) => { mp.ioTargets++; return obs(el); };
        return inst;
      };
      Wrapped.prototype = OIO.prototype;
      window.IntersectionObserver = Wrapped;
    }
  } catch (e) {}
  try {
    const oAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, ...rest) {
      if (type === 'scroll') mp.scroll++;
      else if (type === 'mousemove' || type === 'pointermove') mp.mousemove++;
      return oAdd.call(this, type, ...rest);
    };
  } catch (e) {}
  try {
    const oRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = function (cb) { mp.raf++; return oRaf.call(window, cb); };
  } catch (e) {}
})();`;

// ─────────────────────────── in-page samplers (serialized) ───────────────────────────
// These run in the browser; they must not reference any module-scope identifier.

function tagCandidates(opts) {
  const viewportOnly = opts && opts.viewportOnly;
  document.querySelectorAll('[data-mp]').forEach((e) => e.removeAttribute('data-mp'));
  const out = [];
  const all = document.querySelectorAll('body *');
  let idx = 0;
  for (const el of all) {
    if (out.length >= 500) break;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 6) continue;
    if (viewportOnly && (r.top > window.innerHeight || r.bottom < 0)) continue;
    const cls = el.getAttribute('class') || '';
    const animated =
      (cs.transitionDuration && cs.transitionDuration !== '0s') ||
      (cs.animationName && cs.animationName !== 'none') ||
      (cs.transform && cs.transform !== 'none') ||
      (cs.willChange && cs.willChange !== 'auto') ||
      cs.position === 'sticky' || cs.position === 'fixed' ||
      el.hasAttribute('data-scroll') || el.hasAttribute('data-aos') || el.hasAttribute('data-framer-name') ||
      /parallax|reveal|fade|slide|sticky|pin|rotate|marquee|track|scroll|animate|appear/i.test(cls);
    const structural = /^(H1|H2|H3|IMG|SVG|CANVAS|VIDEO|SECTION|HEADER|FIGURE|PICTURE)$/.test(el.tagName);
    if (!animated && !structural) continue;
    el.setAttribute('data-mp', idx);
    out.push({
      i: idx,
      tag: el.tagName.toLowerCase(),
      cls: cls.slice(0, 60),
      role: el.getAttribute('role') || '',
      text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
    });
    idx++;
  }
  return out;
}

function sampleTagged() {
  return Array.from(document.querySelectorAll('[data-mp]')).map((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      i: +el.getAttribute('data-mp'),
      op: cs.opacity,
      col: cs.color,
      bg: cs.backgroundColor,
      bgi: cs.backgroundImage !== 'none',
      tf: cs.transform,
      fil: cs.filter,
      clip: cs.clipPath,
      pos: cs.position,
      top: Math.round(r.top),
      vis: cs.visibility,
      td: cs.transitionDuration, tease: cs.transitionTimingFunction, tdel: cs.transitionDelay,
      an: cs.animationName, ad: cs.animationDuration, aease: cs.animationTimingFunction, adel: cs.animationDelay,
    };
  });
}

function libFingerprint() {
  const w = window;
  const libs = [];
  const G = {
    gsap: 'GSAP', TweenMax: 'GSAP (TweenMax)', ScrollTrigger: 'GSAP ScrollTrigger',
    Lenis: 'Lenis', LocomotiveScroll: 'Locomotive Scroll', lottie: 'Lottie', bodymovin: 'Lottie (bodymovin)',
    THREE: 'Three.js', Splitting: 'Splitting.js', Swiper: 'Swiper', Splide: 'Splide', AOS: 'AOS',
    Rellax: 'Rellax', ScrollMagic: 'ScrollMagic', barba: 'Barba.js', anime: 'anime.js', Vivus: 'Vivus',
    rive: 'Rive', Webflow: 'Webflow IX2', SmoothScroll: 'SmoothScroll', ScrollReveal: 'ScrollReveal',
  };
  for (const k in G) { try { if (w[k]) libs.push(G[k]); } catch (e) {} }
  try { if (w.gsap && w.gsap.core && w.gsap.core.globals && w.gsap.core.globals().ScrollTrigger) libs.push('GSAP ScrollTrigger'); } catch (e) {}
  const dom = [
    ['[data-framer-name],[data-framer-component-type],[data-framer-appear-id]', 'Framer'],
    ['[data-aos]', 'AOS'],
    ['[data-scroll],[data-scroll-container],[data-scroll-speed]', 'Locomotive (data-scroll)'],
    ['[data-w-id]', 'Webflow IX2'],
    ['.swiper,.swiper-container', 'Swiper'],
    ['.splide', 'Splide'],
  ];
  for (const [sel, name] of dom) { try { if (document.querySelector(sel)) libs.push(name); } catch (e) {} }
  const scripts = Array.from(document.scripts).map((s) => s.src).filter(Boolean);
  const re = /(gsap|scrolltrigger|lenis|locomotive|lottie|bodymovin|three(\.min)?|swiper|splide|\baos\b|rellax|scrollmagic|barba|framer|webflow|rive|tween|scrollreveal|splitting)/i;
  const scriptHits = Array.from(new Set(
    scripts.filter((s) => re.test(s)).map((s) => { try { return new URL(s).pathname.split('/').pop(); } catch (e) { return s.slice(0, 60); } })
  ));
  let kf = new Set(), animRules = 0, transRules = 0, prm = 0, sheetsBlocked = 0, sheetsRead = 0;
  for (const ss of Array.from(document.styleSheets)) {
    let rules;
    try { rules = ss.cssRules; } catch (e) { sheetsBlocked++; continue; }
    if (!rules) continue;
    sheetsRead++;
    for (const r of Array.from(rules)) {
      try {
        if (r.type === 7) kf.add(r.name); // KEYFRAMES_RULE
        else if (r.type === 4 && /prefers-reduced-motion/i.test(r.conditionText || '')) prm++; // MEDIA_RULE
        else if (r.style) {
          if (r.style.animationName && r.style.animationName !== 'none') animRules++;
          if (r.style.transitionDuration && r.style.transitionDuration !== '0s') transRules++;
        }
      } catch (e) {}
    }
  }
  return {
    libraries: Array.from(new Set(libs)),
    scriptHits,
    keyframes: Array.from(kf).slice(0, 60),
    keyframeCount: kf.size,
    animRules, transRules, prmRules: prm, sheetsBlocked, sheetsRead,
    probe: w.__mp || null,
  };
}

function interactiveCatalog() {
  const q = (s) => { try { return document.querySelectorAll(s).length; } catch (e) { return 0; } };
  let grab = 0;
  const all = document.querySelectorAll('body *');
  let n = 0;
  for (const el of all) { if (n++ > 4000) break; const c = getComputedStyle(el).cursor; if (c === 'grab' || c === 'grabbing') grab++; }
  return {
    carousels: q('.swiper,.splide,.embla,.keen-slider,.flickity-enabled,.glide,[data-carousel],[aria-roledescription="carousel"]'),
    draggable: q('[draggable="true"]') + grab,
    disclosure: q('details,[aria-expanded],.accordion,[data-accordion]'),
    tabs: q('[role="tablist"],[role="tab"]'),
    video: q('video'),
    canvas: q('canvas'),
    marquee: q('marquee,[class*="marquee" i],[class*="ticker" i]'),
  };
}

// ─────────────────────────── Node-side helpers ───────────────────────────

const pick = (obj, keys) => keys.reduce((o, k) => ((o[k] = obj[k]), o), {});
const labelOf = (c) => (c.text ? `${c.tag} “${c.text}”` : c.cls ? `${c.tag}.${c.cls.split(/\s+/)[0]}` : c.tag);

// duration string → ms (first value of a comma list)
const msOf = (v) => { const m = String(v).trim().split(',')[0].trim(); if (m.endsWith('ms')) return Math.round(parseFloat(m)) || 0; if (m.endsWith('s')) return Math.round(parseFloat(m) * 1000) || 0; return 0; };
const maxMs = (list) => Math.max(0, ...String(list).split(',').map(msOf));

// Craft params: the actual tuned numbers a site uses (durations, easings, stagger
// delays, IntersectionObserver thresholds/rootMargins) — so recipes inherit real
// values instead of guesses. Aggregated across every sampled element.
function aggregateParams(series, probe) {
  const durs = {}, eases = {}, delays = {};
  const bump = (o, k) => { if (k) o[k] = (o[k] || 0) + 1; };
  const splitTop = (s) => String(s).split(/,(?![^()]*\))/); // split a CSS list on top-level commas only (keeps cubic-bezier intact)
  for (const s of series) for (const e of (s.snap || [])) {
    splitTop(e.td || '').forEach((d) => bump(durs, msOf(d)));
    splitTop(e.tease || '').forEach((x) => { x = x.trim(); if (x && x !== 'linear') bump(eases, x); });
    bump(delays, msOf(e.tdel || ''));
    if (e.an && e.an !== 'none') {
      bump(durs, maxMs(e.ad || ''));
      splitTop(e.aease || '').forEach((x) => { x = x.trim(); if (x && x !== 'linear') bump(eases, x); });
      bump(delays, msOf(e.adel || ''));
    }
  }
  delete durs[0]; delete delays[0];
  const rank = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => (isNaN(+k) ? k : +k));
  const thresholds = new Set(), margins = new Set();
  for (const c of (probe && probe.ioConfigs) || []) {
    if (c.threshold != null) thresholds.add(JSON.stringify(c.threshold));
    if (c.rootMargin) margins.add(c.rootMargin);
  }
  return {
    durations_ms: rank(durs, 8),
    easings: rank(eases, 6),
    stagger_delays_ms: rank(delays, 6),
    io_thresholds: [...thresholds].slice(0, 6),
    io_root_margins: [...margins].slice(0, 6),
  };
}

function decode(tf) {
  if (!tf || tf === 'none') return null;
  let m = tf.match(/matrix\(([^)]+)\)/);
  if (m) { const [a, b] = m[1].split(',').map(Number); return { rotate: +(Math.atan2(b, a) * 180 / Math.PI).toFixed(1), scale: +Math.hypot(a, b).toFixed(3) }; }
  m = tf.match(/matrix3d\(([^)]+)\)/);
  if (m) { const v = m[1].split(',').map(Number); return { rotate: +(Math.atan2(v[1], v[0]) * 180 / Math.PI).toFixed(1), scale: +Math.hypot(v[0], v[1]).toFixed(3) }; }
  return null;
}

// How many times a value sequence flips — distinguishes a one-shot in-view reveal
// (1–2 flips) from a continuous scroll-progress effect (3+ flips).
function flips(seq) { let f = 0; for (let i = 1; i < seq.length; i++) if (seq[i] !== seq[i - 1]) f++; return f; }
const triggerOf = (seq) => (flips(seq) >= 3 ? 'scroll-progress' : 'in-view');

function diffScroll(candidates, series) {
  const effects = [];
  for (const c of candidates) {
    const seq = series.map((s) => s.snap.find((e) => e.i === c.i)).filter(Boolean);
    if (seq.length < 3) continue;
    const op = seq.map((e) => +e.op);
    const cols = seq.map((e) => e.col);
    const bgs = seq.map((e) => e.bg);
    const tfs = seq.map((e) => e.tf);
    const fils = seq.map((e) => e.fil);
    const clips = seq.map((e) => e.clip);

    if (Math.max(...op) - Math.min(...op) > 0.12) {
      const reveal = op[0] < 0.5 && op[op.length - 1] > 0.6;
      effects.push({ el: labelOf(c), property: 'opacity', kind: reveal ? 'fade-in reveal' : 'opacity', trigger: triggerOf(op.map((x) => x.toFixed(1))), from: op[0].toFixed(2), to: op[op.length - 1].toFixed(2) });
    }
    if (new Set(cols).size > 1) effects.push({ el: labelOf(c), property: 'color', kind: 'text color-shift', trigger: triggerOf(cols), from: cols[0], to: cols[cols.length - 1] });
    if (new Set(bgs).size > 1) effects.push({ el: labelOf(c), property: 'background', kind: 'background-shift', trigger: triggerOf(bgs), from: bgs[0], to: bgs[bgs.length - 1] });
    if (new Set(tfs).size > 1) {
      const a = decode(tfs.find((t) => t !== 'none')) || { rotate: 0, scale: 1 };
      const b = decode([...tfs].reverse().find((t) => t !== 'none')) || a;
      const dRot = +(b.rotate - a.rotate).toFixed(1), dScale = +(b.scale - a.scale).toFixed(3);
      let kind = 'transform/parallax';
      if (Math.abs(dRot) > 1) kind = `rotate ${dRot}°`;
      else if (Math.abs(dScale) > 0.02) kind = `scale ${a.scale}→${b.scale}`;
      effects.push({ el: labelOf(c), property: 'transform', kind, trigger: triggerOf(tfs) });
    }
    if (new Set(fils).size > 1) effects.push({ el: labelOf(c), property: 'filter', kind: 'filter (blur/brightness)', trigger: triggerOf(fils), from: fils[0], to: fils[fils.length - 1] });
    if (new Set(clips).size > 1) effects.push({ el: labelOf(c), property: 'clip-path', kind: 'clip reveal', trigger: triggerOf(clips), from: clips[0], to: clips[clips.length - 1] });
    if (seq[0].pos === 'sticky' || seq[0].pos === 'fixed') {
      const tops = seq.map((e) => e.top);
      if (Math.max(...tops) - Math.min(...tops) < 24) effects.push({ el: labelOf(c), property: 'position', kind: `pin (${seq[0].pos})`, trigger: 'scroll-progress' });
    }
  }
  // de-dupe identical (el,kind) and cap
  const seen = new Set();
  return effects.filter((e) => { const k = e.el + '|' + e.kind; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 48);
}

function diffEntrance(series, candidates) {
  const byI = new Map(candidates.map((c) => [c.i, c]));
  const out = [];
  const stamps = series.map((s) => s.t);
  const ids = new Set(series[0].snap.map((e) => e.i));
  for (const i of ids) {
    const seq = series.map((s) => s.snap.find((e) => e.i === i)).filter(Boolean);
    if (seq.length < 2) continue;
    const op = seq.map((e) => +e.op);
    const tfs = seq.map((e) => e.tf);
    const opChanged = Math.max(...op) - Math.min(...op) > 0.12 && op[0] < 0.6;
    const tfChanged = new Set(tfs).size > 1 && tfs[0] !== 'none';
    if (!opChanged && !tfChanged) continue;
    let firstChangeAt = stamps[stamps.length - 1];
    for (let k = 1; k < seq.length; k++) { if (Math.abs(op[k] - op[0]) > 0.12 || tfs[k] !== tfs[0]) { firstChangeAt = stamps[k]; break; } }
    const c = byI.get(i) || { tag: '?', cls: '', text: '' };
    out.push({ el: labelOf(c), property: opChanged ? 'opacity' : 'transform', firstChangeAt, from: op[0].toFixed(2), to: op[op.length - 1].toFixed(2) });
  }
  return out.slice(0, 24);
}

async function hoverProbe(page) {
  const out = [];
  let handles = [];
  try { handles = await page.$$('a, button, [role="button"], [class*="card" i], [class*="btn" i], [class*="button" i], nav a, [data-hover]'); } catch (e) { return out; }
  const read = (el) => { const c = getComputedStyle(el); return { bg: c.backgroundColor, col: c.color, tf: c.transform, sh: c.boxShadow, bd: c.borderColor, op: c.opacity, td: c.textDecorationLine }; };
  let tried = 0;
  for (const h of handles) {
    if (out.length >= 12 || tried >= 40) break;
    tried++;
    let box; try { box = await h.boundingBox(); } catch (e) { box = null; }
    if (!box || box.width < 10 || box.height < 8 || box.y > 3500) continue;
    let before, after, meta;
    try {
      before = await h.evaluate(read);
      await h.hover({ timeout: 800 });
      await page.waitForTimeout(220);
      after = await h.evaluate(read);
      meta = await h.evaluate((el) => ({ tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class') || '').slice(0, 40), text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30) }));
      await page.mouse.move(2, 2);
    } catch (e) { continue; }
    const changed = Object.keys(before).filter((k) => before[k] !== after[k]);
    if (changed.length) out.push({ el: labelOf(meta), changed, from: pick(before, changed), to: pick(after, changed) });
  }
  return out;
}

async function cursorProbe(page) {
  const snap = () => Array.from(document.querySelectorAll('body *'))
    .filter((el) => { const c = getComputedStyle(el); return (c.position === 'fixed' || c.position === 'absolute') && c.pointerEvents === 'none'; })
    .slice(0, 40).map((el, i) => ({ i, tf: getComputedStyle(el).transform, cls: (el.getAttribute('class') || '').slice(0, 30) }));
  try {
    await page.mouse.move(320, 300); await page.waitForTimeout(90);
    const a = await page.evaluate(snap);
    await page.mouse.move(1040, 660); await page.waitForTimeout(150);
    const b = await page.evaluate(snap);
    const movers = [];
    for (const x of a) { const y = b.find((z) => z.i === x.i); if (y && y.tf !== x.tf && x.tf !== 'none') movers.push({ el: x.cls || 'cursor-follower', from: x.tf, to: y.tf }); }
    return movers.slice(0, 5);
  } catch (e) { return []; }
}

async function entrancePass({ browser, url, viewport, UA }) {
  const ctx = await browser.newContext({ userAgent: UA, viewport });
  await ctx.addInitScript(PROBE_INIT);
  const out = { effects: [], staggered: false, probe: null, error: null };
  try {
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    const candidates = await p.evaluate(tagCandidates, { viewportOnly: true });
    const stamps = [0, 150, 300, 500, 800, 1200];
    const series = [];
    let prev = 0;
    for (const t of stamps) { if (t - prev > 0) await p.waitForTimeout(t - prev); prev = t; series.push({ t, snap: await p.evaluate(sampleTagged) }); }
    out.effects = diffEntrance(series, candidates);
    out.staggered = new Set(out.effects.map((e) => e.firstChangeAt)).size > 1;
    out.probe = await p.evaluate(() => window.__mp || null);
  } catch (e) { out.error = e.message; }
  await ctx.close();
  return out;
}

// ─────────────────────────── orchestrator ───────────────────────────

export async function captureMotion({ browser, page, url, slug, shotDir, viewport, UA, stops = 11, frames = true }) {
  const motion = { summary: {}, scroll_effects: [], entrance: [], hover: [], cursor: [], interactive: {}, fingerprint: {} };

  // 1 + 3 — scroll-state diffing + frames, on the already-loaded desktop page.
  const framesDir = join(shotDir, 'frames');
  if (frames) mkdirSync(framesDir, { recursive: true });
  const candidates = await page.evaluate(tagCandidates, { viewportOnly: false }).catch(() => []);
  const series = [];
  for (let s = 0; s < stops; s++) {
    const frac = stops === 1 ? 0 : s / (stops - 1);
    await page.evaluate((f) => window.scrollTo(0, Math.round((document.documentElement.scrollHeight - window.innerHeight) * f)), frac);
    await page.waitForTimeout(300);
    const snap = await page.evaluate(sampleTagged).catch(() => []);
    series.push({ frac, snap });
    if (frames) await page.screenshot({ path: join(framesDir, `s${String(s).padStart(2, '0')}.png`) }).catch(() => {});
  }
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  motion.scroll_effects = diffScroll(candidates, series);

  // 2 — library / source / behavioral fingerprint (probe was installed pre-navigation).
  motion.fingerprint = await page.evaluate(libFingerprint).catch((e) => ({ error: e.message }));

  // interaction families: hover, cursor, click/drag catalog.
  motion.hover = await hoverProbe(page);
  motion.cursor = await cursorProbe(page);
  motion.interactive = await page.evaluate(interactiveCatalog).catch(() => ({}));

  // entrance / load choreography (fresh context to catch the load).
  const entrance = await entrancePass({ browser, url, viewport, UA });
  motion.entrance = entrance.effects;

  const fp = motion.fingerprint || {};
  const probe = fp.probe || entrance.probe || {};
  motion.params = aggregateParams(series, probe); // tuned craft numbers (durations/easings/stagger/IO)
  const byKind = motion.scroll_effects.reduce((o, e) => ((o[e.kind.replace(/ .*/, '')] = (o[e.kind.replace(/ .*/, '')] || 0) + 1), o), {});
  motion.summary = {
    framesCaptured: frames ? stops : 0,
    scrollEffects: motion.scroll_effects.length,
    scrollEffectKinds: byKind,
    entranceReveals: motion.entrance.length,
    staggeredEntrance: entrance.staggered,
    hoverEffects: motion.hover.length,
    cursorFollowers: motion.cursor.length,
    usesIntersectionObserver: !!(probe.io),
    intersectionObservers: probe.io || 0,
    ioObservedTargets: probe.ioTargets || 0,
    scrollListeners: probe.scroll || 0,
    mousemoveListeners: probe.mousemove || 0,
    rafCalls: probe.raf || 0,
    libraries: fp.libraries || [],
    scriptHits: fp.scriptHits || [],
    keyframeCount: fp.keyframeCount || 0,
    cssAnimationRules: fp.animRules || 0,
    respectsReducedMotion: (fp.prmRules || 0) > 0,
    craftParams: motion.params,
    interactive: motion.interactive,
    framesDir: frames ? `${shotDir.split('/').slice(-3).join('/')}/frames/` : null,
  };
  return motion;
}
