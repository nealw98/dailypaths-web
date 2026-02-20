import { wrapInLayout } from './base.mjs';
import { bp } from '../helpers/config.mjs';
import { BOOKS } from './literature.mjs';

/* ── Inline SVG icons for the 3 C's ────────────────────────────── */

const svgCause = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.315 8.685a.98.98 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.61a2.404 2.404 0 0 1 1.705-.707c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"/></svg>`;

const svgControl = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>`;

const svgCure = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h6"/><path d="M12 9v6"/><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="4" y1="20" x2="20" y2="4" stroke-width="2"/></svg>`;

/* ── Quiz questions (curated 12 from the 20) ───────────────────── */

const QUIZ_QUESTIONS = [
  'Do you worry about how much someone else drinks?',
  'Do you tell lies to cover up for someone else\u2019s drinking?',
  'Do you feel that if the drinker cared about you, they would stop drinking to please you?',
  'Are plans frequently upset or meals delayed because of the drinker?',
  'Have you been hurt or embarrassed by a drinker\u2019s behavior?',
  'Are holidays and gatherings spoiled because of drinking?',
  'Have you refused social invitations out of fear or anxiety?',
  'Do you feel like a failure because you can\u2019t control the drinking?',
  'Do you think that if the drinker stopped, your other problems would be solved?',
  'Do you feel angry, confused, or depressed most of the time?',
  'Are you afraid to upset someone for fear it will set off a drinking bout?',
  'Do you feel there is no one who understands your problems?',
];

/* ── Sister Fellowships data ───────────────────────────────────── */

const FELLOWSHIPS = [
  {
    name: 'Adult Children of Alcoholics (ACA)',
    desc: 'A twelve-step program for adults who grew up in alcoholic or otherwise dysfunctional homes.',
    url: 'https://adultchildren.org',
  },
  {
    name: 'Co-Dependents Anonymous (CoDA)',
    desc: 'A fellowship for anyone who wants to develop healthy, fulfilling relationships.',
    url: 'https://coda.org',
  },
  {
    name: 'Alateen',
    desc: 'Part of the Al-Anon family, Alateen is for younger members affected by someone else\u2019s drinking.',
    url: 'https://al-anon.org/for-members/group-resources/alateen/',
  },
];

/* ── Template ──────────────────────────────────────────────────── */

export function renderAboutPage() {

  const quizHtml = QUIZ_QUESTIONS.map((q, i) => `
            <li class="abt-quiz-item">
              <label class="abt-quiz-label">
                <input type="checkbox" class="abt-quiz-check" />
                <span class="abt-quiz-box"></span>
                <span class="abt-quiz-text">${q}</span>
              </label>
            </li>`).join('');

  const booksHtml = BOOKS.map(b => `
          <div class="abt-book-card">
            <div class="abt-book-cover">
              <img src="${bp('/assets/' + b.image)}" alt="${b.title}" loading="lazy" />
            </div>
            <h4 class="abt-book-title">${b.title}</h4>
            <p class="abt-book-desc">${b.shortDescription}</p>
            <a href="${b.purchaseLink}" target="_blank" rel="noopener noreferrer" class="abt-book-btn">
              View at Al-Anon Bookstore&nbsp;&#8599;
            </a>
          </div>`).join('');

  const fellowshipsHtml = FELLOWSHIPS.map(f => `
          <a href="${f.url}" target="_blank" rel="noopener noreferrer" class="abt-fellow-card">
            <h4 class="abt-fellow-name">${f.name}</h4>
            <p class="abt-fellow-desc">${f.desc}</p>
            <span class="abt-fellow-link">Visit Website&nbsp;&#8599;</span>
          </a>`).join('');

  const bodyContent = `
    <!-- Hero -->
    <section class="abt-hero">
      <h1 class="abt-hero-title">Understanding the Al-Anon Path</h1>
      <p class="abt-hero-sub">
        A welcoming guide for anyone whose life has been touched by someone else&rsquo;s drinking.
        You don&rsquo;t have to face it alone.
      </p>
    </section>

    <!-- Mobile Jump Menu -->
    <nav class="abt-jump" aria-label="Page sections">
      <a href="#quiz" class="abt-jump-pill">The Quiz</a>
      <a href="#threes" class="abt-jump-pill">The 3&nbsp;C&rsquo;s</a>
      <a href="#literature" class="abt-jump-pill">Literature</a>
      <a href="#fellowships" class="abt-jump-pill">Fellowships</a>
    </nav>

    <!-- Body: Main + Sidebar -->
    <div class="abt-body-wrap">
      <div class="abt-body-inner">

        <!-- Main Column -->
        <div class="abt-main">

          <!-- Self-Reflection Quiz -->
          <section id="quiz" class="abt-section">
            <h2 class="abt-section-heading">Self-Reflection</h2>
            <p class="abt-section-intro">
              The following questions are designed to help you reflect &mdash; honestly
              and without judgment &mdash; on whether someone else&rsquo;s drinking has
              affected your life. There are no right or wrong answers.
            </p>
            <ul class="abt-quiz-list">
${quizHtml}
            </ul>

            <div class="abt-quiz-result" id="quizResult">
              <p class="abt-quiz-result-text">
                If you answered &ldquo;yes&rdquo; to any of these questions, <strong>you are not alone.</strong>
                Al-Anon may be able to help.
              </p>
              <a href="https://al-anon.org/al-anon-meetings/find-an-al-anon-meeting/"
                 target="_blank" rel="noopener noreferrer" class="abt-quiz-meeting-link">
                Find an Al-Anon Meeting&nbsp;&#8599;
              </a>
            </div>

            <button type="button" class="abt-reveal-btn" id="revealBtn">
              Reveal My Next Step &darr;
            </button>

            <p class="abt-quiz-attribution">
              Adapted from the Al-Anon Family Groups self-quiz at
              <a href="https://al-anon.org/newcomers/self-quiz/" target="_blank" rel="noopener noreferrer">al-anon.org</a>.
            </p>
            <a href="#" class="abt-back-top abt-back-top--mobile">Back to top &uarr;</a>
          </section>

          <!-- The 3 C's -->
          <section id="threes" class="abt-section">
            <h2 class="abt-section-heading">The 3 C&rsquo;s</h2>
            <p class="abt-section-intro">
              One of the first things you&rsquo;ll hear in Al-Anon is a simple truth
              that can change everything: <em>You didn&rsquo;t cause it, you can&rsquo;t
              control it, and you can&rsquo;t cure it.</em>
            </p>
            <div class="abt-threes-grid">
              <div class="abt-threes-card">
                <div class="abt-threes-icon">${svgCause}</div>
                <h3 class="abt-threes-title">You Didn&rsquo;t Cause It</h3>
                <p class="abt-threes-desc">
                  Alcoholism is a disease. Nothing you said, did, or failed to do
                  made someone else drink.
                </p>
              </div>
              <div class="abt-threes-card">
                <div class="abt-threes-icon">${svgControl}</div>
                <h3 class="abt-threes-title">You Can&rsquo;t Control It</h3>
                <p class="abt-threes-desc">
                  No amount of managing, pleading, or rearranging your life can
                  make another person stop drinking.
                </p>
              </div>
              <div class="abt-threes-card">
                <div class="abt-threes-icon">${svgCure}</div>
                <h3 class="abt-threes-title">You Can&rsquo;t Cure It</h3>
                <p class="abt-threes-desc">
                  Recovery from alcoholism is the drinker&rsquo;s responsibility.
                  Your recovery is yours.
                </p>
              </div>
            </div>
            <a href="#" class="abt-back-top abt-back-top--mobile">Back to top &uarr;</a>
          </section>

          <!-- Literature Spotlight -->
          <section id="literature" class="abt-section">
            <h2 class="abt-section-heading">Literature Spotlight</h2>
            <p class="abt-section-intro">
              These foundational books are used in Al-Anon meetings around the world.
              Each one offers a different doorway into the program.
            </p>
            <div class="abt-book-grid">
${booksHtml}
            </div>
            <a href="#" class="abt-back-top abt-back-top--mobile">Back to top &uarr;</a>
          </section>

          <!-- Sister Fellowships -->
          <section id="fellowships" class="abt-section">
            <h2 class="abt-section-heading">Sister Fellowships</h2>
            <p class="abt-section-intro">
              Al-Anon is part of a wider family of twelve-step programs.
              These related fellowships may also be helpful on your journey.
            </p>
            <div class="abt-fellow-grid">
${fellowshipsHtml}
            </div>
            <a href="#" class="abt-back-top abt-back-top--mobile">Back to top &uarr;</a>
          </section>

        </div><!-- /.abt-main -->

        <!-- Sticky Sidebar (desktop only) -->
        <aside class="abt-sidebar">
          <nav class="abt-toc" aria-label="Table of contents">
            <h3 class="abt-toc-heading">On This Page</h3>
            <ul class="abt-toc-list">
              <li><a href="#quiz" class="abt-toc-link">The Quiz</a></li>
              <li><a href="#threes" class="abt-toc-link">The 3&nbsp;C&rsquo;s</a></li>
              <li><a href="#literature" class="abt-toc-link">Literature</a></li>
              <li><a href="#fellowships" class="abt-toc-link">Fellowships</a></li>
            </ul>
          </nav>
        </aside>

      </div><!-- /.abt-body-inner -->
    </div><!-- /.abt-body-wrap -->

    <!-- Inline script for quiz reveal button + TOC active state -->
    <script>
    (function(){
      // Reveal button — scroll to result then to 3 C's
      var btn = document.getElementById('revealBtn');
      var result = document.getElementById('quizResult');
      if (btn && result) {
        btn.addEventListener('click', function() {
          result.classList.add('is-visible');
          result.scrollIntoView({ behavior: 'smooth', block: 'center' });
          btn.style.display = 'none';
        });
      }

      // TOC active state on scroll (desktop)
      var tocLinks = document.querySelectorAll('.abt-toc-link');
      var sections = document.querySelectorAll('.abt-section[id]');
      if (tocLinks.length && sections.length) {
        var onScroll = function() {
          var scrollY = window.scrollY + 120;
          var current = '';
          for (var i = 0; i < sections.length; i++) {
            if (sections[i].offsetTop <= scrollY) {
              current = sections[i].getAttribute('id');
            }
          }
          for (var j = 0; j < tocLinks.length; j++) {
            tocLinks[j].classList.toggle('is-active',
              tocLinks[j].getAttribute('href') === '#' + current);
          }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      }
    })();
    </script>`;

  return wrapInLayout({
    title: 'About Al-Anon Family Groups | Al-Anon Daily Paths',
    description: 'Learn about Al-Anon Family Groups, a mutual support program for anyone affected by someone else\'s drinking. Self-reflection quiz, the 3 C\'s, literature guide, and related fellowships.',
    canonicalPath: '/about-alanon/',
    bodyContent,
    bodyClass: 'page-about',
  });
}
