import { dayToSlug } from './slug-utils.mjs';
import { BASE_URL } from './config.mjs';

/**
 * Generate sitemap.xml content for all pages
 */
export function generateSitemap(readings, topics, books = []) {
  const today = new Date().toISOString().split('T')[0];

  let urls = [];

  // Homepage
  urls.push({ loc: BASE_URL + '/', priority: '1.0', changefreq: 'daily' });

  // Reading pages
  for (const reading of readings) {
    const slug = dayToSlug(reading.day_of_year);
    urls.push({ loc: `${BASE_URL}/${slug}/`, priority: '0.8', changefreq: 'weekly' });
  }

  // Principles index
  urls.push({ loc: BASE_URL + '/themes/', priority: '0.7', changefreq: 'weekly' });

  // Individual principle (topic) pages
  for (const topic of topics) {
    urls.push({ loc: `${BASE_URL}/themes/${topic.slug}/`, priority: '0.6', changefreq: 'monthly' });
  }

  // Steps
  urls.push({ loc: BASE_URL + '/steps/', priority: '0.7', changefreq: 'monthly' });
  for (let i = 1; i <= 12; i++) {
    urls.push({ loc: `${BASE_URL}/steps/step-${i}/`, priority: '0.7', changefreq: 'monthly' });
  }

  // Literature
  if (books.length > 0) {
    urls.push({ loc: BASE_URL + '/literature/', priority: '0.7', changefreq: 'monthly' });
    for (const book of books) {
      urls.push({ loc: `${BASE_URL}/literature/${book.slug}/`, priority: '0.6', changefreq: 'monthly' });
    }
  }

  // Static pages
  urls.push({ loc: BASE_URL + '/prayers/', priority: '0.6', changefreq: 'monthly' });
  urls.push({ loc: BASE_URL + '/about-alanon/', priority: '0.6', changefreq: 'monthly' });
  urls.push({ loc: BASE_URL + '/quiz/', priority: '0.6', changefreq: 'monthly' });
  urls.push({ loc: BASE_URL + '/traditions/', priority: '0.6', changefreq: 'monthly' });
  urls.push({ loc: BASE_URL + '/concepts/', priority: '0.6', changefreq: 'monthly' });
  urls.push({ loc: BASE_URL + '/privacy/', priority: '0.3', changefreq: 'monthly' });
  urls.push({ loc: BASE_URL + '/support/', priority: '0.3', changefreq: 'monthly' });
  urls.push({ loc: BASE_URL + '/terms/', priority: '0.3', changefreq: 'monthly' });

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

Sitemap: ${BASE_URL}/sitemap.xml
`;
}

/**
 * Generate Article structured data for a reading page
 */
export function readingStructuredData(reading, slug) {
  const stepTheme = reading.step_theme || '';
  const secondaryTheme = reading.secondary_theme || '';
  const keywords = [stepTheme, secondaryTheme, 'Al-Anon', 'recovery', 'daily reflection']
    .filter(Boolean)
    .join(', ');

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': reading.title,
    'description': reading.opening?.replace(/\\n\\n/g, ' ').replace(/\\n/g, ' ').replace(/\*+/g, '').slice(0, 155),
    'author': {
      '@type': 'Person',
      'name': 'Neal W.'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Daily Growth, LLC',
      'logo': {
        '@type': 'ImageObject',
        'url': `${BASE_URL}/assets/favicon.png`
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${slug}/`
    },
    'keywords': keywords,
  };

  if (stepTheme) {
    data['articleSection'] = stepTheme;
  }

  return JSON.stringify(data, null, 2);
}

/**
 * Generate BreadcrumbList structured data for a reading page
 */
export function breadcrumbStructuredData(reading, slug) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': BASE_URL + '/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Readings',
        'item': BASE_URL + '/'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': reading.title,
        'item': `${BASE_URL}/${slug}/`
      }
    ]
  }, null, 2);
}

/**
 * Generate structured data for the homepage — WebSite + SoftwareApplication
 */
export function homepageStructuredData() {
  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Al-Anon Daily Paths',
    'url': BASE_URL,
    'description': '366 original daily Al-Anon recovery reflections written in the contemplative tradition.'
  };

  const app = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Al-Anon Daily Paths',
    'operatingSystem': 'iOS, Android',
    'applicationCategory': 'LifestyleApplication',
    'description': '366 original daily Al-Anon recovery reflections and personal journaling tools.',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Daily Growth, LLC'
    }
  };

  return [JSON.stringify(webSite, null, 2), JSON.stringify(app, null, 2)];
}

/**
 * Generate Book structured data for a literature page
 */
export function bookStructuredData(book) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Book',
    'name': book.title,
    'bookFormat': 'https://schema.org/Paperback',
    'numberOfPages': book.pages,
    'datePublished': String(book.year),
    'publisher': {
      '@type': 'Organization',
      'name': 'Al-Anon Family Group Headquarters, Inc.'
    },
    'image': `${BASE_URL}/assets/${book.image}`
  }, null, 2);
}
