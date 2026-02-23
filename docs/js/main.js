// Daily Paths — minimal client-side JavaScript

(function () {
  'use strict';

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
      var consent = form.querySelector('input[name="consent"]').checked;
      var guestAuthorEl = form.querySelector('input[name="guest_author"]');
      var guestAuthor = guestAuthorEl ? guestAuthorEl.checked : false;

      if (!displayName || !content || !consent) {
        status.textContent = 'Please complete all fields and confirm consent.';
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
          is_approved: false,
          guest_author: guestAuthor
        })
      }).then(function (res) {
        if (res.ok) {
          status.textContent = 'Thank you for sharing. Your story will be reviewed before it appears.';
          status.className = 'topic-share-status topic-share-status--success';
          form.querySelector('input[name="display_name"]').value = '';
          form.querySelector('textarea[name="content"]').value = '';
          form.querySelector('input[name="consent"]').checked = false;
          if (guestAuthorEl) guestAuthorEl.checked = false;
          var charCounter = form.querySelector('[data-char-count]');
          if (charCounter) charCounter.textContent = '0';
          btn.textContent = 'Submitted';
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

  // 4c. Live character counter for share textareas
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
