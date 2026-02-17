import { wrapInLayout } from './base.mjs';
import { dayToSlug } from '../helpers/slug-utils.mjs';

/**
 * The 15 recovery topics — each is its own content page.
 *
 * `featuredDays` are day_of_year values for curated readings.
 * These will be looked up against the readings array at build time.
 */
export const TOPICS = [
  {
    slug: 'control-and-surrender',
    name: 'Control & Surrender',
    shortDescription: 'Letting go of the need to manage everything and everyone.',
    body: `
      <p>
        Most of us arrived in Al-Anon as experts at running other people&rsquo;s
        lives. We managed, we orchestrated, we worried ourselves sick trying to
        control outcomes that were never ours to control. Step One names this
        plainly: we are powerless over alcohol and over other people.
      </p>
      <p>
        Surrender isn&rsquo;t giving up &mdash; it&rsquo;s giving over. It&rsquo;s
        the moment we stop white-knuckling the steering wheel and discover that
        the car was never ours to drive. For many of us, this is the single
        hardest shift in recovery, and the one we return to most often.
      </p>
      <p>
        The readings in this section explore what it means to release our grip:
        on the alcoholic, on outcomes, on the illusion that enough effort can
        fix another person&rsquo;s disease.
      </p>`,
    featuredDays: [357, 13, 168, 1, 3, 6],
  },
  {
    slug: 'detachment-and-boundaries',
    name: 'Detachment & Boundaries',
    shortDescription: 'Learning where I end and you begin.',
    body: `
      <p>
        Living with alcoholism blurs every line. We absorb other people&rsquo;s
        moods, carry their responsibilities, and lose track of where their
        crisis ends and our life begins. Detachment is the practice of
        separating our well-being from someone else&rsquo;s choices.
      </p>
      <p>
        Detachment doesn&rsquo;t mean we stop caring. It means we stop
        drowning. We learn to love without losing ourselves, to be present
        without being consumed. Boundaries aren&rsquo;t walls &mdash; they&rsquo;re
        the foundation that makes real love possible.
      </p>`,
    featuredDays: [99, 289, 211, 8, 17],
  },
  {
    slug: 'serenity-and-sanity',
    name: 'Serenity & Sanity',
    shortDescription: 'From a racing mind to a quiet, manageable one.',
    body: `
      <p>
        Before recovery, many of us lived in a constant state of crisis.
        Our minds raced. We rehearsed arguments, replayed disasters, and
        braced for the next catastrophe. Step Two promises that a Power
        greater than ourselves can restore us to sanity &mdash; a word that
        felt foreign to most of us.
      </p>
      <p>
        Serenity isn&rsquo;t the absence of problems. It&rsquo;s a quiet
        steadiness that holds even when life is loud. These readings explore
        what it means to move from obsession to peace, from chaos to a
        life that feels manageable.
      </p>`,
    featuredDays: [38, 341, 284, 36, 47],
  },
  {
    slug: 'fear-and-courage',
    name: 'Fear & Courage',
    shortDescription: 'Acting in spite of fear.',
    body: `
      <p>
        Fear is the engine of most of our worst behaviors. We people-please
        because we&rsquo;re afraid of rejection. We control because we&rsquo;re
        afraid of what happens if we don&rsquo;t. We stay silent because
        we&rsquo;re afraid of conflict.
      </p>
      <p>
        Courage in Al-Anon doesn&rsquo;t mean fearlessness. It means doing
        the next right thing even when we&rsquo;re terrified. It means facing
        the empty space where our old defenses used to be and trusting that
        something better will grow there.
      </p>`,
    featuredDays: [44, 157, 158, 103, 5],
  },
  {
    slug: 'self-esteem-and-identity',
    name: 'Self-Esteem & Identity',
    shortDescription: 'Rebuilding the self that the disease diminished.',
    body: `
      <p>
        Alcoholism doesn&rsquo;t just affect the drinker. It reshapes everyone
        around them. Many of us spent so long managing someone else&rsquo;s
        disease that we lost any sense of who we were apart from the crisis.
        Our identity became &ldquo;the one who holds it together.&rdquo;
      </p>
      <p>
        Recovery is, in part, an excavation &mdash; digging out the person
        who was buried under years of coping. These readings explore what
        it means to discover (or rediscover) our own worth, separate from
        what we do for others.
      </p>`,
    featuredDays: [103, 27, 290, 21, 110],
  },
  {
    slug: 'trust',
    name: 'Trust',
    shortDescription: 'Learning to rely on God, on others, and on ourselves.',
    body: `
      <p>
        Trust may be the thing alcoholism destroys most thoroughly. We
        stop trusting the drinker, then we stop trusting other people,
        and eventually we stop trusting ourselves. Our own judgment feels
        suspect &mdash; after all, we stayed, we enabled, we believed the
        promises.
      </p>
      <p>
        Rebuilding trust is slow, careful work. It starts small: trusting
        the process, trusting the group, trusting that our feelings are
        valid. Over time, we learn that the most important trust to
        rebuild is trust in ourselves.
      </p>`,
    featuredDays: [49, 91, 129, 40, 84],
  },
  {
    slug: 'acceptance-and-denial',
    name: 'Acceptance & Denial',
    shortDescription: 'Seeing reality as it is, not as we wish it were.',
    body: `
      <p>
        Denial isn&rsquo;t stupidity &mdash; it&rsquo;s a survival skill.
        When reality is too painful to face, the mind protects itself by
        refusing to see. Many of us became so skilled at denial that we
        didn&rsquo;t realize how bad things had gotten until we walked
        into our first meeting.
      </p>
      <p>
        Acceptance is the opposite of denial, but it&rsquo;s not resignation.
        It&rsquo;s the courage to see things clearly and respond from truth
        rather than fantasy. These readings explore the painful, liberating
        process of letting reality in.
      </p>`,
    featuredDays: [118, 50, 155, 9, 15],
  },
  {
    slug: 'amends-and-forgiveness',
    name: 'Amends & Forgiveness',
    shortDescription: 'Cleaning the past to free the future.',
    body: `
      <p>
        Resentment is the poison we drink hoping someone else will get sick.
        Most of us carry a heavy load of it &mdash; toward the alcoholic,
        toward ourselves, toward anyone who failed to rescue us. The
        program&rsquo;s answer isn&rsquo;t to pretend the harm didn&rsquo;t
        happen, but to clean our side of the street.
      </p>
      <p>
        Amends aren&rsquo;t apologies. They&rsquo;re changes in behavior.
        And forgiveness isn&rsquo;t something we do for the other person
        &mdash; it&rsquo;s something we do for ourselves, to put down
        the weight we&rsquo;ve been carrying.
      </p>`,
    featuredDays: [273, 258, 261, 232, 284],
  },
  {
    slug: 'honesty-and-integrity',
    name: 'Honesty & Integrity',
    shortDescription: 'Aligning the inside with the outside.',
    body: `
      <p>
        Living with alcoholism teaches us to perform. We smile when we&rsquo;re
        breaking. We say &ldquo;fine&rdquo; when nothing is fine. We become
        so good at the performance that we lose track of what&rsquo;s real.
      </p>
      <p>
        Honesty in Al-Anon starts with ourselves. It means admitting what
        we feel, owning what we&rsquo;ve done, and stopping the exhausting
        work of keeping up appearances. The Fourth Step inventory is the
        formal version of this, but the practice is daily: telling the
        truth, even when it&rsquo;s uncomfortable.
      </p>`,
    featuredDays: [115, 95, 92, 4, 7],
  },
  {
    slug: 'higher-power-and-faith',
    name: 'Higher Power & Faith',
    shortDescription: 'A practical, personal spiritual partnership.',
    body: `
      <p>
        Al-Anon is a spiritual program, not a religious one. Many of us
        arrived with complicated feelings about God &mdash; anger, doubt,
        or the rigid beliefs of a childhood that didn&rsquo;t protect us.
        The program invites us to find a Higher Power of our own
        understanding, whatever that looks like.
      </p>
      <p>
        For some it&rsquo;s God. For others it&rsquo;s the group, nature,
        or simply the recognition that something larger than our own
        willpower is at work. What matters isn&rsquo;t the theology &mdash;
        it&rsquo;s the willingness to stop relying solely on ourselves.
      </p>`,
    featuredDays: [40, 84, 39, 36, 43],
  },
  {
    slug: 'growth-and-patience',
    name: 'Growth & Patience',
    shortDescription: 'The slow, often frustrating pace of spiritual change.',
    body: `
      <p>
        We want recovery to work like a light switch. We want to read the
        right paragraph, hear the right share, and be healed. But growth
        in Al-Anon is more like a garden &mdash; slow, seasonal, and
        often invisible until one day we look back and realize how far
        we&rsquo;ve come.
      </p>
      <p>
        Patience with ourselves is one of the hardest things the program
        asks of us. These readings explore what it means to trust the
        process, to keep showing up even when progress feels painfully
        slow, and to recognize that gradual change is still real change.
      </p>`,
    featuredDays: [339, 232, 309, 47, 16],
  },
  {
    slug: 'service-and-connection',
    name: 'Service & Connection',
    shortDescription: 'Healing through helping &mdash; the end of isolation.',
    body: `
      <p>
        Alcoholism is an isolating disease &mdash; not just for the drinker,
        but for everyone around them. We hide what&rsquo;s happening at home.
        We pull away from friends. We convince ourselves that no one could
        understand.
      </p>
      <p>
        Connection is the antidote. Walking into a meeting and hearing
        someone describe our exact experience breaks the spell of
        isolation. And service &mdash; making coffee, sponsoring a
        newcomer, sharing our story &mdash; transforms our pain into
        something useful. We heal by helping others heal.
      </p>`,
    featuredDays: [360, 342, 321, 366, 355],
  },
  {
    slug: 'focus-on-self',
    name: 'Focus on Self',
    shortDescription: 'Taking charge of the only life I can actually live.',
    body: `
      <p>
        For years, our attention was fixed on someone else: their drinking,
        their mood, their next crisis. Turning that focus inward feels
        selfish at first, even dangerous. If I stop watching them, what
        will happen?
      </p>
      <p>
        What happens is that we discover an internal sovereignty we didn&rsquo;t
        know we had. We find choices where we saw only obligations. We learn
        that self-care isn&rsquo;t selfish &mdash; it&rsquo;s the only
        real power we have. These readings explore what it means to tend
        our own garden.
      </p>`,
    featuredDays: [17, 21, 267, 6, 10],
  },
  {
    slug: 'relationships-and-family',
    name: 'Relationships & Family',
    shortDescription: 'Applying spiritual principles to the people closest to us.',
    body: `
      <p>
        The people who push our buttons most are usually the ones we love
        most. Alcoholism distorts family relationships in deep ways &mdash;
        trust erodes, roles calcify, communication breaks down. Recovery
        doesn&rsquo;t automatically fix these patterns.
      </p>
      <p>
        Applying the program to our closest relationships is some of the
        hardest and most rewarding work we do. These readings explore
        what it means to bring honesty, boundaries, and compassion into
        the living room &mdash; not just the meeting room.
      </p>`,
    featuredDays: [26, 149, 90, 99, 211],
  },
  {
    slug: 'humility',
    name: 'Humility',
    shortDescription: 'Being right-sized &mdash; neither a god nor a worm.',
    body: `
      <p>
        Humility is the most misunderstood word in the program. It
        doesn&rsquo;t mean thinking less of ourselves &mdash; it means
        thinking of ourselves less. It&rsquo;s the quiet recognition
        that we&rsquo;re not uniquely terrible, not uniquely wise, and
        not in charge of the universe.
      </p>
      <p>
        True humility is freeing. When we stop needing to be right, to
        be the expert, to have all the answers, we make room for something
        larger to work through us. These readings explore what it means
        to be right-sized.
      </p>`,
    featuredDays: [134, 57, 286, 168, 193],
  },
];

/**
 * Render the Topics index page.
 */
export function renderTopicsIndexPage() {
  const topicItems = TOPICS.map(topic => {
    return `
          <li>
            <a href="/themes/${topic.slug}/" class="topic-list-item">
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
    description: 'Explore 15 core Al-Anon recovery themes including detachment, surrender, trust, honesty, and more. Each theme includes reflections and curated daily readings.',
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
              <a href="/${slug}/">
                <span class="reading-preview-date">${r.display_date}</span>
                <span class="reading-preview-title">${r.title}</span>
              </a>
            </li>`;
  }).join('\n');

  const bodyContent = `
    <article class="content-page topic-detail-page">
      <div class="content-container">
        <nav class="breadcrumb">
          <a href="/themes/">Themes</a>
          <span class="breadcrumb-sep">/</span>
          <span>${topic.name}</span>
        </nav>

        <header class="topic-detail-header">
          <h1 class="topic-detail-title">${topic.name}</h1>
        </header>

        <section class="topic-detail-body">
          ${topic.body}
        </section>

        ${featuredReadings.length > 0 ? `
        <section class="topic-detail-readings">
          <h2>Readings on This Topic</h2>
          <ul class="topic-reading-list">
${readingItems}
          </ul>
        </section>
        ` : ''}

        <nav class="topic-nav-footer">
          <a href="/themes/${prevTopic.slug}/" class="nav-prev">
            <span class="nav-arrow">&larr;</span>
            <span class="nav-label">${prevTopic.name}</span>
          </a>
          <a href="/themes/" class="nav-browse">All Themes</a>
          <a href="/themes/${nextTopic.slug}/" class="nav-next">
            <span class="nav-label">${nextTopic.name}</span>
            <span class="nav-arrow">&rarr;</span>
          </a>
        </nav>
      </div>
    </article>`;

  return wrapInLayout({
    title: `${topic.name} &mdash; Al-Anon Recovery Theme | Al-Anon Daily Paths`,
    description: topic.shortDescription + ' Reflections and curated daily readings from Al-Anon Daily Paths.',
    canonicalPath: `/themes/${topic.slug}/`,
    bodyContent,
    bodyClass: 'page-topic-detail',
  });
}
