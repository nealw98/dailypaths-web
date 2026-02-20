import { wrapInLayout } from './base.mjs';
import { homepageStructuredData } from '../helpers/seo.mjs';
import { dayToSlug } from '../helpers/slug-utils.mjs';
import { bp } from '../helpers/config.mjs';

/**
 * Generate the homepage HTML — Editorial Hub layout.
 *
 * @param {Object} todayReading - Today's reading object
 * @param {Object} prevReading - Previous day's reading (for nav)
 * @param {Object} nextReading - Next day's reading (for nav)
 * @param {Array} [allReadings] - All 366 readings (for related readings sidebar)
 */
export function renderHomepage(todayReading, prevReading, nextReading, allReadings = []) {
  const structuredData = homepageStructuredData();
  const slug = dayToSlug(todayReading.day_of_year);

  // Build a plain-text preview (~300 chars) from the opening + body
  const rawText = [todayReading.opening, todayReading.body]
    .filter(Boolean)
    .join(' ')
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const preview = rawText.length > 300
    ? rawText.slice(0, 300).replace(/\s+\S*$/, '') + '…'
    : rawText;

  const bodyContent = `
    <!-- Site Hero Banner -->
    <section class="home-hero">
      <div class="home-hero-image">
        <img src="${bp('/assets/hero-image.jpg')}" alt="Al-Anon Daily Paths — finding serenity in the chaos" />
        <div class="home-hero-overlay"></div>
      </div>
      <div class="home-hero-content">
        <h1 class="home-hero-title">Al-Anon Daily Paths</h1>
        <p class="home-hero-sub">Finding Serenity in the Chaos</p>
        <p class="home-hero-tagline">366 original reflections for those affected by someone else&rsquo;s drinking.</p>
        <div class="home-hero-badges">
          <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer" class="home-hero-badge-link">
            <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" class="home-hero-badge">
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.dailypaths" target="_blank" rel="noopener noreferrer" class="home-hero-badge-link">
            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" class="home-hero-badge home-hero-badge-play">
          </a>
        </div>
      </div>
    </section>

    <!-- Today's Reading — Feature Card -->
    <div class="home-feature-wrap">
      <a href="${bp(`/${slug}/`)}" class="home-feature-card">
        <span class="home-feature-label">Today&rsquo;s Reading</span>
        <p class="home-feature-date">${todayReading.display_date}</p>
        <h2 class="home-feature-title">${todayReading.title}</h2>
        <div class="home-feature-preview">
          <p>${preview}</p>
          <div class="home-feature-fade"></div>
        </div>
        <span class="home-feature-btn">Read Today&rsquo;s Reflection &rarr;</span>
      </a>
    </div>

    <!-- Discovery Row — Two Cards -->
    <div class="home-discover-wrap">
      <div class="home-discover-grid">
        <a href="${bp('/themes/')}" class="home-discover-card">
          <div class="home-discover-card-img">
            <img src="${bp('/assets/themes/detachment.jpg')}" alt="Recovery themes" />
          </div>
          <div class="home-discover-card-gradient"></div>
          <div class="home-discover-card-text">
            <span class="home-discover-card-label">12 Recovery Themes</span>
            <h3 class="home-discover-card-title">Browse by Theme</h3>
            <p class="home-discover-card-desc">Explore detachment, boundaries, gratitude, and more &mdash; the emotional terrain of Al-Anon recovery.</p>
          </div>
        </a>
        <a href="${bp('/steps/')}" class="home-discover-card">
          <div class="home-discover-card-img">
            <img src="${bp('/assets/themes/higher-power.jpg')}" alt="The 12 Steps" />
          </div>
          <div class="home-discover-card-gradient"></div>
          <div class="home-discover-card-text">
            <span class="home-discover-card-label">Month-by-Month Guide</span>
            <h3 class="home-discover-card-title">Work the Steps</h3>
            <p class="home-discover-card-desc">A structured path through the 12 Steps of Al-Anon &mdash; one month at a time.</p>
          </div>
        </a>
      </div>
    </div>

    <!-- Community & Support — You Are Not Alone -->
    <div class="home-community-wrap">
      <h3 class="home-community-heading">You Don&rsquo;t Have to Do This Alone.</h3>
      <p class="home-community-intro">
        Recovery is a shared journey. We encourage you to find a local or electronic
        meeting to connect with others who truly understand.
      </p>
      <div class="home-community-card">
        <span class="home-community-badge">Official Resource</span>
        <p class="home-community-card-text">
          Al-Anon Family Groups maintains a worldwide directory of in-person and
          electronic meetings &mdash; free, confidential, and open to anyone affected
          by someone else&rsquo;s drinking.
        </p>
        <a href="https://al-anon.org/al-anon-meetings/find-an-al-anon-meeting/"
           target="_blank"
           rel="noopener noreferrer"
           title="Search for Al-Anon meetings on the official Al-Anon Family Groups website"
           class="home-community-btn">
          Search the Official Meeting Directory&nbsp;&#8599;
        </a>
      </div>
    </div>

    <!-- About -->
    <section class="home-about">
      <div class="home-container">
        <p>
          These reflections are not official Al-Anon literature. They are
          original writings inspired by the spirit of recovery found in
          Al-Anon&rsquo;s program of hope.
        </p>
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
