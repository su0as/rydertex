// Contact page: reads the fabric-library basket from localStorage and
// shows it as context chips, and stubs the sample-request form submit
// (no backend — matches the prototype's explicit [[NEEDS INPUT: form endpoint]]).
(function () {
  'use strict';

  var NAMES = {
    '01-stripe-yarn-dye': 'Yarn-Dye Stripe', '02-heather-jersey': 'Heather Jersey',
    '03-brushed-solid-warm': 'Brushed Solid', '04-solid-cool': 'Tricot',
    '05-interlock-solid': 'Interlock', '06-velour-multi': 'Velour',
    '07-velour-pastel': 'Velour, Brushed', '08-textured-jacquard': 'Textured Jacquard',
    '09-corduroy-rib': 'Corduroy Rib', '10-crinkle-seersucker': 'Crinkle Seersucker',
    '11-embossed-jacquard': 'Embossed Jacquard', '12-rib': 'Rib'
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var basket = [];
  try {
    var raw = localStorage.getItem('rt-sample-basket');
    if (raw) basket = JSON.parse(raw).filter(function (id) { return NAMES[id]; });
  } catch (e) { /* no stored basket */ }

  if (basket.length) {
    var panel = document.getElementById('basket-panel-lite');
    var chips = document.getElementById('basket-chips');
    chips.innerHTML = basket.map(function (id) {
      return '<span style="font-family:\'JetBrains Mono\',ui-monospace,monospace;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#0D0E10;border:1px solid rgba(13,14,16,.2);padding:7px 10px;background:#F4F2EE">' + esc(NAMES[id]) + '</span>';
    }).join('');
    panel.hidden = false;
  }

  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('sent-notice').hidden = false;
  });
})();
