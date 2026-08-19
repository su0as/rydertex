// Fabric spec-sheet page. Reads data/fabrics.json (25 SKUs across 12
// families). ?fabric=<sku-id> deep-links to a specific construction; the
// family swatch picker switches family (landing on that family's first
// SKU), and the construction picker switches between a family's SKUs.
(function () {
  'use strict';

  var A = '../assets/rydertex-assets/';
  var SWATCH_DIR = A + '07-derived/swatch-';
  var ABS_SWATCH_DIR = 'https://su0as.github.io/rydertex/assets/rydertex-assets/07-derived/swatch-';
  var DEFAULT_ID = '02a-heather-jersey-cotton';

  // Constructions within a family share one swatch photo. Pan a different
  // region of it per sibling (see [data-pan] in styles.css) so switching
  // constructions shows a visibly different crop, not an identical photo.
  function panIndex(id) {
    var m = id.match(/^\d+([a-z])/);
    return m ? m[1].charCodeAt(0) - 97 : 0;
  }

  // Family-level narrative + real (non-branded) end-use photos, ported from
  // the original 12-family copy. Specs themselves now come from fabrics.json.
  var FAMILY_META = {
    '01-stripe-yarn-dye': { name: 'Yarn-Dye Stripe', body: 'Stripes knitted from pre-dyed yarn rather than printed after the fact, so the colour goes right through the loop and survives wash after wash.', endUseImages: ['apparel-tee-taupe.png', 'apparel-knit-crop-jogger-set.png'] },
    '02-heather-jersey': { name: 'Heather Jersey', body: 'Melange jersey built from sourced heather yarn. The lightest family on the floor and the one that absorbs order spikes most easily.', endUseImages: ['apparel-tee-sand.png', 'apparel-bikeshort-tee-set-mint.jpeg'] },
    '03-brushed-solid-warm': { name: 'Brushed Solid', body: 'Solid knit taken through raising and brushing for a warm, dry surface. Common route for mid-weight sweatshirting.', endUseImages: ['apparel-fleece-sweatshirt-grey.jpeg', 'apparel-hoodie-charcoal.png'] },
    '04-solid-cool': { name: 'Tricot', body: 'Smooth warp-knit face with controlled stretch, dyed in Unit 2 alongside the nylon programme.', endUseImages: ['apparel-windbreaker-white.jpeg', 'apparel-knit-crop-jogger-set.png'] },
    '05-interlock-solid': { name: 'Interlock', body: 'Dense double-knit construction with a clean face on both sides. Scales to 20,000 kg a day on the double knit lines.', endUseImages: ['apparel-bikeshort-tee-set-mint.jpeg', 'apparel-tee-taupe.png'] },
    '06-velour-multi': { name: 'Velour', body: 'Cut-pile knit with a directional sheen. Finished for drape rather than loft.', endUseImages: ['apparel-knit-crop-jogger-set.png', 'apparel-hoodie-dusty-pink.png'] },
    '07-velour-pastel': { name: 'Velour, Brushed', body: 'The velour base taken through an additional brushing pass for a softer, more matte hand.', endUseImages: ['apparel-hoodie-dusty-pink.png', 'apparel-bikeshort-tee-set-mint.jpeg'] },
    '08-textured-jacquard': { name: 'Textured Jacquard', body: 'Patterning knitted in rather than applied, at 18 to 24 gauge. The route for body-mapped panels.', endUseImages: ['apparel-hoodie-dusty-pink.png', 'apparel-bikeshort-tee-set-mint.jpeg'] },
    '09-corduroy-rib': { name: 'Corduroy Rib', body: 'Wide-wale rib with a corduroy read, knitted at 18 gauge.', endUseImages: ['apparel-knit-crop-jogger-set.png', 'apparel-bomber-olive.jpeg'] },
    '10-crinkle-seersucker': { name: 'Crinkle Seersucker', body: 'Crinkle texture set in finishing, giving a fabric that stands away from the skin.', endUseImages: ['apparel-tee-sand.png', 'apparel-convertible-hiking-pant-grey.jpeg'] },
    '11-embossed-jacquard': { name: 'Embossed Jacquard', body: 'Embossed relief for custom branded structures — the family used when a logo needs to be in the fabric, not on it.', endUseImages: ['apparel-puffer-jacket-red.jpeg', 'apparel-bomber-olive.jpeg'] },
    '12-rib': { name: 'Rib', body: 'Fine rib for elastic bottoms, cuffs and trims, at 18 gauge and 34 to 38 inch.', endUseImages: ['apparel-hoodie-charcoal.png', 'apparel-fleece-sweatshirt-grey.jpeg'] }
  };
  var FAMILY_ORDER = ['01-stripe-yarn-dye', '02-heather-jersey', '03-brushed-solid-warm', '04-solid-cool', '05-interlock-solid', '06-velour-multi', '07-velour-pastel', '08-textured-jacquard', '09-corduroy-rib', '10-crinkle-seersucker', '11-embossed-jacquard', '12-rib'];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var FABRICS = [];
  var currentId = null;

  var els = {
    crumb: document.getElementById('crumb-name'),
    img: document.getElementById('detail-img'),
    imgAvif: document.getElementById('detail-img-avif'),
    imgWebp: document.getElementById('detail-img-webp'),
    picker: document.getElementById('swatch-picker'),
    note: document.getElementById('detail-note'),
    structure: document.getElementById('detail-structure'),
    name: document.getElementById('detail-name'),
    body: document.getElementById('detail-body'),
    constructionPicker: document.getElementById('construction-picker'),
    specs: document.getElementById('detail-specs'),
    enduse: document.getElementById('detail-enduse')
  };

  function familyFabrics(familyId) {
    return FABRICS.filter(function (f) { return f.familyId === familyId; });
  }

  function render() {
    var f = FABRICS.find(function (x) { return x.id === currentId; }) || FABRICS[0];
    currentId = f.id;
    var meta = FAMILY_META[f.familyId] || { name: f.family, body: '', endUseImages: [] };
    var imgBase = SWATCH_DIR + f.familyId;
    var img = imgBase + '.png';
    var familyIdx = FAMILY_ORDER.indexOf(f.familyId);
    var no = String(familyIdx + 1).padStart(2, '0') + ' / 12';

    document.title = f.name + ' — Fabric Spec Sheet — RyderTex';
    els.crumb.textContent = f.name;
    els.img.src = img;
    els.img.alt = 'Swatch fan of ' + meta.name + ' knitted fabric produced by RyderTex.';
    els.img.setAttribute('data-pan', panIndex(f.id));
    if (els.imgAvif) els.imgAvif.srcset = imgBase + '.avif';
    if (els.imgWebp) els.imgWebp.srcset = imgBase + '.webp';
    els.note.textContent = 'Swatch images are real mill samples · family ' + no;
    els.structure.textContent = f.structure;
    els.name.textContent = f.name;
    els.body.textContent = meta.body;

    // Family picker — one thumbnail per family, deduped, switches to that
    // family's first construction.
    els.picker.innerHTML = FAMILY_ORDER.map(function (fid) {
      var rep = familyFabrics(fid)[0];
      var active = fid === f.familyId;
      return '<button type="button" data-pick-family="' + esc(fid) + '" class="' + (active ? 'active' : '') + '" title="' + esc(FAMILY_META[fid].name) + '" style="opacity:' + (active ? '1' : '.55') + '"><picture><source srcset="' + SWATCH_DIR + esc(fid) + '.avif" type="image/avif"><source srcset="' + SWATCH_DIR + esc(fid) + '.webp" type="image/webp"><img src="' + SWATCH_DIR + esc(fid) + '.png" alt="' + esc(FAMILY_META[fid].name) + '" width="900" height="700" loading="lazy"></picture></button>';
    }).join('');

    // Construction picker — the SKUs within this family.
    var siblings = familyFabrics(f.familyId);
    els.constructionPicker.innerHTML = siblings.length > 1
      ? siblings.map(function (s) {
          var short = s.composition.split('/')[0].replace(/^\d+%\s*/, '') + ' · ' + s.gsm + ' GSM';
          return '<button type="button" class="construction-pill' + (s.id === f.id ? ' active' : '') + '" data-pick-sku="' + esc(s.id) + '">' + esc(short) + '</button>';
        }).join('')
      : '';

    var specs = [
      ['Structure', f.structure, '#0D0E10'],
      ['Composition', f.composition, '#0D0E10'],
      ['Weight', f.gsm + ' GSM', '#0D0E10'],
      ['Gauge', f.gauge, '#0D0E10'],
      ['Width', f.width, '#0D0E10'],
      ['Finish', f.finish, '#0D0E10'],
      ['End use', f.endUse.join(' · '), '#4A4F57'],
      ['Certification', f.certifications.length ? f.certifications.join(', ') + ' (mill-wide)' : '—', '#4A4F57'],
      ['MOQ', f.moq, '#0D0E10'],
      ['Lead time', f.leadTime, '#0D0E10'],
      ['Dyed in', f.dyeHouse, '#4A4F57']
    ];
    els.specs.innerHTML = specs.map(function (s) {
      return '<div class="spec-row"><span class="k">' + esc(s[0]) + '</span><span class="v" style="color:' + s[2] + '">' + esc(s[1]) + '</span></div>';
    }).join('');

    els.enduse.innerHTML = meta.endUseImages.map(function (p) {
      var caption = p.replace('apparel-', '').replace(/\.(png|jpeg)$/, '').replace(/-/g, ' ');
      var pBase = p.replace(/\.(png|jpe?g)$/, '');
      return '<figure class="mosaic-item"><picture><source srcset="' + A + '04-apparel/' + pBase + '.avif" type="image/avif"><source srcset="' + A + '04-apparel/' + pBase + '.webp" type="image/webp"><img src="' + A + '04-apparel/' + p + '" alt="Garment made from RyderTex knitted fabric." style="aspect-ratio:4/5" width="600" height="700" loading="lazy"></picture><figcaption>' + esc(caption) + '</figcaption></figure>';
    }).join('');

    var jsonld = document.getElementById('product-jsonld');
    if (jsonld) {
      jsonld.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: f.name,
        description: meta.body,
        image: ABS_SWATCH_DIR + f.familyId + '.png',
        category: f.structure,
        material: f.composition,
        brand: { '@type': 'Brand', name: 'RyderTex' },
        manufacturer: { '@type': 'Organization', name: 'Changshu Ryder Textile Co., Ltd.' },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'GSM', value: f.gsm },
          { '@type': 'PropertyValue', name: 'Gauge', value: f.gauge },
          { '@type': 'PropertyValue', name: 'Width', value: f.width },
          { '@type': 'PropertyValue', name: 'Finish', value: f.finish }
        ],
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          url: 'https://su0as.github.io/rydertex/fabric-detail/?fabric=' + f.id,
          priceSpecification: { '@type': 'PriceSpecification', description: 'Quoted per order — contact for pricing' }
        }
      });
    }
  }

  els.picker.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-pick-family]');
    if (!btn) return;
    var fid = btn.dataset.pickFamily;
    currentId = familyFabrics(fid)[0].id;
    render();
  });

  els.constructionPicker.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-pick-sku]');
    if (!btn) return;
    currentId = btn.dataset.pickSku;
    render();
  });

  fetch('../data/fabrics.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      FABRICS = data.fabrics;
      var params = new URLSearchParams(window.location.search);
      var requested = params.get('fabric');
      currentId = (requested && FABRICS.some(function (f) { return f.id === requested; })) ? requested : DEFAULT_ID;
      render();
    })
    .catch(function (err) {
      console.error('fabrics.json failed to load', err);
    });
})();
