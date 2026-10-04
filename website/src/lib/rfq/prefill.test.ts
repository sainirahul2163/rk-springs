import { describe, expect, it } from 'vitest';
import { parsePrefill, readUtm } from './prefill';

describe('parsePrefill', () => {
  it('maps type aliases and calculator query keys', () => {
    const parsed = parsePrefill(
      '?type=tension&d=1.2&od=10&L0=40&ends=closed-ground&material=music',
    );
    expect(parsed.type).toBe('extension');
    expect(parsed.specs).toEqual({
      wire_d: '1.2',
      od: '10',
      free_length: '40',
      end_type: 'closed-ground',
      material: 'Music wire (on request)',
    });
  });

  it('ignores an unknown type', () => {
    expect(parsePrefill('?type=banana').type).toBe('');
  });
});

describe('readUtm', () => {
  it('merges new params over stored values', () => {
    const stored = JSON.stringify({ utm_source: 'old', utm_medium: 'email' });
    const next = readUtm('?utm_source=india-mart', stored);
    expect(next).toEqual({ utm_source: 'india-mart', utm_medium: 'email' });
  });
});
