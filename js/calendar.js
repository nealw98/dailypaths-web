// Daily Paths — Calendar date-picker modal for reading pages

(function () {
  'use strict';

  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DAYS_IN = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var manifest = null;
  var modalEl = null;
  var currentMonth = 0;
  var selectedDayOfYear = -1;
  var triggerBtn = null;

  // Compute day_of_year from month index (0-based) and day-of-month (1-based)
  function toDayOfYear(month, day) {
    var d = day;
    for (var m = 0; m < month; m++) d += DAYS_IN[m];
    return d;
  }

  // Get today's month (0-based) and day-of-month
  function getToday() {
    var now = new Date();
    return { month: now.getMonth(), day: now.getDate() };
  }

  // Get the reading page's day_of_year from trigger data attributes
  function getPageReading() {
    var btn = document.querySelector('[data-calendar-trigger]');
    if (!btn) return null;
    var m = parseInt(btn.getAttribute('data-reading-month'), 10);
    var d = parseInt(btn.getAttribute('data-reading-day'), 10);
    return { month: m, day: d, dayOfYear: toDayOfYear(m, d) };
  }

  function fetchManifest(cb) {
    if (manifest) return cb();
    fetch('/readings-manifest.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        manifest = data;
        cb();
      })
      .catch(function () {
        manifest = [];
        cb();
      });
  }

  function getReading(dayOfYear) {
    if (!manifest) return null;
    return manifest.find(function (r) { return r.d === dayOfYear; }) || null;
  }

  function buildModal() {
    var overlay = document.createElement('div');
    overlay.className = 'cal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Select a date to read');
    overlay.innerHTML =
      '<div class="cal-backdrop" data-cal-close></div>' +
      '<div class="cal-panel">' +
        '<div class="cal-header">' +
          '<span class="cal-header-title">Select Date</span>' +
          '<button class="cal-close" aria-label="Close calendar" data-cal-close>&times;</button>' +
        '</div>' +
        '<div class="cal-nav">' +
          '<span class="cal-month-label" data-cal-month-label></span>' +
          '<div class="cal-nav-arrows">' +
            '<button class="cal-arrow" aria-label="Previous month" data-cal-prev>' +
              '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
            '<button class="cal-arrow" aria-label="Next month" data-cal-next>' +
              '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="cal-grid">' +
          '<div class="cal-weekdays">' +
            '<span class="cal-weekday">Sun</span>' +
            '<span class="cal-weekday">Mon</span>' +
            '<span class="cal-weekday">Tue</span>' +
            '<span class="cal-weekday">Wed</span>' +
            '<span class="cal-weekday">Thu</span>' +
            '<span class="cal-weekday">Fri</span>' +
            '<span class="cal-weekday">Sat</span>' +
          '</div>' +
          '<div class="cal-days" data-cal-days></div>' +
        '</div>' +
        '<div class="cal-preview" data-cal-preview>' +
          '<div class="cal-preview-empty">Select a date to preview</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    modalEl = overlay;

    // Event delegation
    overlay.addEventListener('click', function (e) {
      // Close
      if (e.target.closest('[data-cal-close]')) {
        closeModal();
        return;
      }
      // Prev month
      if (e.target.closest('[data-cal-prev]')) {
        currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        renderMonth();
        return;
      }
      // Next month
      if (e.target.closest('[data-cal-next]')) {
        currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        renderMonth();
        return;
      }
      // Day cell
      var cell = e.target.closest('[data-cal-day]');
      if (cell) {
        var day = parseInt(cell.getAttribute('data-cal-day'), 10);
        selectedDayOfYear = toDayOfYear(currentMonth, day);
        renderMonth();
        renderPreview();
        return;
      }
    });

    // Keyboard: Escape to close
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      // Focus trap
      if (e.key === 'Tab') {
        var focusable = overlay.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  function renderMonth() {
    var label = modalEl.querySelector('[data-cal-month-label]');
    label.textContent = MONTHS[currentMonth];

    var grid = modalEl.querySelector('[data-cal-days]');
    grid.innerHTML = '';

    var year = new Date().getFullYear();
    var firstDay = new Date(year, currentMonth, 1).getDay();
    var daysInMonth = DAYS_IN[currentMonth];
    var today = getToday();
    var pageReading = getPageReading();

    // Empty offset cells
    for (var e = 0; e < firstDay; e++) {
      var empty = document.createElement('div');
      empty.className = 'cal-cell is-empty';
      grid.appendChild(empty);
    }

    // Day cells
    for (var d = 1; d <= daysInMonth; d++) {
      var cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cal-cell';
      cell.setAttribute('data-cal-day', d);

      var dayOfYear = toDayOfYear(currentMonth, d);

      // Today indicator
      if (currentMonth === today.month && d === today.day) {
        cell.classList.add('is-today');
      }
      // Current reading page
      if (pageReading && dayOfYear === pageReading.dayOfYear) {
        cell.classList.add('is-current-reading');
      }
      // Selected
      if (dayOfYear === selectedDayOfYear) {
        cell.classList.add('is-selected');
      }

      cell.textContent = d;

      grid.appendChild(cell);
    }
  }

  function renderPreview() {
    var preview = modalEl.querySelector('[data-cal-preview]');
    var reading = getReading(selectedDayOfYear);

    if (!reading) {
      preview.innerHTML = '<div class="cal-preview-empty">Select a date to preview</div>';
      return;
    }

    var thought = reading.thought;
    if (thought && thought.length > 100) {
      thought = thought.slice(0, 100).replace(/\s+\S*$/, '') + '\u2026';
    }

    preview.innerHTML =
      '<div class="cal-preview-date">' + reading.date.toUpperCase() + '</div>' +
      (reading.theme ? '<div class="cal-preview-theme">' + reading.theme + '</div>' : '') +
      '<div class="cal-preview-title">' + reading.title + '</div>' +
      (thought ? '<div class="cal-preview-thought">' + thought + '</div>' : '') +
      '<a href="/' + reading.slug + '/" class="cal-preview-btn">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3h7v7M13 3L6 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        'View' +
      '</a>';
  }

  function openModal() {
    if (!modalEl) buildModal();
    modalEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    renderMonth();

    // If we have a selected day, show its preview
    if (selectedDayOfYear > 0) {
      renderPreview();
    }

    // Focus the close button
    var closeBtn = modalEl.querySelector('.cal-close');
    if (closeBtn) closeBtn.focus();

    Analytics.trackEvent('Calendar Open', { month: MONTHS[currentMonth] });
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
    document.body.style.overflow = '';
    if (triggerBtn) triggerBtn.focus();
  }

  // Initialize
  var trigger = document.querySelector('[data-calendar-trigger]');
  if (trigger) {
    triggerBtn = trigger;
    var pageReading = getPageReading();
    if (pageReading) {
      currentMonth = pageReading.month;
      selectedDayOfYear = pageReading.dayOfYear;
    }

    trigger.addEventListener('click', function () {
      fetchManifest(function () {
        openModal();
      });
    });
  }
})();
