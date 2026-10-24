/** Build-time environment helpers. */
import { site } from '@/data/site';

// Build-time only (Node); avoids pulling in @types/node for one variable.
declare const process: { env: Record<string, string | undefined> };

/**
 * Canonical origin for every absolute URL (canonical, og:url, JSON-LD, sitemap, robots).
 * Always the final domain from site.ts, in every environment. PUBLIC_SITE_URL no longer
 * changes URLs, so a stale value (e.g. a *.vercel.app address) cannot leak into canonicals.
 */
export const SITE_URL = site.origin;

/** Local only: any PUBLIC_SITE_URL value rehearses an indexable production build. */
const LOCAL_PRODUCTION = Boolean(import.meta.env.PUBLIC_SITE_URL);

/** Show TODO(client) markers and photo placeholders (dev, or an explicit client-review build). */
export const SHOW_TODOS = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_TODOS === 'true';

/**
 * Only a production build may be indexed:
 * - on Vercel, the production environment (preview and development stay noindex);
 * - outside Vercel, a local build with PUBLIC_SITE_URL set (to rehearse production).
 * A client-review build (PUBLIC_SHOW_TODOS) is never indexable.
 */
export const INDEXABLE =
  import.meta.env.PROD &&
  (process.env.VERCEL_ENV === undefined
    ? LOCAL_PRODUCTION
    : process.env.VERCEL_ENV === 'production') &&
  import.meta.env.PUBLIC_SHOW_TODOS !== 'true';

export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE_URL}/`).toString();
}
