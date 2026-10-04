/**
 * Copy and specs for spring product pages. Facts from CLIENT-PROFILE.md;
 * engineering explanation from RESEARCH-AND-SEO-BLUEPRINT.md §1.2–1.3,
 * trimmed so we never claim a process, finish or application we do not do.
 */
import type { FaqItem } from '@/components/ui/FAQ.astro';
import type { SpecRow } from '@/components/ui/SpecTable.astro';
import type { RelatedLink } from '@/components/ui/RelatedLinks.astro';
import type { DiagramKey } from './navigation';
import type { RouteId } from './routes';
import { site } from './site';

export interface ProductPage {
  route: RouteId;
  /** Page title without the brand suffix (keep ≤ 35 characters). */
  title: string;
  description: string;
  h1: string;
  lede: string;
  context: string;
  rfqQuery: string;
  diagram: DiagramKey;
  photoCaption: string;
  specs: readonly SpecRow[];
  drawingNotes: readonly string[];
  processNote: string;
  faqs: readonly FaqItem[];
  related: readonly RelatedLink[];
  howWeMake?: readonly RelatedLink[];
  usedIn?: readonly RelatedLink[];
}

const moq = site.terms.moq;
const wire = site.capability.wireRangeLabel;
const materialsList = [...site.capability.materials];

function baseSpecs(endLabel: string, endValue: string): SpecRow[] {
  return [
    { label: 'Wire diameter', value: wire },
    { label: 'Outer diameter and length', value: site.capability.sizeNote },
    { label: 'Materials', value: materialsList },
    { label: endLabel, value: endValue },
    {
      label: 'Finishes',
      value: 'Plating and other finishing through partners',
      note: 'Tell us the finish on the drawing. We do not plate in-house.',
    },
    { label: 'Minimum order', value: moq, note: site.terms.moqNote },
    { label: 'Quotation', value: site.terms.quote },
    { label: 'Delivery', value: site.terms.delivery },
  ];
}

const sharedFaqs = {
  moq: {
    q: 'What is the minimum order quantity?',
    a: `Usually ${moq}. ${site.terms.moqNote}`,
  },
  quote: {
    q: 'How fast do you quote?',
    a: 'Send a drawing, a dimensioned photo or the old spring. We quote within 24 hours.',
  },
  sample: {
    q: 'Can you copy a spring from a sample?',
    a: 'Yes. Send the unused spring if you have one, and tell us where it fits and what it has to do. A used spring may have taken a set, so the free length can be short of the original.',
  },
  wire: {
    q: 'What wire sizes do you work with?',
    a: `Round wire ${wire}. Outer diameter and free length follow your drawing. We do not make heavy springs above 2.50 mm wire, rolling-shutter springs or agriculture springs.`,
  },
};

export const torsion: ProductPage = {
  route: 'torsion',
  title: 'Torsion Springs in Pune',
  description:
    'Torsion springs, wire Ø 0.40–2.50 mm, made to your drawing or sample in Talawade, Pune. Left- or right-hand wind. Quote within 24 hours.',
  h1: 'Torsion springs',
  lede: 'Legs rotate around the coil axis to store and return torque. Our highest-volume spring. Made to your drawing or sample in Talawade, Pune.',
  context: 'torsion springs',
  rfqQuery: '?type=torsion',
  diagram: 'torsion',
  photoCaption: 'Torsion springs on the coiling machine, showing leg form and body coils',
  specs: baseSpecs('Legs and wind', 'To your drawing · left-hand or right-hand wind'),
  drawingNotes: [
    'Wire diameter',
    'Inside diameter (must clear the shaft or mandrel)',
    'Number of body coils',
    'Leg lengths and the bend on each leg',
    'Free angle between the legs',
    'Wind direction (left-hand or right-hand)',
    'Torque at the working angle, if you have it',
    'Material and any finish',
    'Quantity',
  ],
  processNote:
    'We coil and form the body and legs, then stress-relieve the batch in our furnace. Finishing, if you need it, goes out to partners. Dispatch is ex-works Talawade.',
  faqs: [
    sharedFaqs.moq,
    sharedFaqs.quote,
    sharedFaqs.sample,
    sharedFaqs.wire,
    {
      q: 'Which way should a torsion spring be loaded?',
      a: 'Load it so the coils wind tighter. The inside diameter shrinks and the body grows a little along the axis. Loading it the other way opens the coils and shortens fatigue life. Mark the wind direction on the drawing.',
    },
    {
      q: 'Do you make left-hand and right-hand springs?',
      a: 'Yes. Send the wind direction, or send a sample. If the spring sits on a shaft that is already in the assembly, the wind is usually fixed by that layout.',
    },
    {
      q: 'What if I only have the old spring?',
      a: 'Send it. We measure wire, inside diameter, coils, leg length and free angle, then quote. Say where it is used so we can spot a set or a worn hook.',
    },
  ],
  related: [
    {
      to: 'doubleTorsion',
      label: 'Double torsion springs',
      description: 'Two opposite-wound coils and a centre loop.',
    },
    { to: 'extension', label: 'Tension / extension springs', description: 'Pull, not torque.' },
    {
      to: 'wireForms',
      label: 'Wire forms',
      description: 'Clips, hooks and pins from the same wire range.',
    },
    {
      to: 'whatIsDoubleTorsion',
      label: 'What is a double torsion spring?',
      description: 'When two bodies are the better choice.',
    },
    {
      to: 'typesCompared',
      label: 'Torsion vs extension vs compression',
      description: 'Which spring the assembly actually needs.',
    },
  ],
  howWeMake: [
    {
      to: 'coilingForming',
      label: 'Spring coiling and forming',
      description: 'Helices and legs in 0.40–2.50 mm wire.',
    },
    {
      to: 'heatTreatment',
      label: 'Stress relieving and grinding',
      description: 'The furnace after the coil.',
    },
  ],
  usedIn: [
    {
      to: 'switchgear',
      label: 'Electrical and switchgear',
      description: 'MCB and switch levers.',
    },
    { to: 'automotive', label: 'Automotive', description: 'Detents, returns and locks.' },
  ],
};

export const doubleTorsion: ProductPage = {
  route: 'doubleTorsion',
  title: 'Double Torsion Springs',
  description:
    'Double torsion springs with a centre loop, wire Ø 0.40–2.50 mm, made to drawing or sample in Talawade, Pune. Quote within 24 hours.',
  h1: 'Double torsion springs',
  lede: 'Two opposite-wound coils joined by a centre loop, from one length of wire. Balanced torque on both sides. A speciality of our unit.',
  context: 'double torsion springs',
  rfqQuery: '?type=double-torsion',
  diagram: 'doubleTorsion',
  photoCaption: 'Double torsion spring showing the left-hand coil, right-hand coil and centre loop',
  specs: baseSpecs(
    'Centre loop and legs',
    'U-shaped centre loop and legs to your drawing · LH and RH coils',
  ),
  drawingNotes: [
    'Wire diameter',
    'Inside diameter of each coil body',
    'Number of coils on each side',
    'Centre-loop width and shape',
    'Leg length and bend on each side',
    'Free angle',
    'Torque at the working angle, if you have it',
    'Material and any finish',
    'Quantity',
  ],
  processNote:
    'Both coil bodies and the centre loop are formed from one wire, then the batch is stress-relieved. Finishing goes through partners. Dispatch is ex-works Talawade.',
  faqs: [
    sharedFaqs.moq,
    sharedFaqs.quote,
    sharedFaqs.sample,
    {
      q: 'How is a double torsion spring different from two single ones?',
      a: 'It is one part: a left-hand coil and a right-hand coil joined by a centre loop. The two bodies work in parallel, so the rate is about twice that of one body with the same wire, diameter and coils, and the load on the hinge is balanced.',
    },
    {
      q: 'What do I need to specify on the centre loop?',
      a: 'Width, inside radius and whether the loop sits flat or is offset. The loop is what locates the spring on the hinge pin or bracket. A sketch is enough if you do not have a full drawing.',
    },
    sharedFaqs.wire,
    {
      q: 'Do you make these for switchgear?',
      a: 'Yes. Switchgear and MCB mechanisms are a regular job for our unit, in this wire range.',
    },
  ],
  related: [
    { to: 'torsion', label: 'Torsion springs', description: 'Single body, one pair of legs.' },
    { to: 'compression', label: 'Compression springs', description: 'Push, not torque.' },
    {
      to: 'whatIsDoubleTorsion',
      label: 'What is a double torsion spring?',
      description: 'Parts, rate and when to use one.',
    },
    {
      to: 'switchgear',
      label: 'Electrical and switchgear springs',
      description: 'MCB and switch mechanisms.',
    },
  ],
  howWeMake: [
    {
      to: 'coilingForming',
      label: 'Spring coiling and forming',
      description: 'Both bodies and the centre loop from one wire.',
    },
    {
      to: 'prototype',
      label: 'Prototype development',
      description: 'Sample first, then the bulk lot.',
    },
  ],
  usedIn: [
    {
      to: 'switchgear',
      label: 'Electrical and switchgear',
      description: 'Balanced torque on a hinge.',
    },
    { to: 'furniture', label: 'Furniture', description: 'Lids and fold mechanisms.' },
  ],
};

export const extension: ProductPage = {
  route: 'extension',
  title: 'Extension Springs in Pune',
  description:
    'Tension and extension springs, wire Ø 0.40–2.50 mm, hooks to your drawing. Made in Talawade, Pune. Quote within 24 hours.',
  h1: 'Tension / extension springs',
  lede: 'Close-wound springs that resist a pull. Usually made with initial tension, so the coils stay shut until a minimum load is applied.',
  context: 'extension springs',
  rfqQuery: '?type=extension',
  diagram: 'extension',
  photoCaption: 'Extension springs with machine-loop ends, close-wound body',
  specs: baseSpecs('Ends', 'Hooks or loops to your drawing'),
  drawingNotes: [
    'Wire diameter',
    'Outer diameter',
    'Length inside hooks (or overall length and hook style)',
    'Hook or loop type and the angle between the two ends (0° or 90°)',
    'Initial tension, if you know it',
    'Load at one or two extended lengths',
    'Maximum extension',
    'Material and any finish',
    'Quantity',
  ],
  processNote:
    'The body is close-wound and the hooks are formed to the drawing. The batch is stress-relieved. We do not grind extension springs. Finishing goes through partners. Dispatch is ex-works Talawade.',
  faqs: [
    sharedFaqs.moq,
    sharedFaqs.quote,
    sharedFaqs.sample,
    {
      q: 'Why do extension springs break at the hook?',
      a: 'The hook is a tight bend on the same wire as the body. Stress is highest at the inner radius. Most failures start there, not in the close-wound body. A generous hook radius and the right hook type last longer than a sharp crossover loop.',
    },
    {
      q: 'What hook types can you form?',
      a: 'Machine loops and extended hooks are the usual request. Other eyes and offsets we will confirm from your drawing.',
    },
    {
      q: 'What is initial tension?',
      a: 'A built-in preload that holds the coils together. The spring does not start to open until the pull exceeds that preload. Specify it if the hook must not rattle or if you have a minimum load before travel starts.',
    },
    sharedFaqs.wire,
  ],
  related: [
    { to: 'torsion', label: 'Torsion springs', description: 'Rotate, rather than pull.' },
    { to: 'compression', label: 'Compression springs', description: 'Push, rather than pull.' },
    {
      to: 'extensionEnds',
      label: 'Extension spring end types',
      description: 'Loops, hooks and why the hook fails first.',
    },
    {
      to: 'extensionCalc',
      label: 'Extension spring calculator',
      description: 'Rate and stress from your dimensions.',
    },
  ],
  howWeMake: [
    {
      to: 'coilingForming',
      label: 'Spring coiling and forming',
      description: 'Close-wound body and hooks to the drawing.',
    },
    {
      to: 'reverseEngineering',
      label: 'Reverse engineering',
      description: 'From a sample when there is no drawing.',
    },
  ],
  usedIn: [
    { to: 'furniture', label: 'Furniture', description: 'Returns on seating and folds.' },
    {
      to: 'switchgear',
      label: 'Electrical and switchgear',
      description: 'Trips and returns.',
    },
  ],
};

export const compression: ProductPage = {
  route: 'compression',
  title: 'Compression Springs, Pune',
  description:
    'Compression springs, wire Ø 0.40–2.50 mm, closed and ground ends on request. Made to drawing or sample in Talawade, Pune.',
  h1: 'Compression springs',
  lede: 'Open-coiled springs that push back when you compress them. Ends can be open, closed, or closed and ground so the spring stands flat.',
  context: 'compression springs',
  rfqQuery: '?type=compression',
  diagram: 'compression',
  photoCaption: 'Compression springs with closed and ground ends',
  specs: baseSpecs('Ends', 'Open, closed, or closed and ground — to your drawing'),
  drawingNotes: [
    'Wire diameter',
    'Outer diameter, or the hole it works in / the rod it works over',
    'Free length',
    'Total coils and active coils, if you know them',
    'End type (open, closed, closed and ground)',
    'Load at one or two working lengths',
    'Solid height, if it matters in the assembly',
    'Material and any finish',
    'Quantity',
  ],
  processNote:
    'We coil the body, close the ends if specified, grind the ends when the drawing asks for it, then stress-relieve the batch. Finishing goes through partners. Dispatch is ex-works Talawade.',
  faqs: [
    sharedFaqs.moq,
    sharedFaqs.quote,
    sharedFaqs.sample,
    {
      q: 'When should ends be closed and ground?',
      a: 'When the spring must stand square and share the load around the last coil. Closed-and-ground is the usual precision end. Grinding is often skipped on very fine wire; we will say so if your wire is at the bottom of our 0.40 mm limit.',
    },
    {
      q: 'What is spring index, and why do you mention it?',
      a: 'Mean coil diameter divided by wire diameter. Keep it roughly between 4 and 12. Below 4 the wire is hard to coil; above 12 the coil wanders and the rate varies. We will flag it on the quote if the drawing sits outside that band.',
    },
    {
      q: 'Will a long, thin spring buckle?',
      a: 'If free length is about four times the mean diameter or more, the spring can buckle unless it is guided on a rod or in a bore. Tell us how it is guided.',
    },
    sharedFaqs.wire,
  ],
  related: [
    {
      to: 'conical',
      label: 'Conical springs',
      description: 'Tapered coils that nest for a low solid height.',
    },
    {
      to: 'extension',
      label: 'Tension / extension springs',
      description: 'Pull, rather than push.',
    },
    {
      to: 'compressionCalc',
      label: 'Compression spring calculator',
      description: 'Rate, stress and solid height.',
    },
    {
      to: 'measure',
      label: 'How to measure a spring',
      description: 'What to send us if you have no drawing.',
    },
  ],
  howWeMake: [
    {
      to: 'coilingForming',
      label: 'Spring coiling and forming',
      description: 'Open coils to the drawing.',
    },
    {
      to: 'heatTreatment',
      label: 'Stress relieving and grinding',
      description: 'Ground ends when the drawing asks.',
    },
  ],
  usedIn: [
    { to: 'automotive', label: 'Automotive', description: 'Buttons, clips and light valves.' },
    {
      to: 'instrumentation',
      label: 'Instrumentation',
      description: 'Light springs in tight pockets.',
    },
  ],
};

export const conical: ProductPage = {
  route: 'conical',
  title: 'Conical Springs in Pune',
  description:
    'Conical (tapered) compression springs, wire Ø 0.40–2.50 mm, made to your drawing or sample in Talawade, Pune. Quote within 24 hours.',
  h1: 'Conical springs',
  lede: 'Tapered compression springs. The coils nest into each other, so the solid height can be as low as a few wire diameters.',
  context: 'conical springs',
  rfqQuery: '?type=conical',
  diagram: 'conical',
  photoCaption: 'Conical compression spring, large end to small end',
  specs: baseSpecs('Shape', 'Tapered coils, large OD and small OD to your drawing'),
  drawingNotes: [
    'Wire diameter',
    'Large-end outer diameter',
    'Small-end outer diameter',
    'Free length',
    'Number of coils',
    'End treatment at each end',
    'Load at working height, if you have it',
    'Material and any finish',
    'Quantity',
  ],
  processNote:
    'The coil diameter is reduced along the body as we form it, then the batch is stress-relieved. Ends can be closed or ground if the drawing asks. Finishing goes through partners. Dispatch is ex-works Talawade.',
  faqs: [
    sharedFaqs.moq,
    sharedFaqs.quote,
    sharedFaqs.sample,
    {
      q: 'When is a conical spring better than a straight compression spring?',
      a: 'When you need a short solid height, or the large end must sit in a wide pocket and the small end on a pin. The coils can telescope. The rate is not constant: it usually rises as the larger coils seat.',
    },
    {
      q: 'Do you make barrel or hourglass springs as well?',
      a: 'Those are other tapered shapes. Send the drawing. If it is a simple cone in our wire range, that is a regular job. Unusual barrels we will confirm before quoting.',
    },
    sharedFaqs.wire,
  ],
  related: [
    { to: 'compression', label: 'Compression springs', description: 'Straight cylindrical coils.' },
    { to: 'spiral', label: 'Spiral springs', description: 'Wound in a flat spiral, not a cone.' },
    {
      to: 'compressionCalc',
      label: 'Compression spring calculator',
      description: 'A first-pass rate for cylindrical coils.',
    },
  ],
  howWeMake: [
    {
      to: 'heatTreatment',
      label: 'Stress relieving and grinding',
      description: 'Ends closed or ground if specified.',
    },
    {
      to: 'coilingForming',
      label: 'Spring coiling and forming',
      description: 'Tapered coils in our wire range.',
    },
  ],
  usedIn: [
    {
      to: 'instrumentation',
      label: 'Instrumentation',
      description: 'Buttons and contacts with a short solid height.',
    },
  ],
};

export const spiral: ProductPage = {
  route: 'spiral',
  title: 'Spiral Springs in Pune',
  description:
    'Spiral springs made to your drawing or sample in Talawade, Pune. Wire Ø 0.40–2.50 mm. Quote within 24 hours.',
  h1: 'Spiral springs',
  lede: 'Spiral springs made to your drawing or sample. We need you to confirm whether the parts you want are wire spirals or flat-strip power springs before this page can be the last word.',
  context: 'spiral springs',
  rfqQuery: '?type=spiral',
  diagram: 'spiral',
  photoCaption: 'Spiral spring on the bench, arbor and outer hook visible',
  specs: baseSpecs('Form', 'To your drawing or sample'),
  drawingNotes: [
    'A drawing or the old spring',
    'Wire or strip size',
    'Outer diameter and arbor size',
    'Number of turns',
    'Inner and outer end forms',
    'Material',
    'Quantity',
  ],
  processNote:
    'Formed to the drawing or copied from a sample, then stress-relieved. Finishing through partners. Dispatch ex-works Talawade.',
  faqs: [
    sharedFaqs.moq,
    sharedFaqs.quote,
    sharedFaqs.sample,
    {
      q: 'Do you make clock-type flat-strip power springs?',
      a: 'That is exactly what we need confirmed. Send a photo of the part. If it is in our wire range we can usually help; a wide flat strip may be outside what our unit does.',
    },
    sharedFaqs.wire,
  ],
  related: [
    {
      to: 'conical',
      label: 'Conical springs',
      description: 'A taper in elevation, not a flat spiral.',
    },
    {
      to: 'torsion',
      label: 'Torsion springs',
      description: 'Helical body, torque through the legs.',
    },
    { to: 'wireForms', label: 'Wire forms', description: 'Bent-wire parts that are not a spiral.' },
  ],
  howWeMake: [
    {
      to: 'coilingForming',
      label: 'Spring coiling and forming',
      description: 'Formed to the drawing or the sample.',
    },
  ],
  usedIn: [
    { to: 'automotive', label: 'Automotive', description: 'Light assemblies in our wire range.' },
  ],
};

export const productByRoute = {
  torsion,
  doubleTorsion,
  extension,
  compression,
  conical,
  spiral,
} as const;
