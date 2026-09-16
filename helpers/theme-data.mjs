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
  'letting-go': ['Control', 'Flexibility', 'Willingness', 'Self-will'],
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
  'powerlessness':         'Surrender is not giving up on the person. It is giving up the illusion that we can control their drinking.',
  'focus-on-yourself':     'Focusing on ourselves is the most radical \u2014 and most difficult \u2014 shift in recovery.',
  'one-day-at-a-time':     'Handle just today, and trust that tomorrow will take care of itself.',
  'boundaries':            'Boundaries aren\u2019t walls. They\u2019re the foundation that makes real love possible.',
  'letting-go': 'Caring and carrying are not the same thing.',
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
  'letting-go': ['Slogan: Easy Does It', 'Concept: The Leap of Faith', 'Action: Saying \u201CYes\u201D to a sponsor or a service position'],
  'self-worth':            ['Slogan: Live and Let Live', 'Concept: The 4th Step Moral Inventory', 'Action: Admitting a mistake without an excuse'],
  'higher-power':          ['Slogan: Just for Today', 'Concept: A Power Greater Than Ourselves', 'Action: Attending one more meeting'],
  'honesty':               ['Slogan: Keep an Open Mind', 'Concept: Rigorous Honesty', 'Action: Mirror Work (Looking at our own part)'],
  'gratitude-and-hope':    ['Slogan: Count Your Blessings', 'Concept: The Gratitude List', 'Action: Sharing one thing you\u2019re thankful for at the end of a meeting'],
  'the-disease':           ['Read about the family disease', 'Practice the Three C\u2019s', 'Replace blame with compassion', 'Attend an open AA meeting'],
  'fellowship':            ['Slogan: When Anyone, Anywhere Reaches Out', 'Concept: The Twelfth Step', 'Action: Setting up chairs or being a Greeter'],
};

/** Featured Member Insight prompts — theme-specific H2 and textarea placeholder */
export const TOPIC_INSIGHT_PROMPTS = {
  'detachment':            'What is my experience with practicing detachment with love?',
  'powerlessness':         'How have I come to accept powerlessness and practice surrender?',
  'focus-on-yourself':     'In what ways am I learning to keep the focus on myself?',
  'one-day-at-a-time':     'How do I practice living one day at a time?',
  'boundaries':            'What have I learned about setting and maintaining healthy boundaries?',
  'letting-go': 'How am I learning to let go of my need to control outcomes?',
  'self-worth':            'How am I reclaiming my sense of self and personal worth?',
  'higher-power':          'What does it look like for me to trust a Higher Power today?',
  'honesty':               'How am I practicing honesty and self-awareness in my daily life?',
  'gratitude-and-hope':    'Where am I finding gratitude and hope in my recovery?',
  'the-disease':           'How has understanding alcoholism as a disease changed my perspective?',
  'fellowship':            'What has the support of the fellowship meant for my recovery?',
};

/** Custom conversational form questions — theme-specific headers for the Share form */
export const TOPIC_FORM_QUESTIONS = {
  'detachment':            'How have you experienced the shift from trying to fix the situation to simply detaching with love?',
  'powerlessness':         'How did you come to accept your powerlessness over alcoholism and surrender trying to fight it?',
  'focus-on-yourself':     'How has focusing on your own well-being helped you navigate difficult situations?',
  'one-day-at-a-time':     'What does living \u2018one day at a time\u2019 actually look like for you and how do you practice it?',
  'boundaries':            'How do you overcome challenges you face in setting or maintaining your boundaries?',
  'letting-go': 'What has helped you recognize when you are trying to control a situation, and how are you learning to let go?',
  'self-worth':            'How has your understanding of your own value and identity evolved since finding the program?',
  'higher-power':          'What has been your experience in learning to trust in a Power greater than yourself?',
  'honesty':               'How has practicing honesty\u2014both with yourself and others\u2014opened up new paths for your healing?',
  'gratitude-and-hope':    'How has looking for gratitude helped you find a sense of hope, even when things feel uncertain?',
  'the-disease':           'How has your perspective on the disease of alcoholism changed the way you view the chaos?',
  'fellowship':            'In what ways has the fellowship helped you move through the isolation and realize you are no longer alone?',
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
    image: 'articles/detachment-hero.jpg',
    imageAlt: 'A roe deer watching gently from the edge of a forest',
    body: `
      <p><strong>What is Detachment?</strong></p>
      <p>
        In the world of recovery, <strong>detachment</strong> is perhaps the most misunderstood principle&mdash;and the most life-saving. To the newcomer, detachment can sound like coldness, indifference, or a way of &ldquo;giving up&rdquo; on the person they love. But in practice, detachment is an act of profound compassion for both the alcoholic and ourselves.
      </p>
      <p>
        Detachment is the realization that we cannot &ldquo;care&rdquo; someone into sobriety. We didn&rsquo;t cause the disease, we can&rsquo;t control it, and we cannot cure it. When we obsessively monitor, manage, or shield the alcoholic from the consequences of their drinking, we aren&rsquo;t helping them recover; we are simply joining them in the chaos. We become a &ldquo;buffer&rdquo; between the drinker and the very consequences that might eventually lead them to seek help.
      </p>
      <p>
        Detaching means <strong>letting go of the results</strong>. It is the process of untangling our emotional well-being from the behavior of another person. We learn to separate the person we love from the disease they suffer from. We stop being the &ldquo;manager&rdquo; of their life so we can finally become the &ldquo;owner&rdquo; of our own.
      </p>
      <p>
        Practicing detachment with love allows us to stop reacting and start living. It gives us the space to breathe, even when the storm is still blowing. By stepping back, we stop the futile cycle of &ldquo;fixing&rdquo; and begin the necessary work of healing. We learn that we can love someone deeply without allowing their choices to destroy our serenity. Detachment isn&rsquo;t about leaving the person; it&rsquo;s about finding ourselves again.
      </p>`,
    featuredDays: [102, 211, 289, 252, 346],
  },
  {
    slug: 'powerlessness',
    name: 'Surrender',
    displayTitle: 'Surrendering the Unwinnable Battle: Taking the first step',
    displaySubtitle: 'Accepting Powerlessness, Reclaiming Peace, and Finding Recovery for Families Impacted by Alcoholism',
    suppressIntroPullQuote: true,
    shortDescription: 'Recognizing powerlessness, admitting unmanageability, and practicing the Three C’s.',
    metaDescription: 'A practical Al-Anon guide to Step One, powerlessness, unmanageability, surrender, and the Three C’s.',
    image: 'articles/powerlessness-hero.jpg',
    imageAlt: 'A lone figure on a wide shore as gulls take flight',
    localEditorialOverride: true,
    body: `
      <section class="surrender-section">
        <h2>1. Understanding Surrender: Accepting Reality Rather Than Admitting Defeat</h2>
        <p>Step One of Al-Anon states: &ldquo;We admitted we were powerless over alcohol&mdash;that our lives had become unmanageable.&rdquo;</p>
        <p>For a family member or friend of an alcoholic, &ldquo;surrender&rdquo; can sound like failure, weakness, or giving up on someone we love.</p>
        <p>Surrender isn&rsquo;t giving up. It means accepting that we can&rsquo;t control alcoholism through willpower, nagging, or trying to manage another person.</p>
        <p>Living with active alcoholism can mean managing one crisis after another. You may search for hidden bottles, visit local bars, pour liquor down the drain, or monitor phone calls and bank accounts.</p>
        <p>You may stay awake at night, imagining terrible outcomes and trying to figure out how to prevent them. Over time, this can lead to constant worry, anger, desperation, and exhaustion.</p>
        <p>Surrender means recognizing that these efforts are chasing a fantasy.</p>
        <p>Just as willpower can&rsquo;t stop cancer, love and determination can&rsquo;t stop alcoholism.</p>
        <blockquote class="surrender-pullquote"><p><strong>Surrender begins when you stop fighting what you can&rsquo;t control and put down the weight of trying to fix it.</strong></p></blockquote>
        <p>The spiritual principles at work here are honesty, acceptance, and humility.</p>
        <p><strong>Honesty</strong> means looking at what has actually happened. Despite crying, pleading, threatening, or trying harder, the drinking continued.</p>
        <p><strong>Acceptance</strong> means seeing the situation as it is today, not as we wish it were.</p>
        <p><strong>Humility</strong> means accepting that you don&rsquo;t have the power to control another person&rsquo;s choices or recovery.</p>
      </section>

      <section class="surrender-section">
        <h2>2. Internalizing the &ldquo;Three Cs&rdquo; to Dispel the Illusion of Control</h2>
        <p>One of Al-Anon&rsquo;s simplest tools is the &ldquo;Three Cs&rdquo;:</p>
        <p><strong>I didn&rsquo;t cause it. I can&rsquo;t control it. I can&rsquo;t cure it.</strong></p>
        <p>The Three Cs help us separate another person&rsquo;s alcoholism from our responsibility for it.</p>
        <p>It&rsquo;s easy to believe that if we were more loving, more patient, or found the right words, the alcoholic might stop drinking. When they drink again, it can feel personal. We may wonder what we did wrong or why our love wasn&rsquo;t enough.</p>
        <p>But alcoholism isn&rsquo;t caused by a lack of love, and more love can&rsquo;t cure it.</p>
        <p>The illness belongs to the drinker. We didn&rsquo;t cause it, and we can&rsquo;t control or cure it for them.</p>
        <p>When the alcoholic breaks a promise, picks a fight, or starts drinking again, pause before reacting and return to the Three Cs. They remind us to put responsibility where it belongs and stop taking on blame that isn&rsquo;t ours.</p>
        <blockquote class="surrender-pullquote"><p><strong>You didn&rsquo;t cause it, you can&rsquo;t control it, and you can&rsquo;t cure it.</strong></p></blockquote>
        <figure class="surrender-media">
          <img src="/assets/guides/surrender/the_three_cs_recovery_reminder.png" alt="The Three C&rsquo;s: I didn&rsquo;t cause it, I can&rsquo;t control it, I can&rsquo;t cure it." width="1672" height="941" loading="lazy">
        </figure>
      </section>

      <section class="surrender-section">
        <h2>3. Identifying Personal and Emotional Unmanageability</h2>
        <p>The second half of Step One tells us that &ldquo;our lives had become unmanageable.&rdquo;</p>
        <p>Unmanageability isn&rsquo;t only the chaos around us. Living with alcoholism can distort our emotions and thinking.</p>
        <p>We can become so focused on managing the alcoholic&rsquo;s life that we stop taking care of our own. We may ignore our health, lose sleep, skip meals, or stop seeing friends.</p>
        <p>Over time, our mood and behavior can begin to revolve around the alcoholic.</p>
        <p>We may explode in rage over something small, like dishes in the sink or someone coming home late, because years of fear and resentment are underneath it.</p>
        <p>We may lie to employers, make excuses to family, or cover up financial problems so everything still looks fine.</p>
        <blockquote class="surrender-pullquote"><p><strong>Recognizing unmanageability requires examining where your energy goes each day.</strong></p></blockquote>
        <p>If you say &ldquo;yes&rdquo; when you mean &ldquo;no,&rdquo; neglect your own needs, or spend hours replaying arguments and worrying about what might happen, your life has become unmanageable.</p>
        <p>Admitting unmanageability isn&rsquo;t a failure. It means seeing that the way you&rsquo;re living isn&rsquo;t working and that you need help.</p>
        <figure class="surrender-media">
          <img src="/assets/guides/surrender/when_life_revolves_around_theirs.png" alt="Their life at the center, with four ways my own life becomes unmanageable: warped emotions, distorted thinking, attempts to control, and neglecting myself." width="1448" height="1086" loading="lazy">
        </figure>
      </section>

      <section class="surrender-section">
        <h2>4. Practicing Actionable Surrender by &ldquo;Dropping the Rope&rdquo;</h2>
        <p>Surrender is more than acceptance; it requires new behavior.</p>
        <p>Think of it like a tug-of-war: surrender means dropping the rope.</p>
        <p>When you argue back, defend yourself, or try to prove you&rsquo;re right, you keep the struggle going. A tug-of-war ends when one person lets go.</p>
        <blockquote class="surrender-pullquote"><p><strong>There can be no tug-of-war if one person lets go of their end of the rope.</strong></p></blockquote>
        <p>Practicing &ldquo;dropping the rope&rdquo; means changing how you respond.</p>
        <ul>
          <li><strong>Refuse to debate accusations:</strong> You don&rsquo;t have to list everything you&rsquo;ve done or prove yourself. Sometimes silence, &ldquo;You might be right,&rdquo; or leaving the room is enough.</li>
          <li><strong>Stop re-litigating the past:</strong> Old arguments can keep us stuck. When revisiting the past no longer helps solve anything today, let the case stay closed.</li>
          <li><strong>Disengage from circular arguments:</strong> When a conversation keeps going in circles, you don&rsquo;t have to stay in it. You don&rsquo;t have to accept verbal abuse or keep defending yourself.</li>
          <li><strong>Practice detachment with love:</strong> Detachment isn&rsquo;t coldness or abandonment. It means stepping back from the disease while still caring about the person.</li>
        </ul>
        <figure class="surrender-media">
          <img src="/assets/guides/surrender/dropping_the_rope_choosing_peace.png" alt="Comparison of what happens when I keep pulling in conflict versus when I drop the rope and choose how to respond." width="1536" height="1024" loading="lazy">
        </figure>
      </section>

      <section class="surrender-section">
        <h2>5. Shifting the Focus Back to Yourself and Allowing Natural Consequences</h2>
        <p>Surrender means giving up control over the alcoholic&rsquo;s life and bringing the focus back to your own.</p>
        <blockquote class="surrender-pullquote"><p><strong>Surrender means taking your hands off the alcoholic&rsquo;s life and putting your attention back on your own.</strong></p></blockquote>
        <p>When you stop trying to manage another adult, you have more energy to care for yourself.</p>
        <p>Part of this shift is allowing the alcoholic to experience the natural consequences of their choices.</p>
        <p>Family members often step in to protect the drinker&mdash;paying bounced checks, calling in sick for them, cleaning up messes, or finishing what they left undone.</p>
        <p>We do this to help, but stepping in can keep the alcoholic from feeling the results of their own choices.</p>
        <p>Al-Anon compares these growing problems to a mountain of snow. Trying to catch or clean up everything only delays what is coming.</p>
        <p>Sometimes the most loving action is to step aside and let the consequences land where they belong.</p>
        <p>To shift the focus back to yourself:</p>
        <ol>
          <li><strong>Check your physical state:</strong> Are you Hungry, Angry, Lonely, or Tired (HALT)? Eat, rest, and take care of basic needs.</li>
          <li><strong>Set personal boundaries:</strong> Decide what you will do to protect your peace. A boundary guides your actions, not someone else&rsquo;s.</li>
          <li><strong>Reclaim your personal life:</strong> Return to things that matter to you regardless of whether the alcoholic is drinking.</li>
        </ol>
      </section>

      <section class="surrender-section">
        <h2>6. Using Slogans and Program Tools</h2>
        <p>Surrender is rarely a one-time event. We may need to practice it again whenever fear or the urge to control returns.</p>
        <p>Al-Anon offers simple tools that help.</p>
        <h3>Key Program Slogans</h3>
        <ul>
          <li><strong>&ldquo;Let Go and Let God&rdquo;:</strong> Turn what you can&rsquo;t control over to a Higher Power.</li>
          <li><strong>&ldquo;One Day at a Time&rdquo;:</strong> Stay with today instead of worrying about what may happen next.</li>
          <li><strong>&ldquo;Keep It Simple&rdquo;:</strong> Don&rsquo;t overthink the problem or create complicated plans.</li>
          <li><strong>&ldquo;Easy Does It&rdquo;:</strong> Slow down when emotions are running high.</li>
        </ul>
        <h3>Connecting with Fellowship</h3>
        <p>Alcoholism often brings secrecy and isolation.</p>
        <p>Regular meetings, a sponsor, and other members remind us that we&rsquo;re not alone. Sharing with people who understand can bring fear into the open and help us find greater peace and freedom.</p>
        <section class="surrender-prayer" aria-labelledby="surrender-prayer-heading">
          <h3 id="surrender-prayer-heading">A prayer for surrender</h3>
          <p>The Serenity Prayer helps us see the difference between what we can and can&rsquo;t change:</p>
          <blockquote><p>&ldquo;God grant me the serenity to accept the things I cannot change, courage to change the things I can, and wisdom to know the difference.&rdquo;</p></blockquote>
          <p>Other people&rsquo;s drinking and choices belong under &ldquo;things I cannot change.&rdquo; Our own actions and responses belong under &ldquo;things I can change.&rdquo;</p>
          <p class="surrender-prayer-close"><strong>Surrender begins with knowing the difference.</strong></p>
        </section>
      </section>`,
    featuredDays: [11, 15, 16, 153, 357],
  },
  {
    slug: 'focus-on-yourself',
    name: 'Focus on Yourself',
    shortDescription: 'Shifting attention from the alcoholic back to your own life.',
    metaDescription: 'Turn the focus back to your own life after years of watching someone else\u2019s. Daily Al-Anon reflections on reclaiming your attention and energy.',
    image: 'articles/focus-on-yourself-hero.jpg',
    imageAlt: 'Hands potting young seedlings in terracotta pots',
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
    image: 'articles/one-day-at-a-time-hero.jpg',
    imageAlt: 'A quiet lake at sunset with a resting canoe',
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
    image: 'themes/detachment-final.jpg',
    imageAlt: 'A sunlit porch with well-tended plants',
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
    slug: 'letting-go',
    name: 'Letting Go',
    shortDescription: 'Recognizing what isn\'t yours to control and learning to put it down.',
    metaDescription: 'Explore what letting go means in Al-Anon: respecting another person\'s choices, facing the facts, releasing control, and caring without carrying.',
    image: 'articles/letting-go-hero.jpg',
    imageAlt: 'A woman pauses during a phone call at her dining table in warm evening light',
    body: `
      <p>
        Willingness is the &ldquo;key in the lock.&rdquo; It doesn&rsquo;t
        require us to have the solution; it only requires the desire to be
        taught a new way to live and a readiness to let go of old defenses.
      </p>`,
    featuredDays: [7, 18, 71, 247],
  },
  {
    slug: 'self-worth',
    name: 'Self-Worth & Identity',
    shortDescription: 'Reclaiming the sense of self that years of crisis eroded.',
    metaDescription: 'Rediscover who you are beyond someone else\u2019s crisis. Daily Al-Anon reflections on rebuilding self-worth and reclaiming your identity.',
    image: 'articles/self-worth-hero.jpg',
    imageAlt: 'Walking through a golden wheat field in the sun',
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
    image: 'themes/themes-hero.jpg',
    imageAlt: 'Forest path through morning light',
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
    image: 'articles/honesty-hero.jpg',
    imageAlt: 'An owl looking ahead with clear, steady eyes',
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
    image: 'articles/gratitude-and-hope-hero.jpg',
    imageAlt: 'A bumblebee on a bright yellow flower',
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
    image: 'articles/the-disease-hero.jpg',
    imageAlt: 'Sitting quietly at the end of a dock as evening settles',
    body: `
      <p><strong>The Shift from Blame to Compassion</strong></p>
      <p>
        When we live with alcoholism, it is easy to view the drinker&rsquo;s behavior as a personal attack. We see the broken promises, the hidden bottles, and the missed events as choices made specifically to hurt us. This perspective keeps us trapped in a cycle of resentment and exhaustion.
      </p>
      <p>
        <strong>Understanding the disease</strong> changes the fundamental nature of the problem. When we accept that alcoholism is a progressive, chronic illness&mdash;not a lack of willpower or a moral defect&mdash;the &ldquo;window&rdquo; of our perspective shifts. We realize that we have been trying to argue with a symptom. Just as we wouldn&rsquo;t expect a person with a broken leg to run a marathon, we cannot expect an active alcoholic to act with the logic or reliability of a healthy person.
      </p>
      <p>
        This understanding doesn&rsquo;t excuse the behavior, but it protects our hearts. It allows us to move from &ldquo;Why are they doing this to me?&rdquo; to &ldquo;This is what the disease looks like.&rdquo; By accepting the medical reality of the condition, we can finally stop being the judge and jury, and start focusing on our own recovery.
      </p>`,
    featuredDays: [5, 7, 8, 11, 94],
  },
  {
    slug: 'fellowship',
    name: 'Community & Fellowship',
    shortDescription: 'Breaking isolation and discovering you are not alone.',
    metaDescription: 'Break the isolation of living with alcoholism. Daily Al-Anon reflections on fellowship, connection, and the healing power of community.',
    image: 'articles/fellowship-hero.jpg',
    imageAlt: 'Hands joined in a circle on the grass',
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

/**
 * Topic-level relatedness for the reading page's "Related topics" cards —
 * each topic names its two nearest neighbors. Interim source until per-reading
 * secondary topics (topics[1..2]) arrive with the topics-v2 tagging.
 */
export const TOPIC_RELATED = {
  'detachment':            ['letting-go', 'boundaries'],
  'powerlessness':         ['letting-go', 'one-day-at-a-time'],
  'focus-on-yourself':     ['self-worth', 'boundaries'],
  'one-day-at-a-time':     ['powerlessness', 'gratitude-and-hope'],
  'boundaries':            ['detachment', 'focus-on-yourself'],
  'letting-go':            ['detachment', 'powerlessness'],
  'self-worth':            ['focus-on-yourself', 'honesty'],
  'higher-power':          ['powerlessness', 'gratitude-and-hope'],
  'honesty':               ['self-worth', 'focus-on-yourself'],
  'gratitude-and-hope':    ['one-day-at-a-time', 'higher-power'],
  'the-disease':           ['detachment', 'fellowship'],
  'fellowship':            ['the-disease', 'gratitude-and-hope'],
};

/**
 * Fallback pair for readings whose legacy tag maps to no topic yet, so the
 * Related topics scaffolding renders on every reading page: the collection
 * spine plus the most universally applicable topic.
 */
export const DEFAULT_RELATED_TOPICS = ['letting-go', 'one-day-at-a-time'];
