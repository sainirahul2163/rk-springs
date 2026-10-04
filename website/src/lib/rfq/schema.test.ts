import { describe, expect, it } from 'vitest';
import { e164FromInput, fieldErrors, nationalMobile, rfqFieldsSchema } from './schema';

const valid = {
  name: 'Anita Deshmukh',
  company: 'Deshmukh Auto',
  phone: '7262092185',
  email: 'anita@example.com',
  city: 'Pune',
  spring_type: 'torsion' as const,
  quantity: '8000',
  notes: 'Used in a two-wheeler switch.',
  sample_coming: false,
  consent: true,
};

describe('nationalMobile', () => {
  it('accepts 10-digit numbers starting 6–9', () => {
    expect(nationalMobile('7262092185')).toBe('7262092185');
    expect(nationalMobile('+91 72620 92185')).toBe('7262092185');
    expect(nationalMobile('0917262092185')).toBe('7262092185');
  });

  it('rejects landlines and short numbers', () => {
    expect(nationalMobile('0201234567')).toBeNull();
    expect(nationalMobile('98765')).toBeNull();
    expect(nationalMobile('5123456789')).toBeNull();
  });
});

describe('e164FromInput', () => {
  it('normalises to +91', () => {
    expect(e164FromInput('+91 72620 92185')).toBe('+917262092185');
  });
});

describe('rfqFieldsSchema', () => {
  it('accepts a complete RFQ', () => {
    const parsed = rfqFieldsSchema.parse(valid);
    expect(parsed.company).toBe('Deshmukh Auto');
    expect(parsed.spring_type).toBe('torsion');
  });

  it('requires company and quantity on a quote', () => {
    const result = rfqFieldsSchema.safeParse({ ...valid, company: '', quantity: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrors(result.error);
      expect(errors.company).toMatch(/company/i);
      expect(errors.quantity).toMatch(/quantity/i);
    }
  });

  it('rejects a bad phone', () => {
    const result = rfqFieldsSchema.safeParse({ ...valid, phone: '12345' });
    expect(result.success).toBe(false);
  });

  it('allows a blank email and rejects a broken one', () => {
    expect(rfqFieldsSchema.safeParse({ ...valid, email: '' }).success).toBe(true);
    expect(rfqFieldsSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });

  it('requires consent', () => {
    const result = rfqFieldsSchema.safeParse({ ...valid, consent: false });
    expect(result.success).toBe(false);
  });

  it('allows a general enquiry without quantity', () => {
    const result = rfqFieldsSchema.safeParse({
      ...valid,
      spring_type: 'general',
      company: '',
      quantity: '',
      notes: 'Need a contact about MCB springs.',
    });
    expect(result.success).toBe(true);
  });

  it('requires a note on a general enquiry', () => {
    const result = rfqFieldsSchema.safeParse({
      ...valid,
      spring_type: 'general',
      notes: 'hi',
    });
    expect(result.success).toBe(false);
  });
});
