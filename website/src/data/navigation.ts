import type { RouteId } from './routes';
import { site } from './site';

export type DiagramKey =
  'torsion' | 'doubleTorsion' | 'extension' | 'compression' | 'conical' | 'spiral' | 'wireForm';

export interface ProductNavItem {
  route: RouteId;
  name: string;
  diagram: DiagramKey;
  blurb: string;
  chips: string[];
}

/** Products in the client's volume order (CLIENT-PROFILE.md §2). */
export const products: ProductNavItem[] = [
  {
    route: 'torsion',
    name: 'Torsion springs',
    diagram: 'torsion',
    blurb: 'Legs rotate around the coil axis to store and return torque.',
    chips: [site.capability.wireRangeLabel, 'LH / RH wind'],
  },
  {
    route: 'doubleTorsion',
    name: 'Double torsion springs',
    diagram: 'doubleTorsion',
    blurb: 'Two opposite-wound coils joined by a centre loop for balanced torque.',
    chips: [site.capability.wireRangeLabel, 'Centre loop'],
  },
  {
    route: 'extension',
    name: 'Tension / extension springs',
    diagram: 'extension',
    blurb: 'Close-wound springs that resist pulling, with a hook or loop at each end.',
    chips: [site.capability.wireRangeLabel, 'Hook ends'],
  },
  {
    route: 'compression',
    name: 'Compression springs',
    diagram: 'compression',
    blurb: 'Open-coiled springs that push back when compressed.',
    chips: [site.capability.wireRangeLabel, 'Ground ends'],
  },
  {
    route: 'conical',
    name: 'Conical springs',
    diagram: 'conical',
    blurb: 'Tapered coils that nest into each other for a low solid height.',
    chips: [site.capability.wireRangeLabel, 'Tapered'],
  },
  {
    route: 'spiral',
    name: 'Spiral springs',
    diagram: 'spiral',
    // TODO(client): rewrite once we know whether "spiral" means wire or flat-strip spiral springs.
    blurb: 'Spiral springs made to your drawing or sample.',
    chips: ['To drawing'],
  },
];

export const wireFormsItem: ProductNavItem = {
  route: 'wireForms',
  name: 'Wire forms',
  diagram: 'wireForm',
  blurb: 'Clips, hooks and pins bent from wire to your drawing.',
  chips: ['Clips', 'Hooks', 'Pins'],
};

export interface NavItem {
  route: RouteId;
  label: string;
  mega?: boolean;
}

export const headerNav: NavItem[] = [
  { route: 'springs', label: 'Springs', mega: true },
  { route: 'industries', label: 'Industries' },
  { route: 'capabilities', label: 'Capabilities' },
  { route: 'tools', label: 'Tools' },
  { route: 'resources', label: 'Resources' },
  { route: 'about', label: 'About' },
  { route: 'contact', label: 'Contact' },
];

export const footerNav: { heading: string; items: { route: RouteId; label: string }[] }[] = [
  {
    heading: 'Products',
    items: [
      ...products.map((p) => ({ route: p.route, label: p.name })),
      { route: 'wireForms', label: 'Wire forms' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { route: 'about', label: 'About us' },
      { route: 'capabilities', label: 'Capabilities' },
      { route: 'industries', label: 'Industries' },
      { route: 'quality', label: 'Quality' },
      { route: 'ordering', label: 'Ordering with us' },
      { route: 'rfq', label: 'Request a quote' },
      { route: 'talawade', label: 'Talawade and PCMC' },
      { route: 'contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Engineering',
    items: [
      { route: 'tools', label: 'Spring calculators' },
      { route: 'measure', label: 'How to measure a spring' },
      { route: 'glossary', label: 'Spring glossary' },
      { route: 'hsnGst', label: 'HSN code and GST' },
      { route: 'resources', label: 'All resources' },
    ],
  },
];

export const legalNav: { route: RouteId; label: string }[] = [
  { route: 'privacy', label: 'Privacy policy' },
  { route: 'terms', label: 'Terms of use' },
];
