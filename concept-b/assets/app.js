/* CGIAR Climate Hub - Version B (unified)
 * One surface. One query state. Three bands that all read from it.
 * There is no navigation between layers because there are no separate layers:
 * that is the whole proposition being tested.
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

  /* Single source of truth for what the page is currently showing. */
  const state = { q: '', lens: 'all', geo: 'all', type: 'all' };

  const els = {
    input:   $('#q'),
    lens:    $('#fLens'),
    geo:     $('#fGeo'),
    type:    $('#fType'),
    count:   $('#fCount'),
    reset:   $('#fReset'),
    band1:   $('#band1Body'),
    band1Sub:$('#band1Sub'),
    band2:   $('#band2Body'),
    band2Sub:$('#band2Sub'),
    band3:   $('#band3Body'),
    band3Sub:$('#band3Sub'),
    echo:    $('#queryEcho')
  };

  H.geoList().forEach(function (g) {
    const o = document.createElement('option'); o.value = g; o.textContent = g; els.geo.appendChild(o);
  });

  function lensChip(lens) {
    return '<span class="lens lens-' + lens + '">' + esc(H.LENS_LABEL[lens]) + '</span>';
  }

  function cardHTML(item) {
    const external = item.url && item.url.indexOf('http') === 0;
    const tag = item.url ? 'a' : 'div';
    const attrs = item.url ? ' href="' + esc(item.url) + '" target="_blank" rel="noopener"' : '';
    return '<' + tag + ' class="card"' + attrs + '>' +
      '<div class="card-top">' + lensChip(item.lens) +
        '<span class="card-kind">' + esc(item.kind) + '</span></div>' +
      '<div class="card-title">' + esc(item.title) + '</div>' +
      '<div class="card-blurb">' + esc(item.blurb) + '</div>' +
      '<div class="card-foot"><span>' + esc(item.source) +
        (item.year ? ' · ' + esc(item.year) : '') + '</span><span class="go">' +
        (item.url ? (external ? 'Open ↗' : 'Open →') : 'No link yet') + '</span></div>' +
      '</' + tag + '>';
  }

  function projectHTML(p) {
    return '<div class="row">' +
      '<div class="row-main">' +
        '<div class="row-title">' + esc(p.title) + '</div>' +
        '<div class="row-meta">' + esc(p.kind) + ' · ' + esc(p.source) +
          (p.champion ? ' · Champion: ' + esc(p.champion) : ' · No champion named') +
          ' · ' + esc(p.geo) + '</div>' +
        '<div class="row-blurb">' + esc(p.blurb) + '</div>' +
        '<div class="chip-row" style="margin-top:9px">' +
          (p.tags || []).map(function (t) {
            return '<span class="chip" style="cursor:default;font-size:12px;padding:4px 10px">' + esc(t) + '</span>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="row-side">' + lensChip(p.lens) +
        (p.url ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener" class="btn ghost sm">Review ↗</a>' : '') +
      '</div>' +
    '</div>';
  }

  /* Apply the current state to any set of items. */
  function filter(items) {
    let out = items;
    if (state.q) {
      const hits = H.search(state.q);
      const ids = {};
      hits.forEach(function (h) { ids[h.id] = true; });
      out = out.filter(function (i) { return ids[i.id]; });
      // keep the search's relevance order
      out = hits.filter(function (h) { return out.indexOf(h) > -1; });
    }
    if (state.lens !== 'all') out = out.filter(function (i) { return i.lens === state.lens; });
    if (state.geo  !== 'all') out = out.filter(function (i) { return i.geo.indexOf(state.geo) > -1; });
    return out;
  }

  /* ---------- Band 1: what already exists ---------- */
  function paintBand1() {
    let items = filter(H.all.filter(function (i) { return i.type !== 'project'; }));
    if (state.type !== 'all') items = items.filter(function (i) { return i.type === state.type; });

    if (!items.length) {
      els.band1.innerHTML = '<div class="empty"><strong>Nothing matched.</strong> This searches the ' +
        H.all.length + ' items catalogued on this prototype by plain keyword, in your browser. ' +
        'It does not reach CGSpace, Gardian or the Data Hub catalogue, so an empty result means the ' +
        'prototype has not catalogued it, not that CGIAR has not done it.</div>';
      els.band1Sub.textContent = 'No matching resources.';
      return;
    }

    const order = ['publication', 'dataset', 'method', 'innovation', 'expert', 'event'];
    const groups = {};
    items.forEach(function (i) { (groups[i.type] = groups[i.type] || []).push(i); });

    els.band1.innerHTML = order.filter(function (t) { return groups[t]; }).map(function (t) {
      return '<div class="group">' +
        '<div class="group-head">' + esc(H.TYPE_PLURAL[t]) + ' (' + groups[t].length + ')</div>' +
        '<div class="cards">' + groups[t].map(cardHTML).join('') + '</div>' +
      '</div>';
    }).join('');

    const kinds = order.filter(function (t) { return groups[t]; })
      .map(function (t) { return groups[t].length + ' ' + H.TYPE_PLURAL[t].toLowerCase(); });
    els.band1Sub.textContent = items.length + ' resources: ' + kinds.join(', ') + '.';
  }

  /* ---------- Band 2: who is working on it ---------- */
  function paintBand2() {
    const items = filter(H.projects);
    if (!items.length) {
      els.band2.innerHTML = '<div class="empty"><strong>No project in the portfolio matches.</strong> ' +
        'The portfolio is eight use cases. A gap here is a real signal: it means nobody in the ' +
        'Climate Data Hub portfolio has picked this up, or it is not tagged as such.</div>';
      els.band2Sub.textContent = 'No matching projects.';
      return;
    }
    const active = items.filter(function (p) { return p.kind === 'Active development'; }).length;
    els.band2.innerHTML = '<div class="rows">' + items.map(projectHTML).join('') + '</div>';
    els.band2Sub.textContent = items.length + ' of ' + H.projects.length + ' projects match, ' +
      active + ' in active development, ' + (items.length - active) + ' at idea stage.';
  }

  /* ---------- Band 3: assemble something new ---------- */
  function paintBand3() {
    const matched = filter(H.all);
    const label = state.geo !== 'all' ? state.geo : 'no geography selected';
    const topic = state.q ? '“' + state.q + '”' : 'the whole collection';

    els.band3.innerHTML =
      '<div class="brief">' +
        '<div class="brief-head">' +
          '<h3>Two to four page brief: ' + esc(topic) + '</h3>' +
          '<div class="sub">Geography: ' + esc(label) + ' · ' +
            esc(H.LENS_LABEL[state.lens] || 'Adaptation and mitigation') + ' · ' +
            matched.length + ' items in scope</div>' +
        '</div>' +
        '<div class="brief-body">' +
          H.profileTemplate.map(function (s) {
            return '<div class="brief-row">' +
              '<div class="brief-sec">' + esc(s.section) + '</div>' +
              '<div class="brief-layers">Would draw on: ' +
                s.layers.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('') + '</div>' +
              '<div class="brief-note">' + esc(s.note) + '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';

    els.band3Sub.textContent = 'Scope follows the query above: ' + matched.length +
      ' items would feed this brief. Section structure and source layers are real; no figures are populated.';
  }

  function render() {
    els.count.textContent = filter(H.all).length + ' of ' + H.all.length + ' items in scope';
    els.echo.textContent = state.q
      ? 'Showing everything the Hub holds on “' + state.q + '”'
      : 'Showing everything the Hub holds';
    paintBand1(); paintBand2(); paintBand3();
  }

  /* ---------- Wiring ---------- */
  $('#qForm').addEventListener('submit', function (e) {
    e.preventDefault();
    state.q = els.input.value.trim();
    render();
    // The whole point of this concept is that the answer is already below, not
    // on another page. Move the reader there rather than leaving them at the top.
    const t = document.getElementById('band1');
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  els.input.addEventListener('input', function () {
    if (!els.input.value.trim() && state.q) { state.q = ''; render(); }
  });

  els.lens.addEventListener('change', function () { state.lens = els.lens.value; render(); });
  els.geo .addEventListener('change', function () { state.geo  = els.geo.value;  render(); });
  els.type.addEventListener('change', function () { state.type = els.type.value; render(); });

  els.reset.addEventListener('click', function () {
    state.q = ''; state.lens = 'all'; state.geo = 'all'; state.type = 'all';
    els.input.value = ''; els.lens.value = 'all'; els.geo.value = 'all'; els.type.value = 'all';
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  $$('.q-example').forEach(function (b) {
    b.addEventListener('click', function () {
      els.input.value = b.dataset.q || b.textContent.trim();
      state.q = els.input.value.trim();
      render();
      const t = document.getElementById('band1');
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  render();

  /* Keep the stated corpus size honest: written from the data, never typed. */
  (function corpusSize() {
    $$('.corpus-n').forEach(function (el) { el.textContent = H.all.length; });
  })();
})();
