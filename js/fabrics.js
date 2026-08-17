// Fabrics page logic. Ported from project/RyderTex Fabrics.dc.html's
// Component class (search + structure filters + swatch-request basket,
// persisted to localStorage under 'rt-sample-basket').
(function () {
  'use strict';

  var FABRICS = [
    ['Yarn-Dye Stripe', 'Yarn-dye stripe', '01-stripe-yarn-dye', 'Fan of yarn-dyed striped knit swatches in multiple colourways.'],
    ['Heather Jersey', 'Single knit', '02-heather-jersey', 'Fan of heather-melange jersey swatches in grey, navy and pastel tones.'],
    ['Brushed Solid', 'Raised / brushed', '03-brushed-solid-warm', 'Fan of brushed solid knit swatches in warm browns, orange and red.'],
    ['Tricot', 'Warp knit', '04-solid-cool', 'Fan of smooth tricot swatches in black, blue and pale pink.'],
    ['Interlock', 'Double knit', '05-interlock-solid', 'Fan of dense interlock swatches in deep solid colours.'],
    ['Velour', 'Velour', '06-velour-multi', 'Fan of velour swatches with visible pile in magenta, charcoal and citron.'],
    ['Velour, Brushed', 'Velour', '07-velour-pastel', 'Fan of brushed velour swatches in dusty pink, teal and olive.'],
    ['Textured Jacquard', 'Jacquard', '08-textured-jacquard', 'Close view of textured jacquard swatches with a chevron relief.'],
    ['Corduroy Rib', 'Rib', '09-corduroy-rib', 'Fan of corduroy-rib swatches in cream, navy, pink and black.'],
    ['Crinkle Seersucker', 'Seersucker / crinkle', '10-crinkle-seersucker', 'Fan of crinkle seersucker swatches in burgundy, white and pink.'],
    ['Embossed Jacquard', 'Jacquard', '11-embossed-jacquard', 'Fan of embossed jacquard swatches with a repeating branded relief.'],
    ['Rib', 'Rib', '12-rib', 'Fan of fine rib swatches in purple, navy and pale grey.']
  ].map(function (f, i) {
    return {
      id: f[2], name: f[0], structure: f[1], alt: f[3],
      no: String(i + 1).padStart(2, '0') + ' / 12',
      img: 'assets/rydertex-assets/07-derived/swatch-' + f[2] + '.png'
    };
  });

  var STORAGE_KEY = 'rt-sample-basket';

  var state = {
    q: '',
    structures: [],
    basket: [],
    basketOpen: false
  };

  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      var stored = JSON.parse(raw).filter(function (id) {
        return FABRICS.some(function (f) { return f.id === id; });
      });
      state.basket = stored;
    }
  } catch (e) { /* no stored basket */ }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.basket)); } catch (e) { /* storage unavailable */ }
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
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
    structureInputs: Array.prototype.slice.call(document.querySelectorAll('input[data-structure]')),
    grid: document.getElementById('fabrics-grid'),
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
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setFiltersOpen(false);
  });

  var NO_RESULTS_HTML = '<div class="no-results">No family matches that combination. Clear the filters, or tell us the construction you need and we will quote it.</div>';

  function getShown() {
    var needle = state.q.trim().toLowerCase();
    return FABRICS.filter(function (f) {
      var matchesQuery = !needle || f.name.toLowerCase().indexOf(needle) !== -1 || f.structure.toLowerCase().indexOf(needle) !== -1;
      var matchesStructure = state.structures.length === 0 || state.structures.indexOf(f.structure) !== -1;
      return matchesQuery && matchesStructure;
    });
  }

  function cardHtml(f) {
    var inBasket = state.basket.indexOf(f.id) !== -1;
    return (
      '<article class="fabric-card">' +
        '<a href="fabric-detail.html?fabric=' + esc(f.id) + '" class="fabric-card-link">' +
          '<img src="' + esc(f.img) + '" alt="' + esc(f.alt) + '" width="900" height="700" loading="lazy" class="fabric-card-img">' +
        '</a>' +
        '<div class="fabric-card-body">' +
          '<div class="fabric-card-head">' +
            '<span class="fabric-card-name">' + esc(f.name) + '</span>' +
            '<span class="fabric-card-no">' + esc(f.no) + '</span>' +
          '</div>' +
          '<div class="fabric-card-structure">' + esc(f.structure) + '</div>' +
          '<div class="fabric-card-needs-input">[[NEEDS INPUT: GSM · GAUGE · COMPOSITION]]</div>' +
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
    return (
      '<div class="basket-item">' +
        '<img src="' + esc(f.img) + '" alt="" width="900" height="700" loading="lazy">' +
        '<span class="basket-item-name">' + esc(f.name) + '</span>' +
        '<span class="basket-item-structure">' + esc(f.structure) + '</span>' +
        '<button type="button" class="basket-item-remove" data-remove="' + esc(f.id) + '">Remove</button>' +
      '</div>'
    );
  }

  function render() {
    var shown = getShown();

    els.shownCount.textContent = String(shown.length);
    els.grid.innerHTML = shown.length
      ? shown.map(cardHtml).join('')
      : NO_RESULTS_HTML;

    els.basketCount.textContent = String(state.basket.length);
    els.basketPanel.hidden = !state.basketOpen;
    els.filtersActiveCount.textContent = String(state.structures.length + (state.q.trim() ? 1 : 0));

    var basketItems = state.basket
      .map(function (id) { return FABRICS.find(function (f) { return f.id === id; }); })
      .filter(Boolean);
    els.basketEmpty.hidden = basketItems.length !== 0;
    els.basketItems.innerHTML = basketItems.map(basketItemHtml).join('');
  }

  els.searchInput.addEventListener('input', function (e) {
    state.q = e.target.value;
    render();
  });

  els.structureInputs.forEach(function (input) {
    input.addEventListener('change', function (e) {
      var v = e.target.dataset.structure;
      if (e.target.checked) {
        state.structures = state.structures.concat([v]);
      } else {
        state.structures = state.structures.filter(function (x) { return x !== v; });
      }
      render();
    });
  });

  els.clearFilters.addEventListener('click', function () {
    els.structureInputs.forEach(function (i) { i.checked = false; });
    els.searchInput.value = '';
    state.q = '';
    state.structures = [];
    render();
  });

  els.toggleBasket.addEventListener('click', function () {
    state.basketOpen = !state.basketOpen;
    render();
  });

  els.closeBasket.addEventListener('click', function () {
    state.basketOpen = false;
    render();
  });

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

  render();
})();
