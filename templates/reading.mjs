import { wrapInLayout } from './base.mjs';
import { textToHtmlParagraphs, renderQuote, stripForMeta } from '../helpers/markdown.mjs';
import { dayToSlug } from '../helpers/slug-utils.mjs';
import { readingStructuredData, breadcrumbStructuredData } from '../helpers/seo.mjs';
import { bp } from '../helpers/config.mjs';
import { THEME_TO_TOPIC } from '../helpers/theme-data.mjs';

/**
 * Generate the HTML for an individual reading page — Editorial Meditation layout.
 *
 * @param {Object} reading - The reading data object
 * @param {Object} prevReading - Previous day's reading (for nav)
 * @param {Object} nextReading - Next day's reading (for nav)
 * @param {Array} [allReadings] - All 366 readings (for related readings)
 */
export function renderReadingPage(reading, prevReading, nextReading, allReadings = []) {
  const slug = dayToSlug(reading.day_of_year);
  const prevSlug = dayToSlug(prevReading.day_of_year);
  const nextSlug = dayToSlug(nextReading.day_of_year);

  const metaDescription = stripForMeta(reading.opening || reading.body);
  const structuredData = [
    readingStructuredData(reading, slug),
    breadcrumbStructuredData(reading, slug),
  ];

  // Build the body content
  const quoteHtml = renderQuote(reading.quote);
  const openingHtml = textToHtmlParagraphs(reading.opening);
  const bodyHtml = textToHtmlParagraphs(reading.body);
  const applicationHtml = reading.application ? textToHtmlParagraphs(reading.application) : '';
  const thoughtHtml = reading.thought_for_day
    ? reading.thought_for_day.replace(/\\n/g, '\n').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
    : '';

  // Theme pill — links to topic page
  let themePill = '';
  const theme = reading.secondary_theme;
  if (theme) {
    const topicMatch = THEME_TO_TOPIC[theme];
    if (topicMatch) {
      themePill = `<a href="${bp(`/principles/${topicMatch.slug}/`)}" class="rd-pill rd-pill--theme">${theme}</a>`;
    } else {
      themePill = `<span class="rd-pill rd-pill--theme">${theme}</span>`;
    }
  }

  // Step pill — links to step page
  let stepPill = '';
  const stepTheme = reading.step_theme || '';
  if (stepTheme) {
    const stepMatch = stepTheme.match(/^Step (\d+)$/);
    if (stepMatch) {
      stepPill = `<a href="${bp(`/steps/step-${stepMatch[1]}/`)}" class="rd-pill rd-pill--step">${stepTheme}</a>`;
    } else {
      stepPill = `<span class="rd-pill rd-pill--step">${stepTheme}</span>`;
    }
  }

  // Related readings — 4 from same theme
  let relatedHtml = '';
  if (theme && allReadings.length > 0) {
    const topicMatch = THEME_TO_TOPIC[theme];
    const topicName = topicMatch ? topicMatch.name : theme;
    const related = allReadings.filter(
      r => r.secondary_theme === theme && r.day_of_year !== reading.day_of_year
    ).slice(0, 4);

    if (related.length > 0) {
      const relatedItems = related.map(r => {
        const rSlug = dayToSlug(r.day_of_year);
        return `
            <a href="${bp(`/${rSlug}/`)}" class="rd-related-card">
              <span class="rd-related-date">${r.display_date}</span>
              <span class="rd-related-title">${r.title}</span>
            </a>`;
      }).join('\n');

      relatedHtml = `
      <!-- Related Readings -->
      <section class="rd-related-section">
        <h2 class="rd-related-heading">Reflections on ${topicName}</h2>
        <div class="rd-related-grid">
${relatedItems}
        </div>
      </section>`;
    }
  }

  const bodyContent = `
    <article class="reading-editorial">

      <!-- Header -->
      <header class="rd-header">
        <nav class="breadcrumb rd-breadcrumb" aria-label="Breadcrumb">
          <a href="${bp('/')}">Home</a>
          <span class="breadcrumb-sep">&rsaquo;</span>
          <span>Readings</span>
          <span class="breadcrumb-sep">&rsaquo;</span>
          <span>${reading.title}</span>
        </nav>
        <p class="rd-date">${reading.display_date}</p>
        <h1 class="rd-title">${reading.title}</h1>
        <div class="rd-pills">
          ${themePill}
          ${stepPill}
        </div>
      </header>

      <!-- Pull Quote -->
      <div class="rd-content">
        <section class="rd-quote">
          ${quoteHtml}
        </section>

        <section class="rd-body">
          ${openingHtml}
          ${bodyHtml}
        </section>

        ${applicationHtml ? `
        <div class="rd-divider"></div>
        <section class="rd-body">
          ${applicationHtml}
        </section>
        ` : ''}
      </div>

    </article>

    ${thoughtHtml ? `
    <!-- Today's Reminder — full-bleed terracotta -->
    <section class="rd-reminder bg-terracotta">
      <div class="rd-reminder-inner">
        <h2 class="rd-reminder-heading">Today&rsquo;s Reminder</h2>
        <p class="rd-reminder-text">${thoughtHtml}</p>
      </div>
    </section>
    ` : ''}

    <!-- Prev / Next Navigation -->
    <nav class="rd-nav">
      <a href="${bp(`/${prevSlug}/`)}" class="rd-nav-link rd-nav-prev">
        <span class="rd-nav-arrow">&larr;</span>
        <span class="rd-nav-meta">
          <span class="rd-nav-dir">Previous</span>
          <span class="rd-nav-link-title">${prevReading.title}</span>
        </span>
      </a>
      <a href="${bp(`/${nextSlug}/`)}" class="rd-nav-link rd-nav-next">
        <span class="rd-nav-meta">
          <span class="rd-nav-dir">Next</span>
          <span class="rd-nav-link-title">${nextReading.title}</span>
        </span>
        <span class="rd-nav-arrow">&rarr;</span>
      </a>
    </nav>

${relatedHtml}

    <!-- Engine CTA -->
    <section class="rd-engine-cta bg-navy">
      <div class="rd-engine-cta-inner">
        <h2 class="rd-engine-cta-heading">Continue Your Daily Practice</h2>
        <p class="rd-engine-cta-text">All 366 daily reflections and personal journaling tools in the Al-Anon Daily Paths App.</p>
        <div class="rd-engine-cta-badges">
          <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer" class="rd-engine-cta-badge-link">
            <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" class="rd-engine-cta-badge">
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.dailypaths" target="_blank" rel="noopener noreferrer" class="rd-engine-cta-badge-link">
            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" class="rd-engine-cta-badge rd-engine-cta-badge-play">
          </a>
        </div>
      </div>
    </section>`;

  return wrapInLayout({
    title: `${reading.display_date} - ${reading.title} | Al-Anon Daily Paths`,
    description: metaDescription,
    canonicalPath: `/${slug}/`,
    bodyContent,
    structuredData,
    ogType: 'article',
    ogImage: `/${slug}/og.png`,
    bodyClass: 'page-reading',
  });
}
