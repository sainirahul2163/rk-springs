import { describe, expect, it } from 'vitest';
import { calculatorMaterial } from '@/data/materials';
import { springRateNPerMm } from './compression';
import { activeCoilsExtension, bodyLengthMm, computeExtension } from './extension';

const music = calculatorMaterial('music');

const required = {
  d: '1',
  od: '10',
  nb: '20',
  fi: '0',
  x: '5',
  material: 'music',
};

describe('activeCoilsExtension', () => {
  it('matches the required music-wire example: Nb=20 → Na=20.395', () => {
    const Na = activeCoilsExtension(20, music.gMpa, music.eMpa);
    expect(Na).toBeCloseTo(20.395, 3);
    expect(Na).toBeCloseTo(20 + 81_700 / 206_800, 10);
  });
});

describe('bodyLengthMm', () => {
  it('is (Nb + 1) · d', () => {
    expect(bodyLengthMm(20, 1)).toBe(21);
  });
});

describe('computeExtension', () => {
  it('uses Na = Nb + G/E in the rate and F = Fi + k · x', () => {
    const result = computeExtension(required);
    expect(result.ok).toBe(true);
    expect(result.Na).toBeCloseTo(20.395, 3);
    expect(result.k).toBeCloseTo(springRateNPerMm(music.gMpa, 1, 9, result.Na!), 10);
    expect(result.F).toBeCloseTo(result.k! * 5, 10);
    expect(result.warnings.some((w) => w.id === 'hook')).toBe(true);
  });

  it('rejects zero, negative and NaN inputs', () => {
    expect(computeExtension({ ...required, d: '0' }).ok).toBe(false);
    expect(computeExtension({ ...required, d: '-1' }).ok).toBe(false);
    expect(computeExtension({ ...required, od: 'foo' }).ok).toBe(false);
    expect(computeExtension({ ...required, nb: '-2' }).ok).toBe(false);
    expect(computeExtension({ ...required, fi: '-1' }).ok).toBe(false);
  });

  it('treats blank initial tension and extension as zero', () => {
    const result = computeExtension({ ...required, fi: '', x: '' });
    expect(result.ok).toBe(true);
    expect(result.Fi).toBe(0);
    expect(result.x).toBe(0);
    expect(result.F).toBe(0);
  });

  it('warns when C is outside 4–12', () => {
    const result = computeExtension({ ...required, d: '2', od: '6' });
    expect(result.C).toBe(2);
    expect(result.warnings.some((w) => w.id === 'index')).toBe(true);
  });
});
