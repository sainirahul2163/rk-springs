import { describe, expect, it } from 'vitest';
import { calculatorRfqHref } from './quote';
import { readParams, writeParams } from './url';

const defaults = { d: '', od: '', material: 'hd' };

describe('readParams / writeParams', () => {
  it('fills known keys from the query string', () => {
    expect(readParams('?d=1&od=10&material=music', defaults)).toEqual({
      d: '1',
      od: '10',
      material: 'music',
    });
  });

  it('omits empty and default values when writing', () => {
    expect(writeParams({ d: '1', od: '10', material: 'hd' }, defaults)).toBe('?d=1&od=10');
    expect(writeParams(defaults, defaults)).toBe('');
  });
});

describe('calculatorRfqHref', () => {
  it('builds the RFQ pre-fill URL', () => {
    expect(calculatorRfqHref({ type: 'compression', d: '1', od: '10' })).toBe(
      '/request-a-quote/?type=compression&d=1&od=10',
    );
  });
});
