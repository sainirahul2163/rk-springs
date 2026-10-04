/**
 * Shared RFQ field schema. Used by the form (client) and POST /api/rfq (server).
 */
import { z } from 'zod';

export const SPRING_TYPES = [
  'torsion',
  'double-torsion',
  'extension',
  'compression',
  'conical',
  'spiral',
  'wire-form',
  'not-sure',
  'general',
] as const;

export type SpringType = (typeof SPRING_TYPES)[number];

export const SPRING_TYPE_LABELS: Record<SpringType, string> = {
  torsion: 'Torsion',
  'double-torsion': 'Double torsion',
  extension: 'Tension / extension',
  compression: 'Compression',
  conical: 'Conical',
  spiral: 'Spiral',
  'wire-form': 'Wire form',
  'not-sure': 'Not sure',
  general: 'General enquiry',
};

export const RFQ_SPRING_TYPES = SPRING_TYPES.filter((t) => t !== 'general');

export const TYPE_ALIASES: Record<string, SpringType> = {
  torsion: 'torsion',
  'double-torsion': 'double-torsion',
  double_torsion: 'double-torsion',
  doubletorsion: 'double-torsion',
  extension: 'extension',
  tension: 'extension',
  'tension-extension': 'extension',
  compression: 'compression',
  conical: 'conical',
  spiral: 'spiral',
  'wire-form': 'wire-form',
  wire_form: 'wire-form',
  wireform: 'wire-form',
  'not-sure': 'not-sure',
  general: 'general',
};

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** 10-digit Indian mobile, after stripping +91 / leading 0. */
export function nationalMobile(raw: string): string | null {
  let digits = digitsOnly(raw).replace(/^0+/, '');
  if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export function e164FromInput(raw: string): string | null {
  const national = nationalMobile(raw);
  return national ? `+91${national}` : null;
}

export const SPEC_KEYS = [
  'material',
  'wire_d',
  'od',
  'id',
  'free_length',
  'coils',
  'wind_direction',
  'finish',
  'target_date',
  'end_type',
  'load_l1',
  'length_l1',
  'load_l2',
  'length_l2',
  'solid_height',
  'length_inside_hooks',
  'hook_type',
  'hook_orientation',
  'initial_tension',
  'leg_length_1',
  'leg_length_2',
  'leg_shape_1',
  'leg_shape_2',
  'free_angle',
  'torque_at_angle',
  'shaft_d',
  'loading_direction',
  'centre_loop_width',
  'bend_notes',
] as const;

export type SpecKey = (typeof SPEC_KEYS)[number];

const specString = z.string().max(2000);

export const specsSchema = z
  .object({
    material: specString,
    wire_d: specString,
    od: specString,
    id: specString,
    free_length: specString,
    coils: specString,
    wind_direction: specString,
    finish: specString,
    target_date: specString,
    end_type: specString,
    load_l1: specString,
    length_l1: specString,
    load_l2: specString,
    length_l2: specString,
    solid_height: specString,
    length_inside_hooks: specString,
    hook_type: specString,
    hook_orientation: specString,
    initial_tension: specString,
    leg_length_1: specString,
    leg_length_2: specString,
    leg_shape_1: specString,
    leg_shape_2: specString,
    free_angle: specString,
    torque_at_angle: specString,
    shaft_d: specString,
    loading_direction: specString,
    centre_loop_width: specString,
    bend_notes: specString,
  })
  .partial();

export const rfqFieldsSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your name.').max(80),
    company: z.string().trim().max(120),
    phone: z
      .string()
      .trim()
      .refine((value) => nationalMobile(value) !== null, 'Enter a 10-digit Indian mobile number.'),
    email: z
      .string()
      .trim()
      .max(120)
      .refine(
        (value) => value === '' || z.email().safeParse(value).success,
        'Enter a valid email, or leave it blank.',
      ),
    city: z.string().trim().max(80),
    spring_type: z.enum(SPRING_TYPES, { message: 'Choose a spring type.' }),
    quantity: z.string().trim().max(20),
    notes: z.string().trim().max(4000),
    sample_coming: z.boolean(),
    consent: z
      .boolean()
      .refine((value) => value, 'Please accept the privacy note to send the request.'),
    source_page: z.string().trim().max(300).optional(),
    utm: z.record(z.string(), z.string()).optional(),
    specs: specsSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.spring_type !== 'general') {
      if (data.company.length < 2) {
        ctx.addIssue({ code: 'custom', path: ['company'], message: 'Enter the company name.' });
      }
      const n = Number(data.quantity.replace(/,/g, ''));
      if (!Number.isInteger(n) || n < 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['quantity'],
          message: 'Enter the quantity as a whole number.',
        });
      }
    }
    if (data.spring_type === 'general' && data.notes.length < 4) {
      ctx.addIssue({ code: 'custom', path: ['notes'], message: 'Tell us what you need.' });
    }
  });

export type RfqFields = z.infer<typeof rfqFieldsSchema>;

export function parseSpecs(form: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of SPEC_KEYS) {
    const value = String(form.get(key) ?? '').trim();
    if (value && value !== 'not-sure') out[key] = value;
  }
  return out;
}

export function boolFromForm(form: FormData, name: string): boolean {
  const value = form.get(name);
  return value === 'on' || value === 'true' || value === '1';
}

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
