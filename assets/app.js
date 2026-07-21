/* CGIAR Climate Commons - Variant B: Medium
 * Front-end interactions
 */

(function () {
  'use strict';

  /* ---------- Use-case switcher ----------
   * The portfolio and every brief are served from this site: see
   * use-cases.html and assets/briefs/.
   */
  const BRIEF = 'assets/briefs/';

  const useCases = {
    all: {
      title: 'Trusted climate data for every CGIAR use case',
      desc:  'The Climate Commons turns trusted CGIAR climate data into decision-ready evidence for farmers, pastoralists and fishers. It curates quality-assured datasets, links them to the use cases they serve, and complements the national data systems teams already rely on. Choose a use case above, or search across everything.',
      icon:  '🗂️', name: 'All use cases', sub: 'CGIAR Climate Commons use-case portfolio',
      meta:  [{ cls: 'st-active', label: '3 in active development' }, { cls: 'st-idea', label: '4 ideas' }],
      tags:  ['GCF climate rationale', 'Adaptation options Kenya', 'Rainfall trends Sahel', 'Drought risk East Africa'],
      links: [
        { icon: '🗂️', label: 'View the use-case portfolio', href: 'use-cases.html' },
        { icon: '📊', label: 'Browse featured datasets', href: '#datasets' },
        { icon: '💬', label: 'Ask the Hub for evidence and citations', href: '#tools' },
        { icon: '🛠️', label: 'Work with the datasets directly', href: 'https://cgiar-climate-data-hub.github.io/', external: true }
      ]
    },
    gcf: {
      title: 'Build the climate rationale for your GCF proposal',
      desc:  'A Climate Rationale notebook auto-generating evidence-based climate risk narratives, hazard-exposure tables and statistical summaries for Green Climate Fund proposal writers.',
      icon:  '💼', name: 'GCF Preparation Facility', sub: 'Climate Data & Innovations Hub (CACC2) · AoW5-Finance',
      meta:  [{ cls: 'st-active', label: 'Active development' }, { cls: 'st-champ', label: 'Champion: Cesare Scartozzi' }],
      tags:  ['GCF climate rationale', 'Hazard-exposure tables', 'Climate trends and projections', 'Extreme events'],
      links: [
        { icon: '📄', label: 'Download the use-case brief (PDF)', href: BRIEF + 'gcf-preparation-facility-brief.pdf', external: true },
        { icon: '🔎', label: 'Data, skills and notebook review', href: 'https://cgiar-climate-data-hub.github.io/use-cases/gcf-preparation-facility/gcf-prep-review.html', external: true },
        { icon: '💬', label: 'Ask the Hub for evidence and citations', href: '#tools' }
      ]
    },
    b4t: {
      title: 'A defensible crop risk index for breeding decisions',
      desc:  'Clarifying, auditing and updating the Breeding for Tomorrow Climate and Environmental Crop Risk Index so its hazard inputs, scoring logic and prioritisation role are methodologically defensible and use current climate data where feasible.',
      icon:  '🌾', name: 'B4T Crop Risk Index (CRI)', sub: 'Breeding for Tomorrow',
      meta:  [{ cls: 'st-active', label: 'Active development' }, { cls: 'st-champ', label: 'Champion: Bert Lenaerts (IRRI)' }],
      tags:  ['Crop risk index', 'Hazard inputs', 'Breeding prioritisation', 'Climate data audit'],
      links: [
        { icon: '📄', label: 'Download the use-case brief (PDF)', href: BRIEF + 'b4t-crop-risk-index-brief.pdf', external: true },
        { icon: '🔎', label: 'CRI review: data and methods', href: 'https://cgiar-climate-data-hub.github.io/use-cases/b4t/cri-review.html', external: true },
        { icon: '💬', label: 'Ask the Hub for evidence and citations', href: '#tools' }
      ]
    },
    agwise: {
      title: 'Climate data for process-based crop modelling',
      desc:  'Integrating historical and forecast climate data into the AgWise fertilisation module to support process-based crop model simulations and decision support tools across Africa.',
      icon:  '🌱', name: 'AgWise Climate Data Integration', sub: 'Sustainable Farming (SFP) · AoW2-Adapt',
      meta:  [{ cls: 'st-active', label: 'Active development' }],
      tags:  ['AgWise fertilisation module', 'Seasonal climate forecasts', 'Process-based crop models', 'Decision support tools'],
      links: [
        { icon: '📄', label: 'Download the use-case brief (PDF)', href: BRIEF + 'agwise-climate-data-integration-brief.pdf', external: true },
        { icon: '📊', label: 'Browse featured datasets', href: '#datasets' },
        { icon: '💬', label: 'Ask the Hub for evidence and citations', href: '#tools' }
      ]
    },
    icleaned: {
      title: 'Environmental data for livestock decision support',
      desc:  'Exploring how Commons climate and environmental data can support iCLEANED, a decision support tool for assessing the environmental benefits and risks of livestock interventions.',
      icon:  '🐄', name: 'iCLEANED Climate Data Support', sub: 'Sustainable Animal and Aquatic Foods (SAAF) · Climate Action',
      meta:  [{ cls: 'st-idea', label: 'Idea' }, { cls: 'st-champ', label: 'Champion: Emmanuel Mwema (Alliance)' }],
      tags:  ['Livestock interventions', 'Environmental benefits and risks', 'Water and feed data', 'Emissions intensity'],
      links: [
        { icon: '📄', label: 'Download the use-case brief (PDF)', href: BRIEF + 'icleaned-climate-data-support-brief.pdf', external: true },
        { icon: '📊', label: 'Browse featured datasets', href: '#datasets' },
        { icon: '💬', label: 'Ask the Hub for evidence and citations', href: '#tools' }
      ]
    },
    meliaf: {
      title: "Measuring CGIAR's adaptation potential and benefits",
      desc:  "Exploring how Commons climate data, intermediate products and methodological expertise can support the MELIAF Climate Adaptation Activator to measure and track CGIAR's adaptation potential and benefits.",
      icon:  '📈', name: 'MELIAF Adaptation Activator', sub: 'Climate Action',
      meta:  [{ cls: 'st-idea', label: 'Idea' }, { cls: 'st-champ', label: 'Champion: Andreea Nowak (Alliance)' }],
      tags:  ['Adaptation tracking', 'Adaptation metrics', 'Intermediate climate products', 'MEL frameworks'],
      links: [
        { icon: '📄', label: 'Download the use-case brief (PDF)', href: BRIEF + 'meliaf-adaptation-activator-brief.pdf', external: true },
        { icon: '📊', label: 'Browse featured datasets', href: '#datasets' },
        { icon: '💬', label: 'Ask the Hub for evidence and citations', href: '#tools' }
      ]
    },
    mfl: {
      title: 'Climate data for multifunctional landscapes',
      desc:  'Exploring how Commons climate data can support the Multifunctional Landscapes Science Programme, with a focus on digital twins, geospatial intelligence frameworks, and MRV and adaptation tracking.',
      icon:  '🏞️', name: 'MFL Climate Data', sub: 'Multifunctional Landscapes (MFL)',
      meta:  [{ cls: 'st-idea', label: 'Idea' }, { cls: 'st-champ', label: 'Champion: Chris Kettle' }],
      tags:  ['Digital twins', 'Geospatial intelligence', 'MRV', 'Adaptation tracking'],
      links: [
        { icon: '📄', label: 'Download the use-case brief (PDF)', href: BRIEF + 'mfl-climate-data-brief.pdf', external: true },
        { icon: '📊', label: 'Browse featured datasets', href: '#datasets' },
        { icon: '💬', label: 'Ask the Hub for evidence and citations', href: '#tools' }
      ]
    },
    tier2: {
      title: 'Uncertainty estimates for livestock GHG inventories',
      desc:  'Exploring opportunities to apply a CGIAR emissions uncertainty calculator, developed for the Global Methane Hub, to greenhouse gas inventories for livestock systems in Colombia and Nigeria.',
      icon:  '🧮', name: 'Tier 2 Livestock Uncertainty', sub: 'Climate Action',
      meta:  [{ cls: 'st-idea', label: 'Idea' }, { cls: 'st-champ', label: 'Champion: Ciniro Costa Junior (Alliance)' }],
      tags:  ['Tier 2 GHG inventories', 'Emissions uncertainty', 'Livestock systems', 'Colombia and Nigeria'],
      links: [
        { icon: '📄', label: 'Download the use-case brief (PDF)', href: BRIEF + 'tier2-livestock-uncertainty-brief.pdf', external: true },
        { icon: '📊', label: 'Browse featured datasets', href: '#datasets' },
        { icon: '💬', label: 'Ask the Hub for evidence and citations', href: '#tools' }
      ]
    }
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function switchUseCase(btn, key) {
    document.querySelectorAll('.persona-pills .pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const u = useCases[key];
    if (!u) return;
    document.getElementById('heroTitle').textContent = u.title;
    document.getElementById('heroDesc').textContent  = u.desc;
    document.getElementById('pcIcon').textContent    = u.icon;
    document.getElementById('pcName').textContent    = u.name;
    document.getElementById('pcSub').textContent     = u.sub;

    document.getElementById('pcMeta').innerHTML = (u.meta || []).map(m =>
      `<span class="pc-status ${escapeHtml(m.cls)}">${escapeHtml(m.label)}</span>`
    ).join('');

    document.getElementById('pcLinks').innerHTML = u.links.map(l =>
      `<a href="${escapeHtml(l.href)}" class="pc-link"${l.external ? ' target="_blank" rel="noopener"' : ''}>${escapeHtml(l.icon + ' ' + l.label)} <span class="pc-link-arrow">→</span></a>`
    ).join('');

    document.getElementById('heroTags').innerHTML = u.tags.map(t =>
      `<span class="hero-tag" data-tag>${escapeHtml(t)}</span>`
    ).join('');
    bindHeroTags();
  }

  function bindHeroTags() {
    document.querySelectorAll('#heroTags [data-tag]').forEach(el => {
      el.addEventListener('click', () => setSearch(el));
    });
  }

  function setSearch(el) {
    const input = document.getElementById('heroInput');
    input.value = el.textContent;
    activeInput = input;
    input.focus();
    renderPanel(input.value);
  }

  /* ---------- Site search (real, client-side) ----------
   * Indexes what is actually on the page: use cases, dataset cards, linked
   * platforms, news and events, and FAQ entries. No network calls.
   */
  let searchIndex = null;
  let panel = null;
  let activeInput = null;
  let results = [];
  let cursor = -1;

  function buildIndex() {
    const idx = [];

    Object.keys(useCases).forEach(key => {
      if (key === 'all') return;
      const u = useCases[key];
      idx.push({
        title: u.name,
        meta: 'Use case · ' + u.sub,
        text: [u.title, u.desc, (u.tags || []).join(' ')].join(' '),
        kind: 'Use case',
        ucKey: key
      });
    });

    document.querySelectorAll('.dataset-card').forEach(card => {
      const t = card.querySelector('.ds-name');
      const d = card.querySelector('.ds-desc');
      const s = card.querySelector('.ds-source');
      const a = card.querySelector('.ds-btn');
      if (!t) return;
      idx.push({
        title: t.textContent.trim(),
        meta: 'Dataset · ' + (s ? s.textContent.trim() : ''),
        text: d ? d.textContent : '',
        kind: 'Dataset',
        href: a ? a.getAttribute('href') : null,
        external: true
      });
    });

    document.querySelectorAll('.source-pill').forEach(p => {
      const t = p.querySelector('.sp-name');
      const g = p.querySelector('.sp-tag');
      if (!t) return;
      idx.push({
        title: t.textContent.trim(),
        meta: 'Platform · ' + (g ? g.textContent.trim() : ''),
        text: g ? g.textContent : '',
        kind: 'Platform',
        href: p.getAttribute('href'),
        external: true
      });
    });

    document.querySelectorAll('.news-item').forEach(n => {
      const t = n.querySelector('.news-title');
      const s = n.querySelector('.news-source');
      const dt = n.querySelector('.news-date');
      const b = n.querySelector('.news-badge');
      const a = n.querySelector('.news-cta');
      if (!t) return;
      idx.push({
        title: t.textContent.trim(),
        meta: (b ? b.textContent.trim() + ' · ' : '') + (s ? s.textContent.trim() : ''),
        text: (dt ? dt.textContent : '') + ' ' + (s ? s.textContent : ''),
        kind: b ? b.textContent.trim() : 'News',
        href: a ? a.getAttribute('href') : null,
        external: true
      });
    });

    document.querySelectorAll('.faq-item').forEach(f => {
      const q = f.querySelector('.faq-q');
      const a = f.querySelector('.faq-a');
      if (!q) return;
      idx.push({
        title: q.textContent.replace(/\+\s*$/, '').trim(),
        meta: 'Help',
        text: a ? a.textContent : '',
        kind: 'FAQ',
        el: f
      });
    });

    return idx;
  }

  function runSearch(q) {
    if (!searchIndex) searchIndex = buildIndex();
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    const scored = [];
    searchIndex.forEach(item => {
      const title = item.title.toLowerCase();
      const meta = (item.meta || '').toLowerCase();
      const text = (item.text || '').toLowerCase();
      let score = 0;
      const hitAll = tokens.every(tk => {
        let s = 0;
        if (title.indexOf(tk) !== -1) s += 6;
        if (meta.indexOf(tk) !== -1) s += 2;
        if (text.indexOf(tk) !== -1) s += 1;
        if (s && title.indexOf(tk) === 0) s += 3;
        score += s;
        return s > 0;
      });
      if (hitAll) scored.push({ item: item, score: score });
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8).map(s => s.item);
  }

  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.className = 'search-panel';
    panel.id = 'searchPanel';
    panel.setAttribute('role', 'listbox');
    panel.setAttribute('aria-label', 'Search results');
    document.body.appendChild(panel);
    return panel;
  }

  function positionPanel(input) {
    const r = input.getBoundingClientRect();
    const width = Math.max(r.width, 340);
    let left = r.left + window.scrollX;
    const maxLeft = window.scrollX + document.documentElement.clientWidth - width - 12;
    if (left > maxLeft) left = Math.max(window.scrollX + 12, maxLeft);
    panel.style.left = left + 'px';
    panel.style.top = (r.bottom + window.scrollY + 6) + 'px';
    panel.style.width = width + 'px';
  }

  function setExpanded(state) {
    ['heroInput', 'headerSearch'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('aria-expanded', state ? 'true' : 'false');
    });
  }

  function closePanel() {
    if (panel) panel.classList.remove('visible');
    setExpanded(false);
    cursor = -1;
  }

  function renderPanel(q) {
    ensurePanel();
    results = runSearch(q);
    cursor = -1;
    if (!q.trim()) { closePanel(); return; }
    if (!results.length) {
      panel.innerHTML = '<div class="sp-empty">No matches for &ldquo;' + escapeHtml(q) +
        '&rdquo;. Try a dataset, country, platform or use case.</div>';
    } else {
      panel.innerHTML = results.map((r, i) =>
        '<button class="sp-item" type="button" role="option" data-i="' + i + '">' +
          '<span class="sp-kind">' + escapeHtml(r.kind) + '</span>' +
          '<span class="sp-body">' +
            '<span class="sp-title">' + escapeHtml(r.title) + '</span>' +
            '<span class="sp-meta">' + escapeHtml(r.meta || '') + '</span>' +
          '</span>' +
          (r.external ? '<span class="sp-ext" aria-hidden="true">↗</span>' : '') +
        '</button>'
      ).join('');
      panel.querySelectorAll('.sp-item').forEach(btn => {
        btn.addEventListener('mousedown', e => {
          e.preventDefault();
          go(results[parseInt(btn.dataset.i, 10)]);
        });
      });
    }
    positionPanel(activeInput);
    panel.classList.add('visible');
    setExpanded(true);
  }

  function moveCursor(delta) {
    if (!panel || !panel.classList.contains('visible') || !results.length) return;
    const items = panel.querySelectorAll('.sp-item');
    cursor += delta;
    if (cursor < 0) cursor = items.length - 1;
    if (cursor >= items.length) cursor = 0;
    items.forEach((el, i) => el.classList.toggle('active', i === cursor));
    if (items[cursor]) items[cursor].scrollIntoView({ block: 'nearest' });
  }

  function go(item) {
    if (!item) return;
    closePanel();
    if (item.ucKey) {
      const pill = document.querySelector('.persona-pills .pill[data-usecase="' + item.ucKey + '"]');
      if (pill) { switchUseCase(pill, item.ucKey); pill.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      return;
    }
    if (item.el) {
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      item.el.classList.add('open');
      item.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!item.href || item.href === '#') return;
    if (item.href.charAt(0) === '#') {
      const t = document.querySelector(item.href);
      if (t) t.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.open(item.href, '_blank', 'noopener');
  }

  function doSearch() {
    const q = (activeInput && activeInput.value ? activeInput.value : '').trim() ||
              (document.getElementById('heroInput').value || '').trim();
    if (!q) return;
    const r = runSearch(q);
    if (r.length) { go(r[0]); return; }
    // Nothing indexed matches: fall back to Ask the Hub with the query.
    document.getElementById('askInput').value = q;
    document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
  }

  function wireSearchInput(input) {
    if (!input) return;
    input.addEventListener('focus', () => { activeInput = input; });
    input.addEventListener('input', () => { activeInput = input; renderPanel(input.value); });
    input.addEventListener('keydown', e => {
      activeInput = input;
      if (e.key === 'ArrowDown') { e.preventDefault(); moveCursor(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveCursor(-1); }
      else if (e.key === 'Escape') { closePanel(); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (cursor >= 0 && results[cursor]) go(results[cursor]);
        else doSearch();
      }
    });
    input.addEventListener('blur', () => { setTimeout(closePanel, 120); });
  }

  function jumpToAsk() {
    document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
  }

  /* ---------- News tabs ---------- */
  function switchTab(btn, pane) {
    document.querySelectorAll('.news-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.news-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const el = document.getElementById('pane-' + pane);
    if (el) el.classList.add('active');
  }

  /* ---------- Ask the Hub (mock) ---------- */
  const mockAnswers = {
    default: {
      text: 'Kenya faces increasing drought frequency, declining and erratic rainfall, and rising temperatures that threaten maize and bean production. The Arid and Semi-Arid Lands (ASALs), covering over 80% of the country, are particularly at risk. CGIAR evidence points to drought-tolerant variety adoption and index-based insurance as cost-effective adaptation options with strong evidence bases.',
      cite: 'Illustrative sources: African Agriculture Adaptation Atlas (CGIAR), Climate Security Observatory (CGIAR), CGSpace (CGIAR).'
    }
  };

  function prefillAsk(el) {
    document.getElementById('askInput').value = el.textContent;
    askHub();
  }

  function askHub() {
    const q = (document.getElementById('askInput').value || '').trim();
    if (!q) return;
    const el = document.getElementById('askResponse');
    el.innerHTML = '<em style="color:var(--text-3)">Preparing the sample answer…</em>';
    el.classList.add('visible');
    setTimeout(() => {
      const a = mockAnswers.default;
      el.innerHTML = '<p class="ask-demo">Demonstration answer, not a live retrieval. The same sample response is returned for every question.</p>' +
        '<p>' + escapeHtml(a.text) + '</p><p class="cite">📚 ' + escapeHtml(a.cite) + '</p>';
    }, 800);
  }

  /* ---------- FAQ ---------- */
  function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const was = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!was) item.classList.add('open');
  }

  /* ---------- Flyer Builder ----------
   * Still a demonstration: the brief is not generated from live evidence.
   * But it now returns a real sample PDF matching the chosen topic focus,
   * so reviewers can judge the intended format and length.
   */
  const FLYER_SAMPLES = {
    'Climate risks': 'assets/flyers/flyer-sample-climate-risks.pdf',
    'Adaptation options': 'assets/flyers/flyer-sample-adaptation-options.pdf',
    'Food security': 'assets/flyers/flyer-sample-food-security.pdf',
    'Water stress': 'assets/flyers/flyer-sample-water-stress.pdf',
    'Gender and climate': 'assets/flyers/flyer-sample-gender-and-climate.pdf'
  };

  function selText(id) {
    const el = document.getElementById(id);
    if (!el || el.selectedIndex < 0) return '';
    const t = el.options[el.selectedIndex].text;
    return (t.indexOf('Select') === 0) ? '' : t;
  }

  function buildFlyer(btn) {
    const country = selText('flyerCountry');
    const audience = selText('flyerAudience');
    const topic = selText('flyerTopic');
    const length = selText('flyerLength');
    const result = document.getElementById('flyerResult');

    const original = btn.dataset.label || btn.textContent;
    btn.dataset.label = original;
    btn.textContent = 'Generating…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      if (!result) return;

      const href = FLYER_SAMPLES[topic] || FLYER_SAMPLES['Climate risks'];
      const chosen = [country, audience, topic, length].filter(Boolean).join(' · ');
      const matched = !!FLYER_SAMPLES[topic];

      result.innerHTML =
        '<p class="flyer-result-head">Sample brief ready</p>' +
        '<p class="flyer-result-sel">' +
          (chosen ? 'You selected: ' + escapeHtml(chosen) : 'No selections made, showing the default sample.') +
        '</p>' +
        '<a class="uc-btn" href="' + href + '" target="_blank" rel="noopener">📄 Open the sample brief (PDF)</a>' +
        '<p class="flyer-result-note">This is a real PDF showing the intended format and length. ' +
        (matched
          ? 'It matches your topic focus. The country and audience you chose are not yet reflected: '
          : 'It is the climate risks sample. Your selections are not yet reflected: ') +
        'the finished tool will assemble the text from CGIAR evidence for every selection, with ' +
        'inline citations. The narrative in this sample is placeholder text and must not be cited.</p>';
      result.classList.add('visible');
    }, 900);
  }

  /* ---------- Feedback modal ---------- */
  // Set this to the address that should receive reviewer feedback.
  const FEEDBACK_EMAIL = 'j.choptiany@cgiar.org';


  function showFeedbackFallback(plain) {
    const body = document.getElementById('fbForm');
    if (!body) { closeFeedback(); return; }
    const box = document.getElementById('fbFallback');
    if (!box) return;
    document.getElementById('fbFallbackText').value = plain;
    body.style.display = 'none';
    box.style.display = 'block';
  }

  function resetFeedback() {
    const form = document.getElementById('fbForm');
    const box = document.getElementById('fbFallback');
    if (form) form.style.display = '';
    if (box) box.style.display = 'none';
  }

  function copyFeedback(btn) {
    const ta = document.getElementById('fbFallbackText');
    ta.select();
    const done = () => {
      const t = btn.textContent;
      btn.textContent = '✓ Copied';
      setTimeout(() => { btn.textContent = t; }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ta.value).then(done, () => { document.execCommand('copy'); done(); });
    } else {
      document.execCommand('copy');
      done();
    }
  }

  function openFeedback() {
    resetFeedback();
    document.getElementById('feedbackModal').classList.add('visible');
  }
  function closeFeedback() {
    document.getElementById('feedbackModal').classList.remove('visible');
  }
  function sendFeedback(e) {
    e.preventDefault();
    const name    = document.getElementById('fbName').value.trim() || 'Anonymous reviewer';
    const role    = document.getElementById('fbRole').value;
    const section = document.getElementById('fbSection').value;
    const message = document.getElementById('fbMessage').value.trim();
    if (!message) {
      alert('Please add a short comment before sending.');
      return false;
    }
    const subject = encodeURIComponent('CGIAR Climate Commons - feedback from ' + name);
    const body = encodeURIComponent(
      'Reviewer: ' + name + '\n' +
      'Role: ' + role + '\n' +
      'Section: ' + section + '\n\n' +
      'Comment:\n' + message + '\n\n' +
      '(Variant B Medium prototype)'
    );
    const plain =
      'To: ' + FEEDBACK_EMAIL + '\n' +
      'Subject: CGIAR Climate Commons - feedback from ' + name + '\n\n' +
      'Reviewer: ' + name + '\n' +
      'Role: ' + role + '\n' +
      'Section: ' + section + '\n\n' +
      'Comment:\n' + message;

    // Try the mail client, but never assume it worked: some managed and
    // webmail-only machines have no handler and fail silently.
    window.location.href = 'mailto:' + FEEDBACK_EMAIL + '?subject=' + subject + '&body=' + body;
    showFeedbackFallback(plain);
    return false;
  }

  /* ---------- Wire everything up on DOM ready ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    // Use-case pills
    document.querySelectorAll('.persona-pills .pill').forEach(btn => {
      btn.addEventListener('click', () => switchUseCase(btn, btn.dataset.usecase));
    });

    // Hero tag clicks (initial set)
    bindHeroTags();

    // Header Ask the Hub button
    const askBtn = document.getElementById('headerAskBtn');
    if (askBtn) askBtn.addEventListener('click', jumpToAsk);

    // Search: hero and header, both backed by the real index
    const heroInput = document.getElementById('heroInput');
    const headerInput = document.getElementById('headerSearch');
    wireSearchInput(heroInput);
    wireSearchInput(headerInput);
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    if (heroSearchBtn) heroSearchBtn.addEventListener('click', () => {
      activeInput = heroInput; doSearch();
    });
    window.addEventListener('resize', () => { if (activeInput) closePanel(); });
    window.addEventListener('scroll', () => { if (activeInput) closePanel(); }, { passive: true });

    // News tabs
    document.querySelectorAll('.news-tab').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn, btn.dataset.pane));
    });

    // Example questions
    document.querySelectorAll('.example-q').forEach(el => {
      el.addEventListener('click', () => prefillAsk(el));
    });

    // Ask submit
    const askGo = document.getElementById('askGoBtn');
    if (askGo) askGo.addEventListener('click', askHub);
    const askInput = document.getElementById('askInput');
    if (askInput) askInput.addEventListener('keydown', e => { if (e.key === 'Enter') askHub(); });

    // FAQ
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => toggleFaq(btn));
    });

    // Flyer builder
    const flyerBtn = document.getElementById('flyerBuildBtn');
    if (flyerBtn) flyerBtn.addEventListener('click', () => buildFlyer(flyerBtn));

    // Feedback FAB
    const fab = document.getElementById('feedbackFab');
    if (fab) fab.addEventListener('click', openFeedback);
    const fbClose = document.getElementById('fbClose');
    if (fbClose) fbClose.addEventListener('click', closeFeedback);
    const fbForm = document.getElementById('fbForm');
    if (fbForm) fbForm.addEventListener('submit', sendFeedback);
    const fbCopy = document.getElementById('fbCopyBtn');
    if (fbCopy) fbCopy.addEventListener('click', () => copyFeedback(fbCopy));
    const fbDone = document.getElementById('fbDoneBtn');
    if (fbDone) fbDone.addEventListener('click', closeFeedback);
    const fbBg = document.getElementById('feedbackModal');
    if (fbBg) fbBg.addEventListener('click', e => { if (e.target === fbBg) closeFeedback(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFeedback(); });
  });
})();
