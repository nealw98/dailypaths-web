import { wrapInLayout } from './base.mjs';
import { homepageStructuredData } from '../helpers/seo.mjs';
import { readingSlug, stepSlug } from '../helpers/slug-utils.mjs';
import { bp } from '../helpers/config.mjs';
import { STEPS, STEP_HOOKS } from './steps.mjs';
import { TOPICS } from '../helpers/theme-data.mjs';
import { icon, appPanel, sectionHeader, tealBand, glassPanel } from './ui.mjs';

/**
 * Generate the homepage — "reading-first" hero.
 *
 * The reflection itself opens the page on the sand background; there is no
 * marketing hero and no separate today's-reflection card (it would duplicate).
 *
 * @param {Object} todayReading - Today's reading object
 * @param {Object} prevReading - Previous day's reading (unused; kept for signature stability)
 * @param {Object} nextReading - Next day's reading (unused; kept for signature stability)
 * @param {Array} [allReadings] - All 366 readings
 */
export function renderHomepage(todayReading, prevReading, nextReading, allReadings = []) {
  const structuredData = homepageStructuredData();
  const slug = readingSlug(todayReading.day_of_year, todayReading.title);
  const readingHref = bp(`/${slug}/`);

  // Plain-text excerpt (~200 chars) from the opening
  const rawText = (todayReading.opening || todayReading.body || '')
    .replace(/\\n/g, ' ')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  const excerpt = rawText.length > 200
    ? rawText.slice(0, 200).replace(/\s+\S*$/, '') + '…'
    : rawText;

  // First four Steps
  const stepCards = STEPS.slice(0, 4).map(step => `
            <a href="${bp(`/steps/${stepSlug(step.number, step.principle)}/`)}" class="card-elevated step-card">
              <span class="step-card-numeral">${step.number}</span>
              <span>
                <span class="step-card-keyword">${step.principle}</span>
                <span class="step-card-hook">${STEP_HOOKS[step.number] || ''}</span>
              </span>
            </a>`).join('');

  // First three Themes
  const themeCards = TOPICS.slice(0, 3).map(topic => `
            <a href="${bp(`/themes/${topic.slug}/`)}" class="card-tinted theme-preview-card">
              <span class="theme-preview-title">${topic.name}</span>
              <span class="theme-preview-line">${topic.shortDescription}</span>
              <span class="theme-preview-cta">Explore &rarr;</span>
            </a>`).join('');

  const newcomerBand = tealBand({
    eyebrow: 'New here',
    heading: 'Are you affected by someone else&rsquo;s drinking?',
    body: 'Al-Anon is a fellowship for families and friends of alcoholics. Whether you&rsquo;re living with a problem drinker, grew up in an alcoholic family, or love someone struggling with addiction &mdash; you don&rsquo;t have to face it alone.',
    actions: `<a href="${bp('/start/')}" class="btn btn--secondary">Start here &rarr;</a>
            <a href="${bp('/about-alanon/')}" class="link-on-dark">What Al-Anon is</a>`,
    aside: glassPanel({
      label: 'Recovery essentials',
      lines: [
        'God, grant me the serenity',
        'to accept the things I cannot change,',
        'courage to change the things I can,',
        'and wisdom to know the difference.',
      ],
      caption: 'Serenity Prayer',
    }),
  });

  const bodyContent = `
    <!-- Hero: today's reflection opens the page -->
    <section class="home-hero">
      <div class="home-hero-inner">
        <div>
          <p class="eyebrow">
            ${icon('lightOnWater', { size: 18 })}
            <span>Today&rsquo;s Reflection &middot; <span data-today-date>${todayReading.display_date}</span></span>
          </p>
          <h1 class="home-hero-title" data-today-title>${todayReading.title}</h1>
          <p class="home-hero-excerpt" data-today-excerpt>${excerpt}</p>
          <div class="btn-row">
            <a href="${readingHref}" class="btn btn--lg" data-today-cta>Continue reading</a>
            <a href="#get-the-app" class="btn btn--lg btn--ghost">Get the app</a>
          </div>
        </div>
        <div class="home-hero-photo">
          <img src="${bp('/assets/hero-image.jpg')}" alt="Sunlit meadow path — the Al-Anon recovery journey" width="880" height="620">
        </div>
      </div>
    </section>

    <!-- A door, not a pitch -->
    <section class="wrap section--sm">
      <a href="${bp('/start/')}" class="newcomer-strip">
        ${icon('lightOnWater', { size: 18, className: 'newcomer-strip-icon' })}
        <span class="newcomer-strip-label">New here?</span>
        <span class="newcomer-strip-cta">Find out if Al-Anon is for you &rarr;</span>
      </a>
    </section>

    <!-- The Twelve Steps -->
    <section class="wrap section">
      ${sectionHeader({
        heading: 'The Twelve Steps',
        description: 'A month-by-month framework for personal freedom. Each Step builds on the last &mdash; from admitting powerlessness to finding a life of purpose and service.',
        linkHref: bp('/steps/'),
        linkLabel: 'Explore the Steps &rarr;',
      })}
      <div class="step-card-grid">${stepCards}
      </div>
    </section>

    <!-- Al-Anon Themes -->
    <section class="wrap section">
      ${sectionHeader({
        heading: 'Al-Anon Themes',
        description: 'The universal ideas that weave through recovery &mdash; detachment, boundaries, gratitude, hope, and more.',
        linkHref: bp('/themes/'),
        linkLabel: 'Explore Themes &rarr;',
      })}
      <div class="theme-preview-grid">${themeCards}
      </div>
    </section>

${newcomerBand}

    <!-- App CTA -->
    <div class="wrap section" id="get-the-app">
      ${appPanel({
        tone: 'white',
        heading: 'Serenity is a daily practice. Let us walk the path with you.',
        text: 'Download Al-Anon Daily Paths to receive daily notifications, track your recovery milestones, and journal your reflections in a private, secure space.',
        showIcon: true,
        context: 'home',
      })}
    </div>`;

  return wrapInLayout({
    title: 'Al-Anon Daily Paths — Daily Reflections for Recovery',
    description: 'Free daily Al-Anon reflections for your recovery journey. 366 original readings grounded in the Twelve Steps, written in the contemplative tradition of Al-Anon literature.',
    canonicalPath: '/',
    bodyContent,
    structuredData,
    bodyClass: 'page-home',
    navSection: 'home',
    hasAppPanel: true,
  });
}
