import { wrapInLayout } from './base.mjs';
import { textToHtmlParagraphs, renderQuote, stripForMeta } from '../helpers/markdown.mjs';
import { dayToSlug } from '../helpers/slug-utils.mjs';
import { readingStructuredData } from '../helpers/seo.mjs';
import { bp } from '../helpers/config.mjs';

/**
 * Generate the HTML for an individual reading page.
 *
 * @param {Object} reading - The reading data object
 * @param {Object} prevReading - Previous day's reading (for nav)
 * @param {Object} nextReading - Next day's reading (for nav)
 */
export function renderReadingPage(reading, prevReading, nextReading) {
  const slug = dayToSlug(reading.day_of_year);
  const prevSlug = dayToSlug(prevReading.day_of_year);
  const nextSlug = dayToSlug(nextReading.day_of_year);

  const metaDescription = stripForMeta(reading.opening || reading.body);
  const structuredData = readingStructuredData(reading, slug);

  // Build the body content
  const quoteHtml = renderQuote(reading.quote);
  const openingHtml = textToHtmlParagraphs(reading.opening);
  const bodyHtml = textToHtmlParagraphs(reading.body);
  const applicationHtml = reading.application ? textToHtmlParagraphs(reading.application) : '';
  const thoughtHtml = reading.thought_for_day
    ? reading.thought_for_day.replace(/\\n/g, '\n').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
    : '';

  const bodyContent = `
    <article class="reading-page">
      <div class="reading-container">
        <header class="reading-header">
          <p class="reading-date">${reading.display_date}</p>
          <h1 class="reading-title">${reading.title}</h1>
        </header>

        <section class="reading-quote">
          ${quoteHtml}
        </section>

        <section class="reading-body">
          ${openingHtml}
          ${bodyHtml}
        </section>

        ${applicationHtml ? `
        <div class="reading-divider"></div>
        <section class="reading-application">
          ${applicationHtml}
        </section>
        ` : ''}

        ${thoughtHtml ? `
        <aside class="reading-thought">
          <p class="thought-label">Thought for the Day</p>
          <p class="thought-text">${thoughtHtml}</p>
        </aside>
        ` : ''}

        <nav class="reading-date-nav">
          <a href="${bp(`/${prevSlug}/`)}" class="date-nav-prev">&larr; ${prevReading.display_date}</a>
          <a href="${bp('/')}" class="date-nav-today" data-today-nav>Return to Today</a>
          <a href="${bp(`/${nextSlug}/`)}" class="date-nav-next">${nextReading.display_date} &rarr;</a>
        </nav>

        <aside class="app-cta">
          <p class="app-cta-heading">Enjoy Al-Anon Daily Paths on the go</p>
          <p class="app-cta-text">
            Save your favorite readings, receive gentle daily reminders,
            and read offline with the Al-Anon Daily Paths app.
          </p>
          <ul class="app-features">
            <li>Bookmark readings that speak to you</li>
            <li>Daily reminders at the time you choose</li>
            <li>Dark mode for evening reading</li>
            <li>Read offline, anytime</li>
          </ul>
          <a href="https://apps.apple.com/app/id6755981862" class="app-store-link" target="_blank" rel="noopener noreferrer">
            <img src="${bp('/assets/app-store-badge.svg')}" alt="Download on the App Store" class="app-store-badge">
          </a>
        </aside>
      </div>
    </article>`;

  return wrapInLayout({
    title: `${reading.title} \u2014 Al-Anon Daily Reflection for ${reading.display_date} | Al-Anon Daily Paths`,
    description: metaDescription,
    canonicalPath: `/${slug}/`,
    bodyContent,
    structuredData,
    ogType: 'article',
    ogImage: `/${slug}/og.png`,
    bodyClass: 'page-reading',
  });
}
