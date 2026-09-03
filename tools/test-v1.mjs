import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/tmp/build';
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
               '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(ROOT, url.endsWith('/') ? url + 'index.html' : url);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); res.end('404'); return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  res.end(fs.readFileSync(f));
});
await new Promise(r => server.listen(8099, r));
const BASE = 'http://127.0.0.1:8099/v1/';

const PAGES = ['index.html', 'resources.html', 'areas.html', 'learn.html', 'updates.html',
               'about.html', 'operating-system.html', 'storytelling.html', 'decisions.html'];
const WIDTHS = [320, 390, 768, 1024, 1280, 1600];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext();
// Block every third-party host so nothing is sent anywhere during testing.
await ctx.route('**/*', route => {
  const u = route.request().url();
  if (u.includes('127.0.0.1')) return route.continue();
  return route.abort();
});

const problems = [];
const notes = [];
const events = [];
let blocked = 0;
const outward = new Set();

const page = await ctx.newPage();
page.on('console', m => {
  if (m.type() !== 'error') return;
  // Requests to fonts.googleapis.com and plausible.io are aborted on purpose,
  // so their net::ERR_FAILED lines are the test working, not a page defect.
  if (/net::ERR_FAILED|Failed to load resource/.test(m.text())) { blocked++; return; }
  problems.push(`console error, ${page.url()}: ${m.text()}`);
});
page.on('pageerror', e => problems.push(`page error, ${page.url()}: ${e.message}`));
await page.addInitScript(() => {
  window.__ev = [];
  window.plausible = function () { window.__ev.push(Array.from(arguments)); };
});

for (const p of PAGES) {
  await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(320);

  // version label recorded once per page
  const ev = await page.evaluate(() => window.__ev.map(a => JSON.stringify(a)));
  const vv = ev.filter(e => e.includes('Version viewed'));
  if (vv.length !== 1) problems.push(`${p}: expected 1 "Version viewed" event, got ${vv.length}`);
  if (vv.length && !vv[0].includes('V1, Gender-layout port')) problems.push(`${p}: wrong version label ${vv[0]}`);

  // exactly one analytics loader
  const loaders = await page.locator('script[src*="analytics.js"]').count();
  if (loaders !== 1) problems.push(`${p}: ${loaders} analytics loaders`);

  // overflow at each width
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(90);
    const r = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth
    }));
    if (r.sw > r.cw + 1) problems.push(`${p} at ${w}px: document scrolls sideways, ${r.sw} > ${r.cw}`);
  }
  await page.setViewportSize({ width: 1280, height: 900 });

  // internal links resolve
  const hrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href')));
  for (const h of new Set(hrefs)) {
    if (!h || /^(https?:|mailto:|#)/.test(h)) continue;
    const file = h.split('#')[0].split('?')[0];
    if (!file) continue;
    if (file.startsWith('../')) { outward.add(file); continue; }  // checked against the real repo instead
    const target = path.resolve('/tmp/build/v1', file);
    if (!fs.existsSync(target)) problems.push(`${p}: dead internal link ${h}`);
  }

  // mega menu opens
  const groups = await page.locator('.gnav-group').count();
  if (groups !== 5) problems.push(`${p}: ${groups} nav groups, expected 5`);
  await page.locator('.gnav-group').first().locator('.gnav-top').click();
  const open = await page.locator('.gnav-panel.open').count();
  if (open !== 1) problems.push(`${p}: menu did not open (${open} panels open)`);
  await page.keyboard.press('Escape');

  // pins toggle
  await page.locator('#pinToggle').click();
  const pinsHidden = await page.evaluate(() => document.body.classList.contains('pins-off'));
  if (!pinsHidden) problems.push(`${p}: pin toggle did not hide pins`);
  await page.locator('#pinToggle').click();
}

// ---- home page content ----
await page.goto(BASE + 'index.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(320);
for (const [sel, want] of [['#selection .gcard', 3], ['#areas .garea', 5], ['#startFour .gcard', 4],
                           ['#catNews .gcard', 3], ['#catData .gcard', 3], ['#catTools .gcard', 3],
                           ['#catPubs .gcard', 3]]) {
  const n = await page.locator(sel).count();
  if (n !== want) problems.push(`home: ${sel} rendered ${n}, expected ${want}`);
}
const creditsFilled = await page.evaluate(() =>
  Array.from(document.querySelectorAll('#selection [data-credit]')).every(e => e.textContent.trim().length > 20));
if (!creditsFilled) problems.push('home: a photograph credit is empty');
const heroCap = await page.locator('.ghero-cap').textContent();
notes.push(`hero credit: ${heroCap.trim().slice(0, 60)}...`);
const areaCounts = await page.evaluate(() =>
  Array.from(document.querySelectorAll('.garea-n')).map(e => e.textContent.trim()));
notes.push(`area counts: ${areaCounts.join(' | ')}`);

// reading list
await page.locator('#startFour .fav').first().click();
let listLabel = await page.locator('#listBtn').textContent();
if (!/\(1\)/.test(listLabel)) problems.push(`reading list did not count: "${listLabel}"`);
await page.locator('#listBtn').click();
const panelRows = await page.locator('#listPanel .mini-row').count();
if (panelRows !== 1) problems.push(`reading list panel showed ${panelRows} rows, expected 1`);
await page.locator('#listPanel .closebtn').click();
await page.locator('#startFour .fav').first().click();
listLabel = await page.locator('#listBtn').textContent();
if (/\(/.test(listLabel)) problems.push(`reading list did not clear: "${listLabel}"`);

// ---- find evidence ----
await page.goto(BASE + 'resources.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(300);
const total = await page.locator('#count').textContent();
notes.push(`resources, unfiltered: ${total.trim()}`);
const allRows = await page.locator('.rowitem').count();
if (allRows < 40) problems.push(`resources: only ${allRows} rows before filtering`);

await page.fill('#fq', 'drought');
await page.waitForTimeout(480);
const droughtCount = await page.locator('#count').textContent();
notes.push(`query "drought": ${droughtCount.trim()}`);

await page.fill('#fq', 'climate finance');
await page.waitForTimeout(480);
notes.push(`query "climate finance": ${(await page.locator('#count').textContent()).trim()}`);

await page.fill('#fq', 'zzzznothing');
await page.waitForTimeout(480);
const empty = await page.locator('.rowitem h3').first().textContent();
if (!/Nothing matches/.test(empty)) problems.push('resources: empty state missing');

await page.locator('#freset').click();
await page.waitForTimeout(200);
await page.selectOption('#ftype', 'dataset');
await page.waitForTimeout(250);
notes.push(`filter type=dataset: ${(await page.locator('#count').textContent()).trim()}`);
await page.selectOption('#farea', 'aow5');
await page.waitForTimeout(250);
notes.push(`plus area=aow5: ${(await page.locator('#count').textContent()).trim()}`);

const filterEvents = await page.evaluate(() =>
  window.__ev.filter(a => a[0] === 'Filter used' || a[0] === 'Search')
    .map(a => a[0] + ': ' + JSON.stringify(a[1] && a[1].props)));
events.push(...filterEvents);

// deep link from a query string
await page.goto(BASE + 'resources.html?type=publication', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(300);
const deep = await page.locator('#count').textContent();
notes.push(`deep link ?type=publication: ${deep.trim()}`);
if (!/^3 of/.test(deep.trim())) problems.push(`deep link did not apply the type filter: "${deep.trim()}"`);

// ---- areas page ----
await page.goto(BASE + 'areas.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(300);
const areaSecs = await page.locator('#areaSections .gcat').count();
if (areaSecs !== 5) problems.push(`areas: ${areaSecs} sections, expected 5`);

// ---- learn page ----
await page.goto(BASE + 'learn.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(300);
for (const [sel, min] of [['#tools .gcard', 8], ['#innov .gcard', 3], ['#experts .gcard', 6]]) {
  const n = await page.locator(sel).count();
  if (n < min) problems.push(`learn: ${sel} rendered ${n}, expected at least ${min}`);
}

// ---- updates ----
await page.goto(BASE + 'updates.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(300);
const fund = await page.locator('#funding .gcard').count();
const evs = await page.locator('#events .gcard').count();
const projs = await page.locator('#projects .gcard').count();
notes.push(`updates: ${fund} funding, ${evs} events, ${projs} projects`);
if (fund + evs !== 9) problems.push(`updates: funding + events = ${fund + evs}, expected 9`);
if (projs !== 8) problems.push(`updates: ${projs} projects, expected 8`);

// ---- about, live measurements ----
await page.goto(BASE + 'about.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(300);
const measures = await page.evaluate(() =>
  Array.from(document.querySelectorAll('#measures tr')).map(r =>
    Array.from(r.children).map(c => c.textContent.trim()).join(' = ')));
notes.push('measurements: ' + measures.join(' | '));
if (measures.length < 6) problems.push('about: measurement table incomplete');

// ---- storytelling ----
await page.goto(BASE + 'storytelling.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(320);
const jbtns = await page.locator('.jbtn').count();
if (jbtns !== 4) problems.push(`storytelling: ${jbtns} journey buttons, expected 4`);
const routeOut = [];
for (const label of ['CGIAR scientist', 'Investment audience', 'National partner', 'External researcher']) {
  await page.locator('.jbtn', { hasText: label }).click();
  await page.waitForTimeout(160);
  routeOut.push(label + ' -> ' + (await page.locator('#jout h4').textContent()).trim());
}
notes.push('journeys: ' + routeOut.join(' | '));
const annots = await page.locator('.artwork .annot').count();
if (annots !== 3) problems.push(`storytelling: ${annots} annotations, expected 3`);
// annotations must fall back to a list on a narrow screen
await page.setViewportSize({ width: 390, height: 900 });
await page.waitForTimeout(160);
const listVisible = await page.locator('.annot-list').isVisible();
const overlayVisible = await page.locator('.artwork .annot').first().isVisible();
if (!listVisible || overlayVisible) problems.push('storytelling: annotation fallback did not switch at 390px');
await page.setViewportSize({ width: 1280, height: 900 });

// ---- every page renders with all scripts blocked ----
const ctx2 = await browser.newContext({ javaScriptEnabled: false });
const p2 = await ctx2.newPage();
for (const p of PAGES) {
  await p2.goto(BASE + p, { waitUntil: 'domcontentloaded' });
  const h = await p2.evaluate(() => document.body.innerText.length);
  if (h < 400) problems.push(`${p}: with JavaScript off, only ${h} characters of text render`);
}
await ctx2.close();

await browser.close();
server.close();

console.log('\n=== NOTES ===');
notes.forEach(n => console.log('  ' + n));
console.log('\n=== EVENTS RECORDED (plausible blocked, nothing sent) ===');
[...new Set(events)].forEach(e => console.log('  ' + e));
console.log('\n=== BLOCKED THIRD-PARTY REQUESTS (expected) === ' + blocked);
console.log('=== LINKS OUT OF v1/, verify against the repo ===');
[...outward].sort().forEach(f => console.log('  ' + f));
console.log('\n=== PROBLEMS: ' + problems.length + ' ===');
problems.forEach(p => console.log('  ! ' + p));
