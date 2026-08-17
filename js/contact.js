// Contact page: reads the fabric-library basket (SKU ids) from localStorage,
// looks up names against data/fabrics.json, and shows them as context chips.
// Also stubs the sample-request form submit (no backend — see /draft-status.html).
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var basketIds = [];
  try {
    var raw = localStorage.getItem('rt-sample-basket');
    if (raw) basketIds = JSON.parse(raw);
  } catch (e) { /* no stored basket */ }

  if (basketIds.length) {
    fetch('data/fabrics.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var names = basketIds
          .map(function (id) {
            var f = data.fabrics.find(function (x) { return x.id === id; });
            return f ? f.name : null;
          })
          .filter(Boolean);
        if (!names.length) return;
        var panel = document.getElementById('basket-panel-lite');
        var chips = document.getElementById('basket-chips');
        chips.innerHTML = names.map(function (name) {
          return '<span style="font-family:\'JetBrains Mono\',ui-monospace,monospace;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#0D0E10;border:1px solid rgba(13,14,16,.2);padding:7px 10px;background:#F4F2EE">' + esc(name) + '</span>';
        }).join('');
        panel.hidden = false;
      })
      .catch(function (err) { console.error('fabrics.json failed to load', err); });
  }

  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('sent-notice').hidden = false;
  });
})();
