/** Unit conversions used by the spring-rate converter. */

export const N_PER_KGF = 9.80665;
export const N_PER_LBF = 4.4482216152605;
export const MM_PER_IN = 25.4;

export type RateUnit = 'N/mm' | 'kgf/mm' | 'lbf/in';
export type ForceUnit = 'N' | 'kgf' | 'lbf';
export type LengthUnit = 'mm' | 'in';
export type TorqueUnit = 'N·mm/°' | 'kgf·mm/°' | 'lbf·in/°';

export function toNPerMm(value: number, unit: RateUnit): number {
  if (unit === 'N/mm') return value;
  if (unit === 'kgf/mm') return value * N_PER_KGF;
  return (value * N_PER_LBF) / MM_PER_IN;
}

export function fromNPerMm(nPerMm: number, unit: RateUnit): number {
  if (unit === 'N/mm') return nPerMm;
  if (unit === 'kgf/mm') return nPerMm / N_PER_KGF;
  return (nPerMm * MM_PER_IN) / N_PER_LBF;
}

export function toNewton(value: number, unit: ForceUnit): number {
  if (unit === 'N') return value;
  if (unit === 'kgf') return value * N_PER_KGF;
  return value * N_PER_LBF;
}

export function fromNewton(n: number, unit: ForceUnit): number {
  if (unit === 'N') return n;
  if (unit === 'kgf') return n / N_PER_KGF;
  return n / N_PER_LBF;
}

export function toMm(value: number, unit: LengthUnit): number {
  return unit === 'mm' ? value : value * MM_PER_IN;
}

export function fromMm(mm: number, unit: LengthUnit): number {
  return unit === 'mm' ? mm : mm / MM_PER_IN;
}

/** Convert a torque-per-degree value into N·mm/°. */
export function toNMmPerDeg(value: number, unit: TorqueUnit): number {
  if (unit === 'N·mm/°') return value;
  if (unit === 'kgf·mm/°') return value * N_PER_KGF;
  return value * N_PER_LBF * MM_PER_IN;
}

export function fromNMmPerDeg(nMm: number, unit: TorqueUnit): number {
  if (unit === 'N·mm/°') return nMm;
  if (unit === 'kgf·mm/°') return nMm / N_PER_KGF;
  return nMm / (N_PER_LBF * MM_PER_IN);
}

export function parseAmount(raw: string): number | null {
  if (raw.trim() === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
