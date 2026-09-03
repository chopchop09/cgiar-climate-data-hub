# Migration files, CGIAR Climate Hub V1

Exported 03/09/2026 from the V1 prototype's own data model, so these files and the
prototype cannot disagree: both read `v1/assets/data.js`.

**Status:** IITA Internal Use. Not an approved CGIAR dataset.

## Files

- `climate-hub-datasets.csv` — 14 rows
- `climate-hub-publications.csv` — 3 rows
- `climate-hub-tools-methods-manuals.csv` — 8 rows
- `climate-hub-innovations.csv` — 3 rows
- `climate-hub-projects.csv` — 8 rows
- `climate-hub-funding-and-events.csv` — 9 rows
- `climate-hub-experts.csv` — 6 rows
- `taxonomy-areas-of-work.csv` — 5 terms
- `taxonomy-climate-action.csv` — 3 terms
- `taxonomy-tags-unreviewed.csv` — 119 tags, 86 used once
- `climate-hub-catalogue.json` — 51 items

## Rules that matter when importing

- **Empty means not recorded, never zero and never unknown-but-probably.** Every empty
  cell is a field nobody has recorded. Do not fill them during migration, and do not let
  a default value hide them: the gaps are the reason the completeness badge is worth
  showing.
- **`metadata_recorded` counts recorded fields out of six** (provider, resolution,
  temporal, cadence, licence, formats). It is a measurement of the record, not a rating of
  the dataset. It must not be labelled quality anywhere in the interface.
- **`aow` is the only controlled vocabulary here.** The five areas of work are published
  on cgiar.org. `tags` are item keywords, unreviewed, and roughly a third are used by one
  item only. The 03/09/2026 plan puts the real taxonomy in V2, so import tags as free tags
  and do not present them as a browse structure yet.
- **`verified` records where each entry came from and when.** Carry it into the Drupal
  record. A resource hub that cannot say where a metadata value came from is the problem
  this catalogue was built to avoid.
- **No country field.** The programme publishes 20 priority countries as a count, not a
  list, and Nigeria is the only African country named anywhere in the item fields. `geo`
  holds region labels as recorded, and must not be promoted to a country facet until
  ingestion is fixed.
