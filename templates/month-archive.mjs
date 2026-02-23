import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';
import { dayToSlug, MONTHS, DAYS_IN_MONTH } from '../helpers/slug-utils.mjs';
import { STEPS } from './steps.mjs';

/**
 * Weekly chapter labels for grouping daily readings.
 * Each month's readings are split into 4 chunks: weeks 1-4.
 */
const WEEK_CHAPTERS = [
  { label: 'Week One', days: [1, 7] },
  { label: 'Week Two', days: [8, 14] },
  { label: 'Week Three', days: [15, 21] },
  { label: 'Week Four', days: [22, 31] }, // captures remaining days (22-28, 29, 30, or 31)
];

/**
 * Render a month archive page listing all daily readings for a given month.
 *
 * @param {number} monthIndex - 0-based month index (0 = January)
 * @param {Array} readings - All 366 readings
 */
export function renderMonthArchivePage(monthIndex, readings) {
  const monthName = MONTHS[monthIndex];
  const monthDisplay = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const step = STEPS[monthIndex];
  const daysInMonth = DAYS_IN_MONTH[monthIndex];

  // Get the starting day_of_year for this month
  let startDay = 1;
  for (let m = 0; m < monthIndex; m++) {
    startDay += DAYS_IN_MONTH[m];
  }

  // Filter readings for this month
  const monthReadings = readings.filter(
    r => r.day_of_year >= startDay && r.day_of_year <= startDay + daysInMonth - 1
  );

  // Group readings into weekly chapters
  const weekSections = WEEK_CHAPTERS.map(chapter => {
    const weekReadings = monthReadings.filter(r => {
      const dayInMonth = r.day_of_year - startDay + 1;
      return dayInMonth >= chapter.days[0] && dayInMonth <= chapter.days[1];
    });

    if (weekReadings.length === 0) return '';

    const readingItems = weekReadings.map(r => {
      const slug = dayToSlug(r.day_of_year);
      const dayInMonth = r.day_of_year - startDay + 1;

      return `
            <li class="ma-reading-item">
              <a href="${bp(`/${slug}/`)}" class="ma-reading-link">
                <span class="ma-reading-day">${monthDisplay} ${dayInMonth}</span>
                <span class="ma-reading-title">${r.title || 'Daily Reading'}</span>
              </a>
            </li>`;
    }).join('\n');

    return `
          <div class="ma-week">
            <h3 class="ma-week-heading">${chapter.label}</h3>
            <ul class="ma-week-list">
${readingItems}
            </ul>
          </div>`;
  }).join('\n');

  const bodyContent = `
      <!-- Back to Step link -->
      <nav class="ma-back-nav">
        <a href="${bp(`/steps/step-${step.number}/`)}" class="ma-back-link">&larr; Back to Step ${step.number}: ${step.principle}</a>
      </nav>

      <!-- Page Header -->
      <header class="ma-header">
        <h1 class="ma-title">${monthDisplay} Reflections</h1>
        <p class="ma-subtitle">31 daily readings for Step ${step.number}: ${step.principle}</p>
      </header>

      <!-- Weekly Chapters -->
      <div class="ma-chapters">
${weekSections}
      </div>

      <!-- Engine CTA -->
      <section class="ma-engine-cta bg-navy">
        <div class="ma-engine-cta-inner">
          <h2 class="ma-engine-cta-heading">Read ${monthDisplay} on the Go</h2>
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
      </section>`;

  return wrapInLayout({
    title: `${monthDisplay} Daily Readings &mdash; Step ${step.number}: ${step.principle} | Al-Anon Daily Paths`,
    description: `All 31 ${monthDisplay} daily reflections for Step ${step.number} of Al-Anon. Browse readings by week for the month of ${monthDisplay}.`,
    canonicalPath: `/months/${monthName}/`,
    bodyContent,
    bodyClass: 'page-month-archive',
  });
}
