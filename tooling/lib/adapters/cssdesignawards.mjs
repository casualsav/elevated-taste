// CSS Design Awards — jury-scored craft → expressive corpus.
// Winner detail pages live under /sites/. TUNE if extraction returns 0.
export default {
  name: 'cssdesignawards',
  corpus: 'expressive',
  origin: 'https://www.cssdesignawards.com',
  listings: ['https://www.cssdesignawards.com/website-gallery'],
  rateMs: 3000,
  strategy: 'detail',
  detailPattern: '^/sites/[^/]+',
  linkSelector: 'a[href]',
  award_type: 'Website of the Day',
  notes: 'TUNE: React/JS-heavy — the gallery hydrates client-side and may need a longer wait or a different listing route. Detail pages at /sites/<slug>/<id>.',
};
