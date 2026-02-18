import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';

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
    principle: 'Brotherly Love',
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
    principle: 'Justice',
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
    principle: 'Perseverance',
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
    principle: 'Spiritual Awareness',
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
 * Generate the Steps index page — overview of all 12 steps with links.
 */
export function renderStepsIndexPage() {
  const stepCards = STEPS.map(step => {
    return `
        <a href="${bp(`/steps/step-${step.number}/`)}" class="step-card">
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
        <div class="topic-detail-image">
          <img src="${bp('/assets/themes/steps.jpg')}" alt="The Twelve Steps" />
        </div>
        <p class="page-description">
          The Twelve Steps of Al-Anon offer a path to personal recovery for anyone
          affected by someone else&rsquo;s drinking. Each step builds on the one
          before it, guiding us from powerlessness toward a spiritual awakening.
          Working these steps with a sponsor or someone who has walked the path
          before you can make all the difference &mdash; their experience and
          encouragement help bring the steps to life.
        </p>
        <p class="page-description">
          Al-Anon&rsquo;s
          <a href="https://ecomm.al-anon.org/EN/ItemDetail?iProductCode=B24" target="_blank" rel="noopener noreferrer"><em>Paths to Recovery</em></a>
          is the definitive guide to working the Steps, Traditions, and Concepts
          of Service &mdash; and the inspiration behind the daily readings on this
          site. Each month&rsquo;s reflections focus on one step, from Step 1 in
          January through Step 12 in December. Select a step below to explore it
          with questions for reflection.
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
 */
export function renderStepPage(step) {
  const prevStep = STEPS[(step.number - 2 + 12) % 12];
  const nextStep = STEPS[step.number % 12];

  const descriptionHtml = step.description
    ? step.description.map(p => `          <p>${p}</p>`).join('\n')
    : '';

  const questionItems = step.questions.map(q =>
    `            <li>${q}</li>`
  ).join('\n');

  const bodyContent = `
    <article class="content-page step-detail-page">
      <div class="content-container">
        <nav class="breadcrumb">
          <a href="${bp('/steps/')}">The Twelve Steps</a>
          <span class="breadcrumb-sep">/</span>
          <span>Step ${step.number}</span>
        </nav>

        <header class="step-detail-header">
          <span class="step-detail-number">Step ${step.number}</span>
          <h1 class="step-detail-title">${step.text}</h1>
          <p class="step-detail-meta">${step.month} &middot; ${step.principle}</p>
        </header>
${descriptionHtml ? `
        <section class="step-detail-description">
${descriptionHtml}
        </section>
` : ''}
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

        <nav class="step-nav-footer">
          <a href="${bp(`/steps/step-${prevStep.number}/`)}" class="nav-prev">
            <span class="nav-arrow">&larr;</span>
            <span class="nav-label">Step ${prevStep.number}</span>
          </a>
          <a href="${bp('/steps/')}" class="nav-browse">All Steps</a>
          <a href="${bp(`/steps/step-${nextStep.number}/`)}" class="nav-next">
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
