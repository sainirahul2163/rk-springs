/**
 * JSON-LD @graph builders. Facts from site.ts only. No offers, prices or aggregateRating.
 */
import type { FaqItem } from '@/components/ui/FAQ.astro';
import { mapUrl, primaryEmail, primaryPhone, site } from '@/data/site';
import { trail, type RouteId } from '@/data/routes';
import { absoluteUrl } from './env';

export type PageKind = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'TechArticle';

export interface GlossaryTermLd {
  id: string;
  term: string;
  definition: string;
}

export interface JsonLdPage {
  path: string;
  title: string;
  description: string;
  kind?: PageKind;
  route?: RouteId;
  faqs?: readonly FaqItem[];
  product?: { name: string; description: string };
  glossary?: readonly GlossaryTermLd[];
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

function organization(): Node {
  const a = site.address;
  const node: Node = {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': orgId(),
    name: site.brand,
    legalName: site.legalName,
    foundingDate: String(site.foundingYear),
    taxID: site.gstin,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/og-default.png'),
    image: absoluteUrl('/og-default.png'),
    email: primaryEmail,
    telephone: primaryPhone.e164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.locality,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.countryCode,
    },
    areaServed: { '@type': 'Country', name: 'India' },
    knowsAbout: [
      'Torsion springs',
      'Double torsion springs',
      'Extension springs',
      'Compression springs',
      'Conical springs',
      'Wire forms',
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
      availableLanguage: ['en', 'hi'],
    },
    openingHoursSpecification: site.hours.openDays.map((day) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: day,
      opens: site.hours.opens,
      closes: site.hours.closes,
    })),
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
    inLanguage: 'en-IN',
    publisher: { '@id': orgId() },
    description:
      'Precision springs and wire forms made to drawing or sample in Talawade, Pune. Quote within 24 hours.',
  };
}

function breadcrumbs(route: RouteId, pageUrl: string): Node {
  const items = trail(route);
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

export function buildGraph(page: JsonLdPage): {
  '@context': 'https://schema.org';
  '@graph': Node[];
} {
  const pageUrl = absoluteUrl(page.path);
  const kind = page.kind ?? 'WebPage';
  const graph: Node[] = [organization(), website()];

  const webPage: Node = {
    '@type': kind,
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: page.title,
    description: page.description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': websiteId() },
    about: { '@id': orgId() },
    publisher: { '@id': orgId() },
  };

  if (page.route) {
    const crumbs = breadcrumbs(page.route, pageUrl);
    graph.push(crumbs);
    webPage.breadcrumb = { '@id': crumbs['@id'] };
  }

  graph.push(webPage);

  if (page.faqs && page.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      isPartOf: { '@id': `${pageUrl}#webpage` },
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
        name: t.term,
        description: t.definition,
        url: `${pageUrl}#${t.id}`,
      })),
    });
  }

  if (page.product) {
    graph.push({
      '@type': 'Product',
      '@id': `${pageUrl}#product`,
      name: page.product.name,
      description: page.product.description,
      brand: { '@id': orgId() },
      manufacturer: { '@id': orgId() },
      material: [...site.capability.materials],
      additionalProperty: {
        '@type': 'PropertyValue',
        name: 'Wire diameter',
        value: site.capability.wireRangeLabel,
      },
    });
    graph.push({
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: 'Custom spring manufacturing',
      serviceType: page.product.name,
      provider: { '@id': orgId() },
      areaServed: { '@type': 'Country', name: 'India' },
      description: `Made to drawing or sample. Wire ${site.capability.wireRangeLabel}. Quote within 24 hours.`,
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
