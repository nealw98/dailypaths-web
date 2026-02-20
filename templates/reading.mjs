import { wrapInLayout } from './base.mjs';
import { textToHtmlParagraphs, renderQuote, stripForMeta } from '../helpers/markdown.mjs';
import { dayToSlug } from '../helpers/slug-utils.mjs';
import { readingStructuredData } from '../helpers/seo.mjs';
import { bp } from '../helpers/config.mjs';
import { TOPICS } from './topics.mjs';

// Build reverse map: secondary_theme value → topic slug & name
const THEME_TO_TOPIC = {};
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
  const structuredData = readingStructuredData(reading, slug);

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
        <nav class="breadcrumb rd-breadcrumb">
          <a href="${bp('/')}">Home</a>
          <span class="breadcrumb-sep">/</span>
          <span>${reading.display_date}</span>
        </nav>
        <p class="rd-date">${reading.display_date}</p>
        <h1 class="rd-title">${reading.title}</h1>
        <div class="rd-pills">
          ${themePill}
          ${stepPill}
        </div>
      </header>

      <!-- Centered Reading Body -->
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

        ${thoughtHtml ? `
        <aside class="rd-thought">
          <p class="rd-thought-label">Thought for the Day</p>
          <p class="rd-thought-text">${thoughtHtml}</p>
        </aside>
        ` : ''}
      </div>

      <!-- Prev / Next Navigation -->
      <nav class="rd-nav">
        <a href="${bp(`/${prevSlug}/`)}" class="rd-nav-link rd-nav-prev">
          <span class="rd-nav-dir">&larr; Previous</span>
          <span class="rd-nav-link-date">${prevReading.display_date}</span>
          <span class="rd-nav-link-title">${prevReading.title}</span>
        </a>
        <a href="${bp('/')}" class="rd-nav-today" data-today-nav>Today</a>
        <a href="${bp(`/${nextSlug}/`)}" class="rd-nav-link rd-nav-next">
          <span class="rd-nav-dir">Next &rarr;</span>
          <span class="rd-nav-link-date">${nextReading.display_date}</span>
          <span class="rd-nav-link-title">${nextReading.title}</span>
        </a>
      </nav>

${relatedHtml}

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
