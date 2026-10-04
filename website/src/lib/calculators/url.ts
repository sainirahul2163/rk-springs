/** Keep calculator inputs in the query string so a result can be bookmarked. */

export function readParams<T extends Record<string, string>>(search: string, defaults: T): T {
  const query = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const next = { ...defaults };
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const value = query.get(String(key));
    if (value !== null) next[key] = value as T[keyof T];
  }
  return next;
}

export function writeParams(
  values: Record<string, string>,
  defaults: Record<string, string>,
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== '' && value !== defaults[key]) query.set(key, value);
  }
  const encoded = query.toString();
  return encoded ? `?${encoded}` : '';
}

export function replaceSearch(search: string): void {
  if (typeof window === 'undefined') return;
  const url = `${window.location.pathname}${search}${window.location.hash}`;
  window.history.replaceState(null, '', url);
}
