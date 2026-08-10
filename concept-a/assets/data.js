/* CGIAR Climate Hub - shared content model
 * ----------------------------------------------------------------------------
 * Every entry below is carried over from the v0.2 prototype, where the link had
 * already been checked, or was verified on 10/08/2026 while building this file.
 * Nothing here is invented. Where a fact could not be confirmed, the entry says
 * so in plain text rather than filling the gap.
 *
 * lens:  'adaptation' | 'mitigation' | 'cross'   (Anton Urfels, 10/08/2026:
 *        adaptation and mitigation should be a thread running through the site,
 *        not a category that appears in some places and not others)
 * geo:   free text region or country label used for the geography facet
 * ----------------------------------------------------------------------------
 */
window.HUB = (function () {
  'use strict';

  /* ---------- Datasets ---------- */
  const datasets = [
    { id: 'd1', type: 'dataset', kind: 'Geospatial', title: 'African Agriculture Adaptation Atlas',
      source: 'CGIAR', year: '2023', lens: 'adaptation', geo: 'Africa',
      url: 'https://adaptationatlas.cgiar.org/',
      blurb: 'Spatial climate risk, adaptation options and food security across Africa at country and sub-national scales.' },
    { id: 'd2', type: 'dataset', kind: 'Geospatial', title: 'South Asia Climate Adaptation Atlas (ACASA)',
      source: 'CIMMYT-BISA', year: '2025', lens: 'adaptation', geo: 'South Asia',
      url: 'https://acasa-bisa.org/',
      blurb: 'Climate hazards, vulnerability and expert-validated adaptation options for 15 crops and six livestock species, at sub-district resolution.' },
    { id: 'd3', type: 'dataset', kind: 'Open data', title: 'Gardian',
      source: 'CGIAR', year: 'Live', lens: 'cross', geo: 'Global',
      url: 'https://gardian.cgiar.org/',
      blurb: "CGIAR's flagship open data portal. Research datasets, publications and project outputs." },
    { id: 'd4', type: 'dataset', kind: 'Emissions', title: 'AgMRV',
      source: 'CGIAR', year: '2024', lens: 'mitigation', geo: 'Global',
      url: 'https://www.agmrv.org/',
      blurb: 'Monitoring, reporting and verification for agricultural greenhouse gas emissions. IPCC-aligned methodology.' },
    { id: 'd5', type: 'dataset', kind: 'Monitoring', title: 'South Asia Drought Monitoring System',
      source: 'IWMI', year: 'Live', lens: 'adaptation', geo: 'South Asia',
      url: 'https://www.iwmi.org/data/sadms/',
      blurb: "IWMI's near real-time drought monitoring, updated weekly, with drought work expanding in Africa." },
    { id: 'd6', type: 'dataset', kind: 'Advisory / API', title: 'AgWise',
      source: 'CGIAR', year: '2024', lens: 'adaptation', geo: 'Africa',
      url: 'https://agwise.org/',
      blurb: 'Location-specific climate-smart agronomic recommendations with API and GIS integration.' },
    { id: 'd7', type: 'dataset', kind: 'Geospatial', title: 'MapSPAM',
      source: 'IFPRI', year: '2020', lens: 'cross', geo: 'Global',
      url: 'https://www.mapspam.info/',
      blurb: 'Global spatially-explicit crop production surfaces (yield, area, value) at 5 arcminute resolution.' },
    { id: 'd8', type: 'dataset', kind: 'Analysis', title: 'Climate Security Observatory',
      source: 'CGIAR', year: '2024', lens: 'adaptation', geo: 'Global',
      url: 'https://cso.cgiar.org/',
      blurb: 'Evidence base on the climate, conflict and food security nexus, with country profiles.' },
    { id: 'd9', type: 'dataset', kind: 'Repository', title: 'CGSpace',
      source: 'CGIAR', year: 'Live', lens: 'cross', geo: 'Global',
      url: 'https://cgspace.cgiar.org/',
      blurb: 'Open-access institutional repository for CGIAR research outputs. Around 150,000 records.' }
  ];

  /* ---------- Publications ---------- */
  const publications = [
    { id: 'p1', type: 'publication', kind: 'Journal article', title: 'Expert agreement on key elements of transformational adaptation to climate risks',
      source: 'Nature Climate Change · Biesbroek et al.', year: 'Feb 2026', lens: 'adaptation', geo: 'Global',
      url: 'https://www.nature.com/articles/s41558-025-02548-y',
      blurb: 'Expert elicitation on what distinguishes transformational from incremental adaptation.' },
    { id: 'p2', type: 'publication', kind: 'Flagship report', title: 'Global Food Policy Report 2025: Food policy lessons and priorities for a changing world',
      source: 'IFPRI · CGSpace', year: 'May 2025', lens: 'cross', geo: 'Global',
      url: 'https://cgspace.cgiar.org/items/f4fbb62c-f8df-4734-8a95-2ce35f5f9904',
      blurb: "IFPRI's annual assessment of food policy priorities." },
    { id: 'p3', type: 'publication', kind: 'Draft paper', title: 'Climate and Environmental Crop Risk Index (CRI)',
      source: 'CGIAR · CGSpace', year: 'Draft', lens: 'adaptation', geo: 'Global',
      url: 'https://cgspace.cgiar.org/items/2a1d0acb-2e0c-48fc-8b39-56e5899ba16c',
      blurb: 'Draft paper from the Breeding for Tomorrow use case, describing the crop risk index and its hazard inputs.' }
  ];

  /* ---------- Methods, manuals and tools ---------- */
  const methods = [
    { id: 'm1', type: 'method', kind: 'Tutorials', title: 'Data Hub runnable tutorials and dataset documentation',
      source: 'CGIAR Climate Data Hub', year: 'Live', lens: 'cross', geo: 'Global',
      url: 'https://cgiar-climate-data-hub.github.io/',
      blurb: 'Notebooks and documentation for working with the catalogue directly.' },
    { id: 'm2', type: 'method', kind: 'Agent skills', title: 'AI and agent access to the Data Hub',
      source: 'CGIAR Climate Data Hub', year: 'Live', lens: 'cross', geo: 'Global',
      url: 'https://cgiar-climate-data-hub.github.io/ai/',
      blurb: 'Machine-callable access and agent skills usable from Claude, ChatGPT or Gemini today.' },
    { id: 'm3', type: 'method', kind: 'Method review', title: 'GCF climate rationale: data, skills and notebook review',
      source: 'CGIAR Climate Data Hub', year: '2026', lens: 'adaptation', geo: 'Global',
      url: 'https://cgiar-climate-data-hub.github.io/use-cases/gcf-preparation-facility/gcf-prep-review.html',
      blurb: 'What evidence a Green Climate Fund climate rationale needs, and which datasets and steps produce it.' },
    { id: 'm4', type: 'method', kind: 'Method review', title: 'Crop Risk Index review: data and methods',
      source: 'CGIAR Climate Data Hub', year: '2026', lens: 'adaptation', geo: 'Global',
      url: 'https://cgiar-climate-data-hub.github.io/use-cases/b4t/cri-review.html',
      blurb: 'Audit of the hazard inputs, scoring logic and prioritisation role of the B4T crop risk index.' },
    { id: 'm5', type: 'method', kind: 'MRV methodology', title: 'AgMRV: IPCC-aligned agricultural emissions MRV',
      source: 'CGIAR', year: '2024', lens: 'mitigation', geo: 'Global',
      url: 'https://www.agmrv.org/',
      blurb: 'Methodology and tooling for monitoring, reporting and verifying agricultural greenhouse gas emissions.' },
    { id: 'm6', type: 'method', kind: 'Practice database', title: 'WOCAT global database of sustainable land management practices',
      source: 'WOCAT · consortium includes Alliance Bioversity-CIAT, ICARDA, FAO', year: 'Live', lens: 'cross', geo: 'Global',
      url: 'https://wocat.net/en/database/',
      blurb: 'Documented SLM technologies and approaches in a standardised comparable format, searchable by land use type and by theme, including climate change adaptation and drought mitigation.' }
  ];

  /* ---------- Innovation catalogues ---------- */
  const innovations = [
    { id: 'i1', type: 'innovation', kind: 'Technology catalogue', title: 'TAAT e-catalogues',
      source: 'TAAT · CGIAR', year: 'Live', lens: 'adaptation', geo: 'Africa',
      url: 'https://e-catalogs.taat-africa.org/',
      blurb: 'Proven agricultural technologies for scaling across Africa, by commodity and by value chain stage.' },
    { id: 'i2', type: 'innovation', kind: 'Practice catalogue', title: 'WOCAT sustainable land management database',
      source: 'WOCAT', year: 'Live', lens: 'cross', geo: 'Global',
      url: 'https://wocat.net/en/database/',
      blurb: 'Over 2,000 documented practices across 110 countries: 1,499 SLM technologies and 574 approaches, filterable by theme including climate change adaptation, drought mitigation and carbon benefits. Recognised by the UNCCD since 2014.' },
    { id: 'i3', type: 'innovation', kind: 'Results dashboard', title: 'CGIAR Results Dashboard',
      source: 'CGIAR System', year: 'Live', lens: 'cross', geo: 'Global',
      url: 'https://www.cgiar.org/food-security-impact/results-dashboard',
      blurb: 'CGIAR-wide reporting on results and innovations. The route to answering whether a given innovation connects to climate.' }
  ];

  /* ---------- Experts ----------
   * These six are the use-case champions already published on the v0.2
   * prototype. They are NOT a directory of CGIAR climate expertise: the
   * centre-by-centre list is still being compiled and no opt-out process
   * exists yet. The UI says so wherever this list appears.
   */
  const experts = [
    { id: 'e1', type: 'expert', kind: 'Use-case champion', title: 'Cesare Scartozzi',
      source: 'GCF Preparation Facility · AoW5-Finance', year: '', lens: 'adaptation', geo: 'Global',
      url: '', blurb: 'Climate rationale and climate finance evidence for Green Climate Fund proposals.' },
    { id: 'e2', type: 'expert', kind: 'Use-case champion', title: 'Bert Lenaerts',
      source: 'IRRI · Breeding for Tomorrow', year: '', lens: 'adaptation', geo: 'Global',
      url: '', blurb: 'Crop risk indices, hazard inputs and breeding prioritisation.' },
    { id: 'e3', type: 'expert', kind: 'Use-case champion', title: 'Emmanuel Mwema',
      source: 'Alliance Bioversity-CIAT · SAAF', year: '', lens: 'mitigation', geo: 'Global',
      url: '', blurb: 'Environmental benefits and risks of livestock interventions, iCLEANED decision support.' },
    { id: 'e4', type: 'expert', kind: 'Use-case champion', title: 'Andreea Nowak',
      source: 'Alliance Bioversity-CIAT · Climate Action', year: '', lens: 'adaptation', geo: 'Global',
      url: '', blurb: 'Adaptation metrics, adaptation tracking and MEL frameworks.' },
    { id: 'e5', type: 'expert', kind: 'Use-case champion', title: 'Chris Kettle',
      source: 'Multifunctional Landscapes', year: '', lens: 'cross', geo: 'Global',
      url: '', blurb: 'Digital twins, geospatial intelligence frameworks, MRV and adaptation tracking.' },
    { id: 'e6', type: 'expert', kind: 'Use-case champion', title: 'Ciniro Costa Junior',
      source: 'Alliance Bioversity-CIAT · Climate Action', year: '', lens: 'mitigation', geo: 'Colombia, Nigeria',
      url: '', blurb: 'Tier 2 greenhouse gas inventories and emissions uncertainty for livestock systems.' }
  ];

  /* ---------- Projects, being the use-case portfolio ---------- */
  const projects = [
    { id: 'u1', type: 'project', kind: 'Active development', title: 'GCF Preparation Facility',
      source: 'Climate Data & Innovations Hub (CACC2) · AoW5-Finance', year: '', lens: 'adaptation', geo: 'Global',
      champion: 'Cesare Scartozzi', url: 'https://cgiar-climate-data-hub.github.io/use-cases/gcf-preparation-facility/gcf-prep-review.html',
      blurb: 'A climate rationale notebook generating evidence-based climate risk narratives, hazard-exposure tables and statistical summaries for Green Climate Fund proposal writers.',
      tags: ['GCF climate rationale', 'Hazard-exposure tables', 'Climate trends and projections'] },
    { id: 'u2', type: 'project', kind: 'Active development', title: 'B4T Crop Risk Index (CRI)',
      source: 'Breeding for Tomorrow', year: '', lens: 'adaptation', geo: 'Global',
      champion: 'Bert Lenaerts (IRRI)', url: 'https://cgiar-climate-data-hub.github.io/use-cases/b4t/cri-review.html',
      blurb: 'Clarifying, auditing and updating the crop risk index so its hazard inputs, scoring logic and prioritisation role are methodologically defensible.',
      tags: ['Crop risk index', 'Breeding prioritisation', 'Climate data audit'] },
    { id: 'u3', type: 'project', kind: 'Active development', title: 'AgWise climate data integration',
      source: 'Sustainable Farming (SFP) · AoW2-Adapt', year: '', lens: 'adaptation', geo: 'Africa',
      champion: '', url: 'https://agwise.org/',
      blurb: 'Integrating historical and forecast climate data into the AgWise fertilisation module to support process-based crop model simulations across Africa.',
      tags: ['Seasonal climate forecasts', 'Process-based crop models', 'Decision support'] },
    { id: 'u4', type: 'project', kind: 'Idea', title: 'iCLEANED climate data support',
      source: 'Sustainable Animal and Aquatic Foods (SAAF) · Climate Action', year: '', lens: 'mitigation', geo: 'Global',
      champion: 'Emmanuel Mwema (Alliance)', url: '',
      blurb: 'Exploring how Hub climate and environmental data can support assessment of the environmental benefits and risks of livestock interventions.',
      tags: ['Livestock interventions', 'Water and feed data', 'Emissions intensity'] },
    { id: 'u5', type: 'project', kind: 'Idea', title: 'MELIAF Adaptation Activator',
      source: 'Climate Action', year: '', lens: 'adaptation', geo: 'Global',
      champion: 'Andreea Nowak (Alliance)', url: '',
      blurb: "Exploring how Hub climate data and methodological expertise can measure and track CGIAR's adaptation potential and benefits.",
      tags: ['Adaptation tracking', 'Adaptation metrics', 'MEL frameworks'] },
    { id: 'u6', type: 'project', kind: 'Idea', title: 'MFL climate data',
      source: 'Multifunctional Landscapes (MFL)', year: '', lens: 'cross', geo: 'Global',
      champion: 'Chris Kettle', url: '',
      blurb: 'Exploring how Hub climate data can support digital twins, geospatial intelligence frameworks, and MRV and adaptation tracking.',
      tags: ['Digital twins', 'Geospatial intelligence', 'MRV'] },
    { id: 'u7', type: 'project', kind: 'Idea', title: 'Tier 2 livestock uncertainty',
      source: 'Climate Action', year: '', lens: 'mitigation', geo: 'Colombia, Nigeria',
      champion: 'Ciniro Costa Junior (Alliance)', url: '',
      blurb: 'Applying a CGIAR emissions uncertainty calculator, developed for the Global Methane Hub, to livestock greenhouse gas inventories in Colombia and Nigeria.',
      tags: ['Tier 2 GHG inventories', 'Emissions uncertainty', 'Livestock systems'] },
    { id: 'u8', type: 'project', kind: 'Idea', title: 'El Niño / ENSO readiness',
      source: 'Climate Action', year: '', lens: 'adaptation', geo: 'Global',
      champion: '', url: '',
      blurb: 'Whether the Hub could bring together ENSO forecasts and seasonal outlooks to support anticipatory action. Floated for discussion; scope not yet defined.',
      tags: ['El Niño / ENSO', 'Seasonal forecasts', 'Anticipatory action'] }
  ];

  /* ---------- News and events ---------- */
  const news = [
    { id: 'n1', type: 'event', kind: 'Funding', title: 'GCF Readiness and Preparatory Support Programme',
      source: 'Green Climate Fund', year: 'Rolling, 2024 to 2027 cycle', lens: 'adaptation', geo: 'Global',
      url: 'https://www.greenclimate.fund/readiness',
      blurb: 'Country-driven climate readiness grants.' },
    { id: 'n2', type: 'event', kind: 'Funding', title: 'Adaptation Fund Climate Innovation Accelerator, Latin America and the Caribbean',
      source: 'UN CTCN · Adaptation Fund', year: 'Deadline 18/08/2026', lens: 'adaptation', geo: 'Latin America',
      url: 'https://www.ctc-n.org/whats-happening/news/call-proposals-climate-adaptation-innovation-latin-america-and-caribbean',
      blurb: 'Technical assistance for adaptation innovation.' },
    { id: 'n3', type: 'event', kind: 'Funding', title: 'Adaptation Fund Climate Innovation Accelerator, Asia-Pacific',
      source: 'UN CTCN · Adaptation Fund', year: 'Deadline 07/10/2026', lens: 'adaptation', geo: 'Asia-Pacific',
      url: 'https://www.ctc-n.org/adaptation-fund-climate-innovation-accelerator',
      blurb: 'Technical assistance for adaptation innovation.' },
    { id: 'n4', type: 'event', kind: 'Event', title: 'Africa Food Systems Forum 2026',
      source: 'AFS Forum · Kigali', year: '31/08/2026 to 03/09/2026', lens: 'cross', geo: 'Africa',
      url: 'https://afs-forum.org/',
      blurb: 'Celebrating 20 years of food systems transformation.' },
    { id: 'n5', type: 'event', kind: 'Event', title: 'UNFCCC Climate Week',
      source: 'UNFCCC · Baku', year: '07/09/2026 to 11/09/2026', lens: 'cross', geo: 'Global',
      url: 'https://unfccc.int/topics/climate-weeks',
      blurb: 'Regional implementation-focused climate week.' },
    { id: 'n6', type: 'event', kind: 'Event', title: 'COP31, UNFCCC Conference of the Parties',
      source: 'UNFCCC · Antalya', year: '09/11/2026 to 20/11/2026', lens: 'cross', geo: 'Global',
      url: 'https://unfccc.int/cop31',
      blurb: 'Türkiye and Australia partnership presidency.' },
    { id: 'n7', type: 'event', kind: 'Call for papers', title: 'Last-Mile Delivery of Agricultural Extension and Climate Advisory Services in Smallholder Settings',
      source: 'npj Sustainable Agriculture · Nature Portfolio', year: 'Deadline 08/04/2027', lens: 'adaptation', geo: 'Global',
      url: 'https://www.nature.com/collections/edjbaaacah',
      blurb: 'Collection open for submissions.' },
    { id: 'n8', type: 'event', kind: 'Call for papers', title: 'Extreme Weather Impacts on Sustainable Agriculture',
      source: 'npj Sustainable Agriculture · Nature Portfolio', year: 'Deadline 19/09/2026', lens: 'adaptation', geo: 'Global',
      url: 'https://www.nature.com/collections/ddbfigbffa',
      blurb: 'Collection open for submissions.' },
    { id: 'n9', type: 'event', kind: 'Call for papers', title: 'Pathways to Sustainably Achieving Zero Hunger by 2050',
      source: 'npj Sustainable Agriculture · Nature Portfolio', year: 'Deadline 09/03/2027', lens: 'cross', geo: 'Global',
      url: 'https://www.nature.com/collections/gebfbbejeg',
      blurb: 'Collection open for submissions.' }
  ];

  const all = [].concat(datasets, publications, methods, innovations, experts, projects, news);

  /* ---------- Country profile template ----------
   * Deliberately unpopulated. The programme publishes a count of priority
   * countries (20 Tier 1, 6 Tier 2) but the names were not confirmed for this
   * prototype, and no country figures have been compiled. The template shows
   * which existing data layers would fill each section, which is real
   * information, without asserting numbers that do not yet exist.
   */
  const profileTemplate = [
    { section: 'Climate trends observed to date',
      layers: ['CHIRPS rainfall', 'ERA5 reanalysis'],
      note: 'Source layers named here are those in routine use across the portfolio. Neither is yet wired into this page.' },
    { section: 'Projected hazard exposure',
      layers: ['African Agriculture Adaptation Atlas', 'ACASA (South Asia)'],
      note: 'Atlas coverage is regional. A global profile would need a stated fallback where no atlas exists.' },
    { section: 'Crop and livestock systems at risk',
      layers: ['MapSPAM', 'B4T Crop Risk Index'],
      note: 'CRI methodology is under audit; see the method review before citing it.' },
    { section: 'Adaptation options with evidence',
      layers: ['Adaptation Atlas', 'TAAT e-catalogues', 'WOCAT database'],
      note: 'Options exist as catalogue entries. Ranking them for a specific country is not currently possible.' },
    { section: 'Emissions profile and mitigation potential',
      layers: ['AgMRV', 'Tier 2 uncertainty calculator'],
      note: 'Sub-national resolution is the gap flagged repeatedly in pod discussion.' },
    { section: 'Who to contact at CGIAR',
      layers: ['Expert directory'],
      note: 'Directory not yet compiled. Champions are listed on this site; the centre-by-centre list is outstanding.' }
  ];

  const LENS_LABEL = { adaptation: 'Adaptation', mitigation: 'Mitigation', cross: 'Cross-cutting' };
  const TYPE_LABEL = {
    dataset: 'Dataset', publication: 'Publication', method: 'Method, manual or tool',
    innovation: 'Innovation catalogue', expert: 'Expert', project: 'Project', event: 'News or event'
  };
  const TYPE_PLURAL = {
    dataset: 'Datasets', publication: 'Publications', method: 'Methods, manuals and tools',
    innovation: 'Innovations', expert: 'Experts', project: 'Projects', event: 'News and events'
  };

  function geoList() {
    const s = new Set();
    all.forEach(function (i) { i.geo.split(',').forEach(function (g) { s.add(g.trim()); }); });
    return Array.from(s).sort();
  }

  /* Plain keyword scoring. No network calls, no index, deliberately simple so
     reviewers can see exactly why something matched.
     Terms are combined with AND, not OR. An earlier OR version returned 29 of the
     44 items for "climate finance", because almost everything here mentions climate,
     which made the result list useless and, worse, made the catalogue look far richer
     than it is. Requiring every term keeps the honest answer visible. */
  function search(q) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return all.map(function (item) {
      const hay = [item.title, item.blurb, item.source, item.kind, item.geo,
                   LENS_LABEL[item.lens], (item.tags || []).join(' '), item.champion || '']
                   .join(' ').toLowerCase();
      let score = 0;
      let allTermsPresent = true;
      terms.forEach(function (t) {
        if (hay.indexOf(t) === -1) { allTermsPresent = false; return; }
        if (item.title.toLowerCase().indexOf(t) > -1) score += 5;
        if ((item.tags || []).join(' ').toLowerCase().indexOf(t) > -1) score += 3;
        score += 1;
      });
      return { item: item, score: allTermsPresent ? score : 0 };
    }).filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .map(function (r) { return r.item; });
  }

  return {
    datasets: datasets, publications: publications, methods: methods,
    innovations: innovations, experts: experts, projects: projects, news: news,
    all: all, profileTemplate: profileTemplate,
    LENS_LABEL: LENS_LABEL, TYPE_LABEL: TYPE_LABEL, TYPE_PLURAL: TYPE_PLURAL,
    geoList: geoList, search: search
  };
})();
