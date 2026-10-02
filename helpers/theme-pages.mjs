/**
 * Where each theme's page lives.
 *
 * Themes began as pages at /topics/<slug>/. As each is reclassified as an
 * article or a guide it moves to an address that follows its title, and the
 * old one redirects. A theme with no entry below still lives at /topics/<slug>/.
 *
 * Everything that links to a theme resolves through themePath(), so the pill on
 * 204 reflections, the related-topic cards, the sitemap, the topics index and
 * the redirects cannot drift apart from each other. Moving the rest is one line
 * each, once their rewrites settle.
 */
export const MOVED_THEME_PAGES = {
  fellowship: '/guides/finding-help/',
  powerlessness: '/guides/surrender/',
  detachment: '/guides/detachment-with-love/',
  boundaries: '/guides/boundaries/',
  'letting-go': '/articles/letting-go/',
  honesty: '/articles/the-stories-we-tell-ourselves/',
  'self-worth': '/articles/who-am-i-behind-the-mask/',
};

// Consolidated topics keep their links but no longer own a page or index card.
export const CONSOLIDATED_THEMES = new Set(['fellowship']);

/** The current address of a theme's page. */
export const themePath = slug => MOVED_THEME_PAGES[slug] || `/topics/${slug}/`;

/** Old address → new, for the redirects the build writes. */
export const movedThemeRedirects = () =>
  Object.entries(MOVED_THEME_PAGES).map(([slug, to]) => [`topics/${slug}`, to]);
