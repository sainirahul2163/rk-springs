/**
 * Social share images: one 1200×630 PNG per public page, plus favicons and the schema logo.
 *
 * Each card is rendered in Chromium on top of the built page itself, so it uses the real
 * IBM Plex fonts, the design tokens in global.css and the page's own SVG technical drawing
 * (pages without one borrow the closest product drawing). Nothing is AI-generated.
 *
 * Usage (from /website): npm run build && npm run og
 * Output (commit it): public/og/*.png, public/og/manifest.json, public/og-default.png,
 *   public/logo.png, public/apple-touch-icon.png, public/icon-192.png, public/icon-512.png,
 *   public/favicon.ico. Re-run after changing a page H1 or adding a page; `audit-html`
 *   warns when a card is missing or stale.
 */
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { chromium } from '@playwright/test';

const root = join(import.meta.dirname, '..');
const distRoot = join(root, 'dist');
const dist = existsSync(join(distRoot, 'client')) ? join(distRoot, 'client') : distRoot;
const publicDir = join(root, 'public');
const ogDir = join(publicDir, 'og');

/** Pages nobody shares: no card (they fall back to og-default.png). */
const SKIP = new Set([
  '/404/',
  '/styleguide/',
  '/landing/',
  '/request-a-quote/thank-you/',
  '/springs/spiral-springs/',
]);

/** Pages without their own drawing borrow one, by topic. First match wins. */
const BORROW = [
  [/double-torsion/, '/springs/double-torsion-springs/'],
  [/torsion-vs|compare/, '/springs/torsion-springs/'],
  [/torsion|furniture|switchgear/, '/springs/torsion-springs/'],
  [/extension|instrumentation/, '/springs/extension-springs/'],
  [/compression|grinding|heat-treatment/, '/springs/compression-springs/'],
  [/conical/, '/springs/conical-springs/'],
  [/wire-form|automotive|coiling/, '/wire-forms/'],
  [/./, '/'],
];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
};

if (!existsSync(dist)) {
  console.error('dist/ is missing. Run npm run build first.');
  process.exit(1);
}

function walkHtml(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walkHtml(p);
    return name.endsWith('.html') ? [p] : [];
  });
}

function pathFromFile(file) {
  const rel = relative(dist, file).replace(/\\/g, '/');
  if (rel === '404.html') return '/404/';
  return `/${rel.replace(/index\.html$/, '')}`;
}

/** Same slug rule as src/lib/og.ts. */
function ogSlug(path) {
  const s = path.replace(/^\/+|\/+$/g, '').replace(/\//g, '--');
  return s || 'home';
}

function decode(s) {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function fileFor(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const trimmed = clean.replace(/^\//, '');
  const candidates = [join(dist, trimmed, 'index.html'), join(dist, trimmed)];
  return candidates.find((f) => existsSync(f) && statSync(f).isFile()) ?? null;
}

const server = createServer((req, res) => {
  const file = fileFor(req.url ?? '/');
  if (!file) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const pages = walkHtml(dist)
  .map((file) => {
    const html = readFileSync(file, 'utf8');
    const path = pathFromFile(file);
    const h1 = decode(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '');
    const crumbs = [...html.matchAll(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/g)][0]?.[0] ?? '';
    const crumbLabels = [...crumbs.matchAll(/<(?:a|span)\b[^>]*>([^<]*)<\/(?:a|span)>/g)].map((m) =>
      decode(m[1] ?? ''),
    );
    // Top-level section from the breadcrumb ("Springs", "Resources"); home has none.
    const section = crumbLabels[1] ?? 'Spring manufacturer · Pune';
    const ownDrawing = /<main[\s\S]*class="drawing[\s"]/.test(html);
    return { path, h1, section, ownDrawing };
  })
  .filter((p) => !SKIP.has(p.path) && p.h1);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
const page = await context.newPage();

/** Replace the page body with the share card. Runs in the browser. */
async function renderCard({ h1, section, domain, chips, brand, legal }) {
  const src = document.querySelector('main svg.drawing');
  const drawing = src ? src.cloneNode(true) : null;
  if (drawing) {
    drawing.removeAttribute('width');
    drawing.removeAttribute('height');
    drawing.classList.add('og-drawing');
  }
  const glyph = document.querySelector('.wm-glyph')?.cloneNode(true) ?? null;

  const style = document.createElement('style');
  style.textContent = `
    html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: var(--color-white); }
    *, *::before, *::after { animation: none !important; transition: none !important; }
    .og { position: relative; box-sizing: border-box; width: 1200px; height: 630px; padding: 40px;
      font-family: var(--font-sans); color: var(--color-ink); }
    .og-frame { position: absolute; inset: 40px; display: grid; grid-template-columns: 600px 1fr;
      grid-template-rows: 100%; overflow: hidden;
      border: 2px solid var(--color-navy-900); background: var(--color-white); }
    .og-left { display: flex; flex-direction: column; padding: 40px 40px 32px 48px; min-width: 0; min-height: 0;
      border-left: 8px solid var(--color-action-600); }
    .og-brand { display: flex; align-items: center; gap: 14px; color: var(--color-navy-900);
      font-weight: 600; font-size: 24px; letter-spacing: -0.005em; }
    .og-brand svg { width: 40px; height: 40px; --wm-accent: var(--color-action-600); }
    .og-eyebrow { margin-top: 36px; font-family: var(--font-mono); font-size: 18px;
      letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-blue-700); }
    .og-title { margin: 14px 0 0; font-weight: 600; color: var(--color-navy-900);
      letter-spacing: -0.02em; line-height: 1.08; font-size: var(--og-size, 58px); }
    .og-foot { margin-top: auto; }
    .og-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .og-chip { font-family: var(--font-mono); font-size: 16px; padding: 6px 10px;
      border: 1px solid var(--color-grid); border-radius: 4px; color: var(--color-blue-800);
      background: var(--color-blue-50); }
    .og-domain { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--color-border);
      display: flex; justify-content: space-between; align-items: baseline; gap: 16px;
      font-family: var(--font-mono); font-size: 17px; color: var(--color-slate); white-space: nowrap; }
    .og-domain b { color: var(--color-action-700); font-weight: 400; font-size: 20px; }
    .og-right { position: relative; display: grid; place-items: center; padding: 28px;
      border-left: 1px solid var(--color-grid); color: var(--color-navy-900); }
    .og-drawing { width: 100%; height: 100%; max-height: 470px; }
  `;

  const card = document.createElement('div');
  card.className = 'og bp-grid';
  card.innerHTML = `
    <div class="og-frame">
      <div class="og-left">
        <div class="og-brand"><span class="og-glyph"></span><span></span></div>
        <div class="og-eyebrow"></div>
        <p class="og-title"></p>
        <div class="og-foot">
          <div class="og-chips"></div>
          <div class="og-domain"><b></b><span></span></div>
        </div>
      </div>
      <div class="og-right bp-grid"></div>
    </div>`;
  if (glyph) card.querySelector('.og-glyph').replaceWith(glyph);
  else card.querySelector('.og-glyph').remove();
  card.querySelector('.og-brand > span:last-child').textContent = brand;
  card.querySelector('.og-eyebrow').textContent = section;
  const title = card.querySelector('.og-title');
  title.textContent = h1;
  for (const c of chips) {
    const el = document.createElement('span');
    el.className = 'og-chip';
    el.textContent = c;
    card.querySelector('.og-chips').append(el);
  }
  card.querySelector('.og-domain b').textContent = domain;
  card.querySelector('.og-domain span').textContent = legal;
  if (drawing) card.querySelector('.og-right').append(drawing);

  document.head.append(style);
  document.body.replaceChildren(card);
  document.documentElement.className = '';
  await document.fonts.ready;

  // Shrink the title until it fits in three lines.
  let size = 58;
  title.style.setProperty('--og-size', `${size}px`);
  while (title.scrollHeight > size * 1.08 * 3 + 2 && size > 36) {
    size -= 2;
    title.style.setProperty('--og-size', `${size}px`);
  }
  return Boolean(drawing);
}

const siteFacts = readFileSync(join(root, 'src/data/site.ts'), 'utf8');
const domain = siteFacts.match(/domain: '([^']+)'/)?.[1] ?? 'rksprings.com';
const brand = 'RK Springs & Wireforms';
const legal = 'Talawade, Pune · Since 2017';
const chips = ['Wire Ø 0.40–2.50 mm', 'Quote within 24 hours'];

mkdirSync(ogDir, { recursive: true });
const manifest = {};

async function shoot(target, sourcePath, out) {
  await page.goto(`${origin}${sourcePath}`, { waitUntil: 'load' });
  const hasDrawing = await page.evaluate(renderCard, {
    h1: target.h1,
    section: target.section,
    domain,
    chips,
    brand,
    legal,
  });
  await page.screenshot({ path: out, type: 'png' });
  return hasDrawing;
}

for (const p of pages) {
  const source = p.ownDrawing ? p.path : BORROW.find(([re]) => re.test(p.path))[1];
  const slug = ogSlug(p.path);
  const ok = await shoot(p, source, join(ogDir, `${slug}.png`));
  manifest[p.path] = createHash('sha1').update(`${p.h1}|${p.section}`).digest('hex').slice(0, 12);
  console.log(`og: ${p.path} → og/${slug}.png${ok ? '' : ' (no drawing)'}`);
}
writeFileSync(join(ogDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

// Default card for pages without their own (404, thank-you, new pages before a re-run).
await shoot(
  {
    h1: 'Precision springs and wire forms, made to your drawing in Pune',
    section: 'Spring manufacturer',
  },
  '/',
  join(publicDir, 'og-default.png'),
);

// Square icons and the schema.org logo, rendered from favicon.svg.
const svg = readFileSync(join(publicDir, 'favicon.svg'), 'utf8');
const pngs = {};
for (const size of [32, 48, 180, 192, 512]) {
  const iconPage = await context.newPage();
  await iconPage.setViewportSize({ width: size, height: size });
  await iconPage.setContent(
    `<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`,
  );
  pngs[size] = await iconPage.screenshot({ type: 'png', omitBackground: true });
  await iconPage.close();
}
writeFileSync(join(publicDir, 'apple-touch-icon.png'), pngs[180]);
writeFileSync(join(publicDir, 'icon-192.png'), pngs[192]);
writeFileSync(join(publicDir, 'icon-512.png'), pngs[512]);
writeFileSync(join(publicDir, 'logo.png'), pngs[512]);

// favicon.ico with PNG-encoded 32 and 48 px images (valid since Windows Vista).
const icoImages = [32, 48].map((s) => ({ size: s, data: pngs[s] }));
const header = Buffer.alloc(6 + 16 * icoImages.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoImages.length, 4);
let offset = header.length;
icoImages.forEach((img, i) => {
  const o = 6 + i * 16;
  header.writeUInt8(img.size, o);
  header.writeUInt8(img.size, o + 1);
  header.writeUInt8(0, o + 2);
  header.writeUInt8(0, o + 3);
  header.writeUInt16LE(1, o + 4);
  header.writeUInt16LE(32, o + 6);
  header.writeUInt32LE(img.data.length, o + 8);
  header.writeUInt32LE(offset, o + 12);
  offset += img.data.length;
});
writeFileSync(
  join(publicDir, 'favicon.ico'),
  Buffer.concat([header, ...icoImages.map((i) => i.data)]),
);

await browser.close();
server.close();
console.log(`og: ${pages.length} cards, default card, icons and logo written to public/.`);
