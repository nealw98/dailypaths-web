#!/usr/bin/env node

/**
 * Seed Script — Creates and populates steps + themes tables in Supabase.
 *
 * Prerequisites:
 *   1. Create the tables in Supabase Dashboard first (see SQL below).
 *   2. Run: node scripts/seed-steps-themes.mjs
 *
 * Required SQL to create tables (run in Supabase SQL Editor):
 *
 * -- Steps table
 * CREATE TABLE IF NOT EXISTS steps (
 *   id SERIAL PRIMARY KEY,
 *   number INTEGER NOT NULL UNIQUE,
 *   text TEXT NOT NULL,
 *   month TEXT NOT NULL,
 *   month_slug TEXT NOT NULL,
 *   principle TEXT NOT NULL,
 *   description TEXT[] NOT NULL DEFAULT '{}',
 *   questions TEXT[] NOT NULL DEFAULT '{}',
 *   hook TEXT,
 *   tagline TEXT,
 *   pull_quote TEXT,
 *   tools TEXT[] NOT NULL DEFAULT '{}',
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * -- Enable RLS but allow anon read
 * ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Allow anon read" ON steps FOR SELECT USING (true);
 *
 * -- Themes table
 * CREATE TABLE IF NOT EXISTS themes (
 *   id SERIAL PRIMARY KEY,
 *   slug TEXT NOT NULL UNIQUE,
 *   name TEXT NOT NULL,
 *   short_description TEXT,
 *   meta_description TEXT,
 *   image TEXT,
 *   image_alt TEXT,
 *   body TEXT,
 *   featured_days INTEGER[] NOT NULL DEFAULT '{}',
 *   pull_quote TEXT,
 *   theme_tags TEXT[] NOT NULL DEFAULT '{}',
 *   tools TEXT[] NOT NULL DEFAULT '{}',
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Allow anon read" ON themes FOR SELECT USING (true);
 */

import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates',
};

async function upsert(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to upsert ${table}: ${res.status} ${text}`);
  }
  console.log(`  Upserted ${rows.length} rows into ${table}`);
}

// ============ STEPS DATA ============

const STEP_HOOKS = {
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

const STEP_TAGLINES = {
  1: 'Honesty & the Power of Surrender',
  2: 'Hope & the Willingness to Believe',
  3: 'Faith & the Freedom of Letting Go',
  4: 'Courage & the Mirror of Self-Discovery',
  5: 'Integrity & the Liberation of Truth',
  6: 'Willingness & the Readiness to Change',
  7: 'Humility & the Strength of Asking',
  8: 'Love & the Path to Reconciliation',
  9: 'Justice & the Courage to Make Amends',
  10: 'Perseverance & the Practice of Awareness',
  11: 'Spiritual Awareness & the Discipline of Listening',
  12: 'Service & the Gift of Giving Back',
};

const STEP_PULL_QUOTES = {
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

const STEP_TOOLS = {
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

const STEPS = [
  {
    number: 1, text: 'We admitted we were powerless over alcohol \u2014 that our lives had become unmanageable.',
    month: 'January', month_slug: 'january', principle: 'Honesty',
    description: [
      'This Step challenges members to accept the reality of alcoholism as a disease, often summarized by the \u201cThree Cs\u201d: we didn\u2019t cause it, we can\u2019t control it, and we can\u2019t cure it. It means acknowledging that no amount of force, manipulation, or love can conquer another person\u2019s drinking.',
      'For the Al-Anon member, taking this Step brings immense relief and hope. By surrendering the futile battle against the alcoholic\u2019s behavior, members are free to redirect their energy toward their own well-being and spiritual growth. It shifts the focus from trying to fix others to healing oneself.',
      'The primary spiritual principle of Step One is honesty. It requires the honesty to admit that one\u2019s life has become chaotic and that self-will is insufficient to solve the problem. Acceptance and humility are also key, as members accept their limitations. This Step is critically important because it lays the foundation for recovery; only by admitting powerlessness can one open the door to the help and sanity offered by the subsequent Steps.',
    ],
    questions: [
      'In what ways have I tried to control another person\u2019s drinking or behavior?',
      'What has happened in my life that feels unmanageable?',
      'Can I accept that I am powerless over alcohol and other people\u2019s choices?',
      'What would it mean for me to stop fighting and simply admit the truth?',
      'How has my need to control affected my relationships, my health, and my peace of mind?',
    ],
  },
  {
    number: 2, text: 'Came to believe that a Power greater than ourselves could restore us to sanity.',
    month: 'February', month_slug: 'february', principle: 'Hope',
    description: [
      'This Step challenges members to recognize that their past efforts to manage the disease of alcoholism\u2014often characterized by the \u201cinsanity\u201d of repeating the same failing actions while expecting different results\u2014were futile. It means acknowledging that a source of help exists beyond one\u2019s own limited resources.',
      'For the Al-Anon member, this Step provides a much-needed lifeline out of isolation and despair. After admitting complete powerlessness in Step One, members are invited to open their minds to the possibility that a loving, nurturing Higher Power can bring peace and serenity into their lives. It means they no longer have to struggle alone and can begin to replace a distorted, fear-based view of life with clarity, balance, and self-acceptance.',
      'The primary spiritual principles of Step Two are hope and open-mindedness. It asks members to be willing to believe that help is possible, even if they do not yet fully understand it. Step Two is critically important because it offers the essential ingredient for recovery: hope. It bridges the gap between acknowledging defeat and taking constructive action, proving that sanity and serenity are attainable.',
    ],
    questions: [
      'What does \u201csanity\u201d look like in my daily life?',
      'Have I ever experienced a moment of clarity or peace that felt larger than myself?',
      'What stands in the way of my willingness to believe in something greater?',
      'When have I felt truly hopeful, even in difficult circumstances?',
      'What does \u201ca Power greater than ourselves\u201d mean to me personally?',
    ],
  },
  {
    number: 3, text: 'Made a decision to turn our will and our lives over to the care of God as we understood Him.',
    month: 'March', month_slug: 'march', principle: 'Faith',
    description: [
      'This Step means making a conscious commitment to stop relying entirely on self-will and to stop trying to force solutions on people and situations that are uncontrollable. Instead, it asks members to place their concerns, fears, and daily lives into the care of a Higher Power.',
      'For the Al-Anon member, taking this Step is the ultimate practice of the slogan \u201cLet Go and Let God\u201d. It brings enormous relief by lifting the heavy burden of responsibility for the alcoholic\u2014and for the universe\u2014off their shoulders. It means transitioning from an exhausting attitude of rigid control and self-sufficiency into a receptive, trusting partnership with a Higher Power.',
      'The core spiritual principles of Step Three are faith, trust, and surrender. It requires the faith to trust that we will be cared for, even when we let go of the reins. This Step is vitally important because it allows the member to relinquish their anxiety and actively seek spiritual guidance, creating the foundation necessary for all the recovery and growth Steps that follow.',
    ],
    questions: [
      'What does \u201cletting go\u201d mean to me in practical terms?',
      'In what areas of my life am I still trying to be in charge of outcomes?',
      'How might my life change if I trusted a Higher Power with my worries?',
      'What is the difference between making a decision and taking an action?',
      'Can I turn over my will without knowing what will happen next?',
    ],
  },
  {
    number: 4, text: 'Made a searching and fearless moral inventory of ourselves.',
    month: 'April', month_slug: 'april', principle: 'Courage',
    description: [
      'This Step challenges members to take an honest, balanced look at their personal traits, behaviors, and the assumptions that shape their lives. It means looking inward to carefully catalog both character defects\u2014such as a need for control, people-pleasing, or fear\u2014and positive assets.',
      'For the Al-Anon member, this Step is a vital journey of self-discovery. It means shifting the focus away from the alcoholic\u2019s behavior and recognizing how the family disease of alcoholism has affected their own actions and self-esteem. By breaking through denial and taking stock of their own reality, members learn they no longer have to play the role of the victim.',
      'The core spiritual principles of Step Four are courage, honesty, and self-love. It requires the courage to face hidden fears without self-condemnation and the honesty to stop justifying self-destructive behaviors. This Step is critically important because it clears away illusions and lays the groundwork for profound positive change. By knowing exactly who they are, members can begin to build a new life based on reality and self-respect.',
      'Al-Anon\u2019s Blueprint for Progress is a workbook designed specifically to guide members through the Fourth Step inventory.',
    ],
    questions: [
      'What character traits have helped me survive difficult situations?',
      'What patterns in my behavior have caused harm to myself or others?',
      'Am I willing to look honestly at both my strengths and my shortcomings?',
      'What fears come up when I think about examining my own behavior?',
      'How have the effects of someone else\u2019s alcoholism shaped who I am today?',
    ],
  },
  {
    number: 5, text: 'Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.',
    month: 'May', month_slug: 'may', principle: 'Integrity',
    description: [
      'This Step invites members to break their isolation by sharing the insights gained in Step Four. It means bringing secrets and shame into the open, fully acknowledging them before a Higher Power, oneself, and a trusted confidant, such as an Al-Anon sponsor.',
      'For the Al-Anon member, this Step is immensely liberating. Instead of hiding behind walls of fear and assuming they are uniquely flawed or \u201cthe worst person in the world,\u201d members discover that they are unconditionally loved and accepted, even with their imperfections. It means they can finally stop rationalizing their past behavior and take responsibility for their own lives.',
      'The primary spiritual principles of Step Five are trust, honesty, and courage. It requires immense trust to reveal one\u2019s darkest secrets to another person. This Step is vitally important because it relieves the heavy, suffocating burden of guilt and self-hatred. By sharing their humanity, members stop being victims of their past and take a huge stride toward personal freedom and a deeper spiritual connection.',
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
    number: 6, text: 'Were entirely ready to have God remove all these defects of character.',
    month: 'June', month_slug: 'june', principle: 'Willingness',
    description: [
      'This Step involves acknowledging the negative traits identified in our previous inventories and actively preparing to let them go. It means accepting that we are entirely powerless to remove these deeply ingrained shortcomings by our own self-will alone, and we must instead rely completely on the care of a Higher Power.',
      'For the Al-Anon member, working this Step often requires a grieving process. Many of our character defects, such as an intense need for control or a tendency toward denial, were originally developed as essential survival skills to help us cope with the chaos of an alcoholic environment. Members learn to stop fighting, relinquish the temporary \u201cpayoffs\u201d of these defects, and become fully willing to change.',
      'The core spiritual principles of Step Six are willingness, readiness, and trust. This Step is critically important because it bridges the crucial gap between mere self-awareness and actual transformation. It gracefully shifts the member from holding onto comfortable but destructive habits to embracing the limitless possibilities of profound healing. By consciously doing exactly this, we deliberately clear the path toward a much healthier, more serene, and truly fulfilling life.',
    ],
    questions: [
      'Which of my character defects am I most reluctant to give up? Why?',
      'How have my defects served me in the past, and what do they cost me now?',
      'What does \u201centirely ready\u201d mean \u2014 and am I there yet?',
      'Am I trying to remove my own defects, or am I willing to let God do it?',
      'What would my life look like without the patterns that no longer serve me?',
    ],
  },
  {
    number: 7, text: 'Humbly asked Him to remove our shortcomings.',
    month: 'July', month_slug: 'july', principle: 'Humility',
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
      'Am I willing to be changed, even if I don\u2019t know what the result will be?',
    ],
  },
  {
    number: 8, text: 'Made a list of all persons we had harmed, and became willing to make amends to them all.',
    month: 'August', month_slug: 'august', principle: 'Brotherly Love',
    description: [
      'This Step involves truly reviewing our past to identify people negatively impacted by our actions and actively cultivating the sincere desire to make things right. It means setting aside personal justification and taking absolute responsibility for our behavior, regardless of what others may have done to us.',
      'For the Al-Anon member, this Step often reveals the surprising truth that we have harmed ourselves most of all through neglect or desperate survival efforts, meaning our own name must go at the very top of the list. At this stage, we are not required to take immediate action; we only need to become fully willing.',
      'The core spiritual principles of Step Eight are willingness, honesty, responsibility, and love. This Step is extremely important because it thoroughly prepares our hearts for deep healing. By simply becoming completely willing to make amends, we deliberately unlock the heavy door to our painful past, gracefully release the toxic weight of lingering resentment, and carefully build the tremendous spiritual strength necessary to move forward freely into a much brighter future.',
    ],
    questions: [
      'Who have I harmed through my reactions to someone else\u2019s drinking?',
      'Am I on my own list of people I\u2019ve harmed?',
      'What is the difference between willingness and action in this step?',
      'Are there people I resist putting on my list? What does that resistance tell me?',
      'How do I distinguish between harm I\u2019ve caused and harm done to me?',
    ],
  },
  {
    number: 9, text: 'Made direct amends to such people wherever possible, except when to do so would injure them or others.',
    month: 'September', month_slug: 'september', principle: 'Justice',
    description: [
      'This is a crucial action Step where we take concrete measures to right the wrongs identified in our Step Eight list. It means bravely stepping forward to apologize, make restitution, or fundamentally alter our behavior, while using careful judgment to ensure our actions do not cause further harm.',
      'For the Al-Anon member, this Step is a profound commitment to justice, healing, and maturity. It shifts us from merely feeling guilty to actively cleaning up the debris of the past. Members learn that an amend is often different from a simple apology; sometimes the greatest amend we can make to our loved ones and to ourselves is a lasting change in our attitude and behavior.',
      'The primary spiritual principles of Step Nine are courage, humility, prudence, and justice. This Step is vitally important because it provides immense relief from the suffocating weight of guilt that has heavily burdened us. It completely restores our self-respect, beautifully heals damaged relationships, and finally sets us free to live a rewarding, joyous, and profoundly peaceful life in the reality of the present moment.',
    ],
    questions: [
      'Which amends feel most urgent? Which feel most frightening?',
      'How do I know when making amends would cause more harm than good?',
      'What does \u201cliving amends\u201d look like in my daily behavior?',
      'Am I making amends to clear my conscience, or to genuinely repair a relationship?',
      'Can I make amends without expecting forgiveness in return?',
    ],
  },
  {
    number: 10, text: 'Continued to take personal inventory and when we were wrong promptly admitted it.',
    month: 'October', month_slug: 'october', principle: 'Perseverance',
    description: [
      'This Step transitions the Al-Anon member from the deep clearing of past wreckage into the daily maintenance of continuous spiritual growth. It means consistently applying the self-awareness gained earlier to our everyday lives by taking regular \u201cspot checks\u201d or daily reviews of our thoughts and actions.',
      'For the Al-Anon member, this practice is essential to avoid slipping back into old, self-destructive survival patterns like controlling, people-pleasing, or reacting to the alcoholic\u2019s unpredictable behavior. By promptly admitting our mistakes, we prevent a new buildup of crippling guilt and resentment. Crucially, this Step also requires us to acknowledge our positive choices and successes, teaching us to love our humanness rather than demand perfection.',
      'The guiding spiritual principles are self-honesty, continuous responsibility, compassion, and forgiveness. Step Ten is vitally important because it keeps our emotional and spiritual slate completely clean. It allows us to continuously resolve inner conflicts in real-time, preventing the heavy accumulation of emotional baggage and ensuring we maintain the profound serenity and balanced relationships we have worked so hard to achieve.',
    ],
    questions: [
      'Do I regularly check in with myself about my motives and behavior?',
      'How quickly am I able to admit when I\u2019m wrong?',
      'What does a daily inventory look like for me?',
      'Do I tend to take too much responsibility for things, or too little?',
      'How has regular self-examination changed my relationships?',
    ],
  },
  {
    number: 11, text: 'Sought through prayer and meditation to improve our conscious contact with God as we understood Him, praying only for knowledge of His will for us and the power to carry that out.',
    month: 'November', month_slug: 'november', principle: 'Spiritual Awareness',
    description: [
      'This Step invites us to consciously maintain and actively deepen the intimate partnership with our Higher Power. It means establishing a disciplined spiritual practice where prayer is the act of talking to God, and meditation is the quiet discipline of listening for His guidance.',
      'For the Al-Anon member, this represents a profound surrender of self-will. We completely stop using frantic prayers to bargain with God or beg Him to cure the alcoholic\u2019s disease. Instead, we relinquish our personal agendas and simply ask for the clarity to know our path and the strength to walk it.',
      'The core spiritual principles are faith, profound surrender, trust, and spiritual awareness. Step Eleven is crucially important because it ensures we are never alone, isolated, or wandering aimlessly. By continually aligning our actions with a loving Higher Power, we tap into an unlimited source of daily strength and comfort, allowing us to navigate life\u2019s challenges with immense peace and live a deeply gratifying, unburdened life.',
    ],
    questions: [
      'What does my spiritual practice look like today?',
      'How do I distinguish between my will and a Higher Power\u2019s will?',
      'When have I felt most connected to something greater than myself?',
      'What forms of prayer or meditation have I tried? What works for me?',
      'How do I listen for guidance in my daily life?',
    ],
  },
  {
    number: 12, text: 'Having had a spiritual awakening as the result of these steps, we tried to carry this message to others, and to practice these principles in all our affairs.',
    month: 'December', month_slug: 'december', principle: 'Service',
    description: [
      'This final Step asks us to recognize the profound, life-changing transformation in perception we have experienced and to freely share the Al-Anon message with those who are still suffering. It means stepping out of isolation to engage in service\u2014whether by sponsoring a newcomer, answering phones, or simply listening\u2014without trying to give advice or manage anyone else\u2019s recovery.',
      'For the Al-Anon member, this Step is the beautiful culmination of the journey from crippling fear to connection and purpose. We learn the spiritual paradox that in order to keep the miraculous gift of our recovery, we must actively give it away to others.',
      'The core spiritual principles of this Step are unconditional love, selfless service, and immense gratitude. Step Twelve is vitally important because it permanently solidifies our healing. By consciously practicing these universal principles in all our affairs\u2014with our family, our coworkers, and our community\u2014we prove that the Twelve Steps are not just a survival tool, but a remarkably rewarding, permanent new way of life.',
    ],
    questions: [
      'How has my life changed since beginning this journey?',
      'In what ways can I share what I\u2019ve learned without giving advice?',
      'What does it mean to practice these principles in all my affairs \u2014 not just at meetings?',
      'What does \u201ccarrying the message\u201d look like for me?',
      'How do I continue growing when I feel like I\u2019ve \u201cdone the work\u201d?',
    ],
  },
];

// Merge metadata into step rows
const stepRows = STEPS.map(s => ({
  number: s.number,
  text: s.text,
  month: s.month,
  month_slug: s.month_slug,
  principle: s.principle,
  description: s.description,
  questions: s.questions,
  hook: STEP_HOOKS[s.number] || null,
  tagline: STEP_TAGLINES[s.number] || null,
  pull_quote: STEP_PULL_QUOTES[s.number] || null,
  tools: STEP_TOOLS[s.number] || [],
  updated_at: new Date().toISOString(),
}));

// ============ THEMES DATA ============

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

const TOPIC_TOOLS = {
  'detachment':            ['Slogan: Let Go and Let God', 'Slogan: Not My Circus, Not My Monkeys', 'Concept: Loving Separation'],
  'powerlessness':         ['Slogan: First Things First', 'Slogan: Easy Does It', 'Concept: The Three C\u2019s (I didn\u2019t Cause it, can\u2019t Control it, won\u2019t Cure it)'],
  'focus-on-yourself':     ['Slogan: Progress Not Perfection', 'Concept: Amends (The 8th & 9th Step process)', 'Action: Releasing a resentment'],
  'one-day-at-a-time':     ['Slogan: Keep It Simple', 'Slogan: How Important Is It?', 'Concept: The Hula Hoop (Staying inside your own circle)', 'Action: A \u201cGod Box\u201d (putting worries inside)'],
  'boundaries':            ['Slogan: Say what you mean, mean what you say, but don\u2019t say it mean', 'Concept: JADE (Justify, Argue, Defend, Explain)'],
  'letting-go-of-control': ['Slogan: Easy Does It', 'Concept: The Leap of Faith', 'Action: Saying \u201cYes\u201d to a sponsor or a service position'],
  'self-worth':            ['Slogan: Live and Let Live', 'Concept: The 4th Step Moral Inventory', 'Action: Admitting a mistake without an excuse'],
  'higher-power':          ['Slogan: Just for Today', 'Concept: A Power Greater Than Ourselves', 'Action: Attending one more meeting'],
  'honesty':               ['Slogan: Keep an Open Mind', 'Concept: Rigorous Honesty', 'Action: Mirror Work (Looking at our own part)'],
  'gratitude-and-hope':    ['Slogan: Count Your Blessings', 'Concept: The Gratitude List', 'Action: Sharing one thing you\u2019re thankful for at the end of a meeting'],
  'the-disease':           ['Read about the family disease', 'Practice the Three C\u2019s', 'Replace blame with compassion', 'Attend an open AA meeting'],
  'fellowship':            ['Slogan: When Anyone, Anywhere Reaches Out', 'Concept: The Twelfth Step', 'Action: Setting up chairs or being a Greeter'],
};

const THEMES_RAW = [
  { slug: 'detachment', name: 'Detachment with Love', shortDescription: 'Separating yourself from the chaos without cutting off the caring.', metaDescription: 'Learn to separate your peace from someone else\u2019s choices. Daily reflections on loving detachment in Al-Anon recovery.', image: 'detachment.jpg', imageAlt: 'Woman finding peace on her porch \u2014 detachment with love in Al-Anon recovery', body: '<p><strong>What is Detachment?</strong></p>\n<p>In the world of recovery, <strong>detachment</strong> is perhaps the most misunderstood principle\u2014and the most life-saving. To the newcomer, detachment can sound like coldness, indifference, or a way of \u201cgiving up\u201d on the person they love. But in practice, detachment is an act of profound compassion for both the alcoholic and ourselves.</p>\n<p>Detachment is the realization that we cannot \u201ccare\u201d someone into sobriety. We didn\u2019t cause the disease, we can\u2019t control it, and we cannot cure it. When we obsessively monitor, manage, or shield the alcoholic from the consequences of their drinking, we aren\u2019t helping them recover; we are simply joining them in the chaos. We become a \u201cbuffer\u201d between the drinker and the very consequences that might eventually lead them to seek help.</p>\n<p>Detaching means <strong>letting go of the results</strong>. It is the process of untangling our emotional well-being from the behavior of another person. We learn to separate the person we love from the disease they suffer from. We stop being the \u201cmanager\u201d of their life so we can finally become the \u201cowner\u201d of our own.</p>\n<p>Practicing detachment with love allows us to stop reacting and start living. It gives us the space to breathe, even when the storm is still blowing. By stepping back, we stop the futile cycle of \u201cfixing\u201d and begin the necessary work of healing. We learn that we can love someone deeply without allowing their choices to destroy our serenity. Detachment isn\u2019t about leaving the person; it\u2019s about finding ourselves again.</p>', featuredDays: [102, 211, 289, 252, 346] },
  { slug: 'powerlessness', name: 'Powerlessness & Surrender', shortDescription: 'Accepting what we cannot control and letting go of the rest.', metaDescription: 'Accept what you cannot control and discover the freedom in letting go. Daily Al-Anon reflections on powerlessness and surrender.', image: 'powerlessness.jpg', imageAlt: 'Two women hiking together at sunset \u2014 finding freedom through surrender in Al-Anon recovery', body: '<p><strong>Surrendering the Illusion of Control</strong></p>\n<p>Step 1 is often the hardest pill to swallow because it requires us to admit that our best thinking hasn\u2019t worked. <em>We admitted we were powerless over alcohol\u2014and that our lives had become unmanageable.</em> To the newcomer, \u201cpowerless\u201d sounds like weakness. But in 30 years of recovery, I\u2019ve seen that Step 1 is actually the ultimate act of courage.</p>\n<p>Admitting unmanageability means we stop trying to do the impossible. We stop trying to \u201cmanage\u201d the unmanageable disease in another person. The \u201cpowerlessness\u201d isn\u2019t about the alcoholic; it\u2019s about our own futile attempts to control them. When we stop fighting the reality of the situation, we stop losing the battle.</p>\n<p>The magic of Step 1, however, is found in the very first word: <strong>\u201cWe.\u201d</strong> Recovery doesn\u2019t happen in isolation. It happens when we peer through the window and realize that there are others who have felt exactly what we feel. By admitting we can\u2019t do it alone, we open the door to a community that can walk the path with us. Powerlessness over the disease is where our power over our own lives finally begins.</p>', featuredDays: [11, 15, 16, 153, 357] },
  { slug: 'focus-on-yourself', name: 'Focus on Yourself', shortDescription: 'Shifting attention from the alcoholic back to your own life.', metaDescription: 'Turn the focus back to your own life after years of watching someone else\u2019s. Daily Al-Anon reflections on reclaiming your attention and energy.', image: 'focus-on-yourself.jpg', imageAlt: 'Woman focused on pottery at a wheel \u2014 turning attention back to yourself in Al-Anon recovery', body: '<p>Forgiveness is the act of setting a prisoner free and discovering that the prisoner was you. It is a gift we give ourselves to stop the past from dictating our present peace.</p>', featuredDays: [6, 17, 21, 22, 237] },
  { slug: 'one-day-at-a-time', name: 'One Day at a Time', shortDescription: 'Releasing anxiety about the future and regret about the past.', metaDescription: 'Let go of tomorrow\u2019s worry and yesterday\u2019s regret. Daily Al-Anon reflections on staying present and living one day at a time.', image: 'one-day-at-a-time.jpg', imageAlt: 'Two friends laughing together in a park \u2014 embracing the present moment in Al-Anon recovery', body: '<p>Serenity is the \u201ccalm in the storm.\u201d It is the discovery that our internal peace does not have to be dependent on the external chaos of our environment.</p>', featuredDays: [60, 64, 248, 199, 275] },
  { slug: 'boundaries', name: 'Boundaries', shortDescription: 'Learning to say no as an act of self-respect, not selfishness.', metaDescription: 'Learn to say no without guilt and set healthy limits. Daily Al-Anon reflections on boundaries as self-respect, not selfishness.', image: 'boundaries.jpg', imageAlt: 'Two women talking on a street corner with healthy space between them \u2014 setting boundaries in Al-Anon recovery', body: '<p>Living with alcoholism blurs every line. We absorb other people\u2019s moods, carry their responsibilities, and lose track of where their crisis ends and our life begins.</p>\n<p>Boundaries aren\u2019t walls. They\u2019re the foundation that makes real love possible \u2014 the recognition of where I end and you begin.</p>', featuredDays: [8, 9, 23, 99, 114] },
  { slug: 'letting-go-of-control', name: 'Letting Go of Control', shortDescription: 'Recognizing the many ways we try to manage, fix, or manipulate outcomes.', metaDescription: 'Stop managing, fixing, and controlling what was never yours to carry. Daily Al-Anon reflections on releasing the need to control.', image: 'letting-go-of-control.jpg', imageAlt: 'Two women laughing together while cooking \u2014 letting go of control in Al-Anon recovery', body: '<p>Willingness is the \u201ckey in the lock.\u201d It doesn\u2019t require us to have the solution; it only requires the desire to be taught a new way to live and a readiness to let go of old defenses.</p>', featuredDays: [3, 72, 168, 266, 320] },
  { slug: 'self-worth', name: 'Self-Worth & Identity', shortDescription: 'Reclaiming the sense of self that years of crisis eroded.', metaDescription: 'Rediscover who you are beyond someone else\u2019s crisis. Daily Al-Anon reflections on rebuilding self-worth and reclaiming your identity.', image: 'self-worth.jpg', imageAlt: 'Woman looking at her reflection in a mirror \u2014 reclaiming self-worth and identity in Al-Anon recovery', body: '<p>Humility is the clear-eyed view of our true selves\u2014neither better than nor worse than anyone else. It is the freedom from the burden of having to be \u201cright\u201d or \u201cin charge\u201d all the time.</p>', featuredDays: [103, 158, 170, 186, 290] },
  { slug: 'higher-power', name: 'Trusting a Higher Power', shortDescription: 'Finding a source of guidance beyond your own willpower.', metaDescription: 'Find a source of strength beyond your own willpower. Daily Al-Anon reflections on trusting a Higher Power and letting go of self-reliance.', image: 'higher-power.jpg', imageAlt: 'Man holding his father\u2019s hand at a hospital bedside \u2014 trusting a Higher Power in Al-Anon recovery', body: '<p>Hope is the quiet confidence that the future can be different. It is fueled by hearing the stories of those who have walked the path before us and found a way out of the dark.</p>', featuredDays: [35, 36, 43, 84, 162] },
  { slug: 'honesty', name: 'Honesty & Self-Awareness', shortDescription: 'Getting truthful about your own patterns, motives, and feelings.', metaDescription: 'Stop performing and start telling the truth \u2014 to yourself first. Daily Al-Anon reflections on honesty, self-awareness, and dropping the mask.', image: 'honesty.jpg', imageAlt: 'Two women in honest conversation over coffee \u2014 honesty and self-awareness in Al-Anon recovery', body: '<p>In recovery, honesty is more than just telling the truth; it is the removal of the masks we wore to survive. It begins with the courage to be honest with ourselves about our own feelings and needs.</p>', featuredDays: [50, 92, 115, 126, 278] },
  { slug: 'gratitude-and-hope', name: 'Gratitude & Hope', shortDescription: 'Moving from despair toward appreciation for progress, even when circumstances haven\u2019t changed.', metaDescription: 'Find gratitude even when nothing has changed but you. Daily Al-Anon reflections on hope, appreciation, and inner progress.', image: 'gratitude-and-hope.jpg', imageAlt: 'Woman breathing in peacefully by a lake at sunset \u2014 gratitude and hope in Al-Anon recovery', body: '<p>Gratitude is a muscle we build by looking for the light in the midst of the struggle. It shifts our focus from what is missing to the abundance that is already here.</p>', featuredDays: [34, 41, 116, 339, 360] },
  { slug: 'the-disease', name: 'Understanding the Disease', shortDescription: 'Seeing alcoholism as an illness, not a moral failing.', metaDescription: 'See alcoholism as an illness, not a personal failing. Daily Al-Anon reflections on understanding the disease and finding compassion.', image: 'the-disease.jpg', imageAlt: 'Couple sitting together on a park bench in autumn \u2014 understanding the disease of alcoholism in Al-Anon recovery', body: '<p><strong>The Shift from Blame to Compassion</strong></p>\n<p>When we live with alcoholism, it is easy to view the drinker\u2019s behavior as a personal attack. We see the broken promises, the hidden bottles, and the missed events as choices made specifically to hurt us. This perspective keeps us trapped in a cycle of resentment and exhaustion.</p>\n<p><strong>Understanding the disease</strong> changes the fundamental nature of the problem. When we accept that alcoholism is a progressive, chronic illness\u2014not a lack of willpower or a moral defect\u2014the \u201cwindow\u201d of our perspective shifts. We realize that we have been trying to argue with a symptom. Just as we wouldn\u2019t expect a person with a broken leg to run a marathon, we cannot expect an active alcoholic to act with the logic or reliability of a healthy person.</p>\n<p>This understanding doesn\u2019t excuse the behavior, but it protects our hearts. It allows us to move from \u201cWhy are they doing this to me?\u201d to \u201cThis is what the disease looks like.\u201d By accepting the medical reality of the condition, we can finally stop being the judge and jury, and start focusing on our own recovery.</p>', featuredDays: [5, 7, 8, 11, 94] },
  { slug: 'fellowship', name: 'Community & Fellowship', shortDescription: 'Breaking isolation and discovering you are not alone.', metaDescription: 'Break the isolation of living with alcoholism. Daily Al-Anon reflections on fellowship, connection, and the healing power of community.', image: 'fellowship.jpg', imageAlt: 'Women connecting outside an Al-Anon meeting at sunset \u2014 community and fellowship in recovery', body: '<p>We keep what we have by giving it away. Service is the ultimate act of detachment and love, reminding us that we are part of a larger whole.</p>', featuredDays: [1, 127, 139, 338, 342] },
];

const themeRows = THEMES_RAW.map(t => ({
  slug: t.slug,
  name: t.name,
  short_description: t.shortDescription,
  meta_description: t.metaDescription,
  image: t.image,
  image_alt: t.imageAlt,
  body: t.body,
  featured_days: t.featuredDays,
  pull_quote: TOPIC_PULL_QUOTES[t.slug] || null,
  theme_tags: TOPIC_THEME_TAGS[t.slug] || [],
  tools: TOPIC_TOOLS[t.slug] || [],
  updated_at: new Date().toISOString(),
}));

// ============ RUN ============

async function main() {
  console.log('Seeding steps and themes to Supabase...');
  console.log(`  URL: ${SUPABASE_URL}`);

  await upsert('steps', stepRows);
  await upsert('themes', themeRows);

  console.log('\nDone! Tables seeded successfully.');
  console.log('NOTE: You must first create the tables in the Supabase SQL Editor.');
  console.log('See the SQL at the top of this file.');
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
