// SiteInspire — curated web design (filter to app/SaaS/product/editorial) → production corpus.
// Detail pages under /websites/<id>-<slug>. TUNE if extraction returns 0.
export default {
  name: 'siteinspire',
  corpus: 'production',
  origin: 'https://www.siteinspire.com',
  listings: ['https://www.siteinspire.com/websites'],
  rateMs: 3000,
  strategy: 'detail',
  detailPattern: '^/websites/\\d+',
  linkSelector: 'a[href]',
  award_type: 'Curated',
  notes: 'TUNE: JS-gated — listing rendered 0 anchors with the bot UA; likely needs a real UA / cookie acceptance / longer wait, or use manual-sources.json. Detail pages at /websites/<id>. Filter to app/SaaS/product/editorial during curation.',
};
