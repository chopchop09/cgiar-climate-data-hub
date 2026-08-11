/* CGIAR Climate Hub - shared content model
 * ============================================================================
 * Every entry is either carried over from the v0.2 prototype, where its link had
 * already been checked, or was fetched and read on 10/08/2026 while building this
 * file. Nothing is invented.
 *
 * WHY THE SCHEMA IS WIDE
 * Round 2 of the Mural feedback asked for "complete, high-quality metadata".
 * Honouring that means recording the fields a data user actually needs, and
 * leaving them null where nobody has recorded them rather than filling them in
 * plausibly. Null shows on screen as "not recorded", and the resulting
 * completeness score is a real measurement of the catalogue, not decoration.
 *
 * FIELDS
 *   type        dataset | publication | method | innovation | expert | project | event
 *   provider    the institution that publishes it
 *   resolution  spatial resolution, verbatim from the source
 *   temporal    time coverage, verbatim from the source
 *   cadence     how often it updates
 *   licence     access and reuse conditions
 *   formats     how you get the data
 *   aow         area of work, from the five published on cgiar.org
 *   lens        adaptation | mitigation | cross
 *   geo         region or country label
 *   verified    where the metadata came from, and when
 * ============================================================================ */
window.HUB = (function () {
  'use strict';

  /* The five areas of work, exactly as published on cgiar.org, read 10/08/2026.
     Unlike the theme list in Concept C, this spine is externally verifiable. */
  const AREAS = [
    { id: 'aow1', short: 'Prioritisation & coordination',
      name: 'Prioritisation and Coordination of Climate Action',
      desc: "CGIAR's climate integration and engagement platform, connecting climate research across the organisation to support adaptation and mitigation planning and investment decisions." },
    { id: 'aow2', short: 'Digital advisories & risk',
      name: 'Digital Advisories and Climate Risk Management',
      desc: 'Developing and scaling digital weather and climate advisories, early warning systems, anticipatory action approaches, insurance and other risk management products.' },
    { id: 'aow3', short: 'Locally-led adaptation',
      name: 'Locally-Led Adaptation',
      desc: 'Shifting adaptation decision-making, resources and authority closer to those most affected by climate change.' },
    { id: 'aow4', short: 'Low-emission transitions',
      name: 'Low-Emission Transitions',
      desc: 'Helping stakeholders design pathways to reduce greenhouse gas emissions from food, land and water systems.' },
    { id: 'aow5', short: 'Finance & policy',
      name: 'Finance and Policy for Scaling Solutions',
      desc: 'Developing climate risk analytics and adaptation and mitigation investment cases, and supporting financing mechanisms that direct capital toward climate action.' }
  ];

  /* Programme targets, as published. Used as stated figures, never recomputed. */
  const TARGETS = [
    { figure: '16 million', label: 'smallholder farmers to benefit' },
    { figure: 'USD 15 billion', label: 'in climate finance to be unlocked' },
    { figure: '1 gigaton', label: 'CO2-equivalent reduction by 2030' },
    { figure: '20', label: 'priority countries, across Tier 1 and Tier 2' }
  ];

  const V_HUB   = 'Read from the CGIAR Climate Data Hub, 10/08/2026';
  const V_V02   = 'Carried over from the v0.2 prototype, link checked when that was built';
  const V_SRC   = 'Read from the provider’s own dataset page, 10/08/2026';

  /* ---------- Datasets ---------- */
  const datasets = [
    { id: 'd1', type: 'dataset', kind: 'Geospatial', title: 'African Agriculture Adaptation Atlas',
      provider: 'CGIAR', aow: 'aow1', lens: 'adaptation', geo: 'Africa', year: '2023',
      resolution: 'Country and sub-national', temporal: null, cadence: null,
      licence: 'Set by the source platform', formats: 'Web maps',
      url: 'https://adaptationatlas.cgiar.org/', verified: V_V02,
      blurb: 'Spatial climate risk, adaptation options and food security across Africa.',
      tags: ['adaptation options', 'climate risk', 'food security'] },

    { id: 'd2', type: 'dataset', kind: 'Geospatial', title: 'South Asia Climate Adaptation Atlas (ACASA)',
      provider: 'CIMMYT-BISA', aow: 'aow1', lens: 'adaptation', geo: 'South Asia', year: '2025',
      resolution: 'Sub-district, approximately 25 km²', temporal: null, cadence: null,
      licence: 'Set by the source platform', formats: 'Web maps',
      url: 'https://acasa-bisa.org/', verified: V_V02,
      blurb: 'Climate hazards, vulnerability and expert-validated adaptation options for 15 crops and six livestock species.',
      tags: ['hazards', 'vulnerability', 'adaptation options', 'crops', 'livestock'] },

    { id: 'd3', type: 'dataset', kind: 'Open data portal', title: 'Gardian',
      provider: 'CGIAR', aow: 'aow1', lens: 'cross', geo: 'Global', year: 'Live',
      resolution: null, temporal: null, cadence: 'Continuous',
      licence: 'Varies by record', formats: 'Web search, per-record downloads',
      url: 'https://gardian.cgiar.org/', verified: V_V02,
      blurb: "CGIAR's flagship open data portal: research datasets, publications and project outputs.",
      tags: ['data portal', 'metadata', 'catalogue'] },

    { id: 'd4', type: 'dataset', kind: 'Emissions', title: 'AgMRV',
      provider: 'CGIAR', aow: 'aow4', lens: 'mitigation', geo: 'Global', year: '2024',
      resolution: null, temporal: null, cadence: null,
      licence: 'Set by the source platform', formats: 'Web tools',
      url: 'https://www.agmrv.org/', verified: V_V02,
      blurb: 'Monitoring, reporting and verification for agricultural greenhouse gas emissions, on IPCC-aligned methodology.',
      tags: ['emissions', 'MRV', 'greenhouse gas', 'IPCC'] },

    { id: 'd5', type: 'dataset', kind: 'Monitoring', title: 'South Asia Drought Monitoring System',
      provider: 'IWMI', aow: 'aow2', lens: 'adaptation', geo: 'South Asia', year: 'Live',
      resolution: null, temporal: null, cadence: 'Weekly',
      licence: 'Set by the source platform', formats: 'Web maps',
      url: 'https://www.iwmi.org/data/sadms/', verified: V_V02,
      blurb: 'Near real-time drought monitoring, with drought work expanding in Africa.',
      tags: ['drought', 'monitoring', 'early warning'] },

    { id: 'd6', type: 'dataset', kind: 'Advisory / API', title: 'AgWise',
      provider: 'CGIAR', aow: 'aow2', lens: 'adaptation', geo: 'Africa', year: '2024',
      resolution: 'Location-specific', temporal: null, cadence: null,
      licence: 'Set by the source platform', formats: 'API, GIS',
      url: 'https://agwise.org/', verified: V_V02,
      blurb: 'Location-specific climate-smart agronomic recommendations with API and GIS integration.',
      tags: ['advisories', 'agronomy', 'API', 'decision support'] },

    { id: 'd7', type: 'dataset', kind: 'Geospatial', title: 'MapSPAM',
      provider: 'IFPRI', aow: 'aow1', lens: 'cross', geo: 'Global', year: '2020',
      resolution: '5 arcminute', temporal: null, cadence: null,
      licence: 'Set by the source platform', formats: 'Raster downloads',
      url: 'https://www.mapspam.info/', verified: V_V02,
      blurb: 'Global spatially-explicit crop production surfaces: yield, area and value.',
      tags: ['crops', 'production', 'yield', 'geospatial'] },

    { id: 'd8', type: 'dataset', kind: 'Analysis', title: 'Climate Security Observatory',
      provider: 'CGIAR', aow: 'aow1', lens: 'adaptation', geo: 'Global', year: '2024',
      resolution: 'Country profiles', temporal: null, cadence: null,
      licence: 'Set by the source platform', formats: 'Web profiles',
      url: 'https://cso.cgiar.org/', verified: V_V02,
      blurb: 'Evidence base on the climate, conflict and food security nexus, with country profiles.',
      tags: ['climate security', 'conflict', 'food security', 'country profiles'] },

    { id: 'd9', type: 'dataset', kind: 'Repository', title: 'CGSpace',
      provider: 'CGIAR', aow: 'aow1', lens: 'cross', geo: 'Global', year: 'Live',
      resolution: null, temporal: null, cadence: 'Continuous',
      licence: 'Varies by item; open access repository', formats: 'Web, OAI-PMH',
      url: 'https://cgspace.cgiar.org/', verified: V_V02,
      blurb: 'Open-access institutional repository for CGIAR research outputs, around 150,000 records.',
      tags: ['repository', 'publications', 'open access'] },

    /* ---- Held by the technical Climate Data Hub itself, read 10/08/2026 ---- */
    { id: 'd10', type: 'dataset', kind: 'Geospatial', title: 'MapSPAM 2020, harmonised in the Data Hub',
      provider: 'IFPRI, via the CGIAR Climate Data Hub', aow: 'aow1', lens: 'cross', geo: 'Global', year: '2020',
      resolution: '5 arcminute', temporal: '2020', cadence: 'Static release',
      licence: 'Openly licensed, per Hub policy', formats: 'Analysis-ready, cloud-optimised',
      url: 'https://cgiar-climate-data-hub.github.io/catalog/spam2020/', verified: V_HUB,
      blurb: 'Global spatially-disaggregated crop production statistics for 2020, one of two datasets currently in the Data Hub catalogue.',
      tags: ['crops', 'production', 'geospatial', 'harmonised'] },

    { id: 'd11', type: 'dataset', kind: 'Geospatial', title: 'Gridded Livestock Density 2020 (GLW4)',
      provider: 'FAO, via the CGIAR Climate Data Hub', aow: 'aow4', lens: 'mitigation', geo: 'Global', year: '2020',
      resolution: '5 arcminute', temporal: '2020', cadence: 'Static release',
      licence: 'Openly licensed, per Hub policy', formats: 'Zarr store, streamable',
      url: 'https://cgiar-climate-data-hub.github.io/catalog/glw4-2020/', verified: V_HUB,
      blurb: 'Modelled densities of six livestock species globally. The other of the two datasets currently in the Data Hub catalogue.',
      tags: ['livestock', 'density', 'geospatial', 'emissions'] },

    /* ---- Foundational climate data the programme works from. Metadata read
           from each provider's own dataset page on 10/08/2026. ---- */
    { id: 'd12', type: 'dataset', kind: 'Precipitation', title: 'CHIRPS',
      provider: 'Climate Hazards Center, UC Santa Barbara, with USGS', aow: 'aow2', lens: 'adaptation', geo: '50°S to 50°N', year: 'Live',
      resolution: '0.05°', temporal: '1981 to present', cadence: 'Updated operationally',
      licence: 'Open', formats: 'Gridded rasters',
      url: 'https://www.chc.ucsb.edu/data/chirps', verified: V_SRC,
      blurb: 'Climate Hazards Group InfraRed Precipitation with Station data: a 35-year quasi-global rainfall record blending satellite imagery with station measurements, built for drought early warning.',
      tags: ['rainfall', 'precipitation', 'drought', 'early warning', 'satellite'] },

    { id: 'd13', type: 'dataset', kind: 'Reanalysis', title: 'ERA5',
      provider: 'ECMWF, under the Copernicus Climate Change Service', aow: 'aow2', lens: 'cross', geo: 'Global', year: 'Live',
      resolution: '0.25°, uncertainty at 0.5°', temporal: '1940 to present, hourly', cadence: 'Daily, about 5 days behind real time',
      licence: 'Copernicus licence, free with registration', formats: 'NetCDF, GRIB, CDS API',
      url: 'https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels', verified: V_SRC,
      blurb: 'Fifth-generation ECMWF reanalysis: hourly atmospheric, ocean-wave and land-surface variables, with uncertainty from a 10-member ensemble.',
      tags: ['reanalysis', 'temperature', 'rainfall', 'wind', 'uncertainty'] },

    { id: 'd14', type: 'dataset', kind: 'Agrometeorology', title: 'AgERA5',
      provider: 'Copernicus Climate Change Service, from ERA5', aow: 'aow2', lens: 'adaptation', geo: 'Global', year: 'Live',
      resolution: '0.1°', temporal: '1979 to present, daily', cadence: 'Daily',
      licence: 'Copernicus licence, free with registration', formats: 'NetCDF, CDS API',
      url: 'https://cds.climate.copernicus.eu/datasets/sis-agrometeorological-indicators', verified: V_SRC,
      blurb: 'Daily surface meteorology prepared as input to agricultural and agro-ecological models, topographically corrected and downscaled so users need no preprocessing.',
      tags: ['agrometeorology', 'crop models', 'daily weather', 'downscaled'] }
  ];

  /* ---------- Publications ---------- */
  const publications = [
    { id: 'p1', type: 'publication', kind: 'Journal article', title: 'Expert agreement on key elements of transformational adaptation to climate risks',
      provider: 'Nature Climate Change', author: 'Biesbroek et al.', aow: 'aow3', lens: 'adaptation', geo: 'Global', year: 'February 2026',
      resolution: null, temporal: null, cadence: null, licence: 'Publisher terms', formats: 'Journal article',
      url: 'https://www.nature.com/articles/s41558-025-02548-y', verified: V_V02,
      blurb: 'Expert elicitation on what distinguishes transformational from incremental adaptation.',
      tags: ['transformational adaptation', 'expert elicitation'] },

    { id: 'p2', type: 'publication', kind: 'Flagship report', title: 'Global Food Policy Report 2025: Food policy lessons and priorities for a changing world',
      provider: 'IFPRI, via CGSpace', author: 'IFPRI', aow: 'aow5', lens: 'cross', geo: 'Global', year: 'May 2025',
      resolution: null, temporal: null, cadence: 'Annual', licence: 'Open access', formats: 'PDF',
      url: 'https://cgspace.cgiar.org/items/f4fbb62c-f8df-4734-8a95-2ce35f5f9904', verified: V_V02,
      blurb: "IFPRI's annual assessment of food policy priorities.",
      tags: ['food policy', 'flagship report'] },

    { id: 'p3', type: 'publication', kind: 'Draft paper', title: 'Climate and Environmental Crop Risk Index (CRI)',
      provider: 'CGIAR, via CGSpace', author: 'Breeding for Tomorrow', aow: 'aow1', lens: 'adaptation', geo: 'Global', year: 'Draft',
      resolution: null, temporal: null, cadence: null, licence: 'Open access', formats: 'PDF',
      url: 'https://cgspace.cgiar.org/items/2a1d0acb-2e0c-48fc-8b39-56e5899ba16c', verified: V_V02,
      blurb: 'Describes the crop risk index and its hazard inputs. Its methodology is under audit; read the review before citing it.',
      tags: ['crop risk index', 'hazard inputs', 'breeding prioritisation'] }
  ];

  /* ---------- Methods, manuals, tools and training ---------- */
  const methods = [
    { id: 'm1', type: 'method', kind: 'Tutorial', title: 'Getting started with the Climate Data Hub',
      provider: 'CGIAR Climate Data Hub', aow: 'aow1', lens: 'cross', geo: 'Global', year: '2026',
      duration: '10 minutes', resolution: null, temporal: null, cadence: null,
      licence: 'Open', formats: 'Runnable notebook',
      url: 'https://cgiar-climate-data-hub.github.io/tutorials/getting-started/', verified: V_HUB,
      blurb: 'Find and evaluate a dataset in the catalogue, read a metadata record with confidence, and get data into Python, R or a desktop GIS.',
      tags: ['onboarding', 'metadata', 'Python', 'R', 'GIS'] },

    { id: 'm2', type: 'method', kind: 'Tutorial', title: 'Tropical Livestock Units from GLW4',
      provider: 'CGIAR Climate Data Hub', aow: 'aow4', lens: 'mitigation', geo: 'Global', year: '2026',
      duration: '15 minutes', resolution: null, temporal: null, cadence: null,
      licence: 'Open', formats: 'Runnable notebook',
      url: 'https://cgiar-climate-data-hub.github.io/tutorials/tlu_glw4/', verified: V_HUB,
      blurb: 'Stream GLW4 species densities from the Zarr store, collapse them into one TLU per km² surface using FAO weights, and subset a region without downloading the full cube.',
      tags: ['livestock', 'Zarr', 'TLU', 'subsetting'] },

    { id: 'm3', type: 'method', kind: 'Catalogue', title: 'Climate Data Hub dataset catalogue',
      provider: 'CGIAR Climate Data Hub', aow: 'aow1', lens: 'cross', geo: 'Global', year: 'Live',
      resolution: null, temporal: null, cadence: 'As datasets are contributed',
      licence: 'Openly licensed throughout', formats: 'Web, STAC, analysis-ready cloud-optimised',
      url: 'https://cgiar-climate-data-hub.github.io/catalog/', verified: V_HUB,
      blurb: 'Consistently formatted, openly licensed, ready-to-use datasets, so teams build on each other\'s work instead of starting over. Currently holds two datasets.',
      tags: ['catalogue', 'metadata', 'STAC', 'harmonisation'] },

    { id: 'm4', type: 'method', kind: 'Agent skills', title: 'AI and agent access to the Data Hub',
      provider: 'CGIAR Climate Data Hub', aow: 'aow1', lens: 'cross', geo: 'Global', year: 'Live',
      resolution: null, temporal: null, cadence: null, licence: 'Open', formats: 'Agent skills, machine-callable',
      url: 'https://cgiar-climate-data-hub.github.io/ai/', verified: V_V02,
      blurb: 'Machine-callable access and agent skills usable from Claude, ChatGPT or Gemini today. This is the only working AI route into the Hub.',
      tags: ['AI', 'agents', 'API', 'machine-readable'] },

    { id: 'm5', type: 'method', kind: 'Method review', title: 'GCF climate rationale: data, skills and notebook review',
      provider: 'CGIAR Climate Data Hub', aow: 'aow5', lens: 'adaptation', geo: 'Global', year: '2026',
      resolution: null, temporal: null, cadence: null, licence: 'Open', formats: 'Web review',
      url: 'https://cgiar-climate-data-hub.github.io/use-cases/gcf-preparation-facility/gcf-prep-review.html', verified: V_V02,
      blurb: 'What evidence a Green Climate Fund climate rationale needs, and which datasets and steps produce it.',
      tags: ['GCF', 'climate rationale', 'climate finance', 'evidence'] },

    { id: 'm6', type: 'method', kind: 'Method review', title: 'Crop Risk Index review: data and methods',
      provider: 'CGIAR Climate Data Hub', aow: 'aow1', lens: 'adaptation', geo: 'Global', year: '2026',
      resolution: null, temporal: null, cadence: null, licence: 'Open', formats: 'Web review',
      url: 'https://cgiar-climate-data-hub.github.io/use-cases/b4t/cri-review.html', verified: V_V02,
      blurb: 'Audit of the hazard inputs, scoring logic and prioritisation role of the Breeding for Tomorrow crop risk index.',
      tags: ['crop risk index', 'audit', 'hazard inputs', 'methods'] },

    { id: 'm7', type: 'method', kind: 'MRV methodology', title: 'AgMRV: IPCC-aligned agricultural emissions MRV',
      provider: 'CGIAR', aow: 'aow4', lens: 'mitigation', geo: 'Global', year: '2024',
      resolution: null, temporal: null, cadence: null, licence: 'Set by the source platform', formats: 'Methodology and tooling',
      url: 'https://www.agmrv.org/', verified: V_V02,
      blurb: 'Methodology and tooling for monitoring, reporting and verifying agricultural greenhouse gas emissions.',
      tags: ['MRV', 'emissions', 'IPCC', 'inventories'] },

    { id: 'm8', type: 'method', kind: 'Practice database', title: 'WOCAT global database of sustainable land management practices',
      provider: 'WOCAT; consortium includes Alliance Bioversity-CIAT, ICARDA and FAO', aow: 'aow3', lens: 'cross', geo: '110 countries', year: 'Live',
      resolution: null, temporal: null, cadence: 'Continuous contribution',
      licence: 'Open', formats: 'Web database, factsheets',
      url: 'https://wocat.net/en/database/', verified: 'Read from wocat.net, 10/08/2026',
      blurb: 'Over 2,000 documented practices across 110 countries: 1,499 SLM technologies and 574 approaches, filterable by theme including climate change adaptation, drought mitigation and carbon benefits. Recognised by the UNCCD since 2014.',
      tags: ['sustainable land management', 'practices', 'drought mitigation', 'carbon', 'adaptation'] }
  ];

  /* ---------- Innovation catalogues ---------- */
  const innovations = [
    { id: 'i1', type: 'innovation', kind: 'Technology catalogue', title: 'TAAT e-catalogues',
      provider: 'TAAT, with CGIAR', aow: 'aow3', lens: 'adaptation', geo: 'Africa', year: 'Live',
      resolution: null, temporal: null, cadence: null, licence: 'Set by the source platform', formats: 'Web catalogue',
      url: 'https://e-catalogs.taat-africa.org/', verified: V_V02,
      blurb: 'Proven agricultural technologies for scaling across Africa, by commodity and by value chain stage.',
      tags: ['technologies', 'scaling', 'commodities', 'innovation'] },

    { id: 'i2', type: 'innovation', kind: 'Practice catalogue', title: 'WOCAT sustainable land management database',
      provider: 'WOCAT', aow: 'aow3', lens: 'cross', geo: '110 countries', year: 'Live',
      resolution: null, temporal: null, cadence: 'Continuous contribution', licence: 'Open', formats: 'Web database',
      url: 'https://wocat.net/en/database/', verified: 'Read from wocat.net, 10/08/2026',
      blurb: '1,499 SLM technologies and 574 approaches in a standardised, comparable format, searchable by land use type and by theme.',
      tags: ['land management', 'rangeland restoration', 'practices'] },

    { id: 'i3', type: 'innovation', kind: 'Results dashboard', title: 'CGIAR Results Dashboard',
      provider: 'CGIAR System', aow: 'aow1', lens: 'cross', geo: 'Global', year: 'Live',
      resolution: null, temporal: null, cadence: 'Reporting cycle', licence: 'Open', formats: 'Web dashboard',
      url: 'https://www.cgiar.org/food-security-impact/results-dashboard', verified: 'Fetched 10/08/2026',
      blurb: 'CGIAR-wide reporting on results and innovations. The route to answering whether a given innovation connects to climate.',
      tags: ['results', 'innovations', 'reporting'] }
  ];

  /* ---------- Experts ----------
   * The six use-case champions already published on the v0.2 prototype. NOT a
   * directory: no centre-by-centre list exists and no opt-out process has been
   * agreed. Every surface that shows these says so.
   */
  const experts = [
    { id: 'e1', type: 'expert', kind: 'Use-case champion', title: 'Cesare Scartozzi',
      provider: 'GCF Preparation Facility', aow: 'aow5', lens: 'adaptation', geo: 'Global', year: '',
      url: '', verified: V_V02,
      blurb: 'Climate rationale and climate finance evidence for Green Climate Fund proposals.',
      tags: ['GCF', 'climate finance', 'climate rationale'] },
    { id: 'e2', type: 'expert', kind: 'Use-case champion', title: 'Bert Lenaerts',
      provider: 'IRRI, Breeding for Tomorrow', aow: 'aow1', lens: 'adaptation', geo: 'Global', year: '',
      url: '', verified: V_V02,
      blurb: 'Crop risk indices, hazard inputs and breeding prioritisation.',
      tags: ['crop risk index', 'breeding', 'hazards'] },
    { id: 'e3', type: 'expert', kind: 'Use-case champion', title: 'Emmanuel Mwema',
      provider: 'Alliance Bioversity-CIAT, SAAF', aow: 'aow4', lens: 'mitigation', geo: 'Global', year: '',
      url: '', verified: V_V02,
      blurb: 'Environmental benefits and risks of livestock interventions, iCLEANED decision support.',
      tags: ['livestock', 'environmental assessment', 'decision support'] },
    { id: 'e4', type: 'expert', kind: 'Use-case champion', title: 'Andreea Nowak',
      provider: 'Alliance Bioversity-CIAT, Climate Action', aow: 'aow1', lens: 'adaptation', geo: 'Global', year: '',
      url: '', verified: V_V02,
      blurb: 'Adaptation metrics, adaptation tracking and MEL frameworks.',
      tags: ['adaptation tracking', 'metrics', 'MEL'] },
    { id: 'e5', type: 'expert', kind: 'Use-case champion', title: 'Chris Kettle',
      provider: 'Multifunctional Landscapes', aow: 'aow3', lens: 'cross', geo: 'Global', year: '',
      url: '', verified: V_V02,
      blurb: 'Digital twins, geospatial intelligence frameworks, MRV and adaptation tracking.',
      tags: ['digital twins', 'geospatial', 'MRV', 'landscapes'] },
    { id: 'e6', type: 'expert', kind: 'Use-case champion', title: 'Ciniro Costa Junior',
      provider: 'Alliance Bioversity-CIAT, Climate Action', aow: 'aow4', lens: 'mitigation', geo: 'Colombia, Nigeria', year: '',
      url: '', verified: V_V02,
      blurb: 'Tier 2 greenhouse gas inventories and emissions uncertainty for livestock systems.',
      tags: ['Tier 2 inventories', 'emissions uncertainty', 'livestock'] }
  ];

  /* ---------- Projects, being the use-case portfolio ---------- */
  const projects = [
    { id: 'u1', type: 'project', kind: 'Active development', title: 'GCF Preparation Facility',
      provider: 'Climate Data & Innovations Hub (CACC2)', aow: 'aow5', lens: 'adaptation', geo: 'Global', year: '',
      champion: 'Cesare Scartozzi', url: 'https://cgiar-climate-data-hub.github.io/use-cases/gcf-preparation-facility/gcf-prep-review.html',
      verified: V_V02,
      blurb: 'A climate rationale notebook generating evidence-based climate risk narratives, hazard-exposure tables and statistical summaries for Green Climate Fund proposal writers.',
      needs: ['d12', 'd13', 'd1'],
      tags: ['GCF climate rationale', 'hazard-exposure tables', 'climate trends and projections'] },

    { id: 'u2', type: 'project', kind: 'Active development', title: 'B4T Crop Risk Index (CRI)',
      provider: 'Breeding for Tomorrow', aow: 'aow1', lens: 'adaptation', geo: 'Global', year: '',
      champion: 'Bert Lenaerts (IRRI)', url: 'https://cgiar-climate-data-hub.github.io/use-cases/b4t/cri-review.html',
      verified: V_V02,
      blurb: 'Clarifying, auditing and updating the crop risk index so its hazard inputs, scoring logic and prioritisation role are methodologically defensible.',
      needs: ['d12', 'd13', 'd7', 'p3'],
      tags: ['crop risk index', 'breeding prioritisation', 'climate data audit'] },

    { id: 'u3', type: 'project', kind: 'Active development', title: 'AgWise climate data integration',
      provider: 'Sustainable Farming (SFP)', aow: 'aow2', lens: 'adaptation', geo: 'Africa', year: '',
      champion: '', url: 'https://agwise.org/', verified: V_V02,
      blurb: 'Integrating historical and forecast climate data into the AgWise fertilisation module to support process-based crop model simulations across Africa.',
      needs: ['d14', 'd12', 'd6'],
      tags: ['seasonal climate forecasts', 'process-based crop models', 'decision support'] },

    { id: 'u4', type: 'project', kind: 'Idea', title: 'iCLEANED climate data support',
      provider: 'Sustainable Animal and Aquatic Foods (SAAF)', aow: 'aow4', lens: 'mitigation', geo: 'Global', year: '',
      champion: 'Emmanuel Mwema (Alliance)', url: '', verified: V_V02,
      blurb: 'Exploring how Hub climate and environmental data can support assessment of the environmental benefits and risks of livestock interventions.',
      needs: ['d11', 'd14'],
      tags: ['livestock interventions', 'water and feed data', 'emissions intensity'] },

    { id: 'u5', type: 'project', kind: 'Idea', title: 'MELIAF Adaptation Activator',
      provider: 'Climate Action', aow: 'aow1', lens: 'adaptation', geo: 'Global', year: '',
      champion: 'Andreea Nowak (Alliance)', url: '', verified: V_V02,
      blurb: "Exploring how Hub climate data and methodological expertise can measure and track CGIAR's adaptation potential and benefits.",
      needs: ['d1', 'p1'],
      tags: ['adaptation tracking', 'adaptation metrics', 'MEL frameworks'] },

    { id: 'u6', type: 'project', kind: 'Idea', title: 'MFL climate data',
      provider: 'Multifunctional Landscapes (MFL)', aow: 'aow3', lens: 'cross', geo: 'Global', year: '',
      champion: 'Chris Kettle', url: '', verified: V_V02,
      blurb: 'Exploring how Hub climate data can support digital twins, geospatial intelligence frameworks, and MRV and adaptation tracking.',
      needs: ['d7', 'm8'],
      tags: ['digital twins', 'geospatial intelligence', 'MRV'] },

    { id: 'u7', type: 'project', kind: 'Idea', title: 'Tier 2 livestock uncertainty',
      provider: 'Climate Action', aow: 'aow4', lens: 'mitigation', geo: 'Colombia, Nigeria', year: '',
      champion: 'Ciniro Costa Junior (Alliance)', url: '', verified: V_V02,
      blurb: 'Applying a CGIAR emissions uncertainty calculator, developed for the Global Methane Hub, to livestock greenhouse gas inventories in Colombia and Nigeria.',
      needs: ['d11', 'm7'],
      tags: ['Tier 2 GHG inventories', 'emissions uncertainty', 'livestock systems'] },

    { id: 'u8', type: 'project', kind: 'Idea', title: 'El Niño / ENSO readiness',
      provider: 'Climate Action', aow: 'aow2', lens: 'adaptation', geo: 'Global', year: '',
      champion: '', url: '', verified: V_V02,
      blurb: 'Whether the Hub could bring together ENSO forecasts and seasonal outlooks to support anticipatory action. Floated for discussion; scope not yet defined.',
      needs: ['d13'],
      tags: ['El Niño / ENSO', 'seasonal forecasts', 'anticipatory action'] }
  ];

  /* ---------- News and events ---------- */
  const news = [
    { id: 'n1', type: 'event', kind: 'Funding', title: 'GCF Readiness and Preparatory Support Programme',
      provider: 'Green Climate Fund', aow: 'aow5', lens: 'adaptation', geo: 'Global',
      year: 'Rolling, 2024 to 2027 cycle', when: 'Rolling', url: 'https://www.greenclimate.fund/readiness',
      verified: V_V02, blurb: 'Country-driven climate readiness grants.', tags: ['funding', 'readiness', 'GCF'] },
    { id: 'n2', type: 'event', kind: 'Funding', title: 'Adaptation Fund Climate Innovation Accelerator, Latin America and the Caribbean',
      provider: 'UN CTCN with the Adaptation Fund', aow: 'aow5', lens: 'adaptation', geo: 'Latin America',
      year: 'Deadline 18/08/2026', when: '2026-08-18',
      url: 'https://www.ctc-n.org/whats-happening/news/call-proposals-climate-adaptation-innovation-latin-america-and-caribbean',
      verified: V_V02, blurb: 'Technical assistance for adaptation innovation.', tags: ['funding', 'innovation'] },
    { id: 'n3', type: 'event', kind: 'Funding', title: 'Adaptation Fund Climate Innovation Accelerator, Asia-Pacific',
      provider: 'UN CTCN with the Adaptation Fund', aow: 'aow5', lens: 'adaptation', geo: 'Asia-Pacific',
      year: 'Deadline 07/10/2026', when: '2026-10-07',
      url: 'https://www.ctc-n.org/adaptation-fund-climate-innovation-accelerator',
      verified: V_V02, blurb: 'Technical assistance for adaptation innovation.', tags: ['funding', 'innovation'] },
    { id: 'n4', type: 'event', kind: 'Event', title: 'Africa Food Systems Forum 2026',
      provider: 'AFS Forum, Kigali', aow: 'aow1', lens: 'cross', geo: 'Africa',
      year: '31/08/2026 to 03/09/2026', when: '2026-08-31', url: 'https://afs-forum.org/',
      verified: V_V02, blurb: 'Celebrating 20 years of food systems transformation.', tags: ['conference', 'food systems'] },
    { id: 'n5', type: 'event', kind: 'Event', title: 'UNFCCC Climate Week',
      provider: 'UNFCCC, Baku', aow: 'aow1', lens: 'cross', geo: 'Global',
      year: '07/09/2026 to 11/09/2026', when: '2026-09-07', url: 'https://unfccc.int/topics/climate-weeks',
      verified: V_V02, blurb: 'Regional implementation-focused climate week.', tags: ['conference', 'UNFCCC'] },
    { id: 'n6', type: 'event', kind: 'Event', title: 'COP31, UNFCCC Conference of the Parties',
      provider: 'UNFCCC, Antalya', aow: 'aow5', lens: 'cross', geo: 'Global',
      year: '09/11/2026 to 20/11/2026', when: '2026-11-09', url: 'https://unfccc.int/cop31',
      verified: V_V02, blurb: 'Türkiye and Australia partnership presidency.', tags: ['conference', 'UNFCCC', 'negotiations'] },
    { id: 'n7', type: 'event', kind: 'Call for papers', title: 'Last-Mile Delivery of Agricultural Extension and Climate Advisory Services in Smallholder Settings',
      provider: 'npj Sustainable Agriculture, Nature Portfolio', aow: 'aow2', lens: 'adaptation', geo: 'Global',
      year: 'Deadline 08/04/2027', when: '2027-04-08', url: 'https://www.nature.com/collections/edjbaaacah',
      verified: V_V02, blurb: 'Collection open for submissions.', tags: ['advisories', 'extension', 'call for papers'] },
    { id: 'n8', type: 'event', kind: 'Call for papers', title: 'Extreme Weather Impacts on Sustainable Agriculture',
      provider: 'npj Sustainable Agriculture, Nature Portfolio', aow: 'aow1', lens: 'adaptation', geo: 'Global',
      year: 'Deadline 19/09/2026', when: '2026-09-19', url: 'https://www.nature.com/collections/ddbfigbffa',
      verified: V_V02, blurb: 'Collection open for submissions.', tags: ['extreme weather', 'call for papers'] },
    { id: 'n9', type: 'event', kind: 'Call for papers', title: 'Pathways to Sustainably Achieving Zero Hunger by 2050',
      provider: 'npj Sustainable Agriculture, Nature Portfolio', aow: 'aow1', lens: 'cross', geo: 'Global',
      year: 'Deadline 09/03/2027', when: '2027-03-09', url: 'https://www.nature.com/collections/gebfbbejeg',
      verified: V_V02, blurb: 'Collection open for submissions.', tags: ['zero hunger', 'call for papers'] }
  ];

  const all = [].concat(datasets, publications, methods, innovations, experts, projects, news);
  const byId = {};
  all.forEach(function (i) { byId[i.id] = i; });

  /* ---------- Metadata completeness ----------
   * Round 2 asked for complete, high-quality metadata. This scores each dataset
   * against the fields a data user needs, so the gap is measured rather than
   * asserted. Only applied to datasets: resolution is meaningless for a person.
   */
  const META_FIELDS = ['provider', 'resolution', 'temporal', 'cadence', 'licence', 'formats'];
  function completeness(item) {
    if (item.type !== 'dataset') return null;
    const have = META_FIELDS.filter(function (f) { return item[f]; });
    return { have: have.length, of: META_FIELDS.length,
             missing: META_FIELDS.filter(function (f) { return !item[f]; }) };
  }

  /* ---------- Country profile template, used by Concept A's tier 3 ----------
   * Deliberately unpopulated as to figures. The programme publishes a count of
   * priority countries (20) but not, in what was read on 10/08/2026, the names,
   * and no country-level figures have been compiled. What is real here is the
   * section list, the source layers, and the obstacle against each. Layer names
   * are catalogue ids where one exists, so the links resolve to real entries.
   */
  const profileTemplate = [
    { section: 'Climate trends observed to date',
      layers: ['CHIRPS', 'ERA5'], layerIds: ['d12', 'd13'],
      note: 'Both are in the catalogue with full metadata. Neither is yet wired into this page.' },
    { section: 'Daily weather for crop models',
      layers: ['AgERA5'], layerIds: ['d14'],
      note: 'Topographically corrected and downscaled already, so this is the cheapest section to fill.' },
    { section: 'Projected hazard exposure',
      layers: ['African Agriculture Adaptation Atlas', 'ACASA (South Asia)'], layerIds: ['d1', 'd2'],
      note: 'Atlas coverage is regional. A global profile needs a stated fallback where no atlas exists, and no downscaled projection source is catalogued at all.' },
    { section: 'Crop and livestock systems at risk',
      layers: ['MapSPAM 2020', 'GLW4 livestock density', 'B4T Crop Risk Index'], layerIds: ['d10', 'd11', 'p3'],
      note: 'CRI methodology is under audit; read the method review before citing it.' },
    { section: 'Adaptation options with evidence',
      layers: ['Adaptation Atlas', 'TAAT e-catalogues', 'WOCAT database'], layerIds: ['d1', 'i1', 'i2'],
      note: 'Options exist as catalogue entries. Nothing ranks them for a specific country or farming system.' },
    { section: 'Emissions profile and mitigation potential',
      layers: ['AgMRV', 'Tier 2 uncertainty calculator'], layerIds: ['d4', 'm7'],
      note: 'Sub-national resolution is the gap flagged repeatedly in pod discussion.' },
    { section: 'Who to contact at CGIAR',
      layers: ['Expert directory'], layerIds: [],
      note: 'Directory not compiled. Six champions are listed on this site; the centre-by-centre list is outstanding.' }
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

  function areaById(id) {
    for (var i = 0; i < AREAS.length; i++) if (AREAS[i].id === id) return AREAS[i];
    return null;
  }
  function geoList() {
    const s = {};
    all.forEach(function (i) {
      (i.geo || '').split(',').forEach(function (g) { g = g.trim(); if (g) s[g] = true; });
    });
    return Object.keys(s).sort();
  }
  function providerList() {
    const s = {};
    all.forEach(function (i) { if (i.provider) s[i.provider] = true; });
    return Object.keys(s).sort();
  }
  function tagList() {
    const s = {};
    all.forEach(function (i) { (i.tags || []).forEach(function (t) { s[t] = true; }); });
    return Object.keys(s).sort();
  }

  /* Terms are combined with AND. An earlier OR version returned most of the
     catalogue for "climate finance", which made it look far richer than it is. */
  function search(q) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return all.map(function (item) {
      const area = areaById(item.aow);
      const hay = [item.title, item.blurb, item.provider, item.kind, item.geo,
                   LENS_LABEL[item.lens], (item.tags || []).join(' '), item.champion || '',
                   item.resolution || '', item.temporal || '', area ? area.name : '']
                   .join(' ').toLowerCase();
      let score = 0, allPresent = true;
      terms.forEach(function (t) {
        if (hay.indexOf(t) === -1) { allPresent = false; return; }
        if (item.title.toLowerCase().indexOf(t) > -1) score += 5;
        if ((item.tags || []).join(' ').toLowerCase().indexOf(t) > -1) score += 3;
        score += 1;
      });
      return { item: item, score: allPresent ? score : 0 };
    }).filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .map(function (r) { return r.item; });
  }

  return {
    datasets: datasets, publications: publications, methods: methods,
    innovations: innovations, experts: experts, projects: projects, news: news,
    all: all, byId: byId, AREAS: AREAS, TARGETS: TARGETS,
    profileTemplate: profileTemplate,
    LENS_LABEL: LENS_LABEL, TYPE_LABEL: TYPE_LABEL, TYPE_PLURAL: TYPE_PLURAL,
    META_FIELDS: META_FIELDS, completeness: completeness, areaById: areaById,
    geoList: geoList, providerList: providerList, tagList: tagList, search: search
  };
})();
