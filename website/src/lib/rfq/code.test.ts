import { describe, expect, it } from 'vitest';
import { makeRfqCode, RFQ_CODE_RE } from './code';

describe('makeRfqCode', () => {
  it('uses the UTC date and a 4-character suffix', () => {
    const code = makeRfqCode(new Date('2026-10-04T08:00:00Z'), () => 0);
    expect(code).toBe('RFQ-20261004-AAAA');
    expect(RFQ_CODE_RE.test(code)).toBe(true);
  });

  it('never emits I, O, 0 or 1 in the suffix', () => {
    expect(RFQ_CODE_RE.test('RFQ-20261004-7K2P')).toBe(true);
    expect(RFQ_CODE_RE.test('RFQ-20261004-IO01')).toBe(false);
    expect(RFQ_CODE_RE.test('rfq-20261004-7K2P')).toBe(false);
  });
});
