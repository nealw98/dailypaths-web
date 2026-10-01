import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';
import { readingSlug, stepRecordSlug, MONTHS, DAYS_IN_MONTH } from '../helpers/slug-utils.mjs';
import { STEPS, STEP_HOOKS } from './steps.mjs';
import { markdownToHtml } from '../helpers/markdown.mjs';
import { STEP_ONE_OPENING } from './step-one-essay.mjs';
import { STEP_TWO_OPENING } from './step-two-essay.mjs';
import { STEP_THREE_OPENING } from './step-three-essay.mjs';
import { STEP_FOUR_OPENING } from './step-four-essay.mjs';
import { STEP_FIVE_OPENING } from './step-five-essay.mjs';
import { STEP_SIX_OPENING } from './step-six-essay.mjs';
import { STEP_SEVEN_OPENING } from './step-seven-essay.mjs';
import { STEP_EIGHT_OPENING } from './step-eight-essay.mjs';
import { STEP_NINE_OPENING } from './step-nine-essay.mjs';
import { STEP_TEN_OPENING } from './step-ten-essay.mjs';

// Stable collection URLs are retained; membership is determined by primary theme.
const STEP_WORDS = ['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve'];

export function renderMonthArchivePage(monthIndex, readings) {
  const monthName = MONTHS[monthIndex];
  const step = STEPS[monthIndex];
  const stepName = `Step ${STEP_WORDS[monthIndex]}`;
  const stepOpening = ({ 1: STEP_ONE_OPENING, 2: STEP_TWO_OPENING, 3: STEP_THREE_OPENING, 4: STEP_FOUR_OPENING, 5: STEP_FIVE_OPENING, 6: STEP_SIX_OPENING, 7: STEP_SEVEN_OPENING, 8: STEP_EIGHT_OPENING, 9: STEP_NINE_OPENING, 10: STEP_TEN_OPENING })[step.number] || (step.description || []).find(p => !/^\s*\*\*/.test(p)) || '';
  const previous = MONTHS[(monthIndex + 11) % 12];
  const next = MONTHS[(monthIndex + 1) % 12];

  const stepReadings = readings.filter(r => (r.step_theme || '').trim() === `Step ${step.number}`)
    .sort((a, b) => a.day_of_year - b.day_of_year);
  const readingItems = stepReadings.map(r => {
    let day = r.day_of_year;
    let month = 0;
    while (day > DAYS_IN_MONTH[month]) day -= DAYS_IN_MONTH[month++];
    const date = `${MONTHS[month][0].toUpperCase()}${MONTHS[month].slice(1)} ${day}`;
    return `<li class="ma-reading-item"><a href="${bp(`/${readingSlug(r.day_of_year, r.title)}/`)}" class="ma-reading-link"><span class="ma-reading-day">${date}</span><span class="ma-reading-title">${r.title || 'Daily Reading'}</span></a></li>`;
  });
  const midpoint = Math.ceil(readingItems.length / 2);
  const readingColumns = [readingItems.slice(0, midpoint), readingItems.slice(midpoint)]
    .map(items => `<ul class="ma-week-list">${items.join('\n')}</ul>`).join('\n');

  const bodyContent = `
    <div class="wrap section--md">
      <!-- Back to reflection collections -->
      <nav class="ma-back-nav">
        <a href="${bp('/reflections/')}" class="ma-back-link">&larr; All reflection collections</a>
      </nav>

      <!-- Page Header -->
      <header class="ma-header">
        <p class="eyebrow ma-collection-eyebrow">${stepName}</p>
        <h1 class="ma-title">${step.principle}</h1>
        <p class="ma-step-statement">${step.text}</p>
        <div class="ma-essay-preview">
          <p class="ma-essay-excerpt">${markdownToHtml(stepOpening.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'))}</p>
          <a class="ma-essay-link" href="${bp(`/steps/${stepRecordSlug(step)}/`)}">Read more about ${stepName} <span aria-hidden="true">→</span></a>
        </div>
      </header>

      <div class="ma-reading-intro"><h2>Reflections on ${stepName}</h2></div>
      <!-- Readings explicitly assigned to this Step -->
      <div class="ma-chapters">
${readingColumns}
      </div>

      <nav class="ma-month-nav" aria-label="Other Steps"><a href="${bp('/months/'+previous+'/')}">← Step ${STEP_WORDS[(monthIndex + 11) % 12]}</a><a href="${bp('/reflections/')}">All reflections</a><a href="${bp('/months/'+next+'/')}">Step ${STEP_WORDS[(monthIndex + 1) % 12]} →</a></nav>
      <!-- Engine CTA -->
      <section class="ma-engine-cta bg-navy">
        <div class="ma-engine-cta-inner">
          <h2 class="ma-engine-cta-heading">Take your reflections with you</h2>
          <p class="ma-engine-cta-text">Get all 366 daily reflections and personal journaling tools in the Al-Anon Daily Paths App.</p>
          <div class="ma-engine-cta-badges">
            <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer" class="ma-engine-cta-badge-link">
              <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" class="ma-engine-cta-badge">
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.nealw98.dailypaths" target="_blank" rel="noopener noreferrer" class="ma-engine-cta-badge-link">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" class="ma-engine-cta-badge ma-engine-cta-badge-play">
            </a>
          </div>
        </div>
      </section>
    </div>`;

  return wrapInLayout({
    title: `${stepName}: ${step.principle} — Daily Reflections | Daily Paths`,
    description: `Daily reflections on ${stepName}, ${step.principle}. ${STEP_HOOKS[step.number]}`,
    canonicalPath: `/months/${monthName}/`,
    bodyContent,
    bodyClass: 'page-month-archive',
  });
}
