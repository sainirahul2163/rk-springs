/**
 * Geometry for the SVG technical drawings.
 *
 * Coils are a true helix projected with a slight tilt, so each turn reads as an ellipse.
 * The near half of every turn is returned in `front`, the far half in `back` (drawn faded).
 * Sampled points are joined with Catmull-Rom cubic Béziers, so 16 samples per turn draw a
 * smooth curve at a fraction of the markup of a dense polyline.
 */

export interface Pt {
  x: number;
  y: number;
}

type Fn = (u: number) => number;

export interface HelixOptions {
  /** Screen x where the coil axis starts. */
  x0: number;
  /** Screen y of the coil axis. */
  yc: number;
  /** Number of turns (fractional allowed). */
  turns: number;
  /** Axial advance per turn, constant or a function of turn position u ∈ [0, turns]. */
  pitch: number | Fn;
  /** Coil radius, constant or a function of u. */
  radius: number | Fn;
  /** Ellipse minor/major ratio: how far we look "into" the coil. */
  tilt?: number;
  /** Start angle in turns (0 = top of the coil). Keep a multiple of 1/samplesPerTurn. */
  phase?: number;
  /** Axial direction: 1 = left to right, -1 = right to left. */
  dir?: 1 | -1;
  /** Must be even so the front/back split lands on a sample. */
  samplesPerTurn?: number;
}

export interface HelixResult {
  front: string;
  back: string;
  start: Pt;
  end: Pt;
  /** Axial extent actually covered. */
  length: number;
}

const r1 = (n: number) => Math.round(n * 10) / 10;
const asFn = (v: number | Fn): Fn => (typeof v === 'function' ? v : () => v);

/** Shortest decimal form: 0.5 → ".5", -0.5 → "-.5", -0 → "0". */
const num = (n: number) => {
  const v = r1(n);
  if (v === 0) return '0';
  return String(v).replace(/^(-?)0\./, '$1.');
};

/** Join numbers with the fewest separators a path parser still reads unambiguously. */
const join = (ns: number[]) =>
  ns.reduce((acc, n, i) => {
    const s = num(n);
    if (i === 0) return s;
    const needsSep = !s.startsWith('-') && !(s.startsWith('.') && /\.\d*$/.test(acc));
    return acc + (needsSep ? ' ' : '') + s;
  }, '');

/** Smooth path through pts[a..b], using neighbours outside the range for continuous tangents. */
function smooth(pts: readonly Pt[], a: number, b: number): string {
  const at = (i: number) => pts[Math.min(pts.length - 1, Math.max(0, i))]!;
  const R = (p: Pt) => ({ x: r1(p.x), y: r1(p.y) });
  let cur = R(at(a));
  let d = `M${join([cur.x, cur.y])}c`;
  const parts: number[] = [];
  for (let i = a; i < b; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = R({ x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 });
    const c2 = R({ x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 });
    const e = R(p2);
    parts.push(c1.x - cur.x, c1.y - cur.y, c2.x - cur.x, c2.y - cur.y, e.x - cur.x, e.y - cur.y);
    cur = e;
  }
  d += join(parts);
  return d;
}

export function helix(o: HelixOptions): HelixResult {
  const pitch = asFn(o.pitch);
  const radius = asFn(o.radius);
  const tilt = o.tilt ?? 0.3;
  const phase = o.phase ?? 0;
  const dir = o.dir ?? 1;
  const n = Math.max(2, Math.ceil(o.turns * (o.samplesPerTurn ?? 16)));
  const du = o.turns / n;
  const eps = 1e-9;

  const pts: (Pt & { front: boolean })[] = [];
  let axial = 0;
  for (let i = 0; i <= n; i++) {
    const u = i * du;
    if (i > 0) axial += pitch(u - du / 2) * du;
    const th = 2 * Math.PI * (u + phase);
    const R = radius(u);
    pts.push({
      x: o.x0 + dir * (axial + tilt * R * Math.sin(th)),
      y: o.yc - R * Math.cos(th),
      front: Math.sin(th) > -eps,
    });
  }

  const front: string[] = [];
  const back: string[] = [];
  let start = 0;
  let isFront = pts[0]!.front;
  for (let i = 1; i < pts.length; i++) {
    if (pts[i]!.front !== isFront) {
      // The split sample sits at the top or bottom of the coil and belongs to both halves.
      const end = isFront ? i - 1 : i;
      if (end > start) (isFront ? front : back).push(smooth(pts, start, end));
      start = end;
      isFront = pts[i]!.front;
    }
  }
  if (pts.length - 1 > start) (isFront ? front : back).push(smooth(pts, start, pts.length - 1));

  return {
    front: front.join(''),
    back: back.join(''),
    start: { x: pts[0]!.x, y: pts[0]!.y },
    end: { x: pts[pts.length - 1]!.x, y: pts[pts.length - 1]!.y },
    length: axial,
  };
}

/** Archimedean spiral (end view), r = r0 + (r1 − r0)·t over `turns`. */
export function spiral(cx: number, cy: number, rStart: number, rEnd: number, turns: number) {
  const n = Math.ceil(turns * 16);
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const th = 2 * Math.PI * turns * t - Math.PI / 2;
    const r = rStart + (rEnd - rStart) * t;
    pts.push({ x: cx + r * Math.cos(th), y: cy + r * Math.sin(th) });
  }
  return {
    d: smooth(pts, 0, pts.length - 1),
    start: pts[0]!,
    end: pts[pts.length - 1]!,
  };
}

export const fmt = r1;
