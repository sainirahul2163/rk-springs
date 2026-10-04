/**
 * lastmod for the sitemap. Each path has its own date (the day that page's copy
 * was written or last revised), not one hard-coded value for the whole site.
 */
const written: Record<string, string> = {
  '/resources/how-to-measure-a-spring/': '2026-10-04',
  '/resources/torsion-vs-extension-vs-compression-springs/': '2026-10-04',
  '/resources/what-is-a-double-torsion-spring/': '2026-10-04',
  '/resources/extension-spring-end-types/': '2026-10-04',
  '/resources/hsn-code-gst-springs/': '2026-10-04',
  '/resources/spring-price-guide-india/': '2026-10-04',
  '/resources/spring-glossary/': '2026-10-04',
};

const DEFAULT = '2026-10-04';

export function lastmodForPath(path: string): string {
  return written[path] ?? DEFAULT;
}
