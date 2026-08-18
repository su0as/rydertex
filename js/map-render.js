// Computes every world-map node/arc position from real lat/long in
// data/markets.json — nothing is hand-placed. Equirectangular projection:
//   x = frame.x0 + (lon + 180) / 360 * frame.width
//   y = frame.y0 + (90 - lat)  / 180 * frame.height
// frame.height is a fixed degrees-to-pixels scale constant measured on the
// original uncropped map render; it stays fixed even though the PNG has
// since been cropped shorter (see data/markets.json $schema note) — do not
// swap in the image's own height here.
// Runs before js/map-hover.js so the hover-sync wiring finds nodes already
// in their final position.
(function () {
  'use strict';

  function project(lat, lon, frame) {
    return {
      x: frame.x0 + (lon + 180) / 360 * frame.width,
      y: frame.y0 + (90 - lat) / 180 * frame.height
    };
  }

  // Matches the hand-authored arcs' curvature: control point sits at the
  // straight-line midpoint, shifted toward the pole by ~12% of the
  // point-to-point distance, producing the same gentle flight-path bow.
  function arcPath(from, to) {
    var mx = (from.x + to.x) / 2;
    var my = (from.y + to.y) / 2;
    var dist = Math.hypot(to.x - from.x, to.y - from.y);
    var cy = my - dist * 0.12;
    return 'M' + from.x.toFixed(1) + ' ' + from.y.toFixed(1) +
      'Q' + mx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + to.x.toFixed(1) + ' ' + to.y.toFixed(1);
  }

  function renderInto(wrap, data) {
    var svg = wrap.querySelector('svg.overlay');
    var img = wrap.querySelector('img.base');
    if (!svg) return;

    svg.setAttribute('viewBox', '0 0 ' + data.image.width + ' ' + data.image.height);
    if (img) { img.setAttribute('width', data.image.width); img.setAttribute('height', data.image.height); }

    var frame = data.projection.frame;
    var origin = project(data.origin.lat, data.origin.lon, frame);

    svg.querySelectorAll('circle[data-origin]').forEach(function (el) {
      el.setAttribute('cx', origin.x.toFixed(1));
      el.setAttribute('cy', origin.y.toFixed(1));
    });

    data.markets.forEach(function (m) {
      if (m.sameAsOrigin) return;
      var pos = project(m.lat, m.lon, frame);

      var node = svg.querySelector('[data-node="' + m.key + '"]');
      if (node) {
        node.setAttribute('cx', pos.x.toFixed(1));
        node.setAttribute('cy', pos.y.toFixed(1));
        node.style.transformOrigin = pos.x.toFixed(1) + 'px ' + pos.y.toFixed(1) + 'px';
      }

      var arc = svg.querySelector('[data-arc="' + m.key + '"]');
      if (arc) arc.setAttribute('d', arcPath(origin, pos));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var wraps = document.querySelectorAll('.map-wrap');
    if (!wraps.length) return;
    var mount = document.getElementById('site-header');
    var base = (mount && mount.dataset.base) || '';

    fetch(base + 'data/markets.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        wraps.forEach(function (wrap) { renderInto(wrap, data); });
      })
      .catch(function (err) { console.error('markets.json failed to load', err); });
  });
})();
