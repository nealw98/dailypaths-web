import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';

/**
 * About the Daily Paths Project — Editorial Drop-Cap style.
 * Hero: hero-image.jpg (meadow path), sharp and clear with Sage overlay.
 * Magazine-feature layout with narrow editorial column.
 *
 * Sections: Hero → Our Mission → Our Approach → The Heart Behind the Project →
 * Which Is Right for You? (Site vs App) → Closing → Disclaimer → Nav CTA
 */
export function renderAboutProjectPage() {

  const bodyContent = `
      <!-- Schema.org author link -->
      <span itemprop="author" itemscope itemtype="https://schema.org/Person"><meta itemprop="name" content="Neal W."></span>

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

          <!-- Our Mission — Drop Cap -->
          <section class="ap-section">
            <h2 class="ap-section-heading">Our Mission</h2>
            <div class="ap-editorial">
              <p>Daily Paths exists to provide modern, digital tools for a timeless program. Traditional Al-Anon literature is the bedrock of recovery, but the &ldquo;One Day at a Time&rdquo; philosophy often requires a companion that is as mobile as we are&mdash;something you can reach for in the quiet moments between meetings, on a break at work, or before the day begins.</p>
              <p>Each of our 366 original reflections is grounded in the contemplative tradition of Al-Anon. We don&rsquo;t just provide quotes; we provide reflections designed to help you pause, breathe, and apply a principle to your immediate situation. Every entry meets you where you are: not with advice, but with the gentle reminder that you are not alone and that today is enough.</p>
            </div>
          </section>

          <!-- The Heart Behind the Project -->
          <section class="ap-section ap-curator">
            <h2 class="ap-section-heading">The Heart Behind the Project</h2>
            <div class="ap-editorial">
              <p>Daily Paths is curated by <strong>Neal W.</strong>, who brings over 30 years of personal recovery experience to this project. While Neal&rsquo;s journey began in other Twelve Step rooms, his life has been deeply intertwined with Al-Anon through his marriage and his role as a sponsor to many navigating the complexities of family recovery. This unique perspective allows Daily Paths to offer reflections that are grounded in time-tested principles while remaining accessible to those just beginning to discover the Al-Anon path.</p>
              <p>Published by <strong>Daily Growth, LLC</strong>, Daily Paths is committed to supporting the global recovery community. Every reflection, every theme page, and every feature in the app is built with a single question in mind: <em>will this help someone find a little more serenity today?</em></p>
            </div>
          </section>

          <!-- Which Is Right for You? -->
          <section class="ap-section">
            <h2 class="ap-section-heading">Which Is Right for You?</h2>
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

          <!-- Non-Affiliation Disclaimer -->
          <section class="ap-section ap-disclaimer">
            <p>Daily Paths is an independent project published by Daily Growth, LLC. It is not affiliated with, endorsed by, or approved by Al-Anon Family Groups, Inc. or any other organization. The Twelve Steps and Twelve Traditions are used with the understanding that they are the shared heritage of the recovery community.</p>
          </section>

          <!-- Project Support -->
          <section class="ap-section ap-support">
            <h2 class="ap-section-heading">Project Support</h2>
            <div class="ap-editorial">
              <p>For questions regarding the Daily Paths website or the mobile app, please contact us at <a href="mailto:support@dailypaths.org">support@dailypaths.org</a>. As a small, personal project by Daily Growth, LLC, we aim to respond to all inquiries within 48 hours.</p>
            </div>
          </section>

          <!-- Additional Community Resources -->
          <section class="ap-section ap-support">
            <h2 class="ap-section-heading">Additional Community Resources</h2>
            <div class="ap-editorial">
              <p>Daily Paths is a tool for daily reflection and is not a substitute for professional healthcare or crisis intervention. If you or someone you know is in need of extra support, these confidential national resources are available 24/7:</p>
            </div>
            <ul class="ap-resource-list">
              <li>
                <strong>988 Suicide &amp; Crisis Lifeline:</strong> Call or text <strong>988</strong> (USA) or visit <a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer">988lifeline.org</a>.
              </li>
              <li>
                <strong>National Domestic Violence Hotline:</strong> Call <strong>1-800-799-SAFE</strong> (7233) or text &ldquo;START&rdquo; to <strong>88788</strong>.
              </li>
              <li>
                <strong>Find an Al-Anon Meeting:</strong> Visit the <a href="https://al-anon.org/al-anon-meetings/find-an-al-anon-meeting/" target="_blank" rel="noopener noreferrer">Official Al-Anon Meeting Finder</a>.
              </li>
            </ul>
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
    title: 'About Daily Paths \u2014 Our Mission & Approach | Al-Anon Daily Paths',
    description: 'Daily Paths is an independent digital sanctuary for Al-Anon recovery, curated by Neal W. and published by Daily Growth, LLC. 366 original daily reflections, step guides, and a private journaling app.',
    canonicalPath: '/about-project/',
    bodyContent,
    bodyClass: 'page-about-project',
  });
}
