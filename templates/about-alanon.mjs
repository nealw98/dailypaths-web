import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';
import {
  photoHero, icon, tealBand, glassPanel, appPanel, MEETING_DIRECTORY_URL,
} from './ui.mjs';

/**
 * The Al-Anon Program.
 *
 * Photo hero → what Al-Anon is → the self-quiz card → Find a Meeting band →
 * the four pillars → common questions → related fellowships → app panel.
 */
export function renderAboutAlanonPage() {
  const selfQuiz = [
    'Do you worry about how much someone else drinks?',
    'Do you tell lies to cover up for someone else&rsquo;s drinking?',
    'Do you feel that if the drinker cared about you, they would stop?',
    'Do you feel angry, confused, or depressed most of the time?',
    'Do you feel there is no one who understands your problems?',
  ];

  const pillars = [
    {
      eyebrow: 'The architecture',
      iconName: 'stackedStones',
      title: 'The Twelve Steps',
      body: 'A spiritual framework for personal growth. The Steps help members honestly examine their own attitudes and behaviors &mdash; not to fix the alcoholic, but to find freedom for themselves.',
      link: 'Explore the Steps &rarr;',
      href: bp('/steps/'),
      external: false,
    },
    {
      eyebrow: 'The community',
      iconName: 'leafOnWater',
      title: 'The Fellowship',
      body: 'Regular gatherings &mdash; in person and online &mdash; where members share experience, strength, and hope. The fellowship is where isolation ends and recovery becomes real.',
      link: 'Find meetings &#8599;',
      href: 'https://al-anon.org/al-anon-meetings/',
      external: true,
    },
    {
      eyebrow: 'The wisdom',
      iconName: 'book',
      title: 'The Literature',
      body: 'Conference-Approved books, pamphlets, and daily readers developed by Al-Anon members for Al-Anon members &mdash; the written wisdom of families who walked this path before you.',
      link: 'Browse literature &rarr;',
      href: bp('/literature/'),
      external: false,
    },
    {
      eyebrow: 'The practice',
      iconName: 'seedling',
      title: 'Service',
      body: 'Giving back to the fellowship that gave so much to you. Service &mdash; from making coffee to sponsoring newcomers &mdash; is how members keep what they have by giving it away.',
      link: 'Learn about service &#8599;',
      href: 'https://al-anon.org/for-members/world-service-office-wso/',
      external: true,
    },
  ];

  const faqs = [
    {
      q: 'Is Al-Anon a religious program?',
      a: 'No. Al-Anon is a <strong>spiritual</strong> program, not a religious one. Members are encouraged to find a Higher Power of their own understanding. There is no doctrine, no creed, and no requirement to believe anything in particular.',
    },
    {
      q: 'Is my privacy protected?',
      a: 'Yes. Anonymity is a foundational principle. What you share in a meeting stays in the meeting. Members use first names only, and no one will contact you unless you ask.',
    },
    {
      q: 'What about young people?',
      a: '<strong>Alateen</strong> is part of the Al-Anon family, designed for younger members (ages 13&ndash;18) affected by someone else&rsquo;s drinking.',
    },
  ];

  const fellowships = [
    {
      name: 'Adult Children of Alcoholics (ACA)',
      line: 'For adults who grew up in alcoholic or dysfunctional homes.',
      href: 'https://adultchildren.org',
    },
    {
      name: 'Co-Dependents Anonymous (CoDA)',
      line: 'For anyone seeking healthy, fulfilling relationships.',
      href: 'https://coda.org',
    },
    {
      name: 'Alateen',
      line: 'For younger members affected by someone else&rsquo;s drinking.',
      href: 'https://al-anon.org/for-members/group-resources/alateen/',
    },
  ];

  const quizItems = selfQuiz.map(q => `
            <li>
              ${icon('softExhale', { size: 18 })}
              <span>${q}</span>
            </li>`).join('');

  const pillarCards = pillars.map(p => `
          <a href="${p.href}" class="card-elevated pillar-card"${p.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>
            ${icon(p.iconName, { size: 34, className: 'pillar-icon' })}
            <p class="pillar-eyebrow">${p.eyebrow}</p>
            <h3 class="pillar-title">${p.title}</h3>
            <p class="pillar-body">${p.body}</p>
            <span class="pillar-link">${p.link}</span>
          </a>`).join('');

  const faqCards = faqs.map(f => `
        <div class="faq-card">
          <h3 class="faq-q">${f.q}</h3>
          <p class="faq-a">${f.a}</p>
        </div>`).join('');

  const fellowCards = fellowships.map(f => `
          <a href="${f.href}" target="_blank" rel="noopener noreferrer" class="card-elevated fellow-card">
            <span class="fellow-name">${f.name}</span>
            <span class="fellow-line">${f.line}</span>
            <span class="fellow-cta">Visit &#8599;</span>
          </a>`).join('');

  const meetingBand = tealBand({
    eyebrow: 'Find a meeting',
    heading: 'Free, confidential, and open to anyone.',
    body: 'Meetings are held in person and online around the world. There are no dues or fees for membership &mdash; you will never be asked to pay, and your attendance is completely anonymous.',
    actions: `<a href="${MEETING_DIRECTORY_URL}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary">Search the meeting directory &#8599;</a>`,
    aside: glassPanel({
      label: 'In crisis?',
      lines: ['Help is available 24/7.', 'Call or text 988 in the USA.'],
    }),
  });

  const bodyContent = `
${photoHero({
    image: bp('/assets/hero-image.jpg'),
    alt: 'Sunlit meadow path — the Al-Anon program',
    title: 'The Al-Anon Program',
    subtitle: 'A path for those affected by someone else&rsquo;s drinking.',
    size: 'lg',
  })}

    <article class="rd-article">
      <h2 class="aa-heading">What is Al-Anon?</h2>
      <div class="prose-lora">
        <p>Al-Anon Family Groups are a fellowship of relatives and friends of alcoholics who share their experience, strength, and hope in order to solve their common problems. Al-Anon is not allied with any sect, denomination, political entity, organization, or institution.</p>
        <p>The program is based on the Twelve Steps and Twelve Traditions, adapted from Alcoholics Anonymous. Members discover that they are not alone, and that they can find contentment and even happiness &mdash; whether the alcoholic is still drinking or not.</p>
      </div>
      <a href="https://al-anon.org/newcomers/what-is-al-anon-alateen/" target="_blank" rel="noopener noreferrer" class="text-link">Learn more at al-anon.org &#8599;</a>
    </article>

    <section class="wrap wrap--article section--md">
      <div class="panel-outlined">
        <h2 class="quiz-card-heading">Is Al-Anon for me?</h2>
        <p class="quiz-card-intro">If a relative, friend, or coworker&rsquo;s drinking is affecting your life, Al-Anon may be able to help. You don&rsquo;t need to wait for the alcoholic to seek help before you begin your own recovery.</p>
        <ul class="quiz-list">${quizItems}
        </ul>
        <p class="quiz-closer">If you answered yes to any of these, you are not alone. Al-Anon can help.</p>
        <p style="margin:16px 0 0"><a href="https://al-anon.org/newcomers/self-quiz/" target="_blank" rel="noopener noreferrer" class="text-link">Take the full self-quiz at al-anon.org &#8599;</a></p>
      </div>
    </section>

${meetingBand}

    <section class="wrap section">
      <h2 class="section-title">How the program works</h2>
      <p class="section-desc" style="max-width:62ch">Al-Anon has no therapists and no mandatory course of treatment. Instead the program rests on four interconnected pillars &mdash; each one essential, none sufficient on its own.</p>
      <div class="pillar-grid">${pillarCards}
      </div>
    </section>

    <section class="wrap wrap--article section">
      <h2 class="section-title" style="margin-bottom:20px">Common questions</h2>
      <div class="faq-list">${faqCards}
      </div>
      <p style="margin:16px 0 0"><a href="https://al-anon.org/newcomers/faq/" target="_blank" rel="noopener noreferrer" class="text-link">More FAQs at al-anon.org &#8599;</a></p>
    </section>

    <section class="wrap section">
      <h2 class="section-title">Related fellowships</h2>
      <p class="section-desc" style="max-width:60ch">Al-Anon is part of a wider family of twelve-step programs. These may also be helpful on your journey.</p>
      <div class="fellow-grid">${fellowCards}
      </div>
      <p class="fine-print">Daily Paths is an independent project and is not affiliated with, endorsed by, or approved by Al-Anon Family Group Headquarters, Inc. For official Al-Anon information, please visit <a href="https://al-anon.org" target="_blank" rel="noopener noreferrer">al-anon.org</a>.</p>
    </section>

    <div class="wrap section--md" id="get-the-app">
      ${appPanel({
        tone: 'seafoam',
        heading: 'Your daily companion',
        text: 'Al-Anon provides the framework for a new way of life. Daily Paths is the daily touchstone &mdash; helping you apply the Steps and themes in the moments you need them most.',
        context: 'alanon',
      })}
    </div>`;

  return wrapInLayout({
    title: 'The Al-Anon Program — Steps, Fellowship, Literature & Service | Al-Anon Daily Paths',
    description: 'Explore the Al-Anon program — the Twelve Steps, fellowship meetings, Conference-Approved literature, and service. A spiritual path for families and friends affected by someone else’s drinking.',
    canonicalPath: '/about-alanon/',
    bodyContent,
    bodyClass: 'page-about-alanon',
    navSection: 'alanon',
    hasAppPanel: true,
  });
}
