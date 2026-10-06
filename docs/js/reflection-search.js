(function () {
  'use strict';

  var form = document.querySelector('[data-reflection-search]');
  if (!form) return;
  var input = form.querySelector('input[name="q"]');
  var results = document.querySelector('[data-reflection-results]');
  var browse = document.querySelector('[data-reflection-browse]');
  var status = results.querySelector('[data-reflection-status]');
  var clear = results.querySelector('[data-reflection-clear]');
  var list = results.querySelector('[data-reflection-list]');
  var indexPromise;
  var timer;
  var requestNumber = 0;
  var scrollToInitialTheme = new URL(location.href).searchParams.has('theme');
  var normalize = function (value) {
    return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  };

  function loadIndex() {
    if (!indexPromise) indexPromise = fetch('/readings-search.json').then(function (response) {
      if (!response.ok) throw new Error('Search index unavailable');
      return response.json();
    }).catch(function (error) { indexPromise = null; throw error; });
    return indexPromise;
  }

  function excerpt(reading, terms) {
    var text = reading.text || '';
    var lower = normalize(text);
    var first = Math.min.apply(null, terms.map(function (term) {
      var position = lower.indexOf(term);
      return position < 0 ? Infinity : position;
    }));
    if (!Number.isFinite(first)) first = 0;
    var start = Math.max(0, first - 52);
    var end = Math.min(text.length, Math.max(first + 95, start + 155));
    if (start) start = text.indexOf(' ', start) + 1 || start;
    if (end < text.length) end = text.lastIndexOf(' ', end) || end;
    return (start ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
  }

  function show(readings, query, theme) {
    var terms = normalize(query).split(/\s+/).filter(Boolean);
    var found = readings.map(function (reading) {
      if (theme && normalize(reading.secondaryTheme) !== normalize(theme)) return null;
      var title = normalize(reading.title);
      var themes = normalize((reading.themes || []).join(' '));
      var text = normalize(reading.text);
      var all = title + ' ' + themes + ' ' + text;
      if (!terms.every(function (term) { return all.includes(term); })) return null;
      var score = terms.reduce(function (sum, term) {
        return sum + (title.includes(term) ? 12 : 0) + (themes.includes(term) ? 8 : 0) + (text.includes(term) ? 2 : 0);
      }, 0);
      if (title.includes(normalize(query))) score += 12;
      return { reading: reading, score: score };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score || a.reading.day - b.reading.day; });

    list.replaceChildren();
    var old = results.querySelector('.reflection-search-more');
    if (old) old.remove();
    status.textContent = (found.length === 1 ? '1 reflection' : found.length + ' reflections') +
      (theme ? ' tagged ' + theme : '') + (query ? ' matching “' + query + '”' : '') + ' found';
    found.slice(0, 24).forEach(function (match) {
      var reading = match.reading;
      var card = document.createElement('a');
      card.className = 'reflection-search-item';
      card.href = '/' + reading.slug + '/';
      var meta = document.createElement('span');
      meta.className = 'reflection-search-meta';
      meta.textContent = [reading.date, (reading.themes || []).join(' · ')].filter(Boolean).join('  ·  ');
      var title = document.createElement('span');
      title.className = 'reflection-search-title';
      title.textContent = reading.title;
      var snippet = document.createElement('span');
      snippet.className = 'reflection-search-excerpt';
      snippet.textContent = excerpt(reading, terms);
      card.append(meta, title, snippet);
      list.appendChild(card);
    });
    if (found.length > 24) {
      var more = document.createElement('p');
      more.className = 'reflection-search-more';
      more.textContent = 'Showing the first 24 results. Add a word in the search box to narrow them.';
      list.after(more);
    }
  }

  function search() {
    var query = input.value.trim();
    var current = ++requestNumber;
    var url = new URL(location.href);
    var theme = url.searchParams.get('theme') || '';
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    results.hidden = !query && !theme;
    browse.hidden = !!query || !!theme;
    clear.hidden = !theme;
    if (theme) { var clearUrl = new URL(url); clearUrl.searchParams.delete('theme'); clear.href = clearUrl.pathname + clearUrl.search; }
    if (!query && !theme) { list.replaceChildren(); return; }
    status.textContent = 'Searching reflections…';
    loadIndex().then(function (readings) {
      if (current !== requestNumber) return;
      show(readings, query, theme);
      if (scrollToInitialTheme) {
        scrollToInitialTheme = false;
        requestAnimationFrame(function () { results.scrollIntoView({ block: 'start' }); });
      }
    }).catch(function () {
      if (current === requestNumber) status.textContent = 'Search is unavailable right now. Browse the collections below.';
      browse.hidden = false;
    });
  }

  form.addEventListener('submit', function (event) { event.preventDefault(); clearTimeout(timer); search(); });
  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(search, 180); });
  var initialUrl = new URL(location.href);
  var initial = initialUrl.searchParams.get('q');
  if (initial) input.value = initial;
  if (initial || initialUrl.searchParams.get('theme')) search();
}());
