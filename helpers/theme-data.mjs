/**
 * Theme Data — Single Source of Truth
 *
 * Centralizes all theme/topic definitions, tag groupings, pull quotes,
 * tools, and member shares. Consumed by templates/topics.mjs,
 * templates/reading.mjs, and indirectly by build.mjs.
 */

/**
 * Map each topic slug to the secondary_theme values that belong to it.
 * Readings whose secondary_theme matches any of these tags will appear
 * on the topic page automatically, alongside the curated featuredDays.
 */
export const TOPIC_THEME_TAGS = {
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
export const TOPIC_PULL_QUOTES = {
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

/** Recovery tools / practical actions for each topic — Slogans, Concepts, Actions */
export const TOPIC_TOOLS = {
  'detachment':            ['Slogan: Let Go and Let God', 'Slogan: Not My Circus, Not My Monkeys', 'Concept: Loving Separation'],
  'powerlessness':         ['Slogan: First Things First', 'Slogan: Easy Does It', 'Concept: The Three C\u2019s (I didn\u2019t Cause it, can\u2019t Control it, won\u2019t Cure it)'],
  'focus-on-yourself':     ['Slogan: Progress Not Perfection', 'Concept: Amends (The 8th &amp; 9th Step process)', 'Action: Releasing a resentment'],
  'one-day-at-a-time':     ['Slogan: Keep It Simple', 'Slogan: How Important Is It?', 'Concept: The Hula Hoop (Staying inside your own circle)', 'Action: A \u201CGod Box\u201D (putting worries inside)'],
  'boundaries':            ['Slogan: Say what you mean, mean what you say, but don\u2019t say it mean', 'Concept: JADE (Justify, Argue, Defend, Explain)'],
  'letting-go-of-control': ['Slogan: Easy Does It', 'Concept: The Leap of Faith', 'Action: Saying \u201CYes\u201D to a sponsor or a service position'],
  'self-worth':            ['Slogan: Live and Let Live', 'Concept: The 4th Step Moral Inventory', 'Action: Admitting a mistake without an excuse'],
  'higher-power':          ['Slogan: Just for Today', 'Concept: A Power Greater Than Ourselves', 'Action: Attending one more meeting'],
  'honesty':               ['Slogan: Keep an Open Mind', 'Concept: Rigorous Honesty', 'Action: Mirror Work (Looking at our own part)'],
  'gratitude-and-hope':    ['Slogan: Count Your Blessings', 'Concept: The Gratitude List', 'Action: Sharing one thing you\u2019re thankful for at the end of a meeting'],
  'the-disease':           ['Read about the family disease', 'Practice the Three C\u2019s', 'Replace blame with compassion', 'Attend an open AA meeting'],
  'fellowship':            ['Slogan: When Anyone, Anywhere Reaches Out', 'Concept: The Twelfth Step', 'Action: Setting up chairs or being a Greeter'],
};

/**
 * The 12 Al-Anon themes — each is its own content page.
 *
 * `featuredDays` are day_of_year values for curated readings.
 * These will be looked up against the readings array at build time.
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
        Acceptance is not approval; it is the quiet recognition of things
        as they are right now. It is the bridge between the pain of the
        past and the possibilities of the future.
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
        Forgiveness is the act of setting a prisoner free and discovering
        that the prisoner was you. It is a gift we give ourselves to stop
        the past from dictating our present peace.
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
        Serenity is the &ldquo;calm in the storm.&rdquo; It is the
        discovery that our internal peace does not have to be dependent
        on the external chaos of our environment.
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
        Willingness is the &ldquo;key in the lock.&rdquo; It doesn&rsquo;t
        require us to have the solution; it only requires the desire to be
        taught a new way to live and a readiness to let go of old defenses.
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
        Humility is the clear-eyed view of our true selves&mdash;neither
        better than nor worse than anyone else. It is the freedom from the
        burden of having to be &ldquo;right&rdquo; or &ldquo;in charge&rdquo;
        all the time.
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
        Hope is the quiet confidence that the future can be different.
        It is fueled by hearing the stories of those who have walked
        the path before us and found a way out of the dark.
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
        In recovery, honesty is more than just telling the truth; it is
        the removal of the masks we wore to survive. It begins with the
        courage to be honest with ourselves about our own feelings and needs.
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
        Gratitude is a muscle we build by looking for the light in the
        midst of the struggle. It shifts our focus from what is missing
        to the abundance that is already here.
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
        We keep what we have by giving it away. Service is the ultimate
        act of detachment and love, reminding us that we are part of a
        larger whole.
      </p>`,
    featuredDays: [1, 127, 139, 338, 342],
  },
];

/** Default member share — used for all themes until specific stories are provided */
export const DEFAULT_MEMBER_SHARE = `For years, I thought my &ldquo;care&rdquo; was measured by how much I worried. I spent my energy trying to get ahead of the next crisis, thinking that if I could just predict the drinker&rsquo;s behavior, I could prevent the fallout. I was exhausted and lost.

When I learned about Detachment, I realized I wasn&rsquo;t helping; I was just drowning alongside them. It didn&rsquo;t mean I stopped loving them; it meant I stopped trying to manage their consequences. Today, I use this principle by taking a deep breath and &ldquo;letting go of the results.&rdquo; I focus on my own reactions, and for the first time in a long time, I can find peace even when the storm is still blowing.`;

/** Per-theme member shares — override the default when provided */
export const MEMBER_SHARES = {
  // 'detachment': `Custom share for detachment...`,
};

/**
 * Reverse map: secondary_theme tag value → { slug, name }
 * Built once at module load so all consumers get a pre-built lookup.
 *
 * Example: THEME_TO_TOPIC['Detachment'] → { slug: 'detachment', name: 'Detachment with Love' }
 */
export const THEME_TO_TOPIC = {};
for (const [topicSlug, tags] of Object.entries(TOPIC_THEME_TAGS)) {
  const topic = TOPICS.find(t => t.slug === topicSlug);
  if (!topic) continue;
  for (const tag of tags) {
    THEME_TO_TOPIC[tag] = { slug: topicSlug, name: topic.name };
  }
}
