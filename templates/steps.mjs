import { wrapInLayout } from './base.mjs';
import { dayToSlug } from '../helpers/slug-utils.mjs';

/**
 * Step data — shared between the index and individual step pages.
 */
export const STEPS = [
  {
    number: 1,
    text: 'We admitted we were powerless over alcohol &mdash; that our lives had become unmanageable.',
    month: 'January',
    monthSlug: 'january',
    principle: 'Honesty',
    questions: [
      'In what ways have I tried to control another person&rsquo;s drinking or behavior?',
      'What has happened in my life that feels unmanageable?',
      'Can I accept that I am powerless over alcohol and other people&rsquo;s choices?',
      'What would it mean for me to stop fighting and simply admit the truth?',
      'How has my need to control affected my relationships, my health, and my peace of mind?',
    ],
  },
  {
    number: 2,
    text: 'Came to believe that a Power greater than ourselves could restore us to sanity.',
    month: 'February',
    monthSlug: 'february',
    principle: 'Hope',
    questions: [
      'What does &ldquo;sanity&rdquo; look like in my daily life?',
      'Have I ever experienced a moment of clarity or peace that felt larger than myself?',
      'What stands in the way of my willingness to believe in something greater?',
      'When have I felt truly hopeful, even in difficult circumstances?',
      'What does &ldquo;a Power greater than ourselves&rdquo; mean to me personally?',
    ],
  },
  {
    number: 3,
    text: 'Made a decision to turn our will and our lives over to the care of God <em>as we understood Him</em>.',
    month: 'March',
    monthSlug: 'march',
    principle: 'Faith',
    questions: [
      'What does &ldquo;letting go&rdquo; mean to me in practical terms?',
      'In what areas of my life am I still trying to be in charge of outcomes?',
      'How might my life change if I trusted a Higher Power with my worries?',
      'What is the difference between making a decision and taking an action?',
      'Can I turn over my will without knowing what will happen next?',
    ],
  },
  {
    number: 4,
    text: 'Made a searching and fearless moral inventory of ourselves.',
    month: 'April',
    monthSlug: 'april',
    principle: 'Courage',
    questions: [
      'What character traits have helped me survive difficult situations?',
      'What patterns in my behavior have caused harm to myself or others?',
      'Am I willing to look honestly at both my strengths and my shortcomings?',
      'What fears come up when I think about examining my own behavior?',
      'How have the effects of someone else&rsquo;s alcoholism shaped who I am today?',
    ],
  },
  {
    number: 5,
    text: 'Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.',
    month: 'May',
    monthSlug: 'may',
    principle: 'Integrity',
    questions: [
      'What have I been afraid to say out loud?',
      'Is there someone I trust enough to share my inventory with honestly?',
      'How does keeping secrets affect my peace of mind?',
      'What would it feel like to be truly known by another person?',
      'Can I separate shame from honest self-examination?',
    ],
  },
  {
    number: 6,
    text: 'Were entirely ready to have God remove all these defects of character.',
    month: 'June',
    monthSlug: 'june',
    principle: 'Willingness',
    questions: [
      'Which of my character defects am I most reluctant to give up? Why?',
      'How have my defects served me in the past, and what do they cost me now?',
      'What does &ldquo;entirely ready&rdquo; mean &mdash; and am I there yet?',
      'Am I trying to remove my own defects, or am I willing to let God do it?',
      'What would my life look like without the patterns that no longer serve me?',
    ],
  },
  {
    number: 7,
    text: 'Humbly asked Him to remove our shortcomings.',
    month: 'July',
    monthSlug: 'july',
    principle: 'Humility',
    questions: [
      'What does humility mean to me?',
      'Can I ask for help without feeling weak or ashamed?',
      'How is asking God to remove my shortcomings different from trying to fix myself?',
      'What is the difference between humility and humiliation?',
      'Am I willing to be changed, even if I don&rsquo;t know what the result will be?',
    ],
  },
  {
    number: 8,
    text: 'Made a list of all persons we had harmed, and became willing to make amends to them all.',
    month: 'August',
    monthSlug: 'august',
    principle: 'Brotherly Love',
    questions: [
      'Who have I harmed through my reactions to someone else&rsquo;s drinking?',
      'Am I on my own list of people I&rsquo;ve harmed?',
      'What is the difference between willingness and action in this step?',
      'Are there people I resist putting on my list? What does that resistance tell me?',
      'How do I distinguish between harm I&rsquo;ve caused and harm done to me?',
    ],
  },
  {
    number: 9,
    text: 'Made direct amends to such people wherever possible, except when to do so would injure them or others.',
    month: 'September',
    monthSlug: 'september',
    principle: 'Justice',
    questions: [
      'Which amends feel most urgent? Which feel most frightening?',
      'How do I know when making amends would cause more harm than good?',
      'What does &ldquo;living amends&rdquo; look like in my daily behavior?',
      'Am I making amends to clear my conscience, or to genuinely repair a relationship?',
      'Can I make amends without expecting forgiveness in return?',
    ],
  },
  {
    number: 10,
    text: 'Continued to take personal inventory and when we were wrong promptly admitted it.',
    month: 'October',
    monthSlug: 'october',
    principle: 'Perseverance',
    questions: [
      'Do I regularly check in with myself about my motives and behavior?',
      'How quickly am I able to admit when I&rsquo;m wrong?',
      'What does a daily inventory look like for me?',
      'Do I tend to take too much responsibility for things, or too little?',
      'How has regular self-examination changed my relationships?',
    ],
  },
  {
    number: 11,
    text: 'Sought through prayer and meditation to improve our conscious contact with God <em>as we understood Him</em>, praying only for knowledge of His will for us and the power to carry that out.',
    month: 'November',
    monthSlug: 'november',
    principle: 'Spiritual Awareness',
    questions: [
      'What does my spiritual practice look like today?',
      'How do I distinguish between my will and a Higher Power&rsquo;s will?',
      'When have I felt most connected to something greater than myself?',
      'What forms of prayer or meditation have I tried? What works for me?',
      'How do I listen for guidance in my daily life?',
    ],
  },
  {
    number: 12,
    text: 'Having had a spiritual awakening as the result of these steps, we tried to carry this message to others, and to practice these principles in all our affairs.',
    month: 'December',
    monthSlug: 'december',
    principle: 'Service',
    questions: [
      'How has my life changed since beginning this journey?',
      'In what ways can I share what I&rsquo;ve learned without giving advice?',
      'What does it mean to practice these principles in <em>all</em> my affairs &mdash; not just at meetings?',
      'What does &ldquo;carrying the message&rdquo; look like for me?',
      'How do I continue growing when I feel like I&rsquo;ve &ldquo;done the work&rdquo;?',
    ],
  },
];

/**
 * Generate the Steps index page — overview of all 12 steps with links.
 */
export function renderStepsIndexPage() {
  const stepCards = STEPS.map(step => {
    return `
        <a href="/steps/step-${step.number}/" class="step-card">
          <span class="step-card-number">${step.number}</span>
          <div class="step-card-content">
            <h3 class="step-card-title">Step ${step.number}</h3>
            <p class="step-card-text">${step.text}</p>
            <span class="step-card-meta">${step.month} &middot; ${step.principle}</span>
          </div>
        </a>`;
  }).join('\n');

  const bodyContent = `
    <div class="content-page steps-index-page">
      <div class="content-container">
        <h1 class="page-title">The Twelve Steps</h1>
        <p class="page-description">
          The Twelve Steps of Al-Anon offer a path to personal recovery for anyone
          affected by someone else&rsquo;s drinking. Each step builds on the one
          before it, guiding us from powerlessness toward a spiritual awakening.
        </p>
        <p class="page-description">
          In Al-Anon Daily Paths, each month&rsquo;s readings focus on one step &mdash;
          Step 1 in January through Step 12 in December. Select a step below to
          explore it with questions for reflection.
        </p>

        <div class="step-card-list">
${stepCards}
        </div>

        <section class="content-section resources-section">
          <p class="step-attribution">
            The Twelve Steps are adapted from Alcoholics Anonymous and used by
            Al-Anon Family Groups. For the official Al-Anon perspective on the Steps,
            visit <a href="https://al-anon.org/for-members/the-legacies/the-twelve-steps/" target="_blank" rel="noopener noreferrer">al-anon.org</a>.
          </p>
        </section>
      </div>
    </div>`;

  return wrapInLayout({
    title: 'The 12 Steps of Al-Anon &mdash; Recovery Reflections & Questions | Al-Anon Daily Paths',
    description: 'Explore the Twelve Steps of Al-Anon with reflection questions for each step. Each month of Al-Anon Daily Paths readings focuses on one step.',
    canonicalPath: '/steps/',
    bodyContent,
    bodyClass: 'page-steps-index',
  });
}

/**
 * Generate an individual step page.
 *
 * @param {Object} step - Step data from STEPS array
 * @param {Array} monthReadings - Readings for this step's month
 */
export function renderStepPage(step, monthReadings) {
  const prevStep = STEPS[(step.number - 2 + 12) % 12];
  const nextStep = STEPS[step.number % 12];

  const questionItems = step.questions.map(q =>
    `            <li>${q}</li>`
  ).join('\n');

  // Show a few readings from this step's month as a preview
  const readingPreviews = monthReadings.slice(0, 5).map(r => {
    const slug = dayToSlug(r.day_of_year);
    return `            <li>
              <a href="/${slug}/">
                <span class="reading-preview-date">${r.display_date}</span>
                <span class="reading-preview-title">${r.title}</span>
              </a>
            </li>`;
  }).join('\n');

  const bodyContent = `
    <article class="content-page step-detail-page">
      <div class="content-container">
        <nav class="breadcrumb">
          <a href="/steps/">The Twelve Steps</a>
          <span class="breadcrumb-sep">/</span>
          <span>Step ${step.number}</span>
        </nav>

        <header class="step-detail-header">
          <span class="step-detail-number">Step ${step.number}</span>
          <h1 class="step-detail-title">${step.text}</h1>
          <p class="step-detail-meta">${step.month} &middot; ${step.principle}</p>
        </header>

        <section class="step-detail-questions">
          <h2>Questions for Reflection</h2>
          <p class="step-detail-intro">
            Take your time with these questions. There are no right answers &mdash;
            only honest ones. You may want to write your thoughts in a journal
            or share them with your sponsor or a trusted friend.
          </p>
          <ul class="step-questions">
${questionItems}
          </ul>
        </section>

        <section class="step-detail-readings">
          <h2>${step.month}&rsquo;s Readings on Step ${step.number}</h2>
          <p>
            All ${monthReadings.length} daily reflections in ${step.month} explore
            Step ${step.number} from different angles. Here are a few to get started:
          </p>
          <ul class="step-reading-list">
${readingPreviews}
          </ul>
          <p class="step-readings-link">
            <a href="/browse/#${step.monthSlug}">See all ${step.month} readings &rarr;</a>
          </p>
        </section>

        <nav class="step-nav-footer">
          <a href="/steps/step-${prevStep.number}/" class="nav-prev">
            <span class="nav-arrow">&larr;</span>
            <span class="nav-label">Step ${prevStep.number}</span>
          </a>
          <a href="/steps/" class="nav-browse">All Steps</a>
          <a href="/steps/step-${nextStep.number}/" class="nav-next">
            <span class="nav-label">Step ${nextStep.number}</span>
            <span class="nav-arrow">&rarr;</span>
          </a>
        </nav>
      </div>
    </article>`;

  return wrapInLayout({
    title: `Step ${step.number}: ${step.principle} &mdash; Al-Anon 12 Steps | Al-Anon Daily Paths`,
    description: `Explore Step ${step.number} of Al-Anon's Twelve Steps with reflection questions and daily readings for ${step.month}. Recovery guidance from Al-Anon Daily Paths.`,
    canonicalPath: `/steps/step-${step.number}/`,
    bodyContent,
    bodyClass: 'page-step-detail',
  });
}
