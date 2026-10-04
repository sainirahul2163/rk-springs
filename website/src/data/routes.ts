/**
 * Route registry (sitemap v1, CURSOR-BUILD-PROMPT.md §5).
 * Drives navigation, breadcrumbs and link gating. A route becomes linkable in production
 * only once its status is 'live', so unbuilt pages never produce broken links.
 *
 * status:
 *  - live:    built and published
 *  - draft:   built, but blocked on a TODO(client); excluded from production builds
 *  - planned: not built yet
 */

export type RouteStatus = 'live' | 'draft' | 'planned';

export interface RouteDef {
  path: string;
  label: string;
  /** Key of the parent route in `routes`. */
  parent?: string;
  status: RouteStatus;
  noindex?: boolean;
}

export const routes = {
  home: { path: '/', label: 'Home', status: 'live' },

  springs: { path: '/springs/', label: 'Springs', parent: 'home', status: 'live' },
  torsion: {
    path: '/springs/torsion-springs/',
    label: 'Torsion springs',
    parent: 'springs',
    status: 'live',
  },
  doubleTorsion: {
    path: '/springs/double-torsion-springs/',
    label: 'Double torsion springs',
    parent: 'springs',
    status: 'live',
  },
  extension: {
    path: '/springs/extension-springs/',
    label: 'Tension / extension springs',
    parent: 'springs',
    status: 'live',
  },
  compression: {
    path: '/springs/compression-springs/',
    label: 'Compression springs',
    parent: 'springs',
    status: 'live',
  },
  conical: {
    path: '/springs/conical-springs/',
    label: 'Conical springs',
    parent: 'springs',
    status: 'live',
  },
  // TODO(client): confirm what "spiral" means before this page can go live.
  spiral: {
    path: '/springs/spiral-springs/',
    label: 'Spiral springs',
    parent: 'springs',
    status: 'draft',
  },
  wireForms: { path: '/wire-forms/', label: 'Wire forms', parent: 'home', status: 'live' },

  industries: { path: '/industries/', label: 'Industries', parent: 'home', status: 'live' },
  automotive: {
    path: '/industries/automotive-springs/',
    label: 'Automotive',
    parent: 'industries',
    status: 'live',
  },
  switchgear: {
    path: '/industries/electrical-switchgear-springs/',
    label: 'Electrical and switchgear',
    parent: 'industries',
    status: 'live',
  },
  instrumentation: {
    path: '/industries/instrumentation-springs/',
    label: 'Instrumentation',
    parent: 'industries',
    status: 'live',
  },
  furniture: {
    path: '/industries/furniture-springs/',
    label: 'Furniture',
    parent: 'industries',
    status: 'live',
  },

  capabilities: {
    path: '/capabilities/',
    label: 'Capabilities',
    parent: 'home',
    status: 'live',
  },
  coilingForming: {
    path: '/capabilities/spring-coiling-forming/',
    label: 'Spring coiling and forming',
    parent: 'capabilities',
    status: 'live',
  },
  prototype: {
    path: '/capabilities/prototype-development/',
    label: 'Prototype development',
    parent: 'capabilities',
    status: 'live',
  },
  reverseEngineering: {
    path: '/capabilities/reverse-engineering/',
    label: 'Reverse engineering',
    parent: 'capabilities',
    status: 'live',
  },
  heatTreatment: {
    path: '/capabilities/heat-treatment-grinding/',
    label: 'Stress relieving and grinding',
    parent: 'capabilities',
    status: 'live',
  },

  quality: { path: '/quality/', label: 'Quality', parent: 'home', status: 'live' },
  about: { path: '/about/', label: 'About', parent: 'home', status: 'live' },
  ordering: { path: '/ordering/', label: 'Ordering with us', parent: 'home', status: 'live' },
  rfq: { path: '/request-a-quote/', label: 'Request a quote', parent: 'home', status: 'live' },
  rfqThanks: {
    path: '/request-a-quote/thank-you/',
    label: 'Thank you',
    parent: 'rfq',
    status: 'live',
    noindex: true,
  },
  contact: { path: '/contact/', label: 'Contact', parent: 'home', status: 'live' },
  talawade: {
    path: '/locations/talawade-pcmc/',
    label: 'Talawade and PCMC',
    parent: 'home',
    status: 'live',
  },

  tools: { path: '/tools/', label: 'Tools', parent: 'home', status: 'live' },
  compressionCalc: {
    path: '/tools/compression-spring-calculator/',
    label: 'Compression spring calculator',
    parent: 'tools',
    status: 'live',
  },
  extensionCalc: {
    path: '/tools/extension-spring-calculator/',
    label: 'Extension spring calculator',
    parent: 'tools',
    status: 'live',
  },
  rateConverter: {
    path: '/tools/spring-rate-converter/',
    label: 'Spring rate converter',
    parent: 'tools',
    status: 'live',
  },

  resources: { path: '/resources/', label: 'Resources', parent: 'home', status: 'live' },
  glossary: {
    path: '/resources/spring-glossary/',
    label: 'Spring glossary',
    parent: 'resources',
    status: 'live',
  },
  hsnGst: {
    path: '/resources/hsn-code-gst-springs/',
    label: 'HSN code and GST for springs',
    parent: 'resources',
    status: 'live',
  },
  measure: {
    path: '/resources/how-to-measure-a-spring/',
    label: 'How to measure a spring',
    parent: 'resources',
    status: 'live',
  },
  typesCompared: {
    path: '/resources/torsion-vs-extension-vs-compression-springs/',
    label: 'Torsion vs extension vs compression',
    parent: 'resources',
    status: 'live',
  },
  whatIsDoubleTorsion: {
    path: '/resources/what-is-a-double-torsion-spring/',
    label: 'What is a double torsion spring?',
    parent: 'resources',
    status: 'live',
  },
  priceGuide: {
    path: '/resources/spring-price-guide-india/',
    label: 'Spring price guide (India)',
    parent: 'resources',
    status: 'live',
  },
  extensionEnds: {
    path: '/resources/extension-spring-end-types/',
    label: 'Extension spring end types',
    parent: 'resources',
    status: 'live',
  },

  privacy: { path: '/privacy-policy/', label: 'Privacy policy', parent: 'home', status: 'live' },
  terms: { path: '/terms/', label: 'Terms of use', parent: 'home', status: 'live' },
  styleguide: {
    path: '/styleguide/',
    label: 'Style guide',
    parent: 'home',
    status: 'live',
    noindex: true,
  },
} satisfies Record<string, RouteDef>;

export type RouteId = keyof typeof routes;

const showUnfinished = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_TODOS === 'true';

export function getRoute(id: RouteId): RouteDef {
  return routes[id];
}

/** Path to link to, or null if the page isn't published in this build. */
export function linkTo(id: RouteId): string | null {
  const r = routes[id];
  if (r.status === 'live') return r.path;
  return showUnfinished ? r.path : null;
}

/** Breadcrumb trail from Home to the given route (inclusive). */
export function trail(id: RouteId): { id: RouteId; label: string; path: string }[] {
  const out: { id: RouteId; label: string; path: string }[] = [];
  let cur: RouteId | undefined = id;
  while (cur) {
    const r: RouteDef = routes[cur];
    out.unshift({ id: cur, label: r.label, path: r.path });
    cur = r.parent as RouteId | undefined;
  }
  return out;
}
