import { wrapInLayout } from './base.mjs';
import { dayToSlug, themeToSlug } from '../helpers/slug-utils.mjs';

/**
 * Generate the Themes index page.
 *
 * @param {Map} themeMap - Map of theme name -> array of readings
 */
export function renderThemesIndexPage(themeMap) {
  const sortedThemes = [...themeMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  const cards = sortedThemes.map(([theme, readings]) => {
    const slug = themeToSlug(theme);
    return `        <a href="/principles/${slug}/" class="theme-card">
          <h3 class="theme-name">${theme}</h3>
          <p class="theme-count">${readings.length} reading${readings.length === 1 ? '' : 's'}</p>
        </a>`;
  }).join('\n');

  const bodyContent = `
    <div class="themes-page">
      <div class="themes-container">
        <h1 class="page-title">Browse by Principle</h1>
        <p class="page-description">
          Find readings on the recovery topics that matter to you.
          Each reflection is tagged with a theme drawn from the principles of Al-Anon.
        </p>

        <div class="theme-grid">
${cards}
        </div>
      </div>
    </div>`;

  return wrapInLayout({
    title: 'Browse Al-Anon Reflections by Guiding Principle | Al-Anon Daily Paths',
    description: 'Explore daily Al-Anon reflections organized by recovery themes including detachment, surrender, hope, acceptance, and more.',
    canonicalPath: '/principles/',
    bodyContent,
    bodyClass: 'page-themes',
  });
}

/**
 * Generate an individual theme page.
 *
 * @param {string} theme - Theme name
 * @param {Array} readings - Readings with this theme
 */
export function renderThemePage(theme, readings) {
  const slug = themeToSlug(theme);

  const items = readings
    .sort((a, b) => a.day_of_year - b.day_of_year)
    .map(r => {
      const readingSlug = dayToSlug(r.day_of_year);
      return `        <li>
          <a href="/${readingSlug}/">
            <span class="browse-date">${r.display_date}</span>
            <span class="browse-title">${r.title}</span>
          </a>
        </li>`;
    }).join('\n');

  const bodyContent = `
    <div class="theme-detail-page">
      <div class="themes-container">
        <nav class="breadcrumb">
          <a href="/principles/">Principles</a> <span class="breadcrumb-sep">/</span> <span>${theme}</span>
        </nav>

        <h1 class="page-title">${theme}</h1>
        <p class="page-description">
          ${readings.length} daily reflection${readings.length === 1 ? '' : 's'} on the theme of ${theme.toLowerCase()}.
        </p>

        <ul class="browse-list">
${items}
        </ul>
      </div>
    </div>`;

  return wrapInLayout({
    title: `${theme} \u2014 Al-Anon Daily Reflections | Al-Anon Daily Paths`,
    description: `Explore ${readings.length} daily Al-Anon reflections about ${theme.toLowerCase()}. Recovery readings from Al-Anon Daily Paths.`,
    canonicalPath: `/principles/${slug}/`,
    bodyContent,
    bodyClass: 'page-theme-detail',
  });
}
