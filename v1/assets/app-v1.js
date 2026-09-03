/* CGIAR Climate Hub - V1 renderer
 * ============================================================================
 * One script, nine pages. Every string that describes a resource is read from
 * data.js at page load; nothing about a resource is typed into the HTML. Where
 * a sentence has to be written by a person and has not been, the HTML carries a
 * marked gap instead of filler, which is the convention Concept E established.
 *
 * PAGE ROUTING
 * There is no router. Each block renders only if its container exists on the
 * page, so adding a page means adding a container, not editing this file.
 *
 * PHOTOGRAPHS
 * Only the hero, the spotlight band and the storytelling page carry photographs.
 * They are Creative Commons images from the CGIAR Climate Flickr stream and are
 * illustrative: none of them is a photograph of the resource it sits beside, and
 * every one carries its credit on screen. Cards elsewhere show a type label in
 * place of an image rather than borrowing a photograph that does not belong to
 * the item.
 * ========================================================================== */
(function () {
  'use strict';

  var H = window.HUB;
  if (!H) return;

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function ext(url) { return /^https?:/.test(url || ''); }

  /* ======================== 1. Decision pins =============================== */
  var pinToggle = $('#pinToggle');
  if (pinToggle) {
    pinToggle.addEventListener('click', function () {
      var off = document.body.classList.toggle('pins-off');
      pinToggle.setAttribute('aria-pressed', off ? 'false' : 'true');
      pinToggle.textContent = off ? 'Show decision pins' : 'Hide decision pins';
    });
  }

  /* ======================== 2. Mega menu =================================== */
  var groups = $$('.gnav-group');
  function closeAll(except) {
    groups.forEach(function (g) {
      if (g === except) return;
      var b = $('.gnav-top', g), p = $('.gnav-panel', g);
      if (b) b.setAttribute('aria-expanded', 'false');
      if (p) p.classList.remove('open');
    });
  }
  groups.forEach(function (g) {
    var btn = $('.gnav-top', g), panel = $('.gnav-panel', g);
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      closeAll(g);
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.classList.toggle('open', !open);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.gnav-group')) closeAll(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAll(null); closeList(); }
  });

  /* ======================== 3. Photograph credits ========================== */
  /* Written from H.credits, so a caption can never drift from the licence
     record. Any element with data-credit="filename.jpg" is filled in here. */
  $$('[data-credit]').forEach(function (el) {
    var k = el.getAttribute('data-credit');
    if (H.credits && H.credits[k]) el.textContent = H.credits[k];
  });

  /* ======================== 4. Reading list ================================
   * The Gender Platform puts an "Add to favorites" control on every card. The
   * equivalent here is deliberately honest about its scope: it is this browser
   * only, it is stated as such on the panel, and nothing is sent anywhere. In
   * Drupal this is the Flag module against a real user account, which is what
   * the build spec asks for. If storage is unavailable the buttons still work
   * for the session and simply do not persist.
   * ====================================================================== */
  var LKEY = 'climatehub.readinglist.v1';
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem(LKEY) || '[]') || []; } catch (e) { saved = []; }
  function persist() { try { localStorage.setItem(LKEY, JSON.stringify(saved)); } catch (e) {} }
  function isSaved(id) { return saved.indexOf(id) > -1; }
  function countLabel() {
    var b = $('#listBtn');
    if (b) b.textContent = saved.length ? 'Reading list (' + saved.length + ')' : 'Reading list';
  }
  function toggleSave(id) {
    var i = saved.indexOf(id);
    if (i > -1) saved.splice(i, 1); else saved.push(id);
    persist(); countLabel();
    $$('.fav[data-id="' + id + '"]').forEach(function (b) {
      b.setAttribute('aria-pressed', isSaved(id) ? 'true' : 'false');
    });
    if (window.HubTrack) window.HubTrack.event('Reading list', { action: isSaved(id) ? 'added' : 'removed' });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.fav') : null;
    if (b) { e.preventDefault(); toggleSave(b.getAttribute('data-id')); }
  });
  function closeList() { var p = $('#listPanel'); if (p) p.remove(); }
  var listBtn = $('#listBtn');
  if (listBtn) {
    countLabel();
    listBtn.addEventListener('click', function () {
      if ($('#listPanel')) { closeList(); return; }
      var items = saved.map(function (id) { return H.byId[id]; }).filter(Boolean);
      var d = document.createElement('div');
      d.className = 'listpanel';
      d.id = 'listPanel';
      d.setAttribute('role', 'dialog');
      d.setAttribute('aria-label', 'Your reading list');
      d.innerHTML =
        '<button class="closebtn" type="button" aria-label="Close">&times;</button>' +
        '<h2>Your reading list</h2>' +
        '<p class="src" style="margin-bottom:16px">Held in this browser only. Nothing is sent anywhere and it will not follow you to another device. ' +
        'In the Drupal build this becomes a saved list on your CGIAR account.</p>' +
        (items.length
          ? '<div class="mini">' + items.map(miniRow).join('') + '</div>'
          : '<p>Nothing saved yet. Use the + on any card to add it.</p>');
      document.body.appendChild(d);
      $('.closebtn', d).addEventListener('click', closeList);
    });
  }

  /* ======================== 5. Shared renderers ============================ */
  function typeLabel(i) { return H.TYPE_LABEL[i.type] || i.type || ''; }

  function badge(i) {
    var c = H.completeness(i);
    if (!c) return '';
    var full = c.have === c.of;
    return '<span class="vbadge ' + (full ? 'full' : 'part') + '" title="' +
      (full ? 'All six metadata fields recorded' : 'Missing: ' + esc(c.missing.join(', '))) + '">' +
      (full ? '&#10003; ' : '') + c.have + '/' + c.of + ' metadata</span>';
  }

  /* A card. img is a filename in assets/img, or null for the label treatment. */
  function card(i, img) {
    var href = i.url ? esc(i.url) : 'resources.html?q=' + encodeURIComponent(i.title);
    var target = ext(i.url) ? ' target="_blank" rel="noopener"' : '';
    var media = img
      ? '<span class="gcard-img"><img src="assets/img/' + esc(img) + '" alt=""></span>'
      : '<span class="gcard-noimg">' + esc(typeLabel(i)) + '</span>';
    return '<article class="gcard">' +
      '<button class="fav" type="button" data-id="' + esc(i.id) + '" aria-pressed="' + (isSaved(i.id) ? 'true' : 'false') +
        '" aria-label="Add to your reading list">+</button>' +
      media +
      '<div class="gcard-body">' +
        '<div class="gcard-kicker">' + esc(i.kind || typeLabel(i)) + '</div>' +
        '<h4 class="gcard-title"><a href="' + href + '"' + target + '>' + esc(i.title) + (ext(i.url) ? ' &#8599;' : '') + '</a></h4>' +
        (i.author && i.year
          ? '<div class="gcard-cite">' + esc(i.author) + '. ' + esc(i.year) + '. ' + esc(i.provider || '') + '</div>'
          : '<div class="gcard-cite">' + esc(i.provider || '') + (i.year ? ' &middot; ' + esc(i.year) : '') + '</div>') +
        '<div class="gcard-foot">' + (badge(i) || esc(H.LENS_LABEL[i.lens] || '')) +
          (img ? '<span class="src" data-credit="' + esc(img) + '"></span>' : '') +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function miniRow(i) {
    var href = i.url ? esc(i.url) : 'resources.html?q=' + encodeURIComponent(i.title);
    var target = ext(i.url) ? ' target="_blank" rel="noopener"' : '';
    return '<a class="mini-row" href="' + href + '"' + target + '>' +
      '<div class="mini-title">' + esc(i.title) + (ext(i.url) ? ' &#8599;' : '') + '</div>' +
      '<div class="mini-meta">' + esc(typeLabel(i)) + ' &middot; ' + esc(i.provider || 'provider not recorded') +
      (i.year ? ' &middot; ' + esc(i.year) : '') + '</div></a>';
  }

  function rowItem(i) {
    var href = i.url ? esc(i.url) : '#';
    var target = ext(i.url) ? ' target="_blank" rel="noopener"' : '';
    var a = H.areaById(i.aow);
    return '<div class="rowitem">' +
      '<div class="rowitem-main">' +
        '<h3>' + (i.url ? '<a href="' + href + '"' + target + '>' + esc(i.title) + ' &#8599;</a>' : esc(i.title)) + '</h3>' +
        '<div class="meta">' + esc(typeLabel(i)) + ' &middot; ' + esc(i.kind || '') +
          ' &middot; ' + esc(i.provider || 'provider not recorded') +
          (a ? ' &middot; ' + esc(a.short) : '') + '</div>' +
        '<div class="blurb">' + esc(i.blurb || '') + '</div>' +
        (i.tags && i.tags.length
          ? '<div class="taglist">' + i.tags.slice(0, 5).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>'
          : '') +
      '</div>' +
      '<div class="rowitem-side">' + badge(i) +
        '<div class="src" style="margin-top:6px">' + esc(H.LENS_LABEL[i.lens] || '') + '</div>' +
      '</div>' +
    '</div>';
  }

  /* ======================== 6. Home page =================================== */
  var heroQ = $('#q');
  if (heroQ) heroQ.placeholder = 'Search ' + H.all.length + ' items: drought, GCF, emission factors';

  var selection = $('#selection');
  if (selection) {
    var pics = ['spotlight.jpg', 'banner-harvest.jpg', 'theme-models.jpg'];
    selection.innerHTML = H.publications.slice(0, 3).map(function (i, n) {
      return card(i, pics[n]);
    }).join('');
    $$('[data-credit]', selection).forEach(function (el) {
      var k = el.getAttribute('data-credit');
      if (H.credits && H.credits[k]) el.textContent = 'Photograph: ' + H.credits[k];
    });
  }

  var areasHost = $('#areas');
  if (areasHost) {
    areasHost.innerHTML = H.AREAS.map(function (a) {
      var n = H.all.filter(function (i) { return i.aow === a.id; }).length;
      return '<a class="garea" href="areas.html#' + esc(a.id) + '">' +
        '<div class="garea-name">' + esc(a.name) + '</div>' +
        '<div class="garea-desc">' + esc(a.desc) + '</div>' +
        '<div class="garea-n">' + n + ' catalogued item' + (n === 1 ? '' : 's') + '</div></a>';
    }).join('');
  }

  var startFour = $('#startFour');
  if (startFour) {
    var wanted = ['CHIRPS', 'ERA5', 'AgERA5', 'GLW'];
    var pick = H.datasets.filter(function (d) {
      return wanted.some(function (w) { return d.title.indexOf(w) > -1; });
    }).slice(0, 4);
    startFour.innerHTML = pick.map(function (i) { return card(i, null); }).join('');
  }

  /* The four "By category" regions, in the order the Gender Platform uses. */
  [
    { id: '#catNews',  items: H.news.slice(0, 3) },
    { id: '#catData',  items: H.datasets.slice(0, 3) },
    { id: '#catTools', items: H.methods.slice(0, 3) },
    { id: '#catPubs',  items: H.publications.slice(0, 3) }
  ].forEach(function (r) {
    var host = $(r.id);
    if (host) host.innerHTML = r.items.map(function (i) { return card(i, null); }).join('');
  });

  /* ======================== 7. Find evidence =============================== */
  var rows = $('#rows');
  if (rows) {
    var fQ = $('#fq'), fType = $('#ftype'), fArea = $('#farea'), fLens = $('#flens');
    var count = $('#count'), reset = $('#freset');

    Object.keys(H.TYPE_PLURAL).forEach(function (t) {
      fType.insertAdjacentHTML('beforeend', '<option value="' + esc(t) + '">' + esc(H.TYPE_PLURAL[t]) + '</option>');
    });
    H.AREAS.forEach(function (a) {
      fArea.insertAdjacentHTML('beforeend', '<option value="' + esc(a.id) + '">' + esc(a.short) + '</option>');
    });

    var params = new URLSearchParams(location.search);
    if (params.get('q')) fQ.value = params.get('q');
    if (params.get('type')) fType.value = params.get('type');
    if (params.get('aow')) fArea.value = params.get('aow');

    function draw() {
      var q = (fQ.value || '').trim();
      var base = q ? H.search(q) : H.all;
      var out = base.filter(function (i) {
        return (!fType.value || i.type === fType.value) &&
               (!fArea.value || i.aow === fArea.value) &&
               (!fLens.value || i.lens === fLens.value);
      });
      count.textContent = out.length + ' of ' + H.all.length + ' catalogued items';
      rows.innerHTML = out.length
        ? out.map(rowItem).join('')
        : '<div class="rowitem"><div class="rowitem-main"><h3>Nothing matches</h3>' +
          '<div class="blurb">All search terms have to appear in an item for it to be returned. ' +
          'Try one word rather than a phrase. An empty result here is a finding about the catalogue, not a bug.</div></div></div>';
    }

    var tmr = null;
    fQ.addEventListener('input', function () {
      clearTimeout(tmr);
      tmr = setTimeout(function () {
        draw();
        if (window.HubTrack && fQ.value.trim().length > 2) window.HubTrack.search(fQ.value.trim());
      }, 260);
    });
    [[fType, 'resource type'], [fArea, 'area of work'], [fLens, 'climate action']].forEach(function (pair) {
      pair[0].addEventListener('change', function () {
        draw();
        if (window.HubTrack && pair[0].value) {
          var a = pair[1] === 'area of work' ? H.areaById(pair[0].value) : null;
          window.HubTrack.filter(pair[1], a ? a.short : pair[0].value);
        }
      });
    });
    if (reset) reset.addEventListener('click', function () {
      fQ.value = ''; fType.value = ''; fArea.value = ''; fLens.value = ''; draw();
    });
    draw();
  }

  /* ======================== 8. Areas of work page ========================== */
  var areaSections = $('#areaSections');
  if (areaSections) {
    areaSections.innerHTML = H.AREAS.map(function (a) {
      var items = H.all.filter(function (i) { return i.aow === a.id; });
      return '<section class="gcat" id="' + esc(a.id) + '">' +
        '<div class="gcat-head"><div>' +
          '<h3>' + esc(a.name) + '</h3><p>' + esc(a.desc) + '</p>' +
        '</div><a class="viewmore" href="resources.html?aow=' + esc(a.id) + '">All ' + items.length + ' &rarr;</a></div>' +
        '<div class="gcards">' + items.slice(0, 3).map(function (i) { return card(i, null); }).join('') + '</div>' +
      '</section>';
    }).join('');
  }

  /* ======================== 9. Learn and apply ============================= */
  var tools = $('#tools');
  if (tools) tools.innerHTML = H.methods.map(function (i) { return card(i, null); }).join('');
  var innov = $('#innov');
  if (innov) innov.innerHTML = H.innovations.map(function (i) { return card(i, null); }).join('');
  var experts = $('#experts');
  if (experts) {
    experts.innerHTML = H.experts.map(function (e) {
      return '<article class="gcard"><span class="gcard-noimg">Use-case champion</span>' +
        '<div class="gcard-body">' +
        '<h4 class="gcard-title">' + esc(e.title) + '</h4>' +
        '<div class="gcard-cite">' + esc(e.provider || '') + '</div>' +
        '<div class="gcard-foot">' + esc(e.blurb || '') + '</div>' +
        '</div></article>';
    }).join('');
  }

  /* ======================== 10. Updates =================================== */
  var funding = $('#funding');
  if (funding) {
    var f = H.news.filter(function (n) { return (n.kind || '').toLowerCase().indexOf('fund') > -1; });
    funding.innerHTML = f.length ? f.map(function (i) { return card(i, null); }).join('')
      : '<p>No funding calls are recorded in the catalogue.</p>';
  }
  var events = $('#events');
  if (events) {
    var ev = H.news.filter(function (n) { return (n.kind || '').toLowerCase().indexOf('fund') === -1; });
    events.innerHTML = ev.length ? ev.map(function (i) { return card(i, null); }).join('')
      : '<p>No events are recorded in the catalogue.</p>';
  }
  var projects = $('#projects');
  if (projects) projects.innerHTML = H.projects.map(function (i) { return card(i, null); }).join('');

  /* ======================== 11. Curation measurements ======================
   * The Gender Platform publishes a "How we curate" page. Ours carries the same
   * promise, and then the measurement that tests it, computed live so it cannot
   * be quietly out of date. */
  var mHost = $('#measures');
  if (mHost) {
    var ds = H.datasets;
    var scores = ds.map(function (d) { return H.completeness(d); });
    var full = scores.filter(function (c) { return c.have === c.of; }).length;
    var mean = scores.reduce(function (s, c) { return s + c.have; }, 0) / (scores.length || 1);
    var missCount = {};
    H.META_FIELDS.forEach(function (f) { missCount[f] = 0; });
    scores.forEach(function (c) { c.missing.forEach(function (f) { missCount[f]++; }); });
    var worst = Object.keys(missCount).sort(function (a, b) { return missCount[b] - missCount[a]; });
    var drought = H.search('drought');
    var droughtProjects = drought.filter(function (i) { return i.type === 'project'; }).length;
    var noData = H.AREAS.filter(function (a) {
      return !ds.some(function (d) { return d.aow === a.id; });
    });
    var noLink = H.all.filter(function (i) { return !i.url; });
    mHost.innerHTML =
      '<div class="tablescroll"><table class="cuts"><tbody>' +
      '<tr><td>Catalogued items</td><td>' + H.all.length + '</td></tr>' +
      '<tr><td>Datasets</td><td>' + ds.length + '</td></tr>' +
      '<tr><td>Datasets with all six metadata fields recorded</td><td>' + full + ' of ' + ds.length + '</td></tr>' +
      '<tr><td>Mean metadata fields recorded, of six</td><td>' + mean.toFixed(1) + '</td></tr>' +
      '<tr><td>Field missing most often</td><td>' + esc(worst[0]) + ', absent from ' + missCount[worst[0]] + ' of ' + ds.length + ' datasets</td></tr>' +
      '<tr><td>Results for the query <em>drought</em></td><td>' + drought.length + ' items, of which ' + droughtProjects + ' are projects</td></tr>' +
      '<tr><td>Areas of work holding no dataset at all</td><td>' +
        (noData.length ? esc(noData.map(function (a) { return a.name; }).join('; ')) : 'none') + '</td></tr>' +
      '<tr><td>Items with no link a reader can open</td><td>' + noLink.length + ' of ' + H.all.length + '</td></tr>' +
      '</tbody></table></div>';
  }

  /* ======================== 12. Curated journey, V2 pattern ================
   * Adapted from the "Curated Journey" role selector on
   * lexiconoffood.com/regen-ag, read 03/09/2026. Each route is assembled from
   * the catalogue by filtering on fields that already exist, so no route
   * claims a resource the catalogue does not hold. Where a route is thin, it
   * says so: that is the point of showing it before V2 is built.
   * ====================================================================== */
  var jout = $('#jout');
  if (jout) {
    var ROUTES = [
      { key: 'scientist', label: 'CGIAR scientist',
        note: 'Named most often in Mural round 2, per the design strategy note of 09/08/2026.',
        pick: function () { return H.datasets.concat(H.methods); } },
      { key: 'investment', label: 'Investment audience',
        note: 'Recorded separately in round 2, with a need for fast extraction from innovation catalogues.',
        pick: function () { return H.innovations.concat(H.all.filter(function (i) { return i.aow === 'aow5'; })); } },
      { key: 'ministry', label: 'National partner',
        note: 'Implied by the programme geography but never named as a user. The catalogue cannot yet serve it.',
        pick: function () { return H.all.filter(function (i) { return /Nigeria|Kenya|Ghana|Ethiopia/.test(i.geo || ''); }); } },
      { key: 'researcher', label: 'External researcher',
        note: 'Not named in any round. Included so that it can be ruled out explicitly.',
        pick: function () { return H.publications.concat(H.datasets.filter(function (d) { return d.licence && /open|CC/i.test(d.licence); })); } }
    ];
    var jhost = $('#journey');
    ROUTES.forEach(function (r, n) {
      jhost.insertAdjacentHTML('beforeend',
        '<button class="jbtn" type="button" data-route="' + r.key + '" aria-pressed="' + (n === 0 ? 'true' : 'false') + '">' +
        esc(r.label) + '</button>');
    });
    function drawRoute(key) {
      var r = ROUTES.filter(function (x) { return x.key === key; })[0];
      var items = r.pick();
      var seen = {}, uniq = [];
      items.forEach(function (i) { if (!seen[i.id]) { seen[i.id] = 1; uniq.push(i); } });
      jout.innerHTML =
        '<h4>' + esc(r.label) + ': ' + uniq.length + ' item' + (uniq.length === 1 ? '' : 's') + ' in the catalogue</h4>' +
        (uniq.length
          ? '<div class="mini">' + uniq.slice(0, 6).map(miniRow).join('') + '</div>'
          : '<div class="gapblock"><strong>Empty route.</strong> The catalogue holds nothing that matches this reader. ' +
            'Shown rather than hidden, because an empty route is the strongest argument for fixing ingestion before V2.</div>') +
        '<span class="src">' + esc(r.note) + ' Assembled by filtering existing fields, not by editorial selection. ' +
        'Which route becomes the front door is decision D1, and it is not taken.</span>';
      $$('.jbtn', jhost).forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-route') === key ? 'true' : 'false');
      });
      if (window.HubTrack) window.HubTrack.filter('curated journey', r.label);
    }
    jhost.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.jbtn') : null;
      if (b) drawRoute(b.getAttribute('data-route'));
    });
    drawRoute('scientist');
  }

  /* ======================== 13. Live counts in prose ======================= */
  $$('.corpus-n').forEach(function (el) { el.textContent = H.all.length; });
  $$('.dataset-n').forEach(function (el) { el.textContent = H.datasets.length; });
  $$('.area-n').forEach(function (el) { el.textContent = H.AREAS.length; });
})();
