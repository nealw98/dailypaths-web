// Daily Paths — minimal client-side JavaScript

(function () {
  'use strict';

  // 0. Homepage stale-date fix
  // The homepage "Today's Reflection" is baked at build time. If the user's
  // local date no longer matches, fetch today's reading page and swap in
  // the correct title, date, and preview text.
  if (document.body.classList.contains('page-home')) {
    var todaySlugHome = getTodaySlug();
    var readMoreBtn = document.querySelector('.hm-today-btn');
    if (readMoreBtn && readMoreBtn.getAttribute('href').indexOf(todaySlugHome) === -1) {
      // Update the "Read More" link immediately
      readMoreBtn.setAttribute('href', '/' + todaySlugHome + '/');
      // Fetch today's reading page and extract content
      fetch('/' + todaySlugHome + '/')
        .then(function (res) { return res.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var dateEl = doc.querySelector('.rd-date');
          var titleEl = doc.querySelector('.rd-title');
          var bodyEl = doc.querySelector('.rd-body p');
          if (dateEl) {
            var homeDateEl = document.querySelector('.hm-today-date');
            if (homeDateEl) homeDateEl.textContent = dateEl.textContent;
          }
          if (titleEl) {
            var homeTitleEl = document.querySelector('.hm-today-title');
            if (homeTitleEl) homeTitleEl.textContent = titleEl.textContent;
          }
          if (bodyEl) {
            var homePreviewEl = document.querySelector('.hm-today-preview');
            if (homePreviewEl) {
              var text = bodyEl.textContent;
              homePreviewEl.textContent = text.length > 200
                ? text.slice(0, 200).replace(/\s+\S*$/, '') + '\u2026'
                : text;
            }
          }
        })
        .catch(function () { /* graceful fallback: stale content stays */ });
    }
  }

  // 1. Today's Reading Link
  // Elements with data-today-link get their href set to today's reading
  var todayLinks = document.querySelectorAll('[data-today-link]');
  if (todayLinks.length > 0) {
    var slug = getTodaySlug();
    for (var i = 0; i < todayLinks.length; i++) {
      todayLinks[i].href = '/' + slug + '/';
    }
  }

  // 2. Hide "Return to Today" if already on today's reading
  var todayNav = document.querySelector('[data-today-nav]');
  if (todayNav) {
    var todaySlug = getTodaySlug();
    var path = window.location.pathname;
    if (path.indexOf(todaySlug) !== -1 || path === '/' || path.match(/\/index\.html?\/?$/)) {
      todayNav.style.display = 'none';
    }
  }

  // 3. Mobile Navigation Toggle
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // 4. Member Share Form
  var shareToggles = document.querySelectorAll('[data-share-toggle]');
  for (var s = 0; s < shareToggles.length; s++) {
    shareToggles[s].addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('href').slice(1);
      var form = document.getElementById(targetId);
      if (form) {
        var isHidden = form.hasAttribute('hidden');
        if (isHidden) {
          form.removeAttribute('hidden');
          this.textContent = 'Cancel';
        } else {
          form.setAttribute('hidden', '');
          this.textContent = 'Share your experience with this theme.';
        }
      }
    });
  }

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
        status.className = 'topic-share-status topic-share-status--error';
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Submitting\u2026';
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
        if (res.ok) {
          status.textContent = 'Thank you for sharing. Your story will be reviewed before it appears.';
          status.className = 'topic-share-status topic-share-status--success';
          form.querySelector('input[name="display_name"]').value = '';
          form.querySelector('textarea[name="content"]').value = '';
          var charCounter = form.querySelector('[data-char-count]');
          if (charCounter) charCounter.textContent = '0';
          btn.textContent = 'Submitted';
          setTimeout(function () {
            btn.disabled = false;
            btn.textContent = 'Post Insight';
          }, 2000);
          Analytics.trackEvent('Share Form Submit', { topic_slug: topicSlug, status: 'success' });
        } else {
          throw new Error(res.status);
        }
      }).catch(function () {
        status.textContent = 'Something went wrong. Please try again.';
        status.className = 'topic-share-status topic-share-status--error';
        btn.disabled = false;
        btn.textContent = 'Submit';
        Analytics.trackEvent('Share Form Submit', { topic_slug: topicSlug, status: 'error' });
      });
    });
  }

  // 4b. Read More truncation for long member insights
  var fullTextEls = document.querySelectorAll('[data-full-text]');
  for (var rt = 0; rt < fullTextEls.length; rt++) {
    (function (el) {
      if (el.textContent.length > 800) {
        el.classList.add('truncated');
        var btn = el.parentElement.querySelector('[data-read-more]');
        if (btn) {
          btn.removeAttribute('hidden');
          btn.addEventListener('click', function () {
            el.classList.remove('truncated');
            btn.setAttribute('hidden', '');
          });
        }
      }
    })(fullTextEls[rt]);
  }

  // 4c. Insight card: 45-word truncation with smooth expand/collapse
  var insightCardTexts = document.querySelectorAll('[data-insight-card-text]');
  for (var ic = 0; ic < insightCardTexts.length; ic++) {
    (function (textEl) {
      var words = textEl.textContent.trim().split(/\s+/);
      if (words.length <= 45) return;

      textEl.classList.add('truncated');
      var btn = textEl.parentElement.querySelector('[data-insight-read-more]');
      if (!btn) return;

      btn.addEventListener('click', function () {
        var isExpanded = btn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          textEl.classList.add('truncated');
          btn.setAttribute('aria-expanded', 'false');
          btn.textContent = 'Read the full reflection';
        } else {
          textEl.classList.remove('truncated');
          btn.setAttribute('aria-expanded', 'true');
          btn.textContent = 'Show less';
        }
      });
    })(insightCardTexts[ic]);
  }

  // 4d. "Show more community insights" pagination
  var showMoreBtns = document.querySelectorAll('[data-insight-show-more]');
  for (var sm = 0; sm < showMoreBtns.length; sm++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var grid = btn.parentElement.querySelector('[data-insight-grid]');
        if (!grid) return;
        var hidden = grid.querySelectorAll('.insight-card--hidden');
        for (var h = 0; h < hidden.length; h++) {
          hidden[h].classList.remove('insight-card--hidden');
          // Apply truncation to newly-revealed cards
          var textEl = hidden[h].querySelector('[data-insight-card-text]');
          if (textEl) {
            var words = textEl.textContent.trim().split(/\s+/);
            if (words.length > 45) {
              textEl.classList.add('truncated');
              var readMoreBtn = hidden[h].querySelector('[data-insight-read-more]');
              if (readMoreBtn) {
                readMoreBtn.addEventListener('click', (function (t, r) {
                  return function () {
                    var isExp = r.getAttribute('aria-expanded') === 'true';
                    if (isExp) {
                      t.classList.add('truncated');
                      r.setAttribute('aria-expanded', 'false');
                      r.textContent = 'Read the full reflection \u2192';
                    } else {
                      t.classList.remove('truncated');
                      r.setAttribute('aria-expanded', 'true');
                      r.textContent = 'Show less';
                    }
                  };
                })(textEl, readMoreBtn));
              }
            }
          }
        }
        btn.style.display = 'none';
      });
    })(showMoreBtns[sm]);
  }

  // 4e. Essentials page: Read More / Show Less toggle
  var essCardBodies = document.querySelectorAll('[data-ess-card-body]');
  for (var eb = 0; eb < essCardBodies.length; eb++) {
    (function (bodyEl) {
      var btn = bodyEl.parentElement.querySelector('[data-ess-read-more]');
      if (!btn) return;

      btn.addEventListener('click', function () {
        var isExpanded = btn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          bodyEl.classList.add('ess-truncated');
          btn.setAttribute('aria-expanded', 'false');
          btn.textContent = 'Read more';
          // Scroll card back into view
          bodyEl.closest('.ess-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          bodyEl.classList.remove('ess-truncated');
          btn.setAttribute('aria-expanded', 'true');
          btn.textContent = 'Show less';
        }
      });
    })(essCardBodies[eb]);
  }

  // 4f. Live character counter for share textareas
  var shareTextareas = document.querySelectorAll('.topic-share-textarea');
  for (var tc = 0; tc < shareTextareas.length; tc++) {
    (function (textarea) {
      var counter = textarea.parentElement.querySelector('[data-char-count]');
      if (counter) {
        textarea.addEventListener('input', function () {
          counter.textContent = textarea.value.length;
        });
      }
    })(shareTextareas[tc]);
  }

  // 5. Header Navigation Tracking
  var headerLinks = document.querySelectorAll('.site-nav .nav-link');
  for (var hn = 0; hn < headerLinks.length; hn++) {
    headerLinks[hn].addEventListener('click', function () {
      Analytics.trackEvent('Navigation Click', {
        location: 'header',
        label: this.textContent.trim(),
        href: this.getAttribute('href')
      });
    });
  }

  // 6. Footer Navigation Tracking
  var footerLinks = document.querySelectorAll('.footer-nav a');
  for (var fn = 0; fn < footerLinks.length; fn++) {
    footerLinks[fn].addEventListener('click', function () {
      Analytics.trackEvent('Navigation Click', {
        location: 'footer',
        label: this.textContent.trim(),
        href: this.getAttribute('href')
      });
    });
  }

  // 7. Today's Reading Link Tracking
  var todayBtns = document.querySelectorAll('.hm-today-btn');
  for (var tb = 0; tb < todayBtns.length; tb++) {
    todayBtns[tb].addEventListener('click', function () {
      Analytics.trackEvent('Today Reading Click', {
        href: this.getAttribute('href')
      });
    });
  }

  // 8. Scroll Depth Tracking
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
          Analytics.trackEvent('Scroll Depth', {
            threshold: t,
            path: window.location.pathname
          });
        }
      }
    });
  })();

  // 9. Time on Page Tracking
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
          Analytics.trackEvent('Time on Page', {
            seconds: s,
            path: window.location.pathname
          });
        }
      }
    }, 5000);
  })();

  // 10. Outbound Link Tracking
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

  function getTodaySlug() {
    var months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    var now = new Date();
    return months[now.getMonth()] + '-' + now.getDate();
  }
})();
