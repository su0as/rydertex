// Fabric spec-sheet page. Ported from project/RyderTex Fabric Detail.dc.html.
// The prototype always linked here from the same URL and let an in-page
// swatch picker switch the shown fabric (default: Heather Jersey). We keep
// that picker, but also read a `?fabric=<id>` query param so links from the
// Fabrics grid land on the right family — the prototype's own cards didn't
// carry that param, only the in-page picker did.
(function () {
  'use strict';

  var A = 'assets/rydertex-assets/';
  var NI = '[[NEEDS INPUT]]';

  var FABRICS = [
    ['01-stripe-yarn-dye', 'Yarn-Dye Stripe', 'Yarn-dye stripe', 'Stripes knitted from pre-dyed yarn rather than printed after the fact, so the colour goes right through the loop and survives wash after wash.', ['apparel-tee-taupe.png', 'apparel-knit-crop-jogger-set.png']],
    ['02-heather-jersey', 'Heather Jersey', 'Single knit', 'Melange jersey built from heather yarn spun in-house. The lightest family on the floor and the one that absorbs order spikes most easily.', ['apparel-tee-sand.png', 'apparel-bikeshort-tee-set-mint.jpeg']],
    ['03-brushed-solid-warm', 'Brushed Solid', 'Raised / brushed', 'Solid knit taken through raising and brushing for a warm, dry surface. Common route for mid-weight sweatshirting.', ['apparel-fleece-sweatshirt-grey.jpeg', 'apparel-hoodie-charcoal.png']],
    ['04-solid-cool', 'Tricot', 'Warp knit', 'Smooth warp-knit face with controlled stretch, dyed in Unit 2 alongside the nylon programme.', ['apparel-windbreaker-white.jpeg', 'apparel-mesh-panel-legging-black.jpeg']],
    ['05-interlock-solid', 'Interlock', 'Double knit', 'Dense double-knit construction with a clean face on both sides. Scales to 20,000 kg a day on the double knit lines.', ['apparel-legging-bra-set-blush.png', 'apparel-tee-taupe.png']],
    ['06-velour-multi', 'Velour', 'Velour', 'Cut-pile knit with a directional sheen. Finished for drape rather than loft.', ['apparel-knit-crop-jogger-set.png', 'apparel-hoodie-dusty-pink.png']],
    ['07-velour-pastel', 'Velour, Brushed', 'Velour', 'The velour base taken through an additional brushing pass for a softer, more matte hand.', ['apparel-hoodie-dusty-pink.png', 'apparel-fleece-jogger-beige.png']],
    ['08-textured-jacquard', 'Textured Jacquard', 'Jacquard', 'Patterning knitted in rather than applied, at 18 to 24 gauge. The route for body-mapped panels.', ['apparel-mesh-panel-legging-black.jpeg', 'apparel-bikeshort-tee-set-mint.jpeg']],
    ['09-corduroy-rib', 'Corduroy Rib', 'Rib', 'Wide-wale rib with a corduroy read, knitted at 18 gauge.', ['apparel-fleece-jogger-beige.png', 'apparel-bomber-olive.jpeg']],
    ['10-crinkle-seersucker', 'Crinkle Seersucker', 'Seersucker / crinkle', 'Crinkle texture set in finishing, giving a fabric that stands away from the skin.', ['apparel-tee-sand.png', 'apparel-convertible-hiking-pant-grey.jpeg']],
    ['11-embossed-jacquard', 'Embossed Jacquard', 'Jacquard', 'Embossed relief for custom branded structures — the family used when a logo needs to be in the fabric, not on it.', ['apparel-puffer-jacket-red.jpeg', 'apparel-bomber-olive.jpeg']],
    ['12-rib', 'Rib', 'Rib', 'Fine rib for elastic bottoms, cuffs and trims, at 18 gauge and 34 to 38 inch.', ['apparel-hoodie-charcoal.png', 'apparel-fleece-sweatshirt-grey.jpeg']]
  ];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function findFabric(id) {
    var idx = FABRICS.findIndex(function (f) { return f[0] === id; });
    return idx === -1 ? 1 : idx;
  }

  var params = new URLSearchParams(window.location.search);
  var currentIdx = findFabric(params.get('fabric') || '02-heather-jersey');

  var els = {
    crumb: document.getElementById('crumb-name'),
    img: document.getElementById('detail-img'),
    picker: document.getElementById('swatch-picker'),
    note: document.getElementById('detail-note'),
    structure: document.getElementById('detail-structure'),
    name: document.getElementById('detail-name'),
    body: document.getElementById('detail-body'),
    specs: document.getElementById('detail-specs'),
    enduse: document.getElementById('detail-enduse')
  };

  function render() {
    var raw = FABRICS[currentIdx];
    var id = raw[0], name = raw[1], structure = raw[2], body = raw[3], endUseFiles = raw[4];
    var img = A + '07-derived/swatch-' + id + '.png';
    var no = String(currentIdx + 1).padStart(2, '0') + ' / 12';

    document.title = name + ' — Fabric Spec Sheet — RyderTex';
    els.crumb.textContent = name;
    els.img.src = img;
    els.img.alt = 'Swatch fan of ' + name + ' knitted fabric produced by RyderTex.';
    els.note.textContent = 'Swatch images are real mill samples · ' + no;
    els.structure.textContent = structure;
    els.name.textContent = name;
    els.body.textContent = body;

    var specs = [
      ['Structure', structure, '#F4F2EE'],
      ['Composition', NI, '#2F53E0'],
      ['Weight', NI + ' GSM', '#2F53E0'],
      ['Gauge', NI + ' GG', '#2F53E0'],
      ['Width', NI, '#2F53E0'],
      ['Finish', NI, '#2F53E0'],
      ['Certification', 'Mill holds GRS and OEKO-TEX Standard 100 · per-fabric scope ' + NI, '#A8ADB4'],
      ['MOQ', NI, '#2F53E0'],
      ['Lead time', NI, '#2F53E0'],
      ['Dyed in', structure === 'Warp knit' ? 'Unit 2 · Huicai' : 'Unit 1 · Shuangchen', '#A8ADB4']
    ];
    els.specs.innerHTML = specs.map(function (s) {
      return '<div class="spec-row"><span class="k">' + esc(s[0]) + '</span><span class="v" style="color:' + s[2] + '">' + esc(s[1]) + '</span></div>';
    }).join('');

    els.picker.innerHTML = FABRICS.map(function (f, i) {
      var active = i === currentIdx;
      return '<button type="button" data-idx="' + i + '" class="' + (active ? 'active' : '') + '" title="' + esc(f[1]) + '" style="opacity:' + (active ? '1' : '.55') + '"><img src="' + A + '07-derived/swatch-' + f[0] + '.png" alt="' + esc(f[1]) + '" width="900" height="700" loading="lazy"></button>';
    }).join('');

    els.enduse.innerHTML = endUseFiles.map(function (p) {
      var caption = p.replace('apparel-', '').replace(/\.(png|jpeg)$/, '').replace(/-/g, ' ');
      return '<figure class="mosaic-item"><img src="' + A + '04-apparel/' + p + '" alt="Garment made from RyderTex knitted fabric." style="aspect-ratio:4/5" width="600" height="700" loading="lazy"><figcaption>' + esc(caption) + '</figcaption></figure>';
    }).join('');
  }

  els.picker.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-idx]');
    if (!btn) return;
    currentIdx = parseInt(btn.dataset.idx, 10);
    render();
  });

  render();
})();
