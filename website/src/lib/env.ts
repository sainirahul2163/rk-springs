/** Build-time environment helpers. */
import { site } from '@/data/site';

// Build-time only (Node); avoids pulling in @types/node for one variable.
declare const process: { env: Record<string, string | undefined> };

/** Explicit origin override (no trailing slash). Empty means "use the final domain". */
const OVERRIDE = (import.meta.env.PUBLIC_SITE_URL || '').replace(/\/+$/, '');

/**
 * Canonical origin for every absolute URL (canonical, og:url, JSON-LD, sitemap, robots).
 * Always the production domain unless PUBLIC_SITE_URL overrides it, so a preview or local
 * build never emits localhost canonicals.
 */
export const SITE_URL = OVERRIDE || site.origin;

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
    ? Boolean(OVERRIDE)
    : process.env.VERCEL_ENV === 'production') &&
  import.meta.env.PUBLIC_SHOW_TODOS !== 'true';

export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE_URL}/`).toString();
}
