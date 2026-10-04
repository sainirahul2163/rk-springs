/** Materials we actually buy and coil. Only grades from CLIENT-PROFILE.md. */
/** G and E are typical published values (SMI / Lee Spring), not measured here. */

export interface CalculatorMaterial {
  id: string;
  label: string;
  /** Typical shear modulus, MPa (N/mm²). */
  gMpa: number;
  /** Typical Young's modulus, MPa. */
  eMpa: number;
  /** Value written into the RFQ material field. */
  rfqValue: string;
}

export const calculatorMaterials: readonly CalculatorMaterial[] = [
  {
    id: 'music',
    label: 'Music wire (typical)',
    gMpa: 81_700,
    eMpa: 206_800,
    rfqValue: 'Music wire (on request)',
  },
  {
    id: 'hd',
    label: 'Hard-drawn spring steel (typical)',
    gMpa: 79_300,
    eMpa: 200_000,
    rfqValue: 'Spring steel (hard-drawn grades)',
  },
  {
    id: 'ot',
    label: 'Oil-tempered (typical)',
    gMpa: 77_200,
    eMpa: 196_500,
    rfqValue: 'Oil-tempered wire',
  },
  {
    id: 'ss304',
    label: 'Stainless 302 / 304 (typical)',
    gMpa: 69_000,
    eMpa: 193_000,
    rfqValue: 'Stainless steel 302 / 304 / 316',
  },
  {
    id: 'ss316',
    label: 'Stainless 316 (typical)',
    gMpa: 69_000,
    eMpa: 193_000,
    rfqValue: 'Stainless steel 302 / 304 / 316',
  },
];

export function calculatorMaterial(id: string): CalculatorMaterial {
  return calculatorMaterials.find((m) => m.id === id) ?? calculatorMaterials[1]!;
}

export interface MaterialRow {
  name: string;
  standard: string;
  when: string;
}

export const materials: readonly MaterialRow[] = [
  {
    name: 'Spring steel (hard-drawn grades)',
    standard: 'Typical of IS 4454-1 / EN 10270-1 cold-drawn carbon wire',
    when: 'Everyday torsion, extension, compression and wire forms where the part stays dry and the load is not highly cyclic.',
  },
  {
    name: 'Music wire',
    standard: 'Typical of ASTM A228 / IS 4454-1 grade DH',
    when: 'On request, for small precision springs that need a higher tensile strength than hard-drawn wire.',
  },
  {
    name: 'Stainless steel 302 / 304',
    standard: 'Typical of ASTM A313 / IS 4454-4',
    when: 'Damp, outdoor or electrical work where rust on carbon steel would be a problem.',
  },
  {
    name: 'Stainless steel 316',
    standard: 'Typical of ASTM A313 Type 316',
    when: 'Chlorides or chemical splash. Tell us if the spring will see salt or cleaning chemicals.',
  },
  {
    name: 'Oil-tempered wire',
    standard: 'Typical of IS 4454-2 / EN 10270-2',
    when: 'On request, toward the upper end of our 0.40–2.50 mm range, for general industrial use.',
  },
];
