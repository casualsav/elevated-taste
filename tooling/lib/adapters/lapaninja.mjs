// Lapa Ninja — landing-page gallery → production corpus.
// Detail/post pages under /post/<slug>. TUNE if extraction returns 0.
export default {
  name: 'lapaninja',
  corpus: 'production',
  origin: 'https://www.lapa.ninja',
  listings: ['https://www.lapa.ninja/'],
  rateMs: 2500,
  strategy: 'detail',
  detailPattern: '^/post/[^/]+',
  linkSelector: 'a[href]',
  award_type: 'Gallery',
  notes: 'Detail pages at /post/<slug>. External URL resolved from the detail page.',
};
