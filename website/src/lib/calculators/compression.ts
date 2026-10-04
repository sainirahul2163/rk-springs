import { site } from '@/data/site';
import { calculatorMaterial } from '@/data/materials';
import { isPositive } from './format';

export const END_TYPES = ['closed-ground', 'closed', 'open', 'open-ground'] as const;
export type EndType = (typeof END_TYPES)[number];

export const END_TYPE_LABELS: Record<EndType, string> = {
  'closed-ground': 'Closed and ground',
  closed: 'Closed',
  open: 'Open',
  'open-ground': 'Open and ground',
};

export function activeCoils(totalCoils: number, ends: EndType): number {
  if (ends === 'open') return totalCoils;
  if (ends === 'open-ground') return totalCoils - 1;
  return totalCoils - 2;
}

export function solidHeightMm(totalCoils: number, d: number, ends: EndType): number {
  if (ends === 'closed-ground' || ends === 'open-ground') return totalCoils * d;
  return (totalCoils + 1) * d;
}

export function meanDiameterMm(d: number, od?: number, id?: number): number | null {
  if (od !== undefined && Number.isFinite(od) && od > 0) return od - d;
  if (id !== undefined && Number.isFinite(id) && id > 0) return id + d;
  return null;
}

export function springRateNPerMm(G: number, d: number, D: number, Na: number): number {
  return (G * d ** 4) / (8 * D ** 3 * Na);
}

export function wahlFactor(C: number): number | null {
  if (!Number.isFinite(C) || C <= 1) return null;
  return (4 * C - 1) / (4 * C - 4) + 0.615 / C;
}

export function shearStressMpa(F: number, D: number, d: number, Kw: number): number {
  return (Kw * 8 * F * D) / (Math.PI * d ** 3);
}

export interface CompressionInput {
  d: string;
  od: string;
  id: string;
  l0: string;
  nt: string;
  ends: EndType;
  material: string;
  l1: string;
  l2: string;
}

export interface CompressionResult {
  ok: boolean;
  errors: string[];
  warnings: { id: string; text: string }[];
  d: number | null;
  D: number | null;
  C: number | null;
  Na: number | null;
  k: number | null;
  Ls: number | null;
  L0: number | null;
  loads: { L: number; F: number; tau: number; bind: boolean }[];
}

export function computeCompression(input: CompressionInput): CompressionResult {
  const errors: string[] = [];
  const warnings: { id: string; text: string }[] = [];
  const d = isPositive(input.d);
  const od = input.od.trim() === '' ? undefined : isPositive(input.od);
  const id = input.id.trim() === '' ? undefined : isPositive(input.id);
  const L0 = isPositive(input.l0);
  const Nt = isPositive(input.nt);
  const material = calculatorMaterial(input.material);

  if (d === null) errors.push('Enter a wire diameter greater than 0.');
  if (input.od.trim() && od === null) errors.push('Outer diameter must be greater than 0.');
  if (input.id.trim() && id === null) errors.push('Inner diameter must be greater than 0.');
  if (od === undefined && id === undefined)
    errors.push('Enter an outer diameter or an inner diameter.');
  if (L0 === null) errors.push('Enter a free length greater than 0.');
  if (Nt === null) errors.push('Enter the total number of coils.');

  const D = d !== null ? meanDiameterMm(d, od ?? undefined, id ?? undefined) : null;
  if (d !== null && D !== null && D <= 0)
    errors.push('Mean diameter must be greater than 0. Check OD / ID and wire.');

  const Na = Nt !== null ? activeCoils(Nt, input.ends) : null;
  if (Na !== null && Na <= 0)
    errors.push('Active coils must be greater than 0. Check end type and total coils.');

  if (errors.length) {
    return { ok: false, errors, warnings, d, D, C: null, Na, k: null, Ls: null, L0, loads: [] };
  }

  const C = D! / d!;
  const k = springRateNPerMm(material.gMpa, d!, D!, Na!);
  const Ls = solidHeightMm(Nt!, d!, input.ends);
  const Kw = wahlFactor(C);

  if (C < 4 || C > 12) {
    warnings.push({
      id: 'index',
      text: 'Spring index outside 4–12 is hard to manufacture and the rate is harder to hold.',
    });
  }
  if (L0! / D! > 4) {
    warnings.push({
      id: 'buckle',
      text: 'Free length is more than four times the mean diameter. Guide the spring on a rod or in a bore.',
    });
  }
  if (d! < site.capability.wireMinMm || d! > site.capability.wireMaxMm) {
    warnings.push({
      id: 'wire',
      text: `Wire ${d} mm is outside our standard range of ${site.capability.wireRangeLabel}. Contact us.`,
    });
  }

  const loads: CompressionResult['loads'] = [];
  for (const raw of [input.l1, input.l2]) {
    if (raw.trim() === '') continue;
    const L = isPositive(raw);
    if (L === null) {
      errors.push('Working lengths must be greater than 0.');
      continue;
    }
    const F = k * (L0! - L);
    const bind = L <= Ls;
    if (bind) {
      warnings.push({
        id: `bind-${L}`,
        text: `Working length ${L} mm is at or below solid height. The coils will bind.`,
      });
    }
    const tau = Kw !== null && F > 0 ? shearStressMpa(F, D!, d!, Kw) : NaN;
    loads.push({ L, F, tau, bind });
  }

  return { ok: errors.length === 0, errors, warnings, d, D, C, Na, k, Ls, L0, loads };
}
