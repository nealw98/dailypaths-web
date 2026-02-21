import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';
import { bookStructuredData } from '../helpers/seo.mjs';

const APP_STORE_URL = 'https://apps.apple.com/app/daily-paths/id6738370285';

export const BOOKS = [
  {
    slug: 'courage-to-change',
    category: 'Daily Reader',
    title: 'Courage to Change',
    subtitle: 'One Day at a Time in Al-Anon II',
    catalogNumber: 'B-16',
    pages: 384,
    year: 1992,
    price: '$16.00',
    image: 'courage-to-change.jpg',
    description: 'The book you&rsquo;ll see on the table at almost every Al-Anon meeting. For many, it&rsquo;s the first piece of recovery literature they ever hold &mdash; and the one they keep coming back to. Each day offers a short, honest reflection from a real Al-Anon member about what it&rsquo;s like to love someone who drinks, and the small shifts that start to change everything. Open to today&rsquo;s date. That&rsquo;s all you need to do.',
    purchaseLink: 'https://ecomm.al-anon.org/ItemDetail?iProductCode=B16',
    alsoAvailable: '<a href="https://ecomm.al-anon.org/ItemDetail?iProductCode=eB16" target="_blank" rel="noopener">eBook</a> and <a href="https://ecomm.al-anon.org/ItemDetail?iProductCode=B17" target="_blank" rel="noopener">large print</a>',
    appTieIn: {
      heading: 'Love this kind of daily reading?',
      text: 'Daily Paths offers 366 original reflections written in the same contemplative, one-day-at-a-time style &mdash; with daily notifications, bookmarking, and dark mode.',
    },
    seoTitle: 'Courage to Change \u2014 Al-Anon Daily Reader | Daily Paths',
    seoDescription: 'Courage to Change is Al-Anon\u2019s most beloved daily reader. Discover how this book helps families affected by alcoholism find hope, one day at a time.',
    shortDescription: 'Al-Anon\u2019s most beloved daily reader &mdash; one honest reflection for each day of the year.',
  },
  {
    slug: 'paths-to-recovery',
    category: 'Study Guide',
    title: 'Paths to Recovery',
    subtitle: 'Al-Anon\u2019s Steps, Traditions, and Concepts',
    catalogNumber: 'B-24',
    pages: 366,
    year: 1997,
    price: '$24.00',
    image: 'paths-to-recovery.jpg',
    description: 'This is where the Steps, Traditions, and Concepts stop being words on the wall and start becoming tools you can actually use. Each chapter opens up one principle through clear explanation, real member stories, and study questions that your sponsor will probably ask you to write on. It&rsquo;s the backbone of step work in Al-Anon &mdash; and the book that Daily Paths draws its quotes from.',
    purchaseLink: 'https://ecomm.al-anon.org/ItemDetail?iProductCode=B24',
    alsoAvailable: '<a href="https://ecomm.al-anon.org/ItemDetail?iProductCode=P93" target="_blank" rel="noopener">Companion Workbook P-93</a>',
    appTieIn: {
      heading: 'Inspired by this book',
      text: 'Every Daily Paths reflection draws from the wisdom of Paths to Recovery &mdash; weaving the Steps, Traditions, and Concepts into 366 contemplative daily readings.',
    },
    seoTitle: 'Paths to Recovery \u2014 Al-Anon Steps, Traditions & Concepts | Daily Paths',
    seoDescription: 'Paths to Recovery is Al-Anon\u2019s comprehensive guide to the Steps, Traditions, and Concepts of Service. The backbone of step work and group study.',
    shortDescription: 'The backbone of step work &mdash; clear explanations, member stories, and study questions.',
  },
  {
    slug: 'one-day-at-a-time',
    category: 'Daily Reader',
    title: 'One Day at a Time in Al-Anon',
    subtitle: null,
    catalogNumber: 'B-6',
    pages: 384,
    year: 1973,
    price: '$15.00',
    image: 'one-day-at-a-time.jpg',
    description: 'The original. Al-Anon&rsquo;s first daily reader has been a quiet companion for millions of people since 1973. The language feels older, more formal &mdash; but there&rsquo;s a directness to it that still cuts through. Many longtime members keep both this and Courage to Change on their nightstand, alternating between them. If you love the daily reading format and want to go deeper, this is where it all started.',
    purchaseLink: 'https://ecomm.al-anon.org/ItemDetail?iProductCode=B6',
    alsoAvailable: '<a href="https://ecomm.al-anon.org/ItemDetail?iProductCode=B14" target="_blank" rel="noopener">Large print</a>',
    appTieIn: {
      heading: 'A daily reading for your phone',
      text: 'Daily Paths continues the tradition of one-day-at-a-time recovery reading &mdash; 366 original reflections with daily notifications, bookmarking, and dark mode.',
    },
    seoTitle: 'One Day at a Time in Al-Anon \u2014 The Original Daily Reader | Daily Paths',
    seoDescription: 'One Day at a Time in Al-Anon is the original daily reader that started it all in 1973. A quiet companion for millions in Al-Anon recovery.',
    shortDescription: 'The original daily reader &mdash; a quiet companion for millions since 1973.',
  },
  {
    slug: 'how-al-anon-works',
    category: 'Essential Reading',
    title: 'How Al-Anon Works',
    subtitle: 'For Families & Friends of Alcoholics',
    catalogNumber: 'B-32',
    pages: 416,
    year: 2008,
    price: '$9.00',
    image: 'how-alanon-works.jpg',
    description: 'Al-Anon&rsquo;s &ldquo;big book.&rdquo; If someone asks you what Al-Anon is, this is the book you hand them. It covers everything &mdash; what the program is, how meetings work, what the Steps mean in practice &mdash; all through the shared experience of real members. It&rsquo;s the most comprehensive single introduction to Al-Anon there is, and often the book that helps people finally understand they belong here.',
    purchaseLink: 'https://ecomm.al-anon.org/ItemDetail?iProductCode=B32',
    alsoAvailable: '<a href="https://ecomm.al-anon.org/ItemDetail?iProductCode=eB22" target="_blank" rel="noopener">eBook</a>',
    appTieIn: {
      heading: 'New to Al-Anon?',
      text: 'Daily Paths is a gentle daily companion for anyone in Al-Anon recovery &mdash; 366 original reflections grounded in program principles, delivered one day at a time.',
    },
    seoTitle: 'How Al-Anon Works \u2014 For Families & Friends of Alcoholics | Daily Paths',
    seoDescription: 'How Al-Anon Works is Al-Anon\u2019s comprehensive guide for families and friends of alcoholics. The most complete introduction to the program.',
    shortDescription: 'The most complete introduction to Al-Anon &mdash; the book you hand to someone new.',
  },
];

const DISCLAIMER = 'Daily Paths is not affiliated with, endorsed by, or an official publication of Al-Anon Family Group Headquarters, Inc. Al-Anon&reg; is a registered trademark of Al-Anon Family Group Headquarters, Inc.';

/**
 * Literature index page — grid of all 4 books
 */
export function renderLiteratureIndexPage() {
  const cards = BOOKS.map(book => `
        <a href="${bp(`/literature/${book.slug}/`)}" class="book-card">
          <div class="book-card-cover">
            <img src="${bp(`/assets/${book.image}`)}" alt="Cover of ${book.title} \u2014 Al-Anon ${book.category}" width="180" height="auto">
          </div>
          <span class="book-card-category">${book.category}</span>
          <span class="book-card-title">${book.title}</span>
          <span class="book-card-desc">${book.shortDescription}</span>
        </a>`).join('\n');

  const bodyContent = `
    <div class="content-page literature-page">
      <div class="content-container">
        <h1 class="page-title">Literature</h1>
        <p class="page-description">
          The books that Al-Anon members reach for most &mdash; daily readers,
          study guides, and essential introductions to the program.
        </p>

        <div class="book-grid">
${cards}
        </div>

        <p class="literature-disclaimer">${DISCLAIMER}</p>
      </div>
    </div>`;

  return wrapInLayout({
    title: 'Al-Anon Literature Guide \u2014 Essential Recovery Books | Daily Paths',
    description: 'A guide to the most important Al-Anon books \u2014 daily readers, study guides, and essential recovery literature for families affected by alcoholism.',
    canonicalPath: '/literature/',
    bodyContent,
    bodyClass: 'page-literature',
  });
}

/**
 * Individual book detail page
 */
export function renderLiteraturePage(book) {
  const subtitleHtml = book.subtitle
    ? `<p class="book-subtitle">${book.subtitle}</p>`
    : '';

  const structuredData = bookStructuredData(book);

  const bodyContent = `
    <div class="content-page literature-detail-page">
      <div class="book-detail">
        <nav class="breadcrumb">
          <a href="${bp('/literature/')}">Literature</a>
          <span class="breadcrumb-sep">/</span>
          <span>${book.title}</span>
        </nav>

        <span class="book-category">${book.category}</span>
        <h1 class="book-title">${book.title}</h1>
        ${subtitleHtml}
        <p class="book-meta">${book.catalogNumber} &middot; ${book.pages} pages &middot; ${book.year} &middot; ${book.price}</p>

        <div class="book-cover">
          <img src="${bp(`/assets/${book.image}`)}" alt="Cover of ${book.title} \u2014 Al-Anon ${book.category}" width="260" height="auto">
        </div>

        <p class="book-description">${book.description}</p>

        <a href="${book.purchaseLink}" target="_blank" rel="noopener" class="book-purchase-btn">
          Purchase from Al-Anon &#x2197;
        </a>

        <p class="book-also-available">Also available: ${book.alsoAvailable}</p>

        <div class="book-divider"></div>

        <div class="book-app-card">
          <h2 class="book-app-heading">${book.appTieIn.heading}</h2>
          <p class="book-app-text">${book.appTieIn.text}</p>
          <a href="${APP_STORE_URL}" target="_blank" rel="noopener" class="book-app-link">
            <img src="${bp('/assets/app-store-badge.svg')}" alt="Download on the App Store" class="book-app-badge">
          </a>
        </div>

        <p class="literature-disclaimer">${DISCLAIMER}</p>
      </div>
    </div>`;

  return wrapInLayout({
    title: book.seoTitle,
    description: book.seoDescription,
    canonicalPath: `/literature/${book.slug}/`,
    bodyContent,
    structuredData,
    ogImage: `/assets/${book.image}`,
    bodyClass: 'page-literature-detail',
  });
}
