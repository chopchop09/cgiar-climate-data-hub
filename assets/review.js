/* CGIAR Climate Data Hub - in-page review comments
 *
 * A ruttl-style annotation layer, self-contained: no accounts, no backend, no
 * third-party script. A reviewer turns on Comment mode, clicks anywhere on the
 * page, and types a comment. The pin is anchored to the element underneath it,
 * so it survives reflow and returns to the right place on reload.
 *
 * Comments live in this browser's localStorage. They are private to the
 * reviewer until they choose to send them, which is deliberate: the Hub has no
 * server, so nothing is transmitted silently. "Send all" composes an email and
 * always shows the text with a copy button, so a comment cannot be lost when a
 * machine has no mail client registered.
 */
(function () {
  'use strict';

  var STORE = 'cdh-review-comments-v1';
  var EMAIL = 'j.choptiany@cgiar.org';

  var state = { on: false, comments: [], draft: null, openId: null };
  var els = {};

  /* ---------------- storage ---------------- */
  function load() {
    try {
      var raw = localStorage.getItem(STORE);
      state.comments = raw ? JSON.parse(raw) : [];
    } catch (e) { state.comments = []; }
    if (!Array.isArray(state.comments)) state.comments = [];
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state.comments)); } catch (e) {}
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  /* ---------------- anchoring ----------------
   * Store a selector for the element under the click plus the click's position
   * as a fraction of that element's box, so the pin tracks the content rather
   * than absolute page coordinates.
   */
  // CSS.escape is widely supported but not universal, and is absent in some
  // headless environments, so fall back to escaping the unsafe characters.
  function cssEscape(s) {
    if (window.CSS && window.CSS.escape) return window.CSS.escape(s);
    return String(s).replace(/[^a-zA-Z0-9_-]/g, function (c) { return '\\' + c; });
  }

  function selectorFor(el) {
    if (!el || el === document.body || el === document.documentElement) return 'body';
    var parts = [];
    var node = el;
    var depth = 0;
    while (node && node.nodeType === 1 && node !== document.body && depth < 6) {
      var part = node.nodeName.toLowerCase();
      if (node.id) { parts.unshift('#' + cssEscape(node.id)); break; }
      var cls = (node.className && typeof node.className === 'string')
        ? node.className.trim().split(/\s+/).filter(function (c) {
            return c && c.indexOf('cdh-') !== 0;
          })[0]
        : null;
      if (cls) part += '.' + cssEscape(cls);
      var parent = node.parentNode;
      if (parent && parent.nodeType === 1) {
        var same = [];
        for (var i = 0; i < parent.children.length; i++) {
          if (parent.children[i].nodeName === node.nodeName) same.push(parent.children[i]);
        }
        if (same.length > 1) part += ':nth-of-type(' + (same.indexOf(node) + 1) + ')';
      }
      parts.unshift(part);
      node = node.parentNode;
      depth++;
    }
    return parts.join(' > ') || 'body';
  }

  function labelFor(el) {
    if (!el) return 'the page';
    var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (t.length > 60) t = t.slice(0, 57) + '…';
    return t || el.nodeName.toLowerCase();
  }

  function resolve(c) {
    var el = null;
    try { el = document.querySelector(c.sel); } catch (e) { el = null; }
    if (!el) return null;
    var r = el.getBoundingClientRect();
    if (!r.width && !r.height) return null;
    return {
      x: r.left + window.scrollX + r.width * c.fx,
      y: r.top + window.scrollY + r.height * c.fy
    };
  }

  /* ---------------- rendering ---------------- */
  function renderPins() {
    var layer = els.layer;
    layer.innerHTML = '';
    state.comments.forEach(function (c, i) {
      var pos = resolve(c);
      if (!pos) return;
      var pin = document.createElement('button');
      pin.type = 'button';
      pin.className = 'cdh-pin' + (c.resolved ? ' resolved' : '') +
                      (state.openId === c.id ? ' active' : '');
      pin.style.left = pos.x + 'px';
      pin.style.top = pos.y + 'px';
      pin.textContent = String(i + 1);
      pin.title = c.text;
      pin.setAttribute('aria-label', 'Comment ' + (i + 1) + ': ' + c.text);
      pin.addEventListener('click', function (e) {
        e.stopPropagation();
        state.openId = (state.openId === c.id) ? null : c.id;
        openPanel();
        renderPins();
        var row = document.getElementById('cdh-row-' + c.id);
        if (row) row.scrollIntoView({ block: 'nearest' });
      });
      layer.appendChild(pin);
    });
    updateCount();
  }

  function updateCount() {
    var n = state.comments.filter(function (c) { return !c.resolved; }).length;
    els.count.textContent = n;
    els.count.style.display = n ? 'grid' : 'none';
  }

  function renderList() {
    var body = els.list;
    if (!state.comments.length) {
      body.innerHTML = '<p class="cdh-empty">No comments yet. Turn on <strong>Comment mode</strong>, ' +
        'then click any part of the page you want to remark on.</p>';
      return;
    }
    body.innerHTML = state.comments.map(function (c, i) {
      return '<div class="cdh-row' + (c.resolved ? ' resolved' : '') +
             (state.openId === c.id ? ' active' : '') + '" id="cdh-row-' + esc(c.id) + '">' +
        '<div class="cdh-row-head">' +
          '<span class="cdh-num">' + (i + 1) + '</span>' +
          '<span class="cdh-where">' + esc(c.where) + '</span>' +
        '</div>' +
        '<p class="cdh-text">' + esc(c.text) + '</p>' +
        '<div class="cdh-row-actions">' +
          '<button type="button" data-act="go" data-id="' + esc(c.id) + '">Show</button>' +
          '<button type="button" data-act="res" data-id="' + esc(c.id) + '">' +
            (c.resolved ? 'Reopen' : 'Resolve') + '</button>' +
          '<button type="button" data-act="del" data-id="' + esc(c.id) + '">Delete</button>' +
        '</div>' +
      '</div>';
    }).join('');

    Array.prototype.forEach.call(body.querySelectorAll('button[data-act]'), function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.id, act = b.dataset.act;
        var c = state.comments.filter(function (x) { return x.id === id; })[0];
        if (!c) return;
        if (act === 'del') {
          state.comments = state.comments.filter(function (x) { return x.id !== id; });
        } else if (act === 'res') {
          c.resolved = !c.resolved;
        } else if (act === 'go') {
          var pos = resolve(c);
          if (pos) window.scrollTo({ top: Math.max(0, pos.y - window.innerHeight / 2), behavior: 'smooth' });
          state.openId = id;
        }
        save(); renderPins(); renderList();
      });
    });
  }

  /* ---------------- panel ---------------- */
  function openPanel() { els.panel.classList.add('open'); renderList(); }
  function closePanel() { els.panel.classList.remove('open'); }

  /* ---------------- comment mode ---------------- */
  function setMode(on) {
    state.on = on;
    document.body.classList.toggle('cdh-commenting', on);
    els.toggle.classList.toggle('on', on);
    els.toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    els.toggle.querySelector('.cdh-toggle-label').textContent = on ? 'Comment mode on' : 'Comment';
    if (!on) cancelDraft();
  }

  function onPageClick(e) {
    if (!state.on) return;
    if (e.target.closest('.cdh-ui')) return;
    e.preventDefault();
    e.stopPropagation();

    var el = document.elementFromPoint(e.clientX, e.clientY);
    while (el && el.closest && el.closest('.cdh-ui')) el = el.parentNode;
    if (!el || el.nodeType !== 1) el = document.body;

    var r = el.getBoundingClientRect();
    var fx = r.width ? (e.clientX - r.left) / r.width : 0.5;
    var fy = r.height ? (e.clientY - r.top) / r.height : 0.5;

    state.draft = {
      sel: selectorFor(el),
      fx: Math.min(Math.max(fx, 0), 1),
      fy: Math.min(Math.max(fy, 0), 1),
      where: labelFor(el),
      x: e.pageX, y: e.pageY
    };
    showComposer();
  }

  function showComposer() {
    var d = state.draft;
    els.composer.style.left = Math.min(d.x, window.innerWidth + window.scrollX - 330) + 'px';
    els.composer.style.top = d.y + 'px';
    els.composer.classList.add('open');
    els.composerWhere.textContent = d.where;
    els.composerText.value = '';
    setTimeout(function () { els.composerText.focus(); }, 30);
  }

  function cancelDraft() {
    state.draft = null;
    els.composer.classList.remove('open');
  }

  function commitDraft() {
    var d = state.draft;
    if (!d) { cancelDraft(); return; }
    var text = els.composerText.value.trim();
    if (!text) { cancelDraft(); return; }
    state.comments.push({
      id: 'c' + Date.now() + Math.floor(Math.random() * 1000),
      sel: d.sel, fx: d.fx, fy: d.fy, where: d.where,
      text: text, page: location.pathname.split('/').pop() || 'index.html',
      at: new Date().toISOString(), resolved: false
    });
    save();
    cancelDraft();
    renderPins();
    renderList();
  }

  /* ---------------- export ---------------- */
  function asPlainText() {
    var lines = ['Climate Data Hub review comments',
                 'Page: ' + location.href,
                 'Sent: ' + new Date().toLocaleString('en-GB'),
                 'Comments: ' + state.comments.length, ''];
    state.comments.forEach(function (c, i) {
      lines.push((i + 1) + '. [' + (c.resolved ? 'resolved' : 'open') + '] near "' + c.where + '"');
      lines.push('   ' + c.text);
      lines.push('');
    });
    return lines.join('\n');
  }

  function sendAll() {
    if (!state.comments.length) return;
    var plain = asPlainText();
    var subject = encodeURIComponent('Climate Data Hub - ' + state.comments.length + ' review comment' +
                                     (state.comments.length === 1 ? '' : 's'));
    window.location.href = 'mailto:' + EMAIL + '?subject=' + subject + '&body=' + encodeURIComponent(plain);
    els.exportBox.style.display = 'block';
    els.exportText.value = plain;
  }

  function copyAll(btn) {
    var ta = els.exportText;
    if (!ta.value) ta.value = asPlainText();
    els.exportBox.style.display = 'block';
    ta.select();
    var done = function () {
      var t = btn.textContent;
      btn.textContent = '✓ Copied';
      setTimeout(function () { btn.textContent = t; }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ta.value).then(done, function () { document.execCommand('copy'); done(); });
    } else { document.execCommand('copy'); done(); }
  }

  function clearAll() {
    if (!state.comments.length) return;
    if (!window.confirm('Delete all ' + state.comments.length + ' comments on this page? This cannot be undone.')) return;
    state.comments = [];
    state.openId = null;
    save(); renderPins(); renderList();
  }

  /* ---------------- build UI ---------------- */
  function build() {
    var layer = document.createElement('div');
    layer.className = 'cdh-pin-layer cdh-ui';
    document.body.appendChild(layer);

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'cdh-toggle cdh-ui';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.innerHTML = '<span aria-hidden="true">🖈</span> <span class="cdh-toggle-label">Comment</span>' +
                       '<span class="cdh-count" aria-label="open comments">0</span>';
    document.body.appendChild(toggle);

    var composer = document.createElement('div');
    composer.className = 'cdh-composer cdh-ui';
    composer.innerHTML =
      '<p class="cdh-composer-where">near <span></span></p>' +
      '<textarea rows="3" placeholder="What should change here?"></textarea>' +
      '<div class="cdh-composer-actions">' +
        '<button type="button" class="cdh-primary" data-c="save">Add comment</button>' +
        '<button type="button" data-c="cancel">Cancel</button>' +
      '</div>';
    document.body.appendChild(composer);

    var panel = document.createElement('aside');
    panel.className = 'cdh-panel cdh-ui';
    panel.setAttribute('aria-label', 'Review comments');
    panel.innerHTML =
      '<div class="cdh-panel-head">' +
        '<strong>Review comments</strong>' +
        '<button type="button" class="cdh-x" aria-label="Close">×</button>' +
      '</div>' +
      '<p class="cdh-hint">Comments are saved in this browser only. Nothing is sent until you ' +
      'press <strong>Send all</strong>, which opens an email and also shows the text to copy.</p>' +
      '<div class="cdh-list"></div>' +
      '<div class="cdh-panel-foot">' +
        '<button type="button" class="cdh-primary" data-p="send">Send all</button>' +
        '<button type="button" data-p="copy">Copy</button>' +
        '<button type="button" data-p="clear">Clear</button>' +
      '</div>' +
      '<div class="cdh-export"><textarea rows="7" readonly></textarea></div>';
    document.body.appendChild(panel);

    els = {
      layer: layer, toggle: toggle, composer: composer, panel: panel,
      composerWhere: composer.querySelector('.cdh-composer-where span'),
      composerText: composer.querySelector('textarea'),
      list: panel.querySelector('.cdh-list'),
      count: toggle.querySelector('.cdh-count'),
      exportBox: panel.querySelector('.cdh-export'),
      exportText: panel.querySelector('.cdh-export textarea')
    };

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (state.on) { setMode(false); openPanel(); }
      else { setMode(true); openPanel(); }
    });

    composer.addEventListener('click', function (e) { e.stopPropagation(); });
    composer.querySelector('[data-c="save"]').addEventListener('click', commitDraft);
    composer.querySelector('[data-c="cancel"]').addEventListener('click', cancelDraft);
    els.composerText.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commitDraft();
      if (e.key === 'Escape') cancelDraft();
    });

    panel.querySelector('.cdh-x').addEventListener('click', closePanel);
    panel.querySelector('[data-p="send"]').addEventListener('click', sendAll);
    panel.querySelector('[data-p="copy"]').addEventListener('click', function () { copyAll(this); });
    panel.querySelector('[data-p="clear"]').addEventListener('click', clearAll);
    panel.addEventListener('click', function (e) { e.stopPropagation(); });

    document.addEventListener('click', onPageClick, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { cancelDraft(); if (state.on) setMode(false); }
    });

    var t = null;
    function reflow() { clearTimeout(t); t = setTimeout(renderPins, 120); }
    window.addEventListener('resize', reflow);
    window.addEventListener('scroll', reflow, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    load();
    build();
    renderPins();
    renderList();
  });
})();
