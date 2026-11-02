/* CGIAR Climate Hub - publication cut of Concept C, 02/11/2026
 * One script for all five pages. Each block checks for its own hooks and exits
 * quietly if the page does not contain them. Nothing on these pages needs a
 * model, a sign-in, or a service other than this folder and the links it
 * points to.
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

  function slug(name) { return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

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

  /* ---------- "What are you looking for": three doors by resource type ---------- */
  (function typecards() {
    const host = $('#typecards');
    if (!host) return;
    const doors = [
      { type: 'publication', name: 'Publications', desc: 'Journal articles, reports and briefs, each linked to its publisher.' },
      { type: 'dataset',     name: 'Datasets',     desc: 'Climate records with resolution, coverage, cadence and licence stated where the provider publishes them.' },
      { type: 'method',      name: 'Tools and methods', desc: 'Tutorials, manuals and notebooks: how to do the work, not only what exists.' }
    ];
    host.innerHTML = doors.map(function (d) {
      const n = H.all.filter(function (i) { return i.type === d.type; }).length;
      return '<a class="typecard" href="resources.html?type=' + esc(d.type) + '">' +
        '<div class="typecard-n">' + n + '</div>' +
        '<div class="typecard-name">' + esc(d.name) + '</div>' +
        '<div class="typecard-desc">' + esc(d.desc) + '</div>' +
        '<span class="typecard-go">Browse &rarr;</span></a>';
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
    const withThemes = host.hasAttribute('data-themes');
    host.innerHTML = H.AREAS.map(function (a, idx) {
      const items = H.all.filter(function (i) { return i.aow === a.id && H.SHOWN_TYPES.indexOf(i.type) > -1; });
      const themes = withThemes ? H.themesUnder(a.id) : [];
      const chips = themes.length
        ? '<div class="chips">' + themes.map(function (t) {
            // Name only. A theme's own count spans every area it touches, so a
            // number here would sit beside the area's count and read as a
            // contradiction; the counts live on the Themes page instead.
            return '<a class="chip" href="themes.html#' + esc(slug(t.name)) + '">' + esc(t.name) + '</a>';
          }).join('') + '</div>'
        : (withThemes ? '<div class="chips chips-empty">No theme sits mainly under this area yet</div>' : '');
      return '<div class="aowrow' + (withThemes ? ' aowrow-themed' : '') + '">' +
        '<div class="aowrow-n">' + (idx + 1) + '</div>' +
        '<div><div class="aowrow-name">' + esc(a.name) + '</div>' +
        '<div class="aowrow-desc">' + esc(a.desc) + '</div>' + chips + '</div>' +
        '<div class="themerow-n">' + items.length + ' item' + (items.length === 1 ? '' : 's') + '</div>' +
      '</div>';
    }).join('');
  })();

  /* ---------- Theme list, short form on the home tab ---------- */


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
    host.innerHTML = H.AREAS.map(function (a, idx) {
      const themes = H.themesUnder(a.id);
      return '<section class="areagroup" id="' + esc(a.id) + '">' +
        '<div class="areagroup-head"><div class="aowrow-n">' + (idx + 1) + '</div>' +
          '<div><h2>' + esc(a.name) + '</h2><p>' + esc(a.desc) + '</p></div></div>' +
        (themes.length ? themes.map(function (t) {
          const items = H.themeShown(t);
          return '<div class="themeblock" id="' + esc(slug(t.name)) + '">' +
            '<div class="themeblock-head"><h3>' + esc(t.name) + '</h3>' +
              '<span class="themerow-n">' + items.length + ' item' + (items.length === 1 ? '' : 's') + '</span></div>' +
            '<div class="themeblock-sub">' + t.sub.map(esc).join(' &middot; ') + '</div>' +
            (items.length
              ? '<div class="cards">' + items.map(cardHTML).join('') + '</div>'
              : '<div class="empty">Nothing in the catalogue matches this theme yet.</div>') +
          '</div>';
        }).join('') : '<div class="empty">No theme sits mainly under this area yet. Items tagged to it are still ' +
          'listed under <a href="resources.html">Resources &amp; Data</a>.</div>') +
      '</section>';
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

    // Deep link support, so the three doors on the home page can land here
    // already filtered rather than dumping the visitor at the top of the list.
    const qs = new URLSearchParams(location.search);
    const wanted = qs.get('type');
    if (wanted && $$('#fType option').some(function (o) { return o.value === wanted; })) {
      typeSel.value = wanted;
    }
    const qIn = $('#fq');
    if (qIn && qs.get('q')) qIn.value = qs.get('q');

    function run() {
      const q = qIn ? qIn.value.trim() : '';
      let items = (q ? H.search(q) : H.all).filter(function (i) {
        return i.type !== 'expert' && i.type !== 'event' && i.type !== 'project';
      });
      if (typeSel.value !== 'all') items = items.filter(function (i) { return i.type === typeSel.value; });
      if (themeSel.value !== 'all') {
        const ids = {};
        H.themeShown(H.themes[Number(themeSel.value)]).forEach(function (i) { ids[i.id] = true; });
        items = items.filter(function (i) { return ids[i.id]; });
      }
      count.textContent = items.length + (items.length === 1 ? ' resource' : ' resources') +
        (themeSel.value !== 'all' ? ' under ' + H.themes[Number(themeSel.value)].name : '');
      out.innerHTML = items.length
        ? '<div class="cards">' + items.map(cardHTML).join('') + '</div>'
        : '<div class="empty"><strong>Nothing matches.</strong> Every search word has to appear in an item, so try ' +
          'one word rather than a phrase, or clear a filter.</div>';
    }

    if (qIn) {
      let tmr = null;
      qIn.addEventListener('input', function () {
        clearTimeout(tmr);
        tmr = setTimeout(function () {
          run();
          if (window.HubTrack && qIn.value.trim().length > 2) window.HubTrack.search(qIn.value.trim());
        }, 240);
      });
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
      typeSel.value = 'all'; themeSel.value = 'all'; if (qIn) qIn.value = ''; run();
    });
    run();
  })();

  /* ---------- experts.html ---------- */
  /* ---------- news.html ---------- */
  (function news() {
    const host = $('#newsList');
    if (!host) return;
    host.innerHTML = H.news.map(function (n) {
      return '<a class="newsrow" href="' + esc(n.url) + '" target="_blank" rel="noopener">' +
        '<div class="newsrow-when">' + esc(n.year) + '</div>' +
        '<div><div class="newsrow-title">' + esc(n.title) + '</div>' +
          '<div class="newsrow-src">' + esc(n.kind) + ' &middot; ' + esc(n.provider) + '</div></div>' +
        '<div>' + lensChip(n.lens) + '</div>' +
      '</a>';
    }).join('');
  })();

  /* ---------- About: what the catalogue holds, measured at load ---------- */
  (function measures() {
    const host = $('#measures');
    if (!host) return;
    const ds = H.datasets;
    const full = ds.filter(function (d) { const c = H.completeness(d); return c && c.have === c.of; }).length;
    // Only the types this cut of the site actually shows. The catalogue also
    // holds people and projects, which have no page here and are not counted.
    const SHOWN = ['dataset', 'publication', 'method', 'innovation', 'event'];
    const byType = SHOWN.map(function (t) {
      return [H.TYPE_PLURAL[t], H.all.filter(function (i) { return i.type === t; }).length];
    }).filter(function (r) { return r[1] > 0; });
    host.innerHTML = '<div class="tablescroll"><table class="plain"><tbody>' +
      byType.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + r[1] + '</td></tr>'; }).join('') +
      '<tr><td>Datasets with all six metadata fields recorded</td><td>' + full + ' of ' + ds.length + '</td></tr>' +
      '</tbody></table></div>';
  })();

  /* ---------- Keep any stated corpus size honest ---------- */
  (function corpusSize() {
    const shown = H.all.filter(function (i) { return ['dataset', 'publication', 'method', 'innovation', 'event'].indexOf(i.type) > -1; }).length;
    $$('.corpus-n').forEach(function (el) { el.textContent = shown; });
  })();
})();
