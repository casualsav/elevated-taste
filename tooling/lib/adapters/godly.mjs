// Godly — curated craft inspiration → expressive corpus.
// Cards typically link straight to the external exemplar site, so we collect
// outbound (non-gallery, non-social) links directly. TUNE if extraction returns 0.
export default {
  name: 'godly',
  corpus: 'expressive',
  origin: 'https://godly.website',
  listings: ['https://godly.website/websites'],
  rateMs: 2500,
  strategy: 'external',
  linkSelector: 'a[href]',
  award_type: 'Curated',
  notes: 'External-link strategy: collects outbound site links from the /websites grid (x.com share links are filtered as social).',
};
