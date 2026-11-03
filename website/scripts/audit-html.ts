/**
 * SEO audit of dist/. Fails the build on title/meta/H1/canonical/JSON-LD/link issues.
 * Usage: node scripts/audit-html.ts
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = join(import.meta.dirname, '..');
const distRoot = join(root, 'dist');
/** Server/hybrid builds (an on-demand API route) emit static HTML under dist/client/. */
const dist = existsSync(join(distRoot, 'client')) ? join(distRoot, 'client') : distRoot;
const TITLE_MAX = 60;
const DESC_MAX = 155;
const TITLE_MIN = 30;
const DESC_MIN = 70;
/** Production origin from src/data/site.ts (the only source; mirrors src/lib/env.ts). */
const SITE_ORIGIN = (
  readFileSync(join(root, 'src/data/site.ts'), 'utf8').match(/origin: '([^']+)'/)?.[1] || ''
).replace(/\/+$/, '');

if (!existsSync(dist)) {
  console.error('dist/ is missing. Run npm run build first.');
  process.exit(1);
}

function walkHtml(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walkHtml(p);
    return name.endsWith('.html') ? [p] : [];
  });
}

function pathFromFile(file: string): string {
  const rel = relative(dist, file).replace(/\\/g, '/');
  if (rel === '404.html') return '/404/';
  return `/${rel.replace(/index\.html$/, '')}`;
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function attr(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? decode(m[1]) : null;
}

function isNoindex(html: string): boolean {
  return /name="robots"[^>]*content="[^"]*noindex/i.test(html);
}

type Page = {
  file: string;
  path: string;
  html: string;
  title: string | null;
  desc: string | null;
  canonical: string | null;
  h1: number;
  noindex: boolean;
};

const pages: Page[] = walkHtml(dist).map((file) => {
  const html = readFileSync(file, 'utf8');
  return {
    file,
    path: pathFromFile(file),
    html,
    title: attr(html, /<title>([^<]*)<\/title>/i),
    desc: attr(html, /name="description"\s+content="([^"]*)"/i),
    canonical: attr(html, /rel="canonical"\s+href="([^"]*)"/i),
    h1: (html.match(/<h1\b/gi) ?? []).length,
    noindex: isNoindex(html),
  };
});

const errors: string[] = [];
const warnings: string[] = [];
function fail(path: string, msg: string) {
  errors.push(`${path}: ${msg}`);
}
function warn(path: string, msg: string) {
  warnings.push(`${path}: ${msg}`);
}

/** Visible text of an HTML fragment. */
function text(html: string): string {
  return decode(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

const titles = new Map<string, string[]>();
const descs = new Map<string, string[]>();

for (const p of pages) {
  if (!p.title) fail(p.path, 'missing title');
  else {
    if ([...p.title].length > TITLE_MAX)
      fail(p.path, `title is ${[...p.title].length} chars (max ${TITLE_MAX})`);
    if (!p.noindex) {
      const list = titles.get(p.title) ?? [];
      list.push(p.path);
      titles.set(p.title, list);
    }
  }
  if (!p.desc) fail(p.path, 'missing meta description');
  else {
    if ([...p.desc].length > DESC_MAX)
      fail(p.path, `description is ${[...p.desc].length} chars (max ${DESC_MAX})`);
    if (!p.noindex) {
      const list = descs.get(p.desc) ?? [];
      list.push(p.path);
      descs.set(p.desc, list);
    }
  }
  if (p.h1 !== 1) fail(p.path, `H1 count is ${p.h1} (need 1)`);
  if (!p.canonical) fail(p.path, 'missing canonical');
  else {
    try {
      const u = new URL(p.canonical);
      if (p.path !== '/404/' && !u.pathname.endsWith('/') && u.pathname !== '/') {
        fail(p.path, `canonical path should end with / (${u.pathname})`);
      }
      if (SITE_ORIGIN) {
        const expected = new URL(p.path, `${SITE_ORIGIN}/`).toString();
        if (p.canonical !== expected) {
          fail(p.path, `canonical ${p.canonical} !== ${expected}`);
        }
      }
    } catch {
      fail(p.path, `canonical is not an absolute URL (${p.canonical})`);
    }
  }

  if (!/<html[^>]*\blang="en-IN"/.test(p.html)) fail(p.path, 'html lang must be en-IN');
  if (/https?:\/\/(?:localhost|127\.0\.0\.1)|\.vercel\.app/.test(p.html))
    fail(p.path, 'localhost or vercel.app URL in the HTML');

  const ogUrl = attr(p.html, /property="og:url"\s+content="([^"]*)"/);
  const ogImage = attr(p.html, /property="og:image"\s+content="([^"]*)"/);
  if (!attr(p.html, /property="og:title"\s+content="([^"]*)"/)) fail(p.path, 'missing og:title');
  if (!attr(p.html, /property="og:description"\s+content="([^"]*)"/))
    fail(p.path, 'missing og:description');
  if (ogUrl !== p.canonical) fail(p.path, `og:url ${ogUrl} !== canonical`);
  if (!ogImage) fail(p.path, 'missing og:image');
  else {
    try {
      const img = new URL(ogImage);
      if (!existsSync(join(dist, img.pathname))) fail(p.path, `og:image ${img.pathname} not built`);
    } catch {
      fail(p.path, `og:image is not absolute (${ogImage})`);
    }
  }

  // Heading outline: never skip a level going down (h2 → h4).
  let prev = 0;
  for (const m of p.html.matchAll(/<h([1-6])\b/g)) {
    const level = Number(m[1]);
    if (!prev && level !== 1) {
      fail(p.path, `first heading is h${level}, not the h1`);
      break;
    }
    if (prev && level > prev + 1) {
      fail(p.path, `heading jumps from h${prev} to h${level}`);
      break;
    }
    prev = level;
  }

  for (const m of p.html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\balt="/.test(tag)) fail(p.path, `img without alt: ${tag.slice(0, 80)}`);
    if (!/\bwidth="/.test(tag) || !/\bheight="/.test(tag))
      fail(p.path, `img without width/height: ${tag.slice(0, 80)}`);
  }

  for (const m of p.html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const attrs = m[1] ?? '';
    const label = text(m[2] ?? '');
    const aria = /aria-label="([^"]+)"/.exec(attrs)?.[1];
    const svgTitle = /<title>([^<]+)<\/title>/.exec(m[2] ?? '')?.[1];
    if (!label && !aria && !svgTitle && !/sr-only/.test(m[2] ?? ''))
      fail(p.path, `link with no accessible text: <a${attrs.slice(0, 80)}>`);
    if (/^(click here|here|read more|more|this page|link)$/i.test(label))
      fail(p.path, `vague anchor text "${label}"`);
    if (/target="_blank"/.test(attrs) && !/rel="[^"]*noopener/.test(attrs))
      fail(p.path, `target=_blank without rel=noopener: <a${attrs.slice(0, 80)}>`);
  }

  if (!p.noindex) {
    const t = p.title ? [...p.title].length : 0;
    const d = p.desc ? [...p.desc].length : 0;
    if (t && t < TITLE_MIN) fail(p.path, `title is ${t} chars (min ${TITLE_MIN})`);
    if (d && d < DESC_MIN) fail(p.path, `description is ${d} chars (min ${DESC_MIN})`);
    if (!/name="robots"[^>]*content="[^"]*\bindex\b/.test(p.html))
      fail(p.path, 'indexable page without an index robots meta');
    if (p.path !== '/') {
      if (!/<nav aria-label="Breadcrumb"/.test(p.html)) fail(p.path, 'missing visible breadcrumbs');
      if (!p.html.includes('"BreadcrumbList"')) fail(p.path, 'missing BreadcrumbList JSON-LD');
    }
  }

  if (/<\/(?:strong|a|em)>[A-Za-z]/.test(p.html)) {
    fail(p.path, 'missing space after </strong>, </a> or </em>');
  }

  if (process.env.PUBLIC_SHOW_TODOS !== 'true') {
    if (p.html.includes('data-todo') || /TODO\(client\)/.test(p.html)) {
      fail(p.path, 'TODO(client) is visible in the built HTML');
    }
  }

  if (!p.noindex) {
    const blocks = [
      ...p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
    ];
    if (blocks.length === 0) fail(p.path, 'missing JSON-LD');
    for (const b of blocks) {
      try {
        const data = JSON.parse(b[1] ?? '');
        if (data['@context'] !== 'https://schema.org') fail(p.path, 'JSON-LD missing @context');
        const graph = data['@graph'];
        if (!Array.isArray(graph) || graph.length === 0) fail(p.path, 'JSON-LD missing @graph');
        if (Array.isArray(graph)) {
          const ids = new Set<string>();
          const collect = (v: unknown) => {
            if (Array.isArray(v)) v.forEach(collect);
            else if (v && typeof v === 'object') {
              const o = v as Record<string, unknown>;
              if (typeof o['@id'] === 'string' && Object.keys(o).length > 1) ids.add(o['@id']);
              Object.values(o).forEach(collect);
            }
          };
          collect(graph);
          const refs = [...JSON.stringify(graph).matchAll(/\{"@id":"([^"]+)"\}/g)].map((r) => r[1]);
          for (const ref of refs) {
            if (ref && !ids.has(ref)) fail(p.path, `JSON-LD reference ${ref} has no node`);
          }
          const types = new Set(graph.map((n: Record<string, unknown>) => String(n['@type'])));
          if (!types.has('Organization,LocalBusiness'))
            fail(p.path, 'JSON-LD missing Organization');
          if (!types.has('WebSite')) fail(p.path, 'JSON-LD missing WebSite');
        }
        const blob = JSON.stringify(data);
        if (blob.includes('aggregateRating'))
          fail(p.path, 'JSON-LD must not include aggregateRating');
        if (/"@type"\s*:\s*"Offer"/.test(blob) || /"offers"/.test(blob))
          fail(p.path, 'JSON-LD must not include offers');
      } catch {
        fail(p.path, 'JSON-LD is not valid JSON');
      }
    }
  }
}

for (const [title, paths] of titles) {
  if (paths.length > 1) fail(paths.join(', '), `duplicate title "${title}"`);
}
for (const [, paths] of descs) {
  if (paths.length > 1) fail(paths.join(', '), 'duplicate description');
}

/**
 * Pages rendered on demand (`export const prerender = false`) are not in dist/ as HTML.
 * They are linked only in dev and client-review builds, so treat them as existing.
 */
const ON_DEMAND = new Set(
  readdirSync(join(root, 'src', 'pages'), { recursive: true, encoding: 'utf8' })
    .filter((f) => f.endsWith('.astro'))
    .filter((f) =>
      /export const prerender = false/.test(readFileSync(join(root, 'src', 'pages', f), 'utf8')),
    )
    .map((f) => `/${f.replace(/\\/g, '/').replace(/(?:index)?\.astro$/, '')}`.replace(/\/?$/, '/')),
);

function fileForHref(href: string): string | null {
  const path = (href.split('#')[0] ?? href).split('?')[0] ?? href;
  if (!path.startsWith('/')) return null;
  if (path.startsWith('/api/')) return null;
  if (ON_DEMAND.has(path)) return path;
  if (existsSync(join(dist, path, 'index.html'))) return join(dist, path, 'index.html');
  if (path.endsWith('/') && existsSync(join(dist, path.slice(0, -1), 'index.html')))
    return join(dist, path.slice(0, -1), 'index.html');
  const trimmed = path.replace(/^\//, '');
  if (existsSync(join(dist, trimmed))) return join(dist, trimmed);
  if (path === '/404/' && existsSync(join(dist, '404.html'))) return join(dist, '404.html');
  return null;
}

for (const p of pages) {
  const hrefs = [...p.html.matchAll(/href="([^"]+)"/g)].map((m) => m[1] ?? '');
  for (const href of hrefs) {
    if (
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#') ||
      href.startsWith('data:')
    ) {
      continue;
    }
    if (!href.startsWith('/')) continue;
    if (fileForHref(href) === null) fail(p.path, `broken internal link ${href}`);
  }
}

const sitemapFiles = ['sitemap-index.xml', 'sitemap-0.xml'].flatMap((n) =>
  [join(dist, n), join(distRoot, n)].filter((f) => existsSync(f)),
);
const indexableCount = pages.filter((p) => !p.noindex).length;
if (indexableCount > 0 && sitemapFiles.length === 0) fail('/', 'sitemap XML is missing');

const sitemapUrls = new Set<string>();
for (const f of sitemapFiles) {
  const xml = readFileSync(f, 'utf8');
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    try {
      const u = new URL(m[1] ?? '');
      if (SITE_ORIGIN && u.origin !== new URL(SITE_ORIGIN).origin)
        fail('/', `sitemap loc ${u.href} is not on ${SITE_ORIGIN}`);
      if (!u.pathname.endsWith('.xml')) {
        sitemapUrls.add(u.pathname);
        const page = pages.find((pg) => pg.path === u.pathname);
        if (!page) fail(u.pathname, 'sitemap lists a page that was not built');
        else if (page.canonical !== u.href) fail(u.pathname, `sitemap loc !== canonical`);
      }
    } catch {
      fail('/', `sitemap loc is not a URL: ${m[1]}`);
    }
  }
}

for (const p of pages) {
  if (p.noindex && sitemapUrls.has(p.path)) fail(p.path, 'noindex page appears in the sitemap');
  if (!p.noindex && sitemapFiles.length > 0 && !sitemapUrls.has(p.path))
    fail(p.path, 'indexable page missing from the sitemap');
}

// Internal link graph: every indexable page needs links in, and at least one from page copy
// (not only the header/footer), so crawlers and readers can reach it in context.
const inbound = new Map<string, { any: Set<string>; body: Set<string> }>();
const norm = (href: string) => {
  const path = (href.split('#')[0] ?? '').split('?')[0] ?? '';
  return path.endsWith('/') || path.includes('.') ? path : `${path}/`;
};
for (const p of pages) {
  if (p.noindex) continue;
  const main = p.html.match(/<main\b[\s\S]*<\/main>/)?.[0] ?? '';
  const bodyOnly = main.replace(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/, '');
  for (const [scope, html] of [
    ['any', p.html],
    ['body', bodyOnly],
  ] as const) {
    for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
      const target = norm(m[1] ?? '');
      if (target === p.path) continue;
      const entry = inbound.get(target) ?? { any: new Set(), body: new Set() };
      entry[scope].add(p.path);
      inbound.set(target, entry);
    }
  }
}
for (const p of pages) {
  if (p.noindex || p.path === '/') continue;
  const e = inbound.get(p.path);
  if (!e || e.any.size === 0) fail(p.path, 'orphan page: no internal links point here');
  else if (e.body.size === 0) warn(p.path, 'only linked from navigation, not from page copy');
}

// Duplicate H1s confuse which page answers a query.
const h1s = new Map<string, string[]>();
for (const p of pages) {
  if (p.noindex) continue;
  const h = text(p.html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '').toLowerCase();
  h1s.set(h, [...(h1s.get(h) ?? []), p.path]);
}
for (const [h, paths] of h1s) if (paths.length > 1) warn(paths.join(', '), `duplicate H1 "${h}"`);

// Share cards (npm run og) must exist and match the current H1.
const manifestFile = join(root, 'public', 'og', 'manifest.json');
const ogManifest: Record<string, string> = existsSync(manifestFile)
  ? JSON.parse(readFileSync(manifestFile, 'utf8'))
  : {};
for (const p of pages) {
  if (p.noindex) continue;
  if (!ogManifest[p.path]) {
    warn(p.path, 'no share card yet (run npm run og)');
    continue;
  }
  // Same fingerprint as scripts/make-og.mjs: H1 and top-level breadcrumb label.
  const h1 = text(p.html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '');
  const crumbs = p.html.match(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/)?.[0] ?? '';
  const labels = [...crumbs.matchAll(/<(?:a|span)\b[^>]*>([^<]*)<\/(?:a|span)>/g)].map((m) =>
    text(m[1] ?? ''),
  );
  const section = labels[1] ?? 'Spring manufacturer · Pune';
  const hash = createHash('sha1').update(`${h1}|${section}`).digest('hex').slice(0, 12);
  if (ogManifest[p.path] !== hash) warn(p.path, 'share card is stale (run npm run og)');
}

if (warnings.length) {
  console.warn(`audit-html: ${warnings.length} warning(s)`);
  for (const w of warnings) console.warn(`  ◦ ${w}`);
}

if (errors.length) {
  console.error(`audit-html: ${errors.length} error(s)\n`);
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}

const indexed = pages.filter((p) => !p.noindex).length;
console.log(
  `audit-html: ${pages.length} pages (${indexed} indexable), ${sitemapUrls.size} sitemap URLs, 0 errors.`,
);
