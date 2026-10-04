import { describe, expect, it } from 'vitest';
import {
  fromMm,
  fromNewton,
  fromNMmPerDeg,
  fromNPerMm,
  MM_PER_IN,
  N_PER_KGF,
  N_PER_LBF,
  parseAmount,
  toMm,
  toNewton,
  toNMmPerDeg,
  toNPerMm,
} from './convert';

describe('spring rate', () => {
  it('converts 1 N/mm into kgf/mm and lbf/in', () => {
    expect(fromNPerMm(1, 'kgf/mm')).toBeCloseTo(1 / N_PER_KGF, 10);
    expect(fromNPerMm(1, 'lbf/in')).toBeCloseTo(MM_PER_IN / N_PER_LBF, 10);
  });

  it('round-trips each unit through N/mm', () => {
    expect(fromNPerMm(toNPerMm(2.5, 'N/mm'), 'N/mm')).toBeCloseTo(2.5, 10);
    expect(fromNPerMm(toNPerMm(0.2, 'kgf/mm'), 'kgf/mm')).toBeCloseTo(0.2, 10);
    expect(fromNPerMm(toNPerMm(10, 'lbf/in'), 'lbf/in')).toBeCloseTo(10, 10);
  });
});

describe('force, length and torque-per-degree', () => {
  it('uses 1 kgf = 9.80665 N and 1 in = 25.4 mm', () => {
    expect(toNewton(1, 'kgf')).toBe(N_PER_KGF);
    expect(fromNewton(N_PER_LBF, 'lbf')).toBeCloseTo(1, 10);
    expect(toMm(1, 'in')).toBe(MM_PER_IN);
    expect(fromMm(25.4, 'in')).toBeCloseTo(1, 10);
  });

  it('round-trips torque per degree', () => {
    expect(fromNMmPerDeg(toNMmPerDeg(8, 'N·mm/°'), 'N·mm/°')).toBeCloseTo(8, 10);
    expect(fromNMmPerDeg(toNMmPerDeg(1, 'lbf·in/°'), 'lbf·in/°')).toBeCloseTo(1, 10);
    expect(fromNMmPerDeg(toNMmPerDeg(1, 'kgf·mm/°'), 'kgf·mm/°')).toBeCloseTo(1, 10);
  });
});

describe('parseAmount', () => {
  it('accepts any finite number and rejects blank or NaN', () => {
    expect(parseAmount('0')).toBe(0);
    expect(parseAmount('-3.2')).toBe(-3.2);
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
  });
});
