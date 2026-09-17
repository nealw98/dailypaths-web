/**
 * Letting Go — topic article content (bespoke structure, Aug 30 2026 handoff).
 *
 * Copy approved in the September 16, 2026 edited review canvas.
 * This concise revision supersedes the earlier ARTICLE.md handoff.
 * Reference comps for the inserts
 * live in design/handoff/topics/letting-go/reference-images/; the page renders
 * them as supplied insert artwork with equivalent accessible transcripts.
 *
 * Inline links use resolver markup rewritten at render time:
 *   <a data-reading="7">Title</a>        → the day-7 reading's URL
 *   <a data-theme="detachment">Label</a> → that topic page's URL
 */

export const LETTING_GO_ARTICLE = {
  slug: 'letting-go',
  title: 'Letting Go',
  definition: 'Caring without carrying &mdash; releasing the need to manage, fix, or control.',
  hero: {
    image: 'articles/letting-go-hero.jpg',
    alt: 'A woman pauses during a phone call at her dining table in warm evening light',
  },

  /**
   * The article flow, in order. Each entry is one of:
   *   { heading?, body: [paras] }  — prose section (heading optional)
   *   { pullQuote }                — standalone extracted quote
   *   { insert }                   — key into `inserts` below
   */
  sections: [
    {
      "heading": "The night shift",
      "body": [
        "You’re exhausted, but your mind won’t let you sleep.",
        "Your mind scans tomorrow for trouble. What crisis is coming? What disappointment lies ahead? What could you say, arrange, check, or prevent before things fall apart again?",
        "Then it turns toward yesterday. Why didn’t you see it sooner? What should you have done differently? If only you’d said the right thing, recognized the danger, or acted before it was too late.",
        "The mind moves between prediction and regret, reviewing the past as preparation for the future. Every possible situation feels urgent, a problem to be solved. Rest feels irresponsible when there may still be something you can figure out."
      ]
    },
    {
      "pullQuote": "Your body’s in bed, but part of you is still standing watch."
    },
    {
      "heading": "The promise hidden inside the worry",
      "body": [
        "Worry can feel like responsibility. It carries an unspoken promise: if you think hard enough, prepare carefully enough, and make the right choices, you can prevent the next crisis.",
        "When something’s already gone wrong, that promise turns into blame. Blaming yourself reinforces the idea that you had control in the first place. It supports the illusion that you can change the person, their drinking and their consequences if you could just figure out how."
      ]
    },
    {
      "insert": "worryLoop"
    },
    {
      "heading": "The impossible assignment",
      "body": [
        "The night shift doesn’t end in the morning either.",
        "It continues through checking phones, reading moods, tracking whereabouts, covering mistakes, paying bills, and searching for the words that’ll finally make someone understand. Another person’s life has become more important than your own.",
        "You may call it helping. Some of it may be. The painful question is whether you’re offering help or trying to guarantee an outcome.",
        "The January 7 reading, <em><a data-reading=\"7\">Impossible Responsibilities</a></em>, describes the relief of putting down responsibilities that were never ours to carry. That relief begins with an uncomfortable question:",
        "<em>Have I accepted an assignment that no human being could complete?</em>",
        "You didn’t create another person’s choices, and you can’t think, plead, plan, or suffer enough to control them. Recognizing this doesn’t mean you no longer love them. It means fear attached an impossible job to that love."
      ]
    },
    {
      "heading": "Caring without carrying",
      "body": [
        "Letting go isn’t shutting down, punishing someone with silence, or abandoning a person who needs appropriate help.",
        "You can listen without taking over. You can tell the truth without forcing someone to accept it. You can offer help without assuming responsibility for what they do next.",
        "That requires honesty in both directions. You don’t have to give in to guilt or pressure. You also have to recognize when your own rescuing, pleading, or bargaining becomes an attempt to make someone do what you want.",
        "Letting go respects another person’s dignity—their right to make decisions and live through their own journey. It also leaves you with decisions of your own."
      ]
    },
    {
      "insert": "whatReturns"
    },
    {
      "heading": "Let go and let God",
      "body": [
        "Even when that distinction is clear, you may still want to check one more time, make one more call, or offer one more warning. Stepping back can feel frightening when staying involved has been your way of feeling safe.",
        "<em>If I let go, who holds this?</em>",
        "“Let go and let God” offers somewhere to place that fear. I’m not asking God to produce the outcome I prefer. I’m placing someone I love in the care of a Higher Power, without directing what their journey should be."
      ]
    },
    {
      "pullQuote": "They have a higher power and I’m not it."
    },
    {
      "body": [
        "I have a Higher Power too. I can ask for help with the uncertainty, seek support, and resist the urge to step back in simply to ease my own discomfort. I don’t have to feel calm before I practice letting go.",
        "<a data-theme=\"higher-power\">Higher Power and Trust</a>"
      ]
    },
    {
      "heading": "Tonight’s next honest action",
      "body": [
        "Before you return to the night shift, ask yourself: <em>Is there something I need to do now, or am I trying to think my way into certainty?</em>",
        "There may be a conversation, a boundary, or a request for help that’s yours to make. You can acknowledge it and decide when to act without rehearsing every possible outcome.",
        "For tonight, letting go may be as simple as allowing the question to remain unanswered.",
        "The problem may still be here in the morning. You don’t have to solve it in your mind all night."
      ]
    }
  ],

  inserts: {
    worryLoop: {
      image: 'the_worry_loop_captioned.webp',
      visibleCaption: 'Worry often moves in a loop — between imagining what might happen, replaying what already happened, and feeling responsible for what we can’t control.',
      width: 1536,
      height: 1024,
      alt: 'The Worry Loop: What if, If only, and I should circle the thought &ldquo;Still awake. Still trying to solve it.&rdquo;',
      eyebrow: 'The worry loop',
      lede: 'My body’s exhausted, but my mind believes one more thought might prevent the next crisis.',
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
      image: 'whats_mine_whats_theirs_final.webp',
      width: 1189,
      height: 1323,
      alt: 'What’s Mine. What’s Theirs: two lists separate my choices, behavior, boundaries, safety, truth, help, and day from their choices, drinking, recovery, help, consequences, and opinions.',
      eyebrow: 'What&rsquo;s Mine. What&rsquo;s Theirs',
      inside: {
        title: 'What&rsquo;s mine',
        items: [
          'My choices',
          'My behavior',
          'My boundaries',
          'My safety',
          'The truth I need to face',
          'The help I need to ask for',
          'What I do with my own day',
        ],
      },
      outsideAbove: ['Their choices', 'Their drinking', 'Their recovery'],
      outsideBelow: ['Whether they accept help', 'Their consequences', 'What they think about my decisions'],
      caption: 'Letting go doesn&rsquo;t leave me with nothing to do. It brings me back to what’s actually mine.',
    },

  },

  readings: {
    heading: 'Continue with the Daily Paths readings',
    days: [355, 71, 43, 70],
  },

  relatedGuidePath: '/topics/one-day-at-a-time/',

  sources: [
    'Related Al-Anon principles are explored in <a href="https://ecomm.al-anon.org/ItemDetail?iProductCode=B32" target="_blank" rel="noopener noreferrer"><cite>How Al-Anon Works</cite></a>, <a href="https://ecomm.al-anon.org/ItemDetail?iProductCode=B24" target="_blank" rel="noopener noreferrer"><cite>Paths to Recovery</cite></a>, and <a href="https://ecomm.al-anon.org/ItemDetail?iProductCode=B16" target="_blank" rel="noopener noreferrer"><cite>Courage to Change</cite></a>.',
    'Daily Paths is an independent project and isn’t affiliated with Al-Anon Family Group Headquarters, Inc.',
  ],

  cta: {
    heading: 'Practice letting go, one day at a time.',
    text: 'Read, reflect, save what speaks to you, and use private journaling tools in the Daily Paths app.',
  },
};
