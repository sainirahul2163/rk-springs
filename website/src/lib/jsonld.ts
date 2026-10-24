/**
 * JSON-LD @graph builders. Facts from site.ts only. No offers, prices, reviews or aggregateRating.
 *
 * Product nodes are deliberately not emitted: Google treats a Product without offers, review
 * or aggregateRating as an invalid item, and we publish neither prices nor reviews. Each spring
 * page describes the made-to-drawing work as a Service provided by the one Organization entity.
 */
import type { FaqItem } from '@/components/ui/FAQ.astro';
import { mapUrl, primaryEmail, primaryPhone, site } from '@/data/site';
import { childrenOf, trail, type RouteId } from '@/data/routes';
import { absoluteUrl } from './env';

export type PageKind = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'TechArticle';

export interface GlossaryTermLd {
  id: string;
  term: string;
  definition: string;
}

export interface ServiceLd {
  /** What is made, e.g. "Torsion springs". */
  name: string;
  description: string;
  /** Defaults to "Custom spring manufacturing". */
  serviceType?: string;
  /** Who it is for, e.g. "Makers of MCBs and switchgear". */
  audience?: string;
}

export interface JsonLdPage {
  path: string;
  title: string;
  description: string;
  kind?: PageKind;
  route?: RouteId;
  faqs?: readonly FaqItem[];
  /** Spring or wire-form product page. */
  product?: { name: string; description: string };
  /** Industry or capability page. */
  service?: ServiceLd;
  glossary?: readonly GlossaryTermLd[];
  article?: { headline: string; datePublished: string; dateModified: string };
  tool?: { name: string; description: string };
  /** Absolute URL of the page's share card. */
  image?: string;
  /** ISO date (YYYY-MM-DD or full ISO) of the last real content change. */
  dateModified?: string;
}

type Node = Record<string, unknown>;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function orgId(): string {
  return `${absoluteUrl('/')}#organization`;
}

function websiteId(): string {
  return `${absoluteUrl('/')}#website`;
}

function logoId(): string {
  return `${absoluteUrl('/')}#logo`;
}

const ORG_DESCRIPTION = `Maker of torsion, double torsion, extension, compression and conical springs and wire forms in ${site.capability.wireMinMm.toFixed(2)}–${site.capability.wireMaxMm.toFixed(2)} mm wire, made to drawing or sample in ${site.address.locality}, ${site.address.city}, since ${site.foundingYear}.`;

function organization(): Node {
  const a = site.address;
  const node: Node = {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': orgId(),
    name: site.brand,
    alternateName: [site.shortBrand, site.legalName],
    legalName: site.legalName,
    description: ORG_DESCRIPTION,
    foundingDate: String(site.foundingYear),
    taxID: site.gstin,
    url: absoluteUrl('/'),
    // TODO(client): logo.png is rendered from the temporary favicon; replace with the real logo.
    logo: {
      '@type': 'ImageObject',
      '@id': logoId(),
      url: absoluteUrl('/logo.png'),
      contentUrl: absoluteUrl('/logo.png'),
      width: 512,
      height: 512,
      caption: site.brand,
    },
    image: { '@id': logoId() },
    email: primaryEmail,
    telephone: primaryPhone.e164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${a.street}, ${a.locality}`,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.countryCode,
    },
    areaServed: { '@type': 'Country', name: 'India' },
    knowsAbout: [
      'Torsion springs',
      'Double torsion springs',
      'Extension springs',
      'Tension springs',
      'Compression springs',
      'Conical springs',
      'Wire forms',
      'Switchgear and MCB springs',
      'Reverse engineering a spring from a sample',
      'Stress relieving of springs',
      'Spring end grinding',
      'Custom spring manufacturing',
    ],
    founder: {
      '@type': 'Person',
      name: site.founder.givenName,
      givenName: site.founder.givenName,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: primaryPhone.e164,
      email: primaryEmail,
      areaServed: 'IN',
      availableLanguage: ['en'],
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [...site.hours.openDays],
      opens: site.hours.opens,
      closes: site.hours.closes,
    },
    hasMap: mapUrl,
    identifier: [
      { '@type': 'PropertyValue', name: 'GSTIN', value: site.gstin },
      { '@type': 'PropertyValue', name: 'Udyam', value: site.udyam },
    ],
  };
  if (site.geo) {
    node.geo = {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    };
  }
  if (site.sameAs.length > 0) node.sameAs = [...site.sameAs];
  return node;
}

function website(): Node {
  return {
    '@type': 'WebSite',
    '@id': websiteId(),
    url: absoluteUrl('/'),
    name: site.brand,
    alternateName: [site.shortBrand, site.domain],
    inLanguage: 'en-IN',
    publisher: { '@id': orgId() },
    description:
      'Precision springs and wire forms made to drawing or sample in Talawade, Pune. Quote within 24 hours.',
  };
}

function breadcrumbs(route: RouteId, pageUrl: string): Node | null {
  const items = trail(route);
  if (items.length < 2) return null;
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      item: absoluteUrl(it.path),
    })),
  };
}

function service(pageUrl: string, s: ServiceLd, image?: string): Node {
  return {
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: s.name,
    serviceType: s.serviceType ?? 'Custom spring manufacturing',
    description: s.description,
    url: pageUrl,
    provider: { '@id': orgId() },
    brand: { '@id': orgId() },
    areaServed: { '@type': 'Country', name: 'India' },
    ...(s.audience ? { audience: { '@type': 'BusinessAudience', audienceType: s.audience } } : {}),
    ...(image ? { image } : {}),
  };
}

function isoDate(d: string): string {
  return d.length === 10 ? d : new Date(d).toISOString().slice(0, 10);
}

export function buildGraph(page: JsonLdPage): {
  '@context': 'https://schema.org';
  '@graph': Node[];
} {
  const pageUrl = absoluteUrl(page.path);
  const kind = page.kind ?? 'WebPage';
  const graph: Node[] = [organization(), website()];

  const isArticle = kind === 'TechArticle' && Boolean(page.article);
  const webPage: Node = {
    // An article page is a WebPage whose main entity is the TechArticle (breadcrumb and
    // primaryImageOfPage are WebPage properties, not Article ones).
    '@type': isArticle ? 'WebPage' : kind,
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.title,
    description: page.description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': websiteId() },
    about: { '@id': orgId() },
    publisher: { '@id': orgId() },
  };

  if (page.image) {
    const imageNode = {
      '@type': 'ImageObject',
      '@id': `${pageUrl}#primaryimage`,
      url: page.image,
      contentUrl: page.image,
      width: 1200,
      height: 630,
    };
    graph.push(imageNode);
    webPage.primaryImageOfPage = { '@id': imageNode['@id'] };
    webPage.image = { '@id': imageNode['@id'] };
  }
  if (page.dateModified) webPage.dateModified = isoDate(page.dateModified);

  if (isArticle && page.article) {
    webPage.datePublished = page.article.datePublished;
    webPage.dateModified = page.article.dateModified;
  }

  if (page.route) {
    const crumbs = breadcrumbs(page.route, pageUrl);
    if (crumbs) {
      graph.push(crumbs);
      webPage.breadcrumb = { '@id': crumbs['@id'] };
    }

    if (kind === 'CollectionPage') {
      const children = childrenOf(page.route);
      if (children.length > 0) {
        const list: Node = {
          '@type': 'ItemList',
          '@id': `${pageUrl}#itemlist`,
          numberOfItems: children.length,
          itemListElement: children.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            url: absoluteUrl(c.path),
          })),
        };
        graph.push(list);
        webPage.mainEntity = { '@id': list['@id'] };
      }
    }
  }

  graph.push(webPage);

  if (isArticle && page.article) {
    graph.push({
      '@type': 'TechArticle',
      '@id': `${pageUrl}#article`,
      headline: page.article.headline,
      description: page.description,
      inLanguage: 'en-IN',
      datePublished: page.article.datePublished,
      dateModified: page.article.dateModified,
      author: { '@id': orgId() },
      publisher: { '@id': orgId() },
      isPartOf: { '@id': `${pageUrl}#webpage` },
      mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
      articleSection: 'Spring design guides',
      ...(page.image ? { image: { '@id': `${pageUrl}#primaryimage` } } : {}),
    });
    webPage.mainEntity = { '@id': `${pageUrl}#article` };
  }

  if (page.faqs && page.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      isPartOf: { '@id': `${pageUrl}#webpage` },
      inLanguage: 'en-IN',
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: stripHtml(f.a) },
      })),
    });
  }

  if (page.glossary && page.glossary.length > 0) {
    graph.push({
      '@type': 'DefinedTermSet',
      '@id': `${pageUrl}#glossary`,
      name: page.title,
      hasDefinedTerm: page.glossary.map((t) => ({
        '@type': 'DefinedTerm',
        '@id': `${pageUrl}#${t.id}`,
        name: t.term,
        description: t.definition,
        url: `${pageUrl}#${t.id}`,
        inDefinedTermSet: { '@id': `${pageUrl}#glossary` },
      })),
    });
  }

  const svc: ServiceLd | undefined = page.product
    ? { ...page.product, serviceType: 'Custom spring manufacturing' }
    : page.service;
  if (svc) {
    graph.push(service(pageUrl, svc, page.image));
    webPage.mainEntity = { '@id': `${pageUrl}#service` };
  }

  if (page.tool) {
    graph.push({
      '@type': 'WebApplication',
      '@id': `${pageUrl}#webapp`,
      name: page.tool.name,
      description: page.tool.description,
      applicationCategory: 'EngineeringApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      isAccessibleForFree: true,
      provider: { '@id': orgId() },
      url: pageUrl,
      inLanguage: 'en-IN',
      ...(page.image ? { image: page.image } : {}),
    });
    webPage.mainEntity = { '@id': `${pageUrl}#webapp` };
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
