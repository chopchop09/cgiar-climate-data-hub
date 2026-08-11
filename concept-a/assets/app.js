/* CGIAR Climate Hub - Version A (layered)
 * One script for all three pages. Each block checks for its own hooks and
 * exits quietly if the page does not contain them.
 */
(function () {
  'use strict';
  const H = window.HUB;
  const $  = function (s, r) { return (r || document).querySelector(s); };
  const $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  const esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  function lensChip(lens) {
    return '<span class="lens lens-' + lens + '">' + esc(H.LENS_LABEL[lens]) + '</span>';
  }

  /* A card for an item that has somewhere to go, a div for one that does not.
     Experts have no destination yet, and pretending otherwise would be the
     kind of overclaiming the design principles rule out. */
  function cardHTML(item) {
    const external = item.url && item.url.indexOf('http') === 0;
    const tag = item.url ? 'a' : 'div';
    const attrs = item.url
      ? ' href="' + esc(item.url) + '"' + (external ? ' target="_blank" rel="noopener"' : '')
      : '';
    const go = item.url ? (external ? 'Open ↗' : 'Open →') : 'No link yet';
    return '<' + tag + ' class="card"' + attrs + '>' +
      '<div class="card-top">' + lensChip(item.lens) +
        '<span class="card-kind">' + esc(item.kind) + '</span></div>' +
      '<div class="card-title">' + esc(item.title) + '</div>' +
      '<div class="card-blurb">' + esc(item.blurb) + '</div>' +
      '<div class="card-foot"><span>' + esc(item.provider || '') +
        (item.year ? ' · ' + esc(item.year) : '') + '</span>' +
        '<span class="go">' + go + '</span></div>' +
      '</' + tag + '>';
  }

  function rowHTML(item) {
    const external = item.url && item.url.indexOf('http') === 0;
    const tag = item.url ? 'a' : 'div';
    const attrs = item.url
      ? ' href="' + esc(item.url) + '"' + (external ? ' target="_blank" rel="noopener"' : '')
      : '';
    return '<' + tag + ' class="row"' + attrs + '>' +
      '<div class="row-main">' +
        '<div class="row-title">' + esc(item.title) + '</div>' +
        '<div class="row-meta">' + esc(H.TYPE_LABEL[item.type]) + ' · ' + esc(item.kind) +
          ' · ' + esc(item.provider || '') + (item.year ? ' · ' + esc(item.year) : '') +
          ' · ' + esc(item.geo) + '</div>' +
        '<div class="row-blurb">' + esc(item.blurb) + '</div>' +
      '</div>' +
      '<div class="row-side">' + lensChip(item.lens) +
        (item.url ? '<span class="go" style="font-size:12.5px;font-weight:700;color:var(--blue-800)">' +
          (external ? 'Open ↗' : 'Open →') + '</span>' : '') +
      '</div>' +
    '</' + tag + '>';
  }

  /* ------------------------------------------------------------------
     TIER 1: the six static shelves, with a lens filter inside each
     ------------------------------------------------------------------ */
  (function shelves() {
    const tabs = $$('.shelf-tab');
    if (!tabs.length) return;

    const SETS = {
      publication: H.publications, dataset: H.datasets, method: H.methods,
      innovation: H.innovations, expert: H.experts, event: H.news
    };
    const state = {}; // one lens setting per shelf, so switching tabs does not reset the others

    function paint(type) {
      const shelf = $('#shelf-' + type);
      if (!shelf) return;
      const lens = state[type] || 'all';
      const items = SETS[type].filter(function (i) { return lens === 'all' || i.lens === lens; });
      const target = $('.shelf-items', shelf);
      target.innerHTML = items.length
        ? items.map(cardHTML).join('')
        : '<div class="empty">Nothing in this collection carries the ' +
          esc(H.LENS_LABEL[lens]) + ' tag. That is a gap in the tagging, not proof that no such work exists.</div>';
      const c = $('.shelf-count', shelf);
      if (c) c.textContent = items.length + ' of ' + SETS[type].length + ' shown';
    }

    // Lens buttons within each shelf
    $$('.shelf').forEach(function (shelf) {
      const type = shelf.dataset.type;
      state[type] = 'all';
      $$('.lensbar .chip', shelf).forEach(function (btn) {
        btn.addEventListener('click', function () {
          state[type] = btn.dataset.lens;
          $$('.lensbar .chip', shelf).forEach(function (b) {
            b.setAttribute('aria-pressed', String(b === btn));
          });
          paint(type);
        });
      });
      paint(type);
    });

    function activate(type) {
      tabs.forEach(function (t) {
        const on = t.dataset.type === type;
        t.setAttribute('aria-selected', String(on));
        t.setAttribute('tabindex', on ? '0' : '-1');
      });
      $$('.shelf').forEach(function (s) { s.classList.toggle('active', s.dataset.type === type); });
      if (history.replaceState) history.replaceState(null, '', '#collection-' + type);
    }

    tabs.forEach(function (t) {
      t.addEventListener('click', function () { activate(t.dataset.type); });
      t.addEventListener('keydown', function (e) {
        const i = tabs.indexOf(t);
        let n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft')  n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { e.preventDefault(); n.focus(); activate(n.dataset.type); }
      });
    });

    // Deep link, so "look at the experts shelf" can be sent as a URL
    const m = (location.hash || '').match(/^#collection-(\w+)$/);
    if (m && SETS[m[1]]) activate(m[1]); else activate(tabs[0].dataset.type);
  })();

  /* ------------------------------------------------------------------
     TIER 2: query the collections
     ------------------------------------------------------------------ */
  (function query() {
    const form = $('#queryForm');
    if (!form) return;
    const input   = $('#queryInput');
    const typeSel = $('#queryType');
    const lensSel = $('#queryLens');
    const geoSel  = $('#queryGeo');
    const out     = $('#queryResults');
    const count   = $('#queryCount');

    H.geoList().forEach(function (g) {
      const o = document.createElement('option'); o.value = g; o.textContent = g; geoSel.appendChild(o);
    });

    function run() {
      const q = input.value.trim();
      let items = q ? H.search(q) : H.all.slice();
      if (typeSel.value !== 'all') items = items.filter(function (i) { return i.type === typeSel.value; });
      if (lensSel.value !== 'all') items = items.filter(function (i) { return i.lens === lensSel.value; });
      if (geoSel.value  !== 'all') items = items.filter(function (i) { return i.geo.indexOf(geoSel.value) > -1; });

      count.textContent = items.length + (items.length === 1 ? ' result' : ' results') +
        (q ? ' for “' + q + '”' : ' across the whole collection');

      if (!items.length) {
        out.innerHTML = '<div class="empty"><strong>Nothing matched.</strong> This searches only the ' +
          H.all.length + ' items catalogued on this prototype, by plain keyword. ' +
          'It is not searching CGSpace, Gardian or any live catalogue. A real version would.</div>';
        return;
      }
      out.innerHTML = '<div class="rows">' + items.map(rowHTML).join('') + '</div>';
    }

    form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    [typeSel, lensSel, geoSel].forEach(function (s) { s.addEventListener('change', run); });
    input.addEventListener('input', function () { if (!input.value.trim()) run(); });

    $$('.q-example').forEach(function (b) {
      b.addEventListener('click', function () { input.value = b.textContent.trim(); run(); input.focus(); });
    });

    $('#queryReset').addEventListener('click', function () {
      input.value = ''; typeSel.value = 'all'; lensSel.value = 'all'; geoSel.value = 'all'; run();
    });

    run();
  })();

  /* ------------------------------------------------------------------
     TIER 3: analytics and country profiles
     ------------------------------------------------------------------ */
  (function analyse() {
    const host = $('#profileTemplate');
    if (!host) return;
    host.innerHTML = H.profileTemplate.map(function (s) {
      return '<div class="brief-row">' +
        '<div class="brief-sec">' + esc(s.section) + '</div>' +
        '<div class="brief-layers">Would draw on: ' +
          s.layers.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('') + '</div>' +
        '<div class="brief-note">' + esc(s.note) + '</div>' +
      '</div>';
    }).join('');

    // Portfolio counts, computed rather than typed, so they cannot drift
    const byLens = { adaptation: 0, mitigation: 0, cross: 0 };
    H.projects.forEach(function (p) { byLens[p.lens]++; });
    const el = $('#portfolioCounts');
    if (el) {
      el.innerHTML = Object.keys(byLens).map(function (k) {
        return '<div class="hero-a-stat" style="min-width:120px"><span class="n" style="color:var(--blue-800)">' +
          byLens[k] + '</span><span class="l" style="color:var(--text-3)">' +
          esc(H.LENS_LABEL[k]) + '</span></div>';
      }).join('');
    }

    const active = H.projects.filter(function (p) { return p.kind === 'Active development'; }).length;
    const ac = $('#activeCount');
    if (ac) ac.textContent = active + ' of ' + H.projects.length;
  })();

  /* ------------------------------------------------------------------
     Shared: mark the current page in the nav and the tier map
     ------------------------------------------------------------------ */
  (function currentPage() {
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $$('nav.mainnav a, .tier').forEach(function (a) {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === here || (here === 'index.html' && href === './')) a.setAttribute('aria-current', 'page');
    });
  })();

  /* Keep the stated corpus size honest: written from the data, never typed. */
  (function corpusSize() {
    $$('.corpus-n').forEach(function (el) { el.textContent = H.all.length; });
  })();
})();
