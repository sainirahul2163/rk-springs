/**
 * Tell Bing, Yandex, Seznam, Naver and other IndexNow engines that pages changed.
 * Run after a production deploy is live on the real domain:
 *   npm run build && npm run indexnow            # every URL in the sitemap
 *   npm run indexnow -- /springs/torsion-springs/  # only these paths
 * The key file public/<key>.txt must be reachable at https://www.rksprings.com/<key>.txt.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const siteTs = readFileSync(join(root, 'src/data/site.ts'), 'utf8');
const key = siteTs.match(/indexNowKey: '([^']+)'/)?.[1];
const origin = (
  process.env.PUBLIC_SITE_URL ||
  siteTs.match(/origin: '([^']+)'/)?.[1] ||
  ''
).replace(/\/+$/, '');
if (!key || !origin) {
  console.error('indexnow: key or origin missing in src/data/site.ts');
  process.exit(1);
}
if (!existsSync(join(root, 'public', `${key}.txt`))) {
  console.error(`indexnow: public/${key}.txt is missing`);
  process.exit(1);
}

let urls = process.argv.slice(2).map((p) => new URL(p, `${origin}/`).toString());
if (urls.length === 0) {
  const dist = join(root, 'dist', 'client');
  const files = ['sitemap-0.xml'].map((f) => join(dist, f)).filter((f) => existsSync(f));
  if (files.length === 0) {
    console.error('indexnow: no dist/client/sitemap-0.xml. Run a production build first.');
    process.exit(1);
  }
  urls = files.flatMap((f) =>
    [...readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
  );
}

const host = new URL(origin).host;
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `${origin}/${key}.txt`, urlList: urls }),
});
console.log(`indexnow: ${urls.length} URL(s) → HTTP ${res.status} ${res.statusText}`);
if (res.status >= 400) {
  console.error(await res.text());
  process.exit(1);
}
