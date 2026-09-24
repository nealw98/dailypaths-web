// Development editorial review only. These choices do not delete legacy routes,
// change the production catalog, or imply approval of a CMS publication.
export const LAUNCH_REVIEW = {
  retired: ['/articles/detachment/'],
  deferred: ['/topics/one-day-at-a-time/', '/topics/self-worth/', '/topics/gratitude-and-hope/', '/topics/honesty/'],
  retiredPaths: ['/about-alanon/'],
  linkedStories: { '012aaa8a-e94a-4ff2-8730-87a663205057': '/guides/finding-help/', 'cms-detachment': '/articles/detachment/', '051e6f44-9d55-4a16-ba92-61a7a06f642e': '/topics/detachment/', 'de45655f-f3a2-46a4-a2a7-a52a7174ed98': '/articles/your-first-al-anon-meeting/' },
  cmsManaged: ['/guides/finding-help/', '/topics/detachment/', '/articles/your-first-al-anon-meeting/'],
  drafts: ['/topics/detachment/', '/articles/your-first-al-anon-meeting/'],
  metadata: {
    '/guides/finding-help/': { description: 'Finding help when someone else’s drinking is affecting your life.' },
    '/topics/detachment/': { title: 'Detachment', description: 'Practical ways to step out of monitoring, rescuing, and managing another adult.' },
    '/articles/the-line-i-kept-moving/': { category: 'Personal Story', author: 'Jeff J.' },
    '/articles/voices-from-the-grave/': { category: 'Finding your voice' },
  },
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
// and links to the four deferred pieces without rewriting approved prose/art.
// Self-contained for inclusion in the preview Worker.
export function transformLaunchPreview(html, pathname, policy = LAUNCH_REVIEW) {
  if (!html) return html;
  html = html.replaceAll('/about-alanon/', '/guides/finding-help/');
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
