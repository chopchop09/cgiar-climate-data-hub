/* CGIAR Climate Hub - Concept C, the GESI-style reading
 * One script for all five tabs. Each block checks for its own hooks and exits
 * quietly if the page does not contain them.
 *
 * Everything rendered here is matched from the shared catalogue in data.js at
 * page load. No count on any page is typed in, so a number that looks wrong is a
 * statement about the catalogue rather than about the copy.
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

  function cardHTML(item) {
    const external = item.url && item.url.indexOf('http') === 0;
    const tag = item.url ? 'a' : 'div';
    const attrs = item.url ? ' href="' + esc(item.url) + '" target="_blank" rel="noopener"' : '';
    // Metadata shown as a short definition list rather than table columns, so the
    // card stays editorial. Concept B renders the same fields as a dense table.
    const specs = [['Resolution', item.resolution], ['Coverage', item.temporal],
                   ['Updated', item.cadence], ['Access', item.formats]]
      .filter(function (p) { return p[1]; });
    const specHTML = specs.length
      ? '<dl class="cardspecs">' + specs.map(function (p) {
          return '<dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1]) + '</dd>';
        }).join('') + '</dl>'
      : '';
    return '<' + tag + ' class="card"' + attrs + '>' +
      '<div class="card-top">' + lensChip(item.lens) +
        '<span class="card-kind">' + esc(item.kind) + '</span></div>' +
      '<div class="card-title">' + esc(item.title) + '</div>' +
      '<div class="card-blurb">' + esc(item.blurb) + '</div>' +
      specHTML +
      '<div class="card-foot"><span>' + esc(item.provider || '') +
        (item.year ? ' &middot; ' + esc(item.year) : '') + '</span><span class="go">' +
        (item.url ? (external ? 'Open ↗' : 'Open →') : 'No link yet') + '</span></div>' +
      '</' + tag + '>';
  }

  function rowHTML(item) {
    const external = item.url && item.url.indexOf('http') === 0;
    const tag = item.url ? 'a' : 'div';
    const attrs = item.url ? ' href="' + esc(item.url) + '" target="_blank" rel="noopener"' : '';
    return '<' + tag + ' class="row"' + attrs + '>' +
      '<div class="row-main">' +
        '<div class="row-title">' + esc(item.title) + '</div>' +
        '<div class="row-meta">' + esc(H.TYPE_LABEL[item.type]) + ' &middot; ' + esc(item.kind) +
          ' &middot; ' + esc(item.provider || '') + (item.year ? ' &middot; ' + esc(item.year) : '') + '</div>' +
        '<div class="row-blurb">' + esc(item.blurb) + '</div>' +
      '</div>' +
      '<div class="row-side">' + lensChip(item.lens) + '</div>' +
    '</' + tag + '>';
  }

  /* ---------- Image credits, written from data rather than into the markup ----- */
  (function credits() {
    const map = [['#cap-hero', 'hero-sahel.jpg'],
                 ['#cap-spotlight', 'spotlight.jpg'],
                 ['#cap-banner', 'banner-harvest.jpg']];
    map.forEach(function (pair) {
      const el = $(pair[0]);
      if (el && H.credits[pair[1]]) el.textContent = H.credits[pair[1]];
    });
  })();

  /* ---------- Programme targets, as published ---------- */
  (function targets() {
    const host = $('#targets');
    if (!host) return;
    host.innerHTML = H.TARGETS.map(function (t) {
      return '<div class="target"><span class="target-n">' + esc(t.figure) + '</span>' +
        '<span class="target-l">' + esc(t.label) + '</span></div>';
    }).join('');
  })();

  /* ---------- Vantage points ---------- */
  (function vantage() {
    const host = $('#vantage');
    if (!host) return;
    host.innerHTML = H.vantage.map(function (v) {
      const items = v.types.length
        ? H.all.filter(function (i) { return v.types.indexOf(i.type) > -1; })
        : [];
      const tag = v.href ? 'a' : 'div';
      const attr = v.href ? ' href="' + esc(v.href) + '"' : '';
      return '<' + tag + ' class="vcard"' + attr + '>' +
        '<div class="vcard-name">' + esc(v.label) + '</div>' +
        '<div class="vcard-desc">' + esc(v.desc) + '</div>' +
        (v.note ? '<div class="vcard-desc" style="font-style:italic">' + esc(v.note) + '</div>' : '') +
        '<div class="' + (items.length ? 'vcard-count' : 'vcard-count vcard-empty') + '">' +
          (items.length ? items.length + (items.length === 1 ? ' item' : ' items') : 'Nothing yet') +
        '</div></' + tag + '>';
    }).join('');
  })();

  /* ---------- Foundational datasets, the four with complete metadata ---------- */
  (function foundational() {
    const host = $('#foundational');
    if (!host) return;
    const pick = H.datasets.filter(function (d) {
      return ['CHIRPS', 'ERA5', 'AgERA5'].indexOf(d.title) > -1 ||
             d.title.indexOf('GLW4') > -1;
    });
    host.innerHTML = pick.map(cardHTML).join('');
  })();

  /* ---------- The five published areas of work ---------- */
  (function areas() {
    const host = $('#aowList');
    if (!host) return;
    host.innerHTML = H.AREAS.map(function (a, idx) {
      const items = H.all.filter(function (i) { return i.aow === a.id; });
      return '<div class="aowrow">' +
        '<div class="aowrow-n">' + (idx + 1) + '</div>' +
        '<div><div class="aowrow-name">' + esc(a.name) + '</div>' +
        '<div class="aowrow-desc">' + esc(a.desc) + '</div></div>' +
        '<div class="themerow-n">' + items.length + ' item' + (items.length === 1 ? '' : 's') + '</div>' +
      '</div>';
    }).join('');
  })();

  /* ---------- Spotlight: a real catalogue item, not invented copy ---------- */
  (function spotlight() {
    const host = $('#spotlightBody');
    if (!host) return;
    // The Nature Climate Change paper is the most recent peer-reviewed item held.
    const pick = H.publications[0];
    host.innerHTML =
      '<div class="spotlight-kicker">' + esc(pick.kind) + '</div>' +
      '<h2>' + esc(pick.title) + '</h2>' +
      '<p>' + esc(pick.blurb) + '</p>' +
      '<p style="margin-top:10px;font-size:13px;color:var(--highlight)">' +
        esc(pick.provider) + ' &middot; ' + esc(pick.year) + '</p>' +
      (pick.url ? '<p style="margin-top:16px"><a class="btn on-dark" href="' + esc(pick.url) +
        '" target="_blank" rel="noopener">Read the paper ↗</a></p>' : '');
  })();

  /* ---------- Theme list, short form on the home tab ---------- */
  (function themeShort() {
    const host = $('#themelistShort');
    if (!host) return;
    host.innerHTML = H.themes.map(function (t) {
      const n = H.themeItems(t).length;
      return '<a class="themerow" href="themes.html">' +
        '<div><div class="themerow-name">' + esc(t.name) + '</div>' +
        '<div class="themerow-sub">' + esc(t.sub.join(' &middot; ').replace(/&amp;middot;/g, '&middot;')) + '</div></div>' +
        '<div class="themerow-n">' + n + ' item' + (n === 1 ? '' : 's') + '</div>' +
      '</a>';
    }).join('');
    // The join above escapes the separator, so put it back as a real separator.
    $$('.themerow-sub', host).forEach(function (el, i) {
      el.innerHTML = H.themes[i].sub.map(esc).join(' &middot; ');
    });
  })();

  /* ---------- Latest publications on the home tab ---------- */
  (function latest() {
    const host = $('#latestPubs');
    if (!host) return;
    host.innerHTML = H.publications.map(rowHTML).join('');
  })();

  /* ---------- themes.html: every theme with its matching items ---------- */
  (function themeBlocks() {
    const host = $('#themeBlocks');
    if (!host) return;
    host.innerHTML = H.themes.map(function (t) {
      const items = H.themeItems(t);
      return '<div class="themeblock">' +
        '<div class="themeblock-head"><h2>' + esc(t.name) + '</h2>' +
          '<span class="themerow-n">' + items.length + ' item' + (items.length === 1 ? '' : 's') + '</span></div>' +
        '<div class="themeblock-sub">' + t.sub.map(esc).join(' &middot; ') + '</div>' +
        (items.length
          ? '<div class="cards">' + items.map(cardHTML).join('') + '</div>'
          : '<div class="empty">Nothing in the catalogue matches this theme. That is a gap in what has been ' +
            'catalogued, not evidence that CGIAR does no work here.</div>') +
      '</div>';
    }).join('');
  })();

  /* ---------- resources.html: type and theme filters, no search box ---------- */
  (function resources() {
    const typeSel = $('#fType');
    if (!typeSel) return;
    const themeSel = $('#fTheme');
    const out = $('#rResults');
    const count = $('#rCount');

    H.themes.forEach(function (t, i) {
      const o = document.createElement('option');
      o.value = String(i); o.textContent = t.name;
      themeSel.appendChild(o);
    });

    // Deep link support, so the vantage cards on the home tab can land here
    // already filtered rather than dumping the visitor at the top of the list.
    const qs = new URLSearchParams(location.search);
    const wanted = qs.get('type');
    if (wanted && $$('#fType option').some(function (o) { return o.value === wanted; })) {
      typeSel.value = wanted;
    }

    function run() {
      let items = H.all.filter(function (i) { return i.type !== 'expert' && i.type !== 'event' && i.type !== 'project'; });
      if (typeSel.value !== 'all') items = items.filter(function (i) { return i.type === typeSel.value; });
      if (themeSel.value !== 'all') {
        const ids = {};
        H.themeItems(H.themes[Number(themeSel.value)]).forEach(function (i) { ids[i.id] = true; });
        items = items.filter(function (i) { return ids[i.id]; });
      }
      count.textContent = items.length + (items.length === 1 ? ' resource' : ' resources') +
        (themeSel.value !== 'all' ? ' under ' + H.themes[Number(themeSel.value)].name : '');
      out.innerHTML = items.length
        ? '<div class="cards">' + items.map(cardHTML).join('') + '</div>'
        : '<div class="empty"><strong>Nothing matches those two filters together.</strong> With no search box ' +
          'on this page there is no other way in, which is worth noticing: it is the cost of the pattern.</div>';
    }

    typeSel.addEventListener('change', function () {
      if (window.HubTrack && typeSel.value !== 'all') window.HubTrack.filter('resource type', typeSel.value);
      run();
    });
    themeSel.addEventListener('change', function () {
      if (window.HubTrack && themeSel.value !== 'all') {
        window.HubTrack.filter('theme', H.themes[Number(themeSel.value)].name);
      }
      run();
    });
    $('#fReset').addEventListener('click', function () {
      typeSel.value = 'all'; themeSel.value = 'all'; run();
    });
    run();
  })();

  /* ---------- experts.html ---------- */
  (function experts() {
    const host = $('#expertList');
    if (!host) return;
    host.innerHTML = H.experts.map(function (e) {
      const initials = e.title.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
      return '<div class="expertcard">' +
        '<div class="expert-initials" aria-hidden="true">' + esc(initials) + '</div>' +
        '<div><div class="expert-name">' + esc(e.title) + '</div>' +
        '<div class="expert-org">' + esc(e.provider) + '</div>' +
        '<div class="expert-topic">' + esc(e.blurb) + '</div></div>' +
      '</div>';
    }).join('');
  })();

  /* ---------- news.html ---------- */
  (function news() {
    const host = $('#newsList');
    if (!host) return;
    host.innerHTML = H.news.map(function (n) {
      return '<a class="newsrow" href="' + esc(n.url) + '" target="_blank" rel="noopener">' +
        '<div class="newsrow-when">' + esc(n.year) + '</div>' +
        '<div><div class="newsrow-title">' + esc(n.title) + '</div>' +
          '<div class="newsrow-src">' + esc(n.kind) + ' &middot; ' + esc(n.source) + '</div></div>' +
        '<div>' + lensChip(n.lens) + '</div>' +
      '</a>';
    }).join('');
  })();

  /* ---------- Keep any stated corpus size honest ---------- */
  (function corpusSize() {
    $$('.corpus-n').forEach(function (el) { el.textContent = H.all.length; });
  })();
})();
