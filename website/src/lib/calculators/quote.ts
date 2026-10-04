import { routes } from '@/data/routes';

/** Build `/request-a-quote/?type=&d=&od=…` from calculator fields. */
export function calculatorRfqHref(params: Record<string, string>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value.trim()) query.set(key, value.trim());
  }
  const encoded = query.toString();
  return encoded ? `${routes.rfq.path}?${encoded}` : routes.rfq.path;
}
