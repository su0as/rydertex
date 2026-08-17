// Hover-sync between the world-map nodes and the market table rows.
// Shared by index.html (#global section) and global.html.
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.map-wrap').forEach(function (wrap) {
      var section = wrap.closest('section');
      if (!section) return;
      var nodes = wrap.querySelectorAll('[data-node]');
      var rows = section.querySelectorAll('.market-row[data-market]');

      function setHover(key, on) {
        wrap.querySelectorAll('[data-node="' + key + '"]').forEach(function (el) {
          el.classList.toggle('is-hover', on);
        });
        section.querySelectorAll('.market-row[data-market="' + key + '"]').forEach(function (el) {
          el.classList.toggle('is-hover', on);
        });
      }

      nodes.forEach(function (el) {
        var key = el.getAttribute('data-node');
        el.addEventListener('mouseenter', function () { setHover(key, true); });
        el.addEventListener('mouseleave', function () { setHover(key, false); });
      });
      rows.forEach(function (el) {
        var key = el.getAttribute('data-market');
        el.addEventListener('mouseenter', function () { setHover(key, true); });
        el.addEventListener('mouseleave', function () { setHover(key, false); });
      });
    });
  });
})();
