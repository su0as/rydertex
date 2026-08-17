// Home page: fabric-rail scroll progress + pointer drag.
// Ported from project/RyderTex Home.dc.html componentDidMount.
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var rail = document.querySelector('[data-rail]');
    var bar = document.querySelector('[data-rail-bar]');
    var cnt = document.querySelector('[data-rail-count]');
    if (!rail || !bar || !cnt) return;

    var upd = function () {
      var max = rail.scrollWidth - rail.clientWidth;
      var p = max > 0 ? rail.scrollLeft / max : 0;
      bar.style.width = (12 + p * 88).toFixed(1) + '%';
      var i = Math.min(12, Math.max(1, Math.round(1 + p * 11)));
      cnt.textContent = String(i).padStart(2, '0') + ' / 12';
    };
    rail.addEventListener('scroll', upd, { passive: true });
    upd();

    var down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft;
      rail.classList.add('dragging');
    });
    rail.addEventListener('pointermove', function (e) {
      if (!down) return;
      var d = e.clientX - sx; moved = Math.abs(d);
      rail.scrollLeft = sl - d;
    });
    var up = function () { down = false; rail.classList.remove('dragging'); };
    rail.addEventListener('pointerup', up);
    rail.addEventListener('pointerleave', up);
    rail.addEventListener('click', function (e) { if (moved > 6) e.preventDefault(); });

    var form = document.getElementById('sample-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        document.getElementById('sample-sent-notice').hidden = false;
      });
    }
  });
})();
