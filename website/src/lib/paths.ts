import { routes } from '@/data/routes';

/** Normalise a pathname to the trailing-slash form used in `routes`. */
export function normalisePath(pathname: string): string {
  if (pathname === '/404' || pathname === '/404.html' || pathname === '/404/') return '/404/';
  let p = pathname.replace(/index\.html$/, '').replace(/\.html$/, '/');
  if (!p.startsWith('/')) p = `/${p}`;
  if (p !== '/' && !p.endsWith('/')) p += '/';
  return p;
}

/** True when the path should appear in the sitemap and be indexed. */
export function isIndexablePath(pathname: string): boolean {
  const p = normalisePath(pathname);
  if (p === '/404/') return false;
  const match = Object.values(routes).find((r) => r.path === p);
  if (!match) return false;
  return match.status === 'live' && !('noindex' in match && match.noindex);
}
