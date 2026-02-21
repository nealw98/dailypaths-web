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
          is_approved: false
        })
      }).then(function (res) {
        if (res.ok) {
          status.textContent = 'Thank you for sharing. Your story will be reviewed before it appears.';
          status.className = 'topic-share-status topic-share-status--success';
          form.querySelector('input[name="display_name"]').value = '';
          form.querySelector('textarea[name="content"]').value = '';
          form.querySelector('input[name="consent"]').checked = false;
          btn.textContent = 'Submitted';
        } else {
          throw new Error(res.status);
        }
      }).catch(function () {
        status.textContent = 'Something went wrong. Please try again.';
        status.className = 'topic-share-status topic-share-status--error';
        btn.disabled = false;
        btn.textContent = 'Submit';
      });
    });
  }

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
