import { wrapInLayout } from './base.mjs';
import { dayToSlug } from '../helpers/slug-utils.mjs';
import { bp } from '../helpers/config.mjs';

/**
 * The 12 recovery themes — each is its own content page.
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
  const topicItems = TOPICS.map(topic => {
    return `
          <li>
            <a href="${bp(`/themes/${topic.slug}/`)}" class="topic-list-item">
              <span class="topic-list-name">${topic.name}</span>
              <span class="topic-list-desc">${topic.shortDescription}</span>
            </a>
          </li>`;
  }).join('\n');

  const bodyContent = `
    <div class="content-page topics-index-page">
      <div class="content-container">
        <h1 class="page-title">Themes</h1>
        <p class="page-description">
          These are the themes that run through Al-Anon recovery &mdash; the
          subjects we actually talk about after the meeting. Each theme
          includes reflections and curated readings to deepen your understanding.
        </p>

        <ul class="topic-list">
${topicItems}
        </ul>
      </div>
    </div>`;

  return wrapInLayout({
    title: 'Themes &mdash; Al-Anon Recovery Themes & Reflections | Al-Anon Daily Paths',
    description: 'Explore 12 core Al-Anon recovery themes including detachment, powerlessness, boundaries, honesty, and more. Each theme includes reflections and curated daily readings.',
    canonicalPath: '/themes/',
    bodyContent,
    bodyClass: 'page-topics-index',
  });
}

/**
 * Render an individual topic page.
 *
 * @param {Object} topic - Topic object from TOPICS array
 * @param {Array} featuredReadings - Reading objects matching featuredDays
 */
export function renderTopicPage(topic, featuredReadings) {
  const idx = TOPICS.indexOf(topic);
  const prevTopic = TOPICS[(idx - 1 + TOPICS.length) % TOPICS.length];
  const nextTopic = TOPICS[(idx + 1) % TOPICS.length];

  const readingItems = featuredReadings.map(r => {
    const slug = dayToSlug(r.day_of_year);
    return `            <li>
              <a href="${bp(`/${slug}/`)}">
                <span class="reading-preview-date">${r.display_date}</span>
                <span class="reading-preview-title">${r.title}</span>
              </a>
            </li>`;
  }).join('\n');

  const bodyContent = `
    <article class="content-page topic-detail-page">
      <div class="content-container">
        <nav class="breadcrumb">
          <a href="${bp('/themes/')}">Themes</a>
          <span class="breadcrumb-sep">/</span>
          <span>${topic.name}</span>
        </nav>

        <header class="topic-detail-header">
          <h1 class="topic-detail-title">${topic.name}</h1>
        </header>

        ${topic.image ? `
        <div class="topic-detail-image">
          <img src="${bp(`/assets/themes/${topic.image}`)}" alt="${topic.imageAlt || topic.name}" />
        </div>
        ` : ''}

        <section class="topic-detail-body">
          ${topic.body}
        </section>

        ${featuredReadings.length > 0 ? `
        <section class="topic-detail-readings">
          <h2>Select Readings</h2>
          <ul class="topic-reading-list">
${readingItems}
          </ul>
        </section>
        ` : ''}

        <nav class="topic-nav-footer">
          <a href="${bp(`/themes/${prevTopic.slug}/`)}" class="nav-prev">
            <span class="nav-arrow">&larr;</span>
            <span class="nav-label">${prevTopic.name}</span>
          </a>
          <a href="${bp('/themes/')}" class="nav-browse">All Themes</a>
          <a href="${bp(`/themes/${nextTopic.slug}/`)}" class="nav-next">
            <span class="nav-label">${nextTopic.name}</span>
            <span class="nav-arrow">&rarr;</span>
          </a>
        </nav>
      </div>
    </article>`;

  return wrapInLayout({
    title: `${topic.name} &mdash; Al-Anon Recovery Reflections | Daily Paths`,
    description: (topic.metaDescription || topic.shortDescription) + ' Reflections and curated daily readings from Al-Anon Daily Paths.',
    canonicalPath: `/themes/${topic.slug}/`,
    bodyContent,
    bodyClass: 'page-topic-detail',
  });
}
