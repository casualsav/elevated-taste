// Awwwards — jury-scored craft → expressive corpus.
// Detail pages live at /sites/<slug>. robots disallows /gallery/, /search-websites,
// /inspiration/search, /tag/ — we harvest only the Sites-of-the-Day listing.
// Selectors are best-effort; TUNE detailPattern/listings if extraction returns 0.
export default {
  name: 'awwwards',
  corpus: 'expressive',
  origin: 'https://www.awwwards.com',
  listings: ['https://www.awwwards.com/websites/sites_of_the_day/'],
  rateMs: 3000,
  strategy: 'detail',
  detailPattern: '^/sites/[^/]+/?$',
  linkSelector: 'a[href]',
  award_type: 'Site of the Day',
  notes: 'Heavy JS; harvester autoscrolls. External URL resolved from the detail page in the capture/curate step.',
};
