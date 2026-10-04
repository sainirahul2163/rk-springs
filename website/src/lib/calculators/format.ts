/** Display rounding: 3 significant figures, as required by the build spec. */

export function sigfigs(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return '—';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  const exp = Math.floor(Math.log10(abs));
  const factor = 10 ** (digits - 1 - exp);
  const rounded = Math.round(value * factor) / factor;
  return String(rounded);
}

export function isPositive(raw: string): number | null {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function isNonNegative(raw: string): number | null {
  if (raw.trim() === '') return 0;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}
