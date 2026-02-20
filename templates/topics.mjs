import { wrapInLayout } from './base.mjs';
import { dayToSlug } from '../helpers/slug-utils.mjs';
import { bp } from '../helpers/config.mjs';

/**
 * Map each topic slug to the secondary_theme values that belong to it.
 * Readings whose secondary_theme matches any of these tags will appear
 * on the topic page automatically, alongside the curated featuredDays.
 */
const TOPIC_THEME_TAGS = {
  'detachment':            ['Detachment', 'Release', 'Relinquishment', 'Freedom'],
  'powerlessness':         ['Powerlessness', 'Surrender', 'Acceptance', 'Relief'],
  'focus-on-yourself':     ['Self-Care', 'Self-care', 'Self-focus', 'Self-love', 'Self-Acceptance', 'Self-acceptance', 'Redirection', 'Focus'],
  'one-day-at-a-time':     ['Presence', 'Patience', 'Simplicity', 'Peace', 'Serenity'],
  'boundaries':            ['Boundaries', 'Respect', 'Independence', 'Self-Discipline'],
  'letting-go-of-control': ['Control', 'Flexibility', 'Willingness', 'Self-will'],
  'self-worth':            ['Self-worth', 'Self-esteem', 'Self-compassion', 'Identity', 'Self-forgiveness'],
  'higher-power':          ['Faith', 'Trust', 'Prayer', 'Spiritual Connection', 'Spiritual intimacy', 'Reliance', 'Spirit'],
  'honesty':               ['Honesty', 'Truth', 'Self-awareness', 'Awareness', 'Integrity', 'Clarity'],
  'gratitude-and-hope':    ['Gratitude', 'Hope', 'Miracles', 'Vision'],
  'the-disease':           ['Understanding', 'Compassion', 'Reality', 'Sanity'],
  'fellowship':            ['Fellowship', 'Connection', 'Community', 'Belonging', 'Unity', 'Sponsorship', 'Inclusion'],
};

/** Pull-quotes for each topic — one line that captures the spirit */
const TOPIC_PULL_QUOTES = {
  'detachment':            'Detachment is what makes it possible to stay in the room without being destroyed by what\u2019s happening in it.',
  'powerlessness':         'Surrender isn\u2019t giving up \u2014 it\u2019s giving over.',
  'focus-on-yourself':     'Focusing on ourselves is the most radical \u2014 and most difficult \u2014 shift in recovery.',
  'one-day-at-a-time':     'Handle just today, and trust that tomorrow will take care of itself.',
  'boundaries':            'Boundaries aren\u2019t walls. They\u2019re the foundation that makes real love possible.',
  'letting-go-of-control': 'The need to control is the disease talking through us.',
  'self-worth':            'Recovery is, in part, an excavation \u2014 digging out the person who was buried under years of coping.',
  'higher-power':          'What matters is the willingness to stop relying solely on ourselves.',
  'honesty':               'Honesty in Al-Anon starts with ourselves \u2014 admitting what we feel, owning what we\u2019ve done.',
  'gratitude-and-hope':    'Hope is what gets us to the first meeting. Gratitude is what keeps us coming back.',
  'the-disease':           'We didn\u2019t cause it, we can\u2019t control it, and we can\u2019t cure it.',
  'fellowship':            'Connection is the antidote to isolation, and fellowship is where recovery becomes real.',
};

/** Recovery tools / practical actions for each topic */
const TOPIC_TOOLS = {
  'detachment':            ['Practice the slogan "How Important Is It?"', 'Step back before reacting', 'Write about what you can and cannot control', 'Attend a meeting on detachment'],
  'powerlessness':         ['Review your Step 1 writing', 'List what you\u2019ve tried to control', 'Practice the Serenity Prayer', 'Share your experience with a sponsor'],
  'focus-on-yourself':     ['Schedule something just for you', 'Ask "Is this mine to carry?"', 'Journal about your needs', 'Set one boundary this week'],
  'one-day-at-a-time':     ['Start the day with a reading', 'Avoid "what if" thinking', 'Practice a 5-minute meditation', 'Write a gratitude list tonight'],
  'boundaries':            ['Practice saying no without explaining', 'Identify one boundary to set', 'Talk to your sponsor about limits', 'Notice when you feel resentful'],
  'letting-go-of-control': ['Pause before offering advice', 'Let someone make their own mistake', 'Write a "letting go" letter', 'Practice "Let Go and Let God"'],
  'self-worth':            ['Write 3 things you like about yourself', 'Say no to one obligation', 'Notice self-critical thoughts', 'Do something that brings you joy'],
  'higher-power':          ['Try a morning prayer or meditation', 'Write a letter to your Higher Power', 'Notice moments of grace', 'Read Step 3 literature'],
  'honesty':               ['Tell someone how you really feel', 'Journal without editing yourself', 'Admit one mistake this week', 'Practice Step 10 spot-check'],
  'gratitude-and-hope':    ['Write a gratitude list', 'Share a hope at a meeting', 'Notice one good thing today', 'Call a program friend'],
  'the-disease':           ['Read about the family disease', 'Practice the Three Cs', 'Replace blame with compassion', 'Attend an open AA meeting'],
  'fellowship':            ['Call a program friend', 'Volunteer for a service position', 'Attend a new meeting', 'Share your story with a newcomer'],
};

/**
 * The 12 guiding principles — each is its own content page.
 *
 * `featuredDays` are day_of_year values for curated readings.
 * These will be looked up against the readings array at build time.
 *
 * Body content is placeholder — to be rewritten in the author's own voice.
 */
export const TOPICS = [
  {
    slug: 'detachment',
    name: 'Detachment with Love',
    shortDescription: 'Separating yourself from the chaos without cutting off the caring.',
    metaDescription: 'Learn to separate your peace from someone else\u2019s choices. Daily reflections on loving detachment in Al-Anon recovery.',
    image: 'detachment.jpg',
    imageAlt: 'Woman finding peace on her porch \u2014 detachment with love in Al-Anon recovery',
    body: `
      <p>
        Detachment is the practice of separating our well-being from
        someone else&rsquo;s choices. It doesn&rsquo;t mean we stop
        caring &mdash; it means we stop drowning.
      </p>
      <p>
        We learn to love without losing ourselves, to be present without
        being consumed. Detachment is what makes it possible to stay in
        the room without being destroyed by what&rsquo;s happening in it.
      </p>`,
    featuredDays: [102, 211, 289, 252, 346],
  },
  {
    slug: 'powerlessness',
    name: 'Powerlessness & Surrender',
    shortDescription: 'Accepting what we cannot control and letting go of the rest.',
    metaDescription: 'Accept what you cannot control and discover the freedom in letting go. Daily Al-Anon reflections on powerlessness and surrender.',
    image: 'powerlessness.jpg',
    imageAlt: 'Two women hiking together at sunset \u2014 finding freedom through surrender in Al-Anon recovery',
    body: `
      <p>
        Step One names it plainly: we are powerless over alcohol and
        over other people. Most of us spent years proving otherwise,
        and it nearly destroyed us.
      </p>
      <p>
        Surrender isn&rsquo;t giving up &mdash; it&rsquo;s giving over.
        It&rsquo;s the moment we stop white-knuckling the steering wheel
        and discover that the car was never ours to drive.
      </p>`,
    featuredDays: [11, 15, 16, 153, 357],
  },
  {
    slug: 'focus-on-yourself',
    name: 'Focus on Yourself',
    shortDescription: 'Shifting attention from the alcoholic back to your own life.',
    metaDescription: 'Turn the focus back to your own life after years of watching someone else\u2019s. Daily Al-Anon reflections on reclaiming your attention and energy.',
    image: 'focus-on-yourself.jpg',
    imageAlt: 'Woman focused on pottery at a wheel \u2014 turning attention back to yourself in Al-Anon recovery',
    body: `
      <p>
        For years, our attention was fixed on someone else: their drinking,
        their mood, their next crisis. Turning that focus inward feels
        selfish at first, even dangerous.
      </p>
      <p>
        What happens is that we discover a life we&rsquo;d forgotten was
        ours. We find choices where we saw only obligations. Focusing on
        ourselves is the most radical &mdash; and most difficult &mdash;
        shift in recovery.
      </p>`,
    featuredDays: [6, 17, 21, 22, 237],
  },
  {
    slug: 'one-day-at-a-time',
    name: 'One Day at a Time',
    shortDescription: 'Releasing anxiety about the future and regret about the past.',
    metaDescription: 'Let go of tomorrow\u2019s worry and yesterday\u2019s regret. Daily Al-Anon reflections on staying present and living one day at a time.',
    image: 'one-day-at-a-time.jpg',
    imageAlt: 'Two friends laughing together in a park \u2014 embracing the present moment in Al-Anon recovery',
    body: `
      <p>
        Most of us lived in the future or the past &mdash; dreading what
        might happen, replaying what already did. &ldquo;One day at a
        time&rdquo; sounds simple, but it&rsquo;s one of the most
        difficult things the program asks of us.
      </p>
      <p>
        These readings explore what it means to be here, now &mdash;
        to handle just today, and to trust that tomorrow will take
        care of itself.
      </p>`,
    featuredDays: [60, 64, 248, 199, 275],
  },
  {
    slug: 'boundaries',
    name: 'Boundaries',
    shortDescription: 'Learning to say no as an act of self-respect, not selfishness.',
    metaDescription: 'Learn to say no without guilt and set healthy limits. Daily Al-Anon reflections on boundaries as self-respect, not selfishness.',
    image: 'boundaries.jpg',
    imageAlt: 'Two women talking on a street corner with healthy space between them \u2014 setting boundaries in Al-Anon recovery',
    body: `
      <p>
        Living with alcoholism blurs every line. We absorb other people&rsquo;s
        moods, carry their responsibilities, and lose track of where their
        crisis ends and our life begins.
      </p>
      <p>
        Boundaries aren&rsquo;t walls. They&rsquo;re the foundation that
        makes real love possible &mdash; the recognition of where I end
        and you begin.
      </p>`,
    featuredDays: [8, 9, 23, 99, 114],
  },
  {
    slug: 'letting-go-of-control',
    name: 'Letting Go of Control',
    shortDescription: 'Recognizing the many ways we try to manage, fix, or manipulate outcomes.',
    metaDescription: 'Stop managing, fixing, and controlling what was never yours to carry. Daily Al-Anon reflections on releasing the need to control.',
    image: 'letting-go-of-control.jpg',
    imageAlt: 'Two women laughing together while cooking \u2014 letting go of control in Al-Anon recovery',
    body: `
      <p>
        We managed, we orchestrated, we worried ourselves sick trying to
        control outcomes that were never ours to control. The need to
        control is the disease talking through us.
      </p>
      <p>
        These readings explore the subtle and not-so-subtle ways we try
        to run other people&rsquo;s lives &mdash; and what happens when
        we finally put that burden down.
      </p>`,
    featuredDays: [3, 72, 168, 266, 320],
  },
  {
    slug: 'self-worth',
    name: 'Self-Worth & Identity',
    shortDescription: 'Reclaiming the sense of self that years of crisis eroded.',
    metaDescription: 'Rediscover who you are beyond someone else\u2019s crisis. Daily Al-Anon reflections on rebuilding self-worth and reclaiming your identity.',
    image: 'self-worth.jpg',
    imageAlt: 'Woman looking at her reflection in a mirror \u2014 reclaiming self-worth and identity in Al-Anon recovery',
    body: `
      <p>
        Many of us spent so long managing someone else&rsquo;s disease
        that we lost any sense of who we were apart from the crisis.
        Our identity became &ldquo;the one who holds it together.&rdquo;
      </p>
      <p>
        Recovery is, in part, an excavation &mdash; digging out the person
        who was buried under years of coping, and discovering that person
        has value apart from what they do for others.
      </p>`,
    featuredDays: [103, 158, 170, 186, 290],
  },
  {
    slug: 'higher-power',
    name: 'Trusting a Higher Power',
    shortDescription: 'Finding a source of guidance beyond your own willpower.',
    metaDescription: 'Find a source of strength beyond your own willpower. Daily Al-Anon reflections on trusting a Higher Power and letting go of self-reliance.',
    image: 'higher-power.jpg',
    imageAlt: 'Man holding his father\u2019s hand at a hospital bedside \u2014 trusting a Higher Power in Al-Anon recovery',
    body: `
      <p>
        Al-Anon is a spiritual program, not a religious one. The program
        invites us to find a Higher Power of our own understanding &mdash;
        whatever that looks like.
      </p>
      <p>
        For some it&rsquo;s God. For others it&rsquo;s the group, or simply
        the recognition that something larger than our own willpower is at
        work. What matters is the willingness to stop relying solely on
        ourselves.
      </p>`,
    featuredDays: [35, 36, 43, 84, 162],
  },
  {
    slug: 'honesty',
    name: 'Honesty & Self-Awareness',
    shortDescription: 'Getting truthful about your own patterns, motives, and feelings.',
    metaDescription: 'Stop performing and start telling the truth \u2014 to yourself first. Daily Al-Anon reflections on honesty, self-awareness, and dropping the mask.',
    image: 'honesty.jpg',
    imageAlt: 'Two women in honest conversation over coffee \u2014 honesty and self-awareness in Al-Anon recovery',
    body: `
      <p>
        Living with alcoholism teaches us to perform. We smile when
        we&rsquo;re breaking. We say &ldquo;fine&rdquo; when nothing is fine.
      </p>
      <p>
        Honesty in Al-Anon starts with ourselves &mdash; admitting what we
        feel, owning what we&rsquo;ve done, and stopping the exhausting
        work of keeping up appearances. The practice is daily: telling the
        truth, even when it&rsquo;s uncomfortable.
      </p>`,
    featuredDays: [50, 92, 115, 126, 278],
  },
  {
    slug: 'gratitude-and-hope',
    name: 'Gratitude & Hope',
    shortDescription: 'Moving from despair toward appreciation for progress, even when circumstances haven&rsquo;t changed.',
    metaDescription: 'Find gratitude even when nothing has changed but you. Daily Al-Anon reflections on hope, appreciation, and inner progress.',
    image: 'gratitude-and-hope.jpg',
    imageAlt: 'Woman breathing in peacefully by a lake at sunset \u2014 gratitude and hope in Al-Anon recovery',
    body: `
      <p>
        Hope is what gets us to the first meeting. Gratitude is what
        keeps us coming back. Neither requires that circumstances change
        &mdash; only that we do.
      </p>
      <p>
        These readings explore what it means to find genuine appreciation
        for small progress, to hold hope even in uncertainty, and to
        recognize that the shift is always internal first.
      </p>`,
    featuredDays: [34, 41, 116, 339, 360],
  },
  {
    slug: 'the-disease',
    name: 'Understanding the Disease',
    shortDescription: 'Seeing alcoholism as an illness, not a moral failing.',
    metaDescription: 'See alcoholism as an illness, not a personal failing. Daily Al-Anon reflections on understanding the disease and finding compassion.',
    image: 'the-disease.jpg',
    imageAlt: 'Couple sitting together on a park bench in autumn \u2014 understanding the disease of alcoholism in Al-Anon recovery',
    body: `
      <p>
        Understanding alcoholism as a disease &mdash; rather than a choice,
        a weakness, or a personal insult &mdash; changes everything. It
        opens the door to compassion for both the alcoholic and ourselves.
      </p>
      <p>
        We didn&rsquo;t cause it, we can&rsquo;t control it, and we
        can&rsquo;t cure it. These readings explore what it means to
        truly accept that, and what becomes possible when we do.
      </p>`,
    featuredDays: [5, 7, 8, 11, 94],
  },
  {
    slug: 'fellowship',
    name: 'Community & Fellowship',
    shortDescription: 'Breaking isolation and discovering you are not alone.',
    metaDescription: 'Break the isolation of living with alcoholism. Daily Al-Anon reflections on fellowship, connection, and the healing power of community.',
    image: 'fellowship.jpg',
    imageAlt: 'Women connecting outside an Al-Anon meeting at sunset \u2014 community and fellowship in recovery',
    body: `
      <p>
        Alcoholism is an isolating disease &mdash; not just for the drinker,
        but for everyone around them. We hide what&rsquo;s happening at home.
        We pull away from friends. We convince ourselves that no one could
        understand.
      </p>
      <p>
        Walking into a meeting and hearing someone describe our exact
        experience breaks the spell. Connection is the antidote to
        isolation, and fellowship is where recovery becomes real.
      </p>`,
    featuredDays: [1, 127, 139, 338, 342],
  },
];

/**
 * Render the Topics index page.
 */
export function renderTopicsIndexPage() {
  // 1-2-3 Hierarchy: Primary (hero), Secondary (duo), Tertiary (bento)
  const hero = TOPICS[0];
  const heroQuote = TOPIC_PULL_QUOTES[hero.slug] || '';
  const duo = [TOPICS[1], TOPICS[2]];
  const bento = TOPICS.slice(3);

  // Bento layout classes: asymmetric sizes (same approach that worked before)
  // Row 1: wide, narrow-tall, narrow-tall
  // Row 2: narrow, narrow, wide
  // Row 3: narrow-tall, wide, narrow
  const bentoClasses = [
    'ti-bento--wide',  'ti-bento--tall',  'ti-bento--tall',
    '',                 '',                 'ti-bento--wide',
    'ti-bento--tall',  'ti-bento--wide',  '',
  ];

  const bentoCards = bento.map((topic, i) => {
    const cls = bentoClasses[i] || '';
    return `
          <a href="${bp(`/principles/${topic.slug}/`)}" class="ti-bento-card${cls ? ' ' + cls : ''}">
            <div class="ti-bento-card-img">
              <img src="${bp(`/assets/themes/${topic.image}`)}" alt="${topic.imageAlt || topic.name}" />
            </div>
            <div class="ti-bento-card-gradient"></div>
            <div class="ti-bento-card-text">
              <h3 class="ti-bento-card-title">${topic.name}</h3>
              <p class="ti-bento-card-desc">${topic.shortDescription}</p>
            </div>
          </a>`;
  });

  // Duo cards
  const duoCards = duo.map(topic => {
    return `
          <a href="${bp(`/principles/${topic.slug}/`)}" class="ti-duo-card">
            <div class="ti-duo-card-img">
              <img src="${bp(`/assets/themes/${topic.image}`)}" alt="${topic.imageAlt || topic.name}" />
            </div>
            <div class="ti-duo-card-gradient"></div>
            <div class="ti-duo-card-text">
              <h3 class="ti-duo-card-title">${topic.name}</h3>
              <p class="ti-duo-card-desc">${topic.shortDescription}</p>
            </div>
          </a>`;
  }).join('\n');

  const bodyContent = `
      <!-- Page Hero -->
      <header class="ti-hero">
        <div class="ti-hero-image">
          <img src="${bp('/assets/themes/themes.jpg')}" alt="Guiding Principles" />
          <div class="ti-hero-overlay"></div>
        </div>
        <div class="ti-hero-content">
          <span class="ti-hero-label">Guiding Principles</span>
          <h1 class="ti-hero-title">Guiding Principles</h1>
          <p class="ti-hero-desc">The foundational concepts for the Al-Anon journey &mdash; the threads that run through every stage of recovery.</p>
        </div>
      </header>

      <!-- Editorial Intro -->
      <div class="ti-editorial-intro">
        <p>
          Recovery doesn&rsquo;t follow a straight line. Some days we need to practice letting go;
          other days we need to hold a boundary. These twelve principles map the foundational concepts
          of the Al-Anon journey &mdash; and the quiet, daily work of
          finding our way back to ourselves.
        </p>
      </div>

      <!-- Primary: Hero Feature (70/30) -->
      <div class="ti-hero-feature-wrap">
        <a href="${bp(`/principles/${hero.slug}/`)}" class="ti-hero-feature">
          <div class="ti-hero-feature-img">
            <img src="${bp(`/assets/themes/${hero.image}`)}" alt="${hero.imageAlt || hero.name}" />
            <span class="ti-hero-feature-overlap">&ldquo;${heroQuote}&rdquo;</span>
          </div>
          <div class="ti-hero-feature-body">
            <span class="ti-hero-feature-label">Featured Principle</span>
            <h2 class="ti-hero-feature-title">${hero.name}</h2>
            <p class="ti-hero-feature-desc">${hero.shortDescription}</p>
            <p class="ti-hero-feature-quote">&ldquo;${heroQuote}&rdquo;</p>
            <span class="ti-hero-feature-cta">Read &amp; Reflect &rarr;</span>
          </div>
        </a>
      </div>

      <!-- Quick Path -->
      <div class="ti-quickpath-wrap">
        <h2 class="ti-quickpath-heading">Where are you today?</h2>
        <div class="ti-quickpath-grid">
          <a href="${bp('/principles/powerlessness/')}" class="ti-quickpath-btn">Feeling Overwhelmed</a>
          <a href="${bp('/principles/boundaries/')}" class="ti-quickpath-btn">Setting Boundaries</a>
          <a href="${bp('/principles/gratitude-and-hope/')}" class="ti-quickpath-btn">Seeking Hope</a>
          <a href="${bp('/principles/fellowship/')}" class="ti-quickpath-btn">New to Al-Anon</a>
        </div>
      </div>

      <!-- Secondary: Featured Duo (50/50) -->
      <div class="ti-duo-wrap">
        <div class="ti-duo-grid">
${duoCards}
        </div>
      </div>

      <!-- Tertiary: Asymmetric Bento Grid -->
      <div class="ti-bento-wrap">
        <h2 class="ti-bento-heading">Explore All Principles</h2>
        <div class="ti-bento-grid">
${bentoCards.slice(0, 5).join('\n')}

          <!-- 12 Steps Internal Link Card — fills the empty tall slot -->
          <a href="${bp('/steps/')}" class="ti-steps-card">
            <span class="ti-steps-icon">&#x1F9ED;</span>
            <h3 class="ti-steps-title">The 12 Steps</h3>
            <p class="ti-steps-desc">
              Looking for the roadmap to recovery? Explore the foundational
              principles of Al-Anon, month by month.
            </p>
            <span class="ti-steps-link">Explore the Path &rarr;</span>
          </a>

${bentoCards.slice(5, 6).join('\n')}
        </div>
      </div>

      <!-- Mid-Grid Slim CTA Strip -->
      <div class="ti-slim-cta-wrap">
        <div class="ti-slim-cta">
          <p class="ti-slim-cta-text">Carry these principles in your pocket.</p>
          <div class="ti-slim-cta-actions">
            <a href="https://apps.apple.com/app/id6755981862" target="_blank" rel="noopener noreferrer" class="ti-slim-cta-btn">
              <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" class="ti-slim-cta-badge">
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.dailypaths" target="_blank" rel="noopener noreferrer" class="ti-slim-cta-btn">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" class="ti-slim-cta-badge ti-slim-cta-badge-play">
            </a>
          </div>
        </div>
      </div>

      <!-- Remaining Bento Cards -->
      <div class="ti-bento-wrap ti-bento-wrap--continued">
        <div class="ti-bento-grid">
${bentoCards.slice(6).join('\n')}
        </div>
      </div>

      <!-- Community & Support — Resource Spotlight -->
      <div class="ti-community-wrap">
        <h3 class="ti-community-heading">You Don&rsquo;t Have to Do This Alone.</h3>
        <p class="ti-community-intro">
          Recovery is a shared journey. We encourage you to find a local or electronic
          meeting to connect with others who truly understand.
        </p>
        <div class="ti-community-card">
          <span class="ti-community-badge">Official Resource</span>
          <p class="ti-community-card-text">
            Al-Anon Family Groups maintains a worldwide directory of in-person and
            electronic meetings &mdash; free, confidential, and open to anyone affected
            by someone else&rsquo;s drinking.
          </p>
          <a href="https://al-anon.org/al-anon-meetings/find-an-al-anon-meeting/"
             target="_blank"
             rel="noopener noreferrer"
             title="Search for Al-Anon meetings on the official Al-Anon Family Groups website"
             class="ti-community-btn">
            Search the Official Meeting Directory&nbsp;&#8599;
          </a>
        </div>
      </div>`;

  return wrapInLayout({
    title: 'Guiding Principles &mdash; Foundational Concepts for the Al-Anon Journey | Al-Anon Daily Paths',
    description: 'Explore 12 guiding principles for the Al-Anon journey including detachment, powerlessness, boundaries, honesty, and more. Each principle includes reflections and curated daily readings.',
    canonicalPath: '/principles/',
    bodyContent,
    bodyClass: 'page-topics-index',
  });
}

/**
 * Render an individual topic page — editorial layout.
 *
 * @param {Object} topic - Topic object from TOPICS array
 * @param {Array} featuredReadings - Reading objects matching featuredDays
 * @param {Array} [allReadings] - All 366 readings (for theme-tag matching)
 */
export function renderTopicPage(topic, featuredReadings, allReadings = []) {
  const idx = TOPICS.indexOf(topic);
  const prevTopic = TOPICS[(idx - 1 + TOPICS.length) % TOPICS.length];
  const nextTopic = TOPICS[(idx + 1) % TOPICS.length];

  const tools = TOPIC_TOOLS[topic.slug] || [];
  const pullQuote = TOPIC_PULL_QUOTES[topic.slug] || '';
  const themeTags = TOPIC_THEME_TAGS[topic.slug] || [];

  // Build theme-matched readings from secondary_theme
  const featuredDaySet = new Set(topic.featuredDays || []);
  let themeReadings = [];
  if (allReadings.length > 0 && themeTags.length > 0) {
    themeReadings = allReadings.filter(
      r => r.secondary_theme && themeTags.includes(r.secondary_theme) && !featuredDaySet.has(r.day_of_year)
    );
  }

  // Combine: featured first, then theme-matched (deduped)
  const seenDays = new Set(featuredReadings.map(r => r.day_of_year));
  const additionalReadings = themeReadings.filter(r => {
    if (seenDays.has(r.day_of_year)) return false;
    seenDays.add(r.day_of_year);
    return true;
  });

  // Show up to 9 reading cards total
  const allTopicReadings = [...featuredReadings, ...additionalReadings];
  const displayReadings = allTopicReadings.slice(0, 9);
  const totalCount = allTopicReadings.length;

  // Build reading cards
  const readingCards = displayReadings.map(r => {
    const slug = dayToSlug(r.day_of_year);
    return `
            <a href="${bp(`/${slug}/`)}" class="topic-reading-card">
              <span class="topic-reading-card-date">${r.display_date}</span>
              <span class="topic-reading-card-title">${r.title}</span>
              ${r.secondary_theme ? `<span class="topic-reading-card-tag">${r.secondary_theme}</span>` : ''}
            </a>`;
  }).join('\n');

  // Build theme tags pills
  const tagPills = themeTags.slice(0, 6).map(tag => {
    const count = allReadings.filter(r => r.secondary_theme === tag).length;
    return count > 0 ? `<span class="topic-tag-pill">${tag} <span class="topic-tag-count">${count}</span></span>` : '';
  }).filter(Boolean).join('\n              ');

  // Build sidebar tools
  const toolItems = tools.map(t => `              <li>${t}</li>`).join('\n');

  const bodyContent = `
    <article class="topic-editorial">
      <!-- Hero Section -->
      <header class="topic-hero">
        ${topic.image ? `
        <div class="topic-hero-image">
          <img src="${bp(`/assets/themes/${topic.image}`)}" alt="${topic.imageAlt || topic.name}" />
          <div class="topic-hero-overlay"></div>
        </div>` : ''}
        <div class="topic-hero-content">
          <nav class="breadcrumb topic-hero-breadcrumb">
            <a href="${bp('/principles/')}">Principles</a>
            <span class="breadcrumb-sep">/</span>
            <span>${topic.name}</span>
          </nav>
          <span class="topic-hero-label">Guiding Principle</span>
          <h1 class="topic-hero-title">The Principle of ${topic.name}</h1>
          <p class="topic-hero-desc">${topic.shortDescription}</p>
        </div>
      </header>

      <!-- Two-Column Body -->
      <div class="topic-body-wrap">
        <div class="topic-body-inner">
          <!-- Main Column (70%) -->
          <div class="topic-main-col">
            <section class="topic-essay">
              ${topic.body}
            </section>

            <!-- Related Tags Callout -->
            ${tagPills ? `
            <aside class="topic-callout">
              <h3 class="topic-callout-title">Related Tags in This Principle</h3>
              <p class="topic-callout-intro">
                Readings tagged with these topics appear on this page.
              </p>
              <div class="topic-tag-list">
              ${tagPills}
              </div>
            </aside>` : ''}
          </div>

          <!-- Sidebar Column (30%) -->
          <aside class="topic-sidebar">
            <div class="topic-sidebar-tools">
              <h3 class="topic-sidebar-heading">Recovery Tools</h3>
              <ul class="topic-sidebar-list">
${toolItems}
              </ul>
            </div>

            ${pullQuote ? `
            <blockquote class="topic-sidebar-quote">
              <p>&ldquo;${pullQuote}&rdquo;</p>
            </blockquote>` : ''}

            <div class="topic-sidebar-resource">
              <h3 class="topic-sidebar-heading">Go Deeper</h3>
              <p>Explore this principle through Al-Anon&rsquo;s
                <a href="https://ecomm.al-anon.org/EN/ItemDetail?iProductCode=B24" target="_blank" rel="noopener noreferrer"><em>Paths to Recovery</em></a>.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <!-- Readings Grid -->
      ${displayReadings.length > 0 ? `
      <section class="topic-readings-section">
        <h2 class="topic-readings-heading">Readings on ${topic.name}</h2>
        <p class="topic-readings-intro">
          ${totalCount} readings explore this principle. Here are some to start with.
        </p>
        <div class="topic-readings-grid">
${readingCards}
        </div>
        ${totalCount > 9 ? `
        <p class="topic-readings-more">
          <a href="${bp('/browse/')}">Browse all readings &rarr;</a>
        </p>` : ''}
      </section>` : ''}

      <!-- Topic Navigation -->
      <nav class="topic-nav-footer topic-nav-editorial">
        <a href="${bp(`/principles/${prevTopic.slug}/`)}" class="nav-prev">
          <span class="nav-arrow">&larr;</span>
          <span class="nav-label">${prevTopic.name}</span>
        </a>
        <a href="${bp('/principles/')}" class="nav-browse">All Principles</a>
        <a href="${bp(`/principles/${nextTopic.slug}/`)}" class="nav-next">
          <span class="nav-label">${nextTopic.name}</span>
          <span class="nav-arrow">&rarr;</span>
        </a>
      </nav>
    </article>`;

  return wrapInLayout({
    title: `The Principle of ${topic.name} &mdash; Al-Anon Recovery Reflections | Daily Paths`,
    description: (topic.metaDescription || topic.shortDescription) + ' Reflections and curated daily readings from Al-Anon Daily Paths.',
    canonicalPath: `/principles/${topic.slug}/`,
    bodyContent,
    bodyClass: 'page-topic-detail',
  });
}
