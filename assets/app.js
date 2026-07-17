/* CGIAR Climate Data Hub - Variant B: Medium
 * Front-end interactions
 */

(function () {
  'use strict';

  /* ---------- Use-case switcher ----------
   * Mirrors the CDH use-case portfolio:
   * https://cgiar-climate-data-hub.github.io/use-cases/
   */
  const UC_BASE = 'https://cgiar-climate-data-hub.github.io/use-cases/use-cases/';

  const useCases = {
    all: {
      title: 'Trusted climate data for every CGIAR use case',
      desc:  'The Climate Data Hub curates quality-assured climate and agricultural datasets and links them to the CGIAR use cases they serve. Choose a use case above, or search across everything.',
      icon:  '🗂️', name: 'All use cases', sub: 'CGIAR Climate Data Hub use-case portfolio',
      meta:  [{ cls: 'st-active', label: '3 in active development' }, { cls: 'st-idea', label: '4 ideas' }],
      tags:  ['GCF climate rationale', 'Adaptation options Kenya', 'Rainfall trends Sahel', 'Drought risk East Africa'],
      links: [
        { icon: '🗂️', label: 'View the use-case portfolio', href: 'https://cgiar-climate-data-hub.github.io/use-cases/', external: true },
        { icon: '📊', label: 'Browse featured datasets', href: '#datasets' },
        { icon: '💬', label: 'Ask the Hub for evidence and citations', href: '#tools' }
      ]
    },
    gcf: {
      title: 'Build the climate rationale for your GCF proposal',
      desc:  'A Climate Rationale notebook auto-generating evidence-based climate risk narratives, hazard-exposure tables and statistical summaries for Green Climate Fund proposal writers.',
      icon:  '💼', name: 'GCF Preparation Facility', sub: 'Climate Data & Innovations Hub (CACC2) · AoW5-Finance',
      meta:  [{ cls: 'st-active', label: 'Active development' }, { cls: 'st-champ', label: 'Champion: Cesare Scartozzi' }],
      tags:  ['GCF climate rationale', 'Hazard-exposure tables', 'Climate trends and projections', 'Extreme events'],
      links: [
        { icon: '📄', label: 'View the use-case brief', href: UC_BASE + 'gcf-preparation-facility/', external: true },
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
        { icon: '📄', label: 'View the use-case brief', href: UC_BASE + 'b4t/', external: true },
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
        { icon: '📄', label: 'View the use-case brief', href: UC_BASE + 'agwise/', external: true },
        { icon: '📊', label: 'Browse featured datasets', href: '#datasets' },
        { icon: '💬', label: 'Ask the Hub for evidence and citations', href: '#tools' }
      ]
    },
    icleaned: {
      title: 'Environmental data for livestock decision support',
      desc:  'Exploring how Hub climate and environmental data can support iCLEANED, a decision support tool for assessing the environmental benefits and risks of livestock interventions.',
      icon:  '🐄', name: 'iCLEANED Climate Data Support', sub: 'Sustainable Animal and Aquatic Foods (SAAF) · Climate Action',
      meta:  [{ cls: 'st-idea', label: 'Idea' }, { cls: 'st-champ', label: 'Champion: Emmanuel Mwema (Alliance)' }],
      tags:  ['Livestock interventions', 'Environmental benefits and risks', 'Water and feed data', 'Emissions intensity'],
      links: [
        { icon: '📄', label: 'View the use-case brief', href: UC_BASE + 'icleaned/', external: true },
        { icon: '📊', label: 'Browse featured datasets', href: '#datasets' },
        { icon: '💬', label: 'Ask the Hub for evidence and citations', href: '#tools' }
      ]
    },
    meliaf: {
      title: "Measuring CGIAR's adaptation potential and benefits",
      desc:  "Exploring how Hub climate data, intermediate products and methodological expertise can support the MELIAF Climate Adaptation Activator to measure and track CGIAR's adaptation potential and benefits.",
      icon:  '📈', name: 'MELIAF Adaptation Activator', sub: 'Climate Action',
      meta:  [{ cls: 'st-idea', label: 'Idea' }, { cls: 'st-champ', label: 'Champion: Andreea Nowak (Alliance)' }],
      tags:  ['Adaptation tracking', 'Adaptation metrics', 'Intermediate climate products', 'MEL frameworks'],
      links: [
        { icon: '📄', label: 'View the use-case brief', href: UC_BASE + 'meliaf/', external: true },
        { icon: '📊', label: 'Browse featured datasets', href: '#datasets' },
        { icon: '💬', label: 'Ask the Hub for evidence and citations', href: '#tools' }
      ]
    },
    mfl: {
      title: 'Climate data for multifunctional landscapes',
      desc:  'Exploring how Hub climate data can support the Multifunctional Landscapes Science Programme, with a focus on digital twins, geospatial intelligence frameworks, and MRV and adaptation tracking.',
      icon:  '🏞️', name: 'MFL Climate Data', sub: 'Multifunctional Landscapes (MFL)',
      meta:  [{ cls: 'st-idea', label: 'Idea' }, { cls: 'st-champ', label: 'Champion: Chris Kettle' }],
      tags:  ['Digital twins', 'Geospatial intelligence', 'MRV', 'Adaptation tracking'],
      links: [
        { icon: '📄', label: 'View the use-case brief', href: UC_BASE + 'mfl/', external: true },
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
        { icon: '📄', label: 'View the use-case brief', href: UC_BASE + 'tier2-livestock-uncertainty/', external: true },
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
    document.getElementById('heroInput').value = el.textContent;
  }

  function doSearch() {
    const q = (document.getElementById('heroInput').value || '').trim();
    if (q) {
      document.getElementById('askInput').value = q;
      document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
    }
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
      cite: 'Sources: African Agriculture Adaptation Atlas (CGIAR, 2023), IWMI Drought Monitor, Climate Security Observatory, CGSpace (2024).'
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
    el.innerHTML = '<em style="color:var(--text-3)">Searching CGIAR sources…</em>';
    el.classList.add('visible');
    setTimeout(() => {
      const a = mockAnswers.default;
      el.innerHTML = '<p>' + escapeHtml(a.text) + '</p><p class="cite">📚 ' + escapeHtml(a.cite) + '</p>';
    }, 800);
  }

  /* ---------- FAQ ---------- */
  function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const was = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!was) item.classList.add('open');
  }

  /* ---------- Flyer Builder (mock) ---------- */
  function buildFlyer(btn) {
    const original = btn.textContent;
    btn.textContent = 'Generating…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✓ Draft ready for review';
      btn.style.background = 'var(--green-800)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  }

  /* ---------- Feedback modal ---------- */
  // Set this to the address that should receive reviewer feedback.
  const FEEDBACK_EMAIL = 'j.choptiany@cgiar.org';

  function openFeedback() {
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
    const subject = encodeURIComponent('CGIAR Climate Data Hub - feedback from ' + name);
    const body = encodeURIComponent(
      'Reviewer: ' + name + '\n' +
      'Role: ' + role + '\n' +
      'Section: ' + section + '\n\n' +
      'Comment:\n' + message + '\n\n' +
      '(Variant B Medium prototype)'
    );
    window.location.href = 'mailto:' + FEEDBACK_EMAIL + '?subject=' + subject + '&body=' + body;
    closeFeedback();
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

    // Hero search
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    if (heroSearchBtn) heroSearchBtn.addEventListener('click', doSearch);
    const heroInput = document.getElementById('heroInput');
    if (heroInput) heroInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

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
    const fbBg = document.getElementById('feedbackModal');
    if (fbBg) fbBg.addEventListener('click', e => { if (e.target === fbBg) closeFeedback(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFeedback(); });
  });
})();
