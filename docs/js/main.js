// Daily Paths — minimal client-side JavaScript

(function () {
  'use strict';

  // Use the fixed 366-day calendar, independent of the current year's leap status.
  // The manifest points directly to reading pages (date aliases are HTML redirects).
  if (document.querySelector('[data-today-cta], [data-today-link]')) {
    fetch('/readings-manifest.json').then(function (response) {
      if (!response.ok) throw new Error('Reading index unavailable');
      return response.json();
    }).then(function (readings) {
      var date = new Date();
      var monthDays = [31,29,31,30,31,30,31,31,30,31,30,31];
      var day = date.getDate();
      for (var m = 0; m < date.getMonth(); m++) day += monthDays[m];
      var reading = readings.find(function (r) { return r.d === day; });
      if (!reading) return;
      document.querySelectorAll('[data-today-cta], [data-today-link]').forEach(function (link) { link.href = '/' + reading.slug + '/'; });
      setText('[data-today-title]', reading.title);
      setText('[data-today-date]', reading.date);
      if (reading.excerpt) setText('[data-today-excerpt]', reading.excerpt.length > 155 ? reading.excerpt.slice(0, 155).replace(/\s+\S*$/, '') + '…' : reading.excerpt);
      var hero = document.querySelector('[data-today-hero]');
      if (hero && reading.hero && hero.getAttribute('src') !== reading.hero) {
        var nextHero = new Image();
        nextHero.onload = function () { hero.setAttribute('src', reading.hero); };
        nextHero.src = reading.hero;
      }
    }).catch(function () { /* Build-time content remains usable offline. */ });
  }

  // Desktop nav dropdowns: hover and focus open via CSS; the caret button
  // serves touch and keyboard users, and Escape closes.
  var navItems = document.querySelectorAll('[data-nav-item]');
  navItems.forEach(function (item) {
    var caret = item.querySelector('.nav-caret');
    caret.addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      navItems.forEach(function (o) { o.classList.remove('is-open'); o.querySelector('.nav-caret').setAttribute('aria-expanded', 'false'); });
      item.classList.toggle('is-open', open);
      caret.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') navItems.forEach(function (o) { o.classList.remove('is-open'); o.querySelector('.nav-caret').setAttribute('aria-expanded', 'false'); if (o.contains(document.activeElement)) document.activeElement.blur(); });
  });

  // ---------------------------------------------------------------------------
  // 3. Mobile menu — quiet dropdown with complete keyboard behavior
  // ---------------------------------------------------------------------------
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (menuToggle && mobileMenu) {
    var menuLabel = menuToggle.querySelector('[data-menu-label]');
    var menuLinks = mobileMenu.querySelectorAll('a[href]');

    var openMenu = function () {
      if (mobileMenu.hasAttribute('hidden')) {
        mobileMenu.removeAttribute('hidden');
        menuToggle.setAttribute('aria-expanded', 'true');
        if (menuLabel) menuLabel.textContent = 'Close';
        if (menuLinks.length) menuLinks[0].focus();
      }
    };

    var closeMenu = function (returnFocus) {
      if (!mobileMenu.hasAttribute('hidden')) {
        mobileMenu.setAttribute('hidden', '');
        menuToggle.setAttribute('aria-expanded', 'false');
        if (menuLabel) menuLabel.textContent = 'Menu';
        if (returnFocus) menuToggle.focus();
      }
    };

    menuToggle.addEventListener('click', function () {
      if (mobileMenu.hasAttribute('hidden')) openMenu();
      else closeMenu(true);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !mobileMenu.hasAttribute('hidden')) {
        event.preventDefault();
        closeMenu(true);
      }
    });

    document.addEventListener('click', function (event) {
      if (!mobileMenu.hasAttribute('hidden') && !event.target.closest('.site-header')) {
        closeMenu(false);
      }
    });

    for (var n = 0; n < menuLinks.length; n++) {
      menuLinks[n].addEventListener('click', function () { closeMenu(false); });
    }

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) closeMenu(false);
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
