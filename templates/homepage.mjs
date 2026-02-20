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
    ? rawText.slice(0, 300).replace(/\s+\S*$/, '') + '\u2026'
    : rawText;

  const bodyContent = `
    <!-- Site Hero Banner -->
    <section class="home-hero">
      <div class="home-hero-image">
        <img src="${bp('/assets/hero-image.jpg')}" alt="Al-Anon Daily Paths \u2014 finding serenity in the chaos" />
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

    <!-- What is Al-Anon? -->
    <div class="home-whatis-wrap">
      <div class="home-whatis-inner">
        <div class="home-whatis-text">
          <h2 class="home-whatis-heading">What is Al-Anon?</h2>
          <p>
            Al-Anon Family Groups is a fellowship for anyone whose life has been
            affected by someone else&rsquo;s drinking. We don&rsquo;t try to fix the
            alcoholic &mdash; we focus on our own recovery.
          </p>
          <p>
            In meetings and through daily practice, we learn that we didn&rsquo;t cause
            it, we can&rsquo;t control it, and we can&rsquo;t cure it. What we can do is
            find peace, one day at a time.
          </p>
        </div>
        <div class="home-whatis-cta">
          <a href="https://al-anon.org/newcomers/" target="_blank" rel="noopener noreferrer" class="home-whatis-card">
            <span class="home-whatis-card-label">For Newcomers</span>
            <h3 class="home-whatis-card-title">New to the Program?</h3>
            <p class="home-whatis-card-desc">Visit the official Al-Anon newcomers page to learn about meetings, the program, and how to get started.</p>
            <span class="home-whatis-card-link">Learn More at Al-Anon.org &rarr;</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Additional Support -->
    <div class="home-support-wrap">
      <h3 class="home-support-heading">Additional Support</h3>
      <a href="https://al-anon.org/al-anon-meetings/find-an-al-anon-meeting/"
         target="_blank"
         rel="noopener noreferrer"
         title="Find an Al-Anon meeting on the official Al-Anon Family Groups website"
         class="home-support-link">
        Find an Al-Anon Meeting (al-anon.org)&nbsp;&#8599;
      </a>
      <p class="home-support-note">
        Daily Paths is an independent resource. For official literature and meeting
        directories, visit the
        <a href="https://al-anon.org" target="_blank" rel="noopener noreferrer">Al-Anon World Service Office</a>.
      </p>
    </div>`;

  return wrapInLayout({
    title: 'Al-Anon Daily Paths \u2014 Daily Reflections for Recovery',
    description: 'Free daily Al-Anon reflections for your recovery journey. 366 original readings grounded in the Twelve Steps, written in the contemplative tradition of Al-Anon literature.',
    canonicalPath: '/',
    bodyContent,
    structuredData,
    bodyClass: 'page-home',
  });
}
