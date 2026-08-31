/**
 * Letting Go — topic article content (bespoke structure, Aug 30 2026 handoff).
 *
 * Approved copy source: design/handoff/topics/letting-go/ARTICLE.md — do not
 * rewrite. Structure follows STORYBOARD.md's emotional journey and supersedes
 * the fixed four-chapter spine for this page. Reference comps for the inserts
 * live in design/handoff/topics/letting-go/reference-images/; the page renders
 * them as responsive live text, never as embedded images.
 *
 * Inline links use resolver markup rewritten at render time:
 *   <a data-reading="7">Title</a>        → the day-7 reading's URL
 *   <a data-theme="detachment">Label</a> → that topic page's URL
 */

export const LETTING_GO_ARTICLE = {
  slug: 'letting-go-of-control',
  title: 'Letting Go',
  definition: 'Caring without carrying &mdash; releasing the need to manage, fix, or control.',
  hero: {
    image: 'themes-hero.jpg',
    alt: 'Forest path through morning light — letting go in Al-Anon recovery',
  },

  /**
   * The article flow, in order. Each entry is one of:
   *   { heading?, body: [paras] }  — prose section (heading optional)
   *   { pullQuote }                — standalone extracted quote
   *   { insert }                   — key into `inserts` below
   */
  sections: [
    {
      heading: 'The night shift',
      body: [
        'You are exhausted, but your mind won&rsquo;t let you sleep.',
        'Your mind scans tomorrow for trouble. What crisis is coming? What disappointment lies ahead? What could you say, arrange, check, or prevent before things fall apart again?',
        'Then it turns toward yesterday. Why didn&rsquo;t you see it sooner? What should you have done differently? If only you had said the right thing, recognized the danger, or acted before it was too late.',
        'The mind moves between prediction and regret, reviewing the past as preparation for the future. Every possible situation feels urgent, a problem to be solved. Rest feels irresponsible when there may still be something you can figure out.',
        'Your body is in bed, but part of you is still standing watch.',
      ],
    },
    { pullQuote: 'When someone I love is struggling, letting go can feel like betrayal. I want the best for them. I can see the danger, the consequences, and all the things that might go wrong. If I can help, why shouldn&rsquo;t I?' },
    {
      heading: 'The promise hidden inside the worry',
      body: [
        'Worry can feel like responsibility. It carries an unspoken promise: if you think hard enough, prepare carefully enough, and make the right choices, perhaps you can prevent the next crisis.',
        'If something has already gone wrong, the promise simply changes direction. <em>I should have known. If only I had done more. Why didn&rsquo;t I stop it?</em>',
        'Replaying the past cannot change it, but it can preserve the belief that control was possible. Sometimes blaming yourself feels less frightening than accepting that you were powerless over the outcome.',
      ],
    },
    { insert: 'worryLoop' },
    {
      heading: 'The impossible assignment',
      body: [
        'The night shift does not end in the morning.',
        'It continues through checking phones, reading moods, tracking whereabouts, covering mistakes, paying bills, rehearsing conversations, and searching for the words that will finally make someone understand.',
        'You may call it helping. You may believe that staying alert is what love requires. Meanwhile, another person&rsquo;s life becomes the problem you are always solving while your own life waits.',
        'The January 7 reading, <em><a data-reading="7">Impossible Responsibilities</a></em>, describes the relief of putting down responsibilities that were never ours to carry. That relief begins with an uncomfortable question:',
        '<em>Have I accepted an assignment that no human being could complete?</em>',
      ],
    },
    {
      heading: 'The painful recognition',
      body: [
        'Letting go begins with honesty, not serenity.',
        'Some of what you have called responsibility may be an attempt to control what frightens you. Monitoring offers a momentary sense of safety. Rescuing postpones a consequence. Rehearsing creates the feeling that one perfect conversation might finally produce change.',
        'Recognizing this does not mean you no longer love them. It means fear attached an impossible job to that love.',
        'You did not create another person&rsquo;s choices, and you cannot think, plead, plan, or suffer enough to control them. &ldquo;If only&rdquo; and &ldquo;I should have&rdquo; keep you mentally responsible for a past you cannot change. &ldquo;What if&rdquo; makes you responsible for a future that has not arrived.',
        'Letting go means releasing more than a particular outcome. It means releasing the belief that sufficient vigilance could have guaranteed it.',
      ],
    },
    {
      heading: 'Caring without carrying',
      body: [
        'Letting go is not shutting down. It is not punishing someone with silence, pretending their pain does not matter, or abandoning a person who needs appropriate help.',
        'You can listen without taking over. You can tell the truth without forcing someone to accept it. You can offer help without assuming responsibility for what they do next.',
        'An honest inventory has two sides:',
        'It also does not require me to accept manipulation. I can decline guilt, pressure, threats, and manufactured emergencies. At the same time, I have to look honestly at the ways I may manipulate too&mdash;through rescuing, pleading, monitoring, bargaining, or arranging consequences to force the outcome I want. Seeing my own behavior clearly does not excuse theirs. It simply returns my attention to the part I can change.',
        'Letting go returns another person&rsquo;s choices and consequences to them. In doing so, it respects their dignity&mdash;their right to make decisions and live through their own journey.',
        'It also returns you to yours.',
        '<em>I can love someone without making myself responsible for what happens next.</em>',
      ],
    },
    {
      heading: 'What returns to me',
      body: [
        'When your attention has been fixed on someone else&rsquo;s behavior, letting go may initially feel like being left with nothing. But there is still a life here that needs your honesty and care.',
        'You have choices. You can decide what you will and will not do. You can protect your safety, seek support, face the truth, and stop covering what is not yours to conceal.',
      ],
    },
    { insert: 'whatReturns' },
    {
      body: [
        'Letting go is not doing nothing. It is doing what belongs to you without claiming power over the result.',
      ],
    },
    {
      heading: 'Living through the discomfort',
      body: [
        'Knowing what is not yours does not make the urge to pick it up disappear.',
        'You may still want to check one more time, make one more call, offer one more warning, or replay the conversation once more. Your mind has learned to use control for relief. When you stop, fear and uncertainty may become more noticeable for a while.',
        'Letting go is rarely a single decision. When fear persuades you to pick the burden up again, you can notice it, ask for support, and place it back in your Higher Power&rsquo;s care.',
      ],
    },
    { insert: 'letGoLetGod' },
    {
      heading: 'Tonight&rsquo;s next honest action',
      body: [
        'You do not need to solve the whole situation before you can rest. You only need to identify what belongs to you now.',
      ],
    },
    { insert: 'nextHonestAction' },
    {
      body: [
        'Tomorrow may bring a conversation, a boundary, a request for help, or a difficult truth you need to face. If action is yours to take, you can take it when the time is right.',
        'For tonight, letting go may be as simple as allowing the question to remain unanswered.',
        'The problem may still be here in the morning. You do not have to solve it in your mind all night.',
      ],
    },
  ],

  inserts: {
    worryLoop: {
      image: 'the_worry_loop.webp',
      alt: 'The Worry Loop — What if?, If only…, and I should… circle a sleepless center: still awake, still trying to solve it.',
      eyebrow: 'The worry loop',
      lede: 'My body is exhausted, but my mind believes one more thought might prevent the next crisis.',
      stations: [
        {
          title: 'What if?',
          sub: 'Scanning the future',
          lines: ['What might happen tomorrow?', 'What am I missing?', 'How can I stop it?'],
        },
        {
          title: 'If only&hellip;',
          sub: 'Reviewing the past',
          lines: ['Why didn&rsquo;t I see it sooner?', 'What should I have said?', 'Could I have prevented this?'],
        },
        {
          title: 'I should&hellip;',
          sub: 'Taking responsibility',
          lines: ['I should know what to do.', 'I should be able to fix this.', 'I should be able to keep everyone safe.'],
        },
      ],
      center: 'Still awake. Still trying to solve it.',
      caption: 'The loop promises control. What it produces is vigilance, guilt, and exhaustion.',
    },

    whatReturns: {
      image: 'returning_responsibility.webp',
      alt: 'Returning responsibility — what is mine sits inside a lit circle; their choices, recovery, and consequences stay outside on the dark water.',
      eyebrow: 'Returning responsibility',
      inside: {
        title: 'What returns to me',
        items: [
          'My choices and conduct',
          'My boundaries and safety',
          'The truth I need to face',
          'The support I can seek',
          'My own life and well-being',
        ],
      },
      outsideAbove: ['Their choices', 'Their recovery'],
      outsideBelow: ['Whether they accept help', 'Their consequences', 'What they think of my decisions'],
      caption: 'Letting go does not leave me with nothing. It returns me to the life I can actually live.',
    },

    letGoLetGod: {
      heading: 'Let go and let God',
      question: 'If I let go, who holds this?',
      body: [
        'Letting go can feel like dropping someone into emptiness. Faith changes that movement.',
        'I am not handing the situation over to fate, nor asking God to produce the outcome I prefer. I am placing what I cannot carry into the care of a Higher Power.',
        'They have a Higher Power, and I am not it. I have a Higher Power too, and I do not have to face this alone.',
        'I still tell the truth, protect my safety, set boundaries, and take the actions that belong to me. I do what is mine and place the outcome in God&rsquo;s care.',
      ],
      quote: 'Faith does not always make letting go easy. It makes letting go possible.',
      link: { theme: 'higher-power', label: 'Higher Power and Trust' },
    },

    nextHonestAction: {
      eyebrow: 'A letting-go practice',
      questions: [
        'What is my mind trying to prevent?',
        'Am I caught in &lsquo;what if,&rsquo; &lsquo;if only,&rsquo; or &lsquo;I should&rsquo;?',
        'Does anything actually belong to me tonight?',
        'What one action can I take when the time is right?',
        'What do I need to place in my Higher Power&rsquo;s care?',
      ],
      close: 'Rest can be a responsible choice.',
    },
  },

  readings: {
    heading: 'Continue with the Daily Paths readings',
    days: [355, 71, 43, 70],
  },

  sources: [
    'Related Al-Anon principles are explored in <a href="https://ecomm.al-anon.org/ItemDetail?iProductCode=B32" target="_blank" rel="noopener noreferrer"><cite>How Al-Anon Works</cite></a>, <a href="https://ecomm.al-anon.org/ItemDetail?iProductCode=B24" target="_blank" rel="noopener noreferrer"><cite>Paths to Recovery</cite></a>, and <a href="https://ecomm.al-anon.org/ItemDetail?iProductCode=B16" target="_blank" rel="noopener noreferrer"><cite>Courage to Change</cite></a>. The Daily Paths readings linked above explore how those principles apply to letting go.',
    'Daily Paths is an independent project and is not affiliated with Al-Anon Family Group Headquarters, Inc.',
  ],

  cta: {
    heading: 'Practice letting go, one day at a time.',
    text: 'Read, reflect, save what speaks to you, and use private journaling tools in the Daily Paths app.',
  },
};
