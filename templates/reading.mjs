import { wrapInLayout } from './base.mjs';
import { textToHtmlParagraphs, renderQuote, stripForMeta } from '../helpers/markdown.mjs';
import { dayToIsoDate, dayToMonthIndex, readingSlug, stepSlug, DAYS_IN_MONTH } from '../helpers/slug-utils.mjs';
import { readingStructuredData, breadcrumbStructuredData } from '../helpers/seo.mjs';
import { bp } from '../helpers/config.mjs';
import { THEME_TO_TOPIC } from '../helpers/theme-data.mjs';
import { STEPS } from './steps.mjs';

/**
 * Generate the HTML for an individual reading page — Editorial Meditation layout.
 *
 * @param {Object} reading - The reading data object
 * @param {Object} prevReading - Previous day's reading (for nav)
 * @param {Object} nextReading - Next day's reading (for nav)
 * @param {Array} [allReadings] - All 366 readings (for related readings)
 */
export function renderReadingPage(reading, prevReading, nextReading, allReadings = []) {
  const slug = readingSlug(reading.day_of_year, reading.title);
  const isoDate = dayToIsoDate(reading.day_of_year);
  const monthIdx = dayToMonthIndex(reading.day_of_year);
  // Compute day-of-month from day_of_year
  let dayOfMonth = reading.day_of_year;
  for (let m = 0; m < monthIdx; m++) dayOfMonth -= DAYS_IN_MONTH[m];
  const prevSlug = readingSlug(prevReading.day_of_year, prevReading.title);
  const nextSlug = readingSlug(nextReading.day_of_year, nextReading.title);

  const metaDescription = `${reading.title}: ${stripForMeta(reading.opening || reading.body)}`;
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
      themePill = `<a href="${bp(`/themes/${topicMatch.slug}/`)}" class="rd-pill rd-pill--theme">${theme}</a>`;
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
      const stepNum = parseInt(stepMatch[1], 10);
      const stepData = STEPS.find(s => s.number === stepNum);
      const sSlug = stepData ? stepSlug(stepNum, stepData.principle) : `al-anon-step-${stepNum}`;
      stepPill = `<a href="${bp(`/steps/${sSlug}/`)}" class="rd-pill rd-pill--step">${stepTheme}</a>`;
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
        const rSlug = readingSlug(r.day_of_year, r.title);
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
        <div class="rd-date-row">
          <time class="rd-date" datetime="${isoDate}">${reading.display_date}</time>
          <button class="rd-cal-trigger" aria-label="Open calendar navigation" data-calendar-trigger data-reading-month="${monthIdx}" data-reading-day="${dayOfMonth}">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect x="1.5" y="3" width="15" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M1.5 7.5h15" stroke="currentColor" stroke-width="1.5"/>
              <path d="M5.5 1.5v3M12.5 1.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
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
          ${applicationHtml}
        </section>
      </div>

    </article>

    ${thoughtHtml ? `
    <!-- Today's Reminder — card -->
    <section class="rd-reminder-card">
      <h2 class="rd-reminder-heading">Today&rsquo;s Reminder</h2>
      <p class="rd-reminder-text">${thoughtHtml}</p>
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

    <!-- App CTA -->
    <section class="rd-engine-cta bg-navy">
      <div class="rd-engine-cta-inner">
        <h2 class="rd-engine-cta-heading">Carry this peace in your pocket.</h2>
        <p class="rd-engine-cta-text">Never miss a day of recovery. Get this reflection and 365 others delivered to your phone daily. Start your journaling practice today with the Al-Anon Daily Paths app.</p>
        <div class="rd-engine-cta-badges">
          <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer" class="rd-engine-cta-badge-link">
            <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" class="rd-engine-cta-badge">
          </a>
          <span class="play-coming-soon">
            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" class="rd-engine-cta-badge rd-engine-cta-badge-play">
            <span class="play-coming-soon-label">Coming Soon</span>
          </span>
        </div>
      </div>
    </section>


${relatedHtml}`;

  return wrapInLayout({
    title: `${reading.title} \u2013 Al-Anon Daily Reflection for ${reading.display_date} | Daily Paths`,
    description: metaDescription,
    canonicalPath: `/${slug}/`,
    bodyContent,
    structuredData,
    ogType: 'article',
    ogImage: `/${slug}/og.png`,
    bodyClass: 'page-reading',
  });
}
