// Scroll-triggered reveal + count-up, shared across pages.
// Replaces the prototype's `animation-timeline: view()` scroll-linked
// CSS animations with an IntersectionObserver equivalent.
(function () {
  'use strict';

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function initCountUp() {
    var els = document.querySelectorAll('[data-countup]');
    if (!els.length) return;
    var fmt = function (n, comma) { return comma ? n.toLocaleString('en-US') : String(n); };
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        var target = parseFloat(el.dataset.countup);
        var comma = el.dataset.comma === '1';
        if (reduceMotion) {
          el.textContent = fmt(target, comma);
          return;
        }
        var t0 = performance.now(), dur = 1500;
        var run = function () {
          var p = Math.min(1, (performance.now() - t0) / dur);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(Math.round(target * e), comma);
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initCountUp();
  });
})();
