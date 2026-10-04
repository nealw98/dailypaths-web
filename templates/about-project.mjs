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
          <p class="page-description">An independent collection of daily reflections, articles and guides.</p>
        </div>
      </div>

      <!-- DRAFT (October 1, 2026): plain-spoken rewrite for credibility. Not approved launch
           copy. Contributor names need each person's approval before launch. -->
      <div class="ap-body">
        <div class="ap-body-inner">

          <section class="ap-section">
            <h2 class="ap-section-heading">About Daily Paths</h2>
            <div class="ap-editorial">
              <p>Daily Paths is a collection of daily reflections, articles and guides for people affected by someone else&rsquo;s drinking. It draws on the principles of Al-Anon and the Twelve Steps, and it is meant to be something you can pick up for a few minutes: between meetings, on a break at work, or before the day begins.</p>
            </div>
            <ul class="ap-resource-list">
              <li><a href="${bp('/reflections/')}"><strong>Reflections.</strong></a> One for every day of the year, 366 in all, gathered by the Twelve Steps, Traditions and Concepts.</li>
              <li><a href="${bp('/articles/')}"><strong>Articles.</strong></a> Longer pieces on everyday concerns, including personal stories from people with lived experience.</li>
              <li><a href="${bp('/guides/')}"><strong>Guides.</strong></a> Short introductions to a single idea, such as surrender, detachment, boundaries, and finding help.</li>
            </ul>
          </section>

          <section class="ap-section">
            <h2 class="ap-section-heading">Who Writes It</h2>
            <div class="ap-editorial">
              <p>Daily Paths was created by <strong>Neal W.</strong>, who brings over 30 years of personal recovery experience to this project. While Neal&rsquo;s journey began in other Twelve Step rooms, his life has been deeply intertwined with Al-Anon through his marriage and his role as a sponsor to many navigating the complexities of family recovery. This unique perspective allows Daily Paths to offer reflections that are grounded in time-tested principles while remaining accessible to those just beginning to discover the Al-Anon path.</p>
              <p>A team of people with real experience living with someone else&rsquo;s drinking and practicing the Twelve Step program of recovery write and edit the content. They also advise and guide the development of the site. Daily Paths is published by <strong>Daily Growth, LLC</strong>.</p>
            </div>
          </section>

          <section class="ap-section">
            <h2 class="ap-section-heading">How It&rsquo;s Made</h2>
            <div class="ap-editorial">
              <p><strong>From lived experience.</strong> The reflections, articles and guides come from people with real experience living with someone else&rsquo;s drinking and practicing the Twelve Step program of recovery, and they draw on the program&rsquo;s principles. They are not official Al-Anon literature and do not replace it.</p>
              <p><strong>Researched.</strong> Each guide is based on Al-Anon literature, along with further research into the topic and conversations with people who have lived it, which are pulled together into one piece.</p>
              <p><strong>Reviewed by a broader group.</strong> The reflections have been reviewed by people experienced in the Twelve Step program of recovery, a wider circle than the authors. The Daily Paths app also asks readers for feedback on each reflection, and we use that feedback to review and revise the readings.</p>
              <p><strong>Drafted with AI, reviewed by humans.</strong> We use AI tools to help draft and develop some of our material. Every piece is reviewed and edited by actual humans before publishing.</p>
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
            <h2 class="ap-section-heading">The App</h2>
            <div class="ap-editorial">
              <p>A companion app offers the daily reflection, a private journal and a few daily tools. Your journal stays on your device.</p>
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
            <h2 class="ap-section-heading">Contact</h2>
            <div class="ap-editorial">
              <p>For questions about the website or the app, visit our <a href="${bp('/support/')}">Support page</a> or write to <a href="mailto:support@dailypaths.org">support@dailypaths.org</a>. We aim to respond within 48 hours.</p>
            </div>
          </section>

        </div>
      </div>`;

  return wrapInLayout({
    title: 'About Daily Paths | Al-Anon Daily Paths',
    description: 'Daily Paths is an independent collection of daily reflections, articles and guides for people affected by someone else\'s drinking, created by Neal W. and published by Daily Growth, LLC.',
    canonicalPath: '/about-project/',
    bodyContent,
    bodyClass: 'page-about-project',
  });
}
