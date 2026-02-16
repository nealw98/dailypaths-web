import { dayToSlug, themeToSlug } from './slug-utils.mjs';

const SITE_URL = 'https://dailypaths.org';

/**
 * Generate sitemap.xml content for all pages
 */
export function generateSitemap(readings, themes) {
  const today = new Date().toISOString().split('T')[0];

  let urls = [];

  // Homepage
  urls.push({ loc: SITE_URL + '/', priority: '1.0', changefreq: 'daily' });

  // Reading pages
  for (const reading of readings) {
    const slug = dayToSlug(reading.day_of_year);
    urls.push({ loc: `${SITE_URL}/${slug}/`, priority: '0.8', changefreq: 'weekly' });
  }

  // Browse by date
  urls.push({ loc: SITE_URL + '/browse/', priority: '0.7', changefreq: 'weekly' });

  // Theme index
  urls.push({ loc: SITE_URL + '/themes/', priority: '0.7', changefreq: 'weekly' });

  // Individual theme pages
  for (const theme of themes) {
    const slug = themeToSlug(theme);
    urls.push({ loc: `${SITE_URL}/themes/${slug}/`, priority: '0.6', changefreq: 'monthly' });
  }

  // Static pages
  urls.push({ loc: SITE_URL + '/prayers/', priority: '0.6', changefreq: 'monthly' });
  urls.push({ loc: SITE_URL + '/privacy/', priority: '0.3', changefreq: 'monthly' });
  urls.push({ loc: SITE_URL + '/support/', priority: '0.3', changefreq: 'monthly' });
  urls.push({ loc: SITE_URL + '/terms/', priority: '0.3', changefreq: 'monthly' });

  const urlEntries = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

/**
 * Generate Article structured data for a reading page
 */
export function readingStructuredData(reading, slug) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': reading.title,
    'description': reading.opening?.replace(/\\n\\n/g, ' ').replace(/\\n/g, ' ').replace(/\*+/g, '').slice(0, 155),
    'author': {
      '@type': 'Organization',
      'name': 'Al-Anon Daily Paths'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Al-Anon Daily Paths',
      'logo': {
        '@type': 'ImageObject',
        'url': `${SITE_URL}/assets/logo.png`
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${slug}/`
    }
  }, null, 2);
}

/**
 * Generate WebSite structured data for the homepage
 */
export function homepageStructuredData() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Al-Anon Daily Paths',
    'url': SITE_URL,
    'description': '366 original daily Al-Anon recovery reflections written in the contemplative tradition.'
  }, null, 2);
}
