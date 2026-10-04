/**
 * Mobile Lighthouse on the five §12 pages. Fails if any category is below 95.
 * Serves dist/client (or dist/) on 4173.
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { gzipSync } from 'node:zlib';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from '@playwright/test';

const root = join(import.meta.dirname, '..');
const distRoot = join(root, 'dist');
const dist = existsSync(join(distRoot, 'client')) ? join(distRoot, 'client') : distRoot;
const PORT = 4173;
const THRESHOLD = 95;
const PAGES = [
  '/',
  '/springs/torsion-springs/',
  '/resources/how-to-measure-a-spring/',
  '/tools/compression-spring-calculator/',
  '/request-a-quote/',
];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
};

const GZIP_EXT = new Set(['.html', '.js', '.mjs', '.css', '.svg', '.xml', '.txt', '.json']);

function fileFor(urlPath) {
  const clean = urlPath.split('?')[0].split('#')[0];
  const trimmed = clean.replace(/^\//, '');
  const candidates = [
    join(dist, trimmed, 'index.html'),
    join(dist, trimmed),
    clean === '/404' || clean === '/404/' ? join(dist, '404.html') : '',
  ].filter(Boolean);
  return candidates.find((f) => existsSync(f) && statSync(f).isFile()) ?? null;
}

if (!existsSync(dist)) {
  console.error('dist/ is missing. Run a production-like build first.');
  process.exit(1);
}

const server = createServer((req, res) => {
  const file = fileFor(new URL(req.url ?? '/', `http://127.0.0.1:${PORT}`).pathname);
  if (!file) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  const ext = extname(file);
  const headers = {
    'Content-Type': TYPES[ext] ?? 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  };
  let body = readFileSync(file);
  const accept = String(req.headers['accept-encoding'] ?? '');
  if (GZIP_EXT.has(ext) && accept.includes('gzip')) {
    body = gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
    headers['Vary'] = 'Accept-Encoding';
  }
  res.writeHead(200, headers);
  res.end(body);
});

await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

const systemChrome = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
].find((p) => existsSync(p));

async function launchChrome() {
  return chromeLauncher.launch({
    chromePath: systemChrome ?? chromium.executablePath(),
    chromeFlags: [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-extensions',
    ],
    connectionPollInterval: 250,
    maxConnectionRetries: 80,
  });
}

const cats = ['performance', 'accessibility', 'best-practices', 'seo'];
const RUNS = 3;
const report = [];
let failed = 0;

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

try {
  for (const path of PAGES) {
    const url = `http://127.0.0.1:${PORT}${path}`;
    const runs = [];
    for (let i = 0; i < RUNS; i += 1) {
      const chrome = await launchChrome();
      try {
        const result = await lighthouse(url, {
          port: chrome.port,
          output: 'json',
          logLevel: 'error',
          formFactor: 'mobile',
          screenEmulation: {
            mobile: true,
            width: 390,
            height: 844,
            deviceScaleFactor: 2,
            disabled: false,
          },
          throttlingMethod: 'simulate',
          onlyCategories: cats,
        });
        runs.push(result.lhr);
      } finally {
        await chrome.kill();
      }
    }
    const lhr = runs[Math.floor(runs.length / 2)];
    const scores = Object.fromEntries(
      cats.map((c) => [
        c,
        Math.round(median(runs.map((r) => (r.categories[c]?.score ?? 0) * 100))),
      ]),
    );
    const fcp = median(runs.map((r) => r.audits['first-contentful-paint']?.numericValue ?? 0));
    const lcp = median(runs.map((r) => r.audits['largest-contentful-paint']?.numericValue ?? 0));
    const cls = median(runs.map((r) => r.audits['cumulative-layout-shift']?.numericValue ?? 0));
    const tbt = median(runs.map((r) => r.audits['total-blocking-time']?.numericValue ?? 0));
    const row = { path, scores, lcp, cls, fcp, tbt };
    report.push(row);
    const low = cats.filter((c) => scores[c] < THRESHOLD);
    const metricsBad = lcp > 1800 || cls > 0.05;
    if (low.length || metricsBad) failed += 1;
    console.log(`\n${path}`);
    console.log(
      `  P ${scores.performance}  A ${scores.accessibility}  BP ${scores['best-practices']}  SEO ${scores.seo}`,
    );
    console.log(
      `  LCP ${(lcp / 1000).toFixed(2)} s  CLS ${cls.toFixed(3)}  FCP ${(fcp / 1000).toFixed(2)} s  TBT ${Math.round(tbt)} ms`,
    );
    if (low.length) console.log(`  below 95: ${low.join(', ')}`);
    if (lcp > 1800) console.log('  LCP over 1.8 s');
    if (cls > 0.05) console.log('  CLS over 0.05');
    const lcpItems = lhr.audits['largest-contentful-paint-element']?.details?.items ?? [];
    const node = lcpItems[0]?.items?.[0]?.node ?? lcpItems[0]?.node;
    if (node?.snippet || node?.selector) {
      console.log(
        `  LCP node: ${(node.selector || '').slice(0, 80)} ${(node.snippet || '').replace(/\s+/g, ' ').slice(0, 120)}`,
      );
    }
    const rb = lhr.audits['render-blocking-resources']?.details?.items ?? [];
    if (rb.length) {
      console.log(
        `  render-blocking: ${rb.map((i) => `${i.url?.split('/').pop()} ${Math.round(i.wastedMs ?? 0)}ms`).join(', ')}`,
      );
    }
    const net = lhr.audits['network-requests']?.details?.items ?? [];
    const fonts = net.filter(
      (i) => String(i.url).includes('woff') || String(i.mimeType).includes('font'),
    );
    if (fonts.length) {
      console.log(
        `  fonts: ${fonts.map((i) => `${String(i.url).split('/').pop()} ${Math.round((i.transferSize ?? 0) / 1024)}KB`).join(', ')}`,
      );
    }
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}

console.log('\n---');
if (failed) {
  console.error(`${failed} of ${PAGES.length} pages missed a §12 gate.`);
  process.exit(1);
}
console.log(
  `All ${PAGES.length} pages ≥ 95 in every category (median of ${RUNS} runs). LCP < 1.8 s, CLS < 0.05.`,
);
