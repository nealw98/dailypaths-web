import { wrapInLayout } from './base.mjs';
import { textToHtmlParagraphs, parseQuote, stripForMeta } from '../helpers/markdown.mjs';
import { dayToIsoDate, dayToMonthIndex, readingSlug, DAYS_IN_MONTH } from '../helpers/slug-utils.mjs';
import { readingStructuredData, breadcrumbStructuredData } from '../helpers/seo.mjs';
import { bp } from '../helpers/config.mjs';
import { THEME_TO_TOPIC, TOPICS } from '../helpers/theme-data.mjs';
import { themeDestination, pickSiblings, readingGroup, groupingTheme } from '../helpers/theme-destinations.mjs';
import { destinationMeta } from '../helpers/destination-catalog.mjs';
import { STEPS, STEP_HOOKS } from './steps.mjs';
import { photoHero, quoteBlock, pill, terminalBand } from './ui.mjs';
import { reflectionHeroImage, reflectionImage } from '../helpers/reflection-images.mjs';
import { TYPOGRAPHY_REVIEW_PATH } from '../helpers/typography-review.mjs';
import { themePath } from '../helpers/theme-pages.mjs';
import { COLLECTION_PAGES } from '../helpers/collection-pages.mjs';
import { readingTeaser } from '../helpers/favorite-readings.mjs';

const NUMBER_WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

// Themes are stored in title case and read as a phrase mid-sentence: "More on
// shame and guilt". Lowering only the first word left "shame and Guilt", so the
// whole name is lowered and the handful of proper nouns are put back.
const THEME_PROPER_NOUNS = [[/\bhigher power\b/g, 'Higher Power'], [/\bal-anon\b/g, 'Al-Anon'], [/\bgod\b/g, 'God']];
function lowerTheme(text) {
  if (!text) return text;
  return THEME_PROPER_NOUNS.reduce((s, [re, word]) => s.replace(re, word), text.toLowerCase());
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

  // Hero eyebrow: "Al-Anon daily reflection · August 9".
  //
  // The Step used to sit here too, an inch above a pill that says the same thing
  // and is a link. What was missing instead was any sign of what this page is: a
  // reader arriving from a search saw the site name, a date and a title, and the
  // word Al-Anon appeared nowhere until the fine print at the foot.
  //
  // Only the date goes inside <time>, so the machine-readable date does not end
  // up wrapping the words around it.
  const heroEyebrow = `Al-Anon daily reflection &middot; <time datetime="${isoDate}">${reading.display_date}</time>`;

  // Theme destinations support the discovery sections below the reading.
  const theme = reading.secondary_theme;
  const topicMatch = theme ? THEME_TO_TOPIC[theme] : null;
  // Resolved once, for the Go deeper card and the grouping alike, so a
  // theme assigned in the table cannot reach one of them and not the others.
  // The grouping theme owns the destination once it is populated, since the table
  // is keyed to that vocabulary; secondary_theme answers until then.
  const destinationPath = themeDestination(groupingTheme(reading) || theme);
  const destination = destinationMeta(destinationPath);
  const stepData = stepNum ? STEPS.find(s => s.number === stepNum) : null;
  const stepPath = stepData ? `/months/${stepData.monthSlug}/` : null;

  // 63 reflections are tagged to a Tradition or a Concept rather than a Step, and
  // their pill rendered as dead text for want of a page to point at. Each now
  // lands on its own section of the matching collection.
  const collectionMatch = (reading.step_theme || '').match(/^(Tradition|Concept) (\d+)$/);
  const collectionPage = collectionMatch
    ? COLLECTION_PAGES.find(page => page.stepTag === collectionMatch[1])
    : null;
  const programPath = stepPath
    || (collectionPage ? `${collectionPage.path}#${collectionMatch[1].toLowerCase()}-${collectionMatch[2]}` : null);

  // Keep only the primary Step, Tradition, or Concept pill above the reading.
  const pills = [];
  if (reading.step_theme) {
    const principleWords = reading.step_theme.replace(/\b(\d+)\b/, m => NUMBER_WORDS[Number(m) - 1] || m);
    pills.push(programPath ? pill(principleWords, { href: bp(programPath) }) : pill(principleWords));
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

  // Related reflections — the others whose theme sends the reader to the same
  // place. Each card carries its own theme word, because the variety is the
  // point: three different words on one destination read as three angles on an
  // idea, where three copies of "Trust" would read as a list of duplicates.
  // Where a theme has no destination yet, the group falls back to the Step,
  // Tradition or Concept this reflection belongs to, so the block appears on every
  // page rather than only on the ones whose theme has been assigned.
  const group = readingGroup(reading, allReadings);
  let keepReadingHtml = '';
  if (group && allReadings.length > 0) {
    const siblings = pickSiblings(reading, allReadings, {
      limit: 3,
      exclude: [prevReading.day_of_year, nextReading.day_of_year],
      ratingsMap,
    });

    if (siblings.length > 0) {
      // No eyebrow on the card. Every reflection here shares the heading's theme, so
      // printing it three times says nothing, and printing the older secondary_theme
      // instead showed the reader a vocabulary the site no longer files by — and
      // repeated a word on 31 pages where a small group had few distinct ones. The
      // date and title separate them; the heading says what they have in common.
      const cards = siblings.map(r => {
        const teaser = readingTeaser(r);
        return `
          <a href="${bp(`/${readingSlug(r.day_of_year, r.title)}/`)}" class="kr-card">
            <span class="kr-card-date">${r.display_date}</span>
            <span class="kr-card-title">${r.title}</span>
            ${teaser ? `<span class="kr-card-teaser">${teaser}</span>` : ''}
            <span class="kr-card-cta">Read</span>
          </a>`;
      }).join('');

      const programWords = group.kind === 'program'
        ? group.label.replace(/\b(\d+)\b/, m => NUMBER_WORDS[Number(m) - 1] || m)
        : '';
      // A grouping theme names itself — "More on amends" is what those fourteen
      // readings have in common, where the destination could only be named by
      // where they lead. Proper nouns inside a theme keep their capitals.
      const themeWords = group.kind === 'theme' ? lowerTheme(group.theme) : '';
      const heading = group.kind === 'theme'
        ? `More on ${themeWords}`
        : group.kind === 'destination'
          ? `More on ${(theme || 'this').toLowerCase()}`
          : `More on ${programWords}`;
      keepReadingHtml = `
    <section class="wrap wrap--article section--lg kr-section" aria-labelledby="keep-reading-heading">
      <p class="eyebrow">Related reflections</p>
      <h2 class="section-title" id="keep-reading-heading">${heading}</h2>
      <div class="kr-grid">${cards}
      </div>
    </section>`;
    }
  }

  // Go deeper — the piece this reflection's theme points at, labelled by what it
  // is, beside the collection the reflection belongs to. This replaces the
  // related-topics scaffolding, which offered two cards from a topic-adjacency
  // map and fell back to the same generic pair on every untagged reading.
  const programCard = stepData
    ? {
      label: 'Reflections', title: `Step ${stepWord}: ${stepData.principle}`,
      description: `${STEP_HOOKS[stepData.number]} Read every ${stepData.month} reflection on this Step.`,
      cta: 'Explore the collection', path: stepPath,
    }
    : collectionPage
      ? {
        label: 'Reflections', title: `${collectionPage.stepTag} ${NUMBER_WORDS[Number(collectionMatch[2]) - 1] || collectionMatch[2]}`,
        description: `Part of ${collectionPage.title}. Read the reflections written alongside it.`,
        cta: 'Explore the collection', path: programPath,
      }
      : null;

  const deeperCards = [];
  if (destination && destinationPath) deeperCards.push({ ...destination, path: destinationPath });
  // A theme pointing at the reflection's own collection would repeat the card.
  if (programCard && !deeperCards.some(card => card.path === programCard.path)) deeperCards.push(programCard);

  const goDeeperHtml = deeperCards.length ? `
    <section class="wrap wrap--article deeper-section" aria-labelledby="go-deeper-heading">
      <p class="eyebrow">Go deeper</p>
      <p class="section-title" id="go-deeper-heading">Understand it. Put it into practice.</p>
      <div class="deeper-grid">
        ${deeperCards.map(card => `<a href="${bp(card.path)}" class="deeper-card">
          <span class="deeper-card-type">${card.label}</span>
          <span class="deeper-card-title">${card.title}</span>
          <span class="deeper-card-line">${card.description}</span>
          <span class="deeper-card-cta">${card.cta}</span>
        </a>`).join('\n        ')}
      </div>
    </section>` : '';

  const bodyContent = `
${photoHero({
    image: bp(`/assets/${typographyPreview
      ? reflectionImage(reading.day_of_year, topicMatch?.slug)
      : reflectionHeroImage(reading.day_of_year, topicMatch?.slug)}`),
    alt: '',
    eyebrow: heroEyebrow,
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
      </div>

      ${applicationHtml ? `<section class="rd-practice" aria-labelledby="practice-heading">
        <h2 class="eyebrow" id="practice-heading">Practice</h2>
        <div class="prose-lora">${applicationHtml}</div>
      </section>` : ''}

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
        <button type="button" class="rd-calendar-trigger" data-calendar-trigger data-reading-month="${monthIdx}" data-reading-day="${dayOfMonth}">Browse the reading calendar</button>
      </p>
    </article>

${keepReadingHtml}
${goDeeperHtml}

    <div class="wrap wrap--article rd-attribution">
      <p class="fine-print">Curated by members of the Al-Anon community for Daily Growth, LLC. Grounded in the Twelve Steps and the contemplative tradition of Al-Anon.</p>
    </div>

    ${terminalBand()}`;

  return wrapInLayout({
    title: `${reading.title} – Al-Anon Daily Reflection for ${reading.display_date} | Daily Paths`,
    description: metaDescription,
    canonicalPath: typographyPreview ? TYPOGRAPHY_REVIEW_PATH : `/${slug}/`,
    bodyContent: typographyPreview ? bodyContent.replaceAll('prose-lora', 'prose-reading') : bodyContent,
    structuredData: typographyPreview ? undefined : structuredData,
    typographyPreview,
    noindex: typographyPreview,
    ogType: 'article',
    ogImage: `/${slug}/og.jpg`,
    bodyClass: 'page-reading',
    navSection: 'reflection',
    hasAppPanel: true,
  });
}
