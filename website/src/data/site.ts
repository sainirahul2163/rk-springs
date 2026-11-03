/**
 * Single source of truth for company facts. Every value here comes from CLIENT-PROFILE.md.
 * Name, address and phone must render identically everywhere, so always read them from here.
 */

export type DayName =
  'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Phone {
  display: string;
  e164: string;
  whatsapp: boolean;
}

export const site = {
  brand: 'RK Springs & Wireforms',
  shortBrand: 'RK Springs',
  legalName: 'RK Enterprises',
  legalForm: 'Proprietorship',
  brandLine: 'RK Springs & Wireforms is a brand of RK Enterprises',
  // TODO(client): confirm proprietor's surname (probably Kashid) before publishing it.
  founder: { givenName: 'Rutvik', familyName: null as string | null },
  foundingYear: 2017,
  gstin: '27BDSPK0577Q1ZL',
  udyam: 'UDYAM-MH-26-0706268',

  /**
   * Final domain, chosen by the client on 23 Oct 2026. `www` is the one canonical host;
   * the bare domain 308-redirects to it (vercel.json). PUBLIC_SITE_URL can still override.
   */
  domain: 'rksprings.com',
  origin: 'https://www.rksprings.com',
  /** IndexNow key (public by design; the same value is served at /<key>.txt). */
  indexNowKey: 'bd9d2b2fcc9721684fc2fb79e97dc478',

  address: {
    street: 'Sr. No. 166, Sai Krupa Society, Sahyog Nagar',
    locality: 'Talawade',
    city: 'Pune',
    region: 'Maharashtra',
    postalCode: '411062',
    country: 'India',
    countryCode: 'IN',
  },
  areaContext:
    'Talawade, in the Pimpri-Chinchwad (PCMC) industrial belt, close to Chikhali, Bhosari MIDC and Chakan',

  // TODO(client): factory-gate map pin. Until then maps link to an address search.
  geo: null as { latitude: number; longitude: number } | null,

  // TODO(client): confirm +91 72620 92185 is the main number.
  phones: [
    { display: '+91 72620 92185', e164: '+917262092185', whatsapp: true },
    { display: '+91 97679 01954', e164: '+919767901954', whatsapp: false },
  ],

  // TODO(client): pick the main email; plan a domain address such as sales@<domain>.
  emails: ['rkent102017@gmail.com', 'rutvikkashid.rkent@gmail.com'],

  hours: {
    openDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'] as DayName[],
    closedDays: ['Thursday'] as DayName[],
    opens: '09:00',
    closes: '20:00',
    summary: 'Mon–Wed and Fri–Sun, 9:00 AM – 8:00 PM · Thursday closed',
  },

  capability: {
    wireMinMm: 0.4,
    wireMaxMm: 2.5,
    wireRangeLabel: 'Ø 0.40–2.50 mm',
    sizeNote: 'Outer diameter and length as per your drawing',
    materials: [
      'Spring steel (hard-drawn grades)',
      'Music wire (on request)',
      'Stainless steel 302 / 304 / 316',
      'Oil-tempered wire',
    ],
    inHouse: ['Spring coiling and forming', 'Stress-relieving furnace', 'End grinding'],
    viaPartners: ['Plating', 'Finishing', 'Other secondary operations'],
  },

  terms: {
    moq: '5,000–10,000 pcs',
    moqNote: 'Smaller runs are possible with development or setup charges.',
    quote: 'Within 24 hours',
    payment: 'Immediate, or within 30 days',
    delivery: 'Ex-works Talawade (transport not included)',
    supplyArea: 'All over India',
  },

  certifications: {
    // TODO(client): ZED level and certificate PDF.
    zed: { certified: true, level: null as string | null },
  },

  // TODO(client): IndiaMART, Justdial, Google Business Profile, LinkedIn, YouTube URLs.
  sameAs: [] as string[],
} as const;

export const phones: readonly Phone[] = site.phones;
export const primaryPhone: Phone = site.phones[0];
export const whatsappPhone: Phone = phones.find((p) => p.whatsapp) ?? primaryPhone;
export const primaryEmail = site.emails[0];

export const fullAddress = [
  site.address.street,
  site.address.locality,
  `${site.address.city}, ${site.address.region} ${site.address.postalCode}`,
  site.address.country,
].join(', ');

export const mapUrl = site.geo
  ? `https://www.google.com/maps/search/?api=1&query=${site.geo.latitude},${site.geo.longitude}`
  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

export const yearsLabel = `Since ${site.foundingYear}`;
