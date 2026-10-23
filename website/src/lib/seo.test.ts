import { describe, expect, it } from 'vitest';
import { site } from '@/data/site';
import { absoluteUrl, SITE_URL } from './env';
import { buildGraph } from './jsonld';
import { ogImagePath, ogSlug } from './og';
import { formatTitle, TITLE_MAX } from './seo';

type Node = Record<string, unknown>;
const nodes = (g: ReturnType<typeof buildGraph>) => g['@graph'] as Node[];
const ofType = (g: ReturnType<typeof buildGraph>, t: string) =>
  nodes(g).filter((n) => String(n['@type']) === t);

describe('formatTitle', () => {
  it('keeps the full brand when it fits', () => {
    expect(formatTitle('Torsion Spring Manufacturer in Pune')).toBe(
      `Torsion Spring Manufacturer in Pune | ${site.brand}`,
    );
  });

  it('falls back to the short brand instead of exceeding 60 characters', () => {
    const t = formatTitle('Compression Spring Manufacturer in Pune');
    expect(t).toBe(`Compression Spring Manufacturer in Pune | ${site.shortBrand}`);
    expect([...t].length).toBeLessThanOrEqual(TITLE_MAX);
  });

  it('leaves absolute titles alone', () => {
    expect(formatTitle('Exactly this', true)).toBe('Exactly this');
  });
});

describe('domain', () => {
  it('defaults every absolute URL to the final www domain', () => {
    expect(site.origin).toBe('https://www.rksprings.com');
    expect(SITE_URL).toBe(site.origin);
    expect(absoluteUrl('/springs/')).toBe('https://www.rksprings.com/springs/');
  });
});

describe('share cards', () => {
  it('slugs paths the same way as scripts/make-og.mjs', () => {
    expect(ogSlug('/')).toBe('home');
    expect(ogSlug('/springs/torsion-springs/')).toBe('springs--torsion-springs');
  });

  it('falls back to the default card for an unknown page', () => {
    expect(ogImagePath('/not-a-page/')).toBe('/og-default.png');
  });
});

describe('buildGraph', () => {
  const base = { title: 'T', description: 'D' };

  it('never emits offers, prices, reviews or ratings', () => {
    const g = buildGraph({
      ...base,
      path: '/springs/torsion-springs/',
      route: 'torsion',
      product: { name: 'Torsion springs', description: 'D' },
      faqs: [{ q: 'Q?', a: '<p>A.</p>' }],
    });
    const blob = JSON.stringify(g);
    for (const banned of ['offers', '"Offer"', 'price', 'aggregateRating', '"review"']) {
      expect(blob).not.toContain(banned);
    }
    expect(ofType(g, 'Service')).toHaveLength(1);
    expect(ofType(g, 'Product')).toHaveLength(0);
  });

  it('skips the one-item breadcrumb on home', () => {
    const g = buildGraph({ ...base, path: '/', route: 'home' });
    expect(ofType(g, 'BreadcrumbList')).toHaveLength(0);
  });

  it('lists hub children as an ItemList, without draft pages', () => {
    const g = buildGraph({ ...base, path: '/springs/', route: 'springs', kind: 'CollectionPage' });
    const list = ofType(g, 'ItemList')[0];
    const urls = (list?.itemListElement as Node[]).map((i) => i.url);
    expect(urls).toContain('https://www.rksprings.com/springs/torsion-springs/');
    expect(urls).not.toContain('https://www.rksprings.com/springs/spiral-springs/');
  });

  it('models an article as a WebPage whose main entity is the TechArticle', () => {
    const g = buildGraph({
      ...base,
      path: '/resources/how-to-measure-a-spring/',
      route: 'measure',
      kind: 'TechArticle',
      article: {
        headline: 'H',
        datePublished: '2026-10-04T00:00:00.000Z',
        dateModified: '2026-10-04T00:00:00.000Z',
      },
      image: 'https://www.rksprings.com/og/x.png',
    });
    const page = ofType(g, 'WebPage')[0];
    const article = ofType(g, 'TechArticle')[0];
    expect(page?.mainEntity).toEqual({ '@id': article?.['@id'] });
    expect(page?.breadcrumb).toBeDefined();
    expect(article?.breadcrumb).toBeUndefined();
  });

  it('resolves every @id reference inside the graph', () => {
    const g = buildGraph({
      ...base,
      path: '/industries/automotive-springs/',
      route: 'automotive',
      service: { name: 'Automotive springs', description: 'D', audience: 'A' },
      image: 'https://www.rksprings.com/og/x.png',
    });
    const ids = new Set(nodes(g).map((n) => n['@id']));
    ids.add(`${absoluteUrl('/')}#logo`);
    const refs = [...JSON.stringify(g).matchAll(/\{"@id":"([^"]+)"\}/g)].map((m) => m[1]);
    for (const r of refs) expect(ids.has(r)).toBe(true);
  });
});
