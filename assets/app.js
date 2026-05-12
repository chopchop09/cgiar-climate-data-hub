/* CGIAR Climate Data Hub - Variant B: Medium
 * Front-end interactions
 */

(function () {
  'use strict';

  /* ---------- Persona switcher ---------- */
  const personas = {
    finance: {
      title: 'Find climate evidence for your GCF proposal',
      desc:  "Access country risk data, adaptation evidence and CGIAR-reviewed citations. Build a shareable brief in minutes, powered by the world's largest agricultural research network.",
      icon:  '💼', name: 'Climate Finance Author', sub: 'GCF, Adaptation Fund, bilateral donors',
      tags:  ['GCF climate rationale', 'Adaptation options Kenya', 'Rainfall trends Sahel', 'Drought risk East Africa'],
      links: ['📊 Country climate risk summary', '📄 Build a country brief (Flyer Builder)', '💬 Ask the Hub for evidence and citations']
    },
    scientist: {
      title: 'Explore geospatial data, APIs and STAC catalogues',
      desc:  'Fast discovery of model outputs, gridded datasets and machine-readable catalogues. STAC-aligned metadata, API access and direct download where available.',
      icon:  '🔬', name: 'Scientist / Modeller', sub: 'CGIAR centres, universities, research institutes',
      tags:  ['STAC catalogue Africa', 'MapSPAM API', 'AgWise geospatial layer', 'Climate model outputs'],
      links: ['🗂️ Browse STAC catalogue', '⚙️ API endpoints and documentation', '🗺️ Geospatial layer explorer']
    },
    policy: {
      title: 'National climate insights for decision-makers',
      desc:  'Digestible summaries of climate risks, adaptation priorities and NAP-relevant data. One-page ministerial briefs available for most countries.',
      icon:  '🏛️', name: 'Policymaker / Negotiator', sub: 'Ministries, UNFCCC delegations, regional bodies',
      tags:  ['NAP data Ethiopia', 'National climate risk profiles', 'Adaptation priorities Sahel', 'UNFCCC NDC evidence'],
      links: ['🌍 National climate dashboards', '📋 One-page ministerial briefs', '📑 NAP-aligned datasets']
    },
    public: {
      title: 'Climate facts, explained in plain English',
      desc:  'Ask any question and get a clear, sourced answer. No technical knowledge required: the Hub guides you to the right information.',
      icon:  '📰', name: 'Public / Media', sub: 'Journalists, civil society, interested public',
      tags:  ['What is climate change?', 'Food and climate', 'Africa drought explained', 'Ask me anything'],
      links: ['💬 Ask the Hub (Q&A)', '📖 Plain-language explainers', '📷 Shareable infographics']
    }
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function switchPersona(btn, key) {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const p = personas[key];
    if (!p) return;
    document.getElementById('heroTitle').textContent = p.title;
    document.getElementById('heroDesc').textContent  = p.desc;
    document.getElementById('pcIcon').textContent    = p.icon;
    document.getElementById('pcName').textContent    = p.name;
    document.getElementById('pcSub').textContent     = p.sub;

    document.getElementById('pcLinks').innerHTML = p.links.map(l =>
      `<a href="#" class="pc-link">${escapeHtml(l)} <span class="pc-link-arrow">→</span></a>`
    ).join('');

    document.getElementById('heroTags').innerHTML = p.tags.map(t =>
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
    // Persona pills
    document.querySelectorAll('.persona-pills .pill').forEach(btn => {
      btn.addEventListener('click', () => switchPersona(btn, btn.dataset.persona));
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
