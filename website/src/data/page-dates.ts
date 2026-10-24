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
  '/resources/spring-glossary/': '2026-10-23',
  // 23 Oct 2026 SEO pass: new H1s, intro links or related-link sections (SEO-WORK-LOG.md).
  '/': '2026-10-23',
  '/springs/torsion-springs/': '2026-10-23',
  '/springs/double-torsion-springs/': '2026-10-23',
  '/springs/extension-springs/': '2026-10-23',
  '/springs/compression-springs/': '2026-10-23',
  '/springs/conical-springs/': '2026-10-23',
  '/wire-forms/': '2026-10-23',
  '/resources/': '2026-10-23',
  '/locations/talawade-pcmc/': '2026-10-23',
  '/tools/spring-rate-converter/': '2026-10-23',
};

const DEFAULT = '2026-10-04';

export function lastmodForPath(path: string): string {
  return written[path] ?? DEFAULT;
}
