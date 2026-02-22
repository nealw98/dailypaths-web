import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';

/**
 * About the Daily Paths Project — Editorial Drop-Cap style.
 * Hero: hero-image.jpg (meadow path), sharp and clear with Sage overlay.
 * Magazine-feature layout with narrow editorial column.
 */
export function renderAboutProjectPage() {

  const bodyContent = `
      <!-- Hero -->
      <header class="ap-hero">
        <div class="ap-hero-image">
          <img src="${bp('/assets/hero-image.jpg')}" alt="Sunlit meadow path \u2014 The Daily Paths Project" />
          <div class="ap-hero-overlay"></div>
        </div>
        <div class="ap-hero-content">
          <h1 class="ap-hero-title">The Daily Paths Project</h1>
          <p class="ap-hero-desc">Building a digital sanctuary for the Al-Anon journey.</p>
        </div>
      </header>

      <!-- Editorial Body -->
      <div class="ap-body">
        <div class="ap-body-inner">

          <!-- The Mission — Drop Cap -->
          <section class="ap-section">
            <div class="ap-editorial">
              <p>Daily Paths was born from a simple idea: that recovery is a daily practice, not a destination. Each morning, thousands of people affected by someone else&rsquo;s drinking reach for a reading&mdash;a few quiet words that reframe the day ahead. We built this project to make that moment easier to find and harder to forget.</p>
              <p>The 366 original reflections in Daily Paths draw on the wisdom of the Al-Anon program&mdash;its Steps, Traditions, and the lived experience of families who have walked this road before. Every entry is written to meet you where you are: not with advice, but with the gentle reminder that you are not alone and that today is enough.</p>
            </div>
          </section>

          <!-- Our Approach -->
          <section class="ap-section">
            <h2 class="ap-section-heading">Our Approach</h2>
            <div class="ap-editorial">
              <p>Daily Paths was born out of a simple observation: recovery happens in the small moments between meetings. While traditional literature is the bedrock of our program, the &ldquo;One Day at a Time&rdquo; philosophy often requires a companion that is as mobile as we are.</p>
              <p>Our approach is grounded in the contemplative tradition of Al-Anon. We don&rsquo;t just provide quotes; we provide original reflections designed to help you pause, breathe, and apply a principle to your immediate situation.</p>
            </div>
          </section>

          <!-- The Path and the Practice -->
          <section class="ap-section">
            <h2 class="ap-section-heading">The Path and the Practice</h2>
            <div class="ap-editorial">
              <p>Daily Paths lives in two places&mdash;a website built for exploration and an app built for daily practice. Each serves a different part of your journey.</p>
            </div>
            <div class="ap-compare">
              <div class="ap-compare-col">
                <h3 class="ap-compare-heading">The Site</h3>
                <p class="ap-compare-subtitle">Explore &amp; Discover</p>
                <ul class="ap-compare-list">
                  <li>
                    <span class="ap-compare-feature">Recovery Themes</span>
                    <span class="ap-compare-detail">Twelve curated explorations of the ideas that shape Al-Anon recovery&mdash;from detachment and boundaries to gratitude and hope.</span>
                  </li>
                  <li>
                    <span class="ap-compare-feature">Daily Readings</span>
                    <span class="ap-compare-detail">The core of the experience&mdash;new reflections delivered every morning to help you stay centered and focused on your own path.</span>
                  </li>
                  <li>
                    <span class="ap-compare-feature">Step Navigation</span>
                    <span class="ap-compare-detail">In-depth guides to each of the Twelve Steps, with practical context for families and friends of alcoholics.</span>
                  </li>
                  <li>
                    <span class="ap-compare-feature">Prayer Library</span>
                    <span class="ap-compare-detail">A quiet collection of the prayers most commonly used in Al-Anon meetings&mdash;from the Serenity Prayer to Just for Today.</span>
                  </li>
                </ul>
              </div>
              <div class="ap-compare-col">
                <h3 class="ap-compare-heading">The App</h3>
                <p class="ap-compare-subtitle">Reflect &amp; Record</p>
                <ul class="ap-compare-list">
                  <li>
                    <span class="ap-compare-feature">Integrated Journal</span>
                    <span class="ap-compare-detail">Gratitude entries, personal inventories, and free-form reflections&mdash;all in one private, searchable space.</span>
                  </li>
                  <li>
                    <span class="ap-compare-feature">Speaker Library</span>
                    <span class="ap-compare-detail">Curated audio from Al-Anon speakers sharing their experience, strength, and hope&mdash;available anytime, anywhere.</span>
                  </li>
                  <li>
                    <span class="ap-compare-feature">Community Perspective</span>
                    <span class="ap-compare-detail">Personal insights and &ldquo;Voice of Experience&rdquo; contributions from members who have walked the path before us.</span>
                  </li>
                  <li>
                    <span class="ap-compare-feature">Secure Sync</span>
                    <span class="ap-compare-detail">Your private reflections stay safe and travel with you. End-to-end syncing keeps your journal accessible across all your devices.</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="ap-app-badges">
              <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer" class="ap-badge-link">
                <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download Al-Anon Daily Paths on the App Store" class="ap-badge ap-badge--ios">
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.dailypaths" target="_blank" rel="noopener noreferrer" class="ap-badge-link">
                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get Al-Anon Daily Paths on Google Play" class="ap-badge ap-badge--play">
              </a>
            </div>
          </section>

          <!-- Final Note -->
          <section class="ap-section ap-closing">
            <div class="ap-closing-rule" aria-hidden="true"></div>
            <div class="ap-editorial">
              <p>This project is a labor of love, designed by members for members. We hope it helps you find the serenity you seek, one day at a time.</p>
            </div>
          </section>

        </div>
      </div>

      <!-- Site Navigation CTA -->
      <section class="ap-nav-cta">
        <div class="ap-nav-cta-inner">
          <h2 class="ap-nav-cta-heading">Continue the Journey</h2>
          <div class="ap-nav-cta-actions">
            <a href="${bp('/principles/')}" class="ap-nav-cta-btn">Explore the 12 Themes</a>
            <a href="${bp('/steps/')}" class="ap-nav-cta-btn">Begin the 12 Steps</a>
          </div>
        </div>
      </section>`;

  return wrapInLayout({
    title: 'The Daily Paths Project \u2014 Our Mission | Al-Anon Daily Paths',
    description: 'Daily Paths is a digital sanctuary for Al-Anon recovery \u2014 366 original daily reflections, twelve curated themes, step guides, prayers, and an integrated journal app.',
    canonicalPath: '/about-project/',
    bodyContent,
    bodyClass: 'page-about-project',
  });
}
