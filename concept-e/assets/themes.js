/* CGIAR Climate Hub - Concept C only: the GESI-style theme spine
 * ============================================================================
 * Kept in its own file, loaded after data.js. It used to live appended to the end
 * of data.js, which meant that copying the shared catalogue over the top silently
 * deleted it and broke every page. Separate file, no such failure mode.
 *
 * gender.cgiar.org organises everything under ten named research themes, each with
 * sub-topics beneath it. Concept C mirrors that.
 *
 * These ten are an EDITORIAL GROUPING built from the tags on the catalogued items,
 * and every page that shows them says so. No climate-terms taxonomy exists yet.
 *
 * Worth noting the contrast with window.HUB.AREAS in data.js, which IS externally
 * verifiable: the five areas of work as published on cgiar.org. Concept C leads
 * with the unverifiable spine because that is what the model does, and shows the
 * published one further down. Concept B leads with the published one. That
 * difference is part of what these prototypes are testing.
 * ========================================================================== */
(function () {
  'use strict';
  const H = window.HUB;

  H.themes = [
    { name: 'Climate risk and hazards',
      sub: ['hazard exposure', 'extreme events', 'climate trends and projections', 'risk screening'],
      match: ['hazard', 'risk', 'extreme', 'trend', 'projection'] },
    { name: 'Water and drought',
      sub: ['drought monitoring', 'water stress', 'rainfall variability', 'irrigation'],
      match: ['drought', 'water', 'rainfall', 'irrigation', 'precipitation'] },
    { name: 'Crops and breeding',
      sub: ['crop risk indices', 'breeding prioritisation', 'crop models', 'yield surfaces'],
      match: ['crop', 'breeding', 'yield', 'agronomy'] },
    { name: 'Livestock and aquatic foods',
      sub: ['livestock systems', 'emissions intensity', 'feed and water', 'fisheries'],
      match: ['livestock', 'fish', 'feed', 'aquatic', 'tlu'] },
    { name: 'Mitigation and emissions',
      sub: ['greenhouse gas inventories', 'MRV', 'emission factors', 'uncertainty'],
      match: ['emission', 'mitigation', 'mrv', 'greenhouse', 'methane', 'ghg', 'carbon'] },
    { name: 'Seasonal forecasts and advisories',
      sub: ['seasonal to subseasonal forecasts', 'ENSO', 'anticipatory action', 'agroclimate advisories'],
      match: ['forecast', 'enso', 'niño', 'nino', 'advisor', 'anticipatory', 'seasonal', 'early warning'] },
    { name: 'Climate finance and policy',
      sub: ['GCF climate rationale', 'readiness funding', 'investment targeting', 'negotiations'],
      match: ['gcf', 'finance', 'funding', 'policy', 'readiness', 'negotiation', 'investment'] },
    { name: 'Adaptation options and tracking',
      sub: ['adaptation options', 'adaptation metrics', 'adaptation tracking', 'MEL frameworks'],
      match: ['adaptation', 'tracking', 'mel', 'metric'] },
    { name: 'Landscapes and biodiversity',
      sub: ['multifunctional landscapes', 'geospatial intelligence', 'digital twins', 'land management'],
      match: ['landscape', 'geospatial', 'digital twin', 'land management', 'biodivers', 'practices'] },
    { name: 'Data, methods and standards',
      sub: ['metadata and catalogues', 'runnable tutorials', 'agent and API access', 'analytical pipelines'],
      match: ['metadata', 'catalogue', 'tutorial', 'agent', 'api', 'method', 'standard', 'data portal',
              'reanalysis', 'harmonised', 'onboarding', 'repository'] }
  ];

  /* Substring match over the same fields the site search uses, so any count on
     screen can be reproduced by searching for the term. */
  H.themeItems = function (theme) {
    return H.all.filter(function (i) {
      var hay = [i.title, i.blurb, i.kind, i.provider, (i.tags || []).join(' ')].join(' ').toLowerCase();
      return theme.match.some(function (m) { return hay.indexOf(m) > -1; });
    });
  };

  /* The four routes gender.cgiar.org offers as "your preferred vantage point",
     each pointing at the resource types this catalogue actually holds. */
  H.vantage = [
    { label: 'Stories of change', href: '',
      desc: 'How climate research reaches decisions and, eventually, fields.',
      types: [], note: 'No story or impact narrative has been written for this Hub yet, so this route is empty.' },
    { label: 'Distilled evidence', href: 'resources.html?type=publication',
      desc: 'Peer-reviewed articles, flagship reports and drafts, suited to fast reading.',
      types: ['publication'] },
    { label: 'Tools, methods and training', href: 'resources.html?type=method',
      desc: 'Runnable tutorials, method reviews, MRV methodology and practice databases.',
      types: ['method', 'innovation'] },
    { label: 'Scientific evidence and data', href: 'resources.html?type=dataset',
      desc: 'The datasets, with resolution, coverage, cadence and licence against each.',
      types: ['dataset'] }
  ];

  /* Photograph credits. Every image on Concept C is Creative Commons and carries
     its attribution in a visible caption, per the licence and per the round 2
     principle of keeping attribution. Source records are in the RCA Dashboard
     Image Library, with IMAGE-ATTRIBUTIONS.txt. */
  H.credits = {
    'hero-sahel.jpg':       '"Innovative farming practices in the Sahel" by CGIAR Climate / Flickr / CC BY-NC-SA 2.0',
    'banner-harvest.jpg':   '"Harvesting season in Nyando climate-smart villages" by CGIAR Climate / Flickr / CC BY-NC-SA 2.0',
    'spotlight.jpg':        '"Community engagement in Tibtenga Climate-Smart Village" by CGIAR Climate / Flickr / CC BY-NC-SA 2.0',
    'theme-adaptation.jpg': '"Climate-smart farm in Doyogena" by G. Ambaw / CCAFS / Flickr / CC BY-NC-SA 2.0',
    'theme-water.jpg':      '"Working with water terraces in Lower Nyando, Kenya" by CGIAR Climate / Flickr / CC BY-NC-SA 2.0',
    'theme-models.jpg':     '"Accra workshop tackles climate challenge with crop-climate modelling" by IITA / Flickr / CC BY-NC-SA 2.0',
    'theme-farm.jpg':       '"Climate-smart farm" by Neil Palmer / CIAT / Flickr / CC BY-SA 2.0'
  };
})();
