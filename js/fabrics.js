// Fabrics page logic. Loads data/fabrics.json (24 SKUs across 12 families)
// and drives all 7 filters (structure, composition, GSM, gauge, finish, end
// use, certification) plus search and the swatch-request basket persisted
// to localStorage under 'rt-sample-basket'.
(function () {
  'use strict';

  var STORAGE_KEY = 'rt-sample-basket';
  var SWATCH_DIR = 'assets/rydertex-assets/07-derived/swatch-';

  var FILTER_DEFS = [
    { key: 'structure', label: 'Structure', values: function (f) { return [f.structure]; } },
    { key: 'fibres', label: 'Composition', values: function (f) { return f.fibres; } },
    { key: 'gsmBucket', label: 'Weight (GSM)', values: function (f) { return [gsmBucket(f.gsm)]; } },
    { key: 'gauge', label: 'Gauge', values: function (f) { return [f.gauge]; } },
    { key: 'finish', label: 'Finish', values: function (f) { return [f.finish]; } },
    { key: 'endUse', label: 'End use', values: function (f) { return f.endUse; } },
    { key: 'certifications', label: 'Certification', values: function (f) { return f.certifications; } }
  ];
  var GSM_ORDER = ['Light (<200)', 'Mid (200–280)', 'Heavy (280+)'];

  function gsmBucket(gsm) {
    if (gsm < 200) return GSM_ORDER[0];
    if (gsm <= 280) return GSM_ORDER[1];
    return GSM_ORDER[2];
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var FABRICS = [];
  var state = { q: '', filters: {}, basket: [], basketOpen: false };
  FILTER_DEFS.forEach(function (d) { state.filters[d.key] = []; });

  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state.basket = JSON.parse(raw);
  } catch (e) { /* no stored basket */ }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.basket)); } catch (e) { /* storage unavailable */ }
  }

  var els = {
    shownCount: document.getElementById('shown-count'),
    clearFilters: document.getElementById('clear-filters'),
    toggleBasket: document.getElementById('toggle-basket'),
    basketCount: document.getElementById('basket-count'),
    basketPanel: document.getElementById('basket-panel'),
    closeBasket: document.getElementById('close-basket'),
    basketEmpty: document.getElementById('basket-empty'),
    basketItems: document.getElementById('basket-items'),
    searchInput: document.getElementById('search-input'),
    grid: document.getElementById('fabrics-grid'),
    filterGroups: document.getElementById('filter-groups'),
    filtersToggle: document.getElementById('filters-toggle'),
    filtersActiveCount: document.getElementById('filters-active-count'),
    filtersAside: document.getElementById('filters-aside'),
    filtersAsideClose: document.getElementById('filters-aside-close'),
    filtersScrim: document.getElementById('filters-scrim')
  };

  function setFiltersOpen(open) {
    els.filtersAside.classList.toggle('open', open);
    els.filtersScrim.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
  }
  els.filtersToggle.addEventListener('click', function () { setFiltersOpen(true); });
  els.filtersAsideClose.addEventListener('click', function () { setFiltersOpen(false); });
  els.filtersScrim.addEventListener('click', function () { setFiltersOpen(false); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') setFiltersOpen(false); });

  var NO_RESULTS_HTML = '<div class="no-results">No construction matches that combination. Clear the filters, or tell us the construction you need and we will quote it.</div>';

  function matchesFilters(f, ignoreKey) {
    return FILTER_DEFS.every(function (d) {
      if (d.key === ignoreKey) return true;
      var selected = state.filters[d.key];
      if (!selected.length) return true;
      var vals = d.values(f);
      return selected.some(function (v) { return vals.indexOf(v) !== -1; });
    });
  }

  function matchesSearch(f) {
    var needle = state.q.trim().toLowerCase();
    if (!needle) return true;
    return (f.name + ' ' + f.family + ' ' + f.structure + ' ' + f.composition).toLowerCase().indexOf(needle) !== -1;
  }

  function getShown() {
    return FABRICS.filter(function (f) { return matchesSearch(f) && matchesFilters(f, null); });
  }

  function optionCount(defKey, value) {
    return FABRICS.filter(function (f) {
      if (!matchesSearch(f) || !matchesFilters(f, defKey)) return false;
      return FILTER_DEFS.find(function (d) { return d.key === defKey; }).values(f).indexOf(value) !== -1;
    }).length;
  }

  function buildFilterGroups() {
    els.filterGroups.innerHTML = FILTER_DEFS.map(function (d) {
      var values = d.key === 'gsmBucket'
        ? GSM_ORDER
        : Array.from(new Set(FABRICS.reduce(function (acc, f) { return acc.concat(d.values(f)); }, []))).sort();
      var options = values.map(function (v) {
        var id = 'f-' + d.key + '-' + v.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
        return '<label class="structure-option" for="' + id + '">' +
          '<input type="checkbox" id="' + id + '" data-filter-key="' + d.key + '" data-filter-value="' + esc(v) + '">' +
          esc(v) + ' <span class="filter-count" data-count-key="' + d.key + '" data-count-value="' + esc(v) + '"></span>' +
          '</label>';
      }).join('');
      return '<div class="filter-group structure-filters"><div class="filter-group-title">' + esc(d.label) + '</div>' + options + '</div>';
    }).join('');

    els.filterGroups.querySelectorAll('input[data-filter-key]').forEach(function (input) {
      input.addEventListener('change', function (e) {
        var key = e.target.dataset.filterKey, v = e.target.dataset.filterValue;
        var list = state.filters[key];
        state.filters[key] = e.target.checked ? list.concat([v]) : list.filter(function (x) { return x !== v; });
        render();
      });
    });
  }

  function updateFilterCounts() {
    FILTER_DEFS.forEach(function (d) {
      els.filterGroups.querySelectorAll('[data-count-key="' + d.key + '"]').forEach(function (span) {
        var v = span.dataset.countValue;
        span.textContent = '(' + optionCount(d.key, v) + ')';
      });
    });
  }

  function specLine(f) {
    return f.composition + ' · ' + f.gsm + ' GSM · ' + f.gauge + ' · ' + f.width;
  }

  function cardHtml(f) {
    var inBasket = state.basket.indexOf(f.id) !== -1;
    var img = SWATCH_DIR + f.familyId + '.png';
    return (
      '<article class="fabric-card">' +
        '<a href="fabric-detail.html?fabric=' + esc(f.id) + '" class="fabric-card-link">' +
          '<img src="' + esc(img) + '" alt="' + esc(f.family) + ' swatch — ' + esc(f.name) + '" width="900" height="700" loading="lazy" class="fabric-card-img">' +
        '</a>' +
        '<div class="fabric-card-body">' +
          '<div class="fabric-card-head">' +
            '<span class="fabric-card-name">' + esc(f.name) + '</span>' +
          '</div>' +
          '<div class="fabric-card-structure">' + esc(f.structure) + '</div>' +
          '<div class="fabric-card-spec-line">' + esc(specLine(f)) + '</div>' +
          '<div class="provisional-chip">PROVISIONAL SPEC</div>' +
          '<div class="fabric-card-actions">' +
            '<button type="button" class="fabric-card-add' + (inBasket ? ' in-basket' : '') + '" data-add="' + esc(f.id) + '">' +
              (inBasket ? '✓ In sample request' : '+ Add to sample request') +
            '</button>' +
            '<a href="fabric-detail.html?fabric=' + esc(f.id) + '" class="fabric-card-spec">Full spec sheet →</a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function basketItemHtml(f) {
    var img = SWATCH_DIR + f.familyId + '.png';
    return (
      '<div class="basket-item">' +
        '<img src="' + esc(img) + '" alt="" width="900" height="700" loading="lazy">' +
        '<span class="basket-item-name">' + esc(f.name) + '</span>' +
        '<span class="basket-item-structure">' + esc(f.structure) + '</span>' +
        '<button type="button" class="basket-item-remove" data-remove="' + esc(f.id) + '">Remove</button>' +
      '</div>'
    );
  }

  function activeFilterCount() {
    return FILTER_DEFS.reduce(function (n, d) { return n + state.filters[d.key].length; }, 0) + (state.q.trim() ? 1 : 0);
  }

  function render() {
    var shown = getShown();

    els.shownCount.textContent = String(shown.length);
    els.grid.innerHTML = shown.length ? shown.map(cardHtml).join('') : NO_RESULTS_HTML;

    els.basketCount.textContent = String(state.basket.length);
    els.basketPanel.hidden = !state.basketOpen;
    els.filtersActiveCount.textContent = String(activeFilterCount());

    var basketItems = state.basket
      .map(function (id) { return FABRICS.find(function (f) { return f.id === id; }); })
      .filter(Boolean);
    els.basketEmpty.hidden = basketItems.length !== 0;
    els.basketItems.innerHTML = basketItems.map(basketItemHtml).join('');

    updateFilterCounts();
  }

  els.searchInput.addEventListener('input', function (e) { state.q = e.target.value; render(); });

  els.clearFilters.addEventListener('click', function () {
    els.filterGroups.querySelectorAll('input[type=checkbox]').forEach(function (i) { i.checked = false; });
    els.searchInput.value = '';
    state.q = '';
    FILTER_DEFS.forEach(function (d) { state.filters[d.key] = []; });
    render();
  });

  els.toggleBasket.addEventListener('click', function () { state.basketOpen = !state.basketOpen; render(); });
  els.closeBasket.addEventListener('click', function () { state.basketOpen = false; render(); });

  els.grid.addEventListener('click', function (e) {
    var addBtn = e.target.closest('[data-add]');
    if (!addBtn) return;
    var id = addBtn.dataset.add;
    var idx = state.basket.indexOf(id);
    if (idx === -1) state.basket = state.basket.concat([id]);
    else state.basket = state.basket.filter(function (x) { return x !== id; });
    persist();
    render();
  });

  els.basketItems.addEventListener('click', function (e) {
    var removeBtn = e.target.closest('[data-remove]');
    if (!removeBtn) return;
    var id = removeBtn.dataset.remove;
    state.basket = state.basket.filter(function (x) { return x !== id; });
    persist();
    render();
  });

  fetch('data/fabrics.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      FABRICS = data.fabrics;
      state.basket = state.basket.filter(function (id) { return FABRICS.some(function (f) { return f.id === id; }); });
      buildFilterGroups();
      render();
    })
    .catch(function (err) {
      els.grid.innerHTML = '<div class="no-results">Could not load the fabric catalogue. <a href="contact.html">Contact us</a> and we will send specs directly.</div>';
      console.error('fabrics.json failed to load', err);
    });
})();
