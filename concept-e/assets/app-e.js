/* CGIAR Climate Hub - Concept E, the lean V1
 * ============================================================================
 * One script for all four pages. Every count, label and placeholder is derived
 * from window.HUB at page load, so nothing on screen can drift from the
 * catalogue and no figure is typed into the markup.
 *
 * Deliberately smaller than Concept C's app.js. C renders ten home-page blocks
 * across five pages. E renders four home-page blocks across four pages, and the
 * difference is the point of the concept, not an accident of effort.
 * ========================================================================== */
(function () {
  'use strict';
  var H = window.HUB;
  if (!H) return;

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- Decision pins on and off ------------------------------------ */
  (function pins() {
    var btn = $('#pinToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var off = document.body.classList.toggle('pins-off');
      btn.textContent = off ? 'Show decision pins' : 'Hide decision pins';
      btn.setAttribute('aria-pressed', off ? 'false' : 'true');
    });
  })();

  /* ---------- Photograph credits, written from data ----------------------- */
  (function credits() {
    if (!H.credits) return;
    [['#cap-hero', 'banner-harvest.jpg'], ['#cap-spotlight', 'spotlight.jpg']]
      .forEach(function (pair) {
        var el = $(pair[0]);
        if (el && H.credits[pair[1]]) el.textContent = H.credits[pair[1]];
      });
  })();

  /* ---------- Search placeholder, built from the catalogue ---------------- */
  (function placeholder() {
    var input = $('#q');
    if (!input) return;
    input.placeholder = 'Search ' + H.all.length + ' items: drought, GCF, emission factors';
  })();

  /* ---------- Home block 2: the five published areas of work -------------- */
  (function spine() {
    var host = $('#spine');
    if (!host) return;
    host.innerHTML = H.AREAS.map(function (a) {
      var n = H.all.filter(function (i) { return i.aow === a.id; }).length;
      return '<a class="spine-item" href="resources.html?aow=' + esc(a.id) + '">' +
        '<div class="spine-name">' + esc(a.name) + '</div>' +
        '<div class="spine-desc">' + esc(a.desc) + '</div>' +
        '<div class="spine-n">' + n + ' catalogued item' + (n === 1 ? '' : 's') + '</div>' +
      '</a>';
    }).join('');
  })();

  /* ---------- Home block 3: the four start-here records -------------------
     The same four Concept C carried. Kept identical on purpose: E changes what
     surrounds them, not which they are, so decision D3 is about the rule and
     not about taste. */
  (function starts() {
    var host = $('#starts');
    if (!host) return;
    var pick = H.datasets.filter(function (d) {
      return ['CHIRPS', 'ERA5', 'AgERA5'].indexOf(d.title) > -1 || d.title.indexOf('GLW4') > -1;
    });
    host.innerHTML = pick.map(function (d) {
      var specs = [['Resolution', d.resolution], ['Coverage', d.temporal],
                   ['Updated', d.cadence], ['Access', d.formats], ['Licence', d.licence]]
        .filter(function (p) { return p[1]; });
      return '<div class="start">' +
        '<div class="start-title">' + esc(d.title) + '</div>' +
        '<div class="start-prov">' + esc(d.provider || '') + '</div>' +
        '<dl>' + specs.map(function (p) {
          return '<dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1]) + '</dd>';
        }).join('') + '</dl>' +
        (d.url ? '<a class="start-go" href="' + esc(d.url) + '" target="_blank" rel="noopener">Open &#8599;</a>' : '') +
      '</div>';
    }).join('');
  })();

  /* ---------- Home block 4: three most recent publications ---------------- */
  (function latest3() {
    var host = $('#latest3');
    if (!host) return;
    host.innerHTML = H.publications.slice(0, 3).map(miniRow).join('');
  })();

  function miniRow(i) {
    var tag = i.url ? 'a' : 'div';
    var attrs = i.url ? ' href="' + esc(i.url) + '" target="_blank" rel="noopener"' : '';
    return '<' + tag + ' class="mini-row"' + attrs + '>' +
      '<div class="mini-title">' + esc(i.title) + '</div>' +
      '<div class="mini-meta">' + esc(H.TYPE_LABEL[i.type] || '') + ' &middot; ' +
        esc(i.provider || '') + (i.year ? ' &middot; ' + esc(i.year) : '') + '</div>' +
    '</' + tag + '>';
  }

  function rowHTML(i) {
    var tag = i.url ? 'a' : 'div';
    var attrs = i.url ? ' href="' + esc(i.url) + '" target="_blank" rel="noopener"' : '';
    return '<' + tag + ' class="row"' + attrs + '>' +
      '<div class="row-main">' +
        '<div class="row-title">' + esc(i.title) + '</div>' +
        '<div class="row-meta">' + esc(H.TYPE_LABEL[i.type] || '') + ' &middot; ' + esc(i.kind || '') +
          ' &middot; ' + esc(i.provider || '') + (i.year ? ' &middot; ' + esc(i.year) : '') + '</div>' +
        '<div class="row-blurb">' + esc(i.blurb || '') + '</div>' +
      '</div>' +
      '<div class="row-side"><span class="lens lens-' + esc(i.lens) + '">' +
        esc(H.LENS_LABEL[i.lens] || '') + '</span></div>' +
    '</' + tag + '>';
  }

  /* ---------- resources.html: one search field, two filters ---------------
     Concept C offered filters and no search. Concept B offered a facet rail of
     six. E offers one search box and two selects, because a lean V1 cannot
     justify a facet a visitor has not yet been observed using. */
  (function resources() {
    var host = $('#results');
    if (!host) return;
    var qIn    = $('#rq');
    var typeSel = $('#fType');
    var aowSel  = $('#fAow');
    var count   = $('#resultCount');

    Object.keys(H.TYPE_PLURAL).forEach(function (t) {
      if (t === 'expert' || t === 'event') return;
      typeSel.insertAdjacentHTML('beforeend',
        '<option value="' + esc(t) + '">' + esc(H.TYPE_PLURAL[t]) + '</option>');
    });
    H.AREAS.forEach(function (a) {
      aowSel.insertAdjacentHTML('beforeend',
        '<option value="' + esc(a.id) + '">' + esc(a.short) + '</option>');
    });

    var params = new URLSearchParams(window.location.search);
    if (params.get('q')) qIn.value = params.get('q');
    if (params.get('aow')) aowSel.value = params.get('aow');
    if (params.get('type')) typeSel.value = params.get('type');

    function run() {
      var q = qIn.value.trim();
      var items = q ? H.search(q)
                    : H.all.filter(function (i) {
                        return i.type !== 'expert' && i.type !== 'event';
                      });
      if (typeSel.value !== 'all') {
        items = items.filter(function (i) { return i.type === typeSel.value; });
      }
      if (aowSel.value !== 'all') {
        items = items.filter(function (i) { return i.aow === aowSel.value; });
      }
      count.textContent = items.length + ' of ' + H.all.length + ' catalogued items';
      host.innerHTML = items.length
        ? items.map(rowHTML).join('')
        : '<div class="empty">Nothing matches. Search terms are combined with AND, so fewer words find more. ' +
          'If a term you expected to work returns nothing, that is a tagging gap in the catalogue, not a bug ' +
          'in the search, and it belongs in decision D8.</div>';
    }

    qIn.addEventListener('input', run);
    typeSel.addEventListener('change', run);
    aowSel.addEventListener('change', run);
    $('#fReset').addEventListener('click', function () {
      qIn.value = ''; typeSel.value = 'all'; aowSel.value = 'all'; run();
    });
    run();
  })();

  /* ---------- news.html: funding calls and events, kept separate ---------- */
  (function news() {
    var host = $('#newsList');
    if (!host) return;
    host.innerHTML = H.news.map(function (n) {
      return '<a class="mini-row" href="' + esc(n.url) + '" target="_blank" rel="noopener">' +
        '<div class="mini-title">' + esc(n.title) + '</div>' +
        '<div class="mini-meta">' + esc(n.kind || '') + ' &middot; ' + esc(n.provider || '') +
          ' &middot; ' + esc(n.year || '') + '</div>' +
      '</a>';
    }).join('');
  })();

  /* ---------- more.html: everything deprioritised off the home page ------- */
  (function targets() {
    var host = $('#targetList');
    if (!host) return;
    host.innerHTML = H.TARGETS.map(function (t) {
      return '<div class="start"><div class="start-title">' + esc(t.figure) + '</div>' +
        '<div class="start-prov">' + esc(t.label) + '</div></div>';
    }).join('');
  })();

  (function spotlight() {
    var host = $('#spotlightBody');
    if (!host) return;
    var p = H.publications[0];
    host.innerHTML = '<div class="mini-title" style="font-size:17px">' + esc(p.title) + '</div>' +
      '<p style="margin-top:8px">' + esc(p.blurb) + '</p>' +
      '<div class="mini-meta" style="margin-top:8px">' + esc(p.provider) + ' &middot; ' + esc(p.year) + '</div>' +
      (p.url ? '<p style="margin-top:14px"><a class="btn ghost" href="' + esc(p.url) +
        '" target="_blank" rel="noopener">Read it &#8599;</a></p>' : '');
  })();

  (function themes() {
    var host = $('#themeList');
    if (!host || !H.themes) return;
    host.innerHTML = H.themes.map(function (t) {
      var n = H.themeItems(t).length;
      return '<div class="spine-item" style="border-top-color:var(--text-3)">' +
        '<div class="spine-name">' + esc(t.name) + '</div>' +
        '<div class="spine-desc">' + esc(t.sub.join(', ')) + '</div>' +
        '<div class="spine-n">' + n + ' item' + (n === 1 ? '' : 's') + '</div>' +
      '</div>';
    }).join('');
  })();

  (function experts() {
    var host = $('#expertList');
    if (!host) return;
    host.innerHTML = H.experts.map(function (e) {
      return '<div class="start"><div class="start-title">' + esc(e.title) + '</div>' +
        '<div class="start-prov">' + esc(e.provider || '') + '</div>' +
        '<p style="font-size:13.5px;color:var(--text-2)">' + esc(e.blurb || '') + '</p></div>';
    }).join('');
  })();

  /* ---------- Any stated corpus size, kept honest ------------------------- */
  $$('.corpus-n').forEach(function (el) { el.textContent = H.all.length; });
  $$('.dataset-n').forEach(function (el) { el.textContent = H.datasets.length; });
})();
