/** Build-time environment helpers. */

// Build-time only (Node); avoids pulling in @types/node for one variable.
declare const process: { env: Record<string, string | undefined> };

export const SITE_URL = (import.meta.env.PUBLIC_SITE_URL || import.meta.env.SITE || '').replace(
  /\/+$/,
  '',
);

if (process.env.VERCEL_ENV === 'production' && !import.meta.env.PUBLIC_SITE_URL) {
  throw new Error('PUBLIC_SITE_URL is required for production deploys.');
}

/** Show TODO(client) markers and photo placeholders (dev, or an explicit client-review build). */
export const SHOW_TODOS = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_TODOS === 'true';

/**
 * Only a production build with a real site URL, on Vercel's production environment (or outside
 * Vercel), may be indexed. Preview deployments and local builds are always noindex.
 */
export const INDEXABLE =
  import.meta.env.PROD &&
  Boolean(import.meta.env.PUBLIC_SITE_URL) &&
  (process.env.VERCEL_ENV === undefined || process.env.VERCEL_ENV === 'production') &&
  import.meta.env.PUBLIC_SHOW_TODOS !== 'true';

export function absoluteUrl(path: string): string {
  const base = SITE_URL || 'http://localhost:4321';
  return new URL(path, `${base}/`).toString();
}
