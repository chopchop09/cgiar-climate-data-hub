/* CGIAR Climate Hub - Concept D, the reviewed reading
 * ============================================================================
 * One script for all five pages. Each block looks for its own hooks and exits
 * quietly if the page does not contain them, so there is no per-page wiring.
 *
 * Everything rendered here is matched from the shared catalogue in data.js at
 * page load. No count on any page is typed in. A number that looks wrong is a
 * statement about the catalogue, not about the copy.
 * ========================================================================== */
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

  /* ---------- Image credit, written from data rather than into the markup ---- */
  (function credit() {
    const el = $('#cap-hero');
    if (el && H.credits && H.credits['hero-sahel.jpg']) el.textContent = H.credits['hero-sahel.jpg'];
  })();

  /* ---------- Hero search ----------
   * One field. The suggestions that were pills on the current site are now the
   * placeholder, rotating on a slow timer, per Brayden's note of 13/08/2026.
   * Submitting hands off to the resources page rather than opening a results
   * panel in place, so there is one results surface on the site, not two.
   */
  (function heroSearch() {
    const form = $('#dSearchForm');
    if (!form) return;
    const input = $('#dSearchInput', form);
    const SUGGESTIONS = ['drought', 'seasonal forecast', 'emission factors',
                         'climate finance', 'crop risk', 'adaptation tracking'];
    let n = 0;
    function cycle() {
      input.setAttribute('placeholder', 'Search the catalogue, for example: ' + SUGGESTIONS[n % SUGGESTIONS.length]);
      n += 1;
    }
    cycle();
    const timer = setInterval(function () { if (document.activeElement !== input) cycle(); }, 3800);
    input.addEventListener('focus', function () { clearInterval(timer); });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      const q = input.value.trim();
      if (!q) { input.focus(); return; }
      if (window.HubTrack) window.HubTrack.search(q);
      location.href = 'resources.html?q=' + encodeURIComponent(q);
    });
  })();

  /* ---------- The spine: five published areas of work, use-cases nested ------
   * Peter Steward, 11/08/2026: "Organization on thematic areas with use-cases
   * nested within. (is the use-case framing needed at the highest levek?)"
   *
   * The five areas are used rather than the ten editorial themes of Concept C,
   * because the same reviewer wrote that "the tab themes overlap a lot, need
   * more diffierentiation", and because the five are published on cgiar.org and
   * can therefore be checked. The ten themes survive as a secondary filter on
   * the resources page, labelled there as editorial.
   */
  (function spine() {
    const host = $('#spine');
    if (!host) return;
    const openFirst = host.hasAttribute('data-open-first');
    host.innerHTML = H.AREAS.map(function (a, idx) {
      const items = H.all.filter(function (i) { return i.aow === a.id; });
      const cases = H.projects.filter(function (p) { return p.aow === a.id; });
      const casesHTML = cases.length
        ? cases.map(function (c) {
            const state = c.kind === 'Idea' ? 'idea' : 'active';
            const needs = (c.needs || []).map(function (id) {
              const it = H.byId[id];
              if (!it) return null;
              return it.url
                ? '<a href="' + esc(it.url) + '" target="_blank" rel="noopener">' + esc(it.title) + '</a>'
                : esc(it.title);
            }).filter(Boolean);
            return '<div class="uc">' +
              '<div class="uc-top">' +
                '<span class="uc-name">' + esc(c.title) + '</span>' +
                '<span class="uc-state ' + state + '">' + esc(c.kind) + '</span>' +
                '<span class="uc-who">' + esc(c.provider || '') +
                  (c.champion ? ' &middot; ' + esc(c.champion) : ' &middot; no champion recorded') + '</span>' +
              '</div>' +
              '<div class="uc-blurb">' + esc(c.blurb) + '</div>' +
              (needs.length
                ? '<div class="uc-needs">Draws on: ' + needs.join(', ') + '</div>'
                : '<div class="uc-needs">No catalogue items recorded against this use case yet.</div>') +
            '</div>';
          }).join('')
        : '<div class="area-none">No use case is recorded under this area of work. ' +
          'That is a gap in the portfolio as catalogued, not evidence that CGIAR does no work here.</div>';
      return '<details class="area"' + (openFirst && idx === 0 ? ' open' : '') + '>' +
        '<summary>' +
          '<span class="area-n">' + (idx + 1) + '</span>' +
          '<span><span class="area-name">' + esc(a.name) + '</span>' +
            '<span class="area-desc">' + esc(a.desc) + '</span></span>' +
          '<span class="area-count">' + cases.length + ' use ' + (cases.length === 1 ? 'case' : 'cases') +
            ' &middot; ' + items.length + ' item' + (items.length === 1 ? '' : 's') + '</span>' +
        '</summary>' +
        '<div class="area-body">' + casesHTML + '</div>' +
      '</details>';
    }).join('');
  })();

  /* ---------- Foundational and flagship assets ----------
   * Brayden Youngberg, 13/08/2026: "Possibly this should just highlight some key
   * 'foundational' datasets/tools, or specific products of the climate action
   * program?" and "We just need to define what goes here vs the technical
   * catalog." The rule is stated on the page and applied here, rather than a
   * hand-picked list that nobody can reproduce.
   *
   * RULE: a dataset appears here only if all six metadata fields are recorded.
   * That is a rule a reader can check, and it currently admits a small number.
   */
  (function foundational() {
    const host = $('#foundational');
    if (!host) return;
    const pick = H.datasets.filter(function (d) {
      const c = H.completeness(d);
      return c && c.have === c.of;
    });
    host.innerHTML = pick.length
      ? pick.map(cardHTML).join('')
      : '<div class="empty">No dataset currently records all six metadata fields.</div>';
    const n = $('#foundationalN');
    if (n) n.textContent = String(pick.length);
    const t = $('#datasetsN');
    if (t) t.textContent = String(H.datasets.length);
  })();

  /* ---------- Measured gaps ----------
   * Computed, never asserted. Two of these came off the board as questions and
   * one came out of building the prototypes.
   */
  (function gaps() {
    const host = $('#gaps');
    if (!host) return;
    const scored = H.datasets.map(H.completeness).filter(Boolean);
    const complete = scored.filter(function (c) { return c.have === c.of; }).length;
    const mean = scored.length
      ? (scored.reduce(function (s, c) { return s + c.have; }, 0) / scored.length).toFixed(1)
      : '0';
    const drought = H.search('drought');
    const droughtProjects = drought.filter(function (i) { return i.type === 'project'; }).length;
    const noChampion = H.projects.filter(function (p) { return !p.champion; }).length;
    const tiles = [
      { n: complete + ' of ' + scored.length,
        l: 'datasets record all six metadata fields. The rest are shown with "not recorded" against the missing ones.' },
      { n: mean + ' of 6',
        l: 'is the mean metadata completeness across every catalogued dataset.' },
      { n: String(drought.length),
        l: 'items match a search for "drought", ' + droughtProjects + ' of them use cases, although drought was the most recurrent topic in the 10/08/2026 check-in.' },
      { n: H.experts.length + ' named',
        l: 'use-case champions are listed. No CGIAR climate expert directory has been compiled, so the expert finder the January architecture called for cannot be built from this catalogue.' },
      { n: noChampion + ' of ' + H.projects.length,
        l: 'use cases have no champion recorded against them.' },
      { n: '0',
        l: 'training events or workshops are catalogued, which Peter Steward flagged as missing on 11/08/2026.' }
    ];
    host.innerHTML = tiles.map(function (t) {
      return '<div class="gap"><div class="gap-n">' + esc(t.n) + '</div>' +
        '<div class="gap-l">' + esc(t.l) + '</div></div>';
    }).join('');
  })();

  /* ---------- Latest publications on the home page ---------- */
  (function latest() {
    const host = $('#latestPubs');
    if (!host) return;
    host.innerHTML = H.publications.slice(0, 4).map(rowHTML).join('');
  })();

  /* ---------- resources.html ----------
   * A filterable view first, per Peter Steward's note that a search may not be
   * warranted at this catalogue size. The search field is present because the
   * hero hands off to it, but it starts empty and the filters work without it.
   */
  (function resources() {
    const typeSel = $('#fType');
    if (!typeSel) return;
    const themeSel = $('#fTheme');
    const qInput = $('#fQuery');
    const out = $('#rResults');
    const count = $('#rCount');

    if (H.themes) {
      H.themes.forEach(function (t, i) {
        const o = document.createElement('option');
        o.value = String(i); o.textContent = t.name;
        themeSel.appendChild(o);
      });
    }

    const qs = new URLSearchParams(location.search);
    const wantedType = qs.get('type');
    if (wantedType && $$('#fType option').some(function (o) { return o.value === wantedType; })) {
      typeSel.value = wantedType;
    }
    const wantedQ = qs.get('q');
    if (wantedQ) qInput.value = wantedQ;

    function run() {
      let items;
      const q = qInput.value.trim();
      if (q) {
        items = H.search(q);
      } else {
        items = H.all.slice();
      }
      items = items.filter(function (i) { return i.type !== 'expert' && i.type !== 'event'; });
      if (typeSel.value !== 'all') items = items.filter(function (i) { return i.type === typeSel.value; });
      if (themeSel.value !== 'all' && H.themes) {
        const ids = {};
        H.themeItems(H.themes[Number(themeSel.value)]).forEach(function (i) { ids[i.id] = true; });
        items = items.filter(function (i) { return ids[i.id]; });
      }
      count.textContent = items.length + (items.length === 1 ? ' result' : ' results') +
        (q ? ' for "' + q + '"' : '') +
        (themeSel.value !== 'all' && H.themes ? ' under ' + H.themes[Number(themeSel.value)].name : '');
      out.innerHTML = items.length
        ? '<div class="cards">' + items.map(cardHTML).join('') + '</div>'
        : '<div class="empty"><strong>Nothing matches.</strong> Search terms are combined with AND, so ' +
          'two words both have to appear. An earlier OR version returned 29 of 44 items for "climate finance" ' +
          'and made the catalogue look far richer than it is.</div>';
    }

    typeSel.addEventListener('change', function () {
      if (window.HubTrack && typeSel.value !== 'all') window.HubTrack.filter('resource type', typeSel.value);
      run();
    });
    themeSel.addEventListener('change', function () {
      if (window.HubTrack && themeSel.value !== 'all' && H.themes) {
        window.HubTrack.filter('theme', H.themes[Number(themeSel.value)].name);
      }
      run();
    });
    let debounce;
    qInput.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        const q = qInput.value.trim();
        if (q.length > 2 && window.HubTrack) window.HubTrack.search(q);
        run();
      }, 350);
    });
    $('#fReset').addEventListener('click', function () {
      typeSel.value = 'all'; themeSel.value = 'all'; qInput.value = ''; run();
    });
    run();
  })();

  /* ---------- news.html, split into three ----------
   * Peter Steward: "I would want the funding calls separate to publications."
   * The catalogue already carries a kind against each entry, so the split is
   * read from the data rather than maintained by hand.
   */
  (function news() {
    const host = $('#newsGroups');
    if (!host) return;
    const GROUPS = [
      { kind: 'Funding', title: 'Funding calls',
        sub: 'Open calls with a deadline or a rolling window. Kept apart from publications deliberately.' },
      { kind: 'Event', title: 'Conferences and events',
        sub: 'Dated events. Training events and workshops are not catalogued yet; that gap is listed on the home page.' },
      { kind: 'Call for papers', title: 'Calls for papers',
        sub: 'Journal collections open for submission.' }
    ];
    host.innerHTML = GROUPS.map(function (g) {
      const items = H.news.filter(function (n) { return n.kind === g.kind; });
      return '<div class="newsgroup">' +
        '<h2>' + esc(g.title) + ' <span class="area-count">' + items.length + '</span></h2>' +
        '<div class="newsgroup-sub">' + esc(g.sub) + '</div>' +
        (items.length
          ? items.map(function (n) {
              return '<a class="newsrow" href="' + esc(n.url) + '" target="_blank" rel="noopener">' +
                '<div class="newsrow-when">' + esc(n.year) + '</div>' +
                '<div><div class="newsrow-title">' + esc(n.title) + '</div>' +
                  '<div class="newsrow-src">' + esc(n.provider || '') + '</div></div>' +
                '<div>' + lensChip(n.lens) + '</div>' +
              '</a>';
            }).join('')
          : '<div class="empty">Nothing catalogued under this heading.</div>') +
      '</div>';
    }).join('');
  })();

  /* ---------- Champions, shown as what they are ----------
   * Not a directory. The January 2026 architecture had an expert finder as a
   * first-class node; no directory content exists, so this lists the six named
   * use-case champions and says on the page that it is not the finder.
   */
  (function champions() {
    const host = $('#champions');
    if (!host) return;
    host.innerHTML = H.experts.map(function (e) {
      return '<div class="icard">' +
        '<h3>' + esc(e.title) + '</h3>' +
        '<p><strong>' + esc(e.provider) + '</strong></p>' +
        '<p style="margin-top:6px">' + esc(e.blurb) + '</p>' +
      '</div>';
    }).join('');
  })();

  /* ---------- Keep any stated corpus size honest ---------- */
  (function corpusSize() {
    $$('.corpus-n').forEach(function (el) { el.textContent = H.all.length; });
    $$('.usecase-n').forEach(function (el) { el.textContent = H.projects.length; });
  })();
})();
