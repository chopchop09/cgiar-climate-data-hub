# Concept B: the evidence console

One of three design interpretations built on 10/08/2026, circulated alongside the
current v0.2 site as a four-way review set. IITA Internal Use.

**Rebuilt on 11/08/2026** after feedback that B and C looked too alike, and that both
carried too much copy describing what a section would contain instead of containing it.

## The interpretation

The layering described in the 10/08 feedback is our build sequence, not the visitor's
structure. Nobody arrives wanting "the static layer". They arrive with a question and
want the evidence assessed. So B is a console: one query, a persistent facet rail, and
results as a table carrying the metadata a data user actually needs.

## Why it looks nothing like Concept C

B and C previously shared `styles.css` and rendered the same card grid, which is why
they read as siblings. B now loads its own stylesheet **instead of** the shared one:

| | Concept B | Concept C |
|---|---|---|
| Ground | Dark, `#0B1220` | Light, white |
| Results | Sortable metadata table, monospaced values | Editorial cards with a spec list |
| Navigation | None. A facet rail changes the whole surface | Five tabs |
| Typography | Sans for prose, monospace for every value | Serif headings, sans body |
| Imagery | None, beyond the logo | Seven credited photographs |
| Analytics | Coverage matrix and completeness bars | None |
| Organising spine | The five **published** areas of work | Ten **editorial** themes |

That last row is the sharpest difference and it is deliberate. C leads with a spine
invented for the build, because that is what the model does. B leads with the five areas
of work published on cgiar.org, which are externally verifiable. Which spine the group
prefers is a real decision, and the two concepts now put it plainly.

## What is on the page

**The result table.** All 51 catalogued items, with provider, resolution, time coverage,
update cadence, licence and access route. Sortable on any of six columns. Fields nobody
has recorded show as "not recorded" and always sort last, so sorting can never hide a
gap.

**Metadata completeness.** Each dataset is scored against six fields. The current
catalogue averages 4.6 of 6, and 5 of 14 datasets are complete. The five complete ones
are the two in the Data Hub catalogue plus CHIRPS, ERA5 and AgERA5, whose metadata was
read from each provider on 10/08/2026. The nine carried over from the v0.2 prototype are
mostly missing time coverage and update cadence. Round 2 of the Mural feedback asked for
"complete, high-quality metadata"; this measures how far off that is rather than
asserting it.

**Coverage matrix.** The five areas of work against adaptation, mitigation and
cross-cutting, counted from the current selection. Six of the fifteen cells are empty
with no filters applied. That is a real statement about where the catalogued evidence
sits, and it moves as you filter.

**Evidence pack.** Seven sections, filled from the current selection with real
citations, each carrying provider, resolution and coverage so it can be checked. With no
filters it cites 47 sources. It writes no prose and asserts no figures: no country-level
figures have been compiled, and inventing plausible ones would make the prototype
impossible to review honestly. The amber notes are the real limits of the catalogue, for
example that no downscaled projection source is catalogued at all, so nothing here can
support a forward-looking statement.

## Files

```
concept-b/
  index.html          The whole console
  README.md           This file
  assets/
    concept-b.css     Its own stylesheet. Does NOT load the shared one
    data.js           The shared 51-item catalogue
    app.js            Query state, table, analytics, evidence pack
    cgiar-logo.png
```

No build step. Open `index.html` and it works.

## What is real

- All 51 items, their providers and their links.
- Every count, bar, matrix cell, completeness score and citation, computed from the
  catalogue at page load. Nothing is typed into the markup.
- The five areas of work and the four programme figures, read from cgiar.org on
  10/08/2026.
- Metadata for CHIRPS, ERA5, AgERA5, MapSPAM 2020 and GLW4, read from each provider's
  own dataset page on 10/08/2026.
- The query and all three facets, running entirely in the browser. No network calls,
  nothing typed is sent anywhere.

## What is not

- The catalogue is 51 hand-entered items, not CGSpace (around 150,000 records) or
  Gardian. An empty result means the prototype has not catalogued something.
- No country-level figures, and no country selector.
- The six experts are use-case champions, not a directory.
- Terms are combined with AND. An earlier OR version returned most of the catalogue for
  "climate finance", which made it look far richer than it is.

## One thing worth watching in feedback

The console is unapologetically for someone doing the work. If the primary audience is a
ministry official or a climate fund, that may be exactly wrong, and Concept C is the
counter-proposal. If the primary audience is CGIAR scientists and analysts, C's five tabs
of prose will feel like an obstacle. The two concepts no longer split the difference, so
the answer should come out more cleanly than it would have done yesterday.
