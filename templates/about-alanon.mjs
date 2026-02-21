import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';

/**
 * About Al-Anon Family Groups — Structured resource-block style.
 * Hero: Ocean path image (steps-hero.jpg) with Navy overlay.
 * Authoritative information + external links to WSO site.
 */
export function renderAboutAlanonPage() {

  const bodyContent = `
      <!-- Hero -->
      <header class="aa-hero">
        <div class="aa-hero-image">
          <img src="${bp('/assets/themes/al-anon-hero.jpg')}" alt="Ocean path at sunrise \u2014 About Al-Anon Family Groups" />
          <div class="aa-hero-overlay"></div>
        </div>
        <div class="aa-hero-content">
          <h1 class="aa-hero-title">About Al-Anon</h1>
          <p class="aa-hero-desc">A guide to Al-Anon Family Groups &mdash; who they are, what they do, and how to get started.</p>
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

          <!-- Meetings -->
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

          <!-- How It Works -->
          <section class="aa-block">
            <h2 class="aa-block-heading">How It Works</h2>
            <div class="aa-block-body">
              <p>Al-Anon has no therapists and no mandatory program of treatment. Instead, members share their own experience and listen to others in a safe, non-judgmental setting. The program offers three core tools:</p>
            </div>
            <div class="aa-tools">
              <div class="aa-tool">
                <h3 class="aa-tool-title">The Twelve Steps</h3>
                <p class="aa-tool-text">A spiritual framework for personal growth that helps members examine their own attitudes and behaviors.</p>
                <a href="${bp('/steps/')}" class="aa-tool-link">Explore the Steps &rarr;</a>
              </div>
              <div class="aa-tool">
                <h3 class="aa-tool-title">Meetings &amp; Fellowship</h3>
                <p class="aa-tool-text">Regular gatherings&mdash;in person and online&mdash;where members share experience, strength, and hope.</p>
                <a href="https://al-anon.org/al-anon-meetings/" target="_blank" rel="noopener noreferrer" class="aa-tool-link">Find meetings &rarr;</a>
              </div>
              <div class="aa-tool">
                <h3 class="aa-tool-title">Conference-Approved Literature</h3>
                <p class="aa-tool-text">Books, pamphlets, and daily readers developed by Al-Anon members for Al-Anon members.</p>
                <a href="${bp('/literature/')}" class="aa-tool-link">Browse literature &rarr;</a>
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

          <!-- Official Disclaimer -->
          <section class="aa-disclaimer">
            <p>Daily Paths is an independent project and is not affiliated with, endorsed by, or approved by Al-Anon Family Group Headquarters, Inc. For official Al-Anon information, please visit <a href="https://al-anon.org" target="_blank" rel="noopener noreferrer">al-anon.org</a>.</p>
          </section>

        </div>
      </div>`;

  return wrapInLayout({
    title: 'About Al-Anon Family Groups | Al-Anon Daily Paths',
    description: 'Learn about Al-Anon Family Groups \u2014 a mutual support program for anyone affected by someone else\u2019s drinking. Find meetings, understand the 3 C\u2019s, and explore recovery resources.',
    canonicalPath: '/about-alanon/',
    bodyContent,
    bodyClass: 'page-about-alanon',
  });
}
