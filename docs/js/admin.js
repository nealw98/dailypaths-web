// Daily Paths — Admin Panel
// Single-page admin app with Supabase auth and reading management

(function () {
  'use strict';

  // --- Config ---
  var MAIN_SUPABASE_URL = 'https://hnmesmsegmgablcawogs.supabase.co';
  var MAIN_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhubWVzbXNlZ21nYWJsY2F3b2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNzIxOTAsImV4cCI6MjA3OTk0ODE5MH0.oEbM_Ah8J5ogRW-aIZPJQPEMoI4ZGB2ncbFPiF1G_mU';
  var EDGE_FN_URL = MAIN_SUPABASE_URL + '/functions/v1/external-readings';

  // --- State ---
  var state = {
    session: null,
    readings: [],
    filteredReadings: [],
    selectedReading: null,
    feedbackDetails: [],
    appFeedback: [],
    appFeedbackCount: 0,
    sort: 'day_of_year',
    filter: 'all',
    source: 'all',
    view: 'login', // login | dashboard | reading | app-feedback
    loading: false,
    saving: false,
    editFields: {},
    originalFields: {},
  };

  // --- Supabase Auth Helpers ---

  function getStoredSession() {
    try {
      var raw = localStorage.getItem('dp_admin_session');
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (s && s.access_token && s.expires_at) {
        if (Date.now() / 1000 < s.expires_at) return s;
        // Try refresh
        return null;
      }
      return null;
    } catch (e) { return null; }
  }

  function storeSession(session) {
    if (session) {
      localStorage.setItem('dp_admin_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('dp_admin_session');
    }
  }

  function signIn(email, password, cb) {
    fetch(MAIN_SUPABASE_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': MAIN_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ email: email, password: password }),
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.access_token) {
        var session = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: data.expires_at || (Date.now() / 1000 + data.expires_in),
          user: data.user,
        };
        storeSession(session);
        cb(null, session);
      } else {
        cb(data.error_description || data.msg || 'Login failed');
      }
    })
    .catch(function (err) { cb(err.message || 'Network error'); });
  }

  function refreshSession(cb) {
    var raw = localStorage.getItem('dp_admin_session');
    if (!raw) return cb('No session');
    var s;
    try { s = JSON.parse(raw); } catch (e) { return cb('Invalid session'); }
    if (!s || !s.refresh_token) return cb('No refresh token');

    fetch(MAIN_SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': MAIN_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ refresh_token: s.refresh_token }),
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.access_token) {
        var session = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: data.expires_at || (Date.now() / 1000 + data.expires_in),
          user: data.user,
        };
        storeSession(session);
        cb(null, session);
      } else {
        storeSession(null);
        cb(data.error_description || 'Refresh failed');
      }
    })
    .catch(function (err) {
      storeSession(null);
      cb(err.message || 'Network error');
    });
  }

  function getValidSession(cb) {
    var s = getStoredSession();
    if (s) return cb(null, s);
    refreshSession(cb);
  }

  function signOut() {
    storeSession(null);
    state.session = null;
    state.view = 'login';
    render();
  }

  // --- Edge Function Caller ---

  function callEdgeFn(action, data, opts, cb) {
    if (typeof opts === 'function') { cb = opts; opts = {}; }
    var needsAuth = opts.auth !== false;

    function doCall(token) {
      var headers = {
        'Content-Type': 'application/json',
        'apikey': MAIN_SUPABASE_ANON_KEY,
      };
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }

      fetch(EDGE_FN_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ action: action, data: data || {} }),
      })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result.error) {
          cb(result.error);
        } else {
          cb(null, result);
        }
      })
      .catch(function (err) { cb(err.message || 'Network error'); });
    }

    if (needsAuth) {
      getValidSession(function (err, session) {
        if (err) {
          signOut();
          return;
        }
        doCall(session.access_token);
      });
    } else {
      doCall(null);
    }
  }

  // --- Data Loading ---

  function loadReadings() {
    state.loading = true;
    render();
    callEdgeFn('fetch-app-readings-with-feedback', { source: state.source }, { auth: false }, function (err, result) {
      state.loading = false;
      if (err) {
        console.error('Error loading readings:', err);
        showToast('Failed to load readings: ' + err, 'error');
        render();
        return;
      }
      state.readings = result.readings || [];
      applyFiltersAndSort();
      render();
    });
  }

  function loadFeedbackDetails(readingId) {
    callEdgeFn('fetch-app-feedback-details', { readingId: readingId, source: state.source }, { auth: false }, function (err, result) {
      if (err) {
        console.error('Error loading feedback details:', err);
        return;
      }
      state.feedbackDetails = result.details || [];
      render();
    });
  }

  function loadAppFeedback() {
    state.loading = true;
    render();
    callEdgeFn('fetch-app-feedback-list', {}, function (err, result) {
      state.loading = false;
      if (err) {
        console.error('Error loading app feedback:', err);
        showToast('Failed to load app feedback', 'error');
        render();
        return;
      }
      state.appFeedback = result.feedback || [];
      render();
    });
  }

  function loadAppFeedbackCount() {
    callEdgeFn('fetch-app-feedback-count', {}, { auth: false }, function (err, result) {
      if (!err && result) {
        state.appFeedbackCount = result.total || 0;
        render();
      }
    });
  }

  // --- Sorting & Filtering ---

  function applyFiltersAndSort() {
    var list = state.readings.slice();

    // Filter
    switch (state.filter) {
      case 'with_feedback':
        list = list.filter(function (r) { return r.total_ratings > 0; });
        break;
      case 'with_negative':
        list = list.filter(function (r) { return r.negative_count > 0; });
        break;
      case 'min_3':
        list = list.filter(function (r) { return r.total_ratings >= 3; });
        break;
      case 'favorited':
        list = list.filter(function (r) { return r.favorites_count > 0; });
        break;
      case 'needs_review':
        list = list.filter(function (r) { return r.admin_flagged_at; });
        break;
      case 'unaddressed':
        list = list.filter(function (r) { return (r.unaddressed_negative_count || 0) > 0; });
        break;
    }

    // Sort
    switch (state.sort) {
      case 'negative_pct':
        list.sort(function (a, b) { return b.negative_pct - a.negative_pct || b.total_ratings - a.total_ratings; });
        break;
      case 'total_ratings':
        list.sort(function (a, b) { return b.total_ratings - a.total_ratings; });
        break;
      case 'day_of_year':
        list.sort(function (a, b) { return a.day_of_year - b.day_of_year; });
        break;
      case 'most_recent':
        list.sort(function (a, b) {
          var da = a.most_recent_feedback || '';
          var db = b.most_recent_feedback || '';
          return db.localeCompare(da);
        });
        break;
      case 'favorites':
        list.sort(function (a, b) { return b.favorites_count - a.favorites_count; });
        break;
    }

    state.filteredReadings = list;
  }

  // --- Actions ---

  function saveReading(reading, updates, cb) {
    state.saving = true;
    render();
    updates.updated_at = new Date().toISOString();
    callEdgeFn('update', { id: reading.id, updateData: updates }, function (err) {
      state.saving = false;
      if (err) {
        showToast('Save failed: ' + err, 'error');
        render();
        if (cb) cb(err);
        return;
      }
      // Update local data
      Object.keys(updates).forEach(function (k) { reading[k] = updates[k]; });
      showToast('Saved successfully');
      render();
      if (cb) cb(null);
    });
  }

  function markFeedbackAddressed(feedbackId, addressed) {
    callEdgeFn('mark-feedback-addressed', { feedbackId: feedbackId, addressed: addressed }, function (err) {
      if (err) {
        showToast('Failed: ' + err, 'error');
        return;
      }
      // Update local state
      state.feedbackDetails.forEach(function (f) {
        if (f.id === feedbackId) f.addressed = addressed;
      });
      render();
    });
  }

  function markReadingReviewed(readingId, reviewed) {
    callEdgeFn('mark-reading-reviewed', { readingId: readingId, reviewed: reviewed }, function (err, result) {
      if (err) {
        showToast('Failed: ' + err, 'error');
        return;
      }
      var reading = state.readings.find(function (r) { return r.id === readingId; });
      if (reading) {
        if (reviewed) {
          reading.last_reviewed_at = result.last_reviewed_at || new Date().toISOString();
        } else {
          reading.admin_flagged_at = result.admin_flagged_at || new Date().toISOString();
        }
      }
      showToast(reviewed ? 'Marked as reviewed' : 'Flagged for review');
      render();
    });
  }

  function addressAllAndReview(readingId) {
    callEdgeFn('address-all-and-review', { readingId: readingId }, function (err, result) {
      if (err) {
        showToast('Failed: ' + err, 'error');
        return;
      }
      var reading = state.readings.find(function (r) { return r.id === readingId; });
      if (reading) {
        reading.last_reviewed_at = result.last_reviewed_at;
        reading.unaddressed_negative_count = 0;
      }
      state.feedbackDetails.forEach(function (f) {
        if (f.rating === 'negative') f.addressed = true;
      });
      showToast('All addressed & marked reviewed');
      render();
    });
  }

  function resetRatings(readingId) {
    if (!confirm('Permanently delete ALL feedback for this reading? This cannot be undone.')) return;
    callEdgeFn('reset-reading-ratings', { readingId: readingId }, function (err) {
      if (err) {
        showToast('Failed: ' + err, 'error');
        return;
      }
      var reading = state.readings.find(function (r) { return r.id === readingId; });
      if (reading) {
        reading.total_ratings = 0;
        reading.positive_count = 0;
        reading.negative_count = 0;
        reading.negative_pct = 0;
        reading.unaddressed_negative_count = 0;
        reading.most_recent_feedback = null;
      }
      state.feedbackDetails = [];
      showToast('All ratings reset');
      render();
    });
  }

  function deleteAppFeedback(feedbackId) {
    if (!confirm('Delete this feedback item?')) return;
    callEdgeFn('delete-app-feedback', { feedbackId: feedbackId }, function (err) {
      if (err) {
        showToast('Failed: ' + err, 'error');
        return;
      }
      state.appFeedback = state.appFeedback.filter(function (f) { return f.id !== feedbackId; });
      showToast('Feedback deleted');
      render();
    });
  }

  // --- Toast ---

  function showToast(msg, type) {
    var el = document.getElementById('admin-toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'admin-toast admin-toast--visible' + (type === 'error' ? ' admin-toast--error' : '');
    clearTimeout(el._timeout);
    el._timeout = setTimeout(function () {
      el.className = 'admin-toast';
    }, 3000);
  }

  // --- Render Engine ---

  function render() {
    var app = document.getElementById('admin-app');
    if (!app) return;

    switch (state.view) {
      case 'login':
        app.innerHTML = renderLogin();
        bindLogin();
        break;
      case 'dashboard':
        app.innerHTML = renderDashboard();
        bindDashboard();
        break;
      case 'reading':
        app.innerHTML = renderReadingEditor();
        bindReadingEditor();
        break;
      case 'app-feedback':
        app.innerHTML = renderAppFeedback();
        bindAppFeedback();
        break;
    }
  }

  // --- Login View ---

  function renderLogin() {
    return '<div class="admin-login">' +
      '<div class="admin-login-card">' +
        '<h1>Admin Login</h1>' +
        '<p class="admin-login-subtitle">Daily Paths Content Management</p>' +
        '<form id="login-form">' +
          '<div class="admin-field">' +
            '<label for="login-email">Email</label>' +
            '<input type="email" id="login-email" required autocomplete="email">' +
          '</div>' +
          '<div class="admin-field">' +
            '<label for="login-password">Password</label>' +
            '<input type="password" id="login-password" required autocomplete="current-password">' +
          '</div>' +
          '<div id="login-error" class="admin-error" hidden></div>' +
          '<button type="submit" class="admin-btn admin-btn--primary" id="login-btn">Sign In</button>' +
        '</form>' +
      '</div>' +
    '</div>';
  }

  function bindLogin() {
    var form = document.getElementById('login-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('login-email').value;
      var password = document.getElementById('login-password').value;
      var btn = document.getElementById('login-btn');
      var errEl = document.getElementById('login-error');
      btn.disabled = true;
      btn.textContent = 'Signing in...';
      errEl.hidden = true;

      signIn(email, password, function (err, session) {
        if (err) {
          errEl.textContent = err;
          errEl.hidden = false;
          btn.disabled = false;
          btn.textContent = 'Sign In';
          return;
        }
        state.session = session;
        state.view = 'dashboard';
        loadReadings();
        loadAppFeedbackCount();
      });
    });
  }

  // --- Dashboard View ---

  function renderDashboard() {
    var html = '<div class="admin-dashboard">';

    // Header
    html += '<header class="admin-header">' +
      '<div class="admin-header-left">' +
        '<h1 class="admin-title">Reading Feedback</h1>' +
      '</div>' +
      '<div class="admin-header-right">' +
        '<button class="admin-btn admin-btn--ghost" id="btn-app-feedback">App Feedback' +
          (state.appFeedbackCount > 0 ? ' <span class="admin-badge">' + state.appFeedbackCount + '</span>' : '') +
        '</button>' +
        '<button class="admin-btn admin-btn--ghost" id="btn-refresh">Refresh</button>' +
        '<button class="admin-btn admin-btn--ghost" id="btn-signout">Sign Out</button>' +
      '</div>' +
    '</header>';

    // Controls
    html += '<div class="admin-controls">' +
      '<div class="admin-control-group">' +
        '<label>Sort</label>' +
        '<select id="ctl-sort">' +
          '<option value="day_of_year"' + (state.sort === 'day_of_year' ? ' selected' : '') + '>Day of Year</option>' +
          '<option value="negative_pct"' + (state.sort === 'negative_pct' ? ' selected' : '') + '>Most Negative %</option>' +
          '<option value="total_ratings"' + (state.sort === 'total_ratings' ? ' selected' : '') + '>Most Ratings</option>' +
          '<option value="most_recent"' + (state.sort === 'most_recent' ? ' selected' : '') + '>Most Recent</option>' +
          '<option value="favorites"' + (state.sort === 'favorites' ? ' selected' : '') + '>Favorites</option>' +
        '</select>' +
      '</div>' +
      '<div class="admin-control-group">' +
        '<label>Filter</label>' +
        '<select id="ctl-filter">' +
          '<option value="all"' + (state.filter === 'all' ? ' selected' : '') + '>All Readings</option>' +
          '<option value="with_feedback"' + (state.filter === 'with_feedback' ? ' selected' : '') + '>Has Feedback</option>' +
          '<option value="with_negative"' + (state.filter === 'with_negative' ? ' selected' : '') + '>Has Negative</option>' +
          '<option value="min_3"' + (state.filter === 'min_3' ? ' selected' : '') + '>3+ Ratings</option>' +
          '<option value="favorited"' + (state.filter === 'favorited' ? ' selected' : '') + '>Favorited</option>' +
          '<option value="needs_review"' + (state.filter === 'needs_review' ? ' selected' : '') + '>Needs Review</option>' +
          '<option value="unaddressed"' + (state.filter === 'unaddressed' ? ' selected' : '') + '>Unaddressed</option>' +
        '</select>' +
      '</div>' +
      '<div class="admin-control-group">' +
        '<label>Source</label>' +
        '<select id="ctl-source">' +
          '<option value="all"' + (state.source === 'all' ? ' selected' : '') + '>All</option>' +
          '<option value="app"' + (state.source === 'app' ? ' selected' : '') + '>App Only</option>' +
          '<option value="web"' + (state.source === 'web' ? ' selected' : '') + '>Web Only</option>' +
        '</select>' +
      '</div>' +
      '<div class="admin-control-group">' +
        '<span class="admin-count">' + state.filteredReadings.length + ' of ' + state.readings.length + ' readings</span>' +
      '</div>' +
    '</div>';

    // Loading
    if (state.loading) {
      html += '<div class="admin-loading">Loading readings...</div>';
    }

    // Reading list
    html += '<div class="admin-reading-list">';
    for (var i = 0; i < state.filteredReadings.length; i++) {
      html += renderReadingCard(state.filteredReadings[i]);
    }
    if (!state.loading && state.filteredReadings.length === 0) {
      html += '<p class="admin-empty">No readings match the current filter.</p>';
    }
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderReadingCard(r) {
    var negPctClass = r.negative_pct > 30 ? 'admin-stat--danger' : r.negative_pct > 20 ? 'admin-stat--warn' : '';
    var hasUnaddressed = (r.unaddressed_negative_count || 0) > 0;
    var isReviewed = r.last_reviewed_at && (!r.admin_flagged_at || r.last_reviewed_at > r.admin_flagged_at);

    var html = '<div class="admin-reading-card" data-reading-id="' + r.id + '">';
    html += '<div class="admin-reading-card-main">';
    html += '<div class="admin-reading-card-title">' +
      '<span class="admin-reading-day">' + r.display_date + '</span> ' +
      escHtml(r.title || 'Untitled') +
    '</div>';

    // Badges
    html += '<div class="admin-reading-badges">';
    if (hasUnaddressed) {
      html += '<span class="admin-tag admin-tag--red">Needs Review</span>';
    }
    if (isReviewed) {
      html += '<span class="admin-tag admin-tag--green">Reviewed</span>';
    }
    if (r.admin_notes) {
      html += '<span class="admin-tag admin-tag--blue">Notes</span>';
    }
    html += '</div>';

    html += '</div>';

    // Stats
    html += '<div class="admin-reading-stats">';
    if (r.total_ratings > 0) {
      html += '<span class="admin-stat admin-stat--pos">' + r.positive_count + ' +</span>';
      html += '<span class="admin-stat ' + negPctClass + '">' + r.negative_count + ' &minus; (' + Math.round(r.negative_pct) + '%)</span>';
      html += '<span class="admin-stat">' + r.total_ratings + ' total</span>';
    } else {
      html += '<span class="admin-stat admin-stat--muted">No feedback</span>';
    }
    if (r.favorites_count > 0) {
      html += '<span class="admin-stat admin-stat--fav">' + r.favorites_count + ' fav</span>';
    }
    html += '</div>';

    html += '</div>';
    return html;
  }

  function bindDashboard() {
    // Card clicks
    var cards = document.querySelectorAll('.admin-reading-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function () {
        var id = this.getAttribute('data-reading-id');
        var reading = state.readings.find(function (r) { return r.id === id; });
        if (reading) openReading(reading);
      });
    }

    // Controls
    var sortEl = document.getElementById('ctl-sort');
    var filterEl = document.getElementById('ctl-filter');
    var sourceEl = document.getElementById('ctl-source');

    if (sortEl) sortEl.addEventListener('change', function () {
      state.sort = this.value;
      applyFiltersAndSort();
      render();
    });
    if (filterEl) filterEl.addEventListener('change', function () {
      state.filter = this.value;
      applyFiltersAndSort();
      render();
    });
    if (sourceEl) sourceEl.addEventListener('change', function () {
      state.source = this.value;
      loadReadings();
    });

    // Buttons
    var btnRefresh = document.getElementById('btn-refresh');
    if (btnRefresh) btnRefresh.addEventListener('click', function () {
      loadReadings();
      loadAppFeedbackCount();
    });

    var btnSignout = document.getElementById('btn-signout');
    if (btnSignout) btnSignout.addEventListener('click', signOut);

    var btnAppFb = document.getElementById('btn-app-feedback');
    if (btnAppFb) btnAppFb.addEventListener('click', function () {
      state.view = 'app-feedback';
      loadAppFeedback();
    });
  }

  function openReading(reading) {
    state.selectedReading = reading;
    state.editFields = {
      title: reading.title || '',
      quote: reading.quote || '',
      body: reading.body || '',
      application: reading.application || '',
      thought_for_day: reading.thought_for_day || '',
      admin_notes: reading.admin_notes || '',
    };
    state.originalFields = JSON.parse(JSON.stringify(state.editFields));
    state.feedbackDetails = [];
    state.view = 'reading';
    render();
    loadFeedbackDetails(reading.id);
  }

  // --- Reading Editor View ---

  function renderReadingEditor() {
    var r = state.selectedReading;
    if (!r) return '';

    var isReviewed = r.last_reviewed_at && (!r.admin_flagged_at || r.last_reviewed_at > r.admin_flagged_at);
    var isFlagged = r.admin_flagged_at && (!r.last_reviewed_at || r.admin_flagged_at >= r.last_reviewed_at);
    var hasChanges = JSON.stringify(state.editFields) !== JSON.stringify(state.originalFields);

    // Navigation within filtered list
    var idx = state.filteredReadings.indexOf(r);
    var hasPrev = idx > 0;
    var hasNext = idx < state.filteredReadings.length - 1;

    var html = '<div class="admin-editor">';

    // Editor header
    html += '<header class="admin-editor-header">' +
      '<button class="admin-btn admin-btn--ghost" id="btn-back">&larr; Back</button>' +
      '<div class="admin-editor-nav">' +
        '<button class="admin-btn admin-btn--ghost" id="btn-prev"' + (hasPrev ? '' : ' disabled') + '>&larr; Prev</button>' +
        '<span class="admin-nav-pos">' + (idx + 1) + ' / ' + state.filteredReadings.length + '</span>' +
        '<button class="admin-btn admin-btn--ghost" id="btn-next"' + (hasNext ? '' : ' disabled') + '>Next &rarr;</button>' +
      '</div>' +
    '</header>';

    // Two-column layout
    html += '<div class="admin-editor-layout">';

    // Left sidebar - feedback summary
    html += '<aside class="admin-editor-sidebar">';
    html += '<h2>' + escHtml(r.display_date) + '</h2>';
    html += '<h3>' + escHtml(r.title || 'Untitled') + '</h3>';

    // Rating summary
    html += '<div class="admin-sidebar-section">';
    html += '<h4>Ratings</h4>';
    if (r.total_ratings > 0) {
      html += '<div class="admin-rating-grid">' +
        '<div class="admin-rating-item admin-rating-item--pos"><span class="admin-rating-num">' + r.positive_count + '</span><span class="admin-rating-label">Positive</span></div>' +
        '<div class="admin-rating-item admin-rating-item--neg"><span class="admin-rating-num">' + r.negative_count + '</span><span class="admin-rating-label">Negative</span></div>' +
        '<div class="admin-rating-item"><span class="admin-rating-num">' + r.total_ratings + '</span><span class="admin-rating-label">Total</span></div>' +
        '<div class="admin-rating-item"><span class="admin-rating-num">' + Math.round(r.negative_pct) + '%</span><span class="admin-rating-label">Neg %</span></div>' +
      '</div>';
    } else {
      html += '<p class="admin-muted">No ratings yet</p>';
    }
    html += '</div>';

    // Feedback details
    if (state.feedbackDetails.length > 0) {
      var negFeedback = state.feedbackDetails.filter(function (f) { return f.rating === 'negative'; });
      if (negFeedback.length > 0) {
        html += '<div class="admin-sidebar-section">';
        html += '<h4>Negative Feedback Reasons</h4>';
        var reasons = { unclear: 0, too_long: 0, not_applicable: 0, language: 0 };
        var comments = [];
        negFeedback.forEach(function (f) {
          if (f.reason_unclear) reasons.unclear++;
          if (f.reason_too_long) reasons.too_long++;
          if (f.reason_not_applicable) reasons.not_applicable++;
          if (f.reason_language) reasons.language++;
          if (f.reason_other_text) comments.push({ text: f.reason_other_text, id: f.id, addressed: f.addressed });
        });

        html += '<div class="admin-reasons">';
        if (reasons.unclear) html += '<span class="admin-reason">Unclear <strong>' + reasons.unclear + '</strong></span>';
        if (reasons.too_long) html += '<span class="admin-reason">Too long <strong>' + reasons.too_long + '</strong></span>';
        if (reasons.not_applicable) html += '<span class="admin-reason">Not relevant <strong>' + reasons.not_applicable + '</strong></span>';
        if (reasons.language) html += '<span class="admin-reason">Tone/language <strong>' + reasons.language + '</strong></span>';
        html += '</div>';

        if (comments.length > 0) {
          html += '<div class="admin-comments">';
          html += '<h5>Comments</h5>';
          comments.forEach(function (c) {
            html += '<div class="admin-comment' + (c.addressed ? ' admin-comment--addressed' : '') + '">' +
              '<p>' + escHtml(c.text) + '</p>' +
              '<button class="admin-btn admin-btn--sm" data-toggle-addressed="' + c.id + '">' +
                (c.addressed ? 'Unmark' : 'Mark Addressed') +
              '</button>' +
            '</div>';
          });
          html += '</div>';
        }
        html += '</div>';
      }
    }

    // Review status
    html += '<div class="admin-sidebar-section">';
    html += '<h4>Review Status</h4>';
    if (isReviewed) {
      html += '<p class="admin-status admin-status--reviewed">Reviewed ' + formatDate(r.last_reviewed_at) + '</p>';
    } else if (isFlagged) {
      html += '<p class="admin-status admin-status--flagged">Flagged ' + formatDate(r.admin_flagged_at) + '</p>';
    } else {
      html += '<p class="admin-status admin-status--none">Not reviewed</p>';
    }
    html += '<div class="admin-review-actions">' +
      '<button class="admin-btn admin-btn--sm admin-btn--primary" id="btn-mark-reviewed">Mark Reviewed</button>' +
      '<button class="admin-btn admin-btn--sm" id="btn-flag-review">Flag for Review</button>' +
    '</div>';

    if (r.negative_count > 0) {
      html += '<button class="admin-btn admin-btn--sm admin-btn--primary" id="btn-address-all" style="margin-top:8px;width:100%">Address All & Mark Reviewed</button>';
    }

    html += '<button class="admin-btn admin-btn--sm admin-btn--danger" id="btn-reset-ratings" style="margin-top:12px;width:100%">Reset All Ratings (' + r.total_ratings + ')</button>';
    html += '</div>';

    html += '</aside>';

    // Right content - editor
    html += '<div class="admin-editor-main">';

    // Title
    html += renderField('title', 'Title', state.editFields.title, 'input');
    // Quote
    html += renderField('quote', 'Quote', state.editFields.quote, 'textarea', 3);
    // Opening (read-only)
    html += '<div class="admin-field-group">' +
      '<label class="admin-field-label">Opening <span class="admin-field-hint">(read-only)</span></label>' +
      '<div class="admin-field-readonly">' + escHtml(r.opening || '') + '</div>' +
    '</div>';
    // Body
    html += renderField('body', 'Body', state.editFields.body, 'textarea', 8);
    // Application
    html += renderField('application', 'Application', state.editFields.application, 'textarea', 4);
    // Thought for the Day
    html += renderField('thought_for_day', 'Thought for the Day', state.editFields.thought_for_day, 'textarea', 2);
    // Admin Notes
    html += renderField('admin_notes', 'Admin Notes', state.editFields.admin_notes, 'textarea', 3);

    // Save bar
    html += '<div class="admin-save-bar">';
    if (hasChanges) {
      html += '<span class="admin-unsaved">Unsaved changes</span>';
      html += '<button class="admin-btn admin-btn--ghost" id="btn-discard">Discard</button>';
    }
    html += '<button class="admin-btn admin-btn--primary" id="btn-save"' +
      (state.saving ? ' disabled' : '') + (!hasChanges ? ' disabled' : '') + '>' +
      (state.saving ? 'Saving...' : 'Save') +
    '</button>';
    html += '</div>';

    html += '</div>'; // editor-main
    html += '</div>'; // editor-layout
    html += '</div>'; // editor

    return html;
  }

  function renderField(name, label, value, type, rows) {
    var wc = '';
    if (name === 'body') {
      var count = wordCount(value);
      var cls = count >= 160 && count <= 180 ? 'admin-wc--ok' : 'admin-wc--warn';
      wc = '<span class="admin-wc ' + cls + '">' + count + ' words (target: 160-180)</span>';
    } else if (name === 'application') {
      var count = wordCount(value);
      var cls = count >= 25 && count <= 35 ? 'admin-wc--ok' : 'admin-wc--warn';
      wc = '<span class="admin-wc ' + cls + '">' + count + ' words (target: 25-35)</span>';
    }

    var html = '<div class="admin-field-group">';
    html += '<label class="admin-field-label">' + label + ' ' + wc + '</label>';

    if (type === 'textarea') {
      html += '<textarea class="admin-input admin-textarea" data-field="' + name + '" rows="' + (rows || 4) + '">' + escHtml(value) + '</textarea>';
    } else {
      html += '<input class="admin-input" type="text" data-field="' + name + '" value="' + escAttr(value) + '">';
    }

    html += '</div>';
    return html;
  }

  function bindReadingEditor() {
    var r = state.selectedReading;
    if (!r) return;

    // Back button
    var btnBack = document.getElementById('btn-back');
    if (btnBack) btnBack.addEventListener('click', function () {
      if (hasUnsavedChanges() && !confirm('Discard unsaved changes?')) return;
      state.view = 'dashboard';
      state.selectedReading = null;
      render();
    });

    // Prev/Next
    var btnPrev = document.getElementById('btn-prev');
    var btnNext = document.getElementById('btn-next');
    if (btnPrev) btnPrev.addEventListener('click', function () {
      if (hasUnsavedChanges() && !confirm('Discard unsaved changes?')) return;
      navigateReading(-1);
    });
    if (btnNext) btnNext.addEventListener('click', function () {
      if (hasUnsavedChanges() && !confirm('Discard unsaved changes?')) return;
      navigateReading(1);
    });

    // Field editing
    var inputs = document.querySelectorAll('[data-field]');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('input', function () {
        var field = this.getAttribute('data-field');
        state.editFields[field] = this.value;
        updateSaveBar();
      });
    }

    // Save
    var btnSave = document.getElementById('btn-save');
    if (btnSave) btnSave.addEventListener('click', function () {
      var changes = getChangedFields();
      if (Object.keys(changes).length === 0) return;
      saveReading(r, changes, function (err) {
        if (!err) {
          state.originalFields = JSON.parse(JSON.stringify(state.editFields));
          render();
        }
      });
    });

    // Discard
    var btnDiscard = document.getElementById('btn-discard');
    if (btnDiscard) btnDiscard.addEventListener('click', function () {
      state.editFields = JSON.parse(JSON.stringify(state.originalFields));
      render();
    });

    // Review actions
    var btnReviewed = document.getElementById('btn-mark-reviewed');
    if (btnReviewed) btnReviewed.addEventListener('click', function () { markReadingReviewed(r.id, true); });

    var btnFlag = document.getElementById('btn-flag-review');
    if (btnFlag) btnFlag.addEventListener('click', function () { markReadingReviewed(r.id, false); });

    var btnAddressAll = document.getElementById('btn-address-all');
    if (btnAddressAll) btnAddressAll.addEventListener('click', function () { addressAllAndReview(r.id); });

    var btnReset = document.getElementById('btn-reset-ratings');
    if (btnReset) btnReset.addEventListener('click', function () { resetRatings(r.id); });

    // Feedback addressed toggles
    var toggleBtns = document.querySelectorAll('[data-toggle-addressed]');
    for (var j = 0; j < toggleBtns.length; j++) {
      toggleBtns[j].addEventListener('click', function (e) {
        e.stopPropagation();
        var fbId = this.getAttribute('data-toggle-addressed');
        var fb = state.feedbackDetails.find(function (f) { return f.id === fbId; });
        if (fb) markFeedbackAddressed(fbId, !fb.addressed);
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', handleEditorKeydown);
  }

  function handleEditorKeydown(e) {
    if (state.view !== 'reading') {
      document.removeEventListener('keydown', handleEditorKeydown);
      return;
    }
    var active = document.activeElement;
    var isEditing = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
    if (isEditing) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (hasUnsavedChanges() && !confirm('Discard unsaved changes?')) return;
      navigateReading(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (hasUnsavedChanges() && !confirm('Discard unsaved changes?')) return;
      navigateReading(1);
    } else if (e.key === 'Escape') {
      if (hasUnsavedChanges() && !confirm('Discard unsaved changes?')) return;
      state.view = 'dashboard';
      state.selectedReading = null;
      render();
    }
  }

  function navigateReading(dir) {
    var idx = state.filteredReadings.indexOf(state.selectedReading);
    var nextIdx = idx + dir;
    if (nextIdx >= 0 && nextIdx < state.filteredReadings.length) {
      openReading(state.filteredReadings[nextIdx]);
    }
  }

  function hasUnsavedChanges() {
    return JSON.stringify(state.editFields) !== JSON.stringify(state.originalFields);
  }

  function getChangedFields() {
    var changes = {};
    Object.keys(state.editFields).forEach(function (k) {
      if (state.editFields[k] !== state.originalFields[k]) {
        changes[k] = state.editFields[k];
      }
    });
    return changes;
  }

  function updateSaveBar() {
    var bar = document.querySelector('.admin-save-bar');
    if (!bar) return;
    var hasChanges = hasUnsavedChanges();
    var btnSave = document.getElementById('btn-save');
    if (btnSave) btnSave.disabled = !hasChanges || state.saving;
    var unsaved = bar.querySelector('.admin-unsaved');
    var btnDiscard = document.getElementById('btn-discard');
    if (!hasChanges) {
      if (unsaved) unsaved.style.display = 'none';
      if (btnDiscard) btnDiscard.style.display = 'none';
    } else {
      if (unsaved) unsaved.style.display = '';
      if (btnDiscard) btnDiscard.style.display = '';
    }
    // Update word counts
    var bodyField = document.querySelector('[data-field="body"]');
    var appField = document.querySelector('[data-field="application"]');
    // Re-render word counts in labels
    var labels = document.querySelectorAll('.admin-wc');
    labels.forEach(function (el) {
      var group = el.closest('.admin-field-group');
      if (!group) return;
      var input = group.querySelector('[data-field]');
      if (!input) return;
      var field = input.getAttribute('data-field');
      var count = wordCount(input.value);
      if (field === 'body') {
        el.textContent = count + ' words (target: 160-180)';
        el.className = 'admin-wc ' + (count >= 160 && count <= 180 ? 'admin-wc--ok' : 'admin-wc--warn');
      } else if (field === 'application') {
        el.textContent = count + ' words (target: 25-35)';
        el.className = 'admin-wc ' + (count >= 25 && count <= 35 ? 'admin-wc--ok' : 'admin-wc--warn');
      }
    });
  }

  // --- App Feedback View ---

  function renderAppFeedback() {
    var html = '<div class="admin-app-feedback">';

    html += '<header class="admin-header">' +
      '<div class="admin-header-left">' +
        '<button class="admin-btn admin-btn--ghost" id="btn-back-fb">&larr; Back to Readings</button>' +
        '<h1 class="admin-title">App Feedback <span class="admin-badge">' + state.appFeedback.length + '</span></h1>' +
      '</div>' +
      '<div class="admin-header-right">' +
        '<button class="admin-btn admin-btn--ghost" id="btn-signout-fb">Sign Out</button>' +
      '</div>' +
    '</header>';

    if (state.loading) {
      html += '<div class="admin-loading">Loading feedback...</div>';
    }

    html += '<div class="admin-feedback-list">';
    for (var i = 0; i < state.appFeedback.length; i++) {
      var fb = state.appFeedback[i];
      html += '<div class="admin-feedback-card">' +
        '<div class="admin-feedback-text">' + escHtml(fb.feedback_text) + '</div>' +
        '<div class="admin-feedback-meta">' +
          '<span>' + escHtml(fb.platform || 'unknown') + '</span>' +
          '<span>v' + escHtml(fb.app_version || '?') + '</span>' +
          (fb.build_number ? '<span>Build ' + escHtml(fb.build_number) + '</span>' : '') +
          '<span>' + formatDate(fb.created_at) + '</span>' +
          (fb.contact_info ? '<a href="mailto:' + escAttr(fb.contact_info) + '">' + escHtml(fb.contact_info) + '</a>' : '') +
        '</div>' +
        '<button class="admin-btn admin-btn--sm admin-btn--danger" data-delete-fb="' + fb.id + '">Delete</button>' +
      '</div>';
    }
    if (!state.loading && state.appFeedback.length === 0) {
      html += '<p class="admin-empty">No app feedback submitted.</p>';
    }
    html += '</div>';

    html += '</div>';
    return html;
  }

  function bindAppFeedback() {
    var btnBack = document.getElementById('btn-back-fb');
    if (btnBack) btnBack.addEventListener('click', function () {
      state.view = 'dashboard';
      render();
    });

    var btnSignout = document.getElementById('btn-signout-fb');
    if (btnSignout) btnSignout.addEventListener('click', signOut);

    var deleteBtns = document.querySelectorAll('[data-delete-fb]');
    for (var i = 0; i < deleteBtns.length; i++) {
      deleteBtns[i].addEventListener('click', function () {
        var id = this.getAttribute('data-delete-fb');
        deleteAppFeedback(id);
      });
    }
  }

  // --- Utility Functions ---

  function escHtml(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escAttr(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function wordCount(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(function (w) { return w.length > 0; }).length;
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) { return iso; }
  }

  // --- Init ---

  function init() {
    var s = getStoredSession();
    if (s) {
      state.session = s;
      state.view = 'dashboard';
      render();
      loadReadings();
      loadAppFeedbackCount();
    } else {
      // Try refresh
      refreshSession(function (err, session) {
        if (!err && session) {
          state.session = session;
          state.view = 'dashboard';
          render();
          loadReadings();
          loadAppFeedbackCount();
        } else {
          state.view = 'login';
          render();
        }
      });
    }
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
