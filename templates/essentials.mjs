import { wrapInLayout } from './base.mjs';
import { bp, BASE_URL } from '../helpers/config.mjs';

export function renderEssentialsPage() {
  const mainEssentials = [
    {
      id: 'just-for-today',
      title: 'Just for Today',
      logic: 'A daily discipline of manageable intention. Each line is a small, practical vow that keeps us from spiraling into anxiety about the future or regret about the past.',
      paragraphs: [
        'Just for today I will try to live through this day only, and not tackle my whole life problem at once.',
        'Just for today I will be happy. This assumes to be true what Abraham Lincoln said, that &ldquo;most folks are as happy as they make up their minds to be.&rdquo;',
        'Just for today I will adjust myself to what is and not try to adjust everything to my own desires.',
        'Just for today I will try to strengthen my mind. I will study. I will learn something useful. I will not be a mental loafer. I will read something that requires effort, thought, and concentration.',
        'Just for today I will exercise my soul in three ways: I will do somebody a good turn and not get found out. I will do at least two things I don&rsquo;t want to do, just for exercise.',
        'Just for today I will be agreeable. I will look as well as I can, dress becomingly, talk low, act courteously, criticize not one bit, not find fault with anything, and not try to improve or regulate anybody except myself.',
        'Just for today I will have a program. I may not follow it exactly, but I will have it. I will save myself from two pests: hurry and indecision.',
        'Just for today I will have a quiet half hour all by myself and relax. During this half hour, sometime, I will try to get a better perspective of my life.',
        'Just for today I will be unafraid. Especially I will not be afraid to enjoy what is beautiful and to believe that as I give to the world, so the world will give to me.',
      ],
    },
    {
      id: 'just-for-tonight',
      title: 'Just for Tonight',
      logic: 'The evening companion to &ldquo;Just for Today.&rdquo; It offers a way to close the day with gratitude and surrender, releasing what cannot be fixed tonight.',
      paragraphs: [
        'Just for tonight, I will be grateful. I will give thanks for the past day &mdash; its failures as well as its successes, its sadness as well as its joy and its pain as well as its pleasure. I will take comfort in knowing that every event and circumstance that occurred today can be used for my good and the good of others.',
        'Just for tonight, I will accept that I have done the best I could, remembering that my goal is spiritual progress and not perfection. I will let go of any expectation I had for this day, as well as any disappointment, shame or guilt I felt for not being perfect today.',
        'Just for tonight, I will be humble. I will give my shortcomings to a Power greater than myself, trusting that doing so can bring about changes in me that I could not bring about by myself.',
        'Just for tonight, I will not attempt to rectify today&rsquo;s mistakes or solve tomorrow&rsquo;s problems. I will remind myself that I am better able to receive guidance when my mind and body are rested and refreshed.',
        'Just for tonight, I will set aside my fears, frustrations and aspirations and take a few minutes to review the abundance that exists in my life today. I will place my future in the care of a loving God of my own understanding, trusting my needs will be met at a time and in a way that is best for all concerned.',
      ],
    },
    {
      id: 'let-go',
      title: 'Letting Go',
      logic: 'A meditation on what detachment actually looks like in practice. Each line redefines &ldquo;letting go&rdquo; as an act of love, not abandonment.',
      paragraphs: [
        'To &ldquo;let go&rdquo; does not mean to stop caring, it means I can&rsquo;t do it for someone else.',
        'To &ldquo;let go&rdquo; is not to cut myself off, it&rsquo;s the realization I can&rsquo;t control another.',
        'To &ldquo;let go&rdquo; is not to enable, but to allow learning from natural consequences.',
        'To &ldquo;let go&rdquo; is to admit powerlessness, which means the outcome is not in my hands.',
        'To &ldquo;let go&rdquo; is not to try to change or blame another, it&rsquo;s to make the most of myself.',
        'To &ldquo;let go&rdquo; is not to care for, but to care about.',
        'To &ldquo;let go&rdquo; is not to fix, but to be supportive.',
        'To &ldquo;let go&rdquo; is not to judge, but to allow another to be a human being.',
        'To &ldquo;let go&rdquo; is not to be in the middle arranging all the outcomes, but to allow others to affect their own destinies.',
        'To &ldquo;let go&rdquo; is not to deny, but to accept.',
        'To &ldquo;let go&rdquo; is not to nag, scold, or argue, but instead to search out my own shortcomings and correct them.',
        'To &ldquo;let go&rdquo; is not to criticize and regulate anybody, but to try to become what I dream I can be.',
        'To &ldquo;let go&rdquo; is to fear less and to love more.',
      ],
    },
    {
      id: 'promises',
      title: 'The Al-Anon Promises',
      logic: 'A description of the &ldquo;spiritual awakening&rdquo; in action. These promises show us what a life of dignity and purpose looks like after the wreckage has been cleared.',
      paragraphs: [
        'If we willingly surrender ourselves to the spiritual discipline of the Twelve Steps, our lives will be transformed. We will become mature, responsible individuals with a great capacity for joy, fulfillment, and wonder.',
        'Though we may never be perfect, continued spiritual progress will reveal to us our enormous potential. We will discover that we are worthy of love and loving.',
        'We will love others without losing ourselves, and will learn to accept love in return.',
        'Our sight, once clouded and confused, will clear and we will be able to perceive reality and recognize truth.',
        'Courage and fellowship will replace fear.',
        'We will be able to risk failure to develop new, hidden talents.',
        'Our lives, no matter how battered and degraded, will yield hope to share with others.',
        'We will begin to feel and will come to know the vastness of our emotions, but we will not be slaves to them.',
        'Our secrets will no longer bind us in shame.',
        'As we gain the ability to forgive ourselves, our families, and the world, our choices will expand.',
        'With dignity we will stand for ourselves, but not against our fellows.',
        'Serenity and peace will have meaning for us as we allow our lives and the lives of those we love to flow day by day with God&rsquo;s ease, balance, and grace.',
        'No longer terrified, we will discover we are free to delight in life&rsquo;s paradox, mystery, and awe.',
        'We will laugh more.',
        'Fear will be replaced by faith, and gratitude will come naturally as we realize that our Higher Power is doing for us what we cannot do for ourselves.',
      ],
      source: 'From Survival to Recovery, p. 269-270',
    },
    {
      id: 'st-francis',
      title: 'Prayer of St. Francis',
      logic: 'A prayer of radical service. It inverts our instinct to seek comfort and asks us instead to become instruments of peace for others.',
      noItalic: true,
      sections: [
        {
          lines: [
            'Lord, make me a channel of thy peace,',
            'that where there is hatred, I may bring love;',
            'that where there is wrong, I may bring the spirit of forgiveness;',
            'that where there is discord, I may bring harmony;',
            'that where there is error, I may bring truth;',
            'that where there is doubt, I may bring faith;',
            'that where there is despair, I may bring hope;',
            'that where there are shadows, I may bring light;',
            'that where there is sadness, I may bring joy.',
          ],
        },
        {
          lines: [
            'Lord, grant that I may seek rather to',
            'comfort than to be comforted;',
            'to understand, than to be understood;',
            'to love, than to be loved.',
          ],
        },
        {
          lines: [
            'For it is by self-forgetting that one finds.',
            'It is by forgiving that one is forgiven.',
            'It is by dying that one awakens to Eternal Life.',
          ],
        },
      ],
      source: 'St. Francis of Assisi',
    },
  ];

  const recoveryAnchors = [
    {
      id: 'serenity',
      title: 'Serenity Prayer',
      logic: 'The cornerstone of every meeting. It draws a clean line between what we can and cannot control&mdash;a line most of us have spent years ignoring.',
      lines: [
        'God, grant me the serenity',
        'to accept the things I cannot change,',
        'courage to change the things I can,',
        'and wisdom to know the difference.',
      ],
      source: 'Reinhold Niebuhr',
    },
    {
      id: 'third-step',
      title: 'Third Step Prayer',
      logic: 'The moment of surrender. We offer ourselves&mdash;our will, our plans, our control&mdash;and ask to be used for a purpose greater than our fear.',
      paragraphs: [
        'God, I offer myself to Thee &mdash; to build with me and to do with me as Thou wilt. Relieve me of the bondage of self, that I may better do Thy will. Take away my difficulties, that victory over them may bear witness to those I would help of Thy Power, Thy Love, and Thy Way of life. May I do Thy will always!',
        'Amen.',
      ],
    },
    {
      id: 'seventh-step',
      title: 'Seventh Step Prayer',
      logic: 'A prayer of willingness. Having identified our character defects, we ask for the strength to let them go&mdash;not through willpower, but through grace.',
      paragraphs: [
        'My Creator, I am now willing that you should have all of me, good and bad. I pray that you now remove from me every single defect of character which stands in the way of my usefulness to you and my fellows. Grant me strength, as I go out from here, to do your bidding.',
        'Amen.',
      ],
    },
    {
      id: 'set-aside',
      title: 'Set Aside Prayer',
      logic: 'A prayer of openness. It asks us to release what we think we already know so that we can learn something new.',
      paragraphs: [
        'Dear God, please help me set aside everything I think I know&mdash;about myself, my disease, the Big Book, the 12 Steps, the Program, the Fellowship, all spiritual terms, and especially you God&mdash;so I may have an open mind and a new experience with all these things. Please help me see the Truth.',
        'Amen.',
      ],
    },
  ];

  const allEssentials = [...mainEssentials, ...recoveryAnchors];

  function renderCardBody(item) {
    let bodyHtml = '';

    const lineClass = item.noItalic ? 'ess-line ess-line--normal' : 'ess-line';

    if (item.lines) {
      bodyHtml = `<div class="ess-verse">
              ${item.lines.map(l => `<p class="${lineClass}">${l}</p>`).join('\n              ')}
            </div>`;
    } else if (item.sections) {
      bodyHtml = item.sections.map(section => {
        if (section.lines) {
          return `<div class="ess-verse">
              ${section.lines.map(l => `<p class="${lineClass}">${l}</p>`).join('\n              ')}
            </div>`;
        }
        return `<p class="ess-text">${section.text}</p>`;
      }).join('\n            ');
    } else if (item.paragraphs) {
      bodyHtml = item.paragraphs.map(p =>
        `<p class="ess-text">${p}</p>`
      ).join('\n            ');
    }

    const sourceHtml = item.source
      ? `\n            <p class="ess-source">&mdash; ${item.source}</p>`
      : '';

    return bodyHtml + sourceHtml;
  }

  // Count lines/paragraphs to determine if truncation is needed (> 3 items)
  function needsTruncation(item) {
    if (item.lines) return item.lines.length > 3;
    if (item.sections) {
      const lineCount = item.sections.reduce((n, s) => n + (s.lines ? s.lines.length : 1), 0);
      return lineCount > 3;
    }
    if (item.paragraphs) return item.paragraphs.length > 1;
    return false;
  }

  function renderCard(item) {
    const truncatable = needsTruncation(item);
    return `
          <div class="ess-card" id="${item.id}">
            <h3 class="ess-card-title">${item.title}</h3>
            <div class="ess-card-body${truncatable ? ' ess-truncated' : ''}" data-ess-card-body>
            ${renderCardBody(item)}
            </div>${truncatable ? `
            <button class="ess-read-more" data-ess-read-more aria-expanded="false">Read more</button>` : ''}
          </div>`;
  }

  const mainCards = mainEssentials.map(renderCard).join('\n');
  const anchorCards = recoveryAnchors.map(renderCard).join('\n');

  const bodyContent = `
      <!-- Hero -->
      <header class="page-hero">
        <div class="page-hero-image">
          <img src="${bp('/assets/themes/prayers.jpg')}" alt="Stone cairn on a quiet shore &mdash; Al-Anon recovery essentials" />
          <div class="page-hero-overlay"></div>
        </div>
        <div class="page-hero-content">
          <h1 class="page-hero-title">Recovery Essentials</h1>
          <p class="page-hero-subtitle">Inspiration and grounding for daily recovery</p>
        </div>
      </header>

      <!-- Anchor Navigation -->
      <nav class="pr-anchor-nav" id="ess-anchor-nav" aria-label="Essentials navigation">
        ${allEssentials.map(e => `<a href="#${e.id}" class="pr-anchor-link">${e.title}</a>`).join('\n        ')}
      </nav>

      <!-- Main Essentials -->
      <section class="ess-section">
        <div class="ess-grid">
${mainCards}
        </div>
      </section>

      <!-- Recovery Anchors -->
      <section class="ess-section">
        <h2 class="ess-section-heading">Recovery Prayers</h2>
        <div class="ess-grid">
${anchorCards}
        </div>
      </section>`;

  // Schema.org structured data with HasPart
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': 'Recovery Essentials — Al-Anon Daily Paths',
    'description': 'The foundational readings, prayers, and meditations of the Al-Anon program. A curated reference for recovery essentials including Just for Today, the Serenity Prayer, Letting Go, and more.',
    'author': {
      '@type': 'Person',
      'name': 'Neal W.'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Daily Growth, LLC',
      'logo': {
        '@type': 'ImageObject',
        'url': `${BASE_URL}/assets/favicon.png`
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/essentials/`
    },
    'hasPart': allEssentials.map((e, i) => ({
      '@type': 'CreativeWork',
      'name': e.title,
      'position': i + 1
    }))
  }, null, 2);

  return wrapInLayout({
    title: 'Recovery Essentials | Al-Anon Daily Paths',
    description: 'The foundational readings, prayers, and meditations of the Al-Anon program. A curated reference for recovery essentials including Just for Today, the Serenity Prayer, Letting Go, and more.',
    canonicalPath: '/essentials/',
    bodyContent,
    bodyClass: 'page-essentials',
    structuredData,
  });
}
