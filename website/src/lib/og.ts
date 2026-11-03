/**
 * Per-page social share cards, written to public/og/ by `npm run og` (scripts/make-og.mjs).
 * A page without a card yet falls back to /og-default.png.
 */

const cards = new Set(
  Object.keys(import.meta.glob('/public/og/*.png')).map((k) => k.replace(/^\/public/, '')),
);

/** "/" → "home", "/springs/torsion-springs/" → "springs--torsion-springs" (same rule as the script). */
export function ogSlug(path: string): string {
  const s = path.replace(/^\/+|\/+$/g, '').replace(/\//g, '--');
  return s || 'home';
}

/** Root-relative path of the share card for a page. */
export function ogImagePath(path: string): string {
  const own = `/og/${ogSlug(path)}.png`;
  return cards.has(own) ? own : '/og-default.png';
}
