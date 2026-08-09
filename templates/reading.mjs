import { wrapInLayout } from './base.mjs';
import { textToHtmlParagraphs, parseQuote, stripForMeta } from '../helpers/markdown.mjs';
import { dayToIsoDate, dayToMonthIndex, readingSlug, stepSlug, DAYS_IN_MONTH } from '../helpers/slug-utils.mjs';
import { readingStructuredData, breadcrumbStructuredData } from '../helpers/seo.mjs';
import { bp } from '../helpers/config.mjs';
import { THEME_TO_TOPIC } from '../helpers/theme-data.mjs';
import { STEPS } from './steps.mjs';
import { photoHero, quoteBlock, pill, readingCard, ripple, storeBadges } from './ui.mjs';

const NUMBER_WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

/**
 * Generate the HTML for an individual reading page.
 *
 * Photo hero, then a single 820px reading column: pills, the source quotation
 * in a teal-edged panel, the reflection in Lora, Today's Reminder, prev/next,
 * app CTA, attribution.
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
  let dayOfMonth = reading.day_of_year;
  for (let m = 0; m < monthIdx; m++) dayOfMonth -= DAYS_IN_MONTH[m];
  const prevSlug = readingSlug(prevReading.day_of_year, prevReading.title);
  const nextSlug = readingSlug(nextReading.day_of_year, nextReading.title);

  const metaDescription = `${reading.title}: ${stripForMeta(reading.opening || reading.body)}`;
  const structuredData = [
    readingStructuredData(reading, slug),
    breadcrumbStructuredData(reading, slug),
  ];

  // Step number, if this reading is tagged to one
  const stepMatch = (reading.step_theme || '').match(/^Step (\d+)$/);
  const stepNum = stepMatch ? parseInt(stepMatch[1], 10) : null;
  const stepWord = stepNum ? NUMBER_WORDS[stepNum - 1] : '';

  // Hero eyebrow: "August 9 · Step Eight"
  const heroEyebrow = stepWord
    ? `${reading.display_date} &middot; Step ${stepWord}`
    : reading.display_date;

  // Pills — theme and step, each linking to its hub
  const pills = [];
  const theme = reading.secondary_theme;
  if (theme) {
    const topicMatch = THEME_TO_TOPIC[theme];
    pills.push(pill(theme, topicMatch ? { href: bp(`/themes/${topicMatch.slug}/`) } : {}));
  }
  if (reading.step_theme) {
    const stepData = stepNum ? STEPS.find(s => s.number === stepNum) : null;
    const sSlug = stepData ? stepSlug(stepNum, stepData.principle) : null;
    pills.push(pill(reading.step_theme, sSlug ? { href: bp(`/steps/${sSlug}/`) } : {}));
  }

  // Source quotation
  const { paragraphs: quoteParas, citation } = parseQuote(reading.quote);
  const quoteHtml = quoteParas.length
    ? `<div class="quote-panel rd-quote">
            ${quoteBlock({
              text: quoteParas.map(p => `<p style="margin:0 0 10px">${p}</p>`).join(''),
              attribution: citation,
            })}
          </div>`
    : '';

  const openingHtml = textToHtmlParagraphs(reading.opening);
  const bodyHtml = textToHtmlParagraphs(reading.body);
  const applicationHtml = reading.application ? textToHtmlParagraphs(reading.application) : '';

  const thoughtHtml = reading.thought_for_day
    ? reading.thought_for_day
      .replace(/\\n/g, '\n')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
    : '';

  // Related readings — 4 more from the same theme
  let relatedHtml = '';
  if (theme && allReadings.length > 0) {
    const topicMatch = THEME_TO_TOPIC[theme];
    const topicName = topicMatch ? topicMatch.name : theme;
    const related = allReadings
      .filter(r => r.secondary_theme === theme && r.day_of_year !== reading.day_of_year)
      .slice(0, 4);

    if (related.length > 0) {
      const cards = related.map(r => readingCard({
        href: bp(`/${readingSlug(r.day_of_year, r.title)}/`),
        date: r.display_date,
        title: r.title,
      })).join('\n');

      relatedHtml = `
    <section class="wrap wrap--article section--lg">
      <h2 class="section-title">Reflections on ${topicName}</h2>
      <div class="rd-related-grid">
${cards}
      </div>
    </section>`;
    }
  }

  const bodyContent = `
${photoHero({
    image: bp('/assets/themes/al-anon-hero.jpg'),
    alt: `Footbridge over a quiet stream — Al-Anon daily reflection for ${reading.display_date}`,
    eyebrow: `<time datetime="${isoDate}">${heroEyebrow}</time>`,
    title: reading.title,
    size: 'md',
    titleClass: 'photo-hero-title--reading',
  })}

    <article class="rd-article">
      <div class="pill-row rd-pills">
        ${pills.join('\n        ')}
        <button type="button" class="pill" data-calendar-trigger data-reading-month="${monthIdx}" data-reading-day="${dayOfMonth}" aria-label="Browse readings by date">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <rect x="1.5" y="3" width="15" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M1.5 7.5h15" stroke="currentColor" stroke-width="1.5"/>
            <path d="M5.5 1.5v3M12.5 1.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Browse by date
        </button>
      </div>

      ${quoteHtml}

      <div class="prose-lora rd-body">
        ${openingHtml}
        ${bodyHtml}
        ${applicationHtml}
      </div>

      ${thoughtHtml ? `<div class="panel-seafoam reminder-panel">
        <p class="reminder-label">Today&rsquo;s Reminder</p>
        <p class="reminder-text">${thoughtHtml}</p>
      </div>` : ''}

      <nav class="prevnext" aria-label="Previous and next reading">
        <a href="${bp(`/${prevSlug}/`)}" class="card-elevated prevnext-card">
          <span class="prevnext-label">&larr; Previous</span>
          <span class="prevnext-title">${prevReading.title}</span>
        </a>
        <a href="${bp(`/${nextSlug}/`)}" class="card-elevated prevnext-card prevnext-card--next">
          <span class="prevnext-label">Next &rarr;</span>
          <span class="prevnext-title">${nextReading.title}</span>
        </a>
      </nav>

      <div class="panel-gradient rd-app-panel" id="get-the-app">
        ${ripple(420)}
        <div class="rd-app-panel-inner">
          <h2 class="rd-app-heading">Carry this peace in your pocket.</h2>
          <p class="rd-app-text">Never miss a day. Get this reflection and 365 others delivered to your phone daily, and start your journaling practice in the app.</p>
          ${storeBadges({ context: 'reading' })}
        </div>
      </div>

      <p class="fine-print">Curated by members of the Al-Anon community for Daily Growth, LLC. Grounded in the Twelve Steps and the contemplative tradition of Al-Anon.</p>
    </article>
${relatedHtml}`;

  return wrapInLayout({
    title: `${reading.title} – Al-Anon Daily Reflection for ${reading.display_date} | Daily Paths`,
    description: metaDescription,
    canonicalPath: `/${slug}/`,
    bodyContent,
    structuredData,
    ogType: 'article',
    ogImage: `/${slug}/og.png`,
    bodyClass: 'page-reading',
    navSection: 'reflection',
    hasAppPanel: true,
  });
}
