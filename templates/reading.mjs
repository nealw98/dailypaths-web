import { wrapInLayout } from './base.mjs';
import { textToHtmlParagraphs, renderQuote, stripForMeta } from '../helpers/markdown.mjs';
import { dayToSlug } from '../helpers/slug-utils.mjs';
import { readingStructuredData } from '../helpers/seo.mjs';
import { bp } from '../helpers/config.mjs';
import { TOPICS } from './topics.mjs';

// Build reverse map: secondary_theme value → topic slug & name
const THEME_TO_TOPIC = {};
// Import the theme tags inline since they're not exported
const _TOPIC_THEME_TAGS = {
  'detachment':            ['Detachment', 'Release', 'Relinquishment', 'Freedom'],
  'powerlessness':         ['Powerlessness', 'Surrender', 'Acceptance', 'Relief'],
  'focus-on-yourself':     ['Self-Care', 'Self-care', 'Self-focus', 'Self-love', 'Self-Acceptance', 'Self-acceptance', 'Redirection', 'Focus'],
  'one-day-at-a-time':     ['Presence', 'Patience', 'Simplicity', 'Peace', 'Serenity'],
  'boundaries':            ['Boundaries', 'Respect', 'Independence', 'Self-Discipline'],
  'letting-go-of-control': ['Control', 'Flexibility', 'Willingness', 'Self-will'],
  'self-worth':            ['Self-worth', 'Self-esteem', 'Self-compassion', 'Identity', 'Self-forgiveness'],
  'higher-power':          ['Faith', 'Trust', 'Prayer', 'Spiritual Connection', 'Spiritual intimacy', 'Reliance', 'Spirit'],
  'honesty':               ['Honesty', 'Truth', 'Self-awareness', 'Awareness', 'Integrity', 'Clarity'],
  'gratitude-and-hope':    ['Gratitude', 'Hope', 'Miracles', 'Vision'],
  'the-disease':           ['Understanding', 'Compassion', 'Reality', 'Sanity'],
  'fellowship':            ['Fellowship', 'Connection', 'Community', 'Belonging', 'Unity', 'Sponsorship', 'Inclusion'],
};
for (const [topicSlug, tags] of Object.entries(_TOPIC_THEME_TAGS)) {
  const topic = TOPICS.find(t => t.slug === topicSlug);
  if (!topic) continue;
  for (const tag of tags) {
    THEME_TO_TOPIC[tag] = { slug: topicSlug, name: topic.name };
  }
}

/**
 * Generate the HTML for an individual reading page — editorial layout.
 *
 * @param {Object} reading - The reading data object
 * @param {Object} prevReading - Previous day's reading (for nav)
 * @param {Object} nextReading - Next day's reading (for nav)
 * @param {Array} [allReadings] - All 366 readings (for related readings sidebar)
 */
export function renderReadingPage(reading, prevReading, nextReading, allReadings = []) {
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

  // Build related readings sidebar from secondary_theme
  let relatedHtml = '';
  const theme = reading.secondary_theme;
  if (theme && allReadings.length > 0) {
    const related = allReadings.filter(
      r => r.secondary_theme === theme && r.day_of_year !== reading.day_of_year
    ).slice(0, 8);

    if (related.length > 0) {
      const relatedItems = related.map(r => {
        const rSlug = dayToSlug(r.day_of_year);
        return `
              <li class="rd-related-item">
                <a href="${bp(`/${rSlug}/`)}">
                  <span class="rd-related-date">${r.display_date}</span>
                  <span class="rd-related-title">${r.title}</span>
                </a>
              </li>`;
      }).join('\n');

      relatedHtml = `
            <div class="rd-sidebar-related">
              <h3 class="rd-sidebar-heading">More on ${theme}</h3>
              <p class="rd-sidebar-intro">Additional readings exploring this theme</p>
              <ul class="rd-related-list">
${relatedItems}
              </ul>
            </div>`;
    }
  }

  // Theme pill for header — links to topic page
  let themePill = '';
  if (reading.secondary_theme) {
    const topicMatch = THEME_TO_TOPIC[reading.secondary_theme];
    if (topicMatch) {
      themePill = `<a href="${bp(`/themes/${topicMatch.slug}/`)}" class="rd-hero-theme">${reading.secondary_theme}</a>`;
    } else {
      themePill = `<span class="rd-hero-theme">${reading.secondary_theme}</span>`;
    }
  }

  // Step theme link — links to step page
  let stepLabel = '';
  const stepTheme = reading.step_theme || '';
  if (stepTheme) {
    const stepMatch = stepTheme.match(/^Step (\d+)$/);
    if (stepMatch) {
      stepLabel = `<a href="${bp(`/steps/step-${stepMatch[1]}/`)}" class="rd-hero-step">${stepTheme}</a>`;
    } else {
      stepLabel = `<span class="rd-hero-step">${stepTheme}</span>`;
    }
  }

  const bodyContent = `
    <article class="reading-page">

      <!-- Hero Header -->
      <header class="rd-hero">
        <nav class="breadcrumb rd-hero-breadcrumb">
          <a href="${bp('/')}">Home</a>
          <span class="breadcrumb-sep">/</span>
          <span>${reading.display_date}</span>
        </nav>
        <p class="rd-hero-date">${reading.display_date}</p>
        <h1 class="rd-hero-title">${reading.title}</h1>
        <div class="rd-hero-tags">
          ${themePill}
          ${stepLabel}
        </div>
      </header>

      <!-- Two-Column Body -->
      <div class="rd-body-wrap">
        <div class="rd-body-inner">

          <!-- Main Column -->
          <div class="rd-main-col">
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
          </div>

          <!-- Sidebar -->
          <aside class="rd-sidebar">
${relatedHtml}

            <div class="rd-sidebar-app">
              <p class="rd-sidebar-heading">Take it with you</p>
              <p class="rd-sidebar-app-text">Read daily reflections on the go with the Al-Anon Daily Paths app.</p>
              <div class="rd-sidebar-badges">
                <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer">
                  <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" class="rd-sidebar-badge">
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.dailypaths" target="_blank" rel="noopener noreferrer">
                  <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" class="rd-sidebar-badge rd-sidebar-badge-play">
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <!-- Prev / Next Nav -->
      <nav class="rd-nav-footer">
        <a href="${bp(`/${prevSlug}/`)}" class="rd-nav-link rd-nav-prev">
          <span class="rd-nav-label">&larr; Previous</span>
          <span class="rd-nav-date">${prevReading.display_date}</span>
          <span class="rd-nav-title">${prevReading.title}</span>
        </a>
        <a href="${bp('/')}" class="rd-nav-today" data-today-nav>Today</a>
        <a href="${bp(`/${nextSlug}/`)}" class="rd-nav-link rd-nav-next">
          <span class="rd-nav-label">Next &rarr;</span>
          <span class="rd-nav-date">${nextReading.display_date}</span>
          <span class="rd-nav-title">${nextReading.title}</span>
        </a>
      </nav>

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
