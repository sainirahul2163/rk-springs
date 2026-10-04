/**
 * SEO audit of dist/. Fails the build on title/meta/H1/canonical/JSON-LD/link issues.
 * Usage: node scripts/audit-html.ts
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = join(import.meta.dirname, '..');
const distRoot = join(root, 'dist');
/** Server/hybrid builds (an on-demand API route) emit static HTML under dist/client/. */
const dist = existsSync(join(distRoot, 'client')) ? join(distRoot, 'client') : distRoot;
const TITLE_MAX = 60;
const DESC_MAX = 155;

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
function fail(path: string, msg: string) {
  errors.push(`${path}: ${msg}`);
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
      const site = (process.env.PUBLIC_SITE_URL || '').replace(/\/+$/, '');
      if (site) {
        const expected = new URL(p.path === '/404/' ? '/404/' : p.path, `${site}/`).toString();
        if (p.canonical !== expected) {
          fail(p.path, `canonical ${p.canonical} !== ${expected}`);
        }
      }
    } catch {
      fail(p.path, `canonical is not an absolute URL (${p.canonical})`);
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

function fileForHref(href: string): string | null {
  const path = (href.split('#')[0] ?? href).split('?')[0] ?? href;
  if (!path.startsWith('/')) return null;
  if (path.startsWith('/api/')) return null;
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
      const path = new URL(m[1] ?? '').pathname;
      if (!path.endsWith('.xml')) sitemapUrls.add(path);
    } catch {
      fail('/', `sitemap loc is not a URL: ${m[1]}`);
    }
  }
}

for (const p of pages) {
  if (p.noindex && sitemapUrls.has(p.path)) fail(p.path, 'noindex page appears in the sitemap');
}

if (errors.length) {
  console.error(`audit-html: ${errors.length} error(s)\n`);
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}

console.log(`audit-html: ${pages.length} pages, ${sitemapUrls.size} sitemap URLs, 0 errors.`);
