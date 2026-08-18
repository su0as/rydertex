// Lenis smooth scroll. Skipped entirely for prefers-reduced-motion, so
// those users get native (instant) scroll behaviour, not a disabled-but-
// still-loaded library.
(function () {
  'use strict';
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof window.Lenis !== 'function') return;

  new window.Lenis({
    autoRaf: true,
    duration: 1.1,
    smoothWheel: true
  });
})();
