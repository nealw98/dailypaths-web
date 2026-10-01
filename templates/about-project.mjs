import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';

/**
 * About the Daily Paths Project — Editorial Drop-Cap style.
 * Magazine-feature layout with narrow editorial column.
 *
 * Sections: Title → Mission → What you'll find → People → How we make it →
 * Independence & resources → App → Support → Closing → Start reading
 */
export function renderAboutProjectPage() {

  const bodyContent = `
      <!-- Schema.org author link -->
      <span itemprop="author" itemscope itemtype="https://schema.org/Person"><meta itemprop="name" content="Neal W."></span>

      <!-- Page title: same plain header as Support, Privacy and Terms (no hero image) -->
      <div class="content-page">
        <div class="content-container">
          <h1 class="page-title">The Daily Paths Project</h1>
          <p class="page-description">Building a digital sanctuary for the Al-Anon journey.</p>
        </div>
      </div>

      <!-- DRAFT (October 1, 2026): rewritten for credibility and authority. Not approved
           launch copy. Contributor names need each person's approval before launch. -->
      <div class="ap-body">
        <div class="ap-body-inner">

          <section class="ap-section">
            <h2 class="ap-section-heading">Our Mission</h2>
            <div class="ap-editorial">
              <p>Daily Paths exists to provide modern, digital tools for a timeless program. Traditional Al-Anon literature is the bedrock of recovery, but the &ldquo;One Day at a Time&rdquo; philosophy often requires a companion that is as mobile as we are&mdash;something you can reach for in the quiet moments between meetings, on a break at work, or before the day begins.</p>
              <p>Each of our 366 original reflections is grounded in the contemplative tradition of Al-Anon. We don&rsquo;t just provide quotes; we provide reflections designed to help you pause, breathe, and apply a principle to your immediate situation. Every entry meets you where you are: not with advice, but with the gentle reminder that you are not alone and that today is enough.</p>
            </div>
          </section>

          <section class="ap-section">
            <h2 class="ap-section-heading">What You&rsquo;ll Find Here</h2>
            <ul class="ap-resource-list">
              <li><a href="${bp('/reflections/')}"><strong>Reflections.</strong></a> A reading for every day of the year, 366 in all, gathered by the Twelve Steps, the Twelve Traditions and the Twelve Concepts.</li>
              <li><a href="${bp('/articles/')}"><strong>Articles.</strong></a> Longer pieces on everyday concerns, including personal stories from members.</li>
              <li><a href="${bp('/guides/')}"><strong>Guides.</strong></a> Focused introductions to a single idea, such as surrender, detachment, boundaries, and finding help.</li>
            </ul>
          </section>

          <section class="ap-section">
            <h2 class="ap-section-heading">The People Behind Daily Paths</h2>
            <div class="ap-editorial">
              <p>Daily Paths is curated by <strong>Neal W.</strong>, who brings over 30 years of personal recovery experience to this project. While Neal&rsquo;s journey began in other Twelve Step rooms, his life has been deeply intertwined with Al-Anon through his marriage and his role as a sponsor to many navigating the complexities of family recovery. This unique perspective allows Daily Paths to offer reflections that are grounded in time-tested principles while remaining accessible to those just beginning to discover the Al-Anon path.</p>
              <p>Neal writes many of the guides. The writing and editing are shared with a growing group of contributors and editors, currently <strong>Celina R.</strong>, <strong>Lance W.</strong> and <strong>Lance T.</strong>, all longtime members of Al-Anon. The work also benefits from the feedback of other members of the fellowship.</p>
              <p>Daily Paths is published by <strong>Daily Growth, LLC</strong>. Everything here is built with a single question in mind: <em>will this help someone find a little more serenity today?</em></p>
            </div>
          </section>

          <section class="ap-section">
            <h2 class="ap-section-heading">How We Make What You Read</h2>
            <div class="ap-editorial">
              <p><strong>Written from within the fellowship.</strong> The reflections, articles and guides come from the experience of Al-Anon members and are grounded in the program&rsquo;s principles and the Twelve Steps. They are not official Al-Anon literature and do not replace it.</p>
              <p><strong>Reviewed by members.</strong> The reflections have been reviewed by members of Al-Anon. The Daily Paths app also asks readers for feedback on each reflection, and we use that feedback to review and revise the readings.</p>
              <p><strong>Drafted with AI, reviewed by people.</strong> We use AI tools to help draft and develop some of our material. Every piece is reviewed and edited by a person before it is published.</p>
              <p><strong>Corrections.</strong> If something reads wrong, or you spot a mistake, please tell us at <a href="mailto:support@dailypaths.org">support@dailypaths.org</a>.</p>
            </div>
          </section>

          <section class="ap-section">
            <h2 class="ap-section-heading">Independence, and What This Is Not</h2>
            <div class="ap-editorial">
              <p>Daily Paths is an independent project published by Daily Growth, LLC. It is not affiliated with, endorsed by, or approved by Al-Anon Family Groups, Inc. or any other organization. The Twelve Steps and Twelve Traditions are used with the understanding that they are the shared heritage of the recovery community.</p>
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

          <section class="ap-section">
            <h2 class="ap-section-heading">The Daily Paths App</h2>
            <div class="ap-editorial">
              <p>The app is for daily practice: a daily reflection, a place for your thoughts, and small ways to bring the focus back to you. Your journal stays on your device.</p>
            </div>
            <div class="ap-app-badges">
              <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer" class="ap-badge-link">
                <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download Al-Anon Daily Paths on the App Store" class="ap-badge ap-badge--ios">
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.nealw98.dailypaths" target="_blank" rel="noopener noreferrer" class="ap-badge-link">
                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get Al-Anon Daily Paths on Google Play" class="ap-badge ap-badge--play">
              </a>
            </div>
          </section>

          <section class="ap-section ap-support">
            <h2 class="ap-section-heading">Get in Touch</h2>
            <div class="ap-editorial">
              <p>For questions about the website or the app, visit our <a href="${bp('/support/')}">Support page</a> or write to <a href="mailto:support@dailypaths.org">support@dailypaths.org</a>. As a small, personal project by Daily Growth, LLC, we aim to respond to all inquiries within 48 hours.</p>
            </div>
          </section>

          <section class="ap-section ap-closing">
            <div class="ap-closing-rule" aria-hidden="true"></div>
            <div class="ap-editorial">
              <p>This project is a labor of love, designed by members for members. We hope it helps you find the serenity you seek, one day at a time.</p>
            </div>
          </section>

        </div>
      </div>

      <section class="ap-nav-cta">
        <div class="ap-nav-cta-inner">
          <h2 class="ap-nav-cta-heading">Start Reading</h2>
          <div class="ap-nav-cta-actions">
            <a href="${bp('/reflections/')}" class="ap-nav-cta-btn">Browse the reflections</a>
            <a href="${bp('/guides/')}" class="ap-nav-cta-btn">Explore the guides</a>
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
