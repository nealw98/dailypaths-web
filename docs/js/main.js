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

  // 2. Mobile Navigation Toggle
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
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
