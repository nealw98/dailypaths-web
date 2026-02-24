import { wrapInLayout } from './base.mjs';
import { homepageStructuredData } from '../helpers/seo.mjs';
import { dayToSlug } from '../helpers/slug-utils.mjs';
import { bp } from '../helpers/config.mjs';

/**
 * Generate the homepage HTML — Premium Magazine Cover layout.
 *
 * @param {Object} todayReading - Today's reading object
 * @param {Object} prevReading - Previous day's reading (for nav)
 * @param {Object} nextReading - Next day's reading (for nav)
 * @param {Array} [allReadings] - All 366 readings (for related readings sidebar)
 */
export function renderHomepage(todayReading, prevReading, nextReading, allReadings = []) {
  const structuredData = homepageStructuredData();
  const slug = dayToSlug(todayReading.day_of_year);

  // Build a plain-text preview (~200 chars) from the opening
  const rawText = (todayReading.opening || todayReading.body || '')
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const preview = rawText.length > 200
    ? rawText.slice(0, 200).replace(/\s+\S*$/, '') + '\u2026'
    : rawText;

  const bodyContent = `
    <!-- Magazine Cover Hero -->
    <section class="hm-hero">
      <div class="hm-hero-image">
        <img src="${bp('/assets/hero-image.jpg')}" alt="Sunlit meadow path representing the Al-Anon recovery journey \u2014 Al-Anon Daily Paths" />
        <div class="hm-hero-overlay"></div>
      </div>
      <div class="hm-hero-content">
        <h1 class="hm-hero-title">Finding Your Path</h1>
        <p class="hm-hero-tagline">Daily reflections and tools for the Al-Anon journey</p>
      </div>
    </section>

    <!-- Today's Reflection — Editorial Teaser -->
    <section class="hm-today">
      <div class="hm-today-inner">
        <span class="hm-today-label">Today&rsquo;s Reflection</span>
        <p class="hm-today-date">${todayReading.display_date}</p>
        <h2 class="hm-today-title">${todayReading.title}</h2>
        <p class="hm-today-preview">${preview}</p>
        <a href="${bp(`/${slug}/`)}" class="hm-today-btn">Read More &rarr;</a>
      </div>
    </section>

    <!-- Content Pillar: The Steps — sage band -->
    <section class="hm-pillar bg-sage">
      <div class="hm-pillar-inner">
        <h2 class="hm-pillar-heading">The Twelve Steps</h2>
        <p class="hm-pillar-text">A month-by-month framework for personal freedom. Each Step builds on the last &mdash; from admitting powerlessness to finding a life of purpose and service.</p>
        <a href="${bp('/steps/')}" class="hm-pillar-btn">Explore the Steps &rarr;</a>
      </div>
    </section>

    <!-- Content Pillar: Al-Anon Themes — terracotta band -->
    <section class="hm-pillar bg-terracotta">
      <div class="hm-pillar-inner">
        <h2 class="hm-pillar-heading">Al-Anon Themes</h2>
        <p class="hm-pillar-text">Explore daily reflections through the universal themes that weave through our recovery &mdash; detachment, boundaries, gratitude, hope, and more.</p>
        <a href="${bp('/themes/')}" class="hm-pillar-btn">Explore Themes &rarr;</a>
      </div>
    </section>

    <!-- Engine CTA — navy band -->
    <section class="hm-engine bg-navy">
      <div class="hm-engine-inner">
        <h2 class="hm-engine-heading">Serenity is a daily practice. Let us walk the path with you.</h2>
        <p class="hm-engine-text">Download Al-Anon Daily Paths to receive daily notifications, track your recovery milestones, and journal your reflections in a private, secure space.</p>
        <div class="hm-engine-badges">
          <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer" class="hm-engine-badge-link">
            <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" class="hm-engine-badge">
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.nealw98.dailypaths" target="_blank" rel="noopener noreferrer" class="hm-engine-badge-link">
            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" class="hm-engine-badge hm-engine-badge-play">
          </a>
        </div>
      </div>
    </section>`;

  return wrapInLayout({
    title: 'Al-Anon Daily Paths \u2014 Daily Reflections for Recovery',
    description: 'Free daily Al-Anon reflections for your recovery journey. 366 original readings grounded in the Twelve Steps, written in the contemplative tradition of Al-Anon literature.',
    canonicalPath: '/',
    bodyContent,
    structuredData,
    bodyClass: 'page-home',
  });
}
