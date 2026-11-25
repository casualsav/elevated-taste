// Land-book — real-world landing/product UI → production corpus.
// Detail pages under /website/<slug>. robots disallows parameterized filter URLs
// (?search, ?style, ...) — we harvest only the base gallery. TUNE if 0 results.
export default {
  name: 'landbook',
  corpus: 'production',
  origin: 'https://land-book.com',
  listings: ['https://land-book.com/'],
  rateMs: 2500,
  strategy: 'detail',
  detailPattern: '^/websites/\\d',
  linkSelector: 'a[href]',
  award_type: 'Gallery',
  notes: 'Detail pages at /websites/<id>-<slug> (plural, numeric id); single-segment slugs are author pages. Do NOT request ?param filter URLs (robots).',
};
