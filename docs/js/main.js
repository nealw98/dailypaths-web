// Daily Paths — minimal client-side JavaScript

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Homepage stale-date fix
  // The homepage hero is baked at build time. If the visitor's local date has
  // moved past the build date, fetch today's reading and swap in the correct
  // date, title, and excerpt.
  // ---------------------------------------------------------------------------
  if (document.body.classList.contains('page-home')) {
    var todaySlugHome = getTodaySlug();
    var heroCta = document.querySelector('[data-today-cta]');
    if (heroCta && heroCta.getAttribute('href').indexOf(todaySlugHome) === -1) {
      heroCta.setAttribute('href', '/' + todaySlugHome + '/');
      fetch('/' + todaySlugHome + '/')
        .then(function (res) { return res.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var titleEl = doc.querySelector('.photo-hero-title');
          var bodyEl = doc.querySelector('.rd-body p');
          var timeEl = doc.querySelector('.photo-hero .eyebrow time');

          if (timeEl) {
            // Hero eyebrow reads "August 9 · Step Eight" — keep just the date
            var dateText = timeEl.textContent.split('·')[0].trim();
            setText('[data-today-date]', dateText);
          }
          if (titleEl) setText('[data-today-title]', titleEl.textContent.trim());
          if (bodyEl) {
            var text = bodyEl.textContent.trim();
            setText('[data-today-excerpt]', text.length > 200
              ? text.slice(0, 200).replace(/\s+\S*$/, '') + '…'
              : text);
          }
        })
        .catch(function () { /* graceful fallback: stale content stays */ });
    }
  }

  // ---------------------------------------------------------------------------
  // 2. "Today's Reflection" links — correct the baked href to the local date
  // ---------------------------------------------------------------------------
  var todayLinks = document.querySelectorAll('[data-today-link]');
  if (todayLinks.length > 0) {
    var slug = getTodaySlug();
    for (var i = 0; i < todayLinks.length; i++) {
      todayLinks[i].href = '/' + slug + '/';
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Mobile menu — toggles the dropdown and the Menu ⇄ Close label
  // ---------------------------------------------------------------------------
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (menuToggle && mobileMenu) {
    var menuLabel = menuToggle.querySelector('[data-menu-label]');
    menuToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.hasAttribute('hidden');
      if (isOpen) {
        mobileMenu.removeAttribute('hidden');
      } else {
        mobileMenu.setAttribute('hidden', '');
      }
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      if (menuLabel) menuLabel.textContent = isOpen ? 'Close' : 'Menu';
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Start here self-check
  // Client-side only. Answers are never persisted, never transmitted, and no
  // analytics event fires per answer — the page promises exactly that.
  // ---------------------------------------------------------------------------
  var quiz = document.querySelector('[data-quiz]');
  if (quiz) {
    var quizResponse = document.querySelector('[data-quiz-response]');
    var quizCountEl = document.querySelector('[data-quiz-count]');
    var toggles = quiz.querySelectorAll('[data-quiz-toggle]');

    var updateQuiz = function () {
      var count = 0;
      for (var q = 0; q < toggles.length; q++) {
        if (toggles[q].getAttribute('aria-pressed') === 'true') count++;
      }
      if (quizCountEl) quizCountEl.textContent = String(count);
      if (quizResponse) {
        if (count > 0) {
          quizResponse.removeAttribute('hidden');
        } else {
          quizResponse.setAttribute('hidden', '');
        }
      }
    };

    for (var t = 0; t < toggles.length; t++) {
      toggles[t].addEventListener('click', function () {
        var pressed = this.getAttribute('aria-pressed') === 'true';
        this.setAttribute('aria-pressed', String(!pressed));
        updateQuiz();
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 5. Member share form
  // ---------------------------------------------------------------------------
  var shareForms = document.querySelectorAll('[data-share-form]');
  for (var f = 0; f < shareForms.length; f++) {
    shareForms[f].addEventListener('submit', function (e) {
      e.preventDefault();
      var form = this;
      var status = form.querySelector('[data-share-status]');
      var btn = form.querySelector('button[type="submit"]');
      var supabaseUrl = form.getAttribute('data-supabase-url');
      var supabaseKey = form.getAttribute('data-supabase-key');
      var topicSlug = form.getAttribute('data-topic-slug');

      var displayName = form.querySelector('input[name="display_name"]').value.trim();
      var content = form.querySelector('textarea[name="content"]').value.trim();

      if (!displayName || !content) {
        status.textContent = 'Please complete all fields.';
        status.className = 'share-status share-status--error';
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Submitting…';
      status.textContent = '';

      fetch(supabaseUrl + '/rest/v1/member_shares', {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': 'Bearer ' + supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          topic_slug: topicSlug,
          display_name: displayName,
          content: content,
          consent_confirmed: true,
          is_approved: false
        })
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        status.textContent = 'Thank you for sharing. Your story will be reviewed before it appears.';
        status.className = 'share-status share-status--success';
        form.querySelector('input[name="display_name"]').value = '';
        form.querySelector('textarea[name="content"]').value = '';
        var charCounter = form.querySelector('[data-char-count]');
        if (charCounter) charCounter.textContent = '0';
        btn.textContent = 'Submitted';
        setTimeout(function () {
          btn.disabled = false;
          btn.textContent = 'Post insight';
        }, 2000);
        Analytics.trackEvent('Share Form Submit', { topic_slug: topicSlug, status: 'success' });
      }).catch(function () {
        status.textContent = 'Something went wrong. Please try again.';
        status.className = 'share-status share-status--error';
        btn.disabled = false;
        btn.textContent = 'Post insight';
        Analytics.trackEvent('Share Form Submit', { topic_slug: topicSlug, status: 'error' });
      });
    });
  }

  // Live character counter
  var shareTextareas = document.querySelectorAll('[data-share-form] textarea');
  for (var tc = 0; tc < shareTextareas.length; tc++) {
    (function (textarea) {
      var form = textarea.closest('[data-share-form]');
      var counter = form && form.querySelector('[data-char-count]');
      if (!counter) return;
      textarea.addEventListener('input', function () {
        counter.textContent = String(textarea.value.length);
      });
    })(shareTextareas[tc]);
  }

  // ---------------------------------------------------------------------------
  // 6. Member insight cards — 45-word truncation with expand/collapse
  // ---------------------------------------------------------------------------
  function wireInsightCard(textEl) {
    var words = textEl.textContent.trim().split(/\s+/);
    if (words.length <= 45) return;

    textEl.classList.add('truncated');
    var btn = textEl.parentElement.querySelector('[data-insight-read-more]');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var isExpanded = btn.getAttribute('aria-expanded') === 'true';
      textEl.classList.toggle('truncated', isExpanded);
      btn.setAttribute('aria-expanded', String(!isExpanded));
      btn.textContent = isExpanded ? 'Read the full reflection' : 'Show less';
    });
  }

  var insightCardTexts = document.querySelectorAll('[data-insight-card-text]');
  for (var ic = 0; ic < insightCardTexts.length; ic++) {
    wireInsightCard(insightCardTexts[ic]);
  }

  // "Show more community insights"
  var showMoreBtns = document.querySelectorAll('[data-insight-show-more]');
  for (var sm = 0; sm < showMoreBtns.length; sm++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var grid = btn.parentElement.querySelector('[data-insight-grid]');
        if (!grid) return;
        var hidden = grid.querySelectorAll('.insight-card--hidden');
        for (var h = 0; h < hidden.length; h++) {
          hidden[h].classList.remove('insight-card--hidden');
          var textEl = hidden[h].querySelector('[data-insight-card-text]');
          if (textEl) wireInsightCard(textEl);
        }
        btn.style.display = 'none';
      });
    })(showMoreBtns[sm]);
  }

  // ---------------------------------------------------------------------------
  // 7. Navigation tracking
  // ---------------------------------------------------------------------------
  trackNav('.site-nav .nav-link', 'header');
  trackNav('.mobile-menu-row', 'mobile-menu');
  trackNav('.footer-links a', 'footer');

  var todayCtas = document.querySelectorAll('[data-today-cta]');
  for (var tb = 0; tb < todayCtas.length; tb++) {
    todayCtas[tb].addEventListener('click', function () {
      Analytics.trackEvent('Today Reading Click', { href: this.getAttribute('href') });
    });
  }

  // ---------------------------------------------------------------------------
  // 8. Scroll depth
  // ---------------------------------------------------------------------------
  (function () {
    var thresholds = [25, 50, 75, 100];
    var fired = {};

    function getScrollPercent() {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return 100;
      return Math.round((window.pageYOffset / docHeight) * 100);
    }

    window.addEventListener('scroll', function () {
      var pct = getScrollPercent();
      for (var i = 0; i < thresholds.length; i++) {
        var t = thresholds[i];
        if (pct >= t && !fired[t]) {
          fired[t] = true;
          Analytics.trackEvent('Scroll Depth', { threshold: t, path: window.location.pathname });
        }
      }
    });
  })();

  // ---------------------------------------------------------------------------
  // 9. Time on page
  // ---------------------------------------------------------------------------
  (function () {
    var startTime = Date.now();
    var intervals = [30, 60, 180, 300];
    var firedIntervals = {};

    setInterval(function () {
      var elapsed = Math.floor((Date.now() - startTime) / 1000);
      for (var i = 0; i < intervals.length; i++) {
        var s = intervals[i];
        if (elapsed >= s && !firedIntervals[s]) {
          firedIntervals[s] = true;
          Analytics.trackEvent('Time on Page', { seconds: s, path: window.location.pathname });
        }
      }
    }, 5000);
  })();

  // ---------------------------------------------------------------------------
  // 10. Outbound links
  // ---------------------------------------------------------------------------
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href) return;

    try {
      var url = new URL(href, window.location.origin);
      if (url.hostname !== window.location.hostname) {
        Analytics.trackEvent('Outbound Link Click', {
          href: href,
          text: (link.textContent || '').trim().substring(0, 100),
          path: window.location.pathname
        });
      }
    } catch (err) {
      // Malformed URL, skip
    }
  });

  // --- Helpers ---

  function setText(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function trackNav(selector, location) {
    var links = document.querySelectorAll(selector);
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        Analytics.trackEvent('Navigation Click', {
          location: location,
          label: this.textContent.trim(),
          href: this.getAttribute('href')
        });
      });
    }
  }

  function getTodaySlug() {
    var months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    var now = new Date();
    return months[now.getMonth()] + '-' + now.getDate();
  }
})();
