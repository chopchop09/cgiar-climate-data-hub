import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/tmp/build/cwork';
const DIR = path.join(ROOT, 'concept-c');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(ROOT, url.endsWith('/') ? url + 'index.html' : url);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('404'); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  res.end(fs.readFileSync(f));
});
await new Promise(r => server.listen(8093, r));
const BASE = 'http://127.0.0.1:8093/concept-c/';
const PAGES = ['index.html', 'resources.html', 'themes.html', 'news.html', 'about.html'];
const WIDTHS = [320, 390, 768, 1024, 1280, 1600];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
const ctx = await browser.newContext();
await ctx.route('**/*', r => r.request().url().includes('127.0.0.1') ? r.continue() : r.abort());
const problems = [], notes = [], outward = new Set();
let blocked = 0;
const page = await ctx.newPage();
page.on('console', m => {
  if (m.type() !== 'error') return;
  if (/net::ERR_FAILED|Failed to load resource/.test(m.text())) { blocked++; return; }
  problems.push(`console error, ${page.url()}: ${m.text()}`);
});
page.on('pageerror', e => problems.push(`page error, ${page.url()}: ${e.message}`));
await page.addInitScript(() => { window.__ev = []; window.plausible = function () { window.__ev.push(Array.from(arguments)); }; });

for (const p of PAGES) {
  await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  const ev = await page.evaluate(() => window.__ev.map(a => JSON.stringify(a)));
  const vv = ev.filter(e => e.includes('Version viewed'));
  if (vv.length !== 1) problems.push(`${p}: ${vv.length} Version viewed events`);
  if (vv.length && !vv[0].includes('C, GESI-style')) problems.push(`${p}: label ${vv[0]}`);
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(80);
    const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    if (r.sw > r.cw + 1) problems.push(`${p} at ${w}px: scrolls sideways, ${r.sw} > ${r.cw}`);
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  const hrefs = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href')));
  for (const h of new Set(hrefs)) {
    if (!h || /^(https?:|mailto:|#)/.test(h)) continue;
    const file = h.split('#')[0].split('?')[0];
    if (!file) continue;
    if (file.startsWith('../')) { outward.add(file); continue; }
    if (!fs.existsSync(path.resolve(DIR, file))) problems.push(`${p}: dead link ${h}`);
  }
  // nothing may point at a removed page or an AI / sign-in service
  const bad = hrefs.filter(h => /front-desk|impact\.html|where-we-work|response-el-nino|experts\.html|ca-os/.test(h || ''));
  if (bad.length) problems.push(`${p}: links to removed components: ${[...new Set(bad)].join(', ')}`);
  const navCount = await page.locator('.ctabs .ctab').count();
  if (navCount !== 7) problems.push(`${p}: ${navCount} nav items, expected 7 (5 pages, Data Hub, Sign in)`);
  const stray = await page.evaluate(() => document.querySelectorAll('.xsw, .proto-bar, .demo, .gap, .gapblock, .pin').length);
  if (stray) problems.push(`${p}: ${stray} review-scaffolding elements remain`);
}

// home
await page.goto(BASE + 'index.html', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(300);
for (const [sel, want] of [['#typecards .typecard', 3], ['#aowList .aowrow', 5], ['#foundational .card', 4], ['#targets .target', 4]]) {
  const n = await page.locator(sel).count(); if (n !== want) problems.push(`home: ${sel} = ${n}, expected ${want}`);
}
const themesShort = await page.locator('#themelistShort .themerow').count(); notes.push(`home: ${themesShort} theme rows`);
const pubs = await page.locator('#latestPubs .row').count(); notes.push(`home: ${pubs} latest publications`);
const cap = (await page.locator('#cap-hero').textContent()).trim(); if (cap.length < 20) problems.push('home: hero credit empty'); notes.push(`hero credit: ${cap.slice(0, 50)}…`);
const typeN = await page.evaluate(() => Array.from(document.querySelectorAll('.typecard-n')).map(e => e.textContent)); notes.push(`doors: ${typeN.join(' / ')}`);
await page.fill('#q', 'drought'); await page.locator('.herosearch button').click(); await page.waitForTimeout(400);
if (!/resources\.html\?q=drought/.test(page.url())) problems.push('home search did not land on resources with ?q=');
notes.push(`after hero search: ${(await page.locator('#rCount').textContent()).trim()}`);

// resources
await page.goto(BASE + 'resources.html', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(300);
notes.push(`resources unfiltered: ${(await page.locator('#rCount').textContent()).trim()}`);
await page.fill('#fq', 'climate finance'); await page.waitForTimeout(450);
notes.push(`"climate finance": ${(await page.locator('#rCount').textContent()).trim()}`);
await page.fill('#fq', 'zzznothing'); await page.waitForTimeout(450);
if (!(await page.locator('.empty').count())) problems.push('resources: empty state missing');
await page.locator('#fReset').click(); await page.waitForTimeout(200);
await page.selectOption('#fType', 'dataset'); await page.waitForTimeout(250);
notes.push(`type=dataset: ${(await page.locator('#rCount').textContent()).trim()}`);
await page.selectOption('#fTheme', '1'); await page.waitForTimeout(250);
notes.push(`plus theme[1]: ${(await page.locator('#rCount').textContent()).trim()}`);
const evs = await page.evaluate(() => window.__ev.filter(a => a[0] === 'Search' || a[0] === 'Filter used').map(a => a[0] + ' ' + JSON.stringify(a[1] && a[1].props)));
notes.push('events: ' + [...new Set(evs)].join(' | '));
if (!evs.some(e => e.startsWith('Search'))) problems.push('resources: no Search event recorded');
if (!evs.some(e => e.startsWith('Filter used'))) problems.push('resources: no Filter used event recorded');
await page.goto(BASE + 'resources.html?type=publication', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(300);
const deep = (await page.locator('#rCount').textContent()).trim(); notes.push(`deep link ?type=publication: ${deep}`);
if (!/^3 /.test(deep)) problems.push(`deep link type filter not applied: "${deep}"`);

// themes, news, about
await page.goto(BASE + 'themes.html', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(300);
const tb = await page.locator('#themeBlocks > *').count(); if (tb < 10) problems.push(`themes: ${tb} blocks`);
await page.goto(BASE + 'news.html', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(300);
const nr = await page.locator('#newsList .newsrow').count(); if (nr !== 9) problems.push(`news: ${nr} rows, expected 9`);
const srcBlank = await page.evaluate(() => Array.from(document.querySelectorAll('.newsrow-src')).filter(e => /·\s*$/.test(e.textContent.trim())).length);
if (srcBlank) problems.push(`news: ${srcBlank} rows with a blank provider`);
await page.goto(BASE + 'about.html', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(300);
const mrows = await page.locator('#measures tr').count(); if (mrows < 5) problems.push(`about: measures table has ${mrows} rows`);
const aow = await page.locator('#aowList .aowrow').count(); if (aow !== 5) problems.push(`about: ${aow} areas`);
notes.push('about measures: ' + (await page.evaluate(() => Array.from(document.querySelectorAll('#measures tr')).map(r => r.textContent.trim().replace(/\s+/g, ' ')).join(' | '))));

// JS off
const ctx2 = await browser.newContext({ javaScriptEnabled: false }); const p2 = await ctx2.newPage();
for (const p of PAGES) { await p2.goto(BASE + p, { waitUntil: 'domcontentloaded' }); const h = await p2.evaluate(() => document.body.innerText.length); if (h < 300) problems.push(`${p}: ${h} chars with JS off`); }
await ctx2.close(); await browser.close(); server.close();

console.log('\n=== NOTES ==='); notes.forEach(n => console.log('  ' + n));
console.log('\n=== BLOCKED THIRD-PARTY (expected) === ' + blocked);
console.log('=== LINKS OUT OF concept-c/ ==='); [...outward].sort().forEach(f => console.log('  ' + f));
console.log('\n=== PROBLEMS: ' + problems.length + ' ==='); problems.forEach(p => console.log('  ! ' + p));
