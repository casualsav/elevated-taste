// The FWA — cutting-edge / experimental craft → expressive corpus.
// Case/award detail pages under /cases/. TUNE if extraction returns 0.
export default {
  name: 'thefwa',
  corpus: 'expressive',
  origin: 'https://thefwa.com',
  listings: ['https://thefwa.com/awards/'],
  rateMs: 3000,
  strategy: 'detail',
  detailPattern: '^/cases/[^/]+',
  linkSelector: 'a[href]',
  award_type: 'FWA of the Day',
  notes: 'Detail pages at /cases/<slug>. External URL resolved from the detail page.',
};
