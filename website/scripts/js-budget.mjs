/**
 * Report JS shipped per built HTML page (external files + inline).
 * Content pages must stay under 100 KB (0 KB of island JS is the default).
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const root = join(import.meta.dirname, '..');
const distRoot = join(root, 'dist');
const dist = existsSync(join(distRoot, 'client')) ? join(distRoot, 'client') : distRoot;
const LIMIT = 100 * 1024;

const interactive = new Set([
  '/request-a-quote/',
  '/contact/',
  '/tools/compression-spring-calculator/',
  '/tools/extension-spring-calculator/',
  '/tools/spring-rate-converter/',
]);

function walkHtml(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walkHtml(p) : name.endsWith('.html') ? [p] : [];
  });
}

function pathFromFile(file) {
  const rel = relative(dist, file).replace(/\\/g, '/');
  if (rel === '404.html') return '/404/';
  return `/${rel.replace(/index\.html$/, '')}`;
}

function resolveAsset(src) {
  const clean = src.split('?')[0];
  if (!clean.startsWith('/')) return null;
  const abs = join(dist, clean.replace(/^\//, ''));
  return existsSync(abs) ? abs : null;
}

function collectImports(entry, seen) {
  if (!entry || seen.has(entry)) return;
  seen.add(entry);
  const text = readFileSync(entry, 'utf8');
  const refs = [
    ...text.matchAll(/from\s*["']([^"']+)["']/g),
    ...text.matchAll(/import\s*["']([^"']+)["']/g),
    ...text.matchAll(/import\([^)]*["']([^"']+)["']/g),
  ].map((m) => m[1]);
  for (const ref of refs) {
    if (ref.startsWith('/')) collectImports(resolveAsset(ref), seen);
    else if (ref.startsWith('.')) {
      const abs = join(dirname(entry), ref);
      if (existsSync(abs)) collectImports(abs, seen);
    }
  }
}

function pageJs(html) {
  const urls = [
    ...html.matchAll(
      /\b(?:src|href|component-url|renderer-url|before-hydration-url)="(\/_astro\/[^"]+\.js)"/gi,
    ),
  ].map((m) => m[1]);
  const seen = new Set();
  for (const url of urls) collectImports(resolveAsset(url), seen);
  let files = 0;
  for (const file of seen) files += statSync(file).size;
  const inline = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].reduce(
    (n, m) => n + (m[1]?.length ?? 0),
    0,
  );
  return { files, inline, total: files + inline };
}

if (!existsSync(dist)) {
  console.error('dist/ is missing. Run npm run build first.');
  process.exit(1);
}

const rows = walkHtml(dist)
  .map((file) => {
    const path = pathFromFile(file);
    const html = readFileSync(file, 'utf8');
    const js = pageJs(html);
    return { path, ...js };
  })
  .sort((a, b) => b.total - a.total);

let failed = 0;
console.log('JS budget (external island files + inline scripts)\n');
for (const row of rows) {
  const over = row.total > LIMIT;
  if (over) failed += 1;
  const mark = interactive.has(row.path)
    ? 'isle'
    : over
      ? 'FAIL'
      : row.total === 0
        ? 'ok  '
        : 'js  ';
  console.log(
    `${mark}  ${(row.total / 1024).toFixed(1).padStart(6)} KB  (files ${(row.files / 1024).toFixed(1)} + inline ${(row.inline / 1024).toFixed(1)})  ${row.path}${interactive.has(row.path) ? '  (island)' : ''}`,
  );
}

const contentOver = rows.filter((r) => !interactive.has(r.path) && r.total > LIMIT);
const islands = rows.filter((r) => interactive.has(r.path));
if (contentOver.length) {
  console.error(`\n${contentOver.length} content page(s) over 100 KB JS.`);
  process.exit(1);
}
console.log(
  `\n${rows.length} pages. Content pages under 100 KB. Island pages (RFQ / contact / tools) are reported above.`,
);
console.log(
  `Largest island: ${islands[0] ? `${islands[0].path} ${(islands[0].total / 1024).toFixed(1)} KB` : 'none'}.`,
);
if (failed && contentOver.length === 0) {
  // Island pages may exceed 100 KB (React). That is allowed; content pages are not.
}
