/* CGIAR Climate Hub - Concept B, the analytical console
 * ============================================================================
 * One query state. A sortable result table, two analytics panels and an evidence
 * pack, all rendered from it. Nothing on this page is a placeholder describing
 * what a section would do: every row, count, bar and citation is computed from
 * the 51 catalogued items at load.
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
  const nullable = function (v) { return v ? esc(v) : '<span class="null">not recorded</span>'; };

  const state = { q: '', lens: null, aow: null, type: null, sort: 'relevance', dir: 1 };

  /* ---------- Selection ---------- */
  function selected() {
    let items = state.q ? H.search(state.q) : H.all.slice();
    if (state.lens) items = items.filter(function (i) { return i.lens === state.lens; });
    if (state.aow)  items = items.filter(function (i) { return i.aow === state.aow; });
    if (state.type) items = items.filter(function (i) { return i.type === state.type; });
    if (state.sort !== 'relevance') {
      const key = state.sort;
      items = items.slice().sort(function (a, b) {
        const av = (a[key] || '').toString().toLowerCase();
        const bv = (b[key] || '').toString().toLowerCase();
        if (av === bv) return 0;
        if (!av) return 1;            // nulls always last, regardless of direction
        if (!bv) return -1;
        return av < bv ? -state.dir : state.dir;
      });
    }
    return items;
  }

  /* ---------- Facet rail ---------- */
  function countIf(pred) {
    let items = state.q ? H.search(state.q) : H.all;
    return items.filter(pred).length;
  }

  function paintRail() {
    const lensHost = $('#railLens');
    const aowHost  = $('#railAow');
    const typeHost = $('#railType');

    lensHost.innerHTML = ['adaptation', 'mitigation', 'cross'].map(function (l) {
      return '<button class="facet" type="button" data-facet="lens" data-value="' + l + '" aria-pressed="' +
        (state.lens === l) + '"><span>' + esc(H.LENS_LABEL[l]) + '</span><span class="n">' +
        countIf(function (i) { return i.lens === l; }) + '</span></button>';
    }).join('');

    aowHost.innerHTML = H.AREAS.map(function (a) {
      return '<button class="facet" type="button" data-facet="aow" data-value="' + a.id + '" aria-pressed="' +
        (state.aow === a.id) + '" title="' + esc(a.name) + '"><span>' + esc(a.short) + '</span><span class="n">' +
        countIf(function (i) { return i.aow === a.id; }) + '</span></button>';
    }).join('');

    typeHost.innerHTML = ['dataset', 'method', 'publication', 'innovation', 'project', 'expert', 'event'].map(function (t) {
      return '<button class="facet" type="button" data-facet="type" data-value="' + t + '" aria-pressed="' +
        (state.type === t) + '"><span>' + esc(H.TYPE_PLURAL[t]) + '</span><span class="n">' +
        countIf(function (i) { return i.type === t; }) + '</span></button>';
    }).join('');

    $$('.facet').forEach(function (b) {
      b.addEventListener('click', function () {
        const f = b.dataset.facet, v = b.dataset.value;
        const turningOn = state[f] !== v;
        state[f] = turningOn ? v : null;   // click again to clear
        // Which facets reviewers reach for is one of the questions this round asks.
        // Labels rather than internal keys, so the emailed report is readable.
        if (turningOn && window.HubTrack) {
          const FACET_LABEL = { lens: 'climate action', aow: 'area of work', type: 'resource type' };
          const area = f === 'aow' ? H.areaById(v) : null;
          window.HubTrack.filter(FACET_LABEL[f] || f, area ? area.short : v);
        }
        render();
      });
    });
  }

  /* ---------- Result table ---------- */
  const COLS = [
    { key: 'title',      label: 'Resource', sortable: true },
    { key: 'type',       label: 'Type', sortable: true },
    { key: 'provider',   label: 'Provider', sortable: true },
    { key: 'resolution', label: 'Resolution', sortable: true },
    { key: 'temporal',   label: 'Coverage', sortable: true },
    { key: 'cadence',    label: 'Updated', sortable: true },
    { key: 'licence',    label: 'Licence / access', sortable: false },
    { key: 'meta',       label: 'Metadata', sortable: false }
  ];

  function meterHTML(item) {
    const c = H.completeness(item);
    if (!c) return '<span class="null">n/a</span>';
    const pct = Math.round(100 * c.have / c.of);
    const cls = pct === 100 ? '' : (pct >= 60 ? ' mid' : ' low');
    return '<div class="meter" title="' + (c.missing.length ? 'Missing: ' + esc(c.missing.join(', ')) : 'All six fields recorded') + '">' +
      '<span class="meter-track"><span class="meter-fill' + cls + '" style="width:' + pct + '%"></span></span>' +
      '<span class="meter-txt">' + c.have + '/' + c.of + '</span></div>';
  }

  function rowHTML(i) {
    const area = H.areaById(i.aow);
    const name = i.url
      ? '<a href="' + esc(i.url) + '" target="_blank" rel="noopener">' + esc(i.title) + ' &#8599;</a>'
      : esc(i.title);
    return '<tr>' +
      '<td><div class="cell-name">' + name + '</div>' +
        '<div class="cell-sub">' + esc(i.blurb) + '</div>' +
        '<div style="margin-top:6px;display:flex;gap:5px;flex-wrap:wrap">' +
          '<span class="pill pill-' + i.lens + '">' + esc(H.LENS_LABEL[i.lens]) + '</span>' +
          (area ? '<span class="pill pill-type">' + esc(area.short) + '</span>' : '') +
        '</div></td>' +
      '<td><span class="pill pill-type">' + esc(i.kind) + '</span></td>' +
      '<td class="mono" style="white-space:normal;max-width:22ch">' + nullable(i.provider) + '</td>' +
      '<td class="mono" style="white-space:normal">' + nullable(i.resolution) + '</td>' +
      '<td class="mono" style="white-space:normal">' + nullable(i.temporal) + '</td>' +
      '<td class="mono" style="white-space:normal">' + nullable(i.cadence) + '</td>' +
      '<td class="mono" style="white-space:normal;max-width:22ch">' + nullable(i.licence) + '</td>' +
      '<td>' + meterHTML(i) + '</td>' +
    '</tr>';
  }

  function paintTable(items) {
    const head = '<thead><tr>' + COLS.map(function (c) {
      const on = state.sort === c.key;
      return '<th' + (c.sortable ? ' class="sortable" data-sort="' + c.key + '" tabindex="0"' : '') +
        (on ? ' aria-sort="' + (state.dir === 1 ? 'ascending' : 'descending') + '"' : '') + '>' +
        esc(c.label) + (on ? (state.dir === 1 ? ' ▲' : ' ▼') : '') + '</th>';
    }).join('') + '</tr></thead>';

    $('#resTable').innerHTML = items.length
      ? '<table class="res">' + head + '<tbody>' + items.map(rowHTML).join('') + '</tbody></table>'
      : '';
    $('#resEmpty').innerHTML = items.length ? '' :
      '<div class="empty"><strong>Nothing matches.</strong> This queries the ' + H.all.length +
      ' items catalogued on this prototype by plain keyword, with every term required, in your browser. ' +
      'It does not reach CGSpace, Gardian or the live Data Hub catalogue, so an empty result means the ' +
      'prototype has not catalogued it, not that CGIAR has not done it.</div>';

    $$('#resTable th.sortable').forEach(function (th) {
      const go = function () {
        const k = th.dataset.sort;
        if (state.sort === k) state.dir = -state.dir; else { state.sort = k; state.dir = 1; }
        render();
      };
      th.addEventListener('click', go);
      th.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
  }

  /* ---------- Panel 1: coverage matrix, areas of work by lens ---------- */
  function paintMatrix(items) {
    const lenses = ['adaptation', 'mitigation', 'cross'];
    const max = Math.max.apply(null, H.AREAS.map(function (a) {
      return Math.max.apply(null, lenses.map(function (l) {
        return items.filter(function (i) { return i.aow === a.id && i.lens === l; }).length;
      }));
    }).concat([1]));

    function band(n) {
      if (n === 0) return 'c0';
      const r = n / max;
      return r > .66 ? 'c3' : (r > .33 ? 'c2' : 'c1');
    }

    let html = '<table class="matrix"><thead><tr><th>Area of work</th>' +
      lenses.map(function (l) { return '<th style="text-align:center">' + esc(H.LENS_LABEL[l]) + '</th>'; }).join('') +
      '<th style="text-align:center">Total</th></tr></thead><tbody>';
    H.AREAS.forEach(function (a) {
      const row = lenses.map(function (l) {
        return items.filter(function (i) { return i.aow === a.id && i.lens === l; }).length;
      });
      const tot = row.reduce(function (s, n) { return s + n; }, 0);
      html += '<tr><th scope="row" title="' + esc(a.name) + '">' + esc(a.short) + '</th>' +
        row.map(function (n) { return '<td><span class="cellcount ' + band(n) + '">' + n + '</span></td>'; }).join('') +
        '<td><span class="cellcount ' + band(tot) + '">' + tot + '</span></td></tr>';
    });
    html += '</tbody></table>';
    $('#matrixBody').innerHTML = html;

    const empties = [];
    H.AREAS.forEach(function (a) {
      lenses.forEach(function (l) {
        if (!items.filter(function (i) { return i.aow === a.id && i.lens === l; }).length) {
          empties.push(a.short + ' / ' + H.LENS_LABEL[l].toLowerCase());
        }
      });
    });
    $('#matrixNote').textContent = empties.length
      ? empties.length + ' of 15 cells are empty in the current selection: ' + empties.slice(0, 3).join('; ') +
        (empties.length > 3 ? ', and ' + (empties.length - 3) + ' more.' : '.')
      : 'Every area of work has evidence under all three lenses in this selection.';
  }

  /* ---------- Panel 2: metadata completeness across datasets ---------- */
  function paintMeta(items) {
    const ds = items.filter(function (i) { return i.type === 'dataset'; });
    if (!ds.length) {
      $('#metaBody').innerHTML = '<div class="empty">No datasets in the current selection, so there is nothing to score.</div>';
      $('#metaNote').textContent = '';
      return;
    }
    const tally = {};
    H.META_FIELDS.forEach(function (f) { tally[f] = 0; });
    ds.forEach(function (d) { H.META_FIELDS.forEach(function (f) { if (!d[f]) tally[f]++; }); });

    const rows = H.META_FIELDS.slice().sort(function (a, b) { return tally[b] - tally[a]; }).map(function (f) {
      const pct = Math.round(100 * tally[f] / ds.length);
      return '<div class="barrow"><div class="barrow-label">' + esc(f) + '</div>' +
        '<div class="barrow-n">' + tally[f] + '</div></div>' +
        '<div class="barrow-bar" style="margin-bottom:8px"><span style="width:' + pct + '%"></span></div>';
    }).join('');

    const scored = ds.map(function (d) { return H.completeness(d).have; });
    const mean = scored.reduce(function (s, n) { return s + n; }, 0) / scored.length;
    const complete = scored.filter(function (n) { return n === H.META_FIELDS.length; }).length;

    $('#metaBody').innerHTML =
      '<p style="font-size:12.5px;color:var(--fg-2);margin-bottom:12px">Datasets in this selection missing each field, ' +
      'out of ' + ds.length + ':</p>' + rows;
    $('#metaNote').textContent = 'Mean ' + mean.toFixed(1) + ' of ' + H.META_FIELDS.length +
      ' fields recorded. ' + complete + ' of ' + ds.length + ' datasets are complete.';
  }

  /* ---------- Evidence pack: real items, grouped, cited ---------- */
  function citeHTML(i) {
    const area = H.areaById(i.aow);
    const bits = [i.provider].filter(Boolean);
    if (i.resolution) bits.push(i.resolution);
    if (i.temporal) bits.push(i.temporal);
    return '<li>' + (i.url
        ? '<a href="' + esc(i.url) + '" target="_blank" rel="noopener">' + esc(i.title) + ' &#8599;</a>'
        : esc(i.title)) +
      '<span class="src"> &mdash; ' + esc(bits.join(' &middot; ').replace(/&amp;middot;/g, '&middot;')) + '</span></li>';
  }

  function paintPack(items) {
    const q = state.q ? '"' + state.q + '"' : 'the whole catalogue';
    const area = state.aow ? H.areaById(state.aow) : null;

    const SECTIONS = [
      { n: '1', t: 'Underlying climate data',
        pick: items.filter(function (i) { return i.type === 'dataset' && /Precipitation|Reanalysis|Agrometeorology/.test(i.kind); }),
        gap: 'Downscaled projections are not in this catalogue. Any forward-looking statement would need a GCM or CMIP source that has not been catalogued here.' },
      { n: '2', t: 'Spatial and systems context',
        pick: items.filter(function (i) { return i.type === 'dataset' && /Geospatial|Monitoring|Analysis/.test(i.kind); }),
        gap: null },
      { n: '3', t: 'Methods you would follow',
        pick: items.filter(function (i) { return i.type === 'method'; }),
        gap: null },
      { n: '4', t: 'Published evidence to cite',
        pick: items.filter(function (i) { return i.type === 'publication'; }),
        gap: 'Three publications is the whole catalogued record here. A real pack would query CGSpace, which holds around 150,000 items.' },
      { n: '5', t: 'Adaptation or mitigation options',
        pick: items.filter(function (i) { return i.type === 'innovation'; }),
        gap: 'Catalogue entries exist, but nothing ranks these options for a specific country or system.' },
      { n: '6', t: 'Who is already working on this',
        pick: items.filter(function (i) { return i.type === 'project' || i.type === 'expert'; }),
        gap: null },
      { n: '7', t: 'Where the funding or the deadline is',
        pick: items.filter(function (i) { return i.type === 'event'; }),
        gap: null }
    ];

    const used = SECTIONS.reduce(function (s, x) { return s + x.pick.length; }, 0);

    $('#packMeta').textContent = 'Assembled from ' + used + ' of the ' + items.length +
      ' items in the current selection. Query: ' + q +
      (state.lens ? ' · ' + H.LENS_LABEL[state.lens] : '') +
      (area ? ' · ' + area.name : '') + '.';

    $('#packBody').innerHTML = SECTIONS.map(function (s) {
      return '<div class="pack-sec">' +
        '<div class="pack-sec-h"><span class="pack-sec-n">' + s.n + '</span>' +
          '<span class="pack-sec-t">' + esc(s.t) + '</span>' +
          '<span class="meter-txt">' + s.pick.length + ' source' + (s.pick.length === 1 ? '' : 's') + '</span></div>' +
        (s.pick.length
          ? '<ul class="pack-cite">' + s.pick.map(citeHTML).join('') + '</ul>'
          : '<p class="pack-gap">Nothing in the current selection fills this section.</p>') +
        (s.gap && s.pick.length ? '<p class="pack-gap">' + esc(s.gap) + '</p>' : '') +
      '</div>';
    }).join('');
  }

  /* ---------- Render ---------- */
  function render() {
    const items = selected();
    paintRail();
    paintTable(items);
    paintMatrix(items);
    paintMeta(items);
    paintPack(items);

    $('#resCount').textContent = items.length + ' of ' + H.all.length + ' items';
    const bits = [];
    if (state.q) bits.push('query "' + state.q + '"');
    if (state.lens) bits.push(H.LENS_LABEL[state.lens]);
    if (state.aow) bits.push(H.areaById(state.aow).short);
    if (state.type) bits.push(H.TYPE_PLURAL[state.type].toLowerCase());
    $('#resState').textContent = bits.length ? bits.join(' · ') : 'no filters applied';
    $('#railReset').style.display = (state.q || state.lens || state.aow || state.type) ? 'block' : 'none';
  }

  /* ---------- Wiring ---------- */
  $('#qForm').addEventListener('submit', function (e) {
    e.preventDefault();
    state.q = $('#q').value.trim();
    if (window.HubTrack) window.HubTrack.search(state.q);
    render();
  });
  $('#q').addEventListener('input', function () {
    if (!$('#q').value.trim() && state.q) { state.q = ''; render(); }
  });
  $$('.qchip').forEach(function (c) {
    c.addEventListener('click', function () {
      $('#q').value = c.dataset.q; state.q = c.dataset.q;
      if (window.HubTrack) window.HubTrack.search(state.q);
      render();
    });
  });
  $('#railReset').addEventListener('click', function () {
    state.q = ''; state.lens = null; state.aow = null; state.type = null;
    state.sort = 'relevance'; state.dir = 1;
    $('#q').value = ''; render();
  });

  render();
})();
