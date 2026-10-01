import stepsGlance from './steps-glance.json' with {type:'json'};

// Development editorial review only. These choices do not delete legacy routes,
// change the production catalog, or imply approval of a CMS publication.
export const LAUNCH_REVIEW = {
  // Detachment's old story published at /articles/detachment/ and was retired
  // there. It has since been superseded by 051e6f44…, published as a guide at
  // /guides/detachment-with-love/, and has left the feed. Nothing links to the
  // old address any more, so there is nothing left to suppress.
  retired: [],
  // Retired into another page, rather than removed. `retired` above answers 410;
  // these answer 301, because their content lives on at the address named here
  // and whatever they had earned should follow it. One declaration, three uses:
  // the Worker's redirect, the link rewrite in approved snapshots, and the index
  // filter — without the last, the Story Room still lists About Al-Anon among the
  // guides, since it goes on publishing cms-about-alanon at /about-alanon/.
  consolidated: {
    '/about-alanon/': '/guides/finding-help/',
    '/guides/about-alanon/': '/guides/finding-help/',
  },
  // Rewritten pieces come off this list as they land: Who Am I Behind the Mask
  // first, and now The Stories We Tell Ourselves, published from the Story Room
  // on September 26. What is left is the two still awaiting their rewrite.
  deferred: ['/topics/one-day-at-a-time/', '/topics/gratitude-and-hope/'],
  // Learning to Trust was dropped here when it briefly published with an empty
  // summary. It has since been written — 2,716 words by Celina R — and Neal asked
  // for it back on September 28, so the list is empty. Dropping a path from the
  // feed means no page and nothing submitted to search, which is heavier than
  // deferring: use it only for a piece that should not exist on the site at all.
  retiredPaths: [],
  linkedStories: { '012aaa8a-e94a-4ff2-8730-87a663205057': '/guides/finding-help/', 'de45655f-f3a2-46a4-a2a7-a52a7174ed98': '/articles/your-first-al-anon-meeting/',
    // Reclassified themes: the Story Room still publishes at the old address.
    'cms-powerlessness': '/guides/surrender/', 'cms-boundaries': '/guides/boundaries/',
    'cms-letting-go': '/articles/letting-go/', 'cms-honesty': '/articles/the-stories-we-tell-ourselves/',
    'cms-self-worth': '/articles/who-am-i-behind-the-mask/' },
  cmsManaged: ['/guides/finding-help/', '/guides/detachment-with-love/', '/articles/your-first-al-anon-meeting/'],
  // Detachment with Love, Finding Help and Your First Al-Anon Meeting are
  // published and reviewed. Nothing here is a draft, so no card carries a
  // Placeholder label and no review manuscript stands in for a page.
  drafts: [],
  // Card titles and summaries for the three above now come from the Story Room,
  // which is where they were approved. An override here would quietly outrank
  // the text Neal published, and the two that were here said something else.
  metadata: {
    '/articles/the-line-i-kept-moving/': { category: 'Personal Story', author: 'Lance W' },
    '/articles/voices-from-the-grave/': { category: 'Finding your voice', author: 'Lance W' },
  },
  stepsGlance,
};
export const FIRST_MEETING = {
  title: 'Your First Al-Anon Meeting', path: '/articles/your-first-al-anon-meeting/',
  description: 'What to check beforehand, what you may encounter, and how to give yourself room to listen.',
  image: 'articles/editorial-doorway.webp', alt: 'Daylight entering through an open doorway', category: 'Getting started',
};
export function launchItems(items, preview) {
  if (!preview) return items;
  return items.filter(item => !LAUNCH_REVIEW.deferred.includes(item.path) && !LAUNCH_REVIEW.retired.includes(item.path)).map(item => ({...item, ...LAUNCH_REVIEW.metadata[item.path], reviewDraft: LAUNCH_REVIEW.drafts.includes(item.path) && !(item.cms && LAUNCH_REVIEW.cmsManaged.includes(item.path))}));
}

// Also applied to approved CMS HTML at request time: remove promotional blocks
// and links to the deferred pieces without rewriting approved prose/art.
// Self-contained for inclusion in the preview Worker.
export function transformLaunchPreview(html, pathname, policy = LAUNCH_REVIEW) {
  if (!html) return html;
  if (pathname === '/guides/finding-help/' || html.includes('id="the-twelve-steps-turning-toward-your-own-life"')) {
    html = html.replace(/(\/css\/site-system\.css\?v=)[^"']+/i, '$1steps-glance-1');
    const trigger = '<p>For a quick overview, open the Daily Paths <button type="button" class="steps-glance-trigger" data-steps-glance-open aria-haspopup="dialog" aria-controls="steps-glance-dialog">12 Steps at a glance</button>.</p>';
    html = html.replace(/<p>For a quick overview, open the Daily Paths <a href="\/assets\/resources\/12-steps-at-a-glance\.pdf"[^>]*>12 Steps at a glance<\/a> \(PDF\)\.<\/p>/i, trigger);
    if (!html.includes('data-steps-glance-open')) {
      html = html.replace(/(<h3\b[^>]*id="sponsorship-a-conversation-between-meetings"[^>]*>)/i, trigger + '\n$1');
    }
    if (html.includes('data-steps-glance-open') && !html.includes('id="steps-glance-dialog"')) {
      const escape = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const words = ['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve'];
      const sections = policy.stepsGlance.map(item => `<section class="steps-glance-section" aria-labelledby="steps-glance-step-${item.number}"><p class="steps-glance-eyebrow">Step ${words[item.number - 1]}</p><h3 id="steps-glance-step-${item.number}">${escape(item.title)}</h3><p class="steps-glance-principle">Core Principle: ${escape(item.principle)}</p><ul>${item.points.map(point => `<li>${escape(point)}</li>`).join('')}</ul></section>`).join('');
      const dialog = `<dialog id="steps-glance-dialog" class="steps-glance-dialog" aria-labelledby="steps-glance-title"><div class="steps-glance-head"><div><p class="steps-glance-eyebrow">Daily Paths reference</p><h2 id="steps-glance-title">The Twelve Steps of Al-Anon</h2><p>Key Takeaways, Core Principles &amp; Spiritual Insights from Personal Recovery Essays</p></div><button type="button" class="steps-glance-close" data-steps-glance-close aria-label="Close 12 Steps at a glance">Close <span aria-hidden="true">×</span></button></div><div class="steps-glance-content">${sections}<p class="steps-glance-source">Grounded in Al-Anon Family Groups Literature</p></div></dialog><script src="/js/steps-glance.js" defer></script>`;
      html = html.replace(/<\/body>/i, dialog + '\n</body>');
    }
  }
  // Approved snapshots still link to addresses that have been consolidated away.
  // Longest first, so /guides/about-alanon/ is not half-rewritten by the rule for
  // /about-alanon/ and left pointing at /guides/guides/finding-help/.
  for (const [from, to] of Object.entries(policy.consolidated || {}).sort((a, b) => b[0].length - a[0].length)) {
    html = html.replaceAll(from, to);
  }
  // Remove the retired article's cards, including cached CMS fallback listings.
  const retiredHref = href => {
    try { const u = new URL(href, 'https://daily-paths-soft-daylight.nealw98.chatgpt.site');
      return ['daily-paths-soft-daylight.nealw98.chatgpt.site', 'dailypaths.org'].includes(u.hostname) && (policy.retired || []).includes(u.pathname);
    } catch { return false; }
  };
  html = html.replace(/<article\b[^>]*>[\s\S]*?<\/article>/gi, block => [...block.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)].some(m => retiredHref(m[1])) && /class=["'][^"']*\bsd-story\b/.test(block.slice(0, block.indexOf('>') + 1)) ? '' : block);
  html = html.replace(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (whole, href, label) => retiredHref(href) ? label : whole);
  // Apply the September 21 hero replacement to older CMS snapshots as well.
  html = html.replace(/<img\b[^>]*letting-go-hero\.jpg[^>]*>/gi, tag => tag.replace(/\balt=["'][^"']*["']/i, 'alt="A tightrope walker balances above a circus ring, viewed from overhead"'));
  html = html.replaceAll('letting-go-hero.jpg', 'letting-go-tightrope.webp');
  const deferredHref = href => {
    try { const url = new URL(href, 'https://daily-paths-soft-daylight.nealw98.chatgpt.site');
      return ['daily-paths-soft-daylight.nealw98.chatgpt.site', 'dailypaths.org'].includes(url.hostname) && policy.deferred.includes(url.pathname);
    } catch { return false; }
  };
  const containsDeferred = block => [...block.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)].some(match => deferredHref(match[1]));
  html = html.replace(/<aside\b[^>]*class="[^"]*theme-related-guide[^"]*"[^>]*>[\s\S]*?<\/aside>/gi, block => containsDeferred(block) ? '' : block);
  // Limit whole-card removal to the known recommendation container.
  html = html.replace(/(<div class="story-related-links">)([\s\S]*?)(<\/div>)/gi, (_, open, cards, close) => open + cards.replace(/<article>[\s\S]*?<\/article>/gi, block => containsDeferred(block) || /Coming soon/.test(block) ? '' : block) + close);
  html = html.replace(/<a\b([^>]*\bhref=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/a>/gi, (whole, attrs, href, label) => {
    if (!deferredHref(href)) return whole;
    return /\b(?:rt-card|theme-index-card|deeper-card)\b/.test(attrs) ? '' : label;
  });
  return html;
}
