// Exemplar directory — progressive enhancement only.
// Without JS: every card renders with screenshots and live links. With JS:
// corpus filter + search narrow the grid, and a native <dialog> lightbox shows
// the full captures + metadata.
(() => {
  'use strict';
  const DATA = JSON.parse(document.getElementById('ex-data').textContent);
  const grid = document.getElementById('grid');
  const cards = [...grid.querySelectorAll('.card')];
  const q = document.getElementById('q');
  const segs = [...document.querySelectorAll('.seg')];
  const empty = document.getElementById('empty');
  const emptyQ = document.getElementById('empty-q');

  // ── Filter ──────────────────────────────────────────────────────────────
  let corpus = 'all';
  const norm = (s) => s.toLowerCase().trim();
  function apply() {
    const term = norm(q.value);
    let shown = 0;
    for (const card of cards) {
      const okC = corpus === 'all' || card.dataset.corpus === corpus;
      const okQ = !term || card.dataset.search.includes(term);
      const show = okC && okQ;
      card.hidden = !show;
      if (show) shown++;
    }
    empty.hidden = shown > 0;
    if (!shown) emptyQ.textContent = term ? `"${q.value.trim()}"` : 'that filter';
  }
  segs.forEach((b) => b.addEventListener('click', () => {
    segs.forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', x === b); });
    corpus = b.dataset.corpus;
    apply();
  }));
  let t;
  q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(apply, 90); });

  // ── Lightbox ──────────────────────────────────────────────────────────────
  const lb = document.getElementById('lb');
  const shots = document.getElementById('lb-shots');
  const meta = document.getElementById('lb-meta');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const chips = (arr, mono) => arr.length
    ? `<ul class="lb__chips${mono ? ' is-mono' : ''}">${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const group = (label, body) => body ? `<div class="lb__group"><h3>${label}</h3>${body}</div>` : '';

  function open(e) {
    shots.innerHTML = `
      <figure>
        <figcaption class="cap-label"><span>Desktop</span><span>${e.d.ow}×${e.d.oh}</span></figcaption>
        <img src="${esc(e.d.src)}" alt="${esc(e.name)} — full desktop capture" loading="lazy">
      </figure>
      <figure class="fig--phone">
        <figcaption class="cap-label"><span>Mobile</span><span>${e.m.ow}×${e.m.oh}</span></figcaption>
        <img class="shot--phone" src="${esc(e.m.src)}" alt="${esc(e.name)} — full mobile capture" loading="lazy">
      </figure>`;
    meta.innerHTML = `
      <div>
        <h2 class="lb__title" id="lb-title">${esc(e.name)}</h2>
        <p class="lb__sub"><span class="corpus corpus--${e.corpus}"><i></i>${e.corpus[0].toUpperCase() + e.corpus.slice(1)}</span> · <span class="mono">${esc(e.captured)}</span></p>
      </div>
      <p style="color:var(--color-muted);font-size:var(--text-sm);line-height:var(--leading-snug)">${esc(e.award)}</p>
      <a class="lb__visit" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">Visit ${esc(e.host)}
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></a>
      ${group('Patterns it teaches', chips(e.patterns, true))}
      ${group('When to use', chips(e.when))}
      ${group('Directions', chips(e.dirs))}
      ${group('A11y (captured)', chips(e.a11y || [], true))}`;
    meta.scrollTop = 0; shots.scrollTop = 0;
    lb.setAttribute('aria-labelledby', 'lb-title');
    if (!lb.open) lb.showModal();
  }

  grid.addEventListener('click', (ev) => {
    const a = ev.target.closest('.card__shot');
    if (!a) return;
    ev.preventDefault();
    const key = a.dataset.slug + ':' + a.closest('.card').dataset.corpus;
    if (DATA[key]) open(DATA[key]);
  });
  document.getElementById('lb-close').addEventListener('click', () => lb.close());
  // click on the backdrop (outside the panel) closes
  lb.addEventListener('click', (ev) => { if (ev.target === lb) lb.close(); });
})();
