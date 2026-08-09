import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';
import { readingSlug, stepSlug, MONTHS, DAYS_IN_MONTH } from '../helpers/slug-utils.mjs';
import { markdownToHtml } from '../helpers/markdown.mjs';
import {
  photoHero, quoteBlock, detailRail, appPanel, readingCard, icon, ripple, storeBadges,
} from './ui.mjs';

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
    description: [
      'This Step challenges members to accept the reality of alcoholism as a disease, often summarized by the &ldquo;Three Cs&rdquo;: we didn&rsquo;t cause it, we can&rsquo;t control it, and we can&rsquo;t cure it. It means acknowledging that no amount of force, manipulation, or love can conquer another person&rsquo;s drinking.',
      'For the Al-Anon member, taking this Step brings immense relief and hope. By surrendering the futile battle against the alcoholic&rsquo;s behavior, members are free to redirect their energy toward their own well-being and spiritual growth. It shifts the focus from trying to fix others to healing oneself.',
      'The primary spiritual principle of Step One is honesty. It requires the honesty to admit that one&rsquo;s life has become chaotic and that self-will is insufficient to solve the problem. Acceptance and humility are also key, as members accept their limitations. This Step is critically important because it lays the foundation for recovery; only by admitting powerlessness can one open the door to the help and sanity offered by the subsequent Steps.',
    ],
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
    description: [
      'This Step challenges members to recognize that their past efforts to manage the disease of alcoholism&mdash;often characterized by the &ldquo;insanity&rdquo; of repeating the same failing actions while expecting different results&mdash;were futile. It means acknowledging that a source of help exists beyond one&rsquo;s own limited resources.',
      'For the Al-Anon member, this Step provides a much-needed lifeline out of isolation and despair. After admitting complete powerlessness in Step One, members are invited to open their minds to the possibility that a loving, nurturing Higher Power can bring peace and serenity into their lives. It means they no longer have to struggle alone and can begin to replace a distorted, fear-based view of life with clarity, balance, and self-acceptance.',
      'The primary spiritual principles of Step Two are hope and open-mindedness. It asks members to be willing to believe that help is possible, even if they do not yet fully understand it. Step Two is critically important because it offers the essential ingredient for recovery: hope. It bridges the gap between acknowledging defeat and taking constructive action, proving that sanity and serenity are attainable.',
    ],
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
    description: [
      'This Step means making a conscious commitment to stop relying entirely on self-will and to stop trying to force solutions on people and situations that are uncontrollable. Instead, it asks members to place their concerns, fears, and daily lives into the care of a Higher Power.',
      'For the Al-Anon member, taking this Step is the ultimate practice of the slogan &ldquo;Let Go and Let God&rdquo;. It brings enormous relief by lifting the heavy burden of responsibility for the alcoholic&mdash;and for the universe&mdash;off their shoulders. It means transitioning from an exhausting attitude of rigid control and self-sufficiency into a receptive, trusting partnership with a Higher Power.',
      'The core spiritual principles of Step Three are faith, trust, and surrender. It requires the faith to trust that we will be cared for, even when we let go of the reins. This Step is vitally important because it allows the member to relinquish their anxiety and actively seek spiritual guidance, creating the foundation necessary for all the recovery and growth Steps that follow.',
    ],
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
    description: [
      'This Step challenges members to take an honest, balanced look at their personal traits, behaviors, and the assumptions that shape their lives. It means looking inward to carefully catalog both character defects&mdash;such as a need for control, people-pleasing, or fear&mdash;and positive assets.',
      'For the Al-Anon member, this Step is a vital journey of self-discovery. It means shifting the focus away from the alcoholic&rsquo;s behavior and recognizing how the family disease of alcoholism has affected their own actions and self-esteem. By breaking through denial and taking stock of their own reality, members learn they no longer have to play the role of the victim.',
      'The core spiritual principles of Step Four are courage, honesty, and self-love. It requires the courage to face hidden fears without self-condemnation and the honesty to stop justifying self-destructive behaviors. This Step is critically important because it clears away illusions and lays the groundwork for profound positive change. By knowing exactly who they are, members can begin to build a new life based on reality and self-respect.',
      'Al-Anon&rsquo;s <a href="https://ecomm.al-anon.org/ItemDetail?iProductCode=P91&amp;WebsiteKey=db6e68f1-b2fe-4aaa-baea-928d4e696dcc" target="_blank" rel="noopener noreferrer"><em>Blueprint for Progress</em></a> is a workbook designed specifically to guide members through the Fourth Step inventory.',
    ],
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
    description: [
      'This Step invites members to break their isolation by sharing the insights gained in Step Four. It means bringing secrets and shame into the open, fully acknowledging them before a Higher Power, oneself, and a trusted confidant, such as an Al-Anon sponsor.',
      'For the Al-Anon member, this Step is immensely liberating. Instead of hiding behind walls of fear and assuming they are uniquely flawed or &ldquo;the worst person in the world,&rdquo; members discover that they are unconditionally loved and accepted, even with their imperfections. It means they can finally stop rationalizing their past behavior and take responsibility for their own lives.',
      'The primary spiritual principles of Step Five are trust, honesty, and courage. It requires immense trust to reveal one&rsquo;s darkest secrets to another person. This Step is vitally important because it relieves the heavy, suffocating burden of guilt and self-hatred. By sharing their humanity, members stop being victims of their past and take a huge stride toward personal freedom and a deeper spiritual connection.',
    ],
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
    description: [
      'This Step involves acknowledging the negative traits identified in our previous inventories and actively preparing to let them go. It means accepting that we are entirely powerless to remove these deeply ingrained shortcomings by our own self-will alone, and we must instead rely completely on the care of a Higher Power.',
      'For the Al-Anon member, working this Step often requires a grieving process. Many of our character defects, such as an intense need for control or a tendency toward denial, were originally developed as essential survival skills to help us cope with the chaos of an alcoholic environment. Members learn to stop fighting, relinquish the temporary &ldquo;payoffs&rdquo; of these defects, and become fully willing to change.',
      'The core spiritual principles of Step Six are willingness, readiness, and trust. This Step is critically important because it bridges the crucial gap between mere self-awareness and actual transformation. It gracefully shifts the member from holding onto comfortable but destructive habits to embracing the limitless possibilities of profound healing. By consciously doing exactly this, we deliberately clear the path toward a much healthier, more serene, and truly fulfilling life.',
    ],
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
    description: [
      'This Step is a direct appeal to a Higher Power for help, acting boldly on the readiness cultivated in Step Six. It means calmly asking God to take away the flaws that continually hinder our serenity, without begging, making demands, or dictating exactly how it should be done.',
      'For the Al-Anon member, it represents a deep shift from relying on self-will to building a peaceful, trusting partnership with spiritual assistance. In Al-Anon, true humility is never humiliation or weakness; it is a state of genuine strength where one gracefully accepts their true relationship to God and openly recognizes their own limitations with profound self-acceptance.',
      'The guiding spiritual principles of this Step are humility, faith, and self-acceptance. This Step is vitally important because it actively puts our acceptance into immediate action. It fully empowers the member to carefully cooperate with their Higher Power to diligently find positive alternatives for old, self-destructive behaviors. By letting go of our shortcomings, we finally make enough room for continuous spiritual growth, leading us toward living a much more balanced, deeply meaningful, and wonderfully serene life.',
    ],
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
    principle: 'Responsibility',
    description: [
      'This Step involves truly reviewing our past to identify people negatively impacted by our actions and actively cultivating the sincere desire to make things right. It means setting aside personal justification and taking absolute responsibility for our behavior, regardless of what others may have done to us.',
      'For the Al-Anon member, this Step often reveals the surprising truth that we have harmed ourselves most of all through neglect or desperate survival efforts, meaning our own name must go at the very top of the list. At this stage, we are not required to take immediate action; we only need to become fully willing.',
      'The core spiritual principles of Step Eight are willingness, honesty, responsibility, and love. This Step is extremely important because it thoroughly prepares our hearts for deep healing. By simply becoming completely willing to make amends, we deliberately unlock the heavy door to our painful past, gracefully release the toxic weight of lingering resentment, and carefully build the tremendous spiritual strength necessary to move forward freely into a much brighter future.',
    ],
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
    principle: 'Repair',
    description: [
      'This is a crucial action Step where we take concrete measures to right the wrongs identified in our Step Eight list. It means bravely stepping forward to apologize, make restitution, or fundamentally alter our behavior, while using careful judgment to ensure our actions do not cause further harm.',
      'For the Al-Anon member, this Step is a profound commitment to justice, healing, and maturity. It shifts us from merely feeling guilty to actively cleaning up the debris of the past. Members learn that an amend is often different from a simple apology; sometimes the greatest amend we can make to our loved ones and to ourselves is a lasting change in our attitude and behavior.',
      'The primary spiritual principles of Step Nine are courage, humility, prudence, and justice. This Step is vitally important because it provides immense relief from the suffocating weight of guilt that has heavily burdened us. It completely restores our self-respect, beautifully heals damaged relationships, and finally sets us free to live a rewarding, joyous, and profoundly peaceful life in the reality of the present moment.',
    ],
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
    principle: 'Growth',
    description: [
      'This Step transitions the Al-Anon member from the deep clearing of past wreckage into the daily maintenance of continuous spiritual growth. It means consistently applying the self-awareness gained earlier to our everyday lives by taking regular &ldquo;spot checks&rdquo; or daily reviews of our thoughts and actions.',
      'For the Al-Anon member, this practice is essential to avoid slipping back into old, self-destructive survival patterns like controlling, people-pleasing, or reacting to the alcoholic&rsquo;s unpredictable behavior. By promptly admitting our mistakes, we prevent a new buildup of crippling guilt and resentment. Crucially, this Step also requires us to acknowledge our positive choices and successes, teaching us to love our humanness rather than demand perfection.',
      'The guiding spiritual principles are self-honesty, continuous responsibility, compassion, and forgiveness. Step Ten is vitally important because it keeps our emotional and spiritual slate completely clean. It allows us to continuously resolve inner conflicts in real-time, preventing the heavy accumulation of emotional baggage and ensuring we maintain the profound serenity and balanced relationships we have worked so hard to achieve.',
    ],
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
    principle: 'Connection',
    description: [
      'This Step invites us to consciously maintain and actively deepen the intimate partnership with our Higher Power. It means establishing a disciplined spiritual practice where prayer is the act of talking to God, and meditation is the quiet discipline of listening for His guidance.',
      'For the Al-Anon member, this represents a profound surrender of self-will. We completely stop using frantic prayers to bargain with God or beg Him to cure the alcoholic&rsquo;s disease. Instead, we relinquish our personal agendas and simply ask for the clarity to know our path and the strength to walk it.',
      'The core spiritual principles are faith, profound surrender, trust, and spiritual awareness. Step Eleven is crucially important because it ensures we are never alone, isolated, or wandering aimlessly. By continually aligning our actions with a loving Higher Power, we tap into an unlimited source of daily strength and comfort, allowing us to navigate life&rsquo;s challenges with immense peace and live a deeply gratifying, unburdened life.',
    ],
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
    description: [
      'This final Step asks us to recognize the profound, life-changing transformation in perception we have experienced and to freely share the Al-Anon message with those who are still suffering. It means stepping out of isolation to engage in service&mdash;whether by sponsoring a newcomer, answering phones, or simply listening&mdash;without trying to give advice or manage anyone else&rsquo;s recovery.',
      'For the Al-Anon member, this Step is the beautiful culmination of the journey from crippling fear to connection and purpose. We learn the spiritual paradox that in order to keep the miraculous gift of our recovery, we must actively give it away to others.',
      'The core spiritual principles of this Step are unconditional love, selfless service, and immense gratitude. Step Twelve is vitally important because it permanently solidifies our healing. By consciously practicing these universal principles in all our affairs&mdash;with our family, our coworkers, and our community&mdash;we prove that the Twelve Steps are not just a survival tool, but a remarkably rewarding, permanent new way of life.',
    ],
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
 * Generate the Steps index page — all twelve Steps as cards.
 */
export function renderStepsIndexPage() {
  const gridCards = STEPS.map(step => `
          <a href="${bp(`/steps/${stepSlug(step.number, step.principle)}/`)}" class="card-elevated step-card">
            <span class="step-card-numeral">${step.number}</span>
            <span>
              <span class="step-card-keyword">${step.principle}</span>
              <span class="step-card-hook">${STEP_HOOKS[step.number] || ''}</span>
              <span class="step-card-cta">Read the Step &rarr;</span>
            </span>
          </a>`).join('');

  const bodyContent = `
${photoHero({
    image: bp('/assets/themes/steps-hub-hero.jpg'),
    alt: 'Coastal path at first light — the Twelve Steps of Al-Anon recovery',
    title: 'The Twelve Steps',
    subtitle: 'A framework for personal freedom',
    size: 'sm',
  })}

    <section class="wrap section--md">
      <div class="step-card-grid step-card-grid--index">${gridCards}
      </div>
    </section>

    <div class="wrap section--md" id="get-the-app">
      ${appPanel({
        tone: 'white',
        heading: 'Take your Step work further.',
        text: 'The app isn&rsquo;t just for reading &mdash; use the built-in journaling tools to record your progress through the Steps and Traditions, all in one private place.',
        context: 'steps',
      })}
      <p class="fine-print">The Twelve Steps are adapted from Alcoholics Anonymous and used by Al-Anon Family Groups. For the official Al-Anon perspective on the Steps, visit <a href="https://al-anon.org/for-members/the-legacies/the-twelve-steps/" target="_blank" rel="noopener noreferrer">al-anon.org</a>.</p>
    </div>`;

  return wrapInLayout({
    title: 'The 12 Steps of Al-Anon — Recovery Reflections & Questions | Al-Anon Daily Paths',
    description: 'Explore the Twelve Steps of Al-Anon with reflection questions for each step. Each month of Al-Anon Daily Paths readings focuses on one step.',
    canonicalPath: '/steps/',
    bodyContent,
    bodyClass: 'page-steps-index',
    navSection: 'steps',
    hasAppPanel: true,
  });
}


/** Step tools — practical actions for working each step */
export const STEP_TOOLS = {
  1: ['Write a "powerlessness list"', 'Identify your Three Cs', 'Share with your sponsor', 'Attend a Step 1 meeting'],
  2: ['Define your Higher Power', 'List moments of clarity', 'Read the promises', 'Talk to a longtime member'],
  3: ['Practice "Let Go and Let God"', 'Write a surrender prayer', 'Identify control patterns', 'Try a trust exercise'],
  4: ['Use Blueprint for Progress', 'Write your inventory', 'List assets and liabilities', 'Set aside daily quiet time'],
  5: ['Choose a trusted listener', 'Schedule your Fifth Step', 'Practice honesty daily', 'Journal your feelings'],
  6: ['List character defects', 'Identify payoffs of defects', 'Practice willingness', 'Pray for readiness'],
  7: ['Write a Seventh Step prayer', 'Practice humility daily', 'Accept imperfection', 'Ask for help openly'],
  8: ['Write your amends list', 'Put yourself on the list', 'Separate harm from resentment', 'Discuss with your sponsor'],
  9: ['Plan each amend carefully', 'Practice living amends', 'Make direct amends', 'Forgive without expecting'],
  10: ['Do a nightly review', 'Practice spot-check inventory', 'Admit mistakes promptly', 'Celebrate your growth'],
  11: ['Establish a prayer routine', 'Try meditation', 'Practice listening', 'Read spiritual literature'],
  12: ['Sponsor a newcomer', 'Share your story', 'Do service work', 'Practice principles daily'],
};

/** Pull-quotes — one sentence pulled from each step's description for the sidebar */
export const PULL_QUOTES = {
  1: 'Only by admitting powerlessness can one open the door to the help and sanity offered by the subsequent Steps.',
  2: 'Step Two offers the essential ingredient for recovery: hope.',
  3: 'It brings enormous relief by lifting the heavy burden of responsibility off their shoulders.',
  4: 'By knowing exactly who they are, members can begin to build a new life based on reality and self-respect.',
  5: 'Members discover that they are unconditionally loved and accepted, even with their imperfections.',
  6: 'It bridges the crucial gap between mere self-awareness and actual transformation.',
  7: 'True humility is never humiliation or weakness; it is a state of genuine strength.',
  8: 'By simply becoming completely willing to make amends, we unlock the heavy door to our painful past.',
  9: 'Sometimes the greatest amend we can make is a lasting change in our attitude and behavior.',
  10: 'This Step also requires us to acknowledge our positive choices and successes.',
  11: 'We relinquish our personal agendas and simply ask for the clarity to know our path.',
  12: 'In order to keep the miraculous gift of our recovery, we must actively give it away to others.',
};

/** Step hooks — one-sentence teasers for the Steps index grid cards */
export const STEP_HOOKS = {
  1: 'Admitting powerlessness to reclaim your life.',
  2: 'Finding a path toward a restored perspective.',
  3: 'The decision to release the burden of control.',
  4: 'A fearless look into the mirror of the soul.',
  5: 'The healing power of radical honesty.',
  6: 'Preparing the heart for lasting change.',
  7: 'The humble request for a new way of being.',
  8: 'Mapping the journey toward reconciliation.',
  9: 'The courage to make things right.',
  10: 'The daily practice of self-awareness.',
  11: 'Seeking conscious contact through stillness.',
  12: 'Carrying the message; living the principles.',
};

/** Step taglines — hero banner taglines for each step detail page */
export const STEP_TAGLINES = {
  1: 'Honesty & the Power of Surrender',
  2: 'Hope & the Willingness to Believe',
  3: 'Faith & the Freedom of Letting Go',
  4: 'Courage & the Mirror of Self-Discovery',
  5: 'Integrity & the Liberation of Truth',
  6: 'Willingness & the Readiness to Change',
  7: 'Humility & the Strength of Asking',
  8: 'Responsibility & the Path to Reconciliation',
  9: 'Repair & the Courage to Make Amends',
  10: 'Growth & the Practice of Awareness',
  11: 'Connection & the Discipline of Listening',
  12: 'Service & the Gift of Giving Back',
};

/* All steps share the steps_hero.jpg image with a blurred/navy treatment */

/** Convert step number to word for hero display */
const NUMBER_WORDS = ['One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve'];
function wordNumber(n) { return NUMBER_WORDS[n - 1] || String(n); }

/**
 * Get the range of day_of_year values for a given month index (0-based).
 */
function getMonthDayRange(monthIndex) {
  let startDay = 1;
  for (let m = 0; m < monthIndex; m++) {
    startDay += DAYS_IN_MONTH[m];
  }
  return { start: startDay, end: startDay + DAYS_IN_MONTH[monthIndex] - 1 };
}

/**
 * Generate an individual step page.
 *
 * Step rail, photo hero, then an 820px column: the Step text in a teal-edged
 * quote panel, the body sections, Questions for Reflection, Step N in Action.
 * The daily-practice reading grid and the app CTA sit in the wider column.
 *
 * @param {Object} step - Step data from STEPS array
 * @param {Array} [readings] - All 366 readings (for the daily practice grid)
 */
export function renderStepPage(step, readings = []) {
  const prevStep = STEPS[(step.number - 2 + 12) % 12];
  const nextStep = STEPS[step.number % 12];

  const tools = STEP_TOOLS[step.number] || [];
  const tagline = STEP_TAGLINES[step.number] || `The Principle of ${step.principle}`;
  const stepWord = wordNumber(step.number);

  // Body sections. A description paragraph that is entirely bold is a section
  // heading in the source data — the design sets those as Cormorant H2s over
  // the Lora paragraphs that follow, so promote them rather than emitting a
  // bold paragraph. "Let Go and Let God" links through to Essentials.
  const sections = [];
  for (const paragraph of step.description || []) {
    const linked = paragraph.replace(
      /Let Go and Let God/g,
      `<a href="${bp('/essentials/#let-go')}">Let Go and Let God</a>`
    );
    const headingMatch = linked.match(/^\s*\*\*(.+?)\*\*\s*$/);
    if (headingMatch) {
      sections.push({ heading: headingMatch[1], paragraphs: [] });
    } else {
      if (sections.length === 0) sections.push({ heading: null, paragraphs: [] });
      sections[sections.length - 1].paragraphs.push(linked);
    }
  }

  const bodySections = sections.map(section => {
    const heading = section.heading
      ? `<h2 class="step-body-heading">${markdownToHtml(section.heading)}</h2>`
      : '';
    const paras = section.paragraphs.map(p => `<p>${markdownToHtml(p)}</p>`).join('\n            ');
    return `          <div class="step-body-section">${heading}
            ${paras}
          </div>`;
  }).join('\n');

  const questionItems = (step.questions || []).map(q => `
              <li>
                ${icon('feather', { size: 18 })}
                <span class="questions-text">${markdownToHtml(q)}</span>
              </li>`).join('');

  // Theme URL mapping — links each step to its primary principle page
  const STEP_THEME_URLS = {
    1:  { slug: 'powerlessness',        name: 'Powerlessness &amp; Surrender' },
    2:  { slug: 'higher-power',         name: 'Trusting a Higher Power' },
    3:  { slug: 'letting-go-of-control', name: 'Letting Go of Control' },
    4:  { slug: 'honesty',              name: 'Honesty &amp; Self-Awareness' },
    5:  { slug: 'self-worth',           name: 'Self-Worth &amp; Identity' },
    6:  { slug: 'boundaries',           name: 'Boundaries' },
    7:  { slug: 'detachment',           name: 'Detachment with Love' },
    8:  { slug: 'the-disease',          name: 'Understanding the Disease' },
    9:  { slug: 'focus-on-yourself',    name: 'Focus on Yourself' },
    10: { slug: 'one-day-at-a-time',    name: 'One Day at a Time' },
    11: { slug: 'gratitude-and-hope',   name: 'Gratitude &amp; Hope' },
    12: { slug: 'fellowship',           name: 'Community &amp; Fellowship' },
  };
  const themeInfo = STEP_THEME_URLS[step.number];

  const toolItems = [
    `<li><a href="#step-readings">View all ${step.month} reflections on Step ${step.number}</a></li>`,
    ...tools.map(t => `<li><span>${t}</span></li>`),
  ].map(li => `              ${li}`).join('\n');

  // Readings tagged to this Step across the year
  const stepTag = `Step ${step.number}`;
  const associatedReadings = readings.filter(r => r.step_theme === stepTag);

  let dailyPracticeHtml = '';
  if (associatedReadings.length > 0) {
    const cards = associatedReadings.map(r => readingCard({
      href: bp(`/${readingSlug(r.day_of_year, r.title)}/`),
      date: r.display_date,
      title: r.title,
    })).join('\n');

    dailyPracticeHtml = `
    <section class="wrap section--lg" id="step-readings">
      <p class="eyebrow">Daily practice</p>
      <h2 class="daily-practice-heading">Step ${step.number} in ${step.month}</h2>
      <p class="daily-practice-intro">Each month in the app focuses on one Step. ${step.month} is dedicated to the principle of ${step.principle}. ${associatedReadings.length} reading${associatedReadings.length === 1 ? '' : 's'} across the year explore it &mdash; deep dive through the <a href="${bp(`/themes/${themeInfo.slug}/`)}">${themeInfo.name}</a> theme.</p>
      <div class="reading-grid daily-practice-grid">
${cards}
      </div>
    </section>`;
  }

  const bodyContent = `
${detailRail({
    prevHref: bp(`/steps/${stepSlug(prevStep.number, prevStep.principle)}/`),
    prevLabel: `Step ${prevStep.number}: ${prevStep.principle}`,
    allHref: bp('/steps/'),
    allLabel: 'All Steps',
    nextHref: bp(`/steps/${stepSlug(nextStep.number, nextStep.principle)}/`),
    nextLabel: `Step ${nextStep.number}: ${nextStep.principle}`,
  })}

${photoHero({
    image: bp('/assets/themes/steps-hub-hero.jpg'),
    alt: `Coastal path at first light — Step ${step.number} of Al-Anon: ${step.principle}`,
    eyebrow: tagline,
    title: `Step ${stepWord}`,
    size: 'lg',
    titleClass: 'photo-hero-title--step',
  })}

    <article class="rd-article">
      <div class="quote-panel">
        ${quoteBlock({ text: step.text, attribution: `Step ${stepWord}` })}
      </div>

${bodySections}

      ${step.questions && step.questions.length > 0 ? `<div class="panel-outlined questions-card">
        <h2 class="questions-heading">Questions for Reflection</h2>
        <p class="questions-intro">Take your time with these. There are no right answers &mdash; only honest ones.</p>
        <ul class="questions-list">${questionItems}
        </ul>
      </div>` : ''}

      ${tools.length > 0 ? `<div class="panel-seafoam action-panel">
        <h2 class="action-panel-heading">Step ${step.number} in Action</h2>
        <ul class="action-list">
${toolItems}
        </ul>
        <p class="action-panel-resource">Go deeper with Al-Anon&rsquo;s <a href="https://ecomm.al-anon.org/EN/ItemDetail?iProductCode=B24" target="_blank" rel="noopener noreferrer"><em>Paths to Recovery</em></a>.</p>
      </div>` : ''}
    </article>
${dailyPracticeHtml}

    <div class="wrap section--md" id="get-the-app">
      <div class="panel-gradient">
        ${ripple(520)}
        <div class="app-panel-inner">
          <div class="app-panel-text">
            <h2 class="app-panel-heading">Deepen your work on Step ${step.number}.</h2>
            <p class="app-panel-body">The journaling tools help you process Step ${step.number} in real time &mdash; track your insights and get a daily reminder.</p>
          </div>
          <div class="app-panel-actions">
            ${storeBadges({ context: 'step' })}
          </div>
        </div>
      </div>
    </div>`;

  return wrapInLayout({
    title: `Step ${step.number}: ${step.principle} — Al-Anon 12 Steps | Al-Anon Daily Paths`,
    description: `Explore Step ${step.number} of Al-Anon's Twelve Steps with reflection questions and daily readings for ${step.month}. Recovery guidance from Al-Anon Daily Paths.`,
    canonicalPath: `/steps/${stepSlug(step.number, step.principle)}/`,
    bodyContent,
    bodyClass: 'page-step-detail',
    navSection: 'steps',
    hasAppPanel: true,
  });
}
