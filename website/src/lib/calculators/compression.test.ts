import { describe, expect, it } from 'vitest';
import { calculatorMaterial } from '@/data/materials';
import {
  activeCoils,
  computeCompression,
  meanDiameterMm,
  solidHeightMm,
  springRateNPerMm,
  wahlFactor,
} from './compression';

const music = calculatorMaterial('music');

const required = {
  d: '1',
  od: '10',
  id: '',
  l0: '40',
  nt: '10',
  ends: 'closed-ground' as const,
  material: 'music',
  l1: '',
  l2: '',
};

describe('springRateNPerMm', () => {
  it('matches the required music-wire example: d=1, D=9, Na=8 → k=1.751 N/mm', () => {
    const k = springRateNPerMm(music.gMpa, 1, 9, 8);
    expect(k).toBeCloseTo(1.751, 3);
    expect(k).toBeCloseTo(81_700 / (8 * 729 * 8), 10);
  });
});

describe('activeCoils and solidHeightMm', () => {
  it('applies the four end types', () => {
    expect(activeCoils(10, 'closed-ground')).toBe(8);
    expect(activeCoils(10, 'closed')).toBe(8);
    expect(activeCoils(10, 'open')).toBe(10);
    expect(activeCoils(10, 'open-ground')).toBe(9);

    expect(solidHeightMm(10, 1, 'closed-ground')).toBe(10);
    expect(solidHeightMm(10, 1, 'closed')).toBe(11);
    expect(solidHeightMm(10, 1, 'open')).toBe(11);
    expect(solidHeightMm(10, 1, 'open-ground')).toBe(10);
  });
});

describe('meanDiameterMm and wahlFactor', () => {
  it('uses OD − d, or ID + d', () => {
    expect(meanDiameterMm(1, 10)).toBe(9);
    expect(meanDiameterMm(1, undefined, 8)).toBe(9);
  });

  it('returns null when C ≤ 1', () => {
    expect(wahlFactor(1)).toBeNull();
    expect(wahlFactor(0)).toBeNull();
  });

  it('computes Wahl for C = 9', () => {
    expect(wahlFactor(9)).toBeCloseTo((4 * 9 - 1) / (4 * 9 - 4) + 0.615 / 9, 10);
  });
});

describe('computeCompression', () => {
  it('returns the required rate and derived geometry', () => {
    const result = computeCompression(required);
    expect(result.ok).toBe(true);
    expect(result.D).toBe(9);
    expect(result.Na).toBe(8);
    expect(result.C).toBe(9);
    expect(result.k).toBeCloseTo(1.751, 3);
    expect(result.Ls).toBe(10);
  });

  it('rejects zero, negative and NaN inputs', () => {
    expect(computeCompression({ ...required, d: '0' }).ok).toBe(false);
    expect(computeCompression({ ...required, d: '-1' }).ok).toBe(false);
    expect(computeCompression({ ...required, d: 'abc' }).ok).toBe(false);
    expect(computeCompression({ ...required, od: '', id: '' }).ok).toBe(false);
    expect(computeCompression({ ...required, nt: '1', ends: 'closed-ground' }).ok).toBe(false);
  });

  it('warns when the spring index is outside 4–12', () => {
    const tight = computeCompression({ ...required, d: '2', od: '6' });
    expect(tight.C).toBe(2);
    expect(tight.warnings.some((w) => w.id === 'index')).toBe(true);

    const loose = computeCompression({ ...required, d: '1', od: '15' });
    expect(loose.C).toBe(14);
    expect(loose.warnings.some((w) => w.id === 'index')).toBe(true);
  });

  it('warns on buckling, coil bind and wire outside 0.40–2.50 mm', () => {
    const buckle = computeCompression({ ...required, l0: '50' });
    expect(buckle.warnings.some((w) => w.id === 'buckle')).toBe(true);

    const bind = computeCompression({ ...required, l1: '10' });
    expect(bind.loads[0]?.bind).toBe(true);
    expect(bind.warnings.some((w) => w.id.startsWith('bind'))).toBe(true);

    const thin = computeCompression({ ...required, d: '0.2', od: '2' });
    expect(thin.warnings.some((w) => w.id === 'wire')).toBe(true);
  });

  it('computes load from F = k · (L0 − L)', () => {
    const result = computeCompression({ ...required, l1: '30' });
    expect(result.ok).toBe(true);
    expect(result.k).not.toBeNull();
    expect(result.loads[0]?.F).toBeCloseTo(result.k! * 10, 10);
  });

  it('warns when free length is at or below solid height', () => {
    const result = computeCompression({ ...required, l0: '10' });
    expect(result.warnings.some((w) => w.id === 'free-solid')).toBe(true);
  });

  it('warns when a working length is greater than free length', () => {
    const result = computeCompression({ ...required, l1: '50' });
    expect(result.warnings.some((w) => w.id.startsWith('neg'))).toBe(true);
    expect(result.loads[0]?.F).toBeLessThan(0);
  });

  it('uses OD and warns when both OD and ID are entered', () => {
    const result = computeCompression({ ...required, od: '10', id: '8' });
    expect(result.D).toBe(9);
    expect(result.warnings.some((w) => w.id === 'od-used')).toBe(true);
  });
});
