/** Spring terms used on the site. Definitions are general engineering language, not lab claims. */

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}

export const glossaryTerms: readonly GlossaryTerm[] = [
  {
    id: 'active-coils',
    term: 'Active coils',
    definition:
      'The coils that actually flex under load. Closed or ground ends usually take two coils out of the total count. On an extension spring the hooks add a little extra, often written as Na = Nb + G/E.',
  },
  {
    id: 'body-coils',
    term: 'Body coils',
    definition:
      'Close-wound coils in the body of an extension spring, not counting the hooks. Written Nb.',
  },
  {
    id: 'buckling',
    term: 'Buckling',
    definition:
      'A long, slim compression spring leaning sideways under load. A free length of about four times the mean diameter or more usually needs a rod or a bore to guide it.',
  },
  {
    id: 'centre-loop',
    term: 'Centre loop',
    definition:
      'The wire that joins the two opposite-wound coils of a double torsion spring. It sits over the hinge pin and sets how far apart the coils are.',
  },
  {
    id: 'closed-ends',
    term: 'Closed ends',
    definition:
      'The last coil of a compression spring sits against the next one (squared). The spring sits flatter than an open end, but it is not ground.',
  },
  {
    id: 'closed-and-ground',
    term: 'Closed and ground',
    definition:
      'Closed ends that have been ground so the spring stands square and shares the load around the last coil. The usual precision end. Grinding is often skipped on very fine wire.',
  },
  {
    id: 'coil-bind',
    term: 'Coil bind',
    definition:
      'The coils of a compression spring touching. Load then rises sharply. A working length at or below solid height will bind.',
  },
  {
    id: 'compression-spring',
    term: 'Compression spring',
    definition:
      'An open-coiled helix that pushes back when you shorten it. Rate comes from wire, mean diameter, active coils and the material.',
  },
  {
    id: 'conical-spring',
    term: 'Conical spring',
    definition:
      'A compression spring whose coil diameter tapers. The coils can nest, so solid height is short. The rate is not constant.',
  },
  {
    id: 'crossover-hook',
    term: 'Crossover hook',
    definition:
      'An extension-spring hook whose opening sits across the coil, rather than in line with it. Used when the pull must stay on the spring axis.',
  },
  {
    id: 'deflection',
    term: 'Deflection',
    definition:
      'How far the spring moves under load. For a compression spring it is free length minus the working length. For an extension spring it is the opening of the body, x.',
  },
  {
    id: 'development-charges',
    term: 'Development charges',
    definition:
      'Setup or sample cost added when the order is below the usual 5,000–10,000 piece minimum. Charged so a small run still covers tooling and first-piece work.',
  },
  {
    id: 'double-torsion-spring',
    term: 'Double torsion spring',
    definition:
      'Two torsion coils, wound opposite ways, joined by a centre loop. Both sides of a hinge can push together with balanced torque.',
  },
  {
    id: 'drawing',
    term: 'Drawing',
    definition:
      'The dimensioned picture we quote and coil from. Wire, OD or hole, free length, coils, ends or hooks, material, load and quantity are the usual minimum.',
  },
  {
    id: 'end-grinding',
    term: 'End grinding',
    definition:
      'Grinding the last coil of a compression spring so it sits flat. We do this in-house when the drawing asks for it.',
  },
  {
    id: 'ex-works',
    term: 'Ex-works',
    definition:
      'The buyer collects from the factory, or books their own transport. Our dispatch is ex-works Talawade. Transport is not in the spring price.',
  },
  {
    id: 'extended-hook',
    term: 'Extended hook',
    definition:
      'An extension-spring hook that stands out from the body on a short straight. Useful when the attachment point is a little away from the coil.',
  },
  {
    id: 'extension-spring',
    term: 'Extension spring',
    definition:
      'A close-wound helix that resists being pulled. Also called a tension spring. Hooks or loops take the load. The hook usually fails before the body.',
  },
  {
    id: 'free-angle',
    term: 'Free angle',
    definition:
      'The angle between the legs of a torsion spring when it is unloaded. Needed on the drawing with the working angle and the torque you want there.',
  },
  {
    id: 'free-length',
    term: 'Free length',
    definition:
      'The length of a compression spring with no load on it, L0. For an extension spring people usually quote length inside the hooks.',
  },
  {
    id: 'gst',
    term: 'GST',
    definition:
      'Goods and Services Tax. Helical springs of iron or steel are commonly invoiced at 18% under HSN 7320. Confirm the code for your part with your CA.',
  },
  {
    id: 'hard-drawn',
    term: 'Hard-drawn spring steel',
    definition:
      'Cold-drawn carbon spring wire, typical of IS 4454-1 / EN 10270-1. The everyday material for dry, general industrial springs in our unit.',
  },
  {
    id: 'hook-stress',
    term: 'Hook stress',
    definition:
      'Bending stress in an extension-spring hook. The bend is tighter than the body, so the hook usually fails first. Body stress is only a lower bound.',
  },
  {
    id: 'hsn',
    term: 'HSN',
    definition:
      'Harmonised System of Nomenclature — the code on an Indian GST invoice. Springs of iron or steel sit under 7320; helical springs under 7320 20. Wire forms may sit under 7326.',
  },
  {
    id: 'id',
    term: 'Inner diameter (ID)',
    definition:
      'The hole through the coil. Mean diameter is ID plus wire diameter. Give the rod the spring works over if that is what matters.',
  },
  {
    id: 'initial-tension',
    term: 'Initial tension',
    definition:
      'A built-in preload that holds extension-spring coils together. The spring does not start to open until the pull exceeds that preload. Written Fi.',
  },
  {
    id: 'kgf',
    term: 'kgf',
    definition:
      'Kilogram-force. 1 kgf = 9.80665 N. Older Indian drawings still use kgf and kgf/mm. We quote in newtons and N/mm.',
  },
  {
    id: 'left-hand-wind',
    term: 'Left-hand wind',
    definition:
      'The coil rises to the left when you look along the axis. Must match the way the spring is loaded, or a torsion spring will unwind the wrong way.',
  },
  {
    id: 'leg-length',
    term: 'Leg length',
    definition:
      'The straight (or formed) end of a torsion spring, measured from the coil body to the tip, or to a bend if you specify it that way. Both legs, if they differ.',
  },
  {
    id: 'length-inside-hooks',
    term: 'Length inside hooks',
    definition:
      'The free length of an extension spring measured between the insides of the hooks. The usual overall length on a drawing.',
  },
  {
    id: 'load',
    term: 'Load',
    definition:
      'The force the spring must give at a stated length or angle, in N (or N·mm for torque). One or two working points are enough to quote.',
  },
  {
    id: 'machine-hook',
    term: 'Machine hook',
    definition:
      'A simple loop formed on the last coil of an extension spring. The usual, cheapest hook. Also called a machine loop.',
  },
  {
    id: 'mandrel',
    term: 'Mandrel',
    definition:
      'The pin or arbor the wire is coiled around. Mandrel diameter, plus spring-back, sets the inside diameter.',
  },
  {
    id: 'mean-diameter',
    term: 'Mean diameter',
    definition:
      'The diameter to the centre of the wire. D = OD − d, or ID + d. Used in rate and stress formulae.',
  },
  {
    id: 'moq',
    term: 'MOQ',
    definition:
      'Minimum order quantity. Ours is usually 5,000–10,000 pieces. Smaller runs are possible with development or setup charges.',
  },
  {
    id: 'music-wire',
    term: 'Music wire',
    definition:
      'High-tensile carbon spring wire, typical of ASTM A228 / IS 4454-1 grade DH. We buy it on request for small, precise springs.',
  },
  {
    id: 'n-per-mm',
    term: 'N/mm',
    definition:
      'Newtons per millimetre — the metric unit of spring rate. 1 N/mm is about 0.102 kgf/mm or 5.71 lbf/in.',
  },
  {
    id: 'od',
    term: 'Outer diameter (OD)',
    definition:
      'The outside of the coil. Give the hole the spring works in if that is tighter than a free OD, because the coil grows a little under load.',
  },
  {
    id: 'oil-tempered',
    term: 'Oil-tempered wire',
    definition:
      'Heat-treated carbon spring wire, typical of IS 4454-2 / EN 10270-2. On request, toward the upper end of our 0.40–2.50 mm range.',
  },
  {
    id: 'open-ends',
    term: 'Open ends',
    definition:
      'A compression-spring end that is not closed. Cheap, and the spring leans. Open and ground is a flatter seat without closing the last coil.',
  },
  {
    id: 'passivation',
    term: 'Passivation',
    definition:
      'A chemical clean that restores the oxide film on stainless steel after forming. A finishing step, done through partners if the drawing asks for it.',
  },
  {
    id: 'pitch',
    term: 'Pitch',
    definition:
      'The distance from one coil to the next, centre to centre, on an open-coiled spring. Pitch plus wire sets free length once you know the coil count.',
  },
  {
    id: 'rate',
    term: 'Rate (spring rate)',
    definition:
      'Force per unit deflection, k. For a round-wire helical spring, k = G · d⁴ / (8 · D³ · Na), in N/mm. Also called stiffness.',
  },
  {
    id: 'reverse-engineering',
    term: 'Reverse engineering',
    definition:
      'Making a spring from a sample when there is no drawing. Send an unused spring if you still have one. We measure it and quote within 24 hours.',
  },
  {
    id: 'right-hand-wind',
    term: 'Right-hand wind',
    definition:
      'The coil rises to the right when you look along the axis. The usual default if the drawing does not say otherwise — still say it on the drawing.',
  },
  {
    id: 'sample',
    term: 'Sample',
    definition:
      'The old spring, or a development piece we make for you to try in the assembly. Production of the bulk quantity waits on that check.',
  },
  {
    id: 'set',
    term: 'Set',
    definition:
      'Permanent take-up: the spring does not return all the way to its free length or free angle after a heavy load. Usually a sign the stress was too high.',
  },
  {
    id: 'shear-modulus',
    term: 'Shear modulus (G)',
    definition:
      'The material stiffness used in the helical-spring rate formula, in MPa. Typical published value for music wire is about 81,700 MPa.',
  },
  {
    id: 'side-hook',
    term: 'Side hook',
    definition:
      'An extension-spring hook whose opening sits to the side of the coil. Used when the attachment is offset from the spring axis.',
  },
  {
    id: 'solid-height',
    term: 'Solid height',
    definition:
      'The length of a compression spring when every coil is touching, Ls. Ground ends: roughly Nt · d. Unground: (Nt + 1) · d.',
  },
  {
    id: 'spiral-spring',
    term: 'Spiral spring',
    definition:
      'A spring wound in a flat spiral rather than a helix. The word is used for both wire spirals and flat-strip power springs — we need you to say which.',
  },
  {
    id: 'spring-index',
    term: 'Spring index',
    definition:
      'Mean diameter divided by wire diameter, C = D/d. Keep it roughly between 4 and 12. Below 4 the wire is hard to coil; above 12 the coil wanders.',
  },
  {
    id: 'spring-steel',
    term: 'Spring steel',
    definition:
      'Carbon steel drawn or tempered for springs. In our unit the everyday grade is hard-drawn wire. Music wire and oil-tempered are on request.',
  },
  {
    id: 'stainless-302-304',
    term: 'Stainless 302 / 304',
    definition:
      'Austenitic stainless spring wire, typical of ASTM A313 / IS 4454-4. Used where rust on carbon steel would be a problem.',
  },
  {
    id: 'stainless-316',
    term: 'Stainless 316',
    definition:
      'Stainless spring wire with molybdenum, for chlorides or chemical splash. Tell us if the spring will see salt or cleaning chemicals.',
  },
  {
    id: 'stress-relieving',
    term: 'Stress relieving',
    definition:
      'A furnace heat after coiling that takes residual stress out of the wire. We do this in-house. It is not a quench-and-temper of the steel.',
  },
  {
    id: 'torque',
    term: 'Torque',
    definition:
      'The twisting load a torsion spring must give at a stated angle, in N·mm. Give free angle, working angle and the torque at that angle.',
  },
  {
    id: 'torsion-spring',
    term: 'Torsion spring',
    definition:
      'A helix whose legs rotate around the coil axis to store and return torque. Wind direction and the shaft it sits on both matter.',
  },
  {
    id: 'total-coils',
    term: 'Total coils',
    definition:
      'Every coil you can count, including inactive end coils. Written Nt. Active coils are derived from this and the end type.',
  },
  {
    id: 'wahl-factor',
    term: 'Wahl factor',
    definition:
      'A correction that raises shear stress on the inside of the coil. Kw = (4C − 1)/(4C − 4) + 0.615/C. Used in first-pass stress estimates.',
  },
  {
    id: 'wind-direction',
    term: 'Wind direction',
    definition:
      'Whether the coil is left-hand or right-hand. Critical on torsion springs. Say it on the drawing; do not leave it for us to guess.',
  },
  {
    id: 'wire-diameter',
    term: 'Wire diameter',
    definition:
      'The thickness of the wire, d. Our standard range is 0.40–2.50 mm. Rate changes with the fourth power of d, so measure it carefully.',
  },
  {
    id: 'wire-form',
    term: 'Wire form',
    definition:
      'A bent-wire part that is not a helix: a clip, a hook, a pin. Same wire range as the springs. Classify the HSN with care — it may not be 7320.',
  },
  {
    id: 'working-length',
    term: 'Working length',
    definition:
      'The length at which a compression or extension spring must give a stated load (L1, L2). Stay above solid height on a compression spring.',
  },
  {
    id: 'youngs-modulus',
    term: "Young's modulus (E)",
    definition:
      'Tensile stiffness of the material, in MPa. Used with G to credit extension-spring hooks: Na = Nb + G/E. Typical published value.',
  },
  {
    id: 'zed',
    term: 'ZED',
    definition:
      'Zero Defect Zero Effect — an MSME quality certification. This unit is ZED certified. We do not hold ISO 9001 or IATF 16949.',
  },
];

export function glossaryByLetter(): { letter: string; terms: GlossaryTerm[] }[] {
  const groups = new Map<string, GlossaryTerm[]>();
  for (const term of glossaryTerms) {
    const letter = term.term[0]!.toUpperCase();
    const list = groups.get(letter) ?? [];
    list.push(term);
    groups.set(letter, list);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, terms]) => ({ letter, terms }));
}
