import { wrapInLayout } from './base.mjs';
import { textToHtmlParagraphs, parseQuote, stripForMeta } from '../helpers/markdown.mjs';
import { dayToIsoDate, dayToMonthIndex, readingSlug, stepRecordSlug, DAYS_IN_MONTH } from '../helpers/slug-utils.mjs';
import { readingStructuredData, breadcrumbStructuredData } from '../helpers/seo.mjs';
import { bp } from '../helpers/config.mjs';
import { THEME_TO_TOPIC, TOPICS, TOPIC_RELATED, DEFAULT_RELATED_TOPICS } from '../helpers/theme-data.mjs';
import { STEPS, STEP_HOOKS } from './steps.mjs';
import { photoHero, quoteBlock, pill, icon, terminalBand } from './ui.mjs';
import { reflectionImage } from '../helpers/reflection-images.mjs';
import { TYPOGRAPHY_REVIEW_PATH } from '../helpers/typography-review.mjs';
import { ARTICLES } from '../helpers/content-catalog.mjs';

const NUMBER_WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

const SMALL_COUNT_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS_COUNT_WORDS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/** 42 → "forty-two"; falls back to the numeral past ninety-nine. */
function countToWords(n) {
  if (n < 20) return SMALL_COUNT_WORDS[n];
  if (n < 100) {
    const tens = TENS_COUNT_WORDS[Math.floor(n / 10)];
    const ones = n % 10;
    return ones ? `${tens}-${SMALL_COUNT_WORDS[ones]}` : tens;
  }
  return String(n);
}

function lowerFirst(text) { return text ? text.charAt(0).toLowerCase() + text.slice(1) : text; }
function upperFirst(text) { return text ? text.charAt(0).toUpperCase() + text.slice(1) : text; }
function stripPeriod(text) { return text ? text.replace(/\.\s*$/, '') : text; }

/**
 * Card teaser: the reading's own reminder line, used only when it fits on
 * roughly one line. Interim until the authored `teaser` field exists in the
 * reading record (design/handoff/daily-reflection-page.md).
 */
function readingTeaser(reading) {
  const teaser = (reading.thought_for_day || '')
    .replace(/\\n/g, ' ')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .trim();
  return teaser.length > 0 && teaser.length <= 110 ? teaser : '';
}

/**
 * Generate the HTML for an individual reading page — the site's main hub
 * (the home page renders today's through this same template).
 *
 * A reflection hands you to its own topic, its own Step, and other readings
 * in that topic — nothing generic (design/handoff/daily-reflection-page.md):
 * hero → linked pills → quote → body → reminder → prev/next → calendar →
 * attribution → New here panel → Keep reading → Related topics → app CTA.
 *
 * @param {Object} reading - The reading data object
 * @param {Object} prevReading - Previous day's reading (for nav)
 * @param {Object} nextReading - Next day's reading (for nav)
 * @param {Array} [allReadings] - All 366 readings (for sibling selection)
 * @param {Map} [ratingsMap] - day_of_year → {positive, total}, ranks siblings
 */
export function renderReadingPage(reading, prevReading, nextReading, allReadings = [], ratingsMap = new Map(), { typographyPreview = false } = {}) {
  const slug = readingSlug(reading.day_of_year, reading.title);
  const hasBespokeHero = slug === 'september-10-the-lie-of-habitual-apologies' && !typographyPreview;
  const isDiscoveryTrial = slug === 'september-11-the-trap-of-self-spared-discomfort' && !typographyPreview;
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

  // Pills — the reading's own topic and Step as live, arrowed links. The same
  // destinations reappear after the reading (Keep reading, the Step card):
  // intentional duplication at two different moments.
  const theme = reading.secondary_theme;
  const topicMatch = theme ? THEME_TO_TOPIC[theme] : null;
  const topicData = topicMatch ? TOPICS.find(t => t.slug === topicMatch.slug) : null;
  const stepData = stepNum ? STEPS.find(s => s.number === stepNum) : null;
  const stepPath = stepData ? `/steps/${stepRecordSlug(stepData)}/` : null;
  const monthStepData = STEPS.find(step => step.number === monthIdx + 1);

  const pills = [];
  if (topicMatch) {
    pills.push(pill(`${topicMatch.name} &rarr;`, { href: bp(`/topics/${topicMatch.slug}/`) }));
  } else if (theme) {
    pills.push(pill(theme));
  }
  if (reading.step_theme) {
    const principleWords = reading.step_theme.replace(/\b(\d+)\b/, m => NUMBER_WORDS[Number(m) - 1] || m);
    pills.push(stepPath ? pill(`${principleWords} &rarr;`, { href: bp(stepPath) }) : pill(principleWords));
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

  const openingHtml = textToHtmlParagraphs(reading.opening).replace('<p>', '<p class="type-lede">');
  const bodyHtml = textToHtmlParagraphs(reading.body);
  const applicationHtml = reading.application ? textToHtmlParagraphs(reading.application) : '';

  const thoughtHtml = reading.thought_for_day
    ? reading.thought_for_day
      .replace(/\\n/g, '\n')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
    : '';

  // Keep reading — the September 11 trial expands this to six crawlable links
  // from the current month, ranked by combined positive ratings and favorites.
  // The remaining 365 pages retain their current three-card treatment until
  // the trial is approved.
  let keepReadingHtml = '';
  if (topicMatch && allReadings.length > 0) {
    const collection = allReadings.filter(r => {
      const t = r.secondary_theme && THEME_TO_TOPIC[r.secondary_theme];
      return t && t.slug === topicMatch.slug;
    });
    const excluded = new Set([reading.day_of_year, prevReading.day_of_year, nextReading.day_of_year]);
    const rankReadings = candidates => candidates
      .filter(r => !excluded.has(r.day_of_year))
      .sort((a, b) => {
        const ra = (ratingsMap.get(a.day_of_year) || {}).positive || 0;
        const rb = (ratingsMap.get(b.day_of_year) || {}).positive || 0;
        if (rb !== ra) return rb - ra;
        return a.day_of_year - b.day_of_year;
      });

    let selections;
    if (isDiscoveryTrial) {
      const monthStart = DAYS_IN_MONTH.slice(0, monthIdx).reduce((sum, days) => sum + days, 0) + 1;
      const monthEnd = monthStart + DAYS_IN_MONTH[monthIdx] - 1;
      selections = allReadings
        .filter(candidate => candidate.day_of_year >= monthStart && candidate.day_of_year <= monthEnd && candidate.day_of_year !== reading.day_of_year)
        .sort((a, b) => {
          const aStats = ratingsMap.get(a.day_of_year) || {};
          const bStats = ratingsMap.get(b.day_of_year) || {};
          const aScore = (aStats.positive || 0) + (aStats.favorites || 0);
          const bScore = (bStats.positive || 0) + (bStats.favorites || 0);
          if (bScore !== aScore) return bScore - aScore;
          if ((bStats.positive || 0) !== (aStats.positive || 0)) return (bStats.positive || 0) - (aStats.positive || 0);
          return a.day_of_year - b.day_of_year;
        })
        .slice(0, 6)
        .map(candidate => ({ reading: candidate, context: '' }));
    } else {
      selections = rankReadings(collection).slice(0, 3).map(candidate => ({ reading: candidate, context: '' }));
    }

    if (selections.length > 0) {
      const cards = selections.map(({ reading: r, context }) => {
        const teaser = readingTeaser(r);
        return `
          <a href="${bp(`/${readingSlug(r.day_of_year, r.title)}/`)}" class="kr-card">
            ${context ? `<span class="kr-card-context">${context}</span>` : ''}
            <span class="kr-card-date">${r.display_date}</span>
            <span class="kr-card-title">${r.title}</span>
            ${teaser ? `<span class="kr-card-teaser">${teaser}</span>` : ''}
            <span class="kr-card-cta">Read &rarr;</span>
          </a>`;
      }).join('');

      const topicHref = isDiscoveryTrial && monthStepData
        ? bp(`/months/${monthStepData.monthSlug}/`)
        : bp(`/topics/${topicMatch.slug}/`);
      const collectionLine = topicData
        ? `${upperFirst(countToWords(collection.length))} readings on ${lowerFirst(stripPeriod(topicData.shortDescription))}.`
        : '';
      keepReadingHtml = `
    <section class="wrap wrap--article section--lg kr-section${isDiscoveryTrial ? ' kr-section--trial' : ''}" aria-labelledby="keep-reading-heading">
      <p class="eyebrow">${isDiscoveryTrial ? 'Related Readings' : 'Keep reading'}</p>
      <h2 class="section-title" id="keep-reading-heading">${isDiscoveryTrial && monthStepData ? `Additional reflections on Step ${monthStepData.number} &mdash; ${monthStepData.principle}` : `More on ${topicMatch.name.toLowerCase()}`}</h2>
      ${isDiscoveryTrial && monthStepData ? `<p class="section-desc">${STEP_HOOKS[monthStepData.number]}</p>` : (collectionLine ? `<p class="section-desc">${collectionLine}</p>` : '')}
      <div class="kr-grid${isDiscoveryTrial ? ' kr-grid--carousel' : ''}">${cards}
      </div>
      <div class="kr-more">
        <a href="${topicHref}${isDiscoveryTrial ? '' : '#readings'}" class="text-link">${isDiscoveryTrial && monthStepData ? `More ${monthStepData.month} readings` : 'More readings'} &rarr;</a>
      </div>
    </section>`;
    }
  }

  // The real ad integration will replace the contents of this reserved slot.
  // Keeping it in the template now lets spacing and discovery modules be
  // designed around advertising without mixing paid and editorial cards.
  const adPlaceholderHtml = `
    <aside class="ad-slot wrap wrap--article" data-ad-slot="reflection-after-keep-reading" aria-label="Advertisement">
      <span class="ad-slot-label">Advertisement</span>
    </aside>`;

  // Related topics — scaffolding on every reading page: two topic cards from
  // the topic-adjacency map (per-reading secondary topics replace this when
  // topics-v2 tagging lands), then the reading's Step, worded to explain
  // itself to a newcomer. Untagged readings fall back to the default pair.
  const relatedSlugs = (topicMatch && TOPIC_RELATED[topicMatch.slug]) || DEFAULT_RELATED_TOPICS;
  const relatedCards = relatedSlugs
    .map(slug => TOPICS.find(t => t.slug === slug))
    .filter(t => t && (!topicMatch || t.slug !== topicMatch.slug))
    .slice(0, 2)
    .map(t => `
          <a href="${bp(`/topics/${t.slug}/`)}" class="rt-card">
            <span class="rt-card-title">${t.name}</span>
            <span class="rt-card-line">${t.shortDescription}</span>
            <span class="rt-card-meta">Read &rarr;</span>
          </a>`);
  if (stepData) {
    relatedCards.push(`
          <a href="${bp(stepPath)}" class="rt-card">
            <span class="rt-card-title">${stepData.principle}</span>
            <span class="rt-card-line">Step ${stepWord} &mdash; the Step this reading belongs to.</span>
            <span class="rt-card-meta">Read &rarr;</span>
          </a>`);
  }
  const relatedTopicsHtml = `
    <section class="wrap wrap--article rt-section">
      <p class="eyebrow">Related topics</p>
      <div class="rt-grid">${relatedCards.join('')}
      </div>
    </section>`;

  const relatedArticle = isDiscoveryTrial
    ? ARTICLES.find(article => article.path === `/topics/${topicMatch.slug}/`)
    : null;
  const goDeeperHtml = isDiscoveryTrial ? `
    <section class="wrap wrap--article deeper-section" aria-labelledby="go-deeper-heading">
      <p class="eyebrow">Go deeper</p>
      <h2 class="section-title" id="go-deeper-heading">Understand it. Put it into practice.</h2>
      <div class="deeper-grid">
        ${relatedArticle ? `<a href="${bp(relatedArticle.path)}" class="deeper-card">
          <span class="deeper-card-type">Relevant article</span>
          <span class="deeper-card-title">${relatedArticle.title}</span>
          <span class="deeper-card-line">${relatedArticle.description}</span>
          <span class="deeper-card-cta">Read the article &rarr;</span>
        </a>` : ''}
        ${stepData ? `<a href="${bp(stepPath)}" class="deeper-card">
          <span class="deeper-card-type">Practical guide</span>
          <span class="deeper-card-title">Step ${stepWord}: ${stepData.principle}</span>
          <span class="deeper-card-line">A practical look at responsibility, amends, and changing the behavior that caused harm.</span>
          <span class="deeper-card-cta">Explore the guide &rarr;</span>
        </a>` : ''}
      </div>
    </section>` : relatedTopicsHtml;

  const bodyContent = `
${photoHero({
    image: bp(hasBespokeHero
      ? '/assets/reflections/september-10-habitual-apologies-soft-daylight.webp'
      : `/assets/${reflectionImage(reading.day_of_year, topicMatch?.slug)}`),
    alt: '',
    eyebrow: `<time datetime="${isoDate}">${heroEyebrow}</time>`,
    title: reading.title,
    size: 'md',
    titleClass: 'photo-hero-title--reading',
    heroClass: 'photo-hero--soft-daylight',
  })}

    <article class="rd-article">
      <div class="pill-row rd-pills">
        ${pills.join('\n        ')}
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

      <p class="rd-calendar-link">
        <button type="button" class="rd-calendar-trigger" data-calendar-trigger data-reading-month="${monthIdx}" data-reading-day="${dayOfMonth}">Browse the reading calendar &rarr;</button>
      </p>
    </article>

    ${isDiscoveryTrial ? '' : `<div class="wrap wrap--article">
      <a href="${bp('/start/')}" class="new-here-panel">
        ${icon('lightOnWater', { size: 28, className: 'new-here-icon' })}
        <span class="new-here-copy">
          <span class="new-here-heading">Is someone else&rsquo;s drinking affecting your life?</span>
          <span class="new-here-line">Five questions, two minutes. Nothing you answer is saved or sent anywhere.</span>
        </span>
        <span class="btn new-here-btn">Start here &rarr;</span>
      </a>
    </div>`}
${isDiscoveryTrial ? `<div class="reading-discovery-shell">
${keepReadingHtml}
${adPlaceholderHtml.replace('ad-slot wrap wrap--article', 'ad-slot ad-slot--rail')}
${goDeeperHtml}
    </div>` : `${keepReadingHtml}\n${adPlaceholderHtml}\n${goDeeperHtml}`}

    <div class="wrap wrap--article">
      <p class="fine-print">Curated by members of the Al-Anon community for Daily Growth, LLC. Grounded in the Twelve Steps and the contemplative tradition of Al-Anon.</p>
    </div>

    ${terminalBand({ showEmailOption: isDiscoveryTrial })}`;

  return wrapInLayout({
    title: `${reading.title} – Al-Anon Daily Reflection for ${reading.display_date} | Daily Paths`,
    description: metaDescription,
    canonicalPath: typographyPreview ? TYPOGRAPHY_REVIEW_PATH : `/${slug}/`,
    bodyContent: typographyPreview ? bodyContent.replaceAll('prose-lora', 'prose-reading') : bodyContent,
    structuredData: typographyPreview ? undefined : structuredData,
    typographyPreview,
    noindex: typographyPreview,
    ogType: 'article',
    ogImage: `/${slug}/og.png`,
    bodyClass: `page-reading${isDiscoveryTrial ? ' discovery-trial-page' : ''}`,
    navSection: 'reflection',
    hasAppPanel: true,
  });
}
