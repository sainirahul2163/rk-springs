/** Optional analytics. Scripts load only when the matching public env var is set. */

export const ga4Id = import.meta.env.PUBLIC_GA4_ID ?? '';
export const clarityId = import.meta.env.PUBLIC_CLARITY_ID ?? '';

/** Fire a GA4 event when gtag is present. No-ops if analytics is not loaded. */
export function track(event: string, params?: Record<string, string | number | undefined>): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.('event', event, params);
}
