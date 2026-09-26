import { ARTICLES, GUIDES } from './content-catalog.mjs';
import { readingSlug, stepRecordSlug } from './slug-utils.mjs';
import { BASE_URL, IS_PREVIEW } from './config.mjs';

/**
 * Generate sitemap.xml content for all pages
 */
export function generateSitemap(readings, topics, books = [], steps = [], lastmodFor = () => null) {
  let urls = [];

  // Homepage
  urls.push({ path: '/', priority: '1.0', changefreq: 'daily' });

  for (const path of ['/articles/', '/guides/', '/reflections/']) urls.push({path, priority:'0.8', changefreq:'weekly'});
  urls.push({ path: '/reflections/favorites/', priority: '0.7', changefreq: 'weekly' });

  // Standalone articles; established topic articles are included below.
  for (const article of [...ARTICLES,...GUIDES].filter(a => /^\/(articles|guides)\//.test(a.path))) {
    urls.push({ path: article.path, priority: '0.6', changefreq: 'monthly' });
  }

  // Reading pages
  for (const reading of readings) {
    const slug = readingSlug(reading.day_of_year, reading.title);
    urls.push({ path: `/${slug}/`, priority: '0.8', changefreq: 'weekly' });
  }

  // Principles index
  urls.push({ path: '/topics/', priority: '0.7', changefreq: 'weekly' });

  // Individual principle (topic) pages
  for (const topic of topics) {
    urls.push({ path: `/topics/${topic.slug}/`, priority: '0.6', changefreq: 'monthly' });
  }

  // Supporting Step articles. The retired /steps/ index is a redirect and is
  // intentionally omitted; Step navigation now begins at /reflections/.
  for (const step of steps) {
    urls.push({ path: `/steps/${stepRecordSlug(step)}/`, priority: '0.6', changefreq: 'monthly' });
  }

  // Literature
  if (books.length > 0) {
    urls.push({ path: '/literature/', priority: '0.7', changefreq: 'monthly' });
    for (const book of books) {
      urls.push({ path: `/literature/${book.slug}/`, priority: '0.6', changefreq: 'monthly' });
    }
  }

  // Month archives
  const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  for (const month of months) {
    urls.push({ path: `/months/${month}/`, priority: '0.5', changefreq: 'monthly' });
  }

  // Static pages
  urls.push({ path: '/essentials/', priority: '0.6', changefreq: 'monthly' });
  urls.push({ path: '/start/', priority: '0.8', changefreq: 'monthly' });
  urls.push({ path: '/guides/finding-help/', priority: '0.6', changefreq: 'monthly' });
  urls.push({ path: '/about-project/', priority: '0.5', changefreq: 'monthly' });
  urls.push({ path: '/privacy/', priority: '0.3', changefreq: 'monthly' });
  urls.push({ path: '/support/', priority: '0.3', changefreq: 'monthly' });
  urls.push({ path: '/terms/', priority: '0.3', changefreq: 'monthly' });

  // lastmod is omitted rather than guessed. A date that moves on every rebuild
  // teaches search engines to ignore the signal for the whole site.
  const urlEntries = urls.map(u => {
    const lastmod = lastmodFor(u.path);
    return `  <url>
    <loc>${BASE_URL}${u.path}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt() {
  if (IS_PREVIEW) return 'User-agent: *\nDisallow: /\n';
  return `User-agent: *
Allow: /
Disallow: /auth
Disallow: /admin

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
 * Generate Article structured data for a topic (theme) page
 */
export function topicStructuredData(topic) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': topic.name,
    'description': topic.metaDescription || topic.shortDescription,
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
      '@id': `${BASE_URL}/topics/${topic.slug}/`
    },
    'image': `${BASE_URL}/assets/themes/themes-hero.jpg`,
    'datePublished': '2025-05-01',
    'dateModified': '2025-05-01',
    'articleSection': 'Al-Anon Recovery Themes',
    'keywords': `${topic.name}, Al-Anon, recovery, daily reflection`,
  }, null, 2);
}

/**
 * Generate BreadcrumbList structured data for a topic page
 */
export function topicBreadcrumbStructuredData(topic) {
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
        'name': 'Topics',
        'item': BASE_URL + '/topics/'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': topic.name,
        'item': `${BASE_URL}/topics/${topic.slug}/`
      }
    ]
  }, null, 2);
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
