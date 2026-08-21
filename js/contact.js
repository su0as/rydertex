// Contact page: reads the fabric-library basket (SKU ids) from localStorage,
// looks up names against data/fabrics.json, and shows them as context chips.
// The form has no backend (static GitHub Pages site), so submit builds a
// mailto: link from the field values and hands off to the visitor's own
// mail client — they hit send from their own account, which is a genuine
// email into info@rydertextiles.com.
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var basketIds = [];
  var basketNames = [];
  try {
    var raw = localStorage.getItem('rt-sample-basket');
    if (raw) basketIds = JSON.parse(raw);
  } catch (e) { /* no stored basket */ }

  if (basketIds.length) {
    fetch('../data/fabrics.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var names = basketIds
          .map(function (id) {
            var f = data.fabrics.find(function (x) { return x.id === id; });
            return f ? f.name : null;
          })
          .filter(Boolean);
        if (!names.length) return;
        basketNames = names;
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
    var form = e.target;
    var d = new FormData(form);
    var lines = [
      'Company: ' + (d.get('company') || ''),
      'Email: ' + (d.get('email') || ''),
      'Fabric type: ' + (d.get('fabric') || ''),
      'Target GSM: ' + (d.get('gsm') || ''),
      'Quantity: ' + (d.get('qty') || ''),
      'Market: ' + (d.get('market') || ''),
      'Notes: ' + (d.get('notes') || '')
    ];
    if (basketNames.length) lines.push('Fabrics of interest: ' + basketNames.join(', '));
    var subject = 'Sample request — ' + (d.get('company') || d.get('name') || 'RyderTex');
    var body = 'From: ' + (d.get('name') || '') + '\n\n' + lines.join('\n');
    var mailto = 'mailto:info@rydertextiles.com'
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
    window.location.href = mailto;
    document.getElementById('sent-notice').hidden = false;
  });
})();
