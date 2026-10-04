import { describe, expect, it } from 'vitest';
import { isNonNegative, isPositive, sigfigs } from './format';

describe('sigfigs', () => {
  it('rounds to three significant figures for display', () => {
    expect(sigfigs(1.751157)).toBe('1.75');
    expect(sigfigs(20.39497)).toBe('20.4');
    expect(sigfigs(0)).toBe('0');
    expect(sigfigs(Number.NaN)).toBe('—');
  });
});

describe('parsers', () => {
  it('isPositive rejects zero, negative and NaN', () => {
    expect(isPositive('1.2')).toBe(1.2);
    expect(isPositive('0')).toBeNull();
    expect(isPositive('-4')).toBeNull();
    expect(isPositive('foo')).toBeNull();
  });

  it('isNonNegative treats a blank as 0', () => {
    expect(isNonNegative('')).toBe(0);
    expect(isNonNegative('0')).toBe(0);
    expect(isNonNegative('3')).toBe(3);
    expect(isNonNegative('-1')).toBeNull();
  });
});
