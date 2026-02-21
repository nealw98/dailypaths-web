import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';

/**
 * The Al-Anon Program — Structured resource-block style.
 * Hero: al-anon-hero.jpg with Navy overlay.
 * Comprehensive view of the full program: Steps, Fellowship, Literature, Service.
 */

/* Inline SVG cairn icon used as a section separator */
const cairnSvg = `<svg class="aa-cairn-icon" viewBox="0 0 48 64" width="32" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="24" cy="56" rx="18" ry="6" fill="currentColor" opacity="0.18"/>
  <ellipse cx="24" cy="48" rx="14" ry="5.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
  <ellipse cx="24" cy="36" rx="11" ry="5" stroke="currentColor" stroke-width="1.5" fill="none"/>
  <ellipse cx="24" cy="25" rx="9" ry="4.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
  <ellipse cx="24" cy="15" rx="7" ry="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
  <ellipse cx="24" cy="7" rx="4.5" ry="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
</svg>`;

export function renderAboutAlanonPage() {

  const bodyContent = `
      <!-- Hero -->
      <header class="aa-hero">
        <div class="aa-hero-image">
          <img src="${bp('/assets/themes/al-anon-hero.jpg')}" alt="Ocean path at sunrise \u2014 The Al-Anon Program" />
          <div class="aa-hero-overlay"></div>
        </div>
        <div class="aa-hero-content">
          <h1 class="aa-hero-title">The Al-Anon Program</h1>
          <p class="aa-hero-desc">A spiritual path for those affected by someone else&rsquo;s drinking.</p>
        </div>
      </header>

      <!-- Resource Blocks -->
      <div class="aa-body">
        <div class="aa-body-inner">

          <!-- What Is Al-Anon? -->
          <section class="aa-block">
            <h2 class="aa-block-heading">What Is Al-Anon?</h2>
            <div class="aa-block-body">
              <p>Al-Anon Family Groups are a fellowship of relatives and friends of alcoholics who share their experience, strength, and hope in order to solve their common problems. Al-Anon is not allied with any sect, denomination, political entity, organization, or institution.</p>
              <p>The program is based on the Twelve Steps and Twelve Traditions, adapted from Alcoholics Anonymous. Members discover that they are not alone and that they can find contentment and even happiness, whether the alcoholic is still drinking or not.</p>
            </div>
            <a href="https://al-anon.org/newcomers/what-is-al-anon-alateen/" target="_blank" rel="noopener noreferrer" class="aa-block-link">
              Learn more at al-anon.org&nbsp;&#8599;
            </a>
          </section>

          <!-- Is Al-Anon for Me? -->
          <section class="aa-block">
            <h2 class="aa-block-heading">Is Al-Anon for Me?</h2>
            <div class="aa-block-body">
              <p>If a relative, friend, or coworker&rsquo;s drinking is affecting your life, Al-Anon may be able to help. You don&rsquo;t need to wait for the alcoholic to seek help before you begin your own recovery.</p>
              <p>Millions of people are affected by the excessive drinking of someone close. The following questions may help you decide whether Al-Anon is right for you.</p>
            </div>
            <div class="aa-questions">
              <div class="aa-question">Do you worry about how much someone else drinks?</div>
              <div class="aa-question">Do you tell lies to cover up for someone else&rsquo;s drinking?</div>
              <div class="aa-question">Do you feel that if the drinker cared about you, they would stop?</div>
              <div class="aa-question">Do you feel angry, confused, or depressed most of the time?</div>
              <div class="aa-question">Do you feel there is no one who understands your problems?</div>
            </div>
            <p class="aa-questions-note">If you answered yes to any of these, you are not alone. Al-Anon can help.</p>
            <a href="https://al-anon.org/newcomers/self-quiz/" target="_blank" rel="noopener noreferrer" class="aa-block-link">
              Take the full self-quiz at al-anon.org&nbsp;&#8599;
            </a>
          </section>

          <!-- The 3 C's -->
          <section class="aa-block">
            <h2 class="aa-block-heading">The 3 C&rsquo;s</h2>
            <div class="aa-block-body">
              <p>One of the first things you&rsquo;ll hear in Al-Anon is a simple truth that can change everything:</p>
            </div>
            <div class="aa-threes">
              <div class="aa-three-item">
                <span class="aa-three-label">You didn&rsquo;t <strong>Cause</strong> it.</span>
                <span class="aa-three-desc">Alcoholism is a disease. Nothing you said or did made someone else drink.</span>
              </div>
              <div class="aa-three-item">
                <span class="aa-three-label">You can&rsquo;t <strong>Control</strong> it.</span>
                <span class="aa-three-desc">No amount of managing or pleading can make another person stop drinking.</span>
              </div>
              <div class="aa-three-item">
                <span class="aa-three-label">You can&rsquo;t <strong>Cure</strong> it.</span>
                <span class="aa-three-desc">Recovery from alcoholism is the drinker&rsquo;s responsibility. Your recovery is yours.</span>
              </div>
            </div>
          </section>

          <!-- Cairn Separator -->
          <div class="aa-cairn-separator" aria-hidden="true">
            ${cairnSvg}
          </div>

          <!-- Find a Meeting -->
          <section class="aa-block aa-block--highlight">
            <h2 class="aa-block-heading">Find a Meeting</h2>
            <div class="aa-block-body">
              <p>Al-Anon meetings are free, confidential, and open to anyone affected by someone else&rsquo;s drinking. Meetings are held in person and online around the world.</p>
              <p>There are no dues or fees for membership. You will never be asked to pay, and your attendance is completely anonymous.</p>
            </div>
            <a href="https://al-anon.org/al-anon-meetings/find-an-al-anon-meeting/" target="_blank" rel="noopener noreferrer" class="aa-meeting-btn">
              Search the Official Meeting Directory&nbsp;&#8599;
            </a>
          </section>

          <!-- How It Works — Four Pillars -->
          <section class="aa-block">
            <h2 class="aa-block-heading">How the Program Works</h2>
            <div class="aa-block-body">
              <p>Al-Anon has no therapists and no mandatory course of treatment. Instead, the program rests on four interconnected pillars&mdash;each one essential, none sufficient on its own.</p>
            </div>
            <div class="aa-pillars">
              <div class="aa-pillar">
                <span class="aa-pillar-label">The Architecture</span>
                <h3 class="aa-pillar-title">The Twelve Steps</h3>
                <p class="aa-pillar-text">A spiritual framework for personal growth. The Steps help members honestly examine their own attitudes and behaviors&mdash;not to fix the alcoholic, but to find freedom for themselves.</p>
                <a href="${bp('/steps/')}" class="aa-pillar-link">Explore the Steps &rarr;</a>
              </div>
              <div class="aa-pillar">
                <span class="aa-pillar-label">The Community</span>
                <h3 class="aa-pillar-title">The Fellowship</h3>
                <p class="aa-pillar-text">Regular gatherings&mdash;in person and online&mdash;where members share experience, strength, and hope. The fellowship is where isolation ends and recovery becomes real.</p>
                <a href="https://al-anon.org/al-anon-meetings/" target="_blank" rel="noopener noreferrer" class="aa-pillar-link">Find meetings &rarr;</a>
              </div>
              <div class="aa-pillar">
                <span class="aa-pillar-label">The Wisdom</span>
                <h3 class="aa-pillar-title">The Literature</h3>
                <p class="aa-pillar-text">Conference-Approved books, pamphlets, and daily readers developed by Al-Anon members for Al-Anon members. The written wisdom of millions of families who walked this path before you.</p>
                <a href="${bp('/literature/')}" class="aa-pillar-link">Browse literature &rarr;</a>
              </div>
              <div class="aa-pillar">
                <span class="aa-pillar-label">The Practice</span>
                <h3 class="aa-pillar-title">Service</h3>
                <p class="aa-pillar-text">Giving back to the fellowship that gave so much to you. Service&mdash;from making coffee to sponsoring newcomers&mdash;is how members keep what they have by giving it away.</p>
                <a href="https://al-anon.org/for-members/world-service-office-wso/" target="_blank" rel="noopener noreferrer" class="aa-pillar-link">Learn about service &rarr;</a>
              </div>
            </div>
          </section>

          <!-- FAQ -->
          <section class="aa-block">
            <h2 class="aa-block-heading">Common Questions</h2>
            <div class="aa-faq">
              <div class="aa-faq-item">
                <h3 class="aa-faq-q">Is Al-Anon a religious program?</h3>
                <p class="aa-faq-a">No. Al-Anon is a <strong>spiritual</strong> program, not a religious one. Members are encouraged to find a &ldquo;Higher Power&rdquo; of their own understanding. There is no doctrine, no creed, and no requirement to believe anything in particular.</p>
              </div>
              <div class="aa-faq-item">
                <h3 class="aa-faq-q">Is my privacy protected?</h3>
                <p class="aa-faq-a">Yes. Anonymity is a foundational principle. What you share in a meeting stays in the meeting. Members use first names only, and no one will contact you unless you ask.</p>
              </div>
              <div class="aa-faq-item">
                <h3 class="aa-faq-q">What about young people?</h3>
                <p class="aa-faq-a"><strong>Alateen</strong> is part of the Al-Anon family, designed for younger members (ages 13&ndash;18) affected by someone else&rsquo;s drinking.</p>
              </div>
            </div>
            <a href="https://al-anon.org/newcomers/faq/" target="_blank" rel="noopener noreferrer" class="aa-block-link">
              More FAQs at al-anon.org&nbsp;&#8599;
            </a>
          </section>

          <!-- Related Fellowships -->
          <section class="aa-block">
            <h2 class="aa-block-heading">Related Fellowships</h2>
            <div class="aa-block-body">
              <p>Al-Anon is part of a wider family of twelve-step programs. These related fellowships may also be helpful on your journey.</p>
            </div>
            <div class="aa-fellows">
              <a href="https://adultchildren.org" target="_blank" rel="noopener noreferrer" class="aa-fellow">
                <span class="aa-fellow-name">Adult Children of Alcoholics (ACA)</span>
                <span class="aa-fellow-desc">For adults who grew up in alcoholic or dysfunctional homes.</span>
              </a>
              <a href="https://coda.org" target="_blank" rel="noopener noreferrer" class="aa-fellow">
                <span class="aa-fellow-name">Co-Dependents Anonymous (CoDA)</span>
                <span class="aa-fellow-desc">For anyone seeking healthy, fulfilling relationships.</span>
              </a>
              <a href="https://al-anon.org/for-members/group-resources/alateen/" target="_blank" rel="noopener noreferrer" class="aa-fellow">
                <span class="aa-fellow-name">Alateen</span>
                <span class="aa-fellow-desc">For younger members affected by someone else&rsquo;s drinking.</span>
              </a>
            </div>
          </section>

          <!-- App CTA — The Daily Practice Bridge -->
          <section class="aa-app-cta">
            <h2 class="aa-app-cta-heading">The Program in Your Pocket</h2>
            <p class="aa-app-cta-text">Al-Anon provides the framework for a new way of life. Daily Paths is designed to be your daily touchstone&mdash;helping you apply the Twelve Steps and recovery themes to the moments when you need them most.</p>
            <div class="aa-app-cta-badges">
              <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer" class="aa-app-cta-badge-link">
                <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download Al-Anon Daily Paths on the App Store" class="aa-app-cta-badge aa-app-cta-badge--ios">
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.dailypaths" target="_blank" rel="noopener noreferrer" class="aa-app-cta-badge-link">
                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get Al-Anon Daily Paths on Google Play" class="aa-app-cta-badge aa-app-cta-badge--play">
              </a>
            </div>
          </section>

          <!-- Official Disclaimer -->
          <section class="aa-disclaimer">
            <p>Daily Paths is an independent project and is not affiliated with, endorsed by, or approved by Al-Anon Family Group Headquarters, Inc. For official Al-Anon information, please visit <a href="https://al-anon.org" target="_blank" rel="noopener noreferrer">al-anon.org</a>.</p>
          </section>

        </div>
      </div>`;

  return wrapInLayout({
    title: 'The Al-Anon Program \u2014 Steps, Fellowship, Literature & Service | Al-Anon Daily Paths',
    description: 'Explore the Al-Anon program \u2014 the Twelve Steps, fellowship meetings, Conference-Approved literature, and service. A spiritual path for families and friends affected by someone else\u2019s drinking.',
    canonicalPath: '/about-alanon/',
    bodyContent,
    bodyClass: 'page-about-alanon',
  });
}
