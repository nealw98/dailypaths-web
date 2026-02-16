import { wrapInLayout } from './base.mjs';
import { dayToSlug, dayToMonthIndex, MONTHS } from '../helpers/slug-utils.mjs';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Generate the Browse by Date page.
 *
 * @param {Array} readings - All 366 readings sorted by day_of_year
 */
export function renderBrowseDatePage(readings) {
  // Group readings by month
  const months = Array.from({ length: 12 }, () => []);
  for (const reading of readings) {
    const monthIdx = dayToMonthIndex(reading.day_of_year);
    months[monthIdx].push(reading);
  }

  const monthSections = months.map((monthReadings, idx) => {
    if (monthReadings.length === 0) return '';

    const items = monthReadings.map(r => {
      const slug = dayToSlug(r.day_of_year);
      return `        <li>
          <a href="/${slug}/">
            <span class="browse-date">${r.display_date}</span>
            <span class="browse-title">${r.title}</span>
          </a>
        </li>`;
    }).join('\n');

    return `
      <section class="browse-month" id="${MONTHS[idx]}">
        <h2 class="month-heading">${MONTH_NAMES[idx]}</h2>
        <ul class="browse-list">
${items}
        </ul>
      </section>`;
  }).join('\n');

  // Month quick-jump nav
  const monthNav = MONTH_NAMES.map((name, idx) =>
    `<a href="#${MONTHS[idx]}" class="month-jump">${name.slice(0, 3)}</a>`
  ).join('\n          ');

  const bodyContent = `
    <div class="browse-page">
      <div class="browse-container">
        <h1 class="page-title">Browse by Date</h1>
        <p class="page-description">366 daily reflections, one for every day of the year.</p>

        <nav class="month-nav" aria-label="Jump to month">
          ${monthNav}
        </nav>

${monthSections}
      </div>
    </div>`;

  return wrapInLayout({
    title: 'Browse All 366 Al-Anon Daily Reflections by Date | Al-Anon Daily Paths',
    description: 'Browse all 366 daily Al-Anon reflections organized by month. Find readings for any day of the year from Al-Anon Daily Paths.',
    canonicalPath: '/browse/',
    bodyContent,
    bodyClass: 'page-browse',
  });
}
