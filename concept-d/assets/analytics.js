/* CGIAR Climate Hub - review analytics
 * ============================================================================
 * ONE config block, loaded by every page across the five versions.
 *
 * WHY THIS FILE EXISTS
 * Before 11/08/2026 only the two v0.2 pages carried a tracking snippet. The three
 * concepts carried none, which meant the single most useful number for this review
 * round, how many people opened each version and what they did there, was not
 * being recorded anywhere. This puts the same instrumentation on every page.
 *
 * WHAT IT RECORDS
 * Pageviews, plus three custom events chosen because they answer the questions this
 * review round is actually asking, and because all three fire while the page stays
 * put, which is what makes them reliable:
 *
 *   Version viewed    which of the five a visitor opened. The comparison metric,
 *                     and the way movement between versions is measured.
 *   Search            what someone typed, in Concept A's query tier or B's console.
 *                     This is the "front desk questions" evidence the design
 *                     strategy note lists as outstanding.
 *   Filter used       which facet, and which value. Tells you whether people
 *                     reach for adaptation/mitigation, area of work, or type.
 *   Outbound / file   handled automatically by the Plausible extension script,
 *                     which delays the navigation just long enough to send.
 *
 * WHAT IT DOES NOT RECORD
 * No cookies, no personal data, no IP storage, no cross-site profile. Plausible is
 * cookie-free, which is why the v0.2 site needed no consent banner. Search terms
 * are recorded as typed, so this is not the place to type anything sensitive; the
 * catalogue is public material and the queries are expected to be topic words.
 *
 * IF THE SCRIPT IS BLOCKED
 * Everything degrades silently. track() checks for the queue before calling it, so
 * a blocked or failed loader never throws and never breaks a page.
 *
 * TO CHANGE PROVIDER OR DOMAIN
 * Edit CONFIG below, once. Nothing else references the provider.
 * ========================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    /* Must match the domain registered in the analytics account exactly, with no
       protocol and no trailing slash. If the site moves to a cgiar.org address,
       change this and re-register the domain, or measurement stops silently. */
    domain: 'cgiar-climate-data-hub-lcyq.vercel.app',

    /* 'plausible' or 'none'. Set to 'none' to disable all tracking without
       touching any HTML. */
    provider: 'plausible',

    /* The outbound-links + file-downloads build, so every external link and every
       PDF download is counted without per-link code. */
    src: 'https://plausible.io/js/script.outbound-links.file-downloads.js'
  };

  /* ---------- Loader ---------- */
  if (CONFIG.provider === 'plausible') {
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
    var s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', CONFIG.domain);
    s.src = CONFIG.src;
    document.head.appendChild(s);
  }

  function track(name, props) {
    try {
      if (CONFIG.provider === 'none') return;
      if (typeof window.plausible !== 'function') return;
      window.plausible(name, props ? { props: props } : undefined);
    } catch (e) { /* analytics must never break a page */ }
  }

  /* ---------- Which of the five versions is this? ----------
   * Derived from the path so a new page inherits it automatically. */
  function versionOf() {
    var p = location.pathname;
    if (p.indexOf('/concept-a') > -1) return 'A, layered';
    if (p.indexOf('/concept-b') > -1) return 'B, console';
    if (p.indexOf('/concept-c') > -1) return 'C, GESI-style';
    if (p.indexOf('/concept-d') > -1) return 'D, reviewed reading';
    if (p.indexOf('compare') > -1)    return 'Compare page';
    return 'Current site, v0.2';
  }

  var VERSION = versionOf();
  var PAGE = (location.pathname.split('/').pop() || 'index.html');

  track('Version viewed', { version: VERSION, page: PAGE });

  /* ---------- Public helper, used by each version's own app.js ---------- */
  window.HubTrack = {
    version: VERSION,
    search: function (q) {
      if (!q) return;
      track('Search', { query: String(q).slice(0, 120), version: VERSION });
    },
    filter: function (facet, value) {
      track('Filter used', { facet: String(facet), value: String(value), version: VERSION });
    },
    event: track
  };

  /* ---------- Deliberately NOT tracked: clicks that navigate ----------
   * An earlier version fired a "Navigated" event when someone used the switcher
   * bar, and a "Section opened" event on Concept C's tabs and Concept A's tier
   * map. Both were removed on 11/08/2026 after testing showed the events are
   * frequently lost: the browser unloads the page before the request leaves, so
   * the counts would have been silent undercounts that read like findings.
   *
   * Nothing is lost by dropping them. Every page fires "Version viewed" on
   * arrival, so movement between the five versions is still visible, and
   * Plausible records entry pages and referrers natively.
   */
})();
