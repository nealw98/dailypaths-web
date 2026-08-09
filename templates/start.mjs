import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';
import { readingSlug } from '../helpers/slug-utils.mjs';
import { icon, ripple, appPanel, MEETING_DIRECTORY_URL } from './ui.mjs';

/**
 * Start here — the newcomer funnel.
 *
 * Someone who arrived from a search like "is my husband an alcoholic" needs to
 * find out whether Al-Anon applies to them, without being asked to commit,
 * sign up, or read 366 readings. Four small steps, no sign-up.
 *
 * Deliberately not in the header nav — six items is already the ceiling there.
 * Reached from the home strip, the home teal band, and the footer.
 */

/** The five self-quiz questions, as tappable toggles. */
const QUIZ = [
  'Do you worry about how much someone else drinks?',
  'Do you tell lies to cover up for someone else&rsquo;s drinking?',
  'Do you feel that if the drinker cared about you, they would stop?',
  'Do you feel angry, confused, or depressed most of the time?',
  'Do you feel there is no one who understands your problems?',
];

const FACTS = [
  {
    iconName: 'leafOnWater',
    title: 'It&rsquo;s free, always',
    body: 'No dues, no fees, nothing to buy. Meetings are open to anyone affected by someone else&rsquo;s drinking.',
  },
  {
    iconName: 'stackedStones',
    title: 'It&rsquo;s anonymous',
    body: 'First names only. What&rsquo;s said in a meeting stays there. No one will contact you unless you ask.',
  },
  {
    iconName: 'seedling',
    title: 'It&rsquo;s not therapy, and it&rsquo;s not religion',
    body: 'No therapists, no treatment plan, no doctrine &mdash; a spiritual program, with a Higher Power of your own understanding.',
  },
];

/**
 * The three readings we point newcomers at first. Resolved by title against
 * the real reading set, with a day-of-year fallback so the page still builds
 * if a title changes.
 */
const FIRST_READINGS = [
  {
    label: 'Read first',
    title: 'The Power of We',
    fallbackDay: 1,
    why: 'Why the Step starts with &ldquo;we&rdquo; &mdash; and what changes when you stop carrying it alone.',
  },
  {
    label: 'Then',
    title: 'Coming for Relief',
    fallbackDay: 2,
    why: 'Most of us arrive exhausted rather than convinced. That&rsquo;s enough to begin with.',
  },
  {
    label: 'Then',
    title: 'A Family Disease',
    fallbackDay: 5,
    why: 'You didn&rsquo;t cause it, you can&rsquo;t control it, you can&rsquo;t cure it.',
  },
];

/**
 * @param {Array} readings - All 366 readings, used to resolve the three
 *   newcomer readings to real URLs.
 */
export function renderStartPage(readings = []) {
  const byTitle = new Map();
  const byDay = new Map();
  for (const r of readings) {
    byTitle.set(r.title.trim().toLowerCase(), r);
    byDay.set(r.day_of_year, r);
  }

  const weekCards = FIRST_READINGS.map(item => {
    const reading = byTitle.get(item.title.toLowerCase()) || byDay.get(item.fallbackDay);
    if (!reading) return '';
    const href = bp(`/${readingSlug(reading.day_of_year, reading.title)}/`);
    return `
          <a href="${href}" class="card-elevated start-week-card">
            <span class="start-week-label">${item.label}</span>
            <span class="start-week-title">${reading.title}</span>
            <span class="start-week-why">${item.why}</span>
            <span class="start-week-cta">Read it &rarr;</span>
          </a>`;
  }).join('');

  // `mp-no-track` keeps Mixpanel autocapture off these elements. Without it,
  // autocapture would send the text of whichever questions the visitor tapped
  // — the page promises nothing is saved and nothing is sent, so it must not.
  const quizRows = QUIZ.map((q, i) => `
            <button type="button" class="quiz-toggle mp-no-track" data-mp-no-track data-quiz-toggle aria-pressed="false" id="quiz-${i + 1}">
              <span class="quiz-toggle-box" aria-hidden="true"><span class="quiz-toggle-tick"></span></span>
              <span>${q}</span>
            </button>`).join('');

  const factRows = FACTS.map(f => `
            <div class="start-fact">
              ${icon(f.iconName, { size: 28 })}
              <span>
                <span class="start-fact-title">${f.title}</span>
                <span class="start-fact-body">${f.body}</span>
              </span>
            </div>`).join('');

  const bodyContent = `
    <section class="start-hero">
      ${ripple(620)}
      <div class="start-hero-inner">
        <p class="eyebrow eyebrow--on-dark">New here</p>
        <h1 class="start-hero-title">Start here</h1>
        <p class="start-hero-lede">If someone else&rsquo;s drinking is affecting your life, you don&rsquo;t have to have it figured out to begin. Five minutes, four small things, no sign-up.</p>
      </div>
    </section>

    <!-- 1 -->
    <section class="wrap wrap--article section--md">
      <div class="start-step-head">
        <span class="start-step-numeral" aria-hidden="true">1</span>
        <h2 class="start-step-title">See whether this is your situation</h2>
      </div>
      <p class="start-step-intro">Tap any that sound familiar. Nothing is saved, and nothing is sent.</p>
      <div class="start-step-body">
        <div class="start-quiz mp-no-track" data-mp-no-track data-quiz>${quizRows}
        </div>
      </div>
      <div class="quiz-response mp-no-track" data-mp-no-track data-quiz-response hidden>
        <p class="quiz-response-lead">You checked <span data-quiz-count>0</span>. That&rsquo;s not a diagnosis &mdash; it&rsquo;s just a sign you&rsquo;re in the right place.</p>
        <p class="quiz-response-follow">Al-Anon is for people whose lives are affected by someone else&rsquo;s drinking, whether or not that person ever stops.</p>
      </div>
    </section>

    <!-- 2 -->
    <section class="wrap wrap--article section--lg">
      <div class="start-step-head">
        <span class="start-step-numeral" aria-hidden="true">2</span>
        <h2 class="start-step-title">Know what you&rsquo;d be walking into</h2>
      </div>
      <div class="start-step-body" style="margin-top:20px">
        <div class="start-facts">${factRows}
        </div>
        <p style="margin:16px 0 0"><a href="${bp('/about-alanon/')}" class="text-link">Read more about the program &rarr;</a></p>
      </div>
    </section>

    <!-- 3 -->
    <section class="wrap wrap--article section--lg">
      <div class="start-step-head">
        <span class="start-step-numeral" aria-hidden="true">3</span>
        <h2 class="start-step-title">Read three things this week</h2>
      </div>
      <p class="start-step-intro">Not the whole book. Three readings that most of us needed first.</p>
      <div class="start-step-body">
        <div class="start-week">${weekCards}
        </div>
      </div>
    </section>

    <!-- 4 -->
    <section class="wrap wrap--article section--lg">
      <div class="start-step-head">
        <span class="start-step-numeral" aria-hidden="true">4</span>
        <h2 class="start-step-title">Sit in one meeting</h2>
      </div>
      <div class="start-step-body" style="margin-top:18px">
        <p class="start-meeting-text">You don&rsquo;t have to speak. Most people say nothing at their first meeting, and no one asks them to. You can join an online meeting from a closed door in your own house and leave whenever you want. If it isn&rsquo;t right, try a different group &mdash; they vary more than you&rsquo;d expect.</p>
        <div class="btn-row">
          <a href="${MEETING_DIRECTORY_URL}" target="_blank" rel="noopener noreferrer" class="btn">Find a meeting near you &#8599;</a>
          <a href="${bp('/essentials/#serenity')}" class="btn btn--ghost">Read the Serenity Prayer</a>
        </div>
      </div>
    </section>

    <div class="wrap wrap--article section--lg" id="get-the-app">
      ${appPanel({
        tone: 'seafoam',
        heading: 'One reading a day, wherever you are',
        text: 'The app sends the day&rsquo;s reflection each morning and gives you a private place to write &mdash; nothing leaves your phone.',
        context: 'start',
      })}
      <p class="fine-print">In crisis? Help is available 24/7 &mdash; call or text <strong>988</strong> (USA).</p>
    </div>`;

  return wrapInLayout({
    title: 'Start Here — Is Al-Anon For You? | Al-Anon Daily Paths',
    description: 'New to Al-Anon? Find out in five minutes whether it applies to you. A short self-check, what a meeting is actually like, three readings to start with, and how to find a meeting. No sign-up.',
    canonicalPath: '/start/',
    bodyContent,
    bodyClass: 'page-start',
    hasAppPanel: true,
  });
}
