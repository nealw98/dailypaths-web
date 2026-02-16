import { wrapInLayout } from './base.mjs';

/**
 * Generate the Twelve Steps page.
 *
 * Each step links to its corresponding month of readings (Step 1 = January, etc.)
 * The readings array is used to count how many readings exist per step month.
 *
 * @param {Array} readings - All 366 readings (used to link to step months)
 */
export function renderStepsPage(readings) {
  const steps = [
    {
      number: 1,
      text: 'We admitted we were powerless over alcohol &mdash; that our lives had become unmanageable.',
      month: 'January',
      monthSlug: 'january',
      questions: [
        'In what ways have I tried to control another person&rsquo;s drinking or behavior?',
        'What has happened in my life that feels unmanageable?',
        'Can I accept that I am powerless over alcohol and other people&rsquo;s choices?',
      ],
    },
    {
      number: 2,
      text: 'Came to believe that a Power greater than ourselves could restore us to sanity.',
      month: 'February',
      monthSlug: 'february',
      questions: [
        'What does &ldquo;sanity&rdquo; look like in my daily life?',
        'Have I ever experienced a moment of clarity or peace that felt larger than myself?',
        'What stands in the way of my willingness to believe in something greater?',
      ],
    },
    {
      number: 3,
      text: 'Made a decision to turn our will and our lives over to the care of God <em>as we understood Him</em>.',
      month: 'March',
      monthSlug: 'march',
      questions: [
        'What does &ldquo;letting go&rdquo; mean to me in practical terms?',
        'In what areas of my life am I still trying to be in charge of outcomes?',
        'How might my life change if I trusted a Higher Power with my worries?',
      ],
    },
    {
      number: 4,
      text: 'Made a searching and fearless moral inventory of ourselves.',
      month: 'April',
      monthSlug: 'april',
      questions: [
        'What character traits have helped me survive difficult situations?',
        'What patterns in my behavior have caused harm to myself or others?',
        'Am I willing to look honestly at both my strengths and my shortcomings?',
      ],
    },
    {
      number: 5,
      text: 'Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.',
      month: 'May',
      monthSlug: 'may',
      questions: [
        'What have I been afraid to say out loud?',
        'Is there someone I trust enough to share my inventory with honestly?',
        'How does keeping secrets affect my peace of mind?',
      ],
    },
    {
      number: 6,
      text: 'Were entirely ready to have God remove all these defects of character.',
      month: 'June',
      monthSlug: 'june',
      questions: [
        'Which of my character defects am I most reluctant to give up? Why?',
        'How have my defects served me in the past, and what do they cost me now?',
        'What does &ldquo;entirely ready&rdquo; mean &mdash; and am I there yet?',
      ],
    },
    {
      number: 7,
      text: 'Humbly asked Him to remove our shortcomings.',
      month: 'July',
      monthSlug: 'july',
      questions: [
        'What does humility mean to me?',
        'Can I ask for help without feeling weak or ashamed?',
        'How is asking God to remove my shortcomings different from trying to fix myself?',
      ],
    },
    {
      number: 8,
      text: 'Made a list of all persons we had harmed, and became willing to make amends to them all.',
      month: 'August',
      monthSlug: 'august',
      questions: [
        'Who have I harmed through my reactions to someone else&rsquo;s drinking?',
        'Am I on my own list of people I&rsquo;ve harmed?',
        'What is the difference between willingness and action in this step?',
      ],
    },
    {
      number: 9,
      text: 'Made direct amends to such people wherever possible, except when to do so would injure them or others.',
      month: 'September',
      monthSlug: 'september',
      questions: [
        'Which amends feel most urgent? Which feel most frightening?',
        'How do I know when making amends would cause more harm than good?',
        'What does &ldquo;living amends&rdquo; look like in my daily behavior?',
      ],
    },
    {
      number: 10,
      text: 'Continued to take personal inventory and when we were wrong promptly admitted it.',
      month: 'October',
      monthSlug: 'october',
      questions: [
        'Do I regularly check in with myself about my motives and behavior?',
        'How quickly am I able to admit when I&rsquo;m wrong?',
        'What does a daily inventory look like for me?',
      ],
    },
    {
      number: 11,
      text: 'Sought through prayer and meditation to improve our conscious contact with God <em>as we understood Him</em>, praying only for knowledge of His will for us and the power to carry that out.',
      month: 'November',
      monthSlug: 'november',
      questions: [
        'What does my spiritual practice look like today?',
        'How do I distinguish between my will and a Higher Power&rsquo;s will?',
        'When have I felt most connected to something greater than myself?',
      ],
    },
    {
      number: 12,
      text: 'Having had a spiritual awakening as the result of these steps, we tried to carry this message to others, and to practice these principles in all our affairs.',
      month: 'December',
      monthSlug: 'december',
      questions: [
        'How has my life changed since beginning this journey?',
        'In what ways can I share what I&rsquo;ve learned without giving advice?',
        'What does it mean to practice these principles in <em>all</em> my affairs &mdash; not just at meetings?',
      ],
    },
  ];

  const stepSections = steps.map(step => {
    const questionItems = step.questions.map(q =>
      `              <li>${q}</li>`
    ).join('\n');

    return `
        <section class="step-section" id="step-${step.number}">
          <div class="step-header">
            <span class="step-number">Step ${step.number}</span>
            <p class="step-text">${step.text}</p>
          </div>
          <div class="step-body">
            <h3 class="step-questions-heading">Questions for Reflection</h3>
            <ul class="step-questions">
${questionItems}
            </ul>
            <p class="step-readings-link">
              <a href="/browse/#${step.monthSlug}">Read ${step.month}&rsquo;s reflections on Step ${step.number} &rarr;</a>
            </p>
          </div>
        </section>`;
  }).join('\n');

  const bodyContent = `
    <div class="content-page steps-page">
      <div class="content-container">
        <h1 class="page-title">The Twelve Steps</h1>
        <p class="page-description">
          The Twelve Steps of Al-Anon offer a path to personal recovery for anyone
          affected by someone else&rsquo;s drinking. Each step builds on the one
          before it, guiding us from powerlessness toward a spiritual awakening.
        </p>
        <p class="page-description">
          In Al-Anon Daily Paths, each month&rsquo;s readings focus on one step &mdash;
          Step 1 in January through Step 12 in December. Below you&rsquo;ll find each step
          with questions to guide your reflection.
        </p>

        <nav class="step-nav" aria-label="Jump to step">
          ${steps.map(s => `<a href="#step-${s.number}" class="step-jump">${s.number}</a>`).join('\n          ')}
        </nav>

${stepSections}

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
    bodyClass: 'page-steps',
  });
}
