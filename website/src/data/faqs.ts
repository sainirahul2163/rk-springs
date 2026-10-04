import type { FaqItem } from '@/components/ui/FAQ.astro';
import { site } from './site';

export const homeFaqs: readonly FaqItem[] = [
  {
    q: 'What springs do you make?',
    a: `Torsion, double torsion, tension / extension, compression, conical and spiral springs, and wire forms (clips, hooks and pins). Wire ${site.capability.wireRangeLabel}. We do not make rolling-shutter, agriculture or heavy springs above 2.50 mm wire.`,
  },
  {
    q: 'Where are you based?',
    a: `Sr. No. 166, Sai Krupa Society, Sahyog Nagar, ${site.address.locality}, ${site.address.city} ${site.address.postalCode}. That is in the Pimpri-Chinchwad industrial belt, near Chikhali, Bhosari MIDC and Chakan.`,
  },
  {
    q: 'What is the minimum order?',
    a: `Usually ${site.terms.moq}. ${site.terms.moqNote}`,
  },
  {
    q: 'Can you make a spring from a sample?',
    a: 'Yes. Send the unused spring if you still have one, and tell us where it is used. We measure it and quote within 24 hours.',
  },
  {
    q: 'Do you export?',
    a: 'No. We supply across India, ex-works Talawade. Transport is not included.',
  },
  {
    q: 'Are you ISO or IATF certified?',
    a: 'No. The unit is ZED certified. We do not hold ISO 9001 or IATF 16949.',
  },
  {
    q: 'When are you open?',
    a: site.hours.summary,
  },
  {
    q: 'How do I get a quote?',
    a: 'Send the drawing or a photo on the quote form, WhatsApp or email. We reply within 24 hours.',
  },
];

export const toolsFaqs: readonly FaqItem[] = [
  {
    q: 'Are these calculators a substitute for a drawing?',
    a: 'No. They are a first-pass check of rate and stress. Send the drawing or the sample and we will confirm the design before production.',
  },
  {
    q: 'Which units do the tools use?',
    a: 'Millimetres, newtons and N/mm. The rate converter also shows kgf/mm and lbf/in, which still appear on some drawings.',
  },
  {
    q: 'Can I get the spring made from these numbers?',
    a: 'Yes. Use “Get this spring made” to pre-fill the quote form. Usual MOQ is 5,000–10,000 pcs. We reply within 24 hours.',
  },
];

export const compressionCalcFaqs: readonly FaqItem[] = [
  {
    q: 'How do you calculate compression spring rate?',
    a: 'k = G · d⁴ / (8 · D³ · Na), with D = OD − d. G is a typical published shear modulus, not a value we measure on this shop floor.',
  },
  {
    q: 'What spring index should I aim for?',
    a: 'Keep C = D/d between about 4 and 12. Below 4 the wire is hard to coil; above 12 the coil wanders and the rate is harder to hold.',
  },
  {
    q: 'Why does the tool warn about solid height?',
    a: 'If a working length is at or below solid height, the coils bind and the load shoots up. Change free length, coils or the working position.',
  },
];

export const extensionCalcFaqs: readonly FaqItem[] = [
  {
    q: 'Why are active coils more than body coils?',
    a: 'The hooks add a little flexibility. The usual allowance is Na = Nb + G/E, which for music wire is about 0.395 extra coils.',
  },
  {
    q: 'Why do you warn about hook stress?',
    a: 'The hook is bent tighter than the body, so it usually fails first. Treat the body stress as a lower bound, not the whole story.',
  },
  {
    q: 'What is initial tension?',
    a: 'A built-in preload that holds the coils together. The spring does not start to open until the pull exceeds that preload. Leave it blank if you do not know it.',
  },
];

export const rateConverterFaqs: readonly FaqItem[] = [
  {
    q: 'What is 1 N/mm in kgf/mm and lbf/in?',
    a: '1 N/mm is about 0.102 kgf/mm and about 5.71 lbf/in. The converter uses 1 kgf = 9.80665 N and 1 in = 25.4 mm.',
  },
  {
    q: 'Which unit do you quote in?',
    a: 'Metric: mm, N and N/mm. If your drawing is in kgf or inches, convert it here and send both.',
  },
];

export const rfqFaqs: readonly FaqItem[] = [
  {
    q: 'How fast is the quote?',
    a: 'Within 24 hours of a complete enquiry — drawing or sample, spring type and quantity.',
  },
  {
    q: 'What is the minimum order?',
    a: `Usually ${site.terms.moq}. ${site.terms.moqNote}`,
  },
  {
    q: 'Can I send a sample instead of a drawing?',
    a: 'Yes. Tick “I will send a sample” and tell us how it will arrive. We measure it and quote within 24 hours.',
  },
  {
    q: 'Are my drawings kept confidential?',
    a: 'Yes. We use them only to quote and to make your parts. We do not pass them to anyone else.',
  },
];
