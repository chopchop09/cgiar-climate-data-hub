/* Export the catalogue as migration-ready files for the Drupal build.
 *
 * data.js is a browser file that assigns window.HUB, so it is evaluated here
 * against a minimal window shim rather than parsed. That way the CSVs cannot
 * drift from what the prototype actually renders: both read the same object.
 *
 * Run: node export-migration.mjs
 * Out: v1/migration/*.csv and one JSON
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const HERE = '/tmp/build';
const OUT = path.join(HERE, 'v1', 'migration');
fs.mkdirSync(OUT, { recursive: true });

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(HERE, 'v1/assets/data.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(HERE, 'v1/assets/themes.js'), 'utf8'), sandbox);
const H = sandbox.window.HUB;

function csv(rows, cols) {
  const cell = v => {
    if (v == null) return '';
    const s = Array.isArray(v) ? v.join('; ') : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  return [cols.join(','), ...rows.map(r => cols.map(c => cell(r[c])).join(','))].join('\n') + '\n';
}

/* Drupal field names are spelled out here exactly as the build spec asks for
   them, so the SO team can map column to field without a lookup table. */
const COMMON = ['id', 'title', 'kind', 'provider', 'author', 'year', 'aow', 'aow_name',
                'lens', 'geo', 'licence', 'formats', 'resolution', 'temporal', 'cadence',
                'url', 'blurb', 'tags', 'metadata_recorded', 'metadata_missing', 'verified'];

function flat(i) {
  const a = H.areaById(i.aow);
  const c = H.completeness(i);
  return {
    id: i.id,
    title: i.title,
    kind: i.kind || '',
    provider: i.provider || '',
    author: i.author || '',
    year: i.year || '',
    aow: i.aow || '',
    aow_name: a ? a.name : '',
    lens: i.lens || '',
    geo: i.geo || '',
    licence: i.licence || '',
    formats: i.formats || '',
    resolution: i.resolution || '',
    temporal: i.temporal || '',
    cadence: i.cadence || '',
    url: i.url || '',
    blurb: i.blurb || '',
    tags: i.tags || [],
    metadata_recorded: c ? c.have + '/' + c.of : '',
    metadata_missing: c ? c.missing.join('; ') : '',
    verified: i.verified || ''
  };
}

const SETS = [
  ['climate-hub-datasets.csv', H.datasets],
  ['climate-hub-publications.csv', H.publications],
  ['climate-hub-tools-methods-manuals.csv', H.methods],
  ['climate-hub-innovations.csv', H.innovations],
  ['climate-hub-projects.csv', H.projects],
  ['climate-hub-funding-and-events.csv', H.news],
  ['climate-hub-experts.csv', H.experts]
];

const manifest = [];
for (const [name, set] of SETS) {
  const rows = set.map(flat);
  fs.writeFileSync(path.join(OUT, name), csv(rows, COMMON));
  manifest.push(`${name}: ${rows.length} rows`);
}

/* Taxonomy: areas of work, the only externally verifiable vocabulary */
fs.writeFileSync(path.join(OUT, 'taxonomy-areas-of-work.csv'),
  csv(H.AREAS.map(a => ({ term_id: a.id, name: a.name, short_name: a.short, description: a.desc })),
      ['term_id', 'name', 'short_name', 'description']));
manifest.push(`taxonomy-areas-of-work.csv: ${H.AREAS.length} terms`);

/* Taxonomy: climate action lens */
fs.writeFileSync(path.join(OUT, 'taxonomy-climate-action.csv'),
  csv(Object.keys(H.LENS_LABEL).map(k => ({ term_id: k, name: H.LENS_LABEL[k] })), ['term_id', 'name']));
manifest.push(`taxonomy-climate-action.csv: ${Object.keys(H.LENS_LABEL).length} terms`);

/* Taxonomy: free tags, with a usage count so the SO team can see which are
   load-bearing and which appear once. Unreviewed: these are item keywords, not
   a controlled vocabulary, and the 03/09/2026 plan puts the real taxonomy in V2. */
const tagCount = {};
H.all.forEach(i => (i.tags || []).forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
const tagRows = Object.keys(tagCount).sort((a, b) => tagCount[b] - tagCount[a] || a.localeCompare(b))
  .map(t => ({ name: t, used_by_items: tagCount[t] }));
fs.writeFileSync(path.join(OUT, 'taxonomy-tags-unreviewed.csv'), csv(tagRows, ['name', 'used_by_items']));
manifest.push(`taxonomy-tags-unreviewed.csv: ${tagRows.length} tags, ${tagRows.filter(r => r.used_by_items === 1).length} used once`);

/* Everything, as one JSON, for a migrate source plugin that prefers it */
fs.writeFileSync(path.join(OUT, 'climate-hub-catalogue.json'), JSON.stringify({
  exported: '2026-09-03',
  note: 'CGIAR Climate Hub catalogue, exported from the V1 prototype data model. IITA Internal Use. '
      + 'Fields nobody has recorded are empty strings rather than guesses. '
      + 'metadata_recorded counts how many of six fields are present and is a measurement, not a quality score.',
  areas_of_work: H.AREAS,
  targets: H.TARGETS,
  items: H.all.map(flat)
}, null, 2) + '\n');
manifest.push(`climate-hub-catalogue.json: ${H.all.length} items`);

/* A short readme beside the files, because a CSV with no provenance is a
   liability once it leaves this folder. */
fs.writeFileSync(path.join(OUT, 'README.md'),
`# Migration files, CGIAR Climate Hub V1

Exported 03/09/2026 from the V1 prototype's own data model, so these files and the
prototype cannot disagree: both read \`v1/assets/data.js\`.

**Status:** IITA Internal Use. Not an approved CGIAR dataset.

## Files

${manifest.map(m => '- `' + m.replace(': ', '` — ')).join('\n')}

## Rules that matter when importing

- **Empty means not recorded, never zero and never unknown-but-probably.** Every empty
  cell is a field nobody has recorded. Do not fill them during migration, and do not let
  a default value hide them: the gaps are the reason the completeness badge is worth
  showing.
- **\`metadata_recorded\` counts recorded fields out of six** (provider, resolution,
  temporal, cadence, licence, formats). It is a measurement of the record, not a rating of
  the dataset. It must not be labelled quality anywhere in the interface.
- **\`aow\` is the only controlled vocabulary here.** The five areas of work are published
  on cgiar.org. \`tags\` are item keywords, unreviewed, and roughly a third are used by one
  item only. The 03/09/2026 plan puts the real taxonomy in V2, so import tags as free tags
  and do not present them as a browse structure yet.
- **\`verified\` records where each entry came from and when.** Carry it into the Drupal
  record. A resource hub that cannot say where a metadata value came from is the problem
  this catalogue was built to avoid.
- **No country field.** The programme publishes 20 priority countries as a count, not a
  list, and Nigeria is the only African country named anywhere in the item fields. \`geo\`
  holds region labels as recorded, and must not be promoted to a country facet until
  ingestion is fixed.
`);

console.log(manifest.join('\n'));
console.log('\nwritten to ' + OUT);
