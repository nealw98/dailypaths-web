// Daily Paths — Admin Panel
// Single-page admin app with Supabase auth and reading management

(function () {
  'use strict';

  // --- Config ---
  var MAIN_SUPABASE_URL = 'https://hnmesmsegmgablcawogs.supabase.co';
  var MAIN_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhubWVzbXNlZ21nYWJsY2F3b2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNzIxOTAsImV4cCI6MjA3OTk0ODE5MH0.oEbM_Ah8J5ogRW-aIZPJQPEMoI4ZGB2ncbFPiF1G_mU';
  var EDGE_FN_URL = MAIN_SUPABASE_URL + '/functions/v1/external-readings';

  // External Supabase — direct access for steps & themes (no edge function needed)
  var EXT_SUPABASE_URL = 'https://ofmqgqaoubsiwujgvcil.supabase.co';
  var EXT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mbXFncWFvdWJzaXd1amd2Y2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDI1NzEsImV4cCI6MjA3OTQ3ODU3MX0.85ile88Honj3SdXzxGEPFA04LG0B4OjRsbChZ8oUnmE';

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
    view: 'login', // login | dashboard | reading | app-feedback | steps-list | step-detail | themes-list | theme-detail | shares-list | share-detail
    loading: false,
    saving: false,
    editFields: {},
    originalFields: {},
    // Steps & Themes
    steps: [],
    themes: [],
    selectedStep: null,
    selectedTheme: null,
    stepEditFields: {},
    stepOriginalFields: {},
    themeEditFields: {},
    themeOriginalFields: {},
    // Shares
    shares: [],
    sharesFilter: 'all',
    selectedShare: null,
    shareEditFields: {},
    shareOriginalFields: {},
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
      scrollToToday();
    });
  }

  function scrollToToday() {
    // Small delay to ensure DOM is painted
    setTimeout(function () {
      var el = document.getElementById('today-reading');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
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

  // --- Steps & Themes Data Loading ---

  function loadSteps() {
    state.loading = true;
    render();
    fetch(EXT_SUPABASE_URL + '/rest/v1/steps?order=number', {
      headers: {
        'apikey': EXT_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + EXT_SUPABASE_ANON_KEY,
      },
    })
    .then(function (res) { return res.json(); })
    .then(function (steps) {
      state.loading = false;
      state.steps = Array.isArray(steps) ? steps : [];
      render();
    })
    .catch(function (err) {
      state.loading = false;
      showToast('Failed to load steps: ' + (err.message || err), 'error');
      render();
    });
  }

  function loadThemes() {
    state.loading = true;
    render();
    fetch(EXT_SUPABASE_URL + '/rest/v1/themes?order=id', {
      headers: {
        'apikey': EXT_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + EXT_SUPABASE_ANON_KEY,
      },
    })
    .then(function (res) { return res.json(); })
    .then(function (themes) {
      state.loading = false;
      state.themes = Array.isArray(themes) ? themes : [];
      render();
    })
    .catch(function (err) {
      state.loading = false;
      showToast('Failed to load themes: ' + (err.message || err), 'error');
      render();
    });
  }

  function saveStep(stepNumber, updates, cb) {
    state.saving = true;
    render();
    updates.updated_at = new Date().toISOString();
    fetch(EXT_SUPABASE_URL + '/rest/v1/steps?number=eq.' + stepNumber, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EXT_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + EXT_SUPABASE_ANON_KEY,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(updates),
    })
    .then(function (res) {
      state.saving = false;
      if (!res.ok) {
        return res.json().then(function (err) {
          throw new Error(err.message || 'Save failed');
        });
      }
      // Update local data
      var step = state.steps.find(function (s) { return s.number === stepNumber; });
      if (step) {
        Object.keys(updates).forEach(function (k) { step[k] = updates[k]; });
      }
      showToast('Step saved successfully');
      render();
      if (cb) cb(null);
    })
    .catch(function (err) {
      state.saving = false;
      showToast('Save failed: ' + (err.message || err), 'error');
      render();
      if (cb) cb(err);
    });
  }

  function saveTheme(themeSlug, updates, cb) {
    state.saving = true;
    render();
    updates.updated_at = new Date().toISOString();
    fetch(EXT_SUPABASE_URL + '/rest/v1/themes?slug=eq.' + themeSlug, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EXT_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + EXT_SUPABASE_ANON_KEY,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(updates),
    })
    .then(function (res) {
      state.saving = false;
      if (!res.ok) {
        return res.json().then(function (err) {
          throw new Error(err.message || 'Save failed');
        });
      }
      // Update local data
      var theme = state.themes.find(function (t) { return t.slug === themeSlug; });
      if (theme) {
        Object.keys(updates).forEach(function (k) { theme[k] = updates[k]; });
      }
      showToast('Theme saved successfully');
      render();
      if (cb) cb(null);
    })
    .catch(function (err) {
      state.saving = false;
      showToast('Save failed: ' + (err.message || err), 'error');
      render();
      if (cb) cb(err);
    });
  }

  // --- Shares Data ---

  function loadShares() {
    state.loading = true;
    render();
    fetch(EXT_SUPABASE_URL + '/rest/v1/member_shares?order=created_at.desc', {
      headers: {
        'apikey': EXT_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + EXT_SUPABASE_ANON_KEY,
      },
    })
    .then(function (res) { return res.json(); })
    .then(function (shares) {
      state.loading = false;
      state.shares = Array.isArray(shares) ? shares : [];
      render();
    })
    .catch(function (err) {
      state.loading = false;
      showToast('Failed to load shares: ' + (err.message || err), 'error');
      render();
    });
  }

  function saveShare(shareId, updates, cb) {
    state.saving = true;
    render();
    fetch(EXT_SUPABASE_URL + '/rest/v1/member_shares?id=eq.' + shareId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EXT_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + EXT_SUPABASE_ANON_KEY,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(updates),
    })
    .then(function (res) {
      state.saving = false;
      if (!res.ok) {
        return res.json().then(function (err) {
          throw new Error(err.message || 'Save failed');
        });
      }
      var share = state.shares.find(function (s) { return s.id === shareId; });
      if (share) {
        Object.keys(updates).forEach(function (k) { share[k] = updates[k]; });
      }
      showToast('Share saved');
      render();
      if (cb) cb(null);
    })
    .catch(function (err) {
      state.saving = false;
      showToast('Save failed: ' + (err.message || err), 'error');
      render();
      if (cb) cb(err);
    });
  }

  function deleteShare(shareId, cb) {
    fetch(EXT_SUPABASE_URL + '/rest/v1/member_shares?id=eq.' + shareId, {
      method: 'DELETE',
      headers: {
        'apikey': EXT_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + EXT_SUPABASE_ANON_KEY,
      },
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Delete failed');
      state.shares = state.shares.filter(function (s) { return s.id !== shareId; });
      showToast('Share deleted');
      if (cb) cb(null);
    })
    .catch(function (err) {
      showToast('Delete failed: ' + (err.message || err), 'error');
      if (cb) cb(err);
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
      case 'steps-list':
        app.innerHTML = renderStepsList();
        bindStepsList();
        break;
      case 'step-detail':
        app.innerHTML = renderStepDetail();
        bindStepDetail();
        break;
      case 'themes-list':
        app.innerHTML = renderThemesList();
        bindThemesList();
        break;
      case 'theme-detail':
        app.innerHTML = renderThemeDetail();
        bindThemeDetail();
        break;
      case 'shares-list':
        app.innerHTML = renderSharesList();
        bindSharesList();
        break;
      case 'share-detail':
        app.innerHTML = renderShareDetail();
        bindShareDetail();
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
        '<button class="admin-btn admin-btn--ghost" id="btn-steps">Steps</button>' +
        '<button class="admin-btn admin-btn--ghost" id="btn-themes">Themes</button>' +
        '<button class="admin-btn admin-btn--ghost" id="btn-shares">Shares' +
          (state.shares.filter(function (s) { return !s.is_approved; }).length > 0 ? ' <span class="admin-badge">' + state.shares.filter(function (s) { return !s.is_approved; }).length + '</span>' : '') +
        '</button>' +
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

  // --- localStorage seen-count helpers ---

  function getSeenCount(readingId, key) {
    try {
      var v = localStorage.getItem('seen_' + key + '_' + readingId);
      return v ? parseInt(v, 10) : 0;
    } catch (e) { return 0; }
  }

  function setSeenCount(readingId, key, count) {
    try { localStorage.setItem('seen_' + key + '_' + readingId, String(count)); } catch (e) {}
  }

  function renderReadingCard(r) {
    var isToday = r.day_of_year === getTodayDayOfYear();
    var unaddressedCount = r.unaddressed_negative_count || 0;
    var needsReview = unaddressedCount > 0;

    // "New" badge logic — compare current counts to what we last dismissed
    var seenPositive = getSeenCount(r.id, 'positive');
    var seenFavorites = getSeenCount(r.id, 'favorites');
    var newPositiveCount = r.positive_count - seenPositive;
    var hasNewPositive = newPositiveCount > 0;
    var newFavoriteCount = (r.favorites_count || 0) - seenFavorites;
    var hasNewFavorite = newFavoriteCount > 0;

    // Review status
    var hasBeenReviewed = !!r.last_reviewed_at;
    var isFullyReviewed = hasBeenReviewed && !needsReview && !hasNewPositive && !hasNewFavorite;
    var isNotReviewed = !hasBeenReviewed && r.total_ratings === 0 && (r.favorites_count || 0) === 0;

    // Priority flag color
    var priorityFlag = '';
    if (r.negative_pct > 30) {
      priorityFlag = '<span class="admin-priority-flag admin-priority-flag--red">&#9873;</span>';
    } else if (r.negative_pct > 20) {
      priorityFlag = '<span class="admin-priority-flag admin-priority-flag--yellow">&#9873;</span>';
    }

    var html = '<div class="admin-reading-card' + (isToday ? ' admin-reading-card--today' : '') + '"' +
      (isToday ? ' id="today-reading"' : '') +
      ' data-reading-id="' + r.id + '">';

    html += '<div class="admin-reading-card-main">';

    // Title row with priority flag
    html += '<div class="admin-reading-card-title">';
    html += priorityFlag;
    html += '<span class="admin-reading-title-text">' + escHtml(r.title || 'Untitled') + '</span>';

    // Badges inline with title
    if (needsReview) {
      html += '<span class="admin-tag admin-tag--amber">Needs Review (' + unaddressedCount + ')</span>';
    }
    if (hasNewPositive) {
      html += '<span class="admin-tag admin-tag--new-pos" data-dismiss-positive="' + r.id + '" data-count="' + r.positive_count + '">New Positive (' + newPositiveCount + ')</span>';
    }
    if (hasNewFavorite) {
      html += '<span class="admin-tag admin-tag--new-fav" data-dismiss-favorite="' + r.id + '" data-count="' + (r.favorites_count || 0) + '">New Favorite (' + newFavoriteCount + ')</span>';
    }
    if (isFullyReviewed) {
      html += '<span class="admin-tag admin-tag--reviewed">Reviewed</span>';
    }
    if (isNotReviewed && !needsReview && !hasNewPositive && !hasNewFavorite) {
      html += '<span class="admin-tag admin-tag--muted">Not Reviewed</span>';
    }
    if (r.admin_notes) {
      html += '<span class="admin-tag admin-tag--blue" title="Has admin notes">Notes</span>';
    }

    html += '</div>';

    // Subtitle: Day N · Date
    html += '<p class="admin-reading-sub">Day ' + r.day_of_year + ' &middot; ' + escHtml(r.display_date) + '</p>';

    html += '</div>';

    // Stats: thumbs up / thumbs down / favs
    html += '<div class="admin-reading-stats">';
    html += '<span class="admin-stat admin-stat--pos" title="Positive">' +
      '<svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>' +
      r.positive_count + '</span>';
    html += '<span class="admin-stat admin-stat--neg" title="Negative">' +
      '<svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>' +
      r.negative_count + '</span>';
    if (r.favorites_count > 0) {
      html += '<span class="admin-stat admin-stat--fav" title="Favorites">' +
        '<svg class="admin-icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
        r.favorites_count + '</span>';
    }
    if (r.total_ratings === 0 && !r.favorites_count) {
      html += '<span class="admin-stat admin-stat--none">No feedback yet</span>';
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

    // Dismiss "New Positive" badges
    var posBadges = document.querySelectorAll('[data-dismiss-positive]');
    for (var p = 0; p < posBadges.length; p++) {
      posBadges[p].addEventListener('click', function (e) {
        e.stopPropagation();
        var rid = this.getAttribute('data-dismiss-positive');
        var count = parseInt(this.getAttribute('data-count'), 10);
        setSeenCount(rid, 'positive', count);
        this.remove();
      });
    }

    // Dismiss "New Favorite" badges
    var favBadges = document.querySelectorAll('[data-dismiss-favorite]');
    for (var f = 0; f < favBadges.length; f++) {
      favBadges[f].addEventListener('click', function (e) {
        e.stopPropagation();
        var rid = this.getAttribute('data-dismiss-favorite');
        var count = parseInt(this.getAttribute('data-count'), 10);
        setSeenCount(rid, 'favorites', count);
        this.remove();
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

    var btnSteps = document.getElementById('btn-steps');
    if (btnSteps) btnSteps.addEventListener('click', function () {
      state.view = 'steps-list';
      if (state.steps.length === 0) loadSteps();
      else render();
    });

    var btnThemes = document.getElementById('btn-themes');
    if (btnThemes) btnThemes.addEventListener('click', function () {
      state.view = 'themes-list';
      if (state.themes.length === 0) loadThemes();
      else render();
    });

    var btnShares = document.getElementById('btn-shares');
    if (btnShares) btnShares.addEventListener('click', function () {
      state.view = 'shares-list';
      loadShares();
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
    if (r.total_ratings > 0 || r.favorites_count > 0) {
      html += '<div class="admin-rating-grid">' +
        '<div class="admin-rating-item admin-rating-item--pos"><span class="admin-rating-num">' + (r.positive_count || 0) + '</span><span class="admin-rating-label">Positive</span></div>' +
        '<div class="admin-rating-item admin-rating-item--neg"><span class="admin-rating-num">' + (r.negative_count || 0) + '</span><span class="admin-rating-label">Negative</span></div>' +
        '<div class="admin-rating-item"><span class="admin-rating-num">' + (r.total_ratings || 0) + '</span><span class="admin-rating-label">Total</span></div>' +
        '<div class="admin-rating-item admin-rating-item--fav"><span class="admin-rating-num">' + (r.favorites_count || 0) + '</span><span class="admin-rating-label">\u2764 Favorites</span></div>' +
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

  // --- Steps List View ---

  function renderStepsList() {
    var html = '<div class="admin-steps-list">';

    html += '<header class="admin-header">' +
      '<div class="admin-header-left">' +
        '<button class="admin-btn admin-btn--ghost" id="btn-back-steps">&larr; Back to Readings</button>' +
        '<h1 class="admin-title">Steps <span class="admin-badge">' + state.steps.length + '</span></h1>' +
      '</div>' +
      '<div class="admin-header-right">' +
        '<button class="admin-btn admin-btn--ghost" id="btn-refresh-steps">Refresh</button>' +
        '<button class="admin-btn admin-btn--ghost" id="btn-signout-steps">Sign Out</button>' +
      '</div>' +
    '</header>';

    if (state.loading) {
      html += '<div class="admin-loading">Loading steps...</div>';
    }

    html += '<div class="admin-list-items">';
    for (var i = 0; i < state.steps.length; i++) {
      var s = state.steps[i];
      html += '<div class="admin-list-card" data-step-number="' + s.number + '">' +
        '<div class="admin-list-card-main">' +
          '<div class="admin-list-card-title">' +
            '<span class="admin-list-card-num">Step ' + s.number + '</span>' +
            '<span class="admin-list-card-name">' + escHtml(s.principle) + '</span>' +
          '</div>' +
          '<p class="admin-reading-sub">' + escHtml(s.month) + ' &middot; ' + escHtml(s.tagline || '') + '</p>' +
        '</div>' +
        '<div class="admin-list-card-meta">' +
          (s.updated_at ? '<span class="admin-meta-date">' + formatDate(s.updated_at) + '</span>' : '') +
        '</div>' +
      '</div>';
    }
    if (!state.loading && state.steps.length === 0) {
      html += '<p class="admin-empty">No steps found. Run the seed script first.</p>';
    }
    html += '</div>';

    html += '</div>';
    return html;
  }

  function bindStepsList() {
    var btnBack = document.getElementById('btn-back-steps');
    if (btnBack) btnBack.addEventListener('click', function () {
      state.view = 'dashboard';
      render();
    });

    var btnRefresh = document.getElementById('btn-refresh-steps');
    if (btnRefresh) btnRefresh.addEventListener('click', function () { loadSteps(); });

    var btnSignout = document.getElementById('btn-signout-steps');
    if (btnSignout) btnSignout.addEventListener('click', signOut);

    var cards = document.querySelectorAll('.admin-list-card[data-step-number]');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function () {
        var num = parseInt(this.getAttribute('data-step-number'), 10);
        var step = state.steps.find(function (s) { return s.number === num; });
        if (step) openStep(step);
      });
    }
  }

  function openStep(step) {
    state.selectedStep = step;
    state.stepEditFields = {
      description: (step.description || []).slice(),
      descriptionPlain: (step.description || []).join('\n\n'),
      questions: (step.questions || []).slice(),
      tools: (step.tools || []).slice(),
      pull_quote: step.pull_quote || '',
    };
    state.stepOriginalFields = JSON.parse(JSON.stringify(state.stepEditFields));
    state.view = 'step-detail';
    render();
  }

  // --- Step Detail View ---

  function renderStepDetail() {
    var s = state.selectedStep;
    if (!s) return '';

    var hasChanges = JSON.stringify(state.stepEditFields) !== JSON.stringify(state.stepOriginalFields);

    // Nav
    var idx = state.steps.indexOf(s);
    var hasPrev = idx > 0;
    var hasNext = idx < state.steps.length - 1;

    var html = '<div class="admin-editor">';

    html += '<header class="admin-editor-header">' +
      '<button class="admin-btn admin-btn--ghost" id="btn-back-step">&larr; Back to Steps</button>' +
      '<div class="admin-editor-nav">' +
        '<button class="admin-btn admin-btn--ghost" id="btn-prev-step"' + (hasPrev ? '' : ' disabled') + '>&larr; Prev</button>' +
        '<span class="admin-nav-pos">' + (idx + 1) + ' / ' + state.steps.length + '</span>' +
        '<button class="admin-btn admin-btn--ghost" id="btn-next-step"' + (hasNext ? '' : ' disabled') + '>Next &rarr;</button>' +
      '</div>' +
    '</header>';

    html += '<div class="admin-step-editor-layout">';

    // Sidebar
    html += '<aside class="admin-editor-sidebar">';
    html += '<h2>Step ' + s.number + '</h2>';
    html += '<h3>' + escHtml(s.principle) + '</h3>';
    html += '<p class="admin-muted">' + escHtml(s.month) + '</p>';
    html += '<p class="admin-muted" style="font-size:12px;margin-top:4px;">' + escHtml(s.text || '') + '</p>';
    if (s.updated_at) {
      html += '<p class="admin-muted" style="margin-top:12px;font-size:11px;">Updated: ' + formatDate(s.updated_at) + '</p>';
    }
    html += '</aside>';

    // Main content
    html += '<div class="admin-editor-main">';

    // Description
    html += '<div class="admin-field-group">';
    html += '<label class="admin-field-label">Description <span class="admin-wc ' +
      (totalWordCount(state.stepEditFields.description) >= 100 ? 'admin-wc--ok' : 'admin-wc--warn') + '">' +
      totalWordCount(state.stepEditFields.description) + ' words</span></label>';
    html += '<p class="admin-field-hint">Separate paragraphs with a blank line.</p>';
    html += '<textarea class="admin-input admin-textarea" data-step-field="descriptionPlain" rows="12">' + escHtml(state.stepEditFields.descriptionPlain) + '</textarea>';
    html += '</div>';

    // Questions list editor
    html += renderListEditor('step-questions', 'Questions for Reflection', state.stepEditFields.questions);

    // Pull quote
    html += '<div class="admin-field-group">';
    html += '<label class="admin-field-label">Pull Quote</label>';
    html += '<textarea class="admin-input admin-textarea" data-step-field="pull_quote" rows="2">' + escHtml(state.stepEditFields.pull_quote) + '</textarea>';
    html += '</div>';

    // Deep Dive (tools) list editor
    html += renderListEditor('step-tools', 'Deep Dive Items', state.stepEditFields.tools);

    // Save bar
    html += '<div class="admin-save-bar">';
    if (hasChanges) {
      html += '<span class="admin-unsaved">Unsaved changes</span>';
      html += '<button class="admin-btn admin-btn--ghost" id="btn-discard-step">Discard</button>';
    }
    html += '<button class="admin-btn admin-btn--primary" id="btn-save-step"' +
      (state.saving ? ' disabled' : '') + (!hasChanges ? ' disabled' : '') + '>' +
      (state.saving ? 'Saving...' : 'Save') +
    '</button>';
    html += '</div>';

    html += '</div>'; // editor-main
    html += '</div>'; // layout
    html += '</div>'; // editor

    return html;
  }

  function bindStepDetail() {
    var s = state.selectedStep;
    if (!s) return;

    // Back
    var btnBack = document.getElementById('btn-back-step');
    if (btnBack) btnBack.addEventListener('click', function () {
      if (hasStepChanges() && !confirm('Discard unsaved changes?')) return;
      state.view = 'steps-list';
      state.selectedStep = null;
      render();
    });

    // Prev / Next
    var btnPrev = document.getElementById('btn-prev-step');
    var btnNext = document.getElementById('btn-next-step');
    if (btnPrev) btnPrev.addEventListener('click', function () {
      if (hasStepChanges() && !confirm('Discard unsaved changes?')) return;
      navigateStep(-1);
    });
    if (btnNext) btnNext.addEventListener('click', function () {
      if (hasStepChanges() && !confirm('Discard unsaved changes?')) return;
      navigateStep(1);
    });

    // Simple fields (pull_quote, descriptionPlain)
    var simpleInputs = document.querySelectorAll('[data-step-field]');
    for (var j = 0; j < simpleInputs.length; j++) {
      simpleInputs[j].addEventListener('input', function () {
        var field = this.getAttribute('data-step-field');
        state.stepEditFields[field] = this.value;
        if (field === 'descriptionPlain') {
          state.stepEditFields.description = this.value.split(/\n\s*\n/).filter(function (p) { return p.trim().length > 0; }).map(function (p) { return p.trim(); });
          // Update word count
          var wcSpan = this.closest('.admin-field-group').querySelector('.admin-wc');
          if (wcSpan) {
            var wc = totalWordCount(state.stepEditFields.description);
            wcSpan.textContent = wc + ' words';
            wcSpan.className = 'admin-wc ' + (wc >= 100 ? 'admin-wc--ok' : 'admin-wc--warn');
          }
        }
        updateStepSaveBar();
      });
    }

    // List editors
    bindListEditor('step-questions', state.stepEditFields.questions, function (newList) {
      state.stepEditFields.questions = newList;
      render();
    });
    bindListEditor('step-tools', state.stepEditFields.tools, function (newList) {
      state.stepEditFields.tools = newList;
      render();
    });

    // Save
    var btnSave = document.getElementById('btn-save-step');
    if (btnSave) btnSave.addEventListener('click', function () {
      if (!hasStepChanges()) return;
      // Strip descriptionPlain before saving — only send real DB fields
      var saveData = JSON.parse(JSON.stringify(state.stepEditFields));
      delete saveData.descriptionPlain;
      saveStep(s.number, saveData, function (err) {
        if (!err) {
          state.stepOriginalFields = JSON.parse(JSON.stringify(state.stepEditFields));
          render();
        }
      });
    });

    // Discard
    var btnDiscard = document.getElementById('btn-discard-step');
    if (btnDiscard) btnDiscard.addEventListener('click', function () {
      state.stepEditFields = JSON.parse(JSON.stringify(state.stepOriginalFields));
      render();
    });
  }

  function hasStepChanges() {
    return JSON.stringify(state.stepEditFields) !== JSON.stringify(state.stepOriginalFields);
  }

  function navigateStep(dir) {
    var idx = state.steps.indexOf(state.selectedStep);
    var nextIdx = idx + dir;
    if (nextIdx >= 0 && nextIdx < state.steps.length) {
      openStep(state.steps[nextIdx]);
    }
  }

  function updateStepSaveBar() {
    var bar = document.querySelector('.admin-save-bar');
    if (!bar) return;
    var changed = hasStepChanges();
    var btnSave = document.getElementById('btn-save-step');
    if (btnSave) btnSave.disabled = !changed || state.saving;
    // Update word count
    var wcEl = bar.closest('.admin-editor-main');
    if (!wcEl) wcEl = document.querySelector('.admin-editor-main');
    if (wcEl) {
      var wcSpans = wcEl.querySelectorAll('.admin-wc');
      if (wcSpans.length > 0) {
        var wc = totalWordCount(state.stepEditFields.description);
        wcSpans[0].textContent = wc + ' words';
        wcSpans[0].className = 'admin-wc ' + (wc >= 100 ? 'admin-wc--ok' : 'admin-wc--warn');
      }
    }
  }

  // --- Themes List View ---

  function renderThemesList() {
    var html = '<div class="admin-themes-list">';

    html += '<header class="admin-header">' +
      '<div class="admin-header-left">' +
        '<button class="admin-btn admin-btn--ghost" id="btn-back-themes">&larr; Back to Readings</button>' +
        '<h1 class="admin-title">Themes <span class="admin-badge">' + state.themes.length + '</span></h1>' +
      '</div>' +
      '<div class="admin-header-right">' +
        '<button class="admin-btn admin-btn--ghost" id="btn-refresh-themes">Refresh</button>' +
        '<button class="admin-btn admin-btn--ghost" id="btn-signout-themes">Sign Out</button>' +
      '</div>' +
    '</header>';

    if (state.loading) {
      html += '<div class="admin-loading">Loading themes...</div>';
    }

    html += '<div class="admin-list-items">';
    for (var i = 0; i < state.themes.length; i++) {
      var t = state.themes[i];
      html += '<div class="admin-list-card" data-theme-slug="' + escAttr(t.slug) + '">' +
        '<div class="admin-list-card-main">' +
          '<div class="admin-list-card-title">' +
            '<span class="admin-list-card-name">' + escHtml(t.name) + '</span>' +
          '</div>' +
          '<p class="admin-reading-sub">' + escHtml(t.short_description || '') + '</p>' +
        '</div>' +
        '<div class="admin-list-card-meta">' +
          (t.updated_at ? '<span class="admin-meta-date">' + formatDate(t.updated_at) + '</span>' : '') +
        '</div>' +
      '</div>';
    }
    if (!state.loading && state.themes.length === 0) {
      html += '<p class="admin-empty">No themes found. Run the seed script first.</p>';
    }
    html += '</div>';

    html += '</div>';
    return html;
  }

  function bindThemesList() {
    var btnBack = document.getElementById('btn-back-themes');
    if (btnBack) btnBack.addEventListener('click', function () {
      state.view = 'dashboard';
      render();
    });

    var btnRefresh = document.getElementById('btn-refresh-themes');
    if (btnRefresh) btnRefresh.addEventListener('click', function () { loadThemes(); });

    var btnSignout = document.getElementById('btn-signout-themes');
    if (btnSignout) btnSignout.addEventListener('click', signOut);

    var cards = document.querySelectorAll('.admin-list-card[data-theme-slug]');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function () {
        var slug = this.getAttribute('data-theme-slug');
        var theme = state.themes.find(function (t) { return t.slug === slug; });
        if (theme) openTheme(theme);
      });
    }
  }

  function openTheme(theme) {
    state.selectedTheme = theme;
    state.themeEditFields = {
      body: theme.body || '',
      bodyPlain: htmlToPlainText(theme.body || ''),
      short_description: theme.short_description || '',
      meta_description: theme.meta_description || '',
      pull_quote: theme.pull_quote || '',
      theme_tags: (theme.theme_tags || []).slice(),
      tools: (theme.tools || []).slice(),
    };
    state.themeOriginalFields = JSON.parse(JSON.stringify(state.themeEditFields));
    state.view = 'theme-detail';
    render();
  }

  // --- Theme Detail View ---

  function renderThemeDetail() {
    var t = state.selectedTheme;
    if (!t) return '';

    var hasChanges = JSON.stringify(state.themeEditFields) !== JSON.stringify(state.themeOriginalFields);

    var idx = state.themes.indexOf(t);
    var hasPrev = idx > 0;
    var hasNext = idx < state.themes.length - 1;

    var html = '<div class="admin-editor">';

    html += '<header class="admin-editor-header">' +
      '<button class="admin-btn admin-btn--ghost" id="btn-back-theme">&larr; Back to Themes</button>' +
      '<div class="admin-editor-nav">' +
        '<button class="admin-btn admin-btn--ghost" id="btn-prev-theme"' + (hasPrev ? '' : ' disabled') + '>&larr; Prev</button>' +
        '<span class="admin-nav-pos">' + (idx + 1) + ' / ' + state.themes.length + '</span>' +
        '<button class="admin-btn admin-btn--ghost" id="btn-next-theme"' + (hasNext ? '' : ' disabled') + '>Next &rarr;</button>' +
      '</div>' +
    '</header>';

    html += '<div class="admin-step-editor-layout">';

    // Sidebar
    html += '<aside class="admin-editor-sidebar">';
    html += '<h2>' + escHtml(t.slug) + '</h2>';
    html += '<h3>' + escHtml(t.name) + '</h3>';
    if (t.image) {
      html += '<p class="admin-muted" style="font-size:11px;">Image: ' + escHtml(t.image) + '</p>';
    }
    if (t.updated_at) {
      html += '<p class="admin-muted" style="margin-top:12px;font-size:11px;">Updated: ' + formatDate(t.updated_at) + '</p>';
    }
    html += '</aside>';

    // Main
    html += '<div class="admin-editor-main">';

    // Body (plain text editor with preview)
    var bodyWc = wordCount(stripHtml(state.themeEditFields.body));
    html += '<div class="admin-field-group">';
    html += '<label class="admin-field-label">Body <span class="admin-wc ' +
      (bodyWc >= 50 ? 'admin-wc--ok' : 'admin-wc--warn') + '">' + bodyWc + ' words</span></label>';
    html += '<p class="admin-field-hint">Separate paragraphs with a blank line. Use **bold**, *italic*, and [link text](url) for formatting.</p>';
    html += '<textarea class="admin-input admin-textarea" data-theme-field="bodyPlain" rows="12">' + escHtml(state.themeEditFields.bodyPlain) + '</textarea>';
    html += '<details class="admin-preview-toggle"><summary>Preview</summary>';
    html += '<div class="admin-preview">' + (state.themeEditFields.body || '<em>No content</em>') + '</div>';
    html += '</details>';
    html += '</div>';

    // Short description
    html += '<div class="admin-field-group">';
    html += '<label class="admin-field-label">Short Description</label>';
    html += '<input class="admin-input" type="text" data-theme-field="short_description" value="' + escAttr(state.themeEditFields.short_description) + '">';
    html += '</div>';

    // Meta description
    html += '<div class="admin-field-group">';
    html += '<label class="admin-field-label">Meta Description</label>';
    html += '<input class="admin-input" type="text" data-theme-field="meta_description" value="' + escAttr(state.themeEditFields.meta_description) + '">';
    html += '</div>';

    // Pull quote
    html += '<div class="admin-field-group">';
    html += '<label class="admin-field-label">Pull Quote</label>';
    html += '<textarea class="admin-input admin-textarea" data-theme-field="pull_quote" rows="2">' + escHtml(state.themeEditFields.pull_quote) + '</textarea>';
    html += '</div>';

    // Tools list editor
    html += renderListEditor('theme-tools', 'Recovery Tools', state.themeEditFields.tools);

    // Save bar
    html += '<div class="admin-save-bar">';
    if (hasChanges) {
      html += '<span class="admin-unsaved">Unsaved changes</span>';
      html += '<button class="admin-btn admin-btn--ghost" id="btn-discard-theme">Discard</button>';
    }
    html += '<button class="admin-btn admin-btn--primary" id="btn-save-theme"' +
      (state.saving ? ' disabled' : '') + (!hasChanges ? ' disabled' : '') + '>' +
      (state.saving ? 'Saving...' : 'Save') +
    '</button>';
    html += '</div>';

    html += '</div>'; // editor-main
    html += '</div>'; // layout
    html += '</div>'; // editor

    return html;
  }

  function bindThemeDetail() {
    var t = state.selectedTheme;
    if (!t) return;

    // Back
    var btnBack = document.getElementById('btn-back-theme');
    if (btnBack) btnBack.addEventListener('click', function () {
      if (hasThemeChanges() && !confirm('Discard unsaved changes?')) return;
      state.view = 'themes-list';
      state.selectedTheme = null;
      render();
    });

    // Prev / Next
    var btnPrev = document.getElementById('btn-prev-theme');
    var btnNext = document.getElementById('btn-next-theme');
    if (btnPrev) btnPrev.addEventListener('click', function () {
      if (hasThemeChanges() && !confirm('Discard unsaved changes?')) return;
      navigateTheme(-1);
    });
    if (btnNext) btnNext.addEventListener('click', function () {
      if (hasThemeChanges() && !confirm('Discard unsaved changes?')) return;
      navigateTheme(1);
    });

    // Simple fields
    var inputs = document.querySelectorAll('[data-theme-field]');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('input', function () {
        var field = this.getAttribute('data-theme-field');
        if (field === 'bodyPlain') {
          state.themeEditFields.bodyPlain = this.value;
          state.themeEditFields.body = plainTextToHtml(this.value);
          // Update preview if open
          var preview = document.querySelector('.admin-preview');
          if (preview) preview.innerHTML = state.themeEditFields.body || '<em>No content</em>';
          // Update word count
          var wcSpan = this.closest('.admin-field-group').querySelector('.admin-wc');
          if (wcSpan) {
            var wc = wordCount(stripHtml(state.themeEditFields.body));
            wcSpan.textContent = wc + ' words';
            wcSpan.className = 'admin-wc ' + (wc >= 50 ? 'admin-wc--ok' : 'admin-wc--warn');
          }
        } else {
          state.themeEditFields[field] = this.value;
        }
        updateThemeSaveBar();
      });
    }

    // List editors
    bindListEditor('theme-tools', state.themeEditFields.tools, function (newList) {
      state.themeEditFields.tools = newList;
      render();
    });

    // Save
    var btnSave = document.getElementById('btn-save-theme');
    if (btnSave) btnSave.addEventListener('click', function () {
      if (!hasThemeChanges()) return;
      // Strip bodyPlain before saving — only send real DB fields
      var saveData = JSON.parse(JSON.stringify(state.themeEditFields));
      delete saveData.bodyPlain;
      saveTheme(t.slug, saveData, function (err) {
        if (!err) {
          state.themeOriginalFields = JSON.parse(JSON.stringify(state.themeEditFields));
          render();
        }
      });
    });

    // Discard
    var btnDiscard = document.getElementById('btn-discard-theme');
    if (btnDiscard) btnDiscard.addEventListener('click', function () {
      state.themeEditFields = JSON.parse(JSON.stringify(state.themeOriginalFields));
      render();
    });
  }

  function hasThemeChanges() {
    return JSON.stringify(state.themeEditFields) !== JSON.stringify(state.themeOriginalFields);
  }

  function navigateTheme(dir) {
    var idx = state.themes.indexOf(state.selectedTheme);
    var nextIdx = idx + dir;
    if (nextIdx >= 0 && nextIdx < state.themes.length) {
      openTheme(state.themes[nextIdx]);
    }
  }

  function updateThemeSaveBar() {
    var btnSave = document.getElementById('btn-save-theme');
    if (btnSave) btnSave.disabled = !hasThemeChanges() || state.saving;
  }

  // --- Shares List View ---

  // Theme slug → display name map
  var THEME_NAMES = {
    'detachment': 'Detachment with Love',
    'powerlessness': 'Powerlessness & Surrender',
    'focus-on-yourself': 'Focus on Yourself',
    'one-day-at-a-time': 'One Day at a Time',
    'boundaries': 'Boundaries',
    'letting-go-of-control': 'Letting Go of Control',
    'self-worth': 'Self-Worth & Identity',
    'higher-power': 'Trusting a Higher Power',
    'honesty': 'Honesty & Self-Awareness',
    'gratitude-and-hope': 'Gratitude & Hope',
    'the-disease': 'Understanding the Disease',
    'fellowship': 'Community & Fellowship',
  };

  function renderSharesList() {
    // Get unique theme slugs that have shares, sorted by theme name
    var themeSlugs = [];
    var seen = {};
    for (var t = 0; t < state.shares.length; t++) {
      var slug = state.shares[t].topic_slug;
      if (!seen[slug]) {
        seen[slug] = true;
        themeSlugs.push(slug);
      }
    }
    themeSlugs.sort(function (a, b) {
      return (THEME_NAMES[a] || a).localeCompare(THEME_NAMES[b] || b);
    });

    var filtered = state.shares.filter(function (s) {
      if (state.sharesFilter === 'all') return true;
      return s.topic_slug === state.sharesFilter;
    });

    // Sort: pending first, then by theme name, then by date
    filtered.sort(function (a, b) {
      // Pending first
      if (!a.is_approved && b.is_approved) return -1;
      if (a.is_approved && !b.is_approved) return 1;
      // Then by theme
      var themeA = THEME_NAMES[a.topic_slug] || a.topic_slug;
      var themeB = THEME_NAMES[b.topic_slug] || b.topic_slug;
      if (themeA !== themeB) return themeA.localeCompare(themeB);
      // Then newest first
      return (b.created_at || '').localeCompare(a.created_at || '');
    });

    var pendingCount = state.shares.filter(function (s) { return !s.is_approved; }).length;

    var html = '<div class="admin-editor">';
    html += '<div class="admin-editor-header">';
    html += '<button class="admin-btn admin-btn--ghost" id="btn-back-shares">&larr; Back to Dashboard</button>';
    html += '<h2>Member Shares</h2>';
    if (pendingCount > 0) {
      html += '<span class="admin-share-status admin-share-status--pending" style="font-size:13px;">' + pendingCount + ' pending</span>';
    }
    html += '<button class="admin-btn admin-btn--ghost" id="btn-refresh-shares">Refresh</button>';
    html += '</div>';

    // Theme filter dropdown
    html += '<div class="admin-controls" style="padding:8px 24px;">';
    html += '<select class="admin-select" id="shares-theme-filter">';
    html += '<option value="all"' + (state.sharesFilter === 'all' ? ' selected' : '') + '>All Themes (' + state.shares.length + ')</option>';
    for (var f = 0; f < themeSlugs.length; f++) {
      var fSlug = themeSlugs[f];
      var fName = THEME_NAMES[fSlug] || fSlug;
      var fCount = state.shares.filter(function (s) { return s.topic_slug === fSlug; }).length;
      html += '<option value="' + fSlug + '"' + (state.sharesFilter === fSlug ? ' selected' : '') + '>' + escHtml(fName) + ' (' + fCount + ')</option>';
    }
    html += '</select>';
    html += '</div>';

    if (state.loading) {
      html += '<p style="padding:24px;">Loading...</p>';
    } else if (filtered.length === 0) {
      html += '<p style="padding:24px;" class="admin-muted">No shares found.</p>';
    } else {
      html += '<div class="admin-list-items" style="padding:12px 24px;">';
      for (var i = 0; i < filtered.length; i++) {
        var s = filtered[i];
        var themeName = THEME_NAMES[s.topic_slug] || s.topic_slug;
        var preview = (s.content || '').substring(0, 120) + (s.content && s.content.length > 120 ? '...' : '');
        var statusClass = s.is_approved ? 'admin-share-status--approved' : 'admin-share-status--pending';
        var statusLabel = s.is_approved ? 'Approved' : 'Pending';
        var date = s.created_at ? new Date(s.created_at).toLocaleDateString() : '';

        html += '<div class="admin-share-card" data-share-id="' + s.id + '">';
        html += '<div class="admin-share-card-header">';
        html += '<span class="admin-share-card-name">' + escHtml(s.display_name) + '</span>';
        html += '<span class="admin-share-status ' + statusClass + '">' + statusLabel + '</span>';
        if (s.is_featured) html += '<span class="admin-share-status" style="background:#e8f5e9;color:#2e7d32;margin-left:4px;">Featured</span>';
        html += '</div>';
        html += '<div class="admin-share-card-theme">' + escHtml(themeName) + '</div>';
        html += '<div class="admin-share-card-preview">' + escHtml(preview) + '</div>';
        html += '<div class="admin-share-card-date">' + date + '</div>';
        html += '</div>';
      }
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  function bindSharesList() {
    var btnBack = document.getElementById('btn-back-shares');
    if (btnBack) btnBack.addEventListener('click', function () {
      state.view = 'dashboard';
      render();
    });

    var btnRefresh = document.getElementById('btn-refresh-shares');
    if (btnRefresh) btnRefresh.addEventListener('click', function () { loadShares(); });

    // Filter buttons
    var filterBtns = document.querySelectorAll('[data-shares-filter]');
    for (var i = 0; i < filterBtns.length; i++) {
      filterBtns[i].addEventListener('click', function () {
        state.sharesFilter = this.getAttribute('data-shares-filter');
        render();
      });
    }

    // Click to open
    var cards = document.querySelectorAll('.admin-share-card');
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener('click', function () {
        var id = this.getAttribute('data-share-id');
        var share = state.shares.find(function (s) { return s.id === id; });
        if (share) openShare(share);
      });
    }
  }

  function openShare(share) {
    state.selectedShare = share;
    state.shareEditFields = {
      display_name: share.display_name || '',
      content: share.content || '',
    };
    state.shareOriginalFields = JSON.parse(JSON.stringify(state.shareEditFields));
    state.view = 'share-detail';
    render();
  }

  // --- Share Detail View ---

  function renderShareDetail() {
    var s = state.selectedShare;
    if (!s) return '<p>No share selected</p>';

    var themeName = THEME_NAMES[s.topic_slug] || s.topic_slug;
    var hasChanges = JSON.stringify(state.shareEditFields) !== JSON.stringify(state.shareOriginalFields);
    var date = s.created_at ? new Date(s.created_at).toLocaleString() : 'Unknown';
    var statusLabel = s.is_approved ? 'Approved' : 'Pending';
    var statusClass = s.is_approved ? 'admin-share-status--approved' : 'admin-share-status--pending';

    var html = '<div class="admin-editor">';
    html += '<div class="admin-editor-header">';
    html += '<button class="admin-btn admin-btn--ghost" id="btn-back-share">&larr; Back to Shares</button>';
    html += '<h2>Share from ' + escHtml(s.display_name) + '</h2>';
    html += '</div>';

    html += '<div class="admin-step-editor-layout">';

    // Sidebar
    html += '<aside class="admin-editor-sidebar" style="min-width:200px;max-width:240px;">';
    html += '<h4>Details</h4>';
    html += '<p class="admin-muted" style="font-size:12px;">Theme: <strong>' + escHtml(themeName) + '</strong></p>';
    html += '<p class="admin-muted" style="font-size:12px;">Submitted: ' + date + '</p>';
    html += '<p class="admin-muted" style="font-size:12px;">Status: <span class="admin-share-status ' + statusClass + '">' + statusLabel + '</span></p>';
    html += '<div style="margin-top:16px;">';
    if (s.is_approved) {
      html += '<button class="admin-btn admin-btn--ghost" id="btn-toggle-approve" style="width:100%;margin-bottom:8px;">Revert to Pending</button>';
    } else {
      html += '<button class="admin-btn admin-btn--primary" id="btn-toggle-approve" style="width:100%;margin-bottom:8px;">Approve</button>';
    }
    html += '<label style="display:flex;align-items:center;gap:8px;margin:8px 0 12px;font-size:13px;cursor:' + (s.is_approved ? 'pointer' : 'not-allowed') + ';opacity:' + (s.is_approved ? '1' : '0.5') + ';">';
    html += '<input type="checkbox" id="chk-featured"' + (s.is_featured ? ' checked' : '') + (s.is_approved ? '' : ' disabled') + '> Featured on theme page</label>';
    html += '<button class="admin-btn admin-btn--ghost admin-btn--danger" id="btn-delete-share" style="width:100%;">Delete</button>';
    html += '</div>';
    html += '</aside>';

    // Main
    html += '<div class="admin-editor-main">';

    // Display name
    html += '<div class="admin-field-group">';
    html += '<label class="admin-field-label">Display Name</label>';
    html += '<input class="admin-input" type="text" data-share-field="display_name" value="' + escAttr(state.shareEditFields.display_name) + '">';
    html += '</div>';

    // Content
    var contentWc = wordCount(state.shareEditFields.content);
    html += '<div class="admin-field-group">';
    html += '<label class="admin-field-label">Content <span class="admin-wc ' +
      (contentWc >= 20 ? 'admin-wc--ok' : 'admin-wc--warn') + '">' + contentWc + ' words</span></label>';
    html += '<p class="admin-field-hint">Separate paragraphs with a blank line.</p>';
    html += '<textarea class="admin-input admin-textarea" data-share-field="content" rows="12">' + escHtml(state.shareEditFields.content) + '</textarea>';
    html += '</div>';

    // Save bar
    html += '<div class="admin-save-bar">';
    if (hasChanges) {
      html += '<span class="admin-unsaved">Unsaved changes</span>';
      html += '<button class="admin-btn admin-btn--ghost" id="btn-discard-share">Discard</button>';
    }
    html += '<button class="admin-btn admin-btn--primary" id="btn-save-share"' +
      (state.saving ? ' disabled' : '') + (!hasChanges ? ' disabled' : '') + '>' +
      (state.saving ? 'Saving...' : 'Save') +
    '</button>';
    html += '</div>';

    html += '</div>'; // editor-main
    html += '</div>'; // layout
    html += '</div>'; // editor

    return html;
  }

  function bindShareDetail() {
    var s = state.selectedShare;
    if (!s) return;

    // Back
    var btnBack = document.getElementById('btn-back-share');
    if (btnBack) btnBack.addEventListener('click', function () {
      if (hasShareChanges() && !confirm('Discard unsaved changes?')) return;
      state.view = 'shares-list';
      state.selectedShare = null;
      render();
    });

    // Simple fields
    var inputs = document.querySelectorAll('[data-share-field]');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('input', function () {
        var field = this.getAttribute('data-share-field');
        state.shareEditFields[field] = this.value;
        updateShareSaveBar();
      });
    }

    // Toggle Approve / Revert to Pending
    var btnToggleApprove = document.getElementById('btn-toggle-approve');
    if (btnToggleApprove) btnToggleApprove.addEventListener('click', function () {
      var newApproved = !s.is_approved;
      var updates = { is_approved: newApproved };
      if (!newApproved) updates.is_featured = false; // un-feature when reverting to pending
      saveShare(s.id, updates, function (err) {
        if (!err) {
          s.is_approved = newApproved;
          if (!newApproved) s.is_featured = false;
          render();
        }
      });
    });

    // Toggle Featured
    var chkFeatured = document.getElementById('chk-featured');
    if (chkFeatured) chkFeatured.addEventListener('change', function () {
      var newFeatured = this.checked;
      saveShare(s.id, { is_featured: newFeatured }, function (err) {
        if (!err) {
          s.is_featured = newFeatured;
          render();
        }
      });
    });

    // Delete
    var btnDelete = document.getElementById('btn-delete-share');
    if (btnDelete) btnDelete.addEventListener('click', function () {
      if (!confirm('Delete this share permanently?')) return;
      deleteShare(s.id, function (err) {
        if (!err) {
          state.view = 'shares-list';
          state.selectedShare = null;
          render();
        }
      });
    });

    // Save
    var btnSave = document.getElementById('btn-save-share');
    if (btnSave) btnSave.addEventListener('click', function () {
      if (!hasShareChanges()) return;
      saveShare(s.id, state.shareEditFields, function (err) {
        if (!err) {
          state.shareOriginalFields = JSON.parse(JSON.stringify(state.shareEditFields));
          render();
        }
      });
    });

    // Discard
    var btnDiscard = document.getElementById('btn-discard-share');
    if (btnDiscard) btnDiscard.addEventListener('click', function () {
      state.shareEditFields = JSON.parse(JSON.stringify(state.shareOriginalFields));
      render();
    });
  }

  function hasShareChanges() {
    return JSON.stringify(state.shareEditFields) !== JSON.stringify(state.shareOriginalFields);
  }

  function updateShareSaveBar() {
    var btnSave = document.getElementById('btn-save-share');
    if (btnSave) btnSave.disabled = !hasShareChanges() || state.saving;
  }

  // --- Reusable List Editor ---

  function renderListEditor(prefix, label, items) {
    var html = '<div class="admin-field-group admin-list-editor" data-list-prefix="' + prefix + '">';
    html += '<label class="admin-field-label">' + label + ' <span class="admin-field-hint">(' + items.length + ' items)</span></label>';
    html += '<div class="admin-list-items-editor">';
    for (var i = 0; i < items.length; i++) {
      html += '<div class="admin-list-item-row" data-list-idx="' + i + '">' +
        '<span class="admin-list-item-handle" title="Drag to reorder">&#9776;</span>' +
        '<input class="admin-input admin-list-item-input" type="text" value="' + escAttr(items[i]) + '" data-list-input="' + prefix + '" data-idx="' + i + '">' +
        '<button class="admin-btn admin-btn--sm admin-btn--ghost admin-list-item-up" data-list-up="' + prefix + '" data-idx="' + i + '" title="Move up">&uarr;</button>' +
        '<button class="admin-btn admin-btn--sm admin-btn--ghost admin-list-item-down" data-list-down="' + prefix + '" data-idx="' + i + '" title="Move down">&darr;</button>' +
        '<button class="admin-btn admin-btn--sm admin-btn--danger admin-list-item-remove" data-list-remove="' + prefix + '" data-idx="' + i + '" title="Remove">&times;</button>' +
      '</div>';
    }
    html += '</div>';
    html += '<button class="admin-btn admin-btn--sm" data-list-add="' + prefix + '">+ Add Item</button>';
    html += '</div>';
    return html;
  }

  function bindListEditor(prefix, items, onChange) {
    // Add item
    var addBtn = document.querySelector('[data-list-add="' + prefix + '"]');
    if (addBtn) addBtn.addEventListener('click', function () {
      items.push('');
      onChange(items);
    });

    // Remove items
    var removeBtns = document.querySelectorAll('[data-list-remove="' + prefix + '"]');
    for (var r = 0; r < removeBtns.length; r++) {
      removeBtns[r].addEventListener('click', function (e) {
        e.stopPropagation();
        var idx = parseInt(this.getAttribute('data-idx'), 10);
        items.splice(idx, 1);
        onChange(items);
      });
    }

    // Move up
    var upBtns = document.querySelectorAll('[data-list-up="' + prefix + '"]');
    for (var u = 0; u < upBtns.length; u++) {
      upBtns[u].addEventListener('click', function (e) {
        e.stopPropagation();
        var idx = parseInt(this.getAttribute('data-idx'), 10);
        if (idx > 0) {
          var tmp = items[idx - 1];
          items[idx - 1] = items[idx];
          items[idx] = tmp;
          onChange(items);
        }
      });
    }

    // Move down
    var downBtns = document.querySelectorAll('[data-list-down="' + prefix + '"]');
    for (var dd = 0; dd < downBtns.length; dd++) {
      downBtns[dd].addEventListener('click', function (e) {
        e.stopPropagation();
        var idx = parseInt(this.getAttribute('data-idx'), 10);
        if (idx < items.length - 1) {
          var tmp = items[idx + 1];
          items[idx + 1] = items[idx];
          items[idx] = tmp;
          onChange(items);
        }
      });
    }

    // Inline editing
    var textInputs = document.querySelectorAll('[data-list-input="' + prefix + '"]');
    for (var t = 0; t < textInputs.length; t++) {
      textInputs[t].addEventListener('input', function () {
        var idx = parseInt(this.getAttribute('data-idx'), 10);
        items[idx] = this.value;
        // Don't re-render on every keystroke, just update state
      });
      // On blur, trigger change detection for save bar
      textInputs[t].addEventListener('blur', function () {
        // Update save bar without full re-render
        if (state.view === 'step-detail') updateStepSaveBar();
        else if (state.view === 'theme-detail') updateThemeSaveBar();
      });
    }
  }

  // --- Utility Functions ---

  function totalWordCount(arr) {
    if (!arr || !arr.length) return 0;
    return arr.reduce(function (sum, text) { return sum + wordCount(text); }, 0);
  }

  function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&[a-zA-Z]+;/g, ' ');
  }

  // --- Rich Text Helpers ---
  // Convert HTML body to plain text for editing (paragraphs separated by blank lines)
  function htmlToPlainText(html) {
    if (!html) return '';
    // Replace </p> followed by whitespace and <p> with double newline
    var text = html
      .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?(p|div)[^>]*>/gi, '\n')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/&mdash;/g, '\u2014')
      .replace(/&ndash;/g, '\u2013')
      .replace(/&ldquo;/g, '\u201C')
      .replace(/&rdquo;/g, '\u201D')
      .replace(/&lsquo;/g, '\u2018')
      .replace(/&rsquo;/g, '\u2019')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/&hellip;/g, '\u2026')
      .replace(/<[^>]*>/g, ''); // strip any remaining tags
    // Clean up extra whitespace
    return text.replace(/\n{3,}/g, '\n\n').trim();
  }

  // Convert plain text back to HTML for saving
  function plainTextToHtml(text) {
    if (!text) return '';
    var paragraphs = text.split(/\n\s*\n/).filter(function (p) { return p.trim().length > 0; });
    return paragraphs.map(function (p) {
      var line = p.trim()
        .replace(/\n/g, ' ') // collapse single newlines within a paragraph
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      // Convert markdown-style formatting
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
      line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      // Smart quotes
      line = line.replace(/\u201C/g, '&ldquo;').replace(/\u201D/g, '&rdquo;');
      line = line.replace(/\u2018/g, '&lsquo;').replace(/\u2019/g, '&rsquo;');
      line = line.replace(/\u2014/g, '&mdash;').replace(/\u2013/g, '&ndash;');
      line = line.replace(/\u2026/g, '&hellip;');
      return '<p>' + line + '</p>';
    }).join('\n');
  }

  function getTodayDayOfYear() {
    var now = new Date();
    var month = now.getMonth(); // 0-indexed
    var day = now.getDate();
    var daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var doy = day;
    for (var m = 0; m < month; m++) doy += daysInMonth[m];
    return doy;
  }

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
