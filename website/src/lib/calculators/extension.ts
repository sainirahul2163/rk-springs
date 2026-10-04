import { site } from '@/data/site';
import { calculatorMaterial } from '@/data/materials';
import { isNonNegative, isPositive } from './format';
import { meanDiameterMm, springRateNPerMm, wahlFactor, shearStressMpa } from './compression';

export interface ExtensionInput {
  d: string;
  od: string;
  nb: string;
  fi: string;
  x: string;
  material: string;
}

export interface ExtensionResult {
  ok: boolean;
  errors: string[];
  warnings: { id: string; text: string }[];
  d: number | null;
  D: number | null;
  C: number | null;
  Na: number | null;
  k: number | null;
  body: number | null;
  Fi: number | null;
  x: number | null;
  F: number | null;
  tau: number | null;
}

export function activeCoilsExtension(bodyCoils: number, G: number, E: number): number {
  return bodyCoils + G / E;
}

export function bodyLengthMm(bodyCoils: number, d: number): number {
  return (bodyCoils + 1) * d;
}

export function computeExtension(input: ExtensionInput): ExtensionResult {
  const errors: string[] = [];
  const warnings: { id: string; text: string }[] = [];
  const d = isPositive(input.d);
  const od = isPositive(input.od);
  const Nb = isPositive(input.nb);
  const Fi = isNonNegative(input.fi);
  const x = input.x.trim() === '' ? 0 : isNonNegative(input.x);
  const material = calculatorMaterial(input.material);

  if (d === null) errors.push('Enter a wire diameter greater than 0.');
  if (od === null) errors.push('Enter an outer diameter greater than 0.');
  if (Nb === null) errors.push('Enter the number of body coils.');
  if (Fi === null) errors.push('Initial tension must be 0 or greater.');
  if (x === null) errors.push('Extension must be 0 or greater.');

  const D = d !== null && od !== null ? meanDiameterMm(d, od) : null;
  if (d !== null && D !== null && D <= 0)
    errors.push('Mean diameter must be greater than 0. Check OD and wire.');

  if (errors.length) {
    return {
      ok: false,
      errors,
      warnings,
      d,
      D,
      C: null,
      Na: null,
      k: null,
      body: null,
      Fi,
      x,
      F: null,
      tau: null,
    };
  }

  const C = D! / d!;
  const Na = activeCoilsExtension(Nb!, material.gMpa, material.eMpa);
  const k = springRateNPerMm(material.gMpa, d!, D!, Na);
  const body = bodyLengthMm(Nb!, d!);
  const F = Fi! + k * x!;
  const Kw = wahlFactor(C);
  const tau = Kw !== null && F > 0 ? shearStressMpa(F, D!, d!, Kw) : null;

  if (C < 4 || C > 12) {
    warnings.push({
      id: 'index',
      text: 'Spring index outside 4–12 is hard to manufacture and the rate is harder to hold.',
    });
  }
  if (d! < site.capability.wireMinMm || d! > site.capability.wireMaxMm) {
    warnings.push({
      id: 'wire',
      text: `Wire ${d} mm is outside our standard range of ${site.capability.wireRangeLabel}. Contact us.`,
    });
  }
  warnings.push({
    id: 'hook',
    text: 'Hook stress is higher than body stress. The hook usually fails first. Treat the body stress as a lower bound.',
  });

  return { ok: true, errors, warnings, d, D, C, Na, k, body, Fi, x, F, tau };
}
